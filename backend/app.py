from flask import Flask, request, jsonify
from flask_cors import CORS
import pytesseract
from pdf2image import convert_from_path
import tempfile
from transformers import T5Tokenizer, T5ForConditionalGeneration
import openai
import json
from sentence_transformers import SentenceTransformer, util
import torch
from datetime import datetime
import os
from dotenv import load_dotenv
from pptx import Presentation

load_dotenv()


# Set OpenAI API key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

# Initialize Flask app
app = Flask(__name__)

# Allow CORS from frontend
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Load models
print("Loading tokenizer and T5 model...")
tokenizer = T5Tokenizer.from_pretrained("doc2query/msmarco-t5-base-v1")
t5_model = T5ForConditionalGeneration.from_pretrained("doc2query/msmarco-t5-base-v1")
print("Models loaded successfully!")

# Initialize sentence similarity model
similarity_model = SentenceTransformer("all-MiniLM-L6-v2", device="cuda" if torch.cuda.is_available() else "cpu")

def log(message):
    """Utility function to log messages with a timestamp."""
    print(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} - {message}")

def build_question_schema(question, context):
    """Generate a schema for a question using GPT-4."""
    prompt = (
        f"Context: {context}\n"
        f"Question: {question}\n"
        "Generate the following JSON format:\n"
        "{\n"
        "  \"correct_answer\": \"[Correct Answer]\",\n"
        "  \"wrong_answers\": [\"Wrong Option 1\", \"Wrong Option 2\", \"Wrong Option 3\"],\n"
        "  \"hints\": [\"Hint 1\", \"Hint 2\"],\n"
        "  \"explanation\": \"[Provide a clear and concise explanation of the answer.]\"\n"
        "}"
    )
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an educational assistant that provides JSON-formatted answers."},
                {"role": "user", "content": prompt}
            ]
        )
        content = response["choices"][0]["message"]["content"]

        # Parse the JSON response from GPT-4
        try:
            schema = json.loads(content)
            return schema
        except json.JSONDecodeError:
            print(f"Error decoding JSON: {content}")
            return {"error": "Invalid JSON response from GPT-4."}
    except Exception as e:
        print(f"Error generating schema: {e}")
        return {"error": str(e)}

def generate_questions(context, num_questions=5, similarity_threshold=0.8):
    """
    Generates a specified number of unique, high-confidence questions based on input context,
    ensuring semantic deduplication.
    """
    input_text = (
        f"Generate specific, high-confidence questions grounded in the following context: {context}. "
        "Ensure the questions are highly relevant, unambiguous, and cover key details."
    )

    num_beams = max(num_questions * 2, 10)  # Ensure sufficient beams for quality
    num_return_sequences = min(num_beams, 20)  # Generate more sequences for better deduplication

    # Generate questions with T5 model
    inputs = tokenizer(
        input_text, return_tensors="pt", max_length=512, truncation=True
    ).to(t5_model.device)
    output_sequences = t5_model.generate(
        **inputs,
        max_length=50,
        num_return_sequences=num_return_sequences,
        num_beams=num_beams,
        output_scores=True,
        return_dict_in_generate=True,
        early_stopping=True
    )

    # Extract generated questions and their confidence scores
    questions_with_scores = [
        (tokenizer.decode(seq, skip_special_tokens=True), torch.exp(score).item() * 100)
        for seq, score in zip(output_sequences.sequences, output_sequences.sequences_scores)
    ]

    # Deduplicate questions using semantic similarity
    questions = [q for q, _ in questions_with_scores]
    confidences = [c for _, c in questions_with_scores]
    embeddings = similarity_model.encode(questions, convert_to_tensor=True)

    final_questions = []
    seen_questions = set()

    for idx, (question, confidence) in enumerate(zip(questions, confidences)):
        # Check similarity with previously selected questions
        if any(util.cos_sim(embeddings[idx], embeddings[j]).item() >= similarity_threshold for j in range(len(final_questions))):
            continue  # Skip duplicate questions
        final_questions.append(question)
        seen_questions.add(question)
        if len(final_questions) >= num_questions:
            break

    return final_questions

def extract_text_from_pptx(pptx_path):
    prs = Presentation(pptx_path)
    text_chunks = []
    for slide in prs.slides:
        for shape in slide.shapes:
            if hasattr(shape, "text") and shape.text.strip():
                text_chunks.append(shape.text.strip())
    return "\n".join(text_chunks)

@app.route("/", methods=["GET"])
def home():
    """Root route to confirm server is running."""
    return jsonify({"message": "Trivia Generator Backend is Running!"}), 200

@app.route("/process-pdf", methods=["POST"])
def process_pdf():
    """Endpoint to process PDF and generate questions."""
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']

    try:
        file_ext = os.path.splitext(file.filename)[1].lower()

        if file_ext == ".pdf":
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
                tmp_file.write(file.read())
                images = convert_from_path(tmp_file.name)
                context = "".join(pytesseract.image_to_string(img) for img in images)

        elif file_ext == ".pptx":
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pptx") as tmp_file:
                tmp_file.write(file.read())
                context = extract_text_from_pptx(tmp_file.name)

        else:
            return jsonify({"error": "Unsupported file format. Please upload a PDF or PPTX."}), 400

        if not context.strip():
            return jsonify({"error": "No text extracted from the uploaded file."}), 400

        extracted_response = {
            "status": "text_extracted",
            "message": "Text extracted successfully!",
            "context": context
        }
        return jsonify(extracted_response)

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route("/generate-questions", methods=["POST"])
def generate_questions_endpoint():
    """Endpoint to generate questions based on the extracted text."""
    data = request.json
    context = data.get('context', '')

    if not context:
        return jsonify({"error": "Context is required to generate questions."}), 400

    # Generate unique and high-confidence questions
    try:
        questions = generate_questions(context, num_questions=5)

        # Generate schemas for each unique question
        schemas = []
        for question in questions:
            schema = build_question_schema(question, context)
            schemas.append({"question": question, "schema": schema})

        return jsonify({
            "status": "questions_generated",
            "message": "Questions generated successfully!",
            "questions": schemas
        })

    except Exception as e:
        return jsonify({"error": f"An error occurred while generating questions: {str(e)}"}), 500

if __name__ == "__main__":
    # Run the Flask app
    app.run(debug=True)

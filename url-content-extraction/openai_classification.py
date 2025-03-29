import requests
from bs4 import BeautifulSoup
import base64
import os
from io import BytesIO
from PIL import Image
from openai import OpenAI
from openai.types.chat import ChatCompletionMessageParam

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# STEP 1: Extract images + visible text from URL
def extract_from_url(url):
    html = requests.get(url).text
    soup = BeautifulSoup(html, "html.parser")

    # Text extraction
    text = " ".join([t.get_text(strip=True) for t in soup.find_all(["h1", "h2", "p", "span", "div"])])
    text = text[:5000]  # Truncate for prompt

    # Image extraction
    images = []
    for img in soup.find_all("img"):
        src = img.get("src")
        if not src:
            continue
        if src.startswith("//"):
            src = "https:" + src
        elif src.startswith("/"):
            src = url.rstrip("/") + src
        elif not src.startswith("http"):
            continue  # Skip bad links
        images.append(src)

    return text, list(set(images))[:5]  # De-duplicate and limit to 5 for performance

# STEP 2: Convert image URLs to base64
def images_to_base64(image_urls):
    image_inputs = []
    for url in image_urls:
        try:
            if url.lower().endswith(".svg"):
                print(f"⚠️ Skipping unsupported image (SVG): {url}")
                continue

            res = requests.get(url, timeout=10)
            img = Image.open(BytesIO(res.content)).convert("RGB")
            buffered = BytesIO()
            img.save(buffered, format="PNG")
            img_b64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
            image_inputs.append({
                "type": "image_url",
                "image_url": {"url": f"data:image/png;base64,{img_b64}"}
            })
        except Exception as e:
            print(f"❌ Failed to process image {url}: {e}")
    return image_inputs


# STEP 3: GPT-4o - Analyze all together
def analyze_page(url):
    print(f"\n🔍 Scraping: {url}")
    text, images = extract_from_url(url)

    print(f"\n🖼 Scraped {len(images)} image URLs:")
    for i, img in enumerate(images, 1):
        print(f"{i}. {img}")

    image_inputs = images_to_base64(images)

    if not image_inputs:
        print("❌ No images processed.")
        return

    messages: list[ChatCompletionMessageParam] = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": f"""You are analyzing the webpage at {url}. You’ll be shown up to 5 images and some page text.

For each image:
- Classify it as one of: [Banner, Profile Picture, Logo, Other]
- Provide a short 1-line reasoning for your choice.

Then:
- Summarize any important text (welcome message, mission statement, key heading).
"""
                }
            ] + image_inputs
        }
    ]

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        temperature=0.2,
        max_tokens=1000
    )

    result = response.choices[0].message.content

    print("\n🧠 GPT-4o Response:\n")
    print(result)

    # ✅ Optional: Save output to file
    os.makedirs("output", exist_ok=True)
    with open("output/gpt_summary.txt", "w", encoding="utf-8") as f:
        f.write(result)

    # ✅ Optional: Save original images
    os.makedirs("images/raw", exist_ok=True)
    for img_url in images:
        try:
            res = requests.get(img_url, timeout=10)
            fname = os.path.basename(img_url.split("?")[0])
            with open(f"images/raw/{fname}", "wb") as f:
                f.write(res.content)
        except Exception as e:
            print(f"⚠️ Couldn't save image {img_url}: {e}")

# ✅ Run for University of Miami
if __name__ == "__main__":
    analyze_page("https://www.law.miami.edu/academics/centers-institutes/hope/")

import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Typography,
  Container,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Snackbar,
  Skeleton,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon, Menu as MenuIcon } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { motion } from "framer-motion";
import Logo from "../assets/images/LV (2).png"; // Correct path for logo

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00bcd4",
    },
    secondary: {
      main: "#ff4081",
    },
    background: {
      default: "#121212",
      paper: "rgba(255, 255, 255, 0.08)",
    },
  },
  typography: {
    fontFamily: "Poppins, Arial, sans-serif",
    h6: {
      fontWeight: 700,
    },
  },
});

function TriviaPage() {
  const [file, setFile] = useState(null);
  const [context, setContext] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please upload a file!");
      return;
    }

    setLoading(true);
    setStatusMessage("Extracting text from PDF...");
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:5000/process-pdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === "text_extracted") {
        setStatusMessage("Text extracted successfully!");
        setContext(response.data.context);

        setStatusMessage("Generating questions...");
        const questionResponse = await axios.post(
          "http://127.0.0.1:5000/generate-questions",
          { context: response.data.context }
        );

        if (questionResponse.data.status === "questions_generated") {
          setStatusMessage("Questions generated successfully!");
          setQuestions(questionResponse.data.questions);
        } else {
          setStatusMessage("Failed to generate questions.");
        }
      }
    } catch (error) {
      console.error("Error processing PDF:", error);
      setStatusMessage("");
      setError("Failed to process PDF!");
    } finally {
      setLoading(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ padding: "20px", borderRadius: 2 }}>
        {/* Navbar */}
        <AppBar position="static" sx={{ marginBottom: "20px", backgroundColor: "#181818", padding: "20px 0" }}>
  <Toolbar sx={{ flexDirection: "column", alignItems: "center" }}>
    {/* Logo */}
    <>
  {/* Keyframes for Animation */}
  <style>
    {`
      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
        100% {
          transform: scale(1);
        }
      }
    `}
  </style>

  <img
    src={Logo}
    alt="Logo"
    style={{
      width: "60px",
      marginBottom: "10px",
      animation: "pulse 2s infinite ease-in-out",
    }}
  />
</>


    {/* Title */}
    <Typography
  variant="h4"
  component={motion.div}
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5 }}
  sx={{
    fontWeight: "bold",
    fontSize: "2.5rem",
    background: "linear-gradient(90deg, #1E90FF, #00BFFF, #87CEFA)", // Updated colors
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
    textShadow: "0px 0px 10px rgba(30, 144, 255, 0.6), 0px 0px 10px rgba(0, 191, 255, 0.6)", // Matches website theme
    border: "2px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "10px",
    padding: "10px 20px",
  }}
>
  Lidvizion's Trivia Generator
</Typography>





  </Toolbar>
</AppBar>




        {/* File Upload Section */}
        <Paper elevation={4} sx={{ padding: "30px", marginBottom: "30px", borderRadius: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            component={motion.div}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Upload a PDF to Generate Trivia Questions
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <CloudUploadIcon sx={{ marginRight: "10px" }} />
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                style={{ border: "none", outline: "none", flexGrow: 1 }}
              />
            </Box>
            <Box mt={2}>
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ padding: "12px" }}>
                {loading ? "Processing..." : "Submit"}
              </Button>
            </Box>
          </form>
        </Paper>

        {/* Show Status Messages */}
        {statusMessage && (
          <Typography variant="h6" sx={{ textAlign: "center", marginTop: "10px", color: "#00bcd4" }}>
            {statusMessage}
          </Typography>
        )}

        {/* Show Loading Spinner */}
        {loading && (
          <Box sx={{ textAlign: "center", marginTop: "20px" }}>
            <CircularProgress sx={{ color: "#ffffff" }} />
          </Box>
        )}

        {/* Extracted Context */}
        {context && (
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Extracted Context:
            </Typography>
            <Paper
              elevation={2}
              sx={{
                padding: "20px",
                height: "300px",
                overflowY: "scroll",
                backgroundColor: "#333",
                borderRadius: "10px",
              }}
            >
              <Typography variant="body1">{context}</Typography>
            </Paper>
          </Box>
        )}

        {/* Generated Questions */}
        {questions.length > 0 && (
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Generated Questions:
            </Typography>
            <Grid container spacing={3}>
              {questions.map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card
                    sx={{
                      padding: "15px",
                      borderRadius: 3,
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={{ color: "#00bcd4", fontWeight: "bold" }}>
                        <strong>Question {index + 1}:</strong> {item.question}
                      </Typography>
                      <Typography variant="body2">
                        <strong style={{ color: "green" }}>Correct Answer:</strong> {item.schema.correct_answer}
                      </Typography>
                      <Typography variant="body2">
                        <strong style={{ color: "#3f51b5" }}>Explanation:</strong> {item.schema.explanation}
                      </Typography>
                      <Typography variant="body2">
                        <strong style={{ color: "#ffeb3b" }}>Hints:</strong>
                        <List>
                          {item.schema.hints.map((hint, i) => (
                            <ListItem key={i}>
                              <ListItemText primary={`${i + 1}. ${hint}`} />
                            </ListItem>
                          ))}
                        </List>
                      </Typography>
                      <Typography variant="body2">
                        <strong style={{ color: "#f44336" }}>Wrong Answers:</strong>
                        <List>
                          {item.schema.wrong_answers.map((wrong, i) => (
                            <ListItem key={i}>
                              <ListItemText primary={`${i + 1}. ${wrong}`} />
                            </ListItem>
                          ))}
                        </List>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Snackbar for Status Updates */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          message={statusMessage || error}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        />
      </Container>
    </ThemeProvider>
  );
}

export default TriviaPage;

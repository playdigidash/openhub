import React, { useState, useEffect } from "react";
import "./App.css"; // Import the updated CSS
import RefineButton from "./components/RefineButton";
import Preview from "./components/Preview";
import DownloadLinks from "./components/DownloadLinks";

// const API_KEY = process.env.NX_MESHY_KEY; // Your API key
const  API_KEY ="msy_4lXyv25J6qlMVwgTqEj3krSjgziHIwBsgMwu"; // Replace with your API key

function MeshyApp(onModelSelected) {
  const [prompt, setPrompt] = useState("");
  const [previewTaskId, setPreviewTaskId] = useState(null);
  const [modelDataArray, setModelDataArray] = useState([]); // Array to store model URLs and preview URLs
  const [resultMessage, setResultMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefineVisible, setIsRefineVisible] = useState(false);
  const [countdown, setCountdown] = useState(90); // Timer starting from 90 seconds
  const [isTakingLong, setIsTakingLong] = useState(false);

  // Start the countdown when loading begins
  useEffect(() => {
    let timer;
    if (isLoading && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1); // Decrease countdown by 1 every second
      }, 1000);
    } else if (countdown === 0) {
      setIsTakingLong(true); // Mark as taking longer if countdown reaches 0
    }

    return () => clearInterval(timer); // Clear the timer when the component unmounts or loading ends
  }, [isLoading, countdown]);

  const generate3DModel = () => {
    if (!prompt) {
      alert("Please enter a description for the 3D model.");
      return;
    }

    setResultMessage("Generating 3D model...");
    setIsLoading(true);
    setCountdown(90); // Reset countdown to 90 seconds
    setIsTakingLong(false);

    const url = "https://api.meshy.ai/v2/text-to-3d";

    fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "preview",
        prompt: prompt,
        art_style: "realistic",
        negative_prompt: "low quality, low resolution, low poly, ugly",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setPreviewTaskId(data.result);

        const checkStatus = setInterval(() => {
          fetch(`${url}/${data.result}`, {
            headers: {
              Authorization: `Bearer ${API_KEY}`,
            },
          })
            .then((res) => res.json())
            .then((taskData) => {
              if (taskData.status === "SUCCEEDED") {
                clearInterval(checkStatus);
                // Add the model URLs and thumbnail URL to the array
                setModelDataArray((prev) => [
                  ...prev,
                  {
                    modelUrls: taskData.model_urls,
                    thumbnailUrl: taskData.thumbnail_url,
                  },
                ]);
                setResultMessage("3D model generated successfully!");
                setIsRefineVisible(true);
                setIsLoading(false); // Stop loading once the task is complete
                setIsTakingLong(false); // Reset "Taking longer" state
              } else if (taskData.status === "FAILED") {
                clearInterval(checkStatus);
                setResultMessage("Failed to generate 3D model.");
                setIsLoading(false); // Stop loading if task fails
              }
            });
        }, 5000);
      })
      .catch((error) => {
        console.error("Error:", error);
        setResultMessage("Error generating 3D model. Please try again.");
        setIsLoading(false);
      });
  };

  const refine3DModel = () => {
    setResultMessage("Refining 3D model...");
    setIsLoading(true);
    setCountdown(90); // Reset countdown to 90 seconds for refining
    setIsTakingLong(false);

    const url = "https://api.meshy.ai/v2/text-to-3d";

    if (!API_KEY) {
      console.error("API_KEY is not set");
      return;
    }

    fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "refine",
        preview_task_id: previewTaskId,
        texture_richness: "high",
      }),
    })
      .then((response) => response.json())
      .then((refineData) => {
        const refineTaskId = refineData.result;

        const checkRefineStatus = setInterval(() => {
          fetch(`${url}/${refineTaskId}`, {
            headers: {
              Authorization: `Bearer ${API_KEY}`,
            },
          })
            .then((res) => res.json())
            .then((refineTaskData) => {
              if (refineTaskData.status === "SUCCEEDED") {
                clearInterval(checkRefineStatus);
                // Add the refined model URLs and thumbnail URL to the array
                setModelDataArray((prev) => [
                  ...prev,
                  {
                    modelUrls: refineTaskData.model_urls,
                    thumbnailUrl: refineTaskData.thumbnail_url,
                  },
                ]);
                setResultMessage("Refined model successfully generated!");
                setIsLoading(false);
                setIsTakingLong(false); // Reset "Taking longer" state
              } else if (refineTaskData.status === "FAILED") {
                clearInterval(checkRefineStatus);
                setResultMessage("Failed to refine 3D model.");
                setIsLoading(false);
              }
            });
        }, 5000);
      })
      .catch((error) => {
        console.error("Error refining 3D model:", error);
        setResultMessage("Error refining 3D model. Please try again.");
        setIsLoading(false);
      });
  };
  const handlePreviewClick = (modelUrls) => {
    if (modelUrls && modelUrls.glb) {
      onModelSelected(modelUrls.glb);
    }
  };

  return (
    <div className="container">
      <h1>Generate 3D Model from Text</h1>

      <input
        type="text"
        value={prompt}
        placeholder="Enter description for 3D model..."
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={generate3DModel} disabled={isLoading}>
        {isLoading ? `Loading... (${countdown} seconds)` : "Generate 3D Model"}
      </button>

      {isRefineVisible && (
        <RefineButton
          onClick={refine3DModel}
          isLoading={isLoading}
          countdown={countdown}
        />
      )}

      <div className="result">
        <p>{isTakingLong ? "Taking longer than expected..." : resultMessage}</p>

        {/* Loop through modelDataArray and display both the preview and download links */}
        {modelDataArray.length > 0 &&
          modelDataArray.map((modelData, index) => (
            <div key={index}>
              <Preview thumbnailUrl={modelData.thumbnailUrl}
              onClick={() => handlePreviewClick(modelData.modelUrls)}/>
              <DownloadLinks modelUrls={modelData.modelUrls} />
            </div>
          ))}
      </div>
    </div>
  );
}

export default MeshyApp;

import React, { useState, useEffect } from "react";
import Preview from "../components/Preview";
import RefineButton from "../components/RefineButton";
import DownloadLinks from "../components/DownloadLinks";

const API_KEY = process.env.REACT_APP_MESHY_KEY;

function MeshyPage() {
  const [prompt, setPrompt] = useState("");
  const [previewTaskId, setPreviewTaskId] = useState(null);
  const [modelDataArray, setModelDataArray] = useState([]);
  const [resultMessage, setResultMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefineVisible, setIsRefineVisible] = useState(false);
  const [countdown, setCountdown] = useState(90);
  const [isTakingLong, setIsTakingLong] = useState(false);

  useEffect(() => {
    let timer;
    if (isLoading && countdown > 0) {
      timer = setInterval(() => setCountdown((p) => p - 1), 1000);
    } else if (countdown === 0) {
      setIsTakingLong(true);
    }
    return () => clearInterval(timer);
  }, [isLoading, countdown]);

  const generate3DModel = () => {
    if (!prompt) {
      alert("Please enter a description for the 3D model.");
      return;
    }

    setResultMessage("Generating 3D model...");
    setIsLoading(true);
    setCountdown(90);
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
        prompt,
        art_style: "realistic",
        negative_prompt: "low quality, low resolution, low poly, ugly",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPreviewTaskId(data.result);
        const check = setInterval(() => {
          fetch(`${url}/${data.result}`, {
            headers: { Authorization: `Bearer ${API_KEY}` },
          })
            .then((r) => r.json())
            .then((task) => {
              if (task.status === "SUCCEEDED") {
                clearInterval(check);
                setModelDataArray((prev) => [
                  ...prev,
                  {
                    modelUrls: task.model_urls,
                    thumbnailUrl: task.thumbnail_url,
                  },
                ]);
                setResultMessage("3D model generated successfully!");
                setIsRefineVisible(true);
                setIsLoading(false);
                setIsTakingLong(false);
              } else if (task.status === "FAILED") {
                clearInterval(check);
                setResultMessage("Failed to generate 3D model.");
                setIsLoading(false);
              }
            });
        }, 5000);
      })
      .catch((err) => {
        console.error("Error:", err);
        setResultMessage("Error generating 3D model. Please try again.");
        setIsLoading(false);
      });
  };

  const refine3DModel = () => {
    setResultMessage("Refining 3D model...");
    setIsLoading(true);
    setCountdown(90);
    setIsTakingLong(false);

    const url = "https://api.meshy.ai/v2/text-to-3d";
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
      .then((res) => res.json())
      .then((refineData) => {
        const refineTaskId = refineData.result;
        const checkRefine = setInterval(() => {
          fetch(`${url}/${refineTaskId}`, {
            headers: { Authorization: `Bearer ${API_KEY}` },
          })
            .then((r) => r.json())
            .then((task) => {
              if (task.status === "SUCCEEDED") {
                clearInterval(checkRefine);
                setModelDataArray((prev) => [
                  ...prev,
                  {
                    modelUrls: task.model_urls,
                    thumbnailUrl: task.thumbnail_url,
                  },
                ]);
                setResultMessage("Refined model successfully generated!");
                setIsLoading(false);
                setIsTakingLong(false);
              } else if (task.status === "FAILED") {
                clearInterval(checkRefine);
                setResultMessage("Failed to refine 3D model.");
                setIsLoading(false);
              }
            });
        }, 5000);
      })
      .catch((err) => {
        console.error("Error refining 3D model:", err);
        setResultMessage("Error refining 3D model. Please try again.");
        setIsLoading(false);
      });
  };

  return (
    <div className="container" style={{ maxWidth: 600, margin: "0 auto" }}>
      <h1>Generate 3D Model from Text</h1>
      <input
        type="text"
        value={prompt}
        placeholder="Enter description for 3D model..."
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "100%", padding: 10, margin: "10px 0" }}
      />
      <button onClick={generate3DModel} disabled={isLoading} style={{ padding: "10px 20px" }}>
        {isLoading ? `Loading... (${countdown} seconds)` : "Generate 3D Model"}
      </button>
      {isRefineVisible && (
        <RefineButton onClick={refine3DModel} isLoading={isLoading} countdown={countdown} />
      )}
      <div className="result" style={{ marginTop: 20 }}>
        <p>{isTakingLong ? "Taking longer than expected..." : resultMessage}</p>
        {modelDataArray.length > 0 &&
          modelDataArray.map((modelData, index) => (
            <div key={index}>
              <Preview thumbnailUrl={modelData.thumbnailUrl} />
              <DownloadLinks modelUrls={modelData.modelUrls} />
            </div>
          ))}
      </div>
    </div>
  );
}

export default MeshyPage;

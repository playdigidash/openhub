let previewTaskId; // To store the ID of the preview task
let modelUrls = {}; // To store the model download links

// Your API Key
const apiKey = process.env["NX_MESHY_KEY"];

document.getElementById("generateBtn").addEventListener("click", function () {
  const prompt = document.getElementById("prompt").value;

  if (!prompt) {
    alert("Please enter a description for the 3D model.");
    return;
  }

  // Display loading message
  document.getElementById("result").innerHTML = "Generating 3D model...";

  const url = "https://api.meshy.ai/v2/text-to-3d";

  fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mode: "preview", // Creating a preview task
      prompt: prompt,
      art_style: "realistic", // You can change the art style here
      negative_prompt: "low quality, low resolution, low poly, ugly",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      previewTaskId = data.result; // Store the preview task ID

      // Poll the API to check the progress of the task
      const checkStatus = setInterval(() => {
        fetch(`${url}/${previewTaskId}`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        })
          .then((res) => res.json())
          .then((taskData) => {
            if (taskData.status === "SUCCEEDED") {
              clearInterval(checkStatus);
              modelUrls = taskData.model_urls; // Save the model download links
              displayPreview(taskData.thumbnail_url); // Display the thumbnail
              document.getElementById("refineBtn").style.display = "block"; // Show refine button
              displayDownloadLinks(modelUrls); // Display download links
            } else if (taskData.status === "FAILED") {
              clearInterval(checkStatus);
              document.getElementById("result").innerHTML =
                "Failed to generate 3D model.";
            }
          });
      }, 5000); // Check every 5 seconds
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("result").innerHTML =
        "Error generating 3D model. Please try again.";
    });
});

document.getElementById("refineBtn").addEventListener("click", function () {
  const refineUrl = "https://api.meshy.ai/v2/text-to-3d";

  // Show loading for the refine task
  document.getElementById("result").innerHTML = "Refining 3D model...";

  // Create the refine task using the previewTaskId
  fetch(refineUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mode: "refine", // Set mode to "refine"
      preview_task_id: previewTaskId, // Use the preview task ID
      texture_richness: "high", // You can set this to high, medium, or low
    }),
  })
    .then((response) => response.json())
    .then((refineData) => {
      const refineTaskId = refineData.result;

      // Poll the API to check the progress of the refine task
      const checkRefineStatus = setInterval(() => {
        fetch(`${refineUrl}/${refineTaskId}`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        })
          .then((res) => res.json())
          .then((refineTaskData) => {
            if (refineTaskData.status === "SUCCEEDED") {
              clearInterval(checkRefineStatus);
              modelUrls = refineTaskData.model_urls; // Update with refined model links
              displayPreview(refineTaskData.thumbnail_url); // Update preview thumbnail
              displayDownloadLinks(modelUrls); // Update refined download links
              document.getElementById("result").innerHTML =
                "Refined model successfully generated!";
            } else if (refineTaskData.status === "FAILED") {
              clearInterval(checkRefineStatus);
              document.getElementById("result").innerHTML =
                "Failed to refine 3D model.";
            }
          });
      }, 5000); // Check every 5 seconds
    })
    .catch((error) => {
      console.error("Error refining 3D model:", error);
      document.getElementById("result").innerHTML =
        "Error refining 3D model. Please try again.";
    });
});

function displayPreview(thumbnailUrl) {
  // Show the thumbnail image
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `<img src="${thumbnailUrl}" alt="3D Model Preview">`;
}

function displayDownloadLinks(modelUrls) {
  const downloadDiv = document.getElementById("downloadLinks");
  downloadDiv.style.display = "block"; // Show the download section
  downloadDiv.innerHTML = `
        <h3>Download 3D Model Files:</h3>
        <p><a href="${modelUrls.glb}" target="_blank" download>Download GLB</a></p>
        <p><a href="${modelUrls.obj}" target="_blank" download>Download OBJ</a></p>
        <p><a href="${modelUrls.fbx}" target="_blank" download>Download FBX</a></p>
        <p><a href="${modelUrls.usdz}" target="_blank" download>Download USDZ</a></p>
    `;
}

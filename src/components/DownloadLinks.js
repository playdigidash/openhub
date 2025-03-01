import React from "react";

const DownloadLinks = ({ modelUrls }) => {
  return (
    <div className="download-links">
      <h3>Download 3D Model Files:</h3>
      {modelUrls.glb && (
        <p>
          <a
            href={modelUrls.glb}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            Download GLB
          </a>
        </p>
      )}
      {modelUrls.obj && (
        <p>
          <a
            href={modelUrls.obj}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            Download OBJ
          </a>
        </p>
      )}
      {modelUrls.fbx && (
        <p>
          <a
            href={modelUrls.fbx}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            Download FBX
          </a>
        </p>
      )}
      {modelUrls.usdz && (
        <p>
          <a
            href={modelUrls.usdz}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            Download USDZ
          </a>
        </p>
      )}
    </div>
  );
};

export default DownloadLinks;

import React from "react";

const Preview = ({ thumbnailUrl }) => {
  return (
    <div>
      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt="3D Model Preview"
          style={{ maxWidth: "300px", marginTop: "10px" }}
        />
      )}
    </div>
  );
};

export default Preview;

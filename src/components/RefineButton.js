import React from "react";

const RefineButton = ({ onClick, isLoading, countdown }) => {
  return (
    <button className="refine" onClick={onClick} disabled={isLoading}>
      {isLoading ? `Refining... (${countdown} seconds)` : "Refine 3D Model"}
    </button>
  );
};

export default RefineButton;

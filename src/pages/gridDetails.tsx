import React from "react";
import { Routes, Route, useParams } from "react-router-dom";

function GridDetails() {
  const { collectionId } = useParams();

  return (
    <div className="container m-auto my-4">
      <div>GridDetails {collectionId}</div>
    </div>
  );
}

export default GridDetails;

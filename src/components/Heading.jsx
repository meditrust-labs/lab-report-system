import React from "react";

export default function Heading({ children }) {
  return (
    <h4
      style={{ textTransform: "uppercase" }}
      className="text-center pt-4 pb-4"
    >
      {children}
    </h4>
  );
}

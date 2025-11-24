import React from "react";

const ScriptBlock = ({ content }) => (
  <pre className="bg-gray-900 p-2 rounded-xl overflow-x-auto text-yellow-400 font-mono whitespace-pre-wrap">
    {content}
  </pre>
);

export default ScriptBlock;

import React from "react";
import DOMPurify from "dompurify";

const GenericBlock = ({ content, isHTML }) => {
  if (isHTML) {
    return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} className="whitespace-pre-wrap" />;
  }
  return <div className="whitespace-pre-wrap">{content}</div>;
};

export default GenericBlock;

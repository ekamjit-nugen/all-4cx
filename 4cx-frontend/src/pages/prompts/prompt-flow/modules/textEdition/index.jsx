import React from "react";
import ReactQuill from "react-quill";
import { marked } from "marked";

import "react-quill/dist/quill.snow.css";

const TextEditor = ({ initialValue, onChange }) => {
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
    "video",
  ];

  const handleChange = (val) => {
    const markdown = marked(val); // Convert HTML to Markdown
    onChange(markdown); // Call the onChange prop with the markdown value
  };

  return (
    <ReactQuill
      value={initialValue}
      onChange={(val) => handleChange(val)}
      modules={modules}
      formats={formats}
      placeholder="Write something..."
      theme="snow"
      style={{ height: "300px", marginBottom: "50px" }}
    />
  );
};

export default TextEditor;

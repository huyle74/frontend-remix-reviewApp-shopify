import { useState } from "react";

export default function ReviewContent({ content }) {
  const checkLength = content.length > 150;
  const [show, setShow] = useState(checkLength);

  return (
    <div
      style={{
        wordWrap: "break-word",
        whiteSpace: "normal",
        width: "80%",
      }}
    >
      {show ? content.slice(0, 120) : content}
      {"  "}
      {checkLength && (
        <span style={{ color: "#015ad2" }} onClick={() => setShow(!show)}>
          {show ? "show more" : "show less"}
        </span>
      )}
    </div>
  );
}

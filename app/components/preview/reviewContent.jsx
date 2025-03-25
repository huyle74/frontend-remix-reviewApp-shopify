import { useState } from "react";
import { Box, Button } from "@shopify/polaris";

export default function ReviewContent({ content }) {
  const [expand, setExpand] = useState(false);

  const checkLength = content.length > 120;

  const handleExpand = () => {
    setExpand(!expand);
  };

  return (
    <div style={{ width: "80%" }}>
      <p
        style={{
          marginTop: "10px",
          wordWrap: "break-word",
          whiteSpace: "normal",
        }}
      >
        {checkLength && expand === false ? (
          <Box>
            {content.slice(0, 120)}...
            <Button variant="plain" onClick={handleExpand}>
            &nbsp;Read more
            </Button>
          </Box>
        ) : (
          <Box>
            {content}
            {checkLength && (
              <Button variant="plain" onClick={handleExpand}>
                &nbsp;Show less
              </Button>
            )}
          </Box>
        )}
      </p>
    </div>
  );
}

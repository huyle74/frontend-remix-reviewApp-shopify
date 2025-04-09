import { useState } from "react";
import { Link } from "@remix-run/react";
import { Box, Button } from "@shopify/polaris";

export default function ImportButton({ id, onClick, disabled }) {
  const [loading, setLoading] = useState(false);

  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "end",
        marginRight: "0.5rem",
        marginLeft: "auto",
      }}
      id={id}
    >
      <Link onClick={onClick} style={{ margin: "auto" }}>
        <Button
          url={`/app/import_review_product?productId=${id}`}
          loading={loading}
          disabled={disabled}
          onClick={() => setLoading(true)}
        >
          Import reviews
        </Button>
      </Link>
    </Box>
  );
}

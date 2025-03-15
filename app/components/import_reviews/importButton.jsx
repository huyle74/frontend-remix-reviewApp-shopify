import { useState } from "react";
import { Link } from "@remix-run/react";
import { Box, Button } from "@shopify/polaris";

export default function ImportButton({ id }) {
  const [loading, setLoading] = useState(false);

  const handleClickButton = () => {
    setLoading(true);
  };

  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "end",
      }}
      id={id}
    >
      <Link
        className="import-review-button"
        to={`/app/import_review_product?productId=${id}`}
      >
        <Button loading={loading} onClick={handleClickButton}>
          {loading ? "" : "Import Reviews"}
        </Button>
      </Link>
    </Box>
  );
}

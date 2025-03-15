import { Link } from "@remix-run/react";
import { Box, Button, Text, Thumbnail } from "@shopify/polaris";

export default function ImportSources({
  thumbnail,
  sourceName,
  width,
  marginLeft,
  onClick,
  loading,
}) {
  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        width: `${width}`,
        margin: `10px 0 10px ${marginLeft}`,
        padding: "15px",
        backgroundColor: "#f9f9f9",
        borderRadius: "15px",
      }}
    >
      <Thumbnail source={thumbnail} />
      <Box style={{ marginLeft: "20px" }}>
        <Text fontWeight="bold" variant="bodyLg">
          {sourceName}
        </Text>
      </Box>
      <Link
        style={{
          marginLeft: "auto",
          marginRight: "30px",
          border: "none",
        }}
        className="select-source-button"
      >
        <Button onClick={onClick} loading={loading}>
          {loading ? " " : "Select"}
        </Button>
      </Link>
    </Box>
  );
}

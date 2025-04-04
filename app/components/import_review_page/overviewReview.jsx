import { Box, Text } from "@shopify/polaris";

export default function OverviewReview({ title, number }) {
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "0 2rem 0 2rem",
      }}
    >
      <Box className="import-page-title-overview">
        <Text>{title}</Text>
      </Box>
      <Text variant="headingLg" tone="magic-subdued" fontWeight="bold">
        {number}
      </Text>
    </Box>
  );
}

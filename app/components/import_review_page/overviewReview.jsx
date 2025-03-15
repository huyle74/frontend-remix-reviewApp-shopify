import { Box, Text } from "@shopify/polaris";

export default function OverviewReview({ title, number }) {
  return (
    <Box
      style={{
        // marginLeft: "60px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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

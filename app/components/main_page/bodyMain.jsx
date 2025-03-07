import { Box, Card, Text } from "@shopify/polaris";

export default function BodyMain({ tranPercent, authPercent }) {
  return (
    <Box
      style={{ marginTop: "20px", paddingTop: "20px", paddingBottom: "20px" }}
    >
      <Card>
        <Box
          style={{
            borderBottom: "1px dashed gray",
            display: "flex",
            width: "fit-content",
          }}
        >
          <Text variant="headingMd">Trust Scores</Text>
        </Box>

        <Box style={{ marginTop: "10px" }}>
          <Box style={{ display: "flex", justifyContent: "space-between" }}>
            <Text>Transparency</Text>
            <Text>{tranPercent}%</Text>
          </Box>
          <Box style={{ display: "flex", justifyContent: "space-between" }}>
            <Text>Authenticity</Text>
            <Text>{authPercent}%</Text>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}

import { Box, Text, Button } from "@shopify/polaris";

export default function ImportHeader() {
  return (
    <Box style={{ display: "flex", marginBottom: "20px" }}>
      <Text variant="headingLg" as="h2">
        Import Reviews
      </Text>
      <Box style={{ marginLeft: "auto" }}>
        <Button variant="secondary">Import CSV file</Button>
      </Box>
    </Box>
  );
}

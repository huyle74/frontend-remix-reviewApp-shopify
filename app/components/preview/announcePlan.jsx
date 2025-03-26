import { Box, Text } from "@shopify/polaris";

export default function AnnouncePlan({ billing }) {
  const planName = billing == true ? "Premium" : "Free";
  return (
    <Box style={{ display: "flex" }}>
      You are on&nbsp;
      <Text tone="magic-subdued" fontWeight="bold">
        {planName}
      </Text>
      &nbsp;plan
    </Box>
  );
}

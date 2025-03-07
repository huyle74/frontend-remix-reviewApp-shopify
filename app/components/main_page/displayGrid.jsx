import { Grid, Card, Text, Box, Icon, Button } from "@shopify/polaris";
import { ChartHistogramGrowthIcon } from "@shopify/polaris-icons";

export default function GridCell({ title, number, percent }) {
  return (
    <Grid.Cell columnSpan={{ xs: 12, md: 4 }}>
      <Card style={{ padding: "16px" }}>
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            style={{
              borderBottom: "1.5px dashed  #D82C0D",
            }}
          >
            <Text variant="headingMd" as="h6">
              {title}
            </Text>
          </Box>

          <Button variant="tertiary">
            <Icon source={ChartHistogramGrowthIcon} />
          </Button>
        </Box>

        <Box
          style={{
            paddingTop: "20px",
            paddingBottom: "20px",
            display: "flex",
            width: "30%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text fontWeight="bold" variant="headingLg">
            {number}
          </Text>
          <Text tone="subdued" variant="bodyLg">
            {" "}
            - {percent}%
          </Text>
        </Box>
      </Card>
    </Grid.Cell>
  );
}

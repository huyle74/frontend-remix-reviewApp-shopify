import { Box, Card, Text } from "@shopify/polaris";
import ImportSources from "./importSources";
import { amazonIcon, aliExpressIcon, excelIcon } from "../../utils/icon";

export default function ImportWithSources({
  amazonClick,
  aliExpressClick,
  csvClick,
  amazonLoading,
  aliExpressLoading,
  csvLoading,
}) {
  return (
    <Box style={{ marginTop: "3%" }}>
      <Card>
        <Text variant="bodyLg" fontWeight="bold" tone="critical">
          Choose source import
        </Text>
        <Box>
          <Box style={{ display: "flex" }}>
            <ImportSources
              thumbnail={amazonIcon}
              sourceName={"Amazon"}
              width={"48%"}
              marginLeft={"0"}
              onClick={amazonClick}
              loading={amazonLoading}
            />
            <ImportSources
              thumbnail={aliExpressIcon}
              sourceName={"AliExpress"}
              width={"48%"}
              marginLeft={"auto"}
              onClick={aliExpressClick}
              loading={aliExpressLoading}
            />
          </Box>
          <ImportSources
            thumbnail={excelIcon}
            sourceName={"CSV file"}
            width={"48%"}
            marginLeft={"0"}
            onClick={csvClick}
            loading={csvLoading}
          />
        </Box>
      </Card>
    </Box>
  );
}

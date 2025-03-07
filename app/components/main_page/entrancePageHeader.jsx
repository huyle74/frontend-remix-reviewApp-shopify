import { Page, Text, Box, Button, Icon } from "@shopify/polaris";
import {
  SearchIcon,
  ChartVerticalFilledIcon,
  CalendarIcon,
} from "@shopify/polaris-icons";

export default function MainHeader() {
  return (
    <Page>
      <Box
        maxWidth="100%"
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Cat_August_2010-4.jpg/640px-Cat_Augsust_2010-4.jpg"
          alt="logo"
          style={{ objectFit: "cover", height: "60px", marginRight: "20px" }}
        />
        <Text fontWeight="bold" variant="heading2xl">
          Review App
        </Text>
        <Box style={{ marginLeft: "auto" }}>
          <Button size="large" icon={SearchIcon} style={{ padding: "10px" }}>
            Setting Search
          </Button>
        </Box>
      </Box>
      <Box style={{ marginTop: "30px", marginBottom: "30px", display: "flex" }}>
        <Text variant="headingLg">Your review insights</Text>

        <Box style={{ marginLeft: "auto", display: "flex" }}>
          <Box style={{ marginRight: "10px" }}>
            <Button icon={CalendarIcon}>Last 30 days</Button>
          </Box>
          <Button icon={ChartVerticalFilledIcon}>View reports</Button>
        </Box>
      </Box>
    </Page>
  );
}

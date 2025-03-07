import { useState, useCallback } from "react";
import { Box, Button, Tabs, Card, Text } from "@shopify/polaris";
import ReviewDashboard from "./reviewsDashboard";

export default function HeaderManageReviews({ reviewData }) {
  const [select, setSelect] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelect(selectedTabIndex),
    [],
  );

  const tabs = [
    {
      id: "reviewDashBoard",
      classNames: "reviewDashBoard",
      content: "Reviews Dashboard",
      panelID: "reviewDashBoard",
      body: <ReviewDashboard data={reviewData} />,
    },
    {
      id: "accepts-marketing-1",
      content: "Questions & Answers",
      panelID: "accepts-marketing-content-1",
      body: "Question",
    },
    {
      id: "repeat-customers-1",
      content: "Moderation",
      panelID: "repeat-customers-content-1",
      body: "Question",
    },
    {
      id: "prospects-1",
      content: "Products & Groups",
      panelID: "prospects-content-1",
      body: "Question",
    },
  ];

  return (
    <Box style={{ border: "1px black solid" }}>
      <Tabs tabs={tabs} selected={select} onSelect={handleTabChange}>
        <Box
          style={{
            margin: "20px",
          }}
        >
          <Text variant="headingLg">{tabs[select].content}</Text>
        </Box>
        <Box>{tabs[select].body}</Box>
      </Tabs>
    </Box>
  );
}

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "@remix-run/react";
import { Card, IndexTable, AppProvider, Page } from "@shopify/polaris";

export default function PreviewPage({ reviews }) {
  const location = useLocation();
  const navigate = useNavigate();

  console.log(location.state);

  return (
    <AppProvider>
      <Page
        backAction={{ content: "Products", url: "#" }}
        title="Preview"
        primaryAction={{ content: "Import All", disabled: false }}
        secondaryActions={[{ content: "Discard", url: "#" }]}
      >
        <p>Page content</p>
      </Page>
    </AppProvider>
  );
}

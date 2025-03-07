import { useState, useEffect } from "react";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
} from "@shopify/polaris";
import {
  InitShopifyApp,
  getHost,
  getSession,
} from "../init_Shopify_App/getSessionToken";
import ImportHeader from "../components/import_reviews/importHeader";
import ImportBody from "../components/import_reviews/importBody";

export const loader = async ({ request }) => {
  console.log("----------Import review page loaded---------");
  const host = getHost(request);
  const apiKey = process.env.SHOPIFY_API_KEY;

  return json({ host, apiKey });
};

export default function AdditionalPage() {
  const dataLoaded = useLoaderData();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const app = InitShopifyApp(dataLoaded.host, dataLoaded.apiKey);
        const accessToken = await getSession(app);

        const response = await fetch("http://localhost:8080/getShopInfo", {
          method: "GET",
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        });
        const products = await response.json();
        setData(products.finalProductInfo);
      } catch (error) {
        console.error("Load product from Backend get Bug >>>> ", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Page fullWidth>
      <ImportHeader />
      <ImportBody data={data} />
    </Page>
  );
}

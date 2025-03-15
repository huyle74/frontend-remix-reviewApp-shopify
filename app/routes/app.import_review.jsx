import { useState, useEffect } from "react";
import { Page } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import ImportHeader from "../components/import_reviews/importHeader";
import ImportBody from "../components/import_reviews/importBody";

export const loader = async ({ request }) => {
  console.log("------/app/importReview loaded");
  const session = await authenticate.admin(request);
  if (!session) {
    console.error("Session not found >>> ", session);
  }

  return null;
};

export default function AdditionalPage() {
  const app = useAppBridge();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const accessToken = await app.idToken();
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

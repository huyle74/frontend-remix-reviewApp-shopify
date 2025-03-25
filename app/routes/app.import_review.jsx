import { useState, useEffect } from "react";
import { Page } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import ImportHeader from "../components/import_reviews/importHeader";
import ImportBody from "../components/import_reviews/importBody";
import { url } from "../utils/config";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const accessToken = await app.idToken();
        const response = await fetch(`${url}/getShopInfo`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        });
        const products = await response.json();
        if (products) {
          setData(products);
          setLoading(false);
        }
      } catch (error) {
        console.error("Load product from Backend get Bug >>>> ", error);
      }
    })();
  }, []);

  const handlePagination = async (move, cursor) => {
    try {
      setLoading(true);
      const accessToken = await app.idToken();
      console.log(move);
      const response = await fetch(
        `${url}/paginationProducts?move=${move}&cursor=${cursor}`,
        {
          method: "POST",
          headers: { authorization: `Bearer ${accessToken}` },
        },
      );
      const { finalProductInfo, pageInfo, success } = await response.json();
      if (success) {
        setData({ finalProductInfo, pageInfo });
        setLoading(false);
      }
      console.log("Clicked");
    } catch (error) {
      console.error("pagination get error >>> ", error);
    }
  };

  const handleSortByName = async (order) => {
    try {
      setLoading(true);
      const accessToken = await app.idToken();
      console.log(order);
      const response = await fetch(`${url}/sortProductsByName?sort=${order}`, {
        method: "POST",
        headers: { authorization: `Bearer ${accessToken}` },
      });
      const { finalProductInfo, pageInfo, success } = await response.json();
      if (success) {
        setData({ finalProductInfo, pageInfo });
        setLoading(false);
      }
      console.log("Clicked Sorted");
    } catch (error) {
      console.error("Sort failed >> ", error);
    }
  };

  return (
    <Page fullWidth>
      <ImportHeader />
      <ImportBody
        data={data}
        handlePagination={handlePagination}
        loading={loading}
        handleSort={handleSortByName}
      />
    </Page>
  );
}

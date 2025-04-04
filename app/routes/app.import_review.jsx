import { useState, useEffect } from "react";
import { Page } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import ImportHeader from "../components/import_reviews/importHeader";
import ImportBody from "../components/import_reviews/importBody";
import { url } from "../utils/config";

export const loader = async ({ request }) => {
  console.log("------/app/importReview loaded");
  await authenticate.admin(request);

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
        const response = await fetch(`${url}/shopify/allProducts`, {
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
      const response = await fetch(
        `${url}/shopify/pagination?move=${move}&cursor=${cursor}`,
        {
          method: "POST",
          headers: { authorization: `Bearer ${accessToken}` },
        },
      );
      const { finalProductInfo, pageInfo, success } = await response.json();
      if (success) {
        setData({ finalProductInfo, pageInfo });
        setLoading(false);
        console.log("Clicked");
      }
    } catch (error) {
      console.error("pagination get error >>> ", error);
    }
  };

  const handleSortByName = async (order) => {
    try {
      setLoading(true);
      const accessToken = await app.idToken();
      console.log(order);
      const response = await fetch(`${url}/shopify/sort?sort=${order}`, {
        method: "POST",
        headers: { authorization: `Bearer ${accessToken}` },
      });
      const { finalProductInfo, pageInfo, success } = await response.json();
      console.log(success);
      if (success) {
        setData({ finalProductInfo, pageInfo });
        setLoading(false);
        console.log("Clicked Sorted");
      }
    } catch (error) {
      console.error("Sort failed >> ", error);
    }
  };

  const handleSearchByName = async (value) => {
    try {
      setLoading(true);
      const accessToken = await app.idToken();
      const response = await fetch(
        `${url}/shopify/searchTitle?searchTerm=${value}`,
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
    } catch (error) {
      console.error("CANNOT SEARCH PRODUCT >> ", error);
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
        searchLoading={loading}
        handleSearch={handleSearchByName}
      />
    </Page>
  );
}

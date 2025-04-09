import { useState, useEffect } from "react";
import { Page } from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import ImportBody from "../components/import_reviews/importBody";
import Skeleton from "../components/manage_reviews/skeleton";
import { url } from "../utils/config";
import ViewReviews from "../components/import_reviews/viewNewImported";

export const loader = async ({ request }) => {
  console.log("------/app/importReview loaded");
  const { billing, session } = await authenticate.admin(request);
  const shop_id = session.id.match(/offline_(.*?)\.myshopify\.com/)?.[1];
  const { hasActivePayment, appSubscriptions } = await billing.check();
  console.log(appSubscriptions);

  return {
    bill: hasActivePayment,
    shop_id,
    plan: appSubscriptions[0]?.name || null,
  };
};

export default function AdditionalPage() {
  const app = useAppBridge();
  const { bill, shop_id, plan } = useLoaderData();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewReviewsAfterImported, setViewReviewsAfterImported] =
    useState(null);
  const [updateRow, setUpdateRow] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const accessToken = await app.idToken();
        const response = await fetch(`${url}/shopify/allProducts`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        });
        const products = await response.json();
        if (products) {
          console.log(products.finalProductInfo);
          setData(products);
          setLoading(false);
        }
      } catch (error) {
        console.error("Load product from Backend get Bug >>>> ", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (viewReviewsAfterImported !== null) {
      setLoading(true);
      (async () => {
        try {
          const response = await fetch(
            `${url}/importReviewPage/updateDataAfterImported?shopify_product_id=${viewReviewsAfterImported.productId}`,
            {
              method: "post",
            },
          );
          const data = await response.json();
          if (data) {
            setUpdateRow(data);
          }
          console.log(data);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [viewReviewsAfterImported]);

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
  const subtitle = (
    <div>
      You are on{" "}
      {bill === false ? (
        <span style={{ fontWeight: 700 }}>free</span>
      ) : (
        <span
          style={{
            fontWeight: 800,
            color: `${plan === "basic" ? "#0071bb" : "#d35400"}`,
          }}
        >
          {plan}
        </span>
      )}{" "}
      plan
    </div>
  );

  return (
    <Page fullWidth title="Import reviews" subtitle={subtitle}>
      {!data ? (
        <Skeleton />
      ) : (
        <>
          <ImportBody
            updateRow={updateRow}
            shop_id={shop_id}
            bill={bill}
            data={data}
            handlePagination={handlePagination}
            loading={loading}
            handleSort={handleSortByName}
            searchLoading={loading}
            handleSearch={handleSearchByName}
            importedSuccess={(data) => {
              const { totalReviews, productId } = data;
              if (totalReviews !== undefined) {
                setViewReviewsAfterImported({ totalReviews, productId });
              }
            }}
          />
        </>
      )}
      {viewReviewsAfterImported !== null && (
        <ViewReviews
          onClick={() => setViewReviewsAfterImported(null)}
          totalReviews={viewReviewsAfterImported.totalReviews}
          productId={viewReviewsAfterImported.productId}
        />
      )}
    </Page>
  );
}

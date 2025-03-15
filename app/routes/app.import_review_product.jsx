import { useEffect, useState } from "react";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { useRouteError, useLoaderData } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { useSearchParams } from "@remix-run/react";
import { Page, Collapsible } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import ImportReviewBody from "../components/import_review_page/importReviewBody";
import ImportWithSources from "../components/import_review_page/importWithSources";
import AmazonSource from "../components/import_review_page/amazonSource";

export const loader = async ({ request }) => {
  console.log("/app/import_review_product >>>>>");
  const { admin, session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const id = url.searchParams.get("productId");
  const shop_id = session.id.replace(/^offline_/, "");

  const response = await admin.graphql(
    `query shopInfo {
      product(id: "gid://shopify/Product/${id}") {
        title
        media(first: 1) {
          edges {
            node {
              preview {
                image {
                  url
                }
              }
            }
          }
        }
      }
    }`,
  );
  const product = await response.json();

  return {
    apiKey: process.env.SHOPIFY_API_KEY,
    product: product.data.product,
    shop_id,
  };
};

export default function ImportView() {
  const { apiKey, product, shop_id } = useLoaderData();
  const [searchParams] = useSearchParams();
  const [productReview, setProductReview] = useState(null);
  const [isLoaded, setIsLoaded] = useState([false, false, false]);
  const [open, setOpen] = useState(true);
  const [source, setSource] = useState(null);

  const productId = searchParams.get("productId");

  useEffect(() => {
    const fetchProductReview = async () => {
      const response = await fetch(
        `http://localhost:8080/getProduct?productId=${productId}`,
        {
          method: "GET",
        },
      );
      const reviews = await response.json();
      setProductReview(reviews);
    };

    fetchProductReview();
  }, []);

  const handleClickSelect = (source) => {
    switch (source) {
      case "amazon":
        setIsLoaded([true, false, false]);
        setSource(<AmazonSource onClick={handleGoBack} shop_id={shop_id} />);
        break;
      case "aliExpress":
        setIsLoaded([false, true, false]);
        break;
      case "csv":
        setIsLoaded([false, false, true]);
        break;
      default:
        break;
    }
    setOpen(false);
  };

  const handleGoBack = () => {
    setSource(null);
    setOpen(true);
    setIsLoaded([false, false, false]);
  };

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <Page
        backAction={{
          content: "Import Reviews",
          url: "/app/import_review",
        }}
        title="Import Reviews"
        primaryAction={{ content: "Import All", disabled: false }}
      >
        <ImportReviewBody product={product} review={productReview} />
        <Collapsible open={open}>
          <ImportWithSources
            amazonLoading={isLoaded[0]}
            aliExpressLoading={isLoaded[1]}
            csvLoading={isLoaded[2]}
            amazonClick={() => handleClickSelect("amazon")}
            aliExpressClick={() => handleClickSelect("aliExpress")}
            csvClick={() => handleClickSelect("csv")}
          />
        </Collapsible>
        {source}
      </Page>
    </AppProvider>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}
export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};

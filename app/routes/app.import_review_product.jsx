import { useEffect, useState } from "react";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { useRouteError, useLoaderData } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { useSearchParams } from "@remix-run/react";
import { Page, Collapsible } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import ImportReviewBody from "../components/import_review_page/importReviewBody";
import ImportWithSources from "../components/import_review_page/importWithSources";
import SourcePlatform from "../components/import_review_page/platform.source";
import { checkUrlAmazon, checkUrlAliExpress } from "../utils/checkUrl";
import { amazonLogo, aliExpressLogo } from "../utils/icon";
import { url } from "../utils/config";

export const loader = async ({ request }) => {
  console.log("/app/import_review_product >>>>>");
  const { admin, session, billing } = await authenticate.admin(request);
  const url = new URL(request.url);
  const id = url.searchParams.get("productId");
  const shop_id = session.id.match(/offline_(.*?)\.myshopify\.com/)?.[1];
  const bill = await billing.check();
  const checkBilling = bill.hasActivePayment;

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
    billing: checkBilling,
  };
};

export default function GetReview() {
  const { apiKey, product, shop_id, billing } = useLoaderData();
  const [searchParams] = useSearchParams();
  const [productReview, setProductReview] = useState(null);
  const [isLoaded, setIsLoaded] = useState([false, false, false]);
  const [open, setOpen] = useState(true);
  const [source, setSource] = useState(null);

  const productId = searchParams.get("productId");

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `${url}/importReviewPage/getProductInfo?shopify_product_id=${productId}`,
        {
          method: "GET",
        },
      );
      const { productInfo } = await response.json();
      setProductReview(productInfo[0]);
    })();
  }, [productId]);

  const handleClickSelect = (source) => {
    switch (source) {
      case "amazon":
        setIsLoaded([true, false, false]);
        setSource(
          <SourcePlatform
            onClick={handleGoBack}
            shop_id={shop_id}
            sourceName={"Amazon"}
            logo={amazonLogo}
            checkValidUrl={checkUrlAmazon}
            api={"amazon/amazonCrawler"}
            billing={billing}
            productId={productId}
          />,
        );
        break;
      case "aliExpress":
        setIsLoaded([false, true, false]);
        setSource(
          <SourcePlatform
            onClick={handleGoBack}
            shop_id={shop_id}
            sourceName={"AliExpress"}
            logo={aliExpressLogo}
            backgroundColor={"#e62f05"}
            checkValidUrl={checkUrlAliExpress}
            api={"aliExpress/aliExpressCrawler"}
            billing={billing}
            productId={productId}
          />,
        );
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
          url: "/app",
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

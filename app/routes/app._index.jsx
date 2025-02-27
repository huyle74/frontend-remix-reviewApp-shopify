import { useEffect, useState } from "react";

import { useLoaderData } from "@remix-run/react";
import {
  getSession,
  InitShopifyApp,
  getHost,
} from "../init_Shopify_App/getSessionToken";
import { json } from "@remix-run/node";
import { Page } from "@shopify/polaris";

export const loader = async ({ request }) => {
  console.log("----------Server Side loaded------");
  const host = getHost(request);
  const apiKey = process.env.SHOPIFY_API_KEY;

  return json({ host, apiKey });
};

export default function Index() {
  const fetcher = useLoaderData();
  const [products, setProducts] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const app = InitShopifyApp(fetcher.host, fetcher.apiKey);
        const sessionToken = await getSession(app); 
        // console.log(sessionToken);

        const response = await fetch("http://localhost:8080/getShopInfo", {
          method: "GET",
          headers: {
            authorization: `Bearer ${sessionToken}`,
          },
        });
        const products = await response.json();
        console.log(products);
        setProducts(products);
        return products;
      } catch (error) {
        console.error("Frontend Bug here >>> ", error);
      }
    };

    fetchSession();
  }, [fetcher]);

  return (
    <Page>
      <h1>HELLO WORLD</h1>
    </Page>
  );
}

import { useEffect, useState } from "react";

import { useLoaderData } from "@remix-run/react";
import {
  getSession,
  InitShopifyApp,
  getHost,
} from "../init_Shopify_App/getSessionToken";
import { json } from "@remix-run/node";
import { Page, Grid } from "@shopify/polaris";
import MainHeader from "../components/main_page/entrancePageHeader";
import GridCell from "../components/main_page/displayGrid";
import BodyMain from "../components/main_page/bodyMain";

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
      <MainHeader />
      <Grid>
        <GridCell title={"Review requests sent"} number={0} percent={0} />
        <GridCell title={"Reviews over time"} number={0} percent={0} />
        <GridCell title={"Revenue generated"} number={0} percent={0} />
        <GridCell title={"Average rating"} number={0} percent={0} />
      </Grid>
      <BodyMain tranPercent={10} authPercent={90} />
    </Page>
  );
}

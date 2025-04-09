import { useEffect, useState } from "react";
import { Page, Grid } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import MainHeader from "../components/main_page/entrancePageHeader";
import GridCell from "../components/main_page/displayGrid";
import BodyMain from "../components/main_page/bodyMain";
import { url } from "../utils/config";

export const loader = async ({ request }) => {
  console.log("----------Home page------");
  const session = await authenticate.admin(request);
  if (!session) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return null;
};

export default function Index() {
  const shopify = useAppBridge();
  const [products, setProducts] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const accessToken = await shopify.idToken();
        const response = await fetch(`${url}`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        });
        const products = await response.json();
        // console.log(products);
        setProducts(products);
        return products;
      } catch (error) {
        console.error("Frontend Bug here >>> ", error);
      }
    };

    fetchSession();
  }, []);

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

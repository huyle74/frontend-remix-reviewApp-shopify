import { Page } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  console.log("<<<< Go to import page >>>>>");
  await authenticate.admin(request);

  return null;
};

export default function ImportView() {
  return <Page>Hello world!!</Page>;
}

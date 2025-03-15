import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  console.log("--Redirect to login page--");
  await authenticate.admin(request);

  return null;
};

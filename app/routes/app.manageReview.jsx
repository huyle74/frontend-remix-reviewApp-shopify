import { Page } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import HeaderManageReviews from "../components/manage_reviews/headerMangeReview";
import { data } from "../components/data_example/dataReviewDashboard";

export const loader = async ({ request }) => {
  console.log("----------Manage import page------");
  await authenticate.admin(request);

  return null;
};

export default function MangeReviews() {
  return (
    <Page fullWidth>
      <HeaderManageReviews reviewData={data} />
    </Page>
  );
}

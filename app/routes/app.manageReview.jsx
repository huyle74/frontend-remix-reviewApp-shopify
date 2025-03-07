import { Page } from "@shopify/polaris";
import HeaderManageReviews from "../components/manage_reviews/headerMangeReview";
import { data } from "../components/data_example/dataReviewDashboard";

export default function MangeReviews() {
  return (
    <Page fullWidth>
      <HeaderManageReviews reviewData={data} />
    </Page>
  );
}

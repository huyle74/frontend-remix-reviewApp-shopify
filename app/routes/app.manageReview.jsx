import { useEffect, useState } from "react";
import { useSearchParams } from "@remix-run/react";
import { Page } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import ReviewDashboard from "../components/manage_reviews/reviewsDashboard";
import { url } from "../utils/config";

export const loader = async ({ request }) => {
  console.log("----------Manage import page------");
  await authenticate.admin(request);

  return null;
};

export default function MangeReviews() {
  const [param] = useSearchParams();
  const id = param.get("product_id");
  const [review, setReviews] = useState([]);
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nations, setNations] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `${url}/manage/getReviewsByProduct?shopify_product_id=${id}`,
          {
            method: "POST",
          },
        );
        const { reviews, pagination, nations } = await response.json();
        setReviews(reviews);
        setPage(pagination);
        setNations(nations);
      } catch (error) {
        console.error(
          "Get product reviews info from database Get bug here >>",
          error,
        );
      }
    })();
  }, [id]);

  return (
    <Page
      backAction={{
        content: "Products",
        url: "/app",
        onAction: () => setLoading(true),
      }}
      title="Manage Reviews"
      fullWidth
    >
      <ReviewDashboard
        data={review}
        pagination={page}
        productId={id}
        loading={loading}
        nations={nations}
      />
    </Page>
  );
}

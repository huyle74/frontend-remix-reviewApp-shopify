import { useLoaderData } from "@remix-run/react";
import { Page, Box, Button } from "@shopify/polaris";

export const loader = async ({ params }) => {
  const { id } = params;
  console.log(id);
  return { id };
};

export default function ImportReviews({ onClick }) {
  const id = useLoaderData();

  // console.log(id);

  return (
    <Page>
      <Button onClick={onClick} url="/app/importReview">
        Back
      </Button>
      Hello World
    </Page>
  );
}

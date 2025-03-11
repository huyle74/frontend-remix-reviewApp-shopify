import { Link } from "@remix-run/react";
import { Box, Button } from "@shopify/polaris";

export default function ImportButton({ id }) {
  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "end",
      }}
      id={id}
    >
      <Link>
        <Button
          onClick={() => {
            // console.log("Clicked", id);
            // open(
            //   `shopify://admin/apps/remix-frontend-review-app/app/importReview/${id}`,
            //   "_self",
            // );
            open(`/app/importReview/${id}`, "_self");
          }}
        >
          Import Reviews
        </Button>
      </Link>
    </Box>
  );
}

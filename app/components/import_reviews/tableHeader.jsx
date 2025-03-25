import { Box, Button } from "@shopify/polaris";

export default function TableHeader({ allProduct, reviews, noReviews }) {
  return (
    <Box
      style={{
        display: "flex",
        marginBottom: "10px",
      }}
    >
      <Box padding={"150"} className="header-table-button">
        <Button>
          All Products <span className="button-number">{allProduct}</span>
        </Button>
      </Box>
      {/* <Box padding={"150"} className="header-table-button">
        <Button>
          Reviews
          <span className="button-number">{reviews}</span>
        </Button>
      </Box>
      <Box padding={"150"} className="header-table-button">
        <Button>
          No reviews
          <span className="button-number">{noReviews}</span>
        </Button>
      </Box> */}
    </Box>
  );
}

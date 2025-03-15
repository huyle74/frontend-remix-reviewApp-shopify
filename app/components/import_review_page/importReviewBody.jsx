import { Box, Card, Thumbnail, Text } from "@shopify/polaris";
import { star, starNoFill } from "../../utils/icon";
import OverviewReview from "./overviewReview";

export default function ImportReviewBody({ product, review }) {
  return (
    <Card>
      <Box
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Thumbnail
          source={product?.media?.edges[0]?.node.preview.image.url}
          atl="product thumbnail"
          size="large"
        />
        <Box
          style={{
            marginLeft: "3rem",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            borderRight: "1px gray solid",
            width: "40%",
          }}
        >
          <Text fontWeight="bold" tone="caution">
            {product?.title}
          </Text>
          <Box
            style={{
              marginTop: "10%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              style={{
                display: "flex",
                marginRight: "20px",
                backgroundColor: "#fff000",
                padding: "10px",
                borderRadius: "15px",
              }}
            >
              <img
                style={{
                  objectFit: "cover",
                  width: "20px",
                  height: "20px",
                  marginRight: "5px",
                }}
                src={review?.averageRating ? star : starNoFill}
                alt="icon star"
              />
              <Text variant="bodyLg">
                {review?.averageRating}
                {review?.totalReviews ? "" : ".0"}
              </Text>
            </Box>
            <Text as="h6" variant="bodyMd">
              {review?.totalReviews} Published Reviews
            </Text>
          </Box>
        </Box>
        <Box
          style={{
            marginLeft: "auto",
            width: "35%",
            margin: "auto",
          }}
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <OverviewReview
              title={"Total Reviews"}
              number={review?.totalReviews}
            />
            <OverviewReview title={"Photos"} number={90} />
            <OverviewReview title={"Video"} number={90} />
          </Box>
        </Box>
      </Box>
    </Card>
  );
}

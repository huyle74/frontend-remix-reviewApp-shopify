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
                marginRight: "0.5rem",
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
                src={review?.average_rating !== "0" ? star : starNoFill}
                alt="icon star"
              />
              <Text variant="bodyLg">
                {review?.average_rating}
                {review?.total_reviews ? "" : "0"}
              </Text>
            </Box>
            <Text as="h6" variant="bodyMd">
              Rating
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
              justifyContent: "center",
            }}
          >
            <OverviewReview
              title={"Total Reviews"}
              number={review?.total_reviews}
            />
            <OverviewReview title={"Photos"} number={review?.total_photos} />
          </Box>
        </Box>
      </Box>
    </Card>
  );
}

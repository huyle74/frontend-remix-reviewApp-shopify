import { IndexTable, Box, Text, Avatar, Button } from "@shopify/polaris";
import { DeleteIcon } from "@shopify/polaris-icons";
import RatingStar from "./ratingStar";
import ReviewContent from "./reviewContent";
import ImagesReview from "./imageReview";

export default function RowIndexTable({ reviews, onClick, selectedResources }) {
  return (
    <>
      {reviews.map(
        (
          {
            id,
            review_name,
            nation,
            rating,
            review_content,
            review_image,
            avatar,
            date,
          },
          index,
        ) => {
          return (
            <IndexTable.Row
              id={id}
              key={id}
              selected={selectedResources?.includes(id)}
              position={index}
              accessibilityLabel="Review detail"
              onClick={(e) => {}}
            >
              <IndexTable.Cell>
                <div
                  style={{
                    marginTop: "10px",
                    height: "max-content",
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 1000,
                    transition: "1s ease",
                  }}
                >
                  <RatingStar rating={rating} />
                  <ReviewContent content={review_content} />
                  <ImagesReview images={review_image} />
                </div>
              </IndexTable.Cell>
              <div style={{ transition: "1s ease" }}>
                <IndexTable.Cell>
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: "10px 0 10px 0",
                    }}
                  >
                    <div style={{ margin: "0 10px 0 0" }}>
                      <Avatar source={avatar} name={review_name} initials="user" />
                    </div>
                    <Text>
                      {review_name.length > 15
                        ? review_name.slice(0, 15)
                        : review_name}
                    </Text>
                  </Box>
                  <Box style={{ display: "flex" }}>
                    Reviewed in&nbsp; <span> </span>
                    <Text fontWeight="bold" tone="magic-subdued">
                      {nation}
                    </Text>
                    &nbsp;on&nbsp;
                    <Text fontWeight="bold" tone="critical">
                      {date}
                    </Text>
                  </Box>
                </IndexTable.Cell>
              </div>
              <IndexTable.Cell>
                <Button icon={DeleteIcon} onClick={() => onClick(id)} />
              </IndexTable.Cell>
            </IndexTable.Row>
          );
        },
      )}
    </>
  );
}

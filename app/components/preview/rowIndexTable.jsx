import { IndexTable, Box, Text, Avatar, Button } from "@shopify/polaris";
import { DeleteIcon } from "@shopify/polaris-icons";
import RatingStar from "./ratingStar";
import ReviewContent from "./reviewContent";
import ImagesReview from "./imageReview";

export default function RowIndexTable({
  reviews,
  deleteById,
  selectedResources,
  disabled,
}) {
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
              key={`${id}-${index}`}
              selected={selectedResources?.includes(id)}
              position={index}
              accessibilityLabel="Review detail"
              onClick={() => {}}
            >
              <IndexTable.Cell>
                <div
                  style={{
                    marginTop: "10px",
                    height: "max-content",
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 1000,
                  }}
                >
                  <RatingStar rating={rating} />
                  <ReviewContent content={review_content} />
                  <ImagesReview images={review_image} />
                </div>
              </IndexTable.Cell>
              <div>
                <IndexTable.Cell>
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: "10px 0 10px 0",
                    }}
                  >
                    <div style={{ margin: "0 10px 0 0" }}>
                      <Avatar
                        source={avatar}
                        name={review_name}
                        initials="user"
                      />
                    </div>
                    <Text>
                      {review_name.length > 15
                        ? review_name.slice(0, 15)
                        : review_name}
                    </Text>
                  </Box>
                  <Box style={{ display: "flex" }}>
                    Reviewed in&nbsp;
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
                <Button
                  icon={DeleteIcon}
                  variant="tertiary"
                  onClick={() => deleteById(id)}
                  disabled={disabled}
                />
              </IndexTable.Cell>
            </IndexTable.Row>
          );
        },
      )}
    </>
  );
}

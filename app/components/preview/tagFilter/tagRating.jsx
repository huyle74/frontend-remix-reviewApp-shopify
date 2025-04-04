import { Tag, Text, Icon } from "@shopify/polaris";
import { StarFilledIcon } from "@shopify/polaris-icons";

export default function TagRating({ rating }) {
  return (
    <div
      style={{
        display: "flex",
        padding: `${rating.length ? "0.5rem 0 0.5rem 0" : 0}`,
      }}
    >
      {rating.length !== 0 && <Text fontWeight="bold">Rating: &nbsp; </Text>}
      {rating.map((rating) => {
        return (
          <div style={{ margin: "0 0.2rem 0 0.2rem" }}>
            <Tag key={rating}>
              <div style={{ display: "flex" }}>
                {rating} <Icon tone="emphasis" source={StarFilledIcon} />
              </div>
            </Tag>
          </div>
        );
      })}
    </div>
  );
}

import { Icon, Box } from "@shopify/polaris";
import { StarFilledIcon, StarIcon } from "@shopify/polaris-icons";

export default function RatingStar({ rating }) {
  return (
    <Box style={{ display: "flex" }}>
      <Box style={{ display: "flex" }}>
        {Array.from({ length: rating }).map((_, index) => {
          return (
            <div key={`filledStar-${rating}-${index}`}>
              <Icon tone="emphasis" source={StarFilledIcon} />
            </div>
          );
        })}
      </Box>
      <Box style={{ display: "flex" }}>
        {Array.from({ length: 5 - Number(rating) }).map((_, index) => {
          return (
            <div key={`star-${index}-${rating}`}>
              <Icon tone="emphasis" source={StarIcon} />
            </div>
          );
        })}
      </Box>
      <p style={{ marginLeft: "10px" }}>{rating}/5</p>
    </Box>
  );
}

import { Box } from "@shopify/polaris";

export default function ratingStar(rating) {
  return (
    <Box style={{ display: "flex", marginTop: "10px" }}>
      {Array.from({ length: rating }).map((_, index) => (
        <img
          key={index}
          style={{ objectFit: "cover", width: "20px", marginRight: "2px" }}
          src="https://static-00.iconduck.com/assets.00/star-icon-512x492-dzrd4407.png"
          alt="star icon"
        />
      ))}
    </Box>
  );
}

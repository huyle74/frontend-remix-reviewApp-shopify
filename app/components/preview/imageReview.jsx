import { useState } from "react";
import { Box, Thumbnail, Button } from "@shopify/polaris";
import { XSmallIcon } from "@shopify/polaris-icons";

export default function ImagesReview({ images }) {
  const [showImage, setShowImage] = useState(null);

  const handleClickImage = (image) => {
    const imageDiv = (
      <div
        style={{
          position: "relative",
        }}
      >
        <img
          style={{ objectFit: "cover", height: "100%", borderRadius: "20px" }}
          alt="product image"
          src={image}
        />
        <div
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            color: "white",
          }}
        >
          <Button
            size="large"
            variant="monochromePlain"
            icon={XSmallIcon}
            onClick={handleCloseImage}
          />
        </div>
      </div>
    );
    setShowImage(imageDiv);
  };

  const handleCloseImage = () => {
    setShowImage(null);
  };

  return (
    <Box style={{ zIndex: 1000 }}>
      <div style={{ display: "flex" }}>
        {images.map((img, index) => {
          return (
            <Box
              key={`${img}-${index}`}
              style={{ margin: "10px 10px 10px 0" }}
              onClick={() => handleClickImage(img)}
            >
              <Thumbnail source={img} size="large" alt="Product review image" />
            </Box>
          );
        })}
      </div>
      <div style={{ display: "flex", height: `${showImage ? "300px" : 0}` }}>
        {showImage}
      </div>
    </Box>
  );
}

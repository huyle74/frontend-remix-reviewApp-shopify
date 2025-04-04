import { Button } from "@shopify/polaris";
import { XIcon } from "@shopify/polaris-icons";
import { DeleteIcon } from "@shopify/polaris-icons";

export default function DisplayPhotos({
  photos,
  onClick,
  clickDeletePhoto,
  reviewId,
}) {
  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: "rgb(0, 0, 0, 0.2)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 0,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          height: "60vh",
          width: "70vw",
          margin: "1rem",
          position: "relative",
          padding: "1rem",
          borderRadius: "15px",
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            zIndex: 1000,
          }}
        >
          <Button icon={XIcon} onClick={onClick} variant="monochromePlain" />
        </div>
        <div
          style={{
            display: "flex",
            overflowX: "scroll",
            overflowY: "hidden",
            width: "100%",
            height: "100%",
            padding: "0.5rem",
          }}
        >
          {photos?.map((img, index) => {
            return (
              <div style={{ position: "relative" }}>
                <img
                  key={index}
                  src={img}
                  alt="display photos"
                  style={{
                    objectFit: "cover",
                    height: "100%",
                    borderRadius: "3%",
                    margin: "0.5rem",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <Button
                    size="micro"
                    icon={DeleteIcon}
                    onClick={() => {
                      clickDeletePhoto(img, reviewId);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

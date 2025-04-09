import { useState } from "react";
import { Button } from "@shopify/polaris";

export default function ViewReviews({ productId, totalReviews, onClick }) {
  const [display, setDisplay] = useState(true);

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        position: "fixed",
        left: "50%",
        bottom: "5%",
        transform: "translateX(-50%)",
        zIndex: 1000,
      }}
    >
      {display && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "black",
            padding: "0 1rem 0",
          }}
        >
          <Button
            variant="tertiary"
            url={`/app/manageReview?product_id=${productId}`}
          >
            <p style={{ color: "white", borderBottom: "0.5px solid white" }}>
              View{" "}
              <span style={{ fontWeight: 700, color: "red" }}>
                {totalReviews}
              </span>{" "}
              Imported Reviews
            </p>
          </Button>
          <div
            style={{ color: "white", cursor: "pointer", padding: "0.5rem" }}
            onClick={() => {
              setDisplay(false);
              onClick();
            }}
          >
            x
          </div>
        </div>
      )}
    </div>
  );
}

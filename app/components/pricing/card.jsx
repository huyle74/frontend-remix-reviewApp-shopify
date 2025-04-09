import { useState } from "react";
import { Badge, Button } from "@shopify/polaris";

export default function FreeSectionCard({ data, onClick, isSelectedPlan }) {
  const { title, quota, feature, price, highlight } = data;
  const [loading, setLoading] = useState(false);

  return (
    <div
      style={{
        width: "20vw",
        backgroundColor: "white",
        borderRadius: "1rem",
        padding: "1rem",
        border: `${highlight ? "1px #2980b9  solid" : "none"}`,
        position: "relative",
      }}
    >
      {highlight && (
        <div
          style={{
            position: "absolute",
            top: 0,
            zIndex: 100,
            transform: "translateY(-50%)",
          }}
        >
          <Badge tone="info">Most popular</Badge>
        </div>
      )}
      <div style={{ height: "4rem", marginTop: "1rem" }}>
        <div style={{ fontSize: "1rem", fontWeight: 700 }}>{title[0]}</div>
        <div style={{ fontWeight: 400 }}>{title[1]}</div>
      </div>
      <div style={{ height: "4rem", marginTop: "1rem" }}>
        <span style={{ fontWeight: 700, fontSize: "2rem" }}>${price}</span>{" "}
        <span>USD/MONTH</span>
      </div>
      <Button
        disabled={isSelectedPlan}
        fullWidth
        loading={loading}
        onClick={() => {
          onClick();
          setLoading(true);
        }}
        variant={highlight ? "primary" : "secondary"}
      >
        {isSelectedPlan ? "You are here" : "Choose this plan"}
      </Button>
      <div
        style={{
          height: "5rem",
          marginTop: "1rem",
          borderTop: "0.5px #f1f1f1 solid",
          padding: "1rem 0 1rem 0",
          borderBottom: "0.5px #f1f1f1 solid",
          display: "flex",
          flexDirection: "column",
          rowGap: "0.5rem",
          alignItems: "center",
          justifyContent: "start",
        }}
      >
        <div style={{ fontWeight: 700, marginRight: "auto" }}>Quota</div>
        <div style={{ marginRight: "auto" }}>
          <span style={{ fontWeight: 700 }}>{quota}</span> Imported Reviews
        </div>
      </div>
      <div
        className="feature"
        style={{ padding: "1rem 0 1rem 0", height: "8rem" }}
      >
        <div
          style={{
            fontWeight: 700,
          }}
        >
          Features
        </div>
        {feature.map((feat, index) => {
          return (
            <div key={index} style={{ marginTop: "0.5rem" }}>
              {feat}
            </div>
          );
        })}
      </div>
    </div>
  );
}

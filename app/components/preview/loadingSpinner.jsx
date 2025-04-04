import { Spinner } from "@shopify/polaris";

export default function LoadingSpinner() {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: "rgb(1, 0, 0, 0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        zIndex: 1000,
      }}
    >
      <Spinner size="large" />
    </div>
  );
}

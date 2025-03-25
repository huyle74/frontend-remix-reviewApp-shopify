import { Box, Spinner } from "@shopify/polaris";

export default function SpinnerLoading({ loading }) {
  return (
    <Box>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "rgb(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          <Spinner size="large" color="teal" />
        </div>
      )}
    </Box>
  );
}

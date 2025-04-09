import { Box, Spinner } from "@shopify/polaris";
import ReactDOM from "react-dom";

export default function SpinnerLoading({ loading, size }) {
  const spinner = (
    <Box>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgb(0,0,0,0.01)",
            zIndex: 1000,
            bottom: 0,
            right: 0,
          }}
        >
          <Spinner size={size} color="teal" />
        </div>
      )}
    </Box>
  );
  return ReactDOM.createPortal(spinner, document.body);
}

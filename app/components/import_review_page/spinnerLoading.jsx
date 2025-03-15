import { useState } from "react";
import { Box, Spinner } from "@shopify/polaris";
import style from "./spinner.module.css";

export default function SpinnerLoading({ loading }) {
  return (
    <Box>
      {loading && (
        <div className={style.div}>
          <div className={style.spinner}>
            <Spinner size="large" color="teal" />
          </div>
        </div>
      )}
    </Box>
  );
}

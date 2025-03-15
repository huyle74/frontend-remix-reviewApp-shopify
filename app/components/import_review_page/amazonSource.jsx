import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import {
  Box,
  Card,
  Form,
  FormLayout,
  TextField,
  Icon,
  Text,
} from "@shopify/polaris";
import { AlertTriangleIcon } from "@shopify/polaris-icons";
import { amazonLogo } from "../../utils/icon";
import SpinnerLoading from "./spinnerLoading";
import styles from "./Button.module.css";
import { checkUrlAmazon } from "../../utils/checkUrl";

export default function AmazonSource({ onClick, shop_id }) {
  const [url, setUrl] = useState("");
  const [validateUrl, setValidateUrl] = useState(true);
  const [fetchReviews, setFetchReviews] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = useCallback(() => {
    if (!fetchReviews) return setFetchReviews(true);
  }, []);

  const handleUrlChange = useCallback((value) => {
    setUrl(value);
  }, []);

  useEffect(() => {
    const getReviews = async () => {
      try {
        if (url.length !== 0 && validateUrl && fetchReviews) {
          console.log("Valid URL >>> ", url);
          await fetch(
            `http://localhost:8080/amazonCrawling?shop_id=${shop_id}&url=${url}`,
            {
              method: "POST",
            },
          )
            .then((res) => res.json())
            .then((data) => {
              console.log(data.reviews);
              setFetchReviews(false);
              navigate("/app/preview", { state: data.reviews }); // Redirect to preview page
            });
        }
      } catch (error) {
        console.error("Error on get reviews >>> ", error);
      }
    };
    getReviews();
  }, [fetchReviews]);

  useEffect(() => {
    if (url.length !== 0) {
      const checkUrl = checkUrlAmazon(url);
      setValidateUrl(checkUrl);
    }
  }, [url]);

  return (
    <Box className="amazon-source-component" style={{ marginTop: "30px" }}>
      <Card>
        <Box
          style={{
            margin: "20px 0 20px 0",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={amazonLogo}
            alt="amazon logo"
            style={{ objectFit: "cover", height: "30px" }}
          />
          <Box style={{ marginLeft: "auto" }}>
            <button className={styles.button} role="button" onClick={onClick}>
              X close
            </button>
          </Box>
        </Box>
        <Form preventDefault noValidate onSubmit={handleSubmit} method="post">
          <FormLayout>
            <TextField
              value={url}
              onChange={handleUrlChange}
              label="Enter Amazon Product URL"
              type="url"
              autoComplete="off"
              onFocus={(e) => {
                handleUrlChange(e.target.value);
              }}
            />
            <Box>
              {!validateUrl && (
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Icon source={AlertTriangleIcon} tone="critical" />
                  </Box>
                  <Text tone="critical">
                    Invalid amazon product URL. Please re-enter product link.
                  </Text>
                </Box>
              )}
            </Box>
            <button
              className={styles.button}
              role="button"
              style={{
                marginTop: "10px",
                padding: 0,
                width: "120px",
                marginLeft: "20px",
              }}
              type="submit"
            >
              Get reviews
            </button>
          </FormLayout>
        </Form>
        <SpinnerLoading loading={fetchReviews} />
      </Card>
    </Box>
  );
}

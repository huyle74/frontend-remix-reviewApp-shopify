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
import { useAppBridge, Modal, TitleBar } from "@shopify/app-bridge-react";
import { AlertTriangleIcon } from "@shopify/polaris-icons";
import SpinnerLoading from "./spinnerLoading";

export default function SourcePlatform({
  onClick,
  shop_id,
  sourceName,
  logo,
  backgroundColor,
  checkValidUrl,
  api,
  billing,
  productId
}) {
  const shopify = useAppBridge();
  const [url, setUrl] = useState("");
  const [validateUrl, setValidateUrl] = useState(true);
  const [fetchReviews, setFetchReviews] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (fetchReviews === false && validateUrl === true && url.length !== 0) {
      setFetchReviews(true);
    }
  };

  const handleUrlChange = useCallback(
    (value) => {
      setUrl(value);
    },
    [url],
  );

  useEffect(() => {
    const getReviews = async () => {
      try {
        if (url.length !== 0 && validateUrl && fetchReviews) {
          await fetch(
            `http://localhost:8080/api/${api}?shop_id=${shop_id}&url=${url}&billing=${billing}&shopify_product_id=${productId}`,
            {
              method: "POST",
            },
          )
            .then((res) => res.json())
            .then((data) => {
              if (data.reviews.length !== 0) {
                navigate("/app/preview", { state: data });
              } else {
                shopify.modal.show("error");
                setFetchReviews(false);
                return;
              }
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
      const checkUrl = checkValidUrl(url);
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
            src={logo}
            alt="amazon logo"
            style={{ objectFit: "cover", height: "30px" }}
          />
          <Box style={{ marginLeft: "auto" }} className="import-link-button">
            <button
              role="button"
              onClick={onClick}
              style={{ backgroundColor: `${backgroundColor}` }}
            >
              X close
            </button>
          </Box>
        </Box>
        <Form preventDefault noValidate onSubmit={handleSubmit} method="post">
          <FormLayout>
            <TextField
              value={url}
              onChange={handleUrlChange}
              label={`Enter ${sourceName} Product URL`}
              type="url"
              autoComplete="off"
              onFocus={(e) => {
                handleUrlChange(e.target.value);
              }}
            />
            <Box>
              {validateUrl === false && (
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
                    Invalid {sourceName} product URL. Please re-enter product
                    link.
                  </Text>
                </Box>
              )}
            </Box>
            <Box className="import-link-button">
              <button
                role="button"
                style={{
                  margin: "0 0 20px 20px",
                  padding: 0,
                  width: "120px",
                  backgroundColor: `${backgroundColor}`,
                }}
                type="submit"
              >
                Get reviews
              </button>
            </Box>
          </FormLayout>
        </Form>
        <SpinnerLoading
          loading={fetchReviews === true && validateUrl === true}
        />
      </Card>
      <Modal id="error">
        <p style={{ margin: "1.5rem 0 1.5rem 1.5rem" }}>
          Please wait 1 minute and try again!
        </p>
        <TitleBar Title="Cannot get Reviews"></TitleBar>
      </Modal>
    </Box>
  );
}

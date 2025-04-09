import { useState, useCallback, useEffect } from "react";
import {
  Form,
  FormLayout,
  TextField,
  Button,
  Thumbnail,
} from "@shopify/polaris";
import { XIcon } from "@shopify/polaris-icons";
import ReactDOM from "react-dom";
import {
  checkUrlAmazon,
  checkUrlAliExpress,
  detectPlatform,
} from "../../utils/checkUrl";
import { api } from "../../utils/config";

export default function PopupImportForm({
  data,
  onClose,
  initUrl,
  productId,
  bill,
  shop_id,
}) {
  const [url, setUrl] = useState(initUrl);
  const [validUrl, setValidUrl] = useState(true);
  const [run, setRun] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleUrlChange = useCallback((value) => setUrl(value), []);

  useEffect(() => {
    const running = setInterval(() => {
      if (run > 0 && run < 85 && loading) {
        setRun((prev) => prev + 1);
      } else {
        setRun(1);
      }
    }, 1000);
    return () => {
      if (running) {
        clearInterval(running);
      }
    };
  }, [run]);

  useEffect(() => {
    const checkUrl = checkUrlAliExpress(url) || checkUrlAmazon(url);
    setValidUrl(checkUrl);
    if (url.length !== 0) {
      const detect = detectPlatform(url);
      setErrorMessage(detect);
    }
  }, [url]);

  const handleOnSubmit = async () => {
    setLoading(true);
    setRun(2);
    try {
      const link = checkUrlAmazon(url)
        ? `${api}/amazon/amazonCrawler`
        : `${api}/aliExpress/aliExpressCrawler`;
      const response = await fetch(
        `${link}?shopify_product_id=${productId}&shop_id=${shop_id}&billing=${bill}&url=${url}`,
        {
          method: "post",
        },
      );
      const { success, reviews } = await response.json();
      if (success) {
        setLoading(false);
        setRun(1);
        onClose({ totalReviews: reviews.length, productId });
      }
    } catch (error) {
      console.error("Cannot import reviews >>", error);
    }
  };

  const popup = (
    <div
      style={{
        position: "fixed",
        backgroundColor: "rgb(0,0,0,0.4)",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "1rem",
        zIndex: 200,
      }}
      onClick={loading === false ? onClose : undefined}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "70%",
          backgroundColor: "white",
          borderRadius: "1rem",
          padding: "1rem",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Thumbnail size="small" source={data.imageUrl} />
            <div style={{ fontWeight: 600 }}>{data.title}</div>
          </div>
          <Button
            icon={XIcon}
            variant="tertiary"
            onClick={loading === false ? onClose : undefined}
          />
        </div>
        <div>
          <Form
            noValidate
            onSubmit={(e) => {
              url.length !== 0 && validUrl === true
                ? handleOnSubmit(e)
                : e.preventDefault();
            }}
          >
            <FormLayout>
              <TextField
                disabled={loading}
                value={url}
                placeholder="Paste your Amazon or AliExpress Link"
                onChange={handleUrlChange}
                error={
                  url.length !== 0 &&
                  validUrl === false &&
                  `Please Enter valid ${errorMessage} product link`
                }
              />
              <div
                style={{
                  display: "flex",
                  width: "fit-content",
                  marginLeft: "auto",
                }}
              >
                <Button
                  submit
                  loading={loading}
                  disabled={!validUrl || url.length === 0 || loading}
                >
                  Import reviews
                </Button>
              </div>
            </FormLayout>
          </Form>
        </div>
        {loading && (
          <div style={{ display: "flex" }}>
            <div
              style={{
                backgroundColor: "#f37936",
                width: `${run}%`,
                height: "0.2rem",
                transition: "0.5s ease",
                borderRadius: "0.1rem",
                marginTop: "auto",
                zIndex: 100,
              }}
            ></div>
            <img
              style={{
                width: "5rem",
                objectFit: "cover",
                marginTop: "auto",
                transform: "translate(-1.4rem, 1rem)",
                zIndex: 0,
              }}
              src="https://storage.googleapis.com/admh-public-bucket/running.gif"
              alt=""
            />
          </div>
        )}
      </div>
    </div>
  );
  return ReactDOM.createPortal(popup, document.body);
}

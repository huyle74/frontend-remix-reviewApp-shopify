import { useState, useCallback } from "react";
import { Form, FormLayout, Button, TextField } from "@shopify/polaris";
import PopupImportForm from "./popupFormImport";
import {
  checkUrlAmazon,
  checkUrlAliExpress,
  detectPlatform,
} from "../../utils/checkUrl";

export default function ImportForm({
  data,
  bill,
  shop_id,
  productId,
  importedSuccess,
}) {
  const [url, setUrl] = useState("");
  const [popup, setPopup] = useState(false);
  const [validUrl, setValidUrl] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleUrlChange = useCallback((value) => {
    setUrl(value);
    const checkUrl = checkUrlAliExpress(value) || checkUrlAmazon(value);
    setValidUrl(checkUrl);
    if (value.length !== 0) {
      const detect = detectPlatform(value);
      setErrorMessage(detect);
    }
  }, []);

  const handleOnClose = (imported) => {
    importedSuccess(imported);
    setPopup(false);
    setUrl("");
  };

  return (
    <div>
      {popup && (
        <PopupImportForm
          data={data}
          onClose={handleOnClose}
          initUrl={url}
          bill={bill}
          shop_id={shop_id}
          productId={productId}
        />
      )}
      <Form
        preventDefault
        noValidate
        onSubmit={() => {
          setPopup(true);
          setValidUrl(true);
        }}
      >
        <FormLayout>
          <div style={{ display: "flex" }}>
            <div style={{ width: "20rem" }}>
              <TextField
                placeholder="Paste your Amazon or AliExpress Link"
                value={url}
                onChange={handleUrlChange}
                type="url"
                autoComplete="off"
                error={
                  url.length !== 0 &&
                  validUrl === false &&
                  `Please Enter valid ${errorMessage} product link`
                }
              />
            </div>
            <div style={{ marginLeft: "0.5rem" }}>
              <Button submit>Import</Button>
            </div>
          </div>
        </FormLayout>
      </Form>
    </div>
  );
}

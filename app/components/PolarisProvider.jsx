import { useCallback } from "react";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { useNavigate } from "@remix-run/react";
import "@shopify/polaris/build/esm/styles.css";

function AppBridgeLink({ url, children, external, ...rest }) {
  const navigate = useNavigate();
  const handleClick = useCallback(() => navigate(url), [url]);

  const IS_EXTERNAL_LINK_REGEX = /^(?:[a-z][a-z\d+.-]*:|\/\/)/;

  if (external || IS_EXTERNAL_LINK_REGEX.test(url)) {
    return (
      <a {...rest} href={url} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <a {...rest} onClick={handleClick}>
      {children}
    </a>
  );
}

export function PolarisProvider({ apiKey, children }) {
  return (
    <AppProvider isEmbeddedApp apiKey={apiKey} linkComponent={AppBridgeLink}>
      {children}
    </AppProvider>
  );
}

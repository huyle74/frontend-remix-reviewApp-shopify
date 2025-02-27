import createApp from "@shopify/app-bridge";
import { getSessionToken } from "@shopify/app-bridge/utilities";

export function getHost(req) {
  const url = new URL(req.url);
  const host = url.searchParams.get("host");
  if (!host) {
    console.error("Shopify Params URL missing");
  }
  return host;
}

export function InitShopifyApp(host, apiKey) {
  const app = createApp({
    apiKey: apiKey,
    host: host,
  });

  return app;
}

export async function getSession(app) {
  return await getSessionToken(app);
}

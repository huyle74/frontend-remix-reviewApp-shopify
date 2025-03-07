import { useLoaderData } from "@remix-run/react";
import { Box, Button } from "@shopify/polaris";
import { getHost } from "../../init_Shopify_App/getSessionToken";

export const loader = async ({ request }) => {
  const host = getHost(request);

  return { host };
};

export default function ImportButton({ id, url }) {
  const { host } = useLoaderData();

  const handleNavigate = () => {
    console.log(id, host);

    open(`/app/importReview/${id}?host=${host}`, "_self");
  };

  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "end",
      }}
      id={id}
    >
      <Button onClick={handleNavigate} url={url}>
        Import Reviews
      </Button>
    </Box>
  );
}

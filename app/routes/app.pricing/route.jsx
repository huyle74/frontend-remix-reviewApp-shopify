import { useState, useEffect, useCallback } from "react";
import { useLoaderData } from "@remix-run/react";
import { Page, Card, Button } from "@shopify/polaris";
import { authenticate } from "../../shopify.server";
import { useAppBridge } from "@shopify/app-bridge-react";
import { url } from "../../utils/config";

export const loader = async ({ request }) => {
  console.log("--PRICING PAGE--");
  const { billing } = await authenticate.admin(request);
  const bill = await billing.check();
  const checkBilling = bill.hasActivePayment;
  const id = checkBilling ? bill.appSubscriptions[0].id : null;
  return {
    checkBilling,
    id,
  };
};

function PricingRoute() {
  const { checkBilling, id } = useLoaderData();
  const shopify = useAppBridge();
  const [activePayment, setActivePayment] = useState(checkBilling);
  const [payment, setPayment] = useState(false);
  const [cancel, setCancel] = useState(false);

  useEffect(() => {
    if (payment) {
      (async () => {
        try {
          const accessToken = await shopify.idToken();
          await fetch(`${url}/shopify/subscription`, {
            method: "POST",
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          })
            .then((res) => res.json())
            .then((result) => {
              const { confirmationUrl, success } = result;
              if (success) return open(confirmationUrl, "_top");
            });
        } catch (error) {
          console.error("CREATE SUBSCRIPTION GET BUG: ", error);
        }
      })();
    }
  }, [payment]);

  useEffect(() => {
    if (cancel) {
      (async () => {
        try {
          const accessToken = await shopify.idToken();
          const response = await fetch(
            `${url}/shopify/cancelSubscription?id=${id}`,
            {
              method: "POST",
              headers: {
                authorization: `Bearer ${accessToken}`,
              },
            },
          );
          const { success } = await response.json();
          console.log("Cancel successfully - ", success);
          if (success) {
            setActivePayment(false);
            setCancel(false);
          }
        } catch (error) {
          console.log("Cancel subscription bug here >> ", error);
        }
      })();
    }
  }, [cancel]);

  const handleClickPay = useCallback(() => {
    setPayment(true);
  }, []);
  const handleClickCancel = useCallback(() => {
    setCancel(true);
  }, []);

  return (
    <Page title="Pricing">
      <Card sectioned>
        {!activePayment ? (
          <Button loading={payment} onClick={handleClickPay}>
            Get premium!
          </Button>
        ) : (
          <Button loading={cancel} onClick={handleClickCancel}>
            Downgrade
          </Button>
        )}
      </Card>
    </Page>
  );
}

export default PricingRoute;

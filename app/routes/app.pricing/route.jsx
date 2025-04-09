import { useState, useCallback } from "react";
import { useLoaderData } from "@remix-run/react";
import { Page } from "@shopify/polaris";
import { authenticate } from "../../shopify.server";
import { useAppBridge } from "@shopify/app-bridge-react";
import { url } from "../../utils/config";
import AllPricingPlan from "../../components/pricing/priceSection";
import { useNavigate } from "@remix-run/react";

export const loader = async ({ request }) => {
  console.log("--PRICING PAGE--");
  const { billing } = await authenticate.admin(request);
  const { hasActivePayment, appSubscriptions } = await billing.check();
  const id = hasActivePayment ? appSubscriptions[0].id : null;

  return {
    checkBilling: hasActivePayment,
    id,
    plan: appSubscriptions[0]?.name || null,
  };
};

export default function PricingRoute() {
  const { checkBilling, id, plan } = useLoaderData();
  const shopify = useAppBridge();
  const navigate = useNavigate();

  const handleClickPay = async (plan) => {
    console.log(plan);
    try {
      const accessToken = await shopify.idToken();
      await fetch(`${url}/shopify/subscription?plan=${plan}`, {
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
  };
  const handleClickCancel = useCallback(async () => {
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
      if (success) {
        navigate("/app");
      }
    } catch (error) {
      console.log("Cancel subscription bug here >> ", error);
    }
  }, []);

  return (
    <Page title="Pricing plan" fullWidth>
      <AllPricingPlan
        cancelSubscription={handleClickCancel}
        onClick={(plan) => handleClickPay(plan)}
        plan={checkBilling === false ? "free" : plan}
      />
    </Page>
  );
}

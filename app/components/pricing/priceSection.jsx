import { useNavigate } from "@remix-run/react";
import FreeSectionCard from "./card";

export default function AllPricingPlan({ onClick, plan, cancelSubscription }) {

  console.log(plan);

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
      {plan !== "free" && (
        <FreeSectionCard
          data={{
            title: ["Free", "Suitable for testing and trial stores"],
            price: 0,
            quota: 100,
            feature: ["Import review from AliExpress"],
          }}
          isSelectedPlan={plan === "free"}
          onClick={cancelSubscription}
        />
      )}
      <FreeSectionCard
        data={{
          title: ["Basic", "Popular with most stores"],
          price: 4.9,
          quota: 1000,
          feature: ["Import review from AliExpress", "Export reviews"],
          highlight: true,
        }}
        onClick={() => onClick("basic")}
        isSelectedPlan={plan === "basic"}
      />
      <FreeSectionCard
        data={{
          title: ["Advanced", "Best cost-effective plan"],
          price: 29.9,
          quota: "Unlimited",
          feature: ["Import review from AliExpress, Amazon", "Export reviews"],
        }}
        onClick={() => onClick("advanced")}
        isSelectedPlan={plan === "advanced"}
      />
    </div>
  );
}

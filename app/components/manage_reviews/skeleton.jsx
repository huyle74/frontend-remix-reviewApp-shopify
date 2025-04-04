import {
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  SkeletonTabs,
} from "@shopify/polaris";

export default function Skeleton() {
  return (
    <SkeletonPage fullWidth primaryAction>
      <SkeletonTabs count={5} fitted/>
      <div style={{ display: "flex" }}>
        <SkeletonDisplayText size="extraLarge" />
        <SkeletonDisplayText size="extraLarge" />
        <SkeletonDisplayText size="extraLarge" />
      </div>
      <SkeletonBodyText lines={20} />
    </SkeletonPage>
  );
}

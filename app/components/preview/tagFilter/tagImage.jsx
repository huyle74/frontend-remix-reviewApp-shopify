import { Tag, Text } from "@shopify/polaris";

export default function TagImage({ hasPhotos }) {
  return (
    <div
      style={{
        padding: `${hasPhotos.length ? "0.5rem 0.5rem 0.5rem 0" : 0}`,
        display: "flex",
        width: `${!hasPhotos.length ? 0 : "max-content"}`,
      }}
    >
      {hasPhotos.length !== 0 && <Text fontWeight="bold">Images:</Text>}
      &nbsp;
      {hasPhotos.length !== 0 && (
        <Tag>
          {hasPhotos[0] ? (
            <p style={{ fontWeight: 600, color: "darkgreen" }}>Yes</p>
          ) : (
            <p style={{ fontWeight: 600, color: "revert" }}>No</p>
          )}
        </Tag>
      )}
    </div>
  );
}
 
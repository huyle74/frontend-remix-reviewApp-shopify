import { Tag, Text } from "@shopify/polaris";

export default function TagHasContent({ hasContent }) {
  return (
    <div
      style={{
        padding: `${hasContent.length ? "0.5rem 0.5rem 0.5rem 0" : 0}`,
        display: "flex",
        width: `${!hasContent.length ? 0 : "max-content"}`,
      }}
    >
      {hasContent.length !== 0 && <Text fontWeight="bold"> Content:</Text>}
      &nbsp;
      {hasContent.length !== 0 && (
        <Tag>
          {hasContent[0] ? (
            <p style={{ fontWeight: 600, color: "blueviolet" }}>Yes</p>
          ) : (
            <p style={{ fontWeight: 600, color: "red" }}>No</p>
          )}
        </Tag>
      )}
    </div>
  );
}

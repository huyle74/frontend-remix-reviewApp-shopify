import { useState, useCallback } from "react";
import { Popover, ChoiceList, Button } from "@shopify/polaris";

export default function HasContentFilter({
  hasContent,
  onChange,
  clearSelected,
}) {
  const [popoverActive, setPopoverActive] = useState(false);
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

  return (
    <div
      style={{
        margin: "0 0.2rem 0 0.2rem",
      }}
    >
      <Popover
        active={popoverActive}
        onClose={togglePopoverActive}
        autofocusTarget="first-node"
        activator={
          <div>
            <Button
              variant="tertiary"
              textAlign="start"
              onClick={togglePopoverActive}
            >
              Content
            </Button>
          </div>
        }
      >
        <div style={{ margin: "1rem" }}>
          <ChoiceList
            onChange={onChange}
            selected={hasContent}
            choices={[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ]}
          />
          <div style={{ marginTop: "0.5rem" }}>
            <Button
              variant="tertiary"
              onClick={clearSelected}
              disabled={hasContent.length === 0}
            >
              Clear
            </Button>
          </div>
        </div>
      </Popover>
    </div>
  );
}

import { useState, useCallback } from "react";
import { Popover, ChoiceList, Button } from "@shopify/polaris";

export default function NationFilter({ nation, onChange, index, selected }) {
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
              key={index}
              onClick={togglePopoverActive}
            >
              Country
            </Button>
          </div>
        }
      >
        <div style={{ margin: "1rem" }}>
          <ChoiceList
            allowMultiple
            onChange={onChange}
            selected={selected || []}
            choices={nation?.map((nation) => {
              return { label: nation, value: nation };
            })}
          />
        </div>
      </Popover>
    </div>
  );
}

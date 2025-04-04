import { useState, useCallback } from "react";
import { ChoiceList, Popover, Button, Icon } from "@shopify/polaris";
import { StarFilledIcon } from "@shopify/polaris-icons";

export default function RatingFilter({ rating, onChange, disabled, selected }) {
  const [popoverActive, setPopoverActive] = useState(false);
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

  const ratingStar = rating.map((rate, index) => {
    return {
      label: (
        <div key={index} style={{ display: "flex", alignItems: "center" }}>
          {rate}&nbsp;
          <Icon tone="emphasis" source={StarFilledIcon} />
        </div>
      ),
      value: rate,
    };
  });
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
              Rating
            </Button>
          </div>
        }
      >
        <div style={{ margin: "1rem" }}>
          <ChoiceList
            choices={ratingStar}
            selected={selected || []}
            allowMultiple
            onChange={onChange}
          />
        </div>
      </Popover>
    </div>
  );
}

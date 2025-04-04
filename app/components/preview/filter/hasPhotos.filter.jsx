import { useState, useCallback } from "react";
import { Popover, ChoiceList, Button, Box } from "@shopify/polaris";

export default function HasPhotosFilter({
  hasPhotos,
  onChange,
  clearSelected,
}) {
  const [popoverActive, setPopoverActive] = useState(false);
  const togglePopoverActive = useCallback(
    () => setPopoverActive(!popoverActive),
    [popoverActive],
  );

  return (
    <Box style={{ margin: "0 0.2rem 0 0.2rem" }}>
      <Popover
        active={popoverActive}
        onClose={togglePopoverActive}
        autofocusTarget="first-node"
        activator={
          <Box>
            <Button
              variant="tertiary"
              textAlign="start"
              onClick={togglePopoverActive}
            >
              Photos
            </Button>
          </Box>
        }
      >
        <Box style={{ margin: "1rem" }}>
          <ChoiceList
            key={"photo"}
            onChange={onChange}
            selected={hasPhotos}
            choices={[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ]}
          />
          <Box style={{ marginTop: "0.5rem" }}>
            <Button
              variant="tertiary"
              onClick={clearSelected}
              disabled={hasPhotos.length === 0}
            >
              Clear
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
}

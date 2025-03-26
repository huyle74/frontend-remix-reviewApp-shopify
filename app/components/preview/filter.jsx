import { useState, useCallback } from "react";
import { Button, ChoiceList, Popover, Icon } from "@shopify/polaris";
import { StatusActiveIcon, StarFilledIcon } from "@shopify/polaris-icons";

export default function FilterFunction({ allNation, applyFilter }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [rating, setRating] = useState([]);
  const [hasImage, setHasImage] = useState([]);
  const [hasContent, setHasContent] = useState([]);
  const [nation, setNation] = useState([]);
  const handleRating = useCallback((value) => setRating(value), []);
  const handleNation = useCallback((value) => setNation(value), []);
  const handleHasImage = useCallback((value) => setHasImage(value), []);
  const handleHasContent = useCallback((value) => setHasContent(value), []);
  // REMOVE FILTER
  const handleClearAllFilter = useCallback(() => {
    setRating([]);
    setNation([]);
    setHasImage([]);
    setHasContent([]);
    setActiveDropdown(null);
    applyFilter({ rating: [], hasContent: [], nation: [], hasImage: [] });
  }, []);
  // SET UP FILTER
  const ratingStar = Array(5)
    .fill(null)
    .map((_, index) => {
      return {
        label: (
          <div style={{ display: "flex", alignItems: "center" }}>
            {index + 1}&nbsp;
            <Icon tone="emphasis" source={StarFilledIcon} />
          </div>
        ),
        value: Number(index + 1),
      };
    });
  const filters = [
    {
      label: "Rating",
      filter: (
        <ChoiceList
          choices={ratingStar}
          selected={rating || []}
          allowMultiple
          onChange={handleRating}
        />
      ),
    },
    {
      label: "Review Content",
      filter: (
        <div>
          <ChoiceList
            onChange={handleHasContent}
            selected={hasContent}
            choices={[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ]}
          />
          <div style={{ marginTop: "0.5rem" }}>
            <Button variant="tertiary" onClick={() => handleHasContent([])}>
              Clear
            </Button>
          </div>
        </div>
      ),
    },
    {
      label: "Images",
      filter: (
        <div>
          <ChoiceList
            onChange={handleHasImage}
            selected={hasImage}
            choices={[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ]}
          />
          <div style={{ marginTop: "0.5rem" }}>
            <Button variant="tertiary" onClick={() => handleHasImage([])}>
              Clear
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: "Nation",
      label: "Nation",
      filter: (
        <ChoiceList
          allowMultiple
          onChange={handleNation}
          selected={nation || []}
          choices={allNation?.map((nation) => {
            return { label: nation, value: nation };
          })}
        />
      ),
    },
  ];

  const handleClickShowOption = (value) => {
    setActiveDropdown(value);
  };
  const handleRemoveFilter = () => {
    setActiveDropdown(null);
  };
  const applyFilterActive = [rating, hasImage, hasContent, nation].some(
    (el) => el.length !== 0,
  );

  return (
    <div
      style={{
        display: "flex",
        padding: "0 1rem 1rem 1rem",
      }}
    >
      <div>
        <Button
          variant="tertiary"
          onClick={handleClearAllFilter}
          disabled={!applyFilterActive}
        >
          Clear all filter
        </Button>
      </div>
      <div style={{ display: "flex" }}>
        {filters.map((filter, index) => {
          return (
            <div
              style={{
                margin: "0 0.2rem 0 0.2rem",
              }}
            >
              <Popover
                active={activeDropdown === index}
                onClose={handleRemoveFilter}
                autofocusTarget="first-node"
                activator={
                  <div>
                    <Button
                      variant="tertiary"
                      tone="success"
                      textAlign="start"
                      key={index}
                      onClick={() => handleClickShowOption(index)}
                    >
                      {filter.label}
                    </Button>
                  </div>
                }
              >
                <div style={{ margin: "1rem" }}>{filter.filter}</div>
              </Popover>
            </div>
          );
        })}
      </div>

      <div style={{ marginLeft: "auto" }}>
        <Button
          icon={StatusActiveIcon}
          disabled={!applyFilterActive}
          onClick={() => applyFilter({ rating, hasImage, hasContent, nation })}
        >
          Apply Filter
        </Button>
      </div>
    </div>
  );
}

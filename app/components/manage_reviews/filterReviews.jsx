import { useState, useCallback, useEffect } from "react";
import {
  Icon,
  ChoiceList,
  IndexFilters,
  useSetIndexFiltersMode,
  Badge,
} from "@shopify/polaris";
import { nationToFlag } from "./helper.function";
import { StarFilledIcon } from "@shopify/polaris-icons";

export default function FilterReviews({ nationData, handleApplyFilters }) {
  const [hasImage, setHasImage] = useState([]);
  const [countries, setCountries] = useState([]);
  const [hasContent, setHasContent] = useState([]);
  const [rating, setRating] = useState([]);
  const [selected, setSelected] = useState(0);

  const handleRating = useCallback((value) => setRating(value), []);
  const handleCountries = useCallback((value) => setCountries(value), []);
  const handleHasImage = useCallback((value) => setHasImage(value), []);
  const handleHasContent = useCallback((value) => setHasContent(value), []);
  const onHandleCancel = () => {};

  const handleFiltersClearAll = useCallback(() => {
    setRating([]);
    setCountries([]);
    setHasImage([]);
    setHasContent([]);
  }, []);

  useEffect(() => {
    if (
      hasContent.length === 0 &&
      hasImage.length === 0 &&
      rating.length === 0 &&
      countries.length === 0
    ) {
      handleApplyFilters(hasContent, hasImage, rating, countries);
    }
  }, [hasContent, hasImage, rating, countries]);

  const { mode, setMode } = useSetIndexFiltersMode();

  const filters = [
    {
      key: "rating",
      label: "Rating",
      filter: (
        <ChoiceList
          title="Rating"
          titleHidden
          choices={Array.from({ length: 5 }, (_, i) => {
            return {
              label: (
                <span style={{ display: "flex", alignItems: "center" }}>
                  {i + 1}
                  <Icon source={StarFilledIcon} tone="emphasis" />
                </span>
              ),
              value: i + 1,
            };
          })}
          selected={rating || []}
          onChange={handleRating}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: "country",
      label: "Country",
      filter: (
        <ChoiceList
          title="Country"
          titleHidden
          choices={nationData.map((nation) => {
            return {
              label: (
                <div style={{ display: "flex", alignItems: "center" ,gap:'0.3rem'}}>
                  <img
                    src={nationToFlag(nation)}
                    alt="icon"
                    style={{
                      width: "1rem",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <span>{nation}</span>
                </div>
              ),
              value: nation,
            };
          })}
          selected={countries || []}
          onChange={handleCountries}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: "image",
      label: "Photos",
      filter: (
        <ChoiceList
          title="Photos"
          titleHidden
          choices={[
            { label: "Yes", value: true },
            { label: "No", value: false },
          ]}
          selected={hasImage || []}
          onChange={handleHasImage}
        />
      ),
      shortcut: true,
    },
    {
      key: "content",
      label: "Review content",
      filter: (
        <ChoiceList
          title="Review content"
          titleHidden
          choices={[
            { label: "Yes", value: true },
            { label: "No", value: false },
          ]}
          selected={hasContent || []}
          onChange={handleHasContent}
        />
      ),
      shortcut: true,
    },
  ];

  const primaryAction = selected === 0 && {
    type: "save",
    onAction: (e) =>
      handleApplyFilters({ countries, hasImage, hasContent, rating }),
    disabled: false,
    loading: false,
  };

  const appliedFilters = [];
  if (rating.length > 0) {
    appliedFilters.push({
      key: "rating",
      label: disambiguateLabel("rating", rating),
      onRemove: () => setRating([]),
    });
  }
  if (countries.length > 0) {
    appliedFilters.push({
      key: "country",
      label: disambiguateLabel("country", countries),
      onRemove: () => setCountries([]),
    });
  }
  if (hasContent.length > 0) {
    appliedFilters.push({
      key: "content",
      label: disambiguateLabel("content", hasContent),
      onRemove: () => setHasContent([]),
    });
  }
  if (hasImage.length > 0) {
    appliedFilters.push({
      key: "image",
      label: disambiguateLabel("image", hasImage),
      onRemove: () => setHasImage([]),
    });
  }

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <IndexFilters
        disableQueryField
        primaryAction={primaryAction}
        mode={mode}
        hideQueryField
        setMode={setMode}
        filters={filters}
        tabs={[]}
        selected={selected}
        onSelect={setSelected}
        onClearAll={handleFiltersClearAll}
        cancelAction={{
          onAction: onHandleCancel,
          disabled: false,
          loading: false,
        }}
        appliedFilters={appliedFilters}
      />
    </div>
  );
}

function disambiguateLabel(key, value) {
  switch (key) {
    case "rating":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          Rate:
          {value.map((val, index) => {
            return (
              <span
                key={index}
                style={{ display: "flex", alignItems: "center" }}
              >
                {val} <Icon source={StarFilledIcon} tone="emphasis" />
              </span>
            );
          })}
        </div>
      );
    case "country":
      return `${value.length ? "Countries" : "Country"}: ${value
        .map((nation) => {
          return nation;
        })
        .join(", ")}`;
    case "content":
      return `Review content: ${value[0] ? "Yes" : "No"}`;
    case "image":
      return `Photos: ${value[0] ? "Yes" : "No"}`;
    default:
      return value;
  }
}

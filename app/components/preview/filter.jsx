import { useState, useCallback, useEffect } from "react";
import { Button, Box, ChoiceList, Popover } from "@shopify/polaris";
import { StatusActiveIcon, DeleteIcon } from "@shopify/polaris-icons";
import RatingFilter from "./filter/rating.filter";
import NationFilter from "./filter/nation.filter";
import HasPhotosFilter from "./filter/hasPhotos.filter";
import HasContentFilter from "./filter/hasContent.filter";
import TagNation from "./tagFilter/tagNation";
import TagRating from "./tagFilter/tagRating";
import TagImage from "./tagFilter/tagImage";
import TagHasContent from "./tagFilter/tagHasContent";

export default function FilterFunction({
  applyFilter,
  disabled,
  tagFilter,
  resetFilter,
}) {
  const [rating, setRating] = useState([]);
  const [hasImage, setHasImage] = useState([]);
  const [hasContent, setHasContent] = useState([]);
  const [nation, setNation] = useState([]);
  const handleRating = useCallback((value) => setRating(value), []);
  const handleNation = useCallback((value) => setNation(value), []);
  const handleHasImage = useCallback((value) => {
    console.log(value);
    setHasImage(value);
  }, []);
  const handleHasContent = useCallback((value) => setHasContent(value), []);

  useEffect(() => {
    setRating([]);
    setNation([]);
    setHasImage([]);
    setHasContent([]);
  }, [resetFilter]);

  // REMOVE FILTER
  const handleClearAllFilter = useCallback(() => {
    setRating([]);
    setNation([]);
    setHasImage([]);
    setHasContent([]);
    applyFilter({ rating: [], nation: [], hasContent: [], hasImage: [] });
    console.log("clear trigger!!!");
  }, []);

  const applyFilterActive = [rating, hasImage, hasContent, nation].some(
    (el) => el.length !== 0,
  );

  return (
    <div>
      <Box
        style={{
          display: "flex",
          padding: "0 1rem 1rem 1rem",
        }}
      >
        <div style={{ display: "flex" }}>
          <RatingFilter
            rating={tagFilter.rating}
            onChange={handleRating}
            selected={rating}
          />
          <HasContentFilter
            onChange={handleHasContent}
            hasContent={hasContent}
            clearSelected={() => {
              handleHasContent([]);
              applyFilter({ hasImage, nation, hasContent: [], rating });
            }}
          />
          <HasPhotosFilter
            key="has_Image_unique"
            hasPhotos={hasImage}
            onChange={handleHasImage}
            clearSelected={() => {
              handleHasImage([]);
              applyFilter({ hasImage: [], nation, hasContent, rating });
            }}
          />

          <NationFilter
            nation={tagFilter.nation}
            onChange={handleNation}
            selected={nation}
          />
        </div>
        <div>
          <Button
            icon={DeleteIcon}
            variant="tertiary"
            onClick={handleClearAllFilter}
            disabled={!applyFilterActive}
          >
            Clear all
          </Button>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Button
            icon={StatusActiveIcon}
            disabled={!applyFilterActive}
            onClick={() =>
              applyFilter({ rating, hasImage, hasContent, nation })
            }
          >
            Apply Filter
          </Button>
        </div>
      </Box>
      {applyFilterActive && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              height: `${hasContent.length || hasImage.length || rating.length ? "fit-content" : 0}`,
            }}
          >
            <TagHasContent hasContent={hasContent} />
            <TagImage hasPhotos={hasImage} />
            <TagRating rating={rating} />
          </div>
          <TagNation nation={nation} />
        </div>
      )}
    </div>
  );
}

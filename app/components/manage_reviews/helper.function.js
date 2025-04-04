import { url } from "../../utils/config";

export const formatDate = (input) => {
  const date = new Date(input);
  const formatted = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);

  return formatted;
};

export const deleteImage = (reviews, reviewId, img) => {
  const updated = reviews.map((review) => {
    if (review.id === reviewId) {
      return {
        ...review,
        review_image: review.review_image.filter((item) => item !== img),
      };
    }
    return review;
  });
  return updated;
};

export const navigateTableData = async ({
  productId,
  sortBy = "id",
  filter = {},
  cursorBase = {},
  direction = null,
  order = "ASC",
}) => {
  try {
    const { start, id, date = null, rate = null } = cursorBase;
    const {
      hasImage = [],
      hasContent = [],
      rating = [],
      countries = [],
    } = filter;

    const response = await fetch(
      `${url}/manage/getReviewsByProduct?shopify_product_id=${productId}`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopify_product_id: productId,
          cursor: {
            id,
            range: { start },
            rating: rate,
            date,
          },
          direction,
          sortBy,
          hasImage,
          hasContent,
          countries,
          rating,
          order,
        }),
      },
    );
    const results = await response.json();
    // console.log(results);
    return results;
  } catch (error) {
    console.error("Trigger navigation table failed: ", error);
    return { reviews: [], pagination: null };
  }
};

export const deleteReviews = async (reviewIds) => {
  try {
    const response = await fetch(`${url}/manage/deleteReviews`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reviewIds }),
    });
    const results = await response.json();
    return results;
  } catch (error) {
    console.error("Trigger delete reviews failed: ", error);
  } finally {
    return null;
  }
};

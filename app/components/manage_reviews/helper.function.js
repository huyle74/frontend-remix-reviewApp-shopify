import { url } from "../../utils/config";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

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
  cursor = null,
  direction = "next",
  order = "ASC",
}) => {
  try {
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
          cursor,
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
    return results;
  } catch (error) {
    console.error("Trigger navigation table failed: ", error);
    return { reviews: [], pagination: null, nations: [] };
  }
};

export const deleteReviewsBackend = async (id, productId) => {
  try {
    console.log(id, productId);
    const response = await fetch(
      `${url}/manage/deleteReviews?shopify_product_id=${productId}&id=${id}`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          shopify_product_id: productId,
        }),
      },
    );
    const results = await response.json();
    return results;
  } catch (error) {
    console.error("Trigger delete reviews failed: ", error);
  } finally {
    return null;
  }
};

export function exportCSV(reviews, selectedResources) {
  const selectedReviews = reviews.filter((review) =>
    new Set(selectedResources).has(review.id),
  );
  const rowCsv = [];
  const head = Object.keys(selectedReviews[0]);
  const headers = head.filter(
    (head) =>
      head !== "id" &&
      head !== "avatar" &&
      head !== "id" &&
      head !== "platform_id" &&
      head !== "shop_id" &&
      head !== "shopify_product_id" &&
      head !== "review_id" &&
      head !== "product_id",
  );
  rowCsv.push(headers.join(","));

  selectedReviews.forEach((review) => {
    const value = headers.map((header) => {
      return `"${review[header]}"`;
    });
    rowCsv.push(value.join(","));
  });
  const stringCsv = rowCsv.join("\n");
  const blob = new Blob([stringCsv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "review.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// CONVERT NATION FLAG

export const nationToFlag = (countryName) => {
  if (countryName == "the United States") {
    return `https://flagcdn.com/w40/us.png`
  } else if (countryName == "European Union") {
    return `https://flagcdn.com/w40/eu.png`;
  }

  const code = countries.getAlpha2Code(countryName, "en");
  if (!code) return "🌐";

  return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
};

export default function exportCSV(reviews, selectedResources) {
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
      head !== "shopify_product_id",
  );
  rowCsv.push(headers.join(","));

  selectedReviews.forEach((review) => {
    const value = headers.map((header) => {
      console.log(review[header]);
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

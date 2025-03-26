import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useLoaderData } from "@remix-run/react";
import { useAppBridge } from "@shopify/app-bridge-react";
import {
  Card,
  IndexTable,
  Page,
  useIndexResourceState,
} from "@shopify/polaris";
import { authenticate } from "../../shopify.server";
import AnnouncePlan from "../../components/preview/announcePlan";
import ModalPreview from "../../components/preview/modalPreview";
import RowIndexTable from "../../components/preview/rowIndexTable";
import ModalWarning from "../../components/preview/warningModal";
import LoadingSpinner from "../../components/preview/loadingSpinner";
import FilterFunction from "../../components/preview/filter";

export const loader = async ({ request }) => {
  const { billing } = await authenticate.admin(request);
  const bill = await billing.check();
  const checkBill = bill.hasActivePayment;
  return { checkBill };
};

export default function PreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const shopify = useAppBridge();
  const { checkBill } = useLoaderData();
  const [initData, setInitData] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [idSelect, setIdSelect] = useState(null);
  const [exported, setExported] = useState(false);
  const [nationArray, setNationArray] = useState(null);
  const [loading, setLoading] = useState(false);
  // FILTER

  useEffect(() => {
    setLoading(true);

    if (location.state === null) {
      navigate("/app/import_review");
    } else {
      setReviews(location.state);
      setInitData(location.state);
      if (new Set(location.state.map((r) => r.id)).size !== reviews.length) {
        console.warn("🚨 Duplicate or missing IDs found in reviews");
      }
      const nation = [...new Set(location.state.map((item) => item.nation))];
      setNationArray(nation);
    }
    const loadingTime = setTimeout(() => {
      console.log(location.state);
      setLoading(false);
    }, 3000);
    return () => {
      clearTimeout(loadingTime);
    };
  }, []);

  useEffect(() => {
    if (exported === true) {
      const selectedReviews = reviews.filter((review) =>
        new Set(selectedResources).has(review.id),
      );
      const rowCsv = [];
      const head = Object.keys(selectedReviews[0]);
      const headers = head.filter((head) => head !== "id" && head !== "avatar");
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
      navigate("/app/import_review_product");
    }
  }, [exported]);

  const handleDiscard = useCallback(() => navigate(-1), []);
  const {
    selectedResources,
    allResourcesSelected,
    handleSelectionChange,
    clearSelection,
  } = useIndexResourceState(reviews, {
    resourceIDResolver: (review) => review.id,
  });
  const resourceName = {
    singular: "review",
    plural: "reviews",
  };
  const handleDeleteReviews = useCallback((id) => {
    shopify.modal.show("delete-review");
    setIdSelect(id);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    const newReviews = initData.filter(
      (review) => !new Set(selectedResources).has(review.id),
    );
    console.log(newReviews);
    setReviews(newReviews);
    setInitData(newReviews);
    shopify.modal.hide("delete-review");
  }, []);

  const handleConfirmDeleteBulkAction = useCallback(() => {
    const newReviews = initData.filter(
      (review) => !new Set(selectedResources).has(review.id),
    );
    console.log("after remove items >> ", newReviews);
    setReviews(newReviews);
    setInitData(newReviews);
    shopify.modal.hide("delete-review-all");
    clearSelection();
  }, []);

  const handleConfirmExport = useCallback(() => {
    setExported(true);
    shopify.modal.hide("export-reviews");
    console.log("Confirm export!");
  }, []);

  const handleModalExport = useCallback(() => {
    if (selectedResources.length === 0) {
      shopify.modal.show("warning-export");
    } else {
      shopify.modal.show("export-reviews");
    }
  }, []);

  const handleApplyFilter = (filter) => {
    setLoading(true);
    console.log(initData);
    const { rating, hasImage, hasContent, nation } = filter;
    const removeFilter = [rating, hasImage, hasContent, nation].every(
      (item) => item.length === 0,
    );
    console.log(removeFilter);
    if (!removeFilter) {
      console.log("clicked");
      let filterContent, filterImages;
      const filteredReviews = initData.filter((review) => {
        const filterNation =
          nation.length === 0 || nation.includes(review.nation);
        const filterRating =
          rating.length === 0 || rating.includes(review.rating);
        if (hasContent[0]) {
          filterContent =
            hasContent.length === 0 || review.review_content.length !== 0;
        } else {
          filterContent =
            hasContent.length === 0 || review.review_content.length === 0;
        }
        if (hasImage[0]) {
          filterImages =
            hasImage.length === 0 || review.review_image.length !== 0;
        } else {
          filterImages =
            hasImage.length === 0 || review.review_image.length == 0;
        }

        console.log(filterNation, filterRating, filterContent);
        return filterNation && filterRating && filterContent && filterImages;
      });
      const reviews = [...filteredReviews];
      console.log(nation, rating, hasContent, hasImage, filteredReviews);
      const timeout = setTimeout(() => {
        setReviews(reviews);
        setLoading(false);
      }, 2000);
    } else {
      console.log("Clicked");
      console.log(initData);
      setReviews(initData);
      setLoading(false);
    }
  };

  return (
    <Page
      fullWidth
      backAction={{
        content: "Products",
        onAction: () => shopify.modal.show("discard-modal"),
      }}
      title="Preview reviews detail"
      additionalMetadata={<AnnouncePlan billing={checkBill} />}
      primaryAction={{
        content: "Export",
        onAction: handleModalExport,
      }}
      secondaryActions={[
        {
          content: "Discard",
          onAction: () => shopify.modal.show("discard-modal"),
        },
      ]}
    >
      <div style={{ position: "relative", marginBottom: "30px" }}>
        <Card>
          {exported === true && <LoadingSpinner />}
          <FilterFunction
            allNation={nationArray}
            applyFilter={handleApplyFilter}
          />
          <IndexTable
            promotedBulkActions={[
              {
                content: "Delete",
                onAction: () => shopify.modal.show("delete-review-all"),
              },
              {
                content: "Export",
                onAction: () => shopify.modal.show("export-reviews"),
              },
            ]}
            loading={loading}
            resourceName={resourceName}
            itemCount={reviews?.length}
            headings={[
              {
                title: (
                  <div>
                    All reviews - Total reviews:{" "}
                    <span style={{ fontWeight: 1000, color: "#d2554a" }}>
                      {reviews?.length}
                    </span>
                  </div>
                ),
              },
              {
                title: (
                  <div
                    style={{
                      textAlign: "end",
                      marginRight: "20px",
                    }}
                  >
                    Action
                  </div>
                ),
              },
              { title: "" },
            ]}
            onSelectionChange={handleSelectionChange}
            selectedItemsCount={
              allResourcesSelected ? "All" : selectedResources.length
            }
          >
            <RowIndexTable
              reviews={reviews}
              selectedResources={selectedResources}
              onClick={(id) => handleDeleteReviews(id)}
            />
          </IndexTable>
        </Card>
      </div>
      <ModalPreview
        shopify={shopify}
        onClick={handleDiscard}
        title={"Discard Preview"}
        id={"discard-modal"}
        button={"Discard"}
        message={"All reviews will be lost"}
      />
      <ModalPreview
        shopify={shopify}
        onClick={handleConfirmDelete}
        title={"Delete review"}
        id={"delete-review"}
        button={"Delete"}
        message={"Are you sure want to delete this review"}
      />
      <ModalPreview
        shopify={shopify}
        onClick={handleConfirmDeleteBulkAction}
        title={"Delete review"}
        id={"delete-review-all"}
        button={"Delete"}
        message={"Are you sure want to delete this review"}
      />
      <ModalPreview
        shopify={shopify}
        onClick={handleConfirmExport}
        title={"Export Reviews"}
        id={"export-reviews"}
        button={"Confirm"}
        message={"Are you sure want to export selected reviews?"}
      />
      <ModalWarning shopify={shopify} />
    </Page>
  );
}

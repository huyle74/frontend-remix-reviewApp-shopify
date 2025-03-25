import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "@remix-run/react";
import { useAppBridge } from "@shopify/app-bridge-react";
import {
  Card,
  IndexTable,
  Page,
  useIndexResourceState,
} from "@shopify/polaris";
import AnnouncePlan from "../../components/preview/announcePlan";
import ModalPreview from "../../components/preview/modalPreview";
import RowIndexTable from "../../components/preview/rowIndexTable";
import ModalWarning from "../../components/preview/warningModal";
import LoadingSpinner from "../../components/preview/loadingSpinner";

export default function PreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const shopify = useAppBridge();
  const [reviews, setReviews] = useState([]);
  const [idSelect, setIdSelect] = useState(null);
  const [exported, setExported] = useState(false);

  useEffect(() => {
    if (location.state === null) {
      navigate("/app/import_review");
    }
    setReviews(location.state);
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

  const handleConfirmDelete = () => {
    setReviews((preReviews) =>
      preReviews.filter((review) => review.id !== idSelect),
    );
    shopify.modal.hide("delete-review");
  };

  const handleConfirmDeleteBulkAction = () => {
    setReviews((preReviews) =>
      preReviews.filter((review) => !new Set(selectedResources).has(review.id)),
    );
    shopify.modal.hide("delete-review-all");
    clearSelection();
  };

  const handleConfirmExport = () => {
    setExported(true);
    shopify.modal.hide("export-reviews");
    console.log("Confirm export!");
  };

  const handleModalExport = () => {
    if (selectedResources.length === 0) {
      shopify.modal.show("warning-export");
    } else {
      shopify.modal.show("export-reviews");
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
      additionalMetadata={<AnnouncePlan />}
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
            loading={!reviews?.length}
            resourceName={resourceName}
            itemCount={reviews?.length}
            headings={[
              {
                title: (
                  <div>
                    All reviews - Total reviews:{" "}
                    <span style={{ fontWeight: 1000, color: "#d2554a" }}>
                      {reviews.length}
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

import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useLoaderData } from "@remix-run/react";
import { useAppBridge } from "@shopify/app-bridge-react";
import {
  Card,
  IndexTable,
  Page,
  useIndexResourceState,
  Text,
} from "@shopify/polaris";
import { authenticate } from "../../shopify.server";
import AnnouncePlan from "../../components/preview/announcePlan";
import ModalPreview from "../../components/preview/modalPreview";
import RowIndexTable from "../../components/preview/rowIndexTable";
import ModalWarning from "../../components/preview/warningModal";
import LoadingSpinner from "../../components/preview/loadingSpinner";
import FilterFunction from "../../components/preview/filter";
import exportCSV from "../../components/preview/exportCSVFile";
import { url } from "../../utils/config";

export const loader = async ({ request }) => {
  const { billing, session } = await authenticate.admin(request);
  const bill = await billing.check();
  const checkBill = bill.hasActivePayment;
  console.log(session);
  const shop = session.shop.split(".");
  console.log(shop);

  return { checkBill, shop_id: shop[0] };
};

export default function PreviewPage() {
  const location = useLocation();
  let reviews = [],
    review_id;
  if (location.state !== null) {
    reviews = location.state.reviews;
    review_id = location.state.review_id;
  }
  const navigate = useNavigate();
  const shopify = useAppBridge();
  const { checkBill, shop_id } = useLoaderData();
  const [allReviews, setAllReviews] = useState(reviews);
  const [idSelect, setIdSelect] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tag, setTag] = useState({
    nation: [],
    hasImage: [],
    hasContent: [],
    rating: [],
  });
  const [resetFilter, setResetFilter] = useState(false);

  // FILTER tag
  const handleFilterTag = (newReviews) => {
    const nation = [...new Set(newReviews.map((item) => item.nation))];
    const rating = [...new Set(newReviews.map((item) => item.rating))].sort(
      (a, b) => a - b,
    );
    const hasImage = newReviews.some((item) => item.review_image.length > 0)
      ? [true, false]
      : [];
    const hasContent = newReviews.some((item) => item.review_content.length > 0)
      ? [true, false]
      : [];
    setTag({ nation, hasImage, hasContent, rating });
  };

  useEffect(() => {
    setLoading(true);
    if (location.state === null) {
      navigate("/app/import_review");
    } else {
      console.log("total Reviews: ", reviews.length);
      console.log(reviews);
      handleFilterTag(reviews);
    }
    const loadingTime = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => {
      clearTimeout(loadingTime);
    };
  }, []);

  const handleDiscard = useCallback(() => navigate(-1), []);
  const {
    selectedResources,
    allResourcesSelected,
    handleSelectionChange,
    clearSelection,
  } = useIndexResourceState(allReviews, {
    resourceIDResolver: (review) => review.id,
  });
  const resourceName = {
    singular: "review",
    plural: "reviews",
  };
  const handleDeleteReviews = (id) => {
    shopify.modal.show("delete-review");
    setIdSelect(id);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${url}/preview/deleteOnePreview?review_id=${review_id}&id=${idSelect}`,
        {
          method: "post",
        },
      );
      const { success, reviews } = await response.json();
      if (success) {
        setAllReviews(reviews);
        handleFilterTag(reviews);
        handleFilter({ nation: [], rating: [], hasImage: [], hasContent: [] });
        console.log("All reviews after delete: ", reviews.length);
        shopify.modal.hide("delete-review");
        setResetFilter(!resetFilter);
        clearSelection();
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Cannot delete review by ID: ", error);
    }
  };

  const handleConfirmDeleteBulkAction = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${url}/preview/deleteMultiPreview?review_id=${review_id}`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: selectedResources }),
        },
      );
      const { success, reviews } = await response.json();
      shopify.modal.hide("delete-review-all");
      if (success) {
        handleFilterTag(reviews);
        setAllReviews(reviews);
        setResetFilter(!resetFilter);
        handleFilter({ nation: [], rating: [], hasImage: [], hasContent: [] });
        clearSelection();
      }
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Cannot delete selected ID review: ", error);
    }
  };

  const handleConfirmExport = () => {
    exportCSV(allReviews, selectedResources);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
    shopify.modal.hide("export-reviews");
  };

  const handleModalExport = useCallback(() => {
    if (selectedResources.length === 0) {
      shopify.modal.show("warning-export");
    } else {
      shopify.modal.show("export-reviews");
    }
  }, []);

  const handleFilter = async (filter) => {
    setLoading(true);
    try {
      console.log(filter);
      const response = await fetch(
        `${url}/preview/filterReviews?review_id=${review_id}`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filter),
        },
      );
      const { reviews } = await response.json();
      setAllReviews(reviews);
      // console.log(reviews);
      setTimeout(() => {
        setLoading(false);
        clearSelection();
      }, 3000);
    } catch (error) {
      console.error("Filter get stuck >>", error);
    }
  };

  const handleImportAll = async () => {
    console.log("Import all Clicked");

    try {
      const response = await fetch(
        `${url}/preview/saveReviews?shop_id=${shop_id}&review_id=${review_id}`,
        {
          method: "post",
        },
      );
      const { success } = await response.json();
      if (success) return navigate("/app");
    } catch (error) {
      console.error("Cannot save reviews: ", error);
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
          content: "Import All",
          onAction: () => shopify.modal.show("import-reviews"),
        },
      ]}
    >
      <div style={{ position: "relative", marginBottom: "30px" }}>
        <Card>
          {loading === true && <LoadingSpinner />}
          <FilterFunction
            applyFilter={handleFilter}
            disabled={loading}
            tagFilter={tag}
            resetFilter={resetFilter}
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
            itemCount={allReviews?.length}
            headings={[
              {
                title: (
                  <span style={{ display: "flex" }}>
                    All reviews - Total reviews:&nbsp;
                    <Text fontWeight="bold" tone="critical">
                      {allReviews?.length}
                    </Text>
                  </span>
                ),
              },
              {
                title: "Action",
              },
              { title: "" },
            ]}
            onSelectionChange={handleSelectionChange}
            selectedItemsCount={
              allResourcesSelected ? "All" : selectedResources.length
            }
          >
            <RowIndexTable
              reviews={allReviews}
              selectedResources={selectedResources}
              deleteById={handleDeleteReviews}
              disabled={loading}
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
      <ModalPreview
        shopify={shopify}
        onClick={handleImportAll}
        title={"Import all Reviews"}
        id={"import-reviews"}
        button={"Confirm"}
        message={"Are you sure want to import all reviews?"}
      />
      <ModalWarning shopify={shopify} />
    </Page>
  );
}

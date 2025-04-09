import { useState, useEffect } from "react";
import {
  IndexTable,
  Card,
  useIndexResourceState,
  Button,
  Badge,
  Pagination,
} from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { DeleteIcon } from "@shopify/polaris-icons";
import {
  formatDate,
  deleteImage,
  navigateTableData,
  deleteReviewsBackend,
  exportCSV,
  nationToFlag,
} from "./helper.function";
import FilterReviews from "./filterReviews";
import RatingStar from "../preview/ratingStar";
import ReviewContent from "./reviewContent";
import ReviewsPhotos from "./reviewsPhotos";
import DisplayPhotos from "./displayPhotos";
import { url } from "../../utils/config";
import ModalManageReviews from "./modal";
import LoadingSpinner from "../preview/loadingSpinner";
import Skeleton from "./skeleton";

export default function ReviewDashboard({
  data,
  pagination,
  productId,
  loading,
  nations,
}) {
  const app = useAppBridge();
  const [displayPhotos, setDisplayPhotos] = useState({ photos: [], id: 0 });
  const [reviewIdForDelete, setReviewIdForDelete] = useState({
    id: null,
    image: null,
  });
  const [reviews, setReviews] = useState([]);
  const [idForDelete, setIdForDelete] = useState([]);
  const [pageNav, setPageNav] = useState(null);
  const [showDisplay, setShowDisplay] = useState(false);
  const [lazy, setLazy] = useState(false);
  const [loadingNav, setLoadingNav] = useState(false);
  const [nationFilter, setNationFilter] = useState([]);
  const [filter, setFilter] = useState({});
  const [sortBy, setSortBy] = useState("id");
  const [orderBy, setOrderBy] = useState("ASC");
  const [start, setStart] = useState(1);

  const handleLazyLoadingNav = () => {
    setLoadingNav(true);
    setTimeout(() => {
      setLoadingNav(false);
    }, 2000);
  };

  useEffect(() => {
    setLazy(true);
    setTimeout(() => {
      setLazy(false);
    }, 2000);
    if (data) {
      setNationFilter(nations);
      setReviews(data);
      setPageNav(pagination);
    }
  }, [data]);

  const handleDisplayPhotos = (id) => {
    const [review] = reviews.filter((dt) => dt.id === id);
    setDisplayPhotos({
      photos: review?.review_image,
      id: review?.id,
    });
    setShowDisplay(true);
  };

  useEffect(() => {
    if (reviewIdForDelete.id !== null) {
      handleDisplayPhotos(reviewIdForDelete.id);
      if (displayPhotos.photos.length === 0) return setShowDisplay(false);
    }
  }, [reviews]);

  useEffect(() => {
    setStart(pageNav?.range[0]);
  }, [pageNav, reviews]);

  const handleConfirmDeletePhoto = async () => {
    try {
      const updated = deleteImage(
        reviews,
        reviewIdForDelete.id,
        reviewIdForDelete.image,
      );
      app.modal.hide("delete-image");
      setReviews(updated);
      await fetch(
        `${url}/manage/deleteImage?id=${reviewIdForDelete.id}&image=${reviewIdForDelete.image}`,
        {
          method: "post",
        },
      );
    } catch (error) {
      console.error("Delete Images get stuck", error);
    }
  };

  const handleModalDelete = (img, reviewId) => {
    console.log(img, reviewId);
    app.modal.show("delete-image");
    setReviewIdForDelete({
      id: reviewId,
      image: img,
    });
  };

  const {
    selectedResources,
    allResourcesSelected,
    handleSelectionChange,
    clearSelection,
  } = useIndexResourceState(reviews);

  const resourceName = {
    singular: "Review",
    plural: "Reviews",
  };
  const rowMarkup = reviews.map(
    (
      {
        id,
        review_content,
        review_image,
        review_name,
        date,
        rating,
        platform_id,
        nation,
      },
      index,
    ) => {
      const country = nation === "the United States" ? "United States" : nation;
      return (
        <IndexTable.Row
          id={id}
          key={id}
          position={index}
          selected={selectedResources.includes(id)}
          onClick={() => {}}
        >
          <IndexTable.Cell>{review_name?.slice(0, 15)}</IndexTable.Cell>

          <IndexTable.Cell>
            <RatingStar rating={rating} />
            <ReviewContent content={review_content} />
          </IndexTable.Cell>

          <IndexTable.Cell>
            <ReviewsPhotos
              photos={review_image}
              onClick={() => handleDisplayPhotos(id)}
            />
          </IndexTable.Cell>

          <IndexTable.Cell>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "0.4rem",
                justifyContent: "center",
              }}
            >
              <Badge tone="success">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <img
                    src={nationToFlag(nation)}
                    alt="flag"
                    style={{ width: "1rem", height: "auto" }}
                  />

                  <span style={{ color: "black" }}>{country}</span>
                </div>
              </Badge>
              <div>
                Source:&nbsp;
                {platform_id === 1 ? (
                  <Badge>Amazon</Badge>
                ) : (
                  <Badge>AliExpress</Badge>
                )}
              </div>
              <Badge tone="info">{formatDate(date)}</Badge>
            </div>
          </IndexTable.Cell>

          <IndexTable.Cell>
            <div>
              <Button
                icon={DeleteIcon}
                variant="monochromePlain"
                onClick={() => {
                  app.modal.show("delete-one-review");
                  setIdForDelete([id]);
                }}
              />
            </div>
          </IndexTable.Cell>
        </IndexTable.Row>
      );
    },
  );

  const handleDeleteReviews = async () => {
    handleLazyLoadingNav();
    console.log(idForDelete);
    const success = await deleteReviewsBackend(idForDelete, productId);
    const newReviews = reviews.filter(
      (item) => !selectedResources.includes(item.id),
    );
    setReviews(newReviews);
    setPageNav((prev) => ({
      ...prev,
      range: [prev.range[0], prev.range[1] - 1],
      totalReviews: prev.totalReviews - 1,
    }));
    app.modal.hide("delete-one-review");
  };

  const handleDeleteMultipleReviews = async () => {
    console.log(selectedResources);
    clearSelection();
    const success = await deleteReviewsBackend(selectedResources, productId);
    const newReviews = reviews.filter(
      (item) => !selectedResources.includes(item.id),
    );
    console.log(newReviews);
    if (newReviews.length === 0) {
      const { reviews, pagination, nations } = await navigateTableData({
        productId,
        cursor: null,
        start,
        order: orderBy,
        sortBy,
        filter,
      });

      setReviews(reviews);
      setPageNav(pagination);
      setNationFilter(nations);
    } else {
      setReviews(newReviews);
      setPageNav((prev) => ({
        ...prev,
        range: [
          prev.range[0],
          prev.range[1] - Number(selectedResources.length),
        ],
        totalReviews: prev.totalReviews - Number(selectedResources.length),
      }));
    }
    app.modal.hide("delete-multi-reviews");
  };

  const handlePagination = async (direction) => {
    handleLazyLoadingNav();
    clearSelection();
    const { nextCursor, prevCursor, range } = pageNav;
    const cursor =
      direction === "next"
        ? {
            id: nextCursor.id,
            range: range[1],
            rating: nextCursor.rating || null,
            date: nextCursor.date || null,
          }
        : {
            id: prevCursor.id,
            range: range[0],
            rating: prevCursor.rating || null,
            date: prevCursor.date || null,
          };
    console.log(direction, cursor, sortBy, orderBy);

    const { reviews, pagination, nations } = await navigateTableData({
      productId,
      cursor,
      direction,
      start,
      order: orderBy,
      sortBy,
      filter,
    });
    setReviews(reviews);
    setPageNav(pagination);
    setNationFilter(nations);
  };

  const handelSort = async (index) => {
    handleLazyLoadingNav();
    clearSelection();
    const sort = index === 1 ? "rating" : "date";
    setSortBy(sort);
    const order = orderBy === "ASC" ? "DESC" : "ASC";
    setOrderBy(order);
    console.log(sortBy);
    const { reviews, pagination, nations } = await navigateTableData({
      sortBy: sort,
      productId,
      order,
      filter,
    });
    setReviews(reviews);
    setPageNav(pagination);
    setNationFilter(nations);
  };

  const handleFilter = async (filter) => {
    console.log(filter);
    handleLazyLoadingNav();
    setFilter(filter);
    const { reviews, pagination, nations } = await navigateTableData({
      filter,
      productId,
    });
    setReviews(reviews);
    setPageNav(pagination);
    setNationFilter(nations);
  };

  const handleExportFile = () => {
    exportCSV(reviews, selectedResources);
    clearSelection();
    handleLazyLoadingNav();
    app.modal.hide("export-reviews");
  };

  const displayValid = showDisplay && displayPhotos.photos.length !== 0;

  return (
    <div style={{ position: "relative", padding: 0, margin: 0 }}>
      <div
        style={{
          height: `${displayValid ? "99vh" : "100%"}`,
          overflowY: `${displayValid ? "hidden" : ""}`,
          position: "relative",
        }}
      >
        {(loadingNav || loading) && <LoadingSpinner />}
        {lazy ? (
          <Skeleton />
        ) : (
          <Card>
            <FilterReviews
              handleApplyFilters={handleFilter}
              nationData={nationFilter}
            />
            <IndexTable
              promotedBulkActions={[
                {
                  content: "Delete",
                  onAction: () => app.modal.show("delete-multi-reviews"),
                },
                {
                  content: "Export CSV file",
                  onAction: () => app.modal.show("export-reviews"),
                },
              ]}
              loading={loading || lazy || loadingNav}
              onSelectionChange={handleSelectionChange}
              itemCount={reviews.length}
              resourceName={resourceName}
              selectedItemsCount={
                allResourcesSelected ? "All" : selectedResources.length
              }
              sortable={[false, true, false, true, false]}
              headings={[
                { title: "Customer" },
                { title: "Rating" },
                { title: "Photos" },
                { title: "Create At", alignment: "start" },
                { title: "" },
              ]}
              onSort={(e) => handelSort(e)}
            >
              {rowMarkup}
            </IndexTable>
            {pageNav?.hasPagination && (
              <Pagination
                onPrevious={() => handlePagination("prev")}
                onNext={() => handlePagination("next")}
                type="table"
                hasNext={pageNav.range[1] !== pageNav.totalReviews}
                hasPrevious={pageNav.range[0] !== 1}
                label={`${pageNav.range[0]}-${pageNav.range[1]} of ${pageNav.totalReviews} reviews`}
              />
            )}
          </Card>
        )}
      </div>
      <ModalManageReviews
        id="delete-image"
        shopify={app}
        title={"Delete photo"}
        message={"Are you sure to delete this photo?"}
        onClick={handleConfirmDeletePhoto}
        button={"Confirm"}
      />
      <ModalManageReviews
        id="delete-one-review"
        shopify={app}
        title={"Delete review"}
        message={"Are you sure to delete this review?"}
        onClick={handleDeleteReviews}
        button={"Confirm"}
      />
      <ModalManageReviews
        id="delete-multi-reviews"
        shopify={app}
        title={"Delete reviews"}
        message={`Are you sure to delete ${selectedResources.length} reviews?`}
        onClick={handleDeleteMultipleReviews}
        button={"Confirm"}
      />
      <ModalManageReviews
        id="export-reviews"
        shopify={app}
        title={"Export reviews"}
        message={`Are you sure to delete ${selectedResources.length} reviews?`}
        onClick={handleExportFile}
        button={"Export"}
      />
      {displayValid && (
        <DisplayPhotos
          photos={displayPhotos.photos}
          reviewId={displayPhotos.id}
          onClick={() => setShowDisplay(false)}
          clickDeletePhoto={handleModalDelete}
        />
      )}
    </div>
  );
}

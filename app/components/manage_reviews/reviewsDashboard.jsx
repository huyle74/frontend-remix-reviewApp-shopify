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
import { formatDate, deleteImage, navigateTableData } from "./helper.function";
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
}) {
  const app = useAppBridge();
  const [displayPhotos, setDisplayPhotos] = useState({ photos: [], id: 0 });
  const [reviewIdForDelete, setReviewIdForDelete] = useState({
    id: null,
    image: null,
  });
  const [reviews, setReviews] = useState([]);
  const [pageNav, setPageNav] = useState(null);
  const [sortFilter, setSortFilter] = useState({
    sort: null,
    filter: null,
    cursor: {},
    order: "ASC",
  });
  const [showDisplay, setShowDisplay] = useState(false);
  const [lazy, setLazy] = useState(false);
  const [loadingNav, setLoadingNav] = useState(false);
  const {
    selectedResources,
    allResourcesSelected,
    handleSelectionChange,
    clearSelection,
  } = useIndexResourceState(reviews);

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
      setReviews(data);
      setPageNav(pagination);
    }
  }, [data]);

  const handleDisplayPhotos = (id) => {
    const [review] = reviews.filter((dt) => dt.id === id);
    setDisplayPhotos({
      photos: review.review_image,
      id: review.id,
    });
    setShowDisplay(true);
  };

  useEffect(() => {
    if (reviewIdForDelete.id !== null) {
      handleDisplayPhotos(reviewIdForDelete.id);
      if (displayPhotos.photos.length === 0) return setShowDisplay(false);
    }
  }, [reviews]);

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

  const rowMarkup = reviews.map((dt, index) => {
    return (
      <IndexTable.Row
        id={index}
        key={`${index}-${dt.id}`}
        position={index}
        selected={selectedResources.includes(index)}
        onClick={() => {}}
      >
        <IndexTable.Cell>{dt?.review_name?.slice(0, 15)}</IndexTable.Cell>

        <IndexTable.Cell>
          <RatingStar rating={dt?.rating} />
          <ReviewContent content={dt.review_content} />
        </IndexTable.Cell>

        <IndexTable.Cell>
          <ReviewsPhotos
            photos={dt.review_image}
            onClick={() => handleDisplayPhotos(dt.id)}
          />
        </IndexTable.Cell>

        <IndexTable.Cell>
          <div style={{ marginLeft: "auto" }}>
            <div style={{ marginBottom: "0.4rem" }}>
              Source:&nbsp;
              {dt.platform === 1 ? (
                <Badge>Amazon</Badge>
              ) : (
                <Badge>AliExpress</Badge>
              )}
            </div>
            <Badge tone="info">{formatDate(dt.date)}</Badge>
          </div>
        </IndexTable.Cell>

        <IndexTable.Cell>
          <div>
            <Button icon={DeleteIcon} variant="monochromePlain" />
          </div>
        </IndexTable.Cell>
      </IndexTable.Row>
    );
  });

  const displayValid = showDisplay && displayPhotos.photos.length !== 0;
  const resourceName = {
    singular: "review",
    plural: "review",
  };

  const handlePagination = async (direction) => {
    try {
      handleLazyLoadingNav();
      const {
        id,
        date = null,
        rating = null,
      } = direction === "next" ? pageNav.nextCursor : pageNav.prevCursor;
      const start = pageNav.range[0];
      const cursorBase = { start, id, date, rating };
      console.log(direction, cursorBase.id);

      const { reviews, pagination } = await navigateTableData({
        productId,
        cursorBase,
        direction,
        start,
      });
      setReviews(reviews);
      setPageNav(pagination);
    } catch (error) {
      console.error(error);
    }
  };

  const handelSort = async (index) => {
    handleLazyLoadingNav();
    const sortBy = index === 1 ? "rating" : "date";

    const order = sortFilter.order === "ASC" ? "DESC" : "ASC";
    setSortFilter((prev) => ({ ...prev, order }));

    console.log(sortBy, sortFilter);

    const cursorBase = { id: null, start: sortFilter.cursor.start };
    const { reviews, pagination } = await navigateTableData({
      sortBy,
      cursorBase,
      productId,
      order,
    });
    setReviews(reviews);
    setPageNav(pagination);
  };

  const handleFilter = async () => {};

  const handleDeleteReviews = async () => {};

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
            <IndexTable
              loading={loading || lazy || loadingNav}
              onSelectionChange={handleSelectionChange}
              itemCount={reviews.length}
              resourceName={resourceName}
              selectedItemsCount={
                allResourcesSelected ? "All" : selectedResources.length
              }
              sortable={[false, true, false, true]}
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
                hasNext={pageNav.nextCursor !== null}
                hasPrevious={pageNav.prevCursor !== null}
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

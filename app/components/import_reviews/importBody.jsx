import { useState, useEffect } from "react";
import { IndexTable, Card, Text, Icon } from "@shopify/polaris";
import TableHeader from "./tableHeader";
import { StarIcon, StarFilledIcon } from "@shopify/polaris-icons";
import ImportForm from "./importForm";
import LoadingSpinner from "../preview/loadingSpinner";
import ViewButton from "./viewButton";

export default function ImportBody({
  data,
  handlePagination,
  handleSort,
  handleSearch,
  searchLoading,
  bill,
  shop_id,
  importedSuccess,
  updateRow,
}) {
  const [loadingButton, setLoadingButton] = useState(false);
  const [productInfo, setProductInfo] = useState([]);
  const [sort, setSort] = useState(true);
  const [idForUpdate, setIdForUpdate] = useState(null);
  const [pagination, setPagination] = useState([
    { previous: false, cursor: null },
    { next: false, cursor: null },
  ]);
  const [animation, setAnimation] = useState(null);

  useEffect(() => {
    if (data) {
      setProductInfo(data.finalProductInfo);
      const paginationInfo = [
        {
          previous: data.pageInfo?.hasPreviousPage,
          cursor: data.pageInfo?.startCursor,
        },
        {
          next: data.pageInfo?.hasNextPage,
          cursor: data.pageInfo?.endCursor,
        },
      ];
      setPagination(paginationInfo);
      let totalReviews = 0;
      for (let i = 0; i < data.length; i++) {
        if (data[i].createAt) {
          totalReviews++;
        }
      }
    }
  }, [data]);

  useEffect(() => {
    const offAnimation = setTimeout(() => {
      setAnimation(null);
    }, 7000);
    return () => {
      if (offAnimation) {
        clearTimeout(offAnimation);
      }
    };
  }, [animation]);

  useEffect(() => {
    if (updateRow !== null) {
      const newRows = productInfo.map((item) => {
        return item.id === idForUpdate
          ? {
              ...item,
              averageRating: updateRow.averageRating,
              totalReviews: updateRow.totalReviews,
            }
          : item;
      });
      setProductInfo(newRows);
    }
  }, [updateRow]);

  const rows = productInfo.map(
    ({ totalReviews, id, imageUrl, averageRating, title }, index) => {
      const animationTrigger = animation === id;
      return (
        <IndexTable.Row key={index} id={id} position={index}>
          <IndexTable.Cell>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                zIndex: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "10%",
                  justifyContent: "center",
                  marginRight: "10px",
                }}
              >
                <img
                  src={
                    imageUrl.length
                      ? imageUrl
                      : "https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE="
                  }
                  alt="product Image"
                  style={{
                    objectFit: "cover",
                    height: "40px",
                    borderRadius: "4px",
                  }}
                />
              </div>
              <Text>{title}</Text>
            </div>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex" }}>
                <Icon
                  source={!averageRating ? StarIcon : StarFilledIcon}
                  tone="emphasis"
                />
              </div>
              <span style={{ color: "#005ad2" }}>{averageRating}</span>
            </div>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <div style={{ display: "flex" }}>
              {animationTrigger && (
                <img
                  style={{
                    objectFit: "cover",
                    width: "1rem",
                    marginBottom: "auto",
                    transition: "1s ease",
                    marginLeft: "auto",
                  }}
                  slt="start"
                  src="https://png.pngtree.com/recommend-works/png-clipart/20241213/ourmid/pngtree-blink-clipart-png-image_14750315.png"
                />
              )}
              <div
                style={{
                  display: "flex",
                  marginRight: "2rem",
                  backgroundColor: animationTrigger ? "yellow" : "",
                  marginLeft: "auto",
                  borderRadius: "1rem",
                  height: "2rem",
                  width: "2rem",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "1s ease",
                }}
              >
                {totalReviews}
              </div>
            </div>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-end",
              }}
            >
              <ImportForm
                data={{ imageUrl, title }}
                bill={bill}
                shop_id={shop_id}
                productId={id}
                importedSuccess={(data) => {
                  const { totalReviews } = data;
                  if (totalReviews !== undefined) {
                    setAnimation(id);
                    setIdForUpdate(id);
                  }
                  importedSuccess({
                    totalReviews,
                    pagination,
                    productId: id,
                  });
                }}
              />
              <ViewButton
                disabled={totalReviews === 0}
                id={id}
                onClick={() => setLoadingButton(true)}
                totalReviews={totalReviews}
              />
            </div>
          </IndexTable.Cell>
        </IndexTable.Row>
      );
    },
  );

  return (
    <div style={{ zIndex: 2, position: "relative" }}>
      {loadingButton && <LoadingSpinner />}
      <Card>
        <TableHeader
          allProduct={productInfo.length}
          searchLoading={searchLoading}
          handleSearch={handleSearch}
        />
        <IndexTable
          sortable={[true, true, true]}
          className="import-review-table"
          onSort={() => {
            handleSort(sort);
            setSort(!sort);
          }}
          selectable={false}
          itemCount={productInfo?.length}
          headings={[
            { title: "Products" },
            { title: "Rating" },
            { title: "Total Reviews", alignment: "center" },
            { title: "Action", alignment: "center" },
          ]}
          pagination={{
            hasPrevious: pagination[0].previous,
            onPrevious: () => {
              handlePagination("prev", pagination[0].cursor);
            },
            hasNext: pagination[1].next,
            onNext: () => {
              handlePagination("next", pagination[1].cursor);
            },
          }}
        >
          {rows}
        </IndexTable>
      </Card>
    </div>
  );
}

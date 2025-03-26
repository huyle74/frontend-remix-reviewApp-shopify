import { useState, useEffect } from "react";
import { Box, IndexTable, Card, Text } from "@shopify/polaris";
import TableHeader from "./tableHeader";
import ImportButton from "./importButton";

export default function ImportBody({
  data,
  handlePagination,
  loading,
  handleSort,
  handleSearch,
  searchLoading,
}) {
  const [productInfo, setProductInfo] = useState([]);
  const [rowsMarkup, setRowsMarkup] = useState(null);
  const [sort, setSort] = useState(true);
  const [pagination, setPagination] = useState([
    { previous: false, cursor: null },
    { next: false, cursor: null },
  ]);

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
    if (productInfo.length) {
      const rows = productInfo.map((dt, index) => (
        <IndexTable.Row key={dt.id} id={dt.id} position={index}>
          <IndexTable.Cell>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  width: "10%",
                  justifyContent: "center",
                  marginRight: "10px",
                }}
              >
                <img
                  src={
                    dt.imageUrl.length
                      ? dt.imageUrl
                      : "https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE="
                  }
                  alt="product Image"
                  style={{
                    objectFit: "cover",
                    height: "40px",
                    borderRadius: "4px",
                  }}
                />
              </Box>
              <Text>{dt.title}</Text>
            </Box>
          </IndexTable.Cell>

          <IndexTable.Cell>
            <ImportButton id={dt.id} />
          </IndexTable.Cell>
        </IndexTable.Row>
      ));
      setRowsMarkup(rows);
    }
  }, [productInfo]);

  return (
    <Box>
      <Card>
        <TableHeader
          allProduct={productInfo.length}
          searchLoading={searchLoading}
          handleSearch={handleSearch}
        />
        <IndexTable
          loading={loading}
          className="import-review-table"
          onSort={() => {
            handleSort(sort);
            setSort(!sort);
          }}
          selectable={false}
          itemCount={productInfo?.length}
          headings={[{ title: "Products" }, { title: "" }]}
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
          {rowsMarkup}
        </IndexTable>
      </Card>
    </Box>
  );
}

import { useState, useEffect, useCallback } from "react";
import { Box, IndexTable, Card, Text, Icon } from "@shopify/polaris";
import TableHeader from "./tableHeader";
import ImportButton from "./importButton";
import { starTable, starTableNoFill } from "../../utils/icon";

export default function ImportBody({ data }) {
  const [productInfo, setProductInfo] = useState([]);
  const [headerData, setHeaderData] = useState({
    products: 0,
    reviews: 0,
    noReviews: 0,
  });
  const [loading, setLoading] = useState(false);
  const [rowsMarkup, setRowsMarkup] = useState(null);
  const [sort, setSort] = useState("asc");

  useEffect(() => {
    if (data) {
      setProductInfo(data);

      let totalReviews = 0;
      for (let i = 0; i < data.length; i++) {
        if (data[i].createAt) {
          totalReviews++;
        }
      }
      const allProducts = data.length;
      const noReviews = allProducts - totalReviews;
      setHeaderData({
        reviews: totalReviews,
        noReviews: noReviews,
        products: allProducts,
      });
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
            <Box style={{ display: "flex", alignItems: "center" }}>
              <img
                src={dt.totalReviews ? starTable : starTableNoFill}
                alt="star icon"
                style={{
                  objectFit: "cover",
                  height: "15px",
                  marginRight: "5px",
                }}
              />
              <Box>{dt.averageRating}</Box>
              <Box style={{ marginLeft: "10px" }}>
                ({dt.totalReviews} Published)
              </Box>
            </Box>
          </IndexTable.Cell>
          <IndexTable.Cell>{dt.totalReviews}</IndexTable.Cell>
          <IndexTable.Cell>{dt.createAt}</IndexTable.Cell>
          <IndexTable.Cell>
            <ImportButton id={dt.id} />
          </IndexTable.Cell>
        </IndexTable.Row>
      ));
      setRowsMarkup(rows);
    }
  }, [productInfo]);

  const handleSorted = useCallback(
    (index) => {
      setProductInfo(sortedProducts(productInfo, index));
    },
    [sort, productInfo],
  );

  const sortedProducts = (rows, index) => {
    const sortType = sort === "asc" ? "desc" : "asc";
    setSort(sortType);
    const sorted = [...rows].sort((a, b) => {
      const columns = ["title", "averageRating", "totalReviews", "createAt"];
      const key = columns[index];

      const aValue = a[key] || "";
      const bValue = b[key] || "";

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortType === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }
    });
    return sorted;
  };

  return (
    <Box>
      <Card>
        <TableHeader
          reviews={headerData.reviews}
          allProduct={headerData.products}
          noReviews={headerData.noReviews}
        />
        <IndexTable
          className="import-review-table"
          onSort={handleSorted}
          selectable={false}
          sortable={[true, true, true, true]}
          itemCount={productInfo.length}
          headings={[
            { title: "Products" },
            { title: "Reviews" },
            { title: "Total Reviews" },
            { title: "Create At" },
            { title: "" },
          ]}
        >
          {rowsMarkup}
        </IndexTable>
      </Card>
    </Box>
  );
}

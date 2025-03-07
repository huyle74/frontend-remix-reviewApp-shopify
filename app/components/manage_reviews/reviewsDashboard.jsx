import {
  Box,
  IndexTable,
  Card,
  useIndexResourceState,
  Badge,
  Text,
  Button,
} from "@shopify/polaris";
import ratingStar from "./ratingStar";

export default function ReviewDashboard({ data }) {
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(data);

  const rowMarkup = data.map((dt, index) => {
    return (
      <IndexTable.Row
        id={index}
        key={index}
        position={index}
        selected={selectedResources.includes(index)}
      >
        <IndexTable.Cell>
          {dt.username.length > 30 ? dt.username.slice(0, 25) : dt.username}
        </IndexTable.Cell>
        <IndexTable.Cell>{dt.date}</IndexTable.Cell>
        <IndexTable.Cell>
          <Box>{ratingStar(dt.rating)}</Box>
          <Box
            style={{
              wordWrap: "break-word",
              whiteSpace: "normal",
              marginTop: "10px",
            }}
          >
            {dt.userReview}
          </Box>
        </IndexTable.Cell>

        <IndexTable.Cell>
          <Button size="large">Published</Button>
        </IndexTable.Cell>
      </IndexTable.Row>
    );
  });

  return (
    <Card>
      <IndexTable
        onSelectionChange={handleSelectionChange}
        itemCount={data.length}
        headings={[
          { title: "Customer" },
          { title: "Create at" },
          { title: "Rating" },
          { title: "Status" },
        ]}
      >
        {rowMarkup}
      </IndexTable>
    </Card>
  );
}

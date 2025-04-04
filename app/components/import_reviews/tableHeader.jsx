import { useState, useCallback } from "react";
import { Box, Button, TextField, Form, FormLayout } from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";

export default function TableHeader({
  allProduct,
  handleSearch,
  searchLoading,
}) {
  const [value, setValue] = useState("");
  const handleChange = useCallback((value) => setValue(value), []);

  return (
    <div
      style={{
        display: "flex",
        marginBottom: "10px",
        justifyContent: "space-between",
      }}
    >
      <div style={{ margin: "0.5rem" }}>
        All Products <span className="button-number">{allProduct}</span>
      </div>
      <Form onSubmit={() => handleSearch(value)}>
        <FormLayout>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ marginRight: "5px" }}>
              <Button submit icon={SearchIcon} variant="tertiary" />
            </div>
            <TextField
              placeholder="Search by product name"
              value={value}
              onChange={handleChange}
              autoComplete="off"
              loading={searchLoading}
            />
          </div>
        </FormLayout>
      </Form>
    </div>
  );
}

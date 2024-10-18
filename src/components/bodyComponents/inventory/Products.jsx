import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Product from "./Product";
import { DataGrid } from "@mui/x-data-grid";

let baseURL = "https://35lhslhd-3000.inc1.devtunnels.ms";

export default function Products() {
  const columns = [
    {
      field: "item_id",
      headerName: "ID",
      width: 90,
      description: "ID of the product",
    },
    {
      field: "item_name", // Update to match the property from your API
      headerName: "Product",
      width: 400,
      renderCell: (cellData) => {
        console.log("The cell data is:", cellData.row.item_name);
        return <Product productName={cellData.row.item_name} />;
      },
    },
    // {
    //   field: "category",
    //   headerName: "Category",
    //   width: 200,
    //   description: "Category of the product",
    // },
    // {
    //   field: "price",
    //   headerName: "Price",
    //   width: 150,
    //   description: "Price of the product",
    //   valueGetter: (params) => "$" + params.row.price, // Change to params.row.price
    // },
    {
      field: "stock_quantity",
      headerName: "Stock",
      width: 200,
      description: "How many items in stock",
      // valueGetter: (params) => params.row.stock_quantity + " pcs",
    },
  ];

  const [items, setItems] = useState([]); // State to hold inventory items

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch(`${baseURL}/inventory`); // Fetching data from /inventory
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json(); // Parse the JSON from the response
        setItems(data); // Update the state with fetched data
      } catch (error) {
        console.error("Error fetching inventory:", error); // Log any error
      }
    };

    fetchInventory(); // Call the function to fetch data
  }, []);

  return (
    <div>
      {/* <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Products
      </Typography> */}
      <DataGrid
        sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0 }}
        rows={items} // Use the fetched items
        columns={columns}
        getRowId={(row) => row.item_id} // Specify the custom id
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
      />
    </div>
  );
}

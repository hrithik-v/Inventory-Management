import { Avatar, Box, Button, Modal, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import OrderModal from "./OrderModal";

let baseURL = "https://35lhslhd-3000.inc1.devtunnels.ms"; // Replace with your actual API endpoint

const OrderList = () => {
  const [orders, setOrders] = useState([]); // State to hold orders
  const [order, setOrder] = useState({}); // State to hold the selected order
  const [open, setOpen] = useState(false); // State to control modal visibility

  // Function to fetch orders from the API
  const fetchOrders = async () => {
    try {
      const response = await fetch(`${baseURL}/transactions`); // Adjust the endpoint as necessary
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setOrders(data); // Update state with fetched orders
    } catch (error) {
      console.error("Error fetching orders:", error); // Log any errors
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrderDetail = (order) => {
    console.log("The order is:", order);
    setOrder(order); // Set the selected order
    setOpen(true); // Open the modal
  };

  const handleClose = () => {
    setOpen(false); // Close the modal
  };

  const columns = [
    {
      field: "txn_id",
      headerName: "txn_id",
      width: 90,
      // valueGetter: (params) => params.row.customer.mobile,
    },
    // {
    //   field: "item_id",
    //   headerName: "Item Id",
    //   width: 90,
    // },
    {
      field: "item_name",
      headerName: "item_name",
      width: 250,
    },
    {
      field: "qty",
      headerName: "qty",
      width: 90,
    },
    {
      field: "txn_type",
      headerName: "txn_type",
      width: 150,
    },
    {
      field: "txn_date",
      headerName: "Txn Date",
      width: 300,
      description: "",
      valueGetter: (params) => {
        const dateStr = params.row.txn_date; // Assuming txn_date is in ISO format
        const date = new Date(dateStr); // Convert the string to a Date object
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }); // Format the date to 'Month Day, Year' (e.g., 'September 30, 2024')
      },
    },
  ];

  return (
    <Box
      sx={{
        margin: 3,
        bgcolor: "white",
        borderRadius: 2,
        padding: 3,
        height: "100%",
      }}
    >
      <DataGrid
        sx={{
          borderLeft: 0,
          borderRight: 0,
          borderRadius: 0,
        }}
        rows={orders} // Set fetched orders as rows
        getRowId={(row) => row.txn_id} // Specify the custom id
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[15, 20, 30]}
        rowSelection={false}
      />
      <Modal open={open} onClose={handleClose}>
        <Box>
          <OrderModal order={order} />{" "}
          {/* Pass the selected order to the modal */}
        </Box>
      </Modal>
    </Box>
  );
};

export default OrderList;

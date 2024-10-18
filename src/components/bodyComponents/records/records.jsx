import { DeleteOutline, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

export default function Records() {
  const [order, setOrder] = useState({
    id: 123, // Unique order ID
    customer: {
      name: "ADMI ZAKARYAE",
      position: "Software Engineer",
      mobile: "+212 6 51 88 61 51",
    },
    products: [
      { id: 1, product: { name: "Product A", stock: 10 }, quantity: 2 },
      { id: 2, product: { name: "Product B", stock: 5 }, quantity: 1 },
      { id: 3, product: { name: "Product C", stock: 7 }, quantity: 3 },
    ],
  });

  const [newTxn, setNewTxn] = useState({
    product: { name: "", stock: 0 },
    quantity: 0,
  });
  const [editIndex, setEditIndex] = useState(null); // Index for editing
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog state

  // Handle opening the dialog for adding or editing
  const handleOpenDialog = (txn = null) => {
    if (txn) {
      setNewTxn(txn); // Edit mode
      setEditIndex(txn.id);
    } else {
      setNewTxn({ product: { name: "", stock: 0 }, quantity: 0 }); // Add mode
      setEditIndex(null);
    }
    setIsDialogOpen(true);
  };

  // Handle closing the dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  // Handle adding a new transaction (product)
  const handleAddTxn = () => {
    if (newTxn.product.name && newTxn.quantity > 0) {
      setOrder((prevOrder) => ({
        ...prevOrder,
        products: [
          ...prevOrder.products,
          { ...newTxn, id: prevOrder.products.length + 1 },
        ],
      }));
      handleCloseDialog();
    }
  };

  // Handle saving the edited transaction
  const handleSaveEditTxn = () => {
    const updatedProducts = order.products.map((txn) =>
      txn.id === editIndex ? newTxn : txn
    );
    setOrder((prevOrder) => ({
      ...prevOrder,
      products: updatedProducts,
    }));
    handleCloseDialog();
  };

  // Handle deleting a transaction
  const handleDeleteTxn = (id) => {
    const filteredTxns = order.products.filter((txn) => txn.id !== id);
    setOrder((prevOrder) => ({
      ...prevOrder,
      products: filteredTxns,
    }));
  };

  // Columns configuration for DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "product.name",
      headerName: "Product Name",
      width: 200,
      valueGetter: (params) => params.row.product.name,
    },
    { field: "quantity", headerName: "Quantity", width: 130 },
    {
      field: "product.stock",
      headerName: "Stock Availability",
      width: 160,
      valueGetter: (params) => params.row.product.stock,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleOpenDialog(params.row)}>
            <Edit color="primary" />
          </IconButton>
          <IconButton onClick={() => handleDeleteTxn(params.row.id)}>
            <DeleteOutline color="error" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ p: 6 }}>
      <Box
        sx={{
          borderRadius: 2,
          color: "black",
          display: "flex",
          flexDirection: "column",
          bgcolor: "white",
          p: 4,
        }}
      >
        <Typography variant="h6" sx={{ m: 3 }}>
          Order List
        </Typography>

        {/* DataGrid for Transactions */}
        <Paper sx={{ height: 400, width: "100%", mb: 3 }}>
          <DataGrid
            rows={order.products}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            autoHeight
          />
        </Paper>

        {/* Add Transaction Button */}
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Add Transaction
        </Button>

        {/* Dialog for Add/Edit Transaction */}
        <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>
            {editIndex !== null ? "Edit Transaction" : "Add Transaction"}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Product Name"
              value={newTxn.product.name}
              onChange={(e) =>
                setNewTxn({
                  ...newTxn,
                  product: { ...newTxn.product, name: e.target.value },
                })
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Quantity"
              type="number"
              value={newTxn.quantity}
              onChange={(e) =>
                setNewTxn({ ...newTxn, quantity: parseInt(e.target.value) })
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Stock Availability"
              type="number"
              value={newTxn.product.stock}
              onChange={(e) =>
                setNewTxn({
                  ...newTxn,
                  product: {
                    ...newTxn.product,
                    stock: parseInt(e.target.value),
                  },
                })
              }
              fullWidth
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            {editIndex !== null ? (
              <Button onClick={handleSaveEditTxn} variant="contained">
                Save
              </Button>
            ) : (
              <Button onClick={handleAddTxn} variant="contained">
                Add
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Approve/Reject Buttons */}
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            m: 0,
          }}
        >
          <Button
            variant="contained"
            sx={{ bgcolor: "error.main", m: 3, px: 12 }}
          >
            Reject
          </Button>
          <Button variant="contained" sx={{ bgcolor: "#504099", m: 3, px: 12 }}>
            Approve
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}

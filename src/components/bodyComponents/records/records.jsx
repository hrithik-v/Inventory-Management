import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
  FormControlLabel,
  Switch,
  CircularProgress,
} from "@mui/material";
import React, { useState, useEffect } from "react";

let baseURL = "https://35lhslhd-3000.inc1.devtunnels.ms";

export default function Records() {
  const [itemId, setItemId] = useState("");
  const [itemName, setItemName] = useState("");

  const [departmentId, setDepartmentId] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [personName, setPersonName] = useState("");
  const [labName, setLabName] = useState("");

  const [supplierId, setSupplierId] = useState("");
  const [manufacturerName, setManufacturerName] = useState("");
  const [supplierName, setSupplierName] = useState("");

  const [itemSuggestions, setItemSuggestions] = useState([]);
  const [supplierSuggestions, setSupplierSuggestions] = useState([]);
  const [departmentSuggestions, setDepartmentSuggestions] = useState([]);

  const [isInward, setIsInward] = useState(true);
  const [txnType, setTxnType] = useState("inward");
  const [qty, setQty] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [txnDate, setTxnDate] = useState("");
  const [allItems, setAllItems] = useState([]);
  const [allSuppliers, setAllSuppliers] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [loading, setLoading] = useState(false); // Loader state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsResponse = await fetch(`${baseURL}/items_names`);
        const itemsData = await itemsResponse.json();
        setAllItems(itemsData);

        const suppliersResponse = await fetch(`${baseURL}/supp_names`);
        const suppliersData = await suppliersResponse.json();
        setAllSuppliers(suppliersData);

        const departmentsResponse = await fetch(`${baseURL}/dept_names`);
        const departmentsData = await departmentsResponse.json();
        setAllDepartments(departmentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleItemNameChange = (event) => {
    const query = event.target.value.toLowerCase();
    setItemName(query);

    if (query.length > 0) {
      const suggestions = allItems.filter((item) =>
        item.item_name.toLowerCase().includes(query)
      );
      setItemSuggestions(suggestions);
    } else {
      setItemSuggestions([]);
    }
  };

  const handleSupplierChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSupplierName(query);

    if (query.length > 0) {
      const suggestions = allSuppliers.filter((supplier) =>
        supplier.supp_name.toLowerCase().includes(query)
      );
      setSupplierSuggestions(suggestions);
    } else {
      setSupplierSuggestions([]);
    }
  };

  const handleDepartmentChange = (event) => {
    const query = event.target.value.toLowerCase();
    setDepartmentName(query);

    if (query.length > 0) {
      const suggestions = allDepartments.filter((department) =>
        department.dept_name.toLowerCase().includes(query)
      );
      setDepartmentSuggestions(suggestions);
    } else {
      setDepartmentSuggestions([]);
    }
  };
  const handlePersonChange = (event) => {
    const query = event.target.value;
    setPersonName(query);
  };
  const handleLabChange = (event) => {
    const query = event.target.value;
    setLabName(query);
  };

  const handleSuggestionClick = (suggestion) => {
    setItemId(suggestion.item_id);
    setItemName(suggestion.item_name);
    setItemSuggestions([]);
  };

  const handleSupplierClick = (suggestion) => {
    setSupplierId(suggestion.supp_id);
    setSupplierName(suggestion.supp_name);
    setSupplierSuggestions([]);
  };

  const handleDepartmentClick = (suggestion) => {
    setDepartmentId(suggestion.dept_id);
    setDepartmentName(suggestion.dept_name);
    setDepartmentSuggestions([]);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const newRecord = {
      item_id: itemId,
      txn_type: txnType,
      qty: parseInt(qty),
      item_price: txnType === "inward" ? parseInt(pricePerUnit) : null,
      dept_id: txnType === "issued" ? departmentId : null,
      person_name: txnType === "issued" ? personName : null,
      lab_name: txnType === "issued" ? labName : null,
      supp_id: txnType === "inward" ? supplierId : null,
    };

    setLoading(true); // Start loader

    fetch(`${baseURL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRecord),
    })
      .then((response) => {
        if (response.ok) {
          return response.json().then((data) => {
            setSnackbarMessage("Transaction added successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
          });
        } else {
          // Extract error message from the server's response
          return response.json().then((errorData) => {
            const errorMessage = errorData.error || "Failed to add transaction";
            throw new Error(errorMessage);
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setSnackbarMessage(error.message); // Display server error message
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      })
      .finally(() => {
        setLoading(false); // Stop loader
        // Reset form fields
        setItemId("");
        setItemName("");
        setQty("");
        setPricePerUnit("");
        setDepartmentId("");
        setPersonName("");
        setLabName("");
        setDepartmentName("");
        setSupplierId("");
        setManufacturerName("");
        setSupplierName("");
        setTxnDate("");
      });
  };

  return (
    <Box sx={{ p: 6 }}>
      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
        <Typography variant="h7" sx={{ marginRight: 2 }}>
          Transaction Type:
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={txnType === "inward"}
              onChange={(e) =>
                setTxnType(e.target.checked ? "inward" : "issued")
              }
              color="primary"
            />
          }
          label={txnType.charAt(0).toUpperCase() + txnType.slice(1)}
        />
      </Box>
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
          Add Transaction
        </Typography>
        <form onSubmit={handleFormSubmit}>
          <TextField
            label="Item Name"
            variant="outlined"
            value={itemName}
            onChange={handleItemNameChange}
            fullWidth
            sx={{ position: "relative" }}
          />
          {itemSuggestions.length > 0 && (
            <List
              sx={{
                position: "absolute",
                zIndex: 1000,
                width: "100%",
                bgcolor: "white",
                border: "1px solid #ccc",
                maxHeight: 200,
                overflowY: "auto",
                mt: 1,
              }}
            >
              {itemSuggestions.map((item) => (
                <ListItem
                  key={item.item_id}
                  onClick={() => handleSuggestionClick(item)}
                >
                  <ListItemText primary={item.item_name} />
                </ListItem>
              ))}
            </List>
          )}

          <TextField
            label="Quantity"
            type="number"
            variant="outlined"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />

          {txnType === "inward" && (
            <>
              <TextField
                label="Price per Unit"
                type="number"
                variant="outlined"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
              />
              {/* <TextField
                label="Manufacturer Name"
                variant="outlined"
                value={manufacturerName}
                onChange={handleManufacturerChange}
                fullWidth
                sx={{ mt: 2 }}
              /> */}
              <TextField
                label="Supplier Name"
                variant="outlined"
                value={supplierName}
                onChange={handleSupplierChange}
                fullWidth
                sx={{ mt: 2 }}
              />
              {supplierSuggestions.length > 0 && (
                <List
                  sx={{
                    position: "absolute",
                    zIndex: 1000,
                    width: "100%",
                    bgcolor: "white",
                    border: "1px solid #ccc",
                    maxHeight: 200,
                    overflowY: "auto",
                    mt: 1,
                  }}
                >
                  {supplierSuggestions.map((supplier) => (
                    <ListItem
                      key={supplier.supp_id}
                      onClick={() => handleSupplierClick(supplier)}
                    >
                      <ListItemText primary={supplier.supp_name} />
                    </ListItem>
                  ))}
                </List>
              )}
            </>
          )}

          {txnType === "issued" && (
            <TextField
              label="Department Name"
              variant="outlined"
              value={departmentName}
              onChange={handleDepartmentChange}
              fullWidth
              sx={{ mt: 2 }}
            />
          )}
          {departmentSuggestions.length > 0 && (
            <List
              sx={{
                position: "absolute",
                zIndex: 1000,
                width: "100%",
                bgcolor: "white",
                border: "1px solid #ccc",
                maxHeight: 200,
                overflowY: "auto",
                mt: 1,
              }}
            >
              {departmentSuggestions.map((department) => (
                <ListItem
                  key={department.dept_id}
                  onClick={() => handleDepartmentClick(department)}
                >
                  <ListItemText primary={department.dept_name} />
                </ListItem>
              ))}
            </List>
          )}
          {txnType == "issued" && (
            <>
              <TextField
                label="Person Name"
                variant="outlined"
                value={personName}
                onChange={handlePersonChange}
                fullWidth
                sx={{ mt: 2 }}
              />
              <TextField
                label="Lab Name"
                variant="outlined"
                value={labName}
                onChange={handleLabChange}
                fullWidth
                sx={{ mt: 2 }}
              />
            </>
          )}

          {/* <TextField
            label="Transaction Date"
            type="date"
            variant="outlined"
            value={txnDate}
            onChange={(e) => setTxnDate(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          /> */}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 3 }}
            disabled={loading} // Disable button while loading
          >
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </form>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

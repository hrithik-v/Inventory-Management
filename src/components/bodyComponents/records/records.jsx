import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import React, { useState, useEffect } from "react";

let baseURL = "https://35lhslhd-3000.inc1.devtunnels.ms";

export default function Records() {
  const [itemId, setItemId] = useState("");
  const [itemName, setItemName] = useState("");

  const [departmentId, setDepartmentId] = useState("");
  const [departmentName, setDepartmentName] = useState("");

  const [manufacturerId, setManufacturerId] = useState("");
  const [manufacturerName, setManufacturerName] = useState("");

  const [itemSuggestions, setItemSuggestions] = useState([]);
  const [manufacturerSuggestions, setManufacturerSuggestions] = useState([]);
  const [departmentSuggestions, setDepartmentSuggestions] = useState([]);

  const [txnType, setTxnType] = useState("");
  const [qty, setQty] = useState(0);
  const [pricePerUnit, setPricePerUnit] = useState(0);
  const [txnDate, setTxnDate] = useState("");
  const [allItems, setAllItems] = useState([]); // Store all items here
  const [allManufacturers, setAllManufacturers] = useState([]); // Store all manufacturers here
  const [allDepartments, setAllDepartments] = useState([]); // Store all departments here

  // Fetch all items, manufacturers, and departments once on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsResponse = await fetch(`${baseURL}/items_names`);
        const itemsData = await itemsResponse.json();
        setAllItems(itemsData); // Store fetched items

        const manufacturersResponse = await fetch(`${baseURL}/manuf_names`);
        const manufacturersData = await manufacturersResponse.json();
        setAllManufacturers(manufacturersData); // Store fetched manufacturers

        const departmentsResponse = await fetch(`${baseURL}/dept_names`);
        const departmentsData = await departmentsResponse.json();
        setAllDepartments(departmentsData); // Store fetched departments
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Handle item name change and filter suggestions based on common characters
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

  // Handle manufacturer name change and filter suggestions
  const handleManufacturerChange = (event) => {
    const query = event.target.value.toLowerCase();
    setManufacturerName(query);

    if (query.length > 0) {
      const suggestions = allManufacturers.filter((manufacturer) =>
        manufacturer.manuf_name.toLowerCase().includes(query)
      );
      setManufacturerSuggestions(suggestions);
    } else {
      setManufacturerSuggestions([]);
    }
  };

  // Handle department name change and filter suggestions
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

  const handleSuggestionClick = (suggestion) => {
    setItemId(suggestion.item_id);
    setItemName(suggestion.item_name); // Set item name for display
    setItemSuggestions([]); // Clear suggestions after selecting one
  };

  const handleManufacturerClick = (suggestion) => {
    console.log(suggestion);
    setManufacturerId(suggestion.manuf_id); // Store manufacturer ID in state
    setManufacturerName(suggestion.manuf_name); // Store manufacturer ID in state

    setManufacturerSuggestions([]); // Clear suggestions after selecting one
  };

  const handleDepartmentClick = (suggestion) => {
    setDepartmentId(suggestion.dept_id); // Store department ID in state
    setDepartmentName(suggestion.dept_name); // Store department ID in state
    setDepartmentSuggestions([]); // Clear suggestions after selecting one
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const newRecord = {
      item_id: itemId, // Send item name in API
      txn_type: txnType,
      qty: qty,
      item_price: txnType === "inward" ? pricePerUnit : 0,
      dept_id: txnType === "issued" ? departmentId : null, // Send department ID
      manuf_id: txnType === "inward" ? manufacturerId : null, // Send manufacturer ID
      txn_date: txnDate,
    };

    console.log(newRecord);
    // Make a call to your API to submit the newRecord here
    fetch(`${baseURL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRecord),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // Reset form fields
    setItemId("");
    setItemName("");
    setTxnType("");
    setQty("");
    setPricePerUnit("");
    setDepartmentId("");
    setDepartmentName("");
    setManufacturerId("");
    setManufacturerName("");
    setTxnDate("");
    // setItemDate("");
  };

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
                  // button
                  key={item.item_id}
                  onClick={() => handleSuggestionClick(item)}
                >
                  <ListItemText primary={item.item_name} />
                </ListItem>
              ))}
            </List>
          )}

          <TextField
            label="Transaction Type"
            variant="outlined"
            value={txnType}
            onChange={(e) => setTxnType(e.target.value)}
            select
            fullWidth
            sx={{ mt: 2 }}
          >
            <MenuItem value="inward">Inward</MenuItem>
            <MenuItem value="issued">Issued</MenuItem>
          </TextField>

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
              <TextField
                label="Manufacturer Name"
                variant="outlined"
                value={manufacturerName} // This should still display the ID
                onChange={handleManufacturerChange}
                fullWidth
                sx={{ mt: 2 }}
              />
              {manufacturerSuggestions.length > 0 && (
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
                  {manufacturerSuggestions.map((manufacturer) => (
                    <ListItem
                      button
                      key={manufacturer.manuf_id}
                      onClick={() => handleManufacturerClick(manufacturer)}
                    >
                      <ListItemText primary={manufacturer.manuf_name} />
                    </ListItem>
                  ))}
                </List>
              )}
            </>
          )}

          {txnType === "issued" && (
            <>
              <TextField
                label="Department Name"
                variant="outlined"
                value={departmentName} // This should still display the ID
                onChange={handleDepartmentChange}
                fullWidth
                sx={{ mt: 2 }}
              />
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
                      button
                      key={department.dept_id}
                      onClick={() => handleDepartmentClick(department)}
                    >
                      <ListItemText primary={department.dept_name} />
                    </ListItem>
                  ))}
                </List>
              )}
            </>
          )}

          <TextField
            label="Transaction Date"
            type="date"
            variant="outlined"
            value={txnDate}
            onChange={(e) => setTxnDate(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />

          <Button type="submit" variant="contained" sx={{ mt: 4 }}>
            Submit
          </Button>
        </form>
      </Box>
    </Box>
  );
}

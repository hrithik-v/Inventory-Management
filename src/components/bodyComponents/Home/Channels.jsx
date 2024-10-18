import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
let baseURL = "https://35lhslhd-3000.inc1.devtunnels.ms";

export default function LowStock() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchlowstock = async () => {
      try {
        const response = await fetch(baseURL + "/low-stock"); // Replace YOUR_PORT with your server port
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching low stock:", error);
      }
    };

    fetchlowstock();
  }, []); // Empty dependency array to run once on mount

  console.log(products);
  return (
    <Box
      sx={{
        margin: 3,
        bgcolor: "white",
        borderRadius: 2,
        padding: 3,
        height: "95%",
      }}
    >
      <Typography variant="h6" fontWeight={"bold"} sx={{ mx: 3 }}>
        Items with less than 25 Qty
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bolder" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bolder" }}>Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, id) => {
              return (
                <TableRow key={id}>
                  <TableCell>{product.item_name}</TableCell>{" "}
                  {/* Use the correct field name from your database */}
                  <TableCell>{product.qty}</TableCell>{" "}
                  {/* Use the correct field name for the quantity sold */}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

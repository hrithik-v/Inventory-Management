import React, { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import UilReceipt from "@iconscout/react-unicons/icons/uil-receipt";
import UilBox from "@iconscout/react-unicons/icons/uil-box";
import UilTruck from "@iconscout/react-unicons/icons/uil-truck";
import UilCheckCircle from "@iconscout/react-unicons/icons/uil-check-circle";
import InfoCard from "../../subComponents/InfoCard";
import TotalSales from "./TotalSales";
import SalesByCity from "./SalesByCity";
import Channels from "./Channels";
import TopSellingProduct from "./TopSellingProduct";

let baseURL = "https://35lhslhd-3000.inc1.devtunnels.ms";

const Home = () => {
  const [procured, setProcured] = useState(0);
  const [issued, setIssued] = useState(0);

  useEffect(() => {
    // Fetch total procured quantity using fetch API
    fetch(baseURL + "/quantity/inward")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch procured data");
        }
        return response.json();
      })
      .then((data) => {
        const totalProcured = data[0].total_inward;
        setProcured(totalProcured);
      })
      .catch((error) => {
        console.error("Error fetching procured data:", error);
      });

    // Fetch total issued quantity using fetch API
    fetch(baseURL + "/quantity/issued")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch issued data");
        }
        return response.json();
      })
      .then((data) => {
        const totalIssued = data[0].total_issued;
        setIssued(totalIssued);
      })
      .catch((error) => {
        console.error("Error fetching issued data:", error);
      });
  }, []); // The empty array means this effect will run once when the component mounts

  const balance = procured - issued;

  const cardComponent = [
    {
      icon: <UilTruck size={60} color={"#F6F4EB"} />,
      title: "Procured",
      subTitle: `${procured}`,
      mx: 5,
      my: 0,
    },
    {
      icon: <UilCheckCircle size={60} color={"#F6F4EB"} />,
      title: "Issued",
      subTitle: `${issued}`,
      mx: 5,
      my: 0,
    },
    {
      icon: <UilBox size={60} color={"#F6F4EB"} />,
      title: "Balance",
      subTitle: `${balance}`,
      mx: 3,
      my: 0,
    },
    {
      icon: <UilReceipt size={60} color={"#F6F4EB"} />,
      title: "",
      subTitle: "",
      mx: 3,
      my: 0,
    },
  ];

  return (
    <Box
      sx={{
        margin: 0,
        padding: 3,
      }}
    >
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginX: 3,
          borderRadius: 2,
          padding: 0,
        }}
      >
        {cardComponent.map((card, index) => (
          <Grid item md={3} key={index}>
            <InfoCard card={card} />
          </Grid>
        ))}
      </Grid>

      <Grid container sx={{ marginX: 3 }}>
        <Grid item md={8}>
          <TotalSales data={{ procured, issued }} />
        </Grid>
        <Grid item md={4}>
          <SalesByCity data={{ procured, issued }} />
        </Grid>
      </Grid>

      <Grid container sx={{ margin: 3 }}>
        <Grid item md={6}>
          <Channels />
        </Grid>
        <Grid item md={6}>
          <TopSellingProduct />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;

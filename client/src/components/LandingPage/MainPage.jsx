import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Tabs,
  Tab,
<<<<<<< HEAD
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ScrapGold } from "./ScrapGold";

const buttonPage = [
  { name: "Scrap Gold", component: <ScrapGold /> },
  { name: "Scrap Silver" },
=======
} from "@mui/material";
import { ScrapGold } from "./ScrapGold";

const buttonData = [
  // Use a descriptive name
  { name: "Scrap Gold", component: <ScrapGold /> },
  { name: "Scrap Silver", component: null }, // Pre-render empty components
>>>>>>> 3999dbad3bcb8971158c9bbd9828fb03fe2587cd
  { name: "Scrap Platinum" },
  { name: "Scrap Palladium" },
  { name: "1 Oz Gold Coins" },
  { name: "Other Coins" },
];

export const MainPage = () => {
<<<<<<< HEAD
  const [value, setValue] = useState(0);
  const handleTabChange = (e, val) => {
    setValue(val);
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Check if the screen size is small (xs, sm)

  return (
    <>
      <Card
        sx={{
          m: 2,
          borderRadius: 3,
          maxWidth: "100%",
          [theme.breakpoints.up("md")]: { padding: "20px" },
          [theme.breakpoints.down("sm")]: { padding: "10px" },
        }}
      >
        <CardContent>
          <Typography
            sx={{
              ml: isSmallScreen ? 2 : 5, // Adjust margin for small screens
              fontSize: isSmallScreen ? 20 : 25, // Adjust font size for small screens
              fontWeight: 550,
            }}
          >
            New Order
          </Typography>
          <Divider
            sx={{
              marginY: 1,
              backgroundColor: "gray",
            }}
          />
          <Box
            sx={{
              display: "flex",
              pt: 2,
              gap: 1,
              pl: isSmallScreen ? 2 : 5, // Adjust padding for small screens
              flexDirection: isSmallScreen ? "column" : "row", // Stack tabs vertically for small screens
            }}
          >
            <Tabs
              value={value}
              onChange={handleTabChange}
              textColor="inherit"
              TabIndicatorProps={{ style: { display: "none" } }}
              orientation={isSmallScreen ? "vertical" : "horizontal"} // Vertical orientation for small screens
              sx={{
                "& .MuiTabs-flexContainer": {
                  gap: "12px",
                  flexDirection: isSmallScreen ? "column" : "row", // Stack tabs vertically for small screens
                },
              }}
            >
              {buttonPage.map((item, index) => (
=======
  const [activeIndex, setActiveIndex] = useState(0);

  const handleTabChange = (event, newIndex) => {
    setActiveIndex(newIndex);
  };

  const renderContent = () => {
    if (!buttonData[activeIndex]) return null; // Handle missing component
    return buttonData[activeIndex].component;
  };

  return (
    <>
      <Card sx={{ m: 2, borderRadius: 3 }}>
        <CardContent>
          <Typography sx={{ ml: 5, fontSize: 25, fontWeight: 550 }}>
            {" "}
            New Order
          </Typography>
          <Divider sx={{ marginY: 1, backgroundColor: "gray" }} />
          <Box sx={{ display: "flex", pt: 2, gap: 1, pl: 5 }}>
            <Tabs
              value={activeIndex}
              onChange={handleTabChange}
              textColor="inherit"
              indicatorColor="primary"
              TabIndicatorProps={{ style: { display: "none" } }}
              sx={{ "& .MuiTabs-flexContainer": { gap: "12px" } }}
            >
              {buttonData.map((item, index) => (
>>>>>>> 3999dbad3bcb8971158c9bbd9828fb03fe2587cd
                <Tab
                  key={index}
                  label={item.name}
                  sx={{
                    textTransform: "none",
<<<<<<< HEAD
                    color: value === index ? "white" : "black",
=======
                    color: activeIndex === index ? "white" : "black",
>>>>>>> 3999dbad3bcb8971158c9bbd9828fb03fe2587cd
                    border: "1px solid",
                    borderColor: "primary.main",
                    borderRadius: 2,
                    backgroundColor:
<<<<<<< HEAD
                      value === index ? "primary.main" : "transparent",
                    "&:hover,&.Mui-selected": {
                      backgroundColor: "primary.main",
                      color: "white",
                    },
                    fontSize: isSmallScreen ? 12 : 14, // Adjust font size for small screens
                    padding: isSmallScreen ? "5px 8px" : "10px 16px", // Adjust padding for small screens
=======
                      activeIndex === index ? "primary.main" : "transparent",
                    "&:hover": {
                      backgroundColor: "primary.light",
                      color: "black",
                    }, // Use lighter shade on hover
                    "&.Mui-selected": {
                      backgroundColor: "primary.main",
                      color: "white",
                    },
>>>>>>> 3999dbad3bcb8971158c9bbd9828fb03fe2587cd
                  }}
                />
              ))}
            </Tabs>
          </Box>
<<<<<<< HEAD
          <Box sx={{ mt: 4 }}>{buttonPage[value]?.component}</Box>
=======
          <Box sx={{ mt: 4 }}>{renderContent()}</Box>
>>>>>>> 3999dbad3bcb8971158c9bbd9828fb03fe2587cd
        </CardContent>
      </Card>
    </>
  );
};

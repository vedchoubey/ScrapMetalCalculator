import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import { ScrapGold } from "./ScrapGold";

const buttonData = [
  // Use a descriptive name
  { name: "Scrap Gold", component: <ScrapGold /> },
  { name: "Scrap Silver", component: null }, // Pre-render empty components
  { name: "Scrap Platinum" },
  { name: "Scrap Palladium" },
  { name: "1 Oz Gold Coins" },
  { name: "Other Coins" },
];

export const MainPage = () => {
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
                <Tab
                  key={index}
                  label={item.name}
                  sx={{
                    textTransform: "none",
                    color: activeIndex === index ? "white" : "black",
                    border: "1px solid",
                    borderColor: "primary.main",
                    borderRadius: 2,
                    backgroundColor:
                      activeIndex === index ? "primary.main" : "transparent",
                    "&:hover": {
                      backgroundColor: "primary.light",
                      color: "black",
                    }, // Use lighter shade on hover
                    "&.Mui-selected": {
                      backgroundColor: "primary.main",
                      color: "white",
                    },
                  }}
                />
              ))}
            </Tabs>
          </Box>
          <Box sx={{ mt: 4 }}>{renderContent()}</Box>
        </CardContent>
      </Card>
    </>
  );
};

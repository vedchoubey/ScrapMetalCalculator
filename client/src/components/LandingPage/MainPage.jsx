import React, { useState } from "react";
import {Box,Card,CardContent,Typography,Divider,Tabs,Tab,useMediaQuery,useTheme,Menu,MenuItem,Button,} from "@mui/material";
import { ScrapGold } from "./ScrapGold";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const buttonPage = [
  { name: "Scrap Gold", component: <ScrapGold /> },
  { name: "Scrap Silver" },
  { name: "Scrap Platinum" },
  { name: "Scrap Palladium" },
  { name: "1 Oz Gold Coins" },
  { name: "Other Coins" },
];

export const MainPage = () => {
  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [weights, setWeights] = useState({});
  const [sharedRows, setSharedRows] = useState([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (index) => {
    setValue(index);
    setAnchorEl(null);
  };

  return (
    <>
      <Card
        sx={{
          m: 2,
          borderRadius: 4,
          maxWidth: "100%",
          background: "linear-gradient(135deg, #ffffff 0%, #fefefe 30%, #fdfdfc 70%, #fbfbfa 100%)",
          border: "1px solid #e5ddd5",
          boxShadow: "0 8px 32px rgba(139, 115, 85, 0.1), 0 4px 12px rgba(139, 115, 85, 0.06)",
          [theme.breakpoints.up("md")]: { padding: "20px" },
          [theme.breakpoints.down("sm")]: { padding: "10px" },
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Typography
            sx={{
              ml: isSmallScreen ? 1 : 2,
              fontSize: isSmallScreen ? 20 : 25,
              fontWeight: "700",
              color: "#451a03",
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              letterSpacing: "0.5px",
              textShadow: "0 1px 2px rgba(69, 26, 3, 0.1)"
            }}
          >
            New Order
          </Typography>
          <Divider
            sx={{
              marginY: 2,
              background: "linear-gradient(90deg, #d97706 0%, #f59e0b 50%, #d97706 100%)",
              height: "2px",
              border: "none"
            }}
          />
          <Box
            sx={{
              display: "flex",
              pt: 2,
              gap: 1,
              pl: isSmallScreen ? 1 : 2,
              flexDirection: isSmallScreen ? "column" : "row",
            }}
          >
            {!isSmallScreen && (
              <Tabs
                value={value} 
                onChange={handleTabChange} 
                textColor="inherit" 
                TabIndicatorProps={{ style: { display: "none" } }}
                orientation="horizontal" 
                sx={{ 
                  "& .MuiTabs-flexContainer": {
                    gap: "8px",
                  },
                }}
              >
                {buttonPage.map((item, index) => (
                  <Tab
                    key={index}
                    label={item.name}
                    sx={{
                      textTransform: "none",
                      color: value === index ? "#ffffff" : "#451a03",
                      border: "2px solid",
                      borderColor: value === index ? "#92400e" : "#d97706",
                      borderRadius: 3,
                      background: value === index 
                        ? "linear-gradient(135deg, #451a03 0%, #5d2506 50%, #d97706 100%)"
                        : "linear-gradient(135deg, #ffffff 0%, #fef7ed 50%, #fff8dc 100%)",
                      minHeight: "48px",
                      fontWeight: "600",
                      fontSize: "0.875rem",
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                      letterSpacing: "0.25px",
                      px: 3,
                      py: 1.5,
                      transition: "all 0.3s ease-in-out",
                      boxShadow: value === index 
                        ? "0 4px 12px rgba(69, 26, 3, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                        : "0 2px 8px rgba(217, 119, 6, 0.15)",
                      "&:hover": {
                        background: value === index 
                          ? "linear-gradient(135deg, #5d2506 0%, #451a03 30%, #5d2506 70%, #d97706 100%)"
                          : "linear-gradient(135deg, #fef7ed 0%, #fed7aa 50%, #fef3c7 100%)",
                        borderColor: "#92400e",
                        transform: "translateY(-2px)",
                        boxShadow: value === index 
                          ? "0 6px 16px rgba(69, 26, 3, 0.35), inset 0 2px 0 rgba(255, 255, 255, 0.15)"
                          : "0 6px 20px rgba(217, 119, 6, 0.25)"
                      },
                      "&.Mui-selected": {
                        color: "#ffffff",
                      }
                    }}
                  />
                ))}
              </Tabs>
            )}

            {isSmallScreen && (
              <>
                <Button
                  variant="outlined" 
                  onClick={handleMenuClick} 
                  endIcon={<ArrowDropDownIcon />}
                  sx={{
                    textTransform: "none",
                    color: "#ffffff",
                    border: "2px solid #92400e",
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #451a03 0%, #5d2506 50%, #d97706 100%)",
                    fontWeight: "600",
                    fontSize: "0.875rem",
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                    letterSpacing: "0.25px",
                    px: 3,
                    py: 1.5,
                    minHeight: "48px",
                    boxShadow: "0 4px 12px rgba(69, 26, 3, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #5d2506 0%, #451a03 30%, #5d2506 70%, #d97706 100%)",
                      borderColor: "#92400e",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 16px rgba(69, 26, 3, 0.35), inset 0 2px 0 rgba(255, 255, 255, 0.15)"
                    }
                  }}
                >
                  {buttonPage[value]?.name}
                </Button>
                <Menu
                  anchorEl={anchorEl} 
                  open={Boolean(anchorEl)} 
                  onClose={() => setAnchorEl(null)}
                  PaperProps={{
                    sx: {
                      borderRadius: 3,
                      border: "1px solid #d97706",
                      background: "linear-gradient(135deg, #ffffff 0%, #fef7ed 100%)",
                      boxShadow: "0 8px 32px rgba(69, 26, 3, 0.15)"
                    }
                  }}
                >
                  {buttonPage.map((item, index) => (
                    <MenuItem
                      key={index} 
                      selected={value === index} 
                      onClick={() => handleMenuClose(index)}
                      sx={{
                        textTransform: "none", 
                        color: value === index ? "#ffffff" : "#451a03",
                        background: value === index 
                          ? "linear-gradient(135deg, #451a03 0%, #5d2506 50%, #d97706 100%)"
                          : "transparent",
                        fontWeight: "600",
                        fontSize: "0.875rem",
                        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                        px: 3,
                        py: 1.5,
                        mx: 1,
                        my: 0.5,
                        borderRadius: 2,
                        "&:hover": {
                          background: value === index 
                            ? "linear-gradient(135deg, #5d2506 0%, #451a03 30%, #5d2506 70%, #d97706 100%)"
                            : "linear-gradient(135deg, #fef7ed 0%, #fed7aa 50%, #fef3c7 100%)",
                          color: value === index ? "#ffffff" : "#451a03"
                        }
                      }}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </Box>

          <Box sx={{ mt: 4 }}>
            {buttonPage[value]?.component &&
              React.cloneElement(buttonPage[value].component, {
                weights,
                setWeights,
                sharedRows,
                setSharedRows,
              })}
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

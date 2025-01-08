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
        sx={{m: 2,borderRadius: 3,maxWidth: "100%",[theme.breakpoints.up("md")]: { padding: "20px" },
          [theme.breakpoints.down("sm")]: { padding: "10px" },
        }}
      >
        <CardContent>
          <Typography
            sx={{ml: isSmallScreen ? 2 : 5,fontSize: isSmallScreen ? 20 : 25,fontWeight: 550,}}
          >
            New Order
          </Typography>
          <Divider
            sx={{marginY: 1,backgroundColor: "gray",}}
          />
          <Box
            sx={{display: "flex",pt: 2,gap: 1,pl: isSmallScreen ? 2 : 3,flexDirection: isSmallScreen ? "column" : "row",}}
          >
            {!isSmallScreen && (
              <Tabs
                value={value} onChange={handleTabChange} textColor="inherit" TabIndicatorProps={{ style: { display: "none" } }}
                orientation="horizontal" sx={{ "& .MuiTabs-flexContainer": {
                    gap: "12px",
                  },
                }}
              >
                {buttonPage.map((item, index) => (
                  <Tab
                    key={index}
                    label={item.name}
                    sx={{
                      textTransform: "none",color: value === index ? "white" : "black",border: "1px solid",
                      borderColor: "primary.main",borderRadius: 2,backgroundColor:value === index ? "primary.main" : "transparent",
                      "&:hover,&.Mui-selected": {
                        backgroundColor: "primary.main",
                        color: "white",
                      },
                      fontSize: 14,padding: "10px 16px",
                    }}
                  />
                ))}
              </Tabs>
            )}

            {isSmallScreen && (
              <>
                <Button
                  variant="outlined" onClick={handleMenuClick} endIcon={<ArrowDropDownIcon />}
                  sx={{
                    textTransform: "none",color: "white",border: "1px solid",borderColor: "primary.main",
                    borderRadius: 2,backgroundColor: "primary.main",
                    "&:hover,&.Mui-selected": {
                      backgroundColor: "primary.main",
                      color: "white",
                    },
                  }}
                >
                  {buttonPage[value]?.name}
                </Button>
                <Menu
                  anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
                >
                  {buttonPage.map((item, index) => (
                    <MenuItem
                      key={index} selected={value === index} onClick={() => handleMenuClose(index)}
                      sx={{
                        textTransform: "none", color: value === index ? "white" : "black",
                        backgroundColor:
                          value === index ? "primary.main" : "transparent",
                        "&:hover": {
                          backgroundColor: "primary.main",
                          color: "white",
                        },
                        fontSize: 14,
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

import React, { useState } from "react";
import { Box,Card,CardContent, Typography,Divider,Tabs,Tab, } from "@mui/material";
import { ScrapGold } from "./ScrapGold";

 const buttonPage = [
  {name:'Scrap Gold' , component:<ScrapGold/>},
  {name:'Scrap Silver', },
  {name:'Scrap Platinum' },
  {name:'Scrap Palladium' },
  {name:'1 Oz Gold Coins' },
  {name:'Other Coins' }
]
  export const MainPage = () => {
     const [value,setValue] = useState(0); 
     const handleTabChange = (e,val) => {
      setValue(val);
    }
     return (
        <>
        <Card sx={{m:2,borderRadius:3}}>
          <CardContent>
            <Typography sx={{ml:5,fontSize:25,fontWeight:550}}> New Order</Typography>
            <Divider sx={{marginY: 1,backgroundColor: "gray", }} />
            <Box sx={{display:"flex",pt:2,gap:1,pl:5}}>
              <Tabs value={value} onChange={handleTabChange} textColor="inherit" TabIndicatorProps={{ style: { display: "none" } }}
              sx={{ "& .MuiTabs-flexContainer": { gap: "12px", }, }}>
                {
                 buttonPage.map((item,index) => (
                  <Tab  key={index} label={item.name} sx={{textTransform:"none",color: value === index ? "white" : "black",
                    border: "1px solid",borderColor: "primary.main",borderRadius: 2,
                    backgroundColor: value === index ? "primary.main" : "transparent",
                    '&:hover,&.Mui-selected': {backgroundColor:"primary.main",color:"white" }, 
                  }} />
                  ))
                }
              </Tabs>
            </Box>
            <Box sx={{ mt: 4 }}> {buttonPage[value]?.component} </Box>
          </CardContent>
        </Card>
    </>
    )
}
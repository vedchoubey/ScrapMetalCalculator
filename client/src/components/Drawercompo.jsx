import React, { useState } from "react";
import { Typography, Drawer, Button, IconButton, List, ListItemButton, ListItemIcon, ListItemText,Divider, Box } from "@mui/material";
import { useTheme} from "@mui/material/styles";
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import EmailIcon from '@mui/icons-material/Email';
import InventoryIcon from '@mui/icons-material/Inventory';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import CalculateIcon from '@mui/icons-material/Calculate';
import SummarizeIcon from '@mui/icons-material/Summarize';

const menuItems = [
    { section: "PRIMARY", items: [
      { name: "Dashboard", icon: <DashboardIcon /> },
      { name: "Purchases", icon: <ShoppingCartIcon /> },
      { name: "Sale Gold Orders", icon: <ViewModuleIcon /> },
      { name: "All Enquiries", icon: <EmailIcon /> },
    ]},
    { section: "SECONDARY", items: [
      { name: "Inventory Management", icon: <InventoryIcon /> },
      { name: "Customer Database", icon: <PersonIcon /> },
      { name: "Setting", icon: <SettingsIcon /> },
      { name: "Expenses", icon: <CalculateIcon /> },
      { name: "VAT Summary", icon: <SummarizeIcon /> },
    ]},
  ];

export const Drawercompo = () => {
const drawerWidth = 250;
const theme = useTheme();
const[openDrawer,setOpenDrawer] = useState(false);

const listStyles = {  "&:hover": {
      "& .MuiListItemIcon-root": { color: theme.palette.primary.main },
      "& .MuiListItemText-root": { color: theme.palette.primary.main },  },
    };
    return(
    <>
     <Drawer open={openDrawer} onClose={()=>setOpenDrawer(false)} sx={{"& .MuiDrawer-paper": { width: drawerWidth,},}} >
        <Link to={"/"}><Button size="large" variant="contained" fullWidth><Typography sx={{fontSize:15,}} >
              LOGO</Typography></Button></Link>
           {
            menuItems.map((section,index)=>(
                <Box key={index}>
                    <Typography sx={{fontSize: 10, ml: 2, mt: 2}}>{section.section}</Typography>
                    <List>
                        { section.items.map((item,index)=>(
                            <ListItemButton key={index} sx={listStyles}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText>{item.name}</ListItemText>
                            </ListItemButton>
                            ))
                        }
                    </List>
                    {
                     index < menuItems.length-1 && (<Divider sx={{marginY: 1,backgroundColor: "gray", }} />)
                    }
                </Box>
            ))
           }   
     </Drawer>
     <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
        <MenuIcon />
      </IconButton>
    </>
    )
}
        
        
       
       





      
    

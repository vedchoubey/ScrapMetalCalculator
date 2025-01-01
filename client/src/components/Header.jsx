import React from "react";
import Typography from "@mui/material/Typography"
import { AppBar, Toolbar,Box, Button, styled,  } from "@mui/material";
import { Link } from "react-router-dom";
import {useTheme} from "@mui/material/styles";

const RootTypography = styled(Typography)({fontSize:15,color:"white",textTransform:"none",fontWeight:500,})

const menuItems =[
    {label : "Cryptos" , to: "/cryptos"},
    {label : "Base Metals" , to: "/basemetals"},
    {label : "Markets" , to: "/markets"},
    {label : "Mining" , to: "/mining"},
    {label : "News" , to: "/news"},
    {label : "About" , to: "/about"},
]

export const Header = () => {
const theme = useTheme();

    return(
        <>
       <AppBar sx={{backgroundColor:theme.palette.primary.main}}>
        <Toolbar>
            <Typography sx={{color:theme.palette.secondary.main,fontSize:30,fontWeight:600}}>KITCO</Typography>
            <Box sx={{display:"flex",gap:4}}>
                {menuItems.map((item,index) => (
                    <Link to={item.to}>
                        <Button> <RootTypography> {item.label} </RootTypography> </Button>

                    </Link>

                ))}

            </Box>
            

        </Toolbar>

       </AppBar>
        </>
    )

}
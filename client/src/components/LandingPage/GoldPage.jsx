import { Box, Button, Card, CardContent, Paper, Table, TableBody, TableCell, TableContainer, TableHead, 
 IconButton,TableRow, TextField, Typography,Divider, } from "@mui/material";
import React, { useState } from "react";
import cardData from "../../data/cardData.json";
import { SummaryCard } from "./SummaryCard";
import { Link } from "react-router-dom";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt"; 
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound'; 

const buttonPage = [
  {name:'Scrap Gold' , to:"/gold"},
  {name:'Scrap Silver' , to:"/silver"},
  {name:'Scrap Platinum' , to:"/platinum"},
  {name:'Scrap Palladium' , to:"/palladium"},
  {name:'1 Oz Gold Coins' , to:"/ozgoldcoins"},
  {name:'Other Coins' , to:"/othercoins"}
]

export const GoldPage = () => {
    
    const [weight,setWeights] = useState({});
    const [data, setData] = useState(cardData); 
    const [sharedRows, setSharedRows] = useState([]);
    

    const handleWeightChange = (Carat, value) => {
      if (value <= 0) {
        setWeights((prev) => ({ ...prev, [Carat]: "" }));
      } else {
        setWeights((prev) => ({ ...prev, [Carat]: value }));
      }
    };
    
    const calculateSubtotal = (pricePerGram,weight) => {
        return pricePerGram * weight || 0 ;
    } 
    const handleShareRow = (index) => {
      const row = data[index];
      const weightValue = weight[row.Carat];
       if (!weightValue || weightValue <= 0) {
        alert("Must fill value greater than 0 to share the row.");
        return;
      }
       const subtotal = calculateSubtotal(row.pricePerGram, weightValue);
      setSharedRows((prev) => [...prev, {...row, weight: weightValue, subtotal, }, ] );
      setData((prevData) => prevData.map((r, i) => i === index ? { ...r, shared: true } : r ) ); 
    };
    const handleUnshareRow = (Carat) => {
      setSharedRows((prev) =>
        prev.filter((row) => row.Carat !== Carat)
      );
        setData((prevData) =>
        prevData.map((r) =>
          r.Carat === Carat ? { ...r, shared: false } : r ) ); };
    
     return (
        <>
        <Card sx={{m:2,borderRadius:3}}>
          <CardContent>
            <Typography sx={{ml:5,fontSize:25,fontWeight:550}}> New Order</Typography>
            <Divider sx={{marginY: 1,backgroundColor: "gray", }} />
            <Box sx={{display:"flex",pt:2,gap:1,pl:5}}>
              {
                buttonPage.map((item,index) => (
                  <Link to={item.to} key={index}>
                    <Button variant="outlined" sx={{textTransform:"none",color:'black', '&:hover,&:focus': {
                      backgroundColor:"primary.main",color:"white" } }} > {item.name} </Button>
                  </Link>
                ))
              }
            </Box>
            <Box sx={{display:"flex",flexDirection:{xs:"column",md:"row"},justifyContent:"space-between"}}>
              <Box>
                <Card sx={{borderRadius:3,maxWidth:680,m:4,border: "1px solid #9966CC"}}>
                  <TableContainer component={Paper} >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ borderBottom: "none" }}></TableCell>
                                <TableCell sx={{ borderBottom: "none",color:"grey" }}>  Price/g </TableCell>
                                <TableCell sx={{ borderBottom: "none",color:"grey" }}>  Weight(g) </TableCell>
                                <TableCell sx={{ borderBottom: "none",color:"grey" }}> Subtotal </TableCell>
                                <TableCell sx={{ borderBottom: "none",color:"grey" }}>  Actions  </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {data.map((row,index) => (
                                <TableRow key={index} sx={{borderBottom:"none"}}>
                                    <TableCell sx={{borderBottom:"none"}} >{row.Carat}</TableCell>
                                    <TableCell sx={{borderBottom:"none"}} ><CurrencyPoundIcon sx={{fontSize:"small"}}/>{row.pricePerGram}</TableCell>
                                    <TableCell sx={{borderBottom:"none"}} >
                                        <TextField variant="standard" type="number" size="small" 
                                          value={weight[row.Carat] || ""}
                                          onChange={(e) => handleWeightChange(row.Carat, parseFloat(e.target.value) || 0) }
                                          error={weight[row.Carat] <= 0} 
                                          helperText={weight[row.Carat] <= 0 ? "Must be greater than 0" : ""}
                                        />
                                    </TableCell>
                                    <TableCell sx={{borderBottom:"none"}}  > <CurrencyPoundIcon sx={{fontSize:"small"}} />
                                      {calculateSubtotal(row.pricePerGram,weight[row.Carat])}</TableCell>
                                    <TableCell sx={{ borderBottom: "none" }}>
                                      {
                                        !row.shared ? (
                                          <IconButton onClick={() => handleShareRow(index)} color="primary"
                                          disabled = {!weight[row.Carat] || weight[row.Carat] <= 0 } >
                                            <ArrowRightAltIcon/>
                                          </IconButton>
                                        ) : (
                                          <IconButton onClick={() => handleUnshareRow(row.Carat)} color="primary">
                                            <ArrowBackIcon/>
                                          </IconButton> )
                                      }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>  
                </TableContainer>
            </Card>
             </Box>
            <Box >
        <SummaryCard sharedRows={sharedRows} />
        </Box>
            </Box> 
            </CardContent>
      </Card>
    </>
    )
}
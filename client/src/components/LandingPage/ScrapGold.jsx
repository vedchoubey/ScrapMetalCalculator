import { Box,Card,Paper,Table,TableBody,TableCell,TableContainer,TableHead, IconButton,TableRow, TextField,} from "@mui/material";
import React, { useState } from "react";
import cardData from "../../data/cardData.json";
import { SummaryCard } from "./SummaryCard";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt"; 
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound'; 
  
  export const ScrapGold = () => {

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
         </>
      )
  }
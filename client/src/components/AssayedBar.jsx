






import {
    OutlinedInput,
    Table,
    Box,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    Card,
    CardContent,
  } from "@mui/material";
  import { useState } from "react";
  
  import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
  import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { SummaryAssayed } from "./SummaryAssayed";
  
  export const AssayedBar = ({ baseRate }) => {
    const [purity, setPurity] = useState("");
    const [weight, setWeight] = useState("");
    const [sharedAssayed, setSharedAssayed] = useState([]); // Stores shared rows
  
    const handlePurityChange = (e) => {
      let value = e.target.value;
      if (/^\d{0,3}(\.\d{0,2})?$/.test(value) && parseFloat(value) <= 100) {
        setPurity(value);
      }
    };
  
    const handleWeightChange = (e) => {
      setWeight(e.target.value);
    };
  
    const handleShareRow = () => {
      const pricePerGram = purity ? (parseFloat(purity) * baseRate) / 100 : 0;
      const subtotal = weight ? parseFloat(weight) * pricePerGram : 0;
  
      const newRow = {
        type: "Assayed Bar",
        purity,
        weight,
        subtotal: subtotal.toFixed(3),
      };
  
      setSharedAssayed([newRow]); // Stores the row in summary
    };
  
    const handleUnshareRow = () => {
      setSharedAssayed([]); // Removes row from summary
    };
  
    const pricePerGram = purity ? (parseFloat(purity) * baseRate) / 100 : 0;
    const subtotal = weight ? parseFloat(weight) * pricePerGram : 0;
    const isRowShared = sharedAssayed.length > 0;
  
    return (
      <>
        <Box sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ borderBottom: "none" }}></TableCell>
                <TableCell sx={{ borderBottom: "none", color: "grey" }}>
                  Price/g
                </TableCell>
                <TableCell sx={{ borderBottom: "none", color: "grey" }}>
                  Purity
                </TableCell>
                <TableCell sx={{ borderBottom: "none", color: "grey" }}>
                  Weight
                </TableCell>
                <TableCell sx={{ borderBottom: "none", color: "grey" }}>
                  Subtotal
                </TableCell>
                <TableCell sx={{ borderBottom: "none", color: "grey" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography sx={{ fontSize: 20, fontWeight: 750 }}>
                    Assayed Bar
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
                    {pricePerGram.toFixed(3)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <OutlinedInput
                    value={purity}
                    onChange={handlePurityChange}
                    placeholder="Purity"
                    sx={{
                      width: "80px",
                      height: "50px",
                      fontSize: "18px",
                      fontWeight: "bold",
                      borderRadius: "8px",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <OutlinedInput
                    value={weight}
                    onChange={handleWeightChange}
                    sx={{
                      width: "80px",
                      height: "50px",
                      fontSize: "18px",
                      fontWeight: "bold",
                      borderRadius: "8px",
                    }}
                    placeholder="Weight"
                  />
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
                    {subtotal.toFixed(3)}
                  </Typography>
                </TableCell>
                <TableCell sx={{ borderBottom: "none" }}>
                  {isRowShared ? (
                    <IconButton onClick={handleUnshareRow} color="primary">
                      <ArrowBackIcon />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={handleShareRow}
                      color="primary"
                      disabled={!weight || parseFloat(weight) <= 0}
                    >
                      <ArrowRightAltIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
  
        
        <SummaryAssayed sharedAssayed={sharedAssayed} />
      </>
    );
  };
import React, {useState} from "react";
import {Box,Card,Paper,Table,TableBody,TableCell,InputAdornment,TableContainer,TableHead,IconButton,TableRow,TextField,Typography, useMediaQuery, useTheme} from "@mui/material";
import cardData from "../../data/cardData.json";
import { SummaryCard } from "./SummaryCard";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CurrencyPoundIcon from "@mui/icons-material/CurrencyPound";

export const ScrapGold = ({ weights, setWeights, sharedRows, setSharedRows }) => {
  const [baseRate, setBaseRate] = useState(70);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const calculatePricePerGram = (carat) => {
    if (!baseRate || baseRate <= 0) return 0; 
    return (carat / 24) * baseRate;
  };
  const handleBaseRateChange = (e) => {
    const value = parseFloat(e.target.value);
    setBaseRate(value > 0 ? value : 0); 
  };


  const calculateSubtotal = (pricePerGram, weight) => {
    if (!weight || weight <= 0) return 0; 
    return pricePerGram * weight;
  };

  const handleWeightChange = (Carat, value) => {
    setWeights((prev) => ({
      ...prev,
      [Carat]: value > 0 ? value : "", 
    }));
  };

  const handleShareRow = (index) => {
    const row = cardData[index];
    const weightValue = weights[row.Carat];

    if (!weightValue || weightValue <= 0) {
      alert("Must fill value greater than 0 to share the row.");
      return;
    }

    const pricePerGram = calculatePricePerGram(row.Carat);

    const subtotal = calculateSubtotal(pricePerGram, weightValue);
    setSharedRows((prev) => [
      ...prev,
      { ...row, pricePerGram, weight: weightValue, subtotal },
    ]);
  };

  const handleUnshareRow = (Carat) => {
    setSharedRows((prev) => prev.filter((row) => row.Carat !== Carat));
  };

  const resetSharedRows = () => {
    setSharedRows([]);
    setWeights({});
  };

  return (
    <Box
      sx={{ display: "flex",flexDirection: { xs: "column", md: "row" }, gap: 3, px: { md: 2 },
        py: { xs: 2, md: 4 }, justifyContent: "space-between",alignItems: { xs: "center", md: "flex-start" },
      }}
    >
      <Card
        sx={{borderRadius: 3, maxWidth: { xs: "100%", lg: 680 }, width: { xs: "100%", md: "90%" },
          border: "1px solid #9966CC",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
      {isXs ? "Price/24Carat" : "Price per 24 Carat (per gram)"}
    </Typography>
          <TextField
            label="Price/24 Carat"
            type="number"
            variant="outlined"
            size="small"
            value={baseRate}
            onChange={handleBaseRateChange}
            sx={{ maxWidth: "150px" }}
          />
        </Box>


        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ borderBottom: "none" }}></TableCell>
                <TableCell sx={{ borderBottom: "none", color: "grey" }}>
                  Weight(g)
                </TableCell>
                <TableCell sx={{ borderBottom: "none", color: "grey" }}>
                  Price/g
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
            {cardData.map((row, index) => {
                const pricePerGram = calculatePricePerGram(row.Carat);
                const weight = weights[row.Carat] || 0;
                const subtotal = calculateSubtotal(pricePerGram, weight);

                return (
                  <TableRow key={index}>
                    <TableCell sx={{borderBottom:"none"}} >{row.carat_display} Carat</TableCell>
                    <TableCell sx={{borderBottom:"none"}}>
                      <TextField
                        variant="standard"
                        type="number"
                        size="small"
                        value={weights[row.Carat] || ""}
                        onChange={(e) =>
                          handleWeightChange(
                            row.Carat,
                            parseFloat(e.target.value) || 0
                          )
                        }
                        error={weights[row.Carat] <= 0}
                        helperText={
                          weights[row.Carat] <= 0 ? "Must be greater than 0" : ""
                        }
                        InputProps={{
                          endAdornment: <InputAdornment position="end">g</InputAdornment>,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{borderBottom:"none"}} >
                    <Typography display="flex" alignItems="center">
    <CurrencyPoundIcon sx={{ fontSize: "small", mr: 0.5 }} />
    {pricePerGram.toFixed(3)}
  </Typography>
                    </TableCell>
                    <TableCell sx={{borderBottom:"none"}}>
                    <Typography display="flex" alignItems="center">
    <CurrencyPoundIcon sx={{ fontSize: "small", mr: 0.5 }} />
    {subtotal.toFixed(3)}
  </Typography>
                    </TableCell>
                    <TableCell sx={{borderBottom:"none"}}>
                      {!sharedRows.some(
                        (sharedRow) => sharedRow.Carat === row.Carat
                      ) ? (
                        <IconButton
                          onClick={() => handleShareRow(index)}
                          color="primary"
                          disabled={!weights[row.Carat] || weights[row.Carat] <= 0}
                        >
                          <ArrowRightAltIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={() => handleUnshareRow(row.Carat)}
                          color="primary"
                        >
                          <ArrowBackIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Box
        sx={{
          width: { xs: "100%", lg: "40%" },
        }}
      >
        <SummaryCard
          sharedRows={sharedRows}
          resetSharedRows={resetSharedRows}
        />
      </Box>
    </Box>
  );
};







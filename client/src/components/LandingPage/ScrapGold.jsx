import React from "react";
import {Box,Card,Paper,Table,TableBody,TableCell,TableContainer,TableHead,IconButton,TableRow,TextField,} from "@mui/material";
import cardData from "../../data/cardData.json";
import { SummaryCard } from "./SummaryCard";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CurrencyPoundIcon from "@mui/icons-material/CurrencyPound";

export const ScrapGold = ({ weights, setWeights, sharedRows, setSharedRows }) => {
  const calculateSubtotal = (pricePerGram, weight) => {
    return pricePerGram * (weight || 0);
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

    const subtotal = calculateSubtotal(row.pricePerGram, weightValue);
    setSharedRows((prev) => [
      ...prev,
      { ...row, weight: weightValue, subtotal },
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
        py: { xs: 2, md: 4 }, justifyContent: "space-between",alignItems: { xs: "center", lg: "flex-start" },
      }}
    >
      <Card
        sx={{borderRadius: 3, maxWidth: { xs: "100%", lg: 680 }, width: { xs: "100%", md: "90%" },
          border: "1px solid #9966CC",
        }}
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ borderBottom: "none" }}></TableCell>
                <TableCell sx={{ borderBottom: "none", color: "grey" }}>
                  Price/g
                </TableCell>
                <TableCell sx={{ borderBottom: "none", color: "grey" }}>
                  Weight(g)
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
              {cardData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{borderBottom: "none", backgroundColor: sharedRows.some(
                        (sharedRow) => sharedRow.Carat === row.Carat
                      )
                        ? "#f0f8ff"
                        : "inherit",
                    }}
                  >
                    {row.Carat}
                  </TableCell>
                  <TableCell
                    sx={{ borderBottom: "none", backgroundColor: sharedRows.some(
                        (sharedRow) => sharedRow.Carat === row.Carat
                      )
                        ? "#f0f8ff"
                        : "inherit",
                    }}
                  >
                    <CurrencyPoundIcon sx={{ fontSize: "small" }} />
                    {row.pricePerGram}
                  </TableCell>
                  <TableCell
                    sx={{borderBottom: "none",backgroundColor: sharedRows.some(
                        (sharedRow) => sharedRow.Carat === row.Carat
                      )
                        ? "#f0f8ff"
                        : "inherit",
                    }}
                  >
                    <TextField
                      variant="standard" type="number" size="small" value={weights[row.Carat] || ""}
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
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    <CurrencyPoundIcon sx={{ fontSize: "small" }} />
                    {calculateSubtotal(row.pricePerGram, weights[row.Carat])}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {!sharedRows.some((sharedRow) => sharedRow.Carat === row.Carat) ? (
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
              ))}
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








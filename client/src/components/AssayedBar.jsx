import {
  OutlinedInput,
  Table,
  Box,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

export const AssayedBar = ({ baseRate }) => {
  const [purity, setPurity] = useState("");
  const [weight, setWeight] = useState("");

  const handlePurityChange = (e) => {
    let value = e.target.value;

    if (/^\d{0,3}(\.\d{0,2})?$/.test(value)) {
      if (parseFloat(value) > 100) return;
      setPurity(value);
    }
  };

  const handleWeightChange = (e) => {
    setWeight(e.target.value);
  };

  const pricePerGram = purity ? (parseFloat(purity) * baseRate) / 100 : 0;
  const subtotal = weight ? parseFloat(weight) * pricePerGram : 0;

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
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </>
  );
};

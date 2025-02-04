import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import CurrencyPoundIcon from "@mui/icons-material/CurrencyPound";

export const SummaryAssayed = ({ sharedAssayed = [] }) => {
  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                borderBottom: "none",
                color: "grey",
                borderBottom: "1px solid grey",
              }}
            >
              Type
            </TableCell>
            <TableCell
              sx={{
                borderBottom: "none",
                color: "grey",
                borderBottom: "1px solid grey",
              }}
            >
              Purity
            </TableCell>
            <TableCell
              sx={{
                borderBottom: "none",
                color: "grey",
                borderBottom: "1px solid grey",
              }}
            >
              Weight
            </TableCell>
            <TableCell
              sx={{
                borderBottom: "none",
                color: "grey",
                borderBottom: "1px solid grey",
              }}
            >
              Subtotal
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sharedAssayed.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.purity}%</TableCell>
              <TableCell>{row.weight}g</TableCell>
              <TableCell><CurrencyPoundIcon sx={{fontSize:"small"}}/>{row.subtotal}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

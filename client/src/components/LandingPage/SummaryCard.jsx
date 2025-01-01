import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Box,
  Button,
} from "@mui/material";
import CurrencyPoundIcon from "@mui/icons-material/CurrencyPound";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePdf from "./InvoicePdf";

export const SummaryCard = ({ sharedRows }) => {
  const totalWeight = sharedRows.reduce(
    (sum, row) => sum + (row.weight || 0),
    0
  );
  const totalSubtotal = sharedRows.reduce(
    (sum, row) => sum + (row.subtotal || 0),
    0
  );
  // Disable PDF generation if sharedRows is empty
  const isPdfDisabled = sharedRows.length === 0;

  return (
    <Card sx={{ m: 2, borderRadius: 3, maxWidth: 680 }}>
      <CardContent>
        <Typography sx={{ fontSize: 15, fontWeight: 550 }}>Summary</Typography>
        {sharedRows.length === 0 ? (
          <Typography>No items shared yet.</Typography>
        ) : (
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
                  Goods
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: "none",
                    color: "grey",
                    borderBottom: "1px solid grey",
                  }}
                >
                  Quantity
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: "none",
                    color: "grey",
                    borderBottom: "1px solid grey",
                  }}
                >
                  Weight(g)
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
              {sharedRows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {row.Carat}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}></TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {row.weight}g
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>
                    <CurrencyPoundIcon sx={{ fontSize: "small" }} />
                    {row.subtotal}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    borderTop: "1px solid grey",
                    borderBottom: "1px solid grey",
                  }}
                >
                  Total
                </TableCell>
                <TableCell
                  sx={{
                    borderTop: "1px solid grey",
                    borderBottom: "1px solid grey",
                  }}
                ></TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    borderTop: "1px solid grey",
                    borderBottom: "1px solid grey",
                  }}
                >
                  {totalWeight}g
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    borderTop: "1px solid grey",
                    borderBottom: "1px solid grey",
                  }}
                >
                  <CurrencyPoundIcon sx={{ fontSize: "small" }} />
                  {totalSubtotal.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <PDFDownloadLink
            document={
              <InvoicePdf
                sharedRows={sharedRows}
                totalWeight={totalWeight}
                totalSubtotal={totalSubtotal}
              />
            }
            fileName="invoice.pdf"
            disabled={isPdfDisabled}
          >
            {({ loading }) => (
              <Button
                variant="outlined"
                sx={{
                  textTransform: "none",
                  color: isPdfDisabled ? "grey" : "primary.main",
                  borderColor: "primary.main",
                  "&:hover,&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "white",
                  },
                }}
                disabled={isPdfDisabled}
              >
                {loading ? "Loading document..." : "Generate Invoice"}
              </Button>
            )}
          </PDFDownloadLink>
          <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              color: "grey",
              borderColor: "primary.main",
              "&:hover,&.Mui-selected": {
                backgroundColor: "primary.main",
                color: "white",
              },
            }}
          >
            Calculate Again
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

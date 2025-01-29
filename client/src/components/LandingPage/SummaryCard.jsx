import React, { useState } from "react";
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
  Menu,
  MenuItem,
} from "@mui/material";
import CurrencyPoundIcon from "@mui/icons-material/CurrencyPound";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePdf } from "../invoice/InvoicePdf";
import Receipt from ".././Receipt";
import { ShortReceipt } from "../ShortReceipt";

export const SummaryCard = ({ sharedRows, resetSharedRows }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const isDropdownOpen = Boolean(anchorEl);

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const handleReceiptGenerate = () => {
    setShowReceipt(true);
    handleDropdownClose();
  };

  const isSummaryEmpty = sharedRows.length === 0;
  const totalWeight = sharedRows.reduce(
    (sum, row) => sum + (row.weight || 0),
    0
  );
  const totalQuantity = sharedRows.reduce(
    (sum, row) => sum + (row.quantity || 0),
    0
  );
  const totalSubtotal = sharedRows.reduce(
    (sum, row) => sum + (row.subtotal || 0),
    0
  );

  return (
    <Card sx={{ m: 2, borderRadius: 3, maxWidth: 680 }}>
      <CardContent>
        <Typography sx={{ fontSize: 15, fontWeight: 550 }}>Summary</Typography>
        {isSummaryEmpty ? (
          <Typography>No items shared yet.</Typography>
        ) : (
          <>
            <Box sx={{ overflowX: "auto" }}>
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
                <span
                  style={{
                    color: "grey",
                    marginLeft: "15px",
                    marginTop: "10px",
                  }}
                >
                  Scrap
                </span>
                <TableBody>
                  {sharedRows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ borderBottom: "none" }}>
                        <Typography display="flex" alignItems="center">
                          {row.Carat}{" "}
                          <span style={{ marginLeft: "4px" }}>Carat</span>
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ borderBottom: "none" }}>
                        {row.quantity || " "}
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none" }}>
                        {row.weight}g
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none" }}>
                        <Typography display="flex" alignItems="center">
                          <CurrencyPoundIcon
                            sx={{ fontSize: "small", mr: 0.5 }}
                          />
                          {row.subtotal.toFixed(3)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
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
                        fontWeight: "bold",
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
                      {totalSubtotal.toFixed(3)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", md: "row" },
                mt: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={handleDropdownClick}
                sx={{
                  textTransform: "none",
                  color: "grey",
                  borderColor: "primary.main",
                  "&:hover,&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "white",
                  },
                  width: { xs: "100%", md: "auto" },
                }}
              >
                Generate Options
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={isDropdownOpen}
                onClose={handleDropdownClose}
              >
                <MenuItem>
                  <PDFDownloadLink
                    document={
                      <ShortReceipt
                        sharedRows={sharedRows}
                        totalWeight={totalWeight}
                        totalSubtotal={totalSubtotal}
                      />
                    }
                    fileName="shortReceipt.pdf"
                  >
                    {({ loading }) =>
                      loading ? "Loading..." : "Short Receipt"
                    }
                  </PDFDownloadLink>
                </MenuItem>

                <MenuItem>
                  <PDFDownloadLink
                    document={
                      <Receipt
                        sharedRows={sharedRows}
                        totalWeight={totalWeight}
                        totalSubtotal={totalSubtotal}
                      />
                    }
                    fileName="receipt.pdf"
                  >
                    {({ loading }) =>
                      loading ? "Loading..." : "Receipt Generate"
                    }
                  </PDFDownloadLink>
                </MenuItem>

                <MenuItem>
                  <PDFDownloadLink
                    document={
                      <InvoicePdf
                        sharedRows={sharedRows}
                        totalWeight={totalWeight}
                        totalQuantity={totalQuantity}
                        totalSubtotal={totalSubtotal}
                      />
                    }
                    fileName="invoice.pdf"
                  >
                    {({ loading }) => (loading ? "Loading..." : "Postal Form")}
                  </PDFDownloadLink>
                </MenuItem>
              </Menu>
              <Button
                variant="outlined"
                onClick={resetSharedRows}
                sx={{
                  textTransform: "none",
                  color: "grey",
                  borderColor: "primary.main",
                  "&:hover,&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "white",
                  },
                  width: { xs: "100%", md: "auto" },
                }}
              >
                Calculate Again
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

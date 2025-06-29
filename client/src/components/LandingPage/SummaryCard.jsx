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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  useMediaQuery,
  IconButton,
  Divider,
  Paper
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SettingsIcon from "@mui/icons-material/Settings";
import BusinessIcon from "@mui/icons-material/Business";
import PreviewIcon from "@mui/icons-material/Preview";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePdf } from "../invoice/InvoicePdf";
import Receipt from ".././Receipt";
import { ShortReceipt } from "../ShortReceipt";

export const SummaryCard = ({ 
  sharedRows, 
  resetSharedRows, 
  assayedBarData = { weight: 0, subtotal: 0 }, 
  businessConfig,
  setBusinessConfig,
  currency = "£",
  weightUnit = "g"
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isBusinessDialogOpen, setIsBusinessDialogOpen] = useState(false);
  const [tempBusinessConfig, setTempBusinessConfig] = useState(businessConfig);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewType, setPreviewType] = useState('short'); // 'short', 'full', 'invoice'
 
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isDropdownOpen = Boolean(anchorEl);

  // Get currency symbol
  const getCurrencySymbol = () => {
    switch (currency) {
      case 'GBP': return '£';
      case 'USD': return '$';
      case 'EUR': return '€';
      default: return '£';
    }
  };

  // Get weight unit label
  const getWeightUnitLabel = () => {
    switch (weightUnit) {
      case 'gram': return 'g';
      case 'ounce': return 'oz';
      case 'kilogram': return 'kg';
      default: return 'g';
    }
  };

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const handleBusinessConfigOpen = () => {
    setTempBusinessConfig({ ...businessConfig });
    setIsBusinessDialogOpen(true);
  };

  const handleBusinessConfigClose = () => {
    setIsBusinessDialogOpen(false);
    setTempBusinessConfig(businessConfig);
  };

  const handleBusinessConfigSave = () => {
    setBusinessConfig({ ...tempBusinessConfig });
    setIsBusinessDialogOpen(false);
  };

  const handleBusinessFieldChange = (section, field, value) => {
    setTempBusinessConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handlePreviewOpen = (type) => {
    setPreviewType(type);
    setPreviewOpen(true);
    setAnchorEl(null);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
  };

  // Enhanced receipt preview component
  const ReceiptPreview = ({ type }) => {
    const currentDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
    
    const currentTime = new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    return (
      <Paper
        elevation={3}
        sx={{
          maxWidth: 400,
          mx: 'auto',
          p: 3,
          background: 'linear-gradient(135deg, #fefcf3 0%, #f9f7f1 100%)',
          border: '2px solid #d97706',
          borderRadius: 3,
          fontFamily: 'monospace'
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3, pb: 2, borderBottom: '2px dashed #d97706' }}>
          <Typography sx={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: '#451a03',
            mb: 1,
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            ★ {businessConfig.receipt.title} ★
          </Typography>
          <Typography sx={{ fontSize: '0.9rem', color: '#92400e', fontWeight: 600 }}>
            {currentDate}, {currentTime}
          </Typography>
        </Box>

        {/* Business Info */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 'bold', color: '#451a03', fontSize: '1.1rem' }}>
            {businessConfig.businessName}
          </Typography>
          <Typography sx={{ color: '#92400e', fontSize: '0.9rem' }}>
            {businessConfig.address.line1}
          </Typography>
          <Typography sx={{ color: '#92400e', fontSize: '0.9rem' }}>
            {businessConfig.address.line2}
          </Typography>
          <Typography sx={{ color: '#92400e', fontSize: '0.9rem' }}>
            {businessConfig.address.city} {businessConfig.address.postcode}
          </Typography>
          {type !== 'short' && (
            <Box sx={{ mt: 1, fontSize: '0.8rem', color: '#92400e' }}>
              <Typography>VAT Registration No: {businessConfig.registration.vatNumber}</Typography>
              <Typography>Telephone No: {businessConfig.contact.phone}</Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2, borderColor: '#d97706', borderStyle: 'dashed' }} />

        {/* Items */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mb: 2,
            fontWeight: 'bold',
            color: '#451a03',
            borderBottom: '1px solid #d97706',
            pb: 1
          }}>
            <Typography sx={{ fontWeight: 'bold' }}>Items</Typography>
            <Typography sx={{ fontWeight: 'bold' }}>Weight ({getWeightUnitLabel()})</Typography>
            {type === 'invoice' && <Typography sx={{ fontWeight: 'bold' }}>Subtotal ({getCurrencySymbol()})</Typography>}
          </Box>
          
          {sharedRows.map((row, index) => (
            <Box key={index} sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mb: 1,
              color: '#451a03'
            }}>
              <Typography sx={{ fontSize: '0.9rem' }}>
                {row.description}
              </Typography>
              <Typography sx={{ fontSize: '0.9rem' }}>
                {row.weight}{getWeightUnitLabel()}
              </Typography>
              {type === 'invoice' && (
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#059669' }}>
                  {getCurrencySymbol()}{row.subtotal?.toFixed(2) || '0.00'}
                </Typography>
              )}
            </Box>
          ))}

          {assayedBarData.weight > 0 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mb: 1,
              color: '#451a03'
            }}>
              <Typography sx={{ fontSize: '0.9rem' }}>
                Assayed Bar ({assayedBarData.purity}% purity)
              </Typography>
              <Typography sx={{ fontSize: '0.9rem' }}>
                {assayedBarData.weight}{getWeightUnitLabel()}
              </Typography>
              {type === 'invoice' && (
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#059669' }}>
                  {getCurrencySymbol()}{assayedBarData.subtotal?.toFixed(2) || '0.00'}
                </Typography>
              )}
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2, borderColor: '#d97706', borderStyle: 'dashed' }} />

        {/* Totals */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mb: 1,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: '#451a03'
          }}>
            <Typography sx={{ fontWeight: 'bold' }}>Total Weight:</Typography>
            <Typography sx={{ fontWeight: 'bold' }}>{totalWeight.toFixed(1)}{getWeightUnitLabel()}</Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: '#059669',
            p: 1,
            bgcolor: '#f0f9ff',
            borderRadius: 1,
            border: '1px solid #059669'
          }}>
            <Typography sx={{ fontWeight: 'bold' }}>Total Amount:</Typography>
            <Typography sx={{ fontWeight: 'bold' }}>{getCurrencySymbol()}{totalSubtotal.toFixed(2)}</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2, borderColor: '#d97706', borderStyle: 'dashed' }} />

        {/* Footer */}
        <Box sx={{ textAlign: 'center', color: '#92400e', fontSize: '0.9rem' }}>
          <Typography sx={{ fontWeight: 'bold' }}>
            {businessConfig.receipt.footerMessage}
          </Typography>
        </Box>
      </Paper>
    );
  };

  const isSummaryEmpty = sharedRows.length === 0 && assayedBarData.weight === 0;
  const totalWeight = sharedRows.reduce(
    (sum, row) => sum + (row.weight || 0),
    0
  ) + (assayedBarData.weight || 0);
  const totalQuantity = sharedRows.reduce(
    (sum, row) => sum + (row.quantity || 0),
    0
  ) + (assayedBarData.weight > 0 ? 1 : 0); // Count assayed bar as 1 item if it has weight
  const totalSubtotal = sharedRows.reduce(
    (sum, row) => sum + (row.subtotal || 0),
    0
  ) + (assayedBarData.subtotal || 0);

  return (
    <Card
      elevation={4}
      sx={{
        borderRadius: { xs: 3, md: 5 },
        background: "linear-gradient(135deg, #ffffff 0%, #fefefe 30%, #fdfdfc 70%, #fbfbfa 100%)",
        border: "1px solid #e5ddd5",
        boxShadow: isXs 
          ? "0 6px 20px rgba(139, 115, 85, 0.08), 0 2px 6px rgba(139, 115, 85, 0.06)" 
          : "0 12px 40px rgba(139, 115, 85, 0.12), 0 4px 12px rgba(139, 115, 85, 0.08)",
        transition: "all 0.3s ease-in-out",
        m: { xs: 0, md: 2 },
        maxWidth: { xs: "100%", md: 680 },
        width: "100%",
        "&:hover": {
          transform: isXs ? "none" : "translateY(-3px)",
          boxShadow: isXs 
            ? "0 8px 25px rgba(139, 115, 85, 0.12), 0 4px 8px rgba(139, 115, 85, 0.08)" 
            : "0 16px 48px rgba(139, 115, 85, 0.16), 0 6px 16px rgba(139, 115, 85, 0.1)",
          borderColor: "#d4c4b0"
        }
      }}
    >
      <Box
        sx={{
          background: "linear-gradient(135deg, #451a03 0%, #5d2506 50%, #d97706 100%)",
          color: "#ffffff",
          p: { xs: 2, md: 2.5 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 4px 20px rgba(69, 26, 3, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.03) 50%, transparent 70%)",
            pointerEvents: "none"
          }
        }}
      >
        <Typography 
          variant={isXs ? "h6" : "h5"} 
          sx={{ 
            fontWeight: "700",
            color: "#ffffff",
            letterSpacing: "0.5px",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            textShadow: "0 2px 4px rgba(0,0,0,0.2)" 
          }}
        >
          {businessConfig.receipt.title}
        </Typography>
        <IconButton
          onClick={handleBusinessConfigOpen}
          size="small"
          sx={{
            color: "#ffffff",
            bgcolor: "rgba(255, 255, 255, 0.1)",
            borderRadius: 2,
            border: "1px solid rgba(255, 255, 255, 0.2)",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.2)",
              transform: "scale(1.05)",
              borderColor: "rgba(255, 255, 255, 0.4)"
            }
          }}
        >
          <SettingsIcon sx={{ fontSize: "1.2rem" }} />
        </IconButton>
      </Box>
      
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        {isSummaryEmpty ? (
          <Box
            sx={{
              textAlign: "center",
              py: { xs: 4, md: 6 },
              px: 2,
              background: "linear-gradient(135deg, #fef7ed 0%, #fed7aa 100%)",
              borderRadius: 3,
              border: "2px dashed #d97706",
              minHeight: { xs: "150px", md: "200px" },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 2
            }}
          >
            <BusinessIcon sx={{ 
              fontSize: { xs: "2.5rem", md: "3.5rem" }, 
              color: "#92400e",
              opacity: 0.6 
            }} />
            <Typography 
              variant="body1" 
              sx={{ 
                color: "#451a03", 
                fontWeight: "600",
                fontSize: { xs: "0.9rem", md: "1rem" },
                maxWidth: "300px"
              }}
            >
              Add metals to your calculation and click the arrow to generate your summary receipt.
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ overflowX: "auto" }}>
              <Table size={isXs ? "small" : "medium"}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        borderBottom: "2px solid #d97706",
                        color: "#451a03",
                        fontWeight: "800",
                        bgcolor: "#fef3c7",
                        fontSize: { xs: "0.7rem", md: "0.875rem" },
                        px: { xs: 1, md: 2 },
                        py: { xs: 1, md: 1.5 },
                        width: { xs: "40%", md: "35%" }
                      }}
                    >
                      Items
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "2px solid #d97706",
                        color: "#451a03",
                        fontWeight: "800",
                        bgcolor: "#fef3c7",
                        fontSize: { xs: "0.7rem", md: "0.875rem" },
                        px: { xs: 1, md: 2 },
                        py: { xs: 1, md: 1.5 },
                        width: { xs: "15%", md: "15%" }
                      }}
                    >
                      Qty
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "2px solid #d97706",
                        color: "#451a03",
                        fontWeight: "800",
                        bgcolor: "#fef3c7",
                        fontSize: { xs: "0.7rem", md: "0.875rem" },
                        px: { xs: 1, md: 2 },
                        py: { xs: 1, md: 1.5 },
                        width: { xs: "20%", md: "20%" }
                      }}
                    >
                      Weight
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "2px solid #d97706",
                        color: "#451a03",
                        fontWeight: "800",
                        bgcolor: "#fef3c7",
                        fontSize: { xs: "0.7rem", md: "0.875rem" },
                        px: { xs: 1, md: 2 },
                        py: { xs: 1, md: 1.5 },
                        width: { xs: "25%", md: "30%" }
                      }}
                    >
                      Amount
                    </TableCell>
                  </TableRow>
                </TableHead>
                <span
                  style={{
                    color: "#92400e",
                    marginLeft: "15px",
                    marginTop: "10px",
                    fontWeight: "600",
                    fontSize: "14px"
                  }}
                >
                  Scrap Gold
                </span>
                <TableBody>
                  {sharedRows.map((row, index) => (
                    <TableRow 
                      key={index}
                      sx={{
                        "&:nth-of-type(odd)": { bgcolor: "#fef7ed" },
                        "&:nth-of-type(even)": { bgcolor: "#ffffff" },
                        "&:hover": { bgcolor: "#fed7aa" }
                      }}
                    >
                      <TableCell sx={{ borderBottom: "1px solid #f3e8d6", color: "#451a03", fontWeight: "600" }}>
                        <Typography display="flex" alignItems="center" sx={{ fontWeight: "600" }}>
                          {row.Carat}{" "}
                          <span style={{ marginLeft: "4px" }}>Carat</span>
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: "1px solid #f3e8d6", color: "#451a03", fontWeight: "600" }}>
                        {row.quantity || "1"}
                      </TableCell>
                      <TableCell sx={{ borderBottom: "1px solid #f3e8d6", color: "#451a03", fontWeight: "600" }}>
                        {row.weight}{getWeightUnitLabel()}
                      </TableCell>
                      <TableCell sx={{ borderBottom: "1px solid #f3e8d6" }}>
                        <Typography sx={{ fontWeight: "700", color: "#059669" }}>
                          {getCurrencySymbol()}{row.subtotal.toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Assayed Bar Row */}
                  {assayedBarData.weight > 0 && (
                    <>
                      <TableRow>
                        <TableCell colSpan={4} sx={{ borderBottom: "none", pt: 2 }}>
                          <Typography
                            sx={{
                              color: "#92400e",
                              fontSize: "14px",
                              fontStyle: "italic",
                              fontWeight: "600"
                            }}
                          >
                            Assayed Bar
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{
                        "&:hover": { bgcolor: "#fed7aa" },
                        bgcolor: "#fef7ed"
                      }}>
                        <TableCell sx={{ borderBottom: "1px solid #f3e8d6", color: "#451a03", fontWeight: "600" }}>
                          <Typography display="flex" alignItems="center" sx={{ fontWeight: "600" }}>
                            Assayed Bar{" "}
                            <span style={{ marginLeft: "4px", fontSize: "12px", color: "#92400e" }}>
                              ({assayedBarData.purity.toFixed(2)}%)
                            </span>
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #f3e8d6", color: "#451a03", fontWeight: "600" }}>
                          1
                        </TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #f3e8d6", color: "#451a03", fontWeight: "600" }}>
                          {assayedBarData.weight.toFixed(3)}{getWeightUnitLabel()}
                        </TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #f3e8d6" }}>
                          <Typography sx={{ fontWeight: "700", color: "#059669" }}>
                            {getCurrencySymbol()}{assayedBarData.subtotal.toFixed(2)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                  <TableRow sx={{ bgcolor: "#fed7aa" }}>
                    <TableCell
                      sx={{
                        fontWeight: "800",
                        borderTop: "2px solid #d97706",
                        borderBottom: "2px solid #d97706",
                        color: "#451a03",
                        fontSize: "1rem"
                      }}
                    >
                      TOTAL
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "800",
                        borderTop: "2px solid #d97706",
                        borderBottom: "2px solid #d97706",
                        color: "#451a03"
                      }}
                    ></TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "800",
                        borderTop: "2px solid #d97706",
                        borderBottom: "2px solid #d97706",
                        color: "#451a03",
                        fontSize: "1rem"
                      }}
                    >
                      {totalWeight.toFixed(3)}{getWeightUnitLabel()}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "800",
                        borderTop: "2px solid #d97706",
                        borderBottom: "2px solid #d97706"
                      }}
                    >
                      <Typography sx={{ fontWeight: "800", color: "#059669", fontSize: "1.1rem" }}>
                        {getCurrencySymbol()}{totalSubtotal.toFixed(2)}
                      </Typography>
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
                mt: 3,
                p: 2,
                background: "linear-gradient(135deg, #fef7ed 0%, #fed7aa 100%)",
                borderRadius: 2,
                border: "1px solid #d97706"
              }}
            >
              <Button
                variant="outlined"
                onClick={handleDropdownClick}
                sx={{
                  textTransform: "none",
                  fontWeight: "700",
                  borderRadius: 2,
                  borderWidth: "2px",
                  color: "#92400e",
                  borderColor: "#d97706",
                  "&:hover": {
                    borderColor: "#92400e",
                    bgcolor: "rgba(146, 64, 14, 0.1)",
                    borderWidth: "2px"
                  },
                  width: { xs: "100%", md: "auto" },
                }}
                endIcon={<ArrowDropDownIcon />}
              >
                Generate Receipt
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={isDropdownOpen}
                onClose={handleDropdownClose}
                PaperProps={{
                  sx: {
                    border: "1px solid #d97706",
                    borderRadius: 2,
                    minWidth: 200
                  }
                }}
              >
                <MenuItem onClick={() => handlePreviewOpen('short')}>
                  <PreviewIcon sx={{ mr: 1, color: '#d97706' }} />
                  Preview Short Receipt
                </MenuItem>
                <MenuItem>
                  <PDFDownloadLink
                    document={
                      <ShortReceipt
                        sharedRows={sharedRows}
                        totalWeight={totalWeight}
                        totalSubtotal={totalSubtotal}
                        businessConfig={businessConfig}
                        currency={currency}
                        weightUnit={weightUnit}
                      />
                    }
                    fileName="shortReceipt.pdf"
                    style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}
                  >
                    {({ loading }) => (
                      <>
                        <DownloadIcon sx={{ mr: 1, color: '#059669' }} />
                        {loading ? "Loading..." : "Download Short Receipt"}
                      </>
                    )}
                  </PDFDownloadLink>
                </MenuItem>

                <Divider />

                <MenuItem onClick={() => handlePreviewOpen('full')}>
                  <PreviewIcon sx={{ mr: 1, color: '#d97706' }} />
                  Preview Full Receipt
                </MenuItem>
                <MenuItem>
                  <PDFDownloadLink
                    document={
                      <Receipt
                        sharedRows={sharedRows}
                        totalWeight={totalWeight}
                        totalSubtotal={totalSubtotal}
                        businessConfig={businessConfig}
                        currency={currency}
                        weightUnit={weightUnit}
                      />
                    }
                    fileName="receipt.pdf"
                    style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}
                  >
                    {({ loading }) => (
                      <>
                        <DownloadIcon sx={{ mr: 1, color: '#059669' }} />
                        {loading ? "Loading..." : "Download Full Receipt"}
                      </>
                    )}
                  </PDFDownloadLink>
                </MenuItem>

                <Divider />

                <MenuItem onClick={() => handlePreviewOpen('invoice')}>
                  <PreviewIcon sx={{ mr: 1, color: '#d97706' }} />
                  Preview Invoice
                </MenuItem>
                <MenuItem>
                  <PDFDownloadLink
                    document={
                      <InvoicePdf
                        sharedRows={sharedRows}
                        totalWeight={totalWeight}
                        totalQuantity={totalQuantity}
                        totalSubtotal={totalSubtotal}
                        businessConfig={businessConfig}
                        currency={currency}
                        weightUnit={weightUnit}
                      />
                    }
                    fileName="invoice.pdf"
                    style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}
                  >
                    {({ loading }) => (
                      <>
                        <DownloadIcon sx={{ mr: 1, color: '#059669' }} />
                        {loading ? "Loading..." : "Download Invoice"}
                      </>
                    )}
                  </PDFDownloadLink>
                </MenuItem>
              </Menu>
              <Button
                variant="contained"
                onClick={resetSharedRows}
                sx={{
                  textTransform: "none",
                  fontWeight: "700",
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
                  color: "#fff",
                  border: "2px solid #b91c1c",
                  "&:hover": {
                    background: "linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)",
                    boxShadow: "0 4px 12px rgba(220, 38, 38, 0.3)"
                  },
                  width: { xs: "100%", md: "auto" },
                }}
              >
                Reset Calculator
              </Button>
            </Box>

            {/* Receipt Preview Dialog */}
            <Dialog
              open={previewOpen}
              onClose={handlePreviewClose}
              maxWidth="sm"
              fullWidth
              fullScreen={isXs}
              PaperProps={{
                sx: {
                  borderRadius: isXs ? 0 : 4,
                  background: "linear-gradient(135deg, #fefcf3 0%, #f7f3e9 100%)",
                  border: isXs ? "none" : "2px solid #d97706",
                  maxHeight: isXs ? "100vh" : "90vh"
                }
              }}
            >
              <DialogTitle sx={{
                background: "linear-gradient(135deg, #451a03 0%, #92400e 50%, #d97706 100%)",
                color: "#fef3c7",
                fontWeight: "800",
                borderBottom: "2px solid #f59e0b",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PreviewIcon />
                  Receipt Preview - {previewType === 'short' ? 'Short' : previewType === 'full' ? 'Full' : 'Invoice'}
                </Box>
                <IconButton
                  onClick={handlePreviewClose}
                  sx={{
                    color: "#fef3c7",
                    "&:hover": {
                      bgcolor: "rgba(254, 243, 199, 0.2)"
                    }
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              
              <DialogContent sx={{ p: { xs: 1, md: 3 }, maxHeight: "70vh", overflowY: "auto" }}>
                <ReceiptPreview type={previewType} />
              </DialogContent>

              <DialogActions sx={{
                p: 3,
                background: "linear-gradient(135deg, #fef7ed 0%, #fed7aa 100%)",
                borderTop: "2px solid #d97706",
                gap: 2
              }}>
                <Button
                  onClick={handlePreviewClose}
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    borderWidth: "2px",
                    color: "#92400e",
                    borderColor: "#d97706",
                    "&:hover": {
                      borderColor: "#92400e",
                      bgcolor: "rgba(146, 64, 14, 0.1)",
                      borderWidth: "2px"
                    }
                  }}
                >
                  Close Preview
                </Button>
                
                {previewType === 'short' && (
                  <PDFDownloadLink
                    document={
                      <ShortReceipt
                        sharedRows={sharedRows}
                        totalWeight={totalWeight}
                        totalSubtotal={totalSubtotal}
                        businessConfig={businessConfig}
                        currency={currency}
                        weightUnit={weightUnit}
                      />
                    }
                    fileName="shortReceipt.pdf"
                  >
                    {({ loading }) => (
                      <Button
                        variant="contained"
                        disabled={loading}
                        sx={{
                          borderRadius: 2,
                          background: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
                          color: "#fef3c7",
                          border: "2px solid #92400e",
                          "&:hover": {
                            background: "linear-gradient(135deg, #92400e 0%, #d97706 100%)"
                          }
                        }}
                        startIcon={<DownloadIcon />}
                      >
                        {loading ? "Generating..." : "Download PDF"}
                      </Button>
                    )}
                  </PDFDownloadLink>
                )}

                {previewType === 'full' && (
                  <PDFDownloadLink
                    document={
                      <Receipt
                        sharedRows={sharedRows}
                        totalWeight={totalWeight}
                        totalSubtotal={totalSubtotal}
                        businessConfig={businessConfig}
                        currency={currency}
                        weightUnit={weightUnit}
                      />
                    }
                    fileName="receipt.pdf"
                  >
                    {({ loading }) => (
                      <Button
                        variant="contained"
                        disabled={loading}
                        sx={{
                          borderRadius: 2,
                          background: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
                          color: "#fef3c7",
                          border: "2px solid #92400e",
                          "&:hover": {
                            background: "linear-gradient(135deg, #92400e 0%, #d97706 100%)"
                          }
                        }}
                        startIcon={<DownloadIcon />}
                      >
                        {loading ? "Generating..." : "Download PDF"}
                      </Button>
                    )}
                  </PDFDownloadLink>
                )}

                {previewType === 'invoice' && (
                  <PDFDownloadLink
                    document={
                      <InvoicePdf
                        sharedRows={sharedRows}
                        totalWeight={totalWeight}
                        totalQuantity={totalQuantity}
                        totalSubtotal={totalSubtotal}
                        businessConfig={businessConfig}
                        currency={currency}
                        weightUnit={weightUnit}
                      />
                    }
                    fileName="invoice.pdf"
                  >
                    {({ loading }) => (
                      <Button
                        variant="contained"
                        disabled={loading}
                        sx={{
                          borderRadius: 2,
                          background: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
                          color: "#fef3c7",
                          border: "2px solid #92400e",
                          "&:hover": {
                            background: "linear-gradient(135deg, #92400e 0%, #d97706 100%)"
                          }
                        }}
                        startIcon={<DownloadIcon />}
                      >
                        {loading ? "Generating..." : "Download PDF"}
                      </Button>
                    )}
                  </PDFDownloadLink>
                )}
              </DialogActions>
            </Dialog>
          </>
        )}
      </CardContent>

      {/* Business Configuration Dialog */}
      <Dialog
        open={isBusinessDialogOpen}
        onClose={handleBusinessConfigClose}
        maxWidth="md"
        fullWidth
        fullScreen={isXs}
        PaperProps={{
          sx: {
            borderRadius: isXs ? 0 : 4,
            background: "linear-gradient(135deg, #fefcf3 0%, #f7f3e9 100%)",
            border: isXs ? "none" : "2px solid #d97706"
          }
        }}
      >
        <DialogTitle sx={{
          background: "linear-gradient(135deg, #451a03 0%, #92400e 50%, #d97706 100%)",
          color: "#fef3c7",
          fontWeight: "800",
          borderBottom: "2px solid #f59e0b"
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BusinessIcon />
            Business Configuration
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Business Name */}
            <TextField
              label="Business Name"
              fullWidth
              value={tempBusinessConfig.businessName}
              onChange={(e) => setTempBusinessConfig(prev => ({ ...prev, businessName: e.target.value }))}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#fefcf3",
                  "& fieldset": { borderColor: "#d97706" },
                  "&:hover fieldset": { borderColor: "#92400e" },
                  "&.Mui-focused fieldset": { borderColor: "#451a03", borderWidth: "2px" }
                }
              }}
            />

            {/* Address Section */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: "#451a03", fontWeight: "700" }}>
                Address
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Address Line 1"
                  fullWidth
                  value={tempBusinessConfig.address.line1}
                  onChange={(e) => handleBusinessFieldChange('address', 'line1', e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#fefcf3",
                      "& fieldset": { borderColor: "#d97706" },
                      "&:hover fieldset": { borderColor: "#92400e" },
                      "&.Mui-focused fieldset": { borderColor: "#451a03", borderWidth: "2px" }
                    }
                  }}
                />
                <TextField
                  label="Address Line 2"
                  fullWidth
                  value={tempBusinessConfig.address.line2}
                  onChange={(e) => handleBusinessFieldChange('address', 'line2', e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#fefcf3",
                      "& fieldset": { borderColor: "#d97706" },
                      "&:hover fieldset": { borderColor: "#92400e" },
                      "&.Mui-focused fieldset": { borderColor: "#451a03", borderWidth: "2px" }
                    }
                  }}
                />
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    label="City"
                    fullWidth
                    value={tempBusinessConfig.address.city}
                    onChange={(e) => handleBusinessFieldChange('address', 'city', e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#fefcf3",
                        "& fieldset": { borderColor: "#d97706" },
                        "&:hover fieldset": { borderColor: "#92400e" },
                        "&.Mui-focused fieldset": { borderColor: "#451a03", borderWidth: "2px" }
                      }
                    }}
                  />
                  <TextField
                    label="Postcode"
                    value={tempBusinessConfig.address.postcode}
                    onChange={(e) => handleBusinessFieldChange('address', 'postcode', e.target.value)}
                    sx={{
                      width: "200px",
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#fefcf3",
                        "& fieldset": { borderColor: "#d97706" },
                        "&:hover fieldset": { borderColor: "#92400e" },
                        "&.Mui-focused fieldset": { borderColor: "#451a03", borderWidth: "2px" }
                      }
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Contact Section */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: "#451a03", fontWeight: "700" }}>
                Contact Information
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Phone"
                  fullWidth
                  value={tempBusinessConfig.contact.phone}
                  onChange={(e) => handleBusinessFieldChange('contact', 'phone', e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#fefcf3",
                      "& fieldset": { borderColor: "#d97706" },
                      "&:hover fieldset": { borderColor: "#92400e" },
                      "&.Mui-focused fieldset": { borderColor: "#451a03", borderWidth: "2px" }
                    }
                  }}
                />
                <TextField
                  label="Email"
                  fullWidth
                  value={tempBusinessConfig.contact.email}
                  onChange={(e) => handleBusinessFieldChange('contact', 'email', e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#fefcf3",
                      "& fieldset": { borderColor: "#d97706" },
                      "&:hover fieldset": { borderColor: "#92400e" },
                      "&.Mui-focused fieldset": { borderColor: "#451a03", borderWidth: "2px" }
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Registration Section */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: "#451a03", fontWeight: "700" }}>
                Registration Details
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="VAT Number"
                  fullWidth
                  value={tempBusinessConfig.registration.vatNumber}
                  onChange={(e) => handleBusinessFieldChange('registration', 'vatNumber', e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#fefcf3",
                      "& fieldset": { borderColor: "#d97706" },
                      "&:hover fieldset": { borderColor: "#92400e" },
                      "&.Mui-focused fieldset": { borderColor: "#451a03", borderWidth: "2px" }
                    }
                  }}
                />
                <TextField
                  label="Company Number"
                  fullWidth
                  value={tempBusinessConfig.registration.companyNumber}
                  onChange={(e) => handleBusinessFieldChange('registration', 'companyNumber', e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#fefcf3",
                      "& fieldset": { borderColor: "#d97706" },
                      "&:hover fieldset": { borderColor: "#92400e" },
                      "&.Mui-focused fieldset": { borderColor: "#451a03", borderWidth: "2px" }
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Receipt Settings */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: "#451a03", fontWeight: "700" }}>
                Receipt Settings
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Receipt Title"
                  fullWidth
                  value={tempBusinessConfig.receipt.title}
                  onChange={(e) => handleBusinessFieldChange('receipt', 'title', e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#fefcf3",
                      "& fieldset": { borderColor: "#d97706" },
                      "&:hover fieldset": { borderColor: "#92400e" },
                      "&.Mui-focused fieldset": { borderColor: "#451a03", borderWidth: "2px" }
                    }
                  }}
                />
                <TextField
                  label="Footer Message"
                  fullWidth
                  value={tempBusinessConfig.receipt.footerMessage}
                  onChange={(e) => handleBusinessFieldChange('receipt', 'footerMessage', e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#fefcf3",
                      "& fieldset": { borderColor: "#d97706" },
                      "&:hover fieldset": { borderColor: "#92400e" },
                      "&.Mui-focused fieldset": { borderColor: "#451a03", borderWidth: "2px" }
                    }
                  }}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{
          p: 3,
          background: "linear-gradient(135deg, #fef7ed 0%, #fed7aa 100%)",
          borderTop: "2px solid #d97706",
          gap: 2
        }}>
          <Button
            onClick={handleBusinessConfigClose}
            variant="outlined"
            sx={{
              borderColor: "#d97706",
              color: "#92400e",
              fontWeight: "700",
              "&:hover": {
                borderColor: "#92400e",
                bgcolor: "rgba(146, 64, 14, 0.1)"
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBusinessConfigSave}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
              color: "#fef3c7",
              fontWeight: "700",
              "&:hover": {
                background: "linear-gradient(135deg, #92400e 0%, #d97706 100%)"
              }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

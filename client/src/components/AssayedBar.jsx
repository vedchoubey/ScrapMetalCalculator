import {
  OutlinedInput,
  Table,
  Box,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  IconButton,
} from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

export const AssayedBar = ({ 
  baseRate,
  onAssayedBarChange,
  onAdd, // New prop for add functionality
  initialPurity = "",
  initialWeight = "",
  disabled = false,
  currency = 'GBP',
  weightUnit = 'gram'
}) => {
  const [purity, setPurity] = useState(initialPurity);
  const [weight, setWeight] = useState(initialWeight);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  // Helper functions for currency and weight unit
  const getCurrencySymbol = () => {
    const symbols = {
      'GBP': '£',
      'USD': '$',
      'EUR': '€'
    };
    return symbols[currency] || currency;
  };

  const getWeightUnitLabel = () => {
    return weightUnit === 'gram' ? 'g' : weightUnit === 'ounce' ? 'oz' : weightUnit === 'kilogram' ? 'kg' : weightUnit;
  };

  const handlePurityChange = useCallback((e) => {
    let value = e.target.value;

    // Allow empty string or valid decimal number up to 3 digits with 2 decimal places
    if (value === "" || /^\d{0,3}(\.\d{0,2})?$/.test(value)) {
      const numValue = parseFloat(value);
      if (value === "" || (numValue >= 0 && numValue <= 100)) {
        setPurity(value);
      }
    }
  }, []);

  const handleWeightChange = useCallback((e) => {
    let value = e.target.value;
    
    // Allow empty string or valid decimal number
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      const numValue = parseFloat(value);
      if (value === "" || (numValue >= 0 && numValue <= 99999)) {
        setWeight(value);
      }
    }
  }, []);

  const pricePerGram = purity && !isNaN(parseFloat(purity)) 
    ? (parseFloat(purity) * baseRate) / 100 
    : 0;
  const subtotal = weight && !isNaN(parseFloat(weight)) && pricePerGram > 0
    ? parseFloat(weight) * pricePerGram 
    : 0;

  // Handle add functionality
  const handleAdd = () => {
    if (onAdd && purity && weight && parseFloat(purity) > 0 && parseFloat(weight) > 0) {
      onAdd({
        purity: parseFloat(purity),
        weight: parseFloat(weight),
        pricePerGram,
        subtotal,
        type: 'Assayed Bar'
      });
      
      // Reset inputs after adding
      setPurity("");
      setWeight("");
    }
  };

  // Notify parent component of changes
  useEffect(() => {
    if (onAssayedBarChange) {
      onAssayedBarChange({
        purity: purity ? parseFloat(purity) : 0,
        weight: weight ? parseFloat(weight) : 0,
        pricePerGram,
        subtotal
      });
    }
  }, [purity, weight, pricePerGram, subtotal]); // Removed onAssayedBarChange from dependencies

  // For mobile screens, use a card layout instead of table
  if (isXs) {
    return (
      <Card sx={{ 
        background: "linear-gradient(135deg, #ffffff 0%, #fefefe 30%, #fdfdfc 70%, #fbfbfa 100%)",
        borderRadius: 4,
        border: "2px solid #e5ddd5",
        boxShadow: "0 8px 24px rgba(139, 115, 85, 0.1), 0 4px 8px rgba(139, 115, 85, 0.06)",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          boxShadow: "0 12px 32px rgba(139, 115, 85, 0.15), 0 6px 12px rgba(139, 115, 85, 0.08)",
          borderColor: "#d4c4b0"
        }
      }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ 
            color: "#451a03",
            fontWeight: "700",
            fontSize: "1rem",
            mb: 2,
            textAlign: "center"
          }}>
            Assayed Bar
          </Typography>
          
          {/* Input Fields in Grid */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Box>
                <Typography variant="caption" sx={{ 
                  color: "#92400e",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  fontSize: "0.7rem",
                  mb: 1,
                  display: "block"
                }}>
                  Purity (%)
                </Typography>
                <OutlinedInput
                  value={purity}
                  onChange={handlePurityChange}
                  placeholder="0"
                  disabled={disabled}
                  fullWidth
                  endAdornment={
                    <InputAdornment position="end">
                      <Typography sx={{ color: "#92400e", fontWeight: "600", fontSize: "0.8rem" }}>%</Typography>
                    </InputAdornment>
                  }
                  sx={{
                    height: "48px",
                    fontSize: "0.9rem",
                    fontWeight: "700",
                    borderRadius: 3,
                    background: "#fefcf3",
                    scrollMarginTop: "120px", // Add scroll margin for mobile
                    '& .MuiInputBase-input': {
                      textAlign: 'center',
                      color: "#451a03",
                      '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                        WebkitAppearance: 'none',
                        margin: 0
                      },
                      '&[type=number]': {
                        MozAppearance: 'textfield'
                      }
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#d97706",
                      borderWidth: "2px"
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#b8860b"
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#8b7d26",
                      borderWidth: "2px"
                    }
                  }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={6}>
              <Box>
                <Typography variant="caption" sx={{ 
                  color: "#92400e",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  fontSize: "0.7rem",
                  mb: 1,
                  display: "block"
                }}>
                  Weight ({getWeightUnitLabel()})
                </Typography>
                <OutlinedInput
                  value={weight}
                  onChange={handleWeightChange}
                  placeholder="0"
                  disabled={disabled}
                  fullWidth
                  endAdornment={
                    <InputAdornment position="end">
                      <Typography sx={{ color: "#92400e", fontWeight: "600", fontSize: "0.8rem" }}>{getWeightUnitLabel()}</Typography>
                    </InputAdornment>
                  }
                  sx={{
                    height: "48px",
                    fontSize: "0.9rem",
                    fontWeight: "700",
                    borderRadius: 3,
                    background: "#fefcf3",
                    scrollMarginTop: "120px", // Add scroll margin for mobile
                    '& .MuiInputBase-input': {
                      textAlign: 'center',
                      color: "#451a03",
                      '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                        WebkitAppearance: 'none',
                        margin: 0
                      },
                      '&[type=number]': {
                        MozAppearance: 'textfield'
                      }
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#d97706",
                      borderWidth: "2px"
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#b8860b"
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#8b7d26",
                      borderWidth: "2px"
                    }
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          {/* Results Display */}
          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            p: 2,
            background: "linear-gradient(135deg, #fef7ed 0%, #fed7aa 50%, #fef3c7 100%)",
            borderRadius: 3,
            border: "1px solid #d97706",
            mb: 2
          }}>
            <Box>
              <Typography variant="caption" sx={{ 
                color: "#92400e",
                fontWeight: "600",
                fontSize: "0.7rem",
                textTransform: "uppercase"
              }}>
                Rate per {getWeightUnitLabel()}
              </Typography>
              <Typography sx={{ 
                color: "#451a03",
                fontWeight: "800",
                fontSize: "0.9rem"
              }}>
                {getCurrencySymbol()}{pricePerGram.toFixed(2)}
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="caption" sx={{ 
                color: "#92400e",
                fontWeight: "600",
                fontSize: "0.7rem",
                textTransform: "uppercase"
              }}>
                Total Value
              </Typography>
              <Typography sx={{ 
                color: "#451a03",
                fontWeight: "800",
                fontSize: "1.1rem"
              }}>
                {getCurrencySymbol()}{subtotal.toFixed(2)}
              </Typography>
            </Box>
          </Box>

          {/* Add Button */}
          <Box sx={{ textAlign: "center" }}>
            <IconButton
              onClick={handleAdd}
              disabled={disabled || !purity || !weight || parseFloat(purity) <= 0 || parseFloat(weight) <= 0}
              sx={{
                background: (disabled || !purity || !weight || parseFloat(purity) <= 0 || parseFloat(weight) <= 0)
                  ? "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)"
                  : "linear-gradient(135deg, #b8860b 0%, #daa520 30%, #ffd700 70%, #ffea4a 100%)",
                color: (disabled || !purity || !weight || parseFloat(purity) <= 0 || parseFloat(weight) <= 0) ? "#ffffff" : "#1a0f00",
                width: "60px",
                height: "60px",
                borderRadius: 3,
                border: (disabled || !purity || !weight || parseFloat(purity) <= 0 || parseFloat(weight) <= 0)
                  ? "2px solid #6b7280"
                  : "2px solid #8b4513",
                boxShadow: (disabled || !purity || !weight || parseFloat(purity) <= 0 || parseFloat(weight) <= 0)
                  ? "0 2px 4px rgba(107, 114, 128, 0.2)"
                  : "0 4px 12px rgba(184, 134, 11, 0.3), inset 0 1px 0 rgba(255, 235, 74, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: (disabled || !purity || !weight || parseFloat(purity) <= 0 || parseFloat(weight) <= 0) ? "none" : "translateY(-2px) scale(1.05)",
                  boxShadow: (disabled || !purity || !weight || parseFloat(purity) <= 0 || parseFloat(weight) <= 0)
                    ? "0 2px 4px rgba(107, 114, 128, 0.2)"
                    : "0 6px 16px rgba(184, 134, 11, 0.4), inset 0 2px 0 rgba(255, 235, 74, 0.4)"
                },
                "&:active": {
                  transform: (disabled || !purity || !weight || parseFloat(purity) <= 0 || parseFloat(weight) <= 0) ? "none" : "scale(0.95)"
                }
              }}
            >
              <ArrowRightAltIcon sx={{ fontSize: "1.5rem" }} />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Table layout for larger screens
  return (
    <Box sx={{ 
      overflowX: "auto",
      background: "linear-gradient(135deg, #ffffff 0%, #fefefe 30%, #fdfdfc 70%, #fbfbfa 100%)",
      borderRadius: 4,
      border: "2px solid #e5ddd5",
      boxShadow: "0 8px 24px rgba(139, 115, 85, 0.1), 0 4px 8px rgba(139, 115, 85, 0.06)",
      transition: "all 0.3s ease-in-out",
      "&:hover": {
        boxShadow: "0 12px 32px rgba(139, 115, 85, 0.15), 0 6px 12px rgba(139, 115, 85, 0.08)",
        borderColor: "#d4c4b0"
      }
    }}>
      <Table sx={{ minWidth: isMobile ? 350 : 650 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ 
              borderBottom: "3px solid #b8860b", 
              bgcolor: "linear-gradient(135deg, #fef3c7 0%, #fef7ed 50%, #fff8dc 100%)",
              fontWeight: "800",
              color: "#451a03",
              fontSize: { xs: "0.8rem", md: "0.875rem" },
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              textShadow: "0 1px 2px rgba(139, 69, 19, 0.3)",
              boxShadow: "inset 0 1px 0 rgba(255, 215, 0, 0.2)",
              minWidth: isMobile ? 100 : 140,
              py: 2
            }}>
              Metal Type
            </TableCell>
            <TableCell sx={{ 
              borderBottom: "3px solid #b8860b", 
              bgcolor: "linear-gradient(135deg, #fef3c7 0%, #fef7ed 50%, #fff8dc 100%)",
              fontWeight: "800",
              color: "#451a03",
              fontSize: { xs: "0.8rem", md: "0.875rem" },
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              textShadow: "0 1px 2px rgba(139, 69, 19, 0.3)",
              boxShadow: "inset 0 1px 0 rgba(255, 215, 0, 0.2)",
              minWidth: isMobile ? 80 : 100,
              py: 2
            }}>
              Purity (%)
            </TableCell>
            <TableCell sx={{ 
              borderBottom: "3px solid #b8860b", 
              bgcolor: "linear-gradient(135deg, #fef3c7 0%, #fef7ed 50%, #fff8dc 100%)",
              fontWeight: "800",
              color: "#451a03",
              fontSize: { xs: "0.8rem", md: "0.875rem" },
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              textShadow: "0 1px 2px rgba(139, 69, 19, 0.3)",
              boxShadow: "inset 0 1px 0 rgba(255, 215, 0, 0.2)",
              minWidth: isMobile ? 90 : 110,
              py: 2
            }}>
              Weight ({getWeightUnitLabel()})
            </TableCell>
            <TableCell sx={{ 
              borderBottom: "3px solid #b8860b", 
              bgcolor: "linear-gradient(135deg, #fef3c7 0%, #fef7ed 50%, #fff8dc 100%)",
              fontWeight: "800",
              color: "#451a03",
              fontSize: { xs: "0.8rem", md: "0.875rem" },
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              textShadow: "0 1px 2px rgba(139, 69, 19, 0.3)",
              boxShadow: "inset 0 1px 0 rgba(255, 215, 0, 0.2)",
              minWidth: isMobile ? 90 : 110,
              py: 2
            }}>
              Rate ({getCurrencySymbol()}/{getWeightUnitLabel()})
            </TableCell>
            <TableCell sx={{ 
              borderBottom: "3px solid #b8860b", 
              bgcolor: "linear-gradient(135deg, #fef3c7 0%, #fef7ed 50%, #fff8dc 100%)",
              fontWeight: "800",
              color: "#451a03",
              fontSize: { xs: "0.8rem", md: "0.875rem" },
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              textShadow: "0 1px 2px rgba(139, 69, 19, 0.3)",
              boxShadow: "inset 0 1px 0 rgba(255, 215, 0, 0.2)",
              minWidth: isMobile ? 90 : 110,
              py: 2
            }}>
              Value ({getCurrencySymbol()})
            </TableCell>
            <TableCell sx={{ 
              borderBottom: "3px solid #b8860b", 
              bgcolor: "linear-gradient(135deg, #fef3c7 0%, #fef7ed 50%, #fff8dc 100%)",
              fontWeight: "800",
              color: "#451a03",
              fontSize: { xs: "0.8rem", md: "0.875rem" },
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              textShadow: "0 1px 2px rgba(139, 69, 19, 0.3)",
              boxShadow: "inset 0 1px 0 rgba(255, 215, 0, 0.2)",
              width: isMobile ? 60 : 80,
              py: 2,
              textAlign: 'center'
            }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow sx={{
            bgcolor: "#fef7ed",
            "&:hover": {
              bgcolor: "#f3e8d6",
              transition: "background-color 0.2s ease"
            }
          }}>
            <TableCell sx={{ borderBottom: "1px solid #f3e8d6", py: 2 }}>
              <Typography sx={{ 
                fontSize: { xs: "0.875rem", md: "1rem" }, 
                fontWeight: '700',
                color: '#451a03',
                letterSpacing: "0.5px"
              }}>
                Assayed Bar
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: "#92400e",
                  fontSize: { xs: "0.7rem", md: "0.75rem" },
                  fontStyle: "italic",
                  fontWeight: "500"
                }}
              >
                Custom Purity
              </Typography>
            </TableCell>
            <TableCell sx={{ borderBottom: "1px solid #f3e8d6", py: 2 }}>
              <OutlinedInput
                value={purity}
                onChange={handlePurityChange}
                placeholder="0.00"
                disabled={disabled}
                endAdornment={
                  <InputAdornment position="end">
                    <Typography sx={{ color: "#92400e", fontWeight: "600", fontSize: "0.875rem" }}>%</Typography>
                  </InputAdornment>
                }
                sx={{
                  width: isMobile ? "75px" : "95px",
                  height: isMobile ? "44px" : "52px",
                  fontSize: isMobile ? "0.875rem" : "1rem",
                  fontWeight: "700",
                  borderRadius: 3,
                  background: "#fefcf3",
                  '& .MuiInputBase-input': {
                    textAlign: 'center',
                    color: "#451a03",
                    // Hide number input spinner arrows
                    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                      WebkitAppearance: 'none',
                      margin: 0
                    },
                    '&[type=number]': {
                      MozAppearance: 'textfield' // Firefox
                    }
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#d97706",
                    borderWidth: "2px"
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#92400e"
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#451a03",
                    borderWidth: "2px"
                  }
                }}
              />
            </TableCell>
            <TableCell sx={{ borderBottom: "1px solid #f3e8d6", py: 2 }}>
              <OutlinedInput
                value={weight}
                onChange={handleWeightChange}
                placeholder="0.000"
                disabled={disabled}
                endAdornment={
                  <InputAdornment position="end">
                    <Typography sx={{ color: "#92400e", fontWeight: "600", fontSize: "0.875rem" }}>{getWeightUnitLabel()}</Typography>
                  </InputAdornment>
                }
                sx={{
                  width: isMobile ? "85px" : "105px",
                  height: isMobile ? "44px" : "52px",
                  fontSize: isMobile ? "0.875rem" : "1rem",
                  fontWeight: "700",
                  borderRadius: 3,
                  background: "#fefcf3",
                  '& .MuiInputBase-input': {
                    textAlign: 'center',
                    color: "#451a03",
                    // Hide number input spinner arrows
                    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                      WebkitAppearance: 'none',
                      margin: 0
                    },
                    '&[type=number]': {
                      MozAppearance: 'textfield' // Firefox
                    }
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#d97706",
                    borderWidth: "2px"
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#92400e"
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#451a03",
                    borderWidth: "2px"
                  }
                }}
              />
            </TableCell>
            <TableCell sx={{ borderBottom: "1px solid #f3e8d6", py: 2 }}>
              <Box 
                sx={{
                  display: "flex", 
                  alignItems: "center",
                  background: "linear-gradient(135deg, #b8860b 0%, #daa520 30%, #ffd700 70%, #ffea4a 100%)",
                  color: "#1a0f00",
                  px: { xs: 1, md: 1.5 },
                  py: { xs: 0.5, md: 0.75 },
                  borderRadius: 2,
                  width: "fit-content",
                  border: "2px solid #8b4513",
                  boxShadow: "0 3px 8px rgba(218, 165, 32, 0.3), inset 0 1px 0 rgba(255, 235, 74, 0.4)"
                }}
              >
                <Typography sx={{ 
                  fontSize: { xs: "0.8rem", md: "0.9rem" }, 
                  fontWeight: "700"
                }}>
                  {getCurrencySymbol()}{pricePerGram.toFixed(3)}
                </Typography>
              </Box>
            </TableCell>
            <TableCell sx={{ borderBottom: "1px solid #f3e8d6", py: 2 }}>
              <Box 
                sx={{
                  display: "flex", 
                  alignItems: "center",
                  background: subtotal > 0 
                    ? "linear-gradient(135deg, #047857 0%, #059669 30%, #10b981 70%, #34d399 100%)"
                    : "linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)",
                  color: "white",
                  px: { xs: 1, md: 1.5 },
                  py: { xs: 0.5, md: 0.75 },
                  borderRadius: 2,
                  width: "fit-content",
                  border: subtotal > 0 ? "2px solid #065f46" : "2px solid #6b7280",
                  boxShadow: subtotal > 0 
                    ? "0 3px 8px rgba(5, 150, 105, 0.3), inset 0 1px 0 rgba(52, 211, 153, 0.3)" 
                    : "0 2px 4px rgba(107, 114, 128, 0.2)"
                }}
              >
                <Typography sx={{ 
                  fontSize: { xs: "0.8rem", md: "0.9rem" }, 
                  fontWeight: "700"
                }}>
                  {getCurrencySymbol()}{subtotal.toFixed(2)}
                </Typography>
              </Box>
            </TableCell>
            <TableCell sx={{ borderBottom: "1px solid #f3e8d6", py: 2, textAlign: 'center' }}>
              <IconButton
                onClick={handleAdd}
                disabled={disabled || !purity || !weight || parseFloat(purity) <= 0 || parseFloat(weight) <= 0}
                sx={{
                  background: (disabled || !purity || !weight || parseFloat(purity) <= 0 || parseFloat(weight) <= 0)
                    ? "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)"
                    : "linear-gradient(135deg, #047857 0%, #059669 30%, #10b981 70%, #34d399 100%)",
                  color: "white",
                  width: { xs: "40px", md: "44px" },
                  height: { xs: "40px", md: "44px" },
                  borderRadius: "50%",
                  border: (disabled || !purity || !weight || parseFloat(purity) <= 0 || parseFloat(weight) <= 0)
                    ? "2px solid #6b7280"
                    : "2px solid #065f46",
                  boxShadow: (disabled || !purity || !weight || parseFloat(purity) <= 0 || parseFloat(weight) <= 0)
                    ? "0 2px 4px rgba(107, 114, 128, 0.2)"
                    : "0 6px 20px rgba(5, 150, 105, 0.4), 0 2px 4px rgba(5, 150, 105, 0.3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: (disabled || !purity || !weight || parseFloat(purity) <= 0 || parseFloat(weight) <= 0) ? "none" : "scale(1.05)",
                    boxShadow: (disabled || !purity || !weight || parseFloat(purity) <= 0 || parseFloat(weight) <= 0)
                      ? "0 2px 4px rgba(107, 114, 128, 0.2)"
                      : "0 8px 25px rgba(5, 150, 105, 0.5), 0 4px 8px rgba(5, 150, 105, 0.4)"
                  },
                  "&:active": {
                    transform: (disabled || !purity || !weight || parseFloat(purity) <= 0 || parseFloat(weight) <= 0) ? "none" : "scale(0.98)"
                  }
                }}
              >
                <ArrowRightAltIcon sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }} />
              </IconButton>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};

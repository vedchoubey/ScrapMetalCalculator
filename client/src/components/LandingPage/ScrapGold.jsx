import React, {useState, useEffect, useCallback} from "react";
import {Box,Card,Paper,Table,TableBody,TableCell,InputAdornment,TableContainer,TableHead,IconButton,TableRow,TextField,Typography, useMediaQuery, useTheme, Button, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, Fade, Zoom, Select, MenuItem, FormControl} from "@mui/material";
import cardData from "../../data/cardData.json";
import { SummaryCard } from "./SummaryCard";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import TuneIcon from "@mui/icons-material/Tune";
import { AssayedBar } from "../AssayedBar";
import { PriceAdjustments } from "../PriceAdjustments";

export const ScrapGold = ({ weights, setWeights, sharedRows, setSharedRows }) => {
  const [baseRate, setBaseRate] = useState(70);
  const [isEditMode, setIsEditMode] = useState(false);
  const [goldConfig, setGoldConfig] = useState([]);
  const [editConfig, setEditConfig] = useState([]);
  const [factorInputs, setFactorInputs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [assayedBarData, setAssayedBarData] = useState({
    purity: 0,
    weight: 0,
    pricePerGram: 0,
    subtotal: 0
  });
  
  // Price adjustments state
  const [priceAdjustments, setPriceAdjustments] = useState({});
  const [priceAdjustmentsOpen, setPriceAdjustmentsOpen] = useState(false);
  const [baseExchangeRate] = useState(0.73); // Keep original rate
  const [adjustedExchangeRate, setAdjustedExchangeRate] = useState(0.73);
  
  // Currency and weight unit state
  const [currency, setCurrency] = useState('GBP');
  const [weightUnit, setWeightUnit] = useState('gram');
  
  // Business configuration state
  const [businessConfig, setBusinessConfig] = useState({
    businessName: "Hatton Garden Metals",
    address: {
      line1: "11 St.Cross Street",
      line2: "Hatton Garden",
      city: "London",
      postcode: "EC1N 8UB"
    },
    contact: {
      phone: "+44 (0)207 404 4000",
      email: "info@hattongardenmetals.com",
      website: "www.hattongardenmetals.com"
    },
    registration: {
      vatNumber: "GB 926 1883 05",
      companyNumber: "12345678"
    },
    receipt: {
      title: "Metal Receipt",
      footerMessage: "Thank you for your visit!"
    }
  });
  
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  // Initialize gold configuration with default percentages similar to Kitco
  useEffect(() => {
    const initializeConfig = async () => {
      setIsLoading(true);
      // Simulate loading for smooth animation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const defaultConfig = cardData.map((item, index) => ({
        ...item,
        percentage: getDefaultPercentage(item.Carat),
        isVisible: true,
        description: item.carat_display + " Carat"
      }));
      setGoldConfig(defaultConfig);
      setIsLoading(false);
    };
    
    initializeConfig();
  }, []);

  // Get default percentage based on carat (similar to Kitco's percentages)
  const getDefaultPercentage = (carat) => {
    const percentageMap = {
      8: 33.33,
      10: 41.67,
      12: 50.00,
      14: 58.33,
      15: 62.50,
      18: 75.00,
      20: 83.33,
      21: 87.50,
      21.6: 90.00,
      22: 91.67,
      24: 99.99
    };
    return percentageMap[carat] || (carat / 24) * 100;
  };

  const calculatePricePerGram = (carat, customPercentage = null) => {
    if (!baseRate || baseRate <= 0) return 0;
    
    let effectiveBaseRate = baseRate;
    
    // Apply gold price adjustments if available
    if (priceAdjustments.metals?.gold?.adjustment) {
      effectiveBaseRate = Math.max(0, baseRate - priceAdjustments.metals.gold.adjustment);
    }
    
    const percentage = customPercentage !== null ? customPercentage : 
                      goldConfig.find(item => item.Carat === carat)?.percentage || 
                      (carat / 24) * 100;
    return (effectiveBaseRate * (percentage / 100));
  };

  // Weight conversion functions
  const convertToGrams = (weight, unit) => {
    switch (unit) {
      case 'gram': return weight;
      case 'ounce': return weight * 31.1035;
      case 'kilogram': return weight * 1000;
      default: return weight;
    }
  };

  const convertFromGrams = (weight, unit) => {
    switch (unit) {
      case 'gram': return weight;
      case 'ounce': return weight / 31.1035;
      case 'kilogram': return weight / 1000;
      default: return weight;
    }
  };

  // Calculate price per selected unit (converts from grams)
  const calculatePricePerUnit = (carat, customPercentage = null) => {
    if (!baseRate || baseRate <= 0) return 0;
    
    let effectiveBaseRate = baseRate;
    
    // Apply gold price adjustments if available
    if (priceAdjustments.metals?.gold?.adjustment) {
      effectiveBaseRate = Math.max(0, baseRate - priceAdjustments.metals.gold.adjustment);
    }
    
    const percentage = customPercentage !== null ? customPercentage : 
                      goldConfig.find(item => item.Carat === carat)?.percentage || 
                      (carat / 24) * 100;
    
    const pricePerGram = (effectiveBaseRate * (percentage / 100));
    
    // Convert to the selected weight unit
    return convertFromGrams(pricePerGram, weightUnit);
  };

  const handleBaseRateChange = (e) => {
    const value = e.target.value;
    // Allow empty string or valid numbers without leading zeros
    if (value === '' || value === '0') {
      setBaseRate(0);
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        setBaseRate(numValue);
      }
    }
  };

  // Edit mode functions
  const handleEditClick = () => {
    setEditConfig([...goldConfig]);
    setIsEditMode(true);
    // Initialize factor inputs with current values
    const initialFactors = {};
    goldConfig.forEach((item, index) => {
      initialFactors[index] = (item.percentage / 100).toFixed(4);
    });
    setFactorInputs(initialFactors);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditConfig([]);
    setFactorInputs({});
  };

  const handleSaveEdit = () => {
    setGoldConfig([...editConfig]);
    setIsEditMode(false);
    setEditConfig([]);
    setFactorInputs({});
  };

  const handleResetConfig = () => {
    const defaultConfig = cardData.map((item) => ({
      ...item,
      percentage: getDefaultPercentage(item.Carat),
      isVisible: true,
      description: item.carat_display + " Carat"
    }));
    setEditConfig(defaultConfig);
    // Reset factor inputs
    const initialFactors = {};
    defaultConfig.forEach((item, index) => {
      initialFactors[index] = (item.percentage / 100).toFixed(4);
    });
    setFactorInputs(initialFactors);
  };

  const handleVisibilityChange = (index, isVisible) => {
    const updatedConfig = [...editConfig];
    updatedConfig[index].isVisible = isVisible;
    setEditConfig(updatedConfig);
  };

  const handlePercentageChange = (index, percentage) => {
    const updatedConfig = [...editConfig];
    updatedConfig[index].percentage = percentage;
    setEditConfig(updatedConfig);
  };

  const handleFactorInputChange = (index, value) => {
    // Update the local input state without any restrictions
    setFactorInputs(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const handleFactorBlur = (index) => {
    const inputValue = factorInputs[index];
    
    // If empty, reset to 0
    if (!inputValue || inputValue.trim() === '') {
      handleDecimalFactorChange(index, 0);
      setFactorInputs(prev => ({
        ...prev,
        [index]: '0.0000'
      }));
      return;
    }

    const value = parseFloat(inputValue);
    if (!isNaN(value)) {
      const clampedValue = Math.min(Math.max(value, 0), 1);
      handleDecimalFactorChange(index, clampedValue);
      setFactorInputs(prev => ({
        ...prev,
        [index]: clampedValue.toFixed(4)
      }));
    } else {
      // Reset to current percentage value if invalid
      const currentFactor = (editConfig[index]?.percentage / 100).toFixed(4);
      setFactorInputs(prev => ({
        ...prev,
        [index]: currentFactor
      }));
    }
  };

  const handleDescriptionChange = (index, description) => {
    const updatedConfig = [...editConfig];
    updatedConfig[index].description = description;
    setEditConfig(updatedConfig);
  };

  const handleDecimalFactorChange = (index, decimalFactor) => {
    const updatedConfig = [...editConfig];
    updatedConfig[index].percentage = decimalFactor * 100;
    setEditConfig(updatedConfig);
  };

  const calculateSubtotal = (pricePerUnit, weight) => {
    return pricePerUnit * weight;
  };

  const handleAssayedBarChange = useCallback((data) => {
    setAssayedBarData(data);
  }, []);

  const handlePriceAdjustmentsChange = useCallback((adjustments) => {
    setPriceAdjustments(adjustments);
    // Update adjusted exchange rate
    if (adjustments.exchangeRate?.adjusted !== undefined) {
      setAdjustedExchangeRate(adjustments.exchangeRate.adjusted);
    }
  }, []);

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const handleWeightUnitChange = (event) => {
    setWeightUnit(event.target.value);
  };

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

  const handleWeightChange = (Carat, value) => {
    setWeights(prev => ({
      ...prev,
      [Carat]: value
    }));
  };

  const handleShareRow = (index) => {
    const goldItem = goldConfig.filter(item => item.isVisible)[index];
    if (goldItem) {
      const weight = weights[goldItem.Carat] || 0;
      const pricePerUnit = calculatePricePerUnit(goldItem.Carat);
      const subtotal = calculateSubtotal(pricePerUnit, weight);
      
      const sharedRow = {
        ...goldItem,
        weight: weight,
        pricePerUnit: pricePerUnit,
        subtotal: subtotal
      };
      
      setSharedRows(prev => [...prev, sharedRow]);
    }
  };

  const handleUnshareRow = (Carat) => {
    setSharedRows(prev => prev.filter(row => row.Carat !== Carat));
  };

  const resetSharedRows = () => {
    setSharedRows([]);
  };

  return (
    <Box      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        gap: { xs: 1.5, md: 3 }, 
        px: { xs: 0.5, sm: 1, md: 3 },
        py: { xs: 1, sm: 2, md: 4 }, 
        justifyContent: "space-between",
        alignItems: { xs: "stretch", lg: "flex-start" },
        minHeight: { xs: "100vh", lg: "auto" },
        bgcolor: "linear-gradient(135deg, #fbfaf9 0%, #f7f5f3 30%, #f4f2f0 70%, #f1efed 100%)"
      }}
    >
      <Box sx={{ 
        width: { xs: "100%", lg: "65%" },
        display: "flex",
        flexDirection: "column",
        gap: { xs: 2, md: 3 }
      }}>
        {/* Main Calculator Card */}
        <Card
          elevation={isXs ? 2 : 4}
          sx={{
            borderRadius: { xs: 3, md: 5 }, 
            width: "100%",
            minHeight: { xs: "auto", md: "500px" },
            border: "1px solid",
            borderColor: "#e5ddd5",
            background: "linear-gradient(135deg, #ffffff 0%, #fefefe 30%, #fdfdfc 70%, #fbfbfa 100%)",
            overflow: "visible",
            transition: "all 0.3s ease-in-out",
            boxShadow: isXs 
              ? "0 6px 20px rgba(139, 115, 85, 0.08), 0 2px 6px rgba(139, 115, 85, 0.06)" 
              : "0 12px 40px rgba(139, 115, 85, 0.12), 0 4px 12px rgba(139, 115, 85, 0.08)",
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
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 3, sm: 2 },
            p: { xs: 3, sm: 3, md: 4 },
            background: "linear-gradient(135deg, #451a03 0%, #5d2506 50%, #d97706 100%)",
            color: "#ffffff",
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
              background: "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)",
              pointerEvents: "none"
            }
          }}
        >
          {/* Left Side - Title and Dropdowns */}
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: { xs: 2, md: 3 },
            flexDirection: { xs: "column", sm: "row" },
            width: { xs: "100%", sm: "auto" },
            zIndex: 1
          }}>
            <Typography 
              variant={isXs ? "h6" : "h5"} 
              sx={{ 
                fontWeight: "700",
                fontSize: { xs: "1.3rem", sm: "1.5rem", md: "1.7rem" },
                textAlign: { xs: "center", sm: "left" },
                color: "#ffffff",
                letterSpacing: "0.5px",
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                position: "relative",
                zIndex: 1
              }}
            >
              {isXs ? "Precious Metals" : "Precious Metal Calculator"}
            </Typography>
            
            {/* Dropdowns Row */}
            <Box sx={{ 
              display: "flex", 
              gap: { xs: 1.5, md: 2 },
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: { xs: "center", sm: "flex-start" }
            }}>
              {/* Currency Dropdown */}
              <FormControl size="small" sx={{ minWidth: 90 }}>
                <Select
                  value={currency}
                  onChange={handleCurrencyChange}
                  displayEmpty
                  sx={{
                    color: "#1e293b",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)",
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#cbd5e1",
                      borderWidth: "1px"
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#64748b",
                      borderWidth: "1px"
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#475569",
                      borderWidth: "2px"
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#64748b"
                    }
                  }}
                >
                  <MenuItem value="GBP" sx={{ fontWeight: 500, color: "#1e293b", fontSize: "0.875rem", "&:hover": { bgcolor: "#f1f5f9" } }}>🇬🇧 GBP</MenuItem>
                  <MenuItem value="USD" sx={{ fontWeight: 500, color: "#1e293b", fontSize: "0.875rem", "&:hover": { bgcolor: "#f1f5f9" } }}>🇺🇸 USD</MenuItem>
                  <MenuItem value="EUR" sx={{ fontWeight: 500, color: "#1e293b", fontSize: "0.875rem", "&:hover": { bgcolor: "#f1f5f9" } }}>🇪🇺 EUR</MenuItem>
                </Select>
              </FormControl>

              {/* Weight Unit Dropdown */}
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <Select
                  value={weightUnit}
                  onChange={handleWeightUnitChange}
                  displayEmpty
                  sx={{
                    color: "#1e293b",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)",
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#cbd5e1",
                      borderWidth: "1px"
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#64748b",
                      borderWidth: "1px"
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#475569",
                      borderWidth: "2px"
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#64748b"
                    }
                  }}
                >
                  <MenuItem value="gram" sx={{ fontWeight: 500, color: "#1e293b", fontSize: "0.875rem", "&:hover": { bgcolor: "#f1f5f9" } }}>gram</MenuItem>
                  <MenuItem value="ounce" sx={{ fontWeight: 500, color: "#1e293b", fontSize: "0.875rem", "&:hover": { bgcolor: "#f1f5f9" } }}>ounce</MenuItem>
                  <MenuItem value="kilogram" sx={{ fontWeight: 500, color: "#1e293b", fontSize: "0.875rem", "&:hover": { bgcolor: "#f1f5f9" } }}>kg</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Right Side - Price Input and Action Buttons */}
          <Box sx={{ 
            display: "flex", 
            gap: { xs: 2, sm: 2 }, 
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            width: { xs: "100%", sm: "auto" },
            zIndex: 1
          }}>
            <TextField
              label={`Gold Price (24K/${getWeightUnitLabel()})`}
              type="number"
              variant="outlined"
              size="medium"
              value={baseRate}
              onChange={handleBaseRateChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography sx={{ 
                      color: "#8b4513", 
                      fontSize: { xs: "1.2rem", md: "1.4rem" },
                      fontWeight: "900",
                      textShadow: "0 1px 3px rgba(218, 165, 32, 0.4)",
                      filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))"
                    }}>
                      {getCurrencySymbol()}
                    </Typography>
                  </InputAdornment>
                ),
              }}
              sx={{ 
                width: { xs: "100%", sm: "200px", md: "220px" },
                "& .MuiOutlinedInput-root": {
                  background: "linear-gradient(135deg, #fff8dc 0%, #fefdf7 50%, #fffaf0 100%)",
                  borderRadius: 4,
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  fontWeight: "800",
                  boxShadow: "0 8px 24px rgba(218, 165, 32, 0.3), inset 0 2px 0 rgba(255, 215, 0, 0.2), inset 0 -1px 0 rgba(139, 69, 19, 0.1)",
                  height: "56px",
                  "& fieldset": {
                    borderColor: "#b8860b",
                    borderWidth: "2px"
                  },
                  "&:hover fieldset": {
                    borderColor: "#8b4513",
                    borderWidth: "3px",
                    boxShadow: "0 0 16px rgba(218, 165, 32, 0.4)"
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#5d4e37",
                    borderWidth: "3px",
                    boxShadow: "0 0 20px rgba(255, 215, 0, 0.5)"
                  }
                },
                "& .MuiInputLabel-root": {
                  color: "#8b4513",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  fontWeight: "700",
                  "&.Mui-focused": {
                    color: "#5d4e37",
                    fontWeight: "800"
                  }
                },
                "& .MuiOutlinedInput-input": {
                  color: "#1a0f00",
                  fontWeight: "900",
                  fontSize: { xs: "1rem", md: "1.2rem" }
                }
              }}
            />
            
            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <IconButton 
                onClick={handleEditClick}
                size="large"
                sx={{ 
                  background: "linear-gradient(135deg, #b8860b 0%, #daa520 30%, #ffd700 70%, #fff8dc 100%)", 
                  color: "#1a0f00",
                  borderRadius: 4,
                  padding: 2,
                  transition: "all 0.3s ease",
                  border: "3px solid #8b4513",
                  boxShadow: "0 8px 24px rgba(218, 165, 32, 0.35), inset 0 2px 0 rgba(255, 215, 0, 0.3), inset 0 -1px 0 rgba(139, 69, 19, 0.2)",
                  "&:hover": { 
                    background: "linear-gradient(135deg, #8b4513 0%, #b8860b 30%, #daa520 70%, #ffd700 100%)",
                    transform: "translateY(-3px) scale(1.05)",
                    borderColor: "#5d4e37",
                    boxShadow: "0 12px 32px rgba(218, 165, 32, 0.45), inset 0 3px 0 rgba(255, 215, 0, 0.4), inset 0 -2px 0 rgba(139, 69, 19, 0.3)"
                  }
                }}
              >
                <EditIcon sx={{ fontSize: "1.5rem" }} />
              </IconButton>
              
              {/* Price Adjustments Button */}
              <IconButton 
                onClick={() => setPriceAdjustmentsOpen(true)}
                size="large"
                sx={{ 
                  background: "linear-gradient(135deg, #059669 0%, #10b981 30%, #34d399 70%, #6ee7b7 100%)", 
                  color: "#ffffff",
                  borderRadius: 4,
                  padding: 2,
                  transition: "all 0.3s ease",
                  border: "3px solid #047857",
                  boxShadow: "0 8px 24px rgba(5, 150, 105, 0.35), inset 0 2px 0 rgba(110, 231, 183, 0.3), inset 0 -1px 0 rgba(4, 120, 87, 0.2)",
                  "&:hover": { 
                    background: "linear-gradient(135deg, #047857 0%, #059669 30%, #10b981 70%, #34d399 100%)",
                    transform: "translateY(-3px) scale(1.05)",
                    borderColor: "#065f46",
                    boxShadow: "0 12px 32px rgba(5, 150, 105, 0.45), inset 0 3px 0 rgba(110, 231, 183, 0.4), inset 0 -2px 0 rgba(4, 120, 87, 0.3)"
                  }
                }}
                title="Price Adjustments"
              >
                <TuneIcon sx={{ fontSize: "1.5rem" }} />
              </IconButton>
              
              {/* Price Adjustments Component */}
              <PriceAdjustments
                onAdjustmentsChange={handlePriceAdjustmentsChange}
                baseRates={{ 
                  gold: baseRate, 
                  silver: 0.9, 
                  platinum: 30 
                }}
                exchangeRate={baseExchangeRate}
                isOpen={priceAdjustmentsOpen}
                onOpenChange={setPriceAdjustmentsOpen}
                currency={currency}
                weightUnit={weightUnit}
              />
            </Box>
          </Box>
        </Box>

        {/* Responsive: Card/List layout for mobile (xs), Table for larger screens */}
        {isXs ? (
          <Box sx={{
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2, 
            px: { xs: 1, sm: 2 }, 
            py: { xs: 2, sm: 3 },
            bgcolor: 'transparent',
            minHeight: '200px'
          }}>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <Paper key={`skeleton-card-${idx}`}
                  elevation={2}
                  sx={{
                    borderRadius: 3,
                    p: 2,
                    bgcolor: '#fefcf3',
                    border: '2px solid #f3e8d6',
                    minHeight: 90,
                    display: 'flex', flexDirection: 'column', gap: 1.5,
                    animation: 'metalShimmer 2s ease-in-out infinite',
                    '@keyframes metalShimmer': {
                      '0%': { opacity: 0.4, background: 'linear-gradient(90deg, #e7dcc3 25%, #f3e8d6 50%, #e7dcc3 75%)' },
                      '50%': { opacity: 0.7, background: 'linear-gradient(90deg, #f3e8d6 25%, #fef3c7 50%, #f3e8d6 75%)' },
                      '100%': { opacity: 0.4, background: 'linear-gradient(90deg, #e7dcc3 25%, #f3e8d6 50%, #e7dcc3 75%)' },
                    },
                  }}
                >
                  <Box sx={{ height: 18, width: '40%', bgcolor: '#e7dcc3', borderRadius: 1 }} />
                  <Box sx={{ height: 16, width: '60%', bgcolor: '#e7dcc3', borderRadius: 1 }} />
                  <Box sx={{ height: 16, width: '50%', bgcolor: '#e7dcc3', borderRadius: 1 }} />
                  <Box sx={{ height: 16, width: '40%', bgcolor: '#e7dcc3', borderRadius: 1 }} />
                </Paper>
              ))
            ) : goldConfig.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center', bgcolor: '#fef3c7', borderRadius: 2, border: '1px solid #d97706' }}>
                <Typography variant="h6" sx={{ color: '#92400e', fontWeight: 'bold' }}>
                  No Metal Types Available
                </Typography>
                <Typography sx={{ color: '#451a03', mt: 1 }}>
                  Please configure metal types by clicking the edit button.
                </Typography>
              </Box>
            ) : (
              goldConfig.filter(item => item.isVisible).map((row, index) => {
                const pricePerUnit = calculatePricePerUnit(row.Carat);
                const weight = weights[row.Carat] || 0;
                const subtotal = calculateSubtotal(pricePerUnit, weight);
                const isShared = sharedRows.some(sharedRow => sharedRow.Carat === row.Carat);
                return (
                  <Paper key={row.Carat}
                    elevation={isShared ? 4 : 2}
                    sx={{
                      borderRadius: 3,
                      p: 2.5,
                      border: isShared ? '3px solid #d97706' : '1px solid #e5ddd5',
                      bgcolor: isShared ? '#f3e8d6' : '#ffffff',
                      background: isShared 
                        ? 'linear-gradient(135deg, #f3e8d6 0%, #e7dcc3 100%)' 
                        : 'linear-gradient(135deg, #ffffff 0%, #fefefe 30%, #fdfdfc 70%, #fbfbfa 100%)',
                      boxShadow: isShared 
                        ? '0 6px 20px rgba(217, 119, 6, 0.25), 0 2px 6px rgba(217, 119, 6, 0.15)' 
                        : '0 4px 12px rgba(139, 115, 85, 0.08), 0 2px 4px rgba(139, 115, 85, 0.06)',
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 1.5,
                      position: 'relative',
                      transition: 'all 0.3s ease-in-out',
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: isShared 
                          ? '0 8px 25px rgba(217, 119, 6, 0.3), 0 3px 8px rgba(217, 119, 6, 0.2)' 
                          : '0 6px 16px rgba(139, 115, 85, 0.12), 0 3px 6px rgba(139, 115, 85, 0.08)',
                        borderColor: isShared ? '#92400e' : '#d4c4b0'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: '#451a03', fontSize: '1rem', lineHeight: 1.1 }}>{row.description}</Typography>
                        <Typography variant="caption" sx={{ color: '#92400e', fontSize: '0.8rem', fontStyle: 'italic', fontWeight: 500 }}>{row.percentage?.toFixed(2)}% Purity</Typography>
                      </Box>
                      <IconButton
                        onClick={() => weight > 0 && (isShared ? handleUnshareRow(row.Carat) : handleShareRow(index))}
                        disabled={weight <= 0}
                        size="small"
                        sx={{
                          bgcolor: weight <= 0 
                            ? 'linear-gradient(135deg, #e5e7eb 0%, #f3f4f6 100%)' 
                            : isShared 
                              ? 'linear-gradient(135deg, #451a03 0%, #5d2506 50%, #d97706 100%)' 
                              : 'linear-gradient(135deg, #b8860b 0%, #daa520 30%, #ffd700 70%, #ffea4a 100%)',
                          color: weight <= 0 ? '#9ca3af' : isShared ? '#ffffff' : '#1a0f00',
                          borderRadius: 2,
                          border: weight <= 0 
                            ? '2px solid #d1d5db' 
                            : isShared 
                              ? '2px solid #451a03' 
                              : '2px solid #8b4513',
                          ml: 1,
                          transition: 'all 0.3s ease',
                          minWidth: '42px',
                          minHeight: '42px',
                          cursor: weight <= 0 ? 'not-allowed' : 'pointer',
                          boxShadow: weight > 0 
                            ? isShared 
                              ? '0 3px 8px rgba(69, 26, 3, 0.25), inset 0 1px 0 rgba(217, 119, 6, 0.3)' 
                              : '0 3px 8px rgba(184, 134, 11, 0.25), inset 0 1px 0 rgba(255, 235, 74, 0.3)'
                            : 'none',
                          '&:hover': {
                            bgcolor: weight <= 0 
                              ? 'linear-gradient(135deg, #e5e7eb 0%, #f3f4f6 100%)'
                              : isShared 
                                ? 'linear-gradient(135deg, #5d2506 0%, #451a03 30%, #5d2506 70%, #d97706 100%)' 
                                : 'linear-gradient(135deg, #8b4513 0%, #b8860b 30%, #daa520 70%, #ffd700 100%)',
                            transform: weight > 0 ? 'scale(1.1)' : 'none',
                            boxShadow: weight > 0 
                              ? isShared 
                                ? '0 4px 12px rgba(69, 26, 3, 0.35), inset 0 2px 0 rgba(217, 119, 6, 0.4)' 
                                : '0 4px 12px rgba(184, 134, 11, 0.35), inset 0 2px 0 rgba(255, 235, 74, 0.4)'
                              : 'none',
                          },
                          '&.Mui-disabled': {
                            opacity: 0.6
                          }
                        }}
                        aria-label={weight <= 0 ? 'Add weight to enable' : isShared ? 'Unshare' : 'Share'}
                        title={weight <= 0 ? 'Add weight to enable' : isShared ? 'Remove from summary' : 'Add to summary'}
                      >
                        {isShared ? <ArrowBackIcon sx={{ fontSize: '1.2rem' }} /> : <ArrowRightAltIcon sx={{ fontSize: '1.2rem' }} />}
                      </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                      <TextField
                        variant="outlined"
                        type="number"
                        size="small"
                        value={weights[row.Carat] || ''}
                        onChange={e => handleWeightChange(row.Carat, parseFloat(e.target.value) || 0)}
                        error={weights[row.Carat] <= 0}
                        helperText={weights[row.Carat] <= 0 ? 'Add weight' : ''}
                        sx={{
                          width: 80,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: '#fefcf3',
                            fontSize: '0.95rem',
                            '& fieldset': { borderColor: weights[row.Carat] <= 0 ? '#dc2626' : '#d97706' },
                            '&:hover fieldset': { borderColor: weights[row.Carat] <= 0 ? '#dc2626' : '#92400e' },
                            '&.Mui-focused fieldset': { borderColor: weights[row.Carat] <= 0 ? '#dc2626' : '#451a03', borderWidth: '2px' },
                          },
                          '& .MuiInputBase-input': { color: '#451a03', fontWeight: 600 },
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Typography variant="caption" sx={{ color: '#92400e', fontWeight: "600" }}>{getWeightUnitLabel()}</Typography>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        background: 'linear-gradient(135deg, #b8860b 0%, #daa520 30%, #ffd700 70%, #ffea4a 100%)', 
                        color: '#1a0f00', 
                        px: 1.5, 
                        py: 0.6, 
                        borderRadius: 3, 
                        border: '2px solid #8b4513', 
                        minWidth: 70,
                        boxShadow: '0 3px 8px rgba(218, 165, 32, 0.3), inset 0 1px 0 rgba(255, 235, 74, 0.4)',
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(45deg, transparent 30%, rgba(255, 235, 74, 0.1) 50%, transparent 70%)',
                          borderRadius: 'inherit',
                          pointerEvents: 'none'
                        }
                      }}>
                        <Typography sx={{ 
                          fontSize: '1rem', 
                          mr: 0.5, 
                          fontWeight: '900',
                          textShadow: '0 1px 2px rgba(139, 69, 19, 0.3)',
                          zIndex: 1,
                          color: '#1a0f00'
                        }}>
                          {getCurrencySymbol()}
                        </Typography>
                        <Typography sx={{ 
                          fontWeight: 800, 
                          fontSize: '0.95rem',
                          textShadow: '0 1px 2px rgba(139, 69, 19, 0.3)',
                          zIndex: 1,
                          color: '#1a0f00'
                        }}>
                          {pricePerUnit.toFixed(2)}
                        </Typography>
                        <Typography sx={{ 
                          fontSize: '0.7rem', 
                          ml: 0.5, 
                          fontWeight: 600,
                          opacity: 0.8,
                          textShadow: '0 1px 2px rgba(139, 69, 19, 0.2)',
                          zIndex: 1,
                          color: '#1a0f00'
                        }}>
                          /{getWeightUnitLabel()}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        background: subtotal > 0 
                          ? 'linear-gradient(135deg, #047857 0%, #059669 30%, #10b981 70%, #34d399 100%)' 
                          : 'linear-gradient(135deg, #4b5563 0%, #6b7280 50%, #9ca3af 100%)', 
                        color: '#fff', 
                        px: 1.5, 
                        py: 0.5, 
                        borderRadius: 3, 
                        border: subtotal > 0 ? '2px solid #065f46' : '2px solid #374151', 
                        minWidth: 70,
                        boxShadow: subtotal > 0 
                          ? '0 4px 12px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(52, 211, 153, 0.2)' 
                          : '0 4px 12px rgba(107, 114, 128, 0.2)',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: subtotal > 0 
                            ? 'linear-gradient(45deg, transparent 30%, rgba(52, 211, 153, 0.1) 50%, transparent 70%)'
                            : 'linear-gradient(45deg, transparent 30%, rgba(156, 163, 175, 0.1) 50%, transparent 70%)',
                          borderRadius: 'inherit',
                          pointerEvents: 'none'
                        }
                      }}>
                        <Typography sx={{ 
                          fontSize: '1rem', 
                          mr: 0.5, 
                          fontWeight: '900',
                          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                          zIndex: 1
                        }}>
                          {getCurrencySymbol()}
                        </Typography>
                        <Typography sx={{ 
                          fontWeight: 800, 
                          fontSize: '0.95rem',
                          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                          zIndex: 1
                        }}>
                          {subtotal.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                );
              })
            )}
          </Box>
        ) : (
          <TableContainer 
            component={Paper} 
            sx={{ 
              boxShadow: "none",
              maxHeight: { xs: "65vh", md: "none" },
              minHeight: { xs: "300px", md: "400px" },
              overflowY: "auto",
              overflowX: "hidden", // Prevent horizontal scroll
              bgcolor: "transparent",
              mt: 1
            }}
          >
            <Table stickyHeader size={isXs ? "small" : "medium"} sx={{ tableLayout: "fixed" }}>
              <TableHead>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      borderBottom: "3px solid #b8860b",
                      bgcolor: "linear-gradient(135deg, #fef3c7 0%, #fef7ed 50%, #fff8dc 100%)",
                      fontWeight: "800",
                      color: "#451a03",
                      fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
                      py: { xs: 1, md: 1.5 },
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      width: { xs: "30%", sm: "25%" },
                      textShadow: "0 1px 2px rgba(139, 69, 19, 0.3)",
                      boxShadow: "inset 0 1px 0 rgba(255, 215, 0, 0.2)"
                    }}
                  >
                    Metal Type
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      borderBottom: "3px solid #b8860b",
                      bgcolor: "linear-gradient(135deg, #fef3c7 0%, #fef7ed 50%, #fff8dc 100%)",
                      fontWeight: "800",
                      color: "#451a03",
                      fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
                      py: { xs: 1, md: 1.5 },
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      width: { xs: "20%", sm: "18%" },
                      textShadow: "0 1px 2px rgba(139, 69, 19, 0.3)",
                      boxShadow: "inset 0 1px 0 rgba(255, 215, 0, 0.2)"
                    }}
                  >
                    Weight ({getWeightUnitLabel()})
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      borderBottom: "3px solid #b8860b",
                      bgcolor: "linear-gradient(135deg, #fef3c7 0%, #fef7ed 50%, #fff8dc 100%)",
                      fontWeight: "800",
                      color: "#451a03",
                      fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
                      py: { xs: 1, md: 1.5 },
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      width: { xs: "18%", sm: "20%" },
                      textShadow: "0 1px 2px rgba(139, 69, 19, 0.3)",
                      boxShadow: "inset 0 1px 0 rgba(255, 215, 0, 0.2)"
                    }}
                  >
                    Rate ({getCurrencySymbol()}/{getWeightUnitLabel()})
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      borderBottom: "3px solid #b8860b",
                      bgcolor: "linear-gradient(135deg, #fef3c7 0%, #fef7ed 50%, #fff8dc 100%)",
                      fontWeight: "800",
                      color: "#451a03",
                      fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
                      py: { xs: 1, md: 1.5 },
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      width: { xs: "18%", sm: "22%" },
                      textShadow: "0 1px 2px rgba(139, 69, 19, 0.3)",
                      boxShadow: "inset 0 1px 0 rgba(255, 215, 0, 0.2)"
                    }}
                  >
                    Value ({getCurrencySymbol()})
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      borderBottom: "3px solid #b8860b",
                      bgcolor: "linear-gradient(135deg, #fef3c7 0%, #fef7ed 50%, #fff8dc 100%)",
                      fontWeight: "800",
                      color: "#451a03",
                      fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
                      py: { xs: 1, md: 1.5 },
                      textAlign: "center",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      width: { xs: "14%", sm: "15%" },
                      textShadow: "0 1px 2px rgba(139, 69, 19, 0.3)",
                      boxShadow: "inset 0 1px 0 rgba(255, 215, 0, 0.2)"
                    }}
                  >
                    Add
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {isLoading ? (
                // Loading skeleton with metallic colors
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {Array.from({ length: 5 }).map((_, cellIndex) => (
                      <TableCell key={cellIndex} sx={{ borderBottom: "1px solid #f3e8d6", py: { xs: 1, md: 2 } }}>
                        <Box
                          sx={{
                            height: cellIndex === 0 ? 40 : 32,
                            bgcolor: "#e7dcc3", // Metallic shimmer
                            borderRadius: 1,
                            animation: "metalShimmer 2s ease-in-out infinite",
                            "@keyframes metalShimmer": {
                              "0%": { 
                                opacity: 0.4,
                                background: "linear-gradient(90deg, #e7dcc3 25%, #f3e8d6 50%, #e7dcc3 75%)"
                              },
                              "50%": { 
                                opacity: 0.7,
                                background: "linear-gradient(90deg, #f3e8d6 25%, #fef3c7 50%, #f3e8d6 75%)"
                              },
                              "100%": { 
                                opacity: 0.4,
                                background: "linear-gradient(90deg, #e7dcc3 25%, #f3e8d6 50%, #e7dcc3 75%)"
                              }
                            }
                          }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : goldConfig.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                    <Box sx={{ bgcolor: '#fef3c7', borderRadius: 2, p: 3, border: '1px solid #d97706' }}>
                      <Typography variant="h6" sx={{ color: '#92400e', fontWeight: 'bold' }}>
                        No Metal Types Available
                      </Typography>
                      <Typography sx={{ color: '#451a03', mt: 1 }}>
                        Please configure metal types by clicking the edit button.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                goldConfig
                  .filter(item => item.isVisible)
                  .map((row, index) => {
                    const pricePerUnit = calculatePricePerUnit(row.Carat);
                    const weight = weights[row.Carat] || 0;
                    const subtotal = calculateSubtotal(pricePerUnit, weight);
                    const isShared = sharedRows.some(sharedRow => sharedRow.Carat === row.Carat);

                    return (
                      <Fade in={true} timeout={300 + index * 100} key={index}>
                        <TableRow 
                          sx={{
                            "&:nth-of-type(odd)": {
                              bgcolor: "#fef7ed" // Very light warm
                            },
                            "&:nth-of-type(even)": {
                              bgcolor: "#ffffff"
                            },
                            "&:hover": {
                              bgcolor: sharedRows.some(sharedRow => sharedRow.Carat === row.Carat) ? "#e7dcc3" : "#f3e8d6", // Subtle warm hover
                              transition: "background-color 0.2s ease",
                              boxShadow: "0 1px 4px rgba(139, 115, 85, 0.1)"
                            },
                            ...(sharedRows.some(sharedRow => sharedRow.Carat === row.Carat) && {
                              bgcolor: "#f3e8d6", // Warm beige for shared rows
                              "&:hover": {
                                bgcolor: "#e7dcc3"
                              },
                              borderLeft: "4px solid #d97706"
                            })
                          }}
                        >
                          <TableCell sx={{ borderBottom: "1px solid #f3e8d6", py: { xs: 1, md: 2 } }}>
                            <Box>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontWeight: "700",
                                  color: "#451a03", // Dark brown
                                  fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.875rem" },
                                  lineHeight: 1.2
                                }}
                              >
                                {row.description}
                              </Typography>
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  color: "#92400e", // Medium brown
                                  fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                                  fontStyle: "italic",
                                  fontWeight: "500"
                                }}
                              >
                                {row.percentage?.toFixed(2)}% Purity
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ borderBottom: "1px solid #f3e8d6", py: { xs: 1, md: 2 } }}>
                            <TextField
                              variant="outlined"
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
                                weights[row.Carat] <= 0 && isXs ? "Add weight" : weights[row.Carat] <= 0 ? "Must be > 0" : ""
                              }
                              sx={{
                                width: "100%",
                                maxWidth: { xs: "80px", sm: "100px" },
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  bgcolor: "#fefcf3",
                                  fontSize: { xs: "0.8rem", md: "0.875rem" },
                                  "& fieldset": {
                                    borderColor: weights[row.Carat] <= 0 ? "#dc2626" : "#d97706"
                                  },
                                  "&:hover fieldset": {
                                    borderColor: weights[row.Carat] <= 0 ? "#dc2626" : "#92400e"
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: weights[row.Carat] <= 0 ? "#dc2626" : "#451a03",
                                    borderWidth: "2px"
                                  }
                                },
                                "& .MuiInputBase-input": {
                                  color: "#451a03",
                                  fontWeight: "600"
                                }
                              }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <Typography variant="caption" sx={{ color: "#92400e", fontWeight: "600" }}>
                                      {getWeightUnitLabel()}
                                    </Typography>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ borderBottom: "1px solid #f3e8d6", py: { xs: 1, md: 2 } }}>
                            <Box 
                              sx={{
                                display: "flex", 
                                alignItems: "center",
                                background: "linear-gradient(135deg, #b8860b 0%, #daa520 30%, #ffd700 70%, #ffea4a 100%)",
                                color: "#1a0f00",
                                px: { xs: 1, md: 1.5 },
                                py: { xs: 0.3, md: 0.5 },
                                borderRadius: 2,
                                width: "fit-content",
                                border: "2px solid #8b4513",
                                boxShadow: "0 3px 8px rgba(218, 165, 32, 0.3), inset 0 1px 0 rgba(255, 235, 74, 0.4)"
                              }}
                            >
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontWeight: "700",
                                  fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" }
                                }}
                              >
                                {getCurrencySymbol()}{pricePerUnit.toFixed(2)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ borderBottom: "1px solid #f3e8d6", py: { xs: 1, md: 2 } }}>
                            <Box 
                              sx={{
                                display: "flex", 
                                alignItems: "center",
                                background: subtotal > 0 
                                  ? "linear-gradient(135deg, #047857 0%, #059669 30%, #10b981 70%, #34d399 100%)"
                                  : "linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)",
                                color: "white",
                                px: { xs: 1, md: 1.5 },
                                py: { xs: 0.3, md: 0.5 },
                                borderRadius: 2,
                                width: "fit-content",
                                border: subtotal > 0 ? "2px solid #065f46" : "1px solid #6b7280",
                                boxShadow: subtotal > 0 
                                  ? "0 3px 8px rgba(5, 150, 105, 0.3), inset 0 1px 0 rgba(52, 211, 153, 0.3)" 
                                  : "0 2px 4px rgba(107, 114, 128, 0.2)"
                              }}
                            >
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontWeight: "700",
                                  fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" }
                                }}
                              >
                                {getCurrencySymbol()}{subtotal.toFixed(2)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ borderBottom: "1px solid #f3e8d6", py: { xs: 1, md: 2 }, textAlign: "center" }}>
                            <Zoom in={true} timeout={400 + index * 100}>
                              <span>
                                {!isShared ? (
                                  <IconButton
                                    onClick={() => weight > 0 && handleShareRow(index)}
                                    disabled={weight <= 0}
                                    size={isXs ? "small" : "medium"}
                                    sx={{
                                      bgcolor: weight <= 0 
                                        ? "linear-gradient(135deg, #e5e7eb 0%, #f3f4f6 100%)"
                                        : "linear-gradient(135deg, #b8860b 0%, #daa520 30%, #ffd700 70%, #ffea4a 100%)",
                                      color: weight <= 0 ? "#9ca3af" : "#1a0f00",
                                      borderRadius: 2,
                                      transition: "all 0.3s ease",
                                      border: weight <= 0 
                                        ? "2px solid #d1d5db" 
                                        : "2px solid #8b4513",
                                      minWidth: { xs: "36px", md: "40px" },
                                      minHeight: { xs: "36px", md: "40px" },
                                      cursor: weight <= 0 ? "not-allowed" : "pointer",
                                      boxShadow: weight > 0 ? "0 2px 6px rgba(184, 134, 11, 0.2), inset 0 1px 0 rgba(255, 235, 74, 0.3)" : "none",
                                      "&:hover": {
                                        bgcolor: weight <= 0 
                                          ? "linear-gradient(135deg, #e5e7eb 0%, #f3f4f6 100%)"
                                          : "linear-gradient(135deg, #8b4513 0%, #b8860b 30%, #daa520 70%, #ffd700 100%)",
                                        transform: weight > 0 ? "scale(1.1)" : "none",
                                        boxShadow: weight > 0 ? "0 4px 12px rgba(184, 134, 11, 0.4), inset 0 2px 0 rgba(255, 235, 74, 0.4)" : "none"
                                      },
                                      "&.Mui-disabled": {
                                        opacity: 0.6
                                      }
                                    }}
                                    aria-label={weight <= 0 ? "Add weight to enable" : "Share"}
                                    title={weight <= 0 ? "Add weight to enable" : "Add to summary"}
                                  >
                                    <ArrowRightAltIcon sx={{ fontSize: { xs: "1rem", md: "1.2rem" } }} />
                                  </IconButton>
                                ) : (
                                  <IconButton
                                    onClick={() => handleUnshareRow(row.Carat)}
                                    size={isXs ? "small" : "medium"}
                                    sx={{
                                      background: "linear-gradient(135deg, #451a03 0%, #5d2506 50%, #d97706 100%)",
                                      color: "white",
                                      borderRadius: 2,
                                      border: "2px solid #451a03",
                                      transition: "all 0.3s ease",
                                      boxShadow: "0 2px 6px rgba(69, 26, 3, 0.2), inset 0 1px 0 rgba(217, 119, 6, 0.3)",
                                      "&:hover": {
                                        background: "linear-gradient(135deg, #5d2506 0%, #451a03 30%, #5d2506 70%, #d97706 100%)",
                                        transform: "scale(1.1)",
                                        boxShadow: "0 4px 12px rgba(69, 26, 3, 0.4), inset 0 2px 0 rgba(217, 119, 6, 0.4)"
                                      }
                                    }}
                                    title="Remove from summary"
                                  >
                                    <ArrowBackIcon sx={{ fontSize: { xs: "1rem", md: "1.2rem" } }} />
                                  </IconButton>
                                )}
                              </span>
                            </Zoom>
                          </TableCell>
                        </TableRow>
                      </Fade>
                    );
                  })
              )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box sx={{ 
          p: { xs: 3, md: 4 }, 
          background: "linear-gradient(135deg, #451a03 0%, #5d2506 50%, #d97706 100%)",
          borderTop: "3px solid #92400e",
          position: "relative",
          boxShadow: "0 -4px 20px rgba(69, 26, 3, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
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
        }}>
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: "#ffffff",
                fontWeight: "700",
                mb: 2,
                textAlign: "center",
                letterSpacing: "0.5px",
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                textShadow: "0 2px 4px rgba(0,0,0,0.2)"
              }}
            >
              Assayed Bar Calculator
            </Typography>
            <AssayedBar 
              baseRate={baseRate}
              onAssayedBarChange={handleAssayedBarChange}
              disabled={isEditMode}
              currency={currency}
              weightUnit={weightUnit}
            />
          </Box>
        </Box>

        </Card>
      </Box>

      <Box
        sx={{
          width: { xs: "100%", lg: "32%" },
          position: { lg: "sticky" },
          top: { lg: 20 },
          height: { lg: "fit-content" }
        }}
      >
        <SummaryCard
          sharedRows={sharedRows}
          resetSharedRows={resetSharedRows}
          assayedBarData={assayedBarData}
          businessConfig={businessConfig}
          setBusinessConfig={setBusinessConfig}
          currency={currency}
          weightUnit={weightUnit}
        />
      </Box>

      {/* Edit Configuration Dialog */}
      <Dialog 
        open={isEditMode} 
        onClose={handleCancelEdit}
        maxWidth="lg"
        fullWidth
        fullScreen={isXs}
        PaperProps={{
          sx: { 
            borderRadius: isXs ? 0 : 4,
            minHeight: isXs ? "100vh" : "75vh",
            maxHeight: isXs ? "100vh" : "90vh",
            background: "linear-gradient(135deg, #fefcf3 0%, #f7f3e9 100%)",
            border: isXs ? "none" : "2px solid #d97706",
            margin: isXs ? 0 : "auto"
          }
        }}
      >
        <DialogTitle sx={{ 
          background: "linear-gradient(135deg, #451a03 0%, #5d2506 50%, #d97706 100%)",
          color: "#ffffff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: { xs: 2, md: 3 },
          px: { xs: 2, md: 3 },
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 4px 20px rgba(69, 26, 3, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
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
        }}>
          <Box sx={{ textAlign: { xs: "center", sm: "left" }, position: "relative", zIndex: 1 }}>
            <Typography variant={isXs ? "h6" : "h5"} sx={{ 
              fontWeight: "700", 
              color: "#ffffff",
              letterSpacing: "0.5px",
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
            }}>
              Metal Configuration
            </Typography>
            <Typography variant="body2" sx={{ 
              opacity: 0.9, 
              mt: 0.5, 
              color: "#ffffff"
            }}>
              Customize metal types and purity percentages
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", position: "relative", zIndex: 1 }}>
            {isXs && (
              <IconButton 
                onClick={handleCancelEdit}
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
                <ArrowBackIcon />
              </IconButton>
            )}
            <IconButton 
              onClick={handleResetConfig}
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
              <RestartAltIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0, overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: isXs ? "calc(100vh - 200px)" : "60vh" }}>
            <Table stickyHeader size={isXs ? "small" : "medium"}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ 
                    fontWeight: "800", 
                    color: "#451a03",
                    textAlign: "center",
                    bgcolor: "#fef3c7",
                    borderBottom: "2px solid #d97706",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    fontSize: { xs: "0.7rem", md: "0.875rem" },
                    px: { xs: 1, md: 2 }
                  }}>
                    Show
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: "800", 
                    color: "#451a03",
                    bgcolor: "#fef3c7",
                    borderBottom: "2px solid #d97706",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    fontSize: { xs: "0.7rem", md: "0.875rem" },
                    px: { xs: 1, md: 2 }
                  }}>
                    Purity %
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: "800", 
                    color: "#451a03",
                    bgcolor: "#fef3c7",
                    borderBottom: "2px solid #d97706",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    fontSize: { xs: "0.7rem", md: "0.875rem" },
                    px: { xs: 1, md: 2 }
                  }}>
                    Factor
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: "800", 
                    color: "#451a03",
                    bgcolor: "#fef3c7",
                    borderBottom: "2px solid #d97706",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    fontSize: { xs: "0.7rem", md: "0.875rem" },
                    px: { xs: 1, md: 2 }
                  }}>
                    Description
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {editConfig.map((item, index) => (
                  <TableRow 
                    key={index}
                    sx={{
                      "&:nth-of-type(odd)": {
                        bgcolor: "#fef7ed"
                      },
                      "&:nth-of-type(even)": {
                        bgcolor: "#ffffff"
                      },
                      "&:hover": {
                        bgcolor: "#fed7aa"
                      }
                    }}
                  >
                    <TableCell sx={{ textAlign: "center", py: { xs: 1, md: 2 }, px: { xs: 1, md: 2 } }}>
                      <Checkbox
                        checked={item.isVisible}
                        onChange={(e) => handleVisibilityChange(index, e.target.checked)}
                        sx={{
                          transform: { xs: "scale(1.0)", md: "scale(1.2)" },
                          color: "#d97706",
                          "&.Mui-checked": {
                            color: "#92400e"
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: { xs: 1, md: 2 }, px: { xs: 1, md: 2 } }}>
                      <TextField
                        type="number"
                        value={item.percentage.toFixed(2)}
                        onChange={(e) => handlePercentageChange(index, parseFloat(e.target.value) || 0)}
                        variant="outlined"
                        size="small"
                        fullWidth
                        inputProps={{ 
                          step: "0.01",
                          min: "0",
                          max: "100"
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            bgcolor: "#fefcf3",
                            "& fieldset": {
                              borderColor: "#d97706"
                            },
                            "&:hover fieldset": {
                              borderColor: "#92400e"
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#451a03",
                              borderWidth: "2px"
                            }
                          },
                          "& .MuiInputBase-input": {
                            color: "#451a03",
                            fontWeight: "600"
                          }
                        }}
                        InputProps={{
                          endAdornment: <InputAdornment position="end" sx={{ color: "#92400e", fontWeight: "600" }}>%</InputAdornment>,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <TextField
                        type="text"
                        value={factorInputs[index] !== undefined ? factorInputs[index] : (item.percentage / 100).toFixed(4)}
                        onChange={(e) => handleFactorInputChange(index, e.target.value)}
                        onBlur={() => handleFactorBlur(index)}
                        onFocus={(e) => e.target.select()}
                        variant="outlined"
                        size="small"
                        fullWidth
                        placeholder="0.0000"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            bgcolor: "#fefcf3",
                            "& fieldset": {
                              borderColor: "#d97706"
                            },
                            "&:hover fieldset": {
                              borderColor: "#92400e"
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#451a03",
                              borderWidth: "2px"
                            }
                          },
                          "& .MuiInputBase-input": {
                            color: "#451a03",
                            fontWeight: "600"
                          }
                        }}
                        inputProps={{
                          style: { textAlign: 'left' }
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <TextField
                        value={item.description}
                        onChange={(e) => handleDescriptionChange(index, e.target.value)}
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            bgcolor: "#fefcf3",
                            "& fieldset": {
                              borderColor: "#d97706"
                            },
                            "&:hover fieldset": {
                              borderColor: "#92400e"
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#451a03",
                              borderWidth: "2px"
                            }
                          },
                          "& .MuiInputBase-input": {
                            color: "#451a03",
                            fontWeight: "600"
                          }
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: { xs: 2, md: 3 }, 
          background: "linear-gradient(135deg, #fef7ed 0%, #fed7aa 100%)",
          borderTop: "2px solid #d97706",
          gap: { xs: 1, md: 2 },
          flexDirection: { xs: "column", sm: "row" }
        }}>
          {!isXs && (
            <Button 
              onClick={handleCancelEdit} 
              variant="outlined"
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: "none",
                fontWeight: "700",
                color: "#92400e",
                borderColor: "#d97706",
                borderWidth: "2px",
                width: { xs: "100%", sm: "auto" },
                "&:hover": {
                  borderColor: "#92400e",
                  bgcolor: "rgba(146, 64, 14, 0.1)",
                  borderWidth: "2px"
                }
              }}
            >
              Cancel
            </Button>
          )}
          <Button 
            onClick={handleSaveEdit} 
            variant="contained" 
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              textTransform: "none",
              fontWeight: "700",
              background: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
              border: "2px solid #92400e",
              color: "#fef3c7",
              width: { xs: "100%", sm: "auto" },
              boxShadow: "0 4px 12px rgba(217, 119, 6, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #92400e 0%, #d97706 100%)",
                boxShadow: "0 6px 16px rgba(217, 119, 6, 0.4)"
              }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};







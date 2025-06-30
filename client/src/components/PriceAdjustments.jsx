import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export const PriceAdjustments = ({ 
  onAdjustmentsChange, 
  baseRates = {}, 
  exchangeRate = 1, 
  isOpen = false, 
  onOpenChange, 
  currency = 'GBP', 
  weightUnit = 'gram' 
}) => {
  const [adjustments, setAdjustments] = useState({
    gold: { 
      adjustment: 0
    },
    silver: { 
      adjustment: 0
    },
    platinum: { 
      adjustment: 0
    }
  });

  const [exchangeAdjustment, setExchangeAdjustment] = useState(0.01);
  const [showTooltip, setShowTooltip] = useState(false);

  const metals = [
    { key: 'gold', label: 'Gold', symbol: 'Au' },
    { key: 'silver', label: 'Silver', symbol: 'Ag' },
    { key: 'platinum', label: 'Platinum', symbol: 'Pt' }
  ];

  // Update adjustments when base rates change
  useEffect(() => {
    setAdjustments(prev => ({
      gold: { 
        adjustment: prev.gold.adjustment 
      },
      silver: { 
        adjustment: prev.silver.adjustment 
      },
      platinum: { 
        adjustment: prev.platinum.adjustment 
      }
    }));
  }, [baseRates]);

  const getAdjustedPrice = (metal) => {
    const baseRate = baseRates[metal] || 0;
    const adjustment = adjustments[metal].adjustment;
    return Math.max(0, baseRate - adjustment);
  };

  const getAdjustedExchangeRate = () => {
    return Math.max(0, exchangeRate - exchangeAdjustment);
  };

  const handleAdjustmentChange = (metal, value) => {
    const newAdjustments = {
      ...adjustments,
      [metal]: {
        adjustment: parseFloat(value) || 0
      }
    };

    setAdjustments(newAdjustments);
  };

  const handleExchangeAdjustmentChange = (value) => {
    setExchangeAdjustment(parseFloat(value) || 0);
  };

  const handleSave = () => {
    // Pass both metal adjustments and exchange rate adjustment
    const adjustmentData = {
      metals: adjustments,
      exchangeRate: {
        adjustment: exchangeAdjustment,
        adjusted: getAdjustedExchangeRate()
      }
    };
    onAdjustmentsChange(adjustmentData);
    onOpenChange(false);
  };

  const handleReset = () => {
    const resetAdjustments = {
      gold: { 
        adjustment: 0 
      },
      silver: { 
        adjustment: 0 
      },
      platinum: { 
        adjustment: 0 
      }
    };
    setAdjustments(resetAdjustments);
    setExchangeAdjustment(0);
    
    // Notify parent component with reset data (use original exchangeRate prop)
    const resetData = {
      metals: resetAdjustments,
      exchangeRate: {
        adjustment: 0,
        adjusted: exchangeRate // Original exchange rate from props
      }
    };
    onAdjustmentsChange(resetData);
  };

  const getCurrentSymbol = () => {
    const symbols = {
      'GBP': '£',
      'USD': '$',
      'EUR': '€'
    };
    return symbols[currency] || currency;
  };

  const getWeightLabel = () => {
    return weightUnit === 'gram' ? 'g' : weightUnit === 'ounce' ? 'oz' : weightUnit;
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={() => onOpenChange(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, #ffffff 0%, #fefefe 30%, #fdfdfc 70%, #fbfbfa 100%)',
          borderRadius: '16px',
          boxShadow: '0 12px 40px rgba(139, 115, 85, 0.12), 0 4px 12px rgba(139, 115, 85, 0.08)',
          border: '1px solid #e5ddd5'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          background: 'linear-gradient(135deg, #451a03 0%, #5d2506 50%, #d97706 100%)',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 3,
          px: 3,
          borderRadius: '16px 16px 0 0',
          boxShadow: '0 4px 20px rgba(69, 26, 3, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)',
            pointerEvents: 'none'
          }
        }}
      >
        <Typography variant="h6" sx={{ 
          fontWeight: '700', 
          fontSize: '1.25rem',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          letterSpacing: '0.5px',
          position: 'relative',
          zIndex: 1
        }}>
          Price Adjustments
        </Typography>
        <IconButton 
          onClick={() => onOpenChange(false)}
          sx={{ 
            color: '#ffffff',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            position: 'relative',
            zIndex: 1,
            '&:hover': { 
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              transform: 'scale(1.05)',
              borderColor: 'rgba(255, 255, 255, 0.4)'
            }
          }}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, background: 'linear-gradient(135deg, #fef7ed 0%, #fed7aa 100%)' }}>
        {/* Currency Adjustments Section */}
        <Box sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, #451a03 0%, #5d2506 50%, #d97706 100%)', 
          color: '#ffffff',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)',
            pointerEvents: 'none'
          }
        }}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="subtitle2" sx={{ 
              fontWeight: '700', 
              mb: 2,
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              letterSpacing: '0.5px'
            }}>
              Adjustments in {currency} to subtract from market price
            </Typography>
            <Button 
              size="small" 
              onClick={handleReset}
              sx={{ 
                color: '#ffffff', 
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                '&:hover': { 
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  transform: 'scale(1.05)'
                },
                borderRadius: 2,
                px: 2,
                py: 0.5,
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'none'
              }}
            >
              Reset
            </Button>
          </Box>
        </Box>

        {/* Table Header */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr', 
          gap: 1, 
          p: 3, 
          background: 'linear-gradient(135deg, #fef3c7 0%, #fef7ed 50%, #fff8dc 100%)',
          borderBottom: '2px solid #d97706'
        }}>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: '800', 
            color: '#451a03',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontSize: '0.8rem',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
          }}>
            Metal
          </Typography>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: '800', 
            color: '#451a03',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontSize: '0.8rem',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
          }}>
            Your Adjustments
          </Typography>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: '800', 
            color: '#451a03',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontSize: '0.8rem',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
          }}>
            Adjusted Price ({currency})
          </Typography>
        </Box>

        {/* Metal Rows */}
        {metals.map((metal, index) => (
          <Box key={metal.key} sx={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr', 
            gap: 1, 
            p: 3,
            alignItems: 'center',
            backgroundColor: index % 2 === 0 ? '#fef7ed' : '#ffffff',
            borderBottom: '1px solid #f3e8d6',
            '&:last-child': { borderBottom: 'none' },
            '&:hover': {
              backgroundColor: '#fed7aa',
              transition: 'background-color 0.2s ease'
            }
          }}>
            <Typography variant="body2" sx={{ 
              fontWeight: '700', 
              color: '#451a03', 
              textTransform: 'capitalize',
              fontSize: '0.875rem',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
            }}>
              {metal.label}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                size="small"
                type="number"
                value={adjustments[metal.key].adjustment}
                onChange={(e) => handleAdjustmentChange(metal.key, e.target.value)}
                inputProps={{ step: 0.01, min: 0 }}
                sx={{ 
                  width: '80px',
                  '& .MuiOutlinedInput-root': {
                    height: '40px',
                    fontSize: '0.875rem',
                    backgroundColor: '#ffffff',
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: '#d97706'
                    },
                    '&:hover fieldset': {
                      borderColor: '#92400e'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#451a03',
                      borderWidth: '2px'
                    }
                  },
                  '& .MuiInputBase-input': {
                    color: '#451a03',
                    fontWeight: '600'
                  }
                }}
              />
              <Box sx={{ 
                background: 'linear-gradient(135deg, #b8860b 0%, #daa520 30%, #ffd700 70%, #ffea4a 100%)', 
                color: '#1a0f00', 
                px: 1.5, 
                py: 1, 
                borderRadius: 2,
                fontSize: '0.75rem',
                fontWeight: '700',
                minWidth: '70px',
                textAlign: 'center',
                border: '2px solid #8b4513',
                boxShadow: '0 2px 6px rgba(184, 134, 11, 0.2), inset 0 1px 0 rgba(255, 235, 74, 0.3)'
              }}>
                {currency}/{getWeightLabel()}
              </Box>
            </Box>
            
            <Typography variant="body2" sx={{ 
              fontWeight: '700', 
              color: '#451a03',
              fontSize: '0.875rem',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
            }}>
              {getAdjustedPrice(metal.key).toFixed(2)}
            </Typography>
          </Box>
        ))}

        {/* Exchange Rate Section */}
        <Box sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, #451a03 0%, #5d2506 50%, #d97706 100%)', 
          color: '#ffffff',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)',
            pointerEvents: 'none'
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, position: 'relative', zIndex: 1 }}>
            <Typography variant="subtitle2" sx={{ 
              fontWeight: '700',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              letterSpacing: '0.5px'
            }}>
              Adjustment to subtract from {currency} exchange rate
            </Typography>
            <Tooltip 
              title={`Adjust the exchange rate by subtracting from the current rate (${exchangeRate?.toFixed(4) || '1.0000'}). This helps account for processing fees or preferred exchange rates when converting between currencies.`}
              arrow
              placement="top"
            >
              <Box sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.2)', 
                borderRadius: '50%', 
                width: 24, 
                height: 24, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)'
                }
              }}>
                <HelpOutlineIcon sx={{ color: '#ffffff', fontSize: '0.9rem' }} />
              </Box>
            </Tooltip>
          </Box>
        </Box>

        {/* Exchange Rate Table */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr', 
          gap: 1, 
          p: 3, 
          background: 'linear-gradient(135deg, #fef3c7 0%, #fef7ed 50%, #fff8dc 100%)',
          borderBottom: '2px solid #d97706'
        }}>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: '800', 
            color: '#451a03',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontSize: '0.8rem',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
          }}></Typography>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: '800', 
            color: '#451a03',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontSize: '0.8rem',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
          }}>
            Your Adjustments
          </Typography>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: '800', 
            color: '#451a03',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontSize: '0.8rem',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
          }}>
            Adjusted Exch. Rate
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr', 
          gap: 1, 
          p: 3,
          alignItems: 'center',
          backgroundColor: '#fef7ed',
          borderBottom: '1px solid #f3e8d6',
          '&:hover': {
            backgroundColor: '#fed7aa',
            transition: 'background-color 0.2s ease'
          }
        }}>
          <Typography variant="body2" sx={{ 
            fontWeight: '700', 
            color: '#451a03',
            fontSize: '0.875rem',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
          }}>
            Exch. rate
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              size="small"
              type="number"
              value={exchangeAdjustment}
              onChange={(e) => handleExchangeAdjustmentChange(e.target.value)}
              inputProps={{ step: 0.01, min: 0 }}
              sx={{ 
                width: '80px',
                '& .MuiOutlinedInput-root': {
                  height: '40px',
                  fontSize: '0.875rem',
                  backgroundColor: '#ffffff',
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: '#d97706'
                  },
                  '&:hover fieldset': {
                    borderColor: '#92400e'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#451a03',
                    borderWidth: '2px'
                  }
                },
                '& .MuiInputBase-input': {
                  color: '#451a03',
                  fontWeight: '600'
                }
              }}
            />
            <Box sx={{ 
              background: 'linear-gradient(135deg, #b8860b 0%, #daa520 30%, #ffd700 70%, #ffea4a 100%)', 
              color: '#1a0f00', 
              px: 1.5, 
              py: 1, 
              borderRadius: 2,
              fontSize: '0.75rem',
              fontWeight: '700',
              minWidth: '70px',
              textAlign: 'center',
              border: '2px solid #8b4513',
              boxShadow: '0 2px 6px rgba(184, 134, 11, 0.2), inset 0 1px 0 rgba(255, 235, 74, 0.3)'
            }}>
              {currency}
            </Box>
          </Box>
          
          <Typography variant="body2" sx={{ 
            fontWeight: '700', 
            color: '#451a03',
            fontSize: '0.875rem',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
          }}>
            {getAdjustedExchangeRate().toFixed(4)}
          </Typography>
        </Box>

        {/* Time Zone Section */}
        <Box sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, #451a03 0%, #5d2506 50%, #d97706 100%)', 
          color: '#ffffff',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)',
            pointerEvents: 'none'
          }
        }}>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: '700',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            letterSpacing: '0.5px',
            position: 'relative',
            zIndex: 1
          }}>
            Time Zone
          </Typography>
        </Box>

        <Box sx={{ p: 3, display: 'flex', gap: 3, alignItems: 'center', backgroundColor: '#fef7ed' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 16, 
              height: 16, 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
              border: '2px solid #92400e',
              boxShadow: '0 2px 4px rgba(217, 119, 6, 0.3)'
            }} />
            <Typography variant="body2" sx={{ 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: '#451a03',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
            }}>
              Local
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 16, 
              height: 16, 
              borderRadius: '50%', 
              backgroundColor: '#6b7280',
              border: '2px solid #4b5563'
            }} />
            <Typography variant="body2" sx={{ 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: '#451a03',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
            }}>
              NY Time
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 16, 
              height: 16, 
              borderRadius: '50%', 
              backgroundColor: '#6b7280',
              border: '2px solid #4b5563'
            }} />
            <Typography variant="body2" sx={{ 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: '#451a03',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
            }}>
              GMT
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        background: 'linear-gradient(135deg, #fef7ed 0%, #fed7aa 100%)',
        borderTop: '2px solid #d97706',
        gap: 2,
        justifyContent: 'flex-end'
      }}>
        <Button 
          onClick={() => onOpenChange(false)}
          sx={{ 
            background: 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)',
            color: '#ffffff',
            '&:hover': { 
              background: 'linear-gradient(135deg, #4b5563 0%, #6b7280 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(107, 114, 128, 0.3)'
            },
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontSize: '0.875rem',
            fontWeight: '600',
            textTransform: 'none',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            border: '2px solid #4b5563',
            boxShadow: '0 2px 8px rgba(107, 114, 128, 0.2)'
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          sx={{
            background: 'linear-gradient(135deg, #451a03 0%, #5d2506 50%, #d97706 100%)',
            color: '#ffffff',
            '&:hover': {
              background: 'linear-gradient(135deg, #5d2506 0%, #451a03 30%, #5d2506 70%, #d97706 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(69, 26, 3, 0.4)'
            },
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontSize: '0.875rem',
            fontWeight: '600',
            textTransform: 'none',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            border: '2px solid #92400e',
            boxShadow: '0 4px 12px rgba(69, 26, 3, 0.25)'
          }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { styles } from "./style";

// Generate random enquiry number
const generateEnquiryNumber = () => {
  // Generate a 6-digit random number between 100000 and 999999
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const InvoicePdf = ({ sharedRows, currency = "£", weightUnit = "g", enquiryNumber }) => {
  const invoiceNumber = `INV-${Math.floor(Math.random() * 1000000)}${
    Date.now() % 1000000
  }`.slice(0, 12);
  
  // Use provided enquiryNumber or generate one if not provided
  const finalEnquiryNumber = enquiryNumber || generateEnquiryNumber();

  const todayDate = new Date().toLocaleDateString("en-GB");

  const totalSubtotal = sharedRows.reduce(
    (total, row) => total + (parseFloat(row.subtotal) || 0),
    0
  );

  const totalWeight = sharedRows.reduce(
    (total, row) => total + (parseFloat(row.weight) || 0),
    0
  );

  const vatRate = 0; // VAT rate for gold is 0%

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.parent}>
          <View style={styles.header}>
            <View style={styles.normalText}>
              <Text>CUSTOMER COPY</Text>
            </View>

            <View style={[styles.spaceY, { marginTop: 25 }]}>
              <Text style={styles.businessInfo}>Hatton Garden Metals</Text>
              <Text style={styles.businessInfo}>11 St.Cross Street</Text>
              <Text style={styles.businessInfo}>Hatton Garden</Text>
              <Text style={styles.businessInfo}>London EC1N 8UB</Text>
            </View>

            <View style={[styles.spaceY, { marginTop: 15 }]}>
              <Text style={styles.contactInfo}>VAT Registration No: GB 926 1883 05</Text>
              <Text style={styles.contactInfo}>Telephone No: +44 (0)207 404 4000</Text>
            </View>
          </View>

          <View style={styles.header}>
            <View style={styles.underlinedText}>
              <Text>Self Billed Invoice</Text>
            </View>

            <View style={styles.invoiceDetails}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Invoice No.</Text>
                <View style={styles.totalBox}>
                  <Text style={styles.totalValue}>{invoiceNumber}</Text>
                </View>
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Invoice Date</Text>
                <View style={styles.totalBox}>
                  <Text style={styles.totalValue}>{todayDate}</Text>
                </View>
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Invoice To:</Text>
                <View style={[styles.totalBox, styles.largeBox]}>
                  <Text style={styles.totalValue}>Customer Details</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        
        <View style={[styles.parent, { justifyContent: "flex-start", marginTop: 25, marginBottom: 15, gap: 40 }]}>
          <Text style={styles.boldText}>Customer No. ________________________________</Text>
          <Text style={styles.boldText}>Customer VAT No. ________________________________</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: '12%' }]}>Enq #</Text>
            <Text style={[styles.tableHeaderCell, { width: '25%' }]}>Fineness</Text>
            <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Weight</Text>
            <Text style={[styles.tableHeaderCell, { width: '18%' }]}>Price Per G</Text>
            <Text style={[styles.tableHeaderCell, { width: '12%' }]}>VAT</Text>
            <Text style={[styles.tableHeaderCell, { width: '18%', borderRightWidth: 0 }]}>Amount</Text>
          </View>

          {sharedRows.map((row, index) => (
            <View key={index} style={styles.row}>
              <Text style={[styles.cell, { width: '12%' }]}>{finalEnquiryNumber}</Text>
              <Text style={[styles.cell, { width: '25%', fontSize: 8 }]}>
                {row.type === 'assayed' 
                  ? `ASSAYED BAR ${row.purity}%` 
                  : `GOLD ${row.Carat}`
                }
              </Text>
              <Text style={[styles.cell, { width: '15%' }]}>{row.weight.toFixed(2)}</Text>
              <Text style={[styles.cell, { width: '18%' }]}>{(row.pricePerUnit || row.pricePerGram)?.toFixed(2) || "0.00"}</Text>
              <Text style={[styles.cell, { width: '12%' }]}>{vatRate.toFixed(2)}</Text>
              <Text style={[styles.cell, { width: '18%', borderRightWidth: 0 }]}>{row.subtotal?.toFixed(2) || "0.00"}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.totalSection}>
          <View style={styles.parent}>
            <View style={{ flex: 1 }}>
              <Text style={styles.vatNotice}>THE OUTPUT TAX ON THIS SUPPLY OF</Text>
              <Text style={styles.vatNotice}>GOLD TO BE ACCOUNTED FOR TO H.M.</Text>
              <Text style={styles.vatNotice}>CUSTOM AND EXCISE BY THE BUYER,</Text>
              <Text style={styles.vatNotice}>THE SUM BEING:</Text>
              
              <View style={[styles.paymentDetails, { marginTop: 15 }]}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Payment:</Text>
                  <View style={styles.totalBox}>
                    <Text style={styles.totalValue}>Cash</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Weight</Text>
                <View style={styles.totalBox}>
                  <Text style={styles.totalValue}>{totalWeight.toFixed(2)}{weightUnit}</Text>
                </View>
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Net</Text>
                <View style={styles.totalBox}>
                  <Text style={styles.totalValue}>{currency}{totalSubtotal.toFixed(2)}</Text>
                </View>
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>VAT @ 0%</Text>
                <View style={styles.totalBox}>
                  <Text style={styles.totalValue}>{currency}0.00</Text>
                </View>
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <View style={[styles.totalBox, { backgroundColor: "#34495e" }]}>
                  <Text style={[styles.totalValue, { color: "#ffffff", fontWeight: 700 }]}>{currency}{totalSubtotal.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

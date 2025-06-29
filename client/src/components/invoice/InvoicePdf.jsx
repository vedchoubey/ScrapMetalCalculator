import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { styles } from "./style";

export const InvoicePdf = ({ sharedRows, currency = "£", weightUnit = "g" }) => {
  const invoiceNumber = `INV-${Math.floor(Math.random() * 1000000)}${
    Date.now() % 1000000
  }`.slice(0, 12);

  const todayDate = new Date().toLocaleDateString("en-GB");

  const totalSubtotal = sharedRows.reduce(
    (total, row) => total + (parseFloat(row.subtotal) || 0),
    0
  );

  const totalWeight = sharedRows.reduce(
    (total, row) => total + (parseFloat(row.weight) || 0),
    0
  );

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
        
        <View style={[styles.parent, { justifyContent: "flex-start", marginTop: 20, gap: 50 }]}>
          <Text style={styles.boldText}>Customer No. ________________</Text>
          <Text style={styles.boldText}>Customer VAT No. ________________</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Enq #</Text>
            <Text style={styles.tableHeaderCell}>Fineness</Text>
            <Text style={styles.tableHeaderCell}>Weight ({weightUnit})</Text>
            <Text style={styles.tableHeaderCell}>Price Per {weightUnit} ({currency})</Text>
            <Text style={styles.tableHeaderCell}>VAT</Text>
            <Text style={styles.tableHeaderCell}>Amount ({currency})</Text>
          </View>

          {sharedRows.map((row, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.cell}>{index + 1}</Text>
              <Text style={styles.cell}>{row.Carat} Carat Gold</Text>
              <Text style={styles.cell}>{row.weight}{weightUnit}</Text>
              <Text style={styles.cell}>{currency}{row.pricePerGram?.toFixed(3) || "0.000"}</Text>
              <Text style={styles.cell}>0%</Text>
              <Text style={styles.cell}>{currency}{row.subtotal?.toFixed(2) || "0.00"}</Text>
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

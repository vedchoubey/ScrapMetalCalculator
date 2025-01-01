// InvoicePdf.js
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import CurrencyPoundIcon from "@mui/icons-material/CurrencyPound";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    backgroundColor: "#ffffff",
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  row: {
    flexDirection: "row",
    borderBottom: "1px solid #000",
    padding: 5,
  },
  cell: {
    width: "25%",
    textAlign: "center",
    padding: 5,
  },
});

const InvoicePdf = ({ sharedRows, totalWeight, totalSubtotal }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Invoice</Text>
        <Text>Date: {new Date().toLocaleDateString()}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.header}>Items</Text>
        <View style={styles.table}>
          {sharedRows.map((row, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.cell}>{row.Carat}</Text>
              <Text style={styles.cell}></Text>
              <Text style={styles.cell}>{row.weight}g</Text>
              <Text style={styles.cell}>{row.subtotal}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.header}>Total: </Text>
        <Text>{totalWeight}g</Text>
        <Text>
          <CurrencyPoundIcon />
          {totalSubtotal.toFixed(2)}
        </Text>
      </View>
    </Page>
  </Document>
);

export default InvoicePdf;

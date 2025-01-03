import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: "40px 50px",
    fontSize: 12,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  underlinedText: {
    textDecoration: "underline",
    fontSize: 20,
    fontWeight: "bold",
  },
  boldText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  invoiceDetails: {
    marginTop: 20,
    fontSize: 12,
  },
  spaceY: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderColor: "#000",
    padding: 5,
  },
  tableHeaderCell: {
    width: "25%",
    textAlign: "center",
    fontWeight: "bold",
    padding: 5,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
    padding: 5,
  },
  cell: {
    width: "25%",
    textAlign: "center",
    padding: 5,
  },
});

const InvoicePdf = ({ sharedRows }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.spaceY}>
          <Text>Hatton Garden Metals</Text>
          <Text>11 St.Cross Street</Text>
          <Text>Hatton Garden</Text>
          <Text>London EC1N 8UB</Text>
        </View>

        <View>
          <Text style={styles.underlinedText}>Self Billed Invoice</Text>

          <View style={styles.invoiceDetails}>
            <Text>Invoice No.</Text>
            <Text>Invoice Date</Text>
            <Text>Invoice To</Text>
          </View>
        </View>
      </View>

      <View style={[styles.spaceY, styles.boldText]}>
        <Text>VAT Registration No: GB 926 1883 05</Text>
        <Text>Telephone No: +44 (0)207 404 4000</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>Enq #</Text>
          <Text style={styles.tableHeaderCell}>Fineness</Text>
          <Text style={styles.tableHeaderCell}>Weight</Text>
          <Text style={styles.tableHeaderCell}>Price Per G</Text>
          <Text style={styles.tableHeaderCell}>VAT</Text>
          <Text style={styles.tableHeaderCell}>Amount</Text>
        </View>

        {sharedRows.map((row, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}>{row.Carat}</Text>
            <Text style={styles.cell}>{row.weight}g</Text>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}>{row.subtotal}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default InvoicePdf;

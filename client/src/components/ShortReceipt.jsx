import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  card: {
    padding: 20,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },
  title: {
    textAlign: "center",
    fontWeight: 700,
    fontSize: 18,
    marginBottom: 8,
    color: "#2c3e50",
    letterSpacing: 0.5,
  },
  parent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  date: {
    textAlign: "center",
    fontSize: 10,
    color: "#7f8c8d",
    marginBottom: 15,
    fontWeight: 500,
  },
  
  line: {
    borderBottom: "1px solid #ecf0f1",
    marginVertical: 12,
  },
  divider: {
    borderBottom: "1px solid #bdc3c7",
    marginVertical: 8,
  },
  items: {
    marginVertical: 8,
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 6,
    flexDirection: "row",
    paddingHorizontal: 5,
  },
  itemText: {
    fontSize: 10,
    color: "#34495e",
    fontWeight: 400,
  },
  normalText: {
    fontSize: 8,
    color: "#7f8c8d",
    lineHeight: 1.4,
  },
  bold: {
    fontWeight: 600,
    fontSize: 12,
    color: "#2c3e50",
    lineHeight: 1.3,
  },
  businessInfo: {
    fontSize: 9,
    color: "#34495e",
    lineHeight: 1.4,
    fontWeight: 500,
  },
  contactInfo: {
    fontSize: 8,
    color: "#7f8c8d",
    lineHeight: 1.3,
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
    flexDirection: "row",
    paddingHorizontal: 5,
    borderBottom: "1px solid #ecf0f1",
    paddingBottom: 5,
  },
  headerText: {
    fontSize: 11,
    fontWeight: 600,
    color: "#2c3e50",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginVertical: 4,
    flexDirection: "row",
    paddingHorizontal: 5,
    backgroundColor: "#f8f9fa",
    padding: 8,
    borderRadius: 4,
  },
  totalText: {
    fontSize: 12,
    fontWeight: 700,
    color: "#2c3e50",
  },
  footer: {
    textAlign: "center",
    fontSize: 9,
    fontStyle: "italic",
    marginTop: 15,
    color: "#95a5a6",
    fontWeight: 400,
  },
});

export const ShortReceipt = ({ sharedRows, totalWeight, totalSubtotal, currency = "£", weightUnit = "g" }) => {
  const date = new Date().toLocaleString();
  return (
    <Document>
      <Page size="A6" style={styles.card}>
        <Text style={styles.title}>Metal Receipt</Text>
        <Text style={styles.date}>{date}</Text>
        
        <View style={styles.parent}>
          <View>
            <Text style={styles.businessInfo}>Hatton Garden Metals</Text>
            <Text style={styles.businessInfo}>11 St.Cross Street</Text>
            <Text style={styles.businessInfo}>Hatton Garden</Text>
            <Text style={styles.businessInfo}>London EC1N 8UB</Text>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.contactInfo}>VAT: GB 926 1883 05</Text>
            <Text style={styles.contactInfo}>Tel: +44 (0)207 404 4000</Text>
          </View>
        </View>

        <View style={styles.divider} />
        
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>Items</Text>
          <Text style={styles.headerText}>Weight ({weightUnit})</Text>
        </View>

        <View style={styles.items}>
          {sharedRows.map((row, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemText}>{`${row.Carat} Carat Gold`}</Text>
              <Text style={styles.itemText}>{`${row.weight}${weightUnit}`}</Text>
            </View>
          ))}
        </View>

        <View style={styles.line} />

        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total Weight:</Text>
          <Text style={styles.totalText}>{`${totalWeight}${weightUnit}`}</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total Amount:</Text>
          <Text style={styles.totalText}>{`${currency}${totalSubtotal.toFixed(2)}`}</Text>
        </View>

        <Text style={styles.footer}>Thank you for your visit!</Text>
      </Page>
    </Document>
  );
};

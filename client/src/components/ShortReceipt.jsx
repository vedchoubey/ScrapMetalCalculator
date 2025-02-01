import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  card: {
    width: 22,
    padding: 10,
    border: "1px dashed grey",
    textAlign: "center",
  },
  title: {
    textAlign: "center",
    fontWeight: 650,
    fontSize: 16,
    marginBottom: 5,
  },
  parent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  date: {
    textAlign: "center",
    fontSize: 8,
    color: "#808080",
    marginBottom: 10,
  },
  
  line: {
    borderBottom: "1px dashed grey",
    marginVertical: 8,
  },
  divider: {
    borderBottom: "1px solid #0000",
  },
  items: {
    marginVertical: 5,
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: 3,
    flexDirection: "row",
  },
  itemText: {
    fontSize: 6,
  },
  normalText: {
    fontSize: 5,
  },
  bold: {
    fontWeight: "bold",
    fontSize: 10,
  },
  footer: {
    textAlign: "center",
    fontSize: 8,
    fontStyle: "italic",
    marginTop: 8,
  },
});

export const ShortReceipt = ({ sharedRows, totalWeight, totalSubtotal }) => {
  const date = new Date().toLocaleString();
  return (
    <Document>
      <Page size="A7" style={styles.card}>
        <Text style={styles.title}> * Metal Receipt *</Text>
        <Text style={styles.date}>{date}</Text>
        <View style={styles.parent}>
          <View style={styles.bold}>
            <Text>Hatton Garden Metals</Text>
            <Text>11 St.Cross Street</Text>
            <Text>Hatton Garden</Text>
            <Text>London EC1N 8UB</Text>
          </View>

          <View style={[styles.normalText, { marginTop: 15 }]}>
            <Text>VAT Registration No: GB 926 1883 05</Text>
            <Text>Telephone No: +44 (0)207 404 4000</Text>
          </View>
        </View>

        <View style={styles.line} />
        <View style={styles.itemRow}>
          <Text style={styles.bold}>Items</Text>
          <Text style={styles.bold}>Weight</Text>
        </View>

        <View style={styles.items}>
          {sharedRows.map((row, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemText}>{`${row.Carat} Carat`}</Text>
              <Text style={styles.itemText}>{`${row.weight}g`}</Text>
            </View>
          ))}
        </View>

        <View style={styles.line} />

        <View style={styles.itemRow}>
          <Text style={styles.bold}>Total Weight:</Text>
          <Text style={styles.bold}>{`${totalWeight}g`}</Text>
        </View>

        <View style={styles.itemRow}>
          <Text style={styles.bold}>Total Amount:</Text>
          <Text style={styles.bold}>{`£${totalSubtotal.toFixed(2)}`}</Text>
        </View>
        <View style={styles.line} />

        <Text style={styles.footer}>Thank you for your visit!</Text>
      </Page>
    </Document>
  );
};

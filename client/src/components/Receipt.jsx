import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  card: {
    padding: 24,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },
  title: {
    textAlign: "center",
    fontWeight: 700,
    fontSize: 22,
    marginBottom: 10,
    color: "#2c3e50",
    letterSpacing: 0.5,
  },
  parent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  date: {
    textAlign: "center",
    fontSize: 12,
    color: "#7f8c8d",
    marginBottom: 20,
    fontWeight: 500,
  },
  line: {
    borderBottom: "1px solid #ecf0f1",
    marginVertical: 15,
  },
  divider: {
    borderBottom: "1px solid #bdc3c7",
    marginVertical: 10,
  },
  items: {
    marginVertical: 10,
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
    flexDirection: "row",
    paddingHorizontal: 8,
  },
  itemText: {
    fontSize: 11,
    color: "#34495e",
    fontWeight: 400,
    flex: 1,
    textAlign: "center",
  },
  businessInfo: {
    fontSize: 11,
    color: "#34495e",
    lineHeight: 1.4,
    fontWeight: 600,
  },
  contactInfo: {
    fontSize: 9,
    color: "#7f8c8d",
    lineHeight: 1.3,
    marginTop: 8,
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 12,
    flexDirection: "row",
    paddingHorizontal: 8,
    borderBottom: "1px solid #ecf0f1",
    paddingBottom: 8,
  },
  headerText: {
    fontSize: 12,
    fontWeight: 700,
    color: "#2c3e50",
    flex: 1,
    textAlign: "center",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginVertical: 6,
    flexDirection: "row",
    paddingHorizontal: 8,
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 4,
  },
  totalText: {
    fontSize: 13,
    fontWeight: 700,
    color: "#2c3e50",
  },
  footer: {
    textAlign: "center",
    fontSize: 10,
    fontStyle: "italic",
    marginTop: 20,
    color: "#95a5a6",
    fontWeight: 400,
  },
});

const Receipt = ({ sharedRows, totalWeight, totalSubtotal, businessConfig, currency = "£", weightUnit = "g" }) => {
  const date = new Date().toLocaleString();

  return (
    <Document>
      <Page size="A5" style={styles.card}>
        <Text style={styles.title}>{businessConfig?.receipt?.title || "Metal Receipt"}</Text>
        <Text style={styles.date}>{date}</Text>
        
        <View style={styles.parent}>
          <View>
            <Text style={styles.businessInfo}>{businessConfig?.businessName || "Hatton Garden Metals"}</Text>
            <Text style={styles.businessInfo}>{businessConfig?.address?.line1 || "11 St.Cross Street"}</Text>
            <Text style={styles.businessInfo}>{businessConfig?.address?.line2 || "Hatton Garden"}</Text>
            <Text style={styles.businessInfo}>{businessConfig?.address?.city || "London"} {businessConfig?.address?.postcode || "EC1N 8UB"}</Text>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.contactInfo}>VAT: {businessConfig?.registration?.vatNumber || "GB 926 1883 05"}</Text>
            <Text style={styles.contactInfo}>Tel: {businessConfig?.contact?.phone || "+44 (0)207 404 4000"}</Text>
          </View>
        </View>

        <View style={styles.divider} />
        
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>Items</Text>
          <Text style={styles.headerText}>Weight ({weightUnit})</Text>
          <Text style={styles.headerText}>Subtotal ({currency})</Text>
        </View>

        <View style={styles.items}>
          {sharedRows.map((row, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemText}>{`${row.Carat} Carat Gold`}</Text>
              <Text style={styles.itemText}>{`${row.weight}${weightUnit}`}</Text>
              <Text style={styles.itemText}>{`${currency}${row.subtotal.toFixed(2)}`}</Text>
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

        <Text style={styles.footer}>{businessConfig?.receipt?.footerMessage || "Thank you for your visit!"}</Text>
      </Page>
    </Document>
  );
};

export default Receipt;

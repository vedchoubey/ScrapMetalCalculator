import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { styles } from "./style";

export const InvoicePdf = ({ sharedRows }) => {
  const invoiceNumber = `${Math.floor(Math.random() * 1000000)}${
    Date.now() % 1000000
  }`.slice(0, 8);

  const todayDate = new Date().toLocaleDateString("en-GB");

  const totalSubtotal = sharedRows.reduce(
    (total, row) => total + (parseFloat(row.subtotal) || 0),
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
              <Text>Hatton Garden Metals</Text>
              <Text>11 St.Cross Street</Text>
              <Text>Hatton Garden</Text>
              <Text>London EC1N 8UB</Text>
            </View>

            <View style={[styles.spaceY, styles.boldText, { marginTop: 15 }]}>
              {" "}
              <Text>VAT Registration No: GB 926 1883 05</Text>
              <Text>Telephone No: +44 (0)207 404 4000</Text>
            </View>
          </View>

          <View style={styles.header}>
            <View style={styles.underlinedText}>
              <Text>Self Billed Invoice</Text>
            </View>

            <View style={styles.invoiceDetails}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.boxLabel}>Invoice No.</Text>
                <View
                  style={[
                    styles.boxContainer,
                    { width: "100px" },
                    { marginLeft: 10 },
                  ]}
                >
                  <Text style={styles.boxValue}>{invoiceNumber}</Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.boxLabel}>Invoice Date</Text>
                <View
                  style={[
                    styles.boxContainer,
                    { width: "100px" },
                    { marginLeft: 2 },
                  ]}
                >
                  {" "}
                  <Text style={styles.boxValue}>{todayDate}</Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",

                  alignItems: "flex-start",
                }}
              >
                <Text style={styles.boxLabel}>Invoice To:</Text>
                <View style={[styles.boxContainer, styles.largeBox]}>
                  {" "}
                  <Text style={styles.boxValue}>{invoiceNumber}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={[styles.parent, { justifyContent: "flex-start" }]}>
          <Text>Customer No. </Text>
          <Text>Customer VAT No. </Text>
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
              <Text style={styles.cell}>{row.Carat} Carat</Text>
              <Text style={styles.cell}>{row.weight}g</Text>
              <Text style={styles.cell}>{row.pricePerGram.toFixed(3)}</Text>
              <Text style={styles.cell}></Text>
              <Text style={styles.cell}>{row.subtotal.toFixed(3)}</Text>
            </View>
          ))}
        </View>
        <View
          style={{
            width: "100%",
            border: "1px solid #000",
            padding: 10,
            marginTop: 30,
          }}
        >
          <View style={styles.parent}>
            <View style={{ marginTop: 12 }}>
              <Text>THE OUTPUT TAX ON THIS SUPPLY OF</Text>
              <Text>GOLD TO BE ACCOUNTED FOR TO H.M.</Text>
              <Text>CUSTOM AND EXCISE BY THE BUYER,</Text>
              <Text>THE SUM BEING:</Text>
              <View style={styles.paymentDetails}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.boxLabel}></Text>
                  <View
                    style={[
                      styles.boxContainer,
                      { width: "100px" },
                      { marginLeft: 10 },
                    ]}
                  >
                    <Text style={styles.boxValue}>{invoiceNumber}</Text>
                  </View>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.boxLabel}>Payment:</Text>
                  <View
                    style={[
                      styles.boxContainer,
                      { width: "100px" },
                      { marginLeft: 2 },
                    ]}
                  >
                    {" "}
                    <Text style={styles.boxValue}>{invoiceNumber}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={[styles.invoiceDetails, { marginTop: 12 }]}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.boxLabel}>Net</Text>
                <View
                  style={[
                    styles.boxContainer,
                    { width: "100px" },
                    { marginLeft: 17 },
                  ]}
                >
                  <Text style={styles.boxValue}>{invoiceNumber}</Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.boxLabel}>VAT @</Text>
                <View style={[styles.boxContainer, { width: "100px" }]}>
                  {" "}
                  <Text style={styles.boxValue}>{todayDate}</Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.boxLabel}>Total</Text>
                <View
                  style={[
                    styles.boxContainer,
                    { width: "100px" },
                    { marginLeft: 10 },
                  ]}
                >
                  {}
                  <Text style={styles.boxValue}>{totalSubtotal.toFixed(3)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

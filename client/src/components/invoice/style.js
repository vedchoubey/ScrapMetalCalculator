import  {StyleSheet}  from "@react-pdf/renderer";
export const styles = StyleSheet.create({
  page: {
    padding: "30px 40px",
    fontSize: 12,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    lineHeight: 1.4,
  },
  header: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 20,
    color: "#2c3e50",
  },
  underlinedText: {
    textDecoration: "underline",
    fontSize: 20,
    fontWeight: 700,
    color: "#2c3e50",
  },
  boldText: {
    fontSize: 13,
    fontWeight: 600,
    color: "#34495e",
  },
  spaceY: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  normalText: {
    fontSize: 10,
    fontWeight: "normal",
    color: "#7f8c8d",
  },
  businessInfo: {
    fontSize: 12,
    fontWeight: 600,
    color: "#2c3e50",
    lineHeight: 1.3,
  },
  contactInfo: {
    fontSize: 10,
    color: "#7f8c8d",
    lineHeight: 1.3,
  },
  paymentDetails: {
    marginTop: 20,
    fontSize: 12,
    display: "flex",
    flexDirection: "row",
    gap: 15,
  },

  invoiceDetails: {
    marginTop: 20,
    fontSize: 12,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  
  boxContainer: {
    border: "1px solid #bdc3c7",
    padding: 8,
    width: 120,
    backgroundColor: "#f8f9fa",
    borderRadius: 2,
  },

  boxLabel: {
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 5,
    color: "#2c3e50",
  },
  boxValue: {
    fontSize: 12,
    fontWeight: "normal",
    color: "#34495e",
  },
  largeBox: {
    minHeight: 100,
    width: 200,
  },

 
  table: {
    display: "table",
    width: "100%",
    marginTop: 25,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bdc3c7",
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#34495e",
    borderBottomWidth: 1,
    borderColor: "#2c3e50",
  },
  tableHeaderCell: {
    flex: 1,
    textAlign: "center",
    fontWeight: 700,
    borderRightWidth: 1,
    borderColor: "#2c3e50",
    padding: 10,
    color: "#ffffff",
    fontSize: 11,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ecf0f1",
    backgroundColor: "#ffffff",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    padding: 10,
    fontSize: 10,
    color: "#34495e",
    borderRightWidth: 1,
    borderColor: "#ecf0f1",
  },
  parent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalSection: {
    width: "100%",
    border: "1px solid #bdc3c7",
    padding: 20,
    marginTop: 30,
    backgroundColor: "#f8f9fa",
    borderRadius: 4,
  },
  vatNotice: {
    fontSize: 11,
    color: "#34495e",
    lineHeight: 1.4,
    fontWeight: 500,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: "#2c3e50",
    marginRight: 15,
  },
  totalBox: {
    border: "1px solid #bdc3c7",
    padding: 8,
    width: 100,
    backgroundColor: "#ffffff",
    borderRadius: 2,
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 600,
    color: "#2c3e50",
    textAlign: "center",
  },
});
import  {StyleSheet}  from "@react-pdf/renderer";
export const styles = StyleSheet.create({
  page: {
    padding: "40px 50px",
    fontSize: 12,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 20,
    fontWeight: 650,
    marginBottom: 20,
  },
  underlinedText: {
    textDecoration: "underline",
    fontSize: 20,
    fontWeight: 650,
  },
  boldText: {
    fontSize: 15,
    fontWeight: 500,
  },
  spaceY: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },
  normalText: {
    fontSize: 10,
    fontWeight: "normal",
  },
  paymentDetails: {
    marginTop: 20,
    fontSize: 12,
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },

  invoiceDetails: {
    marginTop: 20,
    fontSize: 12,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  
  boxContainer: {
    border: "1px solid #000",
    padding: 5,
    width: 100,
    flexGrow: 1, 
  },

  boxLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5, 
  },
  boxValue: {
    fontSize: 12,
    fontWeight: "normal",
  },
  largeBox: {
    minHeight: 100, 
  },

 
  table: {
    display: "table",
    width: "100%",
    marginTop: 20,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  tableHeaderCell: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 5,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    padding: 5,
    borderRightWidth: 1,
    borderColor: "#000",
  },
  parent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
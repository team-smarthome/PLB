import jsPDF from "jspdf";
import "jspdf-autotable";
// Date Fns is used to format the dates we receive
// from our API call
import { format } from "date-fns";

// define a generatePDF function that accepts a data argument
const generatePDF = (datas) => {
  // initialize jsPDF
  const doc = new jsPDF();

  // define the columns we want and their titles
  const tableColumn = [
    "No",
    "Register Number",
    "Nama",
    "No. Passport",
    "Kewarganegaraan",
    "No. VOA",
    "No. Receipt",
    "Tipe Transaksi",
    "Nominal",
  ];
  // define an empty array of rows
  const tableRows = [];

  // for each data pass all its data into an array
  datas.forEach((data) => {
    const ticketData = [
      data.register_number,
      data.full_name,
      data.passport_number,
      data.citizenship,
      data.visa_number,
      data.receipt,
      data.payment_method,
      data.timestamp,
      // called date-fns to format the date on the data
      format(new Date(data.updated_at), "yyyy-MM-dd"),
    ];
    // push each tickcet's info into a row
    tableRows.push(ticketData);
  });

  // startY is basically margin-top
  doc.autoTable(tableColumn, tableRows, { startY: 20 });
  const date = Date().split(" ");
  // we use a date string to generate our filename.
  const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
  // data title. and margin-top + margin-left
  doc.text("Closed data within the last one month.", 14, 15);
  // we define the name of our PDF file.
  doc.save(`report_${dateStr}.pdf`);
};

export default generatePDF;

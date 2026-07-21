const { google } = require("googleapis");
const fs = require("fs");

module.exports = {
  addToSheet: async function(range,values) {
    const credentials = JSON.parse(
      fs.readFileSync("beaudeluxe-413710-75418d47f76a.json")
    //   fs.readFileSync("client_secret_725308120683-6tsiljlkctvt7383s92ir9ni12jfn75u.apps.googleusercontent.com.json")
    );


    // console.log('values', values)


    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
 
    const sheets = google.sheets({ version: "v4", auth });

    // const spreadsheetId = "1gGDn6ERzMo7qU1DkXDUfYMz2ZckIXHXmUjAgwzsprxk";
    const spreadsheetId = "1p2C3ixP1amRCD01P67iBOemGxUxDECV08jJ21KAYC5c";
    // const range = "Sheet1!A1:B2";

    // const values = [
    //   ["Value1", "Value2"],
    //   ["Value3", "Value4"],
    // ];

    // sheets.spreadsheets.values.update(
    //   {
    //     spreadsheetId,
    //     range,
    //     valueInputOption: "RAW",
    //     requestBody: {
    //       values,
    //     },
    //   },
    let numRows = 0;
  const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: range.replace('!A2',''),
      })
      numRows = response.data.values ? response.data.values.length : 0;
      
      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1; 
      const year = currentDate.getFullYear() % 100; 
      
      const formattedDay = day < 10 ? '0' + day : day;
      const formattedMonth = month < 10 ? '0' + month : month;
      
      const formattedDate = `${formattedDay}-${formattedMonth}-${year}`;
        
      // Combine new values with existing data
      const existingValues = response.data.values || [];
      // console.log('first', delete existingValues[0])
      delete existingValues[0]
const updatedValues = [[numRows,formattedDate, ...values], ...existingValues];


    sheets.spreadsheets.values.update(
        {
          spreadsheetId,
          valueInputOption: "RAW",
          range: range,
          // insertDataOption: "INSERT_ROWS",
          requestBody: {
            values:updatedValues,
          },
        },
      (err, response) => {
        if (err) {
          console.error("The API returned an error:", err);
          return;
        }
        // console.log("Data updated successfully:", response.data);
      }
    );
  },
};

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import puppeteer from "puppeteer";
import exphbs from "express-handlebars";
import path from "path"; // Import the path module
import "./config/index.js";
import { db } from "./config/index.js";
import Odd from "./models/Odd.js";
import Tennis from "./models/Tennis.js";
import http from "http"; // Import the built-in http module
import { Server } from "socket.io";
import cors from 'cors';

const app = express();
const PORT = 7001; // Specify the port number
const server = http.createServer(app);
app.use(cors());
app.use(express.static("public"));
// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//    app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});


// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  

  
});

db.connect((error, success) => {
    console.log({ error, success });
    // if (error) {
    //     console.error("Failed to connect to MongoDB:", error);
    // } else {
    //     console.log("Connected to MongoDB successfully.");
    //     // Any further logic that depends on the database connection can go here
    // }
});


app.engine(".hbs", exphbs.engine({ extname: ".hbs", defaultLayout: false }));
app.set("view engine", ".hbs");

// function socket_test() {
//     const test_object = ["test", "res"];
//     io.emit("hello", "world", test_object);
// }



//Main Function To scrap odds
// async function openbrowser() {
//     //create browser instance
//     // const browser = await puppeteer.launch();
//  //const browser = await browser.createIncognitoBrowserContext({ 
//     const browser = await puppeteer.launch({});

// //    const context = await browser.createIncognitoBrowserContext({});
// 	console.log('BROWSER LAUNCHED');
//     const page = await browser.newPage();

//     // await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/14.194.102.108 Safari/537.36');

//     await page.goto(
//         "https://bxawscf.skyexch.art/exchange/member/index.jsp?eventType=4"
//     );

//     console.log('Set screen size')
//     await page.setViewport({ width: 1080, height: 1024 });
//     let btnBackInnerHTML;

//     setInterval(async () => {
//         try {
//             await page.waitForSelector("#eventBoard dl", { timeout: 60000 });


//             result_array = await page.$$eval("#eventBoard dl", (dlTags) => {
//                 const result = [];

//                 dlTags.forEach((dlTag) => {
//                     const vsNameElement = dlTag.querySelector("dt a#vsName");
//                     const vsName = dlTag.querySelector("dt a#vsName").innerText;
//                     const vsNameUrl = vsNameElement.getAttribute("href");
//                     const backOdds = [
//                         ...dlTag.querySelectorAll("a#btnBack"),
//                     ].map((aTag) => aTag.innerHTML.replace(/&nbsp;/g, "-"));

//                     // Extract lay odds and replace &nbsp; with -
//                     const layOdds = [...dlTag.querySelectorAll("a#btnLay")].map(
//                         (aTag) => aTag.innerHTML.replace(/&nbsp;/g, "-")
//                     );

//                     result.push({ vsNameUrl, vsName, backOdds, layOdds });
//                 });

//                 return result;
//             });

//             const suspendedurls = result_array.map((item) => item.vsNameUrl);
//             try {
//                 // Find documents to delete
//                 const docsToDelete = await Odd.find({
//                     vsNameUrl: { $nin: suspendedurls },
//                 });

//                 // Delete documents
//                 const deleteResult = await Odd.deleteMany({
//                     vsNameUrl: { $nin: suspendedurls },
//                 });
//             } catch (error) {
//                 console.error("Error:", error);
//             }

//             // Step 1: Extract all vsNameUrls from the data array

//             // console.log('Odds Scraped Successfully":', result_array);

//             //Update if url exist else create
//             result_array.forEach(async (data) => {
//                 try {
//                     const { vsNameUrl } = data;
//                     const result = await Odd.findOneAndUpdate(
//                         { vsNameUrl }, // Search condition
//                         { $set: data }, // Update or Insert document
//                         { upsert: true, new: true } // Options
//                     );
//                     // console.log("Updated or inserted document:", result);
//                 } catch (error) {
//                     console.error("Error:", error);
//                 }
//             });
//             //end

//             //emit oddupdate event if mongoDb  is  updated/inserted successfully via socket.io

//             const dbConnection = mongoose.connection;
//             dbConnection.once("open", async () => {
//                 try {
//                     const oddsCollection = dbConnection.collection("odds");

//                     const allOdds = await oddsCollection.find().toArray();

//                     // Emit the oddsUpdate event with all documents
//                     io.emit("oddsUpdate", allOdds);

//                     // Listen for changes in Odds collection
//                 } catch (error) {
//                     console.error("Error:", error);
//                 }
//             });

//             //end
//         } catch (error) {
//             console.log(error);
//         }
//     }, 300);

//     return result_array;
// }

let OPERATION_TYPE={
deposit:1,
withdraw:2
};

  async function login(req,res) {
    let success = false;
    let attempts = 0;
    while (!success && attempts < 3) {
    try{  
    const { username, password,operation_type,amount,transaction_pin,clientsearch } = req.body;
      const browser = await puppeteer.launch({ headless: false }); // Launch browser in non-headless mode
      const page = await browser.newPage();
     // Get the screen width and height
   
      
      // Navigate to the login page
      await page.goto('https://www.diamondexch99.com/admin/login');
      // await page.setViewport({ width: 1366, height: 768 });

      async function typeWithDelay(elementHandle, text, delay = 100) {
          for (const char of text) {
            await elementHandle.type(char, { delay: delay });
          }
        }
    
      // Type username with delay
    const usernameField = await page.$('#username');
    await typeWithDelay(usernameField, username);

    // Type password with delay
    const passwordField = await page.$('#Password');
    await typeWithDelay(passwordField, password);
    
      await Promise.all([
          page.click('.btn-login'), // Click the login button
          page.waitForNavigation({ timeout: 90000 }), // Wait for navigation to complete
      
        ]);
    
      // Wait for navigation to complete
      // await page.waitForNavigation({ timeout: 90000 });
      // Click on the logo button
          // Click on the logo button
      await page.goto('https://www.diamondexch99.com/admin/list-clients/'); // Assuming this element corresponds to the logo you mentioned
        // Wait for the actions to load
        await page.waitForSelector('.actions.text-left');

        // Click the first 'a' tag in the actions section (Deposit function)
      

      // Wait for the list-clients page to load
      // await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
      
      console.log('Redirected to list-clients page.');
    

      
      await page.waitForSelector('.search input#tags'); // Wait for the input element to be ready
      const inputElement = await page.$('.search input#tags');
      await typeWithDelay(inputElement, clientsearch, 100); // Type the client name with a delay
      await new Promise(resolve => setTimeout(resolve, 10000));

     
      if (parseInt(operation_type) === OPERATION_TYPE.deposit){
      console.log('depost');
      const depositButton = await page.$('.actions.text-left a');
      await depositButton.click();
      await page.waitForSelector('#modal-deposit', { visible: true ,timeout: 90000 });
      // Add a 10-second delay
    

      // Fill deposit form fields
      await page.type('#deposite-amount', amount);
      await page.type('#deposit-remark', 'Automation test');
      await page.type('#mpassword', transaction_pin);
      await page.click('#DepositForm button[type="submit"]');
      }
      else if (parseInt(operation_type) === OPERATION_TYPE.withdraw)
      {
     //withdraw
     console.log('withdraw');
      const withdrawtButton = await page.$('.actions.text-left a:nth-child(2)');
      await withdrawtButton.click();
      await page.waitForSelector('#modal-withdraw', { visible: true ,timeout: 90000 });

      // Fill withdraw form fields
      await page.type('#withdraw-amount', amount);
      await page.type('#withdraw-remark', 'Automation test');
      await page.type('#withdraw-mpassword', transaction_pin);

      // Submit the form
      await page.click('#WithdrawForm button[type="submit"]');
      }
      else {
        console.log('nothing');
        // Handle invalid operation_type
        return res.status(400).json({ success: false, error: true, message: 'Invalid operation_type' });
    }
      return res.status(200).json({success:true,error:false,message:'Operation Successfull'});

      console.log('Clicked on Deposit button.');
    
    }
    catch(e){
      console.error(e);
      return res.status(500).json({ success: false, error: true, message: e.message });

    }
  }
    
      // Optionally, you can take a screenshot or perform further actions after login
      // await page.screenshot({ path: 'loggedin.png' });
    
      // Close the browser
      // await browser.close();
    }
    
  // login();

//end



app.get('/bot', (req, res) => {
  // Render the "bot" view when a GET request is made to "/bot"
  res.render('bot');
});
app.get('/', (req, res) => {
  // Render the "bot" view when a GET request is made to "/bot"
  res.render('home');
});
app.post('/bot-start', login);

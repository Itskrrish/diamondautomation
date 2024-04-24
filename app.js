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
//    app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

const getallodds = async (req, res) => {
    try {
        const allodds = await Odd.find();
        res.json({ success: true, error: false, odds: allodds });
    } catch (err) {
        res.json({ success: false, error: true, fail: err });
    }
};
const gettennisodds = async (req, res) => {
    try {
        const allodds = await Tennis.find();
        res.json({ success: true, error: false, odds: allodds });
    } catch (err) {
        res.json({ success: false, error: true, fail: err });
    }
};
// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  

    // Call openbrowser after the server starts
    openbrowser();
    tennisodds();
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

// // mongo connection

// mongoose.connection.on("error", (error) => {
//     console.error("Error connecting to MongoDB:", error);
// });

// mongoose.connection.on("open", () => {
//     console.log("Mongo Db connected");
// });
// mongoose.connect(defaultConnectionString);
// console.log("Mongo Db connected");

//end

app.engine(".hbs", exphbs.engine({ extname: ".hbs", defaultLayout: false }));
app.set("view engine", ".hbs");

// function socket_test() {
//     const test_object = ["test", "res"];
//     io.emit("hello", "world", test_object);
// }

let result_array = [];
let tennis_odds_array = [];
async function tennisodds() {
    //create browser instance
    // const browser = await puppeteer.launch();
 //const browser = await browser.createIncognitoBrowserContext({ 
    const browser = await puppeteer.launch({
      
    });

//    const context = await browser.createIncognitoBrowserContext({});
	console.log('BROWSER LAUNCHED');
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/14.194.102.108 Safari/537.36');

    await page.goto(
        "https://bxawscf.skyexch.art/exchange/member/index.jsp?eventType=2"
    );

    console.log('Set screen size')
    await page.setViewport({ width: 1080, height: 1024 });
    let btnBackInnerHTML;

    setInterval(async () => {
        try {
            await page.waitForSelector("#eventBoard dl", { timeout: 60000 });


            tennis_odds_array = await page.$$eval("#eventBoard dl", (dlTags) => {
                const result = [];

                dlTags.forEach((dlTag) => {
                    const vsNameElement = dlTag.querySelector("dt a#vsName");
                    const vsName = dlTag.querySelector("dt a#vsName").innerText;
                    const vsNameUrl = vsNameElement.getAttribute("href");
                    const backOdds = [
                        ...dlTag.querySelectorAll("a#btnBack"),
                    ].map((aTag) => aTag.innerHTML.replace(/&nbsp;/g, "-"));

                    // Extract lay odds and replace &nbsp; with -
                    const layOdds = [...dlTag.querySelectorAll("a#btnLay")].map(
                        (aTag) => aTag.innerHTML.replace(/&nbsp;/g, "-")
                    );

                    result.push({ vsNameUrl, vsName, backOdds, layOdds });
                });

                return result;
            });

            const suspendedurls = tennis_odds_array.map((item) => item.vsNameUrl);
            try {
                // Find documents to delete
                const docsToDelete = await Tennis.find({
                    vsNameUrl: { $nin: suspendedurls },
                });

                // Delete documents
                const deleteResult = await Tennis.deleteMany({
                    vsNameUrl: { $nin: suspendedurls },
                });
            } catch (error) {
                console.error("Error:", error);
            }

            // Step 1: Extract all vsNameUrls from the data array

            // console.log('Odds Scraped Successfully":', tennis_odds_array);

            //Update if url exist else create
            tennis_odds_array.forEach(async (data) => {
                try {
                    const { vsNameUrl } = data;
                    const result = await Tennis.findOneAndUpdate(
                        { vsNameUrl }, // Search condition
                        { $set: data }, // Update or Insert document
                        { upsert: true, new: true } // Options
                    );
                    // console.log("Updated or inserted document:", result);
                } catch (error) {
                    console.error("Error:", error);
                }
            });
            //end

          
        } catch (error) {
            console.log(error);
        }
    }, 300);

    return tennis_odds_array;
}

//Main Function To scrap odds
async function openbrowser() {
    //create browser instance
    // const browser = await puppeteer.launch();
 //const browser = await browser.createIncognitoBrowserContext({ 
    const browser = await puppeteer.launch({
      
    });

//    const context = await browser.createIncognitoBrowserContext({});
	console.log('BROWSER LAUNCHED');
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/14.194.102.108 Safari/537.36');

    await page.goto(
        "https://bxawscf.skyexch.art/exchange/member/index.jsp?eventType=4"
    );

    console.log('Set screen size')
    await page.setViewport({ width: 1080, height: 1024 });
    let btnBackInnerHTML;

    setInterval(async () => {
        try {
            await page.waitForSelector("#eventBoard dl", { timeout: 60000 });


            result_array = await page.$$eval("#eventBoard dl", (dlTags) => {
                const result = [];

                dlTags.forEach((dlTag) => {
                    const vsNameElement = dlTag.querySelector("dt a#vsName");
                    const vsName = dlTag.querySelector("dt a#vsName").innerText;
                    const vsNameUrl = vsNameElement.getAttribute("href");
                    const backOdds = [
                        ...dlTag.querySelectorAll("a#btnBack"),
                    ].map((aTag) => aTag.innerHTML.replace(/&nbsp;/g, "-"));

                    // Extract lay odds and replace &nbsp; with -
                    const layOdds = [...dlTag.querySelectorAll("a#btnLay")].map(
                        (aTag) => aTag.innerHTML.replace(/&nbsp;/g, "-")
                    );

                    result.push({ vsNameUrl, vsName, backOdds, layOdds });
                });

                return result;
            });

            const suspendedurls = result_array.map((item) => item.vsNameUrl);
            try {
                // Find documents to delete
                const docsToDelete = await Odd.find({
                    vsNameUrl: { $nin: suspendedurls },
                });

                // Delete documents
                const deleteResult = await Odd.deleteMany({
                    vsNameUrl: { $nin: suspendedurls },
                });
            } catch (error) {
                console.error("Error:", error);
            }

            // Step 1: Extract all vsNameUrls from the data array

            // console.log('Odds Scraped Successfully":', result_array);

            //Update if url exist else create
            result_array.forEach(async (data) => {
                try {
                    const { vsNameUrl } = data;
                    const result = await Odd.findOneAndUpdate(
                        { vsNameUrl }, // Search condition
                        { $set: data }, // Update or Insert document
                        { upsert: true, new: true } // Options
                    );
                    // console.log("Updated or inserted document:", result);
                } catch (error) {
                    console.error("Error:", error);
                }
            });
            //end

            //emit oddupdate event if mongoDb  is  updated/inserted successfully via socket.io

            const dbConnection = mongoose.connection;
            dbConnection.once("open", async () => {
                try {
                    const oddsCollection = dbConnection.collection("odds");

                    const allOdds = await oddsCollection.find().toArray();

                    // Emit the oddsUpdate event with all documents
                    io.emit("oddsUpdate", allOdds);

                    // Listen for changes in Odds collection
                } catch (error) {
                    console.error("Error:", error);
                }
            });

            //end
        } catch (error) {
            console.log(error);
        }
    }, 300);

    return result_array;
}

//end
app.get("/get-odds", getallodds);
app.get("/tennis-odds",gettennisodds);
app.get("/scrape", async (req, res) => {
    try {
        const title = await openbrowser();

        res.send(
            `Scraping completed successfully. betting odds are: "${
                result_array || "not found"
            }".`
        );
    } catch (error) {
        // If an error occurs, send a response with the error message
        res.status(500).send("Error occurred while scraping: " + error.message);
    }
});
app.get("/", (req, res) => {
    res.render("main");
});
// app.get('/', (req, res) => {
//     res.render("main");
// });
app.get('/tennis', (req, res) => {
    res.render("Tennis");
});
app.get('/cricket', (req, res) => {
    res.render("cricket");
});



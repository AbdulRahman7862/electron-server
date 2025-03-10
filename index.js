const express = require("express");
const puppeteer = require("puppeteer-extra");
const cors = require("cors");
const cheerio = require("cheerio"); // Used to clean the UI

const app = express();
app.use(express.json());
app.use(cors());

let activeSessions = {};

// 🛠 API to open a website and serve only its UI
app.post("/open", async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ success: false, message: "No URL provided." });
    }

    console.log("Opening:", url);

    try {
        const browser = await puppeteer.launch({
            headless: true, // Run in the background
            args: ["--no-sandbox", "--disable-gpu"]
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1200, height: 800 });
        await page.goto(url, { waitUntil: "domcontentloaded" });

        // Remove unwanted elements like headers, sidebars, and footers
        await page.evaluate(() => {
            document.querySelectorAll("header, nav, footer, aside").forEach(el => el.remove());
        });

        // Get cleaned page content
        const content = await page.content();
        const $ = cheerio.load(content);

        // Remove meta tags, scripts, stylesheets (to prevent external redirections)
        $("head").find("script, link[rel='stylesheet'], meta, iframe").remove();

        const cleanedHTML = $.html();
        
        const sessionId = Math.random().toString(36).substr(2, 9);
        activeSessions[sessionId] = { browser, page, cleanedHTML };

        res.json({ success: true, sessionId, viewUrl: `http://YOUR_SERVER_IP:5000/view/${sessionId}` });
    } catch (error) {
        console.error("Error in Puppeteer:", error);
        res.status(500).json({ success: false, message: "Failed to open page." });
    }
});

// 🛠 API to Serve the Cleaned UI Only
app.get("/view/:sessionId", async (req, res) => {
    const { sessionId } = req.params;
    const session = activeSessions[sessionId];

    if (!session) {
        return res.status(404).json({ success: false, message: "Session not found." });
    }

    res.send(session.cleanedHTML);
});

// Start Express Server
app.listen(5000, () => console.log("Server running on http://YOUR_SERVER_IP:5000"));

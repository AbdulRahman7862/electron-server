// const { app, BrowserWindow } = require('electron');
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors'); // <-- Add this

// const server = express();
// server.use(bodyParser.json());
// server.use(cors()); // <-- Enable CORS for all requests

// let win = null;

// app.whenReady().then(() => {
//     win = new BrowserWindow({
//         width: 1200,
//         height: 800,
//         webPreferences: {
//             nodeIntegration: false,
//             contextIsolation: true,
//         }
//     });

//     win.loadURL("data:text/html,<h1>Waiting for Movie Selection...</h1>");

//     // API to Open Selected Website in Electron
//     server.post('/open', (req, res) => {
//         const { url } = req.body;
//         if (!url) {
//             return res.status(400).json({ success: false, message: "No URL provided." });
//         }

//         console.log("Opening:", url);
//         win.loadURL(url);

//         res.json({ success: true });
//     });

//     server.listen(5000, () => {
//         console.log("Electron Server Running on http://localhost:5000");
//     });
// });

const { app, BrowserWindow } = require('electron');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 

const server = express();
server.use(bodyParser.json());
server.use(cors());

let win = null;

// API to Open Selected Website in Electron
server.post('/open', (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ success: false, message: "No URL provided." });
    }

    console.log("Opening:", url);

    // If window is already closed, create a new one
    if (!win) {
        win = new BrowserWindow({
            width: 1200,
            height: 800,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
            }
        });

        win.on('closed', () => {
            win = null; // Reset the reference when closed, but keep the app running
        });
    }

    win.loadURL(url);
    win.show(); // Ensure the window is shown

    res.json({ success: true });
});

// Prevent Electron from quitting when the window is closed
app.on('window-all-closed', (event) => {
    event.preventDefault(); // Prevent full app quit
});

// Start Express Server
app.whenReady().then(() => {
    server.listen(5000, () => {
        console.log("Electron Server Running on http://localhost:5000");
    });
});

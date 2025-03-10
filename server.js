// const { app, BrowserWindow } = require('electron');
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors'); 

// const server = express();
// server.use(bodyParser.json());
// server.use(cors());

// let win = null;

// // API to Open Selected Website in Electron
// server.post('/open', (req, res) => {
//     const { url } = req.body;
//     if (!url) {
//         return res.status(400).json({ success: false, message: "No URL provided." });
//     }

//     console.log("Opening:", url);

//     // If window is already closed, create a new one
//     if (!win) {
//         win = new BrowserWindow({
//             width: 1200,
//             height: 800,
//             webPreferences: {
//                 nodeIntegration: false,
//                 contextIsolation: true,
//             }
//         });

//         win.on('closed', () => {
//             win = null; // Reset the reference when closed, but keep the app running
//         });
//     }

//     win.loadURL(url);
//     win.show(); // Ensure the window is shown

//     res.json({ success: true });
// });

// // Prevent Electron from quitting when the window is closed
// app.on('window-all-closed', (event) => {
//     event.preventDefault(); // Prevent full app quit
// });

// // Start Express Server
// app.whenReady().then(() => {
//     server.listen(5000, () => {
//         console.log("Electron Server Running on http://localhost:5000");
//     });
// });


const { app, BrowserWindow } = require('electron');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');

// Start virtual display for headless server
exec('Xvfb :99 -screen 0 1280x800x16 &', (err) => {
    if (err) {
        console.error("Failed to start Xvfb:", err);
    } else {
        console.log("Xvfb started successfully!");
        process.env.DISPLAY = ":99";
    }
});

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
            win = null;
        });
    }

    win.loadURL(url);
    win.show();

    res.json({ success: true });
});

// Prevent Electron from quitting when the window is closed
app.on('window-all-closed', (event) => {
    event.preventDefault();
});

// Start Express Server
app.whenReady().then(() => {
    server.listen(5000, () => {
        console.log("Electron Server Running on http://0.0.0.0:5000");
    });
});

const { app, BrowserWindow } = require('electron');

let win;

app.whenReady().then(() => {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    // Load the site securely (URL is NEVER exposed)
    win.loadURL("https://www.vidbinge.com");

    // Prevent DevTools access (optional)
    win.webContents.on("devtools-opened", () => {
        win.webContents.closeDevTools();
    });
});

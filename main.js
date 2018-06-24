const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

try {
    require('electron-reloader')(module);
} catch (err) {}

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 400,
        height: 660,
        icon: path.join(__dirname, "build/icon.png"),
        resizable: false,
        show: false
    });
    win.setMenu(null);
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    // win.webContents.openDevTools()
    win.once('ready-to-show', () => {
        win.show();
    });
    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});

const { app, BrowserWindow, ipcMain, Notification } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  ipcMain.handle("ping", () => "pong");
  win.loadFile("index.html");
  win.once("ready-to-show", () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});

autoUpdater.on("update-available", () => {
  win.webContents.send("update_available");
});

autoUpdater.on("update-downloaded", () => {
  win.webContents.send("update_downloaded");
});

const { contextBridge, ipcRenderer } = require("electron");

// contextBridge.exposeInMainWorld("versions", {
//   node: () => process.versions.node,
//   chrome: () => process.versions.chrome,
//   electron: () => process.versions.electron,
//   ping: () => ipcRenderer.invoke("ping"),
//   // we can also expose variables, not just functions
// });
window.addEventListener("DOMContentLoaded", async () => {
  const notification = document.getElementById("notification");
  const message = document.getElementById("message");
  const restartButton = document.getElementById("restart-button");

  ipcRenderer.on("update_available", () => {
    ipcRenderer.removeAllListeners("update_available");
    message.innerText = "A new update is available. Downloading now...";
    notification.classList.remove("hidden");
  });

  ipcRenderer.on("update_downloaded", () => {
    ipcRenderer.removeAllListeners("update_downloaded");
    message.innerText =
      "Update Downloaded. It will be installed on restart. Restart now?";
    restartButton.classList.remove("hidden");
    notification.classList.remove("hidden");
  });
});
contextBridge.exposeInMainWorld("api", {
  closeNotification: () => {
    notification.classList.add("hidden");
  },
  restartApp: () => {
    ipcRenderer.send("restart_app");
  },
});

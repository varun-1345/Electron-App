// main.js

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const { SerialPort } = require("serialport");

let mainWindow;

async function listSerialPorts() {
  try {
    const ports = await SerialPort.list();
    return ports.map((port) => port.path);
  } catch (error) {
    console.error("Error listing serial ports:", error);
    mainWindow.webContents.send("serial-port-error", error.message);
  }
}

function connectToPort(portPath) {
  const port = new SerialPort(portPath, { baudRate: 9600 });
  port.on("data", (data) => {
    console.log("Data received:", data.toString());
    mainWindow.webContents.send("serial-port-data", data.toString());
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: "#ccc",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  mainWindow.on("closed", function () {
    mainWindow = null;
  });

  ipcMain.on("list-serial-ports", async (event) => {
    const ports = await listSerialPorts();
    event.sender.send("serial-ports-listed", ports);
  });

  ipcMain.on("connect-to-port", (event, portPath) => {
    connectToPort(portPath);
  });
}

app.on("ready", createWindow);

// ... rest of your app code

/*
const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: "#ccc",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
}); */

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});

// const { app, BrowserWindow } = require("electron");
// const path = require("path");
// const url = require("url");

// // Keep a global reference of the window object, if you don't, the window will
// // be closed automatically when the JavaScript object is garbage collected.
// let mainWindow;

// function createWindow() {
//   // Create the browser window.
//   mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     backgroundColor: "#ccc",
//     webPreferences: {
//       nodeIntegration: true, // to allow require
//       contextIsolation: false, // allow use with Electron 12+
//       preload: path.join(__dirname, "preload.js"),
//     },
//   });

//   // and load the index.html of the app.
//   mainWindow.loadURL(
//     url.format({
//       pathname: path.join(__dirname, "index.html"),
//       protocol: "file:",
//       slashes: true,
//     })
//   );

//   // Open the DevTools.
//   // mainWindow.webContents.openDevTools()

//   // Emitted when the window is closed.
//   mainWindow.on("closed", function () {
//     // Dereference the window object, usually you would store windows
//     // in an array if your app supports multi windows, this is the time
//     // when you should delete the corresponding element.
//     mainWindow = null;
//   });
// }

// // This method will be called when Electron has finished
// // initialization and is ready to create browser windows.
// // Some APIs can only be used after this event occurs.
// app.on("ready", createWindow);

// // Quit when all windows are closed.
// app.on("window-all-closed", function () {
//   // On OS X it is common for applications and their menu bar
//   // to stay active until the user quits explicitly with Cmd + Q
//   app.quit();
// });

// app.on("activate", function () {
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (mainWindow === null) {
//     createWindow();
//   }
// });

// // In this file you can include the rest of your app's specific main process
// // code. You can also put them in separate files and require them here.

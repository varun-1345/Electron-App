const { ipcRenderer } = require("electron");

function listSerialPorts() {
  ipcRenderer.send("list-serial-ports");
}

function connectToPort(portPath) {
  ipcRenderer.send("connect-to-port", portPath);
}

// Handle incoming messages from the main process (e.g., displaying errors or received data)
ipcRenderer.on("serial-ports-listed", (event, ports) => {
  // Option 1: Simple logging (for debugging)
  console.log("Available serial ports:", ports);

  // Option 2: Update UI with port list (example using a dropdown)
  const portSelect = document.getElementById("port-select");
  if (portSelect) {
    ports.forEach((portPath) => {
      const option = document.createElement("option");
      option.value = portPath;
      option.text = portPath;
      portSelect.appendChild(option);
    });
  }
});

// ipcRenderer.on("serial-ports-listed", (event, ports) => {
//   // Update UI with available ports (e.g., populate a dropdown list)
//   console.log("Available serial ports:", ports);
// });

ipcRenderer.on("serial-port-error", (event, errorMessage) => {
  console.error("Serial port error:", errorMessage);
  document.getElementById("error").innerText = errorMessage;
});

// ipcRenderer.on("serial-port-error", (event, errorMessage) => {
//   console.error("Serial port error:", errorMessage);
//   // Display error message in the UI
// });

ipcRenderer.on("serial-port-data", (event, data) => {
  console.log("Received data:", data);
  // Process received data in the renderer process
});

// Call listSerialPorts() when needed in your renderer process logic (e.g., on a button click)
listSerialPorts();

// // renderer.js

// const { SerialPort } = require("serialport");

// async function listSerialPorts() {
//   try {
//     const ports = await SerialPort.list();
//     return ports.map((port) => port.path);
//   } catch (error) {
//     throw new Error("Error listing serial ports: " + error.message);
//   }
// }

// function connectToPort(portPath) {
//   const port = new SerialPort(portPath, { baudRate: 9600 });
//   port.on("data", (data) => {
//     console.log("Data received:", data.toString());
//     // Process incoming data here
//   });
// }

// async function initSerialPort() {
//   try {
//     const portPaths = await listSerialPorts();
//     if (portPaths.length === 0) {
//       throw new Error("No serial ports found.");
//     }
//     connectToPort(portPaths[0]);
//   } catch (error) {
//     document.getElementById("error").innerText = error.message;
//     console.error(error);
//   }
// }

// initSerialPort();

// // This file is required by the index.html file and will
// // be executed in the renderer process for that window.
// // All of the Node.js APIs are available in this process.

// const { SerialPort } = require("serialport");

// // Function to list available serial ports and extract paths
// async function listSerialPorts() {
//   const ports = await SerialPort.list();
//   const portPaths = ports.map((port) => port.path); // Extracting only the path
//   console.log("Port paths:", portPaths); // Log the extracted port paths
//   return portPaths;
// }
// // async function listSerialPorts() {
// //   const ports = await SerialPort.list();
// //   return ports.map((port) => port.path); // Extracting only the path
// // }

// // Function to connect to a specific serial port and read data
// function connectToPort(portPath) {
//   const port = new SerialPort(portPath, { baudRate: 9600 }); // Specify baud rate as needed
//   port.on("data", (data) => {
//     console.log("Data received:", data.toString());
//     // Process incoming data here
//   });
// }

// // Function to initialize serial port connection
// async function initSerialPort() {
//   try {
//     const portPaths = await listSerialPorts();
//     if (portPaths.length === 0) {
//       document.getElementById("error").innerText = "No serial ports found.";
//       // console.log("No serial ports found.");
//       return;
//     }
//     // For simplicity, connect to the first found port. You can modify this logic as needed.
//     connectToPort(portPaths[0]);
//   } catch (error) {
//     document.getElementById("error").innerText =
//       "Error listing serial ports: " + error.message; // Display error message if error occurs
//     console.error("Error listing serial ports:", error);
//     // console.error("Error listing serial ports:", error);
//   }
// }

// // Call the function to initialize serial port connection
// initSerialPort();

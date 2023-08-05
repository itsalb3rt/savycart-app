// This file is use to change the server url in capacitor.config.json to the local ip address 
// to allow the app to connect to the server running on the local simulator
const fs = require('fs');
const fileName = './capacitor.config.json';
const file = require(fileName);

var ip = require("ip");

file.server.url = `http://${ip.address()}:8081`

fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
  if (err) return console.log(err);
});
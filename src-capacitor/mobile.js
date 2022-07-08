const fs = require('fs');
const fileName = './capacitor.config.json';
const file = require(fileName);

var ip = require("ip");

file.server.url = `http://${ip.address()}:8081`

fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
  if (err) return console.log(err);
});
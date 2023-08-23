// This file only remove the url from the server object into the capacitor config file
const fs = require('fs');
const fileName = './capacitor.config.json';
const file = require(fileName);

delete file.server.url

fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
  if (err) return console.log(err);
});
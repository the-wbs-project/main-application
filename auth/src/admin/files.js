import * as fs from "fs";

export function readFile(filePath) {
  return new Promise(function (resolve, reject) {
    if (!fs.existsSync(filePath)) {
      resolve(undefined);
      return;
    }
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

export function writeFile(filePath, content) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(filePath, content, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function generateId() {
    const now = new Date();
    const timestamp = now.getTime().toString(); // Get current timestamp as string
    const id = timestamp.substr(-6); // Get last 6 characters of timestamp
    return parseInt(id);
  }

  
function writeDataToDb(postDBPath,newData){
  return new Promise((resolve, reject) => {
    
  fs.writeFile(postDBPath, JSON.stringify({ data: newData }), "utf8", (err) => {
    if (err) {
      reject(err)
    } else {
      resolve("Data has been written to file successfully.");
    }
  });

  })
}

  module.exports = {generateId,writeDataToDb}
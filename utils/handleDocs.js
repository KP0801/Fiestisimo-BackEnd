const csv = require("csvdata");

const getData=async(csvPath)=>{
 
    const data = await csv.load(filePath=csvPath,{delimiter:",",encoding: 'utf8'})
    return data
}
module.exports = {
    getData
};

const fs = require('fs');
const csv = require('csv-parser');

const inputFile = 'input_countries.csv';
const canadaFile = 'canada.txt';
const usaFile = 'usa.txt';

function deleteFile(file) {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log(`${file} deleted`);
  }
}
function filterData() {
  
  const canadaStream = fs.createWriteStream(canadaFile);
  const usaStream = fs.createWriteStream(usaFile);

  const header = 'country,year,population\n';
  canadaStream.write(header);
  usaStream.write(header);

  fs.createReadStream(inputFile)
    .pipe(csv())
    .on('data', (row) => {
      if (row.country.toLowerCase() === 'canada') {
        canadaStream.write(`${row.country},${row.year},${row.population}\n`);
      } else if (row.country.toLowerCase() === 'united states') {
        usaStream.write(`${row.country},${row.year},${row.population}\n`);
      }
    })
    .on('end', () => {
      console.log('CSV file processed successfully.');
      canadaStream.end();
      usaStream.end();
    })
    .on('error', (err) => {
      console.error('Error reading the CSV file:', err.message);
    });
}

deleteFile(canadaFile);
deleteFile(usaFile);
filterData();


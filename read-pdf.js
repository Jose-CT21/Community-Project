import fs from 'fs';
import pdfParse from 'pdf-parse';

const checkPDF = async () => {
  try {
    const dataBuffer = fs.readFileSync('C:/Users/Jose Castro/Desktop/Work/Community Project/Airbnb app.pdf');
    const data = await pdfParse(dataBuffer);
    console.log(data.text);
  } catch (err) {
    console.error('Error reading PDF:', err);
  }
};

checkPDF();

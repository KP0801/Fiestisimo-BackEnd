const pdfkit = require('pdfkit');
const fs = require('fs');

async function generatePDF() {
    const doc = new pdfkit();
    const writeStream = fs.createWriteStream(`./public/docs/documento.pdf`);

    doc.pipe(writeStream);
    doc.fontSize(20).text('Documento PDF');
    doc.moveDown();
    doc.fontSize(20).text('Calificaciones');
    doc.end();

    writeStream.on('finish', () => {
        console.log('Archivo PDF creado correctamente');
    });

    writeStream.on('error', (err) => {
        console.error(err);
    });
}

module.exports = generatePDF;
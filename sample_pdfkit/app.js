/**
 * Module dependencies.
 */


var PDFDocument = require('pdfkit');
var doc = new PDFDocument;

doc.font('Courier');
doc.fontSize(10);
doc.text('Hello world!',0,50);

doc.registerFont('jp', './migu-1p-regular.ttf', 'jp');
doc.font('jp');
doc.text('しふとじす!', 0, 100);
doc.text('日本語', 0, 150);

doc.text('縦', 0, 200);
doc.text('書', 0, 212);
doc.text('き', 0, 224);

//doc.moveDown(0.5);

doc.write('output_origin.pdf');
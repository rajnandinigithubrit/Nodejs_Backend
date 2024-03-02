const mongoose = require('mongoose');

const PdfDetailsSchema = new mongoose.Schema({
    pdf:String,
    title:String
})

module.exports = mongoose.model('PdfDetails',PdfDetailsSchema)
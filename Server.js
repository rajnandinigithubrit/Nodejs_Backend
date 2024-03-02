const mongoose = require('mongoose')
const express = require('express')
require('./db/config')
const Users = require('./db/Users')
const Product = require('./db/Product')
const pdf = require('./db/pdfDetails')
const PdfSchema = mongoose.model("PdfDetails")
const cors = require("cors")
const app = express()
const multer = require('multer')
app.use("/files", express.static("files"))
// const { default: mongoose } = require('mongoose')


app.use(express.json());
app.use(cors());


app.get('/get-files', async (req, res) => {
    try {
        PdfSchema.find({}).then((data) => {
            res.send({ status: "ok", data: data })
        })
    }
    catch (error) {
        res.send(error)
    }
})
// const connectDB = async () =>{
//     mongoose.connect('mongodb://localhost:27017/e-comm');
//     const productSchema = new mongoose.Schema({});
//     const product = mongoose.model('users',productSchema);
//     const data = await product.find();
//     console.log("data",data)
// }

// connectDB();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './files')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname)
    }
})

const upload = multer({ storage: storage })

app.post("/upload-files", upload.single("file"), async (req, res) => {
    console.log(req.file);
    const title = req.body.title;
    const fileName = req.file.filename
    try {
        await PdfSchema.create({ title: title, pdf: fileName })
        res.send({ status: "ok" })
    }
    catch (error) {
        console.log(error)
    }
})


app.post('/register', async (req, res) => {
    let user = new Users(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    console.warn(result)
    res.send(result)
})

app.post('/login', async (req, res) => {
    if (req.body.email && req.body.password) {
        let user = await Users.findOne(req.body).select("-password")
        if (user) {
            res.send(user)
        } else {
            res.send("user not found")
        }
    }
    else {
        res.send("user not found")
    }
})

app.post('/add-product', async (req, res) => {
    let product = new Product(req.body)
    let result = await product.save();
    console.log(result)
    res.send(result);
})

app.get('/products', async (req, res) => {
    let Products = await Product.find()
    if (Products.length > 0) {
        res.send(Products)
    }
    else {
        response.send({ result: "no data found" })
    }

})

app.delete('/product/:id', async (req, res) => {
    const result = await Product.deleteOne({ _id: req.params.id })
    res.send(result)
    // res.send("hiii")
})

app.get('/product/:id', async (req, res) => {
    let result = await Product.findOne({ _id: req.params.id })
    if (result) {
        res.send(result)
    }
    else {
        res.send({ result: "No records found" })
    }
})

app.put('/product/:id', async (req, res) => {
    let result = await Product.updateOne(
        {
            _id: req.params.id
        },
        {
            $set: req.body
        }
    )
    res.send(result)
})

// app.get('/search/:key', async(req,res) =>{
//     let result = await Product.find({
//         "$or":[
//             {name:{$regex:req.params.key}},
//             {comapny:{$regex:req.params.key}},
//             {category:{$regex:req.params.key}}
//         ]
//     })
//     res.send(result);
// })


app.get('/search/:key', async (req, res) => {
    try {
        let result = await Product.find({
            $or: [
                { name: { $regex: req.params.key, $options: 'i' } }, // case-insensitive search
                { company: { $regex: req.params.key, $options: 'i' } },
                { category: { $regex: req.params.key, $options: 'i' } },
            ],
        });
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(8080);

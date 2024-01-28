
const express = require('express')
require('./db/config')
const Users = require('./db/Users')
const Product = require('./db/Product')
const cors = require("cors")
const app = express()

app.use(express.json());
app.use(cors());
// const connectDB = async () =>{
//     mongoose.connect('mongodb://localhost:27017/e-comm');
//     const productSchema = new mongoose.Schema({});
//     const product = mongoose.model('users',productSchema);
//     const data = await product.find();
//     console.log("data",data)
// }

// connectDB();
app.post('/register',async (req,res)=>{
    let user = new Users(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    console.warn(result)
res.send(result)
})

app.post('/login',async(req,res)=>{
    if(req.body.email && req.body.password){
    let user = await Users.findOne(req.body).select("-password")
    if(user){
    res.send(user)
}else{
res.send("user not found")
}
}
else{
    res.send("user not found")
}
})

app.post('/add-product',async(req,res) =>{
    let product = new Product(req.body)
    let result = await product.save();
    console.log(result)
    res.send(result);
})

app.get('/products',async(req,res) =>{
    let Products = await Product.find()
    if(Products.length > 0){
        res.send(Products)
    }
    else{
        response.send({result:"no data found"})
    }

})

app.delete('/product/:id',async(req,res) =>{
    const result = await Product.deleteOne({_id:req.params.id})
     res.send(result)
    // res.send("hiii")
})

app.get('/product/:id',async(req,res) =>{
    let result = await Product.findOne({_id:req.params.id})
    if(result){
        res.send(result)
    }
    else{
        res.send({result:"No records found"})
    }
})

app.put('/product/:id',async(req,res) =>{
    let result = await Product.updateOne(
        {
            _id:req.params.id
        },
        {
            $set:req.body
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

//connection of database with node.js

const mongoose = require("mongoose");

const DB = "mongodb://admin:V%40ishnavi0903@ac-yikoavs-shard-00-00.ncrcoqf.mongodb.net:27017,ac-yikoavs-shard-00-01.ncrcoqf.mongodb.net:27017,ac-yikoavs-shard-00-02.ncrcoqf.mongodb.net:27017/?ssl=true&replicaSet=atlas-cmginf-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster1"
mongoose.connect(DB , {
    useUnifiedTopology : true,
    useNewUrlParser : true
}).then(()=>console.log('Database connected')).catch((err)=>{
    console.log(err);
})
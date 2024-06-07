// starting server of our web app

const express = require("express");          //importing express
const app = express();
require("./db/conn");
const router = require("./routes/router")
const cookieParser = require("cookie-parser");
const cors = require("cors");

const port = 8009;

// app.get("/" , (req,res)=>{
//     res.status(201).json("server created")
// });

app.use(express.json());   //to pass data in json format from frontend to backend
app.use(cookieParser());
app.use(cors());
app.use(router);

app.listen(port , ()=>{
    console.log(`server started at port no: ${port}`);
})



// To start server :-  node .\app.js
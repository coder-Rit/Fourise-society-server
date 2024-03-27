const express = require('express')
const error = require('./middleware/error')
const connectTODatabase = require('./config/dataBase')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors  = require("cors")
const app = express()
const path = require("path");
const multer = require("multer");

if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "config/config.env" });
  }

app.use(cors({
  credentials: true,
  origin:"http://127.0.0.1:5500"
  
}))
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}))

 

//connection to the data base 
connectTODatabase()


 
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      // Uploads is the Upload_folder_name
      cb(null, "uploads");
  },
  filename: function (req, file, cb) {
      cb(null, req.params.attName+ ".jpg");
  },
});

// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize = 1 * 1000 * 1000;

const uploadRemand  = (filename)=>{
  return multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb) {
        // Set the filetypes, it is optional
        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);
  
        var extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );
  
        if (mimetype && extname) {
            return cb(null, true);
        }
  
        cb(
            "Error: File upload only supports the " +
                "following filetypes - " +
                filetypes
        );
    },
  
    // mypic is the name of file attribute
  }).single(filename);
}



 

app.post("/uploadProfilePicture/:attName", function (req, res, next) {
  // Error MiddleWare for multer file upload, so if any
  // error occurs, the image would not be uploaded!
  const upload = uploadRemand(req.params.attName)
  upload(req, res, function (err) {
      if (err) {
          // ERROR occurred (here it can be occurred due
          // to uploading image of size greater than
          // 1MB or uploading different file type)
          res.send(err);
      } else {
          // SUCCESS, image successfully uploaded
          res.send("Success, Image uploaded!");
      }
  });
});



const userRouter = require('./router/userRouter') 
 

app.use("/api/v1", userRouter)
 

 
 
 
 app.use(error)
module.exports = app

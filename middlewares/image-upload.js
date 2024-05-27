// Importing the multer library for handling multipart/form-data, which is primarily used for uploading files.
const multer = require("multer");
// Importing the uuid library to generate unique identifiers.
const uuid = require("uuid").v4;

// Configuring multer() to handle file uploads.
// The storage option is set to use disk storage, which means the files will be stored on the server's disk.
// The filename option is a function that generates a unique filename for each uploaded file.
// It uses the uuid library to generate a unique identifier and appends it to the original file name.

const upload = multer({
  storage: multer.diskStorage({
    destination: "product-data/images", // The folder where the uploaded images will be stored.
    filename: function (req, file, cb) {
      
      // The uuid() function generates a unique string, which is concatenated with the original file name.
      cb(null, uuid() + "-" + file.originalname); // first parameter is error, second is filename.
    },
  }),
});

// Creating a middleware function that uses the configured multer instance to handle a single file upload.
// The 'image' parameter specifies the name of the form field that contains the file to be uploaded.
const configuredMulterMiddleware = upload.single("image");

// Exporting the middleware function so it can be used in other parts of the application.
module.exports = configuredMulterMiddleware;



// wrt multer package and its use within the image-upload.js file, the pattern of using a callback function (cb)
//  to handle the result of an asynchronous operation, specifically the generation of a filename, is standardized.

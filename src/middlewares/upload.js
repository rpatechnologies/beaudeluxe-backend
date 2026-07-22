var multer = require('multer');
const path = require("path")
const fs   = require("fs")

module.exports.files = {
    storage: function(path){
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, path)
            },
            filename: function(req, file, cb) {
                if(file.originalname.length>6)
                    cb(null, file.fieldname + '-' + Date.now() + file.originalname.substr(file.originalname.length-6,file.originalname.length));
                else
                    cb(null, file.fieldname + '-' + Date.now() + file.originalname);
            }
        })
        return storage;
    },
    allowedFiles:function(req, file, cb) {
        if (!file.originalname.match(/\.(pdf|doc|txt|jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
            req.fileValidationError = 'Only pdf|doc|txt|jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF file type are allowed!';
            return cb(new Error('Only pdf|doc|txt|jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF file type  are allowed!'), false);
        }
        cb(null, true);
    },
    brokenImage: async function (req, res, next) {
        const brokenImagePath = path.resolve(__dirname, "..", "public", "images", "broken-image.jpg")
        if (fs.existsSync(brokenImagePath)) {
            res.locals.brokenImage = siteUrl + "/img/broken-image.jpg";
        }
        next();
    }
}
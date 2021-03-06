// require('dotenv').config();
import express from "express";
import initWebRoutes from "./src/routes/web";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import session from "express-session";
import connectFlash from "connect-flash";
import passport from "passport";
import multer from "multer";
import dbCon from "./src/configs/DBConnection";
const cors = require('cors');
const path = require('path');

let app = express();

//cors
var corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

//use cookie parser
app.use(cookieParser('secret'));

//config session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 86400000 1 day
    }
}));

// Enable body parser post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Enable flash message
app.use(connectFlash());

//Config passport middleware
app.use(passport.initialize());
app.use(passport.session());

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    }
})

app.use('/profile', express.static('upload/images'));
app.post("/api/uploadprofile", upload.single('image'), (req, res) => {
    let id = req.body.id;
    let image = `https://classibackend.herokuapp.com/profile/${req.file.filename}`;

    if (!id) {
        res.status(400).send({ error: true, message: 'Please give your id to upload your profile picture' });
    } else {
        dbCon.query("UPDATE account SET image = ? WHERE id = ?", [image, id], (error, results, fields) => {
            if (error) throw error;

            res.status(200).send({
                error: false,
                account_id: id,
                profile_url: image
            })
        })
        console.log(image);
    }
})

app.use('/classpic', express.static('upload/images'));
app.post("/api/uploadclassprofile", upload.single('image'), (req, res) => {
    let id = req.body.id;
    let image = `https://classibackend.herokuapp.com/classpic/${req.file.filename}`;

    if (!id) {
        res.status(400).send({ error: true, message: 'Please provide class id to upload your profile picture' });
    } else {
        dbCon.query("UPDATE class SET class_pic = ? WHERE id = ?", [image, id], (error, results, fields) => {
            if (error) throw error;

            res.status(200).send({
                error: false,
                class_id: id,
                profile_url: image
            })
        })
        console.log(image);
    }
})

app.use('/postpic', express.static('upload/images'));
app.post("/api/uploadpostpic", upload.single('image'), (req, res) => {
    let id = req.body.id;
    let image = `https://classibackend.herokuapp.com/postpic/${req.file.filename}`;

    if (!id) {
        res.status(400).send({ error: true, message: 'Please give POST ID to upload your picture' });
    } else {
        dbCon.query("UPDATE post SET pic_url = ? WHERE id = ?", [image, id], (error, results, fields) => {
            if (error) throw error;

            res.status(200).send({
                error: false,
                post_id: id,
                profile_url: image
            })
        })
        console.log(image);
    }
})

app.use('/commentpic', express.static('upload/images'));
app.post("/api/uploadcommentpic", upload.single('image'), (req, res) => {
    let id = req.body.id;
    let image = `https://classibackend.herokuapp.com/commentpic/${req.file.filename}`;

    if (!id) {
        res.status(400).send({ error: true, message: 'Please give COMMENT ID to upload your picture' });
    } else {
        dbCon.query("UPDATE comment SET pic_url = ? WHERE id = ?", [image, id], (error, results, fields) => {
            if (error) throw error;

            res.status(200).send({
                error: false,
                comment_id: id,
                profile_url: image
            })
        })
        console.log(image);
    }
})

function errHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        res.json({
            success: 0,
            message: err.message
        })
    }
}
app.use(errHandler);

// init all web routes
initWebRoutes(app);

let PORT = process.env.PORT || 3000;
// app.listen(PORT, () => 
// {console.log(`Building a login system with NodeJS is running on port ${PORT}!`);
// };

app.listen(PORT || 5000 , "0.0.0.0",() => {
    console.log(`Server running on port ${PORT}`);
});

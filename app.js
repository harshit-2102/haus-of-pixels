const express = require('express');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const bodyParser = require('body-parser');
// const exifParser = require('exif-parser');

const app = express();

// const admin = require('firebase-admin');
// const credentials = require('./sdk-firebase.json');

// admin.initializeApp({
//     credential: admin.credential.cert(credentials),
//     databaseURL: 'https://haus-of-pixels-default-rtdb.firebaseio.com/',
// });


// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")))
app.use("/bootstrap", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")))
app.use("/jquery", express.static(path.join(__dirname, "node_modules/jquery/dist")))
app.use(bodyParser.urlencoded({ extended: true }));

// view engine
app.set('view engine', 'ejs');

// const storage = admin.storage();
// const bucketName = 'haus-of-pixels.appspot.com';
// const bucket = storage.bucket(bucketName);

app.all('*', checkUser);
app.use(authRoutes);
app.use(blogRoutes);



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`)
})
const express = require('express');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const bodyParser = require('body-parser');

const app = express();

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

app.all('*', checkUser);
app.use(authRoutes);
app.use(blogRoutes);



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`)
})
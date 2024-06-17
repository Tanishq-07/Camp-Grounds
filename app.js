
if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}


const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const Session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStretagy = require('passport-local');
const User=require('./models/user');
const mongoSanitize=require('express-mongo-sanitize');
const helmet=require('helmet');

const userRoutes=require('./Routes/user');
const campgroundRoutes=require('./Routes/campgrounds');
const reviewRoutes=require('./Routes/review');
const MongoDBstore=require('connect-mongo');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl);
// mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database Connected");
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.engine('ejs', ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'Public')));
app.use(flash());

const store = MongoDBstore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SECRET
    }
});

const sessionConfig={
    store,
    name: 'Session',
    secret: process.env.SECRET,
    resave : false,
    saveUninitialized :true,
    cookie : {
        httpOnly : true,
        // secure :true,
        expires : Date.now+(1000*60*60*24*7),
        maxAge : 1000*60*60*24*7
    }
}
app.use(Session(sessionConfig));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStretagy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(mongoSanitize(
    {
        replaceWith : '_'
    }
));

// app.use(helmet({contentSecurityPolicy : false}));

app.use(helmet());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/drzhwtg2x/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use((req,res,next)=>{
   
    res.locals.currentUser = req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})
app.use('/',userRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);
app.use('/',(req,res)=>{
    res.render('home');
})

// app.all('*',(req,res,next)=>{
//     next(new ExpressError('Oh boy something went wrong',404));
// })

app.use((err, req, res, next) => {
    const {message ,statusCode=500} = err;
    if(!message) err.message="Something unusual happened";
    res.status(statusCode).render('error',{err});
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
})
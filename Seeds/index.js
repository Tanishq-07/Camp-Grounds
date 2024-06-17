const cities=require('./cities');
const {descriptors,places}=require('./seedHelpers');

const mongoose=require('mongoose');
const Campground=require('../models/campground');

const dbUrl ='mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl);

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error: "));
db.once("open",()=>{
    console.log("Database Connected");
})

const sample=array=>Math.floor(Math.random()*array.length);

const seeds=async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<100;i++){
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp=new Campground({
            title: `${descriptors[sample(descriptors)]} ${places[sample(places)]}`,
            geometry: { type: 'Point', coordinates: [
                  cities[random1000].longitude,
                  cities[random1000].latitude
             ] },
            location : `${cities[random1000].city},${cities[random1000].state}`,
            author : '66700ebde27ba9d4123479f8',
            description : 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nesciunt saepe aperiam quo nostrum error earum, excepturi soluta dolorum mollitia alias facilis, illum corporis tempore nulla, a ratione eius sint nisi?',
            price,
            images : [
                {
                  url: 'https://res.cloudinary.com/drzhwtg2x/image/upload/v1718190728/YelpCamp/fcnysuyqa0bkj2iaeywo.jpg',
                  filename: 'YelpCamp/hkmnsrp5iavoqrbm73wy'
                },
                {
                  url: 'https://res.cloudinary.com/drzhwtg2x/image/upload/v1718190728/YelpCamp/nlbzuo8k4ytct0tmyldn.jpg',
                  filename: 'YelpCamp/wk07y49jdxcwy3pkfq8n'
                }
              ]
        })
        await camp.save();
    }
}
seeds().then(()=>{
    mongoose.connection.close();
})

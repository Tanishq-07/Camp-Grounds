const mongoose=require('mongoose');
const Review = require('./review');
const User = require('./user');

const Schema=mongoose.Schema;

const imageSchema=new Schema({
    url:String,
    filename : String
})

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
})

const opts={toJSON : {virtuals : true}};

const campgroundSchema=new Schema({
    title:String,
    price:Number,
    description:String,
    geometry : {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    },
    location:String,
    images : [imageSchema],
    author : {
        type : Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews : [
        {
        type : Schema.Types.ObjectId,
        ref : 'Review'
        }
    ]
},opts);

campgroundSchema.virtual('properties.PopUpMarker').get(function(){
    return  `<strong><a href="/campgrounds/${this.id}">${this.title}</a></strong>`;
})

campgroundSchema.post('findOneAndDelete',async function(data){
    if(data){
        await Review.deleteMany({_id : {$in : data.reviews}})
    }
})

module.exports=mongoose.model('Campground',campgroundSchema);
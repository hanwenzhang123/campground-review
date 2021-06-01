const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'       //the review model
        }
    ]
});

CampgroundSchema.post('findOneAndDelete', async function(doc) {     //delete associated reviews, all the reviews associated with the selected camp
    if(doc){
        await Review.remove({
            _id: {
                $in: doc.reviews            //the id field is in the document that we delete
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);
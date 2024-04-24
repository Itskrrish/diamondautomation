import mongoose from "mongoose";

const { Schema } = mongoose;

const TennisSchema = new Schema({
    backOdds: [
        {
            type: String, // Assuming backOdds contains numbers
        },
    ],
    layOdds: [
        {
            type: String, // Assuming layOdds contains numbers
        },
    ],
    vsName: {
        type: String,
    },
    vsNameUrl: {
        type: String,
    },
});

TennisSchema.virtual("formattedBackOdds").get(function () {
    // Replace '&nbsp;' with '-'
    return this.backOdds.map((tennis) => tennis.replace(/&nbsp;/g, "-"));
});

// Set a setter to handle the transformation before saving to the database
TennisSchema.path("backOdds").set(function (backOdds) {
    return backOdds.map((tennis) => tennis.replace(/&nbsp;/g, "-"));
});

const Tennis = mongoose.model("Tennis", TennisSchema);
export default Tennis;

import mongoose from "mongoose";
const { Schema } = mongoose;

const OddSchema = new mongoose.Schema({
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

OddSchema.virtual("formattedBackOdds").get(function () {
    // Replace '&nbsp;' with '-'
    return this.backOdds.map((odd) => odd.replace(/&nbsp;/g, "-"));
});

// Set a setter to handle the transformation before saving to the database
OddSchema.path("backOdds").set(function (backOdds) {
    return backOdds.map((odd) => odd.replace(/&nbsp;/g, "-"));
});
const Odd = mongoose.model("Odd", OddSchema);
export default Odd;

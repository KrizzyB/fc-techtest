const DB = require("chassis-database");
const mongoose = DB.getMongoose();

const originatingAccount = mongoose.Schema({
    name: {
        type: String,
        index: true,
        unique: true
    },
    number: {
        type: String,
        index: true
    },
    sortCode: {
        type: String,
        index: true
    },
    type: {
        type: String,
        index: true
    },
    bankName: {
        type: String,
        index: true
    },
    branchName: {
        type: String,
        index: true
    }
});

const totalValue = mongoose.Schema({
    value: {
        type: Number,
    },
    currency: {
        type: String,
    }
});

const schema = {
    addressee: {
        type: String,
        index: true
    },
    userName: {
        type: String,
        index: true
    },
    userNumber: {
        type: String,
        index: true
    },
    originatingAccount: {
        type: originatingAccount
    },
    returnDebitItems: {
        type: []
    },
    totalValue: {
        type: totalValue,
        index: true
    },
    createDate: {
        type: String
    },
    processingDate: {
        type: Object
    }
};

module.exports.data = mongoose.Schema(schema);

module.exports.getKeys = function() {
    return Object.keys(schema);
};

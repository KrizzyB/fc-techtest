const DB = require("chassis-database");
const mongoose = DB.getMongoose();
const schema = require("./arudd/schema");
const model = mongoose.model('Arudd', mongoose.Schema(schema.data));

class Arudd {
    /**
     *
     * @param {Object} _arudd
     */
    constructor(_arudd) {
        let keys = schema.getKeys();
        for (let i=0; i<keys.length; i++) {
            this[keys[i]] = _arudd[keys[i]];
        }
    }

    /** Database Methods */

    /**
     *
     * @param {Object} query
     * @param {Function} callback
     */
    static get(query, callback) {
        if (DB.getReadyState()) {
            model.find(query, function (err, process) {
                callback(err, process);
            }).lean();
        } else {
            callback(dbNotConnectedErr);
        }
    }

    /**
     *
     * @param {Object} query
     * @param {Function} callback
     */
    static getOne(query, callback) {
        model.findOne(query, function (err, process) {
            callback(err, process);
        }).lean();
    }

    /**
     *
     * @param {Function} callback
     */
    create(callback) {
        if (DB.getReadyState()) {
            model.create(this, callback);
        } else {
            Log.error("DB not connected.");
        }
    }

    /**
     *
     * @param {Array} items
     * @param {Function} callback
     */
    static create(items, callback) {
        DB.transaction(items, "create", callback);
    }
}

module.exports = Arudd;

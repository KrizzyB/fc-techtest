const parseXML = require("xml2js").parseString;
const Arudd = require("../../model/arudd");

/**
 *
 * @param {Array} xmlFiles
 */
module.exports = function(xmlFiles) {
    let res = {
        err: [],
        success: []
    };
    let counter = 0;

    for (let i=0; i<xmlFiles.length; i++) {
        parseXML(xmlFiles, function(err, data) {
            if (err) {
                Log.error(err);
            } else {
                saveFileToDB(data);
                new Arudd(cleanupData(data)).create(function(err) {
                    if (err) {
                        Log.error(err.message);
                    }
                    parseComplete(xmlFiles.length);
                });
            }

        });
    }

    function saveFileToDB(xmlDoc) {
        //this is where we would save the raw data to a log in the DB
    }

    function cleanupData(xmlDoc) {
        let data = xmlDoc.BACSDocument.Data[0].ARUDD[0];
        let _arudd = {
            adviceNumber: data.Header[0].$.adviceNumber,
            reportType: data.Header[0].$.reportType,
            addressee: data.AddresseeInformation[0].$.name,
            userName: data.ServiceLicenseInformation[0].$.userName,
            userNumber: data.ServiceLicenseInformation[0].$.userNumber,
            originatingAccount: data.Advice[0].OriginatingAccountRecords[0].OriginatingAccountRecord[0].OriginatingAccount[0].$,
            returnDebitItems: [],
            totalValue: {
                value: data.Advice[0].OriginatingAccountRecords[0].OriginatingAccountRecord[0].Totals[0].$.valueOf,
                currency: data.Advice[0].OriginatingAccountRecords[0].OriginatingAccountRecord[0].Totals[0].$.currency
            },
            processingDate: data.Header[0].$.currentProcessingDate
        };

        let returnedDebitItems = data.Advice[0].OriginatingAccountRecords[0].OriginatingAccountRecord[0].ReturnedDebitItem;
        for (let i=0; i<returnedDebitItems.length; i++) {
            let returnedDebitItem = {
                currency: returnedDebitItems[i].$.currency,
                originalProcessingDate: returnedDebitItems[i].$.originalProcessingDate,
                ref: returnedDebitItems[i].$.ref,
                returnCode: returnedDebitItems[i].$.returnCode,
                returnDescription: returnedDebitItems[i].$.returnDescription,
                transCode: returnedDebitItems[i].$.transCode,
                valueOf: returnedDebitItems[i].$.valueOf,
                PayerAccount: {
                    bankName: returnedDebitItems[i].PayerAccount[0].$.bankName,
                    branchName: returnedDebitItems[i].PayerAccount[0].$.branchName,
                    name: returnedDebitItems[i].PayerAccount[0].$.name,
                    number: returnedDebitItems[i].PayerAccount[0].$.number,
                    ref: returnedDebitItems[i].PayerAccount[0].$.ref,
                    sortCode: returnedDebitItems[i].PayerAccount[0].$.sortCode
                }
            };

            _arudd.returnDebitItems.push((returnedDebitItem));
        }

        return _arudd;
    }

    function parseComplete(numberOfFiles) {
        counter++;

        if (counter === numberOfFiles) {    //if all requests have completed
            Log.complete("All files imported.");    //end the thread
        }
    }
};

module.exports.path = __filename;
module.exports.frequency = "* * * * *";
module.exports.enabled = true;
module.exports.job = function() {
    FileSystem.read(appRoot + "var/import", function(err, files, dir) {
        if (err) {
            Log.error(err.message);
        } else if (files.length) {
            require("chassis-database").init(function(err) {    //init db for this thread
                if (err) {
                    Log.error(err.message);
                } else {
                    let importXML = require("../helper/import/arudd-xml");
                    let xmlFiles = [];

                    for (let i=0; i<files.length; i++) {
                        xmlFiles.push((FileSystem.readFileSync(dir + files[i])));
                        FileSystem.archive(dir+files[i], "imported", function(err) {
                            if (err) {
                                Log.error(err.message);
                            }
                        });
                    }

                    importXML(xmlFiles);
                }
            });
        } else {
            Log.complete("No files in directory.", "Import-Cron");
        }
    }, {fileExt: ["xml"]});
};

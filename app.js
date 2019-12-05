const Chassis = require("chassis-core");

Chassis.bootstrap(function() {
    require("chassis-database").init(function(err) {    //init db for this thread
        if (err) {
            Log.error(err.message);
        } else {
            require("chassis-cron").startSchedule();
            new (require("chassis-webserver"));
        }
    });
});

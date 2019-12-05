const webserver = require("chassis-webserver");
const router = webserver.getExpress().Router();
const getParams = webserver.getParams;
const Arudd = require("../../model/arudd");

router.get('/', function (req, res) {
    let params = getParams(req);

    Arudd.get({}, function(err, arudds) {
        if (err) {
            res.json({error: err, status: "error"});
        } else {
            res.json({data: arudds, status: "ok"});
        }
    }, params.limit, params.page);
});

router.get('/:key/:value', function (req, res) {
    let params = getParams(req);
    let query = {};
    query[req.params.key] = req.params.value;

    Arudd.get(query, function(err, arudds) {
        if (err) {
            res.json({error: err, status: "error"});
        } else {
            res.json({data: arudds, status: "ok"});
        }
    }, params.limit, params.page);
});

module.exports = router;

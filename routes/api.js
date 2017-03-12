var express = require('express'),
    router = express.Router();

// this is used for api
 router.get('/get_json_data', function(req, res) {
     res.send({
         success: true,
         result: [{
         	a: "b",
         	b: "c"
         }]
     });
 });

module.exports = router;

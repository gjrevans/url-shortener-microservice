var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
    res.render('index.html', { page: {
            name: 'Home'
        }
    });
});
module.exports = router;

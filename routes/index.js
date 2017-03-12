var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
    res.render('index.html', {
        page: {
            name: 'Home' // config used in view. nunjuck compile this config
        }
    });
});
module.exports = router;

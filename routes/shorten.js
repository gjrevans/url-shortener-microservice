var express = require('express'),
    router = express.Router(),
    mongojs = require('mongojs'),
    db = mongojs(process.env.MONGO_URL, ['sites']);

// Helper to test if the url is valid
function checkUrl(url){
    var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return regex.test(url);
}

// Save the URL into the database
function saveUrl(site) {
    var sites = db.sites;
    sites.save(site, function(err, result) {
        if (err) throw err;
        console.log(result);
    });
}

// Creates a random 5 digit number
function randomNumber() {
    var num = Math.floor(100000 + Math.random() * 900000);
    return num.toString().substring(0, 5);
}

// The path will shorten the url
router.post('/shorten', function(req, res) {
    var input_url = req.body.url,
        response;
    if(!checkUrl(input_url)){
        response = {
            error: "Incorrect URL format. Please use https://yoururl.com or http://another-url.com"
        }
    } else {
        response = {
            original: input_url,
            shortened: process.env.BASE_URL + randomNumber()
        }
        // Only save the response if its a real url
        saveUrl(response);
    }
    res.send(response);
});

// Redirect the user to the original site
router.get('/:id', function (req, res) {
    console.log("hello");
    var url = process.env.BASE_URL + req.params.id;
    var sites = db.sites;
    sites.findOne({
        "shortened": url
    }, function(err, result){
        if (err) throw err;
        res.redirect(result.original);
    });
});

module.exports = router;

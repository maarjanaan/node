const express = require('express');
const path = require('path');

// App
const app = express();

// Load View Engine Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Home Route
app.get('/', function(req, res){
    let excuses = [
        {
            id: 1,
            title: 'Vabandus 1',
            author: 'Maarja',
            body: 'Koer sõi kodutöö ära'
        },
        {
            id: 2,
            title: 'Vabandus 2',
            author: 'Keegi teine',
            body: 'Mul on tantsutrenn samal ajal'
        },
        {
            id: 3,
            title: 'Vabandus 3',
            author: 'Maarja',
            body: 'Mul käelihased valutavad'
        },
    ];
    res.render('index', {
        title: 'Vabandused',
        excuses: excuses
    });
});

// Add Route
app.get('/excuses/add', function(req, res){
    res.render('add_excuse', {
        title: 'Lisa uus vabandus'
    });
});

// Start server
app.listen(3000, function(){
    console.log('Server started on port 3000..');
});
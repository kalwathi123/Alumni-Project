var express = require('express'),
    app = express(),
    mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/alumni', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

var indexRoutes = require('./routes/index');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(indexRoutes);

var port = 3000;
app.listen(port, function () {
    console.log('Alumni sever has started');
});

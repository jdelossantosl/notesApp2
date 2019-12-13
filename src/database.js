const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Javier:jadelos1986@cluster0-m1nei.mongodb.net/test?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
})
.then(db => console.log('DB is connected'))
.catch(err => console.log(err));
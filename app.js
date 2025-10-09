 const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // used for logging
}
app.use(express.json()); //middleware

app.use(express.static(`${__dirname}/public`)); //serve static files from folder and not from a route

// middleware
app.use((req, res, next) => {
  console.log('Hello from the middleware 🖐️');
  next();
});
// middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.get('/', (req, res) => {
//    res.status(200).json({message : 'Hello from the server side!', app: 'Natours'})
// })

// app.post('/', (req, res) => {
//    res.send('You can post to this url')
// })

// app.get('/api/v1/tours', getAllTours)

// /api/v1/tours/:id? -> optional param
// app.get('/api/v1/tours/:id', getTour)
// app.post('/api/v1/tours', createTour)
// app.patch('/api/v1/tours/:id', udpdateTour)
// app.delete('/api/v1/tours/:id', deleteTour)

// Mounting of router
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// tourRouter.route('/').get(getAllTours).post(createTour);
// tourRouter
//   .route('/:id')
//   .get(getTour)
//   .patch(udpdateTour)
//   .delete(deleteTour);

// userRouter.route('/').get(getAllUsers).post(createUser);
// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = app;

// dishatomariitkgp_db_user
// R8OBekKtIVkANzGB

// mongodb+srv://dishatomariitkgp_db_user:R8OBekKtIVkANzGB@cluster0.8lfgt8w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

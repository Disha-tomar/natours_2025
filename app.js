const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

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
// app.use((req, res, next) => {
//   console.log('Hello from the middleware 🖐️');
//   next();
// });
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

// unhandled routes - all for all the http verbs
// this should be the last route
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`
  // })

  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// global error handling middleware
app.use(globalErrorHandler);

// tourRouter.route('/').get(getAllTours).post(createTour);
// tourRouter
//   .route('/:id')
//   .get(getTour)
//   .patch(udpdateTour)
//   .delete(deleteTour);

// userRouter.route('/').get(getAllUsers).post(createUser);
// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = app;

const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
//body parser, reading data from the body
app.use(express.json({ limit: '10kb' })); //middleware

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// 1) Global Middlewares
// Set Security http headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // used for logging
}

// Limit requests from same IP - allow 100 requests from the same IP in 1 hour
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!', // 429 -> too many requests
});

app.use('/api', limiter);

app.use(express.static(`${__dirname}/public`)); //serve static files from folder and not from a route

// middleware
// app.use((req, res, next) => {
//   console.log('Hello from the middleware 🖐️');
//   next();
// });
// test middleware
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

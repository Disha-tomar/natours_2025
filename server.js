const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('uncaught exception 💥Shutting down...');
  // process.exit(1); // 0 for success 1 for exception -> abrupt way of ending the program
  process.exit(1);
});
dotenv.config({ path: './config.env' });
const app = require('./app');

// console.log(process.env)
const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('db connection successful');
  });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('unhandled rejection 💥Shutting down...');
  // process.exit(1); // 0 for success 1 for exception -> abrupt way of ending the program

  server.close(() => {
    process.exit(1);
  });
});

// console.log(x); -> uncaught exception

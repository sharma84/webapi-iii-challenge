const express = require("express");
//const logger = require('morgan');

const server = express(); //call express to get server

//routers
const postRouter = require("./posts/postRouter.js");
const userRouter = require("./users/userRouter.js");

//global middleware

server.use(express.json());
server.use(logger);
//server.use(helmet());
server.use("/api/posts", postRouter); //refer to const postRouter
server.use("/api/users", userRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(
    `${req.method}:METHOD, ${req.url}:URL, ${new Date().toISOString()}:DATE`
  ); //get Request, put request
  next();
}

//global error handler
server.use((err, req, res, next) => {
  res.status(500).json({
    message: "error",
    err
  });
});

module.exports = server;

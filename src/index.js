const express = require('express');
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log("Server is up on port " + port);
});

//
// Without middleware : new request -> run route handler
//
// with middleware : new request -> do something -> run route handler
//

// encryption algo => Ashwani -> USDuaeoifniqefh -> Ashwani(resverable)
// Hashing algo => Ashwani -> ashbiuabefjqb -> (not reversable)
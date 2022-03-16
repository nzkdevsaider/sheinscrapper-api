const express = require("express"),
app = express(),
morgan = require("morgan");

// Config

app.set("port", 3001);
app.set("json spaces", 2);

// Middleware

app.use(morgan("dev"));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// Rutas
app.use(require('./rutas/shein/index'));

// Get Index

app.get("/", (req, res) => {
    res.send("devsaider-server")
})

// Iniciación

app.listen(app.get("port"), () => {
    console.log(`Servidor escuchando en ${app.get("port")}`);
})
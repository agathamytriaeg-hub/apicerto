const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = 3000;


// ======================================================
// CORS
// ======================================================

app.use(cors({
    origin: "*",
    methods: [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "OPTIONS"
    ],
    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ]
}));


// ======================================================
// JSON
// ======================================================

app.use(express.json());


// ======================================================
// ROTAS
// ======================================================

const receitasAPI = require("./receitas");

app.use("/api", receitasAPI);


// ======================================================
// ROTA PRINCIPAL
// ======================================================

app.get("/", (req, res) => {

    res.json({
        mensagem: "API Reaproveita.ai funcionando!"
    });

});


// ======================================================
// INICIAR SERVIDOR
// ======================================================

app.listen(PORT, () => {

    console.log(
        `🚀 Servidor rodando em http://localhost:${PORT}`
    );

});

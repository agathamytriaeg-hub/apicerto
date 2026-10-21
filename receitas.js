const express = require("express");
const mysql = require("mysql2");

const router = express.Router();


// ======================================================
// CONEXÃO COM MYSQL
// ======================================================

const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "reaproveita",
    port: process.env.DB_PORT || 3306,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


// ======================================================
// TESTAR MYSQL
// ======================================================

db.getConnection((erro, connection) => {

    if (erro) {
        console.error("❌ Erro ao conectar ao MySQL:");
        console.error(erro.message);
        return;
    }

    console.log("✅ MySQL conectado com sucesso!");

    connection.release();
});


// ======================================================
// BUSCAR RECEITAS PELO ID DO INGREDIENTE
// ======================================================

router.get("/receitas/:ingredienteId", (req, res) => {

    const ingredienteId = req.params.ingredienteId;

    console.log("--------------------------------");
    console.log("Ingrediente recebido:", ingredienteId);
    console.log("--------------------------------");


    const sql = `
        SELECT
            id,
            ingrediente_id,
            nome,
            ingredientes,
            modo_preparo,
            imagem
        FROM receitas
        WHERE ingrediente_id = ?
    `;


    db.query(sql, [ingredienteId], (erro, resultados) => {

        if (erro) {

            console.error("❌ Erro ao buscar receitas:");
            console.error(erro);

            return res.status(500).json({
                erro: "Erro ao buscar receitas."
            });
        }


        console.log(
            "✅ Receitas encontradas:",
            resultados.length
        );


        res.json(resultados);

    });

});


// ======================================================
// BUSCAR UMA RECEITA ESPECÍFICA
// ======================================================

router.get("/receita/:id", (req, res) => {

    const receitaId = req.params.id;

    console.log("--------------------------------");
    console.log("Buscando receita:", receitaId);
    console.log("--------------------------------");


    const sql = `
        SELECT
            id,
            ingrediente_id,
            nome,
            ingredientes,
            modo_preparo,
            imagem
        FROM receitas
        WHERE id = ?
    `;


    db.query(sql, [receitaId], (erro, resultados) => {

        if (erro) {

            console.error("❌ Erro ao buscar receita:");
            console.error(erro);

            return res.status(500).json({
                erro: "Erro ao buscar receita."
            });
        }


        if (resultados.length === 0) {

            return res.status(404).json({
                erro: "Receita não encontrada."
            });
        }


        const receita = resultados[0];


        // ==================================================
        // CONVERTER PARA O FORMATO QUE O JAVASCRIPT ESPERA
        // ==================================================

        let ingredientes = [];

        if (receita.ingredientes) {

            if (typeof receita.ingredientes === "string") {

                ingredientes = receita.ingredientes
                    .split(/\r?\n/)
                    .map(item => item.trim())
                    .filter(item => item !== "");

            } else {

                ingredientes = receita.ingredientes;
            }
        }


        const resposta = {

            id: receita.id,

            nome: receita.nome,

            ingrediente_id: receita.ingrediente_id,

            ingredientes: ingredientes,

            modoPreparo: receita.modo_preparo,

            imagem: receita.imagem

        };


        console.log(
            "✅ Receita enviada:",
            resposta.nome
        );


        res.json(resposta);

    });

});


module.exports = router;
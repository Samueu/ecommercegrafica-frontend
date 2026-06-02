const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();

  // Exemplo de rota customizada
  server.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Todas as demais rotas vão para o Next
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
});

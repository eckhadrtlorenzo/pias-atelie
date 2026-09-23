const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const multer = require('multer'); // Importa o Multer para lidar com uploads

const app = express();

// ==========================================
// MIDDLEWARES E CONFIGURAÇÕES DE PASTAS
// ==========================================
app.use(cors());
app.use(express.json());

// Garante que o Express consiga servir seu HTML, CSS e JS locais sem travar
app.use(express.static(path.join(__dirname))); 

// Define especificamente que a pasta 'img' é pública para renderizar as fotos no site
app.use('/img', express.static(path.join(__dirname, 'img')));

// Configura o Multer para salvar as imagens diretamente na sua pasta 'img'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'img')); // Caminho absoluto para a pasta img
    },
    filename: (req, file, cb) => {
        // Define o nome do arquivo usando o timestamp atual para evitar nomes duplicados
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Conexão com o banco de dados SQLite
const db = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('⚡ Conectado ao banco de dados SQLite!');
    }
});

// Criar as tabelas no banco de dados se não existirem
db.serialize(() => {
    // Tabela de Clientes
    db.run(`CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
    )`);

    // Tabela de Pedidos
    db.run(`CREATE TABLE IF NOT EXISTS pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_cliente TEXT,
        email TEXT,
        estilo TEXT,
        status TEXT DEFAULT 'Pendente',
        data DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Nova tabela para salvar os novos mantos/produtos cadastrados
    db.run(`CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descricao TEXT,
        imagem TEXT NOT NULL, -- Guarda o caminho da imagem como texto (Ex: img/12345.jpg)
        preco TEXT,
        tempo TEXT
    )`);
});

// ==========================================
// ROTAS DE CLIENTES
// ==========================================

// POST: Cadastrar um novo cliente diretamente
app.post('/api/clientes', (req, res) => {
    const { nome, email } = req.body;

    if (!nome || !email) {
        return res.status(400).json({ erro: 'Por favor, informe nome e e-mail.' });
    }

    const sql = 'INSERT INTO clientes (nome, email) VALUES (?, ?)';
    db.run(sql, [nome, email], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE')) {
                return res.status(400).json({ erro: 'Este e-mail já está cadastrado!' });
            }
            return res.status(500).json({ erro: 'Erro ao cadastrar cliente.', detalhes: err.message });
        }

        res.status(201).json({
            mensagem: 'Cliente cadastrado com sucesso!',
            id: this.lastID,
            nome,
            email
        });
    });
});

// GET: Consultar todos os clientes
app.get('/api/clientes', (req, res) => {
    const sql = 'SELECT * FROM clientes ORDER BY id DESC';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao consultar clientes.', detalhes: err.message });
        }
        res.json(rows);
    });
});

// ==========================================
// ROTAS DE PEDIDOS
// ==========================================

// POST: Criar novo pedido (e auto-cadastrar cliente se não existir)
app.post('/api/pedidos', (req, res) => {
    const { nome, email, estilo } = req.body;

    if (!nome || !email || !estilo) {
        return res.status(400).json({ erro: 'Por favor, preencha todos os campos do pedido.' });
    }

    // 1. Cadastra o cliente automaticamente se ainda não existir
    db.run('INSERT OR IGNORE INTO clientes (nome, email) VALUES (?, ?)', [nome, email]);

    // 2. Grava o pedido na tabela pedidos
    const sqlPedido = 'INSERT INTO pedidos (nome_cliente, email, estilo) VALUES (?, ?, ?)';
    db.run(sqlPedido, [nome, email, estilo], function (err) {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao salvar pedido.', detalhes: err.message });
        }

        res.status(201).json({
            mensagem: 'Pedido registrado com sucesso!',
            id: this.lastID,
            nome_cliente: nome,
            email,
            estilo
        });
    });
});

// GET: Consultar todos os pedidos
app.get('/api/pedidos', (req, res) => {
    const sql = 'SELECT * FROM pedidos ORDER BY id DESC';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao consultar pedidos.', detalhes: err.message });
        }
        res.json(rows);
    });
});

// ==========================================
// NOVA ROTA: CADASTRO DE MANTOS (PRODUTOS)
// ==========================================
app.post('/api/produtos', upload.single('foto'), (req, res) => {
    const { titulo, descricao, preco, tempo } = req.body;

    if (!req.file) {
        return res.status(400).json({ erro: 'Por favor, envie uma imagem para o manto.' });
    }

    // Cria o caminho de texto adaptado para o seu formato (Ex: img/nome-do-arquivo.jpg)
    const caminhoImagem = `img/${req.file.filename}`;

    const sql = 'INSERT INTO produtos (titulo, descricao, imagem, preco, tempo) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [titulo, descricao, caminhoImagem, preco, tempo], function (err) {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao salvar manto no banco.', detalhes: err.message });
        }

        res.status(201).json({
            mensagem: 'Manto Estelar adicionado com sucesso!',
            id: this.lastID,
            titulo,
            imagem: caminhoImagem
        });
    });
});

// NOVA ROTA: CONSULTAR TODOS OS MANTOS DO BANCO
app.get('/api/produtos', (req, res) => {
    const sql = 'SELECT * FROM produtos ORDER BY id DESC';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao buscar mantos.', detalhes: err.message });
        }
        res.json(rows);
    });
});

// Inicialização do servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});


const alasql = require("alasql");

alasql("CREATE TABLE IF NOT EXISTS usuarios (id INT PRIMARY KEY AUTO_INCREMENT, nome STRING, cpf STRING, nascimento DATE, usuario STRING, senha STRING)");

function cadastrarUsuario(nome, cpf, nascimento, usuario, senha) {
    alasql("INSERT INTO usuarios (nome, cpf, nascimento, usuario, senha) VALUES (?, ?, ?, ?, ?)", [nome, cpf, nascimento, usuario, senha]);
}

alasql("CREATE TABLE IF NOT EXISTS enderecos (id INT PRIMARY KEY AUTO_INCREMENT, usuario_id INT, cep STRING, logradouro STRING, numero STRING, complemento STRING, bairro STRING, cidade STRING, estado STRING)");

function cadastrarEndereco(usuario_id, cep, logradouro, numero, complemento, bairro, cidade, estado) {
    alasql("INSERT INTO enderecos (usuario_id, cep, logradouro, numero, complemento, bairro, cidade, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [usuario_id, cep, logradouro, numero, complemento, bairro, cidade, estado]);
}
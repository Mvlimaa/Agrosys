alasql('CREATE LOCALSTORAGE DATABASE IF NOT EXISTS agrosqldb');
alasql('ATTACH LOCALSTORAGE DATABASE agrosqldb');
alasql('USE agrosqldb');

alasql(`CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome STRING,
    email STRING UNIQUE,
    senha STRING
)`);

alasql(`CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo STRING,
    cpf STRING UNIQUE,
    data_nascimento STRING,
    telefone STRING,
    celular STRING
)`);

alasql(`CREATE TABLE IF NOT EXISTS enderecos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    cep STRING,
    pais STRING,
    rua STRING,
    bairro STRING,
    cidade STRING,
    estado STRING,
    numero STRING,
    complemento STRING,
    principal BOOLEAN
)`);

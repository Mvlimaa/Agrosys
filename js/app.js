//============================================ SECTION JAVASCRIPT ============================================//

//Recebe as informações e manda comparar com o banco de dados.
function handleLogin(event) {
    event.preventDefault();

    var username = document.getElementById("usuario").value;
    var password = document.getElementById("senha").value;
    var usuarioLogado = checkLogin(username, password);

    if (usuarioLogado) {
        alert("Login bem-sucedido!");
        window.location.href = "home.html";
    } else {
        alert("Credenciais inválidas. Tente novamente.");
    }           
}

//Adiciona o filtro de CPF ao INPUT(cpf) da tela de Cadastro.
function filtrocpf() {
    var input = document.getElementById("cpf_cliente")
    var value = input.value
    //Remove todos os caracteres que não são dígitos.
    value = value.replace(/\D/g, '');
    //Adiciona o primeiro ponto após os 3 primeiros dígitos.
    if (value.length > 3) {
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
    }
    //adiciona o segundo ponto após os 6 primeiros dígitos.
     if (value.length > 3) {
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
    }
    //Adiciona o hífen após os 9 primeiros dígitos.
    if (value.length > 7) {
        value = value.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2-$3");
    }
    //Limita o comprimento do CPF a 14 caracteres. (11 dígitos + 3 caracteres de formatação)
    if (value.length > 11) {
        value = value.substring(0, 14);
    }
    input.value = value;
}

//Verifica se as duas senhas são iguais, para evitar cadastro de senha incorreta e realiza o cadastro salvando no banco AlaSQL.
function validarSenha(event) {
    event.preventDefault(); 
    
    var nome = document.getElementById("nome_cadastro").value;
    var email = document.getElementById("email_cadastro").value;
    var senha = document.getElementById("senha_cadastro").value;
    var confirmarSenha = document.getElementById("confirmar_senha").value;

    //Valida se as senhas são iguais.
    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem.");
        return;
    }
    //Not Null.
    if (!nome || !email || !senha ||!confirmarSenha) {
        alert("Preencha Todos os Campos.")
        return;
    }

    //Tenta inserir no banco de dados.
    var sucesso = insertUsuario(nome, email, senha);

    if (sucesso) {
        alert("Cadastro realizado com sucesso! Agora você pode fazer login.");
        
        // Limpa os campos do formulário, caso precise fazer outro cadastro.
        document.getElementById("nome_cadastro").value = "";
        document.getElementById("email_cadastro").value = "";
        document.getElementById("senha_cadastro").value = "";
        document.getElementById("confirmar_senha").value = "";
        
        //Fecha o modal de cadastro.
        $('#modal_cadastro').removeClass('show');
    } else {
        alert("Erro: Este e-mail já está cadastrado no sistema!");
    }
}

//RecycleView Clientes Cadastrados.
function renderizarClientes(clientesLista = null) {
    let areaLista = document.getElementById("lista_clientes");
    if (!areaLista) return;

    let clientes = clientesLista || getClientes();
    areaLista.innerHTML = "";

    if (clientes.length === 0) {
        areaLista.innerHTML = "<div class='empty_list'>Nenhum cliente cadastrado ainda.</div>";
        return;
    }

    clientes.forEach(cliente => {
        areaLista.innerHTML += `
        <article class="cliente_card">
            <div class="cliente_card_header">
                <div>
                    <h2 class="cliente_card_title">${cliente.nome_completo}</h2>
                    <div class="cliente_card_meta">
                        <span>CPF: ${cliente.cpf}</span>
                        <span>Data de Nascimento: ${cliente.data_nascimento || '-'}</span>
                    </div>
                </div>
              </div>
            <div class="cliente_card_details">
                <div class="field_cliente"><label>Celular</label><span>${cliente.celular || '-'}</span></div>
                <div class="field_cliente"><label>Telefone</label><span>${cliente.telefone || '-'}</span></div>
            </div>
            <div class="cliente_card_footer">
                <button type="button" class="ver_detalhes_btn" onclick="abrirCliente(${cliente.id})">Ver Detalhes</button>
            </div>
        </article>
        `;
    });
}

//Abre o Modal Cliente após clicar no botão Ver Detalhes.
function abrirCliente(clienteId) {
    let cliente = getClientes().find(c => c.id === clienteId);
    if (!cliente) return;
    
    document.getElementById('modal_cliente_nome').textContent = cliente.nome_completo;
    document.getElementById('modal_info_nome').textContent = cliente.nome_completo;
    document.getElementById('modal_info_cpf').textContent = cliente.cpf;
    document.getElementById('modal_info_datanasc').textContent = cliente.data_nascimento || '-';
    document.getElementById('modal_info_telefone').textContent = cliente.telefone || '-';
    document.getElementById('modal_info_celular').textContent = cliente.celular || '-';
    
    renderizarEnderecosModal(clienteId);
    
    //Armazena o cliente atual para criação de endereços.
    window.currentEditingClienteId = clienteId;
    //Vincula o botão de adicionar endereço ao cliente atual.
    var addEnderecoBtn = document.getElementById('btnAdicionarEndereco');
    if (addEnderecoBtn) {
        addEnderecoBtn.onclick = function() { abrirModalEndereco(clienteId); };
    }
    
    document.getElementById('modal_cliente').classList.add('show');
}

//Abre o Modal Endereços após clicar no botão Adicionar Endereço.
function abrirModalEndereco() {
    //aceita apenas um clienteId.
    var clienteId = arguments.length ? arguments[0] : window.currentEditingClienteId;
    if (clienteId) window.currentEditingClienteId = clienteId;
    document.getElementById('modal_endereco').classList.add('show');
    // Limpa o formulário ao abrir para adicionar novo endereço.
    var form = document.getElementById('form_endereco');
    if (form) form.reset();
}

//RecycleView Endereços do Cliente.
function renderizarEnderecosModal(clienteId) {
    let enderecos = alasql('SELECT * FROM enderecos WHERE cliente_id = ?', [clienteId]) || [];
    let enderecosDiv = document.getElementById('modal_enderecos_list');
    enderecosDiv.innerHTML = '';

    if (enderecos.length === 0) {
        enderecosDiv.innerHTML = '<p class="empty-message">Nenhum endereço cadastrado</p>';
        return;
    }

    enderecos.forEach(endereco => {
        let classes = 'endereco_item';
        if (endereco.principal) classes += ' principal';
        
        enderecosDiv.innerHTML += `
        <div class="${classes}">
            <div class="endereco_item_header">
                <span class="endereco_item_title">
                    ${endereco.rua}, ${endereco.numero}
                    ${endereco.principal ? '<span class="endereco_badge">Principal</span>' : ''}
                </span>
            </div>
            <div class="endereco_item_details">
                <div>${endereco.complemento ? endereco.complemento + ' - ' : ''}${endereco.bairro}, ${endereco.cidade}</div>
                <div>CEP: ${endereco.cep}</div>
            </div>
        </div>
        `;
    });
}

// Coleta dados do formulário de endereço, valida e salva no banco.
function salvarEndereco() {
    var clienteId = window.currentEditingClienteId;
    if (!clienteId) { alert('Cliente não selecionado para adicionar endereço.'); return; }

    var cep = document.getElementById('endereco_cep') ? document.getElementById('endereco_cep').value.trim() : '';
    var cidade = document.getElementById('endereco_cidade') ? document.getElementById('endereco_cidade').value.trim() : '';
    var bairro = document.getElementById('endereco_bairro') ? document.getElementById('endereco_bairro').value.trim() : '';
    var rua = document.getElementById('endereco_rua') ? document.getElementById('endereco_rua').value.trim() : '';
    var numero = document.getElementById('endereco_numero') ? document.getElementById('endereco_numero').value.trim() : '';
    var complemento = document.getElementById('endereco_complemento') ? document.getElementById('endereco_complemento').value.trim() : '';
    var principal = document.getElementById('endereco_principal') ? document.getElementById('endereco_principal').checked : false;

    if (!cep || !rua || !bairro || !cidade || !numero) {
        alert('Preencha todos os campos obrigatórios.');
        return;
    }

    // chama a função do db.js para inserir o endereço
    try {
        var sucesso = insertEndereco(clienteId, cep, rua, bairro, cidade, '', complemento, numero, principal);
        if (sucesso) {
            alert('Endereço salvo com sucesso!');
            $('#modal_endereco').removeClass('show');
            var form = document.getElementById('form_endereco');
            if (form) form.reset();
            renderizarEnderecosModal(clienteId);
        } else {
            alert('Erro ao salvar endereço. Verifique os dados e tente novamente.');
        }
    } catch (e) {
        console.error(e);
        alert('Erro ao salvar endereço. Veja console para detalhes.');
    }
}

//Adiciona um filtro de Clientes pelas letras preenchidas no input text de pesquisa da tela home.
function filtrarClientes() {
    let campoBusca = document.getElementById("busca_clientes");
    if (!campoBusca) return;

    let filtro = campoBusca.value.trim().toLowerCase();
    let clientes = getClientes();

    if (filtro) {
        clientes = clientes.filter(cliente => {
            return cliente.nome_completo.toLowerCase().includes(filtro)
                || cliente.cpf.toLowerCase().includes(filtro)
                || (cliente.celular && cliente.celular.toLowerCase().includes(filtro))
                || (cliente.telefone && cliente.telefone.toLowerCase().includes(filtro));
        });
    }

    renderizarClientes(clientes);
}

// Salva um novo cliente a partir do formulário do modal.
function salvarCliente() {
    let nome = document.getElementById("nome_cliente").value;
    let cpf = document.getElementById("cpf_cliente").value;
    let dataNasc = document.getElementById("data_nasc_cliente").value;
    let telefone = document.getElementById("telefone_cliente").value;
    let celular = document.getElementById("celular_cliente").value;

    if (!nome || !cpf || !dataNasc) {
        alert("Preencha os campos obrigatórios!");
        return;
    }

    let sucesso = insertCliente(nome, cpf, dataNasc, telefone, celular);
    
    if (sucesso) {
        alert("Cliente cadastrado com sucesso!");
        $('#modal').removeClass('show');
        document.getElementById("formCliente").reset(); 
        renderizarClientes(); 
    } else {
        alert("Erro: Este CPF já está cadastrado!");
    }
}

//Faz download do banco de dados Completo.
function baixarDadosJson() {
    const payload = {
        usuarios: getUsuarios(),
        clientes: getClientes(),
        enderecos: getEnderecos()
    };

    const jsonString = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `agrosys_dados_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

//Verifica se o .json é valido.
function importarDadosJson(file) {
    if (!file) {
        alert('Selecione um arquivo JSON válido.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        let parsed;
        try {
            parsed = JSON.parse(event.target.result);
        } catch (error) {
            alert('Arquivo JSON inválido. Verifique o conteúdo e tente novamente.');
            return;
        }

        const sucesso = importDatabaseFromJson(parsed);
        if (sucesso) {
            alert('Banco pré-configurado com sucesso! Os dados foram importados.');
            const modal = document.getElementById('modal_configuracao');
            if (modal) modal.classList.remove('show');
        } else {
            alert('Não foi possível importar os dados. Verifique o formato do JSON.');
        }
    };
    reader.readAsText(file, 'UTF-8');
}

//============================================ SECTION CRUD BANCO DE DADOS ============================================//

//Função para validar o Login.
function checkLogin(email, senha) {
    let usuario = alasql('SELECT * FROM usuarios WHERE email = ? AND senha = ?', [email, senha]);
    if (usuario.length > 0) {
        return usuario[0];
    }
    return null;
}
//Função para Cadastrar o Usuario.
function insertUsuario(nome, email, senha) {
    let existe = alasql('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (existe.length > 0) {
        return false; 
    }
    alasql('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senha]);
    return true;
}

//Função para cadastrar cliente.
function insertCliente(nome, cpf, dataNascimento, telefone, celular) {
    let existe = alasql('SELECT * FROM clientes WHERE cpf = ?', [cpf]);
    if (existe.length > 0) {
        return false; 
    }
    alasql('INSERT INTO clientes (nome_completo, cpf, data_nascimento, telefone, celular) VALUES (?, ?, ?, ?, ?)', [nome, cpf, dataNascimento, telefone, celular]);
    return true;
}

//Insere endereço com todos os campos e define se é principal.
function insertEndereco(cliente_id, cep, rua, bairro, cidade, estado, complemento, numero, principal) {
    //Garantir que a coluna 'numero' exista.
    try {
        alasql('ALTER TABLE enderecos ADD COLUMN numero STRING');
    } catch (e) {}

    var cliente = alasql('SELECT * FROM clientes WHERE id = ?', [cliente_id]);
    if (!cliente || cliente.length === 0) return false;

    //Se marcar como principal, remove flag principal dos outros endereços desse cliente.
    if (principal) {
        alasql('UPDATE enderecos SET principal = 0 WHERE cliente_id = ?', [cliente_id]);
    }

    alasql('INSERT INTO enderecos (cliente_id, cep, rua, bairro, cidade, estado, complemento, numero, principal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [cliente_id, cep, rua, bairro, cidade, estado, complemento, numero, principal ? 1 : 0]);

    return true;
}

//Função para listar todos os Usuarios..
function getUsuarios() {
    return alasql('SELECT * FROM usuarios');
}

//Função para listar todos os Endereços.
function getEnderecos() {
    return alasql('SELECT * FROM enderecos');
}

//Função para listar todos os clientes.
function getClientes() {
    return alasql('SELECT * FROM clientes');
}

//Importa database em .json para pré-popular o banco de dados do site.
function importDatabaseFromJson(jsonData) {
    if (!jsonData || typeof jsonData !== 'object') {
        return false;
    }

    const usuarios = Array.isArray(jsonData.usuarios) ? jsonData.usuarios : [];
    const clientes = Array.isArray(jsonData.clientes) ? jsonData.clientes : [];
    const enderecos = Array.isArray(jsonData.enderecos) ? jsonData.enderecos : [];


    usuarios.forEach(u => {
        try {
            alasql('INSERT INTO usuarios (id, nome, email, senha) VALUES (?, ?, ?, ?)', [u.id, u.nome, u.email, u.senha]);
        } catch (e) {
            console.warn('Falha ao importar usuário', u, e);
        }
    });

    clientes.forEach(c => {
        try {
            alasql('INSERT INTO clientes (id, nome_completo, cpf, data_nascimento, telefone, celular) VALUES (?, ?, ?, ?, ?, ?)', [
                c.id,
                c.nome_completo,
                c.cpf,
                c.data_nascimento || '',
                c.telefone || '',
                c.celular || ''
            ]);
        } catch (e) {
            console.warn('Falha ao importar cliente', c, e);
        }
    });

    enderecos.forEach(e => {
        try {
            alasql('INSERT INTO enderecos (id, cliente_id, cep, rua, bairro, cidade, estado, complemento, numero, principal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                e.id,
                e.cliente_id,
                e.cep || '',
                e.rua || '',
                e.bairro || '',
                e.cidade || '',
                e.estado || '',
                e.complemento || '',
                e.numero || '',
                e.principal ? 1 : 0
            ]);
        } catch (e) {
            console.warn('Falha ao importar endereço', e, e);
        }
    });

    return true;
}

//============================================ SECTION JQUERY ============================================//

//Modal Cadastro de Usuario.
$(document).ready(function() {
  //Abre o modal ao clicar no link de cadastro.
  $('#cadastre_se').click(function(event) {
    event.preventDefault();
    $('#modal_cadastro').addClass('show');
  });

  //Fecha o modal ao clicar no botão fechar.
  $('#btnFechar').click(function() {
    $('#modal_cadastro').removeClass('show');
  });

  //Fecha o modal ao clicar fora do conteúdo.
  $(window).click(function(event) {
    if (event.target.id === 'modal_cadastro') {
      $('#modal_cadastro').removeClass('show');
    }
  });
});

//Modal Configurações banco de dados.
$(document).ready(function() {
  //Abre o modal ao clicar no botão de configuração.
  $('#btnConfiguracao').click(function(event) {
    event.preventDefault();
    $('#modal_configuracao').addClass('show');
  });

  //Fecha o modal ao clicar fora do conteúdo.
  $(window).click(function(event) {
    if (event.target.id === 'modal_configuracao') {
      $('#modal_configuracao').removeClass('show');
    }
  });

  //Fecha o modal ao clicar no botão fechar.
  $('#btnFecharConfig').click(function() {
    $('#modal_configuracao').removeClass('show');
  });
});

  //Abrir Modal Cadastro do Cliente.
$(document).ready(function() {
    $('#cadastrar_novo_cliente').click(function(event) {
        event.preventDefault();
        $('#modal_cadastro').addClass('show');
    });

    //Fechar Modal de Cliente.
    $('#btnFecharModalCliente').click(function(event) {
        event.preventDefault();
        document.getElementById('modal_cliente').classList.remove('show');
    });

    //Fecha modal de cliente ao clicar fora.
    $(window).click(function(event) {
        if (event.target.id === 'modal_cliente') {
            document.getElementById('modal_cliente').classList.remove('show');
        }
    });

    //Renderiza a lista de clientes ao abrir a página.
    renderizarClientes();

    //Filtra clientes ao digitar no campo de busca.
    $('#busca_clientes').on('input', filtrarClientes);

    //Exportar JSON.
    $('#extrair_btn').click(function(event) {
        event.preventDefault();
        baixarDadosJson();
    });

    //Importar JSON de banco.
    $('#formUploadJson').submit(function(event) {
        event.preventDefault();
        const fileInput = document.getElementById('arquivo_json');
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            alert('Selecione um arquivo JSON para importar.');
            return;
        }
        importarDadosJson(fileInput.files[0]);
    });

    //Fecha o modal de endereços.
    $('#btnFecharEndereco').click(function(event) {
        event.preventDefault();
        $('#modal_endereco').removeClass('show');
    });
});

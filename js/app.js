//Verfica se as informações de Login estão corretas.
function handleLogin(event) {
    event.preventDefault();

    var username = document.getElementById("usuario").value;
    var password = document.getElementById("senha").value;

    if (username === "admin" && password === "admin") {
        alert("Login bem-sucedido!");
        // Redireciona para a pagina home.html
        window.location.href = "home.html";
    } else {
        alert("Credenciais inválidas. Tente novamente.");
    }           
}

//Adiciona o filtro de CPF ao INPUT(cpf) da tela de Cadastro.
function filtrocpf() {
    var input = document.getElementById("cpf");
    var value = input.value
    // Remove todos os caracteres que não são dígitos
    value = value.replace(/\D/g, '');
    // Adiciona o primeiro ponto após os 3 primeiros dígitos
    if (value.length > 3) {
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
    }
    //adiciona o segundo ponto após os 6 primeiros dígitos
     if (value.length > 3) {
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
    }
    // Adiciona o hífen após os 9 primeiros dígitos
    if (value.length > 7) {
        value = value.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2-$3");
    }
    // Limita o comprimento do CPF a 14 caracteres (11 dígitos + 3 caracteres de formatação)
    if (value.length > 11) {
        value = value.substring(0, 14);
    }
    input.value = value;
}

//Verifica se as duas senhas coicidem na hora do Cadastro, para evitar cadastro de senha incorreta.
function validarSenha(event) {
    event.preventDefault(); 
    var senha = document.getElementById("senha_cadastro").value;
    var confirmarSenha = document.getElementById("confirmar_senha").value;

    if (senha == confirmarSenha) {
        window.location.href = "index.html";
        alert("Cadastro realizado com sucesso!");
    } else {
        alert("As senhas não coincidem.");
    }
}   

// Modal Cadastro
$(document).ready(function() {
  // Abre o modal ao clicar no link de cadastro
  $('#cadastre_se').click(function(event) {
    event.preventDefault();
    $('#meuModal').addClass('show');
  });

  // Fecha o modal ao clicar no botão fechar
  $('#btnFechar').click(function() {
    $('#meuModal').removeClass('show');
  });

  // Fecha o modal ao clicar fora do conteúdo
  $(window).click(function(event) {
    if (event.target.id === 'meuModal') {
      $('#meuModal').removeClass('show');
    }
  });
});

//Modal Configurações
$(document).ready(function() {
  // Abre o modal ao clicar no botão de configuração
  $('#btnConfiguracao').click(function(event) {
    event.preventDefault();
    $('#modal_configuracao').addClass('show');
  });

  // Fecha o modal ao clicar fora do conteúdo
  $(window).click(function(event) {
    if (event.target.id === 'modal_configuracao') {
      $('#modal_configuracao').removeClass('show');
    }
  });

  // Fecha o modal ao clicar no botão fechar
  $('#btnFecharConfig').click(function() {
    $('#modal_configuracao').removeClass('show');
  });
  });

  //Modal Dados do Usuario
  $(document).ready(function() {
    // Abre o modal ao clicar no container do usuário
    $('#container_usuario').click(function(event) {
      event.preventDefault();
      $('#modal').addClass('show');
    });

    // Fecha o modal ao clicar fora do conteúdo
    $(window).click(function(event) {
      if (event.target.id === 'modal') {  
        $('#modal').removeClass('show');
      }
    });
  });
   $(document).ready(function() {
    // Abre o modal ao clicar no 
    $('#btn_endereco').click(function(event) {
      event.preventDefault();
      $('#modal_endereco').addClass('show');
    });
  });
  

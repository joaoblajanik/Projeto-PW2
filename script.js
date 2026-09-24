const USUARIOS_ADMIN = {
    "arthur": "arthur123",
    "fabricio": "fabricio123",
    "blajanik": "blajanik123"
};

document.addEventListener('contextmenu', (e) => e.preventDefault());

document.addEventListener('keydown', (e) => {
    if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
    ) {
        e.preventDefault();
    }
});

const TOTAL_MESAS = 12;
const HORARIOS_VALIDOS = ["11:30", "12:30", "13:30", "19:00", "20:00", "21:00"];

function obterReservas() {
    return JSON.parse(localStorage.getItem('reservasChurrasco')) || [];
}

function salvarReservas(lista) {
    localStorage.setItem('reservasChurrasco', JSON.stringify(lista));
}

function restauranteFechado() {
    return (localStorage.getItem('statusCasa') || 'ABERTO PARA RESERVAS') === 'FECHADO';
}

function mostrarBanner(elemento, mensagem, tipo) {
    if (!elemento) return;
    elemento.textContent = mensagem;
    elemento.className = 'banner-aviso ' + tipo;
    elemento.style.display = 'block';
}

function validarReserva(dados, idIgnorado) {
    const erros = [];

    const campoNome = document.getElementById('nome');

if (campoNome) {
    campoNome.addEventListener('input', () => {
        campoNome.value = campoNome.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
    });
}


    if (!dados.nome || dados.nome.trim().length === 0) {
        erros.push('O nome do cliente é obrigatório.');
    } else if (dados.nome.trim().length < 2) {
    erros.push('O nome deve ter pelo menos 2 caracteres.');
} else if (!/^[A-Za-zÀ-ÿ\s]+$/.test(dados.nome.trim())) {
    erros.push('O nome deve conter apenas letras.');
}

    if (!dados.telefone || dados.telefone.trim().length < 8) {
        erros.push('Informe um telefone válido (obrigatório).');
    }

    if (dados.email && dados.email.trim().length > 0) {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(dados.email.trim())) {
            erros.push('O e-mail informado não está em um formato válido.');
        }
    }

    if (!dados.data) {
        erros.push('A data da reserva é obrigatória.');
    } else {
        const dataEscolhida = new Date(dados.data + 'T00:00:00');
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        if (dataEscolhida < hoje) {
            erros.push('Não é possível cadastrar reservas para datas no passado.');
        }
    }

    if (!dados.horario || !HORARIOS_VALIDOS.includes(dados.horario)) {
        erros.push('Selecione um horário válido na lista.');
    }

    const pessoasNum = parseInt(dados.pessoas);
    if (isNaN(pessoasNum) || pessoasNum < 1 || pessoasNum > 30) {
        erros.push('O número de pessoas deve estar entre 1 e 30.');
    }

    if (dados.mesa !== undefined && !dados.mesa) {
        erros.push('Selecione uma mesa para a reserva.');
    }

    if (dados.obs && dados.obs.length > 200) {
        erros.push('As observações não podem ultrapassar 200 caracteres.');
    }

    if (dados.eAniversario && (!dados.nomeAniversariante || dados.nomeAniversariante.trim().length === 0)) {
        erros.push('Informe o nome do(a) homenageado(a) quando marcar ocasião especial.');
    }

    if (restauranteFechado()) {
        erros.push('O salão está fechado para novas reservas no momento.');
    }

    if (dados.mesa) {
        const conflito = obterReservas().some(r =>
            r.id !== idIgnorado &&
            r.mesa === dados.mesa &&
            r.data === dados.data &&
            r.horario === dados.horario &&
            r.status !== 'Cancelado'
        );
        if (conflito) {
            erros.push('Já existe uma reserva ativa para essa mesa nesse mesmo dia e horário.');
        }
    }

    return erros;
}

const dataReserva = document.getElementById('dataReserva');
if (dataReserva) {
    dataReserva.min = new Date().toISOString().split('T')[0];
}

const pessoasReserva = document.getElementById('pessoasReserva');
const btnMais = document.getElementById('btnMais');
const btnMenos = document.getElementById('btnMenos');

if (pessoasReserva && btnMais && btnMenos) {
    btnMais.addEventListener('click', () => {
        let val = parseInt(pessoasReserva.value);
        if (val < 30) pessoasReserva.value = val + 1;
    });

    btnMenos.addEventListener('click', () => {
        let val = parseInt(pessoasReserva.value);
        if (val > 1) pessoasReserva.value = val - 1;
    });
}

const ocasiaoEspecial = document.getElementById('ocasiaoEspecial');
const campoAniversariante = document.getElementById('campoAniversariante');

if (ocasiaoEspecial && campoAniversariante) {
    ocasiaoEspecial.addEventListener('change', () => {
        campoAniversariante.style.display = ocasiaoEspecial.checked ? 'block' : 'none';
    });
}

const reservaForm = document.getElementById('reservaForm');
if (reservaForm) {
    reservaForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const respostaEl = document.getElementById('formResposta');

        if (restauranteFechado()) {
            respostaEl.style.display = 'block';
            respostaEl.textContent = 'Lamentamos, mas as reservas online estão temporariamente fechadas no momento.';
            respostaEl.style.borderColor = 'var(--brasa-500)';
            return;
        }

        const nome = document.getElementById('nome').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const data = document.getElementById('dataReserva').value;
        const hora = document.getElementById('horarioReserva').value;
        const pessoas = document.getElementById('pessoasReserva').value;
        const eAniversario = document.getElementById('ocasiaoEspecial').checked;
        const aniversariante = document.getElementById('nomeAniversariante')?.value.trim();
        const obs = document.getElementById('observacoes')?.value.trim();

        if (!nome || !data || !telefone) {
            respostaEl.style.display = 'block';
            respostaEl.textContent = 'Por favor, preencha todos os campos obrigatórios.';
            respostaEl.style.borderColor = 'var(--brasa-500)';
            return;
        }

        if (nome.length < 2) {
    respostaEl.style.display = 'block';
    respostaEl.textContent = 'O nome deve ter pelo menos 2 caracteres.';
    respostaEl.style.borderColor = 'var(--brasa-500)';
    return;
}

if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome)) {
    respostaEl.style.display = 'block';
    respostaEl.textContent = 'O nome deve conter apenas letras.';
    respostaEl.style.borderColor = 'var(--brasa-500)';
    return;
}

        const dataSelecionada = new Date(`${data}T00:00:00`);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        if (dataSelecionada < hoje) {
            respostaEl.style.display = 'block';
            respostaEl.textContent = 'Não é possível realizar reservas para datas no passado. Escolha uma data válida.';
            respostaEl.style.borderColor = 'var(--brasa-500)';
            return;
        }

        const novaReserva = {
            id: Date.now(),
            nome: nome,
            telefone: telefone,
            email: '',
            mesa: '',
            data: data,
            horario: hora,
            dataHora: `${data} - ${hora}`,
            pessoas: parseInt(pessoas) || 1,
            eAniversario: eAniversario,
            obs: eAniversario ? `Aniversário (${aniversariante || 'Sem nome'})` : (obs || 'Nenhuma'),
            status: 'Pendente',
            origem: 'Online'
        };

        const reservasExistentes = obterReservas();
        reservasExistentes.push(novaReserva);
        salvarReservas(reservasExistentes);

        respostaEl.style.display = 'block';
        respostaEl.textContent = `Obrigado, ${nome}! Sua reserva para o dia ${data} foi enviada. Entraremos em contato para confirmar!`;
        respostaEl.style.borderColor = 'var(--dourado-400)';
        reservaForm.reset();
    });
}

function verificarAcessoAdmin() {
    const adminLogado = sessionStorage.getItem('adminLogado');
    if (adminLogado) return true;

    const usuario = prompt('Usuário Administrador (arthur, fabricio ou blajanik):');
    if (!usuario) return false;

    const usuarioFormatado = usuario.trim().toLowerCase();

    if (USUARIOS_ADMIN[usuarioFormatado]) {
        const senha = prompt(`Senha para o usuário ${usuarioFormatado}:`);
        if (senha === USUARIOS_ADMIN[usuarioFormatado]) {
            sessionStorage.setItem('adminLogado', usuarioFormatado);
            return true;
        } else {
            alert('Senha incorreta!');
            return false;
        }
    } else {
        alert('Usuário não encontrado!');
        return false;
    }
}

document.querySelectorAll('.nav-admin').forEach(link => {
    link.addEventListener('click', (e) => {
        if (!verificarAcessoAdmin()) {
            e.preventDefault();
        }
    });
});

const cadastroForm = document.getElementById('cadastroForm');
if (cadastroForm) {
    if (!verificarAcessoAdmin()) {
        window.location.href = 'index.html';
    }

    for (let i = 1; i <= TOTAL_MESAS; i++) {
        const opcaoCadastro = document.createElement('option');
        opcaoCadastro.value = 'Mesa ' + i;
        opcaoCadastro.textContent = 'Mesa ' + i;
        document.getElementById('cMesa').appendChild(opcaoCadastro);

        const opcaoEdicao = document.createElement('option');
        opcaoEdicao.value = 'Mesa ' + i;
        opcaoEdicao.textContent = 'Mesa ' + i;
        document.getElementById('eMesa').appendChild(opcaoEdicao);
    }

    document.getElementById('cData').min = new Date().toISOString().split('T')[0];

    const checkAniversarioAdmin = document.getElementById('cAniversario');
    const campoAniversarianteAdmin = document.getElementById('campoAniversarianteAdmin');
    checkAniversarioAdmin.addEventListener('change', () => {
        campoAniversarianteAdmin.style.display = checkAniversarioAdmin.checked ? 'block' : 'none';
    });

    const obsTextarea = document.getElementById('cObs');
    const contadorObs = document.getElementById('contadorObs');
    obsTextarea.addEventListener('input', () => {
        const tamanho = obsTextarea.value.length;
        contadorObs.textContent = tamanho + '/200 caracteres';
        contadorObs.classList.toggle('contador-obs-limite', tamanho > 180);
    });

    function carregarStatusCasa() {
        const status = localStorage.getItem('statusCasa') || 'ABERTO PARA RESERVAS';
        const badge = document.getElementById('statusCasaBadge');
        badge.textContent = status;
        badge.className = 'status-casa ' + (status.includes('ABERTO') ? 'aberto' : status.includes('LOTADO') ? 'lotado' : 'fechado');
        document.getElementById('avisoFechado').style.display = status === 'FECHADO' ? 'block' : 'none';
    }

    window.alterarStatusCasa = function (novoStatus) {
        localStorage.setItem('statusCasa', novoStatus);
        carregarStatusCasa();
    };

    window.atualizarPainel = function () {
        const reservas = obterReservas();
        const valorRodizioInput = document.getElementById('valorRodizio');

        let precoRodizio = 89.90;
        if (valorRodizioInput && valorRodizioInput.value) {
            const valorTratado = valorRodizioInput.value.toString().replace(',', '.');
            precoRodizio = parseFloat(valorTratado);
            if (isNaN(precoRodizio) || precoRodizio < 0) precoRodizio = 0;
        }

        const listaEspecial = document.getElementById('listaAtencaoEspecial');
        listaEspecial.innerHTML = '';

        let totalPessoasConfirmadas = 0;
        let confirmadas = 0;

        if (reservas.length === 0) {
            listaEspecial.innerHTML = '<li>Nenhum evento especial registrado.</li>';
        } else {
            reservas.forEach(reserva => {
                const qtdPessoas = parseInt(reserva.pessoas) || 0;

                if (reserva.status === 'Confirmado') {
                    confirmadas++;
                    totalPessoasConfirmadas += qtdPessoas;
                }

                if (reserva.eAniversario || (reserva.obs && reserva.obs !== 'Nenhuma')) {
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${reserva.nome}</strong> (${reserva.data || ''} ${reserva.horario || ''}): ${reserva.obs}`;
                    listaEspecial.appendChild(li);
                }
            });
            if (listaEspecial.children.length === 0) {
                listaEspecial.innerHTML = '<li>Nenhum evento especial registrado.</li>';
            }
        }

        const faturamento = totalPessoasConfirmadas * precoRodizio;

        document.getElementById('qtdTotal').textContent = reservas.length;
        document.getElementById('qtdConfirmadas').textContent = confirmadas;
        document.getElementById('qtdPessoas').textContent = totalPessoasConfirmadas;
        document.getElementById('faturamentoEstimado').textContent =
            `R$ ${faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    cadastroForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const dados = {
            nome: document.getElementById('cNome').value,
            telefone: document.getElementById('cTelefone').value,
            email: document.getElementById('cEmail').value,
            mesa: document.getElementById('cMesa').value,
            data: document.getElementById('cData').value,
            horario: document.getElementById('cHorario').value,
            pessoas: document.getElementById('cPessoas').value,
            eAniversario: checkAniversarioAdmin.checked,
            nomeAniversariante: document.getElementById('cNomeAniversariante').value,
            obs: obsTextarea.value
        };

        const resposta = document.getElementById('cadastroResposta');
        const erros = validarReserva(dados, null);

        if (erros.length > 0) {
            mostrarBanner(resposta, erros.join(' '), 'erro');
            return;
        }

        const novaReserva = {
            id: Date.now(),
            nome: dados.nome.trim(),
            telefone: dados.telefone.trim(),
            email: dados.email.trim(),
            mesa: dados.mesa,
            data: dados.data,
            horario: dados.horario,
            dataHora: `${dados.data} - ${dados.horario}`,
            pessoas: parseInt(dados.pessoas),
            eAniversario: dados.eAniversario,
            obs: dados.eAniversario ? `Aniversário (${dados.nomeAniversariante.trim()})` : (dados.obs.trim() || 'Nenhuma'),
            status: document.getElementById('cStatusInicial').value,
            origem: 'Balcão'
        };

        const reservas = obterReservas();
        reservas.push(novaReserva);
        salvarReservas(reservas);

        mostrarBanner(resposta, `Reserva de ${novaReserva.nome} cadastrada com sucesso na ${novaReserva.mesa}!`, 'sucesso');
        cadastroForm.reset();
        contadorObs.textContent = '0/200 caracteres';
        campoAniversarianteAdmin.style.display = 'none';
        atualizarPainel();
        renderConsulta();
    });

    const buscaTexto = document.getElementById('buscaTexto');
    const filtroStatus = document.getElementById('filtroStatus');
    const filtroData = document.getElementById('filtroData');
    const contadorResultados = document.getElementById('contadorResultados');
    const tabelaConsultaBody = document.getElementById('tabelaConsultaBody');
    let idParaExcluir = null;

    function renderConsulta() {
        const termo = buscaTexto.value.trim().toLowerCase();
        const status = filtroStatus.value;
        const data = filtroData.value;

        const resultado = obterReservas().filter(r => {
            const bateTexto = !termo || r.nome.toLowerCase().includes(termo) || r.telefone.includes(termo);
            const bateStatus = status === 'todos' || r.status === status;
            const bateData = !data || r.data === data;
            return bateTexto && bateStatus && bateData;
        });

        tabelaConsultaBody.innerHTML = '';

        if (resultado.length === 0) {
            tabelaConsultaBody.innerHTML = '<tr class="linha-vazia"><td colspan="7">Nenhuma reserva encontrada com esses critérios de busca.</td></tr>';
            contadorResultados.textContent = '0 reservas encontradas.';
            return;
        }

        contadorResultados.textContent = resultado.length + ' reserva(s) encontrada(s).';

        resultado.forEach(r => {
            const linha = document.createElement('tr');
            if (idParaExcluir === r.id) {
                linha.innerHTML = `
                    <td colspan="6">Confirma a exclusão da reserva de <strong>${r.nome}</strong>?</td>
                    <td>
                        <button class="btn-acao recusar" data-acao="confirmar-exclusao" data-id="${r.id}">Sim, excluir</button>
                        <button class="btn-acao" data-acao="cancelar-exclusao">Cancelar</button>
                    </td>
                `;
            } else {
                linha.innerHTML = `
                    <td><strong>${r.nome}</strong><br><small>${r.telefone}</small></td>
                    <td>${r.mesa || '-'}</td>
                    <td>${r.data ? r.data + ' - ' + r.horario : r.dataHora}</td>
                    <td>${r.pessoas}</td>
                    <td>${r.obs}</td>
                    <td><span class="status-badge ${r.status.toLowerCase()}">${r.status}</span></td>
                    <td>
                        <button class="btn-acao aprovar" data-acao="editar" data-id="${r.id}">Editar</button>
                        <button class="btn-acao recusar" data-acao="excluir" data-id="${r.id}">Excluir</button>
                    </td>
                `;
            }
            linha.addEventListener('mouseover', () => linha.classList.add('linha-destaque'));
            linha.addEventListener('mouseout', () => linha.classList.remove('linha-destaque'));
            tabelaConsultaBody.appendChild(linha);
        });
    }

    tabelaConsultaBody.addEventListener('click', (e) => {
        const botao = e.target.closest('button');
        if (!botao) return;
        const acao = botao.dataset.acao;
        const id = parseInt(botao.dataset.id);

        if (acao === 'excluir') {
            idParaExcluir = id;
            renderConsulta();
        } else if (acao === 'cancelar-exclusao') {
            idParaExcluir = null;
            renderConsulta();
        } else if (acao === 'confirmar-exclusao') {
            salvarReservas(obterReservas().filter(r => r.id !== id));
            idParaExcluir = null;
            renderConsulta();
            atualizarPainel();
        } else if (acao === 'editar') {
            abrirEdicao(id);
        }
    });

    buscaTexto.addEventListener('input', renderConsulta);
    filtroStatus.addEventListener('change', renderConsulta);
    filtroData.addEventListener('change', renderConsulta);

    buscaTexto.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            buscaTexto.value = '';
            renderConsulta();
        }
    });

    document.getElementById('btnLimparFiltros').addEventListener('click', () => {
        buscaTexto.value = '';
        filtroStatus.value = 'todos';
        filtroData.value = '';
        renderConsulta();
    });

    const painelEdicao = document.getElementById('painelEdicao');
    const editarForm = document.getElementById('editarForm');

    function abrirEdicao(id) {
        const reserva = obterReservas().find(r => r.id === id);
        if (!reserva) {
            mostrarBanner(document.getElementById('edicaoResposta'), 'Não foi possível localizar essa reserva. Ela pode já ter sido removida.', 'erro');
            painelEdicao.style.display = 'block';
            painelEdicao.scrollIntoView({ behavior: 'smooth' });
            return;
        }
        document.getElementById('eId').value = reserva.id;
        document.getElementById('eNome').value = reserva.nome;
        document.getElementById('eTelefone').value = reserva.telefone;
        document.getElementById('eData').value = reserva.data || '';
        document.getElementById('eHorario').value = reserva.horario || HORARIOS_VALIDOS[0];
        document.getElementById('ePessoas').value = reserva.pessoas;
        document.getElementById('eMesa').value = reserva.mesa || '';
        document.getElementById('eObs').value = reserva.obs === 'Nenhuma' ? '' : reserva.obs;
        document.getElementById('eStatus').value = reserva.status;
        painelEdicao.style.display = 'block';
        painelEdicao.scrollIntoView({ behavior: 'smooth' });
    }

    document.getElementById('btnCancelarEdicao').addEventListener('click', () => {
        painelEdicao.style.display = 'none';
        editarForm.reset();
    });

    editarForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = parseInt(document.getElementById('eId').value);
        const dados = {
            nome: document.getElementById('eNome').value,
            telefone: document.getElementById('eTelefone').value,
            data: document.getElementById('eData').value,
            horario: document.getElementById('eHorario').value,
            pessoas: document.getElementById('ePessoas').value,
            mesa: document.getElementById('eMesa').value,
            obs: document.getElementById('eObs').value,
            eAniversario: false,
            nomeAniversariante: ''
        };

        const resposta = document.getElementById('edicaoResposta');
        const erros = validarReserva(dados, id);

        if (erros.length > 0) {
            mostrarBanner(resposta, erros.join(' '), 'erro');
            return;
        }

        const reservas = obterReservas().map(r => {
            if (r.id === id) {
                return {
                    ...r,
                    nome: dados.nome.trim(),
                    telefone: dados.telefone.trim(),
                    data: dados.data,
                    horario: dados.horario,
                    mesa: dados.mesa,
                    dataHora: `${dados.data} - ${dados.horario}`,
                    pessoas: parseInt(dados.pessoas),
                    obs: dados.obs.trim() || 'Nenhuma',
                    status: document.getElementById('eStatus').value
                };
            }
            return r;
        });

        salvarReservas(reservas);
        mostrarBanner(resposta, 'Reserva atualizada com sucesso!', 'sucesso');
        renderConsulta();
        atualizarPainel();
        setTimeout(() => {
            painelEdicao.style.display = 'none';
        }, 1200);
    });

    carregarStatusCasa();
    atualizarPainel();
    renderConsulta();
}

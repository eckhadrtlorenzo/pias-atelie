// ==========================================
// 1. VARIÁVEIS GLOBAIS E BASE DE DADOS
// ==========================================

const API_URL = 'http://localhost:3000/api';
let produtosGlobais = [];

// Função do Menu Lateral
function toggleMenu() {
    const sidePanel = document.getElementById('sidePanel');
    if (sidePanel) {
        sidePanel.classList.toggle('open');
    }
}

const materiaisCelestine = [
    {
        id: "misterio",
        nome: "Veludo Negro de Buraco Negro",
        icone: "🌑",
        tag: "Alta Densidade",
        descricao: "Tecido de estrutura densa capaz de absorver 99% da luz ambiente. Projetado para trajes de alta imponência e presença marcante.",
        caimento: "Estruturado / Pesado",
        origem: "Órbita de Cygnus X-1",
        brilho: "0% (Absorção Total)",
        raridade: "Lendário"
    },
    {
        id: "brilho",
        nome: "Jacquard de Ouro Saturniano",
        icone: "🪐",
        tag: "Fios Metálicos",
        descricao: "Fios de titânio e microcristais trançados com fibras nobres. Reflete gradientes dourados vibrantes conforme a luz do ambiente oscila.",
        caimento: "Rígido / Imponente",
        origem: "Anéis Internos de Saturno",
        brilho: "95% (Reflexo Angular)",
        raridade: "Raro"
    },
    {
        id: "fluidez",
        nome: "Seda Flutuante de Nebulosa",
        icone: "✨",
        tag: "Gravidade Zero",
        descricao: "Seda ultraleve e translúcida que responde ao menor fluxo de ar, simulação visual contínua de gases cósmicos em flutuação.",
        caimento: "Esvoaçante / Ultra Leve",
        origem: "Nebulosa de Órion",
        brilho: "60% (Suave / Etéreo)",
        raridade: "Épico"
    },
    {
        id: "plasma",
        nome: "Manta Magnética Aurora",
        icone: "🌌",
        tag: "Termocrômico",
        descricao: "Tecido inteligente que altera sua tonalidade entre tons de lavanda e ciano de acordo com a temperatura corporal do tripulante.",
        caimento: "Moldável / Ajustável",
        origem: "Magnetosfera Polar",
        brilho: "80% (Iridescente)",
        raridade: "Exclusivo"
    },
    {
        id: "cristal",
        nome: "Tule de Poeira Estelar",
        icone: "💎",
        tag: "Transparência",
        descricao: "Tule finíssimo incrustado com micropartículas de quartzo estelar. Cria uma ilusão de constelações flutuando sobre a pele.",
        caimento: "Vaporoso / Delicado",
        origem: "Cinturão de Kuiper",
        brilho: "100% (Ponto de Luz)",
        raridade: "Raro"
    },
    {
        id: "couro",
        nome: "Couro Sintético de Asteroide",
        icone: "☄️",
        tag: "Escudo Térmico",
        descricao: "Textura em relevo tridimensional com acabamento fosco. Oferece visual futurista urbano e proteção contra variações térmicas.",
        caimento: "Firme / Esculpido",
        origem: "Ateliê Orbital 09",
        brilho: "15% (Acabamento Satim)",
        raridade: "Comum"
    }
];

const telasCelestine = {
    'orbita': null, 
    'admin' : `
    <section class="admin-dashboard-section" style="padding: 20px; max-width: 1200px; margin: 0 auto;">
        <div class="admin-header" style="text-align: center; margin-bottom: 30px;">
            <h2>🛸 Centro de Comando Orbital (Admin)</h2>
            <p>Gerenciamento de chamados, fluxo do mês e aprovação de encomendas.</p>
        </div>

        <!-- CARDS DE MÉTRICAS -->
        <div class="metrics-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
            <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; border: 1px solid var(--glass-border); text-align: center;">
                <small>Total de Pedidos</small>
                <h3 id="metric-total" style="font-size: 2em; margin: 5px 0;">0</h3>
            </div>
            <div style="background: rgba(255, 193, 7, 0.1); padding: 15px; border-radius: 8px; border: 1px solid #ffc107; text-align: center;">
                <small>⌛ Pendentes</small>
                <h3 id="metric-pendentes" style="font-size: 2em; margin: 5px 0; color: #ffc107;">0</h3>
            </div>
            <div style="background: rgba(40, 167, 69, 0.1); padding: 15px; border-radius: 8px; border: 1px solid #28a745; text-align: center;">
                <small>✅ Aprovados</small>
                <h3 id="metric-aprovados" style="font-size: 2em; margin: 5px 0; color: #28a745;">0</h3>
            </div>
        </div>

        <!-- PAINEL DUPLO: GRÁFICO E CALENDÁRIO -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; margin-bottom: 30px;">
            <!-- GRÁFICO -->
            <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 12px; border: 1px solid var(--glass-border);">
                <h3>📊 Distribuição dos Pedidos</h3>
                <canvas id="graficoPedidos" style="max-height: 250px;"></canvas>
            </div>

            <!-- CALENDÁRIO MENSAL -->
            <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 12px; border: 1px solid var(--glass-border);">
                <h3 id="titulo-calendario">🗓️ Calendário de Atendimento</h3>
                <div id="grid-calendario" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; margin-top: 15px; text-align: center;"></div>
            </div>
        </div>

        <!-- TABELA DE GESTÃO DE PEDIDOS -->
        <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 12px; border: 1px solid var(--glass-border);">
            <h3>📜 Pedidos Cadastrados</h3>
            <div id="tabela-pedidos-admin" style="margin-top: 15px; display: flex; flex-direction: column; gap: 10px;"></div>
        </div>

        <div style="text-align: center; margin-top: 30px;">
            <button class="btn-back-home" onclick="mudarTela('orbita')">🪐 Retornar à Órbita Inicial</button>
        </div>
    </section>
`,
    'login': `
        <section class="login-section">
            <div class="login-box">
                <div class="login-header">
                    <h2>Identificação de Tripulante</h2>
                    <p>Sincronize seus dados orbitais para acessar seus mantos cósmicos privados.</p>
                </div>
                <form id="form-login" onsubmit="autenticarTripulante(event)">
                    <div class="input-group">
                        <label for="login-nome">👤 Nome do Tripulante</label>
                        <input type="text" id="login-nome" required placeholder="Comandante Silva">
                    </div>
                    <div class="input-group">
                        <label for="login-email">📡 Frequência Digital Coordenada (E-mail)</label>
                        <input type="email" id="login-email" required placeholder="comandante@galaxia.com">
                    </div>
                    <button type="submit" class="btn-submit-login">Cadastrar / Autenticar Assinatura</button>
                </form>
                <div class="login-footer">
                    <button class="btn-back-home" onclick="mudarTela('orbita')">🪐 Retornar à Órbita Inicial</button>
                </div>
            </div>
        </section>
    `,

    'agendamento': `
        <section id="Agendamento" class="agendamento-section">
            <h3>🌙 Ciclos Lunares: Reservar Atendimento</h3>
            <p class="form-subtitle">Sincronize sua frequência para agendar o desenho e a confecção do seu pedido sob medida.</p>
            <form id="form-agendamento" onsubmit="processarAgendamentoEspacial(event)">
                <label for="nome">Nome do Tripulante:</label>
                <input type="text" id="nome" required placeholder="Ex: Comandante Silva">

                <label for="email">Frequência Digital (E-mail):</label>
                <input type="email" id="email" required placeholder="seu-canal@galaxia.com">

                <label for="Estilo">Estilo de Preferência do Pedido:</label>
                <select id="Estilo">
                    <option value="minimalista">🌘 Eclipse (Minimalista e Escuro)</option>
                    <option value="brilhante">🪐 Saturniano (Anéis e Camadas Extravagantes)</option>
                    <option value="futurista">✨ Via Láctea (Brilho Máximo e Cristais)</option>
                </select>

                <button type="submit">Transmitir Sinal do Pedido</button>
            </form>
            <div class="login-footer" style="margin-top: 30px; text-align: center;">
                <button class="btn-back-home" onclick="mudarTela('orbita')">🪐 Retornar à Órbita Inicial</button>
            </div>
        </section>
    `,

    'atelie': `
        <section class="atelie-page-section">
            <div class="atelie-container">
                <div class="atelie-header">
                    <h2>Nossa Filosofia Orbital</h2>
                    <p class="atelie-subtitle">Conectando corpos terrenos a galáxias de distância através do fio e da agulha.</p>
                </div>
                <div class="atelie-content-grid">
                    <div class="atelie-text-block">
                        <h3>🌌 Como Pensamos</h3>
                        <p>No Celestine Ateliê, nós acreditamos firmemente que a alta costura não deve se limitar às fronteiras da Terra. Cada silhueta que moldamos, cada tecido que cortamos e cada ponto que alinhamos nascem de um desejo profundo de desafiar a mesmice e orbitar na alta sociedade universal.</p>
                        <p>Nossa mente trabalha sintonizada na frequência dos mistérios cósmicos. Enxergamos constelações onde outros vêem apenas padrões de costura, e desenhamos trajes pensados para quem carrega o brilho estelar na alma.</p>
                    </div>
                    <div class="atelie-text-block">
                        <h3>✂️ Nossa Forma de Trabalhar</h3>
                        <p>Nossos processos unem o respeito à alfaiataria clássica tradicional com a inovação conceitual do design futurista. Não produzimos em massa. Confeccionamos exclusivamente <strong>peças únicas, artísticas e autorais</strong>.</p>
                        <p>Cada manto de luxo passa por uma triagem criativa minuciosa, onde analisamos a gravidade, a fluidez do movemento e o magnetismo do caimento no corpo. Vestir uma obra do Celestine é fazer um salto hiperespacial rumo à sua melhor versão.</p>
                    </div>
                </div>
                <div class="atelie-manifesto-highlight">
                    <p>"A distância entre os planetas é enorme, mas o poder da arte e do estilo consegue conectar mentes e criar constelações de sofisticação com um único fio de seda cósmica."</p>
                </div>
                <div style="text-align: center; margin-top: 50px;">
                    <button class="btn-back-home" onclick="mudarTela('orbita')">🪐 Retornar à Órbita Inicial</button>
                </div>
            </div>
        </section>
    `,

    'colecoes': `
        <section class="catalogo-exclusivo-section">
            <div class="catalogo-header">
                <h2>Boutique Interplanetária: Peças Únicas</h2>
                <p>Nossos mantos autorais confeccionados sob a gravidade sutil do cosmos. Peças exclusivas de alta costura prontas para órbita.</p>
            </div>
            
            <div id="galeria-p1" class="gallery galeria-orbital ativa"></div>
            <div id="galeria-p2" class="gallery galeria-orbital"></div>

            <div class="paginacao-container">
                <button type="button" id="btn-voltar-ciclo" class="btn-paginacao" onclick="alternarPaginaColecao(1)" disabled>◀ Ciclo Anterior</button>
                <span id="indicador-orbita" class="indicador-pagina">Órbita 1 de 2</span>
                <button type="button" id="btn-avancar-ciclo" class="btn-paginacao" onclick="alternarPaginaColecao(2)">Próximo Ciclo ▶</button>
            </div>

            <div style="text-align: center; margin-top: 40px;">
                <button class="btn-back-home" onclick="mudarTela('orbita')">🪐 Retornar à Órbita Inicial</button>
            </div>
        </section>
    `,

    'exploracao': `
        <section class="exploracao-section">
            <div class="exploracao-header">
                <h2>🛰️ Centro de Exploração Cósmica</h2>
                <p>Descubra a matéria-prima do universo e sintonize seu manto autoral ideal.</p>
            </div>

            <div class="quiz-card-container">
                <div class="quiz-header">
                    <h3>✨ Scanner da Aura & Estilo</h3>
                    <p>Responda às frequências orbitais para identificar seu estilo e o tecido perfeito para seu manto.</p>
                </div>

                <div id="quiz-corpo">
                    <form id="form-quiz" onsubmit="calcularResultadoQuiz(event)">
                        <div class="pergunta-group">
                            <label>1. Como você prefere se destacar em um evento na galáxia?</label>
                            <select id="p1" required>
                                <option value="" disabled selected>Selecione uma sintonia...</option>
                                <option value="misterio">Misterioso(a) e imponente como um Eclipse</option>
                                <option value="brilho">Radiante e expansivo(a) como uma Supernova</option>
                                <option value="fluidez">Elegante, fluido(a) e etéreo(a) como uma Nebulosa</option>
                            </select>
                        </div>

                        <div class="pergunta-group">
                            <label>2. Qual sensação tátil você busca em um traje de alta costura?</label>
                            <select id="p2" required>
                                <option value="" disabled selected>Selecione uma sensação...</option>
                                <option value="misterio">Veludo denso que absorve a luz e envolve o corpo</option>
                                <option value="brilho">Texturas metálicas com reflexos de poeira estelar</option>
                                <option value="fluidez">Seda leve que flutua como em gravidade zero</option>
                            </select>
                        </div>

                        <div class="pergunta-group">
                            <label>3. Qual o seu ambiente espacial dos sonhos?</label>
                            <select id="p3" required>
                                <option value="" disabled selected>Selecione seu destino...</option>
                                <option value="misterio">O horizonte de eventos de um buraco negro</option>
                                <option value="brilho">O centro iluminado da galáxia Via Láctea</option>
                                <option value="fluidez">Os anéis de poeira e cristais de Saturno</option>
                            </select>
                        </div>

                        <button type="submit" class="btn-submit-quiz">🚀 Iniciar Mapeamento da Órbita</button>
                    </form>
                </div>

                <div id="quiz-resultado" class="resultado-oculto" style="display: none;"></div>
            </div>

            <div class="materiais-guia-container">
                <div class="materiais-header">
                    <h3>🧪 Enciclopédia de Tecidos & Matéria-Prima</h3>
                    <p>Conheça a física e o caimento dos tecidos raros tecidos no ateliê.</p>
                </div>

                <div id="grid-materiais" class="materiais-grid"></div>
            </div>

            <div style="text-align: center; margin-top: 50px;">
                <button class="btn-back-home" onclick="mudarTela('orbita')">🪐 Retornar à Órbita Inicial</button>
            </div>
        </section>
    `
};

// ==========================================
// 2. INICIALIZAÇÃO E GERENCIAMENTO DE TELAS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    const mainEl = document.querySelector('main');
    if (mainEl) {
        telasCelestine['orbita'] = mainEl.innerHTML;
    }
    configurarGatilhosNavegacao();
    
    // Atualizar os links do menu lateral
    const linkPedidos = document.querySelector('aside#sidePanel a[href="#pedidos"]');
    if (linkPedidos) {
        linkPedidos.setAttribute('onclick', "event.preventDefault(); abrirCaixaDePedidos();");
    }

    const linkClientes = document.querySelector('aside#sidePanel a[href="#clientes"]');
    if (linkClientes) {
        linkClientes.setAttribute('onclick', "event.preventDefault(); abrirCaixaDeClientes();");
    }

    const linkAdmin = document.querySelector('a[href="#admin"]');
    if (linkAdmin) linkAdmin.setAttribute('onclick', "event.preventDefault(); mudarTela('admin');");
});

function configurarGatilhosNavegacao() {
    const btnLogin = document.querySelector('.btn-space-login');
    if (btnLogin) btnLogin.setAttribute('onclick', "mudarTela('login')");

    const linkOrbita = document.querySelector('nav.desktop-nav a[href="#inicio"]');
    if (linkOrbita) linkOrbita.setAttribute('onclick', "event.preventDefault(); mudarTela('orbita');");

    const linkAtelie = document.querySelector('nav.desktop-nav a[href="#atelie"]');
    if (linkAtelie) linkAtelie.setAttribute('onclick', "event.preventDefault(); mudarTela('atelie');");

    const linkCiclosLunares = document.querySelector('nav.desktop-nav a[href="#Agendamento"]');
    if (linkCiclosLunares) linkCiclosLunares.setAttribute('onclick', "event.preventDefault(); mudarTela('agendamento');");

    const linkExploracao = document.querySelector('nav.desktop-nav a[href="#Exploracao"]');
    if (linkExploracao) linkExploracao.setAttribute('onclick', "event.preventDefault(); mudarTela('exploracao');");

    const btnJornada = document.querySelector('.hero-content button');
    if (btnJornada) btnJornada.setAttribute('onclick', "mudarTela('login')");

    const linkColecoes = document.querySelector('nav.desktop-nav a[href="#colecoes"]');
    if (linkColecoes) linkColecoes.setAttribute('onclick', "event.preventDefault(); mudarTela('colecoes');");
}

function mudarTela(nomeDaTela) {
    const containerPrincipal = document.querySelector('main');
    
    if (telasCelestine[nomeDaTela]) {
        const sidePanel = document.getElementById('sidePanel');
        if (sidePanel && sidePanel.classList.contains('open')) {
            sidePanel.classList.remove('open');
        }

        containerPrincipal.style.opacity = 0;
        
        setTimeout(() => {
            containerPrincipal.innerHTML = telasCelestine[nomeDaTela];
            
            if (nomeDaTela === 'orbita') {
                configurarGatilhosNavegacao();
            } else if (nomeDaTela === 'colecoes') {
                carregarMantosDoJson();
            } else if (nomeDaTela === 'exploracao') {
                carregarGuiaMateriais();
            } else if (nomeDaTela === 'admin') {
                carregarPainelAdmin();
            }
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
            containerPrincipal.style.opacity = 1;
        }, 200);
    }
}

// ==========================================
// 3. COLEÇÕES E DETALHES DO PRODUTO
// ==========================================

async function carregarMantosDoJson() {
    try {
        const resposta = await fetch('produtos.json');
        produtosGlobais = await resposta.json();

        const p1 = document.getElementById('galeria-p1');
        const p2 = document.getElementById('galeria-p2');

        if (!p1 || !p2) return;

        p1.innerHTML = '';
        p2.innerHTML = '';

        produtosGlobais.forEach((produto, index) => {
            const descricaoTratada = produto.descricao.length > 100 
                ? produto.descricao.substring(0, 100) + '...' 
                : produto.descricao;

            const cardHTML = `
                <article class="product-item" onclick="verDetalhesProduto(${index})" style="cursor: pointer;">
                    <div class="product-thumb">
                        <img src="${produto.imagem}" alt="${produto.alt}">
                    </div>
                    <div class="product-info-block">
                        <h4>${produto.titulo}</h4>
                        <p class="product-description-text">${descricaoTratada}</p>
                        <div class="product-meta-details" style="margin-bottom: 15px; font-size: 0.9rem; opacity: 0.8;">
                            <span>💰 ${produto.preco}</span> | <span>⏳ ${produto.tempo}</span>
                        </div>
                        <button type="button" class="btn-buy" onclick="event.stopPropagation(); verDetalhesProduto(${index})">
                            ✨ Ver Detalhes & Reservar
                        </button>
                    </div>
                </article>
            `;

            if (index < 9) {
                p1.innerHTML += cardHTML;
            } else {
                p2.innerHTML += cardHTML;
            }
        });
    } catch (erro) {
        console.error('Erro ao sintonizar o arquivo JSON de mantos:', erro);
    }
}

function verDetalhesProduto(index) {
    const produto = produtosGlobais[index];
    if (!produto) return;

    const containerPrincipal = document.querySelector('main');
    const precoEstimado = produto.preco || "R$ 1.850,00 - R$ 2.400,00 (Sob Medida)";
    const tempoConfeccao = produto.tempo || "15 a 20 Dias Orbitais";

    const htmlDetalhes = `
        <section class="produto-detalhe-section">
            <button class="btn-back-home" style="margin-bottom: 25px;" onclick="mudarTela('colecoes')">
                ◀ Voltar às Coleções
            </button>

            <div class="produto-detalhe-grid">
                <div class="detalhe-imagem-container">
                    <img src="${produto.imagem}" alt="${produto.alt}" class="detalhe-img-principal detalhe-img-fixa">
                    <div class="detalhe-badge-selo">🌌 Peça Autoral Exclusiva</div>
                </div>

                <div class="detalhe-info-container">
                    <span class="detalhe-categoria">Boutique Interplanetária</span>
                    <h2>${produto.titulo}</h2>
                    
                    <div class="detalhe-preco-box">
                        <span class="preco-label">Investimento Médio Estimado:</span>
                        <h3 class="preco-valor">${precoEstimado}</h3>
                    </div>

                    <p class="detalhe-descricao-longa">
                        ${produto.descricao} Confeccionado com técnicas de alfaiataria de alta precisão e modelagem ergonômica ajustada às frequências de movimento do tripulante.
                    </p>

                    <div class="detalhe-especificacoes">
                        <div class="espec-item">
                            <span>⏳ <strong>Tempo de Confecção:</strong></span>
                            <span>${tempoConfeccao}</span>
                        </div>
                        <div class="espec-item">
                            <span>✂️ <strong>Ajustes:</strong></span>
                            <span>Provas Presenciais / Virtuais</span>
                        </div>
                        <div class="espec-item">
                            <span>📡 <strong>Atendimento:</strong></span>
                            <span>Personal Stylist Dedicado</span>
                        </div>
                    </div>

                    <div class="detalhe-acoes-group">
                        <button type="button" class="btn-submit-quiz" onclick="iniciarAgendamentoComProduto('${produto.titulo}')">
                            🌙 Agendar Prova & Medidas Desta Peça
                        </button>
                        
                        <button type="button" class="btn-interagir-material" style="margin-top: 12px; padding: 14px;" onclick="acionarAtendimentoPersonalizado('${produto.titulo}')">
                            💬 Acionar Atendimento do Ateliê (WhatsApp)
                        </button>
                    </div>
                </div>
            </div>
        </section>
    `;

    containerPrincipal.style.opacity = 0;
    setTimeout(() => {
        containerPrincipal.innerHTML = htmlDetalhes;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        containerPrincipal.style.opacity = 1;
    }, 200);
}

function alternarPaginaColecao(numeroPagina) {
    const p1 = document.getElementById('galeria-p1');
    const p2 = document.getElementById('galeria-p2');
    const btnVoltar = document.getElementById('btn-voltar-ciclo');
    const btnAvancar = document.getElementById('btn-avancar-ciclo');
    const indicador = document.getElementById('indicador-orbita');

    if (!p1 || !p2) return;

    if (numeroPagina === 2) {
        p1.classList.remove('ativa');
        setTimeout(() => {
            p2.classList.add('ativa');
            indicador.textContent = "Órbita 2 de 2";
            if (btnVoltar) btnVoltar.removeAttribute('disabled');
            if (btnAvancar) btnAvancar.setAttribute('disabled', 'true');
        }, 250);
    } else {
        p2.classList.remove('ativa');
        setTimeout(() => {
            p1.classList.add('ativa');
            indicador.textContent = "Órbita 1 de 2";
            if (btnVoltar) btnVoltar.setAttribute('disabled', 'true');
            if (btnAvancar) btnAvancar.removeAttribute('disabled');
        }, 250);
    }

    const topoBoutique = document.querySelector('.catalogo-header');
    if (topoBoutique) {
        topoBoutique.scrollIntoView({ behavior: 'smooth' });
    }
}

function iniciarAgendamentoComProduto(nomeProduto) {
    mudarTela('agendamento');
    setTimeout(() => {
        alert(`✨ Manto "${nomeProduto}" selecionado! Complete o formulário para agendar sua sessão de confecção.`);
    }, 300);
}

function acionarAtendimentoPersonalizado(nomeProduto) {
    const message = encodeURIComponent(`Olá, equipe Celestine Ateliê! Gostaria de mais detalhes e atendimento sobre o manto: ${nomeProduto}`);
    const urlWhatsapp = `https://api.whatsapp.com/send?phone=5541999999999&text=${message}`;
    window.open(urlWhatsapp, '_blank');
}

// ==========================================
// 4. EXPLORAÇÃO, QUIZ E MATERIAIS
// ==========================================

function carregarGuiaMateriais() {
    const grid = document.getElementById('grid-materiais');
    if (!grid) return;

    grid.innerHTML = '';

    materiaisCelestine.forEach(mat => {
        const raridadeClasse = mat.raridade ? mat.raridade.toLowerCase() : 'comum';

        grid.innerHTML += `
            <article class="material-card">
                <div class="material-card-header">
                    <span class="material-badge ${raridadeClasse}">${mat.raridade || 'Raro'}</span>
                    <span class="material-tag">${mat.tag || 'Exclusivo'}</span>
                </div>

                <div class="material-icon">${mat.icone}</div>
                <h4>${mat.nome}</h4>
                <p class="material-desc">${mat.descricao}</p>

                <div class="material-specs-grid">
                    <div class="spec-item">
                        <span class="spec-label">Caimento</span>
                        <span class="spec-value">${mat.caimento}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Origem</span>
                        <span class="spec-value">${mat.origem}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Luminosidade</span>
                        <span class="spec-value">${mat.brilho || '100%'}</span>
                    </div>
                </div>

                <button type="button" class="btn-interagir-material" onclick="alert('⚡ Sintonizando amostra tátil de ${mat.nome}...')">
                    🔍 Examinar Textura
                </button>
            </article>
        `;
    });
}

function calcularResultadoQuiz(event) {
    event.preventDefault();

    const p1 = document.getElementById('p1').value;
    const p2 = document.getElementById('p2').value;
    const p3 = document.getElementById('p3').value;

    const contagem = { misterio: 0, brilho: 0, fluidez: 0 };
    contagem[p1]++;
    contagem[p2]++;
    contagem[p3]++;

    let perfilVencedor = 'misterio';
    if (contagem.brilho > contagem[perfilVencedor]) perfilVencedor = 'brilho';
    if (contagem.fluidez > contagem[perfilVencedor]) perfilVencedor = 'fluidez';

    const materialRecomendado = materiaisCelestine.find(m => m.id === perfilVencedor) || materiaisCelestine[0];

    const titulosEstilo = {
        misterio: "🌘 Aura Eclipse (Misteriosa & Sóbria)",
        brilho: "🪐 Aura Saturniana (Extravagante & Magnética)",
        fluidez: "✨ Aura Etérea (Fluida & Iluminada)"
    };

    const containerResultado = document.getElementById('quiz-resultado');
    const corpoQuiz = document.getElementById('quiz-corpo');

    corpoQuiz.style.display = 'none';

    containerResultado.innerHTML = `
        <div class="resultado-box">
            <h4>Seu Mapeamento Orbital:</h4>
            <h2 class="estilo-titulo">${titulosEstilo[perfilVencedor]}</h2>
            
            <div class="tecido-recomendado-card">
                <p><strong>Tecido Estelar Recomendado para a sua Aura:</strong></p>
                <h3>${materialRecomendado.icone} ${materialRecomendado.nome}</h3>
                <p>${materialRecomendado.descricao}</p>
            </div>

            <div class="resultado-acoes">
                <button type="button" class="btn-submit-login" onclick="mudarTela('agendamento')">🌙 Agendar Manto com este Tecido</button>
                <button type="button" class="btn-back-home" style="margin-top: 10px;" onclick="refazerQuiz()">🔄 Refazer Scanner</button>
            </div>
        </div>
    `;

    containerResultado.style.display = 'block';
}

function refazerQuiz() {
    document.getElementById('quiz-corpo').style.display = 'block';
    document.getElementById('quiz-resultado').style.display = 'none';
    document.getElementById('form-quiz').reset();
}

// ==========================================
// 5. ENVIO DE FORMULÁRIOS & AUTENTICAÇÃO
// ==========================================

async function processarAgendamentoEspacial(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const estilo = document.getElementById('Estilo').value;

    try {
        const resposta = await fetch(`${API_URL}/pedidos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, estilo })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            alert('🚀 Pedido gravado no banco SQLite com sucesso!');
            mudarTela('orbita');
        } else {
            alert(`❌ Erro ao salvar o pedido: ${dados.erro || 'Erro desconhecido'}`);
        }
    } catch (erro) {
        alert('❌ Falha na conexão com o servidor Node.js.');
    }
}

async function autenticarTripulante(event) {
    event.preventDefault();
    const nome = document.getElementById('login-nome').value;
    const email = document.getElementById('login-email').value;

    try {
        const resposta = await fetch(`${API_URL}/clientes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            alert(`⚡ Tripulante ${nome} cadastrado/autenticado com sucesso!`);
            mudarTela('orbita');
        } else {
            alert(`⚠️ aviso: ${dados.erro}`);
        }
    } catch (erro) {
        alert('❌ Falha ao conectar ao servidor Node.js.');
    }
}

// ==========================================
// 6. EFEITOS VISUAIS E ANIMAÇÕES
// ==========================================

window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (!header) return;
    
    if (window.scrollY > 50) {
        header.style.padding = '14px 6%';
        header.style.background = 'rgba(25, 27, 34, 0.96)';
        header.style.borderBottom = '1px solid var(--saturn-gold-dim)';
        header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
    } else {
        header.style.padding = '22px 6%';
        header.style.background = 'rgba(38, 41, 52, 0.92)';
        header.style.borderBottom = '1px solid var(--glass-border)';
        header.style.boxShadow = 'none';
    }
});

document.addEventListener('mousemove', (e) => {
    const star = document.createElement('div');
    star.innerHTML = '✦';
    star.style.position = 'fixed';
    star.style.left = e.clientX + 'px';
    star.style.top = e.clientY + 'px';
    star.style.pointerEvents = 'none';
    star.style.color = Math.random() > 0.5 ? 'var(--saturn-gold)' : 'var(--lavender-glow)';
    star.style.fontSize = Math.random() * (14 - 6) + 6 + 'px';
    star.style.opacity = '0.8';
    star.style.transition = 'all 0.8s ease-out';
    star.style.zIndex = '9999';
    star.style.transform = 'translate(-50%, -50%)';

    document.body.appendChild(star);

    setTimeout(() => {
        star.style.transform = 'translate(-50%, -50%) translateY(30px) scale(0)';
        star.style.opacity = '0';
    }, 50);

    setTimeout(() => {
        star.remove();
    }, 800);
});

// ==========================================
// 7. CONSULTAS AO BANCO DE DADOS (MODAIS)
// ==========================================

async function abrirCaixaDePedidos() {
    toggleMenu(); 
    const modal = document.getElementById('modalPedidos');
    if (modal) modal.style.display = 'flex';

    await carregarPedidosDoBanco();
}

function fecharModalPedidos() {
    const modal = document.getElementById('modalPedidos');
    if (modal) modal.style.display = 'none';
}

async function carregarPedidosDoBanco() {
    const container = document.getElementById('lista-pedidos-container');
    if (!container) return;

    try {
        const resposta = await fetch(`${API_URL}/pedidos`);
        const pedidos = await resposta.json();

        if (!pedidos || pedidos.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding: 20px;">Nenhum pedido registrado no cosmos ainda.</p>';
            return;
        }

        container.innerHTML = pedidos.map(p => {
            const statusAtual = p.status || 'Pendente';
            const classeStatus = statusAtual.toLowerCase();

            return `
                <div class="card-pedido-item">
                    <div class="pedido-id">#${p.id}</div>
                    <div class="pedido-dados">
                        <strong>${p.nome_cliente || p.nome}</strong>
                        <span>📡 ${p.email}</span>
                        <small>✨ Estilo: ${p.estilo}</small>
                    </div>
                    <span class="badge-status ${classeStatus}">${statusAtual}</span>
                </div>
            `;
        }).join('');
    } catch (erro) {
        console.error('Erro ao carregar pedidos:', erro);
        container.innerHTML = '<p style="color: #ff6b6b; text-align: center;">Erro ao conectar com o banco SQLite.</p>';
    }
}

async function abrirCaixaDeClientes() {
    if (typeof toggleMenu === 'function') toggleMenu();
    const modal = document.getElementById('modalClientes');
    if (modal) modal.style.display = 'flex';

    await carregarClientesDoBanco();
}

function fecharModalClientes() {
    const modal = document.getElementById('modalClientes');
    if (modal) modal.style.display = 'none';
}

async function carregarClientesDoBanco() {
    const container = document.getElementById('lista-clientes-container');
    if (!container) return;

    try {
        const resposta = await fetch(`${API_URL}/clientes`);
        const clientes = await resposta.json();

        if (!clientes.length) {
            container.innerHTML = '<p style="text-align:center; padding: 20px;">Nenhum cliente cadastrado no site ainda.</p>';
            return;
        }

        container.innerHTML = clientes.map(c => `
            <div class="card-pedido-item">
                <div class="pedido-id">#${c.id}</div>
                <div class="pedido-dados">
                    <strong>${c.nome}</strong>
                    <span>✉️ E-mail: ${c.email}</span>
                </div>
            </div>
        `).join('');
    } catch (erro) {
        container.innerHTML = '<p style="color: #ff6b6b; text-align: center;">Erro ao consultar a lista de clientes.</p>';
    }
}

async function carregarPainelAdmin() {
    await carregarMetricasEGrafico();
    await carregarTabelaAdmin();
    gerarCalendarioOrbital();
}

async function carregarMetricasEGrafico() {
    try {
        const res = await fetch(`${API_URL}/admin/estatisticas`);
        const dados = await res.json();

        document.getElementById('metric-total').innerText = dados.total || 0;
        document.getElementById('metric-pendentes').innerText = dados.pendentes || 0;
        document.getElementById('metric-aprovados').innerText = dados.aprovados || 0;

        const ctx = document.getElementById('graficoPedidos');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Pendentes', 'Aprovados', 'Recusados'],
                datasets: [{
                    data: [dados.pendentes || 0, dados.aprovados || 0, dados.recusados || 0],
                    backgroundColor: ['#ffc107', '#28a745', '#dc3545'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: '#ffffff' } }
                }
            }
        });
    } catch (err) {
        console.error('Erro ao carregar estatísticas:', err);
    }
}

async function carregarTabelaAdmin() {
    const container = document.getElementById('tabela-pedidos-admin');
    if (!container) return;

    try {
        const res = await fetch(`${API_URL}/pedidos`);
        const pedidos = await res.json();

        if (!pedidos || pedidos.length === 0) {
            container.innerHTML = '<p style="text-align:center;">Nenhum pedido encontrado no banco de dados.</p>';
            return;
        }

        container.innerHTML = pedidos.map(p => {
            const statusAtual = p.status || 'Pendente';
            const classeStatus = statusAtual.toLowerCase();

            return `
                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 12px; border-radius: 8px; margin-bottom: 8px; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <strong>#${p.id} - ${p.nome_cliente || p.nome}</strong> (${p.email})<br>
                        <small>✨ Estilo: ${p.estilo} | Status: <span class="badge-status ${classeStatus}">${statusAtual}</span></small>
                    </div>
                    <div style="display: flex; gap: 6px;">
                        <button onclick="atualizarStatusPedido(${p.id}, 'Aprovado')" style="background: #28a745; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;">✅ Aprovar</button>
                        <button onclick="atualizarStatusPedido(${p.id}, 'Recusado')" style="background: #dc3545; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;">❌ Recusar</button>
                        <button onclick="atualizarStatusPedido(${p.id}, 'Pendente')" style="background: rgba(255,255,255,0.1); color: #ffc107; border: 1px solid #ffc107; padding: 6px 10px; border-radius: 4px; cursor: pointer;">⏳ Pendente</button>
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error('Erro ao buscar pedidos:', err);
        container.innerHTML = '<p style="color: #ff6b6b;">Erro ao carregar lista de pedidos.</p>';
    }
}

async function atualizarStatusPedido(id, novoStatus) {
    try {
        const res = await fetch(`${API_URL}/pedidos/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: novoStatus })
        });

        if (res.ok) {
            alert(`Pedido #${id} ${novoStatus} com sucesso!`);
            carregarPainelAdmin();
        } else {
            alert('Erro ao atualizar o status.');
        }
    } catch (err) {
        alert('Falha na conexão com o servidor.');
    }
}

function gerarCalendarioOrbital() {
    const container = document.getElementById('grid-calendario');
    const titulo = document.getElementById('titulo-calendario');
    if (!container) return;

    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = agora.getMonth();

    const nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    titulo.innerText = `🗓️ ${nomesMeses[mes]} / ${ano}`;

    const diasNoMes = new Date(ano, mes + 1, 0).getDate();
    const hoje = agora.getDate();

    let html = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => `<strong style="font-size:0.8em; opacity:0.7;">${d}</strong>`).join('');

    for (let dia = 1; dia <= diasNoMes; dia++) {
        const isHoje = dia === hoje;
        const bg = isHoje ? 'var(--saturn-gold, #ffd700)' : 'rgba(255,255,255,0.05)';
        const corTexto = isHoje ? '#000' : '#fff';

        html += `<div style="background: ${bg}; color: ${corTexto}; padding: 8px 0; border-radius: 4px; font-weight: bold; font-size: 0.9em;">${dia}</div>`;
    }

    container.innerHTML = html;
}

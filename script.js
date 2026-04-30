// --- FUNÇÃO DO BOTÃO DE PING ---
document.getElementById('refresh-btn').addEventListener('click', function() {
    const cards = document.querySelectorAll('.card');
    const logList = document.getElementById('event-log');
    const btn = this;

    btn.disabled = true;
    btn.textContent = "Pingando ativos...";
    logList.innerHTML = "";

    cards.forEach((card, index) => {
        setTimeout(() => {
            const indicator = card.querySelector('.indicator');
            const label = card.querySelector('.label');
            const ip = card.querySelector('.ip').textContent;
            const deviceName = card.querySelector('h2').textContent;
            
            const isOnline = Math.random() > 0.2;
            const timestamp = new Date().toLocaleTimeString();

            if (isOnline) {
                indicator.className = "indicator online";
                label.textContent = "Online - Estável";
                card.style.borderLeftColor = "var(--success)";
                adicionarLog(`[${timestamp}] SUCCESS: ${deviceName} (${ip}) respondeu ao ICMP Echo Request.`, "success");
            } else {
                indicator.className = "indicator offline";
                label.textContent = "Offline - Sem Resposta";
                card.style.borderLeftColor = "var(--danger)";
                adicionarLog(`[${timestamp}] ALERT: Time-out no ${deviceName} (${ip}). Possível queda de serviço.`, "danger");
            }

            if (index === cards.length - 1) {
                btn.disabled = false;
                btn.textContent = "Verificar Status da Rede (Ping)";
            }
        }, index * 600);
    });
});

// --- FUNÇÃO DO LOG DE AUDITORIA ---
function adicionarLog(mensagem, tipo) {
    const logList = document.getElementById('event-log');
    const novoItem = document.createElement('li');
    novoItem.textContent = mensagem;
    
    if (tipo === "danger") {
        novoItem.style.color = "var(--danger)";
        novoItem.style.fontWeight = "bold";
    }
    logList.prepend(novoItem);
}

// --- FUNÇÃO DA CALCULADORA DE IP ---
document.getElementById('calc-btn').addEventListener('click', function() {
    const ipInput = document.getElementById('ip-input');
    const resultDiv = document.getElementById('ip-result');
    const ip = ipInput.value.trim();
    
    const regexIP = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if (!regexIP.test(ip)) {
        resultDiv.textContent = "Erro: Digite um IPv4 válido (ex: 192.168.0.1).";
        resultDiv.style.color = "var(--danger)";
        return;
    }

    const partes = ip.split('.');
    const primeiroOcteto = parseInt(partes[0]);
    const segundoOcteto = parseInt(partes[1]);

    let classe = "";
    if (primeiroOcteto <= 127) classe = "A";
    else if (primeiroOcteto <= 191) classe = "B";
    else if (primeiroOcteto <= 223) classe = "C";
    else classe = "D/E (Reservada)";

    let ePrivado = false;
    if (primeiroOcteto === 10) ePrivado = true;
    if (primeiroOcteto === 172 && segundoOcteto >= 16 && segundoOcteto <= 31) ePrivado = true;
    if (primeiroOcteto === 192 && segundoOcteto === 168) ePrivado = true;

    let tipo = ePrivado ? "Privado (LAN)" : "Público (WAN)";

    resultDiv.innerHTML = `
        <p><strong>Resultado da Auditoria:</strong></p>
        <p>Classe: ${classe} | Tipo: ${tipo}</p>
        <p><small>Indicação: Rede ${ePrivado ? 'Interna' : 'Externa (Internet)'}.</small></p>
    `;
    resultDiv.style.color = "var(--primary)";
});


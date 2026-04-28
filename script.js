document.getElementById('refresh-btn').addEventListener('click', function() {
    const cards = document.querySelectorAll('.card');
    const logList = document.getElementById('event-log');
    const btn = this;

    // Desativa o botão temporariamente (Simula o tempo de resposta da rede)
    btn.disabled = true;
    btn.textContent = "Pingando ativos...";

    // Limpa o log inicial para novos registros
    logList.innerHTML = "";

    cards.forEach((card, index) => {
        // Simula um atraso aleatório para cada dispositivo (Redes não são instantâneas)
        setTimeout(() => {
            const indicator = card.querySelector('.indicator');
            const label = card.querySelector('.label');
            const ip = card.querySelector('.ip').textContent;
            const deviceName = card.querySelector('h2').textContent;
            
            // Lógica de Redes: Simula probabilidade de 80% Online e 20% queda (instabilidade)
            const isOnline = Math.random() > 0.2;
            const timestamp = new Date().toLocaleTimeString();

            // Atualiza o Visual do Card
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

            // Se for o último card, reativa o botão
            if (index === cards.length - 1) {
                btn.disabled = false;
                btn.textContent = "Verificar Status da Rede (Ping)";
            }

        }, index * 600); // Cada card "responde" com 600ms de diferença
    });
});

// Função para criar o Log de Auditoria
function adicionarLog(mensagem, tipo) {
    const logList = document.getElementById('event-log');
    const novoItem = document.createElement('li');
    novoItem.textContent = mensagem;
    
    if (tipo === "danger") {
        novoItem.style.color = "var(--danger)";
        novoItem.style.fontWeight = "bold";
    }
    
    logList.prepend(novoItem); // Adiciona no topo da lista (mais recente primeiro)
}

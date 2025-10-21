document.addEventListener('DOMContentLoaded', function() {
    
    // ===============================================
    // LÓGICA DO WHATSAPP
    // ===============================================
    
    // 1. ALTERE PARA O SEU NÚMERO REAL (Ex: 5511987654321)
    const seuNumero = '554799576292'; 
    // NOVA MENSAGEM PADRÃO
    const mensagemPadrao = 'Olá! Gostaria de saber mais sobre a Laserterapia e/ou agendar uma avaliação (humana ou pet).';

    // Codifica a mensagem para URLs
    const mensagemCodificada = encodeURIComponent(mensagemPadrao);
    const whatsappLink = `https://api.whatsapp.com/send?phone=${seuNumero}&text=${mensagemCodificada}`;

    // 2. Seleciona todos os botões e links que devem levar ao WhatsApp
    const ctaButtons = [
        document.getElementById('whatsapp-float'),
        document.getElementById('cta-hero'),
        document.getElementById('cta-laser-mid'), // Novo botão da seção Laser
        document.getElementById('cta-footer')
    ];

    // 3. Adiciona o link e o evento de clique para cada elemento
    ctaButtons.forEach(button => {
        if (button) {
            button.setAttribute('href', whatsappLink);
            button.setAttribute('target', '_blank'); // Abre em nova aba
        }
    });

    // ===============================================
    // LÓGICA DO CARROSSEL DE DEPOIMENTOS INFINITO
    // ===============================================

    const carousel = document.getElementById('testimonials-carousel');
    const cards = carousel ? carousel.querySelectorAll('.testimonial-card') : null;

    if (carousel && cards && cards.length > 1) {
        
        // Clona os primeiros 3 cards para criar a ilusão de loop infinito
        const cardsToCloneCount = Math.min(cards.length, 3);
        for (let i = 0; i < cardsToCloneCount; i++) {
            const clone = cards[i].cloneNode(true);
            carousel.appendChild(clone);
        }

        const scrollAmount = cards[0].offsetWidth + 20; // Largura do card + margin-right
        // Calcula a largura que representa o final dos itens originais (aproximadamente a metade)
        const totalOriginalWidth = cards.length * (cards[0].offsetWidth + 20);

        function startCarouselScroll() {
            
            // Faz a rolagem suave
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });

            // Verifica se a rolagem passou do último item original para um dos clones
            // O delay é crucial para que a rolagem suave termine antes do reset
            if (carousel.scrollLeft + carousel.clientWidth >= totalOriginalWidth) {
                
                setTimeout(() => {
                    // Reseta a rolagem para o início sem animação ('auto')
                    carousel.scrollLeft = 0;
                }, 500); // Aguarda 500ms (tempo para a transição suave terminar)
            }
        }
        
        // Define o intervalo para a rolagem (a cada 4 segundos)
        setInterval(startCarouselScroll, 4000); 
    }
});
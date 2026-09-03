document.addEventListener('DOMContentLoaded', function() {
    
    // ===============================================
    // LÓGICA DO WHATSAPP
    // ===============================================
    
    // 1. ALTERE PARA O SEU NÚMERO REAL (Ex: 5511987654321)
    const seuNumero = '554799576292'; 
    // NOVA MENSAGEM PADRÃO
    const mensagemPadrao = 'Olá! Gostaria de saber mais sobre a Laserterapia e/ou agendar uma avaliação.';

    // Codifica a mensagem para URLs
    const mensagemCodificada = encodeURIComponent(mensagemPadrao);
    const whatsappLink = `https://api.whatsapp.com/send?phone=${seuNumero}&text=${mensagemCodificada}`;

    // 2. Mapeia cada botão ao seu identificador (usado no rastreamento do GTM)
    const ctaButtonLocations = {
        'whatsapp-float': 'flutuante',
        'cta-hero': 'hero',
        'cta-laser-mid': 'laserterapia',
        'cta-footer': 'cta_final'
    };

    const ctaButtons = Object.keys(ctaButtonLocations)
        .map(id => document.getElementById(id))
        .filter(Boolean);

    // 3. Adiciona o link, o evento de clique e o disparo do evento no dataLayer (GTM)
    window.dataLayer = window.dataLayer || [];

    ctaButtons.forEach(button => {
        button.setAttribute('href', whatsappLink);
        button.setAttribute('target', '_blank'); // Abre em nova aba

        button.addEventListener('click', function() {
            window.dataLayer.push({
                event: 'whatsapp_click',
                button_location: ctaButtonLocations[button.id]
            });
        });
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

    // ===============================================
    // LÓGICA DA GALERIA DO CONSULTÓRIO (MANUAL)
    // ===============================================

    const facilityGallery = document.getElementById('facility-gallery');
    const facilityNextBtn = document.getElementById('facility-next');

    if (facilityGallery && facilityNextBtn) {
        facilityNextBtn.addEventListener('click', function() {
            const firstPhoto = facilityGallery.querySelector('.facility-photo');
            const scrollAmount = firstPhoto ? firstPhoto.offsetWidth + 20 : 280; // Largura do card + gap
            const maxScroll = facilityGallery.scrollWidth - facilityGallery.clientWidth;

            if (facilityGallery.scrollLeft >= maxScroll - 5) {
                // Chegou ao fim: volta para o início
                facilityGallery.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                facilityGallery.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        });
    }
});
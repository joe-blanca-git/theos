document.addEventListener('DOMContentLoaded', () => {
    const API_BLOG = "https://portaltheos.com.br/landing-api/api/v1/BlogPosts";
    const gridContainer = document.getElementById('homeBlogGrid');
    const emptyState = document.getElementById('homeEmptyState');
    const btnSeeAll = document.getElementById('btnSeeAllBlog');

    // Generate slug from title
    function createSlug(title) {
        if (!title) return 'artigo';
        return title.toString().toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
            .replace(/\s+/g, '-') // spaces to dashes
            .replace(/[^\w\-]+/g, '') // remove non-word chars
            .replace(/\-\-+/g, '-') // replace multiple dashes
            .replace(/^-+/, '') // trim starting dash
            .replace(/-+$/, ''); // trim ending dash
    }

    // Extract text from HTML and truncate
    function getExcerpt(html, maxLength) {
        if (!html) return '';
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        let text = tmp.textContent || tmp.innerText || '';
        text = text.trim();
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    }

    // Parse tags string into array
    function parseTags(tagString) {
        if (!tagString) return [];
        return tagString.split(',').map(t => t.trim()).filter(t => t);
    }

    // Format date
    function formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    async function fetchLatestPosts() {
        // Show skeleton loading
        gridContainer.innerHTML = Array(3).fill(0).map(() => `
            <div class="col">
                <div class="card h-100 border-0 bg-white shadow-sm overflow-hidden" aria-hidden="true">
                    <div style="height: 200px; background-color: #e9ecef;" class="placeholder-glow">
                        <span class="placeholder col-12 h-100"></span>
                    </div>
                    <div class="card-body p-4 placeholder-glow">
                        <span class="placeholder col-4 mb-2"></span>
                        <h5 class="card-title placeholder-glow"><span class="placeholder col-8"></span></h5>
                        <p class="card-text placeholder-glow"><span class="placeholder col-12"></span><span class="placeholder col-10"></span></p>
                    </div>
                </div>
            </div>
        `).join('');

        try {
            const response = await fetch(API_BLOG);
            if(response.ok) {
                const data = await response.json();
                
                // Map and sort
                let articles = data.map(item => ({
                    id: item.id.toString(),
                    title: item.title || '',
                    subject: item.subject || '',
                    content: item.content || '',
                    tags: item.tags || '',
                    headerImageUrl: item.headerImageUrl || './assets/images/backgrounds/header-light.jpeg',
                    date: item.createdAt || new Date().toISOString(),
                    slug: createSlug(item.title)
                }));

                articles.sort((a, b) => new Date(b.date) - new Date(a.date));
                const latestArticles = articles.slice(0, 5);

                renderPosts(latestArticles);
            } else {
                throw new Error("Erro na API");
            }
        } catch (error) {
            console.error("Erro ao carregar posts:", error);
            renderPosts([]);
        }
    }

    function renderPosts(articles) {
        if (!articles || articles.length === 0) {
            gridContainer.innerHTML = '';
            emptyState.classList.remove('d-none');
            if (btnSeeAll) btnSeeAll.classList.add('d-none');
            return;
        }

        emptyState.classList.add('d-none');
        if (btnSeeAll) btnSeeAll.classList.remove('d-none');

        let html = '';
        articles.forEach((article, index) => {
            const excerpt = getExcerpt(article.content, 140);
            const tags = parseTags(article.tags).slice(0, 2); // Show max 2 tags
            let tagsHtml = tags.map(tag => `<span class="chip-sm">${tag}</span>`).join('');
            
            // Add a special class if we want to highlight the first one (e.g. on desktop)
            // But to maintain grid harmony, we will just keep them uniform
            
            html += `
            <div class="col reveal delay-${index % 3 + 1}">
                <div class="card h-100 border-0 bg-white blog-card shadow-sm" onclick="window.location.href='blog-artigo.html?slug=${article.slug}'" style="cursor: pointer;">
                    <div class="card-img-wrapper" style="height: 220px; overflow: hidden; position: relative;">
                        <div class="position-absolute top-0 start-0 m-3 z-1">
                            <span class="badge text-white px-3 py-2 rounded-pill fw-medium" style="background-color: var(--primary-dark) !important; backdrop-filter: blur(4px);">
                                ${article.subject}
                            </span>
                        </div>
                        <img src="${article.headerImageUrl}" class="card-img-top h-100 w-100 object-fit-cover" alt="${article.title}" loading="lazy">
                    </div>
                    <div class="card-body p-4 d-flex flex-column">
                        <div class="d-flex align-items-center text-muted small mb-3">
                            <i class="bi bi-calendar3 me-2"></i> ${formatDate(article.date)}
                        </div>
                        <h4 class="card-title fw-bold text-dark mb-3" style="font-size: 1.25rem;">${article.title}</h4>
                        <p class="card-text text-muted mb-4">${excerpt}</p>
                        
                        <div class="mt-auto">
                            <div class="d-flex gap-2 flex-wrap mb-3">
                                ${tagsHtml}
                            </div>
                            <span class="btn btn-link text-primary p-0 fw-semibold text-decoration-none">
                                Ler artigo <i class="bi bi-arrow-right ms-1"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>`;
        });

        gridContainer.innerHTML = html;
        
        // Retrigger reveal animations for dynamically injected content
        if (typeof ScrollReveal !== 'undefined') {
            ScrollReveal().reveal('.reveal', { delay: 100 });
        }
    }

    // Inject some minor CSS for the chips and hover effect
    const style = document.createElement('style');
    style.innerHTML = `
        .blog-card {
            transition: all 0.3s ease;
        }
        .blog-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
        }
        .blog-card .card-img-wrapper img {
            transition: transform 0.5s ease;
        }
        .blog-card:hover .card-img-wrapper img {
            transform: scale(1.05);
        }
        .chip-sm {
            font-size: 0.75rem;
            padding: 0.25rem 0.75rem;
            border-radius: 50rem;
            background-color: rgba(0,0,0,0.05);
            color: #666;
            font-weight: 500;
        }
    `;
    document.head.appendChild(style);

    fetchLatestPosts();
});

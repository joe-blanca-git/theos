document.addEventListener('DOMContentLoaded', () => {
    // State
    let articles = [];
    let filteredArticles = [];
    let currentPage = 1;
    const itemsPerPage = 6;
    let currentCategory = null;
    let currentTag = null;
    
    // API endpoint
    const API_BLOG = "https://joederblanca.com.br/theos-landing-api/api/v1/BlogPosts";

    // Elements
    const heroContainer = document.getElementById('heroArticleContainer');
    const gridContainer = document.getElementById('articlesGrid');
    const paginationContainer = document.getElementById('paginationContainer');
    const paginationList = document.getElementById('paginationList');
    const emptyState = document.getElementById('emptyState');
    const searchInput = document.getElementById('searchInput');
    const searchInputMobile = document.getElementById('searchInputMobile');
    const sortSelect = document.getElementById('sortSelect');
    const categoryList = document.getElementById('categoryList');
    const tagsList = document.getElementById('tagsList');
    const sectionTitle = document.getElementById('sectionTitle');

    // Initialize
    async function init() {
        try {
            const response = await fetch(API_BLOG);
            if(response.ok) {
            const data = await response.json();
            // Map API DTO to internal structure
            articles = data.map(item => ({
                id: item.id.toString(),
                title: item.title || '',
                subject: item.subject || '',
                content: item.content || '',
                tags: item.tags || '',
                headerImageUrl: item.headerImageUrl || './assets/images/backgrounds/header-light.jpeg',
                date: item.createdAt || new Date().toISOString(),
                author: item.authorName || 'Equipe Theos',
                slug: createSlug(item.title)
            }));
        } else {
                console.error("Erro ao carregar os blogs da API");
                // fallback to empty or handle gracefully
                articles = [];
            }
        } catch (error) {
            console.error("Erro de conexão", error);
        }

        // Sort initial by date desc
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));
        filteredArticles = [...articles];
        
        extractCategoriesAndTags();
        attachEventListeners();
        render();
    }

    // Generate slug from title
    function createSlug(title) {
        if (!title) return 'artigo';
        return title.toString().toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }

    // Extract categories & tags dynamically
    function extractCategoriesAndTags() {
        const categories = {};
        const tags = {};

        articles.forEach(article => {
            // Category (subject)
            if (article.subject) {
                categories[article.subject] = (categories[article.subject] || 0) + 1;
            }
            
            // Tags
            const articleTags = parseTags(article.tags);
            articleTags.forEach(tag => {
                tags[tag] = (tags[tag] || 0) + 1;
            });
        });

        // Render Categories
        let catHtml = `<a class="category-list-item ${currentCategory === null ? 'active' : ''}" onclick="filterByCategory(null)">
            <span class="fw-semibold">Todos</span>
            <span class="badge bg-secondary bg-opacity-25 text-white-50 rounded-pill">${articles.length}</span>
        </a>`;
        
        Object.keys(categories).sort().forEach(cat => {
            catHtml += `<a class="category-list-item ${currentCategory === cat ? 'active' : ''}" onclick="filterByCategory('${cat}')">
                <span class="fw-semibold">${cat}</span>
                <span class="badge bg-secondary bg-opacity-25 text-white-50 rounded-pill">${categories[cat]}</span>
            </a>`;
        });
        categoryList.innerHTML = catHtml;

        // Render Tags
        let tagsHtml = '';
        Object.keys(tags).sort((a, b) => tags[b] - tags[a]).slice(0, 15).forEach(tag => {
            tagsHtml += `<span class="chip ${currentTag === tag ? 'active' : ''}" onclick="filterByTag('${tag}')">${tag}</span>`;
        });
        tagsList.innerHTML = tagsHtml;
    }

    // Event Listeners
    function attachEventListeners() {
        if (searchInput) {
            searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
        }
        if (searchInputMobile) {
            searchInputMobile.addEventListener('input', (e) => handleSearch(e.target.value));
        }
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => handleSort(e.target.value));
        }
    }

    // Filtering Actions (Exposed globally for onclick)
    window.filterByCategory = function(category) {
        currentCategory = category;
        currentTag = null; // reset tag
        if(searchInput) searchInput.value = '';
        if(searchInputMobile) searchInputMobile.value = '';
        applyFilters();
    };

    window.filterByTag = function(tag) {
        currentTag = currentTag === tag ? null : tag; // toggle
        currentCategory = null; // reset category
        if(searchInput) searchInput.value = '';
        if(searchInputMobile) searchInputMobile.value = '';
        applyFilters();
    };

    window.clearFilters = function() {
        currentCategory = null;
        currentTag = null;
        if(searchInput) searchInput.value = '';
        if(searchInputMobile) searchInputMobile.value = '';
        applyFilters();
    };

    function handleSearch(term) {
        term = term.toLowerCase().trim();
        if (!term) {
            applyFilters();
            return;
        }

        filteredArticles = articles.filter(article => {
            return article.title.toLowerCase().includes(term) ||
                   article.subject.toLowerCase().includes(term) ||
                   article.tags.toLowerCase().includes(term) ||
                   article.content.toLowerCase().includes(term);
        });
        
        currentPage = 1;
        sectionTitle.innerText = `Resultados para "${term}"`;
        renderFiltered();
    }

    function handleSort(order) {
        if (order === 'alphabetical') {
            filteredArticles.sort((a, b) => a.title.localeCompare(b.title));
        } else {
            filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        currentPage = 1;
        renderFiltered();
    }

    function applyFilters() {
        filteredArticles = articles;

        if (currentCategory) {
            filteredArticles = filteredArticles.filter(a => a.subject === currentCategory);
            sectionTitle.innerText = `Categoria: ${currentCategory}`;
        } else if (currentTag) {
            filteredArticles = filteredArticles.filter(a => parseTags(a.tags).includes(currentTag));
            sectionTitle.innerText = `Tag: ${currentTag}`;
        } else {
            sectionTitle.innerText = 'Últimos Artigos';
        }

        handleSort(sortSelect ? sortSelect.value : 'recent');
        
        // Re-render categories & tags to update active classes
        extractCategoriesAndTags(); 
    }

    // Core Render
    function render() {
        applyFilters();
    }

    function renderFiltered() {
        // Toggle empty state
        if (filteredArticles.length === 0) {
            heroContainer.innerHTML = '';
            gridContainer.innerHTML = '';
            paginationContainer.classList.add('d-none');
            emptyState.classList.remove('d-none');
            return;
        }

        emptyState.classList.add('d-none');
        paginationContainer.classList.remove('d-none');

        // Determine Hero (only on first page and if no search/filter applied, or just the first item)
        let startIndex = (currentPage - 1) * itemsPerPage;
        let pagedArticles = filteredArticles.slice(startIndex, startIndex + itemsPerPage);
        
        heroContainer.innerHTML = '';
        gridContainer.innerHTML = '';

        let gridItems = pagedArticles;

        // If page 1 and sorting by recent, make the first one a Hero
        if (currentPage === 1 && (!sortSelect || sortSelect.value === 'recent') && !currentCategory && !currentTag) {
            const hero = pagedArticles[0];
            renderHero(hero);
            gridItems = pagedArticles.slice(1);
        }

        // Render Grid
        gridItems.forEach(article => {
            gridContainer.appendChild(createCard(article));
        });

        renderPagination();
    }

    function renderHero(article) {
        const excerpt = getExcerpt(article.content, 150);
        const html = `
            <div class="hero-article" style="background-image: url('${article.headerImageUrl}');" onclick="window.location.href='blog-artigo.html?slug=${article.slug}'">
                <div class="hero-article-overlay"></div>
                <div class="hero-article-content">
                    <span class="badge bg-primary mb-3 px-3 py-2 text-uppercase tracking-wider fw-bold">${article.subject}</span>
                    <h2 class="text-white fw-bold mb-3 display-6">${article.title}</h2>
                    <p class="text-white-50 lead mb-4" style="max-width: 700px;">${excerpt}</p>
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center text-white-50 small">
                            <i class="far fa-calendar-alt me-2"></i> ${formatDate(article.date)}
                            <span class="mx-2">•</span>
                            <i class="far fa-clock me-2"></i> ${getReadingTime(article.content)} min de leitura
                        </div>
                        <a href="blog-artigo.html?slug=${article.slug}" class="btn btn-primary rounded-pill px-4">Ler Artigo <i class="fas fa-arrow-right ms-2"></i></a>
                    </div>
                </div>
            </div>
        `;
        heroContainer.innerHTML = html;
    }

    function createCard(article) {
        const excerpt = getExcerpt(article.content, 120);
        const col = document.createElement('div');
        col.className = 'col-md-6 col-xl-4';
        
        col.innerHTML = `
            <div class="article-card" onclick="window.location.href='blog-artigo.html?slug=${article.slug}'">
                <div class="article-card-img-wrapper">
                    <img src="${article.headerImageUrl}" alt="${article.title}" class="article-card-img">
                </div>
                <div class="article-card-body">
                    <span class="article-category">${article.subject}</span>
                    <h5 class="article-title">${article.title}</h5>
                    <p class="article-excerpt">${excerpt}</p>
                    <div class="article-meta">
                        <span>${formatDate(article.date)}</span>
                        <span>${getReadingTime(article.content)} min</span>
                    </div>
                </div>
            </div>
        `;
        return col;
    }

    function renderPagination() {
        const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
        
        if (totalPages <= 1) {
            paginationContainer.classList.add('d-none');
            return;
        }
        
        let html = '';
        
        // Prev
        html += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link bg-transparent border-secondary border-opacity-25 text-white" href="javascript:void(0)" onclick="goToPage(${currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </a>
        </li>`;

        // Pages
        for (let i = 1; i <= totalPages; i++) {
            if (i === currentPage) {
                html += `<li class="page-item active"><span class="page-link bg-primary border-primary">${i}</span></li>`;
            } else {
                html += `<li class="page-item"><a class="page-link bg-transparent border-secondary border-opacity-25 text-white" href="javascript:void(0)" onclick="goToPage(${i})">${i}</a></li>`;
            }
        }

        // Next
        html += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link bg-transparent border-secondary border-opacity-25 text-white" href="javascript:void(0)" onclick="goToPage(${currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </a>
        </li>`;

        paginationList.innerHTML = html;
    }

    window.goToPage = function(page) {
        const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        renderFiltered();
        window.scrollTo({ top: heroContainer.offsetTop - 100, behavior: 'smooth' });
    };

    // Helper: extract text from HTML and truncate
    function getExcerpt(html, maxLength) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        let text = tmp.textContent || tmp.innerText || '';
        text = text.trim();
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    }

    // Start
    init();
});

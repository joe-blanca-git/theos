document.addEventListener('DOMContentLoaded', async () => {
    
    // Get Article ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    const API_BLOG = "https://joederblanca.com.br/theos-landing-api/api/v1/BlogPosts";
    let articles = [];

    // Generate slug helper (same as home-blog)
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

    try {
        const response = await fetch(API_BLOG);
        if(response.ok) {
            const data = await response.json();
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
        }
    } catch (error) {
        console.error("Erro de conexão", error);
    }

    let article;
    const articleSlug = urlParams.get('slug');
    if (articleSlug) {
        article = articles.find(a => a.slug === articleSlug);
    } else {
        article = articles.find(a => a.id === articleId);
    }

    if (!article) {
        // Fallback if not found
        document.getElementById('articleContent').innerHTML = '<h3 class="text-white text-center py-5">Artigo não encontrado.</h3>';
        document.getElementById('relatedSection').style.display = 'none';
        return;
    }

    // Populate SEO Meta Tags
    document.title = `${article.title} - Instituto Theos`;
    document.getElementById('metaDescription').setAttribute('content', getExcerpt(article.content, 150));
    document.getElementById('ogTitle').setAttribute('content', article.title);
    document.getElementById('ogDesc').setAttribute('content', getExcerpt(article.content, 150));
    
    // Convert relative URL to absolute for OG image if possible, here we just pass what we have
    document.getElementById('ogImage').setAttribute('content', article.headerImageUrl);

    // Populate Header
    document.getElementById('articleHeader').style.backgroundImage = `url('${article.headerImageUrl}')`;

    // Populate Breadcrumb
    document.getElementById('bcCategory').innerText = article.subject;
    document.getElementById('bcTitle').innerText = article.title;

    // Populate Info
    document.getElementById('articleCategory').innerText = article.subject;
    document.getElementById('articleTitle').innerText = article.title;
    document.getElementById('articleAuthor').innerText = article.author || 'Equipe Theos';
    document.getElementById('articleDate').innerText = formatDate(article.date);
    document.getElementById('articleReadTime').innerText = getReadingTime(article.content);

    // Populate Content
    document.getElementById('articleContent').innerHTML = article.content;

    // Populate Tags
    const tagsContainer = document.getElementById('articleTags');
    let tagsHtml = '';
    const articleTags = parseTags(article.tags);
    articleTags.forEach(tag => {
        tagsHtml += `<span class="chip" onclick="window.location.href='blog.html?tag=${encodeURIComponent(tag)}'">${tag}</span>`;
    });
    tagsContainer.innerHTML = tagsHtml;

    // Populate Share Links
    const currentUrl = encodeURIComponent(window.location.href);
    const textUrl = encodeURIComponent(`Confira este artigo do Instituto Theos: ${article.title}`);
    
    document.getElementById('shareWhatsapp').href = `https://api.whatsapp.com/send?text=${textUrl} %0A ${currentUrl}`;
    document.getElementById('shareFacebook').href = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
    document.getElementById('shareTwitter').href = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${textUrl}`;
    document.getElementById('shareLinkedin').href = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`;

    window.copyLink = function() {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Link copiado para a área de transferência!');
        });
    };

    // Related Articles
    renderRelated(article, articleTags, articles);
});

function renderRelated(currentArticle, currentTags, allArticles) {
    // Basic recommendation algorithm: Match by subject, then by tags
    let related = allArticles.filter(a => a.id !== currentArticle.id);
    
    // Score them
    related.forEach(a => {
        a.score = 0;
        if (a.subject === currentArticle.subject) a.score += 5;
        
        const aTags = parseTags(a.tags);
        const commonTags = aTags.filter(t => currentTags.includes(t));
        a.score += commonTags.length * 2;
    });

    // Sort by score
    related.sort((a, b) => b.score - a.score);
    
    // Take top 3
    const topRelated = related.slice(0, 3);
    const container = document.getElementById('relatedArticlesGrid');
    
    if (topRelated.length === 0) {
        document.getElementById('relatedSection').style.display = 'none';
        return;
    }

    let html = '';
    topRelated.forEach(article => {
        html += `
            <div class="col-md-4">
                <div class="article-card bg-deep border border-secondary border-opacity-10 shadow-sm" onclick="window.location.href='blog-artigo.html?id=${article.id}'">
                    <div class="article-card-img-wrapper" style="padding-top: 50%;">
                        <img src="${article.headerImageUrl}" alt="${article.title}" class="article-card-img">
                    </div>
                    <div class="article-card-body p-3">
                        <span class="article-category text-primary">${article.subject}</span>
                        <h6 class="article-title fs-5 mb-2">${article.title}</h6>
                        <div class="article-meta mt-3 pt-3">
                            <span>${formatDate(article.date)}</span>
                            <span>${getReadingTime(article.content)} min</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

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

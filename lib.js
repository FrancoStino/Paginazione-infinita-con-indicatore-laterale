/*
 Paginazione infinita con indicatore laterale
*/
const blog = {
  itemsPerPage: 5,
  currentPage: 0,
  previousStatePage: 0,
  totalPage: 0,
  blogWrapper: document.getElementById('blog-w'),
  pagePositionWrapper: document.getElementById('page-position-w'),
  posts: []
}

// Creazione indicatore laterale sia in avanti che indietro dinamicamente con scroll infinito
window.addEventListener('scroll', () => {
  let { scrollHeight, clientHeight, scrollTop } = document.documentElement;
  let maxScroll = scrollHeight - clientHeight;

  // Carica nuovi post quando si arriva in fondo
  if ((scrollTop >= maxScroll - 1) && (blog.currentPage < blog.totalPage - 1)) {
    blog.previousStatePage = blog.currentPage;
    blog.currentPage++;
    showPosts();
  }

  // Aggiorna l'indicatore attivo basandosi sulla posizione dei post visibili
  updateIndicatorBasedOnVisiblePosts();
});

function updateIndicatorBasedOnVisiblePosts() {
  const posts = blog.blogWrapper.querySelectorAll('.blog-post');
  let activePageIndex = 0;

  // Trova quale post è più visibile nel viewport
  let maxVisibleArea = 0;
  let mostVisiblePostIndex = 0;

  posts.forEach((post, index) => {
    const rect = post.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calcola l'area visibile del post
    const visibleTop = Math.max(0, rect.top);
    const visibleBottom = Math.min(windowHeight, rect.bottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);

    if (visibleHeight > maxVisibleArea) {
      maxVisibleArea = visibleHeight;
      mostVisiblePostIndex = index;
    }
  });

  // Calcola la pagina dell'indicatore basandosi sul post più visibile
  activePageIndex = Math.floor(mostVisiblePostIndex / blog.itemsPerPage);

  // Aggiorna l'indicatore solo se è cambiato
  if (activePageIndex !== blog.activeIndicatorPage) {
    blog.activeIndicatorPage = activePageIndex;
    setIndicatoreAttivo(activePageIndex);
  }
}

function setIndicatoreAttivo(pageIndex) {
  let indicatori = blog.pagePositionWrapper.querySelectorAll('span');
  indicatori.forEach((span, index) => {
    span.classList.remove('active');
    if (index === pageIndex) {
      span.classList.add('active');
    }
  });
}

async function initBlog() {
  const postsData = await fetch('https://jsonplaceholder.typicode.com/posts');
  blog.posts = await postsData.json();
  // Solo 25 articoli
  blog.posts = blog.posts.slice(0, 25);
  // Calcola numero di pagine
  blog.totalPage = Math.ceil(blog.posts.length / blog.itemsPerPage);
  blog.activeIndicatorPage = 0;
  initIndicatoriPaginazione();
  showPosts();
}

function initIndicatoriPaginazione() {
  for (let i = 0; i < blog.totalPage; i++) {
    const span = document.createElement('span');
    span.className = 'position' + (i === 0 ? ' active' : '');
    blog.pagePositionWrapper.appendChild(span);
  }
}

function showPosts() {
  let start = blog.currentPage * blog.itemsPerPage;
  for (let i = start; i < start + blog.itemsPerPage; i++) {
    const post = blog.posts[i];
    if (!post) break;
    blog.blogWrapper.innerHTML += createPostHTML(post, i);
  }
}

function createPostHTML(post, index) {
  return `
    <article class="blog-post">
      <h3 class="title">${post.title}</h3>
      <div class="body">${post.body}</div>
      <div class="info">${index + 1}</div>
    </article>
  `;
}

initBlog();

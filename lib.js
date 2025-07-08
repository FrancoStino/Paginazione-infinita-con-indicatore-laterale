/*
 Paginazione infinita con indicatore laterale
*/
// TODO: Caricamento progressivo articoli e gestione indicatore laterale
const blog = {
  itemsPerPage: 5,
  currentPage: 0,
  previousStatePage: 0,
  totalPage: 0,
  blogWrapper: document.getElementById('blog-w'),
  pagePositionWrapper: document.getElementById('page-position-w')
}

// Creazione indicatore laterale sia in avanti che indietro dinamicamente con scroll infinito
window.addEventListener('scroll', () => {
  let { scrollHeight, clientHeight, scrollTop } = document.documentElement;
  let maxScroll = scrollHeight - clientHeight;
  if ((scrollTop >= maxScroll - 1) && (blog.currentPage < blog.totalPage - 1)) {
    blog.previousStatePage = blog.currentPage;
    blog.currentPage++;
    showPosts();
    setIndicatoreAttivo(blog.currentPage, blog.previousStatePage);
  } else if (scrollTop <= 1 && blog.currentPage > 0) {
    blog.previousStatePage = blog.currentPage;
    blog.currentPage--;
    showPosts();
    setIndicatoreAttivo(blog.currentPage, blog.previousStatePage);
  }
});

function setIndicatoreAttivo() {
  let indicatori = blog.pagePositionWrapper.querySelectorAll('span');
  indicatori.forEach((span, index) => {
    // Rimuovi active da tutti gli indicatori
    span.classList.remove('active');

    // Aggiungi active solo alla pagina corrente
    if (index === blog.currentPage) {
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
  initIndicatoriPaginazione();
  showPosts();
}

function initIndicatoriPaginazione() {
  for (let i = 0; i < blog.totalPage; i++) {
    const span = document.createElement('span');
    span.className = 'position' + (i === blog.currentPage ? ' active' : '');
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

initBlog()

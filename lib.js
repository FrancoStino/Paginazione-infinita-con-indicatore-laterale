/*
 Paginazione infinita con indicatore laterale
*/

// Generazione dinamica indicatore posizione pagina


const blog = {
  itemsPerPage: 5,
  currentPage: 0,
  totalPage: 0,
  blogWrapper: document.getElementById('blog-w'),
  pagePositionWrapper: document.getElementById('page-position-w')
}

async function initBlog() {
  const postsData = await fetch('https://jsonplaceholder.typicode.com/posts');
  blog.posts = await postsData.json();
  // Solo 25 articoli
  blog.posts = blog.posts.slice(0, 25);
  showPosts();
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

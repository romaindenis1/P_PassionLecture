<template>
  <div class="user-view">
    <section class="user-info">
      <h1>Welcome, {{ user.name }}</h1>
      <p>Email: {{ user.email }}</p>
    </section>

    <section class="book-list">
      <h2>Your Books</h2>
      <div v-if="books.length > 0" class="books">
        <div v-for="book in books" :key="book.id" class="book-card">
          <h3>{{ book.title }}</h3>
          <p>Author: {{ book.author }}</p>
          <p>Status: {{ book.status }}</p>
        </div>
      </div>
      <p v-else class="no-books">You have no books in your list.</p>
    </section>
  </div>
</template>

<script>
export default {
  name: 'UserView',
  data() {
    return {
      user: {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
      },
      books: [
        { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
        { id: 2, title: '1984', author: 'George Orwell' },
        { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee' },
      ],
    }
  },
}
</script>

<style scoped>
.user-view {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #fdfdfd;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', sans-serif;
}

.user-info {
  margin-bottom: 2rem;
}

.user-info h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.user-info p {
  font-size: 1rem;
  color: #555;
}

.book-list h2 {
  font-size: 1.5rem;
  color: #34495e;
  margin-bottom: 1rem;
}

.books {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}

.book-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 1rem;
  transition: box-shadow 0.2s ease;
}

.book-card:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.book-card h3 {
  margin: 0 0 0.5rem;
  color: #2d3436;
}

.book-card p {
  margin: 0.25rem 0;
  font-size: 0.95rem;
  color: #636e72;
}

.no-books {
  color: #888;
  font-style: italic;
}
</style>

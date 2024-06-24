document.addEventListener('DOMContentLoaded', function() {
  const bookForm = document.getElementById('book-form');
  const incompleteBookshelf = document.getElementById('incomplete-bookshelf');
  const completeBookshelf = document.getElementById('complete-bookshelf');
  const searchBook = document.getElementById('search-book');
  let bookToDeleteId = null;
  let bookToEditId = null;

  bookForm.addEventListener('submit', function(event) {
    event.preventDefault();
    addBook();
  });

  searchBook.addEventListener('input', function() {
    renderBooks();
  });

  function addBook() {
    const title = document.getElementById('book-title').value;
    const author = document.getElementById('book-author').value;
    const year = document.getElementById('book-year').value;
    const isComplete = document.getElementById('book-complete').checked;

    const book = {
      id: +new Date(),
      title,
      author,
      year: parseInt(year),
      isComplete
    };

    saveBook(book);
    renderBooks();
    bookForm.reset();
  }

  function saveBook(book) {
    let books = JSON.parse(localStorage.getItem('books')) || [];
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  function getBooks() {
    return JSON.parse(localStorage.getItem('books')) || [];
  }

  function renderBooks() {
    incompleteBookshelf.innerHTML = '';
    completeBookshelf.innerHTML = '';

    const books = getBooks();
    const searchText = searchBook.value.toLowerCase();

    const filteredBooks = books.filter(book => 
      book.title.toLowerCase().includes(searchText) ||
      book.author.toLowerCase().includes(searchText)
    );

    filteredBooks.forEach(book => {
      const bookItem = createBookItem(book);
      if (book.isComplete) {
        completeBookshelf.appendChild(bookItem);
      } else {
        incompleteBookshelf.appendChild(bookItem);
      }
    });
  }

  function createBookItem(book) {
    const bookItem = document.createElement('div');
    bookItem.classList.add('list-group-item', 'book-item');
    bookItem.innerHTML = `
      <div>
        <h4>${book.title}</h4>
        <p>${book.author} (${book.year})</p>
      </div>
      <div>
        <button class="btn btn-secondary" onclick="toggleComplete(${book.id})">${book.isComplete ? 'Belum Selesai' : 'Selesai'}</button>
        <button class="btn btn-info" onclick="showEditPopup(${book.id})">Edit</button>
        <button class="btn btn-danger" onclick="showDeletePopup(${book.id})">Hapus</button>
      </div>
    `;
    return bookItem;
  }

  window.toggleComplete = function(id) {
    let books = getBooks();
    books = books.map(book => {
      if (book.id === id) {
        book.isComplete = !book.isComplete;
      }
      return book;
    });
    localStorage.setItem('books', JSON.stringify(books));
    renderBooks();
  };

  window.showDeletePopup = function(id) {
    if (confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
      deleteBook(id);
    }
  };

  window.deleteBook = function(id) {
    let books = getBooks();
    books = books.filter(book => book.id !== id);
    localStorage.setItem('books', JSON.stringify(books));
    renderBooks();
  };

  window.showEditPopup = function(id) {
    bookToEditId = id;
    const books = getBooks();
    const book = books.find(book => book.id === id);

    const newTitle = prompt('Edit Judul Buku:', book.title);
    const newAuthor = prompt('Edit Penulis Buku:', book.author);
    const newYear = prompt('Edit Tahun Terbit:', book.year);
    const newIsComplete = confirm('Apakah buku sudah selesai dibaca?');

    if (newTitle && newAuthor && newYear) {
      saveEditedBook(newTitle, newAuthor, newYear, newIsComplete);
    }
  };

  function saveEditedBook(title, author, year, isComplete) {
    let books = getBooks();
    books = books.map(book => {
      if (book.id === bookToEditId) {
        return { ...book, title, author, year: parseInt(year), isComplete };
      }
      return book;
    });

    localStorage.setItem('books', JSON.stringify(books));
    renderBooks();
  }

  renderBooks();
});

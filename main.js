const titleDummy = ["Langit Merah di Ujung Senja", "The Last Symphony", "Hujan di Atas Kertas", "Whispers of the Forgotten", "Cahaya di Balik Jendela", "Midnight Library", "Rindu yang Tertinggal", "The Edge of Tomorrow", "Luka yang Menari", "Echoes of Silence"];
const authorDummy = ["Dewi Anggraeni", "Jonathan Blake", "Ayu Lestari", "Michael Carter", "Raka Pratama", "Isabelle Moore", "Putri Maharani", "Sebastian Cole", "Fajar Nugroho", "Emily Stone"];

class Book {
    constructor(title, author, year, isComplete = false) {
        this.id = Number(new Date());
        this.title = title;
        this.author = author;
        this.year = year;
        this.isComplete = isComplete;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    readBooks();
    const bookForm = document.getElementById("bookForm");
    const titleInput = document.getElementById("bookFormTitle");
    const authorInput = document.getElementById("bookFormAuthor");
    const yearInput = document.getElementById("bookFormYear");
    const isCompleteCheckbox = document.getElementById("bookFormIsComplete");
    const buttonFormSubmit = document.querySelector("#bookFormSubmit");

    function syncSubmitText() {
        const t = document.querySelector("#bookFormSubmit span");
        if (!t) return;
        t.textContent = isCompleteCheckbox.checked ? "Selesai dibaca" : "Belum selesai dibaca";
    }

    syncSubmitText();

    titleInput.addEventListener("input", () => {
        const v = titleInput.value.trim();
        authorInput.setAttribute("placeholder", v ? `Masukan Nama Pengarang ${v}` : "Masukan Nama Pengarang");
        yearInput.setAttribute("placeholder", v ? `Tahun input buku ${v}` : "Tahun input buku");
    });

    isCompleteCheckbox.addEventListener("change", syncSubmitText);

    yearInput.addEventListener("input", () => {
        const yearBook = parseInt(yearInput.value, 10);
        const currentYear = new Date().getFullYear();
        let errorYearText = yearInput.parentElement.querySelector(".errorYear");
        const invalid = Number.isNaN(yearBook) || yearBook > currentYear || yearBook < 868;
        if (invalid) {
            if (!errorYearText) {
                errorYearText = document.createElement("p");
                errorYearText.classList.add("errorYear");
                errorYearText.textContent = "Tahun buku tidak boleh lebih dari tahun sekarang dan kurang dari tahun 868";
                errorYearText.style.color = "red";
                errorYearText.style.fontSize = "12px";
                errorYearText.style.margin = "4px 0 0 0";
                errorYearText.style.fontStyle = "italic";
                yearInput.parentElement.appendChild(errorYearText);
            }
            buttonFormSubmit.disabled = true;
            buttonFormSubmit.style.cursor = "not-allowed";
            buttonFormSubmit.style.opacity = 0.5;
        } else {
            if (errorYearText) errorYearText.remove();
            buttonFormSubmit.disabled = false;
            buttonFormSubmit.style.cursor = "pointer";
            buttonFormSubmit.style.opacity = 1;
        }
    });


    function getBooks() {
        return JSON.parse(localStorage.getItem("books")) || [];
    }

    function setBooks(books) {
        localStorage.setItem("books", JSON.stringify(books));
    }

    function storeBook(item) {
        const books = getBooks();
        books.push(item);
        setBooks(books);
        readBooks();
    }

    function deleteBook(id) {
        let books = getBooks();
        books = books.filter(b => b.id !== id);
        setBooks(books);
        readBooks();
    }

    function moveBook(id, isComplete) {
        const books = getBooks().map(b => {
            if (b.id === id) b.isComplete = !isComplete;
            return b;
        });
        setBooks(books);
        readBooks();
    }

    function editBook(id, newTitle, newAuthor, newYear, newIsComplete) {
        const books = getBooks().map(b => {
            if (b.id === id) {
                b.title = newTitle;
                b.author = newAuthor;
                b.year = Number(newYear);
                b.isComplete = Boolean(newIsComplete);
            }
            return b;
        });
        setBooks(books);
        readBooks();
    }

    function clearContainer(containerId) {
        const el = document.getElementById(containerId);
        if (el) el.innerHTML = "";
    }

    function renderEmptyBookshelf(containerId) {
        const bookshelf = document.getElementById(containerId);
        if (!bookshelf) return;
        bookshelf.innerHTML = "";
        const emptyShelf = document.createElement("div");
        emptyShelf.className = "emptyBookShelf";
        const figure = document.createElement("figure");
        figure.id = "emptyBookIcon";
        figure.innerHTML = `
      <svg role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="#1f7a52" viewBox="0 0 24 24">
        <path fill-rule="evenodd" d="M6 2a2 2 0 0 0-2 2v15a3 3 0 0 0 3 3h12a1 1 0 1 0 0-2h-2v-2h2a1 1 0 0 0 1-1V4a2 2 0 0 0-2-2h-8v16h5v2H7a1 1 0 1 1 0-2h1V2H6Z" clip-rule="evenodd"/>
      </svg>
    `;
        const label = document.createElement("div");
        label.textContent = "Rak Kosong";
        const link = document.createElement("a");
        link.setAttribute("href", "#addBook");
        link.innerHTML = `
      <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
      </svg>
      <span>Tambah Buku Sekarang</span>
    `;
        emptyShelf.appendChild(figure);
        emptyShelf.appendChild(label);
        emptyShelf.appendChild(link);
        bookshelf.appendChild(emptyShelf);
    }

    function renderBooks(books, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";
        books.forEach(book => {
            const bookItem = document.createElement("div");
            bookItem.setAttribute("data-bookid", book.id);
            bookItem.setAttribute("data-testid", "bookItem");
            const h3 = document.createElement("h3");
            h3.setAttribute("data-testid", "bookItemTitle");
            h3.textContent = book.title;
            const pAuthor = document.createElement("p");
            pAuthor.setAttribute("data-testid", "bookItemAuthor");
            pAuthor.textContent = book.author;
            const pYear = document.createElement("p");
            pYear.setAttribute("data-testid", "bookItemYear");
            pYear.textContent = String(book.year);
            const btnWrap = document.createElement("div");
            btnWrap.className = "buttonContainer";
            const toggleBtn = document.createElement("button");
            toggleBtn.setAttribute("data-testid", "bookItemIsCompleteButton");
            toggleBtn.textContent = book.isComplete ? "Belum selesai" : "Selesai dibaca";
            const delBtn = document.createElement("button");
            delBtn.setAttribute("data-testid", "bookItemDeleteButton");
            delBtn.innerHTML = `
        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path fill-rule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clip-rule="evenodd" />
        </svg>
      `;
            const editBtn = document.createElement("button");
            editBtn.setAttribute("data-testid", "bookItemEditButton");
            editBtn.innerHTML = `
        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd" />
          <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd" />
        </svg>
      `;
            delBtn.addEventListener("click", () => {
                renderModalDelete(book.title, book.id);
            });
            toggleBtn.addEventListener("click", () => {
                moveBook(book.id, book.isComplete);
            });
            editBtn.addEventListener("click", () => {
                renderModalEdit(book);
            });
            btnWrap.appendChild(toggleBtn);
            btnWrap.appendChild(delBtn);
            btnWrap.appendChild(editBtn);
            bookItem.appendChild(h3);
            bookItem.appendChild(pAuthor);
            bookItem.appendChild(pYear);
            bookItem.appendChild(btnWrap);
            container.appendChild(bookItem);
        });
    }

    function readBooks() {
        const books = JSON.parse(localStorage.getItem("books")) || [];
        const incompleteBooks = books.filter(book => !book.isComplete);
        const completeBooks = books.filter(book => book.isComplete);
        clearContainer("incompleteBookList");
        clearContainer("completeBookList");
        if (incompleteBooks.length === 0) {
            renderEmptyBookshelf("incompleteBookList");
        } else {
            renderBooks(incompleteBooks, "incompleteBookList");
        }
        if (completeBooks.length === 0) {
            renderEmptyBookshelf("completeBookList");
        } else {
            renderBooks(completeBooks, "completeBookList");
        }
    }

    function renderModalDelete(title, id) {
        const modalDeleteContainer = document.querySelector(".modalDeleteBukuContainer");
        const modal = document.querySelector(".modalDeleteBuku");
        const p = modal.querySelector("p");
        const btnCancel = modal.querySelector("#cancelDelete");
        const btnDelete = modal.querySelector("#delete");
        p.textContent = `Apakah kamu yakin ingin menghapus buku "${title}"?`;
        modalDeleteContainer.style.opacity = 1;
        modalDeleteContainer.style.zIndex = 10;
        modalDeleteContainer.style.pointerEvents = "all";
        btnCancel.onclick = () => {
            modalDeleteContainer.style.opacity = 0;
            modalDeleteContainer.style.zIndex = -1;
            modalDeleteContainer.style.pointerEvents = "none";
        };
        btnDelete.onclick = () => {
            deleteBook(id);
            modalDeleteContainer.style.opacity = 0;
            modalDeleteContainer.style.zIndex = -1;
            modalDeleteContainer.style.pointerEvents = "none";
        };
    }

    function renderModalEdit(book) {
        const modalEditContainer = document.querySelector(".modalEditBukuContainer");
        const modal = document.querySelector(".modalEditBuku");
        const titleSpan = modal.querySelector("h3 span");
        const form = modal.querySelector("form");
        const inputTitle = document.querySelector("#bookFormEditTitle");
        const inputAuthor = document.querySelector("#bookFormEditAuthor");
        const inputYear = document.querySelector("#bookFormEditYear");
        const inputIsComplete = document.querySelector("#bookFormEditIsComplete");
        const btnCancel = document.querySelector("#cancelEdit");
        titleSpan.textContent = book.title;
        inputTitle.value = book.title;
        inputAuthor.value = book.author;
        inputYear.value = book.year;
        inputIsComplete.checked = book.isComplete;
        modalEditContainer.style.opacity = 1;
        modalEditContainer.style.zIndex = 10;
        modalEditContainer.style.pointerEvents = "all";
        form.onsubmit = e => {
            e.preventDefault();
            editBook(book.id, inputTitle.value, inputAuthor.value, inputYear.value, inputIsComplete.checked);
            modalEditContainer.style.opacity = 0;
            modalEditContainer.style.zIndex = -1;
            modalEditContainer.style.pointerEvents = "none";
        };
        btnCancel.onclick = () => {
            modalEditContainer.style.opacity = 0;
            modalEditContainer.style.zIndex = -1;
            modalEditContainer.style.pointerEvents = "none";
        };
    }

    function generateDummyData(count) {
        for (let i = 0; i < count; i++) {
            const idx = i % titleDummy.length;
            const randomYear = Math.floor(Math.random() * (2025 - 2000 + 1)) + 2000;
            const book = new Book(titleDummy[idx], authorDummy[idx], randomYear, Math.random() < 0.5);
            storeBook(book);
        }
        readBooks();
    }

    function addBook() {
        const title = titleInput.value.trim();
        const author = authorInput.value.trim();
        const year = Number(yearInput.value.trim());
        const isComplete = isCompleteCheckbox.checked;
        if (!title || !author || !year) return;
        const book = new Book(title, author, year, isComplete);
        storeBook(book);
        bookForm.reset();
        syncSubmitText();
    }

    function handleBookFormSubmit(event) {
        event.preventDefault();
        addBook();
    }

    function handleFirstTime() {
        const isFirstTime = localStorage.getItem("isFirstTimeLoaded");
        if (isFirstTime === "true" || isFirstTime === null) {
            localStorage.setItem("isFirstTimeLoaded", true);
            const modal = document.querySelector(".modalGenerateBukuContainer");
            const body = document.querySelector("body");
            body.style.overflow = "hidden";
            modal.style.opacity = 1;
            modal.style.zIndex = 10;
            modal.style.pointerEvents = "all";
            const btnSkip = document.querySelector(".modalGenerateBuku #cancel");
            const btnGaskeun = document.querySelector(".modalGenerateBuku #nextStep");
            btnGaskeun.onclick = () => {
                const modalTitle = document.querySelector(".modalGenerateBuku h3");
                modalTitle.innerText = "Mau berapa buku emangnya yang digenerate?";
                modalTitle.style.fontSize = "20px";
                const paragraph = document.querySelector(".modalGenerateBuku p");
                if (paragraph) paragraph.remove();
                const inputCount = document.createElement("input");
                inputCount.type = "number";
                inputCount.placeholder = "Masukkan jumlah buku";
                inputCount.style.marginTop = "10px";
                const modalGenerateBuku = document.querySelector(".modalGenerateBuku");
                const btnContainer = modalGenerateBuku.querySelector("div");
                modalGenerateBuku.insertBefore(inputCount, btnContainer);
                const buttonGenerate = document.createElement("button");
                buttonGenerate.textContent = "Generate";
                btnContainer.innerHTML = "";
                btnContainer.appendChild(buttonGenerate);
                btnGaskeun.remove();
                const errorText = document.createElement("p");
                errorText.style.color = "red";
                errorText.style.fontSize = "12px";
                modalGenerateBuku.appendChild(errorText);
                inputCount.addEventListener("input", () => {
                    const count = Number(inputCount.value);
                    if (count > 10) {
                        errorText.textContent = "Jumlah buku maksimal 10";
                        buttonGenerate.disabled = true;
                        buttonGenerate.style.cursor = "not-allowed";
                    } else {
                        errorText.textContent = "";
                        buttonGenerate.disabled = false;
                        buttonGenerate.style.cursor = "pointer";
                    }
                });
                buttonGenerate.onclick = () => {
                    const count = Number(inputCount.value);
                    if (count > 0 && count <= 10) {
                        generateDummyData(count);
                        modal.style.opacity = 0;
                        modal.style.zIndex = -1;
                        modal.style.pointerEvents = "none";
                        body.style.overflow = "auto";
                        localStorage.setItem("isFirstTimeLoaded", false);
                    }
                };
            };
            btnSkip.onclick = () => {
                modal.style.opacity = 0;
                modal.style.zIndex = -1;
                modal.style.pointerEvents = "none";
                body.style.overflow = "auto";
                localStorage.setItem("isFirstTimeLoaded", false);
                readBooks();
            };
        } else {
            readBooks();
        }
    }

    function attachSearchBook() {
        const form = document.getElementById("searchBook");
        const input = document.getElementById("searchBookTitle");

        if (!form || !input) return;

        function renderFiltered(q) {
            const books = JSON.parse(localStorage.getItem("books")) || [];
            const query = q.trim().toLowerCase();
            if (!query) {
                readBooks();
                return;
            }
            const filtered = books.filter(b =>
                String(b.title).toLowerCase().includes(query) ||
                String(b.author).toLowerCase().includes(query) ||
                String(b.year).toLowerCase().includes(query)
            );

            const incompleteBooks = filtered.filter(b => !b.isComplete);
            const completeBooks = filtered.filter(b => b.isComplete);

            const inc = document.getElementById("incompleteBookList");
            const com = document.getElementById("completeBookList");
            if (inc) inc.innerHTML = "";
            if (com) com.innerHTML = "";

            if (incompleteBooks.length === 0) {
                renderEmptyBookshelf("incompleteBookList");
            } else {
                renderBooks(incompleteBooks, "incompleteBookList");
            }
            if (completeBooks.length === 0) {
                renderEmptyBookshelf("completeBookList");
            } else {
                renderBooks(completeBooks, "completeBookList");
            }
        }

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            renderFiltered(input.value);
        });

        input.addEventListener("input", () => {
            if (input.value === "") readBooks();
        });
    }

    bookForm.addEventListener("submit", handleBookFormSubmit);
    handleFirstTime();
    attachSearchBook();
});
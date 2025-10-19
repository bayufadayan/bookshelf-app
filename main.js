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

document.addEventListener("DOMContentLoaded", handleFirstTime);

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

        const btnSkip = document.querySelector(".modalGenerateBuku button:first-child");
        const btnGaskeun = document.querySelector(".modalGenerateBuku button:last-child");

        btnGaskeun.addEventListener("click", () => {
            const modalTitle = document.querySelector(".modalGenerateBuku h3");
            modalTitle.innerText = "Mau berapa buku emangnya yang digenerate?";
            modalTitle.style.fontSize = "20px";

            const paragraph = document.querySelector(".modalGenerateBuku p");
            paragraph.remove();

            const inputCount = document.createElement("input");
            inputCount.setAttribute("type", "number");
            inputCount.setAttribute("placeholder", "Masukkan jumlah buku");
            inputCount.style.marginTop = "10px";

            const modalGenerateBuku = document.querySelector(".modalGenerateBuku");
            modalGenerateBuku.insertBefore(inputCount, modalGenerateBuku.querySelector("div"));

            const buttonGenerate = document.createElement("button");
            buttonGenerate.innerText = "Generate";

            const modalGenerateBukuButtonContainer = document.querySelector(".modalGenerateBuku div");
            modalGenerateBukuButtonContainer.innerHTML = "";
            modalGenerateBukuButtonContainer.appendChild(buttonGenerate);

            btnGaskeun.remove();

            const errorText = document.createElement("p");
            errorText.style.color = "red";
            errorText.style.fontSize = "12px";
            modalGenerateBuku.appendChild(errorText);

            inputCount.addEventListener("input", () => {
                const count = Number(inputCount.value);

                if (count > 10) {
                    errorText.innerText = "Jumlah buku maksimal 10";
                    buttonGenerate.disabled = true;
                    buttonGenerate.style.cursor = "not-allowed";
                } else {
                    errorText.innerText = "";
                    buttonGenerate.disabled = false;
                    buttonGenerate.style.cursor = "pointer";
                }
            });

            buttonGenerate.addEventListener("click", () => {
                const count = Number(inputCount.value);
                if (count > 0 && count <= 10) {
                    generateDummyData(count);
                    modal.style.opacity = 0;
                    modal.style.zIndex = -1;
                    body.style.overflow = "auto";
                    localStorage.setItem("isFirstTimeLoaded", false);
                }
            });
        });

        btnSkip.addEventListener("click", () => {
            modal.style.opacity = 0;
            modal.style.zIndex = -1;
            modal.style.pointerEvents = "none";
            body.style.overflow = "auto";
            localStorage.setItem("isFirstTimeLoaded", false);
            readBooks();
        });
    }
}

function generateDummyData(count) {
    for (let index = 0; index < count; index++) {
        const randomYear = Math.floor(Math.random() * (2025 - 2000 + 1)) + 2000;
        const book = new Book(titleDummy[index], authorDummy[index], randomYear, Math.random() < 0.5);
        addBook(book);
    }
    readBooks();
}

function addBook(item) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books.push(item);
    localStorage.setItem("books", JSON.stringify(books));
    readBooks();
}

function deleteBook(id) {
    readBooks();
}

function updateBook(id) {
    readBooks();
}

function completeBook(id) {
    readBooks();
}

function renderBookshelf() {
    var emptyShelf = document.createElement("div");
    emptyShelf.setAttribute("class", "emptyBookShelf");

    var figure = document.createElement("figure");
    figure.setAttribute("id", "emptyBookIcon");
    figure.innerHTML = `
        <svg role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="#1f7a52" viewBox="0 0 24 24">
        <path fill-rule="evenodd" d="M6 2a2 2 0 0 0-2 2v15a3 3 0 0 0 3 3h12a1 1 0 1 0 0-2h-2v-2h2a1 1 0 0 0 1-1V4a2 2 0 0 0-2-2h-8v16h5v2H7a1 1 0 1 1 0-2h1V2H6Z" clip-rule="evenodd"/>
        </svg>
    `;

    var label = document.createElement("label");
    label.setAttribute("for", "emptyBookIcon");
    label.textContent = "Rak Kosong";

    var link = document.createElement("a");
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

    const bookshelf = document.querySelector(".bookShelf");
    bookshelf.appendChild(emptyShelf);
}

function readBooks() {
    const books = JSON.parse(localStorage.getItem("books")) || [];

    const incompleteBooks = books.filter((book) => !book.isComplete);
    const completeBooks = books.filter((book) => book.isComplete);

    renderBooks(incompleteBooks, "incompleteBookList");
    renderBooks(completeBooks, "completeBookList");
}

function renderBooks(books, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    books.forEach((book) => {
        const bookItem = document.createElement("div");
        bookItem.setAttribute("data-bookid", book.id);
        bookItem.setAttribute("data-testid", "bookItem");

        bookItem.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">${book.author}</p>
        <p data-testid="bookItemYear">${book.year}</p>
        <div class="buttonContainer">
            <button data-testid="bookItemIsCompleteButton">
            ${book.isComplete ? "Belum selesai" : "Selesai dibaca"}
            </button>
            <button data-testid="bookItemDeleteButton">
            <svg
                aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M8.586 2.586A2 2..." clip-rule="evenodd"/>
            </svg>
            </button>
            <button data-testid="bookItemEditButton">
            <svg
                aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M11.32 6.176H5c..." clip-rule="evenodd"/>
                <path fill-rule="evenodd" d="M19.846 4.318a2..." clip-rule="evenodd"/>
            </svg>
            </button>
        </div>
    `;

        container.appendChild(bookItem);
    });
}

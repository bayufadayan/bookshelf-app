const titleDummy = ["Langit Merah di Ujung Senja", "The Last Symphony", "Hujan di Atas Kertas", "Whispers of the Forgotten", "Cahaya di Balik Jendela", "Midnight Library", "Rindu yang Tertinggal", "The Edge of Tomorrow", "Luka yang Menari", "Echoes of Silence"];
const authorDummy = ["Dewi Anggraeni", "Jonathan Blake", "Ayu Lestari", "Michael Carter", "Raka Pratama", "Isabelle Moore", "Putri Maharani", "Sebastian Cole", "Fajar Nugroho", "Emily Stone"];
readBooks();

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

const bookForm = document.getElementById("bookForm");
bookForm.addEventListener("submit", handleBookFormSubmit);

const titleInput = document.getElementById("bookFormTitle");
const authorInput = document.getElementById("bookFormAuthor");
const yearInput = document.getElementById("bookFormYear");
const isCompleteCheckbox = document.getElementById("bookFormIsComplete");
const buttonFormSubmit = document.querySelector("#bookFormSubmit");
titleInput.addEventListener("input", () => {
    const titleBook = titleInput.value;
    authorInput.setAttribute("placeholder", `Masukan Nama Pengarang ${titleBook}`)
    yearInput.setAttribute("placeholder", `Tahun input buku ${titleBook}`)
})

isCompleteCheckbox.addEventListener("change", (e) => {
    const buttonFormSubmitText = document.querySelector("#bookFormSubmit span");
    if (isCompleteCheckbox.checked) {
        buttonFormSubmitText.innerText = "Selesai dibaca";
    } else {
        buttonFormSubmitText.innerText = "Belum selesai dibaca";
    }
})

yearInput.addEventListener("input", () => {
    const yearBook = parseInt(yearInput.value, 10);
    const currentYear = new Date().getFullYear();

    let errorYearText = yearInput.parentElement.querySelector(".errorYear");

    if (yearBook > currentYear || yearBook < 868) {
        if (!errorYearText) {
            errorYearText = document.createElement("p");
            errorYearText.classList.add("errorYear");
            errorYearText.innerText =
                "Tahun buku tidak boleh lebih dari tahun sekarang dan kurang dari tahun 868";

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
        if (errorYearText) {
            errorYearText.remove();
        }

        buttonFormSubmit.disabled = false;
        buttonFormSubmit.style.cursor = "pointer";
        buttonFormSubmit.style.opacity = 1;
    }
});


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
                    modal.style.pointerEvents = "none";
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
        storeBook(book);
    }
    readBooks();
}

function addBook() {
    const title = titleInput.value;
    const author = authorInput.value;
    const year = yearInput.value;
    const isComplete = isCompleteCheckbox.checked;

    const book = new Book(title, author, year, isComplete);
    storeBook(book);
    readBooks();
    bookForm.reset();
}

function handleBookFormSubmit(event) {
    event.preventDefault();
    addBook()
    readBooks()
}

function storeBook(item) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books.push(item);
    localStorage.setItem("books", JSON.stringify(books));
    readBooks();
}

function deleteBook(id) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books = books.filter((book) => book.id !== id);
    localStorage.setItem("books", JSON.stringify(books));
    readBooks();
}

function updateBook(id) {
    readBooks();
}

function completeBook(id) {
    readBooks();
}

function renderEmptyBookshelf(containerId) {
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
    link.setAttribute("href", "#storeBook");
    link.innerHTML = `
        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
        </svg>
        <span>Tambah Buku Sekarang</span>
    `;
    emptyShelf.appendChild(figure);
    emptyShelf.appendChild(label);
    emptyShelf.appendChild(link);

    const bookshelf = document.getElementById(containerId);
    bookshelf.appendChild(emptyShelf);
}

function readBooks() {
    const books = JSON.parse(localStorage.getItem("books")) || [];

    const incompleteBooks = books.filter((book) => !book.isComplete);
    const completeBooks = books.filter((book) => book.isComplete);

    if (incompleteBooks.length === 0) {
        renderEmptyBookshelf("incompleteBookList");
    } else {
        renderBooks(incompleteBooks, "incompleteBookList");
    }

    if (completeBook.length === 0) {
        renderEmptyBookshelf("completeBookList");
    } else {
        renderBooks(completeBooks, "completeBookList");
    }

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
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clip-rule="evenodd" />
            </svg>
            </button>
            <button data-testid="bookItemEditButton">
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" >
                <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd" />
                <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd" />
            </svg>
            </button>
        </div>
    `;

        const deleteBtn = bookItem.querySelector("[data-testid='bookItemDeleteButton']");
        deleteBtn.addEventListener("click", () => {
            renderModalDelete(book.title, book.id);
        });

        container.appendChild(bookItem);
    });
}



function renderModalDelete(title, id) {
    const modalDeleteContainer = document.querySelector(".modalDeleteBukuContainer");
    modalDeleteContainer.style.opacity = 1;
    modalDeleteContainer.style.zIndex = 10;
    modalDeleteContainer.style.pointerEvents = "all";

    const modalDeleteBukuParagraph = document.querySelector(".modalDeleteBuku p");
    modalDeleteBukuParagraph.innerText = `Apakah kamu yakin ingin menghapus buku "${title}"?`;

    const modalDeleteBtnGajadi = document.querySelector(".modalDeleteBuku button:first-child");
    const modalDeleteBtnIyaah = document.querySelector(".modalDeleteBuku button:last-child");

    modalDeleteBtnGajadi.addEventListener("click", () => {
        modalDeleteContainer.style.opacity = 0;
        modalDeleteContainer.style.zIndex = -1;
        modalDeleteContainer.style.pointerEvents = "none";
    });

    modalDeleteBtnIyaah.addEventListener("click", () => {
        deleteBook(id);
        modalDeleteContainer.style.opacity = 0;
        modalDeleteContainer.style.zIndex = -1;
        modalDeleteContainer.style.pointerEvents = "none";
    });
}
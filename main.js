const titleDummy = ["Langit Merah di Ujung Senja", "The Last Symphony", "Hujan di Atas Kertas", "Whispers of the Forgotten", "Cahaya di Balik Jendela", "Midnight Library", "Rindu yang Tertinggal", "The Edge of Tomorrow", "Luka yang Menari", "Echoes of Silence"];
const authorDummy = ["Dewi Anggraeni", "Jonathan Blake", "Ayu Lestari", "Michael Carter", "Raka Pratama", "Isabelle Moore", "Putri Maharani", "Sebastian Cole", "Fajar Nugroho", "Emily Stone"];

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
        });
    }
}

class Book {
    constructor(title, author, year, isComplete = false) {
        this.id = Number(new Date());
        this.title = title;
        this.author = author;
        this.year = year;
        this.isComplete = isComplete;
    }
}

function generateDummyData(count) {
    for (let index = 0; index < count; index++) {
        const randomYear = Math.floor(Math.random() * (2025 - 2000 + 1)) + 2000;
        const book = new Book(titleDummy[index], authorDummy[index], randomYear, Math.random() < 0.5);
        addBook(book);
    }
}

function addBook(item) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books.push(item);
    localStorage.setItem("books", JSON.stringify(books));
}

function deleteBook(id) {

}

function updateBook(id) {

}

function completeBook(id) {

}
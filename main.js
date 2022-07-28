const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

document.addEventListener('DOMContentLoaded', function () {

    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    const searchForm = document.getElementById('searchBook');
    searchForm.addEventListener('click', function (e) {
        e.preventDefault();
        searchBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }

});

document.addEventListener(RENDER_EVENT, function () {
    // console.log(books);
    const uncompleteBook = document.getElementById('incompleteBookshelfList');
    uncompleteBook.innerHTML = '';

    const completeBook = document.getElementById('completeBookshelfList');
    completeBook.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isComplete) {
            uncompleteBook.append(bookElement);
        } else {
            completeBook.append(bookElement);
        }
    }
});

// fungsi addBook
function addBook() {
    const textTitle = document.getElementById('inputBookTitle').value;
    const textAuthor = document.getElementById('inputBookAuthor').value;
    const textYear = document.getElementById('inputBookYear').value;
    const selesaiDibaca = document.getElementById('inputBookIsComplete').checked;
    
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, textTitle, textAuthor, textYear, selesaiDibaca);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    alert('buku berhasil ditambahkan');
    saveData();
}

// fungsi untuk generate id
function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id, title, author, year, isComplete,
    }
}

// fungsi untuk membuat container belum selesai dibaca
function makeBook(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = 'Penulis: ' + bookObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = 'Tahun: ' + bookObject.year;

    const article = document.createElement('article');
    article.classList.add('book_item');
    article.append(textTitle, textAuthor, textYear);
    
    article.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isComplete) {

        const undoButton = document.createElement('button');
        undoButton.classList.add('green');
        undoButton.innerText = 'Belum selesai di Baca';

        undoButton.addEventListener('click', function () {
            undoBookFromComplete(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Hapus buku';

        trashButton.addEventListener('click', function () {
            alert('buku berhasil dihapus');
            removeBookFromComplete(bookObject.id); 
        });

        const container = document.createElement('div');
        container.classList.add('action');
        container.append(undoButton, trashButton);

        article.append(container);
    } else {

        const clearButton = document.createElement('button');
        clearButton.classList.add('green');
        clearButton.innerText = 'Selesai dibaca';

        clearButton.addEventListener('click', function () {
            addBookToComplete(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Hapus buku';

        trashButton.addEventListener('click', function () {
            alert('buku berhasil dihapus');
            removeBookFromComplete(bookObject.id); 
        });

        const container = document.createElement('div');
        container.classList.add('action');
        container.append(clearButton, trashButton);

        article.append(container);

    }

    return article;
}

function addBookToComplete(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function removeBookFromComplete(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromComplete(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak medukung local storage');
        return false;
    }
    return true;
}

// document.addEventListener(SAVED_EVENT, function () {
//     console.log(localStorage.getItem(STORAGE_KEY));
// });

function loadDataFromStorage() {
    const ambilData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(ambilData);

    if (data !== null) {
        for (const item of data) {
            books.push(item);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}


function searchBook() {
    const judul = document.getElementById('searchBookTitle').value.toLowerCase();
    const listBook = document.querySelectorAll('.book_item > h3');
    for (buku of listBook) {
        if (judul !== buku.innerText.toLowerCase()) {
            buku.parentElement.style.display = "none";
        } else {
            buku.parentElement.style.display = "block";
        }
    }
}




import { BookService } from './../services/services';
import { isArray } from 'util';

const home = (() => {

    const bookService = new BookService();
    let booksFromNetwork = false;
    let container = document.getElementById('cardRow');

    const clearBooks = () => {
        while (container.hasChildNodes()) {
            container.removeChild(container.lastChild)
        }
    }

    const getBooks = async () => {
        try {
            const books = await bookService.getBooks();
            if (isArray(books)) {
                console.log('Books from network', books)
                booksFromNetwork = true;
                clearBooks();
                printBooks(books)
            }
        } catch (error) {
            console.log('Error retrieving your books from Network')
        }
    }

    const getBooksFromCache = async () => {
        if ('caches' in window) {
            try {
                const response = await caches.match(bookService.getUrl());
                const books = await response.json();
                console.log('Books from cache', books)
                // We don't want to overwrite the network content with the cache
                if (!booksFromNetwork && !!books) {
                    clearBooks();
                    printBooks(books)
                }
            } catch (error) {
                console.log('Error getting data form cache')
            }
        }
    }

    const printBooks = (books) => {
        books.forEach((book) => {
            const wrapperCard = document.createElement('div');
            wrapperCard.className = 'col-11 col-sm-4 col-md-5 col-xl-3 bookstore__list mb-2';

            const card = document.createElement('div');
            card.className = 'card';
            card.style = 'width: 15rem; height: 20rem';

            const img = document.createElement('img');
            img.className = 'card-img-top bookstore__card';
            img.src = book.image;

            const body = document.createElement('div');
            body.className = 'card-body';

            const title = document.createElement('h5');
            title.className = 'card-title';
            title.innerText = book.title;

            const description = document.createElement('p');
            description.className = 'card-text';
            description.innerText = book.description;

            body.appendChild(title);
            body.appendChild(description);

            card.appendChild(img);
            card.appendChild(body);

            wrapperCard.appendChild(card);
            container.appendChild(wrapperCard);
        })

        
    }

    return {
        getBooks: getBooks,
        getBooksFromCache: getBooksFromCache,
    }
})();

// Get data
home.getBooks();
// Get data from cache
home.getBooksFromCache();




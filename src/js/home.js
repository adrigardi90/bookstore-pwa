
import { BookService } from './../services/services';

const home = (() => {
    const getBooks = () => {
        new BookService().getBooks().then((books) => printBooks(books))
    } 

    const printBooks = (books) => {
        books.forEach( (book) => {
            const row = document.getElementById('cardRow');

            const wrapperCard = document.createElement('div');
            wrapperCard.className = 'col-11 col-sm-4 col-md-5 col-xl-3 bookstore__list mb-2';
    
            const card = document.createElement('div');
            card.className = 'card';
            card.style = 'width: 15rem; height: 20rem';
    
            const img = document.createElement('img');
            img.className ='card-img-top bookstore__card';
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
            row.appendChild(wrapperCard);
        })     
    }

    return {
        getBooks: getBooks,
    }
})();


// Get data
home.getBooks();



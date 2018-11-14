import { BookService } from './../services/services';
import { backSync } from './features/back-sync';

export const save = (event) => {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const image = document.getElementById('image').value;
    const book = { title, image, description }

    // We always try to post the book
    // In case there is an error or network problem, we sync it
    sendBook(book);
}

const sendBook = (book) => {
    if (book.title.trim() === '' && book.description.trim() === '' && book.image.trim() === '') {
        toastr.warning('You need to fill out all the fields');
    } else {
        new BookService().createBook(book).then(res => {
            if (res.message !== 'Failed to fetch') {
                toastr.success('Book saved correctly', `${book.title}`)
                // setTimeout(() => window.location.href = '/', 2000)
            } else {
                backSync(book);
            }
        }, err => {
            toastr.error(`Something was wrong creating ${book.title} book`)
            backSync(book);
        })
    }
}



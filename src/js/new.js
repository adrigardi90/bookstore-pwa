import { BookService } from './../services/services';
import { idbMethods } from './idb';
import { SYNC_BOOK, IDB_TABLE_SYNC } from './constants';

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

const backSync = async (data) => {
    console.log(`[New] Something was wrong creating ${data.title} book`)
    console.log(`[New] Trying to sync ${data.title} book`)

    // Check browser feature availability and Sync
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        try {
            const sw = await navigator.serviceWorker.ready;
            console.log(sw)
            const syncIdb = await idbMethods.set(data, IDB_TABLE_SYNC);
            const sync = await sw.sync.register(SYNC_BOOK);

            toastr.success('Book ' + data.title + 'saved for syncing');
            console.log(`[New] Book ${data.title} saved for syncing`);
            // setTimeout(() => window.location.href = '/', 2000)
        } catch (error) {
            console.log('[New] Error saving your book for syncing')
            toastr.warning('Error saving your book for syncing');
        }
    } else {
        console.log(`[New] SYNC api not supported in the browser`)
    }
}

const sendBook = (book) => {
    if (book.title.trim() === '' && book.description.trim() === '' && book.image.trim() === '') {
        toastr.warning('You need to fill out all the fields');
    } else {
        new BookService().createBook(book).then(res => {
            if (res.message !== 'Failed to fetch') {
                toastr.success('Book saved correctly', `${book.title}`)
                setTimeout(() => window.location.href = '/', 2000)
            } else {
                backSync(book);
            }
        }, err => {
            toastr.error(`Something was wrong creating ${book.title} book`)
            backSync(book);
        })
    }
}



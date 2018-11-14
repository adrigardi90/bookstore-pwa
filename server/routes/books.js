const webpush = require('web-push');
import { VAPID_DOMAIN, VAPID_PRIVATE_KEY, VAPID_PUBLIC_KEY } from '../constants';
import { subscriptions } from './subscriptions'

let books = [
    {
        "id": 0,
        "title": "Harry Potter I",
        "image": "https://moustique.cdnartwhere.eu/sites/default/files/styles/large/public/field/image/harry_potter.jpg?itok=b7SQ4_r2",
        "description": "Some quick example text to build on the card title and make up the bulk of the card's content"
    }
];


export const BOOKS_ROUTES = {

    GET: {
        method: 'GET',
        path: '/books',
        handler: (request, h) => {
            return h.response(books);
        }
    },
    POST: {
        method: 'POST',
        path: '/books',
        handler: (request, h) => {
            const book = request.payload;
            books.push(book);
            console.log('[NEW BOOK] New book to store ', book)

            // Configure the push notification
            webpush.setVapidDetails(
                VAPID_DOMAIN,
                VAPID_PUBLIC_KEY,
                VAPID_PRIVATE_KEY
            );

            subscriptions.forEach(sub => {
                webpush.sendNotification(sub, JSON.stringify({
                    title: `Book ${book.title} added`,
                    book: book
                })).catch(err => {
                    console.log('[NOTIFICATION] Error sending notification ', err)
                })
            })

            return h.response(book);
        }
    },

}
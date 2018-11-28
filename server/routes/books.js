const webpush = require('web-push');

import { VAPID_DOMAIN, VAPID_PRIVATE_KEY, VAPID_PUBLIC_KEY } from '../constants';
import { subscriptions } from './subscriptions'
import Books from './../db/book';

let books = [
    {
        "id": 0,
        "title": "Harry Potter I",
        "image": "https://moustique.cdnartwhere.eu/sites/default/files/styles/large/public/field/image/harry_potter.jpg?itok=b7SQ4_r2",
        "description": "Some quick example text to build on the card title and make up the bulk of the card's content"
    }
];


export const BOOKS_ROUTES = [

    {
        method: 'GET',
        path: '/books',
        handler: (request, reply) => (
            Books.find((error, books) => {
                if (error) return reply(new Error('Error'))
                return reply.response(books)
            })
        )
    },
    {
        method: 'POST',
        path: '/books',
        handler: (request, reply) => (
            new Promise(resolve => {
                const bookPost = request.payload;
                const _book = new Books(bookPost)

                _book.save((error, book) => {
                    if (error) return reply(new Error('Error'))

                    console.log('[NEW BOOK] New book to store ', book.title, book.id)

                    // Configure the push notification
                    webpush.setVapidDetails(
                        VAPID_DOMAIN,
                        VAPID_PUBLIC_KEY,
                        VAPID_PRIVATE_KEY
                    );

                    subscriptions.forEach(sub => {
                        webpush.sendNotification(sub, JSON.stringify({
                            title: `Book ${book.title} added`,
                            redirectTo: '/'
                        })).catch(err => {
                            console.log('[NOTIFICATION] Error sending notification ', err)
                        })
                    })

                    console.log('[NEW BOOK] New book to storage ', book.title, book.id)

                    return resolve(book)
                })
            })
        )
    },

]
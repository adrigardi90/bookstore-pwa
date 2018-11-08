
// To solve ReferenceError: regeneratorRuntime is not defined when we use async/await with Parcel
import 'babel-polyfill';

export class BookService {

    constructor() {
        this.url = 'http://localhost:3000/books';
    }

    async getBooks() {
        try {
            const books = await fetch(`${this.url}`);
            const data = await books.json();
            return data;
        } catch (error) {
            return error;
        }
    }

    async createBook(book) {
        try {
            const books = await fetch(`${this.url}`, {
                method: 'POST',
                body: JSON.stringify(book),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await books.json();
            return data;
        } catch (error) {
            return error;
        }
    }

    getUrl() {
        return this.url;
    }
}

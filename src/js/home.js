// To solve ReferenceError: regeneratorRuntime is not defined when we use async/await with Parcel
import 'babel-polyfill';

console.log('Home');

const url = 'http://localhost:3000';

const getBooks = async () => {
    try {
        const books = await fetch(`${url}/books`);
        const data = await books.json();
        printBooks(data);
    } catch (error) {
        console.log(error);
    }
} 

const printBooks = (array) => {
    console.log(array);
}

// Get data
getBooks();





import { BookService } from './../services/services';


export const save = (event) => {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const image = document.getElementById('image').value;
    const book = {title, image, description}

    new BookService().createBook(book).then(res => {
        toastr.success('Book saved correctly', `${book.title}`)
        setTimeout( () => window.location.href = '/' , 2000)
    }, err => {
        toastr.error('Something was wrong', `${book.title}`)
        console.log(err)
    })
    
}



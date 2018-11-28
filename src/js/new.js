import { BookService } from './../services/services';
import { backSync } from './features/back-sync';
import { getMedia } from './features/media-polyfill';

const video = document.getElementById('player')
const canvas = document.getElementById('canvas')
const capture = document.getElementById('capture')
const imagePicker = document.getElementById('imagePicker')

const title = document.getElementById('title')
const description = document.getElementById('description');
const image = document.getElementById('image');
let imageCaptured;

export const save = (event) => {
    event.preventDefault();
    // const title = title.value;
    // const description = document.getElementById('description').value;
    // const image = document.getElementById('image').value;
    const book = { 
        title: title.value, 
        image: image.value || imageCaptured, 
        description: description.value 
    }

    // We always try to post the book
    // In case there is an error or network problem, we sync it
    sendBook(book);
}

export const captureImage = (event) => {
    event.preventDefault();
    canvas.style.display = 'block';
    video.style.display = 'none';
    capture.style.display = 'none';

    let canvasContext = canvas.getContext('2d');
    canvasContext.drawImage(video, 0, 0, canvas.clientWidth,  video.videoHeight / (video.videoWidth / canvas.clientWidth))

    // Stop video
    video.srcObject.getVideoTracks().forEach( (img) => img.stop())
    
    // Base64 url from canvas
    imageCaptured = canvas.toDataURL();
}

const sendBook = (book) => {
    if (book.title.trim() === '' || book.description.trim() === '' || book.image.trim() === '') {
        toastr.warning('You need to fill out all the fields');
    } else {
        new BookService().createBook(book).then(res => {
            if (res.message !== 'Failed to fetch') {
                toastr.success('Book saved correctly', `${book.title}`)
                // setTimeout(() => window.location.href = '/', 3000)
            } else {
                backSync(book);
            }
        }, err => {
            toastr.error(`Something was wrong creating ${book.title} book`)
            backSync(book);
        })
    }
}

const init = () => {
    getMedia();

    navigator.mediaDevices.getUserMedia({video: true}).then( (stream) => {
        video.style.display = 'block';
        capture.style.display = 'block';

        video.srcObject = stream;
    }).catch( err => {
        imagePicker.style.display = 'block';
    })
}


// Init
init();


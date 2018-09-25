
console.log('New book');

save = (event) => {
    const title = document.getElementById('title').value;
    const desc = document.getElementById('description').value;
    const image = document.getElementById('image').value;
    console.log(title, desc, image);
    //window.history.back();
    window.location.href = '/';
}



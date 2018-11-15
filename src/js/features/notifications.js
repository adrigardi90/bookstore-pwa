
import { getPushSubcriptions } from './push';


export const enableNotifications = () => {
    Notification.requestPermission().then(result => {
        result !== 'granted' ?
            console.log('[Notifications] Notifications rejected') :
            getPushSubcriptions(); // createNotification()
    });

}

// Notifications options
export const options = {
    body: 'Body',
    icon: '/src/images/icons/app-icon-96x96.png',
    image: '/src/images/books-image.jpg',
    dir: 'ltr',
    lang: 'EN-US',
    vibrate: [100],
    tag: 'new-notification', // id
    badge: '/src/images/icons/app-icon-96x96.png', // icon for the notification bar (just Android)
    renotify: true,
    // actions :[
    //     {
    //         actions: 'confirm',
    //         title: 'Accept',
    //         icon: '/src/images/icons/app-icon-96x96.png',
    //     },
    //     {
    //         actions: 'cancel',
    //         title: 'Cancel',
    //         icon: '/src/images/icons/app-icon-96x96.png',
    //     }
    // ]
}

// Display a notification through SW 
// const createNotification = () => {
//     console.log('[Notification] Notifications accepted')

//     if ('serviceWorker' in navigator) {
//         navigator.serviceWorker.ready.then(sw => {
//             sw.showNotification('Permission accepted', options)
//         })
//     }

// }


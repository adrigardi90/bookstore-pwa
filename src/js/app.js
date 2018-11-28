
import { enableNotifications } from './features/notifications';

const notificationButton = document.getElementById('notification')

if (!window.Promise) {
    window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('./../service-worker.js')
        .then(function () {
            console.log('[App] Service worker registered!');
        })
        .catch(function (err) {
            console.log(err);
        });
}

// Notification & Push API
if (('Notification' in window) && ('serviceWorker' in navigator)) {
    notificationButton.addEventListener('click', enableNotifications)
} else {
    notificationButton.addEventListener('click', () => {
        toastr.warning('Browser does not suppor notifications');
    })
}
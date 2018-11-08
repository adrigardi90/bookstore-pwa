
import { showNotifications } from './features/notifications';

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

// Notification API
if ('Notification' in window) {
    notificationButton.addEventListener('click', showNotifications)
}
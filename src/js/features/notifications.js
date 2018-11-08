

export const showNotifications = () => {
    Notification.requestPermission().then(result => {
        result !== 'granted' ?
            console.log('[Notifications] Notifications rejected') :
            createNotification()
    });

}

// Display a notification through SW when accepting permissions
const createNotification = () => {
    console.log('[Notification] Notifications accepted')

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(sw => {
            sw.showNotification('Permission accepted')
        })
    }

}

import { urlBase64ToUint8Array, PUSH_PUBLIC_KEY} from './../constants';
import { BookService } from './../../services/services';

export const getPushSubcriptions = () => {
    let register;

    navigator.serviceWorker.ready.then(sw => {
        register = sw;
        return sw.pushManager.getSubscription();
    }).then(subscription => {
        if (subscription === null) {
            // Create new subscription and send it to the backend
            // Push subscription are based on the BROWSER, DEVICE and the SW REGISTERED

            // New subscription for register
            // Using VAPID Key for applicationServerKey
            return register.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(PUSH_PUBLIC_KEY)
            })
        }
    }).then(newSubscription => {
        console.log('[NEW SUBSCRIPTION] New subscription: ', newSubscription)
        return new BookService().createSubscription(newSubscription)
    }).then(response => {
        console.log('[PUSH] Push subscription registered')
    })
}
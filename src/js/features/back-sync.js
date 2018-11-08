
import { idbMethods } from './idb';
import { SYNC_BOOK, IDB_TABLE_SYNC } from './../constants';

export const backSync = async (data) => {
    console.log(`[SYNC] Something was wrong creating ${data.title} book`)
    console.log(`[SYNC] Trying to sync ${data.title} book`)

    // Check browser feature availability and Sync
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        try {
            const sw = await navigator.serviceWorker.ready;
            const syncIdb = await idbMethods.set(data, IDB_TABLE_SYNC);
            const sync = await sw.sync.register(SYNC_BOOK);

            toastr.success('Book ' + data.title + 'saved for syncing');
            console.log(`[SYNC] Book ${data.title} saved for syncing`);
            // setTimeout(() => window.location.href = '/', 2000)
        } catch (error) {
            console.log('[SYNC] Error saving your book for syncing')
            toastr.warning('Error saving your book for syncing');
        }
    } else {
        console.log(`[SYNC] SYNC api not supported in the browser`)
    }
}
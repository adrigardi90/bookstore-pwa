
// IDB name
export const IDB_NAME = 'data-books';

// IDB sync table name
export const IDB_TABLE_SYNC = 'books-sync';
// IDB books table name
export const IDB_TABLE = 'books';

// Topic for syncing books
export const SYNC_BOOK = 'sync-new-book';

// Public key to allow server to send push notifications
export const PUSH_PUBLIC_KEY = 'BDdqliEhmJ8Su5y-X0Z2Y_7cBY3u27NleegrQdhP5kuKLbeCJiSEZz7h6TKXbHv0r3pNoeTdg4AsEWuEM6Qu6SQ';

export const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}



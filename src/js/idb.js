import idb from 'idb';
import { IDB_TABLE_SYNC, IDB_TABLE, IDB_NAME } from './constants';

const IDB_VERSION = 1;


/**
 * IDB conection
 */
const idbPromise = idb.open(IDB_NAME, IDB_VERSION, (db) => {
    if (!db.objectStoreNames.contains(IDB_TABLE)) {
        console.log('[Idb] Creating table', IDB_TABLE)
        db.createObjectStore(IDB_TABLE, {
            keyPath: 'id'
        });
    }
    if (!db.objectStoreNames.contains(IDB_TABLE_SYNC)) {
        console.log('[Idb] Creating table', IDB_TABLE_SYNC)
        db.createObjectStore(IDB_TABLE_SYNC, {
            keyPath: 'title'
        });
    }
})

export const idbMethods = {
    get(key, indexDB = IDB_TABLE) {
        return idbPromise.then(db => {
            return db.transaction(indexDB)
                .objectStore(indexDB).get(key);
        });
    },
    set(data, indexDB = IDB_TABLE) {
        return idbPromise.then(db => {
            const tx = db.transaction(indexDB, 'readwrite');
            tx.objectStore(indexDB).put(data);
            return tx.complete;
        });
    },
    getAllData(indexDB = IDB_TABLE) {
        return idbPromise.then(db => {
            const tx = db.transaction(indexDB, 'readonly');
            return tx.objectStore(indexDB).getAll();
        })
    },
    clear(indexDB = IDB_TABLE) {
        return idbPromise.then(db => {
            const tx = db.transaction(indexDB, 'readwrite');
            tx.objectStore(indexDB).clear();
            return tx.complete;
        });
    },
    delete(key, indexDB = IDB_TABLE) {
        return idbPromise.then(db => {
            const tx = db.transaction(indexDB, 'readwrite');
            tx.objectStore(indexDB).delete(key);
            return tx.complete;
        });
    },
}
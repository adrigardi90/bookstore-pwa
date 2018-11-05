import idb from 'idb';

const IDB_VERSION = 1;
const IDB_NAME = 'data-posts';
const IDB_TABLE = 'postss';

/**
 * IDB conection
 */
const idbPromise = idb.open(IDB_NAME, IDB_VERSION, (db) => {
    if (!db.objectStoreNames.contains(IDB_TABLE)) {
        console.log('creating table')
        db.createObjectStore(IDB_TABLE, {
            keyPath: 'id'
        });
    }
})

export const idbMethods = {
    get(key) {
        return idbPromise.then(db => {
            return db.transaction(IDB_TABLE)
                .objectStore(IDB_TABLE).get(key);
        });
    },
    set(data) {
        return idbPromise.then(db => {
            const tx = db.transaction(IDB_TABLE, 'readwrite');
            tx.objectStore(IDB_TABLE).put(data);
            return tx.complete;
        });
    },
    getAllData() {
        return idbPromise.then(db => {
            const tx = db.transaction(IDB_TABLE, 'readonly');
            return tx.objectStore(IDB_TABLE).getAll();
        })
    },
    clear() {
        return idbPromise.then(db => {
            const tx = db.transaction(IDB_TABLE, 'readwrite');
            tx.objectStore(IDB_TABLE).clear();
            return tx.complete;
        });
    },
}
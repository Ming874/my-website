export interface VaultEntry {
  id: number;
  label: string;
  encrypted: ArrayBuffer;
  iv: Uint8Array;
}

let dbInstance: IDBDatabase | null = null;

export function initDB(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("AuthenticatorDB", 1);
    request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("vault")) {
        db.createObjectStore("vault", { keyPath: "id" });
      }
    };
    request.onsuccess = (e: Event) => {
      dbInstance = (e.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getAllVaultEntries(): Promise<VaultEntry[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("vault", "readonly");
    const store = tx.objectStore("vault");
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function addVaultEntry(entry: VaultEntry): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("vault", "readwrite");
    const store = tx.objectStore("vault");
    const request = store.add(entry);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function deleteVaultEntry(id: number): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("vault", "readwrite");
    const store = tx.objectStore("vault");
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

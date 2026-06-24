// NeighborHub Firebase Integration Service
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  where 
} from 'firebase/firestore';
import { 
  Post, 
  Comment, 
  NeighborhoodEvent, 
  LostFoundItem, 
  HelpRequest, 
  MarketplaceListing, 
  SafetyAlert, 
  Report, 
  Notification, 
  AuditLog, 
  FileAttachment, 
  User 
} from '../types';
import { 
  INITIAL_POSTS, 
  INITIAL_COMMENTS, 
  INITIAL_EVENTS, 
  INITIAL_LOST_FOUND, 
  INITIAL_HELP_REQUESTS, 
  INITIAL_MARKETPLACE, 
  INITIAL_ALERTS, 
  INITIAL_REPORTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_LOGS 
} from '../data';

// Firebase Web Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtWdwUizo62QYoOrci05tRQncuTE7frfA",
  authDomain: "geometric-topic-j07pf.firebaseapp.com",
  projectId: "geometric-topic-j07pf",
  storageBucket: "geometric-topic-j07pf.firebasestorage.app",
  messagingSenderId: "589532812870",
  appId: "1:589532812870:web:54d7611b6ef57cd7359c47"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific Database ID
export const db = getFirestore(app, "ai-studio-b8c5b7e9-0271-4e9c-bf6d-87bc77cadd59");

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Seeds a collection with default initial data if it contains 0 documents.
 */
async function seedCollectionIfEmpty<T extends { id: string }>(
  collectionName: string, 
  initialData: T[]
) {
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      console.log(`Seeding collection '${collectionName}' with default mock data...`);
      for (const item of initialData) {
        // Use predefined IDs to avoid duplicate creation and maintain reference integrity
        const docRef = doc(db, collectionName, item.id);
        await setDoc(docRef, item);
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, collectionName);
  }
}

/**
 * Master seeding function called once when the app boots up.
 */
export async function seedDatabase() {
  await seedCollectionIfEmpty('posts', INITIAL_POSTS);
  await seedCollectionIfEmpty('comments', INITIAL_COMMENTS);
  await seedCollectionIfEmpty('events', INITIAL_EVENTS);
  await seedCollectionIfEmpty('lost_found', INITIAL_LOST_FOUND);
  await seedCollectionIfEmpty('help_requests', INITIAL_HELP_REQUESTS);
  await seedCollectionIfEmpty('marketplace', INITIAL_MARKETPLACE);
  await seedCollectionIfEmpty('alerts', INITIAL_ALERTS);
  await seedCollectionIfEmpty('reports', INITIAL_REPORTS);
  await seedCollectionIfEmpty('notifications', INITIAL_NOTIFICATIONS);
  await seedCollectionIfEmpty('audit_logs', INITIAL_AUDIT_LOGS);

  // Seed initial shared files from posts and events
  try {
    const filesCol = collection(db, 'shared_files');
    const filesSnapshot = await getDocs(filesCol);
    if (filesSnapshot.empty) {
      const initialAttachments: FileAttachment[] = [];
      INITIAL_POSTS.forEach(p => p.fileAttachments.forEach(att => initialAttachments.push(att)));
      INITIAL_EVENTS.forEach(e => e.attachedFiles.forEach(att => initialAttachments.push(att)));
      
      for (const file of initialAttachments) {
        const docRef = doc(db, 'shared_files', file.id);
        await setDoc(docRef, file);
      }
    }
  } catch (err) {
    console.error("Error seeding shared_files:", err);
  }
}

// ============================================================================
// Real-time Listeners (onSnapshot Wrapper helpers)
// ============================================================================

export function subscribeToCollection<T>(
  collectionName: string,
  onUpdate: (data: T[]) => void,
  sortByField?: string,
  sortDir: 'asc' | 'desc' = 'asc'
) {
  const colRef = collection(db, collectionName);
  const q = sortByField ? query(colRef, orderBy(sortByField, sortDir)) : colRef;
  
  return onSnapshot(q, (snapshot) => {
    const items: T[] = [];
    snapshot.forEach((doc) => {
      items.push({ ...doc.data() } as T);
    });
    onUpdate(items);
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, collectionName);
  });
}

// ============================================================================
// Generic Firestore Mutators
// ============================================================================

export async function addFirestoreDoc(collectionName: string, id: string, data: any) {
  try {
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, { ...data, id });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${collectionName}/${id}`);
  }
}

export async function updateFirestoreDoc(collectionName: string, id: string, data: any) {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${collectionName}/${id}`);
  }
}

export async function deleteFirestoreDoc(collectionName: string, id: string) {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${id}`);
  }
}

// ============================================================================
// Registered Custom Users Store Helper
// ============================================================================

export async function registerCustomUser(user: User) {
  try {
    await addFirestoreDoc('custom_users', user.id, user);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `custom_users/${user.id}`);
  }
}

export async function fetchCustomUsers(): Promise<User[]> {
  try {
    const colRef = collection(db, 'custom_users');
    const snapshot = await getDocs(colRef);
    const users: User[] = [];
    snapshot.forEach((doc) => {
      users.push(doc.data() as User);
    });
    return users;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'custom_users');
    return [];
  }
}

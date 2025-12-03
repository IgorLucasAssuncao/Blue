import {
	createUserWithEmailAndPassword,
	signOut as firebaseSignOut,
	signInWithEmailAndPassword,
	User
} from 'firebase/auth';
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	query,
	setDoc,
	where
} from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import { BluetoothDevice } from '../types';

class FirebaseService {
	// ========== Authentication ==========

	async signUp(email: string, password: string): Promise<User> {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		return userCredential.user;
	}

	async signIn(email: string, password: string): Promise<User> {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		return userCredential.user;
	}

	async signOut(): Promise<void> {
		await firebaseSignOut(auth);
	}

	getCurrentUser(): User | null {
		return auth.currentUser;
	}

	// ========== Firestore - Device Vault ==========

	async syncDevice(device: BluetoothDevice): Promise<void> {
		const user = this.getCurrentUser();
		if (!user) throw new Error('User must be authenticated to sync devices');

		const deviceData = {
			...device,
			userId: user.uid,
			isSynced: true,
			updatedAt: new Date().toISOString()
		};

		await setDoc(doc(db, 'devices', device.id), deviceData);
	}

	async getDevices(): Promise<BluetoothDevice[]> {
		const user = this.getCurrentUser();
		if (!user) return [];

		const q = query(collection(db, 'devices'), where('userId', '==', user.uid));
		const querySnapshot = await getDocs(q);

		const devices: BluetoothDevice[] = [];
		querySnapshot.forEach((doc) => {
			devices.push(doc.data() as BluetoothDevice);
		});

		return devices;
	}

	async deleteDevice(deviceId: string): Promise<void> {
		await deleteDoc(doc(db, 'devices', deviceId));
	}

	async getDevice(deviceId: string): Promise<BluetoothDevice | null> {
		const docRef = doc(db, 'devices', deviceId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			return docSnap.data() as BluetoothDevice;
		}
		return null;
	}
}

export const firebaseService = new FirebaseService();

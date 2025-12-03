import { User, onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebaseConfig';
import { firebaseService } from '../services/FirebaseService';

type AuthContextType = {
	user: User | null;
	loading: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
			setLoading(false);
		});

		return unsubscribe;
	}, []);

	const signIn = async (email: string, password: string) => {
		await firebaseService.signIn(email, password);
	};

	const signUp = async (email: string, password: string) => {
		await firebaseService.signUp(email, password);
	};

	const signOut = async () => {
		await firebaseService.signOut();
	};

	return (
		<AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error('useAuth must be used within AuthProvider');
	return context;
};

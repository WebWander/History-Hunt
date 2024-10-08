import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc} from "firebase/firestore";


export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsAuthenticated(true);
                const userData = await fetchUserData(user.uid);
                setUser(userData);
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        });
        return unsub;
    }, []);

    const fetchUserData = async (userId) => {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { ...docSnap.data(), uid: userId };
        }
        return null;
    };

    const register = async (email, password, username) => {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", response.user.uid), {
                username,
                userId: response.user.uid
            });
            const userData = await fetchUserData(response.user.uid);
            setUser(userData);
            return { success: true, data: response.user };
        } catch (error) {
            let msg = error.message;
            if (msg.includes('(auth/email-already-in-use)')) msg = 'Email already in use';
            else if (msg.includes('(auth/invalid-email)')) msg = 'Invalid email';
            else if (msg.includes('(auth/weak-password)')) msg = 'Password should be at least 6 characters';
            else msg = 'An error occurred. Please try again later.';
            return { success: false, msg };
        }
    };

    const login = async (email, password) => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            const userData = await fetchUserData(response.user.uid);
            setUser(userData);
            return { success: true };
        } catch (error) {
            let msg = error.message;
            if (msg.includes('(auth/invalid-credentials)')) msg = 'Invalid credentials';
            else if (msg.includes('(auth/invalid-email)')) msg = 'Invalid email';
            else msg = 'An error occurred. Please try again later.';
            return { success: false, msg };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setIsAuthenticated(false);
            return { success: true };
        } catch (error) {
            return { success: false, msg: error.message };
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const value = useContext(AuthContext);
    if (!value) {
        throw new Error('useAuth must be used within an AuthContextProvider');
    }
    return value;
};

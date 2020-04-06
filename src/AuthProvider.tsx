import * as firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import * as React from 'react';

const config = {
  apiKey: 'AIzaSyDwjP9xGN_L1717AL2aKqs5risj8UKGDCM',
  authDomain: 'syncscreen-c6e59.firebaseapp.com',
  projectId: 'syncscreen-c6e59',
};

firebase.initializeApp(config);

const AuthContext = React.createContext<{
  user: firebase.User | null;
  isAuthLoaded: boolean;
  logout: () => Promise<void>;
}>({
  user: null,
  isAuthLoaded: false,
  logout: () => Promise.resolve(),
});

interface Props {
  children: React.ReactNode;
}

const auth = firebase.auth();
const firestore = firebase.firestore();

export function AuthProvider({ children }: Props) {
  const [user, setUser] = React.useState(auth.currentUser);
  const [isAuthLoaded, setIsAuthLoaded] = React.useState(false);

  React.useEffect(() => {
    async function updateUser(u: firebase.User | null) {
      if (!u || !u.uid) {
        return;
      }

      await firestore.collection('users').doc(u.uid).update({
        lastLoginTime: new Date().toUTCString(),
      });
    }

    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setIsAuthLoaded(true);
      updateUser(u);
    });

    return () => unsubscribe();
  }, [user]);

  const logout = React.useCallback(() => {
    return auth.signOut();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthLoaded, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}

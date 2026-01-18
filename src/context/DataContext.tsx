import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, doc, onSnapshot, setDoc, addDoc, updateDoc, deleteDoc 
} from 'firebase/firestore';
import { 
  onAuthStateChanged, signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, signOut, updateProfile 
} from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { db, auth } from '../firebase';
import { 
  SiteContent, Event, Secretary, Registration, UserProfile, 
  Theme, DEFAULT_CONTENT, Badge 
} from '../types';

type DataContextType = {
  content: SiteContent;
  updateContent: (path: string, value: any) => Promise<void>;
  events: Event[];
  addEvent: (evt: Event) => Promise<void>;
  updateEvent: (id: string, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  registrations: Registration[];
  registerForEvent: (eventId: string, formData: any) => Promise<void>;
  user: UserProfile | null;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name: string, batch: string, avatar: string) => Promise<void>;
  logout: () => Promise<void>;
  theme: Theme;
  setTheme: (t: Theme) => void;
  loading: boolean;
  secretaries: Secretary[];
  addSecretary: (sec: Secretary) => Promise<void>;
  updateSecretary: (id: string, updates: Partial<Secretary>) => Promise<void>;
  deleteSecretary: (id: string) => Promise<void>;
};

export const DataContext = createContext<DataContextType>({} as any);

export function useData() {
    return useContext(DataContext);
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [events, setEvents] = useState<Event[]>([]);
  const [secretaries, setSecretaries] = useState<Secretary[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [theme, setTheme] = useState<Theme>({ primaryColor: '#10b981', secondaryColor: '#06b6d4' });
  const [loading, setLoading] = useState(true);

  // --- Real-time Data Sync ---
  useEffect(() => {
    // 1. Content Sync
    const contentUnsub = onSnapshot(doc(db, "site_content", "main"), (snapshot) => {
      if (snapshot.exists()) {
        setContent(snapshot.data() as SiteContent);
      } else {
        // Initialize if missing
        setDoc(doc(db, "site_content", "main"), DEFAULT_CONTENT);
      }
    });

    // 2. Events Sync
    const eventsUnsub = onSnapshot(collection(db, "events"), (snapshot) => {
      const loadedEvents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
      setEvents(loadedEvents);
    });

    // 3. Secretaries Sync
    const secretariesUnsub = onSnapshot(collection(db, "secretaries"), (snapshot) => {
      const loadedSecretaries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Secretary));
      // Sort by order if available, else by name
      loadedSecretaries.sort((a, b) => (a.order || 0) - (b.order || 0));
      setSecretaries(loadedSecretaries);
    });

    return () => { contentUnsub(); eventsUnsub(); secretariesUnsub(); };
  }, []);

  // 4. Registrations Sync
  useEffect(() => {
    if (user?.role === 'admin') {
      const regUnsub = onSnapshot(collection(db, "registrations"), (snapshot) => {
        const loadedRegs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Registration));
        setRegistrations(loadedRegs);
      });
      return () => regUnsub();
    } else {
      setRegistrations([]);
    }
  }, [user?.role]);

  // --- Actions ---
  const updateContent = async (path: string, value: any) => {
    // Optimistic update
    setContent(prev => ({ ...prev, [path]: value }));
    // DB Update
    await setDoc(doc(db, "site_content", "main"), { [path]: value }, { merge: true });
  };

  const addEvent = async (evt: Event) => {
    const { id, ...eventData } = evt;
    await addDoc(collection(db, "events"), eventData);
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    await updateDoc(doc(db, "events", id), updates);
  };
  
  const deleteEvent = async (id: string) => {
    await deleteDoc(doc(db, "events", id));
  };

  const addSecretary = async (sec: Secretary) => {
    // Explicitly destructure to ensure we only save what we intend
    const { id, name, role, image, description, order } = sec;
    const dataToSave = { name, role, image, description, order };
    
    console.log("DataContext: Saving secretary to Firestore:", dataToSave);
    try {
      const docRef = await addDoc(collection(db, "secretaries"), dataToSave);
      console.log("DataContext: Secretary saved with ID:", docRef.id);
    } catch (e) {
      console.error("DataContext: Error saving secretary:", e);
      throw e;
    }
  };

  const updateSecretary = async (id: string, updates: Partial<Secretary>) => {
    await updateDoc(doc(db, "secretaries", id), updates);
  };

  const deleteSecretary = async (id: string) => {
    await deleteDoc(doc(db, "secretaries", id));
  };

  // --- Auth Handlers ---
  useEffect(() => {
    let userUnsub: (() => void) | null = null;
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // Clean up previous user listener
      if (userUnsub) {
        userUnsub();
        userUnsub = null;
      }
      
      if (currentUser) {
        // Set up real-time listener for user profile
        try {
          const docRef = doc(db, "users", currentUser.uid);
          
          // Use onSnapshot for real-time updates
          userUnsub = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
              setUser(docSnap.data() as UserProfile);
            } else {
              // Fallback if doc missing (shouldn't happen on normal flow)
              setUser({
                uid: currentUser.uid,
                name: currentUser.displayName || "User",
                email: currentUser.email || "",
                role: "student",
                badges: [],
                batch: "2024",
                avatar: "eco1"
              });
            }
          });
        } catch (error) {
          console.error("Error setting up user listener:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    
    return () => {
      unsubscribe();
      if (userUnsub) userUnsub();
    };
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signup = async (email: string, pass: string, name: string, batch: string, avatar: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    if (res.user) {
      // Update Auth Profile
      await updateProfile(res.user, { displayName: name });

      // Create Firestore Profile
      const newUserProfile: UserProfile = {
        uid: res.user.uid,
        name: name,
        email: email,
        role: 'student', // Default role
        badges: [],
        batch: batch,
        avatar: avatar
      };
      
      await setDoc(doc(db, "users", res.user.uid), newUserProfile);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const registerForEvent = async (eventId: string, formData: any) => {
    if (!user) return;
    
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    // 1. Create Registration Record
    const newRegData = {
      userId: user.uid,
      userName: user.name,
      userEmail: user.email,
      eventId,
      eventTitle: event.title,
      timestamp: new Date().toISOString(),
      formData
    };
    
    await addDoc(collection(db, "registrations"), newRegData);

    // 2. Add Badge to User
    const newBadge: Badge = {
      id: Math.random().toString(36).substr(2, 9),
      eventId,
      name: event.badgeName,
      image: event.badgeImage,
      status: 'pending'
    };
    
    // Safety check if user.badges is undefined
    const currentBadges = user.badges || [];
    const updatedBadges = [...currentBadges, newBadge];
    await updateDoc(doc(db, "users", user.uid), { badges: updatedBadges });
  };

  // More aggressive timeout for loading state
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 2000); 
    return () => clearTimeout(timeout);
  }, [loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-lime-500 animate-spin" />
          <p className="text-slate-400 font-medium animate-pulse">Loading EcoClub...</p>
        </div>
      </div>
    );
  }

  return (
    <DataContext.Provider value={{ 
      content, updateContent, events, addEvent, updateEvent, deleteEvent, 
      registrations, registerForEvent, user, login, signup, logout, theme, setTheme, loading,
      secretaries, addSecretary, updateSecretary, deleteSecretary
    }}>
      {children}
    </DataContext.Provider>
  );
}

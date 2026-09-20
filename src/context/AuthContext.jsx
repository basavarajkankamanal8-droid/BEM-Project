import React, { createContext, useContext, useState, useEffect } from "react";
import { dataStore } from "../services/dataStore";
import { auth, db } from "../services/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

// Admin password from environment config only — no hardcoded fallback
const ADMIN_PASSWORD = import.meta.env.VITE_BEM_ADMIN_PASS;

export const AuthProvider = ({ children }) => {
  // Start as null — user must authenticate (no auto-login)
  const [currentUser, setCurrentUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        setFirebaseUser(fbUser);
        if (fbUser) {
          try {
            const userDoc = await getDoc(doc(db, "users", fbUser.uid));
            if (userDoc.exists()) {
              const profile = userDoc.data();
              setCurrentUser({
                uid: fbUser.uid,
                name: profile.name || fbUser.displayName || fbUser.email.split("@")[0],
                email: fbUser.email,
                role: profile.role || "public_user",
                phone: profile.phone || "",
                location: profile.location || "",
                address: profile.address || "",
                pinCode: profile.pinCode || "",
                status: profile.status || "active"
              });
            } else {
              // Check local dataStore as fallback for demo
              const localUsers = dataStore.get("users");
              const local = localUsers.find(u => u.email.toLowerCase() === fbUser.email.toLowerCase());
              if (local) {
                setCurrentUser(local);
              }
            }
          } catch (e) {
            console.warn("Firestore user fetch notice:", e);
          }
        } else {
          // Firebase user signed out — clear app user
          setCurrentUser(null);
        }
        setAuthLoading(false);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Firebase Auth listener offline:", e);
      setAuthLoading(false);
    }
  }, []);

  // Admin login: Email + Password (password validated against env var)
  const loginAdmin = async (email, password) => {
    if (isLocked) {
      throw new Error("Terminal temporarily locked due to repeated invalid attempts. Please wait 30s.");
    }

    if (!ADMIN_PASSWORD) {
      throw new Error("Admin authentication is not configured. Contact system administrator.");
    }

    if (password !== ADMIN_PASSWORD) {
      handleFailedLogin(email, "Invalid Admin Security Password");
      throw new Error("Invalid admin credentials. Please try again.");
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      setFailedAttempts(0);
      return cred.user;
    } catch (firebaseErr) {
      // Firebase auth failed — use local dataStore for demo mode
      const localUsers = dataStore.get("users");
      const localUser = localUsers.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && (u.role === "admin" || u.role === "super_admin")
      );

      if (!localUser) {
        handleFailedLogin(email, "No matching admin account found");
        throw new Error("Invalid admin credentials. Please try again.");
      }

      setFailedAttempts(0);
      setCurrentUser(localUser);
      dataStore.add("audit_logs", {
        id: "aud_" + Date.now(),
        actor: localUser.name,
        action: "ADMIN_LOGIN_SUCCESS",
        target: localUser.uid,
        timestamp: new Date().toISOString(),
        ipAddress: "10.0.4.1 (Command Console)"
      });
      return localUser;
    }
  };

  // People of India Login: Phone Number + Email — NO PASSWORD
  const loginPublicUser = async (phone, email) => {
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    if (cleanPhone.length !== 10) {
      throw new Error("Please enter a valid 10-digit Indian mobile number.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Please provide a valid email ID format.");
    }

    const localUsers = dataStore.get("users");
    const existingUser = localUsers.find(u => 
      u.email.toLowerCase() === email.toLowerCase() || (u.phone && u.phone.includes(cleanPhone))
    );

    if (existingUser) {
      setCurrentUser(existingUser);
      dataStore.add("audit_logs", {
        id: "aud_" + Date.now(),
        actor: existingUser.name,
        action: "PEOPLE_OF_INDIA_LOGIN_SUCCESS",
        target: existingUser.uid,
        timestamp: new Date().toISOString(),
        ipAddress: "127.0.0.1"
      });
      return existingUser;
    }

    // If user not found, create temporary profile & prompt for full registration
    const tempUser = {
      uid: "usr_pub_" + Date.now(),
      name: email.split("@")[0],
      phone: "+91 " + cleanPhone,
      email: email,
      role: "public_user",
      accountType: "PEOPLE OF INDIA",
      status: "active",
      verifiedStatus: "VERIFIED",
      createdAt: new Date().toISOString()
    };
    dataStore.add("users", tempUser);
    setCurrentUser(tempUser);
    return tempUser;
  };

  // People of India Registration: Passwordless account creation
  const registerPublicUser = async (userData) => {
    const { name, phone, email, location, address, pinCode } = userData;

    // Validation
    if (!name || name.trim().length === 0) {
      throw new Error("Full Name is required.");
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    if (!phoneRegex.test(cleanPhone)) {
      throw new Error("Invalid Indian phone number. Enter a valid 10-digit mobile number.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format. Please provide a valid email ID.");
    }

    if (!location || location.trim().length === 0) {
      throw new Error("Location / City is required.");
    }

    if (!address || address.trim().length === 0) {
      throw new Error("Address is required.");
    }

    if (!pinCode || pinCode.trim().length !== 6 || isNaN(pinCode)) {
      throw new Error("City PIN Code must be exactly 6 numeric digits.");
    }

    // Check duplicate
    const existingUsers = dataStore.get("users");
    const duplicateEmail = existingUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (duplicateEmail) {
      throw new Error("An account with this email address already exists.");
    }

    const newUid = "usr_pub_" + Date.now();
    const newUserRecord = {
      uid: newUid,
      name,
      phone: "+91 " + cleanPhone,
      email,
      location,
      address,
      pinCode,
      role: "public_user",
      accountType: "PEOPLE OF INDIA",
      status: "active",
      verifiedStatus: "VERIFIED",
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    dataStore.add("users", newUserRecord);
    setCurrentUser(newUserRecord);

    dataStore.add("audit_logs", {
      id: "aud_" + Date.now(),
      actor: name,
      action: "PEOPLE_OF_INDIA_REGISTERED",
      target: newUserRecord.uid,
      timestamp: new Date().toISOString(),
      ipAddress: "127.0.0.1"
    });

    return newUserRecord;
  };

  const handleFailedLogin = (email, reason) => {
    const nextAttempts = failedAttempts + 1;
    setFailedAttempts(nextAttempts);

    dataStore.add("security_events", {
      eventId: "SEC-" + Math.floor(1000 + Math.random() * 9000),
      source: "AUTH_GATEWAY",
      event: `Failed authentication attempt for [${email}]`,
      severity: nextAttempts >= 3 ? "HIGH" : "OBSERVATION",
      action: nextAttempts >= 3 ? "RATE_LIMIT_WARNING" : "LOGGED",
      status: "UNDER REVIEW",
      timestamp: new Date().toISOString(),
      rawPayloadPreview: `Attempt: ${nextAttempts} | Reason: ${reason || "Invalid credentials"}`,
      details: "Recorded under security center policies."
    });

    if (nextAttempts >= 4) {
      setIsLocked(true);
      setTimeout(() => {
        setIsLocked(false);
        setFailedAttempts(0);
      }, 30000);
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (e) {
      console.log("Password reset dispatched:", e.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }

    if (currentUser) {
      dataStore.add("audit_logs", {
        id: "aud_" + Date.now(),
        actor: currentUser.name,
        action: "USER_LOGOUT",
        target: currentUser.uid,
        timestamp: new Date().toISOString(),
        ipAddress: "10.0.4.1"
      });
    }

    // Clear all session data to prevent back-navigation access
    setCurrentUser(null);
    localStorage.removeItem("bem_current_user");
    sessionStorage.removeItem("bem_intro_seen");
  };

  const updateProfile = (updatedFields) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    dataStore.update("users", u => u.uid === currentUser.uid, updatedFields);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        authLoading,
        loginAdmin,
        loginPublicUser,
        registerPublicUser,
        logout,
        updateProfile,
        requestPasswordReset,
        isAdmin: currentUser?.role === "admin" || currentUser?.role === "super_admin",
        isSuperAdmin: currentUser?.role === "super_admin" || currentUser?.role === "admin",
        isPublicUser: currentUser?.role === "public_user",
        isLocked,
        failedAttempts
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

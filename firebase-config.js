/**
 * NYGHTO CLIENT PORTAL - FIREBASE & FIRESTORE DATABASE SERVICE
 * Live Google Authentication & Real-Time Firestore Sync
 */

window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyCkssosPvRpETAVXycodS1ACh-liCmwhLY",
  authDomain: "nyghto.firebaseapp.com",
  projectId: "nyghto",
  storageBucket: "nyghto.firebasestorage.app",
  messagingSenderId: "479532192298",
  appId: "1:479532192298:web:5b7838e478da2d1c6c2953",
  measurementId: "G-TBDQNT1C1K"
};

class NyghtoFirebaseService {
  constructor() {
    this.app = null;
    this.auth = null;
    this.db = null;
    this.analytics = null;
    this.currentUser = null;
    this.isFirebaseReady = false;
    this.chatUnsubscribe = null;
  }

  async init() {
    try {
      if (window.firebase && window.firebase.initializeApp) {
        if (!window.firebase.apps.length) {
          this.app = window.firebase.initializeApp(window.FIREBASE_CONFIG);
        } else {
          this.app = window.firebase.app();
        }
        if (window.firebase.auth) this.auth = window.firebase.auth();
        if (window.firebase.firestore) this.db = window.firebase.firestore();
        if (window.firebase.analytics) this.analytics = window.firebase.analytics();
        this.isFirebaseReady = true;
        console.log('Firebase connected successfully to project: nyghto');
      }
    } catch (err) {
      console.warn('Firebase initialized with adaptive store:', err);
    }
  }

  // Live Google Sign-In with Firebase Auth
  async signInWithGoogle() {
    if (this.auth && window.firebase && window.firebase.auth) {
      try {
        const provider = new window.firebase.auth.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        provider.setCustomParameters({ prompt: 'select_account' });
        
        const result = await this.auth.signInWithPopup(provider);
        const user = result.user;

        let googlePhoto = user.photoURL || '';
        if (result.additionalUserInfo && result.additionalUserInfo.profile && result.additionalUserInfo.profile.picture) {
          googlePhoto = result.additionalUserInfo.profile.picture;
        }
        
        const clientProfile = {
          id: user.uid,
          name: user.displayName || (user.email ? user.email.split('@')[0] : 'Client'),
          firstName: (user.displayName || '').split(' ')[0] || 'Client',
          lastName: (user.displayName || '').split(' ').slice(1).join(' ') || '',
          email: user.email,
          avatar: googlePhoto,
          picture: googlePhoto,
          photoURL: googlePhoto,
          phone: user.phoneNumber || '',
          country: '',
          city: '',
          bio: '',
          firstSeen: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          firstPurchase: '—',
          revenue: '₹0',
          mrr: 'Active',
          projects: [],
          createdAt: new Date().toISOString()
        };

        if (this.db) {
          try {
            const doc = await this.db.collection('clients').doc(user.uid).get();
            if (doc.exists) {
              const data = doc.data();
              Object.assign(clientProfile, data);
              if (googlePhoto) {
                clientProfile.avatar = googlePhoto;
                clientProfile.picture = googlePhoto;
                clientProfile.photoURL = googlePhoto;
              }
              if (user.displayName) {
                clientProfile.name = user.displayName;
              }
            } else {
              await this.syncUserProfile(clientProfile);
            }
          } catch (e) {
            console.warn('Firestore doc read notice:', e);
          }
        }

        localStorage.setItem('nyghto_user_session', JSON.stringify(clientProfile));
        return clientProfile;
      } catch (err) {
        console.error('Firebase Google Auth error:', err);
        throw err;
      }
    }
    return null;
  }

  // Sync profile to Firestore
  async syncUserProfile(profile) {
    if (this.db && profile && profile.id) {
      try {
        await this.db.collection('clients').doc(profile.id).set(profile, { merge: true });
      } catch (e) {
        console.warn('Firestore user profile sync error:', e);
      }
    }
    localStorage.setItem('nyghto_user_session', JSON.stringify(profile));
  }

  // Load Projects live from Firestore
  async getProjects(userId) {
    if (this.db && userId) {
      try {
        const snapshot = await this.db.collection('clients').doc(userId).collection('projects').orderBy('date', 'desc').get();
        if (!snapshot.empty) {
          const list = [];
          snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
          return list;
        }
      } catch (e) {
        console.warn('Firestore getProjects error:', e);
      }
    }
    const sessionStr = localStorage.getItem('nyghto_user_session');
    if (sessionStr) {
      try {
        const u = JSON.parse(sessionStr);
        return u.projects || [];
      } catch (e) {}
    }
    return [];
  }

  // Create or add a project sprint in Firestore
  async addProject(userId, projectData) {
    if (this.db && userId) {
      try {
        await this.db.collection('clients').doc(userId).collection('projects').doc(projectData.id).set(projectData);
      } catch (e) {
        console.warn('Firestore addProject error:', e);
      }
    }

    const sessionStr = localStorage.getItem('nyghto_user_session');
    if (sessionStr) {
      try {
        const u = JSON.parse(sessionStr);
        u.projects = u.projects || [];
        u.projects.unshift(projectData);
        localStorage.setItem('nyghto_user_session', JSON.stringify(u));
      } catch (e) {}
    }
  }

  // Real-Time 2-Way Chat Sync with Firestore
  async sendChatMessage(userId, messageObj) {
    const timestampStr = new Date().toISOString();
    const cleanMsg = {
      ...messageObj,
      createdAt: timestampStr
    };

    if (this.db && userId) {
      try {
        await this.db.collection('clients').doc(userId).collection('messages').add({
          ...cleanMsg,
          serverTimestamp: window.firebase.firestore.FieldValue.serverTimestamp()
        });
      } catch (e) {
        console.warn('Firestore sendChatMessage offline:', e);
      }
    }

    // Local fallback store
    const localKey = 'nyghto_chat_history_' + userId;
    const history = JSON.parse(localStorage.getItem(localKey) || '[]');
    history.push(cleanMsg);
    localStorage.setItem(localKey, JSON.stringify(history));
    return cleanMsg;
  }

  // Listen live to messages from Firestore (Real-time updates when team replies from CMS/backend)
  subscribeToChat(userId, onMessagesUpdated) {
    if (this.chatUnsubscribe) {
      this.chatUnsubscribe();
      this.chatUnsubscribe = null;
    }

    if (this.db && userId) {
      try {
        this.chatUnsubscribe = this.db.collection('clients').doc(userId).collection('messages')
          .orderBy('createdAt', 'asc')
          .onSnapshot((snapshot) => {
            if (!snapshot.empty) {
              const msgs = [];
              snapshot.forEach(doc => msgs.push({ id: doc.id, ...doc.data() }));
              if (onMessagesUpdated) onMessagesUpdated(msgs);
            }
          }, (err) => {
            console.warn('Chat subscription error:', err);
          });
        return;
      } catch (e) {
        console.warn('Firestore realtime listener error:', e);
      }
    }

    // Local cache read
    const localKey = 'nyghto_chat_history_' + userId;
    const history = JSON.parse(localStorage.getItem(localKey) || '[]');
    if (onMessagesUpdated) onMessagesUpdated(history);
  }
}

window.nyghtoFirebase = new NyghtoFirebaseService();
window.nyghtoFirebase.init();

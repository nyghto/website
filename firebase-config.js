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

  // Real-time live listener for client profile and project updates
  subscribeToProjects(userId, onProjectsUpdated) {
    if (this.projectsUnsubscribe) {
      this.projectsUnsubscribe();
      this.projectsUnsubscribe = null;
    }

    if (this.db && userId) {
      try {
        // Listen to client document
        this.projectsUnsubscribe = this.db.collection('clients').doc(userId)
          .onSnapshot((docSnap) => {
            if (docSnap.exists) {
              const data = docSnap.data();
              if (data.projects && Array.isArray(data.projects)) {
                // Update local storage session
                const sessionStr = localStorage.getItem('nyghto_user_session');
                if (sessionStr) {
                  try {
                    const u = JSON.parse(sessionStr);
                    u.projects = data.projects;
                    if (data.name) u.name = data.name;
                    if (data.company) u.company = data.company;
                    if (data.bannerColor) u.bannerColor = data.bannerColor;
                    if (data.bio) u.bio = data.bio;
                    if (data.phone) u.phone = data.phone;
                    if (data.avatar || data.picture || data.photoURL) {
                      u.avatar = data.avatar || data.picture || data.photoURL;
                      u.picture = u.avatar;
                      u.photoURL = u.avatar;
                    }
                    if (data.invoices) u.invoices = data.invoices;
                    if (data.revenue) u.revenue = data.revenue;
                    localStorage.setItem('nyghto_user_session', JSON.stringify(u));
                  } catch (e) {}
                }
                if (onProjectsUpdated) onProjectsUpdated(data.projects);
              }
            }
          }, (err) => {
            console.warn('Projects realtime listener notice:', err);
          });
        return;
      } catch (e) {
        console.warn('subscribeToProjects error:', e);
      }
    }
  }

  // Load Projects live from Firestore
  async getProjects(userId) {
    if (this.db && userId) {
      try {
        const docSnap = await this.db.collection('clients').doc(userId).get();
        if (docSnap.exists) {
          const data = docSnap.data();
          if (data.projects && Array.isArray(data.projects)) {
            return data.projects;
          }
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
    const sessionStr = localStorage.getItem('nyghto_user_session');
    let sessionUser = {};
    if (sessionStr) {
      try {
        sessionUser = JSON.parse(sessionStr);
        sessionUser.projects = sessionUser.projects || [];
        // Prevent duplicates
        const existingIdx = sessionUser.projects.findIndex(p => p.id === projectData.id);
        if (existingIdx >= 0) {
          sessionUser.projects[existingIdx] = projectData;
        } else {
          sessionUser.projects.unshift(projectData);
        }
        localStorage.setItem('nyghto_user_session', JSON.stringify(sessionUser));
      } catch (e) {}
    }

    if (this.db && userId) {
      try {
        // 1. Save directly to subcollection
        await this.db.collection('clients').doc(userId).collection('projects').doc(projectData.id).set(projectData, { merge: true });
        
        // 2. Save directly to client doc array for immediate discovery by NyghtoOS
        await this.db.collection('clients').doc(userId).set({
          id: userId,
          name: sessionUser.name || 'Client',
          email: sessionUser.email || '',
          company: sessionUser.company || 'Client Organization',
          phone: sessionUser.phone || '',
          projects: sessionUser.projects || [projectData],
          lastUpdated: window.firebase && window.firebase.firestore ? window.firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()
        }, { merge: true });
      } catch (e) {
        console.warn('Firestore addProject notice:', e);
      }
    }
  }

  // Get all active clients for NyghtoOS control panel
  async getAllClients() {
    if (this.db) {
      try {
        const snap = await this.db.collection('clients').get();
        if (!snap.empty) {
          const list = [];
          snap.forEach(doc => {
            list.push({ id: doc.id, ...doc.data() });
          });
          return list;
        }
      } catch (e) {
        console.warn('Firestore getAllClients notice:', e);
      }
    }
    const session = JSON.parse(localStorage.getItem('nyghto_user_session') || '{}');
    return session.id ? [session] : [];
  }

  // Add or update an official billing invoice/receipt for a client
  async addClientInvoice(userId, invoiceData) {
    if (this.db && userId) {
      try {
        const docRef = this.db.collection('clients').doc(userId);
        const docSnap = await docRef.get();
        let invoices = [];
        if (docSnap.exists && docSnap.data().invoices && Array.isArray(docSnap.data().invoices)) {
          invoices = docSnap.data().invoices;
        }
        invoices.unshift(invoiceData);
        
        // Calculate updated total paid
        let totalPaid = 0;
        invoices.forEach(inv => {
          if (inv.status === 'Paid') {
            const num = parseInt((inv.amount || '0').toString().replace(/[^\d]/g, ''), 10) || 0;
            totalPaid += num;
          }
        });

        await docRef.set({
          invoices: invoices,
          revenue: '₹' + totalPaid.toLocaleString('en-IN'),
          lastUpdated: new Date().toISOString()
        }, { merge: true });

        // Update local session if matching
        const sessionStr = localStorage.getItem('nyghto_user_session');
        if (sessionStr) {
          try {
            const u = JSON.parse(sessionStr);
            if (u.id === userId) {
              u.invoices = invoices;
              u.revenue = '₹' + totalPaid.toLocaleString('en-IN');
              localStorage.setItem('nyghto_user_session', JSON.stringify(u));
            }
          } catch (e) {}
        }
        return invoices;
      } catch (e) {
        console.warn('Firestore addClientInvoice notice:', e);
      }
    }
  }

  // Delete invoice
  async deleteClientInvoice(userId, invoiceId) {
    if (this.db && userId) {
      try {
        const docRef = this.db.collection('clients').doc(userId);
        const docSnap = await docRef.get();
        if (docSnap.exists && docSnap.data().invoices) {
          let invoices = docSnap.data().invoices.filter(inv => inv.id !== invoiceId);
          let totalPaid = 0;
          invoices.forEach(inv => {
            if (inv.status === 'Paid') {
              const num = parseInt((inv.amount || '0').toString().replace(/[^\d]/g, ''), 10) || 0;
              totalPaid += num;
            }
          });
          await docRef.set({
            invoices: invoices,
            revenue: '₹' + totalPaid.toLocaleString('en-IN')
          }, { merge: true });
        }
      } catch (e) {
        console.warn('Firestore deleteClientInvoice notice:', e);
      }
    }
  }

  // Real-Time 2-Way Chat Sync with Firestore
  async sendChatMessage(userId, messageObj) {
    const timestampStr = new Date().toISOString();
    const cleanMsg = {
      ...messageObj,
      createdAt: timestampStr,
      timestamp: window.firebase && window.firebase.firestore ? window.firebase.firestore.FieldValue.serverTimestamp() : timestampStr
    };

    if (this.db && userId) {
      try {
        await this.db.collection('clients').doc(userId).collection('messages').add(cleanMsg);
        // Ensure client document exists
        const session = JSON.parse(localStorage.getItem('nyghto_user_session') || '{}');
        await this.db.collection('clients').doc(userId).set({
          id: userId,
          name: session.name || messageObj.senderName || 'Client',
          email: session.email || '',
          lastActive: window.firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      } catch (e) {
        console.warn('Firestore sendChatMessage notice:', e);
      }
    }

    // Local fallback store
    const localKey = 'nyghto_chat_history_' + userId;
    const history = JSON.parse(localStorage.getItem(localKey) || '[]');
    history.push({ ...cleanMsg, id: messageObj.id || ('msg_' + Date.now()) });
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
          .onSnapshot((snapshot) => {
            if (!snapshot.empty) {
              const msgs = [];
              snapshot.forEach(doc => {
                const data = doc.data();
                msgs.push({ id: doc.id, ...data });
              });
              // Sort by createdAt or serverTimestamp
              msgs.sort((a, b) => {
                const timeA = a.createdAt ? new Date(a.createdAt).getTime() : (a.timestamp?.toMillis ? a.timestamp.toMillis() : 0);
                const timeB = b.createdAt ? new Date(b.createdAt).getTime() : (b.timestamp?.toMillis ? b.timestamp.toMillis() : 0);
                return timeA - timeB;
              });
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

  // Inbound consultation lead & brief capture
  async saveLead(leadData) {
    const cleanLead = {
      ...leadData,
      id: leadData.id || ('lead_' + Date.now()),
      createdAt: new Date().toISOString()
    };

    try {
      const localLeads = JSON.parse(localStorage.getItem('nyghto_leads') || '[]');
      localLeads.unshift(cleanLead);
      localStorage.setItem('nyghto_leads', JSON.stringify(localLeads));
    } catch (e) {}

    if (this.db) {
      try {
        await this.db.collection('leads').doc(cleanLead.id).set(cleanLead, { merge: true });
      } catch (e) {
        console.warn('Firestore saveLead error:', e);
      }
    }
    return cleanLead;
  }

  // Retrieve all inbound leads
  async getLeads() {
    if (this.db) {
      try {
        const snap = await this.db.collection('leads').get();
        if (!snap.empty) {
          const list = [];
          snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
          list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          return list;
        }
      } catch (e) {
        console.warn('Firestore getLeads error:', e);
      }
    }
    return JSON.parse(localStorage.getItem('nyghto_leads') || '[]');
  }

  // Website Global CMS Content Configuration
  async saveSiteConfig(config) {
    try {
      localStorage.setItem('nyghto_site_cms', JSON.stringify(config));
    } catch (e) {}

    if (this.db) {
      try {
        await this.db.collection('settings').doc('site_cms').set(config, { merge: true });
      } catch (e) {
        console.warn('Firestore saveSiteConfig error:', e);
      }
    }
    return config;
  }

  async getSiteConfig() {
    if (this.db) {
      try {
        const snap = await this.db.collection('settings').doc('site_cms').get();
        if (snap.exists) {
          return snap.data();
        }
      } catch (e) {
        console.warn('Firestore getSiteConfig notice:', e);
      }
    }
    return JSON.parse(localStorage.getItem('nyghto_site_cms') || 'null');
  }
}

window.nyghtoFirebase = new NyghtoFirebaseService();
window.nyghtoFirebase.init();

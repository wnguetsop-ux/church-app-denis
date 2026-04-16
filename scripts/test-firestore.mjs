/**
 * Script de test Firestore — vérifie que les lectures/écritures fonctionnent
 * Usage: node scripts/test-firestore.mjs
 */
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, deleteDoc, serverTimestamp, query, limit } from 'firebase/firestore'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAMSpMMw3ibEZdVJUvNvbkAn52G0YsK4_M",
  authDomain: "denischurch-a73f9.firebaseapp.com",
  projectId: "denischurch-a73f9",
  storageBucket: "denischurch-a73f9.firebasestorage.app",
  messagingSenderId: "200748395645",
  appId: "1:200748395645:web:dad7700d08b05fb9535514",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

async function main() {
  console.log('\n🔍 Test Firestore CIFM4\n')

  // 1. Auth
  console.log('1️⃣  Connexion Firebase Auth...')
  try {
    const cred = await signInWithEmailAndPassword(auth, 'sonsofmalachie4@gmail.com', 'Cifm4Admin2025!')
    console.log(`   ✅ Connecté: ${cred.user.email} (uid: ${cred.user.uid})`)
  } catch (e) {
    console.error(`   ❌ Auth échouée:`, e.code, e.message)
    process.exit(1)
  }

  // 2. Read
  console.log('\n2️⃣  Lecture collection "sermons"...')
  try {
    const snap = await getDocs(query(collection(db, 'sermons'), limit(5)))
    console.log(`   ✅ Lecture OK — ${snap.size} sermon(s) trouvé(s)`)
  } catch (e) {
    console.error(`   ❌ Lecture échouée:`, e.code, e.message)
  }

  // 3. Write
  console.log('\n3️⃣  Écriture dans "sermons" (test)...')
  let testId = null
  try {
    const ref = await addDoc(collection(db, 'sermons'), {
      title: { fr: 'TEST - à supprimer', en: 'TEST - to delete' },
      speaker: 'Test Bot',
      youtubeVideoId: '_test',
      tags: [],
      featured: false,
      createdAt: serverTimestamp(),
    })
    testId = ref.id
    console.log(`   ✅ Écriture OK — ID: ${testId}`)
  } catch (e) {
    console.error(`   ❌ Écriture échouée:`, e.code, e.message)
    if (e.code === 'permission-denied') {
      console.log(`   ⚠️  Règles Firestore: vérifiez dans Firebase Console > Firestore > Rules`)
    }
    process.exit(1)
  }

  // 4. Delete test doc
  if (testId) {
    try {
      const { doc } = await import('firebase/firestore')
      await deleteDoc(doc(db, 'sermons', testId))
      console.log(`   🗑️  Document test supprimé`)
    } catch {}
  }

  console.log('\n✅ Tous les tests passés — Firestore fonctionne!\n')
  process.exit(0)
}

main().catch(e => { console.error('Fatal:', e); process.exit(1) })

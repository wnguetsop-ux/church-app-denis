/**
 * Script pour créer un utilisateur admin dans Firebase Auth.
 * Usage: node scripts/create-admin.mjs
 */
import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAMSpMMw3ibEZdVJUvNvbkAn52G0YsK4_M",
  authDomain: "denischurch-a73f9.firebaseapp.com",
  projectId: "denischurch-a73f9",
  storageBucket: "denischurch-a73f9.firebasestorage.app",
  messagingSenderId: "200748395645",
  appId: "1:200748395645:web:dad7700d08b05fb9535514",
}

const ADMIN_EMAIL = 'sonsofmalachie4@gmail.com'
const ADMIN_PASSWORD = 'Cifm4Admin2025!'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

async function main() {
  console.log(`\n🔑 Création de l'utilisateur admin...`)
  console.log(`   Email: ${ADMIN_EMAIL}`)
  console.log(`   Password: ${ADMIN_PASSWORD}\n`)

  try {
    // Try to create the user
    const cred = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD)
    console.log(`✅ Utilisateur créé avec succès!`)
    console.log(`   UID: ${cred.user.uid}`)
    console.log(`   Email: ${cred.user.email}`)
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      console.log(`ℹ️  L'utilisateur existe déjà. Tentative de connexion...`)
      try {
        const cred = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD)
        console.log(`✅ Connexion réussie!`)
        console.log(`   UID: ${cred.user.uid}`)
        console.log(`   Email: ${cred.user.email}`)
      } catch (loginErr) {
        console.error(`❌ Erreur de connexion:`, loginErr.code, loginErr.message)
        console.log(`\n   L'utilisateur existe mais le mot de passe est différent.`)
        console.log(`   Changez le mot de passe dans Firebase Console > Authentication.`)
      }
    } else {
      console.error(`❌ Erreur:`, err.code, err.message)
      if (err.code === 'auth/admin-restricted-operation') {
        console.log(`\n⚠️  L'authentification Email/Password n'est pas activée.`)
        console.log(`   Allez dans Firebase Console > Authentication > Sign-in method`)
        console.log(`   Et activez "Email/Password"`)
      }
    }
  }

  process.exit(0)
}

main()

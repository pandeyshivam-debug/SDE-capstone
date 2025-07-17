import admin from 'firebase-admin'
// const admin = require('firebase-admin');
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' }

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

export default admin

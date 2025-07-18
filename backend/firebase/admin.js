import admin from 'firebase-admin'

admin.initializeApp({
    credential: admin.credential.cert('./firebase-service-account.json')
})

export default admin
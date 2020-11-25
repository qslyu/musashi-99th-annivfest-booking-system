import admin from 'firebase-admin'
import initFirebaseAdmin from '../../../utils/firebase/initAdmin'
import events from '../../../events.json'
import { connectToDatabase } from '../../../utils/mongodb'
import validateEvents from '../../../utils/validateEvents'

export default async function handler (req, res) {
  const {
    query: { token, event },
  } = req

  if(!token || !event) {
    res.statusCode = 400
    res.json({ error: 'bad request' })
    return
  }

  initFirebaseAdmin()

  const { db } = connectToDatabase()

  await admin.auth().verifyIdToken(token)
    .then(decodedToken => {
      if(!decodedToken.email_verified) {
        throw new Error('email is not verified')
      }
      
      const uid = decodedToken.uid
      validateEvents(uid, event)

      return db.collection('bookings')
        .insertOne({
          user: uid,
          event: event,
          created_at: new Date()
        })
    })
    .then(() => {
      res.statusCode = 200
      res.json({ sucess: true })
    })
    .catch(err => {
      if(err.code == 'auth/argument-error') {
        res.statusCode = 400
        res.json({ error: 'bad request' })
      } else {
        res.statusCode = 500
        res.json({ error: 'internal server error' })
      }
    })
}
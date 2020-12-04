import admin from 'firebase-admin'
import initFirebaseAdmin from '../../../utils/firebase/initAdmin'
import { connectToDatabase } from '../../../utils/mongodb'
import { isReserved, isFull } from '../../../utils/validateTimeID'

export default async function handler (req, res) {
  const {
    query: { token, time_id },
  } = req

  if(!token || !time_id) {
    res.statusCode = 400
    res.json({ error: 'bad request' })
    return
  }

  initFirebaseAdmin()

  const { db } = await connectToDatabase()

  await admin.auth().verifyIdToken(token)
    .then(async decodedToken => {
      const uid = decodedToken.uid

      if(!decodedToken.email_verified) {
        throw new Error('email is not verified')
      }

      if(isReserved(uid, time_id) || isFull(time_id)) {
        throw new Error('invalid id')
      }

      return await db.collection('bookings')
        .insertOne({
          user: uid,
          time_id: time_id,
          created_at: new Date()
        })
    })
    .then(() => {
      res.statusCode = 200
      res.json({ success: true })
    })
    .catch(err => {
      if(err.message == 'invalid id' || err.code == 'auth/argument-error') {
        res.statusCode = 400
        res.json({ error: 'bad request' })
      } else {
        res.statusCode = 500
        res.json({ error: 'internal server error' })
      }
    })
}
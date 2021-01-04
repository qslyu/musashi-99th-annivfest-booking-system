import admin from 'firebase-admin'
import initFirebaseAdmin from '../../../utils/firebase/initAdmin'
import { connectToDatabase } from '../../../utils/mongodb'
import { isReserved, isParticipation } from '../../../utils/validateTimeID'

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
      const participationDate = decodedToken.name

      console.log(time_id)
      if(!await isReserved(uid, time_id) || !isParticipation(participationDate, time_id)) {
        throw new Error('invalid id')
      }

      return await db.collection('bookings')
        .deleteOne({
          user: decodedToken.uid,
          time_id: time_id
        })
    })
    .then(() => {
      res.statusCode = 200
      res.json({ success: true })
    })
    .catch(err => {
      console.log(err)
      if(err.message == 'invalid id' || err.code == 'auth/argument-error') {
        res.statusCode = 400
        res.json({ error: 'bad request' })
      } else {
        res.statusCode = 500
        res.json({ error: 'internal server error' })
      }
    })
}
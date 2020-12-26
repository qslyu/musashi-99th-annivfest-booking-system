import admin from 'firebase-admin'
import initFirebaseAdmin from '../../utils/firebase/initAdmin'
import { events } from '../../schedule.json'
import { isReserved, isFull } from '../../utils/validateTimeID'

export default async function handler(req, res) {
  const {
    query: { token },
  } = req

  initFirebaseAdmin()
  
  await admin.auth().verifyIdToken(token)
    .then(async decodedToken => {
      const data = events
      const userID = decodedToken.uid

      await Promise.all(data.map(async eventInfo => {
        await Promise.all(eventInfo.times.map(async time => {
          const timeID = time.id
          
          time.booking_id = await isReserved(userID ,timeID)
          time.is_full = await isFull(timeID)
        }))
      }))

      return data
    })
    .then(data => {
      res.statusCode = 200
      res.json(data)
    })
    .catch(err => {
      console.log(err)
      if(err.code == 'auth/argument-error') {
        res.statusCode = 400
        res.json({ error: 'bad request' })
      } else {
        res.statusCode = 500
        res.json({ error: 'internal server error' })
      }
    })
}

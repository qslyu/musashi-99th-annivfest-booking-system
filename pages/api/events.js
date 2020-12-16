import admin from 'firebase-admin'
import initFirebaseAdmin from '../../utils/firebase/initAdmin'
import events from '../../events.json'
import { isReserved, isFull } from '../../utils/validateTimeID'

export default async function handler(req, res) {
  const {
    query: { token },
  } = req

  initFirebaseAdmin()
  
  await admin.auth().verifyIdToken(token)
    .then(decodedToken => {
      if(!decodedToken.email_verified) {
        throw new Error('email is not verified')
      }
      return decodedToken
    })
    .then(decodedToken => {
      const data = events
      const userID = decodedToken.uid

      events.map((eventInfo, eventIndex) => {
        Promise.all(eventInfo.times.map(async (time, timeIndex) => {
          const timeID = time.id
          const timeData = data[eventIndex]['times'][timeIndex]
          timeData.booking_id = await isReserved(userID ,timeID)
          timeData.is_full = await isFull(timeID)
        }))
      })

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

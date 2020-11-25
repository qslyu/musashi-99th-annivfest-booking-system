import admin from 'firebase-admin'
import initFirebaseAdmin from '../../utils/firebase/initAdmin'
import timeList from '../../time_list.json'
import { connectToDatabase } from '../../utils/mongodb'
import { isFull } from '../../utils/validateEvents'

export default async function handler (req, res) {
  const {
    query: { token },
  } = req

  initFirebaseAdmin()

  const { db } = await connectToDatabase()
  
  await admin.auth().verifyIdToken(token)
    .then(decodedToken => {
      if(!decodedToken.email_verified) {
        throw new Error('email is not verified')
      }
      return decodedToken
    })
    .then(async decodedToken => await db.collection('bookings')
      .find({
        user: decodedToken.uid
      })
      .toArray()
    )
    .then(reservedTimes => {
      const data = timeList
      data.forEach(time => {
        time.is_reserved = false
      })

      reservedTimes.forEach(reservedTime => {
        const index = timeList.findIndex(time => time.id == reservedTime.time_id)
        data[index].is_reserved = true
      })

      return data
    })
    .then(async data => {
      for(let i = 0; i < data.length; i++) {
        data[i].isFull = await isFull(data[i].id)
      }

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

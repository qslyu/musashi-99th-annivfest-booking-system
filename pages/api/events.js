import admin from 'firebase-admin'
import initFirebaseAdmin from '../../utils/firebase/initAdmin'
import events from '../../events.json'

export default async function handler (req, res) {
  const {
    query: { token },
  } = req

  if(!token) {
    res.statusCode = 400
    res.json({ error: 'bad request' })
    return
  }

  initFirebaseAdmin()
  
  await admin.auth().verifyIdToken(token)
    .then(decodedToken => {
      const db = admin.firestore()
      return db.collection('bookings').where('user', '==', decodedToken.uid).get()
    })
    .then(querySnapshot => {
      const data = events

      querySnapshot.forEach(doc => {
        data.forEach(eventInfo => {
          eventInfo.time_list.forEach(timeList => {
            timeList.is_reserved = (timeList.id == doc.data().event)
          })
        })
      })

      res.statusCode= 200
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
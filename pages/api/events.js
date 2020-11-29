import admin from 'firebase-admin'
import initFirebaseAdmin from '../../utils/firebase/initAdmin'
import timeList from '../../time_list.json'
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
    .then(async decodedToken => {
      const data = timeList
      const userID = decodedToken.uid

      await Promise.all(timeList.map(async (time, index) => {
        const timeID = time.id
        data[index].is_reserved = await isReserved(userID ,timeID)
        data[index].is_full = await isFull(timeID)
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

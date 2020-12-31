import admin from 'firebase-admin'
import initFirebaseAdmin from '../../utils/firebase/initAdmin'
import { events } from '../../schedule.json'
import { isReserved, reserved } from '../../utils/validateTimeID'

export default async function handler(req, res) {
  const {
    query: { token },
  } = req

  initFirebaseAdmin()
  
  await admin.auth().verifyIdToken(token)
    .then(async decodedToken => {
      const data = []
      const userID = decodedToken.uid
      const participationDate = new Date(decodedToken.name)

      console.log(participationDate)

      await Promise.all(events.map(async (eventInfo, eIndex) => {
        data[eIndex] = {
          id:          eventInfo.id,
          name:        eventInfo.name,
          description: eventInfo.description,
          limit:       eventInfo.limit,
          times: []
        }

        await Promise.all(eventInfo.times.map(async (time, tIndex) => {
          const date = new Date(time.datetime)

          if(
            participationDate.getUTCFullYear() == date.getUTCFullYear() &&
            participationDate.getUTCMonth() == date.getUTCMonth() &&
            participationDate.getUTCDate() == date.getUTCDate()
          ) {
            const timeID = time.id

            data[eIndex].times[tIndex] = {
              id: timeID,
              datetime: time.datetime,
              booking_id: await isReserved(userID ,timeID),
              reserved: await reserved(timeID)
            }
          }
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

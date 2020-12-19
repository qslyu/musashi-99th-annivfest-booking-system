import mongodb from 'mongodb'
import { connectToDatabase } from '../../../utils/mongodb'
import events from '../../../events.json'

export default async function handler(req, res) {
  const {
    query: { id },
  } = req

  try {
    const booking_id = new mongodb.ObjectID(id)

    const { db } = await connectToDatabase()

    const bookingInfo = await db.collection('bookings')
      .findOne({
        _id: booking_id
      })
      .then(data => {
        return data
      })

    if(!bookingInfo) throw new Error('id not found')

    const data = bookingInfo
    const timeID = bookingInfo.time_id

    events.map(event => {
      const found = event.times.find(time => time.id == timeID)
      if(found) {
        data.event = event.name
        data.datetime = found.datetime
      }
    })

    res.statusCode = 200
    res.json(data)
    
  } catch(err) {
    console.log(err)
    if(err.message == 'id not found' || err.message == 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters') {
      res.statusCode = 400
      res.json({error: 'invaild code'})
      return
    } else {
      res.statusCode = 500
      res.json({error: 'internal server error'})
    }
  }
}
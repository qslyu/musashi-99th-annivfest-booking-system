import { connectToDatabase } from './mongodb'
import events from '../events.json'

function isExists(timeID) {
  const index = -1
  events.map(eventInfo => {
    eventInfo.times.findIndex(timeInfo => timeInfo.id == timeID)
  })
  if(index == -1) {
    throw new Error('time not found')
  }
  return index
}

export async function isReserved(userID, timeID) {
  isExists(timeID)

  const { db } = await connectToDatabase()

  const reservedByUser = await db.collection('bookings')
    .findOne({
      user: userID,
      time_id: timeID
    })
    .then(data => {
      if(data) return data._id
    })

  return reservedByUser
}

export async function isFull(timeID) {
  const index = isExists(timeID)
  const limit = timeList[index].limit

  const { db } = await connectToDatabase()

  const reserved = await db.collection('bookings')
    .find({
      time_id: timeID
    })
    .count()

  return reserved >= limit
}
import { connectToDatabase } from './mongodb'
import events from '../events.json'

function getLimit(timeID) {
  let limit = -1
  events.map(eventInfo => {
    if(eventInfo.times.find(timeInfo => timeInfo.id == timeID)) limit = eventInfo.limit
  })
  if(limit == -1) {
    throw new Error('time not found')
  }
  return limit
}

export async function isReserved(userID, timeID) {
  getLimit(timeID)

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
  const limit = getLimit(timeID)

  const { db } = await connectToDatabase()

  const reserved = await db.collection('bookings')
    .find({
      time_id: timeID
    })
    .count()

  return reserved >= limit
}
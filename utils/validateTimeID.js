import { connectToDatabase } from './mongodb'
import { events } from '../schedule.json'
import { isParticipationDate } from './datetime'

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
  return await reserved(timeID) >= getLimit(timeID)
}

export async function reserved(timeID) {
  getLimit(timeID)

  const { db } = await connectToDatabase()

  const reserved = await db.collection('bookings')
    .find({
      time_id: timeID
    })
    .count()

  return reserved
}

export function isParticipation(participationDate, timeID) {
  let time = -1

  events.map(eventInfo => {
    const found = eventInfo.times.find(timeInfo => timeInfo.id == timeID)
    if(found) time = found
  })
  
  if(time == -1) {
    throw new Error('time not found')
  }

  return isParticipationDate(new Date(participationDate).getTime(), new Date(time.datetime).getTime())
}
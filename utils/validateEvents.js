import { connectToDatabase } from './mongodb'
import timeList from '../time_list.json'


export async function isReserved(userID, eventID) {
  const { db } = await connectToDatabase()

  const reserved = await db.collection('bookings')
    .find({
      user: userID,
      event: eventID
    })
    .toArray()

  return reserved.length
}

export async function isFull(timeID) {
  const { db } = await connectToDatabase()

  let limit = 0

  const index = timeList.findIndex(timeInfo => timeInfo.id == timeID)

  if(index == -1) {
    throw new Error('event not found')
  }

  limit = timeList[index].limit


  const reserved = await db.collection('bookings')
    .find({
      time_id: timeID
    })
    .toArray()

  return reserved.length >= limit
}

export default function validateEvents(userID, eventID) {
  if(isReserved(userID, eventID)) {
    throw new Error('this event is already reserved')
  }
  if(isFull(userID)) {
    throw new Error('this event is full')
  }
  return
}
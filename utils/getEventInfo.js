import eventList from '../event_list.json'

export default function getEventInfo(eventID) {
  const index = eventList.findIndex(eventInfo => eventInfo.id == eventID)
  if(index == -1) {
    throw new Error('event not found')
  }
  return eventList[index]
}
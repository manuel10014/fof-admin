import axios from 'axios'
import { TUNNEL } from '../../assets/constants/url'

export const getAllServicesForUser = async (id, isEmployee) => {
  const config = {
    params: { id, isEmployee },
    headers: { 'content-type': 'application/json' },
  }
  try {
    const res = await axios.get(
      `${TUNNEL}/api/services/all-services/user-all-fields`,
      config,
    )

    return res.data
  } catch (err) {
    console.log(err)
  }
}

export const timeConverter = (timeSent) => {
  let time = timeSent.split(':')
  let hours = Number(time[0])
  let minutes = Number(time[1])
  let seconds = Number(time[2])
  let timeValue
  if (hours > 0 && hours <= 12) {
    timeValue = '' + hours
  } else if (hours > 12) {
    timeValue = '' + (hours - 12)
  } else if (hours === 0) {
    timeValue = '12'
  }
  timeValue += minutes < 10 ? ':0' + minutes : ':' + minutes // get minutes
  timeValue += seconds < 10 ? ':0' + seconds : ':' + seconds // get seconds
  timeValue += hours >= 12 ? ' P.M.' : ' A.M.' // get AM/PM
  return timeValue
}

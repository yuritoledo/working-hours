import axios from 'axios'

export const workingHourService = axios.create({
  baseURL: 'http://localhost:5000/working-hours/',
})

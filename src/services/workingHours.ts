import axios from 'axios'

export const workingHoursAPI = axios.create({
  baseURL: 'http://localhost:5000/working-hours/',
})

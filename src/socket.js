import { io } from 'socket.io-client'
import { SOCKET_URL } from '@/utils/constants'
const URL = SOCKET_URL
const socket = io(URL, { autoConnect: false })

socket.onAny((event, ...args) => {
  console.log(event, args)
})

export default socket

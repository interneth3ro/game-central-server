import { Server } from 'socket.io';
import { TimerEvents } from './events';

let roomTimers = {};

export function sendToRoom(
  server: Server,
  room: string,
  event: string,
  payload: any,
) {
  server.to(room).emit(event, payload);
}

export function startTimerForRoom(
  server: Server,
  room: string,
  duration: number,
) {
  var counter = duration;

  var timer = setInterval(function () {
    sendToRoom(server, room, TimerEvents.tick.toString(), {
      timer: counter,
    });

    if (counter > 0) {
      counter--;
    } else {
    }
  }, 5000);

  roomTimers[room] = timer;
}

export function stopTimerForRoom(room: string) {
  clearInterval(roomTimers[room]);

  delete roomTimers[room];
}

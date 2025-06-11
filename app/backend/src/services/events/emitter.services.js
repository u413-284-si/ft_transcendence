import { EventEmitter } from "events";

const userEmitters = new Map(); // userId → EventEmitter

export function getOrCreateEmitter(userId) {
  if (!userEmitters.has(userId)) {
    userEmitters.set(userId, new EventEmitter());
  }
  return userEmitters.get(userId);
}

export function deleteEmitterIfUnused(userId) {
  const emitter = userEmitters.get(userId);
  if (emitter && emitter.listenerCount("message") === 0) {
    userEmitters.delete(userId);
  }
}

export function emitToUser(userId, event, data) {
  const emitter = userEmitters.get(userId);
  if (emitter) {
    emitter.emit("message", event, data);
  }
}

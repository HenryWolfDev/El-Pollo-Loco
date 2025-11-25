/**
 * Simple registry to track and clear all active `setInterval` handles in one place.
 * Prevents orphaned timers when resetting or exiting the game.
 * @module game/IntervalHub
 */
export class IntervalHub {
  static allIntervals = [];

  /**
   * Starts an interval, stores its handle, and returns it.
   * @param {Function} func Callback to invoke each tick.
   * @param {number} timer Interval delay in milliseconds.
   * @returns {number} Interval handle.
   */
  static startInterval(func, timer) {
    const newInterval = setInterval(func, timer);
    IntervalHub.allIntervals.push(newInterval);
    return newInterval;
  }

  /**
   * Clears every stored interval and resets the registry.
   */
  static stopAllIntervals() {
    IntervalHub.allIntervals.forEach(clearInterval);
    IntervalHub.allIntervals = [];
  }
}

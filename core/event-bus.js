/**
 * core/event-bus.js
 * 
 * 모듈 간 결합도를 완전히 제거하기 위한 경량 비동기 이벤트 발행/구독(Pub/Sub) 버스
 */

class EventBus {
  constructor() {
    this.listeners = new Map();
    this.debug = true; // 콘솔 이벤트 모니터링 활성화
  }

  /**
   * 이벤트 구독
   * @param {string} eventName - 이벤트 이름 (core/types.js의 EVENTS 참조)
   * @param {Function} callback - 실행할 콜백 함수
   * @returns {Function} 구독 취소 함수 (unsubscribe)
   */
  on(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName).add(callback);

    // 구독 취소 헬퍼 리턴
    return () => this.off(eventName, callback);
  }

  /**
   * 1회성 이벤트 구독
   * @param {string} eventName 
   * @param {Function} callback 
   */
  once(eventName, callback) {
    const wrapper = (payload) => {
      this.off(eventName, wrapper);
      callback(payload);
    };
    return this.on(eventName, wrapper);
  }

  /**
   * 이벤트 구독 취소
   * @param {string} eventName 
   * @param {Function} callback 
   */
  off(eventName, callback) {
    if (!this.listeners.has(eventName)) return;
    this.listeners.get(eventName).delete(callback);
    if (this.listeners.get(eventName).size === 0) {
      this.listeners.delete(eventName);
    }
  }

  /**
   * 이벤트 발행
   * @param {string} eventName 
   * @param {*} payload 
   */
  emit(eventName, payload) {
    if (this.debug) {
      console.log(`[EventBus] 📢 ${eventName}`, payload);
    }

    if (!this.listeners.has(eventName)) return;

    for (const callback of this.listeners.get(eventName)) {
      try {
        callback(payload);
      } catch (err) {
        console.error(`[EventBus Error] Event "${eventName}" callback failed:`, err);
      }
    }
  }

  /**
   * 모든 리스너 제거
   */
  clear() {
    this.listeners.clear();
  }
}

export const eventBus = new EventBus();

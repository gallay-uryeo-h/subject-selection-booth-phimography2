/**
 * modules/m07-dashboard-kiosk/kiosk-manager.js
 * 
 * 현장 키오스크 운영 최적화: 3분 자동 초기화 타이머 & 무음 로깅
 */

import { roadmapStore } from '../../core/store.js';
import { eventBus } from '../../core/event-bus.js';
import { EVENTS } from '../../core/types.js';

export class KioskManager {
  constructor(timeoutSeconds = 180) {
    this.timeoutSeconds = timeoutSeconds;
    this.remainingSeconds = timeoutSeconds;
    this.timerInterval = null;
    this.analyticsLogs = [];
  }

  /**
   * 타이머 시작 및 사용자 인터랙션 감지 등록
   */
  init(displayElement = null) {
    this.displayElement = displayElement;
    this.resetTimer();

    // 마우스, 터치, 키보드 입력 시 타이머 리셋
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'touchstart', 'scroll'];
    activityEvents.forEach(evt => {
      window.addEventListener(evt, () => this.resetTimer(), { passive: true });
    });

    // 1초 주기로 타이머 갱신
    this.timerInterval = setInterval(() => {
      this.tick();
    }, 1000);

    // 네컷 카드 생성 완료 시 익명 통계 자동 로깅
    eventBus.on(EVENTS.CARD_GENERATED, (cardData) => {
      this.logAnonymousSession(cardData);
    });

    console.log('[Module 07] Kiosk session manager initialized (Timeout: 3min)');
  }

  resetTimer() {
    this.remainingSeconds = this.timeoutSeconds;
    this.updateDisplay();
  }

  tick() {
    this.remainingSeconds -= 1;
    this.updateDisplay();

    // 30초 남았을 때 경고 이벤트
    if (this.remainingSeconds === 30) {
      eventBus.emit(EVENTS.SESSION_IDLE_WARNING, { remaining: 30 });
    }

    // 0초 도달 시 전체 세션 자동 리셋
    if (this.remainingSeconds <= 0) {
      console.log('[KioskManager] ⏰ 3 minutes idle reached. Resetting session...');
      roadmapStore.reset();
      this.resetTimer();
      eventBus.emit(EVENTS.SESSION_TIMEOUT_RESET, null);
    }
  }

  updateDisplay() {
    if (!this.displayElement) return;
    const mins = Math.floor(this.remainingSeconds / 60);
    const secs = this.remainingSeconds % 60;
    this.displayElement.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  /**
   * 개인정보를 제외한 진로/선택과목 데이터 무음 로깅 (교과협의회 분석용)
   */
  logAnonymousSession() {
    const state = roadmapStore.getState();
    const logEntry = {
      timestamp: new Date().toISOString(),
      careerCategory: state.profile.careerCategory,
      year2Selection: state.curriculum.year2,
      year3CareerSelection: state.curriculum.year3Career,
      year3FusionSelection: state.curriculum.year3Fusion
    };

    this.analyticsLogs.push(logEntry);
    console.log('[Analytics Logged]:', logEntry);
    eventBus.emit(EVENTS.ANALYTICS_LOG_EVENT, logEntry);

    // localStorage에 누적
    try {
      const existing = JSON.parse(localStorage.getItem('uiryeong_eng_booth_logs') || '[]');
      existing.push(logEntry);
      localStorage.setItem('uiryeong_eng_booth_logs', JSON.stringify(existing));
    } catch (e) {
      // 쿼터 초과 방지
    }
  }
}

export const kioskManager = new KioskManager(180);

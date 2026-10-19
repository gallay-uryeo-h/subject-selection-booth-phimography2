/**
 * modules/m07-dashboard-kiosk/kiosk-manager.js
 * 
 * 현장 키오스크 운영 최적화:
 * - 3분 자동 초기화 타이머 & 30초 전 경고 팝업
 * - 학생별 선택 데이터 무음 익명 텔레메트리 로깅 (localStorage 기반)
 * - 교사용 통계 대시보드 (/admin): 6대 계열 분포 차트, 3학년 과목별 수요 순위, CSV 엑셀 내보내기
 */

import { roadmapStore } from '../../core/store.js';
import { eventBus } from '../../core/event-bus.js';
import { EVENTS } from '../../core/types.js';

const STORAGE_KEY = 'UIRYEONG_BOOTH_TELEMETRY_LOGS';

export class KioskManager {
  constructor(timeoutSeconds = 180) {
    this.timeoutSeconds = timeoutSeconds;
    this.remainingSeconds = timeoutSeconds;
    this.timerInterval = null;
    this.displayElement = null;
    this.analyticsLogs = this.loadLogs();
  }

  loadLogs() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveLogs() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.analyticsLogs));
    } catch (e) {}
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

    // 네컷 카드 생성 또는 학생 데이터 완성 시 익명 통계 자동 로깅
    eventBus.on(EVENTS.CARD_GENERATED, (cardData) => {
      this.logAnonymousSession(cardData);
    });

    console.log('[Module 07] Kiosk session manager & Telemetry initialized');
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
      this.handleTimeoutReset();
    }
  }

  updateDisplay() {
    if (!this.displayElement) return;
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;
    this.displayElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  handleTimeoutReset() {
    console.log('[Module 07] Session timeout - Auto resetting booth kiosk');
    roadmapStore.reset();
    eventBus.emit(EVENTS.SESSION_RESET);
    this.resetTimer();
  }

  /**
   * 학생 선택 데이터 익명 로깅 (개인 식별 불가 마스킹)
   */
  logAnonymousSession(sessionData) {
    const state = roadmapStore.getState();
    const rawName = state.profile.name || '무명';
    const maskedName = rawName.length <= 1 ? rawName : rawName[0] + '*' + (rawName.length > 2 ? rawName.slice(2) : '');

    const logEntry = {
      id: 'LOG_' + Date.now().toString(36),
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour12: false }),
      maskedName: maskedName,
      careerCategory: state.profile.careerCategory,
      careerCategoryId: state.profile.careerCategoryId,
      targetCareer: state.profile.targetCareer || '진로 미정',
      year3Subjects: [...state.curriculum.year3Career, ...state.curriculum.year3Fusion],
      matchedTextbook: state.matchedTextbook?.textbook || '공통영어1',
      hasPhoto: !!state.profile.photoDataUrl
    };

    this.analyticsLogs.push(logEntry);
    this.saveLogs();
    console.log('[Module 07] Anonymous telemetry logged:', logEntry);
    return logEntry;
  }

  /**
   * 교사용 통계 집계 데이터 반환
   */
  getStatistics() {
    const totalCount = this.analyticsLogs.length;
    const categoryCounts = {};
    const subjectCounts = {};

    this.analyticsLogs.forEach(log => {
      // 계열 카운트
      const cat = log.careerCategory || '미분류';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

      // 3학년 과목별 수요 카운트
      if (Array.isArray(log.year3Subjects)) {
        log.year3Subjects.forEach(sub => {
          subjectCounts[sub] = (subjectCounts[sub] || 0) + 1;
        });
      }
    });

    return {
      totalCount,
      categoryCounts,
      subjectCounts,
      recentLogs: [...this.analyticsLogs].reverse().slice(0, 15)
    };
  }

  /**
   * 교과협의회 제출용 CSV 파일 즉시 다운로드
   */
  exportCSV() {
    if (this.analyticsLogs.length === 0) {
      alert('다운로드할 누적 학생 데이터가 없습니다.');
      return;
    }

    const headers = ['로그ID', '기록시간', '학생식별', '진로계열', '목표세부진로', '선택한3학년과목', '매칭교과서', '사진촬영여부'];
    const rows = this.analyticsLogs.map(l => [
      l.id,
      l.timestamp,
      l.maskedName,
      `"${l.careerCategory}"`,
      `"${l.targetCareer}"`,
      `"${(l.year3Subjects || []).join('; ')}"`,
      `"${l.matchedTextbook}"`,
      l.hasPhoto ? 'Y' : 'N'
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `의령여고_영어과_선택과목박람회_수요집계_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  clearLogs() {
    if (confirm('모든 누적 학생 통계 데이터를 영구 삭제하시겠습니까?')) {
      this.analyticsLogs = [];
      localStorage.removeItem(STORAGE_KEY);
      alert('통계 데이터가 초기화되었습니다.');
    }
  }
}

export const kioskManager = new KioskManager(180);

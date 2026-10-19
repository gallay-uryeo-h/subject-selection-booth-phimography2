/**
 * core/store.js
 * 
 * 「나의 영어과목 3개년 로드맵 빌더」
 * 단일 진실 공급원(Single Source of Truth) 중앙 상태 관리자
 */

import { INITIAL_STATE, EVENTS, CAREER_CATEGORIES } from './types.js';
import { eventBus } from './event-bus.js';

class RoadmapStore {
  constructor() {
    this._state = JSON.parse(JSON.stringify(INITIAL_STATE));
    this._subscribers = new Set();
  }

  /**
   * 현재 상태의 불변 복사본 반환
   */
  getState() {
    return JSON.parse(JSON.stringify(this._state));
  }

  /**
   * 상태 변화 구독
   * @param {Function} subscriber - (state, changedKey) => void
   * @returns {Function} 구독 취소 함수
   */
  subscribe(subscriber) {
    this._subscribers.add(subscriber);
    return () => this._subscribers.delete(subscriber);
  }

  /**
   * 내부 상태 변경 및 통보 헬퍼
   */
  _notify(changedKey, payload) {
    const currentState = this.getState();
    
    // 1. 스토어 구독자 통보
    for (const sub of this._subscribers) {
      try {
        sub(currentState, changedKey);
      } catch (e) {
        console.error('[RoadmapStore] Subscriber notification error:', e);
      }
    }

    // 2. 이벤트 버스 글로벌 전파
    eventBus.emit(EVENTS.STATE_CHANGED, {
      changedKey,
      state: currentState,
      payload
    });
  }

  /**
   * 학생 프로필 업데이트
   */
  updateProfile(profilePatch) {
    this._state.profile = {
      ...this._state.profile,
      ...profilePatch
    };
    this._notify('profile', profilePatch);
    eventBus.emit(EVENTS.STUDENT_INFO_UPDATED, this._state.profile);
  }

  /**
   * 진로 계열 변경 및 자동 추천 과목 연동
   * @param {string} categoryId 
   */
  setCareerCategory(categoryId) {
    const category = CAREER_CATEGORIES.find(c => c.id === categoryId);
    if (!category) {
      console.warn(`[RoadmapStore] Unknown career category: ${categoryId}`);
      return;
    }

    this._state.profile.careerCategory = category.name;
    this._state.profile.careerCategoryId = category.id;
    
    this._notify('profile.careerCategory', category);
    eventBus.emit(EVENTS.CAREER_SELECTED, category);
  }

  /**
   * 3개년 이수 과목 상태 업데이트
   */
  updateCurriculum(curriculumPatch) {
    this._state.curriculum = {
      ...this._state.curriculum,
      ...curriculumPatch
    };
    this._notify('curriculum', curriculumPatch);
    eventBus.emit(EVENTS.CURRICULUM_UPDATED, this._state.curriculum);
  }

  /**
   * 3학년 선택 과목 토글
   * @param {'year3Career' | 'year3Fusion'} group 
   * @param {string} subjectName 
   */
  toggleSubject(group, subjectName) {
    if (!this._state.curriculum[group]) return;

    const list = [...this._state.curriculum[group]];
    const index = list.indexOf(subjectName);

    if (index >= 0) {
      list.splice(index, 1);
    } else {
      list.push(subjectName);
    }

    this.updateCurriculum({ [group]: list });
  }

  /**
   * 교과서 RAG 매칭 결과 반영
   */
  setMatchedTextbook(textbookData) {
    this._state.matchedTextbook = {
      ...this._state.matchedTextbook,
      ...textbookData
    };
    this._notify('matchedTextbook', textbookData);
    eventBus.emit(EVENTS.TEXTBOOK_MATCHED, this._state.matchedTextbook);
  }

  /**
   * 학술 AI 어드바이저 결과 반영
   */
  setAcademicAdvice(adviceData) {
    this._state.academicAdvice = {
      ...this._state.academicAdvice,
      ...adviceData
    };
    this._notify('academicAdvice', adviceData);
    eventBus.emit(EVENTS.AI_ADVICE_RECEIVED, this._state.academicAdvice);
  }

  /**
   * 네컷 카드 생성 결과 반영
   */
  setCardExport(cardData) {
    this._state.cardExport = {
      ...this._state.cardExport,
      ...cardData
    };
    this._notify('cardExport', cardData);
    eventBus.emit(EVENTS.CARD_GENERATED, this._state.cardExport);
  }

  /**
   * 세션 초기화 (새 학생 시작 또는 3분 비활성화 타임아웃)
   */
  reset() {
    this._state = JSON.parse(JSON.stringify(INITIAL_STATE));
    this._notify('reset', null);
    eventBus.emit(EVENTS.RESET_REQUESTED, null);
    console.log('[RoadmapStore] 🔄 Session has been reset to default state.');
  }
}

export const roadmapStore = new RoadmapStore();

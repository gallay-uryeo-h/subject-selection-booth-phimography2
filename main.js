/**
 * main.js
 * 
 * 「나의 영어과목 3개년 로드맵 빌더」
 * 메인 통합 컨트롤러 & 모듈 오케스트레이터
 */

import { roadmapStore } from './core/store.js';
import { eventBus } from './core/event-bus.js';
import { EVENTS, CAREER_CATEGORIES } from './core/types.js';

import { curriculumEngine } from './modules/m02-curriculum/curriculum-engine.js';
import { CurriculumView } from './modules/m02-curriculum/curriculum-view.js';
import { ragMatcher } from './modules/m03-textbook-rag/rag-matcher.js';
import { pdfViewerModule } from './modules/m04-pdf-viewer/pdf-viewer.js';
import { academicAiModule } from './modules/m05-academic-ai/gemini-client.js';
import { photocardBuilder } from './modules/m06-photocard/photocard-builder.js';
import { kioskManager } from './modules/m07-dashboard-kiosk/kiosk-manager.js';

// DOM 요소 캐시
const careerContainer = document.getElementById('career-category-container');
const curriculumSlot = document.getElementById('curriculum-roadmap-slot');
const inputName = document.getElementById('input-student-name');
const inputTargetCareer = document.getElementById('input-target-career');
const adviceContainer = document.getElementById('academic-advice-container');
const photocardSlot = document.getElementById('photocard-preview-slot');
const kioskTimerDisplay = document.getElementById('kiosk-timer-display');
const btnManualReset = document.getElementById('btn-manual-reset');
const btnPrintCard = document.getElementById('btn-print-card');
const btnSaveTelemetry = document.getElementById('btn-save-telemetry');
const textbookPreviewSlot = document.getElementById('module-textbook-preview-slot');

// 모듈 뷰 인스턴스
let curriculumView = null;

/**
 * 앱 초기화
 */
async function initApp() {
  console.log('[System] Initializing My 3-Year English Roadmap Builder...');

  // 1. M07 키오스크 세션 타이머 시작
  kioskManager.init(kioskTimerDisplay);

  // 2. M03 RAG 데이터베이스 로드
  await ragMatcher.loadDatabase();

  // 3. M04 PDF 뷰어 초기화
  pdfViewerModule.init(textbookPreviewSlot);

  // 4. M02 로드맵 뷰 초기화
  curriculumView = new CurriculumView(curriculumSlot);

  // 5. 6대 계열 선택 칩 UI 렌더링
  renderCareerCategoryChips();

  // 6. 기본 선택 (공학·IT·인공지능 계열)
  curriculumEngine.applyCategoryPreset("ENGINEERING_IT");
  ragMatcher.syncToStore("공학·IT·인공지능 계열");
  academicAiModule.consult("ENGINEERING_IT");

  // 7. 중앙 스토어 구독: 상태가 변하면 전체 UI와 네컷 카드 실시간 동기화
  roadmapStore.subscribe((state) => {
    updateViewFromState(state);
  });

  // 초기 렌더링
  updateViewFromState(roadmapStore.getState());
  setupEventListeners();

  console.log('[System] All modules successfully mounted & connected to RoadmapStore!');
}

/**
 * 6대 계열 선택 칩 렌더링
 */
function renderCareerCategoryChips() {
  careerContainer.innerHTML = '';
  CAREER_CATEGORIES.forEach(cat => {
    const chip = document.createElement('div');
    chip.className = 'career-chip';
    chip.dataset.id = cat.id;
    chip.textContent = cat.name.replace(' 계열', '');
    chip.title = cat.description;

    chip.addEventListener('click', () => {
      // 1. 프리셋 및 스토어 갱신
      curriculumEngine.applyCategoryPreset(cat.id);
      
      // 2. RAG 교과서 단원 매칭
      ragMatcher.syncToStore(cat.name);

      // 3. AI 어드바이저 갱신
      academicAiModule.consult(cat.id, inputTargetCareer.value.trim());
    });

    careerContainer.appendChild(chip);
  });
}

/**
 * 상태 변화에 따른 UI 전면 동기화
 */
function updateViewFromState(state) {
  // 1. 진로 계열 칩 활성화 상태 표시
  const chips = careerContainer.querySelectorAll('.career-chip');
  chips.forEach(chip => {
    if (chip.dataset.id === state.profile.careerCategoryId) {
      chip.classList.add('selected');
    } else {
      chip.classList.remove('selected');
    }
  });

  // 2. M02 3개년 교육과정 인터랙티브 카드 그리드 렌더링
  if (curriculumView) {
    curriculumView.render(state);
  }

  // 3. AI 어드바이저 3단 가이드 렌더링
  adviceContainer.innerHTML = `
    <div style="background: var(--color-bg-surface); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--color-border-subtle);">
      <strong style="color: var(--color-oxford-navy); display: block; margin-bottom: 0.25rem;">1. 진로와의 학문적 연계성</strong>
      <p style="color: var(--color-text-secondary); line-height: 1.5;">${state.academicAdvice.academicLink}</p>
    </div>
    <div style="background: var(--color-antique-amber-subtle); padding: 0.75rem; border-radius: 4px; border: 1px solid rgba(217, 119, 6, 0.25);">
      <strong style="color: #B45309; display: block; margin-bottom: 0.25rem;">2. 학생부 세특 추천 탐구 주제 1선</strong>
      <p style="color: #78350F; line-height: 1.5; font-weight: 500;">${state.academicAdvice.seTeukGuideline}</p>
    </div>
    <div style="background: var(--color-bg-surface); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--color-border-subtle);">
      <strong style="color: var(--color-oxford-navy); display: block; margin-bottom: 0.25rem;">3. 수능 및 학업 역량 이점</strong>
      <p style="color: var(--color-text-secondary); line-height: 1.5;">${state.academicAdvice.academicAdvantage}</p>
    </div>
  `;

  // 4. M06 네컷 카드 실시간 미리보기 갱신
  photocardSlot.innerHTML = photocardBuilder.generateCardMarkup(state);
}

/**
 * 이벤트 리스너 바인딩
 */
function setupEventListeners() {
  // 이름 입력
  inputName.addEventListener('input', (e) => {
    roadmapStore.updateProfile({ name: e.target.value });
  });

  // 세부 진로 목표 입력
  inputTargetCareer.addEventListener('change', (e) => {
    const val = e.target.value.trim();
    roadmapStore.updateProfile({ targetCareer: val });
    const state = roadmapStore.getState();
    ragMatcher.syncToStore(state.profile.careerCategory, val);
    academicAiModule.consult(state.profile.careerCategoryId, val);
  });

  // 수동 초기화
  btnManualReset.addEventListener('click', () => {
    if (confirm('모든 입력을 초기화하고 새 학생 세션을 시작하시겠습니까?')) {
      roadmapStore.reset();
      inputName.value = '';
      inputTargetCareer.value = '';
      curriculumEngine.applyCategoryPreset("ENGINEERING_IT");
      ragMatcher.syncToStore("공학·IT·인공지능 계열");
      academicAiModule.consult("ENGINEERING_IT");
    }
  });

  // 네컷 카드 즉석 출력
  btnPrintCard.addEventListener('click', () => {
    window.print();
  });

  // 완료 로깅
  btnSaveTelemetry.addEventListener('click', () => {
    kioskManager.logAnonymousSession();
    alert('학생 선택 데이터가 익명으로 기록되었습니다. (교과협의회 분석용)');
  });
}

// 돔 로드 시 시작
window.addEventListener('DOMContentLoaded', initApp);

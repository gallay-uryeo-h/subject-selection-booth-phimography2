/**
 * modules/m02-curriculum/curriculum-view.js
 * 
 * 2022 개정 영어과 3개년 로드맵 인터랙티브 UI 컴포넌트
 * Academic Light 테마 기반의 과목 카드 그리드, 플래그 뱃지, 과목 상세 모달 지원
 */

import { curriculumEngine } from './curriculum-engine.js';
import { roadmapStore } from '../../core/store.js';

export class CurriculumView {
  constructor(containerElement, modalContainerElement = null) {
    this.container = containerElement;
    this.modalContainer = modalContainerElement;
    this.selectedSubjectForModal = null;
  }

  /**
   * 3개년 로드맵 인터페이스 렌더링
   * @param {Object} state - 중앙 스토어 상태
   */
  render(state) {
    if (!this.container) return;

    const { curriculum, profile } = state;
    const groups = curriculumEngine.getSubjectGroups();
    const validation = curriculumEngine.validateCurriculum(curriculum, profile.careerCategoryId);

    this.container.innerHTML = `
      <div class="academic-card" style="border-top: 3px solid var(--color-oxford-navy);">
        <!-- Header & Summary Info -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 0.75rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700; color: var(--color-oxford-navy);">
                02. 3개년 영어과 이수 과목 설계
              </span>
              <span class="academic-badge badge-suneung">총 ${validation.totalCredits}학점 설계됨</span>
            </div>
            <p style="font-size: 0.8125rem; color: var(--color-text-muted); margin-top: 0.2rem;">
              카드 클릭 시 과목 선택/해제 • <span style="color: var(--color-oxford-navy); font-weight: 600;">[상세보기]</span>로 수능 연계성 및 세특 가이드 확인
            </p>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 0.75rem; color: var(--color-text-muted);">계열별 최적화 가이드</span>
            <div style="font-size: 0.825rem; font-weight: 600; color: var(--color-oxford-navy);">
              ${profile.careerCategory || '진로 선택'}
            </div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          
          <!-- [1학년] 필수 고정 -->
          <div class="grade-section">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="grade-label" style="background: #0B2545; color: #FFF; padding: 0.15rem 0.5rem; border-radius: 3px; font-size: 0.75rem; font-weight: 700;">1학년</span>
                <strong style="font-size: 0.9rem; color: var(--color-oxford-navy);">기초 필수 과목</strong>
                <span style="font-size: 0.75rem; color: var(--color-text-muted);">(1·2학기 연속 이수 고정)</span>
              </div>
              <span class="academic-badge badge-required">필수 8학점</span>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
              ${groups.year1.map(sub => this._renderSubjectCard(sub, true, false)).join('')}
            </div>
          </div>

          <!-- [2학년] 일반선택 -->
          <div class="grade-section">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="grade-label" style="background: #0369A1; color: #FFF; padding: 0.15rem 0.5rem; border-radius: 3px; font-size: 0.75rem; font-weight: 700;">2학년</span>
                <strong style="font-size: 0.9rem; color: #0369A1;">일반선택 핵심 과목</strong>
                <span style="font-size: 0.75rem; color: var(--color-text-muted);">(수능 직접 연계 출제 범위)</span>
              </div>
              <span class="academic-badge badge-suneung">권장 8학점</span>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
              ${groups.year2.map(sub => this._renderSubjectCard(sub, curriculum.year2.includes(sub.name), false)).join('')}
            </div>
          </div>

          <!-- [3학년] 진로선택 & 융합선택 풀 -->
          <div class="grade-section" style="background: #FEF3C7; border: 1px solid rgba(217, 119, 6, 0.3); border-radius: 6px; padding: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="grade-label" style="background: #B45309; color: #FFF; padding: 0.15rem 0.5rem; border-radius: 3px; font-size: 0.75rem; font-weight: 700;">3학년</span>
                <strong style="font-size: 0.9rem; color: #B45309;">진로·융합 가배치 선택 풀</strong>
                <span style="font-size: 0.75rem; color: #78350F;">(클릭하여 과목 추가/제외)</span>
              </div>
              <span class="academic-badge badge-career">선택 학점제</span>
            </div>

            <!-- 진로선택 (3과목) -->
            <div style="margin-bottom: 0.75rem;">
              <div style="font-size: 0.75rem; font-weight: 700; color: #92400E; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.35rem;">
                <span>📚 진로선택 과목군</span>
                <span style="font-weight: normal; color: #78350F;">(성취평가 A·B·C / 학종 심화)</span>
              </div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.65rem;">
                ${groups.year3Career.map(sub => this._renderSubjectCard(sub, curriculum.year3Career.includes(sub.name), true, 'year3Career')).join('')}
              </div>
            </div>

            <!-- 융합선택 (3과목) -->
            <div>
              <div style="font-size: 0.75rem; font-weight: 700; color: #7C2D12; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.35rem;">
                <span>🌐 융합선택 과목군</span>
                <span style="font-weight: normal; color: #78350F;">(실생활·다학제 융합 실천)</span>
              </div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.65rem;">
                ${groups.year3Fusion.map(sub => this._renderSubjectCard(sub, curriculum.year3Fusion.includes(sub.name), true, 'year3Fusion')).join('')}
              </div>
            </div>

          </div>

          <!-- Academic Validation Alert Box -->
          <div style="background: var(--color-bg-surface); border: 1px solid var(--color-border-subtle); border-radius: 4px; padding: 0.75rem 1rem; display: flex; align-items: flex-start; gap: 0.75rem; font-size: 0.8125rem;">
            <span style="font-size: 1.1rem; line-height: 1;">💡</span>
            <div style="flex: 1;">
              <strong style="color: var(--color-oxford-navy);">교육과정 설계 피드백:</strong>
              ${validation.praises.length > 0 ? `<div style="color: #047857; margin-top: 2px;">✓ ${validation.praises.join(' ')}</div>` : ''}
              ${validation.issues.length > 0 ? `<div style="color: #B45309; margin-top: 2px;">⚠️ ${validation.issues.join(' ')}</div>` : ''}
            </div>
          </div>

        </div>
      </div>
    `;

    // 이벤트 바인딩
    this._bindEvents();
  }

  /**
   * 개별 과목 카드 HTML 렌더러
   */
  _renderSubjectCard(subject, isSelected, isSelectable, groupType = null) {
    const isSelectedClass = isSelected ? 'selected-card' : '';
    const badgeType = subject.grade === 1 
      ? 'badge-required' 
      : (subject.type === '진로선택' ? 'badge-career' : (subject.type === '융합선택' ? 'badge-fusion' : 'badge-suneung'));

    return `
      <div class="curriculum-item-card ${isSelectedClass}" 
           data-name="${subject.name}" 
           data-selectable="${isSelectable}" 
           data-group="${groupType || ''}"
           style="
             background: #FFFFFF;
             border: 1.5px solid ${isSelected ? 'var(--color-oxford-navy)' : 'var(--color-border-subtle)'};
             border-radius: 6px;
             padding: 0.75rem;
             display: flex;
             flex-direction: column;
             justify-content: space-between;
             cursor: ${isSelectable ? 'pointer' : 'default'};
             transition: all var(--transition-fast);
             box-shadow: ${isSelected ? 'var(--shadow-sm)' : 'none'};
             position: relative;
           ">
        
        <div>
          <!-- Top Row: Badge & Details Button -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
            <span class="academic-badge ${badgeType}">${subject.flags[0]}</span>
            <button class="btn-show-details" data-subject="${subject.name}" title="과목 상세 및 수능/학종 연계 보기" style="
              background: transparent;
              border: none;
              color: var(--color-text-muted);
              cursor: pointer;
              font-size: 0.75rem;
              padding: 2px 4px;
              border-radius: 3px;
              transition: color 0.15s;
            ">
              🔍 상세
            </button>
          </div>

          <!-- Title -->
          <div style="font-weight: 700; font-size: 0.875rem; color: ${isSelected ? 'var(--color-oxford-navy)' : 'var(--color-text-main)'}; margin-bottom: 0.25rem;">
            ${subject.name}
          </div>

          <!-- Summary Snippet -->
          <div style="font-size: 0.725rem; color: var(--color-text-secondary); line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${subject.summary}
          </div>
        </div>

        <!-- Bottom Checkmark / Status -->
        <div style="margin-top: 0.5rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.7rem;">
          <span style="color: var(--color-text-muted);">${subject.credits}학점 (${subject.semester})</span>
          ${isSelected ? `
            <span style="color: var(--color-oxford-navy); font-weight: 700; display: flex; align-items: center; gap: 2px;">
              ✓ 이수 선택됨
            </span>
          ` : `
            <span style="color: var(--color-text-light);">미선택</span>
          `}
        </div>

      </div>
    `;
  }

  /**
   * 클릭 이벤트 바인딩
   */
  _bindEvents() {
    // 1. 과목 카드 선택/해제 토글
    const cards = this.container.querySelectorAll('.curriculum-item-card[data-selectable="true"]');
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        // 상세 버튼 클릭 시에는 토글 방지
        if (e.target.closest('.btn-show-details')) return;

        const subjectName = card.dataset.name;
        const group = card.dataset.group;
        if (group && subjectName) {
          roadmapStore.toggleSubject(group, subjectName);
        }
      });
    });

    // 2. 과목 상세 팝업 오픈
    const detailBtns = this.container.querySelectorAll('.btn-show-details');
    detailBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const subjectName = btn.dataset.subject;
        this.openSubjectModal(subjectName);
      });
    });
  }

  /**
   * 과목 학술 상세 모달 열기
   */
  openSubjectModal(subjectName) {
    const details = curriculumEngine.getSubjectDetails(subjectName);
    if (!details) return;

    // 모달 DOM 생성 또는 렌더링
    let modal = document.getElementById('academic-subject-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'academic-subject-modal';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-backdrop" style="
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(11, 37, 69, 0.5);
        backdrop-filter: blur(3px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.15s ease-out;
      ">
        <div class="modal-card" style="
          background: #FFFFFF;
          border-radius: 8px;
          border: 1px solid var(--color-border-subtle);
          box-shadow: 0 20px 35px rgba(11, 37, 69, 0.25);
          width: 90%;
          max-width: 620px;
          max-height: 85vh;
          overflow-y: auto;
          padding: 1.75rem;
          position: relative;
        ">
          <!-- Close button -->
          <button id="modal-close-btn" style="
            position: absolute;
            top: 1rem; right: 1rem;
            background: transparent;
            border: none;
            font-size: 1.25rem;
            cursor: pointer;
            color: var(--color-text-muted);
          ">✕</button>

          <!-- Modal Header -->
          <div style="border-bottom: 2px solid var(--color-oxford-navy); padding-bottom: 0.75rem; margin-bottom: 1.25rem;">
            <div style="display: flex; gap: 0.5rem; margin-bottom: 0.25rem;">
              <span class="academic-badge badge-suneung">${details.grade}학년 • ${details.type}</span>
              <span class="academic-badge badge-required">${details.credits}학점 (${details.semester})</span>
            </div>
            <h2 style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--color-oxford-navy); font-weight: 700;">
              ${details.name}
            </h2>
            <div style="font-size: 0.85rem; color: var(--color-text-secondary); margin-top: 0.35rem; line-height: 1.5;">
              ${details.summary}
            </div>
          </div>

          <!-- Section 1: 수능 및 대입 연계성 -->
          <div style="margin-bottom: 1rem; background: var(--color-antique-amber-subtle); border-left: 3px solid var(--color-antique-amber); padding: 0.75rem 1rem;">
            <strong style="color: #B45309; font-size: 0.85rem; display: block; margin-bottom: 0.2rem;">🎯 수능 및 학업 역량 연계</strong>
            <p style="font-size: 0.825rem; color: #78350F; line-height: 1.5;">${details.suneungRelevance}</p>
          </div>

          <!-- Section 2: 주요 학습 내용 및 단원 주제 -->
          <div style="margin-bottom: 1rem;">
            <strong style="font-size: 0.85rem; color: var(--color-oxford-navy); display: block; margin-bottom: 0.4rem;">📖 주요 탐구 주제 및 단원</strong>
            <ul style="font-size: 0.825rem; color: var(--color-text-secondary); padding-left: 1.2rem; line-height: 1.6;">
              ${details.keyTopics.map(t => `<li>${t}</li>`).join('')}
            </ul>
          </div>

          <!-- Section 3: 핵심 역량 -->
          <div style="margin-bottom: 1.25rem;">
            <strong style="font-size: 0.85rem; color: var(--color-oxford-navy); display: block; margin-bottom: 0.4rem;">🌟 배양되는 2022 개정 핵심 역량</strong>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              ${details.coreCompetencies.map(c => `<span class="academic-badge badge-career">${c}</span>`).join('')}
            </div>
          </div>

          <!-- Modal Action -->
          <div style="display: flex; justify-content: flex-end; border-top: 1px solid var(--color-border-subtle); padding-top: 1rem;">
            <button id="modal-confirm-btn" class="academic-btn btn-primary" style="padding: 0.5rem 1.25rem;">
              확인 완료
            </button>
          </div>
        </div>
      </div>
    `;

    // 닫기 리스너
    const close = () => {
      modal.innerHTML = '';
    };
    modal.querySelector('#modal-close-btn').addEventListener('click', close);
    modal.querySelector('#modal-confirm-btn').addEventListener('click', close);
    modal.querySelector('.modal-backdrop').addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop')) close();
    });
  }
}

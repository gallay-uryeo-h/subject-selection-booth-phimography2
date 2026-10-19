/**
 * modules/m08-wizard-funnel/wizard-view.js
 * 
 * 다이렉트 자동차보험 가입 방식의 5단계 인터랙티브 위저드 뷰 컴포넌트
 */

import { roadmapStore } from '../../core/store.js';
import { CAREER_CATEGORIES } from '../../core/types.js';
import { curriculumEngine } from '../m02-curriculum/curriculum-engine.js';
import { ragMatcher } from '../m03-textbook-rag/rag-matcher.js';
import { academicAiModule } from '../m05-academic-ai/gemini-client.js';
import { photocardBuilder } from '../m06-photocard/photocard-builder.js';

export class WizardView {
  constructor(containerElement) {
    this.container = containerElement;
    this.currentStep = 1;
    this.totalSteps = 5;
  }

  /**
   * 위저드 렌더링
   */
  render() {
    if (!this.container) return;

    const state = roadmapStore.getState();
    const progressPercent = (this.currentStep / this.totalSteps) * 100;

    const stepTitles = [
      "기본 정보",
      "진로 계열",
      "3개년 과목",
      "교과서 & 세특",
      "네컷사진 & 완성"
    ];

    this.container.innerHTML = `
      <div class="wizard-funnel-container">
        
        <!-- Progress Header -->
        <div class="wizard-progress-header">
          <div class="wizard-step-indicator">
            <span class="active-step-title">STEP 0${this.currentStep}. ${stepTitles[this.currentStep - 1]}</span>
            <span>${this.currentStep} / ${this.totalSteps}</span>
          </div>
          <div class="wizard-progress-track">
            <div class="wizard-progress-bar" style="width: ${progressPercent}%;"></div>
          </div>
        </div>

        <!-- Dynamic Step Body -->
        <div class="wizard-body">
          ${this._renderStepContent(state)}
        </div>

        <!-- Navigation Footer -->
        <div class="wizard-footer">
          ${this.currentStep > 1 ? `
            <button id="wizard-btn-prev" class="wizard-btn-prev">
              ← 이전 단계
            </button>
          ` : `<div></div>`}

          ${this.currentStep < this.totalSteps ? `
            <button id="wizard-btn-next" class="wizard-btn-next">
              다음 단계로 이동 →
            </button>
          ` : `
            <button id="wizard-btn-finish" class="wizard-btn-next" style="background: #0B2545; border: 2px solid #D97706;">
              🖨️ 최종 네컷 카드 즉석 인쇄
            </button>
          `}
        </div>

      </div>
    `;

    this._bindEvents(state);
  }

  /**
   * 단계별 본문 렌더링
   */
  _renderStepContent(state) {
    switch (this.currentStep) {
      // Step 1: 학생 기본 정보
      case 1:
        return `
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: #D97706; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem;">
              STEP 01. STUDENT IDENTIFICATION
            </div>
            <h2 class="wizard-headline">반갑습니다! 학생 정보를 알려주세요.</h2>
            <p class="wizard-subheadline">
              입력하신 정보는 학생증 및 아카데믹 네컷 로드맵 카드에 인쇄되며, 부스 종료 시 안전하게 리셋됩니다.
            </p>

            <div style="display: flex; flex-direction: column; gap: 1.25rem; max-width: 520px;">
              <div>
                <label style="font-weight: 700; font-size: 0.9rem; color: var(--color-oxford-navy); display: block; margin-bottom: 0.4rem;">
                  학생 이름
                </label>
                <input type="text" id="wiz-input-name" value="${state.profile.name || ''}" placeholder="예: 김의령" style="
                  width: 100%; padding: 0.85rem 1rem; border: 2px solid var(--color-border-subtle); border-radius: 8px; font-size: 1rem;
                ">
              </div>

              <div>
                <label style="font-weight: 700; font-size: 0.9rem; color: var(--color-oxford-navy); display: block; margin-bottom: 0.4rem;">
                  희망 직업 또는 목표 세부 진로 (선택)
                </label>
                <input type="text" id="wiz-input-career" value="${state.profile.targetCareer || ''}" placeholder="예: 인공지능 연구원, 바이오 신약 개발자, 로스쿨 변호사" style="
                  width: 100%; padding: 0.85rem 1rem; border: 2px solid var(--color-border-subtle); border-radius: 8px; font-size: 1rem;
                ">
                <span style="font-size: 0.75rem; color: var(--color-text-muted); margin-top: 4px; display: block;">
                  💡 입력 시 관련 교과서 단원과 세특 탐구 주제가 1ms 내로 자동 매칭됩니다.
                </span>
              </div>
            </div>
          </div>
        `;

      // Step 2: 6대 핵심 진로 계열 선택
      case 2:
        return `
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: #D97706; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem;">
              STEP 02. CAREER PATH SELECTION
            </div>
            <h2 class="wizard-headline">어떤 진로 계열에 가장 관심이 있나요?</h2>
            <p class="wizard-subheadline">
              계열을 선택하시면 2022 개정 영어과 3개년 최적화 과목 조합이 자동으로 추천 배치됩니다.
            </p>

            <div class="wizard-card-grid">
              ${CAREER_CATEGORIES.map(cat => {
                const isSelected = cat.id === state.profile.careerCategoryId;
                return `
                  <div class="wizard-select-card ${isSelected ? 'selected' : ''}" data-cat-id="${cat.id}">
                    <div>
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span class="academic-badge ${isSelected ? 'badge-suneung' : 'badge-career'}">${cat.name.split(' ')[0]}</span>
                        ${isSelected ? '<span style="color: var(--color-oxford-navy); font-weight: 700; font-size: 0.85rem;">✓ 선택됨</span>' : ''}
                      </div>
                      <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--color-oxford-navy); margin-bottom: 0.35rem;">
                        ${cat.name}
                      </h4>
                      <p style="font-size: 0.8rem; color: var(--color-text-secondary); line-height: 1.45;">
                        ${cat.description}
                      </p>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;

      // Step 3: 3개년 과목 선택
      case 3:
        const validation = curriculumEngine.validateCurriculum(state.curriculum, state.profile.careerCategoryId);
        const groups = curriculumEngine.getSubjectGroups();

        return `
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: #D97706; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem;">
              STEP 03. 3-YEAR ENGLISH CURRICULUM
            </div>
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <h2 class="wizard-headline">3학년 선택과목을 확인하고 조정하세요.</h2>
              <span class="academic-badge badge-suneung">총 ${validation.totalCredits}학점</span>
            </div>
            <p class="wizard-subheadline">
              1학년(기초필수)과 2학년(수능 일반선택)은 안정적으로 자동 배치되었습니다. 3학년에서 진로에 맞게 자유롭게 터치하여 과목을 선택/해제하세요.
            </p>

            <!-- 3학년 진로선택 -->
            <div style="margin-bottom: 1.25rem;">
              <div style="font-size: 0.85rem; font-weight: 700; color: #B45309; margin-bottom: 0.5rem;">
                📚 진로선택 과목군 (성취평가 A·B·C / 학종 심화)
              </div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.65rem;">
                ${groups.year3Career.map(sub => {
                  const sel = state.curriculum.year3Career.includes(sub.name);
                  return `
                    <div class="curriculum-item-card ${sel ? 'selected-card' : ''}" data-group="year3Career" data-name="${sub.name}" style="
                      background: #FFF; border: 2px solid ${sel ? 'var(--color-oxford-navy)' : 'var(--color-border-subtle)'};
                      border-radius: 8px; padding: 0.85rem; cursor: pointer;
                    ">
                      <div style="font-weight: 700; font-size: 0.95rem; color: ${sel ? 'var(--color-oxford-navy)' : 'var(--color-text-main)'};">
                        ${sub.name}
                      </div>
                      <div style="font-size: 0.725rem; color: var(--color-text-muted); margin-top: 4px;">${sub.summary.slice(0, 38)}...</div>
                      <div style="margin-top: 8px; font-size: 0.75rem; font-weight: 700; color: ${sel ? 'var(--color-oxford-navy)' : 'var(--color-text-light)'};">
                        ${sel ? '✓ 선택됨' : '터치하여 추가'}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- 3학년 융합선택 -->
            <div>
              <div style="font-size: 0.85rem; font-weight: 700; color: #7C2D12; margin-bottom: 0.5rem;">
                🌐 융합선택 과목군 (실생활·다학제 융합)
              </div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.65rem;">
                ${groups.year3Fusion.map(sub => {
                  const sel = state.curriculum.year3Fusion.includes(sub.name);
                  return `
                    <div class="curriculum-item-card ${sel ? 'selected-card' : ''}" data-group="year3Fusion" data-name="${sub.name}" style="
                      background: #FFF; border: 2px solid ${sel ? 'var(--color-oxford-navy)' : 'var(--color-border-subtle)'};
                      border-radius: 8px; padding: 0.85rem; cursor: pointer;
                    ">
                      <div style="font-weight: 700; font-size: 0.95rem; color: ${sel ? 'var(--color-oxford-navy)' : 'var(--color-text-main)'};">
                        ${sub.name}
                      </div>
                      <div style="font-size: 0.725rem; color: var(--color-text-muted); margin-top: 4px;">${sub.summary.slice(0, 38)}...</div>
                      <div style="margin-top: 8px; font-size: 0.75rem; font-weight: 700; color: ${sel ? 'var(--color-oxford-navy)' : 'var(--color-text-light)'};">
                        ${sel ? '✓ 선택됨' : '터치하여 추가'}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        `;

      // Step 4: 교과서 발췌문 & 세특 1선
      case 4:
        const tb = state.matchedTextbook;
        const adv = state.academicAdvice;
        return `
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: #D97706; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem;">
              STEP 04. ACADEMIC EVIDENCE & RESEARCH
            </div>
            <h2 class="wizard-headline">선택한 진로와 직결된 교과서 구절입니다.</h2>
            <p class="wizard-subheadline">
              교과서의 핵심 지문과 학생부에 기재 가능한 맞춤형 세특 탐구 주제 1선을 확인하세요.
            </p>

            <!-- Textbook Card -->
            <div style="background: #FFFFFF; border: 2px solid var(--color-antique-amber); border-radius: 8px; padding: 1.25rem; margin-bottom: 1.25rem;">
              <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                <span class="academic-badge badge-suneung">${(tb.textbookName || tb.textbook)} (p.${tb.pageNumber || tb.page})</span>
                <span class="academic-badge badge-career">${state.profile.careerCategory}</span>
              </div>
              <h4 style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--color-oxford-navy); margin-bottom: 0.5rem;">
                ${tb.unitTitle || tb.unit}
              </h4>
              <div style="background: #F8FAFC; padding: 1rem; border-radius: 6px; font-size: 0.95rem; line-height: 1.7; font-style: italic; border: 1px solid #E2E8F0;">
                "<span class="highlight-text" style="background-color: rgba(253, 224, 71, 0.55); padding: 2px 4px;">${tb.snippetText || tb.raw_text}</span>"
              </div>
            </div>

            <!-- Se-teuk Guide -->
            <div style="background: var(--color-antique-amber-subtle); border-left: 4px solid var(--color-antique-amber); padding: 1rem 1.25rem; border-radius: 0 8px 8px 0;">
              <strong style="color: #B45309; font-size: 0.9rem; display: block; margin-bottom: 0.35rem;">
                🌟 학생부 세특 추천 탐구 주제 1선:
              </strong>
              <p style="color: #78350F; font-size: 0.9rem; line-height: 1.5; font-weight: 500;">
                ${adv.seTeukGuideline}
              </p>
            </div>
          </div>
        `;

      // Step 5: 웹캠 네컷사진 & 최종 카드 인쇄
      case 5:
        const hasPhoto = !!state.profile.photoDataUrl;
        return `
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: #D97706; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem;">
              STEP 05. FINAL DELIVERABLE & PHOTOBOOTH
            </div>
            <h2 class="wizard-headline">마지막 단계! 네컷사진을 찍고 완성하세요.</h2>
            <p class="wizard-subheadline">
              웹캠으로 멋진 포즈의 사진을 촬영하면 최종 아카데믹 네컷 로드맵 카드가 완성됩니다.
            </p>

            <div style="display: flex; gap: 2rem; align-items: flex-start; justify-content: center; flex-wrap: wrap;">
              <!-- Photo Shoot Trigger -->
              <div style="text-align: center; max-width: 240px;">
                <div style="
                  width: 150px; height: 180px; border: 2px dashed #0B2545; border-radius: 8px; margin: 0 auto 1rem;
                  overflow: hidden; background: #F1F5F9; display: flex; align-items: center; justify-content: center;
                ">
                  ${hasPhoto ? `
                    <img src="${state.profile.photoDataUrl}" style="width: 100%; height: 100%; object-fit: cover;">
                  ` : `
                    <div style="color: #64748B;">
                      <div style="font-size: 3rem;">📸</div>
                      <div style="font-size: 0.8rem; font-weight: 700; margin-top: 4px;">사진 미촬영</div>
                    </div>
                  `}
                </div>

                <button id="wiz-btn-photo" class="academic-btn btn-primary" style="
                  width: 100%; padding: 0.75rem; font-size: 0.95rem; font-weight: 700; border: 2px solid #D97706;
                ">
                  ${hasPhoto ? '🔄 사진 다시 찍기' : '📸 3초 타이머 사진 촬영'}
                </button>
              </div>

              <!-- Preview Card Scale -->
              <div style="transform: scale(0.85); transform-origin: top center;">
                ${photocardBuilder.generateCardMarkup(state)}
              </div>
            </div>
          </div>
        `;
    }
  }

  /**
   * 이벤트 바인딩
   */
  _bindEvents(state) {
    // 이전 버튼
    const prevBtn = this.container.querySelector('#wizard-btn-prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentStep > 1) {
          this.currentStep--;
          this.render();
        }
      });
    }

    // 다음 버튼
    const nextBtn = this.container.querySelector('#wizard-btn-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        // Step 1 유효성 검사 및 저장
        if (this.currentStep === 1) {
          const nameInput = this.container.querySelector('#wiz-input-name');
          const careerInput = this.container.querySelector('#wiz-input-career');
          roadmapStore.updateProfile({
            name: nameInput.value.trim(),
            targetCareer: careerInput.value.trim()
          });
          const st = roadmapStore.getState();
          ragMatcher.syncToStore(st.profile.careerCategory, careerInput.value.trim());
          academicAiModule.consult(st.profile.careerCategoryId, careerInput.value.trim());
        }

        if (this.currentStep < this.totalSteps) {
          this.currentStep++;
          this.render();
        }
      });
    }

    // 최종 인쇄 버튼
    const finishBtn = this.container.querySelector('#wizard-btn-finish');
    if (finishBtn) {
      finishBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Step 2 계열 카드 클릭 시 자동 다음 단계 이동 (다이렉트 UX)
    if (this.currentStep === 2) {
      const cards = this.container.querySelectorAll('.wizard-select-card');
      cards.forEach(card => {
        card.addEventListener('click', () => {
          const catId = card.dataset.catId;
          curriculumEngine.applyCategoryPreset(catId);
          const st = roadmapStore.getState();
          ragMatcher.syncToStore(st.profile.careerCategory, st.profile.targetCareer);
          academicAiModule.consult(catId, st.profile.targetCareer);

          // 부드럽게 다음 단계로 자동 진행
          setTimeout(() => {
            this.currentStep = 3;
            this.render();
          }, 200);
        });
      });
    }

    // Step 3 과목 토글
    if (this.currentStep === 3) {
      const cards = this.container.querySelectorAll('.curriculum-item-card');
      cards.forEach(card => {
        card.addEventListener('click', () => {
          const group = card.dataset.group;
          const name = card.dataset.name;
          roadmapStore.toggleSubject(group, name);
          this.render();
        });
      });
    }

    // Step 5 사진 촬영 트리거
    if (this.currentStep === 5) {
      const photoBtn = this.container.querySelector('#wiz-btn-photo');
      if (photoBtn) {
        photoBtn.addEventListener('click', () => {
          window.openWebcamBooth();
        });
      }
    }
  }
}

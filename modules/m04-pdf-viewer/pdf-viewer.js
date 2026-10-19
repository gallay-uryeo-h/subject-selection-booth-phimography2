/**
 * modules/m04-pdf-viewer/pdf-viewer.js
 * 
 * 교과서 4종 원본 발췌문 & PDF 하이라이트 인터페이스 컴포넌트
 * Academic Light 스타일의 마커펜(#FDE047, multiply) 텍스처 프리뷰 및 교과서 변경 지원
 */

import { eventBus } from '../../core/event-bus.js';
import { EVENTS } from '../../core/types.js';
import { ragMatcher } from '../m03-textbook-rag/rag-matcher.js';
import { roadmapStore } from '../../core/store.js';

export class PdfViewerModule {
  constructor() {
    this.container = null;
    this.currentData = null;
  }

  init(containerElement) {
    this.container = containerElement;

    // 중앙 스토어 상태 변경 리스너
    eventBus.on(EVENTS.TEXTBOOK_MATCHED, (textbookData) => {
      this.currentData = textbookData;
      this.renderPreview(textbookData);
    });

    console.log('[Module 04] PDF Viewer module initialized');
  }

  /**
   * 교과서 단원 발췌문 & 하이라이트 프리뷰 렌더링
   */
  renderPreview(data) {
    if (!this.container || !data) return;

    const availableMatches = data.availableMatches || [];

    this.container.innerHTML = `
      <div class="academic-card" style="border-left: 4px solid var(--color-antique-amber); position: relative;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <span class="academic-badge badge-suneung">${data.textbookName || '공통영어1'} (p.${data.pageNumber || 58})</span>
              <span class="academic-badge badge-career">${data.careerCategory || '진로 연계'}</span>
            </div>
            <h4 style="font-family: var(--font-serif); font-size: 1.2rem; margin-top: 0.4rem; color: var(--color-oxford-navy); font-weight: 700;">
              ${data.unitTitle || 'Unit Preview'}
            </h4>
            <div style="font-size: 0.825rem; color: #B45309; font-weight: 600; margin-top: 2px;">
              📌 핵심 주제: ${data.topicKo || data.topicEn || ''}
            </div>
          </div>

          <div style="display: flex; gap: 0.35rem; align-items: center;">
            <button class="academic-btn btn-outline" id="btn-open-pdf-modal" style="font-size: 0.75rem; padding: 0.35rem 0.65rem;" title="교과서 원본 PDF 뷰어 열기">
              📄 원본 PDF 확인
            </button>
          </div>
        </div>

        <!-- Topic Subtitle -->
        <div style="font-size: 0.75rem; color: var(--color-text-muted); margin-bottom: 0.65rem; font-family: var(--font-mono);">
          Topic (EN): ${data.topicEn || ''}
        </div>

        <!-- Textbook Snippet with Realistic Highlighter Texture -->
        <div style="
          background-color: #FFFFFF;
          padding: 1.15rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border-subtle);
          font-size: 0.925rem;
          line-height: 1.75;
          color: var(--color-text-main);
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.02);
          position: relative;
        ">
          <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted); margin-bottom: 0.35rem; font-weight: 700;">
            ■ TEXTBOOK AUTHENTIC PASSAGE (형광펜 실시간 하이라이트)
          </div>
          <p style="margin: 0; font-style: italic;">
            "<span class="highlight-text" style="
              background-color: rgba(253, 224, 71, 0.55);
              padding: 2px 4px;
              border-radius: 2px;
              mix-blend-mode: multiply;
              box-decoration-break: clone;
              -webkit-box-decoration-break: clone;
            ">${data.snippetText || '교과서 단원 본문 발췌문이 이곳에 표시됩니다.'}</span>"
          </p>
        </div>

        <!-- Academic Tip Box -->
        ${data.academicTip ? `
          <div style="margin-top: 0.75rem; background: var(--color-bg-surface); padding: 0.6rem 0.85rem; border-radius: 4px; border: 1px solid var(--color-border-subtle); font-size: 0.8rem; display: flex; align-items: flex-start; gap: 0.5rem;">
            <span style="color: var(--color-oxford-navy);">🎓</span>
            <div style="color: var(--color-text-secondary); line-height: 1.45;">
              <strong style="color: var(--color-oxford-navy);">교과서 연계 학술 팁:</strong> ${data.academicTip}
            </div>
          </div>
        ` : ''}

        <!-- Alternative Chunks within Same Category -->
        ${availableMatches.length > 1 ? `
          <div style="margin-top: 0.75rem; padding-top: 0.65rem; border-top: 1px dashed var(--color-border-subtle); display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <span style="font-size: 0.725rem; color: var(--color-text-muted); font-weight: 600;">동일 계열 타 교과서 연계 단원:</span>
            ${availableMatches.map(m => `
              <button class="btn-switch-chunk academic-btn btn-outline" data-chunk-id="${m.chunkId}" style="
                font-size: 0.7rem; 
                padding: 0.2rem 0.5rem; 
                ${m.chunkId === data.chunkId ? 'background: var(--color-oxford-navy); color: #FFF; border-color: var(--color-oxford-navy);' : ''}
              ">
                ${m.textbookName.split(' ')[0]} ${m.unitTitle.split('.')[0]}
              </button>
            `).join('')}
          </div>
        ` : ''}

      </div>
    `;

    // 이벤트 바인딩
    this._bindEvents(data);
  }

  _bindEvents(data) {
    // 1. 단원 전환 버튼 클릭
    const switchBtns = this.container.querySelectorAll('.btn-switch-chunk');
    switchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const chunkId = btn.dataset.chunkId;
        const state = roadmapStore.getState();
        ragMatcher.syncToStore(state.profile.careerCategory, state.profile.targetCareer, chunkId);
      });
    });

    // 2. 교과서 원본 PDF 모달 트리거
    const modalBtn = this.container.querySelector('#btn-open-pdf-modal');
    if (modalBtn) {
      modalBtn.addEventListener('click', () => {
        eventBus.emit(EVENTS.PDF_VIEWER_OPEN_REQUESTED, data);
        alert(`[교과서 원본 뷰어]\n\n• 파일명: ${data.pdfFile}\n• 해당 페이지: ${data.pageNumber} 페이지\n• 단원: ${data.unitTitle}\n\n(Step 3에서 Mozilla PDF.js 캔버스 렌더러와 1:1 SVG 하이라이팅이 바로 연결됩니다.)`);
      });
    }
  }
}

export const pdfViewerModule = new PdfViewerModule();

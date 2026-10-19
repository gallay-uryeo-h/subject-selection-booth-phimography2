/**
 * modules/m08-wizard-funnel/wizard-view.js
 * 
 * 다이렉트 자동차보험 스타일 '하나씩 스르륵 나타나는' 점진적 스트림 질문 노출 UI 모듈
 */

export class StreamWizardView {
  constructor(containerElement, store, curriculumData, careerCategories) {
    this.container = containerElement;
    this.store = store;
    this.curriculumData = curriculumData;
    this.careerCategories = careerCategories;
    
    this.streamCurrentStep = 1;
    this.streamEditingStep = null;

    this.careerKeywordsMap = {
      'humanities': ['국제통상 전문가', '외교관', '글로벌 마케터', '동시통역사', '문화콘텐츠 기획자'],
      'social': ['로스쿨 변호사', '공인회계사(CPA)', '투자은행 애널리스트', '정책 연구원', '빅데이터 경영컨설턴트'],
      'nature': ['생명공학 연구원', '양자컴퓨팅 물리학자', '천문우주 데이터분석가', '신소재 연구원', '기후변화 환경과학자'],
      'engineering': ['인공지능(AI) 연구원', '자율주행 소프트웨어 엔지니어', '반도체 공정설계사', '로봇 공학자', '정보보안 전문가'],
      'medicine': ['신약 개발 바이오 연구원', '임상 의사', '정밀의료 유전체 분석가', '약학 연구원', '디지털 헬스케어 기획자'],
      'education': ['중등 영어 교사', '교육공학 AI 튜터 개발자', '국제기구(UNESCO) 교육 전문가', '언어인지 발달연구원']
    };

    this.init();
  }

  init() {
    this.render();
    this.store.subscribe(() => this.render());
  }

  editStep(step) {
    this.streamEditingStep = step;
    this.render();
    setTimeout(() => {
      const el = document.getElementById(`stream-step-${step}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  }

  completeStep(step) {
    if (this.streamEditingStep === step) {
      this.streamEditingStep = null;
    } else if (this.streamCurrentStep === step && this.streamCurrentStep < 6) {
      this.streamCurrentStep++;
    }
    this.render();
    setTimeout(() => {
      const targetStep = this.streamEditingStep || this.streamCurrentStep;
      const el = document.getElementById(`stream-step-${targetStep}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  }

  render() {
    if (!this.container) return;
    const state = this.store.getState();
    const currentActive = this.streamEditingStep || this.streamCurrentStep;

    let html = `
      <div class="stream-funnel-wrapper">
        <div style="text-align:center; margin-bottom:0.5rem;">
          <span style="font-size:0.75rem; font-weight:700; color:#D97706; text-transform:uppercase; letter-spacing:0.08em; background:#FEF3C7; padding:4px 12px; border-radius:9999px;">
            ⚡ 1:1 다이렉트 스마트 문답 퍼널
          </span>
          <p style="font-size:0.875rem; color:#64748B; margin-top:6px;">답변을 입력하시면 다음 질문이 스르륵 순서대로 열립니다.</p>
        </div>
    `;

    // Step 1: 학생 이름
    if (this.streamCurrentStep >= 1) {
      const isCollapsed = currentActive !== 1 && this.streamCurrentStep > 1;
      if (isCollapsed) {
        html += `
          <div id="stream-step-1" class="stream-step-card collapsed-summary" onclick="window.__streamWizard.editStep(1)">
            <div class="stream-summary-bar">
              <div class="stream-summary-left">
                <div class="stream-check-icon">✓</div>
                <div>
                  <span class="stream-summary-label">STEP 01. 학생 이름: </span>
                  <strong class="stream-summary-value">${state.profile.name || '김의령'}</strong>
                </div>
              </div>
              <button class="stream-edit-btn">수정</button>
            </div>
          </div>
        `;
      } else {
        html += `
          <div id="stream-step-1" class="stream-step-card active-question animate-reveal">
            <div class="stream-card-body">
              <div class="stream-step-badge">STEP 01 • STUDENT PROFILE</div>
              <h2 class="stream-question-title">반갑습니다! 학생의 이름을 알려주세요.</h2>
              <p class="stream-question-desc">의령여자고등학교 선택과목 박람회에 오신 것을 환영합니다. 학생증 및 네컷 카드에 표기될 이름입니다.</p>
              <div style="display:flex; gap:10px; max-width:480px;">
                <input type="text" id="stream-name-input" value="${state.profile.name || ''}" placeholder="예: 김의령" 
                  style="flex:1; padding:0.9rem 1.15rem; border:2px solid #CBD5E1; border-radius:8px; font-size:1.1rem; font-weight:600;"
                  onkeydown="if(event.key==='Enter') window.__streamWizard.handleNameConfirm();">
                <button class="stream-action-btn" onclick="window.__streamWizard.handleNameConfirm()">다음 →</button>
              </div>
            </div>
          </div>
        `;
      }
    }

    // Step 2: 진로 계열
    if (this.streamCurrentStep >= 2) {
      const isCollapsed = currentActive !== 2 && this.streamCurrentStep > 2;
      if (isCollapsed) {
        html += `
          <div id="stream-step-2" class="stream-step-card collapsed-summary" onclick="window.__streamWizard.editStep(2)">
            <div class="stream-summary-bar">
              <div class="stream-summary-left">
                <div class="stream-check-icon">✓</div>
                <div>
                  <span class="stream-summary-label">STEP 02. 진로 계열: </span>
                  <strong class="stream-summary-value">${state.profile.careerCategory}</strong>
                </div>
              </div>
              <button class="stream-edit-btn">수정</button>
            </div>
          </div>
        `;
      } else {
        html += `
          <div id="stream-step-2" class="stream-step-card active-question animate-reveal">
            <div class="stream-card-body">
              <div class="stream-step-badge">STEP 02 • CAREER FIELD</div>
              <h2 class="stream-question-title">${state.profile.name || '학생'}님, 어떤 진로 계열에 가장 관심이 있나요?</h2>
              <p class="stream-question-desc">계열을 터치하시면 2022 개정 3개년 영어 맞춤 과목 편제가 1초 만에 자동 배치됩니다.</p>
              <div class="stream-card-grid">
                ${this.careerCategories.map(cat => {
                  const isSel = cat.id === state.profile.careerCategoryId;
                  return `
                    <div class="stream-select-card ${isSel ? 'selected' : ''}" onclick="window.__streamWizard.handleCategorySelect('${cat.id}')">
                      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <span class="academic-badge ${isSel ? 'badge-suneung' : 'badge-career'}">${cat.name.split(' ')[0]}</span>
                        ${isSel ? '<span style="color:#0B2545; font-weight:700; font-size:0.85rem;">✓ 선택됨</span>' : '<span style="color:#64748B; font-size:0.8rem;">터치하여 선택 →</span>'}
                      </div>
                      <h4 style="font-size:1.05rem; font-weight:700; color:#0B2545; margin-bottom:4px;">${cat.name}</h4>
                      <p style="font-size:0.8rem; color:#475569; line-height:1.4;">${cat.description}</p>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        `;
      }
    }

    // Step 3: 세부 직업/진로
    if (this.streamCurrentStep >= 3) {
      const isCollapsed = currentActive !== 3 && this.streamCurrentStep > 3;
      const keywords = this.careerKeywordsMap[state.profile.careerCategoryId] || ['인공지능 연구원', '의사', '변호사'];
      if (isCollapsed) {
        html += `
          <div id="stream-step-3" class="stream-step-card collapsed-summary" onclick="window.__streamWizard.editStep(3)">
            <div class="stream-summary-bar">
              <div class="stream-summary-left">
                <div class="stream-check-icon">✓</div>
                <div>
                  <span class="stream-summary-label">STEP 03. 목표 진로: </span>
                  <strong class="stream-summary-value">${state.profile.targetCareer}</strong>
                </div>
              </div>
              <button class="stream-edit-btn">수정</button>
            </div>
          </div>
        `;
      } else {
        html += `
          <div id="stream-step-3" class="stream-step-card active-question animate-reveal">
            <div class="stream-card-body">
              <div class="stream-step-badge">STEP 03 • TARGET CAREER</div>
              <h2 class="stream-question-title">구체적인 목표 직업이나 관심 분야가 있나요?</h2>
              <p class="stream-question-desc">아래 추천 키워드를 터치하시거나, 직접 타이핑하여 입력해 주세요. 즉시 교과서 지문과 세특 가이드가 매칭됩니다.</p>
              
              <div style="margin-bottom:1rem;">
                <span style="font-size:0.8rem; font-weight:700; color:#64748B;">⚡ [${state.profile.careerCategory}] 추천 키워드 (클릭 시 자동 입력):</span>
                <div class="stream-tag-chips">
                  ${keywords.map(kw => `
                    <button class="stream-tag-chip" onclick="window.__streamWizard.handleQuickCareer('${kw}')">+ ${kw}</button>
                  `).join('')}
                </div>
              </div>

              <div style="display:flex; gap:10px; max-width:540px;">
                <input type="text" id="stream-career-input" value="${state.profile.targetCareer || ''}" placeholder="예: 인공지능 신약 연구원, 로스쿨 변호사" 
                  style="flex:1; padding:0.9rem 1.15rem; border:2px solid #CBD5E1; border-radius:8px; font-size:1.05rem; font-weight:600;"
                  onkeydown="if(event.key==='Enter') window.__streamWizard.handleCareerConfirm();">
                <button class="stream-action-btn" onclick="window.__streamWizard.handleCareerConfirm()">확인 및 분석 →</button>
              </div>
            </div>
          </div>
        `;
      }
    }

    // Step 4: 교과서 RAG & 세특
    if (this.streamCurrentStep >= 4) {
      const isCollapsed = currentActive !== 4 && this.streamCurrentStep > 4;
      const tb = state.matchedTextbook;
      const adv = state.academicAdvice;
      if (isCollapsed) {
        html += `
          <div id="stream-step-4" class="stream-step-card collapsed-summary" onclick="window.__streamWizard.editStep(4)">
            <div class="stream-summary-bar">
              <div class="stream-summary-left">
                <div class="stream-check-icon">✓</div>
                <div>
                  <span class="stream-summary-label">STEP 04. 교과서 연계 분석: </span>
                  <strong class="stream-summary-value">${tb.textbook.split(' ')[0]} ${tb.unit} (매칭 완료)</strong>
                </div>
              </div>
              <button class="stream-edit-btn">확인/수정</button>
            </div>
          </div>
        `;
      } else {
        html += `
          <div id="stream-step-4" class="stream-step-card active-question animate-reveal">
            <div class="stream-card-body">
              <div class="stream-step-badge">STEP 04 • ACADEMIC EVIDENCE & RAG</div>
              <h2 class="stream-question-title">'${state.profile.targetCareer}' 맞춤 교과서 구절 & 세특 탐구 주제를 찾았습니다!</h2>
              <p class="stream-question-desc">의령여고 영어 교과서 4종 전 단원에서 추출한 실제 원문 지문과 학생부 종합전형 연계 가이드입니다.</p>

              <div style="background:#FFF; border:2px solid #D97706; border-radius:10px; padding:1.35rem; margin-bottom:1.25rem; box-shadow:0 4px 14px rgba(217, 119, 6, 0.08);">
                <div style="display:flex; gap:6px; margin-bottom:8px;">
                  <span class="academic-badge badge-suneung">${tb.textbook} (p.${tb.page})</span>
                  <span class="academic-badge badge-career">${state.profile.careerCategory}</span>
                </div>
                <h4 style="font-family:var(--font-serif); font-size:1.25rem; color:#0B2545; margin-bottom:8px;">${tb.unit}</h4>
                <div style="background:#F8FAFC; padding:1.15rem; border-radius:8px; font-size:0.95rem; line-height:1.75; font-style:italic; border:1px solid #E2E8F0;">
                  "<span class="highlight-text">${tb.raw_text}</span>"
                </div>
              </div>

              <div style="background:#FEF3C7; border-left:4px solid #D97706; padding:1.15rem 1.35rem; border-radius:0 8px 8px 0; margin-bottom:1.5rem;">
                <strong style="color:#B45309; font-size:0.9rem; display:block; margin-bottom:4px;">🌟 학생부 세특 추천 탐구 가이드 (1선):</strong>
                <p style="color:#78350F; font-size:0.9rem; line-height:1.6; font-weight:600;">${adv.seTeukGuideline}</p>
              </div>

              <button class="stream-action-btn" onclick="window.__streamWizard.completeStep(4)">
                확인하고 3개년 영어 로드맵 설계하기 →
              </button>
            </div>
          </div>
        `;
      }
    }

    // Step 5: 3개년 과목 선택
    if (this.streamCurrentStep >= 5) {
      const isCollapsed = currentActive !== 5 && this.streamCurrentStep > 5;
      const allSubs = Object.values(this.curriculumData);
      const y3Career = allSubs.filter(s => s.grade === 3 && s.type === "진로선택");
      const y3Fusion = allSubs.filter(s => s.grade === 3 && s.type === "융합선택");
      const selCount = state.curriculum.year3Career.length + state.curriculum.year3Fusion.length;

      if (isCollapsed) {
        html += `
          <div id="stream-step-5" class="stream-step-card collapsed-summary" onclick="window.__streamWizard.editStep(5)">
            <div class="stream-summary-bar">
              <div class="stream-summary-left">
                <div class="stream-check-icon">✓</div>
                <div>
                  <span class="stream-summary-label">STEP 05. 3개년 과목 설계: </span>
                  <strong class="stream-summary-value">3학년 선택과목 ${selCount}개 확정 완료</strong>
                </div>
              </div>
              <button class="stream-edit-btn">수정</button>
            </div>
          </div>
        `;
      } else {
        html += `
          <div id="stream-step-5" class="stream-step-card active-question animate-reveal">
            <div class="stream-card-body">
              <div class="stream-step-badge">STEP 05 • 3-YEAR CURRICULUM</div>
              <h2 class="stream-question-title">3개년 영어 과목이 설계되었습니다. 3학년 과목을 자유롭게 조정해보세요.</h2>
              <p class="stream-question-desc">1학년(공통필수)과 2학년(수능 일반선택)은 탄탄하게 기본 배치되었습니다. 3학년 과목을 터치하여 추가/해제할 수 있습니다.</p>

              <div style="margin-bottom:1.25rem;">
                <div style="font-size:0.85rem; font-weight:700; color:#B45309; margin-bottom:8px;">📚 진로선택 과목군 (성취평가 A·B·C):</div>
                <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px;">
                  ${y3Career.map(s => {
                    const sel = state.curriculum.year3Career.includes(s.name);
                    return `
                      <div class="curriculum-item-card ${sel ? 'selected-card' : ''}" onclick="window.__streamWizard.toggleSubject('year3Career', '${s.name}')" 
                           style="background:#FFF; border:2px solid ${sel ? '#0B2545':'#E2E8F0'}; border-radius:8px; padding:10px; cursor:pointer;">
                        <div style="font-weight:700; font-size:0.95rem; color:${sel ? '#0B2545':'#0F172A'};">${s.name}</div>
                        <div style="font-size:0.7rem; color:#64748B; margin-top:4px;">${s.summary.slice(0, 36)}...</div>
                        <div style="margin-top:6px; font-size:0.75rem; font-weight:700; color:${sel ? '#0B2545':'#94A3B8'};">${sel ? '✓ 선택됨' : '터치하여 추가'}</div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>

              <div style="margin-bottom:1.5rem;">
                <div style="font-size:0.85rem; font-weight:700; color:#7C2D12; margin-bottom:8px;">🌐 융합선택 과목군 (실생활·다학제):</div>
                <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px;">
                  ${y3Fusion.map(s => {
                    const sel = state.curriculum.year3Fusion.includes(s.name);
                    return `
                      <div class="curriculum-item-card ${sel ? 'selected-card' : ''}" onclick="window.__streamWizard.toggleSubject('year3Fusion', '${s.name}')" 
                           style="background:#FFF; border:2px solid ${sel ? '#0B2545':'#E2E8F0'}; border-radius:8px; padding:10px; cursor:pointer;">
                        <div style="font-weight:700; font-size:0.95rem; color:${sel ? '#0B2545':'#0F172A'};">${s.name}</div>
                        <div style="font-size:0.7rem; color:#64748B; margin-top:4px;">${s.summary.slice(0, 36)}...</div>
                        <div style="margin-top:6px; font-size:0.75rem; font-weight:700; color:${sel ? '#0B2545':'#94A3B8'};">${sel ? '✓ 선택됨' : '터치하여 추가'}</div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>

              <button class="stream-action-btn" onclick="window.__streamWizard.completeStep(5)">
                과목 확정하고 네컷사진 촬영하기 📸
              </button>
            </div>
          </div>
        `;
      }
    }

    // Step 6: 웹캠 포토부스 & 최종 출력
    if (this.streamCurrentStep >= 6) {
      const hasPhoto = !!state.profile.photoDataUrl;
      html += `
        <div id="stream-step-6" class="stream-step-card active-question animate-reveal" style="border-color:#D97706;">
          <div class="stream-card-body">
            <div class="stream-step-badge">FINAL STEP • PHOTOBOOTH & DELIVERABLE</div>
            <h2 class="stream-question-title">마지막 단계! 네컷사진을 찍고 나만의 학업 포토카드를 완성하세요.</h2>
            <p class="stream-question-desc">웹캠으로 즉석 사진을 촬영하면 우측 아카데믹 네컷 카드에 실시간 합성되어 즉석 출력할 수 있습니다.</p>

            <div style="display:flex; gap:2.5rem; align-items:flex-start; justify-content:center; flex-wrap:wrap; margin-bottom:1.5rem;">
              <div style="text-align:center; max-width:240px;">
                <div style="width:140px; height:180px; border:2px dashed #0B2545; border-radius:10px; margin:0 auto 1.25rem; overflow:hidden; background:#F1F5F9; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(11,37,69,0.08);">
                  ${hasPhoto ? `
                    <img src="${state.profile.photoDataUrl}" style="width:100%; height:100%; object-fit:cover;">
                  ` : `
                    <div style="color:#64748B;">
                      <div style="font-size:2.8rem;">📸</div>
                      <div style="font-size:0.8rem; font-weight:700; margin-top:4px;">사진 미촬영</div>
                    </div>
                  `}
                </div>
                <button onclick="window.openWebcamBooth()" class="academic-btn btn-primary" style="width:100%; padding:0.85rem; font-weight:700; border:2px solid #D97706; font-size:1rem;">
                  ${hasPhoto ? '🔄 사진 다시 찍기' : '📸 3초 타이머 찰칵!'}
                </button>
              </div>

              <div style="transform: scale(0.85); transform-origin: top center;">
                <div id="wizard-photocard-preview"></div>
              </div>
            </div>

            <div style="text-align:center; padding-top:1.25rem; border-top:1px solid #E2E8F0;">
              <button onclick="window.print()" class="stream-action-btn" style="background:#0B2545; border:2px solid #D97706; padding:1rem 2.5rem; font-size:1.1rem;">
                🖨️ 최종 아카데믹 네컷 카드 즉석 인쇄하기
              </button>
            </div>
          </div>
        </div>
      `;
    }

    html += `</div>`;
    this.container.innerHTML = html;
  }
}

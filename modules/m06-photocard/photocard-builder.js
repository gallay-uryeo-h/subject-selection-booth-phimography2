/**
 * modules/m06-photocard/photocard-builder.js
 * 
 * 아카데믹 네컷 카드 & 웹캠 포토부스 통합 템플릿 빌더
 * 4x6 인치 규격, 세로형 4프레임 인포그래픽 학술 포트폴리오 카드
 */

export class PhotocardBuilder {
  /**
   * 4프레임 아카데믹 네컷 카드 HTML 마크업 생성
   */
  generateCardMarkup(state) {
    const { profile, curriculum, matchedTextbook, academicAdvice } = state;
    const hasPhoto = !!profile.photoDataUrl;

    return `
      <div id="academic-photocard" class="photocard-container" style="
        width: 450px;
        background: #FFFFFF;
        border: 2px solid #0B2545;
        padding: 22px;
        font-family: var(--font-sans);
        color: #0F172A;
        box-shadow: 0 12px 28px rgba(11, 37, 69, 0.15);
        position: relative;
      ">
        <!-- Top Watermark / Brand -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0B2545; padding-bottom: 10px; margin-bottom: 12px;">
          <div>
            <span style="font-family: var(--font-serif); font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; color: #D97706; font-weight: 700;">
              UIRYEONG GIRLS' HIGH SCHOOL
            </span>
            <h2 style="font-family: var(--font-serif); font-size: 1.3rem; color: #0B2545; margin-top: 1px; font-weight: 700;">
              나의 영어과목 3개년 로드맵
            </h2>
          </div>
          <div style="text-align: right; font-size: 0.78rem; color: #64748B;">
            <div>1학년 ${profile.name || '학생'}</div>
            <div style="font-weight: 700; color: #0B2545;">${profile.careerCategory || '진로 설계'}</div>
          </div>
        </div>

        <!-- Frame 1: Webcam Photo & Student Profile -->
        <div style="border-bottom: 1px dashed #CBD5E1; padding-bottom: 12px; margin-bottom: 12px;">
          <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B; margin-bottom: 6px; font-weight: 700;">
            ■ FRAME 01. STUDENT PROFILE & PHOTOBOOTH
          </div>
          
          <div style="display: flex; gap: 12px; align-items: center;">
            <!-- Actual Photo from Webcam -->
            <div style="
              width: 95px;
              height: 110px;
              border: 1.5px solid #0B2545;
              border-radius: 4px;
              overflow: hidden;
              background: #F1F5F9;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
              position: relative;
              box-shadow: 0 2px 5px rgba(0,0,0,0.06);
            ">
              ${hasPhoto ? `
                <img src="${profile.photoDataUrl}" alt="학생 사진" style="width: 100%; height: 100%; object-fit: cover;">
                <div style="position: absolute; bottom: 2px; right: 2px; background: rgba(11,37,69,0.85); color: #FFF; font-size: 0.5rem; padding: 1px 4px; border-radius: 2px;">
                  PHOTO
                </div>
              ` : `
                <div style="text-align: center; padding: 6px; color: #64748B;">
                  <div style="font-size: 1.75rem; margin-bottom: 2px;">🎓</div>
                  <div style="font-size: 0.6rem; font-weight: 600; line-height: 1.2;">네컷사진<br>미촬영</div>
                </div>
              `}
            </div>

            <!-- Profile Details -->
            <div style="flex: 1; font-size: 0.8rem; display: flex; flex-direction: column; gap: 4px;">
              <div style="background: #F8FAFC; padding: 5px 8px; border-left: 3px solid #0B2545; border-radius: 0 3px 3px 0;">
                <span style="font-size: 0.7rem; color: #64748B; display: block;">목표 진로</span>
                <strong style="color: #0B2545; font-size: 0.85rem;">${profile.targetCareer || '진로 탐색 중'}</strong>
              </div>
              <div style="font-size: 0.725rem; color: #475569; line-height: 1.4;">
                의령여고 2022 개정 영어과 교육과정 맞춤형 학업 포트폴리오 인증 카드
              </div>
            </div>
          </div>
        </div>

        <!-- Frame 2: 3-Year Curriculum Matrix -->
        <div style="border-bottom: 1px dashed #CBD5E1; padding-bottom: 12px; margin-bottom: 12px;">
          <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B; margin-bottom: 6px; font-weight: 700;">
            ■ FRAME 02. 3-YEAR ENGLISH CURRICULUM
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; font-size: 0.725rem;">
            <div style="background: #F1F5F9; padding: 6px; border-radius: 4px;">
              <div style="font-weight: 700; color: #0B2545; margin-bottom: 2px;">1학년 (기초필수)</div>
              <div>• ${curriculum.year1.join('<br>• ')}</div>
            </div>
            <div style="background: #EEF4FB; padding: 6px; border-radius: 4px;">
              <div style="font-weight: 700; color: #0369A1; margin-bottom: 2px;">2학년 (일반선택)</div>
              <div>• ${curriculum.year2.join('<br>• ')}</div>
            </div>
            <div style="background: #FEF3C7; padding: 6px; border-radius: 4px;">
              <div style="font-weight: 700; color: #B45309; margin-bottom: 2px;">3학년 (진로·융합)</div>
              <div>• ${[...curriculum.year3Career, ...curriculum.year3Fusion].join('<br>• ') || '미선택'}</div>
            </div>
          </div>
        </div>

        <!-- Frame 3: Textbook Evidence & Highlight -->
        <div style="border-bottom: 1px dashed #CBD5E1; padding-bottom: 12px; margin-bottom: 12px;">
          <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B; margin-bottom: 4px; font-weight: 700;">
            ■ FRAME 03. TEXTBOOK EVIDENCE & PASSAGE
          </div>
          <div style="font-size: 0.72rem; color: #0369A1; font-weight: 600; margin-bottom: 2px;">
            [${(matchedTextbook.textbookName || matchedTextbook.textbook || '교과서').split(' ')[0]} p.${matchedTextbook.pageNumber || matchedTextbook.page}] ${matchedTextbook.unitTitle || matchedTextbook.unit}
          </div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 8px 10px; font-size: 0.75rem; line-height: 1.45; font-style: italic;">
            "<span style="background-color: rgba(253, 224, 71, 0.55); padding: 1px 3px;">${matchedTextbook.snippetText || matchedTextbook.raw_text}</span>"
          </div>
        </div>

        <!-- Frame 4: Academic Exploration & QR -->
        <div style="display: flex; gap: 10px; align-items: center;">
          <div style="flex: 1;">
            <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B; margin-bottom: 3px; font-weight: 700;">
              ■ FRAME 04. RESEARCH TOPIC (세특 가이드 1선)
            </div>
            <div style="font-size: 0.75rem; color: #0F172A; line-height: 1.4; border-left: 2px solid #D97706; padding-left: 6px;">
              ${academicAdvice.seTeukGuideline}
            </div>
          </div>
          <div style="width: 66px; height: 66px; border: 1px solid #CBD5E1; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #F8FAFC; border-radius: 4px; text-align: center; flex-shrink: 0;">
            <span style="font-size: 1.25rem;">📲</span>
            <span style="font-size: 0.5rem; color: #64748B; margin-top: 2px;">웹 로드맵 QR</span>
          </div>
        </div>
      </div>
    `;
  }
}

export const photocardBuilder = new PhotocardBuilder();

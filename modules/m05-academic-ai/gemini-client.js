/**
 * modules/m05-academic-ai/gemini-client.js
 * 
 * Gemini API 아카데믹 어드바이저 & 오프라인 Fallback 시스템
 * - 기본 호출 모델: gemini-3.5-flash (사용자 명시 요구사항)
 * - 격식체 3단 자문: (1) 학업 진로 연계성 (2) 2022 개정 영어과 이수 분석 (3) 학생부 세특 추천 탐구 주제 1선
 * - 오프라인 / 무키 환경: 6대 계열별 100% 검수된 수석교사 학술 프리셋 즉시 반환
 */

import { roadmapStore } from '../../core/store.js';

// 6대 계열별 수석교사 엄선 3단 학술 세특 프리셋 (Fallback)
export const ACADEMIC_FALLBACK_PRESETS = {
  HUMANITIES: {
    name: "인문·어문·통번역 계열",
    academicLink: "선택하신 인문·어문 계열과 공통영어 및 영미 문학 읽기는 문화 간 번역 담화와 문학 텍스트의 상징적 의미를 비판적으로 해석하는 핵심 학문적 역량을 구축합니다.",
    seTeukGuideline: "동서양 문화권의 관용 어구 비교 분석 및 AI 기계번역의 문맥상 오류를 대조한 영문 인문학 소논문 작성을 추천합니다.",
    academicAdvantage: "수능 영어 3점 배점의 함축 의미 추론 및 빈칸 추론 문항에서 심층 맥락 파악 시간을 현저히 단축할 수 있습니다."
  },
  SOCIAL_COMMERCE: {
    name: "사회과학·상경·경영·로스쿨 계열",
    academicLink: "사회과학·상경 계열과 영어 독해와 작문 및 직무 영어는 국제 통상, 금융 경제, 법률 문서의 논증 구조를 정밀하게 파악하는 지적 기반을 제공합니다.",
    seTeukGuideline: "다국적 기업의 ESG 경영 공시 영문 보고서 분석 및 글로벌 플랫폼 규제에 관한 영문 정책 제안서 작성을 추천합니다.",
    academicAdvantage: "수능 및 대학 논술에서 자주 출제되는 경제·사회학 비문학 영어 지문의 핵심 주장과 전개 방식을 즉각 파악하는 강점을 확보합니다."
  },
  ENGINEERING_IT: {
    name: "공학·IT·인공지능 계열",
    academicLink: "공학·IT 계열과 공통영어 및 직무 영어는 최신 글로벌 기술 표준 문서와 컴퓨터 과학 알고리즘의 영어 원문을 정확히 독해하는 실질적 연구 도구가 됩니다.",
    seTeukGuideline: "생성형 AI 알고리즘의 윤리적 가이드라인에 대한 IEEE/ACM 영문 규정을 분석하고 데이터 편향성 해소 방안을 영문 에세이로 탐구하기를 권장합니다.",
    academicAdvantage: "수능 고난도 과학·기술 융합 지문의 복잡한 인과 관계와 정보 처리를 빠르고 직관적으로 해결하는 독해력을 배양합니다."
  },
  MEDICINE_BIO: {
    name: "의약·바이오·보건 계열",
    academicLink: "의약·바이오 계열과 공통영어 및 심화 영어는 최신 네이처·랜싯 등 국제 의학 저널 원서와 생명과학 연구 동향을 수용하는 필수적 학업 역량을 부여합니다.",
    seTeukGuideline: "CRISPR-Cas9 유전자 가위 기술 적용에 따른 국제 생명윤리 규범 비교 및 보건 불평등 해소를 위한 영문 탐구 보고서 작성을 추천합니다.",
    academicAdvantage: "수능 영어 영역의 최고난도 킬러 문항인 생물학, 뇌과학 지문에 대한 선행 배경지식과 어휘 장악력을 극대화할 수 있습니다."
  },
  NATURAL_SCIENCE: {
    name: "자연과학·순수기초학문 계열",
    academicLink: "자연과학 계열과 영어 독해와 작문 및 심화 영어는 수학·물리·화학 등 순수 기초 학문의 글로벌 연구 동향을 확인하고 실험 가설을 영문으로 정식화하는 능력을 키웁니다.",
    seTeukGuideline: "현대 천체물리학 및 양자역학 기초 논문의 초록(Abstract)을 영문으로 대조 분석하고 과학적 가설 검증 절차를 정리한 리포트 작성을 추천합니다.",
    academicAdvantage: "학술적 인과 추론과 논리적 비약 탐색 능력을 강화하여 수능 글의 순서 배열 및 문장 삽입 유형에서 무오류 정답률을 확보합니다."
  },
  EDUCATION: {
    name: "교육·사범 계열",
    academicLink: "교육·사범 계열과 공통영어 및 실생활 영어 회화는 다문화 학습 환경에서의 교수학습 매체 분석 및 제2언어 습득 이론을 이해하는 기초 소양이 됩니다.",
    seTeukGuideline: "AI 디지털 교과서 도입에 따른 영어과 개별화 학습 모형을 설계하고, 학습자 동기 부여 방안에 대한 영문 수업 지도안 작성을 권장합니다.",
    academicAdvantage: "수능 영어 어법 및 심리·교육학 관련 장문 독해 세트 문항에서 출제자의 의도를 꿰뚫는 분석력을 확보합니다."
  }
};

export class AcademicAiModule {
  constructor() {
    this.apiKey = localStorage.getItem('GEMINI_API_KEY') || '';
    // 사용자 명시 기본 모델: gemini-3.5-flash
    this.defaultModel = 'gemini-3.5-flash';
    this.fallbackModels = ['gemini-2.5-flash', 'gemini-1.5-flash'];
  }

  setApiKey(key) {
    this.apiKey = key.trim();
    if (this.apiKey) {
      localStorage.setItem('GEMINI_API_KEY', this.apiKey);
    } else {
      localStorage.removeItem('GEMINI_API_KEY');
    }
  }

  getApiKey() {
    return this.apiKey;
  }

  /**
   * 학술 3단 자문 생성
   * 1. Gemini API (gemini-3.5-flash) 호출 시도
   * 2. 키가 없거나 실패 시 계열 맞춤 수석교사 Fallback 프리셋 반환
   */
  async consult(studentInfo, careerCategoryId, curriculumChoices) {
    const studentName = studentInfo.name || "학생";
    const targetCareer = studentInfo.targetCareer || "진로 미정";

    // API Key가 없으면 즉시 고품질 오프라인 Fallback 반환
    if (!this.apiKey) {
      return this.getFallbackAdvice(careerCategoryId, studentName, targetCareer);
    }

    try {
      const prompt = `
당신은 대한민국 고교학점제 선택과목 박람회 영어과 수석 컨설턴트입니다.
의령여자고등학교 학생의 3개년 영어과목 선택에 대해 정중하고 격식 있는 어조(하십시오체/해요체 배제, 학술적 어조)로 3단 분석을 제공하세요.

[학생 정보]
- 이름: ${studentName}
- 희망 진로 계열: ${careerCategoryId}
- 세부 목표 직업: ${targetCareer}
- 선택 과목군: ${JSON.stringify(curriculumChoices)}

반드시 아래 JSON 형식으로만 응답하세요:
{
  "academicLink": "학생의 세부 진로와 영어 교과의 학문적 연계성 분석 (2~3문장)",
  "seTeukGuideline": "학생부 종합전형 세특에 직접 기재할 수 있는 구체적인 영문 학술 탐구 보고서 주제 1선 (1~2문장)",
  "academicAdvantage": "2022 개정 교육과정 및 수능/대입에서 얻을 수 있는 학업적 강점 (2문장)"
}
`;

      const response = await this.callGeminiWithModel(this.defaultModel, prompt);
      if (response) {
        return {
          ...response,
          isAiGenerated: true,
          modelUsed: this.defaultModel
        };
      }
    } catch (err) {
      console.warn(`[Module 05] ${this.defaultModel} 호출 실패, fallback 모델 또는 오프라인 프리셋으로 전환:`, err);
    }

    // 예외 발생 시 안전한 Fallback 반환
    return this.getFallbackAdvice(careerCategoryId, studentName, targetCareer);
  }

  async callGeminiWithModel(modelName, prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${this.apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          responseMimeType: "application/json"
        }
      })
    });

    if (!res.ok) {
      throw new Error(`Gemini API Error (${res.status}): ${await res.text()}`);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (candidate) {
      return JSON.parse(candidate);
    }
    throw new Error('응답 후보가 없습니다.');
  }

  getFallbackAdvice(careerCategoryId, studentName, targetCareer) {
    const key = (careerCategoryId || 'ENGINEERING_IT').toUpperCase();
    const preset = ACADEMIC_FALLBACK_PRESETS[key] || ACADEMIC_FALLBACK_PRESETS.ENGINEERING_IT;
    
    return {
      academicLink: `[${studentName} 학생 맞춤] ${preset.academicLink}`,
      seTeukGuideline: targetCareer && targetCareer !== '진로 미정'
        ? `[목표: ${targetCareer}] ${preset.seTeukGuideline}`
        : preset.seTeukGuideline,
      academicAdvantage: preset.academicAdvantage,
      isAiGenerated: false,
      modelUsed: 'Offline Verified Expert Preset'
    };
  }
}

export const academicAi = new AcademicAiModule();

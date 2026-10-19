/**
 * modules/m05-academic-ai/gemini-client.js
 * 
 * Gemini 1.5 Flash 아카데믹 어드바이저 & 오프라인 Fallback 시스템
 */

import { roadmapStore } from '../../core/store.js';

// 6대 계열별 엄선된 3단 학술 세특 프리셋 (Fallback)
const ACADEMIC_FALLBACK_PRESETS = {
  HUMANITIES: {
    academicLink: "선택하신 인문·어문 계열과 공통영어 및 영미 문학 읽기는 문화 간 번역 담화와 문학 텍스트의 상징적 의미를 비판적으로 해석하는 핵심 학문적 역량을 구축합니다.",
    seTeukGuideline: "동서양 문화권의 관용 어구 비교 분석 및 AI 기계번역의 문맥상 오류를 대조한 영문 인문학 소논문 작성을 추천합니다.",
    academicAdvantage: "수능 영어 3점 배점의 함축 의미 추론 및 빈칸 추론 문항에서 심층 맥락 파악 시간을 현저히 단축할 수 있습니다."
  },
  SOCIAL_COMMERCE: {
    academicLink: "사회과학·상경 계열과 영어 독해와 작문 및 직무 영어는 국제 통상, 금융 경제, 법률 문서의 논증 구조를 정밀하게 파악하는 지적 기반을 제공합니다.",
    seTeukGuideline: "다국적 기업의 ESG 경영 공시 영문 보고서 분석 및 글로벌 플랫폼 규제에 관한 영문 정책 제안서 작성을 추천합니다.",
    academicAdvantage: "수능 및 대학 논술에서 자주 출제되는 경제·사회학 비문학 영어 지문의 핵심 주장과 전개 방식을 즉각 파악하는 강점을 확보합니다."
  },
  ENGINEERING_IT: {
    academicLink: "공학·IT 계열과 공통영어 및 직무 영어는 최신 글로벌 기술 표준 문서와 컴퓨터 과학 알고리즘의 영어 원문을 정확히 독해하는 실질적 연구 도구가 됩니다.",
    seTeukGuideline: "생성형 AI 알고리즘의 윤리적 가이드라인에 대한 IEEE/ACM 영문 규정을 분석하고 데이터 편향성 해소 방안을 영문 에세이로 탐구하기를 권장합니다.",
    academicAdvantage: "수능 고난도 과학·기술 융합 지문의 복잡한 인과 관계와 정보 처리를 빠르고 직관적으로 해결하는 독해력을 배양합니다."
  },
  MEDICINE_BIO: {
    academicLink: "의약·바이오 계열과 공통영어 및 심화 영어는 최신 네이처·랜싯 등 국제 의학 저널 원서와 생명과학 연구 동향을 수용하는 필수적 학업 역량을 부여합니다.",
    seTeukGuideline: "CRISPR-Cas9 유전자 가위 기술 적용에 따른 국제 생명윤리 규범 비교 및 보건 불평등 해소를 위한 영문 탐구 보고서 작성을 추천합니다.",
    academicAdvantage: "수능 영어 영역의 최고난도 킬러 문항인 생물학, 뇌과학 지문에 대한 선행 배경지식과 어휘 장악력을 극대화할 수 있습니다."
  },
  NATURAL_SCIENCE: {
    academicLink: "자연과학 계열과 영어 독해와 작문 및 심화 영어는 수학·물리·화학 등 순수 기초 학문의 글로벌 연구 동향을 확인하고 실험 가설을 영문으로 정식화하는 능력을 키웁니다.",
    seTeukGuideline: "현대 천체물리학 및 양자역학 기초 논문의 초록(Abstract)을 영문으로 대조 분석하고 과학적 가설 검증 절차를 정리한 리포트 작성을 추천합니다.",
    academicAdvantage: "학술적 인과 추론과 논리적 비약 탐색 능력을 강화하여 수능 글의 순서 배열 및 문장 삽입 유형에서 무오류 정답률을 확보합니다."
  },
  EDUCATION: {
    academicLink: "교육·사범 계열과 공통영어 및 실생활 영어 회화는 다문화 학습 환경에서의 교수학습 매체 분석 및 제2언어 습득 이론을 이해하는 기초 소양이 됩니다.",
    seTeukGuideline: "AI 디지털 교과서 도입에 따른 영어과 개별화 학습 모형을 설계하고, 학습자 동기 부여 방안에 대한 영문 수업 지도안 작성을 권장합니다.",
    academicAdvantage: "수능 영어 어법 및 심리·교육학 관련 장문 독해 세트 문항에서 출제자의 의도를 꿰뚫는 분석력을 확보합니다."
  }
};

export class AcademicAiModule {
  constructor() {
    this.apiKey = null; // 필요시 설정 가능
  }

  /**
   * 학술 3단 자문 생성 (온라인 API 시도 후 실패 시 즉시 Fallback 작동)
   */
  async consult(careerCategoryId, studentTargetCareer = "") {
    // 1. 오프라인 프리셋 우선 조회
    const preset = ACADEMIC_FALLBACK_PRESETS[careerCategoryId] || ACADEMIC_FALLBACK_PRESETS.ENGINEERING_IT;

    // 온라인 API 연결 로직 (Step 4에서 확장 가능)
    const result = {
      academicLink: preset.academicLink,
      seTeukGuideline: studentTargetCareer 
        ? `[목표: ${studentTargetCareer}] ${preset.seTeukGuideline}`
        : preset.seTeukGuideline,
      academicAdvantage: preset.academicAdvantage,
      isAiGenerated: false
    };

    roadmapStore.setAcademicAdvice(result);
    return result;
  }
}

export const academicAiModule = new AcademicAiModule();

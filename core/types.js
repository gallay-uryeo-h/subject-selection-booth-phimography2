/**
 * core/types.js
 * 
 * 「나의 영어과목 3개년 로드맵 빌더」
 * 의령여자고등학교 선택과목 박람회 영어과 부스
 * 
 * 모든 모듈이 공유하는 단일 데이터 규약, 상수 및 이벤트 정의
 */

// 1. 2022 개정 교육과정 6대 핵심 진로 계열
export const CAREER_CATEGORIES = Object.freeze([
  {
    id: "HUMANITIES",
    name: "인문·어문·통번역 계열",
    description: "어문학, 문화인류학, 국제지역학, 통번역, 철학 등 언어와 인문학적 소양 중심",
    recommendedSubjects: ["영어Ⅰ", "영어 독해와 작문", "영미 문학 읽기", "세계 문화와 영어", "심화 영어"]
  },
  {
    id: "SOCIAL_COMMERCE",
    name: "사회과학·상경·경영·로스쿨 계열",
    description: "경제, 경영, 정치외교, 행정, 미디어, 법학 등 글로벌 시사 및 논증 중심",
    recommendedSubjects: ["영어Ⅰ", "영어 독해와 작문", "직무 영어", "미디어 영어", "심화 영어"]
  },
  {
    id: "NATURAL_SCIENCE",
    name: "자연과학·순수기초학문 계열",
    description: "수학, 물리학, 화학, 생명과학, 지구과학 등 원서 독해 및 기초 연구 중심",
    recommendedSubjects: ["영어Ⅰ", "영어 독해와 작문", "심화 영어", "직무 영어"]
  },
  {
    id: "ENGINEERING_IT",
    name: "공학·IT·인공지능 계열",
    description: "컴퓨터공학, 전자·기계, 소프트웨어, 인공지능 등 기술 문서 및 글로벌 협업 중심",
    recommendedSubjects: ["영어Ⅰ", "영어 독해와 작문", "직무 영어", "실생활 영어 회화"]
  },
  {
    id: "MEDICINE_BIO",
    name: "의약·바이오·보건 계열",
    description: "의예, 약학, 간호, 생명공학, 보건의료 등 바이오 윤리 및 최신 의과학 논문 중심",
    recommendedSubjects: ["영어Ⅰ", "영어 독해와 작문", "심화 영어", "영미 문학 읽기"]
  },
  {
    id: "EDUCATION",
    name: "교육·사범 계열",
    description: "영어교육, 초등교육, 사범대학 등 교수학습 방법론 및 글로벌 교육 다문화 중심",
    recommendedSubjects: ["영어Ⅰ", "영어 독해와 작문", "실생활 영어 회화", "세계 문화와 영어", "영미 문학 읽기"]
  }
]);

// 2. 2022 개정 영어과 고교 과목 메타데이터
export const SUBJECT_DEFINITIONS = Object.freeze({
  // 1학년 필수 고정
  COMMON_ENG_1: {
    id: "COMMON_ENG_1",
    name: "공통영어1",
    grade: 1,
    type: "COMMON",
    flags: ["1학년 1학기 필수", "기초 학력 형성"],
    desc: "고교 영어의 기초 문해력 및 다양한 주제 통합 학습"
  },
  COMMON_ENG_2: {
    id: "COMMON_ENG_2",
    name: "공통영어2",
    grade: 1,
    type: "COMMON",
    flags: ["1학년 2학기 필수", "심화 문해력 확장"],
    desc: "비판적 사고력과 학업적 영어 의사소통 역량 심화"
  },

  // 2학년 일반선택 추천
  ENG_1: {
    id: "ENG_1",
    name: "영어Ⅰ",
    grade: 2,
    type: "GENERAL_SELECT",
    flags: ["수능 출제범위", "전 계열 권장", "학종 필수 이수"],
    desc: "대학수학능력시험 핵심 연계 과목이자 학술적 텍스트 독해 기초"
  },
  ENG_READ_WRITE: {
    id: "ENG_READ_WRITE",
    name: "영어 독해와 작문",
    grade: 2,
    type: "GENERAL_SELECT",
    flags: ["수능 출제범위", "학종 전공적합성 핵심"],
    desc: "학술 에세이 작성 및 심층 텍스트 비판적 분석 역량 배양"
  },

  // 3학년 진로선택 과목군
  ENG_LIT: {
    id: "ENG_LIT",
    name: "영미 문학 읽기",
    grade: 3,
    type: "CAREER_SELECT",
    flags: ["진로선택", "인문/사범/의약 추천"],
    desc: "영미 문학 작품 강독을 통한 인문학적 통찰 및 비판적 해석"
  },
  ADVANCED_ENG: {
    id: "ADVANCED_ENG",
    name: "심화 영어",
    grade: 3,
    type: "CAREER_SELECT",
    flags: ["진로선택", "학종 상위권 필수", "자연/의약/상경 추천"],
    desc: "대학 전공 기초 수준의 학술 담화 및 전문 연구 텍스트 분석"
  },
  VOCATIONAL_ENG: {
    id: "VOCATIONAL_ENG",
    name: "직무 영어",
    grade: 3,
    type: "CAREER_SELECT",
    flags: ["진로선택", "공학/IT/비즈니스 실무"],
    desc: "전문 분야 비즈니스 커뮤니케이션 및 기술 문서 독해"
  },

  // 3학년 융합선택 과목군
  PRACTICAL_CONV: {
    id: "PRACTICAL_CONV",
    name: "실생활 영어 회화",
    grade: 3,
    type: "FUSION_SELECT",
    flags: ["융합선택", "실용 소통 역량", "교육/IT 추천"],
    desc: "실제적 상황에서의 유창한 구어 의사소통 및 토론 역량 강화"
  },
  MEDIA_ENG: {
    id: "MEDIA_ENG",
    name: "미디어 영어",
    grade: 3,
    type: "FUSION_SELECT",
    flags: ["융합선택", "미디어/사회/마케팅 추천"],
    desc: "뉴스, 다큐멘터리, 팟캐스트 등 현대 미디어 매체 비판적 분석"
  },
  WORLD_CULTURE_ENG: {
    id: "WORLD_CULTURE_ENG",
    name: "세계 문화와 영어",
    grade: 3,
    type: "FUSION_SELECT",
    flags: ["융합선택", "글로벌 역량", "인문/국제/사회 추천"],
    desc: "영미권 및 비영미권 세계 문화 다양성 이해와 글로벌 시민 의식"
  }
});

// 3. 모듈 간 비동기 이벤트 명세
export const EVENTS = Object.freeze({
  // 상태 변경 이벤트
  STATE_CHANGED: "state:changed",
  RESET_REQUESTED: "state:reset",

  // 프로필 관련 이벤트
  CAREER_SELECTED: "profile:career_selected",
  STUDENT_INFO_UPDATED: "profile:student_info_updated",

  // 과목 선택 관련 이벤트
  CURRICULUM_UPDATED: "curriculum:updated",

  // 교과서 & RAG 관련 이벤트
  TEXTBOOK_MATCHED: "textbook:matched",
  PDF_VIEWER_OPEN_REQUESTED: "pdf:open_requested",

  // AI 어드바이저 이벤트
  AI_ADVICE_REQUESTED: "ai:advice_requested",
  AI_ADVICE_RECEIVED: "ai:advice_received",
  AI_ADVICE_FALLBACK: "ai:advice_fallback",

  // 네컷 카드 이벤트
  CARD_GENERATE_REQUESTED: "card:generate_requested",
  CARD_GENERATED: "card:generated",

  // 키오스크 세션 이벤트
  SESSION_IDLE_WARNING: "session:idle_warning",
  SESSION_TIMEOUT_RESET: "session:timeout_reset",
  ANALYTICS_LOG_EVENT: "analytics:log_event"
});

// 4. 초기 상태 데이터 규격
export const INITIAL_STATE = Object.freeze({
  profile: {
    schoolName: "의령여자고등학교",
    boothTitle: "영어과 선택과목 박람회",
    grade: 1,
    classNum: 1,
    studentNum: 1,
    name: "",
    targetCareer: "",
    careerCategory: "ENGINEERING_IT", // 기본값
    photoDataUrl: null
  },
  curriculum: {
    year1: ["공통영어1", "공통영어2"],
    year2: ["영어Ⅰ", "영어 독해와 작문"],
    year3Career: ["직무 영어"],
    year3Fusion: ["실생활 영어 회화"]
  },
  matchedTextbook: {
    chunkId: "SAMPLE_01",
    textbookName: "공통영어1",
    unitTitle: "Unit 3. The Power of Science",
    pageNumber: 42,
    topicEn: "Artificial Intelligence & Ethical Decision Making",
    careerCategory: "공학·IT·인공지능 계열",
    snippetText: "Advances in Artificial Intelligence have brought unprecedented changes to modern society, raising critical ethical questions about algorithmic transparency and human accountability.",
    highlightCoords: [
      { x: 120, y: 340, width: 450, height: 22 }
    ],
    pdfFile: "22개정 교과서 공통영어1 미래엔 김선영.pdf"
  },
  academicAdvice: {
    academicLink: "선택하신 진로와 공통영어1 및 직무 영어는 최신 기술 담화 및 알고리즘 윤리를 영문으로 독해·비판하는 핵심 학문적 토대가 됩니다.",
    seTeukGuideline: "인공지능 윤리 가이드라인에 대한 영문 학술 리포트를 작성하고, 데이터 편향성 해소 방안을 영어 에세이로 탐구하는 활동을 추천합니다.",
    academicAdvantage: "수능 독해 고난도 3점 문항(빈칸/순서)의 기술·철학 복합 지문에 대한 독해 속도와 이해도를 획기적으로 향상시킬 수 있습니다.",
    isAiGenerated: false
  },
  cardExport: {
    isGenerating: false,
    cardDataUrl: null,
    qrUrl: null,
    generatedAt: null
  }
});

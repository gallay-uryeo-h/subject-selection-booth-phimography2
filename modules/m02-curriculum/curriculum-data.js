/**
 * modules/m02-curriculum/curriculum-data.js
 * 
 * 2022 개정 교육과정 고교 영어과 공식 과목 편제 및 상세 메타데이터
 * 의령여자고등학교 선택과목 박람회 기준
 */

export const CURRICULUM_METADATA = Object.freeze({
  // 1학년 공통과목 (필수 이수)
  COMMON_ENG_1: {
    id: "COMMON_ENG_1",
    name: "공통영어1",
    grade: 1,
    semester: "1학기",
    type: "공통",
    credits: 4,
    flags: ["1학년 필수", "기초 문해력", "내신 5등급제"],
    summary: "중학교 영어 학습 성과를 바탕으로 실생활 및 다양한 학문 분야의 기초 영문 텍스트를 통합적으로 이해하고 표현하는 필수 과목",
    coreCompetencies: ["영어 의사소통 역량", "자기관리 역량", "지식정보처리 역량"],
    keyTopics: ["현대 사회와 기술의 발전", "문화 다양성과 포용", "환경 생태와 지속가능성"],
    suneungRelevance: "고교 3개년 영어 학업 성취의 절대적 기초, 기본 어휘 및 구문력 형성",
    careerFit: ["전 계열 공통 필수"]
  },
  COMMON_ENG_2: {
    id: "COMMON_ENG_2",
    name: "공통영어2",
    grade: 1,
    semester: "2학기",
    type: "공통",
    credits: 4,
    flags: ["1학년 필수", "비판적 문해력", "내신 5등급제"],
    summary: "공통영어1을 심화하여 복합적 주제의 학술·사회 담화를 비판적으로 읽고 논리적인 영문 의견을 산출하는 필수 과목",
    coreCompetencies: ["비판적·창의적 사고 역량", "공동체 역량", "글로벌 시민 역량"],
    keyTopics: ["윤리적 딜레마와 사회적 책임", "글로벌 미디어와 진실 탐색", "학문적 탐구와 인류 미래"],
    suneungRelevance: "수능 영어 3점 배점 고난도 빈칸추론 및 글의 순서 유형의 논리 전개 기초",
    careerFit: ["전 계열 공통 필수"]
  },

  // 2학년 일반선택 과목 (수능 직접 연계 및 학종 기초)
  ENG_1: {
    id: "ENG_1",
    name: "영어Ⅰ",
    grade: 2,
    semester: "1학기",
    type: "일반선택",
    credits: 4,
    flags: ["수능 출제범위", "전 계열 권장", "학종 필수 이수"],
    summary: "인문, 사회, 자연, 예술 등 다양한 학문 분야의 글을 심층 독해하고 학술 토론과 논리적 작문을 연계 학습하는 일반선택 핵심 과목",
    coreCompetencies: ["학문적 독해력", "논리적 서술 역량", "글로벌 학술 탐구력"],
    keyTopics: ["인류 문명의 진화와 과학 기술", "사회적 불평등과 공공 정책", "심리학과 인간 행동 메커니즘"],
    suneungRelevance: "대학수학능력시험 영어 영역의 직접 출제 연계 과목, 킬러 독해 문항 대비 핵심",
    careerFit: ["인문·어문", "사회과학·상경", "자연과학", "공학·IT", "의약·바이오", "교육·사범"]
  },
  ENG_READ_WRITE: {
    id: "ENG_READ_WRITE",
    name: "영어 독해와 작문",
    grade: 2,
    semester: "2학기",
    type: "일반선택",
    credits: 4,
    flags: ["수능 출제범위", "학종 전공적합성 핵심", "탐구보고서 연계"],
    summary: "학술 에세이, 연구 리포트, 시사 비평문을 비판적으로 독해하고, 자신의 진로 탐구와 연계된 논증형 영문 텍스트를 구조화하여 작문하는 과목",
    coreCompetencies: ["비판적 텍스트 분석력", "학술적 영작문 역량", "탐구 보고서 작성 역량"],
    keyTopics: ["학술 논문 초록(Abstract) 분석", "논증적 에세이 작성법", "통계 자료 및 도표 영어 분석"],
    suneungRelevance: "수능 장문 독해, 요약문 완성, 도표 및 실용문 복합 유형 정답률 직결",
    careerFit: ["인문·어문", "사회과학·상경", "자연과학", "공학·IT", "의약·바이오", "교육·사범"]
  },

  // 3학년 진로선택 과목 (성취도 3단계 A-B-C 평가, 학종 전공 심화)
  ENG_LIT: {
    id: "ENG_LIT",
    name: "영미 문학 읽기",
    grade: 3,
    semester: "1~2학기",
    type: "진로선택",
    credits: 4,
    flags: ["진로선택", "학종 인문/교대 핵심", "성취평가(A-B-C)"],
    summary: "영미권의 대표적 시, 소설, 희곡, 수필 등 문학 원작을 강독하며 문학적 상징, 시대적 배경, 인간 존엄성의 가치를 인문학적으로 고찰하는 과목",
    coreCompetencies: ["문학적 감수성", "비판적 텍스트 해석력", "인문학적 통찰 역량"],
    keyTopics: ["고전 영미 단편소설 강독", "현대 영미 희곡과 사회 비판", "문학 작품 속 문화적 정체성 탐구"],
    suneungRelevance: "은유, 비유, 행간의 의미를 파악하는 고난도 함축 의미 추론 문항 완벽 대비",
    careerFit: ["인문·어문·통번역 계열", "교육·사범 계열", "의약·바이오·보건 계열 (생명존중 가치 연계)"]
  },
  ADVANCED_ENG: {
    id: "ADVANCED_ENG",
    name: "심화 영어",
    grade: 3,
    semester: "1~2학기",
    type: "진로선택",
    credits: 4,
    flags: ["진로선택", "학종 상위권 필수", "자연/의약/상경 특화"],
    summary: "대학 전공 기초 수준의 전문 학술 담화와 학술 논문, 전문 서적 원서를 독해하고 학술 발표 및 세미나형 토론을 수행하는 최상위 심화 과목",
    coreCompetencies: ["고급 학술 담화 분석력", "전문 영역 영어 소통력", "전공 학술 탐구력"],
    keyTopics: ["전공 분야 최신 학술 논문 리뷰", "글로벌 콘퍼런스 발표 및 질의응답", "전문 학술 용어(Jargon) 체계화"],
    suneungRelevance: "대학 전공 원서 독해력 선행 배양 및 고난도 학술 빈칸/순서 문제 해결력 완성",
    careerFit: ["의약·바이오·보건 계열", "자연과학·순수기초학문 계열", "사회과학·상경·경영 계열"]
  },
  VOCATIONAL_ENG: {
    id: "VOCATIONAL_ENG",
    name: "직무 영어",
    grade: 3,
    semester: "1~2학기",
    type: "진로선택",
    credits: 4,
    flags: ["진로선택", "공학/IT/비즈니스 실무", "성취평가(A-B-C)"],
    summary: "경영, 경제, 정보기술(IT), 공학, 공공 행정 등 산업 현장에서 실제로 사용되는 비즈니스 커뮤니케이션, 기술 명세서 독해, 계약 문서 작성을 다루는 실무 과목",
    coreCompetencies: ["직무 전문 소통 역량", "기술 문서 분석력", "글로벌 비즈니스 협상력"],
    keyTopics: ["글로벌 비즈니스 서신 및 이메일 작성", "IT·공학 기술 표준 규격서 분석", "글로벌 프로젝트 제안서 발표"],
    suneungRelevance: "실용 텍스트의 핵심 정보 추출 및 복합 정보 구조화 능력 강화",
    careerFit: ["공학·IT·인공지능 계열", "사회과학·상경·경영·로스쿨 계열"]
  },

  // 3학년 융합선택 과목 (실생활, 다학제 융합)
  PRACTICAL_CONV: {
    id: "PRACTICAL_CONV",
    name: "실생활 영어 회화",
    grade: 3,
    semester: "1~2학기",
    type: "융합선택",
    credits: 4,
    flags: ["융합선택", "실용 말하기/듣기", "글로벌 의사소통"],
    summary: "여행, 유학, 글로벌 프로젝트, 온라인 학술 세미나 등 실제적 상황에서 원어민 및 글로벌 화자와 자연스럽게 상호작용하는 구어 소통 집중 과목",
    coreCompetencies: ["구어 유창성", "상황별 어휘 구사력", "상호문화 소통 역량"],
    keyTopics: ["돌발 상황 대처 및 즉흥 토론", "다문화 간 화법의 차이 이해", "인터뷰 및 프레젠테이션 스킬"],
    suneungRelevance: "수능 영어 듣기 평가 17문항 만점 유지 및 구어체 표현 완벽 숙지",
    careerFit: ["교육·사범 계열", "공학·IT·인공지능 계열 (글로벌 협업)", "인문·어문 계열"]
  },
  MEDIA_ENG: {
    id: "MEDIA_ENG",
    name: "미디어 영어",
    grade: 3,
    semester: "1~2학기",
    type: "융합선택",
    credits: 4,
    flags: ["융합선택", "미디어 리터러시", "시사/사회/마케팅"],
    summary: "CNN, BBC 등 글로벌 뉴스 방송, 다큐멘터리, 팟캐스트, 소셜 미디어 등 다양한 디지털 미디어 영문 콘텐츠를 비판적으로 수용하고 팩트체크하는 융합 과목",
    coreCompetencies: ["디지털 미디어 문해력", "시사 영어 분석력", "콘텐츠 재구성 역량"],
    keyTopics: ["미디어 프레이밍과 편향성 분석", "디지털 뉴스 팩트체크 기법", "글로벌 이슈 숏폼 팟캐스트 제작"],
    suneungRelevance: "최신 시사·인문 지문 및 어휘 트렌드 반영 지문에 대한 신속한 적응력 부여",
    careerFit: ["사회과학·상경·경영·로스쿨 계열", "인문·어문·통번역 계열"]
  },
  WORLD_CULTURE_ENG: {
    id: "WORLD_CULTURE_ENG",
    name: "세계 문화와 영어",
    grade: 3,
    semester: "1~2학기",
    type: "융합선택",
    credits: 4,
    flags: ["융합선택", "글로벌 시민의식", "문화다양성"],
    summary: "영미권뿐만 아니라 비영미권 세계 각국의 역사, 지리, 전통, 예술을 영어를 매개로 비교 탐구하여 글로벌 시민 의식과 문화 감수성을 함양하는 융합 과목",
    coreCompetencies: ["문화적 다원주의", "글로벌 시민성", "비교 문화 탐구력"],
    keyTopics: ["세계 영어(World Englishes)의 다양성", "식민 역사와 현대 글로벌 문화 지형", "국제기구(UN 등)의 지속가능발전목표(SDGs)"],
    suneungRelevance: "인류학, 사회문화, 지리학 연계 수능 비문학 지문의 배경 이해 증진",
    careerFit: ["인문·어문·통번역 계열", "교육·사범 계열", "사회과학·상경 계열"]
  }
});

// 6대 계열별 3개년 로드맵 정밀 권장 매핑
export const CAREER_ROADMAP_PRESETS = Object.freeze({
  HUMANITIES: {
    id: "HUMANITIES",
    name: "인문·어문·통번역 계열",
    badgeColor: "#0369A1",
    tagline: "언어의 심층 구조와 문화적 맥락을 탐구하는 인문학적 로드맵",
    year1: ["공통영어1", "공통영어2"],
    year2: ["영어Ⅰ", "영어 독해와 작문"],
    year3CareerDefault: ["영미 문학 읽기"],
    year3FusionDefault: ["세계 문화와 영어"],
    academicFocus: "원문 강독 및 문화적 등가 번역, 텍스트의 상징적 의미 분석"
  },
  SOCIAL_COMMERCE: {
    id: "SOCIAL_COMMERCE",
    name: "사회과학·상경·경영·로스쿨 계열",
    badgeColor: "#0F766E",
    tagline: "글로벌 통상, 법률, 경제 정책 및 시사 담화를 분석하는 논증형 로드맵",
    year1: ["공통영어1", "공통영어2"],
    year2: ["영어Ⅰ", "영어 독해와 작문"],
    year3CareerDefault: ["직무 영어"],
    year3FusionDefault: ["미디어 영어"],
    academicFocus: "글로벌 비즈니스 계약서, 경제 지표, 미디어 프레이밍 비판 분석"
  },
  NATURAL_SCIENCE: {
    id: "NATURAL_SCIENCE",
    name: "자연과학·순수기초학문 계열",
    badgeColor: "#1D4ED8",
    tagline: "수학·물리·화학·생물 기초 과학 원서와 실험 가설을 검증하는 연구 로드맵",
    year1: ["공통영어1", "공통영어2"],
    year2: ["영어Ⅰ", "영어 독해와 작문"],
    year3CareerDefault: ["심화 영어"],
    year3FusionDefault: ["실생활 영어 회화"],
    academicFocus: "과학 논문 초록(Abstract) 분석 및 연구 방법론 영문 정리"
  },
  ENGINEERING_IT: {
    id: "ENGINEERING_IT",
    name: "공학·IT·인공지능 계열",
    badgeColor: "#4338CA",
    tagline: "글로벌 기술 표준 규격서와 알고리즘 아키텍처를 해석하는 실무 로드맵",
    year1: ["공통영어1", "공통영어2"],
    year2: ["영어Ⅰ", "영어 독해와 작문"],
    year3CareerDefault: ["직무 영어"],
    year3FusionDefault: ["실생활 영어 회화"],
    academicFocus: "IT 기술 명세서 독해, 오픈소스 글로벌 개발 협업 소통"
  },
  MEDICINE_BIO: {
    id: "MEDICINE_BIO",
    name: "의약·바이오·보건 계열",
    badgeColor: "#BE123C",
    tagline: "최신 의과학 저널, 생명공학 논문 및 의료 윤리를 고찰하는 학술 로드맵",
    year1: ["공통영어1", "공통영어2"],
    year2: ["영어Ⅰ", "영어 독해와 작문"],
    year3CareerDefault: ["심화 영어", "영미 문학 읽기"],
    year3FusionDefault: ["실생활 영어 회화"],
    academicFocus: "CRISPR/생명공학 영문 논문 분석 및 의료 윤리 딜레마 영문 소논문"
  },
  EDUCATION: {
    id: "EDUCATION",
    name: "교육·사범 계열",
    badgeColor: "#B45309",
    tagline: "제2언어 습득 이론과 다문화 교수학습 매체를 설계하는 교육학 로드맵",
    year1: ["공통영어1", "공통영어2"],
    year2: ["영어Ⅰ", "영어 독해와 작문"],
    year3CareerDefault: ["영미 문학 읽기"],
    year3FusionDefault: ["실생활 영어 회화"],
    academicFocus: "다문화 학습자 맞춤형 영문 수업 지도안 및 학습 동기 연구"
  }
});

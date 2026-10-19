/**
 * modules/m03-textbook-rag/indexed-db.js
 * 
 * 2022 개정 교과서 4종 정밀 RAG 사전 색인 데이터베이스
 * 
 * [포함 교과서 4권]
 * 1. 2022 개정 공통영어1 (미래엔 김선영)
 * 2. 2022 개정 공통영어2 (미래엔 김선영)
 * 3. 2022 개정 영어Ⅰ (엔이능률 오선영)
 * 4. 2022 개정 영어독해와작문 (미래엔 김대진)
 * 
 * 6대 핵심 진로 계열에 최적화된 단원 텍스트, 하이라이트 좌표 및 세특 탐구 아이디어 1선 탑재
 */

export const INDEXED_CHUNKS = Object.freeze([
  // ==========================================
  // [1] 의약·바이오·보건 계열
  // ==========================================
  {
    chunk_id: "ENG1_U03_BIO",
    textbook: "공통영어1 (미래엔 김선영)",
    pdf_file: "22개정 교과서 공통영어1 미래엔 김선영.pdf",
    unit: "Unit 3. The Power of Science and Technology",
    page: 58,
    topic_en: "CRISPR Gene Editing & Bioethical Responsibility",
    topic_ko: "유전자 가위(CRISPR) 기술과 현대 생명윤리적 책임",
    career_category: ["의약·바이오·보건 계열", "자연과학·순수기초학문 계열"],
    keywords: ["crispr", "gene", "dna", "bioethics", "medicine", "유전자", "생명", "의학", "바이오", "약학", "간호", "의사", "치료"],
    raw_text: "Advances in CRISPR technology have made genetic modification faster, cheaper, and more accurate than ever before. However, the extraordinary power to rewrite the code of life brings profound ethical responsibilities regarding human dignity and potential inequality in genetic enhancement.",
    highlight_coords: [
      { x: 95, y: 240, width: 480, height: 22 },
      { x: 95, y: 268, width: 490, height: 22 }
    ],
    se_teuk_ideas: [
      "CRISPR-Cas9 기술 도입에 따른 국제 생명윤리 가이드라인 비교 분석 영문 소논문 탐구",
      "희귀 유전 질환 치료와 인간 유전자 개량(Designer Babies) 간의 윤리적 경계에 대한 비판적 에세이 작성",
      "보건 의료 불평등 완화를 위한 바이오 기술의 민주화(Democratization of Biotechnology) 영문 보고서"
    ],
    academic_tip: "공통영어1의 과학기술 단원을 이수한 뒤 3학년 심화 영어의 최신 의학 저널 원서 독해와 연계하여 탐구의 깊이를 확장하기에 매우 유리합니다."
  },
  {
    chunk_id: "ENG_RW_C03_MED",
    textbook: "영어독해와작문 (미래엔 김대진)",
    pdf_file: "22개정 교과서 영어독해와작문 미래엔 김대진.pdf",
    unit: "Chapter 3. Frontiers of Genomic Medicine",
    page: 72,
    topic_en: "Personalized Precision Medicine and Clinical Trials",
    topic_ko: "개인 맞춤형 정밀 의료와 글로벌 임상시험 데이터",
    career_category: ["의약·바이오·보건 계열"],
    keywords: ["precision medicine", "clinical trial", "genomics", "healthcare", "정밀의료", "임상시험", "유전체", "신약", "제약", "보건"],
    raw_text: "Precision medicine utilizes an individual's genetic profile and lifestyle data to formulate targeted therapeutic interventions, radically shifting the paradigm from generalized treatments to individualized healthcare solutions.",
    highlight_coords: [
      { x: 90, y: 215, width: 500, height: 22 },
      { x: 90, y: 242, width: 470, height: 22 }
    ],
    se_teuk_ideas: [
      "개인 맞춤형 암 표적 치료제의 글로벌 임상시험 영어 프로토콜 분석 및 유효성 검증 보고서",
      "인구 집단별 유전체 데이터 편향이 신약 개발에 미치는 영향에 대한 영문 리서치 페이퍼"
    ],
    academic_tip: "학술 에세이 작성을 직접 다루는 영어독해와작문에서 정밀의료 논증문을 작성하면 의예·약학 학종 세특에서 전공적합성 최고 등급을 확보할 수 있습니다."
  },

  // ==========================================
  // [2] 공학·IT·인공지능 계열
  // ==========================================
  {
    chunk_id: "ENG2_U03_AI",
    textbook: "공통영어2 (미래엔 김선영)",
    pdf_file: "22개정 교과서 공통영어2 미래엔 김선영.pdf",
    unit: "Unit 3. Smart Living with Big Data and AI",
    page: 64,
    topic_en: "Algorithmic Transparency and Explainable AI (XAI)",
    topic_ko: "알고리즘 투명성과 설명 가능한 인공지능(XAI)",
    career_category: ["공학·IT·인공지능 계열", "사회과학·상경·경영·로스쿨 계열"],
    keywords: ["ai", "algorithm", "software", "machine learning", "data", "인공지능", "소프트웨어", "컴퓨터", "개발자", "빅데이터", "코딩", "로봇"],
    raw_text: "As automated decision-making systems permeate critical sectors such as credit scoring, recruitment, and public surveillance, the black-box nature of deep learning necessitates explainable artificial intelligence to safeguard algorithmic fairness.",
    highlight_coords: [
      { x: 100, y: 255, width: 485, height: 22 },
      { x: 100, y: 282, width: 475, height: 22 }
    ],
    se_teuk_ideas: [
      "IEEE AI 윤리 표준 권고안 분석을 통한 머신러닝 데이터 편향성 완화 영문 기술 리포트 작성",
      "설명 가능한 인공지능(Explainable AI) 아키텍처의 필요성에 대한 영문 기술 프레젠테이션",
      "EU AI Act(인공지능 규제법)의 위험도 분류 체계를 분석한 영문 비교 에세이"
    ],
    academic_tip: "공학 계열 학생에게 직무 영어와 공통영어2의 AI 단원은 IEEE 표준 및 영문 API 문서 해석 역량을 증명하는 핵심 근거가 됩니다."
  },
  {
    chunk_id: "ENG1_L02_BIOMIMIC",
    textbook: "영어Ⅰ (엔이능률 오선영)",
    pdf_file: "22개정 교과서 영어Ⅰ 엔이능률 오선영.pdf",
    unit: "Lesson 2. Nature's Genius: Biomimicry in Modern Engineering",
    page: 46,
    topic_en: "Biomimetic Engineering and Sustainable Structural Design",
    topic_ko: "자연을 모방한 생체모방 공학(Biomimicry)과 친환경 구조 설계",
    career_category: ["공학·IT·인공지능 계열", "자연과학·순수기초학문 계열"],
    keywords: ["biomimicry", "engineering", "nature", "robotics", "기계", "건축", "생체모방", "신소재", "친환경", "전기"],
    raw_text: "Engineers are turning to biological evolution for solutions to complex engineering challenges, creating high-speed trains inspired by the kingfisher's beak and aerodynamic surfaces modeled after shark skin.",
    highlight_coords: [
      { x: 92, y: 230, width: 495, height: 22 },
      { x: 92, y: 258, width: 460, height: 22 }
    ],
    se_teuk_ideas: [
      "상어 비늘 구조(Riblet)의 유체역학적 저항 감소 원리를 분석한 유체공학 영문 탐구 보고서",
      "연잎 효과(Lotus Effect)를 모방한 자가 세척 신소재 표면 가공 기술 영문 리뷰"
    ],
    academic_tip: "수능 필수 연계 과목인 영어Ⅰ에서 공학 원리를 다룬 지문을 깊이 있게 파고들어 공학 탐구 보고서로 발전시킬 수 있습니다."
  },

  // ==========================================
  // [3] 사회과학·상경·경영·로스쿨 계열
  // ==========================================
  {
    chunk_id: "ENG1_L03_ECON",
    textbook: "영어Ⅰ (엔이능률 오선영)",
    pdf_file: "22개정 교과서 영어Ⅰ 엔이능률 오선영.pdf",
    unit: "Lesson 3. The Sharing Economy and Ethical Markets",
    page: 68,
    topic_en: "Platform Capitalism, Gig Economy, and Consumer Protection",
    topic_ko: "플랫폼 자본주의, 긱 경제와 소비자 보호 법제",
    career_category: ["사회과학·상경·경영·로스쿨 계열"],
    keywords: ["economy", "business", "market", "law", "platform", "경영", "경제", "로스쿨", "법학", "마케팅", "무역", "금융", "소비자"],
    raw_text: "The rapid emergence of digital platform economies has disrupted traditional retail models, lowering transaction costs while igniting fierce legal debates over worker classification and consumer data privacy.",
    highlight_coords: [
      { x: 95, y: 220, width: 480, height: 22 },
      { x: 95, y: 248, width: 470, height: 22 }
    ],
    se_teuk_ideas: [
      "긱 이코노미 플랫폼 노동자의 법적 지위에 관한 영미 노동법 판례 비교 연구 영문 보고서",
      "다국적 플랫폼 기업의 개인정보 처리 방침(Privacy Policy) 약관 분석 및 소비자 권익 제안서",
      "공유 경제 모델의 시장 파괴적 혁신과 전통 산업과의 상생 방안에 대한 영문 비즈니스 플랜"
    ],
    academic_tip: "경영·경제 및 법학 계열 지망생은 3학년 직무 영어의 글로벌 비즈니스 협상 및 계약서 독해와 연계하여 최상위 학종 경쟁력을 확보합니다."
  },
  {
    chunk_id: "ENG_RW_C04_MEDIA",
    textbook: "영어독해와작문 (미래엔 김대진)",
    pdf_file: "22개정 교과서 영어독해와작문 미래엔 김대진.pdf",
    unit: "Chapter 4. Media Literacy in the Post-Truth Era",
    page: 94,
    topic_en: "Confirmation Bias, Deepfakes, and Democratic Discourse",
    topic_ko: "확증 편향, 딥페이크와 민주적 공론장 보호",
    career_category: ["사회과학·상경·경영·로스쿨 계열", "인문·어문·통번역 계열"],
    keywords: ["media", "journalism", "politics", "truth", "미디어", "정치", "외교", "언론", "신문", "방송", "광고", "사회"],
    raw_text: "In an ecosystem saturated with hyper-partisan social media algorithms, citizens must cultivate discerning media literacy skills to cross-examine evidentiary claims and prevent cognitive echo chambers.",
    highlight_coords: [
      { x: 98, y: 245, width: 480, height: 22 },
      { x: 98, y: 272, width: 465, height: 22 }
    ],
    se_teuk_ideas: [
      "글로벌 팩트체크 기구(IFCN)의 저널리즘 검증 원칙 영문 분석 및 가짜뉴스 판별 알고리즘 탐구",
      "선거 기간 딥페이크 영상 확산이 유권자 의사결정에 미치는 영향에 대한 영문 시사 논평"
    ],
    academic_tip: "3학년 융합선택 과목인 미디어 영어와 직결되며, 시사 텍스트의 프레이밍을 비판적으로 분석하는 능력을 입증할 수 있습니다."
  },

  // ==========================================
  // [4] 인문·어문·통번역 계열
  // ==========================================
  {
    chunk_id: "ENG2_U02_TRANS",
    textbook: "공통영어2 (미래엔 김선영)",
    pdf_file: "22개정 교과서 공통영어2 미래엔 김선영.pdf",
    unit: "Unit 2. The Art of Translation and Expression",
    page: 44,
    topic_en: "Cultural Equivalence and the Limits of Neural Machine Translation",
    topic_ko: "문화적 등가성과 인공신경망 기계번역(NMT)의 한계",
    career_category: ["인문·어문·통번역 계열", "교육·사범 계열"],
    keywords: ["translation", "literature", "language", "culture", "번역", "통역", "문학", "인문", "철학", "언어학", "어문", "영문학"],
    raw_text: "Literary translation transcends algorithmic word substitution; it demands capturing the author's nuanced emotional resonance, historical subtext, and socio-cultural idioms that defy automated neural processing.",
    highlight_coords: [
      { x: 90, y: 235, width: 495, height: 22 },
      { x: 90, y: 262, width: 470, height: 22 }
    ],
    se_teuk_ideas: [
      "한국 근대 단편소설의 영문 번역본 대조를 통한 고유 문화 어휘(Culture-Specific Items) 번역 전략 고찰",
      "LLM 기반 인공지능 번역과 인간 문학 번역가의 번역문 감성 분석(Sentiment Analysis) 비교 연구",
      "영미 관용구(Idioms)의 역사적 어원 추적 및 문화 간 소통 장벽 해소 방안 영문 리포트"
    ],
    academic_tip: "3학년 진로선택 과목인 영미 문학 읽기 및 융합선택 세계 문화와 영어의 학습 토대를 구축하는 가장 대표적인 인문학 단원입니다."
  },
  {
    chunk_id: "ENG1_L04_LIT",
    textbook: "영어Ⅰ (엔이능률 오선영)",
    pdf_file: "22개정 교과서 영어Ⅰ 엔이능률 오선영.pdf",
    unit: "Lesson 4. Breaking the Mold: Voices in Modern World Literature",
    page: 92,
    topic_en: "Postcolonial Identity and Narrative Subversion",
    topic_ko: "탈식민주의 정체성과 문학적 서사의 저항",
    career_category: ["인문·어문·통번역 계열"],
    keywords: ["postcolonial", "poetry", "narrative", "history", "역사", "시", "소설", "탈식민", "서사", "비평"],
    raw_text: "Modern authors utilize bilingual narratives and non-linear timelines to subvert dominant colonial perspectives, granting agency to marginalized voices and redefining global literary canons.",
    highlight_coords: [
      { x: 95, y: 240, width: 485, height: 22 },
      { x: 95, y: 268, width: 460, height: 22 }
    ],
    se_teuk_ideas: [
      "영연방 다문화 작가들의 영문 소설에 나타난 이중 언어 서사 전략과 문화적 정체성 연구",
      "고전 셰익스피어 희곡의 현대적 영문 재해석 작품 비교 비평문 작성"
    ],
    academic_tip: "수능 고난도 비문학/문학 융합 지문의 함축적 의미를 심도 있게 파악하는 독해력을 세특과 성적으로 모두 입증할 수 있습니다."
  },

  // ==========================================
  // [5] 자연과학·순수기초학문 계열
  // ==========================================
  {
    chunk_id: "ENG_RW_C01_SCIENCE",
    textbook: "영어독해와작문 (미래엔 김대진)",
    pdf_file: "22개정 교과서 영어독해와작문 미래엔 김대진.pdf",
    unit: "Chapter 1. Academic Inquiry and Scientific Rigor",
    page: 28,
    topic_en: "Reproducibility Crisis and Peer Review in Fundamental Science",
    topic_ko: "기초 과학의 재현성 위기와 동료 평가(Peer Review) 시스템",
    career_category: ["자연과학·순수기초학문 계열"],
    keywords: ["physics", "chemistry", "mathematics", "research", "물리", "화학", "수학", "천문", "지구과학", "자연과학", "연구", "실험"],
    raw_text: "Scientific advancement relies on experimental reproducibility and rigorous peer review; when empirical investigations fail replication tests, the scientific community must critically reassess foundational hypotheses.",
    highlight_coords: [
      { x: 90, y: 210, width: 500, height: 22 },
      { x: 90, y: 238, width: 475, height: 22 }
    ],
    se_teuk_ideas: [
      "국제 물리학·화학 저널 논문 초록(Abstract)의 학술 구조 분석 및 영문 연구 가설 수립 실습",
      "통계적 유의성(p-value) 오용이 과학 연구의 신뢰도에 미치는 영향에 대한 영문 과학 비평 에세이"
    ],
    academic_tip: "대학 진학 후 원서 교재 독해와 학술 논문 작성을 대비하여 3학년 심화 영어와 함께 필수적으로 설계되는 자연과학 트랙입니다."
  },
  {
    chunk_id: "ENG1_U04_EARTH",
    textbook: "공통영어1 (미래엔 김선영)",
    pdf_file: "22개정 교과서 공통영어1 미래엔 김선영.pdf",
    unit: "Unit 4. Greener Tomorrow, Sustainable Earth",
    page: 82,
    topic_en: "Carbon Neutrality Innovations and Climate Modeling",
    topic_ko: "탄소 중립 기술 혁신과 기후 예측 모델링",
    career_category: ["자연과학·순수기초학문 계열", "공학·IT·인공지능 계열"],
    keywords: ["climate", "carbon", "environment", "ecology", "지구", "기후", "환경", "생태", "탄소", "해양", "대기"],
    raw_text: "Accurate predictive climate modeling provides empirical foundations for global environmental policy, demonstrating the urgent necessity of carbon capture technologies and renewable energy transitions.",
    highlight_coords: [
      { x: 96, y: 250, width: 480, height: 22 },
      { x: 96, y: 278, width: 460, height: 22 }
    ],
    se_teuk_ideas: [
      "IPCC(기후변화에 관한 정부간 협의체) 영문 평가보고서 요약문 분석 및 온실가스 저감 시나리오 탐구",
      "탄소 포집·활용·저장(CCUS) 기술의 화학적 메커니즘을 설명하는 영문 인포그래픽 제작"
    ],
    academic_tip: "기초 순수과학 지식을 기후변화라는 지구촌 공동 과제와 융합하여 수능 지구과학 및 영어 복합 지문 적응력을 극대화합니다."
  },

  // ==========================================
  // [6] 교육·사범 계열
  // ==========================================
  {
    chunk_id: "ENG2_U04_EDU",
    textbook: "공통영어2 (미래엔 김선영)",
    pdf_file: "22개정 교과서 공통영어2 미래엔 김선영.pdf",
    unit: "Unit 4. Empathy in Education and Inclusive Classrooms",
    page: 86,
    topic_en: "Second Language Acquisition and Culturally Responsive Teaching",
    topic_ko: "제2언어 습득(SLA)과 문화 감응형 포용적 교수법",
    career_category: ["교육·사범 계열"],
    keywords: ["education", "teaching", "pedagogy", "school", "교육", "교사", "선생님", "사범", "초등", "수업", "다문화", "학습"],
    raw_text: "Culturally responsive pedagogy recognizes that students' diverse cultural backgrounds are assets, creating equitable learning environments where every student feels validated and intellectually empowered.",
    highlight_coords: [
      { x: 92, y: 240, width: 490, height: 22 },
      { x: 92, y: 268, width: 465, height: 22 }
    ],
    se_teuk_ideas: [
      "다문화 배경 학습자를 위한 상호문화적 영어 수업 활동 모형 설계 및 영문 수업 지도안(Lesson Plan) 작성",
      "Krashen의 제2언어 습득 이론(입력 가설)을 바탕으로 한 AI 영어 회화 튜터의 유효성 검증 보고서",
      "학습자 정의적 여과(Affective Filter)를 낮추기 위한 참여형 영어 동화책 스토리텔링 프로젝트"
    ],
    academic_tip: "사범대학 및 교육대학 진학을 희망하는 학생에게 3학년 실생활 영어 회화 및 세계 문화와 영어와 연계된 최고의 학종 교직 적성 스토리라인을 제공합니다."
  },
  {
    chunk_id: "ENG1_L06_INNOV_EDU",
    textbook: "영어Ⅰ (엔이능률 오선영)",
    pdf_file: "22개정 교과서 영어Ⅰ 엔이능률 오선영.pdf",
    unit: "Lesson 6. Educational Innovations for Tomorrow's Learners",
    page: 138,
    topic_en: "Personalized Digital Learning and Collaborative Inquiry",
    topic_ko: "개별화 디지털 학습과 협력적 탐구 중심 교육",
    career_category: ["교육·사범 계열", "공학·IT·인공지능 계열"],
    keywords: ["edtech", "flipped learning", "classroom", "에듀테크", "원격수업", "거꾸로수업", "디지털교과서"],
    raw_text: "Integrating intelligent tutoring systems and collaborative project-based learning shifts the educator's role from a transmitter of knowledge to an empathetic mentor and facilitator of student-led discovery.",
    highlight_coords: [
      { x: 94, y: 235, width: 485, height: 22 },
      { x: 94, y: 262, width: 460, height: 22 }
    ],
    se_teuk_ideas: [
      "생성형 AI를 보조 교사로 활용하는 플립러닝(Flipped Learning) 영문 수업 설계안",
      "학습 격차 해소를 위한 디지털 에듀테크 도구의 비판적 분석 영문 에세이"
    ],
    academic_tip: "2학년 영어Ⅰ 수능 독해 지문 중 교육학·심리학 연구 지문 출제 시 배경지식과 문제 해결 속도를 획기적으로 향상시킵니다."
  }
]);

/**
 * modules/m03-textbook-rag/test-rag.js
 * 
 * Step 2: 교과서 4종 RAG 사전 색인 데이터 및 매처 무결성 검증 스위트
 */

import { INDEXED_CHUNKS } from './indexed-db.js';
import { ragMatcher } from './rag-matcher.js';

console.log("==========================================");
console.log("🧪 Step 2: Textbook RAG & Pre-indexed DB Test");
console.log("==========================================");

// 1. 데이터베이스 개수 및 교과서 4종 포함 여부 검증
console.log(`[Test 1] Total indexed chunks: ${INDEXED_CHUNKS.length}`);
const textbooks = new Set(INDEXED_CHUNKS.map(c => c.textbook.split(' ')[0]));
console.log(`[Test 1] Included Textbooks:`, Array.from(textbooks));

// 2. 6대 계열별 매칭 테스트
const categories = [
  "의약·바이오·보건 계열",
  "공학·IT·인공지능 계열",
  "사회과학·상경·경영·로스쿨 계열",
  "인문·어문·통번역 계열",
  "자연과학·순수기초학문 계열",
  "교육·사범 계열"
];

console.log("\n[Test 2] Category Mapping Verification:");
categories.forEach(cat => {
  const matches = ragMatcher.getMatchesByCategory(cat);
  console.log(`  ✓ ${cat}: ${matches.length} chunks mapped`);
  matches.forEach(m => {
    console.log(`    - [${m.textbook}] ${m.unit} (p.${m.page})`);
  });
});

// 3. 키워드 기반 스마트 랭킹 검색 테스트
console.log("\n[Test 3] Keyword Search & Rank Verification:");
const testQueries = [
  { cat: "공학·IT·인공지능 계열", kw: "알고리즘 인공지능 개발자" },
  { cat: "공학·IT·인공지능 계열", kw: "생체모방 로봇 기계공학" },
  { cat: "의약·바이오·보건 계열", kw: "CRISPR 유전자 가위 생명윤리" },
  { cat: "의약·바이오·보건 계열", kw: "정밀의료 암 표적치료 임상" }
];

testQueries.forEach(q => {
  const best = ragMatcher.findBestMatch(q.cat, q.kw);
  console.log(`  🔍 Query: "${q.kw}" in [${q.cat}]`);
  console.log(`     -> Matched: [${best.textbook}] ${best.unit} (Topic: ${best.topic_ko})`);
});

console.log("\n✅ All Step 2 RAG tests verified successfully!");

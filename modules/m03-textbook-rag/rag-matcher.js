/**
 * modules/m03-textbook-rag/rag-matcher.js
 * 
 * 2022 개정 교과서 4종 RAG 초고속 매칭 & 키워드 가중치 랭킹 엔진
 */

import { roadmapStore } from '../../core/store.js';
import { INDEXED_CHUNKS } from './indexed-db.js';

export class RagMatcher {
  constructor() {
    this.db = [...INDEXED_CHUNKS];
  }

  /**
   * 사전 색인 데이터베이스 초기화
   */
  async loadDatabase(customData = null) {
    if (customData) {
      this.db = customData;
    } else {
      this.db = [...INDEXED_CHUNKS];
    }
    console.log(`[RagMatcher] Loaded ${this.db.length} textbook chunks across 4 official textbooks.`);
  }

  /**
   * 진로 계열에 속하는 모든 교과서 단원 후보군 반환
   * @param {string} careerCategoryName 
   * @returns {Array}
   */
  getMatchesByCategory(careerCategoryName) {
    if (!careerCategoryName) return [...this.db];
    
    return this.db.filter(chunk => 
      chunk.career_category.some(cat => 
        cat.includes(careerCategoryName) || careerCategoryName.includes(cat)
      )
    );
  }

  /**
   * 진로 계열 및 세부 희망 직업/키워드 기반 최적 단원 랭킹 검색 (1ms)
   * @param {string} careerCategoryName 
   * @param {string} userKeyword 
   * @returns {Object} 가장 적합한 단원 청크
   */
  findBestMatch(careerCategoryName, userKeyword = "") {
    const candidates = this.getMatchesByCategory(careerCategoryName);
    if (candidates.length === 0) {
      return this.db[0];
    }

    // 키워드가 없을 경우 첫 번째 대표 단원 반환
    const cleanKeyword = (userKeyword || "").trim().toLowerCase();
    if (!cleanKeyword) {
      return candidates[0];
    }

    // 키워드 가중치 점수 계산 (단어 토큰화)
    const tokens = cleanKeyword.split(/[\s,·\/\-]+/).filter(t => t.length > 1);
    let bestChunk = candidates[0];
    let maxScore = -1;

    for (const chunk of candidates) {
      let score = 0;
      
      for (const token of tokens) {
        // 1. 단원 키워드 일치 (+5점)
        if (chunk.keywords && chunk.keywords.some(k => k.includes(token) || token.includes(k))) {
          score += 5;
        }
        // 2. 한글 주제명 일치 (+4점)
        if (chunk.topic_ko && chunk.topic_ko.toLowerCase().includes(token)) {
          score += 4;
        }
        // 3. 영문 주제명 일치 (+3점)
        if (chunk.topic_en && chunk.topic_en.toLowerCase().includes(token)) {
          score += 3;
        }
        // 4. 본문 발췌문 일치 (+2점)
        if (chunk.raw_text && chunk.raw_text.toLowerCase().includes(token)) {
          score += 2;
        }
      }

      if (score > maxScore) {
        maxScore = score;
        bestChunk = chunk;
      }
    }

    return bestChunk;
  }

  /**
   * 특정 ID로 단원 직접 조회
   * @param {string} chunkId 
   */
  getChunkById(chunkId) {
    return this.db.find(c => c.chunk_id === chunkId) || null;
  }

  /**
   * 매칭된 단원을 중앙 스토어(RoadmapStore)에 동기화
   * @param {string} careerCategoryName 
   * @param {string} userKeyword 
   * @param {string} [specificChunkId] 
   */
  syncToStore(careerCategoryName, userKeyword = "", specificChunkId = null) {
    let chunk = null;
    if (specificChunkId) {
      chunk = this.getChunkById(specificChunkId);
    }
    if (!chunk) {
      chunk = this.findBestMatch(careerCategoryName, userKeyword);
    }
    if (!chunk) return;

    roadmapStore.setMatchedTextbook({
      chunkId: chunk.chunk_id,
      textbookName: chunk.textbook,
      unitTitle: chunk.unit,
      pageNumber: chunk.page,
      topicEn: chunk.topic_en,
      topicKo: chunk.topic_ko,
      careerCategory: careerCategoryName,
      snippetText: chunk.raw_text,
      highlightCoords: chunk.highlight_coords,
      pdfFile: chunk.pdf_file,
      seTeukIdeas: chunk.se_teuk_ideas,
      academicTip: chunk.academic_tip,
      availableMatches: this.getMatchesByCategory(careerCategoryName).map(c => ({
        chunkId: c.chunk_id,
        textbookName: c.textbook,
        unitTitle: c.unit,
        topicKo: c.topic_ko
      }))
    });

    console.log(`[RagMatcher] Synced textbook evidence: [${chunk.textbook}] ${chunk.unit}`);
  }
}

export const ragMatcher = new RagMatcher();

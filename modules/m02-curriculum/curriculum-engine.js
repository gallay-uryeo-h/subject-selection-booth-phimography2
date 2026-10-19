/**
 * modules/m02-curriculum/curriculum-engine.js
 * 
 * 2022 개정 교육과정 로드맵 규칙 및 검증 엔진
 */

import { CURRICULUM_METADATA, CAREER_ROADMAP_PRESETS } from './curriculum-data.js';
import { CAREER_CATEGORIES } from '../../core/types.js';
import { roadmapStore } from '../../core/store.js';

export class CurriculumEngine {
  constructor() {
    this.metadata = CURRICULUM_METADATA;
    this.presets = CAREER_ROADMAP_PRESETS;
  }

  /**
   * 6대 진로 계열 목록 반환
   */
  getCategories() {
    return CAREER_CATEGORIES;
  }

  /**
   * 특정 계열의 상세 프리셋 반환
   */
  getPresetForCategory(categoryId) {
    return this.presets[categoryId] || this.presets.ENGINEERING_IT;
  }

  /**
   * 계열 선택 시 중앙 스토어에 권장 프리셋 자동 반영
   */
  applyCategoryPreset(categoryId) {
    const preset = this.getPresetForCategory(categoryId);
    if (!preset) return;

    // 1. 프로필 계열 업데이트
    roadmapStore.setCareerCategory(categoryId);

    // 2. 3개년 과목 자동 배치
    roadmapStore.updateCurriculum({
      year1: [...preset.year1],
      year2: [...preset.year2],
      year3Career: [...preset.year3CareerDefault],
      year3Fusion: [...preset.year3FusionDefault]
    });

    console.log(`[CurriculumEngine] Applied preset for ${preset.name}:`, preset);
  }

  /**
   * 과목 이름으로 상세 메타데이터 조회
   */
  getSubjectDetails(subjectName) {
    return Object.values(this.metadata).find(s => s.name === subjectName) || null;
  }

  /**
   * 전체 과목 목록을 학년/유형별로 그룹화하여 반환
   */
  getSubjectGroups() {
    const all = Object.values(this.metadata);
    return {
      year1: all.filter(s => s.grade === 1),
      year2: all.filter(s => s.grade === 2),
      year3Career: all.filter(s => s.grade === 3 && s.type === "진로선택"),
      year3Fusion: all.filter(s => s.grade === 3 && s.type === "융합선택")
    };
  }

  /**
   * 학생의 3개년 로드맵 이수 유효성 검사 및 학술 평가 피드백 생성
   * @param {Object} curriculum 
   * @param {string} careerCategoryId 
   */
  validateCurriculum(curriculum, careerCategoryId) {
    const preset = this.getPresetForCategory(careerCategoryId);
    const issues = [];
    const praises = [];

    // 1. 2학년 수능 연계 과목 검사
    if (!curriculum.year2.includes("영어Ⅰ") || !curriculum.year2.includes("영어 독해와 작문")) {
      issues.push("수능 직접 출제 연계 과목(영어Ⅰ, 영어 독해와 작문)의 이수를 권장합니다.");
    } else {
      praises.push("수능 대비 및 기본 학술 독해를 위한 2학년 일반선택 과목이 탄탄히 배치되었습니다.");
    }

    // 2. 3학년 진로 및 융합선택 이수 단위 검사
    const total3rd = (curriculum.year3Career?.length || 0) + (curriculum.year3Fusion?.length || 0);
    if (total3rd === 0) {
      issues.push("3학년 진로선택 또는 융합선택에서 최소 1과목 이상을 선택해야 전공적합성이 입증됩니다.");
    } else if (total3rd >= 4) {
      issues.push("3학년 영어 선택과목이 다소 많습니다. 타 교과(국어/수학/탐구)와의 학습 균형을 고려하십시오.");
    } else {
      praises.push(`진로 특화 과목(${curriculum.year3Career.join(', ') || '없음'})이 적절한 학업 부담으로 설계되었습니다.`);
    }

    return {
      isValid: issues.length === 0,
      totalCredits: (curriculum.year1.length * 4) + (curriculum.year2.length * 4) + (total3rd * 4),
      issues,
      praises,
      recommendedFit: preset ? preset.academicFocus : ""
    };
  }
}

export const curriculumEngine = new CurriculumEngine();

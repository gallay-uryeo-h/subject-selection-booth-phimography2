/**
 * modules/m06-photocard/webcam-booth.js
 * 
 * 현장 웹캠 라이브 포토부스 인터랙션 엔진
 * - 실시간 웹캠 비디오 스트리밍
 * - 3-2-1 카운트다운 & 셔터 플래시 효과
 * - Web Audio API 기반 셔터 사운드
 * - 필터 프리셋 (내추럴, 아카데믹 흑백, 옥스퍼드 쿨톤)
 * - 재촬영 및 업로드 대체 옵션
 */

import { roadmapStore } from '../../core/store.js';
import { eventBus } from '../../core/event-bus.js';
import { EVENTS } from '../../core/types.js';

export class WebcamBooth {
  constructor() {
    this.stream = null;
    this.videoEl = null;
    this.modalEl = null;
    this.isCountingDown = false;
    this.currentFilter = 'natural'; // natural, academic-bw, oxford-cool
  }

  /**
   * 포토부스 모달 열기 및 웹캠 시작
   */
  async openBooth() {
    this.createModalDOM();
    await this.startCamera();
  }

  /**
   * 모달 DOM 생성
   */
  createModalDOM() {
    if (this.modalEl) {
      this.modalEl.remove();
    }

    this.modalEl = document.createElement('div');
    this.modalEl.id = 'webcam-booth-modal';
    this.modalEl.innerHTML = `
      <div class="booth-backdrop" style="
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(11, 37, 69, 0.75);
        backdrop-filter: blur(6px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.15s ease-out;
      ">
        <div class="booth-card" style="
          background: #FFFFFF;
          border-radius: 12px;
          border: 2px solid var(--color-oxford-navy);
          box-shadow: 0 25px 50px -12px rgba(11, 37, 69, 0.35);
          width: 90%;
          max-width: 680px;
          overflow: hidden;
          position: relative;
        ">
          <!-- Flash Overlay -->
          <div id="booth-flash" style="
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: #FFFFFF;
            opacity: 0;
            pointer-events: none;
            z-index: 100;
            transition: opacity 0.08s ease-out;
          "></div>

          <!-- Header -->
          <div style="
            background: var(--color-oxford-navy);
            color: #FFFFFF;
            padding: 0.85rem 1.25rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 1.25rem;">📸</span>
              <strong style="font-family: var(--font-serif); font-size: 1.15rem; letter-spacing: 0.02em;">
                의령여고 영어과 아카데믹 포토부스
              </strong>
            </div>
            <button id="booth-close-btn" style="
              background: transparent;
              border: none;
              color: #FFFFFF;
              font-size: 1.25rem;
              cursor: pointer;
            ">✕</button>
          </div>

          <!-- Viewfinder Section -->
          <div style="position: relative; background: #0F172A; width: 100%; aspect-ratio: 4/3; display: flex; align-items: center; justify-content: center; overflow: hidden;">
            <video id="booth-video" autoplay playsinline style="
              width: 100%;
              height: 100%;
              object-fit: cover;
              transform: scaleX(-1);
              transition: filter 0.2s;
            "></video>

            <!-- Guide Frame -->
            <div style="
              position: absolute;
              width: 70%;
              height: 80%;
              border: 2px dashed rgba(255, 255, 255, 0.4);
              border-radius: 8px;
              pointer-events: none;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              padding: 10px;
            ">
              <span style="font-size: 0.7rem; color: rgba(255,255,255,0.7); text-transform: uppercase;">Uiryeong Girls' High School</span>
              <span style="font-size: 0.7rem; color: rgba(255,255,255,0.7); text-align: right;">Pose Guide</span>
            </div>

            <!-- Countdown Overlay -->
            <div id="booth-countdown" style="
              position: absolute;
              font-family: var(--font-serif);
              font-size: 6rem;
              font-weight: 700;
              color: #FFFFFF;
              text-shadow: 0 4px 20px rgba(0,0,0,0.8);
              display: none;
              animation: scaleUp 0.3s ease-out;
            ">3</div>

            <!-- Fallback UI (when camera not available) -->
            <div id="booth-fallback" style="display: none; text-align: center; color: #FFFFFF; padding: 1.5rem;">
              <div style="font-size: 3rem; margin-bottom: 0.5rem;">📷</div>
              <p style="font-size: 0.9rem; margin-bottom: 1rem;">웹캠을 찾을 수 없거나 권한이 차단되었습니다.</p>
              <label class="academic-btn btn-primary" style="font-size: 0.8rem; cursor: pointer;">
                📁 사진 파일 직접 업로드
                <input type="file" id="booth-file-input" accept="image/*" style="display: none;">
              </label>
            </div>
          </div>

          <!-- Controls Section -->
          <div style="padding: 1rem 1.25rem; display: flex; justify-content: space-between; align-items: center; background: #F8FAFC;">
            <!-- Filter Options -->
            <div style="display: flex; gap: 0.4rem; align-items: center;">
              <span style="font-size: 0.75rem; color: var(--color-text-muted); font-weight: 600;">톤 필터:</span>
              <button class="filter-btn academic-btn btn-outline" data-filter="natural" style="font-size: 0.7rem; padding: 0.25rem 0.55rem; background: var(--color-oxford-navy); color: #FFF;">내추럴</button>
              <button class="filter-btn academic-btn btn-outline" data-filter="oxford" style="font-size: 0.7rem; padding: 0.25rem 0.55rem;">옥스퍼드</button>
              <button class="filter-btn academic-btn btn-outline" data-filter="bw" style="font-size: 0.7rem; padding: 0.25rem 0.55rem;">클래식흑백</button>
            </div>

            <!-- Shutter Action -->
            <button id="booth-shutter-btn" class="academic-btn btn-primary" style="
              padding: 0.75rem 2rem;
              font-size: 1rem;
              font-weight: 700;
              border-radius: var(--radius-full);
              box-shadow: 0 4px 15px rgba(11, 37, 69, 0.25);
              background: #0B2545;
              border: 2px solid #D97706;
            ">
              📸 3초 타이머 촬영
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.modalEl);

    this.videoEl = this.modalEl.querySelector('#booth-video');
    this.bindEvents();
  }

  /**
   * 웹캠 스트림 시작
   */
  async startCamera() {
    const fallbackEl = this.modalEl.querySelector('#booth-fallback');
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: false
      });
      this.videoEl.srcObject = this.stream;
      this.videoEl.style.display = 'block';
      fallbackEl.style.display = 'none';
    } catch (err) {
      console.warn('[WebcamBooth] Camera access failed or not supported:', err);
      this.videoEl.style.display = 'none';
      fallbackEl.style.display = 'block';
    }
  }

  /**
   * 이벤트 바인딩
   */
  bindEvents() {
    // 닫기
    this.modalEl.querySelector('#booth-close-btn').addEventListener('click', () => this.closeBooth());
    this.modalEl.querySelector('.booth-backdrop').addEventListener('click', (e) => {
      if (e.target.classList.contains('booth-backdrop')) this.closeBooth();
    });

    // 셔터 버튼
    const shutterBtn = this.modalEl.querySelector('#booth-shutter-btn');
    shutterBtn.addEventListener('click', () => {
      if (!this.isCountingDown) {
        this.startCountdown();
      }
    });

    // 필터 선택
    const filterBtns = this.modalEl.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.style.background = 'transparent';
          b.style.color = 'var(--color-text-secondary)';
        });
        btn.style.background = 'var(--color-oxford-navy)';
        btn.style.color = '#FFFFFF';

        this.currentFilter = btn.dataset.filter;
        this.applyFilter(this.currentFilter);
      });
    });

    // 파일 직접 업로드 대체
    const fileInput = this.modalEl.querySelector('#booth-file-input');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.savePhoto(event.target.result);
            this.closeBooth();
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  /**
   * 비디오 뷰파인더 필터 적용
   */
  applyFilter(filterType) {
    if (!this.videoEl) return;
    if (filterType === 'bw') {
      this.videoEl.style.filter = 'grayscale(100%) contrast(110%)';
    } else if (filterType === 'oxford') {
      this.videoEl.style.filter = 'contrast(105%) saturate(85%) hue-rotate(10deg)';
    } else {
      this.videoEl.style.filter = 'none';
    }
  }

  /**
   * 3-2-1 카운트다운 시작
   */
  startCountdown() {
    this.isCountingDown = true;
    const countdownEl = this.modalEl.querySelector('#booth-countdown');
    const shutterBtn = this.modalEl.querySelector('#booth-shutter-btn');
    shutterBtn.disabled = true;
    shutterBtn.style.opacity = '0.6';

    let count = 3;
    countdownEl.textContent = count;
    countdownEl.style.display = 'block';

    this.playBeepSound();

    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        countdownEl.textContent = count;
        this.playBeepSound();
      } else {
        clearInterval(interval);
        countdownEl.style.display = 'none';
        this.takeSnapshot();
      }
    }, 1000);
  }

  /**
   * 스냅샷 캡처 & 셔터 효과
   */
  takeSnapshot() {
    // 1. 셔터 사운드 & 플래시
    this.playShutterSound();
    const flashEl = this.modalEl.querySelector('#booth-flash');
    flashEl.style.opacity = '1';
    setTimeout(() => {
      flashEl.style.opacity = '0';
    }, 100);

    // 2. 캔버스 드로잉
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');

    // 거울 모드 반전 렌더링
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    // 필터 적용
    if (this.currentFilter === 'bw') {
      ctx.filter = 'grayscale(100%) contrast(110%)';
    } else if (this.currentFilter === 'oxford') {
      ctx.filter = 'contrast(105%) saturate(85%)';
    }

    ctx.drawImage(this.videoEl, 0, 0, canvas.width, canvas.height);
    const photoDataUrl = canvas.toDataURL('image/jpeg', 0.92);

    // 3. 사진 저장 및 모달 닫기
    this.savePhoto(photoDataUrl);
    setTimeout(() => {
      this.closeBooth();
    }, 300);
  }

  /**
   * 스토어에 사진 저장
   */
  savePhoto(photoUrl) {
    roadmapStore.updateProfile({ photoDataUrl: photoUrl });
    console.log('[WebcamBooth] 📸 Photo captured & saved to RoadmapStore!');
  }

  /**
   * 모달 닫기 및 웹캠 스트림 정리
   */
  closeBooth() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.modalEl) {
      this.modalEl.remove();
      this.modalEl = null;
    }
    this.isCountingDown = false;
  }

  /**
   * Web Audio API 비프음 (카운트다운용)
   */
  playBeepSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  }

  /**
   * Web Audio API 찰칵 셔터음
   */
  playShutterSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(300, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {}
  }
}

export const webcamBooth = new WebcamBooth();

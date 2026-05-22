/**
 * 한국벤처혁신학회 논문투고 안내 페이지 스크립트
 * - 노인/중장년층 대상: 심플하고 명확한 인터랙션
 * - Vanilla JS only, 외부 라이브러리 없음
 */

document.addEventListener('DOMContentLoaded', function () {
  initScrollSpy();
  initSmoothScroll();
  initCopyButtons();
  initFaqAccordion();
  initFontControls();
  initCardAnimation();
});

/* ───────────────────────────────────────────
   1. 스크롤 추적 (IntersectionObserver)
   - 현재 보이는 .step-card에 맞춰 사이드바 .active 갱신
   ─────────────────────────────────────────── */
function initScrollSpy() {
  var navItems = document.querySelectorAll('.sidebar-nav a');
  var stepCards = document.querySelectorAll('.step-card');

  if (stepCards.length === 0 || navItems.length === 0) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var id = entry.target.getAttribute('id');
        navItems.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      });
    },
    { threshold: 0.3 }
  );

  stepCards.forEach(function (card) {
    observer.observe(card);
  });
}

/* ───────────────────────────────────────────
   2. 스무스 스크롤
   - 사이드바 링크 클릭 → 해당 섹션으로 부드럽게 이동
   ─────────────────────────────────────────── */
function initSmoothScroll() {
  var navLinks = document.querySelectorAll('.sidebar-nav a');

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      var targetId = this.getAttribute('href');
      var targetEl = document.querySelector(targetId);

      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
}

/* ───────────────────────────────────────────
   3. 복사 기능
   - .copy-btn 클릭 → data-copy 값 클립보드 복사
   - 성공 시 '복사완료 ✓' 표시, 2초 후 원래 텍스트 복원
   ─────────────────────────────────────────── */
function initCopyButtons() {
  var copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var textToCopy = this.getAttribute('data-copy');
      var originalText = this.textContent;
      var button = this;

      navigator.clipboard.writeText(textToCopy).then(function () {
        button.textContent = '복사완료 ✓';
        setTimeout(function () {
          button.textContent = originalText;
        }, 2000);
      });
    });
  });
}

/* ───────────────────────────────────────────
   4. FAQ 아코디언
   - .faq-question 클릭 → 해당 .faq-answer 토글
   - 각 항목 독립 동작 (하나 열어도 다른 건 안 닫힘)
   - slideToggle 효과: max-height 트랜지션
   ─────────────────────────────────────────── */
function initFaqAccordion() {
  var questions = document.querySelectorAll('.faq-question');

  questions.forEach(function (question) {
    question.addEventListener('click', function () {
      var faqItem = this.closest('.faq-item');
      var answer = faqItem.querySelector('.faq-answer');

      if (faqItem.classList.contains('open')) {
        // 닫기: max-height를 0으로
        answer.style.maxHeight = null;
        faqItem.classList.remove('open');
      } else {
        // 열기: 실제 높이만큼 max-height 설정
        answer.style.maxHeight = answer.scrollHeight + 'px';
        faqItem.classList.add('open');
      }
    });
  });
}

/* ───────────────────────────────────────────
   5. 글씨 크기 조절
   - 작게(16px) / 보통(18px) / 크게(22px)
   - localStorage에 저장, 페이지 로드 시 복원
   ─────────────────────────────────────────── */
function initFontControls() {
  var fontControls = document.querySelector('.font-controls');
  if (!fontControls) return;

  var buttons = fontControls.querySelectorAll('button');
  var sizeMap = {
    small: '16px',
    medium: '18px',
    large: '22px'
  };

  // 저장된 글씨 크기 복원
  var savedSize = localStorage.getItem('kavi-font-size');
  if (savedSize) {
    document.documentElement.style.fontSize = savedSize;
    updateActiveButton(buttons, savedSize, sizeMap);
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var size = this.getAttribute('data-size');
      var fontSize = sizeMap[size];

      if (!fontSize) return;

      document.documentElement.style.fontSize = fontSize;
      localStorage.setItem('kavi-font-size', fontSize);
      updateActiveButton(buttons, fontSize, sizeMap);
    });
  });
}

/** 현재 선택된 글씨 크기 버튼에 .active 표시 */
function updateActiveButton(buttons, currentSize, sizeMap) {
  buttons.forEach(function (btn) {
    var size = btn.getAttribute('data-size');
    if (sizeMap[size] === currentSize) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

/* ───────────────────────────────────────────
   6. 카드 진입 애니메이션
   - .step-card가 뷰포트에 들어오면 .visible 추가
   - CSS에서 opacity/translateY 트랜지션 처리
   ─────────────────────────────────────────── */
function initCardAnimation() {
  var cards = document.querySelectorAll('.step-card');

  if (cards.length === 0) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.3 }
  );

  cards.forEach(function (card) {
    observer.observe(card);
  });
}

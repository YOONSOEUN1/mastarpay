// ============================================================
// 마스터페이 - Cloudflare Workers (동적 라우팅 버전)
// - 메인 + 제품 10개: 정적 페이지
// - 지역별 페이지: 동적 생성 (시도/시군구/동/동-제품)
// ============================================================

// ⚠️ brand.png 호스팅 URL
// jsdelivr CDN (GitHub public 저장소를 캐시해주는 안정적 CDN)
const BRAND_PNG_URL = 'https://cdn.jsdelivr.net/gh/YOONSOEUN1/mastarpay@main/images/brand.png';


const PAGE_HOME = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<link rel="icon" type="image/png" href="/brand.png">
<link rel="apple-touch-icon" href="/brand.png">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="naver-site-verification" content="53af8497b3a522a8a85a7b13bae57efd7e27fb5c" />
<title>마스터페이 | 카드단말기·포스기·키오스크 전국 설치 전문</title>
<meta name="description" content="카드단말기, 포스기, 키오스크, 테이블오더, 철거까지. 전국 어디든 매장에 필요한 모든 장비를 한 번에 설치합니다. 무료 상담·빠른 설치·A/S 보장.">
<meta property="og:title" content="마스터페이 | 매장 설비 전국 설치">
<meta property="og:description" content="매장 운영의 모든 것, 마스터페이와 함께.">
<meta property="og:type" content="website">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&display=swap" rel="stylesheet">
<style>/* ========== 공용 스타일 (모든 페이지에서 사용) ========== */

:root {
    --cream: #f7f4ed;
    --cream-dark: #ede8db;
    --ink: #1a1a1a;
    --ink-soft: #4a4a4a;
    --forest: #2d4a3e;
    --forest-dark: #1f352c;
    --coral: #e8763a;
    --border: #d9d3c4;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 80px; }

body {
    font-family: 'Pretendard Variable', Pretendard, -apple-system, sans-serif;
    background: #ffffff;
    color: var(--ink);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
}

a { text-decoration: none; color: inherit; }
img { max-width: 100%; display: block; }

.container {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 32px;
}

/* ========== 헤더 ========== */
header {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    background: var(--cream);
    z-index: 9999 !important;
    border-bottom: 1px solid var(--border);
}
body {
    padding-top: 72px;
}
@media (max-width: 768px) {
    body { padding-top: 60px; }
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 32px;
    max-width: 1240px;
    margin: 0 auto;
}

.logo {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 8px;
}

.logo-mark {
    width: 28px;
    height: 28px;
    background: var(--forest);
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--cream);
    font-size: 14px;
}
.logo-mark-img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    display: inline-block;
    vertical-align: middle;
}

.nav-menu {
    display: flex;
    gap: 40px;
    list-style: none;
}

.nav-menu a {
    font-size: 15px;
    font-weight: 500;
    color: var(--ink-soft);
    transition: color 0.2s;
}

.nav-menu a:hover { color: var(--ink); }

.nav-cta {
    background: var(--ink);
    color: var(--cream);
    padding: 10px 20px;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 600;
    transition: transform 0.2s;
}

.nav-cta:hover { transform: scale(1.03); }

.mobile-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

/* ========== 제품 페이지 전용 ========== */
.product-hero {
    padding: 60px 0 80px;
    position: relative;
    overflow: hidden;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--ink-soft);
    margin-bottom: 32px;
}

.breadcrumb a {
    color: var(--ink-soft);
    transition: color 0.2s;
}

.breadcrumb a:hover { color: var(--ink); }

.breadcrumb-separator {
    opacity: 0.4;
}

.product-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
}

.product-badge {
    display: inline-block;
    padding: 6px 14px;
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
    color: var(--coral);
    margin-bottom: 20px;
}

.product-title {
    font-size: clamp(36px, 5vw, 60px);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
}

.product-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}

.product-lead {
    font-size: 18px;
    color: var(--ink-soft);
    line-height: 1.6;
    margin-bottom: 32px;
}

.product-specs {
    display: flex;
    gap: 32px;
    padding: 24px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    margin-bottom: 32px;
    flex-wrap: wrap;
}

.spec-item .spec-label {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 13px;
    color: var(--coral);
    margin-bottom: 4px;
}

.spec-item .spec-value {
    font-size: 18px;
    font-weight: 700;
}

.product-cta {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.btn {
    padding: 16px 32px;
    border-radius: 100px;
    font-weight: 600;
    font-size: 15px;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid transparent;
}

.btn-primary {
    background: var(--ink);
    color: var(--cream);
}

.btn-primary:hover {
    background: var(--forest);
}

.btn-ghost {
    background: transparent;
    color: var(--ink);
    border-color: var(--border);
}

.btn-ghost:hover {
    background: var(--cream-dark);
}

/* 제품 이미지 영역 */
.product-visual {
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 32px;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 180px;
    position: relative;
    overflow: hidden;
}

.product-visual img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* ========== 특징 섹션 ========== */
.features {
    padding: 100px 0;
    background: var(--cream-dark);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
}

.section-header {
    display: flex;
    align-items: baseline;
    gap: 24px;
    margin-bottom: 64px;
    flex-wrap: wrap;
}

.section-num {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 28px;
    color: var(--coral);
    font-weight: 400;
}

.section-title {
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    flex: 1;
    min-width: 300px;
}

.section-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 2px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 24px;
    overflow: hidden;
}

.feature-item {
    background: var(--cream);
    padding: 40px 32px;
    transition: background 0.3s;
}

.feature-item:hover {
    background: var(--cream-dark);
}

.feature-icon {
    font-size: 36px;
    margin-bottom: 20px;
    display: inline-block;
}

.feature-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 12px;
    letter-spacing: -0.01em;
}

.feature-desc {
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.6;
}

/* ========== 상세 내용 섹션 ========== */
.detail {
    padding: 100px 0;
}

.detail-content {
    max-width: 800px;
    margin: 0 auto;
    font-size: 17px;
    line-height: 1.8;
    color: var(--ink-soft);
}

.detail-content h3 {
    font-size: 28px;
    font-weight: 800;
    color: var(--ink);
    margin: 48px 0 20px;
    letter-spacing: -0.02em;
}

.detail-content h3:first-child {
    margin-top: 0;
}

.detail-content p {
    margin-bottom: 20px;
}

.detail-content ul {
    list-style: none;
    padding: 0;
    margin-bottom: 20px;
}

.detail-content ul li {
    padding: 10px 0 10px 32px;
    position: relative;
    border-bottom: 1px solid var(--border);
}

.detail-content ul li:last-child {
    border-bottom: none;
}

.detail-content ul li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--coral);
    font-weight: 800;
    font-size: 18px;
}

/* ========== 관련 제품 ========== */
.related {
    padding: 100px 0;
    background: var(--cream-dark);
    border-top: 1px solid var(--border);
}

.related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
}

.related-card {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 28px;
    transition: all 0.3s;
    display: block;
}

.related-card:hover {
    transform: translateY(-4px);
    border-color: var(--ink);
}

.related-icon {
    font-size: 36px;
    margin-bottom: 16px;
}

.related-name {
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 6px;
}

.related-desc {
    font-size: 13px;
    color: var(--ink-soft);
}

/* ========== CTA 섹션 ========== */
.cta {
    background: var(--ink);
    color: var(--cream);
    padding: 120px 0;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.cta::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: var(--forest);
    border-radius: 50%;
    top: -300px;
    right: -200px;
    opacity: 0.4;
    filter: blur(80px);
}

.cta-content {
    position: relative;
    z-index: 1;
}

.cta-label {
    font-family: 'Fraunces', serif;
    font-style: italic;
    color: var(--coral);
    font-size: 18px;
    margin-bottom: 20px;
}

.cta h2 {
    font-size: clamp(32px, 5vw, 56px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-bottom: 40px;
}

.cta h2 .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--coral);
}

.cta-phone {
    display: inline-flex;
    align-items: center;
    gap: 16px;
    font-size: 28px;
    font-weight: 800;
    padding: 20px 40px;
    background: #ffffff;
    color: var(--ink);
    border-radius: 100px;
    transition: transform 0.2s;
    margin-bottom: 16px;
}

.cta-phone:hover {
    transform: scale(1.03);
}

.cta-note {
    opacity: 0.7;
    font-size: 14px;
}

/* ========== 푸터 ========== */
footer {
    background: var(--ink);
    color: var(--cream);
    padding: 60px 0 40px;
    border-top: 1px solid rgba(247, 244, 237, 0.1);
}

.footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
}

.footer-brand .logo {
    color: var(--cream);
    margin-bottom: 16px;
}

.footer-brand p {
    font-size: 14px;
    opacity: 0.7;
    max-width: 300px;
    line-height: 1.6;
}

.footer-col h4 {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 16px;
    color: var(--coral);
}

.footer-col ul { list-style: none; }
.footer-col li { margin-bottom: 10px; }

.footer-col a {
    font-size: 14px;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.footer-col a:hover { opacity: 1; }

.footer-bottom {
    padding-top: 30px;
    border-top: 1px solid rgba(247, 244, 237, 0.1);
    font-size: 13px;
    opacity: 0.6;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
}

/* ========== 모바일 대응 ========== */
@media (max-width: 900px) {
    .product-grid {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .footer-grid {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 640px) {
    .container { padding: 0 20px; }
    .nav { padding: 16px 20px; }
    .nav-menu, .nav-cta { display: none; }
    .mobile-toggle { display: block; }
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--cream);
        padding: 20px;
        gap: 20px;
        border-bottom: 1px solid var(--border);
    }
    .product-hero { padding: 40px 0 60px; }
    .features, .detail, .related { padding: 60px 0; }
    .cta { padding: 80px 0; }
    .footer-grid { grid-template-columns: 1fr; }
    .cta-phone { font-size: 20px; padding: 16px 28px; }
    .product-visual { font-size: 100px; }
}



/* ========== 지역 페이지 전용 스타일 (명확한 박스 구조) ========== */

/* 전체 배경 */
body {
    background: var(--cream-dark);
}

/* 히어로 - 중앙정렬 */

.region-thumbnail {
    margin: 0 auto 32px;
    max-width: 980px;
    border-radius: 24px;
    overflow: hidden;
    position: relative;
    aspect-ratio: 16 / 9;
    max-height: 420px;
    background: linear-gradient(135deg, #1a1a1a, #2d4a3e);
    box-shadow: 0 12px 40px rgba(0,0,0,0.18);
}
.region-thumbnail-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: brightness(0.55) saturate(0.85);
}
.region-thumbnail-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.65) 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 56px 48px;
}
.region-thumbnail-badge {
    position: absolute;
    top: 24px;
    right: 24px;
    background: rgba(255,255,255,0.95);
    color: #1a1a1a;
    padding: 8px 16px;
    border-radius: 100px;
    font-size: 13px;
    font-weight: 700;
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    gap: 6px;
    z-index: 2;
}
.region-thumbnail-meta {
    color: rgba(255,255,255,0.85);
    font-size: 13px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 18px;
    letter-spacing: 0.01em;
}
.region-thumbnail-meta span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
}
.region-thumbnail-meta .region-thumbnail-dot {
    opacity: 0.5;
}
.region-thumbnail-title {
    color: #ffffff;
    font-size: clamp(28px, 5.5vw, 48px);
    font-weight: 800;
    margin: 0 0 20px;
    letter-spacing: -0.025em;
    text-shadow: 0 2px 16px rgba(0,0,0,0.4);
    line-height: 1.15;
    max-width: 800px;
}
.region-thumbnail-services {
    color: rgba(255,255,255,0.92);
    font-size: 15px;
    font-weight: 500;
    line-height: 1.6;
    letter-spacing: 0.01em;
    text-shadow: 0 1px 8px rgba(0,0,0,0.3);
    max-width: 640px;
    margin: 0 auto;
}
@media (max-width: 768px) {
    .region-thumbnail { aspect-ratio: 4 / 3; max-height: 320px; max-width: 100%; margin: 0 auto 24px; border-radius: 20px; }
    .region-thumbnail-overlay { padding: 24px 20px; }
    .region-thumbnail-badge { top: 14px; right: 14px; padding: 6px 12px; font-size: 11px; }
    .region-thumbnail-title { font-size: clamp(22px, 6vw, 30px); margin-bottom: 12px; line-height: 1.2; }
    .region-thumbnail-meta { font-size: 11.5px; margin-bottom: 10px; gap: 6px; }
    .region-thumbnail-services { font-size: 12.5px; line-height: 1.5; }
}

.region-hero {
    padding: 60px 0 40px;
    background: var(--cream-dark);
    text-align: center;
}

.region-hero .breadcrumb {
    justify-content: center;
    margin-bottom: 20px;
    font-size: 13px;
    color: var(--ink-soft);
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
}

.region-hero .breadcrumb a {
    color: var(--ink-soft);
    transition: color 0.2s;
}

.region-hero .breadcrumb a:hover { color: var(--ink); }

.region-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 12px;
    color: var(--ink-soft);
    margin-bottom: 24px;
    font-weight: 500;
}

.region-hero-title {
    font-size: clamp(30px, 4.5vw, 46px);
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
}

.region-hero-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}

.region-hero-sub {
    font-size: 16px;
    color: var(--ink-soft);
    line-height: 1.7;
    max-width: 700px;
    margin: 0 auto 28px;
}

/* 썸네일 바로 아래 잔잔한 안내 문구 */
.region-hero-sub-standalone {
    text-align: center;
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.7;
    max-width: 700px;
    margin: -8px auto 28px;
    letter-spacing: -0.005em;
}

/* 히어로 통계 4개 박스 (명확히!) */
.region-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    max-width: 780px;
    margin: 0 auto 28px;
}

.region-stat {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 22px 16px;
    text-align: center;
    transition: all 0.2s;
}

.region-stat:hover {
    border-color: var(--forest);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04);
}

.region-stat-icon {
    font-size: 26px;
    margin-bottom: 6px;
    line-height: 1;
}

.region-stat-label {
    font-size: 11px;
    color: var(--ink-soft);
    margin-bottom: 4px;
}

.region-stat-value {
    font-size: 16px;
    font-weight: 800;
    color: var(--forest);
    letter-spacing: -0.01em;
}

.region-cta {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
}

/* ========== 메인 섹션 - 모두 박스로 감싸기 ========== */
.region-main {
    padding: 40px 0 80px;
    background: var(--cream-dark);
}

.region-main .container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* 모든 콘텐츠를 흰색 박스로! */
.region-box {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 32px 28px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}
.keyword-box {
    background: linear-gradient(135deg, #fff8f0, #fef3e2);
    border: 1px dashed var(--coral);
}
.keyword-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 16px;
}
.keyword-tag {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
    transition: all 0.2s;
    cursor: default;
    display: inline-block;
    word-break: keep-all;
}
.keyword-tag:hover {
    background: var(--forest);
    color: var(--cream);
    border-color: var(--forest);
    transform: translateY(-1px);
}
@media (max-width: 768px) {
    .keyword-tags { gap: 6px; }
    .keyword-tag { font-size: 12px; padding: 6px 12px; }
}

/* 박스 제목 (노란 구분선 + 아이콘) */
.region-box-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 19px;
    font-weight: 800;
    letter-spacing: -0.01em;
    margin: 0 0 16px;
    padding-left: 14px;
    position: relative;
    line-height: 1.3;
}

.region-box-title::before {
    content: '';
    position: absolute;
    left: 0;
    top: 4px;
    bottom: 4px;
    width: 4px;
    background: var(--coral);
    border-radius: 2px;
}

.region-box-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}

.region-box-subtitle {
    font-size: 14px;
    color: var(--ink-soft);
    line-height: 1.7;
    margin: 0 0 20px;
}

.region-box p {
    font-size: 14px;
    color: var(--ink-soft);
    line-height: 1.8;
    margin: 0 0 12px;
}

.region-box p:last-child { margin-bottom: 0; }

.region-box strong { color: var(--ink); font-weight: 700; }

/* 인트로 노란 박스 */
.region-intro-box {
    background: #fef8e6;
    border: 1px solid #f5e8b0;
    border-radius: 16px;
    padding: 20px 24px;
    display: flex;
    gap: 16px;
    align-items: flex-start;
}

.region-intro-icon {
    font-size: 28px;
    flex-shrink: 0;
}

.region-intro-text strong {
    display: block;
    font-size: 15px;
    margin-bottom: 4px;
    color: var(--ink);
    font-weight: 700;
}

.region-intro-text p {
    font-size: 13px;
    color: var(--ink-soft);
    line-height: 1.6;
    margin: 0;
}

/* 특징 카드 4개 (박스 내부) */
.region-features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
}

.region-feature-card {
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 20px 18px;
    transition: all 0.2s;
}

.region-feature-card:hover {
    background: var(--cream);
    border-color: var(--forest);
    transform: translateY(-2px);
}

.region-feature-card .fi-icon {
    font-size: 26px;
    margin-bottom: 10px;
    line-height: 1;
}

.region-feature-card h3 {
    font-size: 14px;
    font-weight: 700;
    margin: 0 0 6px;
    letter-spacing: -0.01em;
    color: var(--ink);
}

.region-feature-card p {
    font-size: 12px;
    color: var(--ink-soft);
    line-height: 1.6;
    margin: 0;
}

/* 번호 카드 4개 */
.region-numbered-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
}

.region-numbered-card {
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 22px 20px;
    position: relative;
}

.region-numbered-card .num-circle {
    width: 30px;
    height: 30px;
    background: var(--ink);
    color: var(--cream);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 13px;
    margin-bottom: 12px;
    font-family: 'Fraunces', serif;
    font-style: italic;
}

.region-numbered-card h3 {
    font-size: 15px;
    font-weight: 700;
    margin: 0 0 8px;
    letter-spacing: -0.01em;
    color: var(--ink);
}

.region-numbered-card p {
    font-size: 12px;
    color: var(--ink-soft);
    line-height: 1.7;
    margin: 0;
}

/* 간단 제품 그리드 (이모지+이름) */
.region-products-simple {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 10px;
}
/* === 새 콘텐츠 (제품 5줄 / 지역×제품 본문) 스타일 === */
.region-product-desc-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 0;
    padding: 0;
}
.region-product-desc-list li {
    padding-left: 24px;
    position: relative;
    font-size: 14.5px;
    line-height: 1.75;
    color: var(--ink-soft);
}
.region-product-desc-list li::before {
    content: '';
    position: absolute;
    left: 0; top: 10px;
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--forest);
}
.region-section-text {
    font-size: 14.5px;
    color: var(--ink-soft);
    line-height: 1.85;
    margin: 0;
}
.region-cautions-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 4px;
}
.region-caution-item {
    display: flex;
    gap: 14px;
    background: white;
    border-radius: 14px;
    padding: 16px 18px;
    border: 1px solid var(--border);
}
.region-caution-item .caution-num {
    width: 26px; height: 26px;
    background: var(--coral);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 12px;
    flex-shrink: 0;
}
.region-caution-item h3 {
    font-size: 14.5px;
    margin: 2px 0 4px;
    font-weight: 700;
}
.region-caution-item p {
    font-size: 13.5px;
    color: var(--ink-soft);
    line-height: 1.7;
    margin: 0;
}
.region-products-detail-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
}
.region-product-detail-card {
    background: white;
    border-radius: 14px;
    padding: 18px 20px;
    border: 1px solid var(--border);
}
.region-product-detail-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
}
.region-product-emoji { font-size: 22px; }
.region-product-detail-img { width: 36px; height: 36px; object-fit: contain; }
.region-product-detail-card h3 {
    font-size: 16px;
    font-weight: 700;
    margin: 0;
}
.region-product-detail-card ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 0;
    margin: 0;
}
.region-product-detail-card li {
    font-size: 13px;
    line-height: 1.7;
    padding-left: 14px;
    position: relative;
    color: var(--ink-soft);
}
.region-product-detail-card li::before {
    content: '·';
    position: absolute;
    left: 4px;
    font-weight: 800;
    color: var(--forest);
}
.region-intro-box {
    display: flex;
    gap: 18px;
    align-items: flex-start;
}
.region-intro-icon {
    font-size: 28px;
    flex-shrink: 0;
}
.region-intro-text strong {
    display: block;
    font-size: 15px;
    margin-bottom: 6px;
    font-weight: 700;
}
.region-intro-text p {
    font-size: 14px;
    color: var(--ink-soft);
    line-height: 1.8;
    margin: 0;
}

.region-product-simple {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px 12px;
    text-align: center;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: 130px;
}

.region-product-simple:hover {
    transform: translateY(-2px);
    border-color: var(--forest);
    background: #ffffff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}

/* 이미지/아이콘 영역 - 고정 높이로 가운데 정렬 */
.region-product-simple .ps-icon,
.region-product-simple .ps-img {
    height: 70px;
    width: auto;
    max-width: 100%;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
.region-product-simple .ps-icon {
    font-size: 36px;
    line-height: 1;
    width: 70px;
}
.region-product-simple .ps-img {
    object-fit: contain;
    transition: transform 0.3s;
    max-height: 70px;
}
.region-product-simple:hover .ps-img {
    transform: scale(1.05);
}
.region-product-simple .ps-name {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: -0.01em;
    line-height: 1.3;
    width: 100%;
    margin-top: auto;
}

/* 추천 업종 */
.region-biz-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 10px;
}

.region-biz-card {
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px 16px;
    display: flex;
    gap: 10px;
    align-items: center;
}

.region-biz-icon {
    font-size: 22px;
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--cream);
    border-radius: 8px;
    border: 1px solid var(--border);
}

.region-biz-info {
    flex: 1;
    min-width: 0;
}

.region-biz-name {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 2px;
}

.region-biz-effect {
    font-size: 11px;
    color: var(--ink-soft);
}

.region-biz-stars {
    color: var(--coral);
    font-size: 10px;
    letter-spacing: 1px;
    flex-shrink: 0;
}

/* FAQ */
.region-faq-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.region-faq-item {
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 16px 20px;
}

.region-faq-item strong {
    display: block;
    font-size: 14px;
    color: var(--ink);
    margin-bottom: 8px;
    font-weight: 700;
}

.region-faq-item p {
    font-size: 13px;
    color: var(--ink-soft);
    line-height: 1.7;
    margin: 0;
}

/* 지역 리스트 (카드형) */
.region-list-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
}

.region-list-card {
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s;
    gap: 10px;
}

.region-list-card:hover {
    border-color: var(--forest);
    background: var(--cream);
    transform: translateX(3px);
}

.region-list-info { flex: 1; min-width: 0; }

.region-list-name {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 2px;
    display: flex;
    align-items: center;
    gap: 5px;
}

.region-list-desc {
    font-size: 11px;
    color: var(--ink-soft);
}

.region-list-arrow {
    font-size: 14px;
    color: var(--ink-soft);
    opacity: 0.5;
    transition: all 0.2s;
}

.region-list-card:hover .region-list-arrow {
    opacity: 1;
    color: var(--forest);
}

/* 다른 시도 칩 */
.region-chips-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
}

.region-chip {
    display: inline-flex;
    align-items: center;
    padding: 8px 16px;
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 12px;
    font-weight: 600;
    color: var(--ink);
    transition: all 0.15s;
}

.region-chip:hover {
    background: var(--forest);
    border-color: var(--forest);
    color: var(--cream);
}

/* 리뷰 */
.region-reviews-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 12px;
}

.region-review {
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 20px 22px;
}

.region-review-stars {
    color: var(--coral);
    font-size: 13px;
    margin-bottom: 10px;
    letter-spacing: 2px;
}

.region-review p {
    font-size: 13px;
    color: var(--ink);
    line-height: 1.7;
    margin: 0 0 12px;
    font-weight: 500;
}

.region-review-author {
    font-size: 11px;
    color: var(--ink-soft);
    padding-top: 10px;
    border-top: 1px solid var(--border);
}

/* 도입 효과 */
.region-effect-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 10px;
}

.region-effect-item {
    text-align: center;
    padding: 22px 16px;
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 12px;
}

.region-effect-num {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    font-size: clamp(26px, 3.5vw, 34px);
    color: var(--forest);
    line-height: 1;
    margin-bottom: 6px;
}

.region-effect-label {
    font-size: 11px;
    color: var(--ink-soft);
}

/* CTA 박스 */
.region-cta-box {
    background: var(--ink);
    color: var(--cream);
    border-radius: 20px;
    padding: 40px 28px;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.region-cta-box::before {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    background: var(--forest);
    border-radius: 50%;
    top: -150px;
    right: -80px;
    opacity: 0.3;
    filter: blur(50px);
}

.region-cta-box h3 {
    font-size: clamp(20px, 2.5vw, 26px);
    font-weight: 800;
    margin: 0 0 10px;
    position: relative;
    z-index: 1;
}

.region-cta-box p {
    font-size: 13px;
    opacity: 0.85;
    margin: 0 0 20px;
    position: relative;
    z-index: 1;
}

.region-cta-buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;
}

.region-cta-box .btn-primary {
    background: #ffffff;
    color: var(--ink);
}

.region-cta-box .btn-primary:hover {
    background: var(--coral);
    color: var(--cream);
}

.region-cta-box .btn-ghost {
    border-color: rgba(247, 244, 237, 0.3);
    color: var(--cream);
}

.region-cta-box .btn-ghost:hover {
    background: rgba(247, 244, 237, 0.1);
}

/* 제품 상세 내용 (리스트/h3) */
.region-box h3 {
    font-size: 15px;
    font-weight: 800;
    margin: 20px 0 10px;
    letter-spacing: -0.01em;
    color: var(--ink);
    padding-left: 10px;
    border-left: 3px solid var(--forest);
}

.region-box h3:first-child { margin-top: 0; }

.region-box ul {
    padding-left: 0;
    list-style: none;
    margin: 0 0 16px;
}

.region-box ul li {
    padding: 8px 0 8px 22px;
    position: relative;
    font-size: 13px;
    color: var(--ink-soft);
    line-height: 1.6;
}

.region-box ul li::before {
    content: '✓';
    position: absolute;
    left: 0;
    top: 8px;
    color: var(--forest);
    font-weight: 700;
    font-size: 13px;
}

.region-box ul li strong {
    color: var(--ink);
    font-weight: 700;
}

/* 2단 그리드 (박스 안에 박스) */
.region-split {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
}

.region-inner-box {
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 20px 22px;
}

.region-inner-box h4 {
    font-size: 14px;
    font-weight: 800;
    margin: 0 0 10px;
    color: var(--ink);
    display: flex;
    align-items: center;
    gap: 6px;
}

.region-inner-box p {
    font-size: 13px;
    color: var(--ink-soft);
    line-height: 1.7;
    margin: 0;
}

.region-inner-box ul { margin: 0; }

/* 모바일 */
@media (max-width: 640px) {
    .region-hero { padding: 40px 0 30px; }
    .region-main { padding: 30px 0 60px; }
    .region-box { padding: 24px 20px; }
    .region-cta-box { padding: 32px 20px; }
    .region-stats-grid { grid-template-columns: repeat(2, 1fr); }
    .region-effect-grid { grid-template-columns: repeat(2, 1fr); }
    .region-products-simple { grid-template-columns: repeat(3, 1fr); }
    .region-hero-sub-standalone { font-size: 13.5px; padding: 0 8px; margin: -4px auto 22px; }
}


/* 모든 .italic 클래스 비활성화 - 글씨체 통일 */
.italic {
    font-family: inherit !important;
    font-style: normal !important;
    font-weight: inherit !important;
    color: inherit !important;
}


/* ========== 문의 폼 섹션 ========== */
.contact-section {
    padding: 100px 0;
    background: var(--cream-dark);
}
.contact-section .container {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 60px;
    align-items: start;
    max-width: 1140px;
}
.contact-intro {
    position: sticky;
    top: 100px;
}
.contact-intro .cta-label {
    text-align: left;
    font-size: 13px;
    font-weight: 700;
    color: var(--coral);
    letter-spacing: 3px;
    margin-bottom: 16px;
}
.contact-title {
    font-size: clamp(32px, 4vw, 48px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0 0 16px;
}
.contact-sub {
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.7;
    margin: 0 0 32px;
}
.contact-direct {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.contact-direct-btn {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 22px;
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 14px;
    transition: all 0.2s;
    text-decoration: none;
    color: inherit;
}
.contact-direct-btn:hover {
    border-color: var(--forest);
    transform: translateX(4px);
}
.contact-direct-btn .cd-icon {
    width: 44px;
    height: 44px;
    background: var(--cream-dark);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
}
.cd-label {
    display: block;
    font-size: 12px;
    color: var(--ink-soft);
    margin-bottom: 2px;
}
.cd-value {
    display: block;
    font-size: 16px;
    font-weight: 700;
    color: var(--ink);
}

/* 문의 폼 박스 */
.contact-form-box {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 40px 36px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}
.contact-form-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 22px;
    font-weight: 800;
    margin: 0 0 28px;
    letter-spacing: -0.01em;
}
.cf-bar {
    width: 4px;
    height: 22px;
    background: var(--coral);
    border-radius: 2px;
}
.contact-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.form-group {
    display: flex;
    flex-direction: column;
}
.form-group label {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 8px;
}
.required {
    color: var(--coral);
}
.form-group input,
.form-group select,
.form-group textarea {
    padding: 14px 16px;
    font-size: 14px;
    font-family: inherit;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: #fafafa;
    color: var(--ink);
    transition: all 0.2s;
    width: 100%;
    box-sizing: border-box;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--forest);
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(45, 74, 62, 0.1);
}
.form-group input::placeholder,
.form-group textarea::placeholder {
    color: #b0b0b0;
}
.form-group textarea {
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
}
.form-group select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23666' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    background-size: 10px;
    padding-right: 40px;
}
.form-agree {
    padding: 16px;
    background: #fafafa;
    border-radius: 10px;
    border: 1px solid var(--border);
}
.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
}
.checkbox-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--forest);
    cursor: pointer;
}
.agree-detail {
    font-size: 11px;
    color: var(--ink-soft);
    margin-top: 8px;
    padding-left: 26px;
    line-height: 1.6;
}
.contact-submit {
    background: var(--ink);
    color: #ffffff;
    border: none;
    padding: 18px 28px;
    font-size: 16px;
    font-weight: 700;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    margin-top: 8px;
}
.contact-submit:hover {
    background: var(--forest);
    transform: translateY(-2px);
}
.contact-submit:disabled {
    background: #999;
    cursor: not-allowed;
    transform: none;
}
.form-message {
    padding: 20px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    display: none;
    margin-top: 16px;
}
.form-message.success {
    display: block;
    background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
    color: #1b5e20;
    border: 2px solid #66bb6a;
    box-shadow: 0 4px 16px rgba(76, 175, 80, 0.2);
    animation: messagePop 0.4s ease;
}
.form-message.error {
    display: block;
    background: linear-gradient(135deg, #ffebee, #ffcdd2);
    color: #b71c1c;
    border: 2px solid #ef5350;
    box-shadow: 0 4px 16px rgba(244, 67, 54, 0.2);
    animation: messagePop 0.4s ease;
}
@keyframes messagePop {
    0% { transform: scale(0.9); opacity: 0; }
    60% { transform: scale(1.02); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}

/* 모바일 */
@media (max-width: 900px) {
    .contact-section .container {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .contact-intro {
        position: static;
        text-align: center;
    }
    .contact-intro .cta-label { text-align: center; }
    .contact-direct-btn { flex-direction: row; text-align: left; }
    .contact-form-box { padding: 28px 24px; }
}

/* ========== 플로팅 버튼 ========== */
.floating-buttons {
    position: fixed;
    right: 20px;
    bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 999;
}
.fab-btn {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transition: all 0.2s;
    text-decoration: none;
    position: relative;
}
.fab-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}
.fab-btn.fab-contact {
    background: #4a90e2;
    color: #ffffff;
}
.fab-btn.fab-kakao {
    background: #FEE500;
    color: #000000;
}
.fab-btn.fab-phone {
    background: var(--coral);
    color: #ffffff;
}
.fab-btn::before {
    content: attr(data-tooltip);
    position: absolute;
    right: calc(100% + 12px);
    top: 50%;
    transform: translateY(-50%);
    background: var(--ink);
    color: #ffffff;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
}
.fab-btn:hover::before {
    opacity: 1;
}

/* 모바일에서 플로팅 버튼 */
@media (max-width: 640px) {
    .floating-buttons {
        right: 14px;
        bottom: 14px;
        gap: 8px;
    }
    .fab-btn {
        width: 50px;
        height: 50px;
        font-size: 22px;
    }
    .fab-btn::before { display: none; }
}


/* ============================================================
   📱 모바일 반응형 종합 보강 (일괄 패치)
   ============================================================ */

/* 가로 스크롤 방지 (가장 중요) */
html, body {
    overflow-x: hidden;
    width: 100%;
    -webkit-text-size-adjust: 100%;
}

* { max-width: 100%; }
img, video, iframe { max-width: 100%; height: auto; }
table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }

/* 768px 이하 (태블릿 ↓) */
@media (max-width: 768px) {
    .container { padding: 0 16px !important; }
    
    /* 본문 텍스트 가독성 */
    body { font-size: 15px; line-height: 1.7; }
    h1 { font-size: clamp(22px, 5.5vw, 30px) !important; line-height: 1.25 !important; word-break: keep-all; }
    h2 { font-size: clamp(18px, 4.5vw, 24px) !important; line-height: 1.3 !important; word-break: keep-all; }
    h3 { font-size: clamp(15px, 4vw, 18px) !important; line-height: 1.35 !important; }
    p { word-break: keep-all; line-height: 1.75; }
    
    /* 헤더/네비 */
    .nav { padding: 14px 0 !important; }
    .nav-menu { display: none !important; }
    .mobile-toggle { display: block !important; font-size: 22px; background: none; border: 0; cursor: pointer; padding: 6px 10px; }
    .nav-menu.active { display: flex !important; flex-direction: column; position: absolute; top: 100%; left: 0; right: 0; background: var(--cream); padding: 16px; gap: 14px; border-top: 1px solid var(--border); z-index: 100; }
    .nav-cta { padding: 8px 14px !important; font-size: 13px !important; }
    .logo { font-size: 17px !important; gap: 8px !important; }
    .logo-mark, .logo-mark-img { width: 24px !important; height: 24px !important; font-size: 12px !important; }
    
    /* 그리드들 → 1열 */
    .region-features-grid,
    .region-biz-grid,
    .region-reviews-grid,
    .region-products-grid,
    .footer-grid,
    .features-grid,
    .product-cards-grid,
    .pricing-grid,
    .review-grid,
    .stat-cards { grid-template-columns: 1fr !important; gap: 12px !important; }
    
    /* 시도/시군구 통계 → 2열 (너무 좁아지면 1열) */
    .region-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
    
    /* 지역 리스트(시군구·동) → 2~3열 */
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; font-size: 13px; }
    
    /* 제품 그리드 → 2열 */
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
    
    /* 박스 패딩 축소 */
    .region-box { padding: 20px 18px !important; border-radius: 14px !important; margin-bottom: 14px !important; }
    .region-box-title { font-size: 17px !important; margin-bottom: 12px !important; }
    
    /* 썸네일 (Hero) */
    .region-thumbnail { max-width: 100% !important; max-height: 280px !important; aspect-ratio: 4/3 !important; margin: 0 auto 20px !important; border-radius: 14px !important; }
    .region-thumbnail-overlay { padding: 18px 16px !important; }
    .region-thumbnail-meta { font-size: 11px !important; gap: 6px !important; }
    .region-thumbnail-title { font-size: clamp(20px, 5.5vw, 28px) !important; line-height: 1.2 !important; margin-bottom: 8px !important; }
    .region-thumbnail-services { font-size: 12px !important; line-height: 1.5 !important; }
    .region-hero-sub-standalone { font-size: 14px !important; line-height: 1.7 !important; max-width: 100% !important; padding: 0 4px !important; }
    
    /* 제품 5줄 카드 폰트 축소 */
    .region-product-detail-card { padding: 14px 16px !important; }
    .region-product-detail-card h3 { font-size: 15px !important; }
    .region-product-detail-card li { font-size: 12.5px !important; line-height: 1.65 !important; }
    
    /* FAQ */
    .region-faq-item { padding: 12px 14px !important; }
    .region-faq-item strong { font-size: 13.5px !important; }
    .region-faq-item p { font-size: 12.5px !important; }
    
    /* 주의사항 */
    .region-caution-item { padding: 12px 14px !important; gap: 10px !important; }
    .region-caution-item h3 { font-size: 13.5px !important; }
    .region-caution-item p { font-size: 12.5px !important; }
    
    /* 추천 업종 카드 */
    .region-biz-card { padding: 12px 14px !important; }
    .region-biz-name { font-size: 13.5px !important; }
    .region-biz-effect { font-size: 12px !important; }
    .region-biz-stars { font-size: 11.5px !important; }
    
    /* CTA 박스 */
    .region-cta-box { padding: 24px 18px !important; }
    .region-cta-buttons { flex-direction: column !important; gap: 10px !important; }
    .region-cta-buttons .btn { width: 100% !important; text-align: center; padding: 12px !important; font-size: 14px !important; }
    
    /* 버튼 */
    .btn { font-size: 14px !important; padding: 10px 18px !important; }
    .btn-primary, .btn-ghost { width: auto; }
    
    /* breadcrumb */
    .breadcrumb { font-size: 11.5px !important; flex-wrap: wrap; gap: 4px; }
    
    /* 푸터 */
    footer { padding: 32px 0 24px !important; }
    .footer-grid { gap: 24px !important; }
    .footer-brand .logo { font-size: 18px !important; }
}

/* 480px 이하 (작은 모바일) */
@media (max-width: 480px) {
    .container { padding: 0 14px !important; }
    h1 { font-size: clamp(20px, 6vw, 26px) !important; }
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; font-size: 12.5px; }
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 6px !important; }
    .region-thumbnail { max-height: 240px !important; }
    .region-thumbnail-overlay { padding: 14px 12px !important; }
    .region-thumbnail-services { font-size: 11px !important; }
    .region-hero-sub-standalone { font-size: 13px !important; }
}

/* 360px 이하 (소형 모바일) */
@media (max-width: 360px) {
    .container { padding: 0 12px !important; }
    .region-stats-grid { grid-template-columns: 1fr !important; }
    .region-list-grid { grid-template-columns: 1fr !important; }
    .region-thumbnail-title { font-size: 19px !important; }
}


/* ============================================================
   📱 짤림 방지 추가 패치 (이미지·텍스트 모두)
   ============================================================ */

/* === 모든 화면 크기에서 짤림 방지 === */
* {
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
}

/* 모든 이미지가 부모 박스 안에 들어오도록 강제 */
img, picture, video, svg, canvas, iframe, embed, object {
    max-width: 100% !important;
    height: auto !important;
    display: block;
}

/* 모든 텍스트 박스가 부모 안에 들어오도록 */
p, h1, h2, h3, h4, h5, h6, span, div, li, a, strong, em, td, th {
    word-wrap: break-word;
    overflow-wrap: break-word;
    min-width: 0;
}

/* 한글 단어가 중간에 안 끊기도록 */
p, h1, h2, h3, h4, li {
    word-break: keep-all;
}

/* 영어·URL·이메일·전화번호 같은 긴 문자열 강제 줄바꿈 */
.long-text, code, pre, .url, a[href^="mailto"], a[href^="tel"], .breadcrumb {
    word-break: break-all;
    overflow-wrap: anywhere;
}

/* 그리드 자식이 부모를 넘는 것 방지 */
[class*="grid"], [class*="flex"] {
    min-width: 0;
}
[class*="grid"] > *, [class*="flex"] > * {
    min-width: 0;
    max-width: 100%;
}

/* 768px 이하에서 추가 짤림 방지 */
@media (max-width: 768px) {
    /* body 내부에서 가로로 넘는 요소 강제 정리 */
    body, html { max-width: 100vw !important; overflow-x: hidden !important; }
    
    /* 컨테이너·박스가 절대 가로폭 안 넘게 */
    .container, .region-box, .region-cta-box, header, footer, section {
        max-width: 100% !important;
        box-sizing: border-box !important;
    }
    
    /* 썸네일 안 텍스트도 wrap */
    .region-thumbnail-title, .region-thumbnail-services, .region-thumbnail-meta {
        max-width: 100% !important;
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        white-space: normal !important;
    }
    
    /* 통계 카드 숫자 폰트 축소 */
    .region-stats-grid .region-stat-num,
    .region-stats-grid .region-stat-value,
    [class*="stat-num"], [class*="stat-value"] {
        font-size: clamp(18px, 5vw, 24px) !important;
        word-break: break-all !important;
    }
    
    /* 표 가로 스크롤 처리 */
    table {
        display: block !important;
        overflow-x: auto !important;
        white-space: nowrap;
    }
    
    /* 긴 동 이름(예: "한국토지주택공사동") 줄바꿈 */
    .region-list-grid a, .region-products-simple a {
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        line-height: 1.4 !important;
        padding: 8px 6px !important;
        font-size: 12.5px !important;
        text-align: center;
    }
    
    /* 전화번호·CTA 버튼 텍스트가 안 잘리도록 */
    .btn, .nav-cta, button, a[href^="tel"] {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}

</style>
<style>
/* 메인 페이지 전용 추가 스타일 */
.hero {
    padding: 80px 0 120px;
    position: relative;
    overflow: hidden;
}
.hero-grid {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 40px;
    align-items: start;
}
.hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
    color: var(--ink-soft);
    margin-bottom: 32px;
}
.hero-badge .dot {
    width: 6px;
    height: 6px;
    background: var(--coral);
    border-radius: 50%;
    animation: pulse 2s infinite;
}
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
}
.hero h1 {
    font-size: clamp(40px, 7vw, 88px);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.03em;
    margin-bottom: 32px;
}
.hero h1 .accent { color: var(--forest); }
.hero h1 .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--coral);
}
.hero-sub {
    font-size: 18px;
    color: var(--ink-soft);
    max-width: 520px;
    margin-bottom: 48px;
    line-height: 1.6;
}
.hero-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}
.hero-visual {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 60px;
}
.visual-card {
    background: var(--ink);
    color: var(--cream);
    padding: 24px;
    border-radius: 20px;
    width: 280px;
    transform: rotate(-2deg);
    transition: transform 0.3s;
}
.visual-card:hover {
    transform: rotate(0deg) scale(1.02);
}
.visual-card:nth-child(2) {
    background: var(--forest);
    transform: rotate(3deg) translateX(-30px);
}
.visual-card .icon-big { font-size: 40px; margin-bottom: 16px; }
.visual-card .card-label {
    font-size: 12px;
    opacity: 0.7;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 4px;
}
.visual-card .card-value {
    font-size: 32px;
    font-weight: 700;
    font-family: 'Fraunces', serif;
}
/* 모바일: 회전 없애고 가로 2열 배지 형태로 깔끔하게 */
@media (max-width: 768px) {
    .hero-visual {
        flex-direction: row !important;
        gap: 10px !important;
        padding-top: 28px !important;
        max-width: 100%;
        justify-content: center;
    }
    .visual-card {
        width: auto !important;
        flex: 1 1 0 !important;
        min-width: 0;
        padding: 18px 16px !important;
        border-radius: 14px !important;
        transform: none !important;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .visual-card:nth-child(2) {
        transform: none !important;
    }
    .visual-card:hover {
        transform: translateY(-2px) !important;
    }
    .visual-card .icon-big {
        font-size: 24px !important;
        margin-bottom: 8px !important;
    }
    .visual-card .card-label {
        font-size: 10.5px !important;
        margin-bottom: 4px !important;
        letter-spacing: 0.05em;
    }
    .visual-card .card-value {
        font-size: 22px !important;
        line-height: 1.1 !important;
    }
}
@media (max-width: 360px) {
    .visual-card .card-value { font-size: 19px !important; }
    .visual-card .icon-big { font-size: 20px !important; }
}

/* ========== FIND YOUR SOLUTION 섹션 (새로!) ========== */
.find-section {
    padding: 100px 0;
    background: var(--cream-dark);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
}
.find-label {
    text-align: center;
    font-size: 13px;
    font-weight: 700;
    color: var(--coral);
    letter-spacing: 3px;
    margin-bottom: 16px;
}
.find-title {
    text-align: center;
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin-bottom: 48px;
}
.find-tabs {
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 48px;
}
.find-tab {
    padding: 12px 24px;
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 15px;
    font-weight: 600;
    color: var(--ink-soft);
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}
.find-tab:hover {
    background: var(--cream-dark);
    color: var(--ink);
}
.find-tab.active {
    background: var(--ink);
    color: var(--cream);
    border-color: var(--ink);
}
.find-tab-content {
    max-width: 960px;
    margin: 0 auto;
}
.find-tab-panel {
    display: none;
}
.find-tab-panel.active {
    display: block;
    animation: fadeIn 0.4s ease;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
.region-chips-display {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
}
.region-chip-big {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 12px 20px;
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 15px;
    font-weight: 600;
    color: var(--ink);
    transition: all 0.2s;
}
.region-chip-big:hover {
    background: var(--forest);
    border-color: var(--forest);
    color: var(--cream);
    transform: translateY(-2px);
}
.product-chips-display {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
}


/* ALL-IN-ONE SOLUTION - 제품 카드 그리드 */
.allinone-section {
    padding: 80px 0;
    background: #ffffff;
}
.allinone-products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 14px;
    max-width: 1100px;
    margin: 40px auto 0;
}
.allinone-product-card {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 0;
    overflow: hidden;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
}
.allinone-product-card:hover {
    transform: translateY(-3px);
    border-color: var(--ink);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
}
.allinone-card-visual {
    background: #ffffff;
    aspect-ratio: 1 / 0.75;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid var(--border);
    transition: background 0.3s;
}
.allinone-product-card:hover .allinone-card-visual {
    background: #fafafa;
}
.allinone-card-emoji {
    font-size: 60px;
    line-height: 1;
    transition: transform 0.3s;
}
.allinone-product-card:hover .allinone-card-emoji {
    transform: scale(1.1);
}
/* ALL-IN-ONE 카드 이미지 스타일 */
.allinone-card-img {
    width: 75%;
    height: 75%;
    object-fit: contain;
    transition: transform 0.3s;
}
.allinone-product-card:hover .allinone-card-img {
    transform: scale(1.08);
}

.allinone-card-info {
    padding: 16px 18px 18px;
}
.allinone-card-index {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 11px;
    color: var(--ink-soft);
    margin-bottom: 4px;
}
.allinone-card-name {
    font-size: 15px;
    font-weight: 800;
    letter-spacing: -0.01em;
    margin-bottom: 4px;
    color: var(--ink);
}
.allinone-card-desc {
    font-size: 11px;
    color: var(--ink-soft);
    line-height: 1.5;
    margin-bottom: 12px;
}
.allinone-card-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 11px;
    background: var(--ink);
    color: var(--cream);
    border-radius: 100px;
    font-size: 11px;
    font-weight: 600;
    transition: all 0.2s;
}
.allinone-product-card:hover .allinone-card-btn {
    background: var(--forest);
}

/* 태블릿 크기 */
@media (max-width: 900px) {
    .allinone-products-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
    }
    .allinone-card-emoji { font-size: 50px; }
}

/* 모바일 - 2개씩 배치 */
@media (max-width: 640px) {
    .allinone-section { padding: 50px 0; }
    .allinone-products-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        padding: 0 4px;
    }
    .allinone-card-visual {
        aspect-ratio: 1 / 0.8;
    }
    .allinone-card-emoji { font-size: 44px; }
    .allinone-card-img { width: 80%; height: 80%; }
    .allinone-card-info { padding: 12px 14px 14px; }
    .allinone-card-name { font-size: 13px; }
    .allinone-card-desc { font-size: 10px; margin-bottom: 8px; }
    .allinone-card-btn { font-size: 10px; padding: 5px 9px; }
    .allinone-card-index { font-size: 10px; }
}

/* 아주 작은 화면 */
@media (max-width: 360px) {
    .allinone-card-emoji { font-size: 36px; }
    .allinone-card-info { padding: 10px 12px 12px; }
}

section.main-section {
    padding: 120px 0;
}
.process-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
}
.process-step {
    position: relative;
    padding: 32px 28px;
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 18px;
    transition: transform 0.2s, box-shadow 0.2s;
}
.process-step:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.06);
}
.process-number {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 56px;
    line-height: 1;
    color: var(--forest);
    margin-bottom: 16px;
    display: block;
    font-weight: 600;
}
.process-title {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 8px;
    color: var(--ink);
    letter-spacing: -0.01em;
}
.process-desc {
    font-size: 14px;
    color: var(--ink-soft);
    line-height: 1.7;
    word-break: keep-all;
}
@media (max-width: 768px) {
    .process-list {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 12px;
    }
    .process-step {
        padding: 22px 18px;
    }
    .process-number {
        font-size: 42px;
        margin-bottom: 10px;
    }
    .process-title {
        font-size: 15px;
        margin-bottom: 6px;
    }
    .process-desc {
        font-size: 12.5px;
        line-height: 1.6;
    }
}
.testimonial-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 24px;
}
/* === 후기 슬라이더 (단순 페이드 방식) === */
.testimonial-slider {
    position: relative;
    max-width: 720px;
    margin: 0 auto;
}
.testimonial-track {
    position: relative;
}
.testimonial-track .testimonial {
    display: none;
    animation: fadeInTestimonial 0.6s ease;
}
.testimonial-track .testimonial.active {
    display: block;
}
@keyframes fadeInTestimonial {
    from { opacity: 0; }
    to { opacity: 1; }
}
.testimonial-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 24px;
}
.testimonial-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: var(--cream);
    color: var(--ink);
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    font-family: inherit;
    padding: 0;
    flex-shrink: 0;
}
.testimonial-btn:hover {
    background: var(--forest);
    color: var(--cream);
    border-color: var(--forest);
}
.testimonial-dots {
    display: flex;
    gap: 8px;
    align-items: center;
}
.testimonial-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--border);
    border: 0;
    cursor: pointer;
    transition: all 0.3s;
    padding: 0;
}
.testimonial-dot.active {
    background: var(--forest);
    width: 28px;
    border-radius: 4px;
}
.testimonial {
    padding: 40px 32px;
    border: 1px solid var(--border);
    border-radius: 24px;
    background: #ffffff;
    transition: all 0.3s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}
.testimonial:hover {
    background: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.06);
}
/* 슬라이더 내 카드는 hover transform 제거 (위치 어긋남 방지) */
.testimonial-slider .testimonial:hover {
    transform: none;
}
.quote-mark {
    font-family: 'Fraunces', serif;
    font-size: 64px;
    color: var(--coral);
    line-height: 0.5;
    margin-bottom: 20px;
    display: block;
    font-weight: 400;
}
.testimonial-text {
    font-size: 17px;
    line-height: 1.6;
    margin-bottom: 24px;
    color: var(--ink);
    font-weight: 500;
}
.testimonial-author {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
}
.author-avatar {
    width: 44px;
    height: 44px;
    background: var(--forest);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--cream);
    font-weight: 700;
    font-size: 18px;
}
.author-name { font-weight: 600; font-size: 14px; }
.author-role { font-size: 13px; color: var(--ink-soft); }
.faq-list { max-width: 800px; margin: 0 auto; }
.faq-item {
    border-bottom: 1px solid var(--border);
    padding: 24px 0;
    cursor: pointer;
}
.faq-item:first-child { border-top: 1px solid var(--border); }
.faq-question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: 600;
    gap: 20px;
}
.faq-toggle {
    font-size: 24px;
    color: var(--forest);
    transition: transform 0.3s;
    flex-shrink: 0;
}
.faq-item.open .faq-toggle { transform: rotate(45deg); }
.faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease, padding 0.3s, opacity 0.3s;
    color: var(--ink-soft);
    font-size: 15px;
    line-height: 1.75;
    opacity: 0;
}
.faq-item.open .faq-answer {
    max-height: 800px;
    padding-top: 16px;
    opacity: 1;
}
@media (max-width: 768px) {
    .faq-item { padding: 18px 0; }
    .faq-question { font-size: 15px !important; gap: 12px; }
    .faq-toggle { font-size: 20px; }
    .faq-answer { font-size: 13.5px; line-height: 1.7; }
}
/* 메인의 제품 카드 */
.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
}
.product-card {
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 32px;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 280px;
    position: relative;
    overflow: hidden;
}
.product-card:hover {
    transform: translateY(-4px);
    border-color: var(--ink);
    background: var(--cream);
}
.product-card .card-icon {
    font-size: 52px;
    margin-bottom: 24px;
}
.product-card .card-tag {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 13px;
    color: var(--coral);
    margin-bottom: 6px;
}
.product-card .card-title {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 8px;
    letter-spacing: -0.01em;
}
.product-card .card-desc {
    font-size: 14px;
    color: var(--ink-soft);
    line-height: 1.5;
    margin-bottom: 20px;
}
.product-card .card-arrow {
    font-size: 18px;
    opacity: 0.4;
    transition: all 0.3s;
}
.product-card:hover .card-arrow {
    opacity: 1;
    transform: translateX(8px);
}

@media (max-width: 900px) {
    .hero-grid { grid-template-columns: 1fr; }
    .hero-visual {
        flex-direction: row;
        padding-top: 20px;
        overflow-x: auto;
        padding-bottom: 10px;
    }
    .visual-card { flex-shrink: 0; width: 240px; }
}
@media (max-width: 640px) {
    .hero { padding: 40px 0 80px; }
    section.main-section, .find-section, .allinone-section { padding: 60px 0; }
}

/* ============================================================
   📱 모바일 반응형 종합 보강 (일괄 패치)
   ============================================================ */

/* 가로 스크롤 방지 (가장 중요) */
html, body {
    overflow-x: hidden;
    width: 100%;
    -webkit-text-size-adjust: 100%;
}

* { max-width: 100%; }
img, video, iframe { max-width: 100%; height: auto; }
table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }

/* 768px 이하 (태블릿 ↓) */
@media (max-width: 768px) {
    .container { padding: 0 16px !important; }
    
    /* 본문 텍스트 가독성 */
    body { font-size: 15px; line-height: 1.7; }
    h1 { font-size: clamp(22px, 5.5vw, 30px) !important; line-height: 1.25 !important; word-break: keep-all; }
    h2 { font-size: clamp(18px, 4.5vw, 24px) !important; line-height: 1.3 !important; word-break: keep-all; }
    h3 { font-size: clamp(15px, 4vw, 18px) !important; line-height: 1.35 !important; }
    p { word-break: keep-all; line-height: 1.75; }
    
    /* 헤더/네비 */
    .nav { padding: 14px 0 !important; }
    .nav-menu { display: none !important; }
    .mobile-toggle { display: block !important; font-size: 22px; background: none; border: 0; cursor: pointer; padding: 6px 10px; }
    .nav-menu.active { display: flex !important; flex-direction: column; position: absolute; top: 100%; left: 0; right: 0; background: var(--cream); padding: 16px; gap: 14px; border-top: 1px solid var(--border); z-index: 100; }
    .nav-cta { padding: 8px 14px !important; font-size: 13px !important; }
    .logo { font-size: 17px !important; gap: 8px !important; }
    .logo-mark, .logo-mark-img { width: 24px !important; height: 24px !important; font-size: 12px !important; }
    
    /* 그리드들 → 1열 */
    .region-features-grid,
    .region-biz-grid,
    .region-reviews-grid,
    .region-products-grid,
    .footer-grid,
    .features-grid,
    .product-cards-grid,
    .pricing-grid,
    .review-grid,
    .stat-cards { grid-template-columns: 1fr !important; gap: 12px !important; }
    
    /* 시도/시군구 통계 → 2열 (너무 좁아지면 1열) */
    .region-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
    
    /* 지역 리스트(시군구·동) → 2~3열 */
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; font-size: 13px; }
    
    /* 제품 그리드 → 2열 */
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
    
    /* 박스 패딩 축소 */
    .region-box { padding: 20px 18px !important; border-radius: 14px !important; margin-bottom: 14px !important; }
    .region-box-title { font-size: 17px !important; margin-bottom: 12px !important; }
    
    /* 썸네일 (Hero) */
    .region-thumbnail { max-width: 100% !important; max-height: 280px !important; aspect-ratio: 4/3 !important; margin: 0 auto 20px !important; border-radius: 14px !important; }
    .region-thumbnail-overlay { padding: 18px 16px !important; }
    .region-thumbnail-meta { font-size: 11px !important; gap: 6px !important; }
    .region-thumbnail-title { font-size: clamp(20px, 5.5vw, 28px) !important; line-height: 1.2 !important; margin-bottom: 8px !important; }
    .region-thumbnail-services { font-size: 12px !important; line-height: 1.5 !important; }
    .region-hero-sub-standalone { font-size: 14px !important; line-height: 1.7 !important; max-width: 100% !important; padding: 0 4px !important; }
    
    /* 제품 5줄 카드 폰트 축소 */
    .region-product-detail-card { padding: 14px 16px !important; }
    .region-product-detail-card h3 { font-size: 15px !important; }
    .region-product-detail-card li { font-size: 12.5px !important; line-height: 1.65 !important; }
    
    /* FAQ */
    .region-faq-item { padding: 12px 14px !important; }
    .region-faq-item strong { font-size: 13.5px !important; }
    .region-faq-item p { font-size: 12.5px !important; }
    
    /* 주의사항 */
    .region-caution-item { padding: 12px 14px !important; gap: 10px !important; }
    .region-caution-item h3 { font-size: 13.5px !important; }
    .region-caution-item p { font-size: 12.5px !important; }
    
    /* 추천 업종 카드 */
    .region-biz-card { padding: 12px 14px !important; }
    .region-biz-name { font-size: 13.5px !important; }
    .region-biz-effect { font-size: 12px !important; }
    .region-biz-stars { font-size: 11.5px !important; }
    
    /* CTA 박스 */
    .region-cta-box { padding: 24px 18px !important; }
    .region-cta-buttons { flex-direction: column !important; gap: 10px !important; }
    .region-cta-buttons .btn { width: 100% !important; text-align: center; padding: 12px !important; font-size: 14px !important; }
    
    /* 버튼 */
    .btn { font-size: 14px !important; padding: 10px 18px !important; }
    .btn-primary, .btn-ghost { width: auto; }
    
    /* breadcrumb */
    .breadcrumb { font-size: 11.5px !important; flex-wrap: wrap; gap: 4px; }
    
    /* 푸터 */
    footer { padding: 32px 0 24px !important; }
    .footer-grid { gap: 24px !important; }
    .footer-brand .logo { font-size: 18px !important; }
}

/* 480px 이하 (작은 모바일) */
@media (max-width: 480px) {
    .container { padding: 0 14px !important; }
    h1 { font-size: clamp(20px, 6vw, 26px) !important; }
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; font-size: 12.5px; }
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 6px !important; }
    .region-thumbnail { max-height: 240px !important; }
    .region-thumbnail-overlay { padding: 14px 12px !important; }
    .region-thumbnail-services { font-size: 11px !important; }
    .region-hero-sub-standalone { font-size: 13px !important; }
}

/* 360px 이하 (소형 모바일) */
@media (max-width: 360px) {
    .container { padding: 0 12px !important; }
    .region-stats-grid { grid-template-columns: 1fr !important; }
    .region-list-grid { grid-template-columns: 1fr !important; }
    .region-thumbnail-title { font-size: 19px !important; }
}


/* ============================================================
   📱 짤림 방지 추가 패치 (이미지·텍스트 모두)
   ============================================================ */

/* === 모든 화면 크기에서 짤림 방지 === */
* {
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
}

/* 모든 이미지가 부모 박스 안에 들어오도록 강제 */
img, picture, video, svg, canvas, iframe, embed, object {
    max-width: 100% !important;
    height: auto !important;
    display: block;
}

/* 모든 텍스트 박스가 부모 안에 들어오도록 */
p, h1, h2, h3, h4, h5, h6, span, div, li, a, strong, em, td, th {
    word-wrap: break-word;
    overflow-wrap: break-word;
    min-width: 0;
}

/* 한글 단어가 중간에 안 끊기도록 */
p, h1, h2, h3, h4, li {
    word-break: keep-all;
}

/* 영어·URL·이메일·전화번호 같은 긴 문자열 강제 줄바꿈 */
.long-text, code, pre, .url, a[href^="mailto"], a[href^="tel"], .breadcrumb {
    word-break: break-all;
    overflow-wrap: anywhere;
}

/* 그리드 자식이 부모를 넘는 것 방지 */
[class*="grid"], [class*="flex"] {
    min-width: 0;
}
[class*="grid"] > *, [class*="flex"] > * {
    min-width: 0;
    max-width: 100%;
}

/* 768px 이하에서 추가 짤림 방지 */
@media (max-width: 768px) {
    /* body 내부에서 가로로 넘는 요소 강제 정리 */
    body, html { max-width: 100vw !important; overflow-x: hidden !important; }
    
    /* 컨테이너·박스가 절대 가로폭 안 넘게 */
    .container, .region-box, .region-cta-box, header, footer, section {
        max-width: 100% !important;
        box-sizing: border-box !important;
    }
    
    /* 썸네일 안 텍스트도 wrap */
    .region-thumbnail-title, .region-thumbnail-services, .region-thumbnail-meta {
        max-width: 100% !important;
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        white-space: normal !important;
    }
    
    /* 통계 카드 숫자 폰트 축소 */
    .region-stats-grid .region-stat-num,
    .region-stats-grid .region-stat-value,
    [class*="stat-num"], [class*="stat-value"] {
        font-size: clamp(18px, 5vw, 24px) !important;
        word-break: break-all !important;
    }
    
    /* 표 가로 스크롤 처리 */
    table {
        display: block !important;
        overflow-x: auto !important;
        white-space: nowrap;
    }
    
    /* 긴 동 이름(예: "한국토지주택공사동") 줄바꿈 */
    .region-list-grid a, .region-products-simple a {
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        line-height: 1.4 !important;
        padding: 8px 6px !important;
        font-size: 12.5px !important;
        text-align: center;
    }
    
    /* 전화번호·CTA 버튼 텍스트가 안 잘리도록 */
    .btn, .nav-cta, button, a[href^="tel"] {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}


/* === 온라인 문의 폼 (모든 페이지 공통) === */
.contact-section {
    padding: 100px 0;
    background: var(--cream-dark);
}
.contact-section .container {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 60px;
    align-items: start;
    max-width: 1140px;
}
.contact-intro {
    position: sticky;
    top: 100px;
}
.contact-intro .cta-label {
    text-align: left;
    font-size: 13px;
    font-weight: 700;
    color: var(--coral);
    letter-spacing: 3px;
    margin-bottom: 16px;
}
.contact-title {
    font-size: clamp(32px, 4vw, 48px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0 0 16px;
}
.contact-sub {
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.7;
    margin: 0 0 32px;
}
.contact-direct {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.contact-direct-btn {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 22px;
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 14px;
    transition: all 0.2s;
    text-decoration: none;
    color: inherit;
}
.contact-direct-btn:hover {
    border-color: var(--forest);
    transform: translateX(4px);
}
.contact-direct-btn .cd-icon {
    width: 44px;
    height: 44px;
    background: var(--cream-dark);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
}
.cd-label {
    display: block;
    font-size: 12px;
    color: var(--ink-soft);
    margin-bottom: 2px;
}
.cd-value {
    display: block;
    font-size: 16px;
    font-weight: 700;
    color: var(--ink);
}

/* 문의 폼 박스 */
.contact-form-box {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 40px 36px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}
.contact-form-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 22px;
    font-weight: 800;
    margin: 0 0 28px;
    letter-spacing: -0.01em;
}
.cf-bar {
    width: 4px;
    height: 22px;
    background: var(--coral);
    border-radius: 2px;
}
.contact-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.form-group {
    display: flex;
    flex-direction: column;
}
.form-group label {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 8px;
}
.required {
    color: var(--coral);
}
.form-group input,
.form-group select,
.form-group textarea {
    padding: 14px 16px;
    font-size: 14px;
    font-family: inherit;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: #fafafa;
    color: var(--ink);
    transition: all 0.2s;
    width: 100%;
    box-sizing: border-box;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--forest);
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(45, 74, 62, 0.1);
}
.form-group input::placeholder,
.form-group textarea::placeholder {
    color: #b0b0b0;
}
.form-group textarea {
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
}
.form-group select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23666' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    background-size: 10px;
    padding-right: 40px;
}
.form-agree {
    padding: 16px;
    background: #fafafa;
    border-radius: 10px;
    border: 1px solid var(--border);
}
.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
}
.checkbox-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--forest);
    cursor: pointer;
}
.agree-detail {
    font-size: 11px;
    color: var(--ink-soft);
    margin-top: 8px;
    padding-left: 26px;
    line-height: 1.6;
}
.contact-submit {
    background: var(--ink);
    color: #ffffff;
    border: none;
    padding: 18px 28px;
    font-size: 16px;
    font-weight: 700;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    margin-top: 8px;
}
.contact-submit:hover {
    background: var(--forest);
    transform: translateY(-2px);
}
.contact-submit:disabled {
    background: #999;
    cursor: not-allowed;
    transform: none;
}
.form-message {
    padding: 20px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    display: none;
    margin-top: 16px;
}
.form-message.success {
    display: block;
    background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
    color: #1b5e20;
    border: 2px solid #66bb6a;
    box-shadow: 0 4px 16px rgba(76, 175, 80, 0.2);
    animation: messagePop 0.4s ease;
}
.form-message.error {
    display: block;
    background: linear-gradient(135deg, #ffebee, #ffcdd2);
    color: #b71c1c;
    border: 2px solid #ef5350;
    box-shadow: 0 4px 16px rgba(244, 67, 54, 0.2);
    animation: messagePop 0.4s ease;
}
@keyframes messagePop {
    0% { transform: scale(0.9); opacity: 0; }
    60% { transform: scale(1.02); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}

/* 모바일 */
@media (max-width: 900px) {
    .contact-section .container {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .contact-intro {
        position: static;
        text-align: center;
    }
    .contact-intro .cta-label { text-align: center; }
    .contact-direct-btn { flex-direction: row; text-align: left; }
    .contact-form-box { padding: 28px 24px; }
}

</style>
</head>
<body>

<!-- 헤더 -->
<header>
<nav class="nav">
<a href="/" class="logo">
<img src="/brand.png" alt="마스터페이" class="logo-mark-img">
마스터페이
</a>

<ul class="nav-menu" id="navMenu">
<li><a href="#find-sec">지역별 설치</a></li>
<li><a href="#allinone">제품 안내</a></li>
<li><a href="#process">프로세스</a></li>
<li><a href="#faq">자주 묻는 질문</a></li>
</ul>

<a href="#contact" class="nav-cta">문의하기</a>
<button class="mobile-toggle" onclick="toggleMenu()">☰</button>
</nav>
</header>

<!-- 히어로 -->
<section class="hero">
<div class="container">
<div class="hero-grid">
<div class="hero-text">
<span class="hero-badge">
<span class="dot"></span>
지금 바로 상담 가능
</span>

<h1>
전국 어디든,<br>
매장 설비를<br>
<span class="accent">한 번에</span>.
</h1>

<p class="hero-sub">
카드단말기, 포스기, 키오스크, 테이블오더, 철거까지.
전국 어디든 매장에 필요한 모든 장비를 한 곳에서 설치부터 A/S까지 책임집니다.
</p>

<div class="hero-actions">
<a href="#contact" class="btn btn-primary">
무료 상담 신청 →
</a>
<a href="#find-sec" class="btn btn-ghost">
지역별 찾기
</a>
</div>
</div>

<div class="hero-visual">
<div class="visual-card">
<div class="icon-big">📈</div>
<div class="card-label">누적 설치</div>
<div class="card-value">1,000+</div>
</div>
<div class="visual-card">
<div class="icon-big">✨</div>
<div class="card-label">고객 만족도</div>
<div class="card-value">98%</div>
</div>
</div>
</div>
</div>
</section>

<!-- FIND YOUR SOLUTION — 지역별/제품별 탭 섹션 (NEW!) -->
<section class="find-section" id="find-sec">
<div class="container">
<div class="find-label">FIND YOUR SOLUTION</div>
<h2 class="find-title">매장 운영에 필요한<br>설비를 한 번에 체크하세요</h2>

<div class="find-tabs">
<button class="find-tab active" data-tab="region" onclick="switchFindTab('region')">📍 지역별 설치</button>
<button class="find-tab" data-tab="product" onclick="goToProducts(event)">📦 제품별 안내</button>
<a href="tel:010-2337-0458" class="find-tab">📞 무료 상담</a>
<a href="#contact" class="find-tab" onclick="goToContact(event)">💬 상담 문의</a>
</div>

<div class="find-tab-content">
<!-- 지역별 탭 -->
<div class="find-tab-panel active" id="tab-region">
<div class="region-chips-display">
<a href="/region/seoul" class="region-chip-big">🏙 서울</a>
<a href="/region/gyeonggi" class="region-chip-big">🌿 경기</a>
<a href="/region/incheon" class="region-chip-big">✈️ 인천</a>
<a href="/region/busan" class="region-chip-big">⚓ 부산</a>
<a href="/region/daegu" class="region-chip-big">🏭 대구</a>
<a href="/region/daejeon" class="region-chip-big">🔬 대전</a>
<a href="/region/gwangju" class="region-chip-big">🌸 광주</a>
<a href="/region/ulsan" class="region-chip-big">🔧 울산</a>
<a href="/region/sejong" class="region-chip-big">🏛 세종</a>
<a href="/region/gangwon" class="region-chip-big">🏔 강원</a>
<a href="/region/chungbuk" class="region-chip-big">🌻 충북</a>
<a href="/region/chungnam" class="region-chip-big">🌊 충남</a>
<a href="/region/jeonbuk" class="region-chip-big">🌾 전북</a>
<a href="/region/jeonnam" class="region-chip-big">🍵 전남</a>
<a href="/region/gyeongbuk" class="region-chip-big">🍎 경북</a>
<a href="/region/gyeongnam" class="region-chip-big">🌊 경남</a>
<a href="/region/jeju" class="region-chip-big">🌺 제주</a>
</div>
</div>

<!-- 제품별 탭 -->
<div class="find-tab-panel" id="tab-product">
<div class="product-chips-display">
<a href="/product/pos" class="region-chip-big">🖥️ 포스기</a>
<a href="/product/card-2inch" class="region-chip-big">💳 2인치 단말기</a>
<a href="/product/card-3inch" class="region-chip-big">🖨️ 3인치 단말기</a>
<a href="/product/card-toss" class="region-chip-big">⚡ 토스 단말기</a>
<a href="/product/card-wireless" class="region-chip-big">📱 무선 단말기</a>
<a href="/product/card-bluetooth" class="region-chip-big">🔷 블루투스 단말기</a>
<a href="/product/kiosk" class="region-chip-big">🤖 키오스크</a>
<a href="/product/kiosk-mini" class="region-chip-big">📱 미니 키오스크</a>
<a href="/product/tableorder" class="region-chip-big">📋 테이블 오더</a>
<a href="/product/removal" class="region-chip-big">🔨 매장 철거</a>
</div>
</div>
</div>
</div>
</section>

<!-- ALL-IN-ONE SOLUTION - 제품 카드 그리드 -->
<section class="allinone-section" id="allinone">
<div class="container">
<div class="find-label">ALL-IN-ONE SOLUTION</div>
<h2 class="find-title">매장에 필요한 모든 장비<br>한번에 설치 가능합니다</h2>

<div class="allinone-products-grid">

<a href="/product/pos" class="allinone-product-card">
<div class="allinone-card-visual">
<img src="https://raw.githubusercontent.com/YOONSOEUN1/mastarpay/main/images/pos.jpg" alt="포스기" class="allinone-card-img">
</div>
<div class="allinone-card-info">
<div class="allinone-card-index">01 / 10</div>
<div class="allinone-card-name">포스기(POS)</div>
<div class="allinone-card-desc">주문·결제·매출 통합 관리 시스템</div>
<div class="allinone-card-btn">상세 보기 →</div>
</div>
</a>

<a href="/product/card-2inch" class="allinone-product-card">
<div class="allinone-card-visual">
<img src="https://raw.githubusercontent.com/YOONSOEUN1/mastarpay/main/images/kis2200_2in.jpg" alt="2인치 단말기" class="allinone-card-img">
</div>
<div class="allinone-card-info">
<div class="allinone-card-index">02 / 10</div>
<div class="allinone-card-name">2인치 단말기</div>
<div class="allinone-card-desc">컴팩트 사이즈 카드 단말기</div>
<div class="allinone-card-btn">상세 보기 →</div>
</div>
</a>

<a href="/product/card-3inch" class="allinone-product-card">
<div class="allinone-card-visual">
<img src="https://raw.githubusercontent.com/YOONSOEUN1/mastarpay/main/images/kis1420_3in2.jpg" alt="3인치 단말기" class="allinone-card-img">
</div>
<div class="allinone-card-info">
<div class="allinone-card-index">03 / 10</div>
<div class="allinone-card-name">3인치 단말기</div>
<div class="allinone-card-desc">표준 사이즈 카드 단말기</div>
<div class="allinone-card-btn">상세 보기 →</div>
</div>
</a>

<a href="/product/card-toss" class="allinone-product-card">
<div class="allinone-card-visual">
<img src="https://raw.githubusercontent.com/YOONSOEUN1/mastarpay/main/images/Tosscard.png" alt="토스 단말기" class="allinone-card-img">
</div>
<div class="allinone-card-info">
<div class="allinone-card-index">04 / 10</div>
<div class="allinone-card-name">토스 단말기</div>
<div class="allinone-card-desc">간편결제 특화 단말기</div>
<div class="allinone-card-btn">상세 보기 →</div>
</div>
</a>

<a href="/product/card-wireless" class="allinone-product-card">
<div class="allinone-card-visual">
<img src="https://raw.githubusercontent.com/YOONSOEUN1/mastarpay/main/images/Wirelesscard.png" alt="무선 단말기" class="allinone-card-img">
</div>
<div class="allinone-card-info">
<div class="allinone-card-index">05 / 10</div>
<div class="allinone-card-name">무선 단말기</div>
<div class="allinone-card-desc">이동 결제가 가능한 무선 단말기</div>
<div class="allinone-card-btn">상세 보기 →</div>
</div>
</a>

<a href="/product/card-bluetooth" class="allinone-product-card">
<div class="allinone-card-visual">
<img src="https://raw.githubusercontent.com/YOONSOEUN1/mastarpay/main/images/Bluetoothcard.jpg" alt="블루투스 단말기" class="allinone-card-img">
</div>
<div class="allinone-card-info">
<div class="allinone-card-index">06 / 10</div>
<div class="allinone-card-name">블루투스 단말기</div>
<div class="allinone-card-desc">스마트폰 연동 초소형 단말기</div>
<div class="allinone-card-btn">상세 보기 →</div>
</div>
</a>

<a href="/product/kiosk" class="allinone-product-card">
<div class="allinone-card-visual">
<img src="https://raw.githubusercontent.com/YOONSOEUN1/mastarpay/main/images/Kiosk.png" alt="키오스크" class="allinone-card-img">
</div>
<div class="allinone-card-info">
<div class="allinone-card-index">07 / 10</div>
<div class="allinone-card-name">키오스크</div>
<div class="allinone-card-desc">대형 무인 주문·결제 시스템</div>
<div class="allinone-card-btn">상세 보기 →</div>
</div>
</a>

<a href="/product/kiosk-mini" class="allinone-product-card">
<div class="allinone-card-visual">
<img src="https://raw.githubusercontent.com/YOONSOEUN1/mastarpay/main/images/Kiosk2.png" alt="미니 키오스크" class="allinone-card-img">
</div>
<div class="allinone-card-info">
<div class="allinone-card-index">08 / 10</div>
<div class="allinone-card-name">미니 키오스크</div>
<div class="allinone-card-desc">소형 매장 전용 키오스크</div>
<div class="allinone-card-btn">상세 보기 →</div>
</div>
</a>

<a href="/product/tableorder" class="allinone-product-card">
<div class="allinone-card-visual">
<img src="https://raw.githubusercontent.com/YOONSOEUN1/mastarpay/main/images/tableorder.png" alt="테이블 오더" class="allinone-card-img">
</div>
<div class="allinone-card-info">
<div class="allinone-card-index">09 / 10</div>
<div class="allinone-card-name">테이블 오더</div>
<div class="allinone-card-desc">QR·태블릿 주문 시스템</div>
<div class="allinone-card-btn">상세 보기 →</div>
</div>
</a>

<a href="/product/removal" class="allinone-product-card">
<div class="allinone-card-visual">
<div class="allinone-card-emoji">🔨</div>
</div>
<div class="allinone-card-info">
<div class="allinone-card-index">10 / 10</div>
<div class="allinone-card-name">매장 철거</div>
<div class="allinone-card-desc">철거·원상복구 서비스</div>
<div class="allinone-card-btn">상세 보기 →</div>
</div>
</a>

</div>
</div>
</section>

<!-- 프로세스 -->
<section class="main-section" id="process">
<div class="container">
<div class="section-header">
<span class="section-num">Process</span>
<h2 class="section-title">
어떻게 진행되나요?
</h2>
</div>

<div class="process-list">
<div class="process-step">
<span class="process-number">01</span>
<h3 class="process-title">상담 신청</h3>
<p class="process-desc">전화나 폼으로 간단히 문의를 남기시면 담당자가 빠르게 연락드립니다.</p>
</div>
<div class="process-step">
<span class="process-number">02</span>
<h3 class="process-title">맞춤 제안</h3>
<p class="process-desc">매장 업종과 상황을 듣고 가장 적합한 장비와 설치 방법을 제안해드립니다.</p>
</div>
<div class="process-step">
<span class="process-number">03</span>
<h3 class="process-title">설치 진행</h3>
<p class="process-desc">협의된 일정에 맞춰 전문 엔지니어가 방문하여 설치를 진행합니다.</p>
</div>
<div class="process-step">
<span class="process-number">04</span>
<h3 class="process-title">사후 관리</h3>
<p class="process-desc">설치 후에도 지속적으로 관리하며 문제 발생 시 빠르게 대응합니다.</p>
</div>
</div>
</div>
</section>

<!-- 고객 후기 -->
<section class="main-section" style="background:var(--cream-dark);border-top:1px solid var(--border);border-bottom:1px solid var(--border);">
<div class="container">
<div class="section-header">
<span class="section-num">Voices</span>
<h2 class="section-title">
고객의 목소리를 들어보세요.
</h2>
</div>

<div class="testimonial-slider" id="testimonialSlider">
<div class="testimonial-track" id="testimonialTrack">
<div class="testimonial active">
<span class="quote-mark">"</span>
<p class="testimonial-text">
카드단말기 교체 후 연간 60만원 수수료 절감했어요. 상담부터 설치까지 너무 꼼꼼하게 봐주셨습니다.
</p>
<div class="testimonial-author">
<div class="author-avatar">김</div>
<div>
<div class="author-name">김○○ 사장님</div>
<div class="author-role">서울 강남구 카페</div>
</div>
</div>
</div>

<div class="testimonial">
<span class="quote-mark">"</span>
<p class="testimonial-text">
키오스크 설치 후 홀 인건비가 반으로 줄었어요. 투자 비용 금방 회수했습니다.
</p>
<div class="testimonial-author">
<div class="author-avatar">박</div>
<div>
<div class="author-name">박○○ 사장님</div>
<div class="author-role">부산 해운대구 음식점</div>
</div>
</div>
</div>

<div class="testimonial">
<span class="quote-mark">"</span>
<p class="testimonial-text">
테이블 오더 도입 후 객단가가 25% 올랐어요. 메뉴 사진 보고 추가 주문이 늘어요.
</p>
<div class="testimonial-author">
<div class="author-avatar">이</div>
<div>
<div class="author-name">이○○ 사장님</div>
<div class="author-role">경기 분당구 치킨집</div>
</div>
</div>
</div>

<div class="testimonial">
<span class="quote-mark">"</span>
<p class="testimonial-text">
포스기를 도입하니 매출 분석이 한 화면에서 다 보여서 너무 편해요. 메뉴 추가도 직접 1분이면 끝납니다.
</p>
<div class="testimonial-author">
<div class="author-avatar">최</div>
<div>
<div class="author-name">최○○ 사장님</div>
<div class="author-role">대구 수성구 분식점</div>
</div>
</div>
</div>

<div class="testimonial">
<span class="quote-mark">"</span>
<p class="testimonial-text">
무선 단말기로 바꾸고 나서 손님 응대가 훨씬 빨라졌어요. 야외 테이블에서도 결제가 자유로워서 좋아요.
</p>
<div class="testimonial-author">
<div class="author-avatar">정</div>
<div>
<div class="author-name">정○○ 사장님</div>
<div class="author-role">인천 송도동 카페</div>
</div>
</div>
</div>

<div class="testimonial">
<span class="quote-mark">"</span>
<p class="testimonial-text">
폐업 정리할 때 철거 견적 받아봤는데 가격도 합리적이고 임대인 인계까지 깔끔하게 마무리해주셨어요.
</p>
<div class="testimonial-author">
<div class="author-avatar">윤</div>
<div>
<div class="author-name">윤○○ 사장님</div>
<div class="author-role">광주 동구 음식점</div>
</div>
</div>
</div>
</div>

<div class="testimonial-controls">
<button class="testimonial-btn testimonial-prev" onclick="moveTestimonial(-1)" aria-label="이전 후기">‹</button>
<div class="testimonial-dots" id="testimonialDots"></div>
<button class="testimonial-btn testimonial-next" onclick="moveTestimonial(1)" aria-label="다음 후기">›</button>
</div>
</div>
</div>
</section>

<!-- FAQ -->
<section class="main-section" id="faq">
<div class="container">
<div class="section-header">
<span class="section-num">FAQ</span>
<h2 class="section-title">
자주 묻는 질문들.
</h2>
</div>

<div class="faq-list">
<div class="faq-item" onclick="toggleFaq(this)">
<div class="faq-question">
<span>설치 비용은 얼마인가요?</span>
<span class="faq-toggle">+</span>
</div>
<div class="faq-answer">
대부분의 장비는 무료 설치가 가능합니다. 월 렌탈료 또는 일시불 구매 등 다양한 옵션이 있으며, 정확한 비용은 매장 상황에 따라 달라지므로 상담을 통해 안내해드립니다.
</div>
</div>

<div class="faq-item" onclick="toggleFaq(this)">
<div class="faq-question">
<span>A/S는 어떻게 받나요?</span>
<span class="faq-toggle">+</span>
</div>
<div class="faq-answer">
전화 한 통이면 됩니다. 대부분의 문제는 원격 지원으로 즉시 해결되며, 하드웨어 문제는 엔지니어가 직접 방문하여 처리해드립니다. 계약 기간 내 무상 A/S를 보장합니다.
</div>
</div>

<div class="faq-item" onclick="toggleFaq(this)">
<div class="faq-question">
<span>설치까지 얼마나 걸리나요?</span>
<span class="faq-toggle">+</span>
</div>
<div class="faq-answer">
장비에 따라 다르지만, 간단한 카드단말기는 상담 당일 또는 1~2일 내 설치가 가능합니다. 키오스크나 포스기는 3~7일 정도 소요됩니다.
</div>
</div>

<div class="faq-item" onclick="toggleFaq(this)">
<div class="faq-question">
<span>여러 장비를 함께 설치하면 할인되나요?</span>
<span class="faq-toggle">+</span>
</div>
<div class="faq-answer">
네, 패키지 할인 혜택이 있습니다. 포스기+카드단말기+테이블오더 등을 함께 설치하시면 개별 설치보다 훨씬 저렴하게 이용하실 수 있습니다.
</div>
</div>
</div>
</div>
</section>

<!-- 문의 폼 섹션 -->
<section class="contact-section" id="contact">
<div class="container">
<div class="contact-intro">
<div class="cta-label">— Contact Us —</div>
<h2 class="contact-title">무료 상담 신청</h2>
<p class="contact-sub">전화, 카카오톡 또는 아래 폼으로 문의해주세요.<br>담당자가 빠르게 연락드립니다.</p>

<div class="contact-direct">
<a href="tel:010-2337-0458" class="contact-direct-btn">
<span class="cd-icon">📞</span>
<span>
<span class="cd-label">전화 상담</span>
<span class="cd-value">010-2337-0458</span>
</span>
</a>
<a href="#kakaoChannel" onclick="openKakao(); return false;" class="contact-direct-btn">
<span class="cd-icon">💬</span>
<span>
<span class="cd-label">카카오톡</span>
<span class="cd-value">바로 상담</span>
</span>
</a>
</div>
</div>

<div class="contact-form-box">
<h3 class="contact-form-title">
<span class="cf-bar"></span>
<span>📝 온라인 문의</span>
</h3>

<form id="contactForm" class="contact-form" onsubmit="return submitContactForm(event)">
<div class="form-group">
<label for="name">상호(이름) <span class="required">*</span></label>
<input type="text" id="name" name="상호_이름" placeholder="상호 또는 이름을 입력하세요" required>
</div>

<div class="form-group">
<label for="phone">연락처 <span class="required">*</span></label>
<input type="tel" id="phone" name="연락처" placeholder="010-0000-0000" required>
</div>

<div class="form-group">
<label for="address">주소 <span class="required">*</span></label>
<input type="text" id="address" name="주소" placeholder="매장 주소를 입력하세요 (예: 서울 강남구 테헤란로 1)" required>
<input type="text" id="address_detail" name="상세주소" placeholder="상세주소 (건물명, 층, 호수 등)" style="margin-top: 8px;">
</div>

<div class="form-group">
<label for="product">문의 제품 <span class="required">*</span></label>
<select id="product" name="문의_제품" required>
<option value="">선택해주세요</option>
<option value="포스기">포스기(POS)</option>
<option value="2인치 단말기">2인치 단말기</option>
<option value="3인치 단말기">3인치 단말기</option>
<option value="토스 단말기">토스 단말기</option>
<option value="무선 단말기">무선 단말기</option>
<option value="블루투스 단말기">블루투스 단말기</option>
<option value="키오스크">키오스크</option>
<option value="미니 키오스크">미니 키오스크</option>
<option value="테이블 오더">테이블 오더</option>
<option value="매장 철거">매장 철거</option>
<option value="여러 제품 패키지">여러 제품 패키지</option>
<option value="기타/미정">기타/미정</option>
</select>
</div>

<div class="form-group">
<label for="business">업종</label>
<select id="business" name="업종">
<option value="">선택해주세요</option>
<option value="음식점/식당">음식점/식당</option>
<option value="카페/베이커리">카페/베이커리</option>
<option value="편의점/마트">편의점/마트</option>
<option value="미용실/네일샵">미용실/네일샵</option>
<option value="스터디카페">스터디카페</option>
<option value="주점/호프">주점/호프</option>
<option value="무인매장">무인매장</option>
<option value="의류/잡화">의류/잡화</option>
<option value="병원/약국">병원/약국</option>
<option value="기타">기타</option>
</select>
</div>

<div class="form-group">
<label for="message">문의 내용</label>
<textarea id="message" name="문의_내용" rows="5" placeholder="매장 위치, 현재 사용 장비, 궁금한 점 등을 자유롭게 적어주세요."></textarea>
</div>

<div class="form-agree">
<label class="checkbox-label">
<input type="checkbox" id="agree" required>
<span>개인정보 수집 및 이용에 동의합니다 <span class="required">*</span></span>
</label>
<div class="agree-detail">수집항목: 상호·연락처·주소·문의 내용 / 이용목적: 상담 및 견적 안내 / 보유기간: 3년</div>
</div>

<button type="submit" class="contact-submit" id="submitBtn">
<span id="submitText">무료 상담 신청하기 →</span>
</button>

<div id="formMessage" class="form-message"></div>
</form>
</div>
</div>
</section>

<!-- 푸터 -->
<footer>
<div class="container">
<div class="footer-grid">
<div class="footer-brand">
<div class="logo">
<img src="/brand.png" alt="마스터페이" class="logo-mark-img">
마스터페이
</div>
<p>매장 운영에 필요한 모든 장비<br>설치부터 A/S까지 한번에.</p>
</div>

<div class="footer-col">
<h4>Contact</h4>
<ul>
<li><a href="tel:010-2337-0458">📞 010-2337-0458</a></li>
<li><a href="https://pf.kakao.com/_fPrxbG/chat" target="_blank">💬 카카오톡 상담</a></li>
</ul>
</div>
</div>

<div class="footer-bottom">
<span>© 2026 마스터페이. All rights reserved.</span>
<span>개인정보처리방침 · 이용약관</span>
</div>
</div>
</footer>
<!-- 플로팅 버튼 -->
<div class="floating-buttons">
<a href="javascript:void(0)" class="fab-btn fab-contact" data-tooltip="온라인 문의" onclick="scrollToContact(event)" aria-label="온라인 문의">💬</a>
<a href="javascript:void(0)" class="fab-btn fab-kakao" data-tooltip="카카오톡 상담" onclick="openKakao(); return false;" aria-label="카카오톡 상담">💛</a>
<a href="tel:010-2337-0458" class="fab-btn fab-phone" data-tooltip="전화 상담 010-2337-0458" aria-label="전화 상담">📞</a>
</div>

<script>
// 카카오톡 채널 열기
function openKakao() {
    var kakaoUrl = 'https://pf.kakao.com/_fPrxbG/chat';
    var win = window.open(kakaoUrl, '_blank');
    // 팝업 차단된 경우 같은 탭에서 열기
    if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.href = kakaoUrl;
    }
}

// 문의 섹션으로 스크롤
function scrollToContact(event) {
    event.preventDefault();
    var contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        // 현재 페이지에 contact 섹션이 없으면 메인 페이지의 contact로 이동
        window.location.href = '/#contact';
    }
}

// 문의 폼 제출 (Resend API 사용) - 디버그 모드
async function submitContactForm(event) {
    // 기본 동작 막기 (페이지 새로고침 방지) - 최우선!
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    console.log('[문의폼] submitContactForm 함수 실행 시작');
    
    var form = document.getElementById('contactForm');
    var submitBtn = document.getElementById('submitBtn');
    var submitText = document.getElementById('submitText');
    var formMessage = document.getElementById('formMessage');
    
    if (!form) {
        alert('⚠️ 폼을 찾을 수 없습니다. 새로고침 후 다시 시도해주세요.');
        return false;
    }
    
    // 개인정보 동의 체크
    var agreeCheckbox = document.getElementById('agree');
    if (!agreeCheckbox || !agreeCheckbox.checked) {
        alert('개인정보 수집 및 이용에 동의해주세요.');
        return false;
    }
    
    // 필수 필드 체크
    var name = document.getElementById('name').value.trim();
    var phone = document.getElementById('phone').value.trim();
    var address = document.getElementById('address').value.trim();
    var product = document.getElementById('product').value;
    
    if (!name) { alert('상호(이름)을 입력해주세요.'); document.getElementById('name').focus(); return false; }
    if (!phone) { alert('연락처를 입력해주세요.'); document.getElementById('phone').focus(); return false; }
    if (!address) { alert('주소를 입력해주세요.'); document.getElementById('address').focus(); return false; }
    if (!product) { alert('문의 제품을 선택해주세요.'); document.getElementById('product').focus(); return false; }
    
    console.log('[문의폼] 검증 통과, 전송 시작');
    
    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.textContent = '전송 중...';
    if (formMessage) {
        formMessage.className = 'form-message';
        formMessage.style.display = 'none';
    }
    
    // 폼 데이터 수집
    var data = {
        name: name,
        phone: phone,
        address: address,
        addressDetail: document.getElementById('address_detail').value.trim(),
        product: product,
        business: document.getElementById('business').value,
        message: document.getElementById('message').value.trim(),
    };
    
    console.log('[문의폼] 전송 데이터:', data);
    
    try {
        var response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        console.log('[문의폼] 서버 응답 상태:', response.status);
        
        var result = await response.json();
        console.log('[문의폼] 서버 응답 내용:', result);
        
        if (result.success) {
            if (formMessage) {
                formMessage.className = 'form-message success';
                formMessage.style.display = 'block';
                formMessage.innerHTML = '<div style="text-align:center;padding:24px 20px;"><div style="font-size:48px;margin-bottom:12px;">✅</div><div style="font-size:18px;font-weight:800;color:#2e7d32;margin-bottom:8px;">문의가 성공적으로 접수되었습니다!</div><div style="font-size:14px;color:#555;">24시간 이내에 연락드리겠습니다.<br>급하신 경우 <strong>010-2337-0458</strong>로 연락주세요.</div></div>';
            }
            form.reset();
            // 메시지가 보이도록 스크롤
            setTimeout(function(){ 
                if (formMessage) formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        } else {
            throw new Error(result.error || '전송에 실패했습니다.');
        }
    } catch (error) {
        console.error('[문의폼] 에러 발생:', error);
        var errorMsg = error.message || '전송에 실패했습니다';
        var debugInfo = (result && result.debug) ? '<div style="font-size:11px;background:#f5f5f5;padding:8px;margin-top:10px;border-radius:6px;text-align:left;color:#666;font-family:monospace;word-break:break-all;">' + result.debug + '</div>' : '';
        if (formMessage) {
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
            formMessage.innerHTML = '<div style="text-align:center;padding:20px;"><div style="font-size:40px;margin-bottom:10px;">❌</div><div style="font-size:16px;font-weight:700;margin-bottom:8px;">전송에 실패했습니다</div><div style="font-size:13px;margin-bottom:12px;color:#555;">' + errorMsg + '</div>' + debugInfo + '<div style="font-size:14px;margin-top:12px;"><strong>📞 010-2337-0458</strong><br>또는 카카오톡으로 문의해주세요.</div></div>';
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (submitText) submitText.textContent = '무료 상담 신청하기 →';
    }
    
    return false; // 항상 false 반환해서 폼 제출 막기
}


function toggleMenu() {
    document.getElementById('navMenu').classList.toggle('active');
}

// === 후기 슬라이더 (단순 페이드 방식) ===
(function() {
    let idx = 0;
    let timer = null;
    let total = 0;
    let initialized = false;
    
    function init() {
        try {
            if (initialized) return;
            const track = document.getElementById('testimonialTrack');
            const dotsBox = document.getElementById('testimonialDots');
            if (!track) return;
            
            const items = track.querySelectorAll('.testimonial');
            total = items.length;
            if (total === 0) return;
            
            // 모든 카드 active 제거 → 첫 번째만 활성화
            items.forEach(function(el) { el.classList.remove('active'); });
            items[0].classList.add('active');
            
            // 점 인디케이터 생성
            if (dotsBox) {
                dotsBox.innerHTML = '';
                for (let i = 0; i < total; i++) {
                    const d = document.createElement('button');
                    d.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
                    d.setAttribute('aria-label', (i+1) + '번 후기');
                    d.addEventListener('click', function() {
                        show(i);
                        resetAuto();
                    });
                    dotsBox.appendChild(d);
                }
            }
            
            initialized = true;
            // 자동 회전 시작
            resetAuto();
        } catch(e) {
            console.error('Testimonial init error:', e);
        }
    }
    
    function show(n) {
        try {
            const track = document.getElementById('testimonialTrack');
            const dotsBox = document.getElementById('testimonialDots');
            if (!track) return;
            const items = track.querySelectorAll('.testimonial');
            const dots = dotsBox ? dotsBox.querySelectorAll('.testimonial-dot') : [];
            
            if (n < 0) n = total - 1;
            if (n >= total) n = 0;
            
            items.forEach(function(el) { el.classList.remove('active'); });
            dots.forEach(function(el) { el.classList.remove('active'); });
            
            if (items[n]) items[n].classList.add('active');
            if (dots[n]) dots[n].classList.add('active');
            idx = n;
        } catch(e) {
            console.error('Testimonial show error:', e);
        }
    }
    
    function resetAuto() {
        if (timer) clearInterval(timer);
        timer = setInterval(function() {
            show(idx + 1);
        }, 4000);
    }
    
    window.moveTestimonial = function(dir) {
        show(idx + dir);
        resetAuto();
    };
    
    // 다중 발화 시점 (어느 한 시점에라도 무조건 작동)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    window.addEventListener('load', init);
    setTimeout(init, 100);
    setTimeout(init, 500);
    setTimeout(init, 1500);
})();


function toggleFaq(item) {
    item.classList.toggle('open');
}

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navMenu').classList.remove('active');
    });
});

// 탭 전환
function switchFindTab(tab) {
    document.querySelectorAll('.find-tab').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.find-tab-panel').forEach(el => el.classList.remove('active'));
    
    const tabBtn = document.querySelector('.find-tab[data-tab="' + tab + '"]');
    if (tabBtn) tabBtn.classList.add('active');
    
    const panel = document.getElementById('tab-' + tab);
    if (panel) panel.classList.add('active');
}

// "제품별 안내" 클릭 시 제품 카드 섹션으로 스크롤
function goToProducts(event) {
    if (event) event.preventDefault();
    var section = document.getElementById('allinone');
    if (section) {
        var headerH = 80;
        var top = section.getBoundingClientRect().top + window.pageYOffset - headerH;
        window.scrollTo({ top: top, behavior: 'smooth' });
    }
}

// "상담 문의" 클릭 시 컨택 섹션으로 스크롤
function goToContact(event) {
    if (event) event.preventDefault();
    var section = document.getElementById('contact');
    if (section) {
        var headerH = 80;
        var top = section.getBoundingClientRect().top + window.pageYOffset - headerH;
        window.scrollTo({ top: top, behavior: 'smooth' });
    } else {
        window.location.href = '/#contact';
    }
}


</script>

<!-- 슬라이더 강제 발화 (이전 JS 에러와 격리) -->
<script>
(function() {
    var idx = 0, timer = null, total = 0;
    
    function setupSlider() {
        var track = document.getElementById('testimonialTrack');
        var dotsBox = document.getElementById('testimonialDots');
        if (!track) return false;
        
        var items = track.querySelectorAll('.testimonial');
        total = items.length;
        if (total === 0) return false;
        
        // 모든 카드 active 제거 후 첫 번째만
        for (var i = 0; i < items.length; i++) {
            items[i].classList.remove('active');
        }
        items[0].classList.add('active');
        
        // 점 생성
        if (dotsBox && dotsBox.children.length === 0) {
            for (var j = 0; j < total; j++) {
                (function(n) {
                    var d = document.createElement('button');
                    d.className = 'testimonial-dot' + (n === 0 ? ' active' : '');
                    d.setAttribute('aria-label', (n+1) + '번 후기');
                    d.onclick = function() {
                        showSlide(n);
                        resetAutoTimer();
                    };
                    dotsBox.appendChild(d);
                })(j);
            }
        }
        
        return true;
    }
    
    function showSlide(n) {
        var track = document.getElementById('testimonialTrack');
        var dotsBox = document.getElementById('testimonialDots');
        if (!track) return;
        var items = track.querySelectorAll('.testimonial');
        var dots = dotsBox ? dotsBox.querySelectorAll('.testimonial-dot') : [];
        
        if (n < 0) n = total - 1;
        if (n >= total) n = 0;
        
        for (var i = 0; i < items.length; i++) items[i].classList.remove('active');
        for (var k = 0; k < dots.length; k++) dots[k].classList.remove('active');
        
        if (items[n]) items[n].classList.add('active');
        if (dots[n]) dots[n].classList.add('active');
        idx = n;
    }
    
    function resetAutoTimer() {
        if (timer) clearInterval(timer);
        timer = setInterval(function() {
            showSlide(idx + 1);
        }, 4000);
    }
    
    // moveTestimonial 글로벌 재정의 (확실하게 덮어씀)
    window.moveTestimonial = function(dir) {
        showSlide(idx + dir);
        resetAutoTimer();
    };
    
    // 무조건 작동하도록 다중 시점에서 시도
    function attempt() {
        if (setupSlider()) {
            resetAutoTimer();
            return true;
        }
        return false;
    }
    
    // DOM ready 시점에 시도
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attempt);
    } else {
        attempt();
    }
    
    // load 이벤트에서도 시도
    window.addEventListener('load', attempt);
    
    // 안전장치: 다양한 시점에 재시도
    setTimeout(attempt, 50);
    setTimeout(attempt, 200);
    setTimeout(attempt, 800);
    setTimeout(attempt, 2000);
})();
</script>

</body>
</html>`;

const PAGE_NOT_FOUND = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
<link rel="icon" type="image/png" href="/brand.png">
<link rel="apple-touch-icon" href="/brand.png">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="naver-site-verification" content="53af8497b3a522a8a85a7b13bae57efd7e27fb5c" />
    <title>페이지를 찾을 수 없습니다 | 마스터페이</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&display=swap" rel="stylesheet">
    <style>/* ========== 공용 스타일 (모든 페이지에서 사용) ========== */

:root {
    --cream: #f7f4ed;
    --cream-dark: #ede8db;
    --ink: #1a1a1a;
    --ink-soft: #4a4a4a;
    --forest: #2d4a3e;
    --forest-dark: #1f352c;
    --coral: #e8763a;
    --border: #d9d3c4;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 80px; }

body {
    font-family: 'Pretendard Variable', Pretendard, -apple-system, sans-serif;
    background: var(--cream);
    color: var(--ink);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
}

a { text-decoration: none; color: inherit; }
img { max-width: 100%; display: block; }

.container {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 32px;
}

/* ========== 헤더 ========== */
header {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    background: var(--cream);
    z-index: 9999 !important;
    border-bottom: 1px solid var(--border);
}
body {
    padding-top: 72px;
}
@media (max-width: 768px) {
    body { padding-top: 60px; }
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 32px;
    max-width: 1240px;
    margin: 0 auto;
}

.logo {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 8px;
}

.logo-mark {
    width: 28px;
    height: 28px;
    background: var(--forest);
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--cream);
    font-size: 14px;
}
.logo-mark-img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    display: inline-block;
    vertical-align: middle;
}

.nav-menu {
    display: flex;
    gap: 40px;
    list-style: none;
}

.nav-menu a {
    font-size: 15px;
    font-weight: 500;
    color: var(--ink-soft);
    transition: color 0.2s;
}

.nav-menu a:hover { color: var(--ink); }

.nav-cta {
    background: var(--ink);
    color: var(--cream);
    padding: 10px 20px;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 600;
    transition: transform 0.2s;
}

.nav-cta:hover { transform: scale(1.03); }

.mobile-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

/* ========== 제품 페이지 전용 ========== */
.product-hero {
    padding: 60px 0 80px;
    position: relative;
    overflow: hidden;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--ink-soft);
    margin-bottom: 32px;
}

.breadcrumb a {
    color: var(--ink-soft);
    transition: color 0.2s;
}

.breadcrumb a:hover { color: var(--ink); }

.breadcrumb-separator {
    opacity: 0.4;
}

.product-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
}

.product-badge {
    display: inline-block;
    padding: 6px 14px;
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
    color: var(--coral);
    margin-bottom: 20px;
}

.product-title {
    font-size: clamp(36px, 5vw, 60px);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
}

.product-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}

.product-lead {
    font-size: 18px;
    color: var(--ink-soft);
    line-height: 1.6;
    margin-bottom: 32px;
}

.product-specs {
    display: flex;
    gap: 32px;
    padding: 24px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    margin-bottom: 32px;
    flex-wrap: wrap;
}

.spec-item .spec-label {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 13px;
    color: var(--coral);
    margin-bottom: 4px;
}

.spec-item .spec-value {
    font-size: 18px;
    font-weight: 700;
}

.product-cta {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.btn {
    padding: 16px 32px;
    border-radius: 100px;
    font-weight: 600;
    font-size: 15px;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid transparent;
}

.btn-primary {
    background: var(--ink);
    color: var(--cream);
}

.btn-primary:hover {
    background: var(--forest);
}

.btn-ghost {
    background: transparent;
    color: var(--ink);
    border-color: var(--border);
}

.btn-ghost:hover {
    background: var(--cream-dark);
}

/* 제품 이미지 영역 */
.product-visual {
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 32px;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 180px;
    position: relative;
    overflow: hidden;
}

.product-visual img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* ========== 특징 섹션 ========== */
.features {
    padding: 100px 0;
    background: var(--cream-dark);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
}

.section-header {
    display: flex;
    align-items: baseline;
    gap: 24px;
    margin-bottom: 64px;
    flex-wrap: wrap;
}

.section-num {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 28px;
    color: var(--coral);
    font-weight: 400;
}

.section-title {
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    flex: 1;
    min-width: 300px;
}

.section-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 2px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 24px;
    overflow: hidden;
}

.feature-item {
    background: var(--cream);
    padding: 40px 32px;
    transition: background 0.3s;
}

.feature-item:hover {
    background: var(--cream-dark);
}

.feature-icon {
    font-size: 36px;
    margin-bottom: 20px;
    display: inline-block;
}

.feature-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 12px;
    letter-spacing: -0.01em;
}

.feature-desc {
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.6;
}

/* ========== 상세 내용 섹션 ========== */
.detail {
    padding: 100px 0;
}

.detail-content {
    max-width: 800px;
    margin: 0 auto;
    font-size: 17px;
    line-height: 1.8;
    color: var(--ink-soft);
}

.detail-content h3 {
    font-size: 28px;
    font-weight: 800;
    color: var(--ink);
    margin: 48px 0 20px;
    letter-spacing: -0.02em;
}

.detail-content h3:first-child {
    margin-top: 0;
}

.detail-content p {
    margin-bottom: 20px;
}

.detail-content ul {
    list-style: none;
    padding: 0;
    margin-bottom: 20px;
}

.detail-content ul li {
    padding: 10px 0 10px 32px;
    position: relative;
    border-bottom: 1px solid var(--border);
}

.detail-content ul li:last-child {
    border-bottom: none;
}

.detail-content ul li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--coral);
    font-weight: 800;
    font-size: 18px;
}

/* ========== 관련 제품 ========== */
.related {
    padding: 100px 0;
    background: var(--cream-dark);
    border-top: 1px solid var(--border);
}

.related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
}

.related-card {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 28px;
    transition: all 0.3s;
    display: block;
}

.related-card:hover {
    transform: translateY(-4px);
    border-color: var(--ink);
}

.related-icon {
    font-size: 36px;
    margin-bottom: 16px;
}

.related-name {
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 6px;
}

.related-desc {
    font-size: 13px;
    color: var(--ink-soft);
}

/* ========== CTA 섹션 ========== */
.cta {
    background: var(--ink);
    color: var(--cream);
    padding: 120px 0;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.cta::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: var(--forest);
    border-radius: 50%;
    top: -300px;
    right: -200px;
    opacity: 0.4;
    filter: blur(80px);
}

.cta-content {
    position: relative;
    z-index: 1;
}

.cta-label {
    font-family: 'Fraunces', serif;
    font-style: italic;
    color: var(--coral);
    font-size: 18px;
    margin-bottom: 20px;
}

.cta h2 {
    font-size: clamp(32px, 5vw, 56px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-bottom: 40px;
}

.cta h2 .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--coral);
}

.cta-phone {
    display: inline-flex;
    align-items: center;
    gap: 16px;
    font-size: 28px;
    font-weight: 800;
    padding: 20px 40px;
    background: var(--cream);
    color: var(--ink);
    border-radius: 100px;
    transition: transform 0.2s;
    margin-bottom: 16px;
}

.cta-phone:hover {
    transform: scale(1.03);
}

.cta-note {
    opacity: 0.7;
    font-size: 14px;
}

/* ========== 푸터 ========== */
footer {
    background: var(--ink);
    color: var(--cream);
    padding: 60px 0 40px;
    border-top: 1px solid rgba(247, 244, 237, 0.1);
}

.footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
}

.footer-brand .logo {
    color: var(--cream);
    margin-bottom: 16px;
}

.footer-brand p {
    font-size: 14px;
    opacity: 0.7;
    max-width: 300px;
    line-height: 1.6;
}

.footer-col h4 {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 16px;
    color: var(--coral);
}

.footer-col ul { list-style: none; }
.footer-col li { margin-bottom: 10px; }

.footer-col a {
    font-size: 14px;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.footer-col a:hover { opacity: 1; }

.footer-bottom {
    padding-top: 30px;
    border-top: 1px solid rgba(247, 244, 237, 0.1);
    font-size: 13px;
    opacity: 0.6;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
}

/* ========== 모바일 대응 ========== */
@media (max-width: 900px) {
    .product-grid {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .footer-grid {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 640px) {
    .container { padding: 0 20px; }
    .nav { padding: 16px 20px; }
    .nav-menu, .nav-cta { display: none; }
    .mobile-toggle { display: block; }
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--cream);
        padding: 20px;
        gap: 20px;
        border-bottom: 1px solid var(--border);
    }
    .product-hero { padding: 40px 0 60px; }
    .features, .detail, .related { padding: 60px 0; }
    .cta { padding: 80px 0; }
    .footer-grid { grid-template-columns: 1fr; }
    .cta-phone { font-size: 20px; padding: 16px 28px; }
    .product-visual { font-size: 100px; }
}

/* ============================================================
   📱 모바일 반응형 종합 보강 (일괄 패치)
   ============================================================ */

/* 가로 스크롤 방지 (가장 중요) */
html, body {
    overflow-x: hidden;
    width: 100%;
    -webkit-text-size-adjust: 100%;
}

* { max-width: 100%; }
img, video, iframe { max-width: 100%; height: auto; }
table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }

/* 768px 이하 (태블릿 ↓) */
@media (max-width: 768px) {
    .container { padding: 0 16px !important; }
    
    /* 본문 텍스트 가독성 */
    body { font-size: 15px; line-height: 1.7; }
    h1 { font-size: clamp(22px, 5.5vw, 30px) !important; line-height: 1.25 !important; word-break: keep-all; }
    h2 { font-size: clamp(18px, 4.5vw, 24px) !important; line-height: 1.3 !important; word-break: keep-all; }
    h3 { font-size: clamp(15px, 4vw, 18px) !important; line-height: 1.35 !important; }
    p { word-break: keep-all; line-height: 1.75; }
    
    /* 헤더/네비 */
    .nav { padding: 14px 0 !important; }
    .nav-menu { display: none !important; }
    .mobile-toggle { display: block !important; font-size: 22px; background: none; border: 0; cursor: pointer; padding: 6px 10px; }
    .nav-menu.active { display: flex !important; flex-direction: column; position: absolute; top: 100%; left: 0; right: 0; background: var(--cream); padding: 16px; gap: 14px; border-top: 1px solid var(--border); z-index: 100; }
    .nav-cta { padding: 8px 14px !important; font-size: 13px !important; }
    .logo { font-size: 17px !important; gap: 8px !important; }
    .logo-mark, .logo-mark-img { width: 24px !important; height: 24px !important; font-size: 12px !important; }
    
    /* 그리드들 → 1열 */
    .region-features-grid,
    .region-biz-grid,
    .region-reviews-grid,
    .region-products-grid,
    .footer-grid,
    .features-grid,
    .product-cards-grid,
    .pricing-grid,
    .review-grid,
    .stat-cards { grid-template-columns: 1fr !important; gap: 12px !important; }
    
    /* 시도/시군구 통계 → 2열 (너무 좁아지면 1열) */
    .region-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
    
    /* 지역 리스트(시군구·동) → 2~3열 */
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; font-size: 13px; }
    
    /* 제품 그리드 → 2열 */
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
    
    /* 박스 패딩 축소 */
    .region-box { padding: 20px 18px !important; border-radius: 14px !important; margin-bottom: 14px !important; }
    .region-box-title { font-size: 17px !important; margin-bottom: 12px !important; }
    
    /* 썸네일 (Hero) */
    .region-thumbnail { max-width: 100% !important; max-height: 280px !important; aspect-ratio: 4/3 !important; margin: 0 auto 20px !important; border-radius: 14px !important; }
    .region-thumbnail-overlay { padding: 18px 16px !important; }
    .region-thumbnail-meta { font-size: 11px !important; gap: 6px !important; }
    .region-thumbnail-title { font-size: clamp(20px, 5.5vw, 28px) !important; line-height: 1.2 !important; margin-bottom: 8px !important; }
    .region-thumbnail-services { font-size: 12px !important; line-height: 1.5 !important; }
    .region-hero-sub-standalone { font-size: 14px !important; line-height: 1.7 !important; max-width: 100% !important; padding: 0 4px !important; }
    
    /* 제품 5줄 카드 폰트 축소 */
    .region-product-detail-card { padding: 14px 16px !important; }
    .region-product-detail-card h3 { font-size: 15px !important; }
    .region-product-detail-card li { font-size: 12.5px !important; line-height: 1.65 !important; }
    
    /* FAQ */
    .region-faq-item { padding: 12px 14px !important; }
    .region-faq-item strong { font-size: 13.5px !important; }
    .region-faq-item p { font-size: 12.5px !important; }
    
    /* 주의사항 */
    .region-caution-item { padding: 12px 14px !important; gap: 10px !important; }
    .region-caution-item h3 { font-size: 13.5px !important; }
    .region-caution-item p { font-size: 12.5px !important; }
    
    /* 추천 업종 카드 */
    .region-biz-card { padding: 12px 14px !important; }
    .region-biz-name { font-size: 13.5px !important; }
    .region-biz-effect { font-size: 12px !important; }
    .region-biz-stars { font-size: 11.5px !important; }
    
    /* CTA 박스 */
    .region-cta-box { padding: 24px 18px !important; }
    .region-cta-buttons { flex-direction: column !important; gap: 10px !important; }
    .region-cta-buttons .btn { width: 100% !important; text-align: center; padding: 12px !important; font-size: 14px !important; }
    
    /* 버튼 */
    .btn { font-size: 14px !important; padding: 10px 18px !important; }
    .btn-primary, .btn-ghost { width: auto; }
    
    /* breadcrumb */
    .breadcrumb { font-size: 11.5px !important; flex-wrap: wrap; gap: 4px; }
    
    /* 푸터 */
    footer { padding: 32px 0 24px !important; }
    .footer-grid { gap: 24px !important; }
    .footer-brand .logo { font-size: 18px !important; }
}

/* 480px 이하 (작은 모바일) */
@media (max-width: 480px) {
    .container { padding: 0 14px !important; }
    h1 { font-size: clamp(20px, 6vw, 26px) !important; }
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; font-size: 12.5px; }
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 6px !important; }
    .region-thumbnail { max-height: 240px !important; }
    .region-thumbnail-overlay { padding: 14px 12px !important; }
    .region-thumbnail-services { font-size: 11px !important; }
    .region-hero-sub-standalone { font-size: 13px !important; }
}

/* 360px 이하 (소형 모바일) */
@media (max-width: 360px) {
    .container { padding: 0 12px !important; }
    .region-stats-grid { grid-template-columns: 1fr !important; }
    .region-list-grid { grid-template-columns: 1fr !important; }
    .region-thumbnail-title { font-size: 19px !important; }
}


/* ============================================================
   📱 짤림 방지 추가 패치 (이미지·텍스트 모두)
   ============================================================ */

/* === 모든 화면 크기에서 짤림 방지 === */
* {
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
}

/* 모든 이미지가 부모 박스 안에 들어오도록 강제 */
img, picture, video, svg, canvas, iframe, embed, object {
    max-width: 100% !important;
    height: auto !important;
    display: block;
}

/* 모든 텍스트 박스가 부모 안에 들어오도록 */
p, h1, h2, h3, h4, h5, h6, span, div, li, a, strong, em, td, th {
    word-wrap: break-word;
    overflow-wrap: break-word;
    min-width: 0;
}

/* 한글 단어가 중간에 안 끊기도록 */
p, h1, h2, h3, h4, li {
    word-break: keep-all;
}

/* 영어·URL·이메일·전화번호 같은 긴 문자열 강제 줄바꿈 */
.long-text, code, pre, .url, a[href^="mailto"], a[href^="tel"], .breadcrumb {
    word-break: break-all;
    overflow-wrap: anywhere;
}

/* 그리드 자식이 부모를 넘는 것 방지 */
[class*="grid"], [class*="flex"] {
    min-width: 0;
}
[class*="grid"] > *, [class*="flex"] > * {
    min-width: 0;
    max-width: 100%;
}

/* 768px 이하에서 추가 짤림 방지 */
@media (max-width: 768px) {
    /* body 내부에서 가로로 넘는 요소 강제 정리 */
    body, html { max-width: 100vw !important; overflow-x: hidden !important; }
    
    /* 컨테이너·박스가 절대 가로폭 안 넘게 */
    .container, .region-box, .region-cta-box, header, footer, section {
        max-width: 100% !important;
        box-sizing: border-box !important;
    }
    
    /* 썸네일 안 텍스트도 wrap */
    .region-thumbnail-title, .region-thumbnail-services, .region-thumbnail-meta {
        max-width: 100% !important;
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        white-space: normal !important;
    }
    
    /* 통계 카드 숫자 폰트 축소 */
    .region-stats-grid .region-stat-num,
    .region-stats-grid .region-stat-value,
    [class*="stat-num"], [class*="stat-value"] {
        font-size: clamp(18px, 5vw, 24px) !important;
        word-break: break-all !important;
    }
    
    /* 표 가로 스크롤 처리 */
    table {
        display: block !important;
        overflow-x: auto !important;
        white-space: nowrap;
    }
    
    /* 긴 동 이름(예: "한국토지주택공사동") 줄바꿈 */
    .region-list-grid a, .region-products-simple a {
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        line-height: 1.4 !important;
        padding: 8px 6px !important;
        font-size: 12.5px !important;
        text-align: center;
    }
    
    /* 전화번호·CTA 버튼 텍스트가 안 잘리도록 */
    .btn, .nav-cta, button, a[href^="tel"] {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}


/* === 온라인 문의 폼 (모든 페이지 공통) === */
.contact-section {
    padding: 100px 0;
    background: var(--cream-dark);
}
.contact-section .container {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 60px;
    align-items: start;
    max-width: 1140px;
}
.contact-intro {
    position: sticky;
    top: 100px;
}
.contact-intro .cta-label {
    text-align: left;
    font-size: 13px;
    font-weight: 700;
    color: var(--coral);
    letter-spacing: 3px;
    margin-bottom: 16px;
}
.contact-title {
    font-size: clamp(32px, 4vw, 48px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0 0 16px;
}
.contact-sub {
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.7;
    margin: 0 0 32px;
}
.contact-direct {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.contact-direct-btn {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 22px;
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 14px;
    transition: all 0.2s;
    text-decoration: none;
    color: inherit;
}
.contact-direct-btn:hover {
    border-color: var(--forest);
    transform: translateX(4px);
}
.contact-direct-btn .cd-icon {
    width: 44px;
    height: 44px;
    background: var(--cream-dark);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
}
.cd-label {
    display: block;
    font-size: 12px;
    color: var(--ink-soft);
    margin-bottom: 2px;
}
.cd-value {
    display: block;
    font-size: 16px;
    font-weight: 700;
    color: var(--ink);
}

/* 문의 폼 박스 */
.contact-form-box {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 40px 36px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}
.contact-form-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 22px;
    font-weight: 800;
    margin: 0 0 28px;
    letter-spacing: -0.01em;
}
.cf-bar {
    width: 4px;
    height: 22px;
    background: var(--coral);
    border-radius: 2px;
}
.contact-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.form-group {
    display: flex;
    flex-direction: column;
}
.form-group label {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 8px;
}
.required {
    color: var(--coral);
}
.form-group input,
.form-group select,
.form-group textarea {
    padding: 14px 16px;
    font-size: 14px;
    font-family: inherit;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: #fafafa;
    color: var(--ink);
    transition: all 0.2s;
    width: 100%;
    box-sizing: border-box;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--forest);
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(45, 74, 62, 0.1);
}
.form-group input::placeholder,
.form-group textarea::placeholder {
    color: #b0b0b0;
}
.form-group textarea {
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
}
.form-group select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23666' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    background-size: 10px;
    padding-right: 40px;
}
.form-agree {
    padding: 16px;
    background: #fafafa;
    border-radius: 10px;
    border: 1px solid var(--border);
}
.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
}
.checkbox-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--forest);
    cursor: pointer;
}
.agree-detail {
    font-size: 11px;
    color: var(--ink-soft);
    margin-top: 8px;
    padding-left: 26px;
    line-height: 1.6;
}
.contact-submit {
    background: var(--ink);
    color: #ffffff;
    border: none;
    padding: 18px 28px;
    font-size: 16px;
    font-weight: 700;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    margin-top: 8px;
}
.contact-submit:hover {
    background: var(--forest);
    transform: translateY(-2px);
}
.contact-submit:disabled {
    background: #999;
    cursor: not-allowed;
    transform: none;
}
.form-message {
    padding: 20px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    display: none;
    margin-top: 16px;
}
.form-message.success {
    display: block;
    background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
    color: #1b5e20;
    border: 2px solid #66bb6a;
    box-shadow: 0 4px 16px rgba(76, 175, 80, 0.2);
    animation: messagePop 0.4s ease;
}
.form-message.error {
    display: block;
    background: linear-gradient(135deg, #ffebee, #ffcdd2);
    color: #b71c1c;
    border: 2px solid #ef5350;
    box-shadow: 0 4px 16px rgba(244, 67, 54, 0.2);
    animation: messagePop 0.4s ease;
}
@keyframes messagePop {
    0% { transform: scale(0.9); opacity: 0; }
    60% { transform: scale(1.02); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}

/* 모바일 */
@media (max-width: 900px) {
    .contact-section .container {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .contact-intro {
        position: static;
        text-align: center;
    }
    .contact-intro .cta-label { text-align: center; }
    .contact-direct-btn { flex-direction: row; text-align: left; }
    .contact-form-box { padding: 28px 24px; }
}

</style>
    <style>
        .notfound {
            min-height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 40px 20px;
        }
        .notfound-code {
            font-family: 'Fraunces', serif;
            font-style: italic;
            font-size: clamp(100px, 20vw, 200px);
            line-height: 1;
            color: var(--forest);
            margin-bottom: 20px;
        }
        .notfound h1 {
            font-size: clamp(28px, 5vw, 48px);
            font-weight: 800;
            margin-bottom: 20px;
            letter-spacing: -0.02em;
        }
        .notfound p {
            font-size: 18px;
            color: var(--ink-soft);
            margin-bottom: 32px;
        }
    
/* ============================================================
   📱 모바일 반응형 종합 보강 (일괄 패치)
   ============================================================ */

/* 가로 스크롤 방지 (가장 중요) */
html, body {
    overflow-x: hidden;
    width: 100%;
    -webkit-text-size-adjust: 100%;
}

* { max-width: 100%; }
img, video, iframe { max-width: 100%; height: auto; }
table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }

/* 768px 이하 (태블릿 ↓) */
@media (max-width: 768px) {
    .container { padding: 0 16px !important; }
    
    /* 본문 텍스트 가독성 */
    body { font-size: 15px; line-height: 1.7; }
    h1 { font-size: clamp(22px, 5.5vw, 30px) !important; line-height: 1.25 !important; word-break: keep-all; }
    h2 { font-size: clamp(18px, 4.5vw, 24px) !important; line-height: 1.3 !important; word-break: keep-all; }
    h3 { font-size: clamp(15px, 4vw, 18px) !important; line-height: 1.35 !important; }
    p { word-break: keep-all; line-height: 1.75; }
    
    /* 헤더/네비 */
    .nav { padding: 14px 0 !important; }
    .nav-menu { display: none !important; }
    .mobile-toggle { display: block !important; font-size: 22px; background: none; border: 0; cursor: pointer; padding: 6px 10px; }
    .nav-menu.active { display: flex !important; flex-direction: column; position: absolute; top: 100%; left: 0; right: 0; background: var(--cream); padding: 16px; gap: 14px; border-top: 1px solid var(--border); z-index: 100; }
    .nav-cta { padding: 8px 14px !important; font-size: 13px !important; }
    .logo { font-size: 17px !important; gap: 8px !important; }
    .logo-mark, .logo-mark-img { width: 24px !important; height: 24px !important; font-size: 12px !important; }
    
    /* 그리드들 → 1열 */
    .region-features-grid,
    .region-biz-grid,
    .region-reviews-grid,
    .region-products-grid,
    .footer-grid,
    .features-grid,
    .product-cards-grid,
    .pricing-grid,
    .review-grid,
    .stat-cards { grid-template-columns: 1fr !important; gap: 12px !important; }
    
    /* 시도/시군구 통계 → 2열 (너무 좁아지면 1열) */
    .region-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
    
    /* 지역 리스트(시군구·동) → 2~3열 */
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; font-size: 13px; }
    
    /* 제품 그리드 → 2열 */
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
    
    /* 박스 패딩 축소 */
    .region-box { padding: 20px 18px !important; border-radius: 14px !important; margin-bottom: 14px !important; }
    .region-box-title { font-size: 17px !important; margin-bottom: 12px !important; }
    
    /* 썸네일 (Hero) */
    .region-thumbnail { max-width: 100% !important; max-height: 280px !important; aspect-ratio: 4/3 !important; margin: 0 auto 20px !important; border-radius: 14px !important; }
    .region-thumbnail-overlay { padding: 18px 16px !important; }
    .region-thumbnail-meta { font-size: 11px !important; gap: 6px !important; }
    .region-thumbnail-title { font-size: clamp(20px, 5.5vw, 28px) !important; line-height: 1.2 !important; margin-bottom: 8px !important; }
    .region-thumbnail-services { font-size: 12px !important; line-height: 1.5 !important; }
    .region-hero-sub-standalone { font-size: 14px !important; line-height: 1.7 !important; max-width: 100% !important; padding: 0 4px !important; }
    
    /* 제품 5줄 카드 폰트 축소 */
    .region-product-detail-card { padding: 14px 16px !important; }
    .region-product-detail-card h3 { font-size: 15px !important; }
    .region-product-detail-card li { font-size: 12.5px !important; line-height: 1.65 !important; }
    
    /* FAQ */
    .region-faq-item { padding: 12px 14px !important; }
    .region-faq-item strong { font-size: 13.5px !important; }
    .region-faq-item p { font-size: 12.5px !important; }
    
    /* 주의사항 */
    .region-caution-item { padding: 12px 14px !important; gap: 10px !important; }
    .region-caution-item h3 { font-size: 13.5px !important; }
    .region-caution-item p { font-size: 12.5px !important; }
    
    /* 추천 업종 카드 */
    .region-biz-card { padding: 12px 14px !important; }
    .region-biz-name { font-size: 13.5px !important; }
    .region-biz-effect { font-size: 12px !important; }
    .region-biz-stars { font-size: 11.5px !important; }
    
    /* CTA 박스 */
    .region-cta-box { padding: 24px 18px !important; }
    .region-cta-buttons { flex-direction: column !important; gap: 10px !important; }
    .region-cta-buttons .btn { width: 100% !important; text-align: center; padding: 12px !important; font-size: 14px !important; }
    
    /* 버튼 */
    .btn { font-size: 14px !important; padding: 10px 18px !important; }
    .btn-primary, .btn-ghost { width: auto; }
    
    /* breadcrumb */
    .breadcrumb { font-size: 11.5px !important; flex-wrap: wrap; gap: 4px; }
    
    /* 푸터 */
    footer { padding: 32px 0 24px !important; }
    .footer-grid { gap: 24px !important; }
    .footer-brand .logo { font-size: 18px !important; }
}

/* 480px 이하 (작은 모바일) */
@media (max-width: 480px) {
    .container { padding: 0 14px !important; }
    h1 { font-size: clamp(20px, 6vw, 26px) !important; }
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; font-size: 12.5px; }
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 6px !important; }
    .region-thumbnail { max-height: 240px !important; }
    .region-thumbnail-overlay { padding: 14px 12px !important; }
    .region-thumbnail-services { font-size: 11px !important; }
    .region-hero-sub-standalone { font-size: 13px !important; }
}

/* 360px 이하 (소형 모바일) */
@media (max-width: 360px) {
    .container { padding: 0 12px !important; }
    .region-stats-grid { grid-template-columns: 1fr !important; }
    .region-list-grid { grid-template-columns: 1fr !important; }
    .region-thumbnail-title { font-size: 19px !important; }
}


/* ============================================================
   📱 짤림 방지 추가 패치 (이미지·텍스트 모두)
   ============================================================ */

/* === 모든 화면 크기에서 짤림 방지 === */
* {
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
}

/* 모든 이미지가 부모 박스 안에 들어오도록 강제 */
img, picture, video, svg, canvas, iframe, embed, object {
    max-width: 100% !important;
    height: auto !important;
    display: block;
}

/* 모든 텍스트 박스가 부모 안에 들어오도록 */
p, h1, h2, h3, h4, h5, h6, span, div, li, a, strong, em, td, th {
    word-wrap: break-word;
    overflow-wrap: break-word;
    min-width: 0;
}

/* 한글 단어가 중간에 안 끊기도록 */
p, h1, h2, h3, h4, li {
    word-break: keep-all;
}

/* 영어·URL·이메일·전화번호 같은 긴 문자열 강제 줄바꿈 */
.long-text, code, pre, .url, a[href^="mailto"], a[href^="tel"], .breadcrumb {
    word-break: break-all;
    overflow-wrap: anywhere;
}

/* 그리드 자식이 부모를 넘는 것 방지 */
[class*="grid"], [class*="flex"] {
    min-width: 0;
}
[class*="grid"] > *, [class*="flex"] > * {
    min-width: 0;
    max-width: 100%;
}

/* 768px 이하에서 추가 짤림 방지 */
@media (max-width: 768px) {
    /* body 내부에서 가로로 넘는 요소 강제 정리 */
    body, html { max-width: 100vw !important; overflow-x: hidden !important; }
    
    /* 컨테이너·박스가 절대 가로폭 안 넘게 */
    .container, .region-box, .region-cta-box, header, footer, section {
        max-width: 100% !important;
        box-sizing: border-box !important;
    }
    
    /* 썸네일 안 텍스트도 wrap */
    .region-thumbnail-title, .region-thumbnail-services, .region-thumbnail-meta {
        max-width: 100% !important;
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        white-space: normal !important;
    }
    
    /* 통계 카드 숫자 폰트 축소 */
    .region-stats-grid .region-stat-num,
    .region-stats-grid .region-stat-value,
    [class*="stat-num"], [class*="stat-value"] {
        font-size: clamp(18px, 5vw, 24px) !important;
        word-break: break-all !important;
    }
    
    /* 표 가로 스크롤 처리 */
    table {
        display: block !important;
        overflow-x: auto !important;
        white-space: nowrap;
    }
    
    /* 긴 동 이름(예: "한국토지주택공사동") 줄바꿈 */
    .region-list-grid a, .region-products-simple a {
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        line-height: 1.4 !important;
        padding: 8px 6px !important;
        font-size: 12.5px !important;
        text-align: center;
    }
    
    /* 전화번호·CTA 버튼 텍스트가 안 잘리도록 */
    .btn, .nav-cta, button, a[href^="tel"] {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}


/* === 온라인 문의 폼 (모든 페이지 공통) === */
.contact-section {
    padding: 100px 0;
    background: var(--cream-dark);
}
.contact-section .container {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 60px;
    align-items: start;
    max-width: 1140px;
}
.contact-intro {
    position: sticky;
    top: 100px;
}
.contact-intro .cta-label {
    text-align: left;
    font-size: 13px;
    font-weight: 700;
    color: var(--coral);
    letter-spacing: 3px;
    margin-bottom: 16px;
}
.contact-title {
    font-size: clamp(32px, 4vw, 48px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0 0 16px;
}
.contact-sub {
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.7;
    margin: 0 0 32px;
}
.contact-direct {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.contact-direct-btn {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 22px;
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 14px;
    transition: all 0.2s;
    text-decoration: none;
    color: inherit;
}
.contact-direct-btn:hover {
    border-color: var(--forest);
    transform: translateX(4px);
}
.contact-direct-btn .cd-icon {
    width: 44px;
    height: 44px;
    background: var(--cream-dark);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
}
.cd-label {
    display: block;
    font-size: 12px;
    color: var(--ink-soft);
    margin-bottom: 2px;
}
.cd-value {
    display: block;
    font-size: 16px;
    font-weight: 700;
    color: var(--ink);
}

/* 문의 폼 박스 */
.contact-form-box {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 40px 36px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}
.contact-form-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 22px;
    font-weight: 800;
    margin: 0 0 28px;
    letter-spacing: -0.01em;
}
.cf-bar {
    width: 4px;
    height: 22px;
    background: var(--coral);
    border-radius: 2px;
}
.contact-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.form-group {
    display: flex;
    flex-direction: column;
}
.form-group label {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 8px;
}
.required {
    color: var(--coral);
}
.form-group input,
.form-group select,
.form-group textarea {
    padding: 14px 16px;
    font-size: 14px;
    font-family: inherit;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: #fafafa;
    color: var(--ink);
    transition: all 0.2s;
    width: 100%;
    box-sizing: border-box;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--forest);
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(45, 74, 62, 0.1);
}
.form-group input::placeholder,
.form-group textarea::placeholder {
    color: #b0b0b0;
}
.form-group textarea {
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
}
.form-group select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23666' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    background-size: 10px;
    padding-right: 40px;
}
.form-agree {
    padding: 16px;
    background: #fafafa;
    border-radius: 10px;
    border: 1px solid var(--border);
}
.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
}
.checkbox-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--forest);
    cursor: pointer;
}
.agree-detail {
    font-size: 11px;
    color: var(--ink-soft);
    margin-top: 8px;
    padding-left: 26px;
    line-height: 1.6;
}
.contact-submit {
    background: var(--ink);
    color: #ffffff;
    border: none;
    padding: 18px 28px;
    font-size: 16px;
    font-weight: 700;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    margin-top: 8px;
}
.contact-submit:hover {
    background: var(--forest);
    transform: translateY(-2px);
}
.contact-submit:disabled {
    background: #999;
    cursor: not-allowed;
    transform: none;
}
.form-message {
    padding: 20px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    display: none;
    margin-top: 16px;
}
.form-message.success {
    display: block;
    background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
    color: #1b5e20;
    border: 2px solid #66bb6a;
    box-shadow: 0 4px 16px rgba(76, 175, 80, 0.2);
    animation: messagePop 0.4s ease;
}
.form-message.error {
    display: block;
    background: linear-gradient(135deg, #ffebee, #ffcdd2);
    color: #b71c1c;
    border: 2px solid #ef5350;
    box-shadow: 0 4px 16px rgba(244, 67, 54, 0.2);
    animation: messagePop 0.4s ease;
}
@keyframes messagePop {
    0% { transform: scale(0.9); opacity: 0; }
    60% { transform: scale(1.02); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}

/* 모바일 */
@media (max-width: 900px) {
    .contact-section .container {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .contact-intro {
        position: static;
        text-align: center;
    }
    .contact-intro .cta-label { text-align: center; }
    .contact-direct-btn { flex-direction: row; text-align: left; }
    .contact-form-box { padding: 28px 24px; }
}

</style>
</head>
<body>
    <header>
        <nav class="nav">
            <a href="/" class="logo">
                <img src="/brand.png" alt="마스터페이" class="logo-mark-img">
                마스터페이
            </a>
            <a href="/#contact" class="nav-cta">문의하기</a>
        </nav>
    </header>
    <div class="notfound">
        <div>
            <div class="notfound-code">404</div>
            <h1>페이지를 찾을 수 없어요</h1>
            <p>요청하신 페이지가 존재하지 않거나 이동되었을 수 있어요.</p>
            <a href="/" class="btn btn-primary">홈으로 돌아가기 →</a>
        </div>
    </div>
</body>
</html>`;

const PAGE_POS = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
<link rel="icon" type="image/png" href="/brand.png">
<link rel="apple-touch-icon" href="/brand.png">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="naver-site-verification" content="53af8497b3a522a8a85a7b13bae57efd7e27fb5c" />
    <title>포스기 | 마스터페이</title>
    <meta name="description" content="주문·결제·매출·재고 관리까지 한 번에 통합하는 매장 운영의 심장, 포스기(POS) 시스템입니다. 업종별 맞춤 설치부터 A/S까지 마스터페이가 책임집니다.">
    <meta property="og:title" content="포스기 | 마스터페이">
    <meta property="og:description" content="주문·결제·매출·재고 관리까지 한 번에 통합하는 매장 운영의 심장, 포스기(POS) 시스템입니다. 업종별 맞춤 설치부터 A/S까지 마스터페이가 책임집니다.">
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&display=swap" rel="stylesheet">
    <style>/* ========== 공용 스타일 (모든 페이지에서 사용) ========== */

:root {
    --cream: #f7f4ed;
    --cream-dark: #ede8db;
    --ink: #1a1a1a;
    --ink-soft: #4a4a4a;
    --forest: #2d4a3e;
    --forest-dark: #1f352c;
    --coral: #e8763a;
    --border: #d9d3c4;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 80px; }

body {
    font-family: 'Pretendard Variable', Pretendard, -apple-system, sans-serif;
    background: #ffffff;
    color: var(--ink);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
}

a { text-decoration: none; color: inherit; }
img { max-width: 100%; display: block; }

.container {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 32px;
}

/* ========== 헤더 ========== */
header {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    background: var(--cream);
    z-index: 9999 !important;
    border-bottom: 1px solid var(--border);
}
body {
    padding-top: 72px;
}
@media (max-width: 768px) {
    body { padding-top: 60px; }
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 32px;
    max-width: 1240px;
    margin: 0 auto;
}

.logo {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 8px;
}

.logo-mark {
    width: 28px;
    height: 28px;
    background: var(--forest);
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--cream);
    font-size: 14px;
}
.logo-mark-img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    display: inline-block;
    vertical-align: middle;
}

.nav-menu {
    display: flex;
    gap: 40px;
    list-style: none;
}

.nav-menu a {
    font-size: 15px;
    font-weight: 500;
    color: var(--ink-soft);
    transition: color 0.2s;
}

.nav-menu a:hover { color: var(--ink); }

.nav-cta {
    background: var(--ink);
    color: var(--cream);
    padding: 10px 20px;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 600;
    transition: transform 0.2s;
}

.nav-cta:hover { transform: scale(1.03); }

.mobile-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

/* ========== 제품 페이지 전용 ========== */
.product-hero {
    padding: 60px 0 80px;
    position: relative;
    overflow: hidden;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--ink-soft);
    margin-bottom: 32px;
}

.breadcrumb a {
    color: var(--ink-soft);
    transition: color 0.2s;
}

.breadcrumb a:hover { color: var(--ink); }

.breadcrumb-separator {
    opacity: 0.4;
}

.product-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
}

.product-badge {
    display: inline-block;
    padding: 6px 14px;
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
    color: var(--coral);
    margin-bottom: 20px;
}

.product-title {
    font-size: clamp(36px, 5vw, 60px);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
}

.product-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}

.product-lead {
    font-size: 18px;
    color: var(--ink-soft);
    line-height: 1.6;
    margin-bottom: 32px;
}

.product-specs {
    display: flex;
    gap: 32px;
    padding: 24px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    margin-bottom: 32px;
    flex-wrap: wrap;
}

.spec-item .spec-label {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 13px;
    color: var(--coral);
    margin-bottom: 4px;
}

.spec-item .spec-value {
    font-size: 18px;
    font-weight: 700;
}

.product-cta {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.btn {
    padding: 16px 32px;
    border-radius: 100px;
    font-weight: 600;
    font-size: 15px;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid transparent;
}

.btn-primary {
    background: var(--ink);
    color: var(--cream);
}

.btn-primary:hover {
    background: var(--forest);
}

.btn-ghost {
    background: transparent;
    color: var(--ink);
    border-color: var(--border);
}

.btn-ghost:hover {
    background: var(--cream-dark);
}

/* 제품 이미지 영역 */
.product-visual {
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 32px;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 180px;
    position: relative;
    overflow: hidden;
}

.product-visual img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* ========== 특징 섹션 ========== */
.features {
    padding: 100px 0;
    background: var(--cream-dark);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
}

.section-header {
    display: flex;
    align-items: baseline;
    gap: 24px;
    margin-bottom: 64px;
    flex-wrap: wrap;
}

.section-num {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 28px;
    color: var(--coral);
    font-weight: 400;
}

.section-title {
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    flex: 1;
    min-width: 300px;
}

.section-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 2px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 24px;
    overflow: hidden;
}

.feature-item {
    background: var(--cream);
    padding: 40px 32px;
    transition: background 0.3s;
}

.feature-item:hover {
    background: var(--cream-dark);
}

.feature-icon {
    font-size: 36px;
    margin-bottom: 20px;
    display: inline-block;
}

.feature-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 12px;
    letter-spacing: -0.01em;
}

.feature-desc {
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.6;
}

/* ========== 상세 내용 섹션 ========== */
.detail {
    padding: 100px 0;
}

.detail-content {
    max-width: 800px;
    margin: 0 auto;
    font-size: 17px;
    line-height: 1.8;
    color: var(--ink-soft);
}

.detail-content h3 {
    font-size: 28px;
    font-weight: 800;
    color: var(--ink);
    margin: 48px 0 20px;
    letter-spacing: -0.02em;
}

.detail-content h3:first-child {
    margin-top: 0;
}

.detail-content p {
    margin-bottom: 20px;
}

.detail-content ul {
    list-style: none;
    padding: 0;
    margin-bottom: 20px;
}

.detail-content ul li {
    padding: 10px 0 10px 32px;
    position: relative;
    border-bottom: 1px solid var(--border);
}

.detail-content ul li:last-child {
    border-bottom: none;
}

.detail-content ul li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--coral);
    font-weight: 800;
    font-size: 18px;
}

/* ========== 관련 제품 ========== */
.related {
    padding: 100px 0;
    background: var(--cream-dark);
    border-top: 1px solid var(--border);
}

.related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
}

.related-card {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 28px;
    transition: all 0.3s;
    display: block;
}

.related-card:hover {
    transform: translateY(-4px);
    border-color: var(--ink);
}

.related-icon {
    font-size: 36px;
    margin-bottom: 16px;
}

.related-name {
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 6px;
}

.related-desc {
    font-size: 13px;
    color: var(--ink-soft);
}

/* ========== CTA 섹션 ========== */
.cta {
    background: var(--ink);
    color: var(--cream);
    padding: 120px 0;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.cta::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: var(--forest);
    border-radius: 50%;
    top: -300px;
    right: -200px;
    opacity: 0.4;
    filter: blur(80px);
}

.cta-content {
    position: relative;
    z-index: 1;
}

.cta-label {
    font-family: 'Fraunces', serif;
    font-style: italic;
    color: var(--coral);
    font-size: 18px;
    margin-bottom: 20px;
}

.cta h2 {
    font-size: clamp(32px, 5vw, 56px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-bottom: 40px;
}

.cta h2 .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--coral);
}

.cta-phone {
    display: inline-flex;
    align-items: center;
    gap: 16px;
    font-size: 28px;
    font-weight: 800;
    padding: 20px 40px;
    background: var(--cream);
    color: var(--ink);
    border-radius: 100px;
    transition: transform 0.2s;
    margin-bottom: 16px;
}

.cta-phone:hover {
    transform: scale(1.03);
}

.cta-note {
    opacity: 0.7;
    font-size: 14px;
}

/* ========== 푸터 ========== */
footer {
    background: var(--ink);
    color: var(--cream);
    padding: 60px 0 40px;
    border-top: 1px solid rgba(247, 244, 237, 0.1);
}

.footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
}

.footer-brand .logo {
    color: var(--cream);
    margin-bottom: 16px;
}

.footer-brand p {
    font-size: 14px;
    opacity: 0.7;
    max-width: 300px;
    line-height: 1.6;
}

.footer-col h4 {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 16px;
    color: var(--coral);
}

.footer-col ul { list-style: none; }
.footer-col li { margin-bottom: 10px; }

.footer-col a {
    font-size: 14px;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.footer-col a:hover { opacity: 1; }

.footer-bottom {
    padding-top: 30px;
    border-top: 1px solid rgba(247, 244, 237, 0.1);
    font-size: 13px;
    opacity: 0.6;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
}

/* ========== 모바일 대응 ========== */
@media (max-width: 900px) {
    .product-grid {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .footer-grid {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 640px) {
    .container { padding: 0 20px; }
    .nav { padding: 16px 20px; }
    .nav-menu, .nav-cta { display: none; }
    .mobile-toggle { display: block; }
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--cream);
        padding: 20px;
        gap: 20px;
        border-bottom: 1px solid var(--border);
    }
    .product-hero { padding: 40px 0 60px; }
    .features, .detail, .related { padding: 60px 0; }
    .cta { padding: 80px 0; }
    .footer-grid { grid-template-columns: 1fr; }
    .cta-phone { font-size: 20px; padding: 16px 28px; }
    .product-visual { font-size: 100px; }
}

/* ============================================================
   📱 모바일 반응형 종합 보강 (일괄 패치)
   ============================================================ */

/* 가로 스크롤 방지 (가장 중요) */
html, body {
    overflow-x: hidden;
    width: 100%;
    -webkit-text-size-adjust: 100%;
}

* { max-width: 100%; }
img, video, iframe { max-width: 100%; height: auto; }
table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }

/* 768px 이하 (태블릿 ↓) */
@media (max-width: 768px) {
    .container { padding: 0 16px !important; }
    
    /* 본문 텍스트 가독성 */
    body { font-size: 15px; line-height: 1.7; }
    h1 { font-size: clamp(22px, 5.5vw, 30px) !important; line-height: 1.25 !important; word-break: keep-all; }
    h2 { font-size: clamp(18px, 4.5vw, 24px) !important; line-height: 1.3 !important; word-break: keep-all; }
    h3 { font-size: clamp(15px, 4vw, 18px) !important; line-height: 1.35 !important; }
    p { word-break: keep-all; line-height: 1.75; }
    
    /* 헤더/네비 */
    .nav { padding: 14px 0 !important; }
    .nav-menu { display: none !important; }
    .mobile-toggle { display: block !important; font-size: 22px; background: none; border: 0; cursor: pointer; padding: 6px 10px; }
    .nav-menu.active { display: flex !important; flex-direction: column; position: absolute; top: 100%; left: 0; right: 0; background: var(--cream); padding: 16px; gap: 14px; border-top: 1px solid var(--border); z-index: 100; }
    .nav-cta { padding: 8px 14px !important; font-size: 13px !important; }
    .logo { font-size: 17px !important; gap: 8px !important; }
    .logo-mark, .logo-mark-img { width: 24px !important; height: 24px !important; font-size: 12px !important; }
    
    /* 그리드들 → 1열 */
    .region-features-grid,
    .region-biz-grid,
    .region-reviews-grid,
    .region-products-grid,
    .footer-grid,
    .features-grid,
    .product-cards-grid,
    .pricing-grid,
    .review-grid,
    .stat-cards { grid-template-columns: 1fr !important; gap: 12px !important; }
    
    /* 시도/시군구 통계 → 2열 (너무 좁아지면 1열) */
    .region-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
    
    /* 지역 리스트(시군구·동) → 2~3열 */
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; font-size: 13px; }
    
    /* 제품 그리드 → 2열 */
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
    
    /* 박스 패딩 축소 */
    .region-box { padding: 20px 18px !important; border-radius: 14px !important; margin-bottom: 14px !important; }
    .region-box-title { font-size: 17px !important; margin-bottom: 12px !important; }
    
    /* 썸네일 (Hero) */
    .region-thumbnail { max-width: 100% !important; max-height: 280px !important; aspect-ratio: 4/3 !important; margin: 0 auto 20px !important; border-radius: 14px !important; }
    .region-thumbnail-overlay { padding: 18px 16px !important; }
    .region-thumbnail-meta { font-size: 11px !important; gap: 6px !important; }
    .region-thumbnail-title { font-size: clamp(20px, 5.5vw, 28px) !important; line-height: 1.2 !important; margin-bottom: 8px !important; }
    .region-thumbnail-services { font-size: 12px !important; line-height: 1.5 !important; }
    .region-hero-sub-standalone { font-size: 14px !important; line-height: 1.7 !important; max-width: 100% !important; padding: 0 4px !important; }
    
    /* 제품 5줄 카드 폰트 축소 */
    .region-product-detail-card { padding: 14px 16px !important; }
    .region-product-detail-card h3 { font-size: 15px !important; }
    .region-product-detail-card li { font-size: 12.5px !important; line-height: 1.65 !important; }
    
    /* FAQ */
    .region-faq-item { padding: 12px 14px !important; }
    .region-faq-item strong { font-size: 13.5px !important; }
    .region-faq-item p { font-size: 12.5px !important; }
    
    /* 주의사항 */
    .region-caution-item { padding: 12px 14px !important; gap: 10px !important; }
    .region-caution-item h3 { font-size: 13.5px !important; }
    .region-caution-item p { font-size: 12.5px !important; }
    
    /* 추천 업종 카드 */
    .region-biz-card { padding: 12px 14px !important; }
    .region-biz-name { font-size: 13.5px !important; }
    .region-biz-effect { font-size: 12px !important; }
    .region-biz-stars { font-size: 11.5px !important; }
    
    /* CTA 박스 */
    .region-cta-box { padding: 24px 18px !important; }
    .region-cta-buttons { flex-direction: column !important; gap: 10px !important; }
    .region-cta-buttons .btn { width: 100% !important; text-align: center; padding: 12px !important; font-size: 14px !important; }
    
    /* 버튼 */
    .btn { font-size: 14px !important; padding: 10px 18px !important; }
    .btn-primary, .btn-ghost { width: auto; }
    
    /* breadcrumb */
    .breadcrumb { font-size: 11.5px !important; flex-wrap: wrap; gap: 4px; }
    
    /* 푸터 */
    footer { padding: 32px 0 24px !important; }
    .footer-grid { gap: 24px !important; }
    .footer-brand .logo { font-size: 18px !important; }
}

/* 480px 이하 (작은 모바일) */
@media (max-width: 480px) {
    .container { padding: 0 14px !important; }
    h1 { font-size: clamp(20px, 6vw, 26px) !important; }
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; font-size: 12.5px; }
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 6px !important; }
    .region-thumbnail { max-height: 240px !important; }
    .region-thumbnail-overlay { padding: 14px 12px !important; }
    .region-thumbnail-services { font-size: 11px !important; }
    .region-hero-sub-standalone { font-size: 13px !important; }
}

/* 360px 이하 (소형 모바일) */
@media (max-width: 360px) {
    .container { padding: 0 12px !important; }
    .region-stats-grid { grid-template-columns: 1fr !important; }
    .region-list-grid { grid-template-columns: 1fr !important; }
    .region-thumbnail-title { font-size: 19px !important; }
}


/* ============================================================
   📱 짤림 방지 추가 패치 (이미지·텍스트 모두)
   ============================================================ */

/* === 모든 화면 크기에서 짤림 방지 === */
* {
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
}

/* 모든 이미지가 부모 박스 안에 들어오도록 강제 */
img, picture, video, svg, canvas, iframe, embed, object {
    max-width: 100% !important;
    height: auto !important;
    display: block;
}

/* 모든 텍스트 박스가 부모 안에 들어오도록 */
p, h1, h2, h3, h4, h5, h6, span, div, li, a, strong, em, td, th {
    word-wrap: break-word;
    overflow-wrap: break-word;
    min-width: 0;
}

/* 한글 단어가 중간에 안 끊기도록 */
p, h1, h2, h3, h4, li {
    word-break: keep-all;
}

/* 영어·URL·이메일·전화번호 같은 긴 문자열 강제 줄바꿈 */
.long-text, code, pre, .url, a[href^="mailto"], a[href^="tel"], .breadcrumb {
    word-break: break-all;
    overflow-wrap: anywhere;
}

/* 그리드 자식이 부모를 넘는 것 방지 */
[class*="grid"], [class*="flex"] {
    min-width: 0;
}
[class*="grid"] > *, [class*="flex"] > * {
    min-width: 0;
    max-width: 100%;
}

/* 768px 이하에서 추가 짤림 방지 */
@media (max-width: 768px) {
    /* body 내부에서 가로로 넘는 요소 강제 정리 */
    body, html { max-width: 100vw !important; overflow-x: hidden !important; }
    
    /* 컨테이너·박스가 절대 가로폭 안 넘게 */
    .container, .region-box, .region-cta-box, header, footer, section {
        max-width: 100% !important;
        box-sizing: border-box !important;
    }
    
    /* 썸네일 안 텍스트도 wrap */
    .region-thumbnail-title, .region-thumbnail-services, .region-thumbnail-meta {
        max-width: 100% !important;
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        white-space: normal !important;
    }
    
    /* 통계 카드 숫자 폰트 축소 */
    .region-stats-grid .region-stat-num,
    .region-stats-grid .region-stat-value,
    [class*="stat-num"], [class*="stat-value"] {
        font-size: clamp(18px, 5vw, 24px) !important;
        word-break: break-all !important;
    }
    
    /* 표 가로 스크롤 처리 */
    table {
        display: block !important;
        overflow-x: auto !important;
        white-space: nowrap;
    }
    
    /* 긴 동 이름(예: "한국토지주택공사동") 줄바꿈 */
    .region-list-grid a, .region-products-simple a {
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        line-height: 1.4 !important;
        padding: 8px 6px !important;
        font-size: 12.5px !important;
        text-align: center;
    }
    
    /* 전화번호·CTA 버튼 텍스트가 안 잘리도록 */
    .btn, .nav-cta, button, a[href^="tel"] {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}


/* === 온라인 문의 폼 (모든 페이지 공통) === */
.contact-section {
    padding: 100px 0;
    background: var(--cream-dark);
}
.contact-section .container {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 60px;
    align-items: start;
    max-width: 1140px;
}
.contact-intro {
    position: sticky;
    top: 100px;
}
.contact-intro .cta-label {
    text-align: left;
    font-size: 13px;
    font-weight: 700;
    color: var(--coral);
    letter-spacing: 3px;
    margin-bottom: 16px;
}
.contact-title {
    font-size: clamp(32px, 4vw, 48px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0 0 16px;
}
.contact-sub {
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.7;
    margin: 0 0 32px;
}
.contact-direct {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.contact-direct-btn {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 22px;
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 14px;
    transition: all 0.2s;
    text-decoration: none;
    color: inherit;
}
.contact-direct-btn:hover {
    border-color: var(--forest);
    transform: translateX(4px);
}
.contact-direct-btn .cd-icon {
    width: 44px;
    height: 44px;
    background: var(--cream-dark);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
}
.cd-label {
    display: block;
    font-size: 12px;
    color: var(--ink-soft);
    margin-bottom: 2px;
}
.cd-value {
    display: block;
    font-size: 16px;
    font-weight: 700;
    color: var(--ink);
}

/* 문의 폼 박스 */
.contact-form-box {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 40px 36px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}
.contact-form-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 22px;
    font-weight: 800;
    margin: 0 0 28px;
    letter-spacing: -0.01em;
}
.cf-bar {
    width: 4px;
    height: 22px;
    background: var(--coral);
    border-radius: 2px;
}
.contact-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.form-group {
    display: flex;
    flex-direction: column;
}
.form-group label {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 8px;
}
.required {
    color: var(--coral);
}
.form-group input,
.form-group select,
.form-group textarea {
    padding: 14px 16px;
    font-size: 14px;
    font-family: inherit;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: #fafafa;
    color: var(--ink);
    transition: all 0.2s;
    width: 100%;
    box-sizing: border-box;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--forest);
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(45, 74, 62, 0.1);
}
.form-group input::placeholder,
.form-group textarea::placeholder {
    color: #b0b0b0;
}
.form-group textarea {
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
}
.form-group select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23666' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    background-size: 10px;
    padding-right: 40px;
}
.form-agree {
    padding: 16px;
    background: #fafafa;
    border-radius: 10px;
    border: 1px solid var(--border);
}
.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
}
.checkbox-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--forest);
    cursor: pointer;
}
.agree-detail {
    font-size: 11px;
    color: var(--ink-soft);
    margin-top: 8px;
    padding-left: 26px;
    line-height: 1.6;
}
.contact-submit {
    background: var(--ink);
    color: #ffffff;
    border: none;
    padding: 18px 28px;
    font-size: 16px;
    font-weight: 700;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    margin-top: 8px;
}
.contact-submit:hover {
    background: var(--forest);
    transform: translateY(-2px);
}
.contact-submit:disabled {
    background: #999;
    cursor: not-allowed;
    transform: none;
}
.form-message {
    padding: 20px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    display: none;
    margin-top: 16px;
}
.form-message.success {
    display: block;
    background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
    color: #1b5e20;
    border: 2px solid #66bb6a;
    box-shadow: 0 4px 16px rgba(76, 175, 80, 0.2);
    animation: messagePop 0.4s ease;
}
.form-message.error {
    display: block;
    background: linear-gradient(135deg, #ffebee, #ffcdd2);
    color: #b71c1c;
    border: 2px solid #ef5350;
    box-shadow: 0 4px 16px rgba(244, 67, 54, 0.2);
    animation: messagePop 0.4s ease;
}
@keyframes messagePop {
    0% { transform: scale(0.9); opacity: 0; }
    60% { transform: scale(1.02); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}

/* 모바일 */
@media (max-width: 900px) {
    .contact-section .container {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .contact-intro {
        position: static;
        text-align: center;
    }
    .contact-intro .cta-label { text-align: center; }
    .contact-direct-btn { flex-direction: row; text-align: left; }
    .contact-form-box { padding: 28px 24px; }
}

</style>
</head>
<body>

    <!-- 헤더 -->
    <header>
        <nav class="nav">
            <a href="/" class="logo">
                <img src="/brand.png" alt="마스터페이" class="logo-mark-img">
                마스터페이
            </a>
            
            <ul class="nav-menu" id="navMenu">
                <li><a href="/#find-sec">지역별 설치</a></li>
                <li><a href="/#allinone">제품 안내</a></li>
                <li><a href="/#process">프로세스</a></li>
                <li><a href="/#faq">자주 묻는 질문</a></li>
            </ul>
            
            <a href="/#contact" class="nav-cta">문의하기</a>
            <button class="mobile-toggle" onclick="toggleMenu()">☰</button>
        </nav>
    </header>

    <!-- 제품 히어로 -->
    <section class="product-hero">
        <div class="container">
            <div class="breadcrumb">
                <a href="/">홈</a>
                <span class="breadcrumb-separator">/</span>
                <a href="/#products">제품</a>
                <span class="breadcrumb-separator">/</span>
                <span>포스기</span>
            </div>
            
            <div class="product-grid">
                <div class="product-info">
                    <span class="product-badge">POS System</span>
                    <h1 class="product-title">
                        포스기
                    </h1>
                    <p class="product-lead">주문·결제·매출·재고 관리까지 한 번에 통합하는 매장 운영의 심장, 포스기(POS) 시스템입니다. 업종별 맞춤 설치부터 A/S까지 마스터페이가 책임집니다.</p>
                    
                    <div class="product-specs">
                    <div class="spec-item">
                        <div class="spec-label">Type</div>
                        <div class="spec-value">통합 관리 시스템</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Setup</div>
                        <div class="spec-value">업종별 맞춤 설치</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Support</div>
                        <div class="spec-value">24시간 A/S</div>
                    </div>
                    </div>
                    
                    <div class="product-cta">
                        <a href="/#contact" class="btn btn-primary">
                            무료 상담 신청 →
                        </a>
                        <a href="tel:010-2337-0458" class="btn btn-ghost">
                            📞 전화 상담
                        </a>
                    </div>
                </div>
                
                <div class="product-visual">
                    <img src="https://raw.githubusercontent.com/YOONSOEUN1/mastarpay/main/images/pos.jpg" alt="포스기" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
            </div>
        </div>
    </section>

    <!-- 특징 섹션 -->
    <section class="features">
        <div class="container">
            <div class="section-header">
                <span class="section-num">01 / Features</span>
                <h2 class="section-title">
                    이런 특징이 있어요.
                </h2>
            </div>
            
            <div class="feature-grid">
                <div class="feature-item">
                    <div class="feature-icon">🏆</div>
                    <h3 class="feature-title">검증된 품질</h3>
                    <p class="feature-desc">업계에서 인정받은 최고의 모델만을 엄선하여 제공합니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">⚡</div>
                    <h3 class="feature-title">빠른 설치</h3>
                    <p class="feature-desc">상담 후 빠른 일정으로 설치가 완료됩니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">💰</div>
                    <h3 class="feature-title">합리적 비용</h3>
                    <p class="feature-desc">설치비 무료 옵션과 렌탈 프로그램으로 부담이 적습니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🔧</div>
                    <h3 class="feature-title">A/S 보장</h3>
                    <p class="feature-desc">장애 시 원격 지원과 현장 출동으로 빠르게 해결합니다.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 상세 내용 -->
    <section class="detail">
        <div class="container">
            <div class="section-header">
                <span class="section-num">02 / Details</span>
                <h2 class="section-title">
                    자세히 알아보기.
                </h2>
            </div>
            
            <div class="detail-content">
                
                <h3>포스기(POS)가 필요한 이유</h3>
                <p>포스기는 단순한 계산기가 아닙니다. 주문·결제·매출·재고·직원 관리까지 매장 운영의 모든 데이터를 통합 관리하는 심장과 같은 역할을 합니다. 최저임금 상승과 인력난으로 어려움을 겪는 자영업자에게 포스기는 더 이상 선택이 아닌 필수입니다. 매장 규모에 상관없이 체계적인 데이터 관리만으로도 매출 15~25% 상승을 기대할 수 있습니다.</p>
                <p>마스터페이는 전국 매장에 포스기를 직접 설치하며, 업종별 특성을 분석하여 가장 적합한 모델을 추천합니다. 음식점·카페·편의점·미용실·베이커리 등 업종에 상관없이 최적의 솔루션을 제공하며, 설치부터 직원 교육, 사후 A/S까지 완벽하게 책임집니다.</p>
                
                <h3>포스기 설치 프로세스</h3>
                <ul>
                    <li>1단계 무료 상담 — 전화나 폼으로 간단히 문의하시면 담당자가 매장 업종·규모·필요 기능을 파악합니다</li>
                    <li>2단계 현장 분석 — 매장에 직접 방문하여 공간·네트워크·결제 흐름을 파악합니다</li>
                    <li>3단계 장비 선정 — 업종별 특성에 맞는 최적의 포스기 모델을 선정합니다</li>
                    <li>4단계 설치 및 세팅 — 전문 기사가 직접 방문하여 설치·세팅·테스트를 완료합니다</li>
                    <li>5단계 직원 교육 — 사장님과 직원에게 포스기 사용법을 별도 비용 없이 교육합니다</li>
                    <li>6단계 A/S 지원 — 장애 시 원격 지원 또는 현장 출동으로 빠르게 해결합니다</li>
                </ul>
                
                <h3>포스기 주요 기능</h3>
                <ul>
                    <li>통합 매출 관리 — 일별·월별 매출이 자동으로 리포트로 정리됩니다. 세무 신고도 간편해집니다</li>
                    <li>메뉴·재고 관리 — 메뉴 추가·수정이 간편하고, 재고가 실시간으로 파악됩니다. 품절 알림까지 자동으로 받아보세요</li>
                    <li>다양한 결제 연동 — 카드, 현금, 삼성페이·카카오페이·네이버페이 등 모든 결제 수단을 하나의 시스템에서 처리합니다</li>
                    <li>배달앱 통합 — 배달의민족·요기요·쿠팡이츠 등 배달 주문이 포스기로 자동 전송됩니다</li>
                    <li>직원 관리 — 근태 관리, 교대 시간 추적, 업무 분담 관리가 가능합니다</li>
                    <li>원격 지원 — 장애가 발생하면 원격으로 즉시 해결합니다. 매장 방문 없이도 빠른 문제 해결이 가능합니다</li>
                </ul>
                
                <h3>이런 매장에 추천합니다</h3>
                <p>매출 데이터를 체계적으로 관리하고 싶은 사장님, 배달앱과 오프라인 결제를 통합하고 싶은 분, 세무 관리를 간편하게 하고 싶은 자영업자, 직원 관리와 근태 확인이 필요한 매장, 메뉴와 재고를 실시간으로 파악하고 싶은 분에게 강력히 추천합니다.</p>
                
                <h3>포스기 설치 후 기대 효과</h3>
                <p>포스기 도입 매장의 평균 효과는 매출 15~25% 증가, 인건비 20% 절감, 주문 실수 90% 이상 감소, 재고 관리 시간 70% 단축입니다. 특히 카드단말기·키오스크·테이블오더와 함께 도입하면 시너지 효과가 극대화되어 매장 운영이 완전히 달라집니다.</p>
                
                <h3>자주 묻는 질문</h3>
                <p><strong>Q. 설치 비용은 얼마인가요?</strong><br>대부분의 포스기는 무료 설치가 가능합니다. 월 렌탈료 또는 일시불 구매 등 다양한 옵션이 있으며, 매장 상황에 맞게 안내해드립니다.</p>
                <p><strong>Q. A/S는 어떻게 받나요?</strong><br>전화 한 통이면 됩니다. 대부분의 문제는 원격 지원으로 즉시 해결되며, 하드웨어 문제는 엔지니어가 직접 방문하여 처리합니다.</p>
                <p><strong>Q. 다른 장비와 함께 설치하면 할인되나요?</strong><br>네, 패키지 할인이 있습니다. 포스기+카드단말기+테이블오더를 함께 설치하시면 개별 설치보다 훨씬 저렴하게 이용하실 수 있습니다.</p>
    
            </div>
        </div>
    </section>

    <!-- 관련 제품 -->
    <section class="related">
        <div class="container">
            <div class="section-header">
                <span class="section-num">03 / Related</span>
                <h2 class="section-title">
                    다른 제품도 둘러보세요.
                </h2>
            </div>
            
            <div class="related-grid">
                <a href="/product/card-3inch" class="related-card">
                    <div class="related-icon">🖨️</div>
                    <div class="related-name">3인치 단말기</div>
                    <div class="related-desc">표준 카드 단말기</div>
                </a>
                <a href="/product/kiosk" class="related-card">
                    <div class="related-icon">🤖</div>
                    <div class="related-name">키오스크</div>
                    <div class="related-desc">무인 주문·결제</div>
                </a>
                <a href="/product/tableorder" class="related-card">
                    <div class="related-icon">📋</div>
                    <div class="related-name">테이블 오더</div>
                    <div class="related-desc">QR 주문 시스템</div>
                </a>
            </div>
        </div>
    </section>

    <!-- CTA -->
    <section class="contact-section" id="contact">
        <div class="container">
            <div class="contact-intro">
                <div class="cta-label">— Contact Us —</div>
                <h2 class="contact-title">무료 상담 신청</h2>
                <p class="contact-sub">전화, 카카오톡 또는 아래 폼으로 문의해주세요.<br>담당자가 빠르게 연락드립니다.</p>
                <div class="contact-direct">
                    <a href="tel:010-2337-0458" class="contact-direct-btn">
                        <span class="cd-icon">📞</span>
                        <span><span class="cd-label">전화 상담</span><span class="cd-value">010-2337-0458</span></span>
                    </a>
                    <a href="javascript:void(0)" onclick="openKakao(); return false;" class="contact-direct-btn">
                        <span class="cd-icon">💬</span>
                        <span><span class="cd-label">카카오톡</span><span class="cd-value">바로 상담</span></span>
                    </a>
                </div>
            </div>
            <div class="contact-form-box">
                <h3 class="contact-form-title"><span class="cf-bar"></span><span>📝 온라인 문의</span></h3>
                <form id="contactForm" class="contact-form" onsubmit="return submitContactForm(event)">
                    <div class="form-group"><label for="name">상호(이름) <span class="required">*</span></label><input type="text" id="name" name="상호_이름" placeholder="상호 또는 이름을 입력하세요" required></div>
                    <div class="form-group"><label for="phone">연락처 <span class="required">*</span></label><input type="tel" id="phone" name="연락처" placeholder="010-0000-0000" required></div>
                    <div class="form-group"><label for="address">주소 <span class="required">*</span></label><input type="text" id="address" name="주소" placeholder="매장 주소" required><input type="text" id="address_detail" name="상세주소" placeholder="상세주소 (건물명, 층, 호수 등)" style="margin-top: 8px;"></div>
                    <div class="form-group"><label for="product">문의 제품 <span class="required">*</span></label><select id="product" name="문의_제품" required><option value="">선택해주세요</option><option value="포스기">포스기(POS)</option><option value="2인치 단말기">2인치 단말기</option><option value="3인치 단말기">3인치 단말기</option><option value="토스 단말기">토스 단말기</option><option value="무선 단말기">무선 단말기</option><option value="블루투스 단말기">블루투스 단말기</option><option value="키오스크">키오스크</option><option value="미니 키오스크">미니 키오스크</option><option value="테이블 오더">테이블 오더</option><option value="매장 철거">매장 철거</option><option value="여러 제품 패키지">여러 제품 패키지</option><option value="기타/미정">기타/미정</option></select></div>
                    <div class="form-group"><label for="business">업종</label><select id="business" name="업종"><option value="">선택해주세요</option><option value="음식점/식당">음식점/식당</option><option value="카페/베이커리">카페/베이커리</option><option value="편의점/마트">편의점/마트</option><option value="미용실/네일샵">미용실/네일샵</option><option value="스터디카페">스터디카페</option><option value="주점/호프">주점/호프</option><option value="무인매장">무인매장</option><option value="의류/잡화">의류/잡화</option><option value="병원/약국">병원/약국</option><option value="기타">기타</option></select></div>
                    <div class="form-group"><label for="message">문의 내용</label><textarea id="message" name="문의_내용" rows="5" placeholder="매장 위치, 현재 사용 장비, 궁금한 점 등을 자유롭게 적어주세요."></textarea></div>
                    <div class="form-agree"><label class="checkbox-label"><input type="checkbox" id="agree" required><span>개인정보 수집 및 이용에 동의합니다 <span class="required">*</span></span></label><div class="agree-detail">수집항목: 상호·연락처·주소·문의 내용 / 이용목적: 상담 및 견적 안내 / 보유기간: 3년</div></div>
                    <button type="submit" class="contact-submit" id="submitBtn"><span id="submitText">무료 상담 신청하기 →</span></button>
                    <div id="formMessage" class="form-message"></div>
                </form>
            </div>
        </div>
    </section>

    <!-- 푸터 -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="logo">
                        <img src="/brand.png" alt="마스터페이" class="logo-mark-img">
                        마스터페이
                    </div>
                    <p>매장 운영에 필요한 모든 장비<br>설치부터 A/S까지 한번에.</p>
                </div>
                
                <div class="footer-col">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="tel:010-2337-0458">📞 010-2337-0458</a></li>
                        <li><a href="https://pf.kakao.com/_fPrxbG/chat" target="_blank">💬 카카오톡 상담</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <span>© 2026 마스터페이. All rights reserved.</span>
                <span>개인정보처리방침 · 이용약관</span>
            </div>
        </div>
    </footer>

    <script>
        function toggleMenu() {
            document.getElementById('navMenu').classList.toggle('active');
        }
        function openKakao(){
          var url='https://pf.kakao.com/_fPrxbG/chat';
          var w=window.open(url,'_blank');
          if(!w||w.closed||typeof w.closed==='undefined'){window.location.href=url;}
        }
        function scrollToContact(event){
          if(event)event.preventDefault();
          var c=document.getElementById('contact');
          if(c){
            var top=c.getBoundingClientRect().top+window.pageYOffset-80;
            window.scrollTo({top:top,behavior:'smooth'});
          }else{window.location.href='/#contact';}
        }
        async function submitContactForm(event){
          if(event){event.preventDefault();event.stopPropagation();}
          var form=document.getElementById('contactForm');
          var submitBtn=document.getElementById('submitBtn');
          var submitText=document.getElementById('submitText');
          var formMessage=document.getElementById('formMessage');
          if(!form){alert('⚠️ 폼을 찾을 수 없습니다.');return false;}
          var agreeCheckbox=document.getElementById('agree');
          if(!agreeCheckbox||!agreeCheckbox.checked){alert('개인정보 수집 및 이용에 동의해주세요.');return false;}
          var name=document.getElementById('name').value.trim();
          var phone=document.getElementById('phone').value.trim();
          var address=document.getElementById('address').value.trim();
          var product=document.getElementById('product').value;
          if(!name){alert('상호(이름)을 입력해주세요.');document.getElementById('name').focus();return false;}
          if(!phone){alert('연락처를 입력해주세요.');document.getElementById('phone').focus();return false;}
          if(!address){alert('주소를 입력해주세요.');document.getElementById('address').focus();return false;}
          if(!product){alert('문의 제품을 선택해주세요.');document.getElementById('product').focus();return false;}
          if(submitBtn)submitBtn.disabled=true;
          if(submitText)submitText.textContent='전송 중...';
          if(formMessage){formMessage.className='form-message';formMessage.style.display='none';}
          var data={name:name,phone:phone,address:address,addressDetail:document.getElementById('address_detail').value.trim(),product:product,business:document.getElementById('business').value,message:document.getElementById('message').value.trim()};
          var result;
          try{
            var response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
            result=await response.json();
            if(result.success){
              if(formMessage){formMessage.className='form-message success';formMessage.style.display='block';formMessage.innerHTML='<div style="text-align:center;padding:24px 20px;"><div style="font-size:48px;margin-bottom:12px;">✅</div><div style="font-size:18px;font-weight:800;color:#2e7d32;margin-bottom:8px;">문의가 성공적으로 접수되었습니다!</div><div style="font-size:14px;color:#555;">24시간 이내에 연락드리겠습니다.<br>급하신 경우 <strong>010-2337-0458</strong>로 연락주세요.</div></div>';}
              form.reset();
              setTimeout(function(){if(formMessage)formMessage.scrollIntoView({behavior:'smooth',block:'center'});},100);
            }else{throw new Error(result.error||'전송에 실패했습니다.');}
          }catch(error){
            var errorMsg=error.message||'전송에 실패했습니다';
            if(formMessage){formMessage.className='form-message error';formMessage.style.display='block';formMessage.innerHTML='<div style="text-align:center;padding:20px;"><div style="font-size:40px;margin-bottom:10px;">❌</div><div style="font-size:16px;font-weight:700;margin-bottom:8px;">전송에 실패했습니다</div><div style="font-size:13px;margin-bottom:12px;color:#555;">'+errorMsg+'</div><div style="font-size:14px;margin-top:12px;"><strong>📞 010-2337-0458</strong><br>또는 카카오톡으로 문의해주세요.</div></div>';formMessage.scrollIntoView({behavior:'smooth',block:'center'});}
          }finally{
            if(submitBtn)submitBtn.disabled=false;
            if(submitText)submitText.textContent='무료 상담 신청하기 →';
          }
          return false;
        }
    </script>

</body>
</html>`;

const PAGE_CARD_2INCH = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
<link rel="icon" type="image/png" href="/brand.png">
<link rel="apple-touch-icon" href="/brand.png">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="naver-site-verification" content="53af8497b3a522a8a85a7b13bae57efd7e27fb5c" />
    <title>2인치 단말기 | 마스터페이</title>
    <meta name="description" content="좁은 공간에도 깔끔하게 설치되는 컴팩트 사이즈 2인치 카드 단말기. KIS2200·KPN1902 등 검증된 모델로 안정적인 결제 환경을 제공합니다.">
    <meta property="og:title" content="2인치 단말기 | 마스터페이">
    <meta property="og:description" content="좁은 공간에도 깔끔하게 설치되는 컴팩트 사이즈 2인치 카드 단말기. KIS2200·KPN1902 등 검증된 모델로 안정적인 결제 환경을 제공합니다.">
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&display=swap" rel="stylesheet">
    <style>/* ========== 공용 스타일 (모든 페이지에서 사용) ========== */

:root {
    --cream: #f7f4ed;
    --cream-dark: #ede8db;
    --ink: #1a1a1a;
    --ink-soft: #4a4a4a;
    --forest: #2d4a3e;
    --forest-dark: #1f352c;
    --coral: #e8763a;
    --border: #d9d3c4;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 80px; }

body {
    font-family: 'Pretendard Variable', Pretendard, -apple-system, sans-serif;
    background: #ffffff;
    color: var(--ink);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
}

a { text-decoration: none; color: inherit; }
img { max-width: 100%; display: block; }

.container {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 32px;
}

/* ========== 헤더 ========== */
header {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    background: var(--cream);
    z-index: 9999 !important;
    border-bottom: 1px solid var(--border);
}
body {
    padding-top: 72px;
}
@media (max-width: 768px) {
    body { padding-top: 60px; }
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 32px;
    max-width: 1240px;
    margin: 0 auto;
}

.logo {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 8px;
}

.logo-mark {
    width: 28px;
    height: 28px;
    background: var(--forest);
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--cream);
    font-size: 14px;
}
.logo-mark-img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    display: inline-block;
    vertical-align: middle;
}

.nav-menu {
    display: flex;
    gap: 40px;
    list-style: none;
}

.nav-menu a {
    font-size: 15px;
    font-weight: 500;
    color: var(--ink-soft);
    transition: color 0.2s;
}

.nav-menu a:hover { color: var(--ink); }

.nav-cta {
    background: var(--ink);
    color: var(--cream);
    padding: 10px 20px;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 600;
    transition: transform 0.2s;
}

.nav-cta:hover { transform: scale(1.03); }

.mobile-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

/* ========== 제품 페이지 전용 ========== */
.product-hero {
    padding: 60px 0 80px;
    position: relative;
    overflow: hidden;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--ink-soft);
    margin-bottom: 32px;
}

.breadcrumb a {
    color: var(--ink-soft);
    transition: color 0.2s;
}

.breadcrumb a:hover { color: var(--ink); }

.breadcrumb-separator {
    opacity: 0.4;
}

.product-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
}

.product-badge {
    display: inline-block;
    padding: 6px 14px;
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
    color: var(--coral);
    margin-bottom: 20px;
}

.product-title {
    font-size: clamp(36px, 5vw, 60px);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
}

.product-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}

.product-lead {
    font-size: 18px;
    color: var(--ink-soft);
    line-height: 1.6;
    margin-bottom: 32px;
}

.product-specs {
    display: flex;
    gap: 32px;
    padding: 24px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    margin-bottom: 32px;
    flex-wrap: wrap;
}

.spec-item .spec-label {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 13px;
    color: var(--coral);
    margin-bottom: 4px;
}

.spec-item .spec-value {
    font-size: 18px;
    font-weight: 700;
}

.product-cta {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.btn {
    padding: 16px 32px;
    border-radius: 100px;
    font-weight: 600;
    font-size: 15px;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid transparent;
}

.btn-primary {
    background: var(--ink);
    color: var(--cream);
}

.btn-primary:hover {
    background: var(--forest);
}

.btn-ghost {
    background: transparent;
    color: var(--ink);
    border-color: var(--border);
}

.btn-ghost:hover {
    background: var(--cream-dark);
}

/* 제품 이미지 영역 */
.product-visual {
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 32px;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 180px;
    position: relative;
    overflow: hidden;
}

.product-visual img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* ========== 특징 섹션 ========== */
.features {
    padding: 100px 0;
    background: var(--cream-dark);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
}

.section-header {
    display: flex;
    align-items: baseline;
    gap: 24px;
    margin-bottom: 64px;
    flex-wrap: wrap;
}

.section-num {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 28px;
    color: var(--coral);
    font-weight: 400;
}

.section-title {
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    flex: 1;
    min-width: 300px;
}

.section-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 2px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 24px;
    overflow: hidden;
}

.feature-item {
    background: var(--cream);
    padding: 40px 32px;
    transition: background 0.3s;
}

.feature-item:hover {
    background: var(--cream-dark);
}

.feature-icon {
    font-size: 36px;
    margin-bottom: 20px;
    display: inline-block;
}

.feature-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 12px;
    letter-spacing: -0.01em;
}

.feature-desc {
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.6;
}

/* ========== 상세 내용 섹션 ========== */
.detail {
    padding: 100px 0;
}

.detail-content {
    max-width: 800px;
    margin: 0 auto;
    font-size: 17px;
    line-height: 1.8;
    color: var(--ink-soft);
}

.detail-content h3 {
    font-size: 28px;
    font-weight: 800;
    color: var(--ink);
    margin: 48px 0 20px;
    letter-spacing: -0.02em;
}

.detail-content h3:first-child {
    margin-top: 0;
}

.detail-content p {
    margin-bottom: 20px;
}

.detail-content ul {
    list-style: none;
    padding: 0;
    margin-bottom: 20px;
}

.detail-content ul li {
    padding: 10px 0 10px 32px;
    position: relative;
    border-bottom: 1px solid var(--border);
}

.detail-content ul li:last-child {
    border-bottom: none;
}

.detail-content ul li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--coral);
    font-weight: 800;
    font-size: 18px;
}

/* ========== 관련 제품 ========== */
.related {
    padding: 100px 0;
    background: var(--cream-dark);
    border-top: 1px solid var(--border);
}

.related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
}

.related-card {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 28px;
    transition: all 0.3s;
    display: block;
}

.related-card:hover {
    transform: translateY(-4px);
    border-color: var(--ink);
}

.related-icon {
    font-size: 36px;
    margin-bottom: 16px;
}

.related-name {
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 6px;
}

.related-desc {
    font-size: 13px;
    color: var(--ink-soft);
}

/* ========== CTA 섹션 ========== */
.cta {
    background: var(--ink);
    color: var(--cream);
    padding: 120px 0;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.cta::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: var(--forest);
    border-radius: 50%;
    top: -300px;
    right: -200px;
    opacity: 0.4;
    filter: blur(80px);
}

.cta-content {
    position: relative;
    z-index: 1;
}

.cta-label {
    font-family: 'Fraunces', serif;
    font-style: italic;
    color: var(--coral);
    font-size: 18px;
    margin-bottom: 20px;
}

.cta h2 {
    font-size: clamp(32px, 5vw, 56px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-bottom: 40px;
}

.cta h2 .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--coral);
}

.cta-phone {
    display: inline-flex;
    align-items: center;
    gap: 16px;
    font-size: 28px;
    font-weight: 800;
    padding: 20px 40px;
    background: var(--cream);
    color: var(--ink);
    border-radius: 100px;
    transition: transform 0.2s;
    margin-bottom: 16px;
}

.cta-phone:hover {
    transform: scale(1.03);
}

.cta-note {
    opacity: 0.7;
    font-size: 14px;
}

/* ========== 푸터 ========== */
footer {
    background: var(--ink);
    color: var(--cream);
    padding: 60px 0 40px;
    border-top: 1px solid rgba(247, 244, 237, 0.1);
}

.footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
}

.footer-brand .logo {
    color: var(--cream);
    margin-bottom: 16px;
}

.footer-brand p {
    font-size: 14px;
    opacity: 0.7;
    max-width: 300px;
    line-height: 1.6;
}

.footer-col h4 {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 16px;
    color: var(--coral);
}

.footer-col ul { list-style: none; }
.footer-col li { margin-bottom: 10px; }

.footer-col a {
    font-size: 14px;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.footer-col a:hover { opacity: 1; }

.footer-bottom {
    padding-top: 30px;
    border-top: 1px solid rgba(247, 244, 237, 0.1);
    font-size: 13px;
    opacity: 0.6;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
}

/* ========== 모바일 대응 ========== */
@media (max-width: 900px) {
    .product-grid {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .footer-grid {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 640px) {
    .container { padding: 0 20px; }
    .nav { padding: 16px 20px; }
    .nav-menu, .nav-cta { display: none; }
    .mobile-toggle { display: block; }
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--cream);
        padding: 20px;
        gap: 20px;
        border-bottom: 1px solid var(--border);
    }
    .product-hero { padding: 40px 0 60px; }
    .features, .detail, .related { padding: 60px 0; }
    .cta { padding: 80px 0; }
    .footer-grid { grid-template-columns: 1fr; }
    .cta-phone { font-size: 20px; padding: 16px 28px; }
    .product-visual { font-size: 100px; }
}

/* ============================================================
   📱 모바일 반응형 종합 보강 (일괄 패치)
   ============================================================ */

/* 가로 스크롤 방지 (가장 중요) */
html, body {
    overflow-x: hidden;
    width: 100%;
    -webkit-text-size-adjust: 100%;
}

* { max-width: 100%; }
img, video, iframe { max-width: 100%; height: auto; }
table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }

/* 768px 이하 (태블릿 ↓) */
@media (max-width: 768px) {
    .container { padding: 0 16px !important; }
    
    /* 본문 텍스트 가독성 */
    body { font-size: 15px; line-height: 1.7; }
    h1 { font-size: clamp(22px, 5.5vw, 30px) !important; line-height: 1.25 !important; word-break: keep-all; }
    h2 { font-size: clamp(18px, 4.5vw, 24px) !important; line-height: 1.3 !important; word-break: keep-all; }
    h3 { font-size: clamp(15px, 4vw, 18px) !important; line-height: 1.35 !important; }
    p { word-break: keep-all; line-height: 1.75; }
    
    /* 헤더/네비 */
    .nav { padding: 14px 0 !important; }
    .nav-menu { display: none !important; }
    .mobile-toggle { display: block !important; font-size: 22px; background: none; border: 0; cursor: pointer; padding: 6px 10px; }
    .nav-menu.active { display: flex !important; flex-direction: column; position: absolute; top: 100%; left: 0; right: 0; background: var(--cream); padding: 16px; gap: 14px; border-top: 1px solid var(--border); z-index: 100; }
    .nav-cta { padding: 8px 14px !important; font-size: 13px !important; }
    .logo { font-size: 17px !important; gap: 8px !important; }
    .logo-mark, .logo-mark-img { width: 24px !important; height: 24px !important; font-size: 12px !important; }
    
    /* 그리드들 → 1열 */
    .region-features-grid,
    .region-biz-grid,
    .region-reviews-grid,
    .region-products-grid,
    .footer-grid,
    .features-grid,
    .product-cards-grid,
    .pricing-grid,
    .review-grid,
    .stat-cards { grid-template-columns: 1fr !important; gap: 12px !important; }
    
    /* 시도/시군구 통계 → 2열 (너무 좁아지면 1열) */
    .region-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
    
    /* 지역 리스트(시군구·동) → 2~3열 */
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; font-size: 13px; }
    
    /* 제품 그리드 → 2열 */
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
    
    /* 박스 패딩 축소 */
    .region-box { padding: 20px 18px !important; border-radius: 14px !important; margin-bottom: 14px !important; }
    .region-box-title { font-size: 17px !important; margin-bottom: 12px !important; }
    
    /* 썸네일 (Hero) */
    .region-thumbnail { max-width: 100% !important; max-height: 280px !important; aspect-ratio: 4/3 !important; margin: 0 auto 20px !important; border-radius: 14px !important; }
    .region-thumbnail-overlay { padding: 18px 16px !important; }
    .region-thumbnail-meta { font-size: 11px !important; gap: 6px !important; }
    .region-thumbnail-title { font-size: clamp(20px, 5.5vw, 28px) !important; line-height: 1.2 !important; margin-bottom: 8px !important; }
    .region-thumbnail-services { font-size: 12px !important; line-height: 1.5 !important; }
    .region-hero-sub-standalone { font-size: 14px !important; line-height: 1.7 !important; max-width: 100% !important; padding: 0 4px !important; }
    
    /* 제품 5줄 카드 폰트 축소 */
    .region-product-detail-card { padding: 14px 16px !important; }
    .region-product-detail-card h3 { font-size: 15px !important; }
    .region-product-detail-card li { font-size: 12.5px !important; line-height: 1.65 !important; }
    
    /* FAQ */
    .region-faq-item { padding: 12px 14px !important; }
    .region-faq-item strong { font-size: 13.5px !important; }
    .region-faq-item p { font-size: 12.5px !important; }
    
    /* 주의사항 */
    .region-caution-item { padding: 12px 14px !important; gap: 10px !important; }
    .region-caution-item h3 { font-size: 13.5px !important; }
    .region-caution-item p { font-size: 12.5px !important; }
    
    /* 추천 업종 카드 */
    .region-biz-card { padding: 12px 14px !important; }
    .region-biz-name { font-size: 13.5px !important; }
    .region-biz-effect { font-size: 12px !important; }
    .region-biz-stars { font-size: 11.5px !important; }
    
    /* CTA 박스 */
    .region-cta-box { padding: 24px 18px !important; }
    .region-cta-buttons { flex-direction: column !important; gap: 10px !important; }
    .region-cta-buttons .btn { width: 100% !important; text-align: center; padding: 12px !important; font-size: 14px !important; }
    
    /* 버튼 */
    .btn { font-size: 14px !important; padding: 10px 18px !important; }
    .btn-primary, .btn-ghost { width: auto; }
    
    /* breadcrumb */
    .breadcrumb { font-size: 11.5px !important; flex-wrap: wrap; gap: 4px; }
    
    /* 푸터 */
    footer { padding: 32px 0 24px !important; }
    .footer-grid { gap: 24px !important; }
    .footer-brand .logo { font-size: 18px !important; }
}

/* 480px 이하 (작은 모바일) */
@media (max-width: 480px) {
    .container { padding: 0 14px !important; }
    h1 { font-size: clamp(20px, 6vw, 26px) !important; }
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; font-size: 12.5px; }
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 6px !important; }
    .region-thumbnail { max-height: 240px !important; }
    .region-thumbnail-overlay { padding: 14px 12px !important; }
    .region-thumbnail-services { font-size: 11px !important; }
    .region-hero-sub-standalone { font-size: 13px !important; }
}

/* 360px 이하 (소형 모바일) */
@media (max-width: 360px) {
    .container { padding: 0 12px !important; }
    .region-stats-grid { grid-template-columns: 1fr !important; }
    .region-list-grid { grid-template-columns: 1fr !important; }
    .region-thumbnail-title { font-size: 19px !important; }
}


/* ============================================================
   📱 짤림 방지 추가 패치 (이미지·텍스트 모두)
   ============================================================ */

/* === 모든 화면 크기에서 짤림 방지 === */
* {
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
}

/* 모든 이미지가 부모 박스 안에 들어오도록 강제 */
img, picture, video, svg, canvas, iframe, embed, object {
    max-width: 100% !important;
    height: auto !important;
    display: block;
}

/* 모든 텍스트 박스가 부모 안에 들어오도록 */
p, h1, h2, h3, h4, h5, h6, span, div, li, a, strong, em, td, th {
    word-wrap: break-word;
    overflow-wrap: break-word;
    min-width: 0;
}

/* 한글 단어가 중간에 안 끊기도록 */
p, h1, h2, h3, h4, li {
    word-break: keep-all;
}

/* 영어·URL·이메일·전화번호 같은 긴 문자열 강제 줄바꿈 */
.long-text, code, pre, .url, a[href^="mailto"], a[href^="tel"], .breadcrumb {
    word-break: break-all;
    overflow-wrap: anywhere;
}

/* 그리드 자식이 부모를 넘는 것 방지 */
[class*="grid"], [class*="flex"] {
    min-width: 0;
}
[class*="grid"] > *, [class*="flex"] > * {
    min-width: 0;
    max-width: 100%;
}

/* 768px 이하에서 추가 짤림 방지 */
@media (max-width: 768px) {
    /* body 내부에서 가로로 넘는 요소 강제 정리 */
    body, html { max-width: 100vw !important; overflow-x: hidden !important; }
    
    /* 컨테이너·박스가 절대 가로폭 안 넘게 */
    .container, .region-box, .region-cta-box, header, footer, section {
        max-width: 100% !important;
        box-sizing: border-box !important;
    }
    
    /* 썸네일 안 텍스트도 wrap */
    .region-thumbnail-title, .region-thumbnail-services, .region-thumbnail-meta {
        max-width: 100% !important;
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        white-space: normal !important;
    }
    
    /* 통계 카드 숫자 폰트 축소 */
    .region-stats-grid .region-stat-num,
    .region-stats-grid .region-stat-value,
    [class*="stat-num"], [class*="stat-value"] {
        font-size: clamp(18px, 5vw, 24px) !important;
        word-break: break-all !important;
    }
    
    /* 표 가로 스크롤 처리 */
    table {
        display: block !important;
        overflow-x: auto !important;
        white-space: nowrap;
    }
    
    /* 긴 동 이름(예: "한국토지주택공사동") 줄바꿈 */
    .region-list-grid a, .region-products-simple a {
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        line-height: 1.4 !important;
        padding: 8px 6px !important;
        font-size: 12.5px !important;
        text-align: center;
    }
    
    /* 전화번호·CTA 버튼 텍스트가 안 잘리도록 */
    .btn, .nav-cta, button, a[href^="tel"] {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}


/* === 온라인 문의 폼 (모든 페이지 공통) === */
.contact-section {
    padding: 100px 0;
    background: var(--cream-dark);
}
.contact-section .container {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 60px;
    align-items: start;
    max-width: 1140px;
}
.contact-intro {
    position: sticky;
    top: 100px;
}
.contact-intro .cta-label {
    text-align: left;
    font-size: 13px;
    font-weight: 700;
    color: var(--coral);
    letter-spacing: 3px;
    margin-bottom: 16px;
}
.contact-title {
    font-size: clamp(32px, 4vw, 48px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0 0 16px;
}
.contact-sub {
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.7;
    margin: 0 0 32px;
}
.contact-direct {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.contact-direct-btn {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 22px;
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 14px;
    transition: all 0.2s;
    text-decoration: none;
    color: inherit;
}
.contact-direct-btn:hover {
    border-color: var(--forest);
    transform: translateX(4px);
}
.contact-direct-btn .cd-icon {
    width: 44px;
    height: 44px;
    background: var(--cream-dark);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
}
.cd-label {
    display: block;
    font-size: 12px;
    color: var(--ink-soft);
    margin-bottom: 2px;
}
.cd-value {
    display: block;
    font-size: 16px;
    font-weight: 700;
    color: var(--ink);
}

/* 문의 폼 박스 */
.contact-form-box {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 40px 36px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}
.contact-form-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 22px;
    font-weight: 800;
    margin: 0 0 28px;
    letter-spacing: -0.01em;
}
.cf-bar {
    width: 4px;
    height: 22px;
    background: var(--coral);
    border-radius: 2px;
}
.contact-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.form-group {
    display: flex;
    flex-direction: column;
}
.form-group label {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 8px;
}
.required {
    color: var(--coral);
}
.form-group input,
.form-group select,
.form-group textarea {
    padding: 14px 16px;
    font-size: 14px;
    font-family: inherit;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: #fafafa;
    color: var(--ink);
    transition: all 0.2s;
    width: 100%;
    box-sizing: border-box;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--forest);
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(45, 74, 62, 0.1);
}
.form-group input::placeholder,
.form-group textarea::placeholder {
    color: #b0b0b0;
}
.form-group textarea {
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
}
.form-group select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23666' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    background-size: 10px;
    padding-right: 40px;
}
.form-agree {
    padding: 16px;
    background: #fafafa;
    border-radius: 10px;
    border: 1px solid var(--border);
}
.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
}
.checkbox-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--forest);
    cursor: pointer;
}
.agree-detail {
    font-size: 11px;
    color: var(--ink-soft);
    margin-top: 8px;
    padding-left: 26px;
    line-height: 1.6;
}
.contact-submit {
    background: var(--ink);
    color: #ffffff;
    border: none;
    padding: 18px 28px;
    font-size: 16px;
    font-weight: 700;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    margin-top: 8px;
}
.contact-submit:hover {
    background: var(--forest);
    transform: translateY(-2px);
}
.contact-submit:disabled {
    background: #999;
    cursor: not-allowed;
    transform: none;
}
.form-message {
    padding: 20px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    display: none;
    margin-top: 16px;
}
.form-message.success {
    display: block;
    background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
    color: #1b5e20;
    border: 2px solid #66bb6a;
    box-shadow: 0 4px 16px rgba(76, 175, 80, 0.2);
    animation: messagePop 0.4s ease;
}
.form-message.error {
    display: block;
    background: linear-gradient(135deg, #ffebee, #ffcdd2);
    color: #b71c1c;
    border: 2px solid #ef5350;
    box-shadow: 0 4px 16px rgba(244, 67, 54, 0.2);
    animation: messagePop 0.4s ease;
}
@keyframes messagePop {
    0% { transform: scale(0.9); opacity: 0; }
    60% { transform: scale(1.02); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}

/* 모바일 */
@media (max-width: 900px) {
    .contact-section .container {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .contact-intro {
        position: static;
        text-align: center;
    }
    .contact-intro .cta-label { text-align: center; }
    .contact-direct-btn { flex-direction: row; text-align: left; }
    .contact-form-box { padding: 28px 24px; }
}

</style>
</head>
<body>

    <!-- 헤더 -->
    <header>
        <nav class="nav">
            <a href="/" class="logo">
                <img src="/brand.png" alt="마스터페이" class="logo-mark-img">
                마스터페이
            </a>
            
            <ul class="nav-menu" id="navMenu">
                <li><a href="/#find-sec">지역별 설치</a></li>
                <li><a href="/#allinone">제품 안내</a></li>
                <li><a href="/#process">프로세스</a></li>
                <li><a href="/#faq">자주 묻는 질문</a></li>
            </ul>
            
            <a href="/#contact" class="nav-cta">문의하기</a>
            <button class="mobile-toggle" onclick="toggleMenu()">☰</button>
        </nav>
    </header>

    <!-- 제품 히어로 -->
    <section class="product-hero">
        <div class="container">
            <div class="breadcrumb">
                <a href="/">홈</a>
                <span class="breadcrumb-separator">/</span>
                <a href="/#products">제품</a>
                <span class="breadcrumb-separator">/</span>
                <span>2인치 단말기</span>
            </div>
            
            <div class="product-grid">
                <div class="product-info">
                    <span class="product-badge">2inch Compact</span>
                    <h1 class="product-title">
                        2인치 단말기
                    </h1>
                    <p class="product-lead">좁은 공간에도 깔끔하게 설치되는 컴팩트 사이즈 2인치 카드 단말기. KIS2200·KPN1902 등 검증된 모델로 안정적인 결제 환경을 제공합니다.</p>
                    
                    <div class="product-specs">
                    <div class="spec-item">
                        <div class="spec-label">Display</div>
                        <div class="spec-value">2인치 컴팩트</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Type</div>
                        <div class="spec-value">유선·무선 선택</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Model</div>
                        <div class="spec-value">KIS2200, KPN1902 외</div>
                    </div>
                    </div>
                    
                    <div class="product-cta">
                        <a href="/#contact" class="btn btn-primary">
                            무료 상담 신청 →
                        </a>
                        <a href="tel:010-2337-0458" class="btn btn-ghost">
                            📞 전화 상담
                        </a>
                    </div>
                </div>
                
                <div class="product-visual">
                    <img src="https://raw.githubusercontent.com/YOONSOEUN1/mastarpay/main/images/kis2200_2in.jpg" alt="2인치 단말기" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
            </div>
        </div>
    </section>

    <!-- 특징 섹션 -->
    <section class="features">
        <div class="container">
            <div class="section-header">
                <span class="section-num">01 / Features</span>
                <h2 class="section-title">
                    이런 특징이 있어요.
                </h2>
            </div>
            
            <div class="feature-grid">
                <div class="feature-item">
                    <div class="feature-icon">🏆</div>
                    <h3 class="feature-title">검증된 품질</h3>
                    <p class="feature-desc">업계에서 인정받은 최고의 모델만을 엄선하여 제공합니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">⚡</div>
                    <h3 class="feature-title">빠른 설치</h3>
                    <p class="feature-desc">상담 후 빠른 일정으로 설치가 완료됩니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">💰</div>
                    <h3 class="feature-title">합리적 비용</h3>
                    <p class="feature-desc">설치비 무료 옵션과 렌탈 프로그램으로 부담이 적습니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🔧</div>
                    <h3 class="feature-title">A/S 보장</h3>
                    <p class="feature-desc">장애 시 원격 지원과 현장 출동으로 빠르게 해결합니다.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 상세 내용 -->
    <section class="detail">
        <div class="container">
            <div class="section-header">
                <span class="section-num">02 / Details</span>
                <h2 class="section-title">
                    자세히 알아보기.
                </h2>
            </div>
            
            <div class="detail-content">
                
                <h3>2인치 단말기가 필요한 이유</h3>
                <p>2인치 카드 단말기는 컴팩트한 크기가 가장 큰 매력입니다. 카운터 공간이 부족한 편의점, 소규모 카페, 분식집, 독서실 등에서 인기가 매우 높습니다. 작은 사이즈에도 불구하고 필요한 모든 결제 기능을 완벽하게 지원하며, 최신 IC칩·NFC·QR코드·간편결제까지 한 대로 모두 처리할 수 있습니다.</p>
                <p>마스터페이는 KIS2200, KPN1902 등 업계에서 검증된 2인치 모델을 취급합니다. 안정적인 성능과 빠른 결제 속도, 세련된 디자인으로 매장 분위기를 해치지 않으면서 전문적인 인상을 줍니다.</p>
                
                <h3>2인치 단말기 설치 프로세스</h3>
                <ul>
                    <li>1단계 무료 상담 — 전화나 문자로 매장 환경을 간단히 공유해주세요</li>
                    <li>2단계 모델 추천 — 유선·무선·토스 등 매장 상황에 맞는 최적 모델을 추천합니다</li>
                    <li>3단계 VAN사 선정 — 가장 유리한 수수료 조건의 VAN사를 함께 선정합니다</li>
                    <li>4단계 방문 설치 — 전문 기사가 직접 방문하여 설치와 테스트를 완료합니다</li>
                    <li>5단계 사용법 안내 — 현장에서 직접 사용법을 안내드립니다</li>
                    <li>6단계 A/S 보장 — 설치 후에도 지속적으로 관리해드립니다</li>
                </ul>
                
                <h3>2인치 단말기의 주요 특징</h3>
                <ul>
                    <li>공간 절약형 — 손바닥만한 크기로 좁은 카운터에도 깔끔하게 설치됩니다</li>
                    <li>빠른 결제 속도 — 고성능 프로세서로 결제 대기 시간을 최소화합니다</li>
                    <li>모든 카드 지원 — IC칩, 마그네틱, 컨택리스, 삼성페이, 카카오페이, 네이버페이 모두 지원</li>
                    <li>안정적인 전력 — 유선 타입은 안정적인 전원 공급으로 끊김 없이 사용 가능합니다</li>
                    <li>세련된 디자인 — 모던한 디자인으로 매장 분위기를 한층 업그레이드합니다</li>
                    <li>소음 최소화 — 영수증 출력 시 소음이 적어 조용한 매장에도 적합합니다</li>
                </ul>
                
                <h3>이런 매장에 추천합니다</h3>
                <p>카운터 공간이 협소한 편의점·매점, 깔끔한 디자인을 원하는 카페·베이커리, 이동 없이 고정된 위치에서만 결제하는 매장, 고객 대면 결제가 주된 업종에 특히 적합합니다. 분식집, 간이음식점, 독서실, 소규모 미용실 등 공간이 제한적인 모든 매장에서 훌륭한 선택입니다.</p>
                
                <h3>2인치 단말기 VS 3인치 단말기 비교</h3>
                <p>2인치 단말기는 공간 효율성과 현대적 디자인이 장점이며, 고정된 카운터에서 결제하는 매장에 최적입니다. 반면 3인치 단말기는 영수증 가독성이 좋고 화면이 커서 매출 내역 확인이 편리합니다. 세금계산서 발행이 잦거나 영수증을 많이 발급하는 업종에는 3인치를, 컴팩트한 공간과 모던한 디자인을 원하면 2인치를 추천드립니다.</p>
                
                <h3>자주 묻는 질문</h3>
                <p><strong>Q. 2인치 단말기도 영수증이 나오나요?</strong><br>네, 2인치에서도 영수증이 출력됩니다. 다만 폭이 좁아 3인치보다는 영수증 크기가 작습니다.</p>
                <p><strong>Q. 무선 모델도 있나요?</strong><br>네, 2인치 사이즈에도 무선 모델이 있습니다. 배달이나 테이블 결제가 필요한 경우 무선 모델을 추천드립니다.</p>
                <p><strong>Q. 기존 단말기와 교체 가능한가요?</strong><br>네, 기존 장비 교체도 동일한 무료 혜택으로 진행됩니다. VAN사 변경 시에도 별도 비용이 없습니다.</p>
                <p><strong>Q. 설치 후 A/S는 어떻게 받나요?</strong><br>장애 시 전화 한 통이면 원격 지원으로 대부분 즉시 해결됩니다. 하드웨어 문제는 엔지니어가 현장 출동합니다.</p>
    
            </div>
        </div>
    </section>

    <!-- 관련 제품 -->
    <section class="related">
        <div class="container">
            <div class="section-header">
                <span class="section-num">03 / Related</span>
                <h2 class="section-title">
                    다른 제품도 둘러보세요.
                </h2>
            </div>
            
            <div class="related-grid">
                <a href="/product/card-3inch" class="related-card">
                    <div class="related-icon">🖨️</div>
                    <div class="related-name">3인치 단말기</div>
                    <div class="related-desc">큰 화면 스탠다드</div>
                </a>
                <a href="/product/card-toss" class="related-card">
                    <div class="related-icon">⚡</div>
                    <div class="related-name">토스 단말기</div>
                    <div class="related-desc">간편결제 특화</div>
                </a>
                <a href="/product/card-wireless" class="related-card">
                    <div class="related-icon">📱</div>
                    <div class="related-name">무선 단말기</div>
                    <div class="related-desc">이동 결제 자유</div>
                </a>
            </div>
        </div>
    </section>

    <!-- CTA -->
    <section class="contact-section" id="contact">
        <div class="container">
            <div class="contact-intro">
                <div class="cta-label">— Contact Us —</div>
                <h2 class="contact-title">무료 상담 신청</h2>
                <p class="contact-sub">전화, 카카오톡 또는 아래 폼으로 문의해주세요.<br>담당자가 빠르게 연락드립니다.</p>
                <div class="contact-direct">
                    <a href="tel:010-2337-0458" class="contact-direct-btn">
                        <span class="cd-icon">📞</span>
                        <span><span class="cd-label">전화 상담</span><span class="cd-value">010-2337-0458</span></span>
                    </a>
                    <a href="javascript:void(0)" onclick="openKakao(); return false;" class="contact-direct-btn">
                        <span class="cd-icon">💬</span>
                        <span><span class="cd-label">카카오톡</span><span class="cd-value">바로 상담</span></span>
                    </a>
                </div>
            </div>
            <div class="contact-form-box">
                <h3 class="contact-form-title"><span class="cf-bar"></span><span>📝 온라인 문의</span></h3>
                <form id="contactForm" class="contact-form" onsubmit="return submitContactForm(event)">
                    <div class="form-group"><label for="name">상호(이름) <span class="required">*</span></label><input type="text" id="name" name="상호_이름" placeholder="상호 또는 이름을 입력하세요" required></div>
                    <div class="form-group"><label for="phone">연락처 <span class="required">*</span></label><input type="tel" id="phone" name="연락처" placeholder="010-0000-0000" required></div>
                    <div class="form-group"><label for="address">주소 <span class="required">*</span></label><input type="text" id="address" name="주소" placeholder="매장 주소" required><input type="text" id="address_detail" name="상세주소" placeholder="상세주소 (건물명, 층, 호수 등)" style="margin-top: 8px;"></div>
                    <div class="form-group"><label for="product">문의 제품 <span class="required">*</span></label><select id="product" name="문의_제품" required><option value="">선택해주세요</option><option value="포스기">포스기(POS)</option><option value="2인치 단말기">2인치 단말기</option><option value="3인치 단말기">3인치 단말기</option><option value="토스 단말기">토스 단말기</option><option value="무선 단말기">무선 단말기</option><option value="블루투스 단말기">블루투스 단말기</option><option value="키오스크">키오스크</option><option value="미니 키오스크">미니 키오스크</option><option value="테이블 오더">테이블 오더</option><option value="매장 철거">매장 철거</option><option value="여러 제품 패키지">여러 제품 패키지</option><option value="기타/미정">기타/미정</option></select></div>
                    <div class="form-group"><label for="business">업종</label><select id="business" name="업종"><option value="">선택해주세요</option><option value="음식점/식당">음식점/식당</option><option value="카페/베이커리">카페/베이커리</option><option value="편의점/마트">편의점/마트</option><option value="미용실/네일샵">미용실/네일샵</option><option value="스터디카페">스터디카페</option><option value="주점/호프">주점/호프</option><option value="무인매장">무인매장</option><option value="의류/잡화">의류/잡화</option><option value="병원/약국">병원/약국</option><option value="기타">기타</option></select></div>
                    <div class="form-group"><label for="message">문의 내용</label><textarea id="message" name="문의_내용" rows="5" placeholder="매장 위치, 현재 사용 장비, 궁금한 점 등을 자유롭게 적어주세요."></textarea></div>
                    <div class="form-agree"><label class="checkbox-label"><input type="checkbox" id="agree" required><span>개인정보 수집 및 이용에 동의합니다 <span class="required">*</span></span></label><div class="agree-detail">수집항목: 상호·연락처·주소·문의 내용 / 이용목적: 상담 및 견적 안내 / 보유기간: 3년</div></div>
                    <button type="submit" class="contact-submit" id="submitBtn"><span id="submitText">무료 상담 신청하기 →</span></button>
                    <div id="formMessage" class="form-message"></div>
                </form>
            </div>
        </div>
    </section>

    <!-- 푸터 -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="logo">
                        <img src="/brand.png" alt="마스터페이" class="logo-mark-img">
                        마스터페이
                    </div>
                    <p>매장 운영에 필요한 모든 장비<br>설치부터 A/S까지 한번에.</p>
                </div>
                
                <div class="footer-col">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="tel:010-2337-0458">📞 010-2337-0458</a></li>
                        <li><a href="https://pf.kakao.com/_fPrxbG/chat" target="_blank">💬 카카오톡 상담</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <span>© 2026 마스터페이. All rights reserved.</span>
                <span>개인정보처리방침 · 이용약관</span>
            </div>
        </div>
    </footer>

    <script>
        function toggleMenu() {
            document.getElementById('navMenu').classList.toggle('active');
        }
        function openKakao(){
          var url='https://pf.kakao.com/_fPrxbG/chat';
          var w=window.open(url,'_blank');
          if(!w||w.closed||typeof w.closed==='undefined'){window.location.href=url;}
        }
        function scrollToContact(event){
          if(event)event.preventDefault();
          var c=document.getElementById('contact');
          if(c){
            var top=c.getBoundingClientRect().top+window.pageYOffset-80;
            window.scrollTo({top:top,behavior:'smooth'});
          }else{window.location.href='/#contact';}
        }
        async function submitContactForm(event){
          if(event){event.preventDefault();event.stopPropagation();}
          var form=document.getElementById('contactForm');
          var submitBtn=document.getElementById('submitBtn');
          var submitText=document.getElementById('submitText');
          var formMessage=document.getElementById('formMessage');
          if(!form){alert('⚠️ 폼을 찾을 수 없습니다.');return false;}
          var agreeCheckbox=document.getElementById('agree');
          if(!agreeCheckbox||!agreeCheckbox.checked){alert('개인정보 수집 및 이용에 동의해주세요.');return false;}
          var name=document.getElementById('name').value.trim();
          var phone=document.getElementById('phone').value.trim();
          var address=document.getElementById('address').value.trim();
          var product=document.getElementById('product').value;
          if(!name){alert('상호(이름)을 입력해주세요.');document.getElementById('name').focus();return false;}
          if(!phone){alert('연락처를 입력해주세요.');document.getElementById('phone').focus();return false;}
          if(!address){alert('주소를 입력해주세요.');document.getElementById('address').focus();return false;}
          if(!product){alert('문의 제품을 선택해주세요.');document.getElementById('product').focus();return false;}
          if(submitBtn)submitBtn.disabled=true;
          if(submitText)submitText.textContent='전송 중...';
          if(formMessage){formMessage.className='form-message';formMessage.style.display='none';}
          var data={name:name,phone:phone,address:address,addressDetail:document.getElementById('address_detail').value.trim(),product:product,business:document.getElementById('business').value,message:document.getElementById('message').value.trim()};
          var result;
          try{
            var response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
            result=await response.json();
            if(result.success){
              if(formMessage){formMessage.className='form-message success';formMessage.style.display='block';formMessage.innerHTML='<div style="text-align:center;padding:24px 20px;"><div style="font-size:48px;margin-bottom:12px;">✅</div><div style="font-size:18px;font-weight:800;color:#2e7d32;margin-bottom:8px;">문의가 성공적으로 접수되었습니다!</div><div style="font-size:14px;color:#555;">24시간 이내에 연락드리겠습니다.<br>급하신 경우 <strong>010-2337-0458</strong>로 연락주세요.</div></div>';}
              form.reset();
              setTimeout(function(){if(formMessage)formMessage.scrollIntoView({behavior:'smooth',block:'center'});},100);
            }else{throw new Error(result.error||'전송에 실패했습니다.');}
          }catch(error){
            var errorMsg=error.message||'전송에 실패했습니다';
            if(formMessage){formMessage.className='form-message error';formMessage.style.display='block';formMessage.innerHTML='<div style="text-align:center;padding:20px;"><div style="font-size:40px;margin-bottom:10px;">❌</div><div style="font-size:16px;font-weight:700;margin-bottom:8px;">전송에 실패했습니다</div><div style="font-size:13px;margin-bottom:12px;color:#555;">'+errorMsg+'</div><div style="font-size:14px;margin-top:12px;"><strong>📞 010-2337-0458</strong><br>또는 카카오톡으로 문의해주세요.</div></div>';formMessage.scrollIntoView({behavior:'smooth',block:'center'});}
          }finally{
            if(submitBtn)submitBtn.disabled=false;
            if(submitText)submitText.textContent='무료 상담 신청하기 →';
          }
          return false;
        }
    </script>

</body>
</html>`;

const PAGE_CARD_3INCH = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
<link rel="icon" type="image/png" href="/brand.png">
<link rel="apple-touch-icon" href="/brand.png">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="naver-site-verification" content="53af8497b3a522a8a85a7b13bae57efd7e27fb5c" />
    <title>3인치 단말기 | 마스터페이</title>
    <meta name="description" content="가장 많이 사용되는 표준 사이즈 3인치 카드 단말기. 넓은 영수증 출력과 선명한 화면으로 업무 효율을 높입니다. KIS1420·KPN1901 등 대표 모델 취급.">
    <meta property="og:title" content="3인치 단말기 | 마스터페이">
    <meta property="og:description" content="가장 많이 사용되는 표준 사이즈 3인치 카드 단말기. 넓은 영수증 출력과 선명한 화면으로 업무 효율을 높입니다. KIS1420·KPN1901 등 대표 모델 취급.">
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&display=swap" rel="stylesheet">
    <style>/* ========== 공용 스타일 (모든 페이지에서 사용) ========== */

:root {
    --cream: #f7f4ed;
    --cream-dark: #ede8db;
    --ink: #1a1a1a;
    --ink-soft: #4a4a4a;
    --forest: #2d4a3e;
    --forest-dark: #1f352c;
    --coral: #e8763a;
    --border: #d9d3c4;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 80px; }

body {
    font-family: 'Pretendard Variable', Pretendard, -apple-system, sans-serif;
    background: #ffffff;
    color: var(--ink);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
}

a { text-decoration: none; color: inherit; }
img { max-width: 100%; display: block; }

.container {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 32px;
}

/* ========== 헤더 ========== */
header {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    background: var(--cream);
    z-index: 9999 !important;
    border-bottom: 1px solid var(--border);
}
body {
    padding-top: 72px;
}
@media (max-width: 768px) {
    body { padding-top: 60px; }
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 32px;
    max-width: 1240px;
    margin: 0 auto;
}

.logo {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 8px;
}

.logo-mark {
    width: 28px;
    height: 28px;
    background: var(--forest);
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--cream);
    font-size: 14px;
}
.logo-mark-img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    display: inline-block;
    vertical-align: middle;
}

.nav-menu {
    display: flex;
    gap: 40px;
    list-style: none;
}

.nav-menu a {
    font-size: 15px;
    font-weight: 500;
    color: var(--ink-soft);
    transition: color 0.2s;
}

.nav-menu a:hover { color: var(--ink); }

.nav-cta {
    background: var(--ink);
    color: var(--cream);
    padding: 10px 20px;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 600;
    transition: transform 0.2s;
}

.nav-cta:hover { transform: scale(1.03); }

.mobile-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

/* ========== 제품 페이지 전용 ========== */
.product-hero {
    padding: 60px 0 80px;
    position: relative;
    overflow: hidden;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--ink-soft);
    margin-bottom: 32px;
}

.breadcrumb a {
    color: var(--ink-soft);
    transition: color 0.2s;
}

.breadcrumb a:hover { color: var(--ink); }

.breadcrumb-separator {
    opacity: 0.4;
}

.product-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
}

.product-badge {
    display: inline-block;
    padding: 6px 14px;
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
    color: var(--coral);
    margin-bottom: 20px;
}

.product-title {
    font-size: clamp(36px, 5vw, 60px);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
}

.product-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}

.product-lead {
    font-size: 18px;
    color: var(--ink-soft);
    line-height: 1.6;
    margin-bottom: 32px;
}

.product-specs {
    display: flex;
    gap: 32px;
    padding: 24px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    margin-bottom: 32px;
    flex-wrap: wrap;
}

.spec-item .spec-label {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 13px;
    color: var(--coral);
    margin-bottom: 4px;
}

.spec-item .spec-value {
    font-size: 18px;
    font-weight: 700;
}

.product-cta {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.btn {
    padding: 16px 32px;
    border-radius: 100px;
    font-weight: 600;
    font-size: 15px;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid transparent;
}

.btn-primary {
    background: var(--ink);
    color: var(--cream);
}

.btn-primary:hover {
    background: var(--forest);
}

.btn-ghost {
    background: transparent;
    color: var(--ink);
    border-color: var(--border);
}

.btn-ghost:hover {
    background: var(--cream-dark);
}

/* 제품 이미지 영역 */
.product-visual {
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 32px;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 180px;
    position: relative;
    overflow: hidden;
}

.product-visual img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* ========== 특징 섹션 ========== */
.features {
    padding: 100px 0;
    background: var(--cream-dark);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
}

.section-header {
    display: flex;
    align-items: baseline;
    gap: 24px;
    margin-bottom: 64px;
    flex-wrap: wrap;
}

.section-num {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 28px;
    color: var(--coral);
    font-weight: 400;
}

.section-title {
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    flex: 1;
    min-width: 300px;
}

.section-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 2px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 24px;
    overflow: hidden;
}

.feature-item {
    background: var(--cream);
    padding: 40px 32px;
    transition: background 0.3s;
}

.feature-item:hover {
    background: var(--cream-dark);
}

.feature-icon {
    font-size: 36px;
    margin-bottom: 20px;
    display: inline-block;
}

.feature-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 12px;
    letter-spacing: -0.01em;
}

.feature-desc {
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.6;
}

/* ========== 상세 내용 섹션 ========== */
.detail {
    padding: 100px 0;
}

.detail-content {
    max-width: 800px;
    margin: 0 auto;
    font-size: 17px;
    line-height: 1.8;
    color: var(--ink-soft);
}

.detail-content h3 {
    font-size: 28px;
    font-weight: 800;
    color: var(--ink);
    margin: 48px 0 20px;
    letter-spacing: -0.02em;
}

.detail-content h3:first-child {
    margin-top: 0;
}

.detail-content p {
    margin-bottom: 20px;
}

.detail-content ul {
    list-style: none;
    padding: 0;
    margin-bottom: 20px;
}

.detail-content ul li {
    padding: 10px 0 10px 32px;
    position: relative;
    border-bottom: 1px solid var(--border);
}

.detail-content ul li:last-child {
    border-bottom: none;
}

.detail-content ul li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--coral);
    font-weight: 800;
    font-size: 18px;
}

/* ========== 관련 제품 ========== */
.related {
    padding: 100px 0;
    background: var(--cream-dark);
    border-top: 1px solid var(--border);
}

.related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
}

.related-card {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 28px;
    transition: all 0.3s;
    display: block;
}

.related-card:hover {
    transform: translateY(-4px);
    border-color: var(--ink);
}

.related-icon {
    font-size: 36px;
    margin-bottom: 16px;
}

.related-name {
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 6px;
}

.related-desc {
    font-size: 13px;
    color: var(--ink-soft);
}

/* ========== CTA 섹션 ========== */
.cta {
    background: var(--ink);
    color: var(--cream);
    padding: 120px 0;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.cta::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: var(--forest);
    border-radius: 50%;
    top: -300px;
    right: -200px;
    opacity: 0.4;
    filter: blur(80px);
}

.cta-content {
    position: relative;
    z-index: 1;
}

.cta-label {
    font-family: 'Fraunces', serif;
    font-style: italic;
    color: var(--coral);
    font-size: 18px;
    margin-bottom: 20px;
}

.cta h2 {
    font-size: clamp(32px, 5vw, 56px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-bottom: 40px;
}

.cta h2 .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--coral);
}

.cta-phone {
    display: inline-flex;
    align-items: center;
    gap: 16px;
    font-size: 28px;
    font-weight: 800;
    padding: 20px 40px;
    background: var(--cream);
    color: var(--ink);
    border-radius: 100px;
    transition: transform 0.2s;
    margin-bottom: 16px;
}

.cta-phone:hover {
    transform: scale(1.03);
}

.cta-note {
    opacity: 0.7;
    font-size: 14px;
}

/* ========== 푸터 ========== */
footer {
    background: var(--ink);
    color: var(--cream);
    padding: 60px 0 40px;
    border-top: 1px solid rgba(247, 244, 237, 0.1);
}

.footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
}

.footer-brand .logo {
    color: var(--cream);
    margin-bottom: 16px;
}

.footer-brand p {
    font-size: 14px;
    opacity: 0.7;
    max-width: 300px;
    line-height: 1.6;
}

.footer-col h4 {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 16px;
    color: var(--coral);
}

.footer-col ul { list-style: none; }
.footer-col li { margin-bottom: 10px; }

.footer-col a {
    font-size: 14px;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.footer-col a:hover { opacity: 1; }

.footer-bottom {
    padding-top: 30px;
    border-top: 1px solid rgba(247, 244, 237, 0.1);
    font-size: 13px;
    opacity: 0.6;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
}

/* ========== 모바일 대응 ========== */
@media (max-width: 900px) {
    .product-grid {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .footer-grid {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 640px) {
    .container { padding: 0 20px; }
    .nav { padding: 16px 20px; }
    .nav-menu, .nav-cta { display: none; }
    .mobile-toggle { display: block; }
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--cream);
        padding: 20px;
        gap: 20px;
        border-bottom: 1px solid var(--border);
    }
    .product-hero { padding: 40px 0 60px; }
    .features, .detail, .related { padding: 60px 0; }
    .cta { padding: 80px 0; }
    .footer-grid { grid-template-columns: 1fr; }
    .cta-phone { font-size: 20px; padding: 16px 28px; }
    .product-visual { font-size: 100px; }
}

/* ============================================================
   📱 모바일 반응형 종합 보강 (일괄 패치)
   ============================================================ */

/* 가로 스크롤 방지 (가장 중요) */
html, body {
    overflow-x: hidden;
    width: 100%;
    -webkit-text-size-adjust: 100%;
}

* { max-width: 100%; }
img, video, iframe { max-width: 100%; height: auto; }
table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }

/* 768px 이하 (태블릿 ↓) */
@media (max-width: 768px) {
    .container { padding: 0 16px !important; }
    
    /* 본문 텍스트 가독성 */
    body { font-size: 15px; line-height: 1.7; }
    h1 { font-size: clamp(22px, 5.5vw, 30px) !important; line-height: 1.25 !important; word-break: keep-all; }
    h2 { font-size: clamp(18px, 4.5vw, 24px) !important; line-height: 1.3 !important; word-break: keep-all; }
    h3 { font-size: clamp(15px, 4vw, 18px) !important; line-height: 1.35 !important; }
    p { word-break: keep-all; line-height: 1.75; }
    
    /* 헤더/네비 */
    .nav { padding: 14px 0 !important; }
    .nav-menu { display: none !important; }
    .mobile-toggle { display: block !important; font-size: 22px; background: none; border: 0; cursor: pointer; padding: 6px 10px; }
    .nav-menu.active { display: flex !important; flex-direction: column; position: absolute; top: 100%; left: 0; right: 0; background: var(--cream); padding: 16px; gap: 14px; border-top: 1px solid var(--border); z-index: 100; }
    .nav-cta { padding: 8px 14px !important; font-size: 13px !important; }
    .logo { font-size: 17px !important; gap: 8px !important; }
    .logo-mark, .logo-mark-img { width: 24px !important; height: 24px !important; font-size: 12px !important; }
    
    /* 그리드들 → 1열 */
    .region-features-grid,
    .region-biz-grid,
    .region-reviews-grid,
    .region-products-grid,
    .footer-grid,
    .features-grid,
    .product-cards-grid,
    .pricing-grid,
    .review-grid,
    .stat-cards { grid-template-columns: 1fr !important; gap: 12px !important; }
    
    /* 시도/시군구 통계 → 2열 (너무 좁아지면 1열) */
    .region-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
    
    /* 지역 리스트(시군구·동) → 2~3열 */
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; font-size: 13px; }
    
    /* 제품 그리드 → 2열 */
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
    
    /* 박스 패딩 축소 */
    .region-box { padding: 20px 18px !important; border-radius: 14px !important; margin-bottom: 14px !important; }
    .region-box-title { font-size: 17px !important; margin-bottom: 12px !important; }
    
    /* 썸네일 (Hero) */
    .region-thumbnail { max-width: 100% !important; max-height: 280px !important; aspect-ratio: 4/3 !important; margin: 0 auto 20px !important; border-radius: 14px !important; }
    .region-thumbnail-overlay { padding: 18px 16px !important; }
    .region-thumbnail-meta { font-size: 11px !important; gap: 6px !important; }
    .region-thumbnail-title { font-size: clamp(20px, 5.5vw, 28px) !important; line-height: 1.2 !important; margin-bottom: 8px !important; }
    .region-thumbnail-services { font-size: 12px !important; line-height: 1.5 !important; }
    .region-hero-sub-standalone { font-size: 14px !important; line-height: 1.7 !important; max-width: 100% !important; padding: 0 4px !important; }
    
    /* 제품 5줄 카드 폰트 축소 */
    .region-product-detail-card { padding: 14px 16px !important; }
    .region-product-detail-card h3 { font-size: 15px !important; }
    .region-product-detail-card li { font-size: 12.5px !important; line-height: 1.65 !important; }
    
    /* FAQ */
    .region-faq-item { padding: 12px 14px !important; }
    .region-faq-item strong { font-size: 13.5px !important; }
    .region-faq-item p { font-size: 12.5px !important; }
    
    /* 주의사항 */
    .region-caution-item { padding: 12px 14px !important; gap: 10px !important; }
    .region-caution-item h3 { font-size: 13.5px !important; }
    .region-caution-item p { font-size: 12.5px !important; }
    
    /* 추천 업종 카드 */
    .region-biz-card { padding: 12px 14px !important; }
    .region-biz-name { font-size: 13.5px !important; }
    .region-biz-effect { font-size: 12px !important; }
    .region-biz-stars { font-size: 11.5px !important; }
    
    /* CTA 박스 */
    .region-cta-box { padding: 24px 18px !important; }
    .region-cta-buttons { flex-direction: column !important; gap: 10px !important; }
    .region-cta-buttons .btn { width: 100% !important; text-align: center; padding: 12px !important; font-size: 14px !important; }
    
    /* 버튼 */
    .btn { font-size: 14px !important; padding: 10px 18px !important; }
    .btn-primary, .btn-ghost { width: auto; }
    
    /* breadcrumb */
    .breadcrumb { font-size: 11.5px !important; flex-wrap: wrap; gap: 4px; }
    
    /* 푸터 */
    footer { padding: 32px 0 24px !important; }
    .footer-grid { gap: 24px !important; }
    .footer-brand .logo { font-size: 18px !important; }
}

/* 480px 이하 (작은 모바일) */
@media (max-width: 480px) {
    .container { padding: 0 14px !important; }
    h1 { font-size: clamp(20px, 6vw, 26px) !important; }
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; font-size: 12.5px; }
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 6px !important; }
    .region-thumbnail { max-height: 240px !important; }
    .region-thumbnail-overlay { padding: 14px 12px !important; }
    .region-thumbnail-services { font-size: 11px !important; }
    .region-hero-sub-standalone { font-size: 13px !important; }
}

/* 360px 이하 (소형 모바일) */
@media (max-width: 360px) {
    .container { padding: 0 12px !important; }
    .region-stats-grid { grid-template-columns: 1fr !important; }
    .region-list-grid { grid-template-columns: 1fr !important; }
    .region-thumbnail-title { font-size: 19px !important; }
}


/* ============================================================
   📱 짤림 방지 추가 패치 (이미지·텍스트 모두)
   ============================================================ */

/* === 모든 화면 크기에서 짤림 방지 === */
* {
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
}

/* 모든 이미지가 부모 박스 안에 들어오도록 강제 */
img, picture, video, svg, canvas, iframe, embed, object {
    max-width: 100% !important;
    height: auto !important;
    display: block;
}

/* 모든 텍스트 박스가 부모 안에 들어오도록 */
p, h1, h2, h3, h4, h5, h6, span, div, li, a, strong, em, td, th {
    word-wrap: break-word;
    overflow-wrap: break-word;
    min-width: 0;
}

/* 한글 단어가 중간에 안 끊기도록 */
p, h1, h2, h3, h4, li {
    word-break: keep-all;
}

/* 영어·URL·이메일·전화번호 같은 긴 문자열 강제 줄바꿈 */
.long-text, code, pre, .url, a[href^="mailto"], a[href^="tel"], .breadcrumb {
    word-break: break-all;
    overflow-wrap: anywhere;
}

/* 그리드 자식이 부모를 넘는 것 방지 */
[class*="grid"], [class*="flex"] {
    min-width: 0;
}
[class*="grid"] > *, [class*="flex"] > * {
    min-width: 0;
    max-width: 100%;
}

/* 768px 이하에서 추가 짤림 방지 */
@media (max-width: 768px) {
    /* body 내부에서 가로로 넘는 요소 강제 정리 */
    body, html { max-width: 100vw !important; overflow-x: hidden !important; }
    
    /* 컨테이너·박스가 절대 가로폭 안 넘게 */
    .container, .region-box, .region-cta-box, header, footer, section {
        max-width: 100% !important;
        box-sizing: border-box !important;
    }
    
    /* 썸네일 안 텍스트도 wrap */
    .region-thumbnail-title, .region-thumbnail-services, .region-thumbnail-meta {
        max-width: 100% !important;
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        white-space: normal !important;
    }
    
    /* 통계 카드 숫자 폰트 축소 */
    .region-stats-grid .region-stat-num,
    .region-stats-grid .region-stat-value,
    [class*="stat-num"], [class*="stat-value"] {
        font-size: clamp(18px, 5vw, 24px) !important;
        word-break: break-all !important;
    }
    
    /* 표 가로 스크롤 처리 */
    table {
        display: block !important;
        overflow-x: auto !important;
        white-space: nowrap;
    }
    
    /* 긴 동 이름(예: "한국토지주택공사동") 줄바꿈 */
    .region-list-grid a, .region-products-simple a {
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        line-height: 1.4 !important;
        padding: 8px 6px !important;
        font-size: 12.5px !important;
        text-align: center;
    }
    
    /* 전화번호·CTA 버튼 텍스트가 안 잘리도록 */
    .btn, .nav-cta, button, a[href^="tel"] {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}


/* === 온라인 문의 폼 (모든 페이지 공통) === */
.contact-section {
    padding: 100px 0;
    background: var(--cream-dark);
}
.contact-section .container {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 60px;
    align-items: start;
    max-width: 1140px;
}
.contact-intro {
    position: sticky;
    top: 100px;
}
.contact-intro .cta-label {
    text-align: left;
    font-size: 13px;
    font-weight: 700;
    color: var(--coral);
    letter-spacing: 3px;
    margin-bottom: 16px;
}
.contact-title {
    font-size: clamp(32px, 4vw, 48px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0 0 16px;
}
.contact-sub {
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.7;
    margin: 0 0 32px;
}
.contact-direct {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.contact-direct-btn {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 22px;
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 14px;
    transition: all 0.2s;
    text-decoration: none;
    color: inherit;
}
.contact-direct-btn:hover {
    border-color: var(--forest);
    transform: translateX(4px);
}
.contact-direct-btn .cd-icon {
    width: 44px;
    height: 44px;
    background: var(--cream-dark);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
}
.cd-label {
    display: block;
    font-size: 12px;
    color: var(--ink-soft);
    margin-bottom: 2px;
}
.cd-value {
    display: block;
    font-size: 16px;
    font-weight: 700;
    color: var(--ink);
}

/* 문의 폼 박스 */
.contact-form-box {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 40px 36px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}
.contact-form-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 22px;
    font-weight: 800;
    margin: 0 0 28px;
    letter-spacing: -0.01em;
}
.cf-bar {
    width: 4px;
    height: 22px;
    background: var(--coral);
    border-radius: 2px;
}
.contact-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.form-group {
    display: flex;
    flex-direction: column;
}
.form-group label {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 8px;
}
.required {
    color: var(--coral);
}
.form-group input,
.form-group select,
.form-group textarea {
    padding: 14px 16px;
    font-size: 14px;
    font-family: inherit;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: #fafafa;
    color: var(--ink);
    transition: all 0.2s;
    width: 100%;
    box-sizing: border-box;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--forest);
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(45, 74, 62, 0.1);
}
.form-group input::placeholder,
.form-group textarea::placeholder {
    color: #b0b0b0;
}
.form-group textarea {
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
}
.form-group select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23666' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    background-size: 10px;
    padding-right: 40px;
}
.form-agree {
    padding: 16px;
    background: #fafafa;
    border-radius: 10px;
    border: 1px solid var(--border);
}
.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
}
.checkbox-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--forest);
    cursor: pointer;
}
.agree-detail {
    font-size: 11px;
    color: var(--ink-soft);
    margin-top: 8px;
    padding-left: 26px;
    line-height: 1.6;
}
.contact-submit {
    background: var(--ink);
    color: #ffffff;
    border: none;
    padding: 18px 28px;
    font-size: 16px;
    font-weight: 700;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    margin-top: 8px;
}
.contact-submit:hover {
    background: var(--forest);
    transform: translateY(-2px);
}
.contact-submit:disabled {
    background: #999;
    cursor: not-allowed;
    transform: none;
}
.form-message {
    padding: 20px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    display: none;
    margin-top: 16px;
}
.form-message.success {
    display: block;
    background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
    color: #1b5e20;
    border: 2px solid #66bb6a;
    box-shadow: 0 4px 16px rgba(76, 175, 80, 0.2);
    animation: messagePop 0.4s ease;
}
.form-message.error {
    display: block;
    background: linear-gradient(135deg, #ffebee, #ffcdd2);
    color: #b71c1c;
    border: 2px solid #ef5350;
    box-shadow: 0 4px 16px rgba(244, 67, 54, 0.2);
    animation: messagePop 0.4s ease;
}
@keyframes messagePop {
    0% { transform: scale(0.9); opacity: 0; }
    60% { transform: scale(1.02); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}

/* 모바일 */
@media (max-width: 900px) {
    .contact-section .container {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .contact-intro {
        position: static;
        text-align: center;
    }
    .contact-intro .cta-label { text-align: center; }
    .contact-direct-btn { flex-direction: row; text-align: left; }
    .contact-form-box { padding: 28px 24px; }
}

</style>
</head>
<body>

    <!-- 헤더 -->
    <header>
        <nav class="nav">
            <a href="/" class="logo">
                <img src="/brand.png" alt="마스터페이" class="logo-mark-img">
                마스터페이
            </a>
            
            <ul class="nav-menu" id="navMenu">
                <li><a href="/#find-sec">지역별 설치</a></li>
                <li><a href="/#allinone">제품 안내</a></li>
                <li><a href="/#process">프로세스</a></li>
                <li><a href="/#faq">자주 묻는 질문</a></li>
            </ul>
            
            <a href="/#contact" class="nav-cta">문의하기</a>
            <button class="mobile-toggle" onclick="toggleMenu()">☰</button>
        </nav>
    </header>

    <!-- 제품 히어로 -->
    <section class="product-hero">
        <div class="container">
            <div class="breadcrumb">
                <a href="/">홈</a>
                <span class="breadcrumb-separator">/</span>
                <a href="/#products">제품</a>
                <span class="breadcrumb-separator">/</span>
                <span>3인치 단말기</span>
            </div>
            
            <div class="product-grid">
                <div class="product-info">
                    <span class="product-badge">3inch Standard</span>
                    <h1 class="product-title">
                        3인치 단말기
                    </h1>
                    <p class="product-lead">가장 많이 사용되는 표준 사이즈 3인치 카드 단말기. 넓은 영수증 출력과 선명한 화면으로 업무 효율을 높입니다. KIS1420·KPN1901 등 대표 모델 취급.</p>
                    
                    <div class="product-specs">
                    <div class="spec-item">
                        <div class="spec-label">Display</div>
                        <div class="spec-value">3인치 스탠다드</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Type</div>
                        <div class="spec-value">유선·무선 선택</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Model</div>
                        <div class="spec-value">KIS1420/1421, KPN1901 외</div>
                    </div>
                    </div>
                    
                    <div class="product-cta">
                        <a href="/#contact" class="btn btn-primary">
                            무료 상담 신청 →
                        </a>
                        <a href="tel:010-2337-0458" class="btn btn-ghost">
                            📞 전화 상담
                        </a>
                    </div>
                </div>
                
                <div class="product-visual">
                    <img src="https://raw.githubusercontent.com/YOONSOEUN1/mastarpay/main/images/kis1420_3in2.jpg" alt="3인치 단말기" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
            </div>
        </div>
    </section>

    <!-- 특징 섹션 -->
    <section class="features">
        <div class="container">
            <div class="section-header">
                <span class="section-num">01 / Features</span>
                <h2 class="section-title">
                    이런 특징이 있어요.
                </h2>
            </div>
            
            <div class="feature-grid">
                <div class="feature-item">
                    <div class="feature-icon">🏆</div>
                    <h3 class="feature-title">검증된 품질</h3>
                    <p class="feature-desc">업계에서 인정받은 최고의 모델만을 엄선하여 제공합니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">⚡</div>
                    <h3 class="feature-title">빠른 설치</h3>
                    <p class="feature-desc">상담 후 빠른 일정으로 설치가 완료됩니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">💰</div>
                    <h3 class="feature-title">합리적 비용</h3>
                    <p class="feature-desc">설치비 무료 옵션과 렌탈 프로그램으로 부담이 적습니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🔧</div>
                    <h3 class="feature-title">A/S 보장</h3>
                    <p class="feature-desc">장애 시 원격 지원과 현장 출동으로 빠르게 해결합니다.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 상세 내용 -->
    <section class="detail">
        <div class="container">
            <div class="section-header">
                <span class="section-num">02 / Details</span>
                <h2 class="section-title">
                    자세히 알아보기.
                </h2>
            </div>
            
            <div class="detail-content">
                
                <h3>3인치 단말기가 가장 많이 쓰이는 이유</h3>
                <p>3인치 카드 단말기는 국내 매장에서 가장 널리 사용되는 표준 사이즈입니다. 영수증 가독성과 화면 크기의 균형이 가장 뛰어나, 대부분의 업종에서 첫 번째 선택으로 꼽힙니다. 넓은 영수증 폭으로 내역이 한눈에 보이고, 넉넉한 화면으로 결제 금액 확인이 쉬워 실수를 줄일 수 있습니다.</p>
                <p>마스터페이는 KIS1420, KIS1421, KPN1901 등 국내 최고 품질의 3인치 단말기를 취급합니다. 오랜 시간 사용해도 안정적인 성능을 유지하는 검증된 모델들로, 음식점·카페·편의점·미용실 등 업종에 상관없이 최적의 결제 경험을 제공합니다.</p>
                
                <h3>3인치 단말기 설치 프로세스</h3>
                <ul>
                    <li>1단계 무료 상담 — 매장 업종과 월 결제 건수를 간단히 알려주세요</li>
                    <li>2단계 VAN사 비교 — VAN사별 수수료를 비교하여 가장 유리한 조건을 찾아드립니다</li>
                    <li>3단계 모델 선정 — KIS1420, KIS1421, KPN1901 중 매장에 맞는 모델을 추천합니다</li>
                    <li>4단계 빠른 설치 — 전문 기사가 당일 또는 1~2일 내 설치를 완료합니다</li>
                    <li>5단계 사용법 교육 — 직원들이 바로 사용할 수 있도록 현장 교육을 진행합니다</li>
                    <li>6단계 지속 관리 — 설치 후에도 정기적으로 점검하고 관리합니다</li>
                </ul>
                
                <h3>3인치 단말기 주요 기능</h3>
                <ul>
                    <li>선명한 영수증 출력 — 3인치 폭으로 영수증이 넉넉하게 출력되어 가독성이 매우 좋습니다</li>
                    <li>큰 화면 디스플레이 — 결제 금액과 내역을 한눈에 확인할 수 있어 실수를 줄입니다</li>
                    <li>모든 결제 수단 지원 — 카드·삼성페이·카카오페이·네이버페이·제로페이까지 완벽 지원</li>
                    <li>안정성과 내구성 — 하루 수백 건의 결제에도 지치지 않는 검증된 내구성</li>
                    <li>세금계산서 발행 — 전자세금계산서 자동 발행으로 사업자 고객 응대가 편합니다</li>
                    <li>포스기 연동 — 매장 포스기와 자동 연동되어 매출 데이터가 통합 관리됩니다</li>
                </ul>
                
                <h3>이런 매장에 추천합니다</h3>
                <p>영수증 발행이 잦은 음식점·카페, 현금영수증이나 세금계산서 발행이 필요한 업종, 큰 화면으로 결제 내역을 꼼꼼히 확인하고 싶은 매장, 일반적인 표준 사이즈를 원하는 사장님께 추천합니다. 한식당, 고깃집, 호프집, 중형 카페, 프랜차이즈 등 거의 모든 업종에 적합합니다.</p>
                
                <h3>대표 모델 소개</h3>
                <p><strong>KIS1420 / KIS1421</strong> — 국내 가장 인기 있는 3인치 모델. 안정성과 가격 경쟁력이 뛰어나 소상공인에게 가장 많이 선택되는 모델입니다. 자동 커팅 기능으로 영수증을 깔끔하게 자를 수 있습니다.</p>
                <p><strong>KPN1901</strong> — 프리미엄 3인치 모델. 빠른 인쇄 속도와 넓은 화면이 특징이며, 피크 타임에 결제가 몰리는 대형 매장에 적합합니다. 내구성이 뛰어나 365일 운영되는 프랜차이즈에서도 안정적으로 사용됩니다.</p>
                
                <h3>자주 묻는 질문</h3>
                <p><strong>Q. 3인치와 2인치 중 어느 것이 좋나요?</strong><br>영수증이 자주 출력되고 가독성이 중요하면 3인치, 공간이 협소하면 2인치를 추천합니다. 매장 환경을 알려주시면 맞춤 추천해드립니다.</p>
                <p><strong>Q. 카드 수수료는 얼마인가요?</strong><br>VAN사와 카드 종류에 따라 다릅니다. 마스터페이는 여러 VAN사 수수료를 비교하여 가장 저렴한 조건을 찾아드립니다.</p>
                <p><strong>Q. 설치는 얼마나 걸리나요?</strong><br>간단한 경우 당일 설치가 가능하며, 보통 상담 후 1~2일 내로 설치가 완료됩니다.</p>
                <p><strong>Q. 기존 단말기 교체도 되나요?</strong><br>네, 기존 단말기 교체 시에도 무료로 진행됩니다. VAN사 변경이 필요한 경우에도 마스터페이가 도와드립니다.</p>
    
            </div>
        </div>
    </section>

    <!-- 관련 제품 -->
    <section class="related">
        <div class="container">
            <div class="section-header">
                <span class="section-num">03 / Related</span>
                <h2 class="section-title">
                    다른 제품도 둘러보세요.
                </h2>
            </div>
            
            <div class="related-grid">
                <a href="/product/card-2inch" class="related-card">
                    <div class="related-icon">💳</div>
                    <div class="related-name">2인치 단말기</div>
                    <div class="related-desc">컴팩트 사이즈</div>
                </a>
                <a href="/product/card-wireless" class="related-card">
                    <div class="related-icon">📱</div>
                    <div class="related-name">무선 단말기</div>
                    <div class="related-desc">어디서든 결제</div>
                </a>
                <a href="/product/pos" class="related-card">
                    <div class="related-icon">🖥️</div>
                    <div class="related-name">포스기</div>
                    <div class="related-desc">통합 관리 시스템</div>
                </a>
            </div>
        </div>
    </section>

    <!-- CTA -->
    <section class="contact-section" id="contact">
        <div class="container">
            <div class="contact-intro">
                <div class="cta-label">— Contact Us —</div>
                <h2 class="contact-title">무료 상담 신청</h2>
                <p class="contact-sub">전화, 카카오톡 또는 아래 폼으로 문의해주세요.<br>담당자가 빠르게 연락드립니다.</p>
                <div class="contact-direct">
                    <a href="tel:010-2337-0458" class="contact-direct-btn">
                        <span class="cd-icon">📞</span>
                        <span><span class="cd-label">전화 상담</span><span class="cd-value">010-2337-0458</span></span>
                    </a>
                    <a href="javascript:void(0)" onclick="openKakao(); return false;" class="contact-direct-btn">
                        <span class="cd-icon">💬</span>
                        <span><span class="cd-label">카카오톡</span><span class="cd-value">바로 상담</span></span>
                    </a>
                </div>
            </div>
            <div class="contact-form-box">
                <h3 class="contact-form-title"><span class="cf-bar"></span><span>📝 온라인 문의</span></h3>
                <form id="contactForm" class="contact-form" onsubmit="return submitContactForm(event)">
                    <div class="form-group"><label for="name">상호(이름) <span class="required">*</span></label><input type="text" id="name" name="상호_이름" placeholder="상호 또는 이름을 입력하세요" required></div>
                    <div class="form-group"><label for="phone">연락처 <span class="required">*</span></label><input type="tel" id="phone" name="연락처" placeholder="010-0000-0000" required></div>
                    <div class="form-group"><label for="address">주소 <span class="required">*</span></label><input type="text" id="address" name="주소" placeholder="매장 주소" required><input type="text" id="address_detail" name="상세주소" placeholder="상세주소 (건물명, 층, 호수 등)" style="margin-top: 8px;"></div>
                    <div class="form-group"><label for="product">문의 제품 <span class="required">*</span></label><select id="product" name="문의_제품" required><option value="">선택해주세요</option><option value="포스기">포스기(POS)</option><option value="2인치 단말기">2인치 단말기</option><option value="3인치 단말기">3인치 단말기</option><option value="토스 단말기">토스 단말기</option><option value="무선 단말기">무선 단말기</option><option value="블루투스 단말기">블루투스 단말기</option><option value="키오스크">키오스크</option><option value="미니 키오스크">미니 키오스크</option><option value="테이블 오더">테이블 오더</option><option value="매장 철거">매장 철거</option><option value="여러 제품 패키지">여러 제품 패키지</option><option value="기타/미정">기타/미정</option></select></div>
                    <div class="form-group"><label for="business">업종</label><select id="business" name="업종"><option value="">선택해주세요</option><option value="음식점/식당">음식점/식당</option><option value="카페/베이커리">카페/베이커리</option><option value="편의점/마트">편의점/마트</option><option value="미용실/네일샵">미용실/네일샵</option><option value="스터디카페">스터디카페</option><option value="주점/호프">주점/호프</option><option value="무인매장">무인매장</option><option value="의류/잡화">의류/잡화</option><option value="병원/약국">병원/약국</option><option value="기타">기타</option></select></div>
                    <div class="form-group"><label for="message">문의 내용</label><textarea id="message" name="문의_내용" rows="5" placeholder="매장 위치, 현재 사용 장비, 궁금한 점 등을 자유롭게 적어주세요."></textarea></div>
                    <div class="form-agree"><label class="checkbox-label"><input type="checkbox" id="agree" required><span>개인정보 수집 및 이용에 동의합니다 <span class="required">*</span></span></label><div class="agree-detail">수집항목: 상호·연락처·주소·문의 내용 / 이용목적: 상담 및 견적 안내 / 보유기간: 3년</div></div>
                    <button type="submit" class="contact-submit" id="submitBtn"><span id="submitText">무료 상담 신청하기 →</span></button>
                    <div id="formMessage" class="form-message"></div>
                </form>
            </div>
        </div>
    </section>

    <!-- 푸터 -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="logo">
                        <img src="/brand.png" alt="마스터페이" class="logo-mark-img">
                        마스터페이
                    </div>
                    <p>매장 운영에 필요한 모든 장비<br>설치부터 A/S까지 한번에.</p>
                </div>
                
                <div class="footer-col">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="tel:010-2337-0458">📞 010-2337-0458</a></li>
                        <li><a href="https://pf.kakao.com/_fPrxbG/chat" target="_blank">💬 카카오톡 상담</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <span>© 2026 마스터페이. All rights reserved.</span>
                <span>개인정보처리방침 · 이용약관</span>
            </div>
        </div>
    </footer>

    <script>
        function toggleMenu() {
            document.getElementById('navMenu').classList.toggle('active');
        }
        function openKakao(){
          var url='https://pf.kakao.com/_fPrxbG/chat';
          var w=window.open(url,'_blank');
          if(!w||w.closed||typeof w.closed==='undefined'){window.location.href=url;}
        }
        function scrollToContact(event){
          if(event)event.preventDefault();
          var c=document.getElementById('contact');
          if(c){
            var top=c.getBoundingClientRect().top+window.pageYOffset-80;
            window.scrollTo({top:top,behavior:'smooth'});
          }else{window.location.href='/#contact';}
        }
        async function submitContactForm(event){
          if(event){event.preventDefault();event.stopPropagation();}
          var form=document.getElementById('contactForm');
          var submitBtn=document.getElementById('submitBtn');
          var submitText=document.getElementById('submitText');
          var formMessage=document.getElementById('formMessage');
          if(!form){alert('⚠️ 폼을 찾을 수 없습니다.');return false;}
          var agreeCheckbox=document.getElementById('agree');
          if(!agreeCheckbox||!agreeCheckbox.checked){alert('개인정보 수집 및 이용에 동의해주세요.');return false;}
          var name=document.getElementById('name').value.trim();
          var phone=document.getElementById('phone').value.trim();
          var address=document.getElementById('address').value.trim();
          var product=document.getElementById('product').value;
          if(!name){alert('상호(이름)을 입력해주세요.');document.getElementById('name').focus();return false;}
          if(!phone){alert('연락처를 입력해주세요.');document.getElementById('phone').focus();return false;}
          if(!address){alert('주소를 입력해주세요.');document.getElementById('address').focus();return false;}
          if(!product){alert('문의 제품을 선택해주세요.');document.getElementById('product').focus();return false;}
          if(submitBtn)submitBtn.disabled=true;
          if(submitText)submitText.textContent='전송 중...';
          if(formMessage){formMessage.className='form-message';formMessage.style.display='none';}
          var data={name:name,phone:phone,address:address,addressDetail:document.getElementById('address_detail').value.trim(),product:product,business:document.getElementById('business').value,message:document.getElementById('message').value.trim()};
          var result;
          try{
            var response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
            result=await response.json();
            if(result.success){
              if(formMessage){formMessage.className='form-message success';formMessage.style.display='block';formMessage.innerHTML='<div style="text-align:center;padding:24px 20px;"><div style="font-size:48px;margin-bottom:12px;">✅</div><div style="font-size:18px;font-weight:800;color:#2e7d32;margin-bottom:8px;">문의가 성공적으로 접수되었습니다!</div><div style="font-size:14px;color:#555;">24시간 이내에 연락드리겠습니다.<br>급하신 경우 <strong>010-2337-0458</strong>로 연락주세요.</div></div>';}
              form.reset();
              setTimeout(function(){if(formMessage)formMessage.scrollIntoView({behavior:'smooth',block:'center'});},100);
            }else{throw new Error(result.error||'전송에 실패했습니다.');}
          }catch(error){
            var errorMsg=error.message||'전송에 실패했습니다';
            if(formMessage){formMessage.className='form-message error';formMessage.style.display='block';formMessage.innerHTML='<div style="text-align:center;padding:20px;"><div style="font-size:40px;margin-bottom:10px;">❌</div><div style="font-size:16px;font-weight:700;margin-bottom:8px;">전송에 실패했습니다</div><div style="font-size:13px;margin-bottom:12px;color:#555;">'+errorMsg+'</div><div style="font-size:14px;margin-top:12px;"><strong>📞 010-2337-0458</strong><br>또는 카카오톡으로 문의해주세요.</div></div>';formMessage.scrollIntoView({behavior:'smooth',block:'center'});}
          }finally{
            if(submitBtn)submitBtn.disabled=false;
            if(submitText)submitText.textContent='무료 상담 신청하기 →';
          }
          return false;
        }
    </script>

</body>
</html>`;

const PAGE_CARD_TOSS = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
<link rel="icon" type="image/png" href="/brand.png">
<link rel="apple-touch-icon" href="/brand.png">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="naver-site-verification" content="53af8497b3a522a8a85a7b13bae57efd7e27fb5c" />
    <title>토스 단말기 | 마스터페이</title>
    <meta name="description" content="토스페이먼츠와 완벽하게 연동되는 전용 단말기. 간편결제 특화 기능과 합리적인 수수료로 트렌디한 매장에 가장 적합한 결제 솔루션입니다.">
    <meta property="og:title" content="토스 단말기 | 마스터페이">
    <meta property="og:description" content="토스페이먼츠와 완벽하게 연동되는 전용 단말기. 간편결제 특화 기능과 합리적인 수수료로 트렌디한 매장에 가장 적합한 결제 솔루션입니다.">
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&display=swap" rel="stylesheet">
    <style>/* ========== 공용 스타일 (모든 페이지에서 사용) ========== */

:root {
    --cream: #f7f4ed;
    --cream-dark: #ede8db;
    --ink: #1a1a1a;
    --ink-soft: #4a4a4a;
    --forest: #2d4a3e;
    --forest-dark: #1f352c;
    --coral: #e8763a;
    --border: #d9d3c4;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 80px; }

body {
    font-family: 'Pretendard Variable', Pretendard, -apple-system, sans-serif;
    background: #ffffff;
    color: var(--ink);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
}

a { text-decoration: none; color: inherit; }
img { max-width: 100%; display: block; }

.container {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 32px;
}

/* ========== 헤더 ========== */
header {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    background: var(--cream);
    z-index: 9999 !important;
    border-bottom: 1px solid var(--border);
}
body {
    padding-top: 72px;
}
@media (max-width: 768px) {
    body { padding-top: 60px; }
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 32px;
    max-width: 1240px;
    margin: 0 auto;
}

.logo {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 8px;
}

.logo-mark {
    width: 28px;
    height: 28px;
    background: var(--forest);
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--cream);
    font-size: 14px;
}
.logo-mark-img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    display: inline-block;
    vertical-align: middle;
}

.nav-menu {
    display: flex;
    gap: 40px;
    list-style: none;
}

.nav-menu a {
    font-size: 15px;
    font-weight: 500;
    color: var(--ink-soft);
    transition: color 0.2s;
}

.nav-menu a:hover { color: var(--ink); }

.nav-cta {
    background: var(--ink);
    color: var(--cream);
    padding: 10px 20px;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 600;
    transition: transform 0.2s;
}

.nav-cta:hover { transform: scale(1.03); }

.mobile-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

/* ========== 제품 페이지 전용 ========== */
.product-hero {
    padding: 60px 0 80px;
    position: relative;
    overflow: hidden;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--ink-soft);
    margin-bottom: 32px;
}

.breadcrumb a {
    color: var(--ink-soft);
    transition: color 0.2s;
}

.breadcrumb a:hover { color: var(--ink); }

.breadcrumb-separator {
    opacity: 0.4;
}

.product-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
}

.product-badge {
    display: inline-block;
    padding: 6px 14px;
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
    color: var(--coral);
    margin-bottom: 20px;
}

.product-title {
    font-size: clamp(36px, 5vw, 60px);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
}

.product-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}

.product-lead {
    font-size: 18px;
    color: var(--ink-soft);
    line-height: 1.6;
    margin-bottom: 32px;
}

.product-specs {
    display: flex;
    gap: 32px;
    padding: 24px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    margin-bottom: 32px;
    flex-wrap: wrap;
}

.spec-item .spec-label {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 13px;
    color: var(--coral);
    margin-bottom: 4px;
}

.spec-item .spec-value {
    font-size: 18px;
    font-weight: 700;
}

.product-cta {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.btn {
    padding: 16px 32px;
    border-radius: 100px;
    font-weight: 600;
    font-size: 15px;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid transparent;
}

.btn-primary {
    background: var(--ink);
    color: var(--cream);
}

.btn-primary:hover {
    background: var(--forest);
}

.btn-ghost {
    background: transparent;
    color: var(--ink);
    border-color: var(--border);
}

.btn-ghost:hover {
    background: var(--cream-dark);
}

/* 제품 이미지 영역 */
.product-visual {
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 32px;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 180px;
    position: relative;
    overflow: hidden;
}

.product-visual img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* ========== 특징 섹션 ========== */
.features {
    padding: 100px 0;
    background: var(--cream-dark);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
}

.section-header {
    display: flex;
    align-items: baseline;
    gap: 24px;
    margin-bottom: 64px;
    flex-wrap: wrap;
}

.section-num {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 28px;
    color: var(--coral);
    font-weight: 400;
}

.section-title {
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    flex: 1;
    min-width: 300px;
}

.section-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 2px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 24px;
    overflow: hidden;
}

.feature-item {
    background: var(--cream);
    padding: 40px 32px;
    transition: background 0.3s;
}

.feature-item:hover {
    background: var(--cream-dark);
}

.feature-icon {
    font-size: 36px;
    margin-bottom: 20px;
    display: inline-block;
}

.feature-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 12px;
    letter-spacing: -0.01em;
}

.feature-desc {
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.6;
}

/* ========== 상세 내용 섹션 ========== */
.detail {
    padding: 100px 0;
}

.detail-content {
    max-width: 800px;
    margin: 0 auto;
    font-size: 17px;
    line-height: 1.8;
    color: var(--ink-soft);
}

.detail-content h3 {
    font-size: 28px;
    font-weight: 800;
    color: var(--ink);
    margin: 48px 0 20px;
    letter-spacing: -0.02em;
}

.detail-content h3:first-child {
    margin-top: 0;
}

.detail-content p {
    margin-bottom: 20px;
}

.detail-content ul {
    list-style: none;
    padding: 0;
    margin-bottom: 20px;
}

.detail-content ul li {
    padding: 10px 0 10px 32px;
    position: relative;
    border-bottom: 1px solid var(--border);
}

.detail-content ul li:last-child {
    border-bottom: none;
}

.detail-content ul li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--coral);
    font-weight: 800;
    font-size: 18px;
}

/* ========== 관련 제품 ========== */
.related {
    padding: 100px 0;
    background: var(--cream-dark);
    border-top: 1px solid var(--border);
}

.related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
}

.related-card {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 28px;
    transition: all 0.3s;
    display: block;
}

.related-card:hover {
    transform: translateY(-4px);
    border-color: var(--ink);
}

.related-icon {
    font-size: 36px;
    margin-bottom: 16px;
}

.related-name {
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 6px;
}

.related-desc {
    font-size: 13px;
    color: var(--ink-soft);
}

/* ========== CTA 섹션 ========== */
.cta {
    background: var(--ink);
    color: var(--cream);
    padding: 120px 0;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.cta::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: var(--forest);
    border-radius: 50%;
    top: -300px;
    right: -200px;
    opacity: 0.4;
    filter: blur(80px);
}

.cta-content {
    position: relative;
    z-index: 1;
}

.cta-label {
    font-family: 'Fraunces', serif;
    font-style: italic;
    color: var(--coral);
    font-size: 18px;
    margin-bottom: 20px;
}

.cta h2 {
    font-size: clamp(32px, 5vw, 56px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-bottom: 40px;
}

.cta h2 .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--coral);
}

.cta-phone {
    display: inline-flex;
    align-items: center;
    gap: 16px;
    font-size: 28px;
    font-weight: 800;
    padding: 20px 40px;
    background: var(--cream);
    color: var(--ink);
    border-radius: 100px;
    transition: transform 0.2s;
    margin-bottom: 16px;
}

.cta-phone:hover {
    transform: scale(1.03);
}

.cta-note {
    opacity: 0.7;
    font-size: 14px;
}

/* ========== 푸터 ========== */
footer {
    background: var(--ink);
    color: var(--cream);
    padding: 60px 0 40px;
    border-top: 1px solid rgba(247, 244, 237, 0.1);
}

.footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
}

.footer-brand .logo {
    color: var(--cream);
    margin-bottom: 16px;
}

.footer-brand p {
    font-size: 14px;
    opacity: 0.7;
    max-width: 300px;
    line-height: 1.6;
}

.footer-col h4 {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 16px;
    color: var(--coral);
}

.footer-col ul { list-style: none; }
.footer-col li { margin-bottom: 10px; }

.footer-col a {
    font-size: 14px;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.footer-col a:hover { opacity: 1; }

.footer-bottom {
    padding-top: 30px;
    border-top: 1px solid rgba(247, 244, 237, 0.1);
    font-size: 13px;
    opacity: 0.6;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
}

/* ========== 모바일 대응 ========== */
@media (max-width: 900px) {
    .product-grid {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .footer-grid {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 640px) {
    .container { padding: 0 20px; }
    .nav { padding: 16px 20px; }
    .nav-menu, .nav-cta { display: none; }
    .mobile-toggle { display: block; }
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--cream);
        padding: 20px;
        gap: 20px;
        border-bottom: 1px solid var(--border);
    }
    .product-hero { padding: 40px 0 60px; }
    .features, .detail, .related { padding: 60px 0; }
    .cta { padding: 80px 0; }
    .footer-grid { grid-template-columns: 1fr; }
    .cta-phone { font-size: 20px; padding: 16px 28px; }
    .product-visual { font-size: 100px; }
}

/* ============================================================
   📱 모바일 반응형 종합 보강 (일괄 패치)
   ============================================================ */

/* 가로 스크롤 방지 (가장 중요) */
html, body {
    overflow-x: hidden;
    width: 100%;
    -webkit-text-size-adjust: 100%;
}

* { max-width: 100%; }
img, video, iframe { max-width: 100%; height: auto; }
table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }

/* 768px 이하 (태블릿 ↓) */
@media (max-width: 768px) {
    .container { padding: 0 16px !important; }
    
    /* 본문 텍스트 가독성 */
    body { font-size: 15px; line-height: 1.7; }
    h1 { font-size: clamp(22px, 5.5vw, 30px) !important; line-height: 1.25 !important; word-break: keep-all; }
    h2 { font-size: clamp(18px, 4.5vw, 24px) !important; line-height: 1.3 !important; word-break: keep-all; }
    h3 { font-size: clamp(15px, 4vw, 18px) !important; line-height: 1.35 !important; }
    p { word-break: keep-all; line-height: 1.75; }
    
    /* 헤더/네비 */
    .nav { padding: 14px 0 !important; }
    .nav-menu { display: none !important; }
    .mobile-toggle { display: block !important; font-size: 22px; background: none; border: 0; cursor: pointer; padding: 6px 10px; }
    .nav-menu.active { display: flex !important; flex-direction: column; position: absolute; top: 100%; left: 0; right: 0; background: var(--cream); padding: 16px; gap: 14px; border-top: 1px solid var(--border); z-index: 100; }
    .nav-cta { padding: 8px 14px !important; font-size: 13px !important; }
    .logo { font-size: 17px !important; gap: 8px !important; }
    .logo-mark, .logo-mark-img { width: 24px !important; height: 24px !important; font-size: 12px !important; }
    
    /* 그리드들 → 1열 */
    .region-features-grid,
    .region-biz-grid,
    .region-reviews-grid,
    .region-products-grid,
    .footer-grid,
    .features-grid,
    .product-cards-grid,
    .pricing-grid,
    .review-grid,
    .stat-cards { grid-template-columns: 1fr !important; gap: 12px !important; }
    
    /* 시도/시군구 통계 → 2열 (너무 좁아지면 1열) */
    .region-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
    
    /* 지역 리스트(시군구·동) → 2~3열 */
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; font-size: 13px; }
    
    /* 제품 그리드 → 2열 */
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
    
    /* 박스 패딩 축소 */
    .region-box { padding: 20px 18px !important; border-radius: 14px !important; margin-bottom: 14px !important; }
    .region-box-title { font-size: 17px !important; margin-bottom: 12px !important; }
    
    /* 썸네일 (Hero) */
    .region-thumbnail { max-width: 100% !important; max-height: 280px !important; aspect-ratio: 4/3 !important; margin: 0 auto 20px !important; border-radius: 14px !important; }
    .region-thumbnail-overlay { padding: 18px 16px !important; }
    .region-thumbnail-meta { font-size: 11px !important; gap: 6px !important; }
    .region-thumbnail-title { font-size: clamp(20px, 5.5vw, 28px) !important; line-height: 1.2 !important; margin-bottom: 8px !important; }
    .region-thumbnail-services { font-size: 12px !important; line-height: 1.5 !important; }
    .region-hero-sub-standalone { font-size: 14px !important; line-height: 1.7 !important; max-width: 100% !important; padding: 0 4px !important; }
    
    /* 제품 5줄 카드 폰트 축소 */
    .region-product-detail-card { padding: 14px 16px !important; }
    .region-product-detail-card h3 { font-size: 15px !important; }
    .region-product-detail-card li { font-size: 12.5px !important; line-height: 1.65 !important; }
    
    /* FAQ */
    .region-faq-item { padding: 12px 14px !important; }
    .region-faq-item strong { font-size: 13.5px !important; }
    .region-faq-item p { font-size: 12.5px !important; }
    
    /* 주의사항 */
    .region-caution-item { padding: 12px 14px !important; gap: 10px !important; }
    .region-caution-item h3 { font-size: 13.5px !important; }
    .region-caution-item p { font-size: 12.5px !important; }
    
    /* 추천 업종 카드 */
    .region-biz-card { padding: 12px 14px !important; }
    .region-biz-name { font-size: 13.5px !important; }
    .region-biz-effect { font-size: 12px !important; }
    .region-biz-stars { font-size: 11.5px !important; }
    
    /* CTA 박스 */
    .region-cta-box { padding: 24px 18px !important; }
    .region-cta-buttons { flex-direction: column !important; gap: 10px !important; }
    .region-cta-buttons .btn { width: 100% !important; text-align: center; padding: 12px !important; font-size: 14px !important; }
    
    /* 버튼 */
    .btn { font-size: 14px !important; padding: 10px 18px !important; }
    .btn-primary, .btn-ghost { width: auto; }
    
    /* breadcrumb */
    .breadcrumb { font-size: 11.5px !important; flex-wrap: wrap; gap: 4px; }
    
    /* 푸터 */
    footer { padding: 32px 0 24px !important; }
    .footer-grid { gap: 24px !important; }
    .footer-brand .logo { font-size: 18px !important; }
}

/* 480px 이하 (작은 모바일) */
@media (max-width: 480px) {
    .container { padding: 0 14px !important; }
    h1 { font-size: clamp(20px, 6vw, 26px) !important; }
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; font-size: 12.5px; }
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 6px !important; }
    .region-thumbnail { max-height: 240px !important; }
    .region-thumbnail-overlay { padding: 14px 12px !important; }
    .region-thumbnail-services { font-size: 11px !important; }
    .region-hero-sub-standalone { font-size: 13px !important; }
}

/* 360px 이하 (소형 모바일) */
@media (max-width: 360px) {
    .container { padding: 0 12px !important; }
    .region-stats-grid { grid-template-columns: 1fr !important; }
    .region-list-grid { grid-template-columns: 1fr !important; }
    .region-thumbnail-title { font-size: 19px !important; }
}


/* ============================================================
   📱 짤림 방지 추가 패치 (이미지·텍스트 모두)
   ============================================================ */

/* === 모든 화면 크기에서 짤림 방지 === */
* {
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
}

/* 모든 이미지가 부모 박스 안에 들어오도록 강제 */
img, picture, video, svg, canvas, iframe, embed, object {
    max-width: 100% !important;
    height: auto !important;
    display: block;
}

/* 모든 텍스트 박스가 부모 안에 들어오도록 */
p, h1, h2, h3, h4, h5, h6, span, div, li, a, strong, em, td, th {
    word-wrap: break-word;
    overflow-wrap: break-word;
    min-width: 0;
}

/* 한글 단어가 중간에 안 끊기도록 */
p, h1, h2, h3, h4, li {
    word-break: keep-all;
}

/* 영어·URL·이메일·전화번호 같은 긴 문자열 강제 줄바꿈 */
.long-text, code, pre, .url, a[href^="mailto"], a[href^="tel"], .breadcrumb {
    word-break: break-all;
    overflow-wrap: anywhere;
}

/* 그리드 자식이 부모를 넘는 것 방지 */
[class*="grid"], [class*="flex"] {
    min-width: 0;
}
[class*="grid"] > *, [class*="flex"] > * {
    min-width: 0;
    max-width: 100%;
}

/* 768px 이하에서 추가 짤림 방지 */
@media (max-width: 768px) {
    /* body 내부에서 가로로 넘는 요소 강제 정리 */
    body, html { max-width: 100vw !important; overflow-x: hidden !important; }
    
    /* 컨테이너·박스가 절대 가로폭 안 넘게 */
    .container, .region-box, .region-cta-box, header, footer, section {
        max-width: 100% !important;
        box-sizing: border-box !important;
    }
    
    /* 썸네일 안 텍스트도 wrap */
    .region-thumbnail-title, .region-thumbnail-services, .region-thumbnail-meta {
        max-width: 100% !important;
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        white-space: normal !important;
    }
    
    /* 통계 카드 숫자 폰트 축소 */
    .region-stats-grid .region-stat-num,
    .region-stats-grid .region-stat-value,
    [class*="stat-num"], [class*="stat-value"] {
        font-size: clamp(18px, 5vw, 24px) !important;
        word-break: break-all !important;
    }
    
    /* 표 가로 스크롤 처리 */
    table {
        display: block !important;
        overflow-x: auto !important;
        white-space: nowrap;
    }
    
    /* 긴 동 이름(예: "한국토지주택공사동") 줄바꿈 */
    .region-list-grid a, .region-products-simple a {
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        line-height: 1.4 !important;
        padding: 8px 6px !important;
        font-size: 12.5px !important;
        text-align: center;
    }
    
    /* 전화번호·CTA 버튼 텍스트가 안 잘리도록 */
    .btn, .nav-cta, button, a[href^="tel"] {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}


/* === 온라인 문의 폼 (모든 페이지 공통) === */
.contact-section {
    padding: 100px 0;
    background: var(--cream-dark);
}
.contact-section .container {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 60px;
    align-items: start;
    max-width: 1140px;
}
.contact-intro {
    position: sticky;
    top: 100px;
}
.contact-intro .cta-label {
    text-align: left;
    font-size: 13px;
    font-weight: 700;
    color: var(--coral);
    letter-spacing: 3px;
    margin-bottom: 16px;
}
.contact-title {
    font-size: clamp(32px, 4vw, 48px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0 0 16px;
}
.contact-sub {
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.7;
    margin: 0 0 32px;
}
.contact-direct {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.contact-direct-btn {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 22px;
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 14px;
    transition: all 0.2s;
    text-decoration: none;
    color: inherit;
}
.contact-direct-btn:hover {
    border-color: var(--forest);
    transform: translateX(4px);
}
.contact-direct-btn .cd-icon {
    width: 44px;
    height: 44px;
    background: var(--cream-dark);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
}
.cd-label {
    display: block;
    font-size: 12px;
    color: var(--ink-soft);
    margin-bottom: 2px;
}
.cd-value {
    display: block;
    font-size: 16px;
    font-weight: 700;
    color: var(--ink);
}

/* 문의 폼 박스 */
.contact-form-box {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 40px 36px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}
.contact-form-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 22px;
    font-weight: 800;
    margin: 0 0 28px;
    letter-spacing: -0.01em;
}
.cf-bar {
    width: 4px;
    height: 22px;
    background: var(--coral);
    border-radius: 2px;
}
.contact-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.form-group {
    display: flex;
    flex-direction: column;
}
.form-group label {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 8px;
}
.required {
    color: var(--coral);
}
.form-group input,
.form-group select,
.form-group textarea {
    padding: 14px 16px;
    font-size: 14px;
    font-family: inherit;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: #fafafa;
    color: var(--ink);
    transition: all 0.2s;
    width: 100%;
    box-sizing: border-box;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--forest);
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(45, 74, 62, 0.1);
}
.form-group input::placeholder,
.form-group textarea::placeholder {
    color: #b0b0b0;
}
.form-group textarea {
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
}
.form-group select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23666' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    background-size: 10px;
    padding-right: 40px;
}
.form-agree {
    padding: 16px;
    background: #fafafa;
    border-radius: 10px;
    border: 1px solid var(--border);
}
.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
}
.checkbox-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--forest);
    cursor: pointer;
}
.agree-detail {
    font-size: 11px;
    color: var(--ink-soft);
    margin-top: 8px;
    padding-left: 26px;
    line-height: 1.6;
}
.contact-submit {
    background: var(--ink);
    color: #ffffff;
    border: none;
    padding: 18px 28px;
    font-size: 16px;
    font-weight: 700;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    margin-top: 8px;
}
.contact-submit:hover {
    background: var(--forest);
    transform: translateY(-2px);
}
.contact-submit:disabled {
    background: #999;
    cursor: not-allowed;
    transform: none;
}
.form-message {
    padding: 20px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    display: none;
    margin-top: 16px;
}
.form-message.success {
    display: block;
    background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
    color: #1b5e20;
    border: 2px solid #66bb6a;
    box-shadow: 0 4px 16px rgba(76, 175, 80, 0.2);
    animation: messagePop 0.4s ease;
}
.form-message.error {
    display: block;
    background: linear-gradient(135deg, #ffebee, #ffcdd2);
    color: #b71c1c;
    border: 2px solid #ef5350;
    box-shadow: 0 4px 16px rgba(244, 67, 54, 0.2);
    animation: messagePop 0.4s ease;
}
@keyframes messagePop {
    0% { transform: scale(0.9); opacity: 0; }
    60% { transform: scale(1.02); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}

/* 모바일 */
@media (max-width: 900px) {
    .contact-section .container {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .contact-intro {
        position: static;
        text-align: center;
    }
    .contact-intro .cta-label { text-align: center; }
    .contact-direct-btn { flex-direction: row; text-align: left; }
    .contact-form-box { padding: 28px 24px; }
}

</style>
</head>
<body>

    <!-- 헤더 -->
    <header>
        <nav class="nav">
            <a href="/" class="logo">
                <img src="/brand.png" alt="마스터페이" class="logo-mark-img">
                마스터페이
            </a>
            
            <ul class="nav-menu" id="navMenu">
                <li><a href="/#find-sec">지역별 설치</a></li>
                <li><a href="/#allinone">제품 안내</a></li>
                <li><a href="/#process">프로세스</a></li>
                <li><a href="/#faq">자주 묻는 질문</a></li>
            </ul>
            
            <a href="/#contact" class="nav-cta">문의하기</a>
            <button class="mobile-toggle" onclick="toggleMenu()">☰</button>
        </nav>
    </header>

    <!-- 제품 히어로 -->
    <section class="product-hero">
        <div class="container">
            <div class="breadcrumb">
                <a href="/">홈</a>
                <span class="breadcrumb-separator">/</span>
                <a href="/#products">제품</a>
                <span class="breadcrumb-separator">/</span>
                <span>토스 단말기</span>
            </div>
            
            <div class="product-grid">
                <div class="product-info">
                    <span class="product-badge">Toss Payments</span>
                    <h1 class="product-title">
                        토스 단말기
                    </h1>
                    <p class="product-lead">토스페이먼츠와 완벽하게 연동되는 전용 단말기. 간편결제 특화 기능과 합리적인 수수료로 트렌디한 매장에 가장 적합한 결제 솔루션입니다.</p>
                    
                    <div class="product-specs">
                    <div class="spec-item">
                        <div class="spec-label">Brand</div>
                        <div class="spec-value">토스페이먼츠</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Type</div>
                        <div class="spec-value">간편결제 특화</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Connect</div>
                        <div class="spec-value">토스 앱 연동</div>
                    </div>
                    </div>
                    
                    <div class="product-cta">
                        <a href="/#contact" class="btn btn-primary">
                            무료 상담 신청 →
                        </a>
                        <a href="tel:010-2337-0458" class="btn btn-ghost">
                            📞 전화 상담
                        </a>
                    </div>
                </div>
                
                <div class="product-visual">
                    <img src="https://raw.githubusercontent.com/YOONSOEUN1/mastarpay/main/images/Tosscard.png" alt="토스 단말기" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
            </div>
        </div>
    </section>

    <!-- 특징 섹션 -->
    <section class="features">
        <div class="container">
            <div class="section-header">
                <span class="section-num">01 / Features</span>
                <h2 class="section-title">
                    이런 특징이 있어요.
                </h2>
            </div>
            
            <div class="feature-grid">
                <div class="feature-item">
                    <div class="feature-icon">🏆</div>
                    <h3 class="feature-title">검증된 품질</h3>
                    <p class="feature-desc">업계에서 인정받은 최고의 모델만을 엄선하여 제공합니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">⚡</div>
                    <h3 class="feature-title">빠른 설치</h3>
                    <p class="feature-desc">상담 후 빠른 일정으로 설치가 완료됩니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">💰</div>
                    <h3 class="feature-title">합리적 비용</h3>
                    <p class="feature-desc">설치비 무료 옵션과 렌탈 프로그램으로 부담이 적습니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🔧</div>
                    <h3 class="feature-title">A/S 보장</h3>
                    <p class="feature-desc">장애 시 원격 지원과 현장 출동으로 빠르게 해결합니다.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 상세 내용 -->
    <section class="detail">
        <div class="container">
            <div class="section-header">
                <span class="section-num">02 / Details</span>
                <h2 class="section-title">
                    자세히 알아보기.
                </h2>
            </div>
            
            <div class="detail-content">
                
                <h3>토스 단말기가 주목받는 이유</h3>
                <p>토스 단말기는 토스페이먼츠와 완벽하게 연동되어 간편결제에 특화된 전용 카드 단말기입니다. 토스페이 사용자가 급증하는 요즘, 간편결제 비중이 높은 젊은 고객층 매장에서 특히 인기가 많습니다. QR 스캔 한 번으로 결제가 완료되는 빠른 속도와 세련된 디자인이 매장 분위기를 한층 업그레이드합니다.</p>
                <p>마스터페이는 토스페이먼츠 공식 제휴를 통해 토스 단말기를 저렴한 수수료로 제공합니다. 기존 카드결제는 물론 토스페이·삼성페이·카카오페이·네이버페이 등 모든 간편결제 수단을 한 대로 처리할 수 있어, 고객 편의성이 매우 높습니다.</p>
                
                <h3>토스 단말기 설치 프로세스</h3>
                <ul>
                    <li>1단계 무료 상담 — 매장의 주요 고객층과 결제 패턴을 알려주세요</li>
                    <li>2단계 수수료 안내 — 토스페이먼츠의 경쟁력 있는 수수료 조건을 상세히 안내합니다</li>
                    <li>3단계 가맹점 신청 — 토스페이먼츠 가맹점 등록을 마스터페이가 대행합니다</li>
                    <li>4단계 단말기 설치 — 전문 기사가 매장 방문하여 설치 및 세팅을 완료합니다</li>
                    <li>5단계 대시보드 안내 — 토스 매출 대시보드 사용법을 교육합니다</li>
                    <li>6단계 지속 지원 — 장애 시 즉시 대응하는 전담 A/S 체계를 운영합니다</li>
                </ul>
                
                <h3>토스 단말기 주요 기능</h3>
                <ul>
                    <li>토스페이 즉시 결제 — 토스페이 고객은 QR 스캔만으로 결제가 완료됩니다</li>
                    <li>저렴한 수수료 — 토스페이먼츠의 경쟁력 있는 수수료로 결제 비용을 절감합니다</li>
                    <li>통합 정산 — 모든 결제 내역이 토스 대시보드에서 실시간으로 확인됩니다</li>
                    <li>세련된 디자인 — 모던한 디자인으로 매장 분위기를 해치지 않고 오히려 세련미를 더합니다</li>
                    <li>빠른 정산 — 다음 영업일 정산으로 자금 회전이 빨라집니다</li>
                    <li>모바일 앱 연동 — 스마트폰 앱으로 매출과 결제 현황을 어디서든 확인 가능합니다</li>
                </ul>
                
                <h3>이런 매장에 추천합니다</h3>
                <p>젊은 층 고객이 많은 카페·디저트 가게, 토스페이 사용자가 많은 트렌디한 매장, 수수료 부담을 줄이고 싶은 소상공인, 실시간 매출 대시보드를 활용하고 싶은 사장님, 온라인 홍보를 적극 활용하는 매장에 특히 추천합니다. 브런치 카페, 디저트샵, 플라워샵, 공방, 편집샵 등 감성적인 매장과 잘 어울립니다.</p>
                
                <h3>토스 단말기의 차별점</h3>
                <p>기존 일반 카드 단말기와 달리, 토스 단말기는 토스페이먼츠의 강력한 인프라를 활용합니다. 결제 속도가 빠르고, 대시보드가 직관적이며, 모바일 앱으로 실시간 확인이 가능합니다. 또한 토스페이먼츠의 다양한 부가 서비스(예: 간편 환불, 자동 정산 리포트, 세무 연동 등)를 함께 활용할 수 있어 매장 운영의 편의성이 크게 향상됩니다.</p>
                
                <h3>자주 묻는 질문</h3>
                <p><strong>Q. 기존 카드결제도 되나요?</strong><br>물론입니다. 토스페이뿐만 아니라 일반 신용카드, 체크카드, 삼성페이, 카카오페이 등 모든 결제 수단을 지원합니다.</p>
                <p><strong>Q. 수수료는 얼마인가요?</strong><br>토스페이먼츠의 경쟁력 있는 수수료가 적용되며, 카드 종류와 매출 규모에 따라 달라집니다. 정확한 수수료는 상담 시 안내해드립니다.</p>
                <p><strong>Q. 기존 VAN사 단말기를 쓰고 있는데 교체 가능한가요?</strong><br>네, 기존 단말기에서 토스 단말기로 교체 가능합니다. 마스터페이가 교체 과정을 대행해드립니다.</p>
                <p><strong>Q. 토스페이 고객이 많지 않아도 도움이 될까요?</strong><br>네, 토스 단말기는 일반 카드결제도 처리 가능하며, 토스페이 고객이 점점 늘어나고 있어 미래 투자로도 좋은 선택입니다.</p>
    
            </div>
        </div>
    </section>

    <!-- 관련 제품 -->
    <section class="related">
        <div class="container">
            <div class="section-header">
                <span class="section-num">03 / Related</span>
                <h2 class="section-title">
                    다른 제품도 둘러보세요.
                </h2>
            </div>
            
            <div class="related-grid">
                <a href="/product/card-2inch" class="related-card">
                    <div class="related-icon">💳</div>
                    <div class="related-name">2인치 단말기</div>
                    <div class="related-desc">컴팩트 사이즈</div>
                </a>
                <a href="/product/card-3inch" class="related-card">
                    <div class="related-icon">🖨️</div>
                    <div class="related-name">3인치 단말기</div>
                    <div class="related-desc">스탠다드 모델</div>
                </a>
                <a href="/product/card-bluetooth" class="related-card">
                    <div class="related-icon">🔷</div>
                    <div class="related-name">블루투스 단말기</div>
                    <div class="related-desc">스마트폰 연동</div>
                </a>
            </div>
        </div>
    </section>

    <!-- CTA -->
    <section class="contact-section" id="contact">
        <div class="container">
            <div class="contact-intro">
                <div class="cta-label">— Contact Us —</div>
                <h2 class="contact-title">무료 상담 신청</h2>
                <p class="contact-sub">전화, 카카오톡 또는 아래 폼으로 문의해주세요.<br>담당자가 빠르게 연락드립니다.</p>
                <div class="contact-direct">
                    <a href="tel:010-2337-0458" class="contact-direct-btn">
                        <span class="cd-icon">📞</span>
                        <span><span class="cd-label">전화 상담</span><span class="cd-value">010-2337-0458</span></span>
                    </a>
                    <a href="javascript:void(0)" onclick="openKakao(); return false;" class="contact-direct-btn">
                        <span class="cd-icon">💬</span>
                        <span><span class="cd-label">카카오톡</span><span class="cd-value">바로 상담</span></span>
                    </a>
                </div>
            </div>
            <div class="contact-form-box">
                <h3 class="contact-form-title"><span class="cf-bar"></span><span>📝 온라인 문의</span></h3>
                <form id="contactForm" class="contact-form" onsubmit="return submitContactForm(event)">
                    <div class="form-group"><label for="name">상호(이름) <span class="required">*</span></label><input type="text" id="name" name="상호_이름" placeholder="상호 또는 이름을 입력하세요" required></div>
                    <div class="form-group"><label for="phone">연락처 <span class="required">*</span></label><input type="tel" id="phone" name="연락처" placeholder="010-0000-0000" required></div>
                    <div class="form-group"><label for="address">주소 <span class="required">*</span></label><input type="text" id="address" name="주소" placeholder="매장 주소" required><input type="text" id="address_detail" name="상세주소" placeholder="상세주소 (건물명, 층, 호수 등)" style="margin-top: 8px;"></div>
                    <div class="form-group"><label for="product">문의 제품 <span class="required">*</span></label><select id="product" name="문의_제품" required><option value="">선택해주세요</option><option value="포스기">포스기(POS)</option><option value="2인치 단말기">2인치 단말기</option><option value="3인치 단말기">3인치 단말기</option><option value="토스 단말기">토스 단말기</option><option value="무선 단말기">무선 단말기</option><option value="블루투스 단말기">블루투스 단말기</option><option value="키오스크">키오스크</option><option value="미니 키오스크">미니 키오스크</option><option value="테이블 오더">테이블 오더</option><option value="매장 철거">매장 철거</option><option value="여러 제품 패키지">여러 제품 패키지</option><option value="기타/미정">기타/미정</option></select></div>
                    <div class="form-group"><label for="business">업종</label><select id="business" name="업종"><option value="">선택해주세요</option><option value="음식점/식당">음식점/식당</option><option value="카페/베이커리">카페/베이커리</option><option value="편의점/마트">편의점/마트</option><option value="미용실/네일샵">미용실/네일샵</option><option value="스터디카페">스터디카페</option><option value="주점/호프">주점/호프</option><option value="무인매장">무인매장</option><option value="의류/잡화">의류/잡화</option><option value="병원/약국">병원/약국</option><option value="기타">기타</option></select></div>
                    <div class="form-group"><label for="message">문의 내용</label><textarea id="message" name="문의_내용" rows="5" placeholder="매장 위치, 현재 사용 장비, 궁금한 점 등을 자유롭게 적어주세요."></textarea></div>
                    <div class="form-agree"><label class="checkbox-label"><input type="checkbox" id="agree" required><span>개인정보 수집 및 이용에 동의합니다 <span class="required">*</span></span></label><div class="agree-detail">수집항목: 상호·연락처·주소·문의 내용 / 이용목적: 상담 및 견적 안내 / 보유기간: 3년</div></div>
                    <button type="submit" class="contact-submit" id="submitBtn"><span id="submitText">무료 상담 신청하기 →</span></button>
                    <div id="formMessage" class="form-message"></div>
                </form>
            </div>
        </div>
    </section>

    <!-- 푸터 -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="logo">
                        <img src="/brand.png" alt="마스터페이" class="logo-mark-img">
                        마스터페이
                    </div>
                    <p>매장 운영에 필요한 모든 장비<br>설치부터 A/S까지 한번에.</p>
                </div>
                
                <div class="footer-col">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="tel:010-2337-0458">📞 010-2337-0458</a></li>
                        <li><a href="https://pf.kakao.com/_fPrxbG/chat" target="_blank">💬 카카오톡 상담</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <span>© 2026 마스터페이. All rights reserved.</span>
                <span>개인정보처리방침 · 이용약관</span>
            </div>
        </div>
    </footer>

    <script>
        function toggleMenu() {
            document.getElementById('navMenu').classList.toggle('active');
        }
        function openKakao(){
          var url='https://pf.kakao.com/_fPrxbG/chat';
          var w=window.open(url,'_blank');
          if(!w||w.closed||typeof w.closed==='undefined'){window.location.href=url;}
        }
        function scrollToContact(event){
          if(event)event.preventDefault();
          var c=document.getElementById('contact');
          if(c){
            var top=c.getBoundingClientRect().top+window.pageYOffset-80;
            window.scrollTo({top:top,behavior:'smooth'});
          }else{window.location.href='/#contact';}
        }
        async function submitContactForm(event){
          if(event){event.preventDefault();event.stopPropagation();}
          var form=document.getElementById('contactForm');
          var submitBtn=document.getElementById('submitBtn');
          var submitText=document.getElementById('submitText');
          var formMessage=document.getElementById('formMessage');
          if(!form){alert('⚠️ 폼을 찾을 수 없습니다.');return false;}
          var agreeCheckbox=document.getElementById('agree');
          if(!agreeCheckbox||!agreeCheckbox.checked){alert('개인정보 수집 및 이용에 동의해주세요.');return false;}
          var name=document.getElementById('name').value.trim();
          var phone=document.getElementById('phone').value.trim();
          var address=document.getElementById('address').value.trim();
          var product=document.getElementById('product').value;
          if(!name){alert('상호(이름)을 입력해주세요.');document.getElementById('name').focus();return false;}
          if(!phone){alert('연락처를 입력해주세요.');document.getElementById('phone').focus();return false;}
          if(!address){alert('주소를 입력해주세요.');document.getElementById('address').focus();return false;}
          if(!product){alert('문의 제품을 선택해주세요.');document.getElementById('product').focus();return false;}
          if(submitBtn)submitBtn.disabled=true;
          if(submitText)submitText.textContent='전송 중...';
          if(formMessage){formMessage.className='form-message';formMessage.style.display='none';}
          var data={name:name,phone:phone,address:address,addressDetail:document.getElementById('address_detail').value.trim(),product:product,business:document.getElementById('business').value,message:document.getElementById('message').value.trim()};
          var result;
          try{
            var response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
            result=await response.json();
            if(result.success){
              if(formMessage){formMessage.className='form-message success';formMessage.style.display='block';formMessage.innerHTML='<div style="text-align:center;padding:24px 20px;"><div style="font-size:48px;margin-bottom:12px;">✅</div><div style="font-size:18px;font-weight:800;color:#2e7d32;margin-bottom:8px;">문의가 성공적으로 접수되었습니다!</div><div style="font-size:14px;color:#555;">24시간 이내에 연락드리겠습니다.<br>급하신 경우 <strong>010-2337-0458</strong>로 연락주세요.</div></div>';}
              form.reset();
              setTimeout(function(){if(formMessage)formMessage.scrollIntoView({behavior:'smooth',block:'center'});},100);
            }else{throw new Error(result.error||'전송에 실패했습니다.');}
          }catch(error){
            var errorMsg=error.message||'전송에 실패했습니다';
            if(formMessage){formMessage.className='form-message error';formMessage.style.display='block';formMessage.innerHTML='<div style="text-align:center;padding:20px;"><div style="font-size:40px;margin-bottom:10px;">❌</div><div style="font-size:16px;font-weight:700;margin-bottom:8px;">전송에 실패했습니다</div><div style="font-size:13px;margin-bottom:12px;color:#555;">'+errorMsg+'</div><div style="font-size:14px;margin-top:12px;"><strong>📞 010-2337-0458</strong><br>또는 카카오톡으로 문의해주세요.</div></div>';formMessage.scrollIntoView({behavior:'smooth',block:'center'});}
          }finally{
            if(submitBtn)submitBtn.disabled=false;
            if(submitText)submitText.textContent='무료 상담 신청하기 →';
          }
          return false;
        }
    </script>

</body>
</html>`;

const PAGE_CARD_WIRELESS = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
<link rel="icon" type="image/png" href="/brand.png">
<link rel="apple-touch-icon" href="/brand.png">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="naver-site-verification" content="53af8497b3a522a8a85a7b13bae57efd7e27fb5c" />
    <title>무선 단말기 | 마스터페이</title>
    <meta name="description" content="이동 결제의 자유로움을 제공하는 무선 카드 단말기. 테이블 결제, 배달, 출장까지 매장을 벗어나서도 어디든 결제 가능한 필수 장비입니다.">
    <meta property="og:title" content="무선 단말기 | 마스터페이">
    <meta property="og:description" content="이동 결제의 자유로움을 제공하는 무선 카드 단말기. 테이블 결제, 배달, 출장까지 매장을 벗어나서도 어디든 결제 가능한 필수 장비입니다.">
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&display=swap" rel="stylesheet">
    <style>/* ========== 공용 스타일 (모든 페이지에서 사용) ========== */

:root {
    --cream: #f7f4ed;
    --cream-dark: #ede8db;
    --ink: #1a1a1a;
    --ink-soft: #4a4a4a;
    --forest: #2d4a3e;
    --forest-dark: #1f352c;
    --coral: #e8763a;
    --border: #d9d3c4;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 80px; }

body {
    font-family: 'Pretendard Variable', Pretendard, -apple-system, sans-serif;
    background: #ffffff;
    color: var(--ink);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
}

a { text-decoration: none; color: inherit; }
img { max-width: 100%; display: block; }

.container {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 32px;
}

/* ========== 헤더 ========== */
header {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    background: var(--cream);
    z-index: 9999 !important;
    border-bottom: 1px solid var(--border);
}
body {
    padding-top: 72px;
}
@media (max-width: 768px) {
    body { padding-top: 60px; }
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 32px;
    max-width: 1240px;
    margin: 0 auto;
}

.logo {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 8px;
}

.logo-mark {
    width: 28px;
    height: 28px;
    background: var(--forest);
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--cream);
    font-size: 14px;
}
.logo-mark-img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    display: inline-block;
    vertical-align: middle;
}

.nav-menu {
    display: flex;
    gap: 40px;
    list-style: none;
}

.nav-menu a {
    font-size: 15px;
    font-weight: 500;
    color: var(--ink-soft);
    transition: color 0.2s;
}

.nav-menu a:hover { color: var(--ink); }

.nav-cta {
    background: var(--ink);
    color: var(--cream);
    padding: 10px 20px;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 600;
    transition: transform 0.2s;
}

.nav-cta:hover { transform: scale(1.03); }

.mobile-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

/* ========== 제품 페이지 전용 ========== */
.product-hero {
    padding: 60px 0 80px;
    position: relative;
    overflow: hidden;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--ink-soft);
    margin-bottom: 32px;
}

.breadcrumb a {
    color: var(--ink-soft);
    transition: color 0.2s;
}

.breadcrumb a:hover { color: var(--ink); }

.breadcrumb-separator {
    opacity: 0.4;
}

.product-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
}

.product-badge {
    display: inline-block;
    padding: 6px 14px;
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
    color: var(--coral);
    margin-bottom: 20px;
}

.product-title {
    font-size: clamp(36px, 5vw, 60px);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
}

.product-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}

.product-lead {
    font-size: 18px;
    color: var(--ink-soft);
    line-height: 1.6;
    margin-bottom: 32px;
}

.product-specs {
    display: flex;
    gap: 32px;
    padding: 24px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    margin-bottom: 32px;
    flex-wrap: wrap;
}

.spec-item .spec-label {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 13px;
    color: var(--coral);
    margin-bottom: 4px;
}

.spec-item .spec-value {
    font-size: 18px;
    font-weight: 700;
}

.product-cta {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.btn {
    padding: 16px 32px;
    border-radius: 100px;
    font-weight: 600;
    font-size: 15px;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid transparent;
}

.btn-primary {
    background: var(--ink);
    color: var(--cream);
}

.btn-primary:hover {
    background: var(--forest);
}

.btn-ghost {
    background: transparent;
    color: var(--ink);
    border-color: var(--border);
}

.btn-ghost:hover {
    background: var(--cream-dark);
}

/* 제품 이미지 영역 */
.product-visual {
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 32px;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 180px;
    position: relative;
    overflow: hidden;
}

.product-visual img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* ========== 특징 섹션 ========== */
.features {
    padding: 100px 0;
    background: var(--cream-dark);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
}

.section-header {
    display: flex;
    align-items: baseline;
    gap: 24px;
    margin-bottom: 64px;
    flex-wrap: wrap;
}

.section-num {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 28px;
    color: var(--coral);
    font-weight: 400;
}

.section-title {
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    flex: 1;
    min-width: 300px;
}

.section-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 2px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 24px;
    overflow: hidden;
}

.feature-item {
    background: var(--cream);
    padding: 40px 32px;
    transition: background 0.3s;
}

.feature-item:hover {
    background: var(--cream-dark);
}

.feature-icon {
    font-size: 36px;
    margin-bottom: 20px;
    display: inline-block;
}

.feature-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 12px;
    letter-spacing: -0.01em;
}

.feature-desc {
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.6;
}

/* ========== 상세 내용 섹션 ========== */
.detail {
    padding: 100px 0;
}

.detail-content {
    max-width: 800px;
    margin: 0 auto;
    font-size: 17px;
    line-height: 1.8;
    color: var(--ink-soft);
}

.detail-content h3 {
    font-size: 28px;
    font-weight: 800;
    color: var(--ink);
    margin: 48px 0 20px;
    letter-spacing: -0.02em;
}

.detail-content h3:first-child {
    margin-top: 0;
}

.detail-content p {
    margin-bottom: 20px;
}

.detail-content ul {
    list-style: none;
    padding: 0;
    margin-bottom: 20px;
}

.detail-content ul li {
    padding: 10px 0 10px 32px;
    position: relative;
    border-bottom: 1px solid var(--border);
}

.detail-content ul li:last-child {
    border-bottom: none;
}

.detail-content ul li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--coral);
    font-weight: 800;
    font-size: 18px;
}

/* ========== 관련 제품 ========== */
.related {
    padding: 100px 0;
    background: var(--cream-dark);
    border-top: 1px solid var(--border);
}

.related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
}

.related-card {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 28px;
    transition: all 0.3s;
    display: block;
}

.related-card:hover {
    transform: translateY(-4px);
    border-color: var(--ink);
}

.related-icon {
    font-size: 36px;
    margin-bottom: 16px;
}

.related-name {
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 6px;
}

.related-desc {
    font-size: 13px;
    color: var(--ink-soft);
}

/* ========== CTA 섹션 ========== */
.cta {
    background: var(--ink);
    color: var(--cream);
    padding: 120px 0;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.cta::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: var(--forest);
    border-radius: 50%;
    top: -300px;
    right: -200px;
    opacity: 0.4;
    filter: blur(80px);
}

.cta-content {
    position: relative;
    z-index: 1;
}

.cta-label {
    font-family: 'Fraunces', serif;
    font-style: italic;
    color: var(--coral);
    font-size: 18px;
    margin-bottom: 20px;
}

.cta h2 {
    font-size: clamp(32px, 5vw, 56px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-bottom: 40px;
}

.cta h2 .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--coral);
}

.cta-phone {
    display: inline-flex;
    align-items: center;
    gap: 16px;
    font-size: 28px;
    font-weight: 800;
    padding: 20px 40px;
    background: var(--cream);
    color: var(--ink);
    border-radius: 100px;
    transition: transform 0.2s;
    margin-bottom: 16px;
}

.cta-phone:hover {
    transform: scale(1.03);
}

.cta-note {
    opacity: 0.7;
    font-size: 14px;
}

/* ========== 푸터 ========== */
footer {
    background: var(--ink);
    color: var(--cream);
    padding: 60px 0 40px;
    border-top: 1px solid rgba(247, 244, 237, 0.1);
}

.footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
}

.footer-brand .logo {
    color: var(--cream);
    margin-bottom: 16px;
}

.footer-brand p {
    font-size: 14px;
    opacity: 0.7;
    max-width: 300px;
    line-height: 1.6;
}

.footer-col h4 {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 16px;
    color: var(--coral);
}

.footer-col ul { list-style: none; }
.footer-col li { margin-bottom: 10px; }

.footer-col a {
    font-size: 14px;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.footer-col a:hover { opacity: 1; }

.footer-bottom {
    padding-top: 30px;
    border-top: 1px solid rgba(247, 244, 237, 0.1);
    font-size: 13px;
    opacity: 0.6;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
}

/* ========== 모바일 대응 ========== */
@media (max-width: 900px) {
    .product-grid {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .footer-grid {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 640px) {
    .container { padding: 0 20px; }
    .nav { padding: 16px 20px; }
    .nav-menu, .nav-cta { display: none; }
    .mobile-toggle { display: block; }
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--cream);
        padding: 20px;
        gap: 20px;
        border-bottom: 1px solid var(--border);
    }
    .product-hero { padding: 40px 0 60px; }
    .features, .detail, .related { padding: 60px 0; }
    .cta { padding: 80px 0; }
    .footer-grid { grid-template-columns: 1fr; }
    .cta-phone { font-size: 20px; padding: 16px 28px; }
    .product-visual { font-size: 100px; }
}

/* ============================================================
   📱 모바일 반응형 종합 보강 (일괄 패치)
   ============================================================ */

/* 가로 스크롤 방지 (가장 중요) */
html, body {
    overflow-x: hidden;
    width: 100%;
    -webkit-text-size-adjust: 100%;
}

* { max-width: 100%; }
img, video, iframe { max-width: 100%; height: auto; }
table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }

/* 768px 이하 (태블릿 ↓) */
@media (max-width: 768px) {
    .container { padding: 0 16px !important; }
    
    /* 본문 텍스트 가독성 */
    body { font-size: 15px; line-height: 1.7; }
    h1 { font-size: clamp(22px, 5.5vw, 30px) !important; line-height: 1.25 !important; word-break: keep-all; }
    h2 { font-size: clamp(18px, 4.5vw, 24px) !important; line-height: 1.3 !important; word-break: keep-all; }
    h3 { font-size: clamp(15px, 4vw, 18px) !important; line-height: 1.35 !important; }
    p { word-break: keep-all; line-height: 1.75; }
    
    /* 헤더/네비 */
    .nav { padding: 14px 0 !important; }
    .nav-menu { display: none !important; }
    .mobile-toggle { display: block !important; font-size: 22px; background: none; border: 0; cursor: pointer; padding: 6px 10px; }
    .nav-menu.active { display: flex !important; flex-direction: column; position: absolute; top: 100%; left: 0; right: 0; background: var(--cream); padding: 16px; gap: 14px; border-top: 1px solid var(--border); z-index: 100; }
    .nav-cta { padding: 8px 14px !important; font-size: 13px !important; }
    .logo { font-size: 17px !important; gap: 8px !important; }
    .logo-mark, .logo-mark-img { width: 24px !important; height: 24px !important; font-size: 12px !important; }
    
    /* 그리드들 → 1열 */
    .region-features-grid,
    .region-biz-grid,
    .region-reviews-grid,
    .region-products-grid,
    .footer-grid,
    .features-grid,
    .product-cards-grid,
    .pricing-grid,
    .review-grid,
    .stat-cards { grid-template-columns: 1fr !important; gap: 12px !important; }
    
    /* 시도/시군구 통계 → 2열 (너무 좁아지면 1열) */
    .region-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
    
    /* 지역 리스트(시군구·동) → 2~3열 */
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; font-size: 13px; }
    
    /* 제품 그리드 → 2열 */
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
    
    /* 박스 패딩 축소 */
    .region-box { padding: 20px 18px !important; border-radius: 14px !important; margin-bottom: 14px !important; }
    .region-box-title { font-size: 17px !important; margin-bottom: 12px !important; }
    
    /* 썸네일 (Hero) */
    .region-thumbnail { max-width: 100% !important; max-height: 280px !important; aspect-ratio: 4/3 !important; margin: 0 auto 20px !important; border-radius: 14px !important; }
    .region-thumbnail-overlay { padding: 18px 16px !important; }
    .region-thumbnail-meta { font-size: 11px !important; gap: 6px !important; }
    .region-thumbnail-title { font-size: clamp(20px, 5.5vw, 28px) !important; line-height: 1.2 !important; margin-bottom: 8px !important; }
    .region-thumbnail-services { font-size: 12px !important; line-height: 1.5 !important; }
    .region-hero-sub-standalone { font-size: 14px !important; line-height: 1.7 !important; max-width: 100% !important; padding: 0 4px !important; }
    
    /* 제품 5줄 카드 폰트 축소 */
    .region-product-detail-card { padding: 14px 16px !important; }
    .region-product-detail-card h3 { font-size: 15px !important; }
    .region-product-detail-card li { font-size: 12.5px !important; line-height: 1.65 !important; }
    
    /* FAQ */
    .region-faq-item { padding: 12px 14px !important; }
    .region-faq-item strong { font-size: 13.5px !important; }
    .region-faq-item p { font-size: 12.5px !important; }
    
    /* 주의사항 */
    .region-caution-item { padding: 12px 14px !important; gap: 10px !important; }
    .region-caution-item h3 { font-size: 13.5px !important; }
    .region-caution-item p { font-size: 12.5px !important; }
    
    /* 추천 업종 카드 */
    .region-biz-card { padding: 12px 14px !important; }
    .region-biz-name { font-size: 13.5px !important; }
    .region-biz-effect { font-size: 12px !important; }
    .region-biz-stars { font-size: 11.5px !important; }
    
    /* CTA 박스 */
    .region-cta-box { padding: 24px 18px !important; }
    .region-cta-buttons { flex-direction: column !important; gap: 10px !important; }
    .region-cta-buttons .btn { width: 100% !important; text-align: center; padding: 12px !important; font-size: 14px !important; }
    
    /* 버튼 */
    .btn { font-size: 14px !important; padding: 10px 18px !important; }
    .btn-primary, .btn-ghost { width: auto; }
    
    /* breadcrumb */
    .breadcrumb { font-size: 11.5px !important; flex-wrap: wrap; gap: 4px; }
    
    /* 푸터 */
    footer { padding: 32px 0 24px !important; }
    .footer-grid { gap: 24px !important; }
    .footer-brand .logo { font-size: 18px !important; }
}

/* 480px 이하 (작은 모바일) */
@media (max-width: 480px) {
    .container { padding: 0 14px !important; }
    h1 { font-size: clamp(20px, 6vw, 26px) !important; }
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; font-size: 12.5px; }
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 6px !important; }
    .region-thumbnail { max-height: 240px !important; }
    .region-thumbnail-overlay { padding: 14px 12px !important; }
    .region-thumbnail-services { font-size: 11px !important; }
    .region-hero-sub-standalone { font-size: 13px !important; }
}

/* 360px 이하 (소형 모바일) */
@media (max-width: 360px) {
    .container { padding: 0 12px !important; }
    .region-stats-grid { grid-template-columns: 1fr !important; }
    .region-list-grid { grid-template-columns: 1fr !important; }
    .region-thumbnail-title { font-size: 19px !important; }
}


/* ============================================================
   📱 짤림 방지 추가 패치 (이미지·텍스트 모두)
   ============================================================ */

/* === 모든 화면 크기에서 짤림 방지 === */
* {
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
}

/* 모든 이미지가 부모 박스 안에 들어오도록 강제 */
img, picture, video, svg, canvas, iframe, embed, object {
    max-width: 100% !important;
    height: auto !important;
    display: block;
}

/* 모든 텍스트 박스가 부모 안에 들어오도록 */
p, h1, h2, h3, h4, h5, h6, span, div, li, a, strong, em, td, th {
    word-wrap: break-word;
    overflow-wrap: break-word;
    min-width: 0;
}

/* 한글 단어가 중간에 안 끊기도록 */
p, h1, h2, h3, h4, li {
    word-break: keep-all;
}

/* 영어·URL·이메일·전화번호 같은 긴 문자열 강제 줄바꿈 */
.long-text, code, pre, .url, a[href^="mailto"], a[href^="tel"], .breadcrumb {
    word-break: break-all;
    overflow-wrap: anywhere;
}

/* 그리드 자식이 부모를 넘는 것 방지 */
[class*="grid"], [class*="flex"] {
    min-width: 0;
}
[class*="grid"] > *, [class*="flex"] > * {
    min-width: 0;
    max-width: 100%;
}

/* 768px 이하에서 추가 짤림 방지 */
@media (max-width: 768px) {
    /* body 내부에서 가로로 넘는 요소 강제 정리 */
    body, html { max-width: 100vw !important; overflow-x: hidden !important; }
    
    /* 컨테이너·박스가 절대 가로폭 안 넘게 */
    .container, .region-box, .region-cta-box, header, footer, section {
        max-width: 100% !important;
        box-sizing: border-box !important;
    }
    
    /* 썸네일 안 텍스트도 wrap */
    .region-thumbnail-title, .region-thumbnail-services, .region-thumbnail-meta {
        max-width: 100% !important;
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        white-space: normal !important;
    }
    
    /* 통계 카드 숫자 폰트 축소 */
    .region-stats-grid .region-stat-num,
    .region-stats-grid .region-stat-value,
    [class*="stat-num"], [class*="stat-value"] {
        font-size: clamp(18px, 5vw, 24px) !important;
        word-break: break-all !important;
    }
    
    /* 표 가로 스크롤 처리 */
    table {
        display: block !important;
        overflow-x: auto !important;
        white-space: nowrap;
    }
    
    /* 긴 동 이름(예: "한국토지주택공사동") 줄바꿈 */
    .region-list-grid a, .region-products-simple a {
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        line-height: 1.4 !important;
        padding: 8px 6px !important;
        font-size: 12.5px !important;
        text-align: center;
    }
    
    /* 전화번호·CTA 버튼 텍스트가 안 잘리도록 */
    .btn, .nav-cta, button, a[href^="tel"] {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}


/* === 온라인 문의 폼 (모든 페이지 공통) === */
.contact-section {
    padding: 100px 0;
    background: var(--cream-dark);
}
.contact-section .container {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 60px;
    align-items: start;
    max-width: 1140px;
}
.contact-intro {
    position: sticky;
    top: 100px;
}
.contact-intro .cta-label {
    text-align: left;
    font-size: 13px;
    font-weight: 700;
    color: var(--coral);
    letter-spacing: 3px;
    margin-bottom: 16px;
}
.contact-title {
    font-size: clamp(32px, 4vw, 48px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0 0 16px;
}
.contact-sub {
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.7;
    margin: 0 0 32px;
}
.contact-direct {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.contact-direct-btn {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 22px;
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 14px;
    transition: all 0.2s;
    text-decoration: none;
    color: inherit;
}
.contact-direct-btn:hover {
    border-color: var(--forest);
    transform: translateX(4px);
}
.contact-direct-btn .cd-icon {
    width: 44px;
    height: 44px;
    background: var(--cream-dark);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
}
.cd-label {
    display: block;
    font-size: 12px;
    color: var(--ink-soft);
    margin-bottom: 2px;
}
.cd-value {
    display: block;
    font-size: 16px;
    font-weight: 700;
    color: var(--ink);
}

/* 문의 폼 박스 */
.contact-form-box {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 40px 36px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}
.contact-form-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 22px;
    font-weight: 800;
    margin: 0 0 28px;
    letter-spacing: -0.01em;
}
.cf-bar {
    width: 4px;
    height: 22px;
    background: var(--coral);
    border-radius: 2px;
}
.contact-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.form-group {
    display: flex;
    flex-direction: column;
}
.form-group label {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 8px;
}
.required {
    color: var(--coral);
}
.form-group input,
.form-group select,
.form-group textarea {
    padding: 14px 16px;
    font-size: 14px;
    font-family: inherit;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: #fafafa;
    color: var(--ink);
    transition: all 0.2s;
    width: 100%;
    box-sizing: border-box;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--forest);
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(45, 74, 62, 0.1);
}
.form-group input::placeholder,
.form-group textarea::placeholder {
    color: #b0b0b0;
}
.form-group textarea {
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
}
.form-group select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23666' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    background-size: 10px;
    padding-right: 40px;
}
.form-agree {
    padding: 16px;
    background: #fafafa;
    border-radius: 10px;
    border: 1px solid var(--border);
}
.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
}
.checkbox-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--forest);
    cursor: pointer;
}
.agree-detail {
    font-size: 11px;
    color: var(--ink-soft);
    margin-top: 8px;
    padding-left: 26px;
    line-height: 1.6;
}
.contact-submit {
    background: var(--ink);
    color: #ffffff;
    border: none;
    padding: 18px 28px;
    font-size: 16px;
    font-weight: 700;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    margin-top: 8px;
}
.contact-submit:hover {
    background: var(--forest);
    transform: translateY(-2px);
}
.contact-submit:disabled {
    background: #999;
    cursor: not-allowed;
    transform: none;
}
.form-message {
    padding: 20px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    display: none;
    margin-top: 16px;
}
.form-message.success {
    display: block;
    background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
    color: #1b5e20;
    border: 2px solid #66bb6a;
    box-shadow: 0 4px 16px rgba(76, 175, 80, 0.2);
    animation: messagePop 0.4s ease;
}
.form-message.error {
    display: block;
    background: linear-gradient(135deg, #ffebee, #ffcdd2);
    color: #b71c1c;
    border: 2px solid #ef5350;
    box-shadow: 0 4px 16px rgba(244, 67, 54, 0.2);
    animation: messagePop 0.4s ease;
}
@keyframes messagePop {
    0% { transform: scale(0.9); opacity: 0; }
    60% { transform: scale(1.02); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}

/* 모바일 */
@media (max-width: 900px) {
    .contact-section .container {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .contact-intro {
        position: static;
        text-align: center;
    }
    .contact-intro .cta-label { text-align: center; }
    .contact-direct-btn { flex-direction: row; text-align: left; }
    .contact-form-box { padding: 28px 24px; }
}

</style>
</head>
<body>

    <!-- 헤더 -->
    <header>
        <nav class="nav">
            <a href="/" class="logo">
                <img src="/brand.png" alt="마스터페이" class="logo-mark-img">
                마스터페이
            </a>
            
            <ul class="nav-menu" id="navMenu">
                <li><a href="/#find-sec">지역별 설치</a></li>
                <li><a href="/#allinone">제품 안내</a></li>
                <li><a href="/#process">프로세스</a></li>
                <li><a href="/#faq">자주 묻는 질문</a></li>
            </ul>
            
            <a href="/#contact" class="nav-cta">문의하기</a>
            <button class="mobile-toggle" onclick="toggleMenu()">☰</button>
        </nav>
    </header>

    <!-- 제품 히어로 -->
    <section class="product-hero">
        <div class="container">
            <div class="breadcrumb">
                <a href="/">홈</a>
                <span class="breadcrumb-separator">/</span>
                <a href="/#products">제품</a>
                <span class="breadcrumb-separator">/</span>
                <span>무선 단말기</span>
            </div>
            
            <div class="product-grid">
                <div class="product-info">
                    <span class="product-badge">Wireless</span>
                    <h1 class="product-title">
                        무선 단말기
                    </h1>
                    <p class="product-lead">이동 결제의 자유로움을 제공하는 무선 카드 단말기. 테이블 결제, 배달, 출장까지 매장을 벗어나서도 어디든 결제 가능한 필수 장비입니다.</p>
                    
                    <div class="product-specs">
                    <div class="spec-item">
                        <div class="spec-label">Type</div>
                        <div class="spec-value">무선 충전식</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Battery</div>
                        <div class="spec-value">장시간 사용</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Connect</div>
                        <div class="spec-value">Wi-Fi · 4G</div>
                    </div>
                    </div>
                    
                    <div class="product-cta">
                        <a href="/#contact" class="btn btn-primary">
                            무료 상담 신청 →
                        </a>
                        <a href="tel:010-2337-0458" class="btn btn-ghost">
                            📞 전화 상담
                        </a>
                    </div>
                </div>
                
                <div class="product-visual">
                    <img src="https://raw.githubusercontent.com/YOONSOEUN1/mastarpay/main/images/Wirelesscard.png" alt="무선 단말기" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
            </div>
        </div>
    </section>

    <!-- 특징 섹션 -->
    <section class="features">
        <div class="container">
            <div class="section-header">
                <span class="section-num">01 / Features</span>
                <h2 class="section-title">
                    이런 특징이 있어요.
                </h2>
            </div>
            
            <div class="feature-grid">
                <div class="feature-item">
                    <div class="feature-icon">🏆</div>
                    <h3 class="feature-title">검증된 품질</h3>
                    <p class="feature-desc">업계에서 인정받은 최고의 모델만을 엄선하여 제공합니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">⚡</div>
                    <h3 class="feature-title">빠른 설치</h3>
                    <p class="feature-desc">상담 후 빠른 일정으로 설치가 완료됩니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">💰</div>
                    <h3 class="feature-title">합리적 비용</h3>
                    <p class="feature-desc">설치비 무료 옵션과 렌탈 프로그램으로 부담이 적습니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🔧</div>
                    <h3 class="feature-title">A/S 보장</h3>
                    <p class="feature-desc">장애 시 원격 지원과 현장 출동으로 빠르게 해결합니다.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 상세 내용 -->
    <section class="detail">
        <div class="container">
            <div class="section-header">
                <span class="section-num">02 / Details</span>
                <h2 class="section-title">
                    자세히 알아보기.
                </h2>
            </div>
            
            <div class="detail-content">
                
                <h3>무선 단말기가 필요한 이유</h3>
                <p>카운터에서만 결제하는 시대는 끝났습니다. 테이블 결제, 배달 현장 결제, 야외 이벤트, 출장 서비스 등 매장 밖에서도 결제가 필요한 상황이 갈수록 많아지고 있습니다. 무선 카드 단말기는 이러한 변화에 대응하는 필수 장비로, 이동의 자유로움과 결제의 편의성을 동시에 제공합니다.</p>
                <p>마스터페이가 제공하는 무선 단말기는 Wi-Fi와 4G 통신을 모두 지원하여 어디서든 안정적인 결제가 가능합니다. 한 번 충전으로 하루 종일 사용 가능한 배터리 수명, 빠른 결제 속도, 선명한 영수증 출력까지 갖춘 프리미엄 모델들을 취급합니다.</p>
                
                <h3>무선 단말기 설치 프로세스</h3>
                <ul>
                    <li>1단계 무료 상담 — 매장 업종과 이동 결제 필요성을 파악합니다</li>
                    <li>2단계 네트워크 확인 — 매장 Wi-Fi 환경을 점검하고 필요 시 보강 방안을 제안합니다</li>
                    <li>3단계 모델 추천 — 사용 패턴에 맞는 최적의 무선 단말기 모델을 추천합니다</li>
                    <li>4단계 설치 및 테스트 — 전문 기사가 직접 방문하여 설치하고 이동 결제를 테스트합니다</li>
                    <li>5단계 배터리 관리 교육 — 배터리 수명을 최대화하는 사용법을 안내합니다</li>
                    <li>6단계 A/S 지원 — 배터리 교체·수리 등 지속적인 관리를 제공합니다</li>
                </ul>
                
                <h3>무선 단말기 주요 기능</h3>
                <ul>
                    <li>이동 결제 자유 — 테이블이든 배달 현장이든 자유롭게 이동하며 결제할 수 있습니다</li>
                    <li>긴 배터리 수명 — 한 번 충전으로 하루 종일 사용 가능합니다</li>
                    <li>안정적인 무선 연결 — Wi-Fi와 4G를 모두 지원해 네트워크 불안정 시에도 끊김이 없습니다</li>
                    <li>다목적 활용 — 홀 서비스, 배달, 출장 등 어떤 상황에도 대응 가능합니다</li>
                    <li>빠른 인쇄 속도 — 이동 중에도 빠르게 영수증을 출력합니다</li>
                    <li>견고한 내구성 — 낙하 충격에도 강한 설계로 오래 사용할 수 있습니다</li>
                </ul>
                
                <h3>이런 매장에 추천합니다</h3>
                <p>테이블 결제를 원하는 음식점·주점, 배달 서비스를 함께 운영하는 매장, 푸드트럭·야외 이벤트 부스, 출장 서비스를 제공하는 업종, 매장이 넓어 여러 결제 포인트가 필요한 곳에 특히 적합합니다. 고깃집, 횟집, 배달전문점, 플리마켓, 방문 판매 업종 등에서 매우 유용합니다.</p>
                
                <h3>무선 vs 유선 단말기 비교</h3>
                <p>유선 단말기는 고정된 위치에서 안정적으로 사용하고 비용이 저렴한 장점이 있지만, 이동 결제가 불가능한 한계가 있습니다. 반면 무선 단말기는 초기 비용이 약간 더 들지만, 테이블 결제로 홀 서빙 인력을 절감하고, 배달 시 현장 결제로 고객 신뢰도를 높이며, 출장 서비스 매출도 늘릴 수 있어 투자 대비 효과가 뛰어납니다. 매장 업종과 영업 방식에 따라 선택하시면 됩니다.</p>
                
                <h3>자주 묻는 질문</h3>
                <p><strong>Q. 배터리는 얼마나 오래 가나요?</strong><br>모델에 따라 다르지만 대체로 하루 영업 시간 동안 충분히 사용 가능합니다. 보조 배터리나 충전 거치대를 함께 제공해 업무에 차질이 없도록 합니다.</p>
                <p><strong>Q. Wi-Fi가 약한 곳에서도 결제가 되나요?</strong><br>네, 4G 통신망도 지원하므로 Wi-Fi가 불안정한 야외나 지하에서도 결제가 가능합니다.</p>
                <p><strong>Q. 충전기는 포함되나요?</strong><br>네, 충전 거치대와 기본 충전 케이블이 포함됩니다. 추가 배터리가 필요한 경우 별도 구매 가능합니다.</p>
                <p><strong>Q. 영수증 용지는 어떻게 교체하나요?</strong><br>설치 시 교체 방법을 직접 보여드리며, 일반 3인치 영수증 용지를 사용합니다.</p>
    
            </div>
        </div>
    </section>

    <!-- 관련 제품 -->
    <section class="related">
        <div class="container">
            <div class="section-header">
                <span class="section-num">03 / Related</span>
                <h2 class="section-title">
                    다른 제품도 둘러보세요.
                </h2>
            </div>
            
            <div class="related-grid">
                <a href="/product/card-bluetooth" class="related-card">
                    <div class="related-icon">🔷</div>
                    <div class="related-name">블루투스 단말기</div>
                    <div class="related-desc">휴대성 최고</div>
                </a>
                <a href="/product/card-3inch" class="related-card">
                    <div class="related-icon">🖨️</div>
                    <div class="related-name">3인치 단말기</div>
                    <div class="related-desc">스탠다드 모델</div>
                </a>
                <a href="/product/tableorder" class="related-card">
                    <div class="related-icon">📋</div>
                    <div class="related-name">테이블 오더</div>
                    <div class="related-desc">QR 주문 시스템</div>
                </a>
            </div>
        </div>
    </section>

    <!-- CTA -->
    <section class="contact-section" id="contact">
        <div class="container">
            <div class="contact-intro">
                <div class="cta-label">— Contact Us —</div>
                <h2 class="contact-title">무료 상담 신청</h2>
                <p class="contact-sub">전화, 카카오톡 또는 아래 폼으로 문의해주세요.<br>담당자가 빠르게 연락드립니다.</p>
                <div class="contact-direct">
                    <a href="tel:010-2337-0458" class="contact-direct-btn">
                        <span class="cd-icon">📞</span>
                        <span><span class="cd-label">전화 상담</span><span class="cd-value">010-2337-0458</span></span>
                    </a>
                    <a href="javascript:void(0)" onclick="openKakao(); return false;" class="contact-direct-btn">
                        <span class="cd-icon">💬</span>
                        <span><span class="cd-label">카카오톡</span><span class="cd-value">바로 상담</span></span>
                    </a>
                </div>
            </div>
            <div class="contact-form-box">
                <h3 class="contact-form-title"><span class="cf-bar"></span><span>📝 온라인 문의</span></h3>
                <form id="contactForm" class="contact-form" onsubmit="return submitContactForm(event)">
                    <div class="form-group"><label for="name">상호(이름) <span class="required">*</span></label><input type="text" id="name" name="상호_이름" placeholder="상호 또는 이름을 입력하세요" required></div>
                    <div class="form-group"><label for="phone">연락처 <span class="required">*</span></label><input type="tel" id="phone" name="연락처" placeholder="010-0000-0000" required></div>
                    <div class="form-group"><label for="address">주소 <span class="required">*</span></label><input type="text" id="address" name="주소" placeholder="매장 주소" required><input type="text" id="address_detail" name="상세주소" placeholder="상세주소 (건물명, 층, 호수 등)" style="margin-top: 8px;"></div>
                    <div class="form-group"><label for="product">문의 제품 <span class="required">*</span></label><select id="product" name="문의_제품" required><option value="">선택해주세요</option><option value="포스기">포스기(POS)</option><option value="2인치 단말기">2인치 단말기</option><option value="3인치 단말기">3인치 단말기</option><option value="토스 단말기">토스 단말기</option><option value="무선 단말기">무선 단말기</option><option value="블루투스 단말기">블루투스 단말기</option><option value="키오스크">키오스크</option><option value="미니 키오스크">미니 키오스크</option><option value="테이블 오더">테이블 오더</option><option value="매장 철거">매장 철거</option><option value="여러 제품 패키지">여러 제품 패키지</option><option value="기타/미정">기타/미정</option></select></div>
                    <div class="form-group"><label for="business">업종</label><select id="business" name="업종"><option value="">선택해주세요</option><option value="음식점/식당">음식점/식당</option><option value="카페/베이커리">카페/베이커리</option><option value="편의점/마트">편의점/마트</option><option value="미용실/네일샵">미용실/네일샵</option><option value="스터디카페">스터디카페</option><option value="주점/호프">주점/호프</option><option value="무인매장">무인매장</option><option value="의류/잡화">의류/잡화</option><option value="병원/약국">병원/약국</option><option value="기타">기타</option></select></div>
                    <div class="form-group"><label for="message">문의 내용</label><textarea id="message" name="문의_내용" rows="5" placeholder="매장 위치, 현재 사용 장비, 궁금한 점 등을 자유롭게 적어주세요."></textarea></div>
                    <div class="form-agree"><label class="checkbox-label"><input type="checkbox" id="agree" required><span>개인정보 수집 및 이용에 동의합니다 <span class="required">*</span></span></label><div class="agree-detail">수집항목: 상호·연락처·주소·문의 내용 / 이용목적: 상담 및 견적 안내 / 보유기간: 3년</div></div>
                    <button type="submit" class="contact-submit" id="submitBtn"><span id="submitText">무료 상담 신청하기 →</span></button>
                    <div id="formMessage" class="form-message"></div>
                </form>
            </div>
        </div>
    </section>

    <!-- 푸터 -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="logo">
                        <img src="/brand.png" alt="마스터페이" class="logo-mark-img">
                        마스터페이
                    </div>
                    <p>매장 운영에 필요한 모든 장비<br>설치부터 A/S까지 한번에.</p>
                </div>
                
                <div class="footer-col">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="tel:010-2337-0458">📞 010-2337-0458</a></li>
                        <li><a href="https://pf.kakao.com/_fPrxbG/chat" target="_blank">💬 카카오톡 상담</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <span>© 2026 마스터페이. All rights reserved.</span>
                <span>개인정보처리방침 · 이용약관</span>
            </div>
        </div>
    </footer>

    <script>
        function toggleMenu() {
            document.getElementById('navMenu').classList.toggle('active');
        }
        function openKakao(){
          var url='https://pf.kakao.com/_fPrxbG/chat';
          var w=window.open(url,'_blank');
          if(!w||w.closed||typeof w.closed==='undefined'){window.location.href=url;}
        }
        function scrollToContact(event){
          if(event)event.preventDefault();
          var c=document.getElementById('contact');
          if(c){
            var top=c.getBoundingClientRect().top+window.pageYOffset-80;
            window.scrollTo({top:top,behavior:'smooth'});
          }else{window.location.href='/#contact';}
        }
        async function submitContactForm(event){
          if(event){event.preventDefault();event.stopPropagation();}
          var form=document.getElementById('contactForm');
          var submitBtn=document.getElementById('submitBtn');
          var submitText=document.getElementById('submitText');
          var formMessage=document.getElementById('formMessage');
          if(!form){alert('⚠️ 폼을 찾을 수 없습니다.');return false;}
          var agreeCheckbox=document.getElementById('agree');
          if(!agreeCheckbox||!agreeCheckbox.checked){alert('개인정보 수집 및 이용에 동의해주세요.');return false;}
          var name=document.getElementById('name').value.trim();
          var phone=document.getElementById('phone').value.trim();
          var address=document.getElementById('address').value.trim();
          var product=document.getElementById('product').value;
          if(!name){alert('상호(이름)을 입력해주세요.');document.getElementById('name').focus();return false;}
          if(!phone){alert('연락처를 입력해주세요.');document.getElementById('phone').focus();return false;}
          if(!address){alert('주소를 입력해주세요.');document.getElementById('address').focus();return false;}
          if(!product){alert('문의 제품을 선택해주세요.');document.getElementById('product').focus();return false;}
          if(submitBtn)submitBtn.disabled=true;
          if(submitText)submitText.textContent='전송 중...';
          if(formMessage){formMessage.className='form-message';formMessage.style.display='none';}
          var data={name:name,phone:phone,address:address,addressDetail:document.getElementById('address_detail').value.trim(),product:product,business:document.getElementById('business').value,message:document.getElementById('message').value.trim()};
          var result;
          try{
            var response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
            result=await response.json();
            if(result.success){
              if(formMessage){formMessage.className='form-message success';formMessage.style.display='block';formMessage.innerHTML='<div style="text-align:center;padding:24px 20px;"><div style="font-size:48px;margin-bottom:12px;">✅</div><div style="font-size:18px;font-weight:800;color:#2e7d32;margin-bottom:8px;">문의가 성공적으로 접수되었습니다!</div><div style="font-size:14px;color:#555;">24시간 이내에 연락드리겠습니다.<br>급하신 경우 <strong>010-2337-0458</strong>로 연락주세요.</div></div>';}
              form.reset();
              setTimeout(function(){if(formMessage)formMessage.scrollIntoView({behavior:'smooth',block:'center'});},100);
            }else{throw new Error(result.error||'전송에 실패했습니다.');}
          }catch(error){
            var errorMsg=error.message||'전송에 실패했습니다';
            if(formMessage){formMessage.className='form-message error';formMessage.style.display='block';formMessage.innerHTML='<div style="text-align:center;padding:20px;"><div style="font-size:40px;margin-bottom:10px;">❌</div><div style="font-size:16px;font-weight:700;margin-bottom:8px;">전송에 실패했습니다</div><div style="font-size:13px;margin-bottom:12px;color:#555;">'+errorMsg+'</div><div style="font-size:14px;margin-top:12px;"><strong>📞 010-2337-0458</strong><br>또는 카카오톡으로 문의해주세요.</div></div>';formMessage.scrollIntoView({behavior:'smooth',block:'center'});}
          }finally{
            if(submitBtn)submitBtn.disabled=false;
            if(submitText)submitText.textContent='무료 상담 신청하기 →';
          }
          return false;
        }
    </script>

</body>
</html>`;

const PAGE_CARD_BLUETOOTH = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
<link rel="icon" type="image/png" href="/brand.png">
<link rel="apple-touch-icon" href="/brand.png">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="naver-site-verification" content="53af8497b3a522a8a85a7b13bae57efd7e27fb5c" />
    <title>블루투스 단말기 | 마스터페이</title>
    <meta name="description" content="스마트폰·태블릿과 블루투스로 연결되는 초소형 휴대용 카드 단말기. 출장·방문 서비스·플리마켓 등 이동이 잦은 업종에 최적화되었습니다.">
    <meta property="og:title" content="블루투스 단말기 | 마스터페이">
    <meta property="og:description" content="스마트폰·태블릿과 블루투스로 연결되는 초소형 휴대용 카드 단말기. 출장·방문 서비스·플리마켓 등 이동이 잦은 업종에 최적화되었습니다.">
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&display=swap" rel="stylesheet">
    <style>/* ========== 공용 스타일 (모든 페이지에서 사용) ========== */

:root {
    --cream: #f7f4ed;
    --cream-dark: #ede8db;
    --ink: #1a1a1a;
    --ink-soft: #4a4a4a;
    --forest: #2d4a3e;
    --forest-dark: #1f352c;
    --coral: #e8763a;
    --border: #d9d3c4;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 80px; }

body {
    font-family: 'Pretendard Variable', Pretendard, -apple-system, sans-serif;
    background: #ffffff;
    color: var(--ink);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
}

a { text-decoration: none; color: inherit; }
img { max-width: 100%; display: block; }

.container {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 32px;
}

/* ========== 헤더 ========== */
header {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    background: var(--cream);
    z-index: 9999 !important;
    border-bottom: 1px solid var(--border);
}
body {
    padding-top: 72px;
}
@media (max-width: 768px) {
    body { padding-top: 60px; }
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 32px;
    max-width: 1240px;
    margin: 0 auto;
}

.logo {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 8px;
}

.logo-mark {
    width: 28px;
    height: 28px;
    background: var(--forest);
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--cream);
    font-size: 14px;
}
.logo-mark-img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    display: inline-block;
    vertical-align: middle;
}

.nav-menu {
    display: flex;
    gap: 40px;
    list-style: none;
}

.nav-menu a {
    font-size: 15px;
    font-weight: 500;
    color: var(--ink-soft);
    transition: color 0.2s;
}

.nav-menu a:hover { color: var(--ink); }

.nav-cta {
    background: var(--ink);
    color: var(--cream);
    padding: 10px 20px;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 600;
    transition: transform 0.2s;
}

.nav-cta:hover { transform: scale(1.03); }

.mobile-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

/* ========== 제품 페이지 전용 ========== */
.product-hero {
    padding: 60px 0 80px;
    position: relative;
    overflow: hidden;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--ink-soft);
    margin-bottom: 32px;
}

.breadcrumb a {
    color: var(--ink-soft);
    transition: color 0.2s;
}

.breadcrumb a:hover { color: var(--ink); }

.breadcrumb-separator {
    opacity: 0.4;
}

.product-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
}

.product-badge {
    display: inline-block;
    padding: 6px 14px;
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
    color: var(--coral);
    margin-bottom: 20px;
}

.product-title {
    font-size: clamp(36px, 5vw, 60px);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
}

.product-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}

.product-lead {
    font-size: 18px;
    color: var(--ink-soft);
    line-height: 1.6;
    margin-bottom: 32px;
}

.product-specs {
    display: flex;
    gap: 32px;
    padding: 24px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    margin-bottom: 32px;
    flex-wrap: wrap;
}

.spec-item .spec-label {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 13px;
    color: var(--coral);
    margin-bottom: 4px;
}

.spec-item .spec-value {
    font-size: 18px;
    font-weight: 700;
}

.product-cta {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.btn {
    padding: 16px 32px;
    border-radius: 100px;
    font-weight: 600;
    font-size: 15px;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid transparent;
}

.btn-primary {
    background: var(--ink);
    color: var(--cream);
}

.btn-primary:hover {
    background: var(--forest);
}

.btn-ghost {
    background: transparent;
    color: var(--ink);
    border-color: var(--border);
}

.btn-ghost:hover {
    background: var(--cream-dark);
}

/* 제품 이미지 영역 */
.product-visual {
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 32px;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 180px;
    position: relative;
    overflow: hidden;
}

.product-visual img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* ========== 특징 섹션 ========== */
.features {
    padding: 100px 0;
    background: var(--cream-dark);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
}

.section-header {
    display: flex;
    align-items: baseline;
    gap: 24px;
    margin-bottom: 64px;
    flex-wrap: wrap;
}

.section-num {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 28px;
    color: var(--coral);
    font-weight: 400;
}

.section-title {
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    flex: 1;
    min-width: 300px;
}

.section-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 2px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 24px;
    overflow: hidden;
}

.feature-item {
    background: var(--cream);
    padding: 40px 32px;
    transition: background 0.3s;
}

.feature-item:hover {
    background: var(--cream-dark);
}

.feature-icon {
    font-size: 36px;
    margin-bottom: 20px;
    display: inline-block;
}

.feature-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 12px;
    letter-spacing: -0.01em;
}

.feature-desc {
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.6;
}

/* ========== 상세 내용 섹션 ========== */
.detail {
    padding: 100px 0;
}

.detail-content {
    max-width: 800px;
    margin: 0 auto;
    font-size: 17px;
    line-height: 1.8;
    color: var(--ink-soft);
}

.detail-content h3 {
    font-size: 28px;
    font-weight: 800;
    color: var(--ink);
    margin: 48px 0 20px;
    letter-spacing: -0.02em;
}

.detail-content h3:first-child {
    margin-top: 0;
}

.detail-content p {
    margin-bottom: 20px;
}

.detail-content ul {
    list-style: none;
    padding: 0;
    margin-bottom: 20px;
}

.detail-content ul li {
    padding: 10px 0 10px 32px;
    position: relative;
    border-bottom: 1px solid var(--border);
}

.detail-content ul li:last-child {
    border-bottom: none;
}

.detail-content ul li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--coral);
    font-weight: 800;
    font-size: 18px;
}

/* ========== 관련 제품 ========== */
.related {
    padding: 100px 0;
    background: var(--cream-dark);
    border-top: 1px solid var(--border);
}

.related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
}

.related-card {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 28px;
    transition: all 0.3s;
    display: block;
}

.related-card:hover {
    transform: translateY(-4px);
    border-color: var(--ink);
}

.related-icon {
    font-size: 36px;
    margin-bottom: 16px;
}

.related-name {
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 6px;
}

.related-desc {
    font-size: 13px;
    color: var(--ink-soft);
}

/* ========== CTA 섹션 ========== */
.cta {
    background: var(--ink);
    color: var(--cream);
    padding: 120px 0;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.cta::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: var(--forest);
    border-radius: 50%;
    top: -300px;
    right: -200px;
    opacity: 0.4;
    filter: blur(80px);
}

.cta-content {
    position: relative;
    z-index: 1;
}

.cta-label {
    font-family: 'Fraunces', serif;
    font-style: italic;
    color: var(--coral);
    font-size: 18px;
    margin-bottom: 20px;
}

.cta h2 {
    font-size: clamp(32px, 5vw, 56px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-bottom: 40px;
}

.cta h2 .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--coral);
}

.cta-phone {
    display: inline-flex;
    align-items: center;
    gap: 16px;
    font-size: 28px;
    font-weight: 800;
    padding: 20px 40px;
    background: var(--cream);
    color: var(--ink);
    border-radius: 100px;
    transition: transform 0.2s;
    margin-bottom: 16px;
}

.cta-phone:hover {
    transform: scale(1.03);
}

.cta-note {
    opacity: 0.7;
    font-size: 14px;
}

/* ========== 푸터 ========== */
footer {
    background: var(--ink);
    color: var(--cream);
    padding: 60px 0 40px;
    border-top: 1px solid rgba(247, 244, 237, 0.1);
}

.footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
}

.footer-brand .logo {
    color: var(--cream);
    margin-bottom: 16px;
}

.footer-brand p {
    font-size: 14px;
    opacity: 0.7;
    max-width: 300px;
    line-height: 1.6;
}

.footer-col h4 {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 16px;
    color: var(--coral);
}

.footer-col ul { list-style: none; }
.footer-col li { margin-bottom: 10px; }

.footer-col a {
    font-size: 14px;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.footer-col a:hover { opacity: 1; }

.footer-bottom {
    padding-top: 30px;
    border-top: 1px solid rgba(247, 244, 237, 0.1);
    font-size: 13px;
    opacity: 0.6;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
}

/* ========== 모바일 대응 ========== */
@media (max-width: 900px) {
    .product-grid {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .footer-grid {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 640px) {
    .container { padding: 0 20px; }
    .nav { padding: 16px 20px; }
    .nav-menu, .nav-cta { display: none; }
    .mobile-toggle { display: block; }
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--cream);
        padding: 20px;
        gap: 20px;
        border-bottom: 1px solid var(--border);
    }
    .product-hero { padding: 40px 0 60px; }
    .features, .detail, .related { padding: 60px 0; }
    .cta { padding: 80px 0; }
    .footer-grid { grid-template-columns: 1fr; }
    .cta-phone { font-size: 20px; padding: 16px 28px; }
    .product-visual { font-size: 100px; }
}

/* ============================================================
   📱 모바일 반응형 종합 보강 (일괄 패치)
   ============================================================ */

/* 가로 스크롤 방지 (가장 중요) */
html, body {
    overflow-x: hidden;
    width: 100%;
    -webkit-text-size-adjust: 100%;
}

* { max-width: 100%; }
img, video, iframe { max-width: 100%; height: auto; }
table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }

/* 768px 이하 (태블릿 ↓) */
@media (max-width: 768px) {
    .container { padding: 0 16px !important; }
    
    /* 본문 텍스트 가독성 */
    body { font-size: 15px; line-height: 1.7; }
    h1 { font-size: clamp(22px, 5.5vw, 30px) !important; line-height: 1.25 !important; word-break: keep-all; }
    h2 { font-size: clamp(18px, 4.5vw, 24px) !important; line-height: 1.3 !important; word-break: keep-all; }
    h3 { font-size: clamp(15px, 4vw, 18px) !important; line-height: 1.35 !important; }
    p { word-break: keep-all; line-height: 1.75; }
    
    /* 헤더/네비 */
    .nav { padding: 14px 0 !important; }
    .nav-menu { display: none !important; }
    .mobile-toggle { display: block !important; font-size: 22px; background: none; border: 0; cursor: pointer; padding: 6px 10px; }
    .nav-menu.active { display: flex !important; flex-direction: column; position: absolute; top: 100%; left: 0; right: 0; background: var(--cream); padding: 16px; gap: 14px; border-top: 1px solid var(--border); z-index: 100; }
    .nav-cta { padding: 8px 14px !important; font-size: 13px !important; }
    .logo { font-size: 17px !important; gap: 8px !important; }
    .logo-mark, .logo-mark-img { width: 24px !important; height: 24px !important; font-size: 12px !important; }
    
    /* 그리드들 → 1열 */
    .region-features-grid,
    .region-biz-grid,
    .region-reviews-grid,
    .region-products-grid,
    .footer-grid,
    .features-grid,
    .product-cards-grid,
    .pricing-grid,
    .review-grid,
    .stat-cards { grid-template-columns: 1fr !important; gap: 12px !important; }
    
    /* 시도/시군구 통계 → 2열 (너무 좁아지면 1열) */
    .region-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
    
    /* 지역 리스트(시군구·동) → 2~3열 */
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; font-size: 13px; }
    
    /* 제품 그리드 → 2열 */
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
    
    /* 박스 패딩 축소 */
    .region-box { padding: 20px 18px !important; border-radius: 14px !important; margin-bottom: 14px !important; }
    .region-box-title { font-size: 17px !important; margin-bottom: 12px !important; }
    
    /* 썸네일 (Hero) */
    .region-thumbnail { max-width: 100% !important; max-height: 280px !important; aspect-ratio: 4/3 !important; margin: 0 auto 20px !important; border-radius: 14px !important; }
    .region-thumbnail-overlay { padding: 18px 16px !important; }
    .region-thumbnail-meta { font-size: 11px !important; gap: 6px !important; }
    .region-thumbnail-title { font-size: clamp(20px, 5.5vw, 28px) !important; line-height: 1.2 !important; margin-bottom: 8px !important; }
    .region-thumbnail-services { font-size: 12px !important; line-height: 1.5 !important; }
    .region-hero-sub-standalone { font-size: 14px !important; line-height: 1.7 !important; max-width: 100% !important; padding: 0 4px !important; }
    
    /* 제품 5줄 카드 폰트 축소 */
    .region-product-detail-card { padding: 14px 16px !important; }
    .region-product-detail-card h3 { font-size: 15px !important; }
    .region-product-detail-card li { font-size: 12.5px !important; line-height: 1.65 !important; }
    
    /* FAQ */
    .region-faq-item { padding: 12px 14px !important; }
    .region-faq-item strong { font-size: 13.5px !important; }
    .region-faq-item p { font-size: 12.5px !important; }
    
    /* 주의사항 */
    .region-caution-item { padding: 12px 14px !important; gap: 10px !important; }
    .region-caution-item h3 { font-size: 13.5px !important; }
    .region-caution-item p { font-size: 12.5px !important; }
    
    /* 추천 업종 카드 */
    .region-biz-card { padding: 12px 14px !important; }
    .region-biz-name { font-size: 13.5px !important; }
    .region-biz-effect { font-size: 12px !important; }
    .region-biz-stars { font-size: 11.5px !important; }
    
    /* CTA 박스 */
    .region-cta-box { padding: 24px 18px !important; }
    .region-cta-buttons { flex-direction: column !important; gap: 10px !important; }
    .region-cta-buttons .btn { width: 100% !important; text-align: center; padding: 12px !important; font-size: 14px !important; }
    
    /* 버튼 */
    .btn { font-size: 14px !important; padding: 10px 18px !important; }
    .btn-primary, .btn-ghost { width: auto; }
    
    /* breadcrumb */
    .breadcrumb { font-size: 11.5px !important; flex-wrap: wrap; gap: 4px; }
    
    /* 푸터 */
    footer { padding: 32px 0 24px !important; }
    .footer-grid { gap: 24px !important; }
    .footer-brand .logo { font-size: 18px !important; }
}

/* 480px 이하 (작은 모바일) */
@media (max-width: 480px) {
    .container { padding: 0 14px !important; }
    h1 { font-size: clamp(20px, 6vw, 26px) !important; }
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; font-size: 12.5px; }
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 6px !important; }
    .region-thumbnail { max-height: 240px !important; }
    .region-thumbnail-overlay { padding: 14px 12px !important; }
    .region-thumbnail-services { font-size: 11px !important; }
    .region-hero-sub-standalone { font-size: 13px !important; }
}

/* 360px 이하 (소형 모바일) */
@media (max-width: 360px) {
    .container { padding: 0 12px !important; }
    .region-stats-grid { grid-template-columns: 1fr !important; }
    .region-list-grid { grid-template-columns: 1fr !important; }
    .region-thumbnail-title { font-size: 19px !important; }
}


/* ============================================================
   📱 짤림 방지 추가 패치 (이미지·텍스트 모두)
   ============================================================ */

/* === 모든 화면 크기에서 짤림 방지 === */
* {
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
}

/* 모든 이미지가 부모 박스 안에 들어오도록 강제 */
img, picture, video, svg, canvas, iframe, embed, object {
    max-width: 100% !important;
    height: auto !important;
    display: block;
}

/* 모든 텍스트 박스가 부모 안에 들어오도록 */
p, h1, h2, h3, h4, h5, h6, span, div, li, a, strong, em, td, th {
    word-wrap: break-word;
    overflow-wrap: break-word;
    min-width: 0;
}

/* 한글 단어가 중간에 안 끊기도록 */
p, h1, h2, h3, h4, li {
    word-break: keep-all;
}

/* 영어·URL·이메일·전화번호 같은 긴 문자열 강제 줄바꿈 */
.long-text, code, pre, .url, a[href^="mailto"], a[href^="tel"], .breadcrumb {
    word-break: break-all;
    overflow-wrap: anywhere;
}

/* 그리드 자식이 부모를 넘는 것 방지 */
[class*="grid"], [class*="flex"] {
    min-width: 0;
}
[class*="grid"] > *, [class*="flex"] > * {
    min-width: 0;
    max-width: 100%;
}

/* 768px 이하에서 추가 짤림 방지 */
@media (max-width: 768px) {
    /* body 내부에서 가로로 넘는 요소 강제 정리 */
    body, html { max-width: 100vw !important; overflow-x: hidden !important; }
    
    /* 컨테이너·박스가 절대 가로폭 안 넘게 */
    .container, .region-box, .region-cta-box, header, footer, section {
        max-width: 100% !important;
        box-sizing: border-box !important;
    }
    
    /* 썸네일 안 텍스트도 wrap */
    .region-thumbnail-title, .region-thumbnail-services, .region-thumbnail-meta {
        max-width: 100% !important;
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        white-space: normal !important;
    }
    
    /* 통계 카드 숫자 폰트 축소 */
    .region-stats-grid .region-stat-num,
    .region-stats-grid .region-stat-value,
    [class*="stat-num"], [class*="stat-value"] {
        font-size: clamp(18px, 5vw, 24px) !important;
        word-break: break-all !important;
    }
    
    /* 표 가로 스크롤 처리 */
    table {
        display: block !important;
        overflow-x: auto !important;
        white-space: nowrap;
    }
    
    /* 긴 동 이름(예: "한국토지주택공사동") 줄바꿈 */
    .region-list-grid a, .region-products-simple a {
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        line-height: 1.4 !important;
        padding: 8px 6px !important;
        font-size: 12.5px !important;
        text-align: center;
    }
    
    /* 전화번호·CTA 버튼 텍스트가 안 잘리도록 */
    .btn, .nav-cta, button, a[href^="tel"] {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}


/* === 온라인 문의 폼 (모든 페이지 공통) === */
.contact-section {
    padding: 100px 0;
    background: var(--cream-dark);
}
.contact-section .container {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 60px;
    align-items: start;
    max-width: 1140px;
}
.contact-intro {
    position: sticky;
    top: 100px;
}
.contact-intro .cta-label {
    text-align: left;
    font-size: 13px;
    font-weight: 700;
    color: var(--coral);
    letter-spacing: 3px;
    margin-bottom: 16px;
}
.contact-title {
    font-size: clamp(32px, 4vw, 48px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0 0 16px;
}
.contact-sub {
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.7;
    margin: 0 0 32px;
}
.contact-direct {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.contact-direct-btn {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 22px;
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 14px;
    transition: all 0.2s;
    text-decoration: none;
    color: inherit;
}
.contact-direct-btn:hover {
    border-color: var(--forest);
    transform: translateX(4px);
}
.contact-direct-btn .cd-icon {
    width: 44px;
    height: 44px;
    background: var(--cream-dark);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
}
.cd-label {
    display: block;
    font-size: 12px;
    color: var(--ink-soft);
    margin-bottom: 2px;
}
.cd-value {
    display: block;
    font-size: 16px;
    font-weight: 700;
    color: var(--ink);
}

/* 문의 폼 박스 */
.contact-form-box {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 40px 36px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}
.contact-form-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 22px;
    font-weight: 800;
    margin: 0 0 28px;
    letter-spacing: -0.01em;
}
.cf-bar {
    width: 4px;
    height: 22px;
    background: var(--coral);
    border-radius: 2px;
}
.contact-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.form-group {
    display: flex;
    flex-direction: column;
}
.form-group label {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 8px;
}
.required {
    color: var(--coral);
}
.form-group input,
.form-group select,
.form-group textarea {
    padding: 14px 16px;
    font-size: 14px;
    font-family: inherit;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: #fafafa;
    color: var(--ink);
    transition: all 0.2s;
    width: 100%;
    box-sizing: border-box;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--forest);
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(45, 74, 62, 0.1);
}
.form-group input::placeholder,
.form-group textarea::placeholder {
    color: #b0b0b0;
}
.form-group textarea {
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
}
.form-group select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23666' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    background-size: 10px;
    padding-right: 40px;
}
.form-agree {
    padding: 16px;
    background: #fafafa;
    border-radius: 10px;
    border: 1px solid var(--border);
}
.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
}
.checkbox-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--forest);
    cursor: pointer;
}
.agree-detail {
    font-size: 11px;
    color: var(--ink-soft);
    margin-top: 8px;
    padding-left: 26px;
    line-height: 1.6;
}
.contact-submit {
    background: var(--ink);
    color: #ffffff;
    border: none;
    padding: 18px 28px;
    font-size: 16px;
    font-weight: 700;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    margin-top: 8px;
}
.contact-submit:hover {
    background: var(--forest);
    transform: translateY(-2px);
}
.contact-submit:disabled {
    background: #999;
    cursor: not-allowed;
    transform: none;
}
.form-message {
    padding: 20px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    display: none;
    margin-top: 16px;
}
.form-message.success {
    display: block;
    background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
    color: #1b5e20;
    border: 2px solid #66bb6a;
    box-shadow: 0 4px 16px rgba(76, 175, 80, 0.2);
    animation: messagePop 0.4s ease;
}
.form-message.error {
    display: block;
    background: linear-gradient(135deg, #ffebee, #ffcdd2);
    color: #b71c1c;
    border: 2px solid #ef5350;
    box-shadow: 0 4px 16px rgba(244, 67, 54, 0.2);
    animation: messagePop 0.4s ease;
}
@keyframes messagePop {
    0% { transform: scale(0.9); opacity: 0; }
    60% { transform: scale(1.02); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}

/* 모바일 */
@media (max-width: 900px) {
    .contact-section .container {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .contact-intro {
        position: static;
        text-align: center;
    }
    .contact-intro .cta-label { text-align: center; }
    .contact-direct-btn { flex-direction: row; text-align: left; }
    .contact-form-box { padding: 28px 24px; }
}

</style>
</head>
<body>

    <!-- 헤더 -->
    <header>
        <nav class="nav">
            <a href="/" class="logo">
                <img src="/brand.png" alt="마스터페이" class="logo-mark-img">
                마스터페이
            </a>
            
            <ul class="nav-menu" id="navMenu">
                <li><a href="/#find-sec">지역별 설치</a></li>
                <li><a href="/#allinone">제품 안내</a></li>
                <li><a href="/#process">프로세스</a></li>
                <li><a href="/#faq">자주 묻는 질문</a></li>
            </ul>
            
            <a href="/#contact" class="nav-cta">문의하기</a>
            <button class="mobile-toggle" onclick="toggleMenu()">☰</button>
        </nav>
    </header>

    <!-- 제품 히어로 -->
    <section class="product-hero">
        <div class="container">
            <div class="breadcrumb">
                <a href="/">홈</a>
                <span class="breadcrumb-separator">/</span>
                <a href="/#products">제품</a>
                <span class="breadcrumb-separator">/</span>
                <span>블루투스 단말기</span>
            </div>
            
            <div class="product-grid">
                <div class="product-info">
                    <span class="product-badge">Bluetooth</span>
                    <h1 class="product-title">
                        블루투스 단말기
                    </h1>
                    <p class="product-lead">스마트폰·태블릿과 블루투스로 연결되는 초소형 휴대용 카드 단말기. 출장·방문 서비스·플리마켓 등 이동이 잦은 업종에 최적화되었습니다.</p>
                    
                    <div class="product-specs">
                    <div class="spec-item">
                        <div class="spec-label">Type</div>
                        <div class="spec-value">초소형 휴대형</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Connect</div>
                        <div class="spec-value">Bluetooth 연동</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Device</div>
                        <div class="spec-value">스마트폰·태블릿</div>
                    </div>
                    </div>
                    
                    <div class="product-cta">
                        <a href="/#contact" class="btn btn-primary">
                            무료 상담 신청 →
                        </a>
                        <a href="tel:010-2337-0458" class="btn btn-ghost">
                            📞 전화 상담
                        </a>
                    </div>
                </div>
                
                <div class="product-visual">
                    <img src="https://raw.githubusercontent.com/YOONSOEUN1/mastarpay/main/images/Bluetoothcard.jpg" alt="블루투스 단말기" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
            </div>
        </div>
    </section>

    <!-- 특징 섹션 -->
    <section class="features">
        <div class="container">
            <div class="section-header">
                <span class="section-num">01 / Features</span>
                <h2 class="section-title">
                    이런 특징이 있어요.
                </h2>
            </div>
            
            <div class="feature-grid">
                <div class="feature-item">
                    <div class="feature-icon">🏆</div>
                    <h3 class="feature-title">검증된 품질</h3>
                    <p class="feature-desc">업계에서 인정받은 최고의 모델만을 엄선하여 제공합니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">⚡</div>
                    <h3 class="feature-title">빠른 설치</h3>
                    <p class="feature-desc">상담 후 빠른 일정으로 설치가 완료됩니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">💰</div>
                    <h3 class="feature-title">합리적 비용</h3>
                    <p class="feature-desc">설치비 무료 옵션과 렌탈 프로그램으로 부담이 적습니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🔧</div>
                    <h3 class="feature-title">A/S 보장</h3>
                    <p class="feature-desc">장애 시 원격 지원과 현장 출동으로 빠르게 해결합니다.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 상세 내용 -->
    <section class="detail">
        <div class="container">
            <div class="section-header">
                <span class="section-num">02 / Details</span>
                <h2 class="section-title">
                    자세히 알아보기.
                </h2>
            </div>
            
            <div class="detail-content">
                
                <h3>블루투스 단말기가 인기인 이유</h3>
                <p>블루투스 카드 단말기는 스마트폰이나 태블릿과 블루투스로 연결하여 사용하는 초소형 카드 리더기입니다. 별도의 디스플레이가 없어 가격이 매우 저렴하고, 손바닥 크기로 휴대가 편리해 이동 결제가 필요한 1인 사업자, 프리랜서, 방문 서비스 업종에서 폭발적인 인기를 얻고 있습니다.</p>
                <p>마스터페이는 업계에서 검증된 블루투스 단말기를 저렴한 가격에 제공합니다. 스마트폰 앱과 완벽하게 연동되어 결제·영수증 발행·매출 관리까지 한 번에 처리할 수 있으며, 전자 영수증을 문자나 이메일로 발송하는 기능까지 지원합니다.</p>
                
                <h3>블루투스 단말기 설치 프로세스</h3>
                <ul>
                    <li>1단계 무료 상담 — 사용 목적과 예상 결제 건수를 알려주세요</li>
                    <li>2단계 VAN사 선정 — 블루투스 단말기에 맞는 VAN사를 선정합니다</li>
                    <li>3단계 가맹점 등록 — 카드결제 가맹점 등록을 마스터페이가 대행합니다</li>
                    <li>4단계 단말기 발송 — 단말기와 앱 설치 안내 자료를 발송합니다</li>
                    <li>5단계 원격 세팅 — 전화로 원격 설치를 도와드립니다 (현장 방문도 가능)</li>
                    <li>6단계 A/S 지원 — 장애 시 전화 상담으로 즉시 해결합니다</li>
                </ul>
                
                <h3>블루투스 단말기 주요 기능</h3>
                <ul>
                    <li>스마트폰 연동 — 전용 앱과 블루투스로 연결해 어디서든 간편하게 결제 가능합니다</li>
                    <li>휴대성 최강 — 손바닥 크기로 주머니에 쏙 들어갑니다</li>
                    <li>저렴한 초기 비용 — 다른 단말기 대비 저렴한 가격으로 도입 부담이 적습니다</li>
                    <li>간편한 사용법 — 복잡한 설정 없이 앱만 설치하면 바로 사용 가능합니다</li>
                    <li>전자 영수증 — 스마트폰 앱을 통해 전자 영수증을 문자나 이메일로 발송합니다</li>
                    <li>매출 자동 관리 — 앱에서 일별·월별 매출이 자동으로 정리됩니다</li>
                </ul>
                
                <h3>이런 분들께 추천합니다</h3>
                <p>프리랜서, 출장 강사 등 이동이 많은 직종, 푸드트럭·플리마켓 참가자, 소규모 매장에서 보조 단말기가 필요한 경우, 비용 부담 없이 카드결제를 시작하고 싶은 분, 방문 서비스·출장 서비스 업종에 특히 적합합니다. 네일 아티스트, 개인 트레이너, 반려동물 미용사, 출장 청소업체 등 방문형 서비스에서 매우 유용합니다.</p>
                
                <h3>블루투스 단말기의 장점</h3>
                <p>블루투스 단말기는 다른 카드 단말기에 비해 압도적으로 저렴한 가격이 가장 큰 매력입니다. 또한 스마트폰을 활용하기 때문에 별도의 큰 기기를 들고 다닐 필요가 없어 휴대성이 매우 뛰어납니다. 최신 앱은 포스기 수준의 매출 관리 기능을 제공해, 소규모 사업자에게 필요한 모든 기능을 스마트폰 하나로 해결할 수 있습니다.</p>
                
                <h3>사용 시 주의사항</h3>
                <p>블루투스 단말기는 스마트폰이나 태블릿이 반드시 필요합니다. 앱 실행 시 배터리가 빠르게 소모될 수 있어 보조 배터리를 준비하시길 권장합니다. 블루투스 연결이 간혹 끊어질 수 있으나, 최신 모델은 자동 재연결 기능이 있어 불편함이 크게 줄었습니다.</p>
                
                <h3>자주 묻는 질문</h3>
                <p><strong>Q. 영수증은 어떻게 발행하나요?</strong><br>스마트폰 앱을 통해 전자 영수증을 문자나 이메일로 발송합니다. 종이 영수증이 필요하면 별도의 블루투스 프린터와 연결할 수 있습니다.</p>
                <p><strong>Q. 어떤 스마트폰이든 연동되나요?</strong><br>네, iOS와 Android 모두 지원합니다. 최신 앱은 대부분의 기기에서 원활하게 작동합니다.</p>
                <p><strong>Q. 1인 사업자도 이용 가능한가요?</strong><br>네, 1인 사업자에게 가장 추천드리는 단말기입니다. 낮은 비용으로 카드결제를 시작할 수 있습니다.</p>
                <p><strong>Q. 수수료는 일반 단말기와 같은가요?</strong><br>VAN사와 카드 종류에 따라 다르지만, 대체로 비슷한 수수료가 적용됩니다. 자세한 내용은 상담 시 안내드립니다.</p>
    
            </div>
        </div>
    </section>

    <!-- 관련 제품 -->
    <section class="related">
        <div class="container">
            <div class="section-header">
                <span class="section-num">03 / Related</span>
                <h2 class="section-title">
                    다른 제품도 둘러보세요.
                </h2>
            </div>
            
            <div class="related-grid">
                <a href="/product/card-wireless" class="related-card">
                    <div class="related-icon">📱</div>
                    <div class="related-name">무선 단말기</div>
                    <div class="related-desc">자유로운 이동</div>
                </a>
                <a href="/product/card-2inch" class="related-card">
                    <div class="related-icon">💳</div>
                    <div class="related-name">2인치 단말기</div>
                    <div class="related-desc">컴팩트 사이즈</div>
                </a>
                <a href="/product/card-toss" class="related-card">
                    <div class="related-icon">⚡</div>
                    <div class="related-name">토스 단말기</div>
                    <div class="related-desc">간편결제 특화</div>
                </a>
            </div>
        </div>
    </section>

    <!-- CTA -->
    <section class="contact-section" id="contact">
        <div class="container">
            <div class="contact-intro">
                <div class="cta-label">— Contact Us —</div>
                <h2 class="contact-title">무료 상담 신청</h2>
                <p class="contact-sub">전화, 카카오톡 또는 아래 폼으로 문의해주세요.<br>담당자가 빠르게 연락드립니다.</p>
                <div class="contact-direct">
                    <a href="tel:010-2337-0458" class="contact-direct-btn">
                        <span class="cd-icon">📞</span>
                        <span><span class="cd-label">전화 상담</span><span class="cd-value">010-2337-0458</span></span>
                    </a>
                    <a href="javascript:void(0)" onclick="openKakao(); return false;" class="contact-direct-btn">
                        <span class="cd-icon">💬</span>
                        <span><span class="cd-label">카카오톡</span><span class="cd-value">바로 상담</span></span>
                    </a>
                </div>
            </div>
            <div class="contact-form-box">
                <h3 class="contact-form-title"><span class="cf-bar"></span><span>📝 온라인 문의</span></h3>
                <form id="contactForm" class="contact-form" onsubmit="return submitContactForm(event)">
                    <div class="form-group"><label for="name">상호(이름) <span class="required">*</span></label><input type="text" id="name" name="상호_이름" placeholder="상호 또는 이름을 입력하세요" required></div>
                    <div class="form-group"><label for="phone">연락처 <span class="required">*</span></label><input type="tel" id="phone" name="연락처" placeholder="010-0000-0000" required></div>
                    <div class="form-group"><label for="address">주소 <span class="required">*</span></label><input type="text" id="address" name="주소" placeholder="매장 주소" required><input type="text" id="address_detail" name="상세주소" placeholder="상세주소 (건물명, 층, 호수 등)" style="margin-top: 8px;"></div>
                    <div class="form-group"><label for="product">문의 제품 <span class="required">*</span></label><select id="product" name="문의_제품" required><option value="">선택해주세요</option><option value="포스기">포스기(POS)</option><option value="2인치 단말기">2인치 단말기</option><option value="3인치 단말기">3인치 단말기</option><option value="토스 단말기">토스 단말기</option><option value="무선 단말기">무선 단말기</option><option value="블루투스 단말기">블루투스 단말기</option><option value="키오스크">키오스크</option><option value="미니 키오스크">미니 키오스크</option><option value="테이블 오더">테이블 오더</option><option value="매장 철거">매장 철거</option><option value="여러 제품 패키지">여러 제품 패키지</option><option value="기타/미정">기타/미정</option></select></div>
                    <div class="form-group"><label for="business">업종</label><select id="business" name="업종"><option value="">선택해주세요</option><option value="음식점/식당">음식점/식당</option><option value="카페/베이커리">카페/베이커리</option><option value="편의점/마트">편의점/마트</option><option value="미용실/네일샵">미용실/네일샵</option><option value="스터디카페">스터디카페</option><option value="주점/호프">주점/호프</option><option value="무인매장">무인매장</option><option value="의류/잡화">의류/잡화</option><option value="병원/약국">병원/약국</option><option value="기타">기타</option></select></div>
                    <div class="form-group"><label for="message">문의 내용</label><textarea id="message" name="문의_내용" rows="5" placeholder="매장 위치, 현재 사용 장비, 궁금한 점 등을 자유롭게 적어주세요."></textarea></div>
                    <div class="form-agree"><label class="checkbox-label"><input type="checkbox" id="agree" required><span>개인정보 수집 및 이용에 동의합니다 <span class="required">*</span></span></label><div class="agree-detail">수집항목: 상호·연락처·주소·문의 내용 / 이용목적: 상담 및 견적 안내 / 보유기간: 3년</div></div>
                    <button type="submit" class="contact-submit" id="submitBtn"><span id="submitText">무료 상담 신청하기 →</span></button>
                    <div id="formMessage" class="form-message"></div>
                </form>
            </div>
        </div>
    </section>

    <!-- 푸터 -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="logo">
                        <img src="/brand.png" alt="마스터페이" class="logo-mark-img">
                        마스터페이
                    </div>
                    <p>매장 운영에 필요한 모든 장비<br>설치부터 A/S까지 한번에.</p>
                </div>
                
                <div class="footer-col">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="tel:010-2337-0458">📞 010-2337-0458</a></li>
                        <li><a href="https://pf.kakao.com/_fPrxbG/chat" target="_blank">💬 카카오톡 상담</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <span>© 2026 마스터페이. All rights reserved.</span>
                <span>개인정보처리방침 · 이용약관</span>
            </div>
        </div>
    </footer>

    <script>
        function toggleMenu() {
            document.getElementById('navMenu').classList.toggle('active');
        }
        function openKakao(){
          var url='https://pf.kakao.com/_fPrxbG/chat';
          var w=window.open(url,'_blank');
          if(!w||w.closed||typeof w.closed==='undefined'){window.location.href=url;}
        }
        function scrollToContact(event){
          if(event)event.preventDefault();
          var c=document.getElementById('contact');
          if(c){
            var top=c.getBoundingClientRect().top+window.pageYOffset-80;
            window.scrollTo({top:top,behavior:'smooth'});
          }else{window.location.href='/#contact';}
        }
        async function submitContactForm(event){
          if(event){event.preventDefault();event.stopPropagation();}
          var form=document.getElementById('contactForm');
          var submitBtn=document.getElementById('submitBtn');
          var submitText=document.getElementById('submitText');
          var formMessage=document.getElementById('formMessage');
          if(!form){alert('⚠️ 폼을 찾을 수 없습니다.');return false;}
          var agreeCheckbox=document.getElementById('agree');
          if(!agreeCheckbox||!agreeCheckbox.checked){alert('개인정보 수집 및 이용에 동의해주세요.');return false;}
          var name=document.getElementById('name').value.trim();
          var phone=document.getElementById('phone').value.trim();
          var address=document.getElementById('address').value.trim();
          var product=document.getElementById('product').value;
          if(!name){alert('상호(이름)을 입력해주세요.');document.getElementById('name').focus();return false;}
          if(!phone){alert('연락처를 입력해주세요.');document.getElementById('phone').focus();return false;}
          if(!address){alert('주소를 입력해주세요.');document.getElementById('address').focus();return false;}
          if(!product){alert('문의 제품을 선택해주세요.');document.getElementById('product').focus();return false;}
          if(submitBtn)submitBtn.disabled=true;
          if(submitText)submitText.textContent='전송 중...';
          if(formMessage){formMessage.className='form-message';formMessage.style.display='none';}
          var data={name:name,phone:phone,address:address,addressDetail:document.getElementById('address_detail').value.trim(),product:product,business:document.getElementById('business').value,message:document.getElementById('message').value.trim()};
          var result;
          try{
            var response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
            result=await response.json();
            if(result.success){
              if(formMessage){formMessage.className='form-message success';formMessage.style.display='block';formMessage.innerHTML='<div style="text-align:center;padding:24px 20px;"><div style="font-size:48px;margin-bottom:12px;">✅</div><div style="font-size:18px;font-weight:800;color:#2e7d32;margin-bottom:8px;">문의가 성공적으로 접수되었습니다!</div><div style="font-size:14px;color:#555;">24시간 이내에 연락드리겠습니다.<br>급하신 경우 <strong>010-2337-0458</strong>로 연락주세요.</div></div>';}
              form.reset();
              setTimeout(function(){if(formMessage)formMessage.scrollIntoView({behavior:'smooth',block:'center'});},100);
            }else{throw new Error(result.error||'전송에 실패했습니다.');}
          }catch(error){
            var errorMsg=error.message||'전송에 실패했습니다';
            if(formMessage){formMessage.className='form-message error';formMessage.style.display='block';formMessage.innerHTML='<div style="text-align:center;padding:20px;"><div style="font-size:40px;margin-bottom:10px;">❌</div><div style="font-size:16px;font-weight:700;margin-bottom:8px;">전송에 실패했습니다</div><div style="font-size:13px;margin-bottom:12px;color:#555;">'+errorMsg+'</div><div style="font-size:14px;margin-top:12px;"><strong>📞 010-2337-0458</strong><br>또는 카카오톡으로 문의해주세요.</div></div>';formMessage.scrollIntoView({behavior:'smooth',block:'center'});}
          }finally{
            if(submitBtn)submitBtn.disabled=false;
            if(submitText)submitText.textContent='무료 상담 신청하기 →';
          }
          return false;
        }
    </script>

</body>
</html>`;

const PAGE_KIOSK = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
<link rel="icon" type="image/png" href="/brand.png">
<link rel="apple-touch-icon" href="/brand.png">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="naver-site-verification" content="53af8497b3a522a8a85a7b13bae57efd7e27fb5c" />
    <title>키오스크 | 마스터페이</title>
    <meta name="description" content="인건비 절감과 매출 증대를 동시에. 대형 터치스크린 무인 주문·결제 시스템으로 매장 운영의 새로운 표준을 만듭니다.">
    <meta property="og:title" content="키오스크 | 마스터페이">
    <meta property="og:description" content="인건비 절감과 매출 증대를 동시에. 대형 터치스크린 무인 주문·결제 시스템으로 매장 운영의 새로운 표준을 만듭니다.">
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&display=swap" rel="stylesheet">
    <style>/* ========== 공용 스타일 (모든 페이지에서 사용) ========== */

:root {
    --cream: #f7f4ed;
    --cream-dark: #ede8db;
    --ink: #1a1a1a;
    --ink-soft: #4a4a4a;
    --forest: #2d4a3e;
    --forest-dark: #1f352c;
    --coral: #e8763a;
    --border: #d9d3c4;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 80px; }

body {
    font-family: 'Pretendard Variable', Pretendard, -apple-system, sans-serif;
    background: #ffffff;
    color: var(--ink);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
}

a { text-decoration: none; color: inherit; }
img { max-width: 100%; display: block; }

.container {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 32px;
}

/* ========== 헤더 ========== */
header {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    background: var(--cream);
    z-index: 9999 !important;
    border-bottom: 1px solid var(--border);
}
body {
    padding-top: 72px;
}
@media (max-width: 768px) {
    body { padding-top: 60px; }
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 32px;
    max-width: 1240px;
    margin: 0 auto;
}

.logo {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 8px;
}

.logo-mark {
    width: 28px;
    height: 28px;
    background: var(--forest);
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--cream);
    font-size: 14px;
}
.logo-mark-img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    display: inline-block;
    vertical-align: middle;
}

.nav-menu {
    display: flex;
    gap: 40px;
    list-style: none;
}

.nav-menu a {
    font-size: 15px;
    font-weight: 500;
    color: var(--ink-soft);
    transition: color 0.2s;
}

.nav-menu a:hover { color: var(--ink); }

.nav-cta {
    background: var(--ink);
    color: var(--cream);
    padding: 10px 20px;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 600;
    transition: transform 0.2s;
}

.nav-cta:hover { transform: scale(1.03); }

.mobile-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

/* ========== 제품 페이지 전용 ========== */
.product-hero {
    padding: 60px 0 80px;
    position: relative;
    overflow: hidden;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--ink-soft);
    margin-bottom: 32px;
}

.breadcrumb a {
    color: var(--ink-soft);
    transition: color 0.2s;
}

.breadcrumb a:hover { color: var(--ink); }

.breadcrumb-separator {
    opacity: 0.4;
}

.product-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
}

.product-badge {
    display: inline-block;
    padding: 6px 14px;
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
    color: var(--coral);
    margin-bottom: 20px;
}

.product-title {
    font-size: clamp(36px, 5vw, 60px);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
}

.product-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}

.product-lead {
    font-size: 18px;
    color: var(--ink-soft);
    line-height: 1.6;
    margin-bottom: 32px;
}

.product-specs {
    display: flex;
    gap: 32px;
    padding: 24px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    margin-bottom: 32px;
    flex-wrap: wrap;
}

.spec-item .spec-label {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 13px;
    color: var(--coral);
    margin-bottom: 4px;
}

.spec-item .spec-value {
    font-size: 18px;
    font-weight: 700;
}

.product-cta {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.btn {
    padding: 16px 32px;
    border-radius: 100px;
    font-weight: 600;
    font-size: 15px;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid transparent;
}

.btn-primary {
    background: var(--ink);
    color: var(--cream);
}

.btn-primary:hover {
    background: var(--forest);
}

.btn-ghost {
    background: transparent;
    color: var(--ink);
    border-color: var(--border);
}

.btn-ghost:hover {
    background: var(--cream-dark);
}

/* 제품 이미지 영역 */
.product-visual {
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 32px;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 180px;
    position: relative;
    overflow: hidden;
}

.product-visual img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* ========== 특징 섹션 ========== */
.features {
    padding: 100px 0;
    background: var(--cream-dark);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
}

.section-header {
    display: flex;
    align-items: baseline;
    gap: 24px;
    margin-bottom: 64px;
    flex-wrap: wrap;
}

.section-num {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 28px;
    color: var(--coral);
    font-weight: 400;
}

.section-title {
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    flex: 1;
    min-width: 300px;
}

.section-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 2px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 24px;
    overflow: hidden;
}

.feature-item {
    background: var(--cream);
    padding: 40px 32px;
    transition: background 0.3s;
}

.feature-item:hover {
    background: var(--cream-dark);
}

.feature-icon {
    font-size: 36px;
    margin-bottom: 20px;
    display: inline-block;
}

.feature-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 12px;
    letter-spacing: -0.01em;
}

.feature-desc {
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.6;
}

/* ========== 상세 내용 섹션 ========== */
.detail {
    padding: 100px 0;
}

.detail-content {
    max-width: 800px;
    margin: 0 auto;
    font-size: 17px;
    line-height: 1.8;
    color: var(--ink-soft);
}

.detail-content h3 {
    font-size: 28px;
    font-weight: 800;
    color: var(--ink);
    margin: 48px 0 20px;
    letter-spacing: -0.02em;
}

.detail-content h3:first-child {
    margin-top: 0;
}

.detail-content p {
    margin-bottom: 20px;
}

.detail-content ul {
    list-style: none;
    padding: 0;
    margin-bottom: 20px;
}

.detail-content ul li {
    padding: 10px 0 10px 32px;
    position: relative;
    border-bottom: 1px solid var(--border);
}

.detail-content ul li:last-child {
    border-bottom: none;
}

.detail-content ul li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--coral);
    font-weight: 800;
    font-size: 18px;
}

/* ========== 관련 제품 ========== */
.related {
    padding: 100px 0;
    background: var(--cream-dark);
    border-top: 1px solid var(--border);
}

.related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
}

.related-card {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 28px;
    transition: all 0.3s;
    display: block;
}

.related-card:hover {
    transform: translateY(-4px);
    border-color: var(--ink);
}

.related-icon {
    font-size: 36px;
    margin-bottom: 16px;
}

.related-name {
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 6px;
}

.related-desc {
    font-size: 13px;
    color: var(--ink-soft);
}

/* ========== CTA 섹션 ========== */
.cta {
    background: var(--ink);
    color: var(--cream);
    padding: 120px 0;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.cta::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: var(--forest);
    border-radius: 50%;
    top: -300px;
    right: -200px;
    opacity: 0.4;
    filter: blur(80px);
}

.cta-content {
    position: relative;
    z-index: 1;
}

.cta-label {
    font-family: 'Fraunces', serif;
    font-style: italic;
    color: var(--coral);
    font-size: 18px;
    margin-bottom: 20px;
}

.cta h2 {
    font-size: clamp(32px, 5vw, 56px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-bottom: 40px;
}

.cta h2 .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--coral);
}

.cta-phone {
    display: inline-flex;
    align-items: center;
    gap: 16px;
    font-size: 28px;
    font-weight: 800;
    padding: 20px 40px;
    background: var(--cream);
    color: var(--ink);
    border-radius: 100px;
    transition: transform 0.2s;
    margin-bottom: 16px;
}

.cta-phone:hover {
    transform: scale(1.03);
}

.cta-note {
    opacity: 0.7;
    font-size: 14px;
}

/* ========== 푸터 ========== */
footer {
    background: var(--ink);
    color: var(--cream);
    padding: 60px 0 40px;
    border-top: 1px solid rgba(247, 244, 237, 0.1);
}

.footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
}

.footer-brand .logo {
    color: var(--cream);
    margin-bottom: 16px;
}

.footer-brand p {
    font-size: 14px;
    opacity: 0.7;
    max-width: 300px;
    line-height: 1.6;
}

.footer-col h4 {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 16px;
    color: var(--coral);
}

.footer-col ul { list-style: none; }
.footer-col li { margin-bottom: 10px; }

.footer-col a {
    font-size: 14px;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.footer-col a:hover { opacity: 1; }

.footer-bottom {
    padding-top: 30px;
    border-top: 1px solid rgba(247, 244, 237, 0.1);
    font-size: 13px;
    opacity: 0.6;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
}

/* ========== 모바일 대응 ========== */
@media (max-width: 900px) {
    .product-grid {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .footer-grid {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 640px) {
    .container { padding: 0 20px; }
    .nav { padding: 16px 20px; }
    .nav-menu, .nav-cta { display: none; }
    .mobile-toggle { display: block; }
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--cream);
        padding: 20px;
        gap: 20px;
        border-bottom: 1px solid var(--border);
    }
    .product-hero { padding: 40px 0 60px; }
    .features, .detail, .related { padding: 60px 0; }
    .cta { padding: 80px 0; }
    .footer-grid { grid-template-columns: 1fr; }
    .cta-phone { font-size: 20px; padding: 16px 28px; }
    .product-visual { font-size: 100px; }
}

/* ============================================================
   📱 모바일 반응형 종합 보강 (일괄 패치)
   ============================================================ */

/* 가로 스크롤 방지 (가장 중요) */
html, body {
    overflow-x: hidden;
    width: 100%;
    -webkit-text-size-adjust: 100%;
}

* { max-width: 100%; }
img, video, iframe { max-width: 100%; height: auto; }
table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }

/* 768px 이하 (태블릿 ↓) */
@media (max-width: 768px) {
    .container { padding: 0 16px !important; }
    
    /* 본문 텍스트 가독성 */
    body { font-size: 15px; line-height: 1.7; }
    h1 { font-size: clamp(22px, 5.5vw, 30px) !important; line-height: 1.25 !important; word-break: keep-all; }
    h2 { font-size: clamp(18px, 4.5vw, 24px) !important; line-height: 1.3 !important; word-break: keep-all; }
    h3 { font-size: clamp(15px, 4vw, 18px) !important; line-height: 1.35 !important; }
    p { word-break: keep-all; line-height: 1.75; }
    
    /* 헤더/네비 */
    .nav { padding: 14px 0 !important; }
    .nav-menu { display: none !important; }
    .mobile-toggle { display: block !important; font-size: 22px; background: none; border: 0; cursor: pointer; padding: 6px 10px; }
    .nav-menu.active { display: flex !important; flex-direction: column; position: absolute; top: 100%; left: 0; right: 0; background: var(--cream); padding: 16px; gap: 14px; border-top: 1px solid var(--border); z-index: 100; }
    .nav-cta { padding: 8px 14px !important; font-size: 13px !important; }
    .logo { font-size: 17px !important; gap: 8px !important; }
    .logo-mark, .logo-mark-img { width: 24px !important; height: 24px !important; font-size: 12px !important; }
    
    /* 그리드들 → 1열 */
    .region-features-grid,
    .region-biz-grid,
    .region-reviews-grid,
    .region-products-grid,
    .footer-grid,
    .features-grid,
    .product-cards-grid,
    .pricing-grid,
    .review-grid,
    .stat-cards { grid-template-columns: 1fr !important; gap: 12px !important; }
    
    /* 시도/시군구 통계 → 2열 (너무 좁아지면 1열) */
    .region-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
    
    /* 지역 리스트(시군구·동) → 2~3열 */
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; font-size: 13px; }
    
    /* 제품 그리드 → 2열 */
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
    
    /* 박스 패딩 축소 */
    .region-box { padding: 20px 18px !important; border-radius: 14px !important; margin-bottom: 14px !important; }
    .region-box-title { font-size: 17px !important; margin-bottom: 12px !important; }
    
    /* 썸네일 (Hero) */
    .region-thumbnail { max-width: 100% !important; max-height: 280px !important; aspect-ratio: 4/3 !important; margin: 0 auto 20px !important; border-radius: 14px !important; }
    .region-thumbnail-overlay { padding: 18px 16px !important; }
    .region-thumbnail-meta { font-size: 11px !important; gap: 6px !important; }
    .region-thumbnail-title { font-size: clamp(20px, 5.5vw, 28px) !important; line-height: 1.2 !important; margin-bottom: 8px !important; }
    .region-thumbnail-services { font-size: 12px !important; line-height: 1.5 !important; }
    .region-hero-sub-standalone { font-size: 14px !important; line-height: 1.7 !important; max-width: 100% !important; padding: 0 4px !important; }
    
    /* 제품 5줄 카드 폰트 축소 */
    .region-product-detail-card { padding: 14px 16px !important; }
    .region-product-detail-card h3 { font-size: 15px !important; }
    .region-product-detail-card li { font-size: 12.5px !important; line-height: 1.65 !important; }
    
    /* FAQ */
    .region-faq-item { padding: 12px 14px !important; }
    .region-faq-item strong { font-size: 13.5px !important; }
    .region-faq-item p { font-size: 12.5px !important; }
    
    /* 주의사항 */
    .region-caution-item { padding: 12px 14px !important; gap: 10px !important; }
    .region-caution-item h3 { font-size: 13.5px !important; }
    .region-caution-item p { font-size: 12.5px !important; }
    
    /* 추천 업종 카드 */
    .region-biz-card { padding: 12px 14px !important; }
    .region-biz-name { font-size: 13.5px !important; }
    .region-biz-effect { font-size: 12px !important; }
    .region-biz-stars { font-size: 11.5px !important; }
    
    /* CTA 박스 */
    .region-cta-box { padding: 24px 18px !important; }
    .region-cta-buttons { flex-direction: column !important; gap: 10px !important; }
    .region-cta-buttons .btn { width: 100% !important; text-align: center; padding: 12px !important; font-size: 14px !important; }
    
    /* 버튼 */
    .btn { font-size: 14px !important; padding: 10px 18px !important; }
    .btn-primary, .btn-ghost { width: auto; }
    
    /* breadcrumb */
    .breadcrumb { font-size: 11.5px !important; flex-wrap: wrap; gap: 4px; }
    
    /* 푸터 */
    footer { padding: 32px 0 24px !important; }
    .footer-grid { gap: 24px !important; }
    .footer-brand .logo { font-size: 18px !important; }
}

/* 480px 이하 (작은 모바일) */
@media (max-width: 480px) {
    .container { padding: 0 14px !important; }
    h1 { font-size: clamp(20px, 6vw, 26px) !important; }
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; font-size: 12.5px; }
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 6px !important; }
    .region-thumbnail { max-height: 240px !important; }
    .region-thumbnail-overlay { padding: 14px 12px !important; }
    .region-thumbnail-services { font-size: 11px !important; }
    .region-hero-sub-standalone { font-size: 13px !important; }
}

/* 360px 이하 (소형 모바일) */
@media (max-width: 360px) {
    .container { padding: 0 12px !important; }
    .region-stats-grid { grid-template-columns: 1fr !important; }
    .region-list-grid { grid-template-columns: 1fr !important; }
    .region-thumbnail-title { font-size: 19px !important; }
}


/* ============================================================
   📱 짤림 방지 추가 패치 (이미지·텍스트 모두)
   ============================================================ */

/* === 모든 화면 크기에서 짤림 방지 === */
* {
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
}

/* 모든 이미지가 부모 박스 안에 들어오도록 강제 */
img, picture, video, svg, canvas, iframe, embed, object {
    max-width: 100% !important;
    height: auto !important;
    display: block;
}

/* 모든 텍스트 박스가 부모 안에 들어오도록 */
p, h1, h2, h3, h4, h5, h6, span, div, li, a, strong, em, td, th {
    word-wrap: break-word;
    overflow-wrap: break-word;
    min-width: 0;
}

/* 한글 단어가 중간에 안 끊기도록 */
p, h1, h2, h3, h4, li {
    word-break: keep-all;
}

/* 영어·URL·이메일·전화번호 같은 긴 문자열 강제 줄바꿈 */
.long-text, code, pre, .url, a[href^="mailto"], a[href^="tel"], .breadcrumb {
    word-break: break-all;
    overflow-wrap: anywhere;
}

/* 그리드 자식이 부모를 넘는 것 방지 */
[class*="grid"], [class*="flex"] {
    min-width: 0;
}
[class*="grid"] > *, [class*="flex"] > * {
    min-width: 0;
    max-width: 100%;
}

/* 768px 이하에서 추가 짤림 방지 */
@media (max-width: 768px) {
    /* body 내부에서 가로로 넘는 요소 강제 정리 */
    body, html { max-width: 100vw !important; overflow-x: hidden !important; }
    
    /* 컨테이너·박스가 절대 가로폭 안 넘게 */
    .container, .region-box, .region-cta-box, header, footer, section {
        max-width: 100% !important;
        box-sizing: border-box !important;
    }
    
    /* 썸네일 안 텍스트도 wrap */
    .region-thumbnail-title, .region-thumbnail-services, .region-thumbnail-meta {
        max-width: 100% !important;
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        white-space: normal !important;
    }
    
    /* 통계 카드 숫자 폰트 축소 */
    .region-stats-grid .region-stat-num,
    .region-stats-grid .region-stat-value,
    [class*="stat-num"], [class*="stat-value"] {
        font-size: clamp(18px, 5vw, 24px) !important;
        word-break: break-all !important;
    }
    
    /* 표 가로 스크롤 처리 */
    table {
        display: block !important;
        overflow-x: auto !important;
        white-space: nowrap;
    }
    
    /* 긴 동 이름(예: "한국토지주택공사동") 줄바꿈 */
    .region-list-grid a, .region-products-simple a {
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        line-height: 1.4 !important;
        padding: 8px 6px !important;
        font-size: 12.5px !important;
        text-align: center;
    }
    
    /* 전화번호·CTA 버튼 텍스트가 안 잘리도록 */
    .btn, .nav-cta, button, a[href^="tel"] {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}


/* === 온라인 문의 폼 (모든 페이지 공통) === */
.contact-section {
    padding: 100px 0;
    background: var(--cream-dark);
}
.contact-section .container {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 60px;
    align-items: start;
    max-width: 1140px;
}
.contact-intro {
    position: sticky;
    top: 100px;
}
.contact-intro .cta-label {
    text-align: left;
    font-size: 13px;
    font-weight: 700;
    color: var(--coral);
    letter-spacing: 3px;
    margin-bottom: 16px;
}
.contact-title {
    font-size: clamp(32px, 4vw, 48px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0 0 16px;
}
.contact-sub {
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.7;
    margin: 0 0 32px;
}
.contact-direct {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.contact-direct-btn {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 22px;
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 14px;
    transition: all 0.2s;
    text-decoration: none;
    color: inherit;
}
.contact-direct-btn:hover {
    border-color: var(--forest);
    transform: translateX(4px);
}
.contact-direct-btn .cd-icon {
    width: 44px;
    height: 44px;
    background: var(--cream-dark);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
}
.cd-label {
    display: block;
    font-size: 12px;
    color: var(--ink-soft);
    margin-bottom: 2px;
}
.cd-value {
    display: block;
    font-size: 16px;
    font-weight: 700;
    color: var(--ink);
}

/* 문의 폼 박스 */
.contact-form-box {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 40px 36px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}
.contact-form-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 22px;
    font-weight: 800;
    margin: 0 0 28px;
    letter-spacing: -0.01em;
}
.cf-bar {
    width: 4px;
    height: 22px;
    background: var(--coral);
    border-radius: 2px;
}
.contact-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.form-group {
    display: flex;
    flex-direction: column;
}
.form-group label {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 8px;
}
.required {
    color: var(--coral);
}
.form-group input,
.form-group select,
.form-group textarea {
    padding: 14px 16px;
    font-size: 14px;
    font-family: inherit;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: #fafafa;
    color: var(--ink);
    transition: all 0.2s;
    width: 100%;
    box-sizing: border-box;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--forest);
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(45, 74, 62, 0.1);
}
.form-group input::placeholder,
.form-group textarea::placeholder {
    color: #b0b0b0;
}
.form-group textarea {
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
}
.form-group select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23666' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    background-size: 10px;
    padding-right: 40px;
}
.form-agree {
    padding: 16px;
    background: #fafafa;
    border-radius: 10px;
    border: 1px solid var(--border);
}
.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
}
.checkbox-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--forest);
    cursor: pointer;
}
.agree-detail {
    font-size: 11px;
    color: var(--ink-soft);
    margin-top: 8px;
    padding-left: 26px;
    line-height: 1.6;
}
.contact-submit {
    background: var(--ink);
    color: #ffffff;
    border: none;
    padding: 18px 28px;
    font-size: 16px;
    font-weight: 700;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    margin-top: 8px;
}
.contact-submit:hover {
    background: var(--forest);
    transform: translateY(-2px);
}
.contact-submit:disabled {
    background: #999;
    cursor: not-allowed;
    transform: none;
}
.form-message {
    padding: 20px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    display: none;
    margin-top: 16px;
}
.form-message.success {
    display: block;
    background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
    color: #1b5e20;
    border: 2px solid #66bb6a;
    box-shadow: 0 4px 16px rgba(76, 175, 80, 0.2);
    animation: messagePop 0.4s ease;
}
.form-message.error {
    display: block;
    background: linear-gradient(135deg, #ffebee, #ffcdd2);
    color: #b71c1c;
    border: 2px solid #ef5350;
    box-shadow: 0 4px 16px rgba(244, 67, 54, 0.2);
    animation: messagePop 0.4s ease;
}
@keyframes messagePop {
    0% { transform: scale(0.9); opacity: 0; }
    60% { transform: scale(1.02); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}

/* 모바일 */
@media (max-width: 900px) {
    .contact-section .container {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .contact-intro {
        position: static;
        text-align: center;
    }
    .contact-intro .cta-label { text-align: center; }
    .contact-direct-btn { flex-direction: row; text-align: left; }
    .contact-form-box { padding: 28px 24px; }
}

</style>
</head>
<body>

    <!-- 헤더 -->
    <header>
        <nav class="nav">
            <a href="/" class="logo">
                <img src="/brand.png" alt="마스터페이" class="logo-mark-img">
                마스터페이
            </a>
            
            <ul class="nav-menu" id="navMenu">
                <li><a href="/#find-sec">지역별 설치</a></li>
                <li><a href="/#allinone">제품 안내</a></li>
                <li><a href="/#process">프로세스</a></li>
                <li><a href="/#faq">자주 묻는 질문</a></li>
            </ul>
            
            <a href="/#contact" class="nav-cta">문의하기</a>
            <button class="mobile-toggle" onclick="toggleMenu()">☰</button>
        </nav>
    </header>

    <!-- 제품 히어로 -->
    <section class="product-hero">
        <div class="container">
            <div class="breadcrumb">
                <a href="/">홈</a>
                <span class="breadcrumb-separator">/</span>
                <a href="/#products">제품</a>
                <span class="breadcrumb-separator">/</span>
                <span>키오스크</span>
            </div>
            
            <div class="product-grid">
                <div class="product-info">
                    <span class="product-badge">Kiosk</span>
                    <h1 class="product-title">
                        키오스크
                    </h1>
                    <p class="product-lead">인건비 절감과 매출 증대를 동시에. 대형 터치스크린 무인 주문·결제 시스템으로 매장 운영의 새로운 표준을 만듭니다.</p>
                    
                    <div class="product-specs">
                    <div class="spec-item">
                        <div class="spec-label">Size</div>
                        <div class="spec-value">대형 스탠드형</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Feature</div>
                        <div class="spec-value">주문·결제·관리</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Effect</div>
                        <div class="spec-value">인건비 최대 50% 절감</div>
                    </div>
                    </div>
                    
                    <div class="product-cta">
                        <a href="/#contact" class="btn btn-primary">
                            무료 상담 신청 →
                        </a>
                        <a href="tel:010-2337-0458" class="btn btn-ghost">
                            📞 전화 상담
                        </a>
                    </div>
                </div>
                
                <div class="product-visual">
                    <img src="https://raw.githubusercontent.com/YOONSOEUN1/mastarpay/main/images/Kiosk.png" alt="키오스크" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
            </div>
        </div>
    </section>

    <!-- 특징 섹션 -->
    <section class="features">
        <div class="container">
            <div class="section-header">
                <span class="section-num">01 / Features</span>
                <h2 class="section-title">
                    이런 특징이 있어요.
                </h2>
            </div>
            
            <div class="feature-grid">
                <div class="feature-item">
                    <div class="feature-icon">🏆</div>
                    <h3 class="feature-title">검증된 품질</h3>
                    <p class="feature-desc">업계에서 인정받은 최고의 모델만을 엄선하여 제공합니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">⚡</div>
                    <h3 class="feature-title">빠른 설치</h3>
                    <p class="feature-desc">상담 후 빠른 일정으로 설치가 완료됩니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">💰</div>
                    <h3 class="feature-title">합리적 비용</h3>
                    <p class="feature-desc">설치비 무료 옵션과 렌탈 프로그램으로 부담이 적습니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🔧</div>
                    <h3 class="feature-title">A/S 보장</h3>
                    <p class="feature-desc">장애 시 원격 지원과 현장 출동으로 빠르게 해결합니다.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 상세 내용 -->
    <section class="detail">
        <div class="container">
            <div class="section-header">
                <span class="section-num">02 / Details</span>
                <h2 class="section-title">
                    자세히 알아보기.
                </h2>
            </div>
            
            <div class="detail-content">
                
                <h3>키오스크가 필수인 시대</h3>
                <p>최저임금 상승과 심각한 인력난으로 자영업자의 고민이 깊어지고 있습니다. 특히 홀 서빙과 카운터 업무는 인건비 부담의 가장 큰 원인입니다. 키오스크는 이러한 문제를 한 번에 해결하는 가장 효과적인 솔루션입니다. 단순 주문 업무를 자동화하여 직원은 더 중요한 서비스와 주방 업무에 집중할 수 있고, 인건비는 월 최대 200만원까지 절감 가능합니다.</p>
                <p>마스터페이는 전국 매장에 키오스크를 직접 설치하며, 업종별 최적 모델을 추천합니다. 패스트푸드, 카페, 분식집, 중식당, 한식당, 편의점 등 업종에 상관없이 매장에 딱 맞는 메뉴 구성과 결제 흐름을 설계해드립니다.</p>
                
                <h3>키오스크 설치 프로세스</h3>
                <ul>
                    <li>1단계 무료 상담 — 매장 업종·규모·메뉴 수를 확인합니다</li>
                    <li>2단계 현장 분석 — 매장 방문하여 설치 위치·동선·전원 상태를 점검합니다</li>
                    <li>3단계 UI 설계 — 매장에 맞는 메뉴 배치와 결제 흐름을 직접 설계합니다</li>
                    <li>4단계 메뉴 등록 — 메뉴 사진·가격·옵션을 꼼꼼히 등록합니다</li>
                    <li>5단계 현장 설치 — 전문 기사가 방문하여 설치·세팅·테스트를 완료합니다</li>
                    <li>6단계 직원 교육 — 키오스크 운영법과 문제 해결법을 교육합니다</li>
                </ul>
                
                <h3>키오스크 주요 기능</h3>
                <ul>
                    <li>인건비 대폭 절감 — 홀 서빙·카운터 직원을 줄여 월 인건비를 크게 절약합니다</li>
                    <li>객단가 상승 — 메뉴 사진과 추천 메뉴로 추가 주문이 자연스럽게 유도됩니다</li>
                    <li>대기 시간 단축 — 피크 타임에도 여러 고객이 동시에 주문 가능해 대기가 줄어듭니다</li>
                    <li>맞춤형 UI 설정 — 우리 매장에 딱 맞는 메뉴 배치와 결제 동선을 직접 설계합니다</li>
                    <li>다양한 결제 지원 — 카드·삼성페이·카카오페이·페이코·제로페이 모두 지원합니다</li>
                    <li>다국어 지원 — 한국어·영어·중국어·일본어로 외국인 관광객 응대가 가능합니다</li>
                </ul>
                
                <h3>이런 매장에 추천합니다</h3>
                <p>피크 타임에 주문이 밀리는 음식점·카페, 인건비 부담이 큰 프랜차이즈·분식점, 24시간 무인 운영을 고려하는 매장, 메뉴가 많아 주문 실수가 잦은 업종, 젊은 고객층이 많은 트렌디한 매장에 강력히 추천합니다. 햄버거 전문점, 분식집, 국수집, 프랜차이즈 카페, 중식당 등에서 특히 효과적입니다.</p>
                
                <h3>키오스크 도입 전후 비교</h3>
                <p>키오스크 도입 전 매장은 피크 타임에 주문 대기 줄이 길어지고, 주문 실수가 빈번하며, 홀 인건비가 매출의 30% 이상을 차지합니다. 반면 도입 후에는 여러 고객이 동시에 주문할 수 있어 대기 시간이 60% 이상 단축되고, 주문 정확도가 98% 이상으로 향상되며, 홀 인건비가 15% 수준까지 떨어집니다. 또한 메뉴 사진 노출로 추가 주문이 늘어 객단가가 평균 20% 이상 상승합니다.</p>
                
                <h3>설치 비용과 렌탈 옵션</h3>
                <p>키오스크는 초기 구매 비용이 부담스러울 수 있어 렌탈 방식을 많이 선택합니다. 마스터페이는 초기 비용 0원 렌탈 옵션을 제공하여, 매장에서 절감된 인건비로 렌탈료를 충당하고도 이익이 남도록 설계합니다. 대부분의 매장이 3~6개월 내에 투자 비용을 회수하고 이후부터는 순수 이익이 발생합니다. 정확한 견적은 상담을 통해 안내해드립니다.</p>
                
                <h3>자주 묻는 질문</h3>
                <p><strong>Q. 설치 비용이 부담되지 않을까요?</strong><br>렌탈 방식으로 초기 비용 없이 도입 가능합니다. 절감된 인건비로 렌탈료를 충당하고도 이익이 남는 구조입니다.</p>
                <p><strong>Q. 노년층 고객이 사용하기 어렵지 않을까요?</strong><br>큰 버튼, 직관적인 아이콘, 단순한 흐름으로 설계되어 대부분의 연령대가 쉽게 사용합니다. 필요 시 직원이 도와드리는 시간이 짧습니다.</p>
                <p><strong>Q. 메뉴 변경은 어떻게 하나요?</strong><br>관리 화면에서 간단히 메뉴·가격·사진을 변경할 수 있습니다. 복잡한 변경은 마스터페이가 원격으로 도와드립니다.</p>
                <p><strong>Q. 설치 공간이 충분한가요?</strong><br>대형 스탠드형은 약 1m² 공간이 필요합니다. 공간이 부족하면 미니 키오스크를 추천드립니다.</p>
    
            </div>
        </div>
    </section>

    <!-- 관련 제품 -->
    <section class="related">
        <div class="container">
            <div class="section-header">
                <span class="section-num">03 / Related</span>
                <h2 class="section-title">
                    다른 제품도 둘러보세요.
                </h2>
            </div>
            
            <div class="related-grid">
                <a href="/product/kiosk-mini" class="related-card">
                    <div class="related-icon">📱</div>
                    <div class="related-name">미니 키오스크</div>
                    <div class="related-desc">작은 공간에 적합</div>
                </a>
                <a href="/product/tableorder" class="related-card">
                    <div class="related-icon">📋</div>
                    <div class="related-name">테이블 오더</div>
                    <div class="related-desc">QR 주문 시스템</div>
                </a>
                <a href="/product/pos" class="related-card">
                    <div class="related-icon">🖥️</div>
                    <div class="related-name">포스기</div>
                    <div class="related-desc">매장 통합 관리</div>
                </a>
            </div>
        </div>
    </section>

    <!-- CTA -->
    <section class="contact-section" id="contact">
        <div class="container">
            <div class="contact-intro">
                <div class="cta-label">— Contact Us —</div>
                <h2 class="contact-title">무료 상담 신청</h2>
                <p class="contact-sub">전화, 카카오톡 또는 아래 폼으로 문의해주세요.<br>담당자가 빠르게 연락드립니다.</p>
                <div class="contact-direct">
                    <a href="tel:010-2337-0458" class="contact-direct-btn">
                        <span class="cd-icon">📞</span>
                        <span><span class="cd-label">전화 상담</span><span class="cd-value">010-2337-0458</span></span>
                    </a>
                    <a href="javascript:void(0)" onclick="openKakao(); return false;" class="contact-direct-btn">
                        <span class="cd-icon">💬</span>
                        <span><span class="cd-label">카카오톡</span><span class="cd-value">바로 상담</span></span>
                    </a>
                </div>
            </div>
            <div class="contact-form-box">
                <h3 class="contact-form-title"><span class="cf-bar"></span><span>📝 온라인 문의</span></h3>
                <form id="contactForm" class="contact-form" onsubmit="return submitContactForm(event)">
                    <div class="form-group"><label for="name">상호(이름) <span class="required">*</span></label><input type="text" id="name" name="상호_이름" placeholder="상호 또는 이름을 입력하세요" required></div>
                    <div class="form-group"><label for="phone">연락처 <span class="required">*</span></label><input type="tel" id="phone" name="연락처" placeholder="010-0000-0000" required></div>
                    <div class="form-group"><label for="address">주소 <span class="required">*</span></label><input type="text" id="address" name="주소" placeholder="매장 주소" required><input type="text" id="address_detail" name="상세주소" placeholder="상세주소 (건물명, 층, 호수 등)" style="margin-top: 8px;"></div>
                    <div class="form-group"><label for="product">문의 제품 <span class="required">*</span></label><select id="product" name="문의_제품" required><option value="">선택해주세요</option><option value="포스기">포스기(POS)</option><option value="2인치 단말기">2인치 단말기</option><option value="3인치 단말기">3인치 단말기</option><option value="토스 단말기">토스 단말기</option><option value="무선 단말기">무선 단말기</option><option value="블루투스 단말기">블루투스 단말기</option><option value="키오스크">키오스크</option><option value="미니 키오스크">미니 키오스크</option><option value="테이블 오더">테이블 오더</option><option value="매장 철거">매장 철거</option><option value="여러 제품 패키지">여러 제품 패키지</option><option value="기타/미정">기타/미정</option></select></div>
                    <div class="form-group"><label for="business">업종</label><select id="business" name="업종"><option value="">선택해주세요</option><option value="음식점/식당">음식점/식당</option><option value="카페/베이커리">카페/베이커리</option><option value="편의점/마트">편의점/마트</option><option value="미용실/네일샵">미용실/네일샵</option><option value="스터디카페">스터디카페</option><option value="주점/호프">주점/호프</option><option value="무인매장">무인매장</option><option value="의류/잡화">의류/잡화</option><option value="병원/약국">병원/약국</option><option value="기타">기타</option></select></div>
                    <div class="form-group"><label for="message">문의 내용</label><textarea id="message" name="문의_내용" rows="5" placeholder="매장 위치, 현재 사용 장비, 궁금한 점 등을 자유롭게 적어주세요."></textarea></div>
                    <div class="form-agree"><label class="checkbox-label"><input type="checkbox" id="agree" required><span>개인정보 수집 및 이용에 동의합니다 <span class="required">*</span></span></label><div class="agree-detail">수집항목: 상호·연락처·주소·문의 내용 / 이용목적: 상담 및 견적 안내 / 보유기간: 3년</div></div>
                    <button type="submit" class="contact-submit" id="submitBtn"><span id="submitText">무료 상담 신청하기 →</span></button>
                    <div id="formMessage" class="form-message"></div>
                </form>
            </div>
        </div>
    </section>

    <!-- 푸터 -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="logo">
                        <img src="/brand.png" alt="마스터페이" class="logo-mark-img">
                        마스터페이
                    </div>
                    <p>매장 운영에 필요한 모든 장비<br>설치부터 A/S까지 한번에.</p>
                </div>
                
                <div class="footer-col">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="tel:010-2337-0458">📞 010-2337-0458</a></li>
                        <li><a href="https://pf.kakao.com/_fPrxbG/chat" target="_blank">💬 카카오톡 상담</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <span>© 2026 마스터페이. All rights reserved.</span>
                <span>개인정보처리방침 · 이용약관</span>
            </div>
        </div>
    </footer>

    <script>
        function toggleMenu() {
            document.getElementById('navMenu').classList.toggle('active');
        }
        function openKakao(){
          var url='https://pf.kakao.com/_fPrxbG/chat';
          var w=window.open(url,'_blank');
          if(!w||w.closed||typeof w.closed==='undefined'){window.location.href=url;}
        }
        function scrollToContact(event){
          if(event)event.preventDefault();
          var c=document.getElementById('contact');
          if(c){
            var top=c.getBoundingClientRect().top+window.pageYOffset-80;
            window.scrollTo({top:top,behavior:'smooth'});
          }else{window.location.href='/#contact';}
        }
        async function submitContactForm(event){
          if(event){event.preventDefault();event.stopPropagation();}
          var form=document.getElementById('contactForm');
          var submitBtn=document.getElementById('submitBtn');
          var submitText=document.getElementById('submitText');
          var formMessage=document.getElementById('formMessage');
          if(!form){alert('⚠️ 폼을 찾을 수 없습니다.');return false;}
          var agreeCheckbox=document.getElementById('agree');
          if(!agreeCheckbox||!agreeCheckbox.checked){alert('개인정보 수집 및 이용에 동의해주세요.');return false;}
          var name=document.getElementById('name').value.trim();
          var phone=document.getElementById('phone').value.trim();
          var address=document.getElementById('address').value.trim();
          var product=document.getElementById('product').value;
          if(!name){alert('상호(이름)을 입력해주세요.');document.getElementById('name').focus();return false;}
          if(!phone){alert('연락처를 입력해주세요.');document.getElementById('phone').focus();return false;}
          if(!address){alert('주소를 입력해주세요.');document.getElementById('address').focus();return false;}
          if(!product){alert('문의 제품을 선택해주세요.');document.getElementById('product').focus();return false;}
          if(submitBtn)submitBtn.disabled=true;
          if(submitText)submitText.textContent='전송 중...';
          if(formMessage){formMessage.className='form-message';formMessage.style.display='none';}
          var data={name:name,phone:phone,address:address,addressDetail:document.getElementById('address_detail').value.trim(),product:product,business:document.getElementById('business').value,message:document.getElementById('message').value.trim()};
          var result;
          try{
            var response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
            result=await response.json();
            if(result.success){
              if(formMessage){formMessage.className='form-message success';formMessage.style.display='block';formMessage.innerHTML='<div style="text-align:center;padding:24px 20px;"><div style="font-size:48px;margin-bottom:12px;">✅</div><div style="font-size:18px;font-weight:800;color:#2e7d32;margin-bottom:8px;">문의가 성공적으로 접수되었습니다!</div><div style="font-size:14px;color:#555;">24시간 이내에 연락드리겠습니다.<br>급하신 경우 <strong>010-2337-0458</strong>로 연락주세요.</div></div>';}
              form.reset();
              setTimeout(function(){if(formMessage)formMessage.scrollIntoView({behavior:'smooth',block:'center'});},100);
            }else{throw new Error(result.error||'전송에 실패했습니다.');}
          }catch(error){
            var errorMsg=error.message||'전송에 실패했습니다';
            if(formMessage){formMessage.className='form-message error';formMessage.style.display='block';formMessage.innerHTML='<div style="text-align:center;padding:20px;"><div style="font-size:40px;margin-bottom:10px;">❌</div><div style="font-size:16px;font-weight:700;margin-bottom:8px;">전송에 실패했습니다</div><div style="font-size:13px;margin-bottom:12px;color:#555;">'+errorMsg+'</div><div style="font-size:14px;margin-top:12px;"><strong>📞 010-2337-0458</strong><br>또는 카카오톡으로 문의해주세요.</div></div>';formMessage.scrollIntoView({behavior:'smooth',block:'center'});}
          }finally{
            if(submitBtn)submitBtn.disabled=false;
            if(submitText)submitText.textContent='무료 상담 신청하기 →';
          }
          return false;
        }
    </script>

</body>
</html>`;

const PAGE_KIOSK_MINI = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
<link rel="icon" type="image/png" href="/brand.png">
<link rel="apple-touch-icon" href="/brand.png">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="naver-site-verification" content="53af8497b3a522a8a85a7b13bae57efd7e27fb5c" />
    <title>미니 키오스크 | 마스터페이</title>
    <meta name="description" content="작은 매장에도 부담 없이 도입하는 컴팩트 무인 주문 시스템. 공간 절약과 비용 절감, 두 마리 토끼를 모두 잡는 합리적인 선택입니다.">
    <meta property="og:title" content="미니 키오스크 | 마스터페이">
    <meta property="og:description" content="작은 매장에도 부담 없이 도입하는 컴팩트 무인 주문 시스템. 공간 절약과 비용 절감, 두 마리 토끼를 모두 잡는 합리적인 선택입니다.">
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&display=swap" rel="stylesheet">
    <style>/* ========== 공용 스타일 (모든 페이지에서 사용) ========== */

:root {
    --cream: #f7f4ed;
    --cream-dark: #ede8db;
    --ink: #1a1a1a;
    --ink-soft: #4a4a4a;
    --forest: #2d4a3e;
    --forest-dark: #1f352c;
    --coral: #e8763a;
    --border: #d9d3c4;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 80px; }

body {
    font-family: 'Pretendard Variable', Pretendard, -apple-system, sans-serif;
    background: #ffffff;
    color: var(--ink);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
}

a { text-decoration: none; color: inherit; }
img { max-width: 100%; display: block; }

.container {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 32px;
}

/* ========== 헤더 ========== */
header {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    background: var(--cream);
    z-index: 9999 !important;
    border-bottom: 1px solid var(--border);
}
body {
    padding-top: 72px;
}
@media (max-width: 768px) {
    body { padding-top: 60px; }
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 32px;
    max-width: 1240px;
    margin: 0 auto;
}

.logo {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 8px;
}

.logo-mark {
    width: 28px;
    height: 28px;
    background: var(--forest);
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--cream);
    font-size: 14px;
}
.logo-mark-img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    display: inline-block;
    vertical-align: middle;
}

.nav-menu {
    display: flex;
    gap: 40px;
    list-style: none;
}

.nav-menu a {
    font-size: 15px;
    font-weight: 500;
    color: var(--ink-soft);
    transition: color 0.2s;
}

.nav-menu a:hover { color: var(--ink); }

.nav-cta {
    background: var(--ink);
    color: var(--cream);
    padding: 10px 20px;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 600;
    transition: transform 0.2s;
}

.nav-cta:hover { transform: scale(1.03); }

.mobile-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

/* ========== 제품 페이지 전용 ========== */
.product-hero {
    padding: 60px 0 80px;
    position: relative;
    overflow: hidden;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--ink-soft);
    margin-bottom: 32px;
}

.breadcrumb a {
    color: var(--ink-soft);
    transition: color 0.2s;
}

.breadcrumb a:hover { color: var(--ink); }

.breadcrumb-separator {
    opacity: 0.4;
}

.product-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
}

.product-badge {
    display: inline-block;
    padding: 6px 14px;
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
    color: var(--coral);
    margin-bottom: 20px;
}

.product-title {
    font-size: clamp(36px, 5vw, 60px);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
}

.product-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}

.product-lead {
    font-size: 18px;
    color: var(--ink-soft);
    line-height: 1.6;
    margin-bottom: 32px;
}

.product-specs {
    display: flex;
    gap: 32px;
    padding: 24px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    margin-bottom: 32px;
    flex-wrap: wrap;
}

.spec-item .spec-label {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 13px;
    color: var(--coral);
    margin-bottom: 4px;
}

.spec-item .spec-value {
    font-size: 18px;
    font-weight: 700;
}

.product-cta {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.btn {
    padding: 16px 32px;
    border-radius: 100px;
    font-weight: 600;
    font-size: 15px;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid transparent;
}

.btn-primary {
    background: var(--ink);
    color: var(--cream);
}

.btn-primary:hover {
    background: var(--forest);
}

.btn-ghost {
    background: transparent;
    color: var(--ink);
    border-color: var(--border);
}

.btn-ghost:hover {
    background: var(--cream-dark);
}

/* 제품 이미지 영역 */
.product-visual {
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 32px;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 180px;
    position: relative;
    overflow: hidden;
}

.product-visual img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* ========== 특징 섹션 ========== */
.features {
    padding: 100px 0;
    background: var(--cream-dark);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
}

.section-header {
    display: flex;
    align-items: baseline;
    gap: 24px;
    margin-bottom: 64px;
    flex-wrap: wrap;
}

.section-num {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 28px;
    color: var(--coral);
    font-weight: 400;
}

.section-title {
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    flex: 1;
    min-width: 300px;
}

.section-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 2px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 24px;
    overflow: hidden;
}

.feature-item {
    background: var(--cream);
    padding: 40px 32px;
    transition: background 0.3s;
}

.feature-item:hover {
    background: var(--cream-dark);
}

.feature-icon {
    font-size: 36px;
    margin-bottom: 20px;
    display: inline-block;
}

.feature-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 12px;
    letter-spacing: -0.01em;
}

.feature-desc {
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.6;
}

/* ========== 상세 내용 섹션 ========== */
.detail {
    padding: 100px 0;
}

.detail-content {
    max-width: 800px;
    margin: 0 auto;
    font-size: 17px;
    line-height: 1.8;
    color: var(--ink-soft);
}

.detail-content h3 {
    font-size: 28px;
    font-weight: 800;
    color: var(--ink);
    margin: 48px 0 20px;
    letter-spacing: -0.02em;
}

.detail-content h3:first-child {
    margin-top: 0;
}

.detail-content p {
    margin-bottom: 20px;
}

.detail-content ul {
    list-style: none;
    padding: 0;
    margin-bottom: 20px;
}

.detail-content ul li {
    padding: 10px 0 10px 32px;
    position: relative;
    border-bottom: 1px solid var(--border);
}

.detail-content ul li:last-child {
    border-bottom: none;
}

.detail-content ul li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--coral);
    font-weight: 800;
    font-size: 18px;
}

/* ========== 관련 제품 ========== */
.related {
    padding: 100px 0;
    background: var(--cream-dark);
    border-top: 1px solid var(--border);
}

.related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
}

.related-card {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 28px;
    transition: all 0.3s;
    display: block;
}

.related-card:hover {
    transform: translateY(-4px);
    border-color: var(--ink);
}

.related-icon {
    font-size: 36px;
    margin-bottom: 16px;
}

.related-name {
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 6px;
}

.related-desc {
    font-size: 13px;
    color: var(--ink-soft);
}

/* ========== CTA 섹션 ========== */
.cta {
    background: var(--ink);
    color: var(--cream);
    padding: 120px 0;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.cta::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: var(--forest);
    border-radius: 50%;
    top: -300px;
    right: -200px;
    opacity: 0.4;
    filter: blur(80px);
}

.cta-content {
    position: relative;
    z-index: 1;
}

.cta-label {
    font-family: 'Fraunces', serif;
    font-style: italic;
    color: var(--coral);
    font-size: 18px;
    margin-bottom: 20px;
}

.cta h2 {
    font-size: clamp(32px, 5vw, 56px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-bottom: 40px;
}

.cta h2 .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--coral);
}

.cta-phone {
    display: inline-flex;
    align-items: center;
    gap: 16px;
    font-size: 28px;
    font-weight: 800;
    padding: 20px 40px;
    background: var(--cream);
    color: var(--ink);
    border-radius: 100px;
    transition: transform 0.2s;
    margin-bottom: 16px;
}

.cta-phone:hover {
    transform: scale(1.03);
}

.cta-note {
    opacity: 0.7;
    font-size: 14px;
}

/* ========== 푸터 ========== */
footer {
    background: var(--ink);
    color: var(--cream);
    padding: 60px 0 40px;
    border-top: 1px solid rgba(247, 244, 237, 0.1);
}

.footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
}

.footer-brand .logo {
    color: var(--cream);
    margin-bottom: 16px;
}

.footer-brand p {
    font-size: 14px;
    opacity: 0.7;
    max-width: 300px;
    line-height: 1.6;
}

.footer-col h4 {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 16px;
    color: var(--coral);
}

.footer-col ul { list-style: none; }
.footer-col li { margin-bottom: 10px; }

.footer-col a {
    font-size: 14px;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.footer-col a:hover { opacity: 1; }

.footer-bottom {
    padding-top: 30px;
    border-top: 1px solid rgba(247, 244, 237, 0.1);
    font-size: 13px;
    opacity: 0.6;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
}

/* ========== 모바일 대응 ========== */
@media (max-width: 900px) {
    .product-grid {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .footer-grid {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 640px) {
    .container { padding: 0 20px; }
    .nav { padding: 16px 20px; }
    .nav-menu, .nav-cta { display: none; }
    .mobile-toggle { display: block; }
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--cream);
        padding: 20px;
        gap: 20px;
        border-bottom: 1px solid var(--border);
    }
    .product-hero { padding: 40px 0 60px; }
    .features, .detail, .related { padding: 60px 0; }
    .cta { padding: 80px 0; }
    .footer-grid { grid-template-columns: 1fr; }
    .cta-phone { font-size: 20px; padding: 16px 28px; }
    .product-visual { font-size: 100px; }
}

/* ============================================================
   📱 모바일 반응형 종합 보강 (일괄 패치)
   ============================================================ */

/* 가로 스크롤 방지 (가장 중요) */
html, body {
    overflow-x: hidden;
    width: 100%;
    -webkit-text-size-adjust: 100%;
}

* { max-width: 100%; }
img, video, iframe { max-width: 100%; height: auto; }
table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }

/* 768px 이하 (태블릿 ↓) */
@media (max-width: 768px) {
    .container { padding: 0 16px !important; }
    
    /* 본문 텍스트 가독성 */
    body { font-size: 15px; line-height: 1.7; }
    h1 { font-size: clamp(22px, 5.5vw, 30px) !important; line-height: 1.25 !important; word-break: keep-all; }
    h2 { font-size: clamp(18px, 4.5vw, 24px) !important; line-height: 1.3 !important; word-break: keep-all; }
    h3 { font-size: clamp(15px, 4vw, 18px) !important; line-height: 1.35 !important; }
    p { word-break: keep-all; line-height: 1.75; }
    
    /* 헤더/네비 */
    .nav { padding: 14px 0 !important; }
    .nav-menu { display: none !important; }
    .mobile-toggle { display: block !important; font-size: 22px; background: none; border: 0; cursor: pointer; padding: 6px 10px; }
    .nav-menu.active { display: flex !important; flex-direction: column; position: absolute; top: 100%; left: 0; right: 0; background: var(--cream); padding: 16px; gap: 14px; border-top: 1px solid var(--border); z-index: 100; }
    .nav-cta { padding: 8px 14px !important; font-size: 13px !important; }
    .logo { font-size: 17px !important; gap: 8px !important; }
    .logo-mark, .logo-mark-img { width: 24px !important; height: 24px !important; font-size: 12px !important; }
    
    /* 그리드들 → 1열 */
    .region-features-grid,
    .region-biz-grid,
    .region-reviews-grid,
    .region-products-grid,
    .footer-grid,
    .features-grid,
    .product-cards-grid,
    .pricing-grid,
    .review-grid,
    .stat-cards { grid-template-columns: 1fr !important; gap: 12px !important; }
    
    /* 시도/시군구 통계 → 2열 (너무 좁아지면 1열) */
    .region-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
    
    /* 지역 리스트(시군구·동) → 2~3열 */
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; font-size: 13px; }
    
    /* 제품 그리드 → 2열 */
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
    
    /* 박스 패딩 축소 */
    .region-box { padding: 20px 18px !important; border-radius: 14px !important; margin-bottom: 14px !important; }
    .region-box-title { font-size: 17px !important; margin-bottom: 12px !important; }
    
    /* 썸네일 (Hero) */
    .region-thumbnail { max-width: 100% !important; max-height: 280px !important; aspect-ratio: 4/3 !important; margin: 0 auto 20px !important; border-radius: 14px !important; }
    .region-thumbnail-overlay { padding: 18px 16px !important; }
    .region-thumbnail-meta { font-size: 11px !important; gap: 6px !important; }
    .region-thumbnail-title { font-size: clamp(20px, 5.5vw, 28px) !important; line-height: 1.2 !important; margin-bottom: 8px !important; }
    .region-thumbnail-services { font-size: 12px !important; line-height: 1.5 !important; }
    .region-hero-sub-standalone { font-size: 14px !important; line-height: 1.7 !important; max-width: 100% !important; padding: 0 4px !important; }
    
    /* 제품 5줄 카드 폰트 축소 */
    .region-product-detail-card { padding: 14px 16px !important; }
    .region-product-detail-card h3 { font-size: 15px !important; }
    .region-product-detail-card li { font-size: 12.5px !important; line-height: 1.65 !important; }
    
    /* FAQ */
    .region-faq-item { padding: 12px 14px !important; }
    .region-faq-item strong { font-size: 13.5px !important; }
    .region-faq-item p { font-size: 12.5px !important; }
    
    /* 주의사항 */
    .region-caution-item { padding: 12px 14px !important; gap: 10px !important; }
    .region-caution-item h3 { font-size: 13.5px !important; }
    .region-caution-item p { font-size: 12.5px !important; }
    
    /* 추천 업종 카드 */
    .region-biz-card { padding: 12px 14px !important; }
    .region-biz-name { font-size: 13.5px !important; }
    .region-biz-effect { font-size: 12px !important; }
    .region-biz-stars { font-size: 11.5px !important; }
    
    /* CTA 박스 */
    .region-cta-box { padding: 24px 18px !important; }
    .region-cta-buttons { flex-direction: column !important; gap: 10px !important; }
    .region-cta-buttons .btn { width: 100% !important; text-align: center; padding: 12px !important; font-size: 14px !important; }
    
    /* 버튼 */
    .btn { font-size: 14px !important; padding: 10px 18px !important; }
    .btn-primary, .btn-ghost { width: auto; }
    
    /* breadcrumb */
    .breadcrumb { font-size: 11.5px !important; flex-wrap: wrap; gap: 4px; }
    
    /* 푸터 */
    footer { padding: 32px 0 24px !important; }
    .footer-grid { gap: 24px !important; }
    .footer-brand .logo { font-size: 18px !important; }
}

/* 480px 이하 (작은 모바일) */
@media (max-width: 480px) {
    .container { padding: 0 14px !important; }
    h1 { font-size: clamp(20px, 6vw, 26px) !important; }
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; font-size: 12.5px; }
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 6px !important; }
    .region-thumbnail { max-height: 240px !important; }
    .region-thumbnail-overlay { padding: 14px 12px !important; }
    .region-thumbnail-services { font-size: 11px !important; }
    .region-hero-sub-standalone { font-size: 13px !important; }
}

/* 360px 이하 (소형 모바일) */
@media (max-width: 360px) {
    .container { padding: 0 12px !important; }
    .region-stats-grid { grid-template-columns: 1fr !important; }
    .region-list-grid { grid-template-columns: 1fr !important; }
    .region-thumbnail-title { font-size: 19px !important; }
}


/* ============================================================
   📱 짤림 방지 추가 패치 (이미지·텍스트 모두)
   ============================================================ */

/* === 모든 화면 크기에서 짤림 방지 === */
* {
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
}

/* 모든 이미지가 부모 박스 안에 들어오도록 강제 */
img, picture, video, svg, canvas, iframe, embed, object {
    max-width: 100% !important;
    height: auto !important;
    display: block;
}

/* 모든 텍스트 박스가 부모 안에 들어오도록 */
p, h1, h2, h3, h4, h5, h6, span, div, li, a, strong, em, td, th {
    word-wrap: break-word;
    overflow-wrap: break-word;
    min-width: 0;
}

/* 한글 단어가 중간에 안 끊기도록 */
p, h1, h2, h3, h4, li {
    word-break: keep-all;
}

/* 영어·URL·이메일·전화번호 같은 긴 문자열 강제 줄바꿈 */
.long-text, code, pre, .url, a[href^="mailto"], a[href^="tel"], .breadcrumb {
    word-break: break-all;
    overflow-wrap: anywhere;
}

/* 그리드 자식이 부모를 넘는 것 방지 */
[class*="grid"], [class*="flex"] {
    min-width: 0;
}
[class*="grid"] > *, [class*="flex"] > * {
    min-width: 0;
    max-width: 100%;
}

/* 768px 이하에서 추가 짤림 방지 */
@media (max-width: 768px) {
    /* body 내부에서 가로로 넘는 요소 강제 정리 */
    body, html { max-width: 100vw !important; overflow-x: hidden !important; }
    
    /* 컨테이너·박스가 절대 가로폭 안 넘게 */
    .container, .region-box, .region-cta-box, header, footer, section {
        max-width: 100% !important;
        box-sizing: border-box !important;
    }
    
    /* 썸네일 안 텍스트도 wrap */
    .region-thumbnail-title, .region-thumbnail-services, .region-thumbnail-meta {
        max-width: 100% !important;
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        white-space: normal !important;
    }
    
    /* 통계 카드 숫자 폰트 축소 */
    .region-stats-grid .region-stat-num,
    .region-stats-grid .region-stat-value,
    [class*="stat-num"], [class*="stat-value"] {
        font-size: clamp(18px, 5vw, 24px) !important;
        word-break: break-all !important;
    }
    
    /* 표 가로 스크롤 처리 */
    table {
        display: block !important;
        overflow-x: auto !important;
        white-space: nowrap;
    }
    
    /* 긴 동 이름(예: "한국토지주택공사동") 줄바꿈 */
    .region-list-grid a, .region-products-simple a {
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        line-height: 1.4 !important;
        padding: 8px 6px !important;
        font-size: 12.5px !important;
        text-align: center;
    }
    
    /* 전화번호·CTA 버튼 텍스트가 안 잘리도록 */
    .btn, .nav-cta, button, a[href^="tel"] {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}


/* === 온라인 문의 폼 (모든 페이지 공통) === */
.contact-section {
    padding: 100px 0;
    background: var(--cream-dark);
}
.contact-section .container {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 60px;
    align-items: start;
    max-width: 1140px;
}
.contact-intro {
    position: sticky;
    top: 100px;
}
.contact-intro .cta-label {
    text-align: left;
    font-size: 13px;
    font-weight: 700;
    color: var(--coral);
    letter-spacing: 3px;
    margin-bottom: 16px;
}
.contact-title {
    font-size: clamp(32px, 4vw, 48px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0 0 16px;
}
.contact-sub {
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.7;
    margin: 0 0 32px;
}
.contact-direct {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.contact-direct-btn {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 22px;
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 14px;
    transition: all 0.2s;
    text-decoration: none;
    color: inherit;
}
.contact-direct-btn:hover {
    border-color: var(--forest);
    transform: translateX(4px);
}
.contact-direct-btn .cd-icon {
    width: 44px;
    height: 44px;
    background: var(--cream-dark);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
}
.cd-label {
    display: block;
    font-size: 12px;
    color: var(--ink-soft);
    margin-bottom: 2px;
}
.cd-value {
    display: block;
    font-size: 16px;
    font-weight: 700;
    color: var(--ink);
}

/* 문의 폼 박스 */
.contact-form-box {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 40px 36px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}
.contact-form-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 22px;
    font-weight: 800;
    margin: 0 0 28px;
    letter-spacing: -0.01em;
}
.cf-bar {
    width: 4px;
    height: 22px;
    background: var(--coral);
    border-radius: 2px;
}
.contact-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.form-group {
    display: flex;
    flex-direction: column;
}
.form-group label {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 8px;
}
.required {
    color: var(--coral);
}
.form-group input,
.form-group select,
.form-group textarea {
    padding: 14px 16px;
    font-size: 14px;
    font-family: inherit;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: #fafafa;
    color: var(--ink);
    transition: all 0.2s;
    width: 100%;
    box-sizing: border-box;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--forest);
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(45, 74, 62, 0.1);
}
.form-group input::placeholder,
.form-group textarea::placeholder {
    color: #b0b0b0;
}
.form-group textarea {
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
}
.form-group select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23666' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    background-size: 10px;
    padding-right: 40px;
}
.form-agree {
    padding: 16px;
    background: #fafafa;
    border-radius: 10px;
    border: 1px solid var(--border);
}
.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
}
.checkbox-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--forest);
    cursor: pointer;
}
.agree-detail {
    font-size: 11px;
    color: var(--ink-soft);
    margin-top: 8px;
    padding-left: 26px;
    line-height: 1.6;
}
.contact-submit {
    background: var(--ink);
    color: #ffffff;
    border: none;
    padding: 18px 28px;
    font-size: 16px;
    font-weight: 700;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    margin-top: 8px;
}
.contact-submit:hover {
    background: var(--forest);
    transform: translateY(-2px);
}
.contact-submit:disabled {
    background: #999;
    cursor: not-allowed;
    transform: none;
}
.form-message {
    padding: 20px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    display: none;
    margin-top: 16px;
}
.form-message.success {
    display: block;
    background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
    color: #1b5e20;
    border: 2px solid #66bb6a;
    box-shadow: 0 4px 16px rgba(76, 175, 80, 0.2);
    animation: messagePop 0.4s ease;
}
.form-message.error {
    display: block;
    background: linear-gradient(135deg, #ffebee, #ffcdd2);
    color: #b71c1c;
    border: 2px solid #ef5350;
    box-shadow: 0 4px 16px rgba(244, 67, 54, 0.2);
    animation: messagePop 0.4s ease;
}
@keyframes messagePop {
    0% { transform: scale(0.9); opacity: 0; }
    60% { transform: scale(1.02); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}

/* 모바일 */
@media (max-width: 900px) {
    .contact-section .container {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .contact-intro {
        position: static;
        text-align: center;
    }
    .contact-intro .cta-label { text-align: center; }
    .contact-direct-btn { flex-direction: row; text-align: left; }
    .contact-form-box { padding: 28px 24px; }
}

</style>
</head>
<body>

    <!-- 헤더 -->
    <header>
        <nav class="nav">
            <a href="/" class="logo">
                <img src="/brand.png" alt="마스터페이" class="logo-mark-img">
                마스터페이
            </a>
            
            <ul class="nav-menu" id="navMenu">
                <li><a href="/#find-sec">지역별 설치</a></li>
                <li><a href="/#allinone">제품 안내</a></li>
                <li><a href="/#process">프로세스</a></li>
                <li><a href="/#faq">자주 묻는 질문</a></li>
            </ul>
            
            <a href="/#contact" class="nav-cta">문의하기</a>
            <button class="mobile-toggle" onclick="toggleMenu()">☰</button>
        </nav>
    </header>

    <!-- 제품 히어로 -->
    <section class="product-hero">
        <div class="container">
            <div class="breadcrumb">
                <a href="/">홈</a>
                <span class="breadcrumb-separator">/</span>
                <a href="/#products">제품</a>
                <span class="breadcrumb-separator">/</span>
                <span>미니 키오스크</span>
            </div>
            
            <div class="product-grid">
                <div class="product-info">
                    <span class="product-badge">Mini Kiosk</span>
                    <h1 class="product-title">
                        미니 키오스크
                    </h1>
                    <p class="product-lead">작은 매장에도 부담 없이 도입하는 컴팩트 무인 주문 시스템. 공간 절약과 비용 절감, 두 마리 토끼를 모두 잡는 합리적인 선택입니다.</p>
                    
                    <div class="product-specs">
                    <div class="spec-item">
                        <div class="spec-label">Size</div>
                        <div class="spec-value">테이블형·벽걸이형</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Feature</div>
                        <div class="spec-value">주문·결제 특화</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Space</div>
                        <div class="spec-value">공간 절약형</div>
                    </div>
                    </div>
                    
                    <div class="product-cta">
                        <a href="/#contact" class="btn btn-primary">
                            무료 상담 신청 →
                        </a>
                        <a href="tel:010-2337-0458" class="btn btn-ghost">
                            📞 전화 상담
                        </a>
                    </div>
                </div>
                
                <div class="product-visual">
                    <img src="https://raw.githubusercontent.com/YOONSOEUN1/mastarpay/main/images/Kiosk2.png" alt="미니 키오스크" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
            </div>
        </div>
    </section>

    <!-- 특징 섹션 -->
    <section class="features">
        <div class="container">
            <div class="section-header">
                <span class="section-num">01 / Features</span>
                <h2 class="section-title">
                    이런 특징이 있어요.
                </h2>
            </div>
            
            <div class="feature-grid">
                <div class="feature-item">
                    <div class="feature-icon">🏆</div>
                    <h3 class="feature-title">검증된 품질</h3>
                    <p class="feature-desc">업계에서 인정받은 최고의 모델만을 엄선하여 제공합니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">⚡</div>
                    <h3 class="feature-title">빠른 설치</h3>
                    <p class="feature-desc">상담 후 빠른 일정으로 설치가 완료됩니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">💰</div>
                    <h3 class="feature-title">합리적 비용</h3>
                    <p class="feature-desc">설치비 무료 옵션과 렌탈 프로그램으로 부담이 적습니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🔧</div>
                    <h3 class="feature-title">A/S 보장</h3>
                    <p class="feature-desc">장애 시 원격 지원과 현장 출동으로 빠르게 해결합니다.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 상세 내용 -->
    <section class="detail">
        <div class="container">
            <div class="section-header">
                <span class="section-num">02 / Details</span>
                <h2 class="section-title">
                    자세히 알아보기.
                </h2>
            </div>
            
            <div class="detail-content">
                
                <h3>미니 키오스크가 주목받는 이유</h3>
                <p>모든 매장이 대형 키오스크를 놓을 공간이 있는 것은 아닙니다. 작은 카페, 디저트 가게, 소형 식당 등 공간이 제한적인 매장에서는 대형 키오스크가 부담스러울 수 있습니다. 미니 키오스크는 이런 매장을 위해 설계된 컴팩트한 무인 주문 시스템으로, 공간 효율성과 무인화의 장점을 모두 제공합니다.</p>
                <p>마스터페이의 미니 키오스크는 테이블형, 벽걸이형 등 다양한 설치 방식을 지원하여 매장 공간에 딱 맞게 설치할 수 있습니다. 작지만 대형 키오스크와 동일한 주문·결제 기능을 모두 지원하며, 비용은 절반 이하로 훨씬 저렴합니다.</p>
                
                <h3>미니 키오스크 설치 프로세스</h3>
                <ul>
                    <li>1단계 무료 상담 — 매장 크기와 설치 희망 위치를 알려주세요</li>
                    <li>2단계 설치 방식 선택 — 테이블형·벽걸이형·스탠드형 중 매장에 맞는 방식을 선택합니다</li>
                    <li>3단계 UI 설계 — 작은 화면에 최적화된 직관적인 주문 흐름을 설계합니다</li>
                    <li>4단계 메뉴 등록 — 메뉴 사진과 옵션을 등록합니다</li>
                    <li>5단계 간편 설치 — 큰 공사 없이 간단히 설치 완료됩니다</li>
                    <li>6단계 운영 지원 — 초기 운영 시 발생할 수 있는 문제를 즉시 해결합니다</li>
                </ul>
                
                <h3>미니 키오스크 주요 기능</h3>
                <ul>
                    <li>작은 공간에도 OK — 대형 키오스크가 부담스러운 좁은 매장에도 부담 없이 설치 가능합니다</li>
                    <li>저렴한 비용 — 대형 키오스크보다 훨씬 저렴한 가격으로 무인화의 장점을 누립니다</li>
                    <li>간편한 설치 — 테이블 위에 올려놓거나 벽에 걸어서 간단히 설치됩니다</li>
                    <li>세련된 디자인 — 매장 분위기를 해치지 않고 오히려 모던한 느낌을 더합니다</li>
                    <li>대형과 동일한 기능 — 주문·결제·메뉴 관리 모든 기능을 지원합니다</li>
                    <li>낮은 전력 소비 — 대형 키오스크보다 전기료가 적게 듭니다</li>
                </ul>
                
                <h3>이런 매장에 추천합니다</h3>
                <p>좁은 공간의 소형 카페·디저트 가게, 셀프 서비스가 가능한 작은 식당, 무인 매장·스터디카페, 보조 주문 기기가 필요한 매장, 저렴한 비용으로 무인화를 시작하고 싶은 곳에 추천합니다. 1인 카페, 샌드위치 전문점, 도시락 가게, 무인 아이스크림 가게 등에서 특히 효과적입니다.</p>
                
                <h3>대형 키오스크와의 차이점</h3>
                <p>기능 면에서는 거의 동일합니다. 메뉴 주문, 결제, 매출 관리 등 핵심 기능은 모두 지원합니다. 주요 차이는 화면 크기와 설치 방식입니다. 대형은 스탠드형으로 공간을 차지하지만 시인성이 좋고, 미니는 테이블이나 벽에 간단히 설치하며 공간을 절약합니다. 피크 타임 주문량이 많으면 대형을, 공간이 제한적이면 미니를 선택하시면 됩니다.</p>
                
                <h3>미니 키오스크 활용 사례</h3>
                <p>실제 도입 매장 사례를 보면, 서울 강남의 한 1인 카페는 미니 키오스크 도입 후 주문 대기가 완전히 사라지고, 매출이 20% 증가했습니다. 부산의 한 도시락 가게는 점심시간에 혼자서도 30명 이상의 주문을 처리할 수 있게 되어, 추가 직원 채용 없이 매출이 크게 늘었습니다. 이처럼 작은 매장일수록 미니 키오스크의 효과는 더 크게 나타납니다.</p>
                
                <h3>자주 묻는 질문</h3>
                <p><strong>Q. 대형 키오스크와 성능 차이가 있나요?</strong><br>기본 성능은 거의 동일합니다. 주문·결제·매출 관리 등 핵심 기능은 대형과 똑같이 지원합니다.</p>
                <p><strong>Q. 설치는 어떻게 하나요?</strong><br>테이블형은 별도 공사 없이 바로 설치 가능합니다. 벽걸이형은 벽에 간단히 고정하는 작업이 필요합니다.</p>
                <p><strong>Q. 비용은 어느 정도인가요?</strong><br>대형 키오스크의 절반 이하 비용으로 도입 가능합니다. 렌탈 옵션도 있어 초기 비용 부담을 줄일 수 있습니다.</p>
                <p><strong>Q. 유지 보수는 어떻게 하나요?</strong><br>장애 시 원격 지원으로 즉시 해결합니다. 하드웨어 문제는 엔지니어가 직접 방문하여 수리합니다.</p>
    
            </div>
        </div>
    </section>

    <!-- 관련 제품 -->
    <section class="related">
        <div class="container">
            <div class="section-header">
                <span class="section-num">03 / Related</span>
                <h2 class="section-title">
                    다른 제품도 둘러보세요.
                </h2>
            </div>
            
            <div class="related-grid">
                <a href="/product/kiosk" class="related-card">
                    <div class="related-icon">🤖</div>
                    <div class="related-name">키오스크</div>
                    <div class="related-desc">대형 무인 주문</div>
                </a>
                <a href="/product/tableorder" class="related-card">
                    <div class="related-icon">📋</div>
                    <div class="related-name">테이블 오더</div>
                    <div class="related-desc">QR 주문 시스템</div>
                </a>
                <a href="/product/pos" class="related-card">
                    <div class="related-icon">🖥️</div>
                    <div class="related-name">포스기</div>
                    <div class="related-desc">매장 통합 관리</div>
                </a>
            </div>
        </div>
    </section>

    <!-- CTA -->
    <section class="contact-section" id="contact">
        <div class="container">
            <div class="contact-intro">
                <div class="cta-label">— Contact Us —</div>
                <h2 class="contact-title">무료 상담 신청</h2>
                <p class="contact-sub">전화, 카카오톡 또는 아래 폼으로 문의해주세요.<br>담당자가 빠르게 연락드립니다.</p>
                <div class="contact-direct">
                    <a href="tel:010-2337-0458" class="contact-direct-btn">
                        <span class="cd-icon">📞</span>
                        <span><span class="cd-label">전화 상담</span><span class="cd-value">010-2337-0458</span></span>
                    </a>
                    <a href="javascript:void(0)" onclick="openKakao(); return false;" class="contact-direct-btn">
                        <span class="cd-icon">💬</span>
                        <span><span class="cd-label">카카오톡</span><span class="cd-value">바로 상담</span></span>
                    </a>
                </div>
            </div>
            <div class="contact-form-box">
                <h3 class="contact-form-title"><span class="cf-bar"></span><span>📝 온라인 문의</span></h3>
                <form id="contactForm" class="contact-form" onsubmit="return submitContactForm(event)">
                    <div class="form-group"><label for="name">상호(이름) <span class="required">*</span></label><input type="text" id="name" name="상호_이름" placeholder="상호 또는 이름을 입력하세요" required></div>
                    <div class="form-group"><label for="phone">연락처 <span class="required">*</span></label><input type="tel" id="phone" name="연락처" placeholder="010-0000-0000" required></div>
                    <div class="form-group"><label for="address">주소 <span class="required">*</span></label><input type="text" id="address" name="주소" placeholder="매장 주소" required><input type="text" id="address_detail" name="상세주소" placeholder="상세주소 (건물명, 층, 호수 등)" style="margin-top: 8px;"></div>
                    <div class="form-group"><label for="product">문의 제품 <span class="required">*</span></label><select id="product" name="문의_제품" required><option value="">선택해주세요</option><option value="포스기">포스기(POS)</option><option value="2인치 단말기">2인치 단말기</option><option value="3인치 단말기">3인치 단말기</option><option value="토스 단말기">토스 단말기</option><option value="무선 단말기">무선 단말기</option><option value="블루투스 단말기">블루투스 단말기</option><option value="키오스크">키오스크</option><option value="미니 키오스크">미니 키오스크</option><option value="테이블 오더">테이블 오더</option><option value="매장 철거">매장 철거</option><option value="여러 제품 패키지">여러 제품 패키지</option><option value="기타/미정">기타/미정</option></select></div>
                    <div class="form-group"><label for="business">업종</label><select id="business" name="업종"><option value="">선택해주세요</option><option value="음식점/식당">음식점/식당</option><option value="카페/베이커리">카페/베이커리</option><option value="편의점/마트">편의점/마트</option><option value="미용실/네일샵">미용실/네일샵</option><option value="스터디카페">스터디카페</option><option value="주점/호프">주점/호프</option><option value="무인매장">무인매장</option><option value="의류/잡화">의류/잡화</option><option value="병원/약국">병원/약국</option><option value="기타">기타</option></select></div>
                    <div class="form-group"><label for="message">문의 내용</label><textarea id="message" name="문의_내용" rows="5" placeholder="매장 위치, 현재 사용 장비, 궁금한 점 등을 자유롭게 적어주세요."></textarea></div>
                    <div class="form-agree"><label class="checkbox-label"><input type="checkbox" id="agree" required><span>개인정보 수집 및 이용에 동의합니다 <span class="required">*</span></span></label><div class="agree-detail">수집항목: 상호·연락처·주소·문의 내용 / 이용목적: 상담 및 견적 안내 / 보유기간: 3년</div></div>
                    <button type="submit" class="contact-submit" id="submitBtn"><span id="submitText">무료 상담 신청하기 →</span></button>
                    <div id="formMessage" class="form-message"></div>
                </form>
            </div>
        </div>
    </section>

    <!-- 푸터 -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="logo">
                        <img src="/brand.png" alt="마스터페이" class="logo-mark-img">
                        마스터페이
                    </div>
                    <p>매장 운영에 필요한 모든 장비<br>설치부터 A/S까지 한번에.</p>
                </div>
                
                <div class="footer-col">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="tel:010-2337-0458">📞 010-2337-0458</a></li>
                        <li><a href="https://pf.kakao.com/_fPrxbG/chat" target="_blank">💬 카카오톡 상담</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <span>© 2026 마스터페이. All rights reserved.</span>
                <span>개인정보처리방침 · 이용약관</span>
            </div>
        </div>
    </footer>

    <script>
        function toggleMenu() {
            document.getElementById('navMenu').classList.toggle('active');
        }
        function openKakao(){
          var url='https://pf.kakao.com/_fPrxbG/chat';
          var w=window.open(url,'_blank');
          if(!w||w.closed||typeof w.closed==='undefined'){window.location.href=url;}
        }
        function scrollToContact(event){
          if(event)event.preventDefault();
          var c=document.getElementById('contact');
          if(c){
            var top=c.getBoundingClientRect().top+window.pageYOffset-80;
            window.scrollTo({top:top,behavior:'smooth'});
          }else{window.location.href='/#contact';}
        }
        async function submitContactForm(event){
          if(event){event.preventDefault();event.stopPropagation();}
          var form=document.getElementById('contactForm');
          var submitBtn=document.getElementById('submitBtn');
          var submitText=document.getElementById('submitText');
          var formMessage=document.getElementById('formMessage');
          if(!form){alert('⚠️ 폼을 찾을 수 없습니다.');return false;}
          var agreeCheckbox=document.getElementById('agree');
          if(!agreeCheckbox||!agreeCheckbox.checked){alert('개인정보 수집 및 이용에 동의해주세요.');return false;}
          var name=document.getElementById('name').value.trim();
          var phone=document.getElementById('phone').value.trim();
          var address=document.getElementById('address').value.trim();
          var product=document.getElementById('product').value;
          if(!name){alert('상호(이름)을 입력해주세요.');document.getElementById('name').focus();return false;}
          if(!phone){alert('연락처를 입력해주세요.');document.getElementById('phone').focus();return false;}
          if(!address){alert('주소를 입력해주세요.');document.getElementById('address').focus();return false;}
          if(!product){alert('문의 제품을 선택해주세요.');document.getElementById('product').focus();return false;}
          if(submitBtn)submitBtn.disabled=true;
          if(submitText)submitText.textContent='전송 중...';
          if(formMessage){formMessage.className='form-message';formMessage.style.display='none';}
          var data={name:name,phone:phone,address:address,addressDetail:document.getElementById('address_detail').value.trim(),product:product,business:document.getElementById('business').value,message:document.getElementById('message').value.trim()};
          var result;
          try{
            var response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
            result=await response.json();
            if(result.success){
              if(formMessage){formMessage.className='form-message success';formMessage.style.display='block';formMessage.innerHTML='<div style="text-align:center;padding:24px 20px;"><div style="font-size:48px;margin-bottom:12px;">✅</div><div style="font-size:18px;font-weight:800;color:#2e7d32;margin-bottom:8px;">문의가 성공적으로 접수되었습니다!</div><div style="font-size:14px;color:#555;">24시간 이내에 연락드리겠습니다.<br>급하신 경우 <strong>010-2337-0458</strong>로 연락주세요.</div></div>';}
              form.reset();
              setTimeout(function(){if(formMessage)formMessage.scrollIntoView({behavior:'smooth',block:'center'});},100);
            }else{throw new Error(result.error||'전송에 실패했습니다.');}
          }catch(error){
            var errorMsg=error.message||'전송에 실패했습니다';
            if(formMessage){formMessage.className='form-message error';formMessage.style.display='block';formMessage.innerHTML='<div style="text-align:center;padding:20px;"><div style="font-size:40px;margin-bottom:10px;">❌</div><div style="font-size:16px;font-weight:700;margin-bottom:8px;">전송에 실패했습니다</div><div style="font-size:13px;margin-bottom:12px;color:#555;">'+errorMsg+'</div><div style="font-size:14px;margin-top:12px;"><strong>📞 010-2337-0458</strong><br>또는 카카오톡으로 문의해주세요.</div></div>';formMessage.scrollIntoView({behavior:'smooth',block:'center'});}
          }finally{
            if(submitBtn)submitBtn.disabled=false;
            if(submitText)submitText.textContent='무료 상담 신청하기 →';
          }
          return false;
        }
    </script>

</body>
</html>`;

const PAGE_TABLEORDER = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
<link rel="icon" type="image/png" href="/brand.png">
<link rel="apple-touch-icon" href="/brand.png">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="naver-site-verification" content="53af8497b3a522a8a85a7b13bae57efd7e27fb5c" />
    <title>테이블 오더 | 마스터페이</title>
    <meta name="description" content="QR코드 스캔 한 번으로 주문부터 결제까지. 홀 인건비를 줄이고 객단가를 높이는 스마트 주문 시스템을 경험해보세요.">
    <meta property="og:title" content="테이블 오더 | 마스터페이">
    <meta property="og:description" content="QR코드 스캔 한 번으로 주문부터 결제까지. 홀 인건비를 줄이고 객단가를 높이는 스마트 주문 시스템을 경험해보세요.">
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&display=swap" rel="stylesheet">
    <style>/* ========== 공용 스타일 (모든 페이지에서 사용) ========== */

:root {
    --cream: #f7f4ed;
    --cream-dark: #ede8db;
    --ink: #1a1a1a;
    --ink-soft: #4a4a4a;
    --forest: #2d4a3e;
    --forest-dark: #1f352c;
    --coral: #e8763a;
    --border: #d9d3c4;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 80px; }

body {
    font-family: 'Pretendard Variable', Pretendard, -apple-system, sans-serif;
    background: #ffffff;
    color: var(--ink);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
}

a { text-decoration: none; color: inherit; }
img { max-width: 100%; display: block; }

.container {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 32px;
}

/* ========== 헤더 ========== */
header {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    background: var(--cream);
    z-index: 9999 !important;
    border-bottom: 1px solid var(--border);
}
body {
    padding-top: 72px;
}
@media (max-width: 768px) {
    body { padding-top: 60px; }
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 32px;
    max-width: 1240px;
    margin: 0 auto;
}

.logo {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 8px;
}

.logo-mark {
    width: 28px;
    height: 28px;
    background: var(--forest);
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--cream);
    font-size: 14px;
}
.logo-mark-img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    display: inline-block;
    vertical-align: middle;
}

.nav-menu {
    display: flex;
    gap: 40px;
    list-style: none;
}

.nav-menu a {
    font-size: 15px;
    font-weight: 500;
    color: var(--ink-soft);
    transition: color 0.2s;
}

.nav-menu a:hover { color: var(--ink); }

.nav-cta {
    background: var(--ink);
    color: var(--cream);
    padding: 10px 20px;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 600;
    transition: transform 0.2s;
}

.nav-cta:hover { transform: scale(1.03); }

.mobile-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

/* ========== 제품 페이지 전용 ========== */
.product-hero {
    padding: 60px 0 80px;
    position: relative;
    overflow: hidden;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--ink-soft);
    margin-bottom: 32px;
}

.breadcrumb a {
    color: var(--ink-soft);
    transition: color 0.2s;
}

.breadcrumb a:hover { color: var(--ink); }

.breadcrumb-separator {
    opacity: 0.4;
}

.product-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
}

.product-badge {
    display: inline-block;
    padding: 6px 14px;
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
    color: var(--coral);
    margin-bottom: 20px;
}

.product-title {
    font-size: clamp(36px, 5vw, 60px);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
}

.product-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}

.product-lead {
    font-size: 18px;
    color: var(--ink-soft);
    line-height: 1.6;
    margin-bottom: 32px;
}

.product-specs {
    display: flex;
    gap: 32px;
    padding: 24px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    margin-bottom: 32px;
    flex-wrap: wrap;
}

.spec-item .spec-label {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 13px;
    color: var(--coral);
    margin-bottom: 4px;
}

.spec-item .spec-value {
    font-size: 18px;
    font-weight: 700;
}

.product-cta {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.btn {
    padding: 16px 32px;
    border-radius: 100px;
    font-weight: 600;
    font-size: 15px;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid transparent;
}

.btn-primary {
    background: var(--ink);
    color: var(--cream);
}

.btn-primary:hover {
    background: var(--forest);
}

.btn-ghost {
    background: transparent;
    color: var(--ink);
    border-color: var(--border);
}

.btn-ghost:hover {
    background: var(--cream-dark);
}

/* 제품 이미지 영역 */
.product-visual {
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 32px;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 180px;
    position: relative;
    overflow: hidden;
}

.product-visual img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* ========== 특징 섹션 ========== */
.features {
    padding: 100px 0;
    background: var(--cream-dark);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
}

.section-header {
    display: flex;
    align-items: baseline;
    gap: 24px;
    margin-bottom: 64px;
    flex-wrap: wrap;
}

.section-num {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 28px;
    color: var(--coral);
    font-weight: 400;
}

.section-title {
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    flex: 1;
    min-width: 300px;
}

.section-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 2px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 24px;
    overflow: hidden;
}

.feature-item {
    background: var(--cream);
    padding: 40px 32px;
    transition: background 0.3s;
}

.feature-item:hover {
    background: var(--cream-dark);
}

.feature-icon {
    font-size: 36px;
    margin-bottom: 20px;
    display: inline-block;
}

.feature-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 12px;
    letter-spacing: -0.01em;
}

.feature-desc {
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.6;
}

/* ========== 상세 내용 섹션 ========== */
.detail {
    padding: 100px 0;
}

.detail-content {
    max-width: 800px;
    margin: 0 auto;
    font-size: 17px;
    line-height: 1.8;
    color: var(--ink-soft);
}

.detail-content h3 {
    font-size: 28px;
    font-weight: 800;
    color: var(--ink);
    margin: 48px 0 20px;
    letter-spacing: -0.02em;
}

.detail-content h3:first-child {
    margin-top: 0;
}

.detail-content p {
    margin-bottom: 20px;
}

.detail-content ul {
    list-style: none;
    padding: 0;
    margin-bottom: 20px;
}

.detail-content ul li {
    padding: 10px 0 10px 32px;
    position: relative;
    border-bottom: 1px solid var(--border);
}

.detail-content ul li:last-child {
    border-bottom: none;
}

.detail-content ul li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--coral);
    font-weight: 800;
    font-size: 18px;
}

/* ========== 관련 제품 ========== */
.related {
    padding: 100px 0;
    background: var(--cream-dark);
    border-top: 1px solid var(--border);
}

.related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
}

.related-card {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 28px;
    transition: all 0.3s;
    display: block;
}

.related-card:hover {
    transform: translateY(-4px);
    border-color: var(--ink);
}

.related-icon {
    font-size: 36px;
    margin-bottom: 16px;
}

.related-name {
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 6px;
}

.related-desc {
    font-size: 13px;
    color: var(--ink-soft);
}

/* ========== CTA 섹션 ========== */
.cta {
    background: var(--ink);
    color: var(--cream);
    padding: 120px 0;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.cta::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: var(--forest);
    border-radius: 50%;
    top: -300px;
    right: -200px;
    opacity: 0.4;
    filter: blur(80px);
}

.cta-content {
    position: relative;
    z-index: 1;
}

.cta-label {
    font-family: 'Fraunces', serif;
    font-style: italic;
    color: var(--coral);
    font-size: 18px;
    margin-bottom: 20px;
}

.cta h2 {
    font-size: clamp(32px, 5vw, 56px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-bottom: 40px;
}

.cta h2 .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--coral);
}

.cta-phone {
    display: inline-flex;
    align-items: center;
    gap: 16px;
    font-size: 28px;
    font-weight: 800;
    padding: 20px 40px;
    background: var(--cream);
    color: var(--ink);
    border-radius: 100px;
    transition: transform 0.2s;
    margin-bottom: 16px;
}

.cta-phone:hover {
    transform: scale(1.03);
}

.cta-note {
    opacity: 0.7;
    font-size: 14px;
}

/* ========== 푸터 ========== */
footer {
    background: var(--ink);
    color: var(--cream);
    padding: 60px 0 40px;
    border-top: 1px solid rgba(247, 244, 237, 0.1);
}

.footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
}

.footer-brand .logo {
    color: var(--cream);
    margin-bottom: 16px;
}

.footer-brand p {
    font-size: 14px;
    opacity: 0.7;
    max-width: 300px;
    line-height: 1.6;
}

.footer-col h4 {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 16px;
    color: var(--coral);
}

.footer-col ul { list-style: none; }
.footer-col li { margin-bottom: 10px; }

.footer-col a {
    font-size: 14px;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.footer-col a:hover { opacity: 1; }

.footer-bottom {
    padding-top: 30px;
    border-top: 1px solid rgba(247, 244, 237, 0.1);
    font-size: 13px;
    opacity: 0.6;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
}

/* ========== 모바일 대응 ========== */
@media (max-width: 900px) {
    .product-grid {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .footer-grid {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 640px) {
    .container { padding: 0 20px; }
    .nav { padding: 16px 20px; }
    .nav-menu, .nav-cta { display: none; }
    .mobile-toggle { display: block; }
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--cream);
        padding: 20px;
        gap: 20px;
        border-bottom: 1px solid var(--border);
    }
    .product-hero { padding: 40px 0 60px; }
    .features, .detail, .related { padding: 60px 0; }
    .cta { padding: 80px 0; }
    .footer-grid { grid-template-columns: 1fr; }
    .cta-phone { font-size: 20px; padding: 16px 28px; }
    .product-visual { font-size: 100px; }
}

/* ============================================================
   📱 모바일 반응형 종합 보강 (일괄 패치)
   ============================================================ */

/* 가로 스크롤 방지 (가장 중요) */
html, body {
    overflow-x: hidden;
    width: 100%;
    -webkit-text-size-adjust: 100%;
}

* { max-width: 100%; }
img, video, iframe { max-width: 100%; height: auto; }
table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }

/* 768px 이하 (태블릿 ↓) */
@media (max-width: 768px) {
    .container { padding: 0 16px !important; }
    
    /* 본문 텍스트 가독성 */
    body { font-size: 15px; line-height: 1.7; }
    h1 { font-size: clamp(22px, 5.5vw, 30px) !important; line-height: 1.25 !important; word-break: keep-all; }
    h2 { font-size: clamp(18px, 4.5vw, 24px) !important; line-height: 1.3 !important; word-break: keep-all; }
    h3 { font-size: clamp(15px, 4vw, 18px) !important; line-height: 1.35 !important; }
    p { word-break: keep-all; line-height: 1.75; }
    
    /* 헤더/네비 */
    .nav { padding: 14px 0 !important; }
    .nav-menu { display: none !important; }
    .mobile-toggle { display: block !important; font-size: 22px; background: none; border: 0; cursor: pointer; padding: 6px 10px; }
    .nav-menu.active { display: flex !important; flex-direction: column; position: absolute; top: 100%; left: 0; right: 0; background: var(--cream); padding: 16px; gap: 14px; border-top: 1px solid var(--border); z-index: 100; }
    .nav-cta { padding: 8px 14px !important; font-size: 13px !important; }
    .logo { font-size: 17px !important; gap: 8px !important; }
    .logo-mark, .logo-mark-img { width: 24px !important; height: 24px !important; font-size: 12px !important; }
    
    /* 그리드들 → 1열 */
    .region-features-grid,
    .region-biz-grid,
    .region-reviews-grid,
    .region-products-grid,
    .footer-grid,
    .features-grid,
    .product-cards-grid,
    .pricing-grid,
    .review-grid,
    .stat-cards { grid-template-columns: 1fr !important; gap: 12px !important; }
    
    /* 시도/시군구 통계 → 2열 (너무 좁아지면 1열) */
    .region-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
    
    /* 지역 리스트(시군구·동) → 2~3열 */
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; font-size: 13px; }
    
    /* 제품 그리드 → 2열 */
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
    
    /* 박스 패딩 축소 */
    .region-box { padding: 20px 18px !important; border-radius: 14px !important; margin-bottom: 14px !important; }
    .region-box-title { font-size: 17px !important; margin-bottom: 12px !important; }
    
    /* 썸네일 (Hero) */
    .region-thumbnail { max-width: 100% !important; max-height: 280px !important; aspect-ratio: 4/3 !important; margin: 0 auto 20px !important; border-radius: 14px !important; }
    .region-thumbnail-overlay { padding: 18px 16px !important; }
    .region-thumbnail-meta { font-size: 11px !important; gap: 6px !important; }
    .region-thumbnail-title { font-size: clamp(20px, 5.5vw, 28px) !important; line-height: 1.2 !important; margin-bottom: 8px !important; }
    .region-thumbnail-services { font-size: 12px !important; line-height: 1.5 !important; }
    .region-hero-sub-standalone { font-size: 14px !important; line-height: 1.7 !important; max-width: 100% !important; padding: 0 4px !important; }
    
    /* 제품 5줄 카드 폰트 축소 */
    .region-product-detail-card { padding: 14px 16px !important; }
    .region-product-detail-card h3 { font-size: 15px !important; }
    .region-product-detail-card li { font-size: 12.5px !important; line-height: 1.65 !important; }
    
    /* FAQ */
    .region-faq-item { padding: 12px 14px !important; }
    .region-faq-item strong { font-size: 13.5px !important; }
    .region-faq-item p { font-size: 12.5px !important; }
    
    /* 주의사항 */
    .region-caution-item { padding: 12px 14px !important; gap: 10px !important; }
    .region-caution-item h3 { font-size: 13.5px !important; }
    .region-caution-item p { font-size: 12.5px !important; }
    
    /* 추천 업종 카드 */
    .region-biz-card { padding: 12px 14px !important; }
    .region-biz-name { font-size: 13.5px !important; }
    .region-biz-effect { font-size: 12px !important; }
    .region-biz-stars { font-size: 11.5px !important; }
    
    /* CTA 박스 */
    .region-cta-box { padding: 24px 18px !important; }
    .region-cta-buttons { flex-direction: column !important; gap: 10px !important; }
    .region-cta-buttons .btn { width: 100% !important; text-align: center; padding: 12px !important; font-size: 14px !important; }
    
    /* 버튼 */
    .btn { font-size: 14px !important; padding: 10px 18px !important; }
    .btn-primary, .btn-ghost { width: auto; }
    
    /* breadcrumb */
    .breadcrumb { font-size: 11.5px !important; flex-wrap: wrap; gap: 4px; }
    
    /* 푸터 */
    footer { padding: 32px 0 24px !important; }
    .footer-grid { gap: 24px !important; }
    .footer-brand .logo { font-size: 18px !important; }
}

/* 480px 이하 (작은 모바일) */
@media (max-width: 480px) {
    .container { padding: 0 14px !important; }
    h1 { font-size: clamp(20px, 6vw, 26px) !important; }
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; font-size: 12.5px; }
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 6px !important; }
    .region-thumbnail { max-height: 240px !important; }
    .region-thumbnail-overlay { padding: 14px 12px !important; }
    .region-thumbnail-services { font-size: 11px !important; }
    .region-hero-sub-standalone { font-size: 13px !important; }
}

/* 360px 이하 (소형 모바일) */
@media (max-width: 360px) {
    .container { padding: 0 12px !important; }
    .region-stats-grid { grid-template-columns: 1fr !important; }
    .region-list-grid { grid-template-columns: 1fr !important; }
    .region-thumbnail-title { font-size: 19px !important; }
}


/* ============================================================
   📱 짤림 방지 추가 패치 (이미지·텍스트 모두)
   ============================================================ */

/* === 모든 화면 크기에서 짤림 방지 === */
* {
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
}

/* 모든 이미지가 부모 박스 안에 들어오도록 강제 */
img, picture, video, svg, canvas, iframe, embed, object {
    max-width: 100% !important;
    height: auto !important;
    display: block;
}

/* 모든 텍스트 박스가 부모 안에 들어오도록 */
p, h1, h2, h3, h4, h5, h6, span, div, li, a, strong, em, td, th {
    word-wrap: break-word;
    overflow-wrap: break-word;
    min-width: 0;
}

/* 한글 단어가 중간에 안 끊기도록 */
p, h1, h2, h3, h4, li {
    word-break: keep-all;
}

/* 영어·URL·이메일·전화번호 같은 긴 문자열 강제 줄바꿈 */
.long-text, code, pre, .url, a[href^="mailto"], a[href^="tel"], .breadcrumb {
    word-break: break-all;
    overflow-wrap: anywhere;
}

/* 그리드 자식이 부모를 넘는 것 방지 */
[class*="grid"], [class*="flex"] {
    min-width: 0;
}
[class*="grid"] > *, [class*="flex"] > * {
    min-width: 0;
    max-width: 100%;
}

/* 768px 이하에서 추가 짤림 방지 */
@media (max-width: 768px) {
    /* body 내부에서 가로로 넘는 요소 강제 정리 */
    body, html { max-width: 100vw !important; overflow-x: hidden !important; }
    
    /* 컨테이너·박스가 절대 가로폭 안 넘게 */
    .container, .region-box, .region-cta-box, header, footer, section {
        max-width: 100% !important;
        box-sizing: border-box !important;
    }
    
    /* 썸네일 안 텍스트도 wrap */
    .region-thumbnail-title, .region-thumbnail-services, .region-thumbnail-meta {
        max-width: 100% !important;
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        white-space: normal !important;
    }
    
    /* 통계 카드 숫자 폰트 축소 */
    .region-stats-grid .region-stat-num,
    .region-stats-grid .region-stat-value,
    [class*="stat-num"], [class*="stat-value"] {
        font-size: clamp(18px, 5vw, 24px) !important;
        word-break: break-all !important;
    }
    
    /* 표 가로 스크롤 처리 */
    table {
        display: block !important;
        overflow-x: auto !important;
        white-space: nowrap;
    }
    
    /* 긴 동 이름(예: "한국토지주택공사동") 줄바꿈 */
    .region-list-grid a, .region-products-simple a {
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        line-height: 1.4 !important;
        padding: 8px 6px !important;
        font-size: 12.5px !important;
        text-align: center;
    }
    
    /* 전화번호·CTA 버튼 텍스트가 안 잘리도록 */
    .btn, .nav-cta, button, a[href^="tel"] {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}


/* === 온라인 문의 폼 (모든 페이지 공통) === */
.contact-section {
    padding: 100px 0;
    background: var(--cream-dark);
}
.contact-section .container {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 60px;
    align-items: start;
    max-width: 1140px;
}
.contact-intro {
    position: sticky;
    top: 100px;
}
.contact-intro .cta-label {
    text-align: left;
    font-size: 13px;
    font-weight: 700;
    color: var(--coral);
    letter-spacing: 3px;
    margin-bottom: 16px;
}
.contact-title {
    font-size: clamp(32px, 4vw, 48px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0 0 16px;
}
.contact-sub {
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.7;
    margin: 0 0 32px;
}
.contact-direct {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.contact-direct-btn {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 22px;
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 14px;
    transition: all 0.2s;
    text-decoration: none;
    color: inherit;
}
.contact-direct-btn:hover {
    border-color: var(--forest);
    transform: translateX(4px);
}
.contact-direct-btn .cd-icon {
    width: 44px;
    height: 44px;
    background: var(--cream-dark);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
}
.cd-label {
    display: block;
    font-size: 12px;
    color: var(--ink-soft);
    margin-bottom: 2px;
}
.cd-value {
    display: block;
    font-size: 16px;
    font-weight: 700;
    color: var(--ink);
}

/* 문의 폼 박스 */
.contact-form-box {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 40px 36px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}
.contact-form-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 22px;
    font-weight: 800;
    margin: 0 0 28px;
    letter-spacing: -0.01em;
}
.cf-bar {
    width: 4px;
    height: 22px;
    background: var(--coral);
    border-radius: 2px;
}
.contact-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.form-group {
    display: flex;
    flex-direction: column;
}
.form-group label {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 8px;
}
.required {
    color: var(--coral);
}
.form-group input,
.form-group select,
.form-group textarea {
    padding: 14px 16px;
    font-size: 14px;
    font-family: inherit;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: #fafafa;
    color: var(--ink);
    transition: all 0.2s;
    width: 100%;
    box-sizing: border-box;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--forest);
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(45, 74, 62, 0.1);
}
.form-group input::placeholder,
.form-group textarea::placeholder {
    color: #b0b0b0;
}
.form-group textarea {
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
}
.form-group select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23666' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    background-size: 10px;
    padding-right: 40px;
}
.form-agree {
    padding: 16px;
    background: #fafafa;
    border-radius: 10px;
    border: 1px solid var(--border);
}
.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
}
.checkbox-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--forest);
    cursor: pointer;
}
.agree-detail {
    font-size: 11px;
    color: var(--ink-soft);
    margin-top: 8px;
    padding-left: 26px;
    line-height: 1.6;
}
.contact-submit {
    background: var(--ink);
    color: #ffffff;
    border: none;
    padding: 18px 28px;
    font-size: 16px;
    font-weight: 700;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    margin-top: 8px;
}
.contact-submit:hover {
    background: var(--forest);
    transform: translateY(-2px);
}
.contact-submit:disabled {
    background: #999;
    cursor: not-allowed;
    transform: none;
}
.form-message {
    padding: 20px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    display: none;
    margin-top: 16px;
}
.form-message.success {
    display: block;
    background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
    color: #1b5e20;
    border: 2px solid #66bb6a;
    box-shadow: 0 4px 16px rgba(76, 175, 80, 0.2);
    animation: messagePop 0.4s ease;
}
.form-message.error {
    display: block;
    background: linear-gradient(135deg, #ffebee, #ffcdd2);
    color: #b71c1c;
    border: 2px solid #ef5350;
    box-shadow: 0 4px 16px rgba(244, 67, 54, 0.2);
    animation: messagePop 0.4s ease;
}
@keyframes messagePop {
    0% { transform: scale(0.9); opacity: 0; }
    60% { transform: scale(1.02); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}

/* 모바일 */
@media (max-width: 900px) {
    .contact-section .container {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .contact-intro {
        position: static;
        text-align: center;
    }
    .contact-intro .cta-label { text-align: center; }
    .contact-direct-btn { flex-direction: row; text-align: left; }
    .contact-form-box { padding: 28px 24px; }
}

</style>
</head>
<body>

    <!-- 헤더 -->
    <header>
        <nav class="nav">
            <a href="/" class="logo">
                <img src="/brand.png" alt="마스터페이" class="logo-mark-img">
                마스터페이
            </a>
            
            <ul class="nav-menu" id="navMenu">
                <li><a href="/#find-sec">지역별 설치</a></li>
                <li><a href="/#allinone">제품 안내</a></li>
                <li><a href="/#process">프로세스</a></li>
                <li><a href="/#faq">자주 묻는 질문</a></li>
            </ul>
            
            <a href="/#contact" class="nav-cta">문의하기</a>
            <button class="mobile-toggle" onclick="toggleMenu()">☰</button>
        </nav>
    </header>

    <!-- 제품 히어로 -->
    <section class="product-hero">
        <div class="container">
            <div class="breadcrumb">
                <a href="/">홈</a>
                <span class="breadcrumb-separator">/</span>
                <a href="/#products">제품</a>
                <span class="breadcrumb-separator">/</span>
                <span>테이블 오더</span>
            </div>
            
            <div class="product-grid">
                <div class="product-info">
                    <span class="product-badge">Table Order</span>
                    <h1 class="product-title">
                        테이블 오더
                    </h1>
                    <p class="product-lead">QR코드 스캔 한 번으로 주문부터 결제까지. 홀 인건비를 줄이고 객단가를 높이는 스마트 주문 시스템을 경험해보세요.</p>
                    
                    <div class="product-specs">
                    <div class="spec-item">
                        <div class="spec-label">Type</div>
                        <div class="spec-value">QR·태블릿</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Feature</div>
                        <div class="spec-value">주문·결제 통합</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Effect</div>
                        <div class="spec-value">객단가 25% ↑</div>
                    </div>
                    </div>
                    
                    <div class="product-cta">
                        <a href="/#contact" class="btn btn-primary">
                            무료 상담 신청 →
                        </a>
                        <a href="tel:010-2337-0458" class="btn btn-ghost">
                            📞 전화 상담
                        </a>
                    </div>
                </div>
                
                <div class="product-visual">
                    <img src="https://raw.githubusercontent.com/YOONSOEUN1/mastarpay/main/images/tableorder.png" alt="테이블 오더" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
            </div>
        </div>
    </section>

    <!-- 특징 섹션 -->
    <section class="features">
        <div class="container">
            <div class="section-header">
                <span class="section-num">01 / Features</span>
                <h2 class="section-title">
                    이런 특징이 있어요.
                </h2>
            </div>
            
            <div class="feature-grid">
                <div class="feature-item">
                    <div class="feature-icon">🏆</div>
                    <h3 class="feature-title">검증된 품질</h3>
                    <p class="feature-desc">업계에서 인정받은 최고의 모델만을 엄선하여 제공합니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">⚡</div>
                    <h3 class="feature-title">빠른 설치</h3>
                    <p class="feature-desc">상담 후 빠른 일정으로 설치가 완료됩니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">💰</div>
                    <h3 class="feature-title">합리적 비용</h3>
                    <p class="feature-desc">설치비 무료 옵션과 렌탈 프로그램으로 부담이 적습니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🔧</div>
                    <h3 class="feature-title">A/S 보장</h3>
                    <p class="feature-desc">장애 시 원격 지원과 현장 출동으로 빠르게 해결합니다.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 상세 내용 -->
    <section class="detail">
        <div class="container">
            <div class="section-header">
                <span class="section-num">02 / Details</span>
                <h2 class="section-title">
                    자세히 알아보기.
                </h2>
            </div>
            
            <div class="detail-content">
                
                <h3>테이블 오더가 대세인 이유</h3>
                <p>코로나 이후 비대면 주문이 일상화되고, 최저임금 상승으로 홀 인건비 부담이 커지면서 테이블 오더는 음식점의 새로운 표준이 되었습니다. 고객은 자리에 앉아 스마트폰이나 태블릿으로 메뉴를 보고 주문할 수 있어 편리하고, 사장님은 홀 서빙 인력을 대폭 줄일 수 있어 인건비 절감 효과가 큽니다.</p>
                <p>마스터페이의 테이블 오더는 QR코드 방식과 태블릿 방식 모두 지원하여, 매장 특성에 맞게 선택할 수 있습니다. 주문부터 결제까지 한 번에 처리되며, 포스기와 실시간 연동되어 주방 프린터로 주문이 자동 전송되어 업무 효율이 크게 향상됩니다.</p>
                
                <h3>테이블 오더 설치 프로세스</h3>
                <ul>
                    <li>1단계 무료 상담 — 매장 테이블 수와 영업 방식을 확인합니다</li>
                    <li>2단계 방식 선택 — QR 방식과 태블릿 방식 중 매장에 맞는 것을 선택합니다</li>
                    <li>3단계 메뉴 등록 — 메뉴 사진·설명·옵션을 상세히 등록합니다</li>
                    <li>4단계 포스기 연동 — 기존 포스기와 실시간 연동 설정을 합니다</li>
                    <li>5단계 현장 설치 — 테이블마다 QR이나 태블릿을 설치하고 테스트합니다</li>
                    <li>6단계 지속 관리 — 메뉴 변경이나 장애 시 즉시 지원합니다</li>
                </ul>
                
                <h3>테이블 오더 주요 기능</h3>
                <ul>
                    <li>QR로 간편 주문 — 테이블 QR코드를 스캔하면 스마트폰으로 바로 주문할 수 있습니다</li>
                    <li>인건비 절감 — 홀 직원 호출 없이 자체 주문이 가능해 서빙 인력을 크게 줄일 수 있습니다</li>
                    <li>객단가 상승 — 메뉴 사진으로 추가 주문이 자연스럽게 이어져 평균 객단가가 25% 상승합니다</li>
                    <li>다국어 지원 — 한국어·영어·중국어·일본어로 외국인 관광객 응대가 완벽합니다</li>
                    <li>실시간 주방 전송 — 주문이 즉시 주방 프린터로 출력되어 주문 누락이 없습니다</li>
                    <li>간편 결제 — 주문 완료 후 카드·간편결제까지 한 번에 처리됩니다</li>
                </ul>
                
                <h3>이런 매장에 추천합니다</h3>
                <p>홀 서빙 인건비 부담이 큰 음식점·주점, 객단가를 높이고 싶은 프랜차이즈, 외국인 고객이 많은 관광지 매장, 피크 타임 주문 폭주로 실수가 잦은 매장, 주문 호출 벨 대신 세련된 시스템을 원하는 곳에 추천합니다. 고깃집, 호프집, 이자카야, 한식당, 중식당 등 다양한 업종에 효과적입니다.</p>
                
                <h3>QR 방식 vs 태블릿 방식</h3>
                <p><strong>QR 방식</strong>은 비용이 저렴하고 고객이 자신의 스마트폰으로 주문하는 방식입니다. 초기 투자 부담이 적고, 유지 비용도 거의 없지만, 스마트폰에 익숙하지 않은 고객은 불편할 수 있습니다. 2030 세대 고객이 많은 매장에 적합합니다.</p>
                <p><strong>태블릿 방식</strong>은 테이블마다 태블릿을 설치하여 모든 연령대가 쉽게 사용할 수 있는 방식입니다. 직관적이고 고급스러운 이미지를 주며, 메뉴 사진도 크게 보여 추가 주문 유도 효과가 더 큽니다. 다만 태블릿 구매·유지비가 발생합니다. 전 연령대 고객이 있는 매장에 적합합니다.</p>
                
                <h3>테이블 오더 도입 효과</h3>
                <p>실제 도입 매장의 평균 효과는 매우 인상적입니다. 홀 인건비 30~50% 절감, 객단가 25% 상승, 주문 실수 95% 감소, 고객 대기 시간 40% 단축이 일반적입니다. 특히 외국인 관광객이 많은 매장은 다국어 지원으로 매출이 크게 늘어납니다. 초기 투자 비용은 보통 3~6개월 내에 회수됩니다.</p>
                
                <h3>자주 묻는 질문</h3>
                <p><strong>Q. QR과 태블릿 중 어떤 것이 좋나요?</strong><br>매장 고객층에 따라 다릅니다. 2030 고객이 많으면 QR, 전 연령대가 있으면 태블릿을 추천드립니다. 상담 시 자세히 안내해드립니다.</p>
                <p><strong>Q. 기존 포스기와 연동되나요?</strong><br>네, 대부분의 포스기와 실시간 연동됩니다. 주문이 주방 프린터로 자동 전송되어 업무 효율이 크게 높아집니다.</p>
                <p><strong>Q. 메뉴 변경은 어떻게 하나요?</strong><br>관리 앱에서 간단히 메뉴·가격·사진을 변경할 수 있습니다. 복잡한 변경은 마스터페이가 원격으로 도와드립니다.</p>
                <p><strong>Q. 노년층 손님도 사용 가능한가요?</strong><br>태블릿 방식은 큰 화면과 단순한 흐름으로 노년층도 쉽게 사용합니다. 직원이 간단히 안내해드리면 대부분 잘 사용하십니다.</p>
    
            </div>
        </div>
    </section>

    <!-- 관련 제품 -->
    <section class="related">
        <div class="container">
            <div class="section-header">
                <span class="section-num">03 / Related</span>
                <h2 class="section-title">
                    다른 제품도 둘러보세요.
                </h2>
            </div>
            
            <div class="related-grid">
                <a href="/product/kiosk" class="related-card">
                    <div class="related-icon">🤖</div>
                    <div class="related-name">키오스크</div>
                    <div class="related-desc">대형 무인 주문</div>
                </a>
                <a href="/product/kiosk-mini" class="related-card">
                    <div class="related-icon">📱</div>
                    <div class="related-name">미니 키오스크</div>
                    <div class="related-desc">공간 절약형</div>
                </a>
                <a href="/product/pos" class="related-card">
                    <div class="related-icon">🖥️</div>
                    <div class="related-name">포스기</div>
                    <div class="related-desc">매장 통합 관리</div>
                </a>
            </div>
        </div>
    </section>

    <!-- CTA -->
    <section class="contact-section" id="contact">
        <div class="container">
            <div class="contact-intro">
                <div class="cta-label">— Contact Us —</div>
                <h2 class="contact-title">무료 상담 신청</h2>
                <p class="contact-sub">전화, 카카오톡 또는 아래 폼으로 문의해주세요.<br>담당자가 빠르게 연락드립니다.</p>
                <div class="contact-direct">
                    <a href="tel:010-2337-0458" class="contact-direct-btn">
                        <span class="cd-icon">📞</span>
                        <span><span class="cd-label">전화 상담</span><span class="cd-value">010-2337-0458</span></span>
                    </a>
                    <a href="javascript:void(0)" onclick="openKakao(); return false;" class="contact-direct-btn">
                        <span class="cd-icon">💬</span>
                        <span><span class="cd-label">카카오톡</span><span class="cd-value">바로 상담</span></span>
                    </a>
                </div>
            </div>
            <div class="contact-form-box">
                <h3 class="contact-form-title"><span class="cf-bar"></span><span>📝 온라인 문의</span></h3>
                <form id="contactForm" class="contact-form" onsubmit="return submitContactForm(event)">
                    <div class="form-group"><label for="name">상호(이름) <span class="required">*</span></label><input type="text" id="name" name="상호_이름" placeholder="상호 또는 이름을 입력하세요" required></div>
                    <div class="form-group"><label for="phone">연락처 <span class="required">*</span></label><input type="tel" id="phone" name="연락처" placeholder="010-0000-0000" required></div>
                    <div class="form-group"><label for="address">주소 <span class="required">*</span></label><input type="text" id="address" name="주소" placeholder="매장 주소" required><input type="text" id="address_detail" name="상세주소" placeholder="상세주소 (건물명, 층, 호수 등)" style="margin-top: 8px;"></div>
                    <div class="form-group"><label for="product">문의 제품 <span class="required">*</span></label><select id="product" name="문의_제품" required><option value="">선택해주세요</option><option value="포스기">포스기(POS)</option><option value="2인치 단말기">2인치 단말기</option><option value="3인치 단말기">3인치 단말기</option><option value="토스 단말기">토스 단말기</option><option value="무선 단말기">무선 단말기</option><option value="블루투스 단말기">블루투스 단말기</option><option value="키오스크">키오스크</option><option value="미니 키오스크">미니 키오스크</option><option value="테이블 오더">테이블 오더</option><option value="매장 철거">매장 철거</option><option value="여러 제품 패키지">여러 제품 패키지</option><option value="기타/미정">기타/미정</option></select></div>
                    <div class="form-group"><label for="business">업종</label><select id="business" name="업종"><option value="">선택해주세요</option><option value="음식점/식당">음식점/식당</option><option value="카페/베이커리">카페/베이커리</option><option value="편의점/마트">편의점/마트</option><option value="미용실/네일샵">미용실/네일샵</option><option value="스터디카페">스터디카페</option><option value="주점/호프">주점/호프</option><option value="무인매장">무인매장</option><option value="의류/잡화">의류/잡화</option><option value="병원/약국">병원/약국</option><option value="기타">기타</option></select></div>
                    <div class="form-group"><label for="message">문의 내용</label><textarea id="message" name="문의_내용" rows="5" placeholder="매장 위치, 현재 사용 장비, 궁금한 점 등을 자유롭게 적어주세요."></textarea></div>
                    <div class="form-agree"><label class="checkbox-label"><input type="checkbox" id="agree" required><span>개인정보 수집 및 이용에 동의합니다 <span class="required">*</span></span></label><div class="agree-detail">수집항목: 상호·연락처·주소·문의 내용 / 이용목적: 상담 및 견적 안내 / 보유기간: 3년</div></div>
                    <button type="submit" class="contact-submit" id="submitBtn"><span id="submitText">무료 상담 신청하기 →</span></button>
                    <div id="formMessage" class="form-message"></div>
                </form>
            </div>
        </div>
    </section>

    <!-- 푸터 -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="logo">
                        <img src="/brand.png" alt="마스터페이" class="logo-mark-img">
                        마스터페이
                    </div>
                    <p>매장 운영에 필요한 모든 장비<br>설치부터 A/S까지 한번에.</p>
                </div>
                
                <div class="footer-col">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="tel:010-2337-0458">📞 010-2337-0458</a></li>
                        <li><a href="https://pf.kakao.com/_fPrxbG/chat" target="_blank">💬 카카오톡 상담</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <span>© 2026 마스터페이. All rights reserved.</span>
                <span>개인정보처리방침 · 이용약관</span>
            </div>
        </div>
    </footer>

    <script>
        function toggleMenu() {
            document.getElementById('navMenu').classList.toggle('active');
        }
        function openKakao(){
          var url='https://pf.kakao.com/_fPrxbG/chat';
          var w=window.open(url,'_blank');
          if(!w||w.closed||typeof w.closed==='undefined'){window.location.href=url;}
        }
        function scrollToContact(event){
          if(event)event.preventDefault();
          var c=document.getElementById('contact');
          if(c){
            var top=c.getBoundingClientRect().top+window.pageYOffset-80;
            window.scrollTo({top:top,behavior:'smooth'});
          }else{window.location.href='/#contact';}
        }
        async function submitContactForm(event){
          if(event){event.preventDefault();event.stopPropagation();}
          var form=document.getElementById('contactForm');
          var submitBtn=document.getElementById('submitBtn');
          var submitText=document.getElementById('submitText');
          var formMessage=document.getElementById('formMessage');
          if(!form){alert('⚠️ 폼을 찾을 수 없습니다.');return false;}
          var agreeCheckbox=document.getElementById('agree');
          if(!agreeCheckbox||!agreeCheckbox.checked){alert('개인정보 수집 및 이용에 동의해주세요.');return false;}
          var name=document.getElementById('name').value.trim();
          var phone=document.getElementById('phone').value.trim();
          var address=document.getElementById('address').value.trim();
          var product=document.getElementById('product').value;
          if(!name){alert('상호(이름)을 입력해주세요.');document.getElementById('name').focus();return false;}
          if(!phone){alert('연락처를 입력해주세요.');document.getElementById('phone').focus();return false;}
          if(!address){alert('주소를 입력해주세요.');document.getElementById('address').focus();return false;}
          if(!product){alert('문의 제품을 선택해주세요.');document.getElementById('product').focus();return false;}
          if(submitBtn)submitBtn.disabled=true;
          if(submitText)submitText.textContent='전송 중...';
          if(formMessage){formMessage.className='form-message';formMessage.style.display='none';}
          var data={name:name,phone:phone,address:address,addressDetail:document.getElementById('address_detail').value.trim(),product:product,business:document.getElementById('business').value,message:document.getElementById('message').value.trim()};
          var result;
          try{
            var response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
            result=await response.json();
            if(result.success){
              if(formMessage){formMessage.className='form-message success';formMessage.style.display='block';formMessage.innerHTML='<div style="text-align:center;padding:24px 20px;"><div style="font-size:48px;margin-bottom:12px;">✅</div><div style="font-size:18px;font-weight:800;color:#2e7d32;margin-bottom:8px;">문의가 성공적으로 접수되었습니다!</div><div style="font-size:14px;color:#555;">24시간 이내에 연락드리겠습니다.<br>급하신 경우 <strong>010-2337-0458</strong>로 연락주세요.</div></div>';}
              form.reset();
              setTimeout(function(){if(formMessage)formMessage.scrollIntoView({behavior:'smooth',block:'center'});},100);
            }else{throw new Error(result.error||'전송에 실패했습니다.');}
          }catch(error){
            var errorMsg=error.message||'전송에 실패했습니다';
            if(formMessage){formMessage.className='form-message error';formMessage.style.display='block';formMessage.innerHTML='<div style="text-align:center;padding:20px;"><div style="font-size:40px;margin-bottom:10px;">❌</div><div style="font-size:16px;font-weight:700;margin-bottom:8px;">전송에 실패했습니다</div><div style="font-size:13px;margin-bottom:12px;color:#555;">'+errorMsg+'</div><div style="font-size:14px;margin-top:12px;"><strong>📞 010-2337-0458</strong><br>또는 카카오톡으로 문의해주세요.</div></div>';formMessage.scrollIntoView({behavior:'smooth',block:'center'});}
          }finally{
            if(submitBtn)submitBtn.disabled=false;
            if(submitText)submitText.textContent='무료 상담 신청하기 →';
          }
          return false;
        }
    </script>

</body>
</html>`;

const PAGE_REMOVAL = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
<link rel="icon" type="image/png" href="/brand.png">
<link rel="apple-touch-icon" href="/brand.png">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="naver-site-verification" content="53af8497b3a522a8a85a7b13bae57efd7e27fb5c" />
    <title>매장 철거 | 마스터페이</title>
    <meta name="description" content="매장·사무실·가게 철거를 전문 엔지니어팀이 책임집니다. 철거부터 원상복구·폐기물 처리까지 원스톱으로 깔끔하게.">
    <meta property="og:title" content="매장 철거 | 마스터페이">
    <meta property="og:description" content="매장·사무실·가게 철거를 전문 엔지니어팀이 책임집니다. 철거부터 원상복구·폐기물 처리까지 원스톱으로 깔끔하게.">
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&display=swap" rel="stylesheet">
    <style>/* ========== 공용 스타일 (모든 페이지에서 사용) ========== */

:root {
    --cream: #f7f4ed;
    --cream-dark: #ede8db;
    --ink: #1a1a1a;
    --ink-soft: #4a4a4a;
    --forest: #2d4a3e;
    --forest-dark: #1f352c;
    --coral: #e8763a;
    --border: #d9d3c4;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 80px; }

body {
    font-family: 'Pretendard Variable', Pretendard, -apple-system, sans-serif;
    background: #ffffff;
    color: var(--ink);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
}

a { text-decoration: none; color: inherit; }
img { max-width: 100%; display: block; }

.container {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 32px;
}

/* ========== 헤더 ========== */
header {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    background: var(--cream);
    z-index: 9999 !important;
    border-bottom: 1px solid var(--border);
}
body {
    padding-top: 72px;
}
@media (max-width: 768px) {
    body { padding-top: 60px; }
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 32px;
    max-width: 1240px;
    margin: 0 auto;
}

.logo {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 8px;
}

.logo-mark {
    width: 28px;
    height: 28px;
    background: var(--forest);
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--cream);
    font-size: 14px;
}
.logo-mark-img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    display: inline-block;
    vertical-align: middle;
}

.nav-menu {
    display: flex;
    gap: 40px;
    list-style: none;
}

.nav-menu a {
    font-size: 15px;
    font-weight: 500;
    color: var(--ink-soft);
    transition: color 0.2s;
}

.nav-menu a:hover { color: var(--ink); }

.nav-cta {
    background: var(--ink);
    color: var(--cream);
    padding: 10px 20px;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 600;
    transition: transform 0.2s;
}

.nav-cta:hover { transform: scale(1.03); }

.mobile-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

/* ========== 제품 페이지 전용 ========== */
.product-hero {
    padding: 60px 0 80px;
    position: relative;
    overflow: hidden;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--ink-soft);
    margin-bottom: 32px;
}

.breadcrumb a {
    color: var(--ink-soft);
    transition: color 0.2s;
}

.breadcrumb a:hover { color: var(--ink); }

.breadcrumb-separator {
    opacity: 0.4;
}

.product-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
}

.product-badge {
    display: inline-block;
    padding: 6px 14px;
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
    color: var(--coral);
    margin-bottom: 20px;
}

.product-title {
    font-size: clamp(36px, 5vw, 60px);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
}

.product-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}

.product-lead {
    font-size: 18px;
    color: var(--ink-soft);
    line-height: 1.6;
    margin-bottom: 32px;
}

.product-specs {
    display: flex;
    gap: 32px;
    padding: 24px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    margin-bottom: 32px;
    flex-wrap: wrap;
}

.spec-item .spec-label {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 13px;
    color: var(--coral);
    margin-bottom: 4px;
}

.spec-item .spec-value {
    font-size: 18px;
    font-weight: 700;
}

.product-cta {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.btn {
    padding: 16px 32px;
    border-radius: 100px;
    font-weight: 600;
    font-size: 15px;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid transparent;
}

.btn-primary {
    background: var(--ink);
    color: var(--cream);
}

.btn-primary:hover {
    background: var(--forest);
}

.btn-ghost {
    background: transparent;
    color: var(--ink);
    border-color: var(--border);
}

.btn-ghost:hover {
    background: var(--cream-dark);
}

/* 제품 이미지 영역 */
.product-visual {
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 32px;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 180px;
    position: relative;
    overflow: hidden;
}

.product-visual img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* ========== 특징 섹션 ========== */
.features {
    padding: 100px 0;
    background: var(--cream-dark);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
}

.section-header {
    display: flex;
    align-items: baseline;
    gap: 24px;
    margin-bottom: 64px;
    flex-wrap: wrap;
}

.section-num {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 28px;
    color: var(--coral);
    font-weight: 400;
}

.section-title {
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    flex: 1;
    min-width: 300px;
}

.section-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 2px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 24px;
    overflow: hidden;
}

.feature-item {
    background: var(--cream);
    padding: 40px 32px;
    transition: background 0.3s;
}

.feature-item:hover {
    background: var(--cream-dark);
}

.feature-icon {
    font-size: 36px;
    margin-bottom: 20px;
    display: inline-block;
}

.feature-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 12px;
    letter-spacing: -0.01em;
}

.feature-desc {
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.6;
}

/* ========== 상세 내용 섹션 ========== */
.detail {
    padding: 100px 0;
}

.detail-content {
    max-width: 800px;
    margin: 0 auto;
    font-size: 17px;
    line-height: 1.8;
    color: var(--ink-soft);
}

.detail-content h3 {
    font-size: 28px;
    font-weight: 800;
    color: var(--ink);
    margin: 48px 0 20px;
    letter-spacing: -0.02em;
}

.detail-content h3:first-child {
    margin-top: 0;
}

.detail-content p {
    margin-bottom: 20px;
}

.detail-content ul {
    list-style: none;
    padding: 0;
    margin-bottom: 20px;
}

.detail-content ul li {
    padding: 10px 0 10px 32px;
    position: relative;
    border-bottom: 1px solid var(--border);
}

.detail-content ul li:last-child {
    border-bottom: none;
}

.detail-content ul li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--coral);
    font-weight: 800;
    font-size: 18px;
}

/* ========== 관련 제품 ========== */
.related {
    padding: 100px 0;
    background: var(--cream-dark);
    border-top: 1px solid var(--border);
}

.related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
}

.related-card {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 28px;
    transition: all 0.3s;
    display: block;
}

.related-card:hover {
    transform: translateY(-4px);
    border-color: var(--ink);
}

.related-icon {
    font-size: 36px;
    margin-bottom: 16px;
}

.related-name {
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 6px;
}

.related-desc {
    font-size: 13px;
    color: var(--ink-soft);
}

/* ========== CTA 섹션 ========== */
.cta {
    background: var(--ink);
    color: var(--cream);
    padding: 120px 0;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.cta::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: var(--forest);
    border-radius: 50%;
    top: -300px;
    right: -200px;
    opacity: 0.4;
    filter: blur(80px);
}

.cta-content {
    position: relative;
    z-index: 1;
}

.cta-label {
    font-family: 'Fraunces', serif;
    font-style: italic;
    color: var(--coral);
    font-size: 18px;
    margin-bottom: 20px;
}

.cta h2 {
    font-size: clamp(32px, 5vw, 56px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-bottom: 40px;
}

.cta h2 .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--coral);
}

.cta-phone {
    display: inline-flex;
    align-items: center;
    gap: 16px;
    font-size: 28px;
    font-weight: 800;
    padding: 20px 40px;
    background: var(--cream);
    color: var(--ink);
    border-radius: 100px;
    transition: transform 0.2s;
    margin-bottom: 16px;
}

.cta-phone:hover {
    transform: scale(1.03);
}

.cta-note {
    opacity: 0.7;
    font-size: 14px;
}

/* ========== 푸터 ========== */
footer {
    background: var(--ink);
    color: var(--cream);
    padding: 60px 0 40px;
    border-top: 1px solid rgba(247, 244, 237, 0.1);
}

.footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
}

.footer-brand .logo {
    color: var(--cream);
    margin-bottom: 16px;
}

.footer-brand p {
    font-size: 14px;
    opacity: 0.7;
    max-width: 300px;
    line-height: 1.6;
}

.footer-col h4 {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 16px;
    color: var(--coral);
}

.footer-col ul { list-style: none; }
.footer-col li { margin-bottom: 10px; }

.footer-col a {
    font-size: 14px;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.footer-col a:hover { opacity: 1; }

.footer-bottom {
    padding-top: 30px;
    border-top: 1px solid rgba(247, 244, 237, 0.1);
    font-size: 13px;
    opacity: 0.6;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
}

/* ========== 모바일 대응 ========== */
@media (max-width: 900px) {
    .product-grid {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .footer-grid {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 640px) {
    .container { padding: 0 20px; }
    .nav { padding: 16px 20px; }
    .nav-menu, .nav-cta { display: none; }
    .mobile-toggle { display: block; }
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--cream);
        padding: 20px;
        gap: 20px;
        border-bottom: 1px solid var(--border);
    }
    .product-hero { padding: 40px 0 60px; }
    .features, .detail, .related { padding: 60px 0; }
    .cta { padding: 80px 0; }
    .footer-grid { grid-template-columns: 1fr; }
    .cta-phone { font-size: 20px; padding: 16px 28px; }
    .product-visual { font-size: 100px; }
}

/* ============================================================
   📱 모바일 반응형 종합 보강 (일괄 패치)
   ============================================================ */

/* 가로 스크롤 방지 (가장 중요) */
html, body {
    overflow-x: hidden;
    width: 100%;
    -webkit-text-size-adjust: 100%;
}

* { max-width: 100%; }
img, video, iframe { max-width: 100%; height: auto; }
table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }

/* 768px 이하 (태블릿 ↓) */
@media (max-width: 768px) {
    .container { padding: 0 16px !important; }
    
    /* 본문 텍스트 가독성 */
    body { font-size: 15px; line-height: 1.7; }
    h1 { font-size: clamp(22px, 5.5vw, 30px) !important; line-height: 1.25 !important; word-break: keep-all; }
    h2 { font-size: clamp(18px, 4.5vw, 24px) !important; line-height: 1.3 !important; word-break: keep-all; }
    h3 { font-size: clamp(15px, 4vw, 18px) !important; line-height: 1.35 !important; }
    p { word-break: keep-all; line-height: 1.75; }
    
    /* 헤더/네비 */
    .nav { padding: 14px 0 !important; }
    .nav-menu { display: none !important; }
    .mobile-toggle { display: block !important; font-size: 22px; background: none; border: 0; cursor: pointer; padding: 6px 10px; }
    .nav-menu.active { display: flex !important; flex-direction: column; position: absolute; top: 100%; left: 0; right: 0; background: var(--cream); padding: 16px; gap: 14px; border-top: 1px solid var(--border); z-index: 100; }
    .nav-cta { padding: 8px 14px !important; font-size: 13px !important; }
    .logo { font-size: 17px !important; gap: 8px !important; }
    .logo-mark, .logo-mark-img { width: 24px !important; height: 24px !important; font-size: 12px !important; }
    
    /* 그리드들 → 1열 */
    .region-features-grid,
    .region-biz-grid,
    .region-reviews-grid,
    .region-products-grid,
    .footer-grid,
    .features-grid,
    .product-cards-grid,
    .pricing-grid,
    .review-grid,
    .stat-cards { grid-template-columns: 1fr !important; gap: 12px !important; }
    
    /* 시도/시군구 통계 → 2열 (너무 좁아지면 1열) */
    .region-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
    
    /* 지역 리스트(시군구·동) → 2~3열 */
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; font-size: 13px; }
    
    /* 제품 그리드 → 2열 */
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
    
    /* 박스 패딩 축소 */
    .region-box { padding: 20px 18px !important; border-radius: 14px !important; margin-bottom: 14px !important; }
    .region-box-title { font-size: 17px !important; margin-bottom: 12px !important; }
    
    /* 썸네일 (Hero) */
    .region-thumbnail { max-width: 100% !important; max-height: 280px !important; aspect-ratio: 4/3 !important; margin: 0 auto 20px !important; border-radius: 14px !important; }
    .region-thumbnail-overlay { padding: 18px 16px !important; }
    .region-thumbnail-meta { font-size: 11px !important; gap: 6px !important; }
    .region-thumbnail-title { font-size: clamp(20px, 5.5vw, 28px) !important; line-height: 1.2 !important; margin-bottom: 8px !important; }
    .region-thumbnail-services { font-size: 12px !important; line-height: 1.5 !important; }
    .region-hero-sub-standalone { font-size: 14px !important; line-height: 1.7 !important; max-width: 100% !important; padding: 0 4px !important; }
    
    /* 제품 5줄 카드 폰트 축소 */
    .region-product-detail-card { padding: 14px 16px !important; }
    .region-product-detail-card h3 { font-size: 15px !important; }
    .region-product-detail-card li { font-size: 12.5px !important; line-height: 1.65 !important; }
    
    /* FAQ */
    .region-faq-item { padding: 12px 14px !important; }
    .region-faq-item strong { font-size: 13.5px !important; }
    .region-faq-item p { font-size: 12.5px !important; }
    
    /* 주의사항 */
    .region-caution-item { padding: 12px 14px !important; gap: 10px !important; }
    .region-caution-item h3 { font-size: 13.5px !important; }
    .region-caution-item p { font-size: 12.5px !important; }
    
    /* 추천 업종 카드 */
    .region-biz-card { padding: 12px 14px !important; }
    .region-biz-name { font-size: 13.5px !important; }
    .region-biz-effect { font-size: 12px !important; }
    .region-biz-stars { font-size: 11.5px !important; }
    
    /* CTA 박스 */
    .region-cta-box { padding: 24px 18px !important; }
    .region-cta-buttons { flex-direction: column !important; gap: 10px !important; }
    .region-cta-buttons .btn { width: 100% !important; text-align: center; padding: 12px !important; font-size: 14px !important; }
    
    /* 버튼 */
    .btn { font-size: 14px !important; padding: 10px 18px !important; }
    .btn-primary, .btn-ghost { width: auto; }
    
    /* breadcrumb */
    .breadcrumb { font-size: 11.5px !important; flex-wrap: wrap; gap: 4px; }
    
    /* 푸터 */
    footer { padding: 32px 0 24px !important; }
    .footer-grid { gap: 24px !important; }
    .footer-brand .logo { font-size: 18px !important; }
}

/* 480px 이하 (작은 모바일) */
@media (max-width: 480px) {
    .container { padding: 0 14px !important; }
    h1 { font-size: clamp(20px, 6vw, 26px) !important; }
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; font-size: 12.5px; }
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 6px !important; }
    .region-thumbnail { max-height: 240px !important; }
    .region-thumbnail-overlay { padding: 14px 12px !important; }
    .region-thumbnail-services { font-size: 11px !important; }
    .region-hero-sub-standalone { font-size: 13px !important; }
}

/* 360px 이하 (소형 모바일) */
@media (max-width: 360px) {
    .container { padding: 0 12px !important; }
    .region-stats-grid { grid-template-columns: 1fr !important; }
    .region-list-grid { grid-template-columns: 1fr !important; }
    .region-thumbnail-title { font-size: 19px !important; }
}


/* ============================================================
   📱 짤림 방지 추가 패치 (이미지·텍스트 모두)
   ============================================================ */

/* === 모든 화면 크기에서 짤림 방지 === */
* {
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
}

/* 모든 이미지가 부모 박스 안에 들어오도록 강제 */
img, picture, video, svg, canvas, iframe, embed, object {
    max-width: 100% !important;
    height: auto !important;
    display: block;
}

/* 모든 텍스트 박스가 부모 안에 들어오도록 */
p, h1, h2, h3, h4, h5, h6, span, div, li, a, strong, em, td, th {
    word-wrap: break-word;
    overflow-wrap: break-word;
    min-width: 0;
}

/* 한글 단어가 중간에 안 끊기도록 */
p, h1, h2, h3, h4, li {
    word-break: keep-all;
}

/* 영어·URL·이메일·전화번호 같은 긴 문자열 강제 줄바꿈 */
.long-text, code, pre, .url, a[href^="mailto"], a[href^="tel"], .breadcrumb {
    word-break: break-all;
    overflow-wrap: anywhere;
}

/* 그리드 자식이 부모를 넘는 것 방지 */
[class*="grid"], [class*="flex"] {
    min-width: 0;
}
[class*="grid"] > *, [class*="flex"] > * {
    min-width: 0;
    max-width: 100%;
}

/* 768px 이하에서 추가 짤림 방지 */
@media (max-width: 768px) {
    /* body 내부에서 가로로 넘는 요소 강제 정리 */
    body, html { max-width: 100vw !important; overflow-x: hidden !important; }
    
    /* 컨테이너·박스가 절대 가로폭 안 넘게 */
    .container, .region-box, .region-cta-box, header, footer, section {
        max-width: 100% !important;
        box-sizing: border-box !important;
    }
    
    /* 썸네일 안 텍스트도 wrap */
    .region-thumbnail-title, .region-thumbnail-services, .region-thumbnail-meta {
        max-width: 100% !important;
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        white-space: normal !important;
    }
    
    /* 통계 카드 숫자 폰트 축소 */
    .region-stats-grid .region-stat-num,
    .region-stats-grid .region-stat-value,
    [class*="stat-num"], [class*="stat-value"] {
        font-size: clamp(18px, 5vw, 24px) !important;
        word-break: break-all !important;
    }
    
    /* 표 가로 스크롤 처리 */
    table {
        display: block !important;
        overflow-x: auto !important;
        white-space: nowrap;
    }
    
    /* 긴 동 이름(예: "한국토지주택공사동") 줄바꿈 */
    .region-list-grid a, .region-products-simple a {
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        line-height: 1.4 !important;
        padding: 8px 6px !important;
        font-size: 12.5px !important;
        text-align: center;
    }
    
    /* 전화번호·CTA 버튼 텍스트가 안 잘리도록 */
    .btn, .nav-cta, button, a[href^="tel"] {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}


/* === 온라인 문의 폼 (모든 페이지 공통) === */
.contact-section {
    padding: 100px 0;
    background: var(--cream-dark);
}
.contact-section .container {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 60px;
    align-items: start;
    max-width: 1140px;
}
.contact-intro {
    position: sticky;
    top: 100px;
}
.contact-intro .cta-label {
    text-align: left;
    font-size: 13px;
    font-weight: 700;
    color: var(--coral);
    letter-spacing: 3px;
    margin-bottom: 16px;
}
.contact-title {
    font-size: clamp(32px, 4vw, 48px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0 0 16px;
}
.contact-sub {
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.7;
    margin: 0 0 32px;
}
.contact-direct {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.contact-direct-btn {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 22px;
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 14px;
    transition: all 0.2s;
    text-decoration: none;
    color: inherit;
}
.contact-direct-btn:hover {
    border-color: var(--forest);
    transform: translateX(4px);
}
.contact-direct-btn .cd-icon {
    width: 44px;
    height: 44px;
    background: var(--cream-dark);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
}
.cd-label {
    display: block;
    font-size: 12px;
    color: var(--ink-soft);
    margin-bottom: 2px;
}
.cd-value {
    display: block;
    font-size: 16px;
    font-weight: 700;
    color: var(--ink);
}

/* 문의 폼 박스 */
.contact-form-box {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 40px 36px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}
.contact-form-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 22px;
    font-weight: 800;
    margin: 0 0 28px;
    letter-spacing: -0.01em;
}
.cf-bar {
    width: 4px;
    height: 22px;
    background: var(--coral);
    border-radius: 2px;
}
.contact-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.form-group {
    display: flex;
    flex-direction: column;
}
.form-group label {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 8px;
}
.required {
    color: var(--coral);
}
.form-group input,
.form-group select,
.form-group textarea {
    padding: 14px 16px;
    font-size: 14px;
    font-family: inherit;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: #fafafa;
    color: var(--ink);
    transition: all 0.2s;
    width: 100%;
    box-sizing: border-box;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--forest);
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(45, 74, 62, 0.1);
}
.form-group input::placeholder,
.form-group textarea::placeholder {
    color: #b0b0b0;
}
.form-group textarea {
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
}
.form-group select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23666' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    background-size: 10px;
    padding-right: 40px;
}
.form-agree {
    padding: 16px;
    background: #fafafa;
    border-radius: 10px;
    border: 1px solid var(--border);
}
.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
}
.checkbox-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--forest);
    cursor: pointer;
}
.agree-detail {
    font-size: 11px;
    color: var(--ink-soft);
    margin-top: 8px;
    padding-left: 26px;
    line-height: 1.6;
}
.contact-submit {
    background: var(--ink);
    color: #ffffff;
    border: none;
    padding: 18px 28px;
    font-size: 16px;
    font-weight: 700;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    margin-top: 8px;
}
.contact-submit:hover {
    background: var(--forest);
    transform: translateY(-2px);
}
.contact-submit:disabled {
    background: #999;
    cursor: not-allowed;
    transform: none;
}
.form-message {
    padding: 20px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    display: none;
    margin-top: 16px;
}
.form-message.success {
    display: block;
    background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
    color: #1b5e20;
    border: 2px solid #66bb6a;
    box-shadow: 0 4px 16px rgba(76, 175, 80, 0.2);
    animation: messagePop 0.4s ease;
}
.form-message.error {
    display: block;
    background: linear-gradient(135deg, #ffebee, #ffcdd2);
    color: #b71c1c;
    border: 2px solid #ef5350;
    box-shadow: 0 4px 16px rgba(244, 67, 54, 0.2);
    animation: messagePop 0.4s ease;
}
@keyframes messagePop {
    0% { transform: scale(0.9); opacity: 0; }
    60% { transform: scale(1.02); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}

/* 모바일 */
@media (max-width: 900px) {
    .contact-section .container {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .contact-intro {
        position: static;
        text-align: center;
    }
    .contact-intro .cta-label { text-align: center; }
    .contact-direct-btn { flex-direction: row; text-align: left; }
    .contact-form-box { padding: 28px 24px; }
}

</style>
</head>
<body>

    <!-- 헤더 -->
    <header>
        <nav class="nav">
            <a href="/" class="logo">
                <img src="/brand.png" alt="마스터페이" class="logo-mark-img">
                마스터페이
            </a>
            
            <ul class="nav-menu" id="navMenu">
                <li><a href="/#find-sec">지역별 설치</a></li>
                <li><a href="/#allinone">제품 안내</a></li>
                <li><a href="/#process">프로세스</a></li>
                <li><a href="/#faq">자주 묻는 질문</a></li>
            </ul>
            
            <a href="/#contact" class="nav-cta">문의하기</a>
            <button class="mobile-toggle" onclick="toggleMenu()">☰</button>
        </nav>
    </header>

    <!-- 제품 히어로 -->
    <section class="product-hero">
        <div class="container">
            <div class="breadcrumb">
                <a href="/">홈</a>
                <span class="breadcrumb-separator">/</span>
                <a href="/#products">제품</a>
                <span class="breadcrumb-separator">/</span>
                <span>매장 철거</span>
            </div>
            
            <div class="product-grid">
                <div class="product-info">
                    <span class="product-badge">Removal</span>
                    <h1 class="product-title">
                        매장 철거
                    </h1>
                    <p class="product-lead">매장·사무실·가게 철거를 전문 엔지니어팀이 책임집니다. 철거부터 원상복구·폐기물 처리까지 원스톱으로 깔끔하게.</p>
                    
                    <div class="product-specs">
                    <div class="spec-item">
                        <div class="spec-label">Service</div>
                        <div class="spec-value">철거·원상복구</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Quote</div>
                        <div class="spec-value">무료 견적</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Guarantee</div>
                        <div class="spec-value">100% 사후 책임</div>
                    </div>
                    </div>
                    
                    <div class="product-cta">
                        <a href="/#contact" class="btn btn-primary">
                            무료 상담 신청 →
                        </a>
                        <a href="tel:010-2337-0458" class="btn btn-ghost">
                            📞 전화 상담
                        </a>
                    </div>
                </div>
                
                <div class="product-visual">
                    🔨
                </div>
            </div>
        </div>
    </section>

    <!-- 특징 섹션 -->
    <section class="features">
        <div class="container">
            <div class="section-header">
                <span class="section-num">01 / Features</span>
                <h2 class="section-title">
                    이런 특징이 있어요.
                </h2>
            </div>
            
            <div class="feature-grid">
                <div class="feature-item">
                    <div class="feature-icon">🏆</div>
                    <h3 class="feature-title">검증된 품질</h3>
                    <p class="feature-desc">업계에서 인정받은 최고의 모델만을 엄선하여 제공합니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">⚡</div>
                    <h3 class="feature-title">빠른 견적 확인 가능</h3>
                    <p class="feature-desc">매장 방문 또는 사진 견적으로 빠르게 비용을 확인할 수 있습니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">💰</div>
                    <h3 class="feature-title">합리적 비용</h3>
                    <p class="feature-desc">시세 대비 합리적인 가격으로 진행되며, 추가 비용 없는 투명한 견적을 제공합니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🔧</div>
                    <h3 class="feature-title">A/S 보장</h3>
                    <p class="feature-desc">장애 시 원격 지원과 현장 출동으로 빠르게 해결합니다.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 상세 내용 -->
    <section class="detail">
        <div class="container">
            <div class="section-header">
                <span class="section-num">02 / Details</span>
                <h2 class="section-title">
                    자세히 알아보기.
                </h2>
            </div>
            
            <div class="detail-content">
                
                <h3>전문 철거가 필요한 이유</h3>
                <p>매장이나 사무실 철거는 단순히 시설을 부수는 작업이 아닙니다. 안전 관리, 전기·배관 처리, 폐기물 분류, 원상복구, 임대인과의 분쟁 방지 등 수많은 고려 사항이 있습니다. 비전문 업체에 맡기면 보증금을 돌려받지 못하거나 예상치 못한 추가 비용이 발생할 수 있습니다.</p>
                <p>마스터페이는 전문 엔지니어팀을 보유하여 매장·사무실·가게 철거를 안전하고 깔끔하게 진행합니다. 정밀 현장 분석부터 철거, 폐기물 처리, 원상복구까지 원스톱으로 책임지며, 시공 보증서를 발급해 사후 하자도 100% 책임집니다.</p>
                
                <h3>매장 철거 프로세스</h3>
                <ul>
                    <li>1단계 무료 상담 — 철거 대상 매장의 위치·규모·용도를 확인합니다</li>
                    <li>2단계 현장 실측 — 전문 엔지니어가 방문하여 정밀 분석합니다</li>
                    <li>3단계 견적 확정 — 정찰제로 정확한 견적을 제시합니다 (추가 청구 없음)</li>
                    <li>4단계 철거 진행 — 전문 기사 팀이 안전하게 철거를 진행합니다</li>
                    <li>5단계 원상복구 — 바닥·벽면·천장을 깔끔하게 원상복구합니다</li>
                    <li>6단계 폐기물 처리 — 법규에 맞게 분류·수거·처리합니다</li>
                </ul>
                
                <h3>매장 철거 주요 서비스</h3>
                <ul>
                    <li>정밀 현장 분석 — 철거 전 구조물·배관·전기 상태를 파악하고 최적의 계획을 수립합니다</li>
                    <li>원스톱 원상복구 — 바닥·벽면·천장 원상복구까지 한번에 처리해 보증금 반환에 문제없습니다</li>
                    <li>폐기물 적법 처리 — 관련 법규에 맞게 분류·수거·처리합니다. 불법 투기 걱정 없이 안심하세요</li>
                    <li>실시간 공정 보고 — 진행 상황을 사진·영상으로 실시간 보고합니다</li>
                    <li>합리적 정찰제 — 현장 분석 후 견적을 확정하며, 추가 비용이 발생하지 않습니다</li>
                    <li>100% 사후 책임 — 철거 후 하자 발견 시 무상 보수하며, 시공 보증서를 발급합니다</li>
                </ul>
                
                <h3>이런 분들께 필요한 서비스입니다</h3>
                <p>매장을 폐업하고 원상복구가 필요한 사장님, 인테리어 변경을 위해 기존 시설을 철거해야 하는 경우, 임대 종료로 보증금 반환을 앞둔 세입자, 사무실 이전으로 기존 공간을 정리해야 하는 업체, 노후 시설을 한 번에 정리하고 싶은 건물주에게 필요합니다. 음식점·카페·편의점·미용실·사무실·공장 등 모든 업종의 철거를 진행합니다.</p>
                
                <h3>철거 비용 산정 기준</h3>
                <p>철거 비용은 매장 면적, 철거 범위, 폐기물 양, 층수와 접근성, 원상복구 정도에 따라 달라집니다. 일반적으로 10평 매장 기준 기본 철거는 100만원대부터 시작되며, 원상복구까지 포함하면 300~500만원 수준입니다. 정확한 비용은 현장 실측 후 정찰제로 확정되어, 공사 후 추가 청구가 없습니다.</p>
                
                <h3>보증금 반환을 위한 원상복구 팁</h3>
                <p>임대 종료 시 보증금을 100% 반환받으려면 원상복구가 매우 중요합니다. 임대인이 요구하는 수준은 임대차 계약서에 명시된 대로이지만, 일반적으로 임차 전 상태로 복구해야 합니다. 벽면 도배, 바닥 공사, 천장 복구, 전기·통신 설비 원복 등이 포함됩니다. 마스터페이는 임대차 계약서를 함께 검토하여 필요한 수준의 원상복구를 정확하게 진행합니다.</p>
                
                <h3>자주 묻는 질문</h3>
                <p><strong>Q. 견적은 어떻게 내나요?</strong><br>현장 실측 후 정확한 견적을 무료로 내드립니다. 정찰제로 운영되어 견적 대비 추가 청구가 없습니다.</p>
                <p><strong>Q. 언제까지 완료되나요?</strong><br>일반 매장 기준 3~7일 내 완료됩니다. 규모와 원상복구 범위에 따라 달라질 수 있습니다.</p>
                <p><strong>Q. 폐기물은 어떻게 처리되나요?</strong><br>관련 법규에 따라 분류·수거·처리합니다. 불법 투기 걱정 없이 안심하셔도 됩니다.</p>
                <p><strong>Q. 철거 후 하자가 생기면 어떻게 하나요?</strong><br>시공 보증서를 발급하며, 보증 기간 내 하자 발생 시 무상으로 보수해드립니다.</p>
                <p><strong>Q. 주말이나 야간 작업도 가능한가요?</strong><br>네, 매장 운영에 방해가 되지 않도록 주말·야간 작업도 진행합니다. 사전에 협의해드립니다.</p>
    
            </div>
        </div>
    </section>

    <!-- 관련 제품 -->
    <section class="related">
        <div class="container">
            <div class="section-header">
                <span class="section-num">03 / Related</span>
                <h2 class="section-title">
                    다른 제품도 둘러보세요.
                </h2>
            </div>
            
            <div class="related-grid">
                <a href="/product/pos" class="related-card">
                    <div class="related-icon">🖥️</div>
                    <div class="related-name">포스기</div>
                    <div class="related-desc">새 매장 셋업</div>
                </a>
                <a href="/product/kiosk" class="related-card">
                    <div class="related-icon">🤖</div>
                    <div class="related-name">키오스크</div>
                    <div class="related-desc">신규 설치</div>
                </a>
                <a href="/product/card-3inch" class="related-card">
                    <div class="related-icon">🖨️</div>
                    <div class="related-name">카드 단말기</div>
                    <div class="related-desc">새 장비 설치</div>
                </a>
            </div>
        </div>
    </section>

    <!-- 철거 진행 절차 7단계 -->
    <section class="removal-process" style="padding: 100px 0; background: var(--cream);">
        <div class="container">
            <div class="section-header" style="text-align: center; margin-bottom: 48px;">
                <span class="section-num" style="display: inline-block; padding: 6px 16px; background: var(--ink); color: var(--cream); border-radius: 100px; font-size: 12px; font-weight: 700; letter-spacing: 2px; margin-bottom: 16px;">02 / Process</span>
                <h2 class="section-title" style="font-size: clamp(28px, 4vw, 40px); font-weight: 800; letter-spacing: -0.02em; margin: 0;">
                    체계적인 7단계 철거 진행 절차
                </h2>
                <p style="font-size: 15px; color: var(--ink-soft); margin: 16px 0 0; line-height: 1.7;">
                    마스터페이의 철거는 즉흥적으로 진행되지 않습니다.<br>
                    안전하고 합법적인 작업을 위해 체계화된 7단계 프로세스를 따릅니다.
                </p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; max-width: 1100px; margin: 0 auto;">
                
                <div style="background: #ffffff; border: 1px solid var(--border); border-radius: 16px; padding: 28px 24px; transition: all 0.3s;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                        <div style="width: 40px; height: 40px; background: var(--ink); color: var(--cream); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 16px;">1</div>
                        <h3 style="margin: 0; font-size: 17px; font-weight: 800; color: var(--ink);">전국 지점 무료 상담</h3>
                    </div>
                    <ul style="list-style: none; padding: 0; margin: 0; font-size: 13px; color: var(--ink-soft); line-height: 1.8;">
                        <li>✓ 고객의 상황에 맞는 무료 상담</li>
                        <li>✓ 희망리턴패키지 안내</li>
                        <li>✓ 전화·카톡 즉시 응대</li>
                    </ul>
                </div>

                <div style="background: #ffffff; border: 1px solid var(--border); border-radius: 16px; padding: 28px 24px;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                        <div style="width: 40px; height: 40px; background: var(--ink); color: var(--cream); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 16px;">2</div>
                        <h3 style="margin: 0; font-size: 17px; font-weight: 800; color: var(--ink);">현장 답사</h3>
                    </div>
                    <ul style="list-style: none; padding: 0; margin: 0; font-size: 13px; color: var(--ink-soft); line-height: 1.8;">
                        <li>✓ 현장 주변 구조·높이·지하층 파악</li>
                        <li>✓ 전기·수도·가스 위치 확인</li>
                        <li>✓ 작업 시간·교통 흐름 체크</li>
                    </ul>
                </div>

                <div style="background: #ffffff; border: 1px solid var(--border); border-radius: 16px; padding: 28px 24px;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                        <div style="width: 40px; height: 40px; background: var(--ink); color: var(--cream); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 16px;">3</div>
                        <h3 style="margin: 0; font-size: 17px; font-weight: 800; color: var(--ink);">신고 및 협의</h3>
                    </div>
                    <ul style="list-style: none; padding: 0; margin: 0; font-size: 13px; color: var(--ink-soft); line-height: 1.8;">
                        <li>✓ 관할 구청에 단전·단수 신고</li>
                        <li>✓ 분진 방지 살수용으로 1선 유지</li>
                        <li>✓ 멸실 신고 및 폐기물 발생 신고</li>
                        <li>✓ 인근 주민들과 협의</li>
                    </ul>
                </div>

                <div style="background: #ffffff; border: 1px solid var(--border); border-radius: 16px; padding: 28px 24px;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                        <div style="width: 40px; height: 40px; background: var(--ink); color: var(--cream); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 16px;">4</div>
                        <h3 style="margin: 0; font-size: 17px; font-weight: 800; color: var(--ink);">가설 작업</h3>
                    </div>
                    <ul style="list-style: none; padding: 0; margin: 0; font-size: 13px; color: var(--ink-soft); line-height: 1.8;">
                        <li>✓ 건물 주변 분진 방지막 설치</li>
                        <li>✓ 낙석 방지 방음판 설치</li>
                        <li>✓ 안전 펜스 및 표지판 부착</li>
                    </ul>
                </div>

                <div style="background: #ffffff; border: 1px solid var(--border); border-radius: 16px; padding: 28px 24px;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                        <div style="width: 40px; height: 40px; background: var(--ink); color: var(--cream); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 16px;">5</div>
                        <h3 style="margin: 0; font-size: 17px; font-weight: 800; color: var(--ink);">계획 수립</h3>
                    </div>
                    <ul style="list-style: none; padding: 0; margin: 0; font-size: 13px; color: var(--ink-soft); line-height: 1.8;">
                        <li>✓ 해체물 종류·규모에 맞는 공법 선정</li>
                        <li>✓ 공정표 작성</li>
                        <li>✓ 소음·분진·진동 대책 수립</li>
                        <li>✓ 안전 관리 계획 수립</li>
                    </ul>
                </div>

                <div style="background: #ffffff; border: 1px solid var(--border); border-radius: 16px; padding: 28px 24px;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                        <div style="width: 40px; height: 40px; background: var(--ink); color: var(--cream); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 16px;">6</div>
                        <h3 style="margin: 0; font-size: 17px; font-weight: 800; color: var(--ink);">해체 작업</h3>
                    </div>
                    <ul style="list-style: none; padding: 0; margin: 0; font-size: 13px; color: var(--ink-soft); line-height: 1.8;">
                        <li>✓ 내부·외부 철거 동시 진행</li>
                        <li>✓ 전기·용접·가스·목공 부분 철거</li>
                        <li>✓ 폐기물 분리 작업·운반</li>
                        <li>✓ RC조 구조물 그라샤 철거</li>
                        <li>✓ 양수발전기 가동·살수 진행</li>
                    </ul>
                </div>

                <div style="background: #ffffff; border: 2px solid var(--coral); border-radius: 16px; padding: 28px 24px; grid-column: 1 / -1; max-width: 600px; margin: 0 auto;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                        <div style="width: 40px; height: 40px; background: var(--coral); color: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 16px;">7</div>
                        <h3 style="margin: 0; font-size: 17px; font-weight: 800; color: var(--ink);">공사 완료 및 검토</h3>
                    </div>
                    <ul style="list-style: none; padding: 0; margin: 0; font-size: 13px; color: var(--ink-soft); line-height: 1.8;">
                        <li>✓ 철거 폐기물 반출</li>
                        <li>✓ 혼합 폐기물과 건설 폐기물 분리</li>
                        <li>✓ 건축물대장 말소 신고 (필요 시)</li>
                        <li>✓ 최종 점검 및 인계</li>
                    </ul>
                </div>

            </div>
        </div>
    </section>

    <!-- 마스터페이 강점 3가지 -->
    <section class="removal-why" style="padding: 100px 0; background: var(--cream-dark);">
        <div class="container">
            <div class="section-header" style="text-align: center; margin-bottom: 48px;">
                <span class="section-num" style="display: inline-block; padding: 6px 16px; background: var(--ink); color: var(--cream); border-radius: 100px; font-size: 12px; font-weight: 700; letter-spacing: 2px; margin-bottom: 16px;">03 / Why Mastarpay</span>
                <h2 class="section-title" style="font-size: clamp(28px, 4vw, 40px); font-weight: 800; letter-spacing: -0.02em; margin: 0;">
                    왜 마스터페이여야 할까요?
                </h2>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; max-width: 1000px; margin: 0 auto;">
                
                <div style="background: #ffffff; border: 1px solid var(--border); border-radius: 20px; padding: 36px 28px; text-align: center;">
                    <div style="font-size: 56px; margin-bottom: 16px;">📋</div>
                    <h3 style="margin: 0 0 12px; font-size: 19px; font-weight: 800; color: var(--ink);">100% 무료<br>방문 견적 서비스</h3>
                    <p style="font-size: 13px; color: var(--ink-soft); line-height: 1.7; margin: 0;">전국 어디든 직접 방문하여 무료로 상세 견적을 제공합니다. 견적은 정확하고 추가 비용 없이 투명하게 진행됩니다.</p>
                </div>

                <div style="background: #ffffff; border: 2px solid var(--coral); border-radius: 20px; padding: 36px 28px; text-align: center; position: relative;">
                    <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--coral); color: #ffffff; padding: 4px 14px; border-radius: 100px; font-size: 11px; font-weight: 700; letter-spacing: 1px;">BEST</div>
                    <div style="font-size: 56px; margin-bottom: 16px;">💰</div>
                    <h3 style="margin: 0 0 12px; font-size: 19px; font-weight: 800; color: var(--ink);">전국 최저가<br>가격 보증</h3>
                    <p style="font-size: 13px; color: var(--ink-soft); line-height: 1.7; margin: 0;">마스터페이 원상복구는 전국 최저가를 보증합니다. 다른 곳에서 더 저렴한 견적을 받으셨다면 알려주세요.</p>
                </div>

                <div style="background: #ffffff; border: 1px solid var(--border); border-radius: 20px; padding: 36px 28px; text-align: center;">
                    <div style="font-size: 56px; margin-bottom: 16px;">🛡️</div>
                    <h3 style="margin: 0 0 12px; font-size: 19px; font-weight: 800; color: var(--ink);">모든 현장 AS<br>1년 책임 보증</h3>
                    <p style="font-size: 13px; color: var(--ink-soft); line-height: 1.7; margin: 0;">철거 후에도 발생할 수 있는 모든 문제를 1년간 책임집니다. 임대인 인계 후 발생하는 이슈도 함께 해결합니다.</p>
                </div>

            </div>
        </div>
    </section>

    <!-- 폐업 원상복구 + 정부지원금 -->
    <section class="removal-support" style="padding: 100px 0; background: var(--cream);">
        <div class="container" style="max-width: 900px;">
            <div style="background: linear-gradient(135deg, #2d4a3e, #1a1a1a); color: #ffffff; border-radius: 24px; padding: 48px 40px; text-align: center;">
                <div style="display: inline-block; padding: 6px 16px; background: var(--coral); color: #ffffff; border-radius: 100px; font-size: 12px; font-weight: 700; letter-spacing: 2px; margin-bottom: 20px;">정부 지원금 활용 가능</div>
                <h2 style="font-size: clamp(26px, 3.5vw, 36px); font-weight: 800; letter-spacing: -0.02em; margin: 0 0 16px;">
                    폐업 원상복구 패키지
                </h2>
                <p style="font-size: 16px; line-height: 1.8; opacity: 0.9; margin: 0 0 32px;">
                    대한민국 NO.1 소상공인 폐업 지원 패키지!<br>
                    마스터페이 폐업원상복구는 소상공인 분들의 철거 공사를<br>
                    정부지원금 중 하나인 <strong style="color: var(--coral);">"폐업점포철거지원금"</strong>으로<br>
                    철거 및 원상복구 공사를 진행할 수 있도록 도와드립니다.
                </p>
                <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                    <a href="tel:010-2337-0458" style="display: inline-block; padding: 14px 28px; background: var(--cream); color: var(--ink); border-radius: 100px; text-decoration: none; font-weight: 700; font-size: 15px;">📞 010-2337-0458</a>
                    <a href="#contact" style="display: inline-block; padding: 14px 28px; background: transparent; color: var(--cream); border: 1px solid rgba(255,255,255,0.3); border-radius: 100px; text-decoration: none; font-weight: 700; font-size: 15px;">💬 무료 상담</a>
                </div>
            </div>
        </div>
    </section>

    <!-- 고객 만족도 100% -->
    <section class="removal-satisfaction" style="padding: 100px 0; background: var(--cream-dark);">
        <div class="container" style="max-width: 1000px;">
            <div class="section-header" style="text-align: center; margin-bottom: 48px;">
                <span class="section-num" style="display: inline-block; padding: 6px 16px; background: var(--ink); color: var(--cream); border-radius: 100px; font-size: 12px; font-weight: 700; letter-spacing: 2px; margin-bottom: 16px;">04 / Satisfaction</span>
                <h2 class="section-title" style="font-size: clamp(28px, 4vw, 40px); font-weight: 800; letter-spacing: -0.02em; margin: 0;">
                    고객 만족도 100%의 이유
                </h2>
                <p style="font-size: 15px; color: var(--ink-soft); margin: 16px 0 0;">전국 그 어느 업체보다 정확하고 깔끔하게 처리합니다</p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
                <div style="background: #ffffff; border: 1px solid var(--border); border-radius: 16px; padding: 28px 24px; text-align: center;">
                    <div style="font-size: 36px; margin-bottom: 12px;">⭐</div>
                    <div style="font-weight: 800; font-size: 16px; color: var(--ink); margin-bottom: 6px;">처음처럼 원상복구</div>
                    <div style="font-size: 12px; color: var(--ink-soft); line-height: 1.6;">입주 전 상태로 깔끔하게</div>
                </div>
                <div style="background: #ffffff; border: 1px solid var(--border); border-radius: 16px; padding: 28px 24px; text-align: center;">
                    <div style="font-size: 36px; margin-bottom: 12px;">⚡</div>
                    <div style="font-weight: 800; font-size: 16px; color: var(--ink); margin-bottom: 6px;">빠른 견적</div>
                    <div style="font-size: 12px; color: var(--ink-soft); line-height: 1.6;">사진 견적 즉시 가능</div>
                </div>
                <div style="background: #ffffff; border: 1px solid var(--border); border-radius: 16px; padding: 28px 24px; text-align: center;">
                    <div style="font-size: 36px; margin-bottom: 12px;">💼</div>
                    <div style="font-weight: 800; font-size: 16px; color: var(--ink); margin-bottom: 6px;">집기 매입</div>
                    <div style="font-size: 12px; color: var(--ink-soft); line-height: 1.6;">최고가 매입 시스템</div>
                </div>
                <div style="background: #ffffff; border: 1px solid var(--border); border-radius: 16px; padding: 28px 24px; text-align: center;">
                    <div style="font-size: 36px; margin-bottom: 12px;">📞</div>
                    <div style="font-weight: 800; font-size: 16px; color: var(--ink); margin-bottom: 6px;">즉시 매입</div>
                    <div style="font-size: 12px; color: var(--ink-soft); line-height: 1.6;">현장에서 바로 결정</div>
                </div>
            </div>

            <div style="text-align: center; margin-top: 40px; padding: 32px; background: #ffffff; border-radius: 20px; border: 1px solid var(--border);">
                <p style="font-size: 16px; color: var(--ink); line-height: 1.8; margin: 0 0 12px; font-weight: 600;">
                    처치곤란 집기 때문에 고민이신가요?
                </p>
                <p style="font-size: 15px; color: var(--ink-soft); line-height: 1.8; margin: 0;">
                    최고가 매입 시스템을 통해<br>
                    <strong style="color: var(--coral); font-size: 18px;">빠른 견적 ! 즉시 매입 ! 가격 2배 !</strong>
                </p>
            </div>
        </div>
    </section>

    <!-- CTA -->
    <section class="contact-section" id="contact">
        <div class="container">
            <div class="contact-intro">
                <div class="cta-label">— Contact Us —</div>
                <h2 class="contact-title">무료 상담 신청</h2>
                <p class="contact-sub">전화, 카카오톡 또는 아래 폼으로 문의해주세요.<br>담당자가 빠르게 연락드립니다.</p>
                <div class="contact-direct">
                    <a href="tel:010-2337-0458" class="contact-direct-btn">
                        <span class="cd-icon">📞</span>
                        <span><span class="cd-label">전화 상담</span><span class="cd-value">010-2337-0458</span></span>
                    </a>
                    <a href="javascript:void(0)" onclick="openKakao(); return false;" class="contact-direct-btn">
                        <span class="cd-icon">💬</span>
                        <span><span class="cd-label">카카오톡</span><span class="cd-value">바로 상담</span></span>
                    </a>
                </div>
            </div>
            <div class="contact-form-box">
                <h3 class="contact-form-title"><span class="cf-bar"></span><span>📝 온라인 문의</span></h3>
                <form id="contactForm" class="contact-form" onsubmit="return submitContactForm(event)">
                    <div class="form-group"><label for="name">상호(이름) <span class="required">*</span></label><input type="text" id="name" name="상호_이름" placeholder="상호 또는 이름을 입력하세요" required></div>
                    <div class="form-group"><label for="phone">연락처 <span class="required">*</span></label><input type="tel" id="phone" name="연락처" placeholder="010-0000-0000" required></div>
                    <div class="form-group"><label for="address">주소 <span class="required">*</span></label><input type="text" id="address" name="주소" placeholder="매장 주소" required><input type="text" id="address_detail" name="상세주소" placeholder="상세주소 (건물명, 층, 호수 등)" style="margin-top: 8px;"></div>
                    <div class="form-group"><label for="product">문의 제품 <span class="required">*</span></label><select id="product" name="문의_제품" required><option value="">선택해주세요</option><option value="포스기">포스기(POS)</option><option value="2인치 단말기">2인치 단말기</option><option value="3인치 단말기">3인치 단말기</option><option value="토스 단말기">토스 단말기</option><option value="무선 단말기">무선 단말기</option><option value="블루투스 단말기">블루투스 단말기</option><option value="키오스크">키오스크</option><option value="미니 키오스크">미니 키오스크</option><option value="테이블 오더">테이블 오더</option><option value="매장 철거">매장 철거</option><option value="여러 제품 패키지">여러 제품 패키지</option><option value="기타/미정">기타/미정</option></select></div>
                    <div class="form-group"><label for="business">업종</label><select id="business" name="업종"><option value="">선택해주세요</option><option value="음식점/식당">음식점/식당</option><option value="카페/베이커리">카페/베이커리</option><option value="편의점/마트">편의점/마트</option><option value="미용실/네일샵">미용실/네일샵</option><option value="스터디카페">스터디카페</option><option value="주점/호프">주점/호프</option><option value="무인매장">무인매장</option><option value="의류/잡화">의류/잡화</option><option value="병원/약국">병원/약국</option><option value="기타">기타</option></select></div>
                    <div class="form-group"><label for="message">문의 내용</label><textarea id="message" name="문의_내용" rows="5" placeholder="매장 위치, 현재 사용 장비, 궁금한 점 등을 자유롭게 적어주세요."></textarea></div>
                    <div class="form-agree"><label class="checkbox-label"><input type="checkbox" id="agree" required><span>개인정보 수집 및 이용에 동의합니다 <span class="required">*</span></span></label><div class="agree-detail">수집항목: 상호·연락처·주소·문의 내용 / 이용목적: 상담 및 견적 안내 / 보유기간: 3년</div></div>
                    <button type="submit" class="contact-submit" id="submitBtn"><span id="submitText">무료 상담 신청하기 →</span></button>
                    <div id="formMessage" class="form-message"></div>
                </form>
            </div>
        </div>
    </section>

    <!-- 푸터 -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="logo">
                        <img src="/brand.png" alt="마스터페이" class="logo-mark-img">
                        마스터페이
                    </div>
                    <p>매장 운영에 필요한 모든 장비<br>설치부터 A/S까지 한번에.</p>
                </div>
                
                <div class="footer-col">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="tel:010-2337-0458">📞 010-2337-0458</a></li>
                        <li><a href="https://pf.kakao.com/_fPrxbG/chat" target="_blank">💬 카카오톡 상담</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <span>© 2026 마스터페이. All rights reserved.</span>
                <span>개인정보처리방침 · 이용약관</span>
            </div>
        </div>
    </footer>

    <script>
        function toggleMenu() {
            document.getElementById('navMenu').classList.toggle('active');
        }
        function openKakao(){
          var url='https://pf.kakao.com/_fPrxbG/chat';
          var w=window.open(url,'_blank');
          if(!w||w.closed||typeof w.closed==='undefined'){window.location.href=url;}
        }
        function scrollToContact(event){
          if(event)event.preventDefault();
          var c=document.getElementById('contact');
          if(c){
            var top=c.getBoundingClientRect().top+window.pageYOffset-80;
            window.scrollTo({top:top,behavior:'smooth'});
          }else{window.location.href='/#contact';}
        }
        async function submitContactForm(event){
          if(event){event.preventDefault();event.stopPropagation();}
          var form=document.getElementById('contactForm');
          var submitBtn=document.getElementById('submitBtn');
          var submitText=document.getElementById('submitText');
          var formMessage=document.getElementById('formMessage');
          if(!form){alert('⚠️ 폼을 찾을 수 없습니다.');return false;}
          var agreeCheckbox=document.getElementById('agree');
          if(!agreeCheckbox||!agreeCheckbox.checked){alert('개인정보 수집 및 이용에 동의해주세요.');return false;}
          var name=document.getElementById('name').value.trim();
          var phone=document.getElementById('phone').value.trim();
          var address=document.getElementById('address').value.trim();
          var product=document.getElementById('product').value;
          if(!name){alert('상호(이름)을 입력해주세요.');document.getElementById('name').focus();return false;}
          if(!phone){alert('연락처를 입력해주세요.');document.getElementById('phone').focus();return false;}
          if(!address){alert('주소를 입력해주세요.');document.getElementById('address').focus();return false;}
          if(!product){alert('문의 제품을 선택해주세요.');document.getElementById('product').focus();return false;}
          if(submitBtn)submitBtn.disabled=true;
          if(submitText)submitText.textContent='전송 중...';
          if(formMessage){formMessage.className='form-message';formMessage.style.display='none';}
          var data={name:name,phone:phone,address:address,addressDetail:document.getElementById('address_detail').value.trim(),product:product,business:document.getElementById('business').value,message:document.getElementById('message').value.trim()};
          var result;
          try{
            var response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
            result=await response.json();
            if(result.success){
              if(formMessage){formMessage.className='form-message success';formMessage.style.display='block';formMessage.innerHTML='<div style="text-align:center;padding:24px 20px;"><div style="font-size:48px;margin-bottom:12px;">✅</div><div style="font-size:18px;font-weight:800;color:#2e7d32;margin-bottom:8px;">문의가 성공적으로 접수되었습니다!</div><div style="font-size:14px;color:#555;">24시간 이내에 연락드리겠습니다.<br>급하신 경우 <strong>010-2337-0458</strong>로 연락주세요.</div></div>';}
              form.reset();
              setTimeout(function(){if(formMessage)formMessage.scrollIntoView({behavior:'smooth',block:'center'});},100);
            }else{throw new Error(result.error||'전송에 실패했습니다.');}
          }catch(error){
            var errorMsg=error.message||'전송에 실패했습니다';
            if(formMessage){formMessage.className='form-message error';formMessage.style.display='block';formMessage.innerHTML='<div style="text-align:center;padding:20px;"><div style="font-size:40px;margin-bottom:10px;">❌</div><div style="font-size:16px;font-weight:700;margin-bottom:8px;">전송에 실패했습니다</div><div style="font-size:13px;margin-bottom:12px;color:#555;">'+errorMsg+'</div><div style="font-size:14px;margin-top:12px;"><strong>📞 010-2337-0458</strong><br>또는 카카오톡으로 문의해주세요.</div></div>';formMessage.scrollIntoView({behavior:'smooth',block:'center'});}
          }finally{
            if(submitBtn)submitBtn.disabled=false;
            if(submitText)submitText.textContent='무료 상담 신청하기 →';
          }
          return false;
        }
    </script>

</body>
</html>`;

// ============================================================
// 지역 데이터 (17개 시도 + 264개 시군구 + 5,066개 동)
// ============================================================
const REGIONS = {"seoul":{"name":"서울특별시","gus":{"종로구":["청운동","신교동","궁정동","효자동","창성동","통의동","적선동","통인동","누상동","누하동","옥인동","체부동","필운동","내자동","사직동","도렴동","당주동","내수동","세종로","신문로1가","신문로2가","청진동","서린동","수송동","중학동","종로1가","공평동","관훈동","견지동","와룡동","권농동","운니동","익선동","경운동","관철동","인사동","낙원동","종로2가","팔판동","삼청동","안국동","소격동","화동","사간동","송현동","가회동","재동","계동","원서동","훈정동","묘동","봉익동","돈의동","장사동","관수동","종로3가","인의동","예지동","원남동","연지동","종로4가","효제동","종로5가","종로6가","이화동","연건동","충신동","동숭동","혜화동","명륜1가","명륜2가","명륜4가","명륜3가","창신동","숭인동","교남동","평동","송월동","홍파동","교북동","행촌동","구기동","평창동","부암동","홍지동","신영동","무악동"],"중구":["무교동","다동","태평로1가","을지로1가","을지로2가","남대문로1가","삼각동","수하동","장교동","수표동","소공동","남창동","북창동","태평로2가","남대문로2가","남대문로3가","남대문로4가","남대문로5가","봉래동1가","봉래동2가","회현동1가","회현동2가","회현동3가","충무로1가","충무로2가","명동1가","명동2가","남산동1가","남산동2가","남산동3가","저동1가","충무로4가","충무로5가","인현동2가","예관동","묵정동","필동1가","필동2가","필동3가","남학동","주자동","예장동","장충동1가","장충동2가","광희동1가","광희동2가","쌍림동","을지로6가","을지로7가","을지로4가","을지로5가","주교동","방산동","오장동","을지로3가","입정동","산림동","충무로3가","초동","인현동1가","저동2가","신당동","흥인동","무학동","황학동","서소문동","정동","순화동","의주로1가","충정로1가","중림동","의주로2가","만리동1가","만리동2가"],"용산구":["후암동","용산동2가","용산동4가","갈월동","남영동","용산동1가","동자동","서계동","청파동1가","청파동2가","청파동3가","원효로1가","원효로2가","신창동","산천동","청암동","원효로3가","원효로4가","효창동","도원동","용문동","문배동","신계동","한강로1가","한강로2가","용산동3가","용산동5가","한강로3가","이촌동","이태원동","한남동","동빙고동","서빙고동","주성동","용산동6가","보광동"],"성동구":["상왕십리동","하왕십리동","홍익동","도선동","마장동","사근동","행당동","응봉동","금호동1가","금호동2가","금호동3가","금호동4가","옥수동","성수동1가","성수동2가","송정동","용답동"],"광진구":["중곡동","능동","구의동","광장동","자양동","화양동","군자동"],"동대문구":["신설동","용두동","제기동","전농동","답십리동","장안동","청량리동","회기동","휘경동","이문동"],"중랑구":["면목동","상봉동","중화동","묵동","망우동","신내동"],"성북구":["성북동","성북동1가","돈암동","동소문동1가","동소문동2가","동소문동3가","동소문동4가","동소문동5가","동소문동6가","동소문동7가","삼선동1가","삼선동2가","삼선동3가","삼선동4가","삼선동5가","동선동1가","동선동2가","동선동3가","동선동4가","동선동5가","안암동1가","안암동2가","안암동3가","안암동4가","안암동5가","보문동4가","보문동5가","보문동6가","보문동7가","보문동1가","보문동2가","보문동3가","정릉동","길음동","종암동","하월곡동","상월곡동","장위동","석관동"],"강북구":["미아동","번동","수유동","우이동"],"도봉구":["쌍문동","방학동","창동","도봉동"],"노원구":["월계동","공릉동","하계동","상계동","중계동"],"은평구":["수색동","녹번동","불광동","갈현동","구산동","대조동","응암동","역촌동","신사동","증산동","진관동"],"서대문구":["충정로2가","충정로3가","합동","미근동","냉천동","천연동","옥천동","영천동","현저동","북아현동","홍제동","대현동","대신동","신촌동","봉원동","창천동","연희동","홍은동","북가좌동","남가좌동"],"마포구":["아현동","공덕동","신공덕동","도화동","용강동","토정동","마포동","대흥동","염리동","노고산동","신수동","현석동","구수동","창전동","상수동","하중동","신정동","당인동","서교동","동교동","합정동","망원동","연남동","성산동","중동","상암동"],"양천구":["신정동","목동","신월동"],"강서구":["염창동","등촌동","화곡동","가양동","마곡동","내발산동","외발산동","공항동","방화동","개화동","과해동","오곡동","오쇠동"],"구로구":["신도림동","구로동","가리봉동","고척동","개봉동","오류동","궁동","온수동","천왕동","항동"],"금천구":["가산동","독산동","시흥동"],"영등포구":["영등포동","영등포동1가","영등포동2가","영등포동3가","영등포동4가","영등포동5가","영등포동6가","영등포동7가","영등포동8가","여의도동","당산동1가","당산동2가","당산동3가","당산동4가","당산동5가","당산동6가","당산동","도림동","문래동1가","문래동2가","문래동3가","문래동4가","문래동5가","문래동6가","양평동1가","양평동2가","양평동3가","양평동4가","양평동5가","양평동6가","양화동","신길동","대림동","양평동"],"동작구":["노량진동","상도동","상도1동","본동","흑석동","동작동","사당동","대방동","신대방동"],"관악구":["봉천동","신림동","남현동"],"서초구":["방배동","양재동","우면동","원지동","잠원동","반포동","서초동","내곡동","염곡동","신원동"],"강남구":["역삼동","개포동","청담동","삼성동","대치동","신사동","논현동","압구정동","세곡동","자곡동","율현동","일원동","수서동","도곡동"],"송파구":["잠실동","신천동","풍납동","송파동","석촌동","삼전동","가락동","문정동","장지동","방이동","오금동","거여동","마천동"],"강동구":["명일동","고덕동","상일동","길동","둔촌동","암사동","성내동","천호동","강일동"]}},"busan":{"name":"부산광역시","gus":{"중구":["영주동","대창동1가","대창동2가","중앙동1가","중앙동2가","중앙동3가","중앙동4가","중앙동5가","중앙동6가","중앙동7가","동광동1가","동광동2가","동광동3가","동광동4가","동광동5가","대청동1가","대청동2가","대청동3가","대청동4가","보수동1가","보수동2가","보수동3가","부평동1가","부평동2가","부평동3가","부평동4가","신창동1가","신창동2가","신창동3가","신창동4가","창선동1가","창선동2가","광복동1가","광복동2가","광복동3가","남포동1가","남포동2가","남포동3가","남포동4가","남포동5가","남포동6가"],"서구":["동대신동1가","동대신동2가","동대신동3가","서대신동1가","서대신동2가","서대신동3가","부용동1가","부용동2가","부민동1가","부민동2가","부민동3가","토성동1가","토성동2가","토성동3가","아미동1가","아미동2가","토성동4가","토성동5가","초장동","충무동1가","충무동2가","충무동3가","남부민동","암남동"],"동구":["초량동","수정동","좌천동","범일동"],"영도구":["대교동1가","대교동2가","대평동1가","대평동2가","남항동1가","남항동2가","남항동3가","영선동1가","영선동2가","영선동3가","영선동4가","신선동1가","신선동2가","신선동3가","봉래동1가","봉래동2가","봉래동3가","봉래동4가","봉래동5가","청학동","동삼동"],"부산진구":["양정동","전포동","부전동","범천동","범전동","연지동","초읍동","부암동","당감동","가야동","개금동"],"동래구":["명장동","안락동","칠산동","낙민동","복천동","수안동","명륜동","온천동","사직동"],"남구":["대연동","용호동","용당동","문현동","우암동","감만동"],"북구":["금곡동","화명동","만덕동","덕천동","구포동"],"해운대구":["반송동","석대동","반여동","재송동","우동","중동","좌동","송정동"],"사하구":["괴정동","당리동","하단동","신평동","장림동","다대동","구평동","감천동"],"금정구":["두구동","노포동","청룡동","남산동","선동","오륜동","구서동","장전동","부곡동","서동","금사동","회동동","금성동"],"강서구":["대저1동","대저2동","강동동","명지동","죽림동","식만동","죽동동","봉림동","송정동","화전동","녹산동","생곡동","구랑동","지사동","미음동","범방동","신호동","동선동","성북동","눌차동","천성동","대항동"],"연제구":["거제동","연산동"],"수영구":["망미동","수영동","민락동","광안동","남천동"],"사상구":["삼락동","모라동","덕포동","괘법동","감전동","주례동","학장동","엄궁동"],"기장군":["기장읍","장안읍","정관읍","일광읍","철마면"]}},"daegu":{"name":"대구광역시","gus":{"중구":["동인동1가","동인동2가","동인동3가","동인동4가","삼덕동1가","삼덕동2가","삼덕동3가","봉산동","장관동","상서동","수동","덕산동","종로1가","종로2가","사일동","동일동","남일동","전동","동성로3가","동문동","문화동","공평동","동성로2가","태평로1가","교동","용덕동","상덕동","완전동","도원동","수창동","태평로3가","인교동","서야동","서성로1가","시장북로","하서동","남성로","계산동1가","계산동2가","동산동","서문로2가","서성로2가","포정동","서문로1가","서내동","북성로2가","대안동","동성로1가","태평로2가","북성로1가","화전동","향촌동","북내동","대신동","달성동","남산동","대봉동"],"동구":["신암동","신천동","효목동","평광동","봉무동","불로동","도동","지저동","입석동","검사동","방촌동","둔산동","부동","신평동","서호동","동호동","신기동","율하동","용계동","율암동","상매동","매여동","각산동","신서동","동내동","괴전동","금강동","대림동","사복동","숙천동","내곡동","능성동","진인동","도학동","백안동","미곡동","용수동","신무동","미대동","내동","신용동","중대동","송정동","덕곡동","지묘동"],"서구":["내당동","비산동","평리동","상리동","중리동","이현동","원대동1가","원대동2가","원대동3가"],"남구":["이천동","봉덕동","대명동"],"북구":["칠성동1가","칠성동2가","고성동1가","고성동2가","고성동3가","침산동","노원동1가","노원동2가","노원동3가","대현동","산격동","복현동","검단동","동변동","서변동","조야동","노곡동","읍내동","동호동","학정동","도남동","국우동","구암동","동천동","관음동","태전동","매천동","팔달동","금호동","사수동","연경동"],"수성구":["범어동","만촌동","수성동1가","수성동2가","수성동3가","수성동4가","황금동","중동","상동","파동","두산동","지산동","범물동","시지동","매호동","성동","사월동","신매동","욱수동","노변동","삼덕동","연호동","이천동","고모동","가천동","대흥동"],"달서구":["성당동","두류동","파호동","호림동","갈산동","신당동","이곡동","장동","장기동","용산동","죽전동","감삼동","본리동","상인동","도원동","진천동","유천동","대천동","월성동","월암동","송현동","대곡동","본동","호산동"],"달성군":["화원읍","논공읍","다사읍","유가읍","옥포읍","현풍읍","가창면","하빈면","구지면"],"군위군":["군위읍","소보면","효령면","부계면","우보면","의흥면","산성면","삼국유사면"]}},"incheon":{"name":"인천광역시","gus":{"중구":["중앙동1가","중앙동2가","중앙동3가","중앙동4가","해안동1가","해안동2가","해안동3가","해안동4가","관동1가","관동2가","관동3가","항동1가","항동2가","항동3가","항동4가","항동5가","항동6가","항동7가","송학동1가","송학동2가","송학동3가","사동","신생동","신포동","답동","신흥동1가","신흥동2가","신흥동3가","선화동","유동","율목동","도원동","내동","경동","용동","인현동","전동","북성동1가","북성동2가","북성동3가","선린동","송월동1가","송월동2가","송월동3가","중산동","운남동","운서동","운북동","을왕동","남북동","덕교동","무의동"],"동구":["만석동","화수동","송현동","화평동","창영동","금곡동","송림동"],"미추홀구":["숭의동","용현동","학익동","도화동","주안동","관교동","문학동"],"연수구":["옥련동","선학동","연수동","청학동","동춘동","송도동"],"남동구":["구월동","간석동","만수동","장수동","서창동","운연동","남촌동","수산동","도림동","논현동","고잔동"],"부평구":["부평동","십정동","산곡동","청천동","삼산동","갈산동","부개동","일신동","구산동"],"계양구":["효성동","계산동","작전동","서운동","임학동","용종동","병방동","방축동","박촌동","동양동","귤현동","상야동","하야동","평동","노오지동","선주지동","이화동","오류동","갈현동","둑실동","목상동","다남동","장기동"],"서구":["백석동","시천동","검암동","경서동","공촌동","연희동","심곡동","가정동","신현동","석남동","원창동","가좌동","마전동","당하동","원당동","대곡동","금곡동","오류동","왕길동","불로동","청라동"],"강화군":["강화읍","선원면","불은면","길상면","화도면","양도면","내가면","하점면","양사면","송해면","교동면","삼산면","서도면"],"옹진군":["북도면","백령면","대청면","덕적면","영흥면","자월면","연평면"]}},"gwangju":{"name":"광주광역시","gus":{"동구":["대인동","금남로5가","충장로5가","수기동","대의동","궁동","장동","동명동","계림동","산수동","지산동","남동","광산동","금동","호남동","불로동","황금동","서석동","소태동","용연동","운림동","학동","월남동","선교동","내남동","용산동","충장로1가","충장로2가","충장로3가","충장로4가","금남로1가","금남로2가","금남로3가","금남로4가"],"서구":["양동","농성동","광천동","유촌동","덕흥동","쌍촌동","화정동","치평동","내방동","서창동","세하동","용두동","풍암동","벽진동","금호동","마륵동","매월동","동천동"],"남구":["사동","구동","서동","월산동","백운동","주월동","노대동","진월동","덕남동","행암동","임암동","송하동","양림동","방림동","봉선동","구소동","양촌동","도금동","승촌동","지석동","압촌동","화장동","칠석동","석정동","신장동","양과동","이장동","대지동","원산동","월성동"],"북구":["중흥동","유동","누문동","북동","임동","신안동","용봉동","동림동","운암동","우산동","풍향동","문흥동","각화동","두암동","오치동","삼각동","매곡동","충효동","덕의동","금곡동","망월동","청풍동","화암동","장등동","운정동","본촌동","일곡동","양산동","연제동","신용동","용두동","지야동","태령동","수곡동","효령동","용전동","용강동","생용동","월출동","대촌동","오룡동"],"광산구":["송정동","도산동","도호동","신촌동","서봉동","운수동","선암동","소촌동","우산동","황룡동","박호동","비아동","도천동","수완동","월계동","쌍암동","산월동","신창동","신가동","운남동","안청동","진곡동","장덕동","흑석동","하남동","장수동","산정동","월곡동","등임동","산막동","고룡동","신룡동","두정동","임곡동","광산동","오산동","사호동","하산동","유계동","본덕동","용봉동","요기동","복룡동","송대동","옥동","월전동","장록동","송촌동","지죽동","용동","용곡동","지정동","명화동","동산동","연산동","도덕동","송산동","지평동","오운동","삼거동","양동","내산동","대산동","송학동","신동","삼도동","남산동","송치동","산수동","선동","지산동","왕동","북산동","명도동","동호동","덕림동","양산동","동림동","오선동"]}},"daejeon":{"name":"대전광역시","gus":{"동구":["원동","인동","효동","천동","가오동","신흥동","판암동","삼정동","용운동","대동","자양동","신안동","소제동","가양동","용전동","성남동","홍도동","삼성동","정동","중동","추동","비룡동","주산동","용계동","마산동","효평동","직동","세천동","신상동","신하동","신촌동","사성동","내탑동","오동","주촌동","낭월동","대별동","이사동","대성동","장척동","소호동","구도동","삼괴동","상소동","하소동"],"중구":["은행동","선화동","목동","중촌동","대흥동","문창동","석교동","호동","옥계동","대사동","부사동","용두동","오류동","태평동","유천동","문화동","산성동","사정동","안영동","무수동","구완동","침산동","목달동","정생동","어남동","금동"],"서구":["복수동","변동","도마동","정림동","용문동","탄방동","괴정동","가장동","내동","갈마동","둔산동","월평동","가수원동","도안동","관저동","흑석동","매노동","산직동","장안동","평촌동","오동","우명동","원정동","용촌동","봉곡동","괴곡동","만년동"],"유성구":["원내동","교촌동","대정동","용계동","학하동","계산동","성북동","세동","송정동","방동","봉명동","구암동","덕명동","원신흥동","상대동","복용동","장대동","갑동","노은동","지족동","죽동","궁동","어은동","구성동","신성동","가정동","도룡동","장동","방현동","화암동","덕진동","하기동","추목동","자운동","신봉동","수남동","안산동","외삼동","반석동","문지동","전민동","원촌동","탑립동","용산동","봉산동","관평동","송강동","금고동","대동","금탄동","신동","둔곡동","구룡동"],"대덕구":["오정동","대화동","읍내동","연축동","신대동","와동","송촌동","법동","중리동","비래동","석봉동","목상동","문평동","신일동","덕암동","상서동","평촌동","장동","용호동","이현동","갈전동","부수동","황호동","삼정동","미호동","신탄진동"]}},"ulsan":{"name":"울산광역시","gus":{"중구":["학성동","학산동","복산동","북정동","옥교동","성남동","교동","우정동","성안동","유곡동","태화동","다운동","동동","서동","남외동","장현동","약사동","반구동"],"남구":["무거동","옥동","두왕동","신정동","달동","삼산동","여천동","야음동","선암동","상개동","부곡동","고사동","성암동","황성동","용연동","남화동","용잠동","장생포동","매암동"],"동구":["방어동","화정동","일산동","전하동","미포동","주전동","동부동","서부동"],"북구":["창평동","호계동","매곡동","가대동","신천동","중산동","상안동","천곡동","달천동","시례동","무룡동","구유동","정자동","신명동","대안동","당사동","신현동","산하동","어물동","명촌동","진장동","연암동","효문동","양정동","화봉동","송정동","염포동"],"울주군":["온산읍","언양읍","온양읍","범서읍","청량읍","삼남읍","서생면","웅촌면","두동면","두서면","상북면","삼동면"]}},"sejong":{"name":"세종특별자치시","gus":{"세종시":["반곡동","소담동","보람동","대평동","가람동","한솔동","나성동","새롬동","다정동","어진동","종촌동","고운동","아름동","도담동","산울동","해밀동","합강동","집현동","세종동","누리동","한별동","다솜동","용호동","조치원읍","연기면","연동면","부강면","금남면","장군면","연서면","전의면","전동면","소정면"]}},"gyeonggi":{"name":"경기도","gus":{"수원시":[],"수원시장안구":["파장동","정자동","이목동","율전동","천천동","영화동","송죽동","조원동","연무동","상광교동","하광교동"],"수원시권선구":["세류동","평동","고색동","오목천동","평리동","서둔동","구운동","탑동","금곡동","호매실동","곡반정동","권선동","장지동","대황교동","입북동","당수동"],"수원시팔달구":["팔달로1가","팔달로2가","팔달로3가","남창동","영동","중동","구천동","남수동","매향동","북수동","신풍동","장안동","교동","매교동","매산로1가","매산로2가","매산로3가","고등동","화서동","지동","우만동","인계동"],"수원시영통구":["매탄동","원천동","이의동","하동","영통동","신동","망포동"],"성남시":[],"성남시수정구":["신흥동","태평동","수진동","단대동","산성동","양지동","복정동","창곡동","신촌동","오야동","심곡동","고등동","상적동","둔전동","시흥동","금토동","사송동"],"성남시중원구":["성남동","금광동","은행동","상대원동","여수동","도촌동","갈현동","하대원동","중앙동"],"성남시분당구":["분당동","수내동","정자동","율동","서현동","이매동","야탑동","판교동","삼평동","백현동","금곡동","궁내동","동원동","구미동","운중동","대장동","석운동","하산운동"],"의정부시":["의정부동","호원동","장암동","신곡동","용현동","민락동","낙양동","자일동","금오동","가능동","녹양동","고산동","산곡동"],"안양시":[],"안양시만안구":["안양동","석수동","박달동"],"안양시동안구":["비산동","관양동","평촌동","호계동"],"부천시":[],"부천시원미구":["원미동","심곡동","춘의동","도당동","약대동","소사동","역곡동","중동","상동"],"부천시소사구":["소사본동","심곡본동","범박동","괴안동","송내동","옥길동","계수동"],"부천시오정구":["오정동","여월동","작동","원종동","고강동","대장동","삼정동","내동"],"광명시":["광명동","철산동","하안동","소하동","노온사동","일직동","가학동","옥길동"],"평택시":["서정동","장당동","모곡동","칠괴동","칠원동","도일동","가재동","장안동","이충동","지산동","독곡동","신장동","평택동","통복동","군문동","유천동","합정동","비전동","동삭동","세교동","지제동","신대동","소사동","용이동","월곡동","청룡동","죽백동","고덕동","팽성읍","안중읍","포승읍","청북읍","진위면","서탄면","고덕면","오성면","현덕면"],"동두천시":["송내동","지행동","생연동","광암동","걸산동","보산동","동두천동","안흥동","상봉암동","하봉암동","탑동동","상패동"],"안산시":[],"안산시상록구":["일동","이동","사동","본오동","팔곡이동","양상동","부곡동","성포동","월피동","팔곡일동","건건동","사사동","수암동","장상동","장하동"],"안산시단원구":["고잔동","와동","신길동","성곡동","원시동","목내동","초지동","원곡동","선부동","대부동동","대부북동","대부남동","선감동","풍도동","화정동"],"고양시":[],"고양시덕양구":["주교동","원당동","신원동","원흥동","도내동","성사동","북한동","효자동","지축동","오금동","삼송동","동산동","용두동","벽제동","선유동","고양동","대자동","관산동","내유동","토당동","내곡동","대장동","화정동","강매동","행주내동","행주외동","신평동","행신동","화전동","현천동","덕은동","향동동"],"고양시일산동구":["식사동","중산동","정발산동","장항동","마두동","백석동","풍동","산황동","사리현동","지영동","설문동","문봉동","성석동"],"고양시일산서구":["일산동","주엽동","탄현동","대화동","덕이동","가좌동","구산동","법곳동"],"과천시":["관문동","문원동","갈현동","막계동","과천동","주암동","중앙동","원문동","별양동","부림동"],"구리시":["갈매동","사노동","인창동","교문동","수택동","아천동","토평동"],"남양주시":["호평동","평내동","금곡동","일패동","이패동","삼패동","수석동","지금동","도농동","별내동","다산동","와부읍","진접읍","화도읍","진건읍","오남읍","퇴계원읍","별내면","수동면","조안면"],"오산시":["오산동","부산동","원동","궐동","청학동","가장동","금암동","수청동","은계동","내삼미동","외삼미동","양산동","세교동","지곶동","서랑동","서동","벌음동","두곡동","탑동","누읍동","가수동","고현동","청호동","갈곶동"],"시흥시":["대야동","신천동","방산동","포동","미산동","은행동","안현동","매화동","도창동","금이동","과림동","계수동","화정동","능곡동","하중동","하상동","광석동","물왕동","산현동","조남동","논곡동","목감동","거모동","군자동","장현동","장곡동","월곶동","정왕동","죽율동","무지내동","배곧동"],"군포시":["당동","당정동","부곡동","산본동","금정동","둔대동","속달동","대야미동","도마교동"],"의왕시":["고천동","이동","삼동","왕곡동","오전동","학의동","내손동","청계동","포일동","월암동","초평동"],"하남시":["천현동","하산곡동","창우동","배알미동","상산곡동","신장동","당정동","덕풍동","망월동","풍산동","미사동","선동","감북동","감일동","감이동","학암동","교산동","춘궁동","하사창동","상사창동","항동","초일동","초이동","광암동"],"용인시":[],"용인시처인구":["김량장동","역북동","삼가동","남동","유방동","고림동","마평동","운학동","호동","해곡동","포곡읍","모현읍","이동읍","남사읍","원삼면","백암면","양지면"],"용인시기흥구":["신갈동","구갈동","상갈동","하갈동","보라동","지곡동","공세동","고매동","농서동","서천동","영덕동","언남동","마북동","청덕동","동백동","중동","상하동","보정동"],"용인시수지구":["풍덕천동","죽전동","동천동","고기동","신봉동","성복동","상현동"],"파주시":["금촌동","아동동","야동동","검산동","맥금동","교하동","야당동","다율동","오도동","상지석동","산남동","동패동","당하동","문발동","송촌동","목동동","하지석동","서패동","신촌동","연다산동","와동동","금릉동","문산읍","파주읍","법원읍","조리읍","월롱면","탄현면","광탄면","파평면","적성면","군내면","장단면","진동면","진서면"],"이천시":["창전동","관고동","중리동","증일동","율현동","진리동","안흥동","갈산동","증포동","송정동","사음동","단월동","대포동","고담동","장록동","장호원읍","부발읍","신둔면","백사면","호법면","마장면","대월면","모가면","설성면","율면"],"안성시":["봉산동","숭인동","영동","봉남동","구포동","동본동","명륜동","옥천동","낙원동","창전동","성남동","신흥동","인지동","금산동","연지동","대천동","서인동","석정동","아양동","금석동","계동","옥산동","사곡동","도기동","당왕동","가사동","가현동","신건지동","신소현동","신모산동","현수동","발화동","중리동","공도읍","보개면","금광면","서운면","미양면","대덕면","양성면","원곡면","일죽면","죽산면","삼죽면","고삼면"],"김포시":["북변동","걸포동","운양동","장기동","감정동","사우동","풍무동","마산동","구래동","통진읍","고촌읍","양촌읍","대곶면","월곶면","하성면"],"화성시":["진안동","병점동","능동","기산동","반월동","반정동","황계동","배양동","기안동","송산동","안녕동","반송동","석우동","오산동","청계동","영천동","중동","신동","목동","산척동","장지동","송동","방교동","금곡동","새솔동","봉담읍","우정읍","향남읍","남양읍","매송면","비봉면","마도면","송산면","서신면","팔탄면","장안면","양감면","정남면"],"광주시":["경안동","쌍령동","송정동","회덕동","탄벌동","목현동","삼동","중대동","직동","태전동","장지동","역동","목동","고산동","신현동","능평동","문형동","추자동","매산동","양벌동","초월읍","곤지암읍","도척면","퇴촌면","남종면","남한산성면"],"양주시":["유양동","어둔동","남방동","마전동","산북동","광사동","만송동","삼숭동","고읍동","덕정동","봉양동","회암동","율정동","옥정동","고암동","덕계동","회정동","백석읍","은현면","남면","광적면","장흥면"],"포천시":["신읍동","어룡동","자작동","선단동","설운동","동교동","소흘읍","군내면","내촌면","가산면","신북면","창수면","영중면","일동면","이동면","영북면","관인면","화현면"],"여주시":["상동","홍문동","창동","우만동","단현동","신진동","하동","교동","월송동","가업동","연라동","상거동","하거동","삼교동","점봉동","능현동","멱곡동","연양동","매룡동","천송동","오학동","현암동","오금동","가남읍","점동면","흥천면","금사면","세종대왕면","대신면","북내면","강천면","산북면"],"연천군":["연천읍","전곡읍","군남면","청산면","백학면","미산면","왕징면","신서면","중면","장남면"],"가평군":["가평읍","설악면","청평면","상면","조종면","북면"],"양평군":["양평읍","강상면","강하면","양서면","옥천면","서종면","단월면","청운면","양동면","지평면","용문면","개군면"]}},"chungbuk":{"name":"충청북도","gus":{"청주시":[],"청주시상당구":["영동","북문로1가","북문로2가","북문로3가","남문로1가","남문로2가","문화동","서운동","서문동","남주동","석교동","수동","탑동","대성동","영운동","금천동","용담동","명암동","산성동","용암동","용정동","방서동","평촌동","지북동","운동동","월오동","낭성면","미원면","가덕면","남일면","문의면"],"청주시서원구":["사직동","사창동","모충동","산남동","미평동","분평동","수곡동","성화동","개신동","죽림동","장성동","장암동","남이면","현도면"],"청주시흥덕구":["운천동","신봉동","가경동","복대동","봉명동","송정동","강서동","석곡동","휴암동","신전동","현암동","동막동","수의동","지동동","서촌동","신성동","평동","신대동","남촌동","내곡동","상신동","원평동","문암동","송절동","화계동","외북동","향정동","비하동","석소동","정봉동","신촌동","오송읍","강내면","옥산면"],"청주시청원구":["우암동","내덕동","율량동","사천동","주성동","주중동","정상동","정하동","정북동","오동동","외남동","외평동","외하동","내수읍","오창읍","북이면"],"충주시":["성내동","성남동","성서동","충인동","교현동","용산동","호암동","직동","단월동","풍동","가주동","용관동","용두동","달천동","봉방동","칠금동","연수동","목행동","용탄동","종민동","안림동","목벌동","충의동","지현동","문화동","금릉동","주덕읍","살미면","수안보면","대소원면","신니면","노은면","앙성면","중앙탑면","금가면","동량면","산척면","엄정면","소태면"],"제천시":["의림동","서부동","동현동","남천동","교동","중앙로1가","중앙로2가","명동","화산동","영천동","하소동","신월동","청전동","모산동","고암동","장락동","흑석동","두학동","고명동","신백동","강제동","명지동","산곡동","왕암동","천남동","신동","자작동","대랑동","봉양읍","금성면","청풍면","수산면","덕산면","한수면","백운면","송학면"],"보은군":["보은읍","속리산면","장안면","마로면","탄부면","삼승면","수한면","회남면","회인면","내북면","산외면"],"옥천군":["옥천읍","동이면","안남면","안내면","청성면","청산면","이원면","군서면","군북면"],"영동군":["영동읍","용산면","황간면","추풍령면","매곡면","상촌면","양강면","용화면","학산면","양산면","심천면"],"증평군":["증평읍","도안면"],"진천군":["진천읍","덕산읍","초평면","문백면","백곡면","이월면","광혜원면"],"괴산군":["괴산읍","감물면","장연면","연풍면","칠성면","문광면","청천면","청안면","사리면","소수면","불정면"],"음성군":["음성읍","금왕읍","소이면","원남면","맹동면","대소면","삼성면","생극면","감곡면"],"단양군":["단양읍","매포읍","대강면","가곡면","영춘면","어상천면","적성면","단성면"]}},"chungnam":{"name":"충청남도","gus":{"천안시":[],"천안시동남구":["대흥동","성황동","문화동","사직동","영성동","오룡동","원성동","구성동","청수동","삼룡동","청당동","유량동","봉명동","다가동","용곡동","신방동","쌍용동","신부동","안서동","구룡동","목천읍","풍세면","광덕면","북면","성남면","수신면","병천면","동면"],"천안시서북구":["와촌동","성정동","백석동","두정동","성성동","차암동","쌍용동","불당동","업성동","신당동","부대동","성환읍","성거읍","직산읍","입장면"],"공주시":["반죽동","봉황동","중학동","중동","산성동","교동","웅진동","금성동","옥룡동","금학동","봉정동","주미동","태봉동","오곡동","신기동","소학동","상왕동","무릉동","월송동","신관동","금흥동","쌍신동","월미동","검상동","석장리동","송선동","동현동","유구읍","이인면","탄천면","계룡면","반포면","의당면","정안면","우성면","사곡면","신풍면"],"보령시":["대천동","죽정동","화산동","동대동","명천동","궁촌동","내항동","남곡동","요암동","신흑동","웅천읍","주포면","오천면","천북면","청소면","청라면","남포면","주산면","미산면","성주면","주교면"],"아산시":["온천동","실옥동","방축동","기산동","초사동","신인동","법곡동","장존동","좌부동","읍내동","풍기동","용화동","모종동","권곡동","배미동","득산동","점양동","신동","남동","염치읍","배방읍","송악면","탕정면","음봉면","둔포면","영인면","인주면","선장면","도고면","신창면"],"서산시":["읍내동","동문동","갈산동","온석동","잠홍동","수석동","석림동","석남동","예천동","죽성동","양대동","오남동","장동","덕지천동","대산읍","인지면","부석면","팔봉면","지곡면","성연면","음암면","운산면","해미면","고북면"],"논산시":["화지동","반월동","대교동","부창동","취암동","등화동","지산동","덕지동","내동","강산동","관촉동","강경읍","연무읍","성동면","광석면","노성면","상월면","부적면","연산면","벌곡면","양촌면","가야곡면","은진면","채운면"],"계룡시":["금암동","두마면","엄사면","신도안면"],"당진시":["읍내동","채운동","우두동","원당동","시곡동","수청동","대덕동","행정동","용연동","사기소동","구룡동","합덕읍","송악읍","고대면","석문면","대호지면","정미면","면천면","순성면","우강면","신평면","송산면"],"금산군":["금산읍","금성면","제원면","부리면","군북면","남일면","남이면","진산면","복수면","추부면"],"부여군":["부여읍","규암면","은산면","외산면","내산면","구룡면","홍산면","옥산면","남면","충화면","양화면","임천면","장암면","세도면","석성면","초촌면"],"서천군":["장항읍","서천읍","마서면","화양면","기산면","한산면","마산면","시초면","문산면","판교면","종천면","비인면","서면"],"청양군":["청양읍","운곡면","대치면","정산면","목면","청남면","장평면","남양면","화성면","비봉면"],"홍성군":["홍성읍","광천읍","홍북읍","금마면","홍동면","장곡면","은하면","결성면","서부면","갈산면","구항면"],"예산군":["예산읍","삽교읍","대술면","신양면","광시면","대흥면","응봉면","덕산면","봉산면","고덕면","신암면","오가면"],"태안군":["태안읍","안면읍","고남면","남면","근흥면","소원면","원북면","이원면"]}},"jeonnam":{"name":"전라남도","gus":{"목포시":["용당동","산정동","연산동","대성동","양동","북교동","남교동","호남동","대안동","창평동","명륜동","죽동","무안동","측후동","상락동1가","상락동2가","복만동","동명동","광동1가","광동2가","광동3가","영해동1가","영해동2가","행복동1가","행복동2가","축복동1가","축복동2가","축복동3가","보광동1가","보광동2가","보광동3가","유달동","대의동1가","대의동2가","대의동3가","중앙동1가","중앙동2가","중앙동3가","만호동","수강동1가","수강동2가","해안동1가","해안동2가","해안동3가","해안동4가","항동","중동1가","중동2가","유동","금동1가","금동2가","경동1가","경동2가","서산동","금화동","온금동","죽교동","상동","용해동","석현동","달동","율도동","대양동","옥암동"],"여수시":["종화동","수정동","공화동","관문동","고소동","동산동","중앙동","교동","군자동","충무동","연등동","광무동","서교동","봉강동","봉산동","남산동","국동","신월동","여서동","문수동","오림동","미평동","둔덕동","오천동","만흥동","덕충동","경호동","학동","학용동","안산동","소호동","시전동","신기동","웅천동","선원동","여천동","화장동","주삼동","봉계동","해산동","화치동","월하동","평여동","중흥동","적량동","월내동","묘도동","낙포동","신덕동","상암동","호명동","돌산읍","소라면","율촌면","화양면","남면","화정면","삼산면"],"순천시":["삼거동","와룡동","영동","옥천동","행동","금곡동","매곡동","석현동","가곡동","용당동","조곡동","생목동","덕암동","연향동","풍덕동","남정동","인제동","저전동","장천동","남내동","중앙동","동외동","교량동","대룡동","홍내동","오천동","덕월동","야흥동","인월동","안풍동","대대동","왕지동","조례동","승주읍","해룡면","서면","황전면","월등면","주암면","송광면","외서면","낙안면","별량면","상사면"],"나주시":["토계동","송월동","안창동","삼영동","교동","서내동","산정동","경현동","보산동","금계동","금성동","남내동","과원동","성북동","중앙동","대호동","송촌동","석현동","청동","남외동","죽림동","삼도동","영산동","용산동","관정동","평산동","부덕동","이창동","대기동","운곡동","동수동","오량동","진포동","빛가람동","남평읍","세지면","왕곡면","반남면","공산면","동강면","다시면","문평면","노안면","금천면","산포면","다도면","봉황면"],"광양시":["황금동","황길동","도이동","성황동","중군동","중동","마동","광영동","태인동","금호동","광양읍","봉강면","옥룡면","옥곡면","진상면","진월면","다압면"],"담양군":["담양읍","봉산면","고서면","가사문학면","창평면","대덕면","무정면","금성면","용면","월산면","수북면","대전면"],"곡성군":["곡성읍","오곡면","삼기면","석곡면","목사동면","죽곡면","고달면","옥과면","입면","겸면","오산면"],"구례군":["구례읍","문척면","간전면","토지면","마산면","광의면","용방면","산동면"],"고흥군":["고흥읍","도양읍","풍양면","도덕면","금산면","도화면","포두면","봉래면","점암면","과역면","남양면","동강면","대서면","두원면","영남면","동일면"],"보성군":["보성읍","벌교읍","노동면","미력면","겸백면","율어면","복내면","문덕면","조성면","득량면","회천면","웅치면"],"화순군":["화순읍","한천면","춘양면","청풍면","이양면","능주면","도곡면","도암면","이서면","백아면","동복면","사평면","동면"],"장흥군":["장흥읍","관산읍","대덕읍","용산면","안양면","장동면","장평면","유치면","부산면","회진면"],"강진군":["강진읍","군동면","칠량면","대구면","도암면","신전면","성전면","작천면","병영면","옴천면","마량면"],"해남군":["해남읍","삼산면","화산면","현산면","송지면","북평면","북일면","옥천면","계곡면","마산면","황산면","산이면","문내면","화원면"],"영암군":["영암읍","삼호읍","덕진면","금정면","신북면","시종면","도포면","군서면","서호면","학산면","미암면"],"무안군":["무안읍","일로읍","삼향읍","몽탄면","청계면","현경면","망운면","해제면","운남면"],"함평군":["함평읍","손불면","신광면","학교면","엄다면","대동면","나산면","해보면","월야면"],"영광군":["영광읍","백수읍","홍농읍","대마면","묘량면","불갑면","군서면","군남면","염산면","법성면","낙월면"],"장성군":["장성읍","진원면","남면","동화면","삼서면","삼계면","황룡면","서삼면","북일면","북이면","북하면"],"완도군":["완도읍","금일읍","노화읍","군외면","신지면","고금면","약산면","청산면","소안면","금당면","보길면","생일면"],"진도군":["진도읍","군내면","고군면","의신면","임회면","지산면","조도면"],"신안군":["지도읍","압해읍","증도면","임자면","자은면","비금면","도초면","흑산면","하의면","신의면","장산면","안좌면","팔금면","암태면"]}},"gyeongbuk":{"name":"경상북도","gus":{"포항시":[],"포항시남구":["상도동","대도동","해도동","송도동","청림동","일월동","송정동","송내동","괴동동","동촌동","장흥동","인덕동","호동","효자동","지곡동","대잠동","이동","구룡포읍","연일읍","오천읍","대송면","동해면","장기면","호미곶면"],"포항시북구":["대흥동","신흥동","남빈동","상원동","여천동","중앙동","덕산동","덕수동","대신동","동빈1가","동빈2가","학산동","항구동","득량동","학잠동","죽도동","용흥동","우현동","창포동","두호동","장성동","양덕동","환호동","여남동","흥해읍","신광면","청하면","송라면","기계면","죽장면","기북면"],"경주시":["동부동","서부동","북부동","성동동","황오동","노동동","노서동","성건동","사정동","황남동","교동","인왕동","탑동","충효동","서악동","효현동","광명동","동방동","도지동","남산동","배반동","구황동","보문동","황성동","용강동","동천동","평동","조양동","시동","시래동","구정동","마동","하동","진현동","천군동","신평동","덕동","암곡동","황용동","북군동","손곡동","율동","배동","석장동","감포읍","안강읍","건천읍","외동읍","문무대왕면","양남면","내남면","산내면","서면","현곡면","강동면","천북면"],"김천시":["감호동","용두동","모암동","성내동","평화동","남산동","황금동","신음동","교동","삼락동","문당동","다수동","백옥동","부곡동","지좌동","덕곡동","대광동","응명동","양천동","율곡동","아포읍","농소면","남면","개령면","감문면","어모면","봉산면","대항면","감천면","조마면","구성면","지례면","부항면","대덕면","증산면"],"안동시":["삼산동","서부동","북문동","명륜동","신안동","율세동","옥정동","신세동","법흥동","용상동","동문동","동부동","운흥동","천리동","남부동","남문동","안흥동","대석동","옥야동","광석동","당북동","태화동","화성동","목성동","법상동","금곡동","평화동","안기동","운안동","성곡동","상아동","안막동","옥동","이천동","노하동","송현동","송천동","석동동","정상동","정하동","수상동","수하동","풍산읍","와룡면","북후면","서후면","풍천면","일직면","남후면","남선면","임하면","길안면","임동면","예안면","도산면","녹전면"],"구미시":["원평동","지산동","도량동","봉곡동","부곡동","선기동","수점동","남통동","형곡동","송정동","신평동","비산동","공단동","광평동","사곡동","상모동","임은동","오태동","신동","구평동","황상동","인의동","진평동","시미동","임수동","양호동","거의동","옥계동","구포동","금전동","선산읍","고아읍","산동읍","무을면","옥성면","도개면","해평면","장천면"],"영주시":["영주동","상망동","하망동","휴천동","가흥동","문정동","고현동","창진동","상줄동","조와동","조암동","적서동","아지동","풍기읍","이산면","평은면","문수면","장수면","안정면","봉현면","순흥면","단산면","부석면"],"영천시":["조교동","망정동","야사동","문내동","문외동","창구동","교촌동","과전동","성내동","화룡동","도동","금노동","완산동","범어동","작산동","봉동","본촌동","채신동","괴연동","대전동","녹전동","도림동","오미동","오수동","쌍계동","도남동","매산동","언하동","신기동","서산동","금호읍","청통면","신녕면","화산면","화북면","화남면","자양면","임고면","고경면","북안면","대창면"],"상주시":["성하동","성동동","인봉동","복룡동","냉림동","서성동","남성동","서문동","무양동","낙양동","개운동","신봉동","가장동","양촌동","지천동","오대동","흥각동","거동동","인평동","서곡동","화개동","외답동","헌신동","병성동","도남동","낙상동","중덕동","초산동","화산동","계산동","부원동","죽전동","만산동","연원동","남장동","남적동","함창읍","중동면","사벌국면","낙동면","청리면","공성면","외남면","내서면","모동면","모서면","화동면","화서면","화북면","외서면","은척면","공검면","이안면","화남면"],"문경시":["점촌동","영신동","흥덕동","우지동","창동","신기동","불정동","유곡동","공평동","모전동","윤직동","문경읍","가은읍","영순면","산양면","호계면","산북면","동로면","마성면","농암면"],"경산시":["삼남동","삼북동","서상동","신교동","상방동","백천동","옥곡동","사정동","옥산동","중산동","정평동","대평동","대정동","임당동","대동","계양동","중방동","조영동","남방동","내동","여천동","유곡동","신천동","점촌동","평산동","사동","삼풍동","갑제동","하양읍","진량읍","압량읍","와촌면","자인면","용성면","남산면","남천면"],"의성군":["의성읍","단촌면","점곡면","옥산면","사곡면","춘산면","가음면","금성면","봉양면","비안면","구천면","단밀면","단북면","안계면","다인면","신평면","안평면","안사면"],"청송군":["청송읍","주왕산면","부남면","현동면","현서면","안덕면","파천면","진보면"],"영양군":["영양읍","입암면","청기면","일월면","수비면","석보면"],"영덕군":["영덕읍","강구면","남정면","달산면","지품면","축산면","영해면","병곡면","창수면"],"청도군":["화양읍","청도읍","각남면","풍각면","각북면","이서면","운문면","금천면","매전면"],"고령군":["대가야읍","덕곡면","운수면","성산면","다산면","개진면","우곡면","쌍림면"],"성주군":["성주읍","선남면","용암면","수륜면","가천면","금수강산면","대가면","벽진면","초전면","월항면"],"칠곡군":["왜관읍","북삼읍","석적읍","지천면","동명면","가산면","약목면","기산면"],"예천군":["예천읍","호명읍","용문면","감천면","보문면","유천면","용궁면","개포면","지보면","풍양면","효자면","은풍면"],"봉화군":["봉화읍","물야면","봉성면","법전면","춘양면","소천면","재산면","명호면","상운면","석포면"],"울진군":["울진읍","평해읍","북면","근남면","기성면","온정면","죽변면","후포면","금강송면","매화면"],"울릉군":["울릉읍","서면","북면"]}},"gyeongnam":{"name":"경상남도","gus":{"창원시":[],"창원시의창구":["북동","중동","서상동","소답동","도계동","동정동","소계동","용동","덕정동","지귀동","서곡동","봉림동","퇴촌동","명곡동","반계동","사화동","차용동","내리동","명서동","사림동","봉곡동","팔용동","동읍","북면","대산면"],"창원시성산구":["토월동","사파정동","가음정동","외동","대방동","남산동","삼정자동","천선동","불모산동","안민동","내동","남지동","상복동","완암동","창곡동","월림동","적현동","양곡동","반송동","귀산동","귀곡동","귀현동","신촌동","반지동","중앙동","반림동","상남동","성주동","웅남동","사파동","가음동","성산동","남양동","용지동","용호동","신월동","대원동","두대동","삼동동","덕정동","퇴촌동"],"창원시마산합포구":["가포동","교방동","교원동","남성동","대내동","대성동1가","대성동2가","대외동","대창동","덕동동","동성동","두월동1가","두월동2가","두월동3가","문화동","반월동","부림동","산호동","상남동","서성동","성호동","수성동","신월동","신창동","신포동1가","신포동2가","신흥동","완월동","월남동1가","월남동2가","월남동3가","월남동4가","월남동5가","월영동","월포동","예곡동","오동동","우산동","유록동","자산동","장군동1가","장군동2가","장군동3가","장군동4가","장군동5가","중성동","중앙동1가","중앙동2가","중앙동3가","창동","창포동1가","창포동2가","창포동3가","청계동","추산동","평화동","화영동","해운동","현동","홍문동","구산면","진동면","진북면","진전면"],"창원시마산회원구":["구암동","두척동","봉암동","석전동","양덕동","합성동","회성동","회원동","내서읍"],"창원시진해구":["동상동","도천동","도만동","신흥동","현동","비봉동","태평동","충의동","무송동","인의동","숭인동","대영동","남빈동","앵곡동","제황산동","속천동","대죽동","안곡동","수송동","회현동","익선동","창선동","대천동","광화동","통신동","중앙동","부흥동","중평동","근화동","송죽동","화천동","송학동","대흥동","평안동","충무동","인사동","여좌동","태백동","경화동","석동","이동","자은동","덕산동","풍호동","장천동","행암동","북부동","성내동","서중동","남문동","제덕동","수도동","연도동","명동","죽곡동","원포동","남양동","마천동","소사동","대장동","두동","청안동","안골동","용원동","가주동"],"진주시":["망경동","주약동","강남동","칠암동","본성동","동성동","남성동","인사동","대안동","평안동","중안동","계동","봉곡동","상봉동","봉래동","수정동","장대동","옥봉동","상대동","하대동","상평동","초전동","장재동","하촌동","신안동","평거동","이현동","유곡동","판문동","귀곡동","가좌동","호탄동","충무공동","문산읍","내동면","정촌면","금곡면","진성면","일반성면","이반성면","사봉면","지수면","대곡면","금산면","집현면","미천면","명석면","대평면","수곡면"],"통영시":["도천동","서호동","명정동","항남동","중앙동","문화동","태평동","동호동","정량동","북신동","무전동","평림동","인평동","당동","미수동","봉평동","도남동","산양읍","용남면","도산면","광도면","욕지면","한산면","사량면"],"사천시":["동동","서동","선구동","동금동","서금동","동림동","좌룡동","벌리동","용강동","와룡동","봉남동","이금동","이홀동","궁지동","사등동","향촌동","대방동","실안동","마도동","늑도동","신수동","백천동","신벽동","노룡동","대포동","송포동","죽림동","사천읍","정동면","사남면","용현면","축동면","곤양면","곤명면","서포면"],"김해시":["동상동","서상동","부원동","봉황동","대성동","구산동","삼계동","내동","외동","흥동","풍유동","명법동","이동","화목동","전하동","강동","삼정동","어방동","삼방동","안동","지내동","불암동","유하동","내덕동","부곡동","무계동","신문동","삼문동","대청동","관동동","율하동","장유동","응달동","수가동","진영읍","주촌면","진례면","한림면","생림면","상동면","대동면"],"밀양시":["내일동","내이동","교동","삼문동","남포동","용평동","활성동","가곡동","삼랑진읍","하남읍","부북면","상동면","산외면","산내면","단장면","상남면","초동면","무안면","청도면"],"거제시":["능포동","장승포동","두모동","아양동","아주동","옥포동","덕포동","장평동","고현동","상동동","문동동","삼거동","양정동","수월동","일운면","동부면","남부면","거제면","둔덕면","사등면","연초면","하청면","장목면"],"양산시":["다방동","남부동","중부동","북부동","명곡동","신기동","북정동","산막동","호계동","교동","유산동","어곡동","용당동","삼호동","명동","주남동","소주동","주진동","평산동","덕계동","매곡동","물금읍","동면","원동면","상북면","하북면"],"의령군":["의령읍","가례면","칠곡면","대의면","화정면","용덕면","정곡면","지정면","낙서면","부림면","봉수면","궁류면","유곡면"],"함안군":["가야읍","칠원읍","함안면","군북면","법수면","대산면","칠서면","칠북면","산인면","여항면"],"창녕군":["창녕읍","남지읍","고암면","성산면","대합면","이방면","유어면","대지면","계성면","영산면","장마면","도천면","길곡면","부곡면"],"고성군":["고성읍","삼산면","하일면","하이면","상리면","대가면","영현면","영오면","개천면","구만면","회화면","마암면","동해면","거류면"],"남해군":["남해읍","이동면","상주면","삼동면","미조면","남면","서면","고현면","설천면","창선면"],"하동군":["하동읍","화개면","악양면","적량면","횡천면","고전면","금남면","진교면","양보면","북천면","청암면","옥종면","금성면"],"산청군":["산청읍","차황면","오부면","생초면","금서면","삼장면","시천면","단성면","신안면","생비량면","신등면"],"함양군":["함양읍","마천면","휴천면","유림면","수동면","지곡면","안의면","서하면","서상면","백전면","병곡면"],"거창군":["거창읍","주상면","웅양면","고제면","북상면","위천면","마리면","남상면","남하면","신원면","가조면","가북면"],"합천군":["합천읍","봉산면","묘산면","가야면","야로면","율곡면","초계면","쌍책면","덕곡면","청덕면","적중면","대양면","쌍백면","삼가면","가회면","대병면","용주면"]}},"jeju":{"name":"제주특별자치도","gus":{"제주시":["일도일동","일도이동","이도일동","이도이동","삼도일동","삼도이동","건입동","용담일동","용담이동","용담삼동","화북일동","화북이동","삼양일동","삼양이동","삼양삼동","봉개동","아라일동","아라이동","오라일동","오라이동","오라삼동","노형동","외도일동","외도이동","이호일동","이호이동","도두일동","도두이동","도남동","도련일동","도련이동","용강동","회천동","오등동","월평동","영평동","연동","도평동","해안동","내도동","한림읍","애월읍","구좌읍","조천읍","한경면","추자면","우도면"],"서귀포시":["서귀동","법환동","서호동","호근동","동홍동","서홍동","상효동","하효동","신효동","보목동","토평동","중문동","회수동","대포동","월평동","강정동","도순동","하원동","색달동","상예동","하예동","영남동","대정읍","남원읍","성산읍","안덕면","표선면"]}},"gangwon":{"name":"강원특별자치도","gus":{"춘천시":["봉의동","요선동","낙원동","중앙로1가","중앙로2가","중앙로3가","옥천동","조양동","죽림동","운교동","약사동","효자동","소양로1가","소양로2가","소양로3가","소양로4가","근화동","우두동","사농동","후평동","온의동","교동","퇴계동","석사동","삼천동","칠전동","송암동","신동","중도동","신북읍","동면","동산면","신동면","남면","서면","사북면","북산면","동내면","남산면"],"원주시":["중앙동","평원동","원동","인동","개운동","명륜동","단구동","일산동","학성동","단계동","우산동","태장동","봉산동","행구동","무실동","관설동","반곡동","가현동","문막읍","소초면","호저면","지정면","부론면","귀래면","흥업면","판부면","신림면"],"강릉시":["홍제동","남문동","명주동","성내동","임당동","금학동","용강동","성남동","옥천동","교동","포남동","초당동","강문동","송정동","견소동","내곡동","회산동","장현동","박월동","담산동","노암동","유산동","월호평동","신석동","입암동","청량동","두산동","학동","병산동","남항진동","유천동","지변동","죽헌동","대전동","운정동","난곡동","저동","안현동","운산동","주문진읍","성산면","왕산면","구정면","강동면","옥계면","사천면","연곡면"],"동해시":["천곡동","평릉동","송정동","용정동","지흥동","효가동","동회동","나안동","쇄운동","부곡동","발한동","북평동","구미동","추암동","구호동","단봉동","지가동","이도동","귀운동","대구동","호현동","내동","묵호진동","삼화동","이기동","이로동","어달동","대진동","망상동","심곡동","초구동","괴란동","만우동","신흥동","비천동","달방동"],"태백시":["황지동","장성동","금천동","철암동","문곡동","동점동","소도동","혈동","화전동","적각동","창죽동","통동","백산동","원동","상사미동","하사미동","조탄동"],"속초시":["영랑동","동명동","중앙동","금호동","청학동","교동","노학동","조양동","청호동","대포동","도문동","설악동","장사동"],"삼척시":["성내동","성북동","읍상동","읍중동","당저동","교동","갈천동","증산동","우지동","마달동","자원동","평전동","등봉동","도경동","마평동","오사동","건지동","원당동","성남동","남양동","사직동","오분동","적노동","조비동","정상동","정하동","근산동","도계읍","원덕읍","근덕면","하장면","노곡면","미로면","가곡면","신기면"],"홍천군":["홍천읍","화촌면","두촌면","내촌면","서석면","영귀미면","남면","서면","북방면","내면"],"횡성군":["횡성읍","우천면","안흥면","둔내면","갑천면","청일면","공근면","서원면","강림면"],"영월군":["영월읍","상동읍","산솔면","김삿갓면","북면","남면","한반도면","주천면","무릉도원면"],"평창군":["평창읍","미탄면","방림면","대화면","봉평면","용평면","진부면","대관령면"],"정선군":["정선읍","고한읍","사북읍","신동읍","남면","북평면","임계면","화암면","여량면"],"철원군":["철원읍","김화읍","갈말읍","동송읍","서면","근남면","근북면","근동면","원동면","원남면","임남면"],"화천군":["화천읍","간동면","하남면","상서면","사내면"],"양구군":["양구읍","국토정중앙면","동면","방산면","해안면"],"인제군":["인제읍","남면","북면","기린면","서화면","상남면"],"고성군":["간성읍","거진읍","현내면","죽왕면","토성면","수동면"],"양양군":["양양읍","서면","손양면","현북면","현남면","강현면"]}},"jeonbuk":{"name":"전북특별자치도","gus":{"전주시":[],"전주시완산구":["중앙동1가","중앙동2가","중앙동3가","중앙동4가","경원동1가","경원동2가","경원동3가","풍남동1가","풍남동2가","풍남동3가","전동","전동3가","다가동1가","다가동2가","다가동3가","다가동4가","고사동","교동","태평동","중노송동","남노송동","동완산동","서완산동1가","서완산동2가","동서학동","서서학동","중화산동1가","중화산동2가","서신동","석구동","원당동","평화동1가","평화동2가","평화동3가","중인동","용복동","삼천동1가","삼천동2가","삼천동3가","효자동1가","효자동2가","효자동3가","대성동","색장동","상림동","서노송동"],"전주시덕진구":["진북동","인후동1가","인후동2가","덕진동1가","덕진동2가","금암동","팔복동1가","팔복동2가","팔복동3가","산정동","금상동","우아동1가","우아동2가","우아동3가","호성동1가","호성동2가","호성동3가","전미동1가","전미동2가","송천동1가","송천동2가","반월동","화전동","용정동","성덕동","원동","고랑동","여의동","만성동","장동","팔복동4가","도도동","강흥동","도덕동","남정동","중동","여의동2가"],"군산시":["해망동","신흥동","금동","월명동","신창동","오룡동","금광동","신풍동","송풍동","문화동","삼학동","선양동","둔율동","창성동","명산동","송창동","개복동","중앙로1가","영화동","장미동","중앙로2가","영동","신영동","죽성동","평화동","중앙로3가","대명동","장재동","미원동","중동","금암동","동흥남동","서흥남동","조촌동","경장동","경암동","구암동","내흥동","개정동","사정동","수송동","미장동","지곡동","나운동","미룡동","소룡동","오식도동","비응도동","신관동","개사동","산북동","내초동","옥구읍","옥산면","회현면","임피면","서수면","대야면","개정면","성산면","나포면","옥도면","옥서면"],"익산시":["창인동1가","창인동2가","중앙동1가","중앙동2가","중앙동3가","평화동","갈산동","주현동","인화동1가","인화동2가","동산동","마동","남중동","모현동1가","모현동2가","송학동","목천동","만석동","현영동","신용동","신동","영등동","어양동","신흥동","금강동","석탄동","팔봉동","덕기동","석왕동","은기동","정족동","임상동","월성동","부송동","용제동","석암동","함열읍","오산면","황등면","함라면","웅포면","성당면","용안면","낭산면","망성면","여산면","금마면","왕궁면","춘포면","삼기면","용동면"],"정읍시":["수성동","장명동","상동","시기동","연지동","농소동","하모동","상평동","과교동","삼산동","진산동","금붕동","송산동","신월동","용산동","교암동","부전동","쌍암동","내장동","영파동","하북동","구룡동","흑암동","용계동","공평동","망제동","신정동","신태인읍","북면","입암면","소성면","고부면","영원면","덕천면","이평면","정우면","태인면","감곡면","옹동면","칠보면","산내면","산외면"],"남원시":["동충동","하정동","죽항동","쌍교동","천거동","금동","조산동","왕정동","신정동","화정동","향교동","용정동","광치동","내척동","산곡동","도통동","월락동","고죽동","식정동","갈치동","노암동","어현동","신촌동","운봉읍","주천면","수지면","송동면","주생면","금지면","대강면","대산면","사매면","덕과면","보절면","산동면","이백면","아영면","산내면","인월면"],"김제시":["요촌동","신풍동","용동","검산동","순동","백학동","서암동","신곡동","교동","옥산동","갈공동","하동","흥사동","상동동","월성동","황산동","난봉동","오정동","복죽동","입석동","장화동","신덕동","월봉동","신월동","연정동","명덕동","제월동","도장동","서정동","양전동","만경읍","죽산면","백산면","용지면","백구면","부량면","공덕면","청하면","성덕면","진봉면","금구면","봉남면","황산면","금산면","광활면"],"완주군":["삼례읍","봉동읍","용진읍","상관면","이서면","소양면","구이면","고산면","비봉면","운주면","화산면","동상면","경천면"],"진안군":["진안읍","용담면","안천면","동향면","상전면","백운면","성수면","마령면","부귀면","정천면","주천면"],"무주군":["무주읍","무풍면","설천면","적상면","안성면","부남면"],"장수군":["장수읍","산서면","번암면","장계면","천천면","계남면","계북면"],"임실군":["임실읍","청웅면","운암면","신평면","성수면","오수면","신덕면","삼계면","관촌면","강진면","덕치면","지사면"],"순창군":["순창읍","인계면","동계면","풍산면","금과면","팔덕면","쌍치면","복흥면","적성면","유등면","구림면"],"고창군":["고창읍","고수면","아산면","무장면","공음면","상하면","해리면","성송면","대산면","심원면","흥덕면","성내면","신림면","부안면"],"부안군":["부안읍","주산면","동진면","행안면","계화면","보안면","변산면","진서면","백산면","상서면","하서면","줄포면","위도면"]}}};

// 빈 통합시 부모(예: 수원시·성남시)에 자식 구의 동들을 합쳐서 채워넣기
// 자식 구는 부모이름 prefix 패턴 (예: "수원시" 부모 → "수원시장안구" 등)
(function fillEmptyParentCities() {
  for (const sidoKey in REGIONS) {
    const gus = REGIONS[sidoKey].gus;
    for (const guName in gus) {
      if (gus[guName].length === 0) {
        const children = Object.keys(gus).filter(g => g !== guName && g.startsWith(guName));
        if (children.length > 0) {
          const allDongs = [];
          const seen = new Set();
          for (const child of children) {
            for (const dong of gus[child]) {
              if (!seen.has(dong)) {
                seen.add(dong);
                allDongs.push(dong);
              }
            }
          }
          gus[guName] = allDongs;
        }
      }
    }
  }
})();

const SIDO_URL_TO_NAME = Object.keys(REGIONS).reduce((acc, key) => {
  acc[key] = REGIONS[key].name;
  return acc;
}, {});

const SIDO_NAME_TO_URL = Object.keys(REGIONS).reduce((acc, key) => {
  acc[REGIONS[key].name] = key;
  return acc;
}, {});


// 지역별 상권 특성 (랜덤 매칭)
const AREA_TYPES = [
  "번화가·상업지구", "주거 밀집지역", "오피스 상권", "대학가 주변",
  "관광·유흥가", "재래시장 주변", "주택가", "복합상업지구",
  "역세권", "산업단지 인근", "소형 상점가", "프랜차이즈 밀집지"
];

// 업종 특성
const BIZ_TYPES = [
  "카페·디저트 매장", "음식점·식당", "편의점·마트", "미용실·네일샵",
  "의류·패션 매장", "약국·병의원", "학원·교습소", "베이커리·빵집",
  "주점·호프집", "치킨·피자 전문점", "반찬가게·정육점", "서점·팬시점"
];

// 도입 효과
const BENEFITS = [
  "인건비 절감", "매출 관리 효율화", "결제 속도 향상", "고객 만족도 상승",
  "업무 자동화", "주문 실수 감소", "대기시간 단축", "재고 관리 개선",
  "세무 처리 간편", "실시간 매출 파악", "피크타임 대응력", "무인 운영 가능"
];

// 오프닝 문구 다양화
const OPENINGS = [
  "매장 운영의 새로운 시작",
  "효율적인 매장 운영의 첫걸음",
  "믿을 수 있는 설치 파트너",
  "전문가가 책임지는 맞춤 설치",
  "비즈니스 성공의 든든한 동반자",
  "매장에 딱 맞는 솔루션 제공",
  "사장님의 고민을 해결해드립니다",
  "한 번 설치로 오래 안심하세요",
  "전국 어디든 빠른 설치",
  "매장 업종에 맞는 최적 선택"
];

// 클로징 문구 다양화
const CLOSINGS = [
  "지금 바로 상담 받아보세요",
  "무료 견적을 신청하세요",
  "전문 상담사가 도와드립니다",
  "빠른 답변을 약속드립니다",
  "친절한 상담을 경험해보세요",
  "부담 없이 문의해주세요",
  "궁금한 점은 언제든 물어보세요",
  "최고의 조건으로 안내드립니다"
];

// 실제 후기 스타일 문구
const REVIEWS = [
  { name: "김○○ 사장님", biz: "카페", text: "설치 기사님이 정말 친절하시고 꼼꼼하셨어요. 사용법도 자세히 알려주셔서 바로 영업에 활용할 수 있었습니다." },
  { name: "박○○ 사장님", biz: "음식점", text: "다른 업체 견적도 받아봤는데 여기가 제일 합리적이었어요. A/S도 전화 한 통에 바로 해결되니 걱정이 없네요." },
  { name: "이○○ 사장님", biz: "편의점", text: "24시간 운영하는 매장인데 설치 후 문제가 거의 없어요. 장비 안정성이 정말 좋습니다." },
  { name: "최○○ 사장님", biz: "미용실", text: "복잡한 거 싫어해서 단순한 걸 원했는데 딱 맞는 모델을 추천해주셨어요. 만족합니다." },
  { name: "정○○ 사장님", biz: "분식집", text: "좁은 공간에 맞는 컴팩트한 장비를 추천해주셨어요. 비용도 부담 없고 잘 선택했다고 생각해요." },
  { name: "강○○ 사장님", biz: "베이커리", text: "고객 응대가 빠르고 친절합니다. 설치 후에도 주기적으로 점검해주셔서 안심이에요." },
  { name: "조○○ 사장님", biz: "치킨집", text: "배달 주문이 많은데 포스기 연동이 잘 되어 편리합니다. 매출 관리도 쉬워졌어요." },
  { name: "윤○○ 사장님", biz: "주점", text: "테이블오더 도입 후 인건비가 정말 많이 줄었습니다. 직원도 편해하고 고객도 만족해해요." }
];

// 지역 문자열로 결정론적 난수 생성 (같은 지역은 항상 같은 결과)
function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

// 지역 기반 결정론적 선택
function pick(arr, seed, offset = 0) {
  return arr[(seed + offset) % arr.length];
}

// 지역별 콘텐츠 변수 생성
function getRegionContext(regionName) {
  const seed = hashString(regionName);
  return {
    areaType: pick(AREA_TYPES, seed, 0),
    topBiz: [pick(BIZ_TYPES, seed, 0), pick(BIZ_TYPES, seed, 7), pick(BIZ_TYPES, seed, 3)],
    keyBenefit: pick(BENEFITS, seed, 2),
    subBenefits: [pick(BENEFITS, seed, 5), pick(BENEFITS, seed, 8)],
    opening: pick(OPENINGS, seed, 0),
    closing: pick(CLOSINGS, seed, 0),
    review: pick(REVIEWS, seed, 0),
    review2: pick(REVIEWS, seed, 3),
    // 숫자 변수 (지역마다 약간 다르게)
    shopCount: 150 + (seed % 350),
    satisfactionRate: 92 + (seed % 8),
    installTime: 1 + (seed % 3)
  };
}

// 제품 기본 정보
const PRODUCT_IMG_BASE = 'https://raw.githubusercontent.com/YOONSOEUN1/mastarpay/main/images/';
const PRODUCTS = {
  'pos': { name: '포스기', emoji: '🖥️', img: PRODUCT_IMG_BASE + 'pos.jpg', desc: '주문·결제·매출 통합 관리', keyword: '포스기', url: 'pos' },
  'card-2inch': { name: '2인치 단말기', emoji: '💳', img: PRODUCT_IMG_BASE + 'kis2200_2in.jpg', desc: '컴팩트 카드 단말기', keyword: '카드단말기', url: 'card-2inch' },
  'card-3inch': { name: '3인치 단말기', emoji: '🖨️', img: PRODUCT_IMG_BASE + 'kis1420_3in2.jpg', desc: '표준 카드 단말기', keyword: '카드단말기', url: 'card-3inch' },
  'card-toss': { name: '토스 단말기', emoji: '⚡', img: PRODUCT_IMG_BASE + 'Tosscard.png', desc: '간편결제 특화', keyword: '토스단말기', url: 'card-toss' },
  'card-wireless': { name: '무선 단말기', emoji: '📱', img: PRODUCT_IMG_BASE + 'Wirelesscard.png', desc: '이동 결제 자유', keyword: '무선단말기', url: 'card-wireless' },
  'card-bluetooth': { name: '블루투스 단말기', emoji: '🔷', img: PRODUCT_IMG_BASE + 'Bluetoothcard.jpg', desc: '휴대용 결제', keyword: '블루투스단말기', url: 'card-bluetooth' },
  'kiosk': { name: '키오스크', emoji: '🤖', img: PRODUCT_IMG_BASE + 'Kiosk.png', desc: '무인 주문 시스템', keyword: '키오스크', url: 'kiosk' },
  'kiosk-mini': { name: '미니 키오스크', emoji: '📱', img: PRODUCT_IMG_BASE + 'Kiosk2.png', desc: '소형 무인 주문', keyword: '미니키오스크', url: 'kiosk-mini' },
  'tableorder': { name: '테이블 오더', emoji: '📋', img: PRODUCT_IMG_BASE + 'tableorder.png', desc: 'QR 주문 시스템', keyword: '테이블오더', url: 'tableorder' },
  'removal': { name: '매장 철거', emoji: '🔨', img: '', desc: '철거·원상복구', keyword: '매장철거', url: 'removal' }
};

// ============================================================
// 콘텐츠 풀 (지역×제품 5만 페이지 다양화 — 결정론적 선택)
// hashString + 제품/지역 시드로 풀에서 결정론적 선택
// 슬롯 11개 × 평균 4~5개 변형 = 페이지당 약 5억 조합
// ============================================================

// ============================================================
// 콘텐츠 풀 데이터 (시범용 - 슬롯당 4~6개 변형)
// 실제 적용 시에는 슬롯당 8~12개로 확장 가능
// ============================================================

// hashString - 지역명+제품 조합으로 결정론적 시드 생성
// ============================================================
// 제품군별 5줄 설명 풀 (지역 페이지의 "제품 카드"용)
// 슬롯 5개 × 평균 5개 변형 = 5^5 = 3125 조합 / 제품군
// ============================================================

const PRODUCT_DESC_POOLS = {
  // 카드 단말기 공통 + 변형
  'card': {
    line1: [
      "{name}은(는) {desc}로, 매장 카운터에 안정적으로 자리 잡는 결제 전용 장비입니다.",
      "{name}은(는) {desc}를 핵심으로 한 표준 결제 단말기로, 카운터 운영 환경에 최적화되어 있습니다.",
      "{name}은(는) 카드 결제와 영수증 출력을 한 번에 처리하는 {desc} 단말기입니다.",
      "{name}은(는) {desc}를 표방한 모델로, 별도 단말기 없이 카드 결제와 인쇄까지 일체화한 장비입니다.",
      "{name}은(는) 결제 처리·영수증 인쇄·매출 마감을 단일 장비로 수행하는 {desc} 솔루션입니다."
    ],
    line2: [
      "신용·체크·간편결제(삼성페이·제로페이 등) 전 결제수단을 모두 지원합니다.",
      "신용카드와 체크카드는 물론 삼성페이·애플페이 같은 모바일 결제까지 폭넓게 지원합니다.",
      "VAN사 인증을 거쳐 안정적인 결제 처리와 빠른 승인 속도를 보장합니다.",
      "최신 EMV·MST·NFC 결제 규격을 모두 지원하며, 결제 거절률이 매우 낮은 편입니다.",
      "삼성페이·제로페이 등 비접촉 결제까지 한 단말기로 처리할 수 있어 결제수단 누락 우려가 없습니다."
    ],
    line3: [
      "VAN사 직제휴 모델로 카드 수수료가 시중 평균 대비 약 0.1~0.3%p 낮게 책정됩니다.",
      "직제휴 VAN사 단가가 적용되어 일 매출 기준 수수료 절감 효과가 누적됩니다.",
      "통신 안정성을 우선 설계해 피크타임에도 결제 지연이 거의 발생하지 않습니다.",
      "내장 영수증 프린터의 인쇄 속도와 내구성이 동급 모델 중 가장 우수한 수준입니다.",
      "결제 데이터는 실시간으로 본사 서버와 동기화되며 매출 누락 위험을 차단합니다."
    ],
    line4: [
      "음식점·카페·편의점·미용실 등 결제가 자주 발생하는 모든 업종에 적합합니다.",
      "객단가 1만원 이상 매장부터 일 결제 수백 건의 고회전 매장까지 모두 안정적으로 운영됩니다.",
      "고객 응대 동선상 카운터 한 곳에서 결제가 마무리되어야 하는 업종에 특히 적합합니다.",
      "프랜차이즈 본사 정산 체계와도 연동 가능해 가맹점 운영 환경에서도 무리 없이 도입됩니다.",
      "한 번 설치하면 통상 5~7년간 별다른 교체 없이 운영되어 장기적 비용 효율이 높습니다."
    ],
    line5: [
      "설치비·월 임대료 모두 무료이며, 카드 수수료만 정상 부과되는 부담 없는 도입 구조입니다.",
      "설치비 0원·월 사용료 0원으로 시작 부담 없이 도입할 수 있습니다.",
      "장애 발생 시 현장 출동 또는 원격 지원이 24시간 제공됩니다.",
      "전국 어느 매장이든 동일한 사후 관리 기준으로 책임집니다.",
      "당일 또는 익일 설치 완료가 가능하며, 사용법 교육까지 함께 제공됩니다."
    ]
  },
  
  // 포스기
  'pos': {
    line1: [
      "{name}은(는) {desc}를 핵심 기능으로 하는 매장 운영의 중심 장비입니다.",
      "{name}은(는) 주문·결제·매출·재고를 단일 화면에서 통합 관리하는 매장 운영 플랫폼입니다.",
      "{name}은(는) 카운터 업무 전반을 한 화면에서 처리할 수 있는 통합 관리 단말입니다.",
      "{name}은(는) 결제뿐 아니라 메뉴 관리·매출 분석·직원 관리까지 포괄하는 운영 시스템입니다."
    ],
    line2: [
      "주문 입력부터 결제, 영수증 인쇄, 매출 마감까지 전 과정을 단일 인터페이스로 처리합니다.",
      "터치스크린 기반 직관적 UI로 신규 직원도 30분 이내 숙달 가능합니다.",
      "메뉴 변경, 가격 인상, 옵션 추가 등 일상적 운영 변경을 즉시 반영할 수 있습니다.",
      "주방 출력기·키오스크·테이블오더 등 주변 장비와 실시간으로 연동됩니다.",
      "직원별 권한 관리, 근태 기록, 시간대별 매출 분석 기능까지 기본 탑재되어 있습니다."
    ],
    line3: [
      "클라우드 기반으로 매장 외부에서도 매출 현황을 실시간 모니터링할 수 있습니다.",
      "일·주·월·연 단위 매출 리포트가 자동 생성되어 세무 신고와 의사결정에 즉시 활용됩니다.",
      "재고 차감과 발주 알림까지 자동화되어 사장님의 관리 시간을 대폭 절감합니다.",
      "여러 매장을 운영하는 경우 본사·지점 통합 관리 모드로 매출을 한눈에 비교할 수 있습니다.",
      "데이터 백업이 자동으로 이루어져 단말기 고장 시에도 매출 손실 위험이 거의 없습니다."
    ],
    line4: [
      "객단가가 변동성 있는 음식점·주점·카페 등 외식업에 가장 적합합니다.",
      "메뉴 종류가 30종 이상이거나 옵션이 다양한 매장에서 운영 효율 차이가 가장 크게 발생합니다.",
      "직원 2인 이상이 동시에 운영하는 중·대형 매장에서 특히 진가를 발휘합니다.",
      "프랜차이즈 가맹점, 다점포 운영자, 배달앱 연동이 필요한 매장에 필수에 가깝습니다.",
      "회전율이 높은 분식·치킨·중식 매장에서 주문 누락 방지 효과가 즉시 체감됩니다."
    ],
    line5: [
      "설치비·소프트웨어 라이선스 모두 패키지 도입 시 무상 제공됩니다.",
      "최신 모델 기준 5년 이상 사용해도 처리 속도 저하가 거의 없는 내구성을 갖추고 있습니다.",
      "설치 후 1년간 무상 A/S와 정기 소프트웨어 업데이트가 함께 제공됩니다.",
      "장애 발생 시 원격 지원으로 평균 10분 이내 해결되며, 하드웨어는 현장 출동합니다.",
      "도입 매장 평균 만족도가 95% 이상을 유지하는 검증된 솔루션입니다."
    ]
  },
  
  // 키오스크
  'kiosk': {
    line1: [
      "{name}은(는) {desc}를 통해 주문·결제 인력 부담을 근본적으로 해소하는 무인 운영 장비입니다.",
      "{name}은(는) 고객이 직접 메뉴를 선택하고 결제까지 완료하는 셀프 오더링 단말입니다.",
      "{name}은(는) 인건비 부담이 큰 매장에서 카운터 인력을 사실상 대체할 수 있는 무인 솔루션입니다.",
      "{name}은(는) 24시간 운영 또는 피크타임 인력 부족 매장에 가장 효과적인 자동화 장비입니다."
    ],
    line2: [
      "터치스크린 기반 메뉴 탐색과 카드·간편결제·현금까지 모든 결제수단을 지원합니다.",
      "직관적 UI 설계로 50대 이상 고객도 평균 1분 이내 주문을 완료합니다.",
      "다국어 메뉴(한·영·중·일)가 기본 탑재되어 외국인 고객 응대도 자연스럽게 이루어집니다.",
      "주방 출력기와 실시간 연동되어 주문 누락이나 전달 오류가 거의 발생하지 않습니다.",
      "메뉴 사진·옵션·재고 현황을 즉시 갱신할 수 있어 매장 변화에 빠르게 대응합니다."
    ],
    line3: [
      "도입 매장 평균 인건비 절감 효과는 월 80~150만원, 회수 기간은 6~12개월 수준입니다.",
      "주문 처리 속도가 사람 대비 약 30~40% 빨라져 피크타임 매출 손실이 줄어듭니다.",
      "객단가 향상 효과(추천 메뉴 자동 노출, 옵션 추가 유도)도 평균 8~12% 발생합니다.",
      "고객 데이터(주문 패턴·재방문율)가 자동 누적되어 마케팅 의사결정에 활용됩니다.",
      "운영 데이터가 클라우드에 저장되어 외부에서도 매장 상황을 실시간 확인 가능합니다."
    ],
    line4: [
      "분식·패스트푸드·카페·치킨·아이스크림 등 메뉴가 표준화된 업종에 가장 적합합니다.",
      "객단가 5천~1만5천원 구간의 회전율 높은 매장에서 도입 효과가 가장 빠르게 나타납니다.",
      "스터디카페·코인노래방·셀프빨래방 등 본질적으로 무인 운영을 지향하는 업종에 필수입니다.",
      "직원 1~2인이 운영하는 소형 매장에서 인력 1명분 이상의 효과를 발휘합니다.",
      "프랜차이즈 가맹점이라면 본사 메뉴 일괄 업데이트 기능도 함께 활용 가능합니다."
    ],
    line5: [
      "설치비·하드웨어 비용·월 사용료 모두 패키지 도입 시 부담을 최소화한 구조로 설계됩니다.",
      "매장 규모와 동선에 맞춰 21·24·27인치 모델을 선택할 수 있습니다.",
      "스탠드형·벽걸이형·테이블형 등 매장 환경별 거치 옵션을 제공합니다.",
      "설치 당일 메뉴 입력과 운영 교육까지 한 번에 완료되어 즉시 영업에 투입 가능합니다.",
      "1년 무상 A/S 후에도 합리적 비용으로 사후 관리가 지속됩니다."
    ]
  },
  
  // 테이블오더
  'tableorder': {
    line1: [
      "{name}은(는) 테이블에 부착된 QR 또는 태블릿으로 고객이 직접 주문하는 시스템입니다.",
      "{name}은(는) 홀 직원의 주문 동선을 근본적으로 줄이는 셀프 오더링 솔루션입니다.",
      "{name}은(는) 고객이 자리에서 메뉴를 보고 주문·결제까지 처리하는 비대면 주문 체계입니다."
    ],
    line2: [
      "고객 스마트폰 QR 스캔 또는 테이블 비치 태블릿을 통해 주문이 즉시 주방으로 전송됩니다.",
      "메뉴 사진·재료·알레르기 정보를 시각적으로 제공해 고객 만족도가 크게 향상됩니다.",
      "메뉴별 추천 조합·인기 메뉴 자동 노출 기능으로 객단가가 자연스럽게 상승합니다.",
      "주문 변경·추가·취소가 고객 측에서 직접 가능해 응대 부담이 대폭 감소합니다."
    ],
    line3: [
      "도입 매장 평균 홀 직원 부담이 약 40% 감소하며, 직원 1인이 더 많은 테이블을 담당할 수 있습니다.",
      "주문 누락·실수 비율이 거의 0에 수렴하여 클레임 발생이 현저히 줄어듭니다.",
      "고객별 주문 이력이 자동 기록되어 단골 관리와 재방문 유도에 활용됩니다.",
      "객단가가 평균 10~15% 상승하는 효과가 도입 매장에서 일관되게 보고됩니다."
    ],
    line4: [
      "주점·고깃집·일식·중식 등 테이블당 주문 빈도가 높은 외식업에 가장 적합합니다.",
      "직원 채용이 어렵거나 인건비 부담이 큰 매장에서 도입 효과가 가장 크게 나타납니다.",
      "객단가 2만원 이상의 중·고급 외식업에서 운영 품질 향상 효과가 즉시 체감됩니다.",
      "프랜차이즈 가맹점에서는 본사 메뉴 일괄 갱신 기능과 연동되어 운영이 더욱 간편합니다."
    ],
    line5: [
      "QR 방식은 무료에 가깝게, 태블릿 방식은 합리적 임대료로 도입 가능합니다.",
      "포스기·키오스크·주방 출력기와 모두 연동되어 매장 운영 체계 전반과 통합됩니다.",
      "설치는 매장 영업 시간 외 1~2시간 안에 완료되며, 메뉴 입력까지 함께 진행됩니다.",
      "1년 무상 A/S와 메뉴 업데이트 지원이 기본 제공됩니다."
    ]
  },
  
  // 매장 철거
  'removal': {
    line1: [
      "{name}은(는) 매장 폐업·이전 시 시설물·집기·간판 등을 일괄 철거하고 원상복구하는 전문 서비스입니다.",
      "{name}은(는) 임대 만료 또는 업종 변경 시 발생하는 모든 철거·복구 작업을 책임지는 종합 솔루션입니다.",
      "{name}은(는) 매장 폐업 시 가장 큰 부담인 원상복구를 합리적 비용으로 해결하는 서비스입니다."
    ],
    line2: [
      "주방 시설·전기 배선·간판·내장재·바닥·천장까지 매장 철거 전 영역을 단일 업체에서 처리합니다.",
      "임대인이 요구하는 원상복구 범위를 정확히 파악하여 분쟁 가능성을 사전에 차단합니다.",
      "폐기물 운반·처리까지 포함된 단일 견적으로 추가 비용 발생 위험을 최소화합니다."
    ],
    line3: [
      "현장 무료 방문 견적 후 작업 일정·비용·범위를 사전 확정하여 진행됩니다.",
      "전문 인력이 직접 시공하여 임대인이 요구하는 수준의 원상복구를 보장합니다.",
      "작업 완료 후 임대인 인계 시점까지 책임지며, 1년간 사후 책임을 보증합니다.",
      "공사 소음·먼지를 최소화하는 야간 작업 옵션도 운영합니다."
    ],
    line4: [
      "음식점·카페 등 외식업 매장은 주방 후드·바닥 방수·전기 배선까지 종합 철거가 필요합니다.",
      "미용실·네일샵 등 인테리어 비중이 큰 매장은 바닥·벽체·간판 철거 범위를 정확히 산정해야 합니다.",
      "프랜차이즈 가맹점은 본사 인테리어 제거 의무까지 포함한 철거 범위 산정이 중요합니다."
    ],
    line5: [
      "현장 견적은 무료이며, 매장 규모에 따라 작업 기간 1~5일 내 완료됩니다.",
      "전국 어느 지역이든 직접 출장 견적이 가능하며, 야간·주말 작업도 별도 협의 가능합니다.",
      "1년 사후 책임 보증으로 임대인 분쟁 발생 시 마스터페이가 직접 대응합니다."
    ]
  }
};

// 제품 슬러그 → 풀 카테고리 매핑
function getProductPoolKey(slug) {
  if (slug === 'pos') return 'pos';
  if (slug.startsWith('card-')) return 'card';
  if (slug.startsWith('kiosk')) return 'kiosk';
  if (slug === 'tableorder') return 'tableorder';
  if (slug === 'removal') return 'removal';
  return 'card';
}

// 시도 이름 → 짧은 표기 (예: "부산광역시" → "부산")
// 다른 지역과 겹치는 구·동 이름(동구·서구·중구 등) 식별을 위해 H1·라벨에 사용
function getShortSidoName(sidoName) {
  const map = {
    '서울특별시': '서울', '부산광역시': '부산', '대구광역시': '대구',
    '인천광역시': '인천', '광주광역시': '광주', '대전광역시': '대전',
    '울산광역시': '울산', '세종특별자치시': '세종',
    '경기도': '경기', '강원특별자치도': '강원', '강원도': '강원',
    '충청북도': '충북', '충청남도': '충남',
    '전라북도': '전북', '전북특별자치도': '전북', '전라남도': '전남',
    '경상북도': '경북', '경상남도': '경남',
    '제주특별자치도': '제주', '제주도': '제주'
  };
  return map[sidoName] || sidoName;
}

// 제품 5줄 설명 생성 (지역명+제품 시드로 결정론적)
// 한국어 조사 자동 처리 (받침에 따라 은/는, 이/가, 을/를, 으로/로, 와/과 자동 선택)
function josaText(text, vars) {
  // 받침 유무 판정 (마지막 글자가 한글이면 받침 체크)
  const hasBatchim = (str) => {
    if (!str) return false;
    const last = str.charCodeAt(str.length - 1);
    if (last < 0xAC00 || last > 0xD7A3) return false; // 한글 음절 범위 밖
    return ((last - 0xAC00) % 28) !== 0;
  };
  
  // 변수 치환
  let result = text;
  for (const [key, value] of Object.entries(vars)) {
    if (value === undefined || value === null) continue;
    const v = String(value);
    const batchim = hasBatchim(v);
    
    result = result
      .replace(new RegExp('\\{' + key + '\\}은\\(는\\)', 'g'), v + (batchim ? '은' : '는'))
      .replace(new RegExp('\\{' + key + '\\}이\\(가\\)', 'g'), v + (batchim ? '이' : '가'))
      .replace(new RegExp('\\{' + key + '\\}을\\(를\\)', 'g'), v + (batchim ? '을' : '를'))
      .replace(new RegExp('\\{' + key + '\\}와\\(과\\)', 'g'), v + (batchim ? '과' : '와'))
      .replace(new RegExp('\\{' + key + '\\}\\(으\\)로', 'g'), v + (batchim ? '으로' : '로'))
      .replace(new RegExp('\\{' + key + '\\}\\(이\\)나', 'g'), v + (batchim ? '이나' : '나'))
      .replace(new RegExp('\\{' + key + '\\}', 'g'), v);
  }
  return result;
}

function buildProductDesc(productSlug, regionName) {
  const product = PRODUCTS[productSlug];
  if (!product) return [];
  const seed = hashString(regionName + productSlug);
  const poolKey = getProductPoolKey(productSlug);
  const pool = PRODUCT_DESC_POOLS[poolKey];
  
  const replace = (s) => josaText(s, { name: product.name, desc: product.desc });
  
  return [
    replace(pick(pool.line1, seed, 0)),
    replace(pick(pool.line2 || pool.line1, seed, 1)),
    replace(pick(pool.line3 || pool.line1, seed, 2)),
    replace(pick(pool.line4 || pool.line1, seed, 3)),
    replace(pick(pool.line5 || pool.line1, seed, 4))
  ];
}

// ============================================================
// 지역×제품 페이지 섹션별 콘텐츠 풀
// 6개 섹션 × 평균 5~6 변형 = 6^6 = 46,656 조합
// ============================================================

// 섹션 1: 지역 + 제품 도입 단락 (200~300자)
const RP_INTRO_POOLS = {
  'card': [
    "{region}은(는) {areaType} 특성이 뚜렷한 지역으로, 카드 결제 비중이 90%를 넘는 업종이 다수 분포해 있습니다. 이러한 환경에서는 결제 단말기의 처리 속도와 통신 안정성이 매장 회전율에 직접적인 영향을 미칩니다. {productName}은(는) 이 지역의 카드 결제 환경에 가장 적합한 표준 모델로 평가받고 있으며, 결제 거절·승인 지연 같은 운영 리스크를 최소화하는 검증된 장비입니다.",
    "{region}에서 매장을 운영하는 사장님들이 카드 단말기 선택 시 가장 중요하게 보는 요소는 결제 안정성과 VAN사 수수료입니다. {region}의 {areaType} 환경은 시간대별 결제 빈도 편차가 크기 때문에, 어느 시점에서도 결제 처리가 지연되지 않는 단말기가 필수입니다. {productName}은(는) {region} 매장 환경에 적합한 통신·결제 안정성을 갖춘 단말로, 도입 후 결제 관련 클레임이 거의 발생하지 않는 모델입니다.",
    "{region}은(는) {topBiz1}, {topBiz2} 같은 업종이 활발히 운영되는 지역으로, 매장당 일 결제 건수가 평균 이상인 환경입니다. 이런 환경에서는 단말기의 안정성과 영수증 인쇄 속도가 매장 운영의 효율을 결정합니다. {productName}은(는) 이 두 조건을 모두 충족하는 표준 모델로, {region} 내 다수 매장에 도입되어 운영 안정성이 검증되었습니다.",
    "{region}의 매장 환경은 {areaType}을(를) 중심으로 다양한 업종이 혼재되어 있어, 카드 결제 단말기 선택에 신중함이 요구됩니다. {productName}은(는) 결제 안정성·VAN사 수수료·사후 관리 등 사장님이 가장 우선시하는 항목에서 균형 있는 성능을 발휘하는 모델입니다. 마스터페이는 {region} 전 지역 직접 방문 설치를 통해 매장별 환경에 최적화된 세팅을 제공합니다.",
    "{region}에서 카드 단말기를 새로 설치하거나 교체하려는 매장이 늘고 있습니다. 그 배경에는 VAN사 수수료 절감 요구, 간편결제 확산, 노후 단말기의 결제 거절 빈발 등이 자리합니다. {productName}은(는) 이 모든 변화에 대응하는 최신 표준 모델이며, {region}의 {areaType} 환경에서 안정적인 운영이 가능한 검증된 장비입니다."
  ],
  'pos': [
    "{region}에서 포스기 도입을 검토하는 사장님이 늘어나는 배경에는 매출 관리 자동화에 대한 요구가 자리합니다. {region}의 {areaType} 환경은 매장당 메뉴 종류와 결제 빈도가 다양해, 카드 단말기만으로는 매출·재고·직원 관리가 분리되어 운영 효율이 떨어지는 경우가 많습니다. {productName}은(는) 이 모든 영역을 단일 화면에서 통합 관리하는 매장 운영 플랫폼으로, 도입 즉시 운영 부담이 체감되는 장비입니다.",
    "{region}의 외식업·소매업 매장에서 포스기는 더 이상 선택이 아니라 표준 인프라가 되었습니다. 메뉴 변경, 가격 조정, 매출 분석, 직원 관리, 배달앱 연동 등 일상 운영에 필요한 모든 기능이 포스기에 통합되어 있기 때문입니다. {productName}은(는) {region} 매장 환경에서 가장 자주 도입되는 모델로, 빠른 처리 속도와 직관적 UI를 동시에 갖추고 있습니다.",
    "{region}은(는) {topBiz1}, {topBiz2} 등 메뉴 회전이 빠른 업종이 다수 운영되는 지역으로, 포스기의 주문 처리 속도가 매장 회전율에 직접 영향을 미칩니다. {productName}은(는) 터치스크린 응답 속도와 주방 출력기 연동 안정성에서 우수한 평가를 받고 있으며, {region} 내 도입 매장의 운영 효율을 평균 이상으로 끌어올리는 핵심 장비입니다.",
    "{region}에서 매장 운영 효율화를 고민하는 사장님께 가장 먼저 권하는 장비가 포스기입니다. 인건비 부담, 매출 누락 위험, 세무 처리 복잡성 같은 문제는 포스기 도입 한 번으로 상당 부분 해소됩니다. {productName}은(는) {region} 환경에 검증된 표준 모델로, 설치 후 적응 기간이 짧고 운영 안정성이 높은 것이 특징입니다."
  ],
  'kiosk': [
    "{region}에서 키오스크 도입은 더 이상 대형 프랜차이즈만의 선택이 아닙니다. 인건비 상승, 직원 채용 어려움, 피크타임 운영 부담 등 소상공인이 직면한 현실적 문제를 해결하는 가장 직접적인 수단으로 자리 잡았습니다. {region}의 {areaType} 환경은 무인 결제에 대한 고객 수용도가 이미 높아, 키오스크 도입 즉시 매장 운영 구조가 근본적으로 변화하는 경우가 많습니다. {productName}은(는) 이 변화를 안정적으로 지원하는 검증된 모델입니다.",
    "{region}의 매장에서 키오스크가 빠르게 확산되는 이유는 명확합니다. 카운터 인력 1명을 기계로 대체하면서도 주문 처리 속도는 오히려 빨라지고, 객단가는 평균 10% 이상 상승하기 때문입니다. {productName}은(는) {region} 환경에서 도입 후 6~12개월 내 투자 회수가 가능한 모델로, 장기적 운영 비용 구조를 근본적으로 개선합니다.",
    "{region}은(는) {topBiz1}, {topBiz2} 등 메뉴가 표준화된 업종이 다수 운영되는 지역으로, 키오스크 도입 효과가 가장 크게 나타나는 환경입니다. 고객이 직접 주문·결제까지 마무리하는 셀프 오더링 구조는 직원 응대 부담을 크게 줄이고, 동시에 주문 누락·결제 오류 같은 운영 리스크를 거의 제거합니다. {productName}은(는) 이러한 운영 변화를 안정적으로 끌어내는 표준 무인 단말입니다.",
    "{region}에서 키오스크 도입을 검토하는 매장이 매년 빠르게 증가하고 있습니다. 주문 자동화로 인한 인건비 절감, 객단가 상승, 운영 시간 확장 등 도입 효과가 명확하기 때문입니다. {productName}은(는) {region} 매장 환경에서 검증된 모델로, 설치 당일부터 즉시 운영이 가능한 안정성을 갖추고 있습니다."
  ],
  'tableorder': [
    "{region}에서 테이블오더 도입은 외식업 운영의 기본 인프라가 되어가고 있습니다. {region}의 {areaType} 환경은 객단가가 일정 수준 이상이고 테이블당 주문 빈도가 높은 매장이 다수여서, 테이블오더 도입이 운영 효율과 객단가 양쪽에 즉각적 효과를 가져옵니다. {productName}은(는) 이러한 환경에 적합한 검증된 솔루션입니다.",
    "{region}의 외식업 매장에서 직원 채용이 점점 어려워지고 있는 가운데, 테이블오더는 인력 구조를 근본적으로 재설계하는 도구로 활용되고 있습니다. {productName}은(는) {region} 환경에 도입된 다수 매장에서 홀 운영 부담을 평균 40% 이상 줄이는 결과를 만들어냈습니다.",
    "{region}은(는) {topBiz1}, {topBiz2} 등 테이블 단위 주문이 자주 발생하는 업종이 활발한 지역입니다. 이러한 환경에서는 테이블오더 도입이 매장 회전율과 객단가 양쪽에 즉각적 영향을 미칩니다. {productName}은(는) 안정적인 주문 전송과 직관적 UI를 통해 도입 즉시 운영 효과를 발휘합니다."
  ],
  'removal': [
    "{region}에서 매장 폐업·이전을 결정한 사장님이 가장 큰 부담을 느끼는 영역이 원상복구입니다. 임대인의 요구 수준, 폐기물 처리 비용, 작업 기간 등 변수가 많아 직접 알아보기 어려운 영역이기 때문입니다. {productName} 서비스는 {region} 전 지역 매장 철거를 단일 업체에서 책임지며, 견적부터 사후 책임까지 일관된 기준으로 진행됩니다.",
    "{region}의 임대 만료·업종 변경 매장에서 가장 자주 발생하는 분쟁이 원상복구 범위에 관한 것입니다. {productName} 서비스는 {region} 매장 철거 경험을 바탕으로 임대인이 요구하는 복구 수준을 정확히 파악하여 분쟁 가능성을 사전에 차단합니다. 무료 현장 견적과 1년 사후 책임 보증으로 안전한 마무리를 보장합니다.",
    "{region}에서 매장을 정리하는 사장님이 합리적 비용으로 안전한 철거를 원할 때 가장 자주 찾는 서비스가 {productName}입니다. {region}의 {areaType} 환경에서 누적된 시공 경험을 바탕으로, 매장 규모와 임대 조건에 맞는 최적의 철거 방안을 제시합니다."
  ]
};

// 섹션 2: 이 제품을 선택하면 좋은 점 (4가지, 각 슬롯 5~6 변형)
const RP_BENEFITS_POOLS = {
  'card': {
    title: ['선택의 이유', '도입 효과', '주요 장점', '핵심 가치'],
    items: [
      // 슬롯 1: 비용
      [
        { h: '수수료 절감', d: 'VAN사 직제휴 모델로 카드 수수료가 시중 평균 대비 약 0.1~0.3%p 낮게 책정되어 일 매출 누적 시 실질적 비용 절감 효과가 발생합니다.' },
        { h: '도입 비용 0원', d: '설치비·월 임대료·소프트웨어 라이선스 모두 무료이며, 카드 수수료만 정상 부과되어 시작 부담이 거의 없습니다.' },
        { h: '장기 비용 효율', d: '한 번 설치 후 통상 5~7년간 추가 비용 없이 운영되어 매장 운영 비용 구조가 안정적입니다.' },
        { h: '교체 비용 무료', d: '기존 단말기 교체 시에도 무료 견적 후 진행되며, 잔여 약정이 있는 경우 인수 지원도 협의 가능합니다.' }
      ],
      // 슬롯 2: 안정성
      [
        { h: '결제 안정성', d: '최신 EMV·MST·NFC 결제 규격을 모두 지원하며, VAN사 인증 통과 모델로 결제 거절률이 동급 대비 매우 낮습니다.' },
        { h: '통신 안정성', d: '유선·무선·LTE 백업 통신을 동시 지원해 인터넷 장애 시에도 결제 처리가 중단되지 않습니다.' },
        { h: '하드웨어 내구성', d: '국내 주요 제조사 검증 모델로 일 결제 수백 건의 고회전 매장에서도 5년 이상 무고장 운영이 가능합니다.' },
        { h: '데이터 동기화', d: '결제 데이터는 실시간으로 본사 서버와 동기화되어 매출 누락 위험이 거의 없습니다.' }
      ],
      // 슬롯 3: 결제 수단
      [
        { h: '전 결제수단 지원', d: '신용·체크·간편결제(삼성페이·애플페이·제로페이 등) 모든 결제수단을 단일 단말로 처리합니다.' },
        { h: '간편결제 대응', d: '비접촉 결제 비중이 빠르게 늘어나는 환경에서 NFC·QR 코드 결제까지 모두 처리해 결제수단 누락이 없습니다.' },
        { h: '외국인 결제', d: '해외 발급 카드(VISA·MasterCard 등) 결제까지 안정적으로 처리해 관광지·번화가 매장 운영에 적합합니다.' },
        { h: '분할 결제', d: '한 거래에서 여러 결제수단으로 나눠 결제하는 분할 결제도 지원하여 단체 손님 응대가 편리합니다.' }
      ],
      // 슬롯 4: 운영 편의
      [
        { h: '빠른 영수증 인쇄', d: '내장 프린터의 인쇄 속도가 동급 대비 빠르며, 영수증 용지도 표준 76mm 규격으로 어디서나 구매 가능합니다.' },
        { h: '직관적 조작', d: '단말 UI가 단순하고 직관적이어서 신규 직원도 5분 내 결제 처리 방법을 숙달할 수 있습니다.' },
        { h: '매출 마감 자동화', d: '일 매출 마감이 자동으로 처리되어 사장님이 별도로 매출 정산을 챙기지 않아도 됩니다.' },
        { h: '소모품 관리', d: '영수증 용지·잉크 등 소모품 교체 시점 알림 기능으로 영업 중 소모품 부족 사태를 방지합니다.' }
      ]
    ]
  },
  'pos': {
    title: ['도입 효과', '주요 장점', '운영 변화', '핵심 가치'],
    items: [
      [
        { h: '운영 통합', d: '주문·결제·매출·재고·직원 관리를 단일 화면에서 처리하여 매장 운영 시간이 크게 단축됩니다.' },
        { h: '메뉴 즉시 변경', d: '가격 인상·메뉴 추가·옵션 변경 같은 일상적 운영 변경을 즉시 반영할 수 있어 매장 변화에 빠르게 대응합니다.' },
        { h: '주방 연동', d: '주방 출력기와 실시간 연동되어 주문 누락·전달 오류가 거의 발생하지 않습니다.' },
        { h: '배달앱 연동', d: '배민·요기요 등 주요 배달앱과 자동 연동되어 주문 입력 이중 작업이 사라집니다.' }
      ],
      [
        { h: '실시간 매출 분석', d: '시간대·요일·메뉴별 매출 현황이 자동 분석되어 운영 의사결정의 근거가 됩니다.' },
        { h: '재고 자동 차감', d: '주문 발생 시 재고가 자동으로 차감되고, 일정 수준 이하로 떨어지면 발주 알림이 발송됩니다.' },
        { h: '직원 권한 관리', d: '직원별로 메뉴 등록·환불·할인 권한을 차등 설정하여 운영 보안을 강화합니다.' },
        { h: '근태 자동 기록', d: '직원 출퇴근 기록이 자동 누적되어 급여 정산 시 별도 관리 부담이 사라집니다.' }
      ],
      [
        { h: '클라우드 백업', d: '매출 데이터가 자동으로 클라우드에 백업되어 단말기 고장 시에도 데이터 손실 위험이 없습니다.' },
        { h: '원격 모니터링', d: '매장 외부에서도 실시간 매출 현황을 스마트폰으로 확인할 수 있어 다점포 운영에 적합합니다.' },
        { h: '세무 신고 자동화', d: '일·월·연 단위 매출 리포트가 자동 생성되어 세무 신고 시점에 별도 정리 작업이 필요 없습니다.' },
        { h: '고객 데이터 누적', d: '단골 고객 주문 패턴이 자동 누적되어 마케팅 의사결정에 즉시 활용 가능합니다.' }
      ],
      [
        { h: '직관적 UI', d: '터치스크린 기반 직관적 UI로 신규 직원도 30분 이내 숙달이 가능합니다.' },
        { h: '빠른 처리 속도', d: '주문 입력부터 결제 완료까지 평균 30초 이내 처리되어 피크타임 회전율이 향상됩니다.' },
        { h: '하드웨어 내구성', d: '5년 이상 사용해도 처리 속도 저하가 거의 없는 검증된 내구성을 갖추고 있습니다.' },
        { h: '확장성', d: '키오스크·테이블오더·주방 출력기 등 주변 장비를 필요할 때 추가 연동할 수 있는 확장 구조입니다.' }
      ]
    ]
  },
  'kiosk': {
    title: ['도입 효과', '운영 변화', '주요 장점', '핵심 가치'],
    items: [
      [
        { h: '인건비 절감', d: '카운터 인력 1명을 사실상 대체하여 월 80~150만원의 인건비 절감 효과가 발생합니다.' },
        { h: '회수 기간 단축', d: '도입 비용 회수 기간이 평균 6~12개월로, 장기 운영 시 순수익 증가 폭이 매우 큰 장비입니다.' },
        { h: '운영 시간 확장', d: '직원 부재 시간대에도 무인 운영이 가능해 영업 시간 확장이나 24시간 운영을 검토할 수 있습니다.' },
        { h: '인력 의존도 감소', d: '직원 채용·교육 부담이 줄어들어 운영 안정성이 크게 향상됩니다.' }
      ],
      [
        { h: '주문 처리 속도', d: '사람 대비 약 30~40% 빠른 주문 처리 속도로 피크타임 매출 손실이 줄어듭니다.' },
        { h: '주문 정확도', d: '고객이 직접 주문하므로 주문 누락·실수 비율이 거의 0에 수렴합니다.' },
        { h: '메뉴 즉시 갱신', d: '메뉴 사진·가격·옵션을 즉시 갱신할 수 있어 시즌 메뉴 운영이 매우 편리합니다.' },
        { h: '주방 자동 연동', d: '주문이 즉시 주방 출력기로 전송되어 주문 전달 오류가 거의 발생하지 않습니다.' }
      ],
      [
        { h: '객단가 상승', d: '추천 메뉴 자동 노출, 옵션 추가 유도 등으로 객단가가 평균 8~12% 상승하는 효과가 보고됩니다.' },
        { h: '다국어 지원', d: '한·영·중·일 메뉴가 기본 탑재되어 외국인 고객 응대가 자연스럽게 이루어집니다.' },
        { h: '결제 수단 다양화', d: '신용·체크·간편결제는 물론 현금까지 모든 결제수단을 단말 하나로 처리합니다.' },
        { h: '운영 데이터', d: '주문 패턴·재방문율·메뉴 선호도 등 운영 데이터가 자동 누적되어 의사결정에 활용됩니다.' }
      ],
      [
        { h: '직관적 인터페이스', d: '50대 이상 고객도 평균 1분 이내 주문을 완료하는 직관적 UI 설계로 연령대 제약이 없습니다.' },
        { h: '하드웨어 내구성', d: '24시간 무인 운영 환경에서도 5년 이상 무고장 운영이 가능한 내구성을 갖추고 있습니다.' },
        { h: '설치 다양성', d: '스탠드형·벽걸이형·테이블형 등 매장 환경별 거치 옵션을 제공합니다.' },
        { h: '사후 관리', d: '1년 무상 A/S 후에도 합리적 비용으로 사후 관리가 지속됩니다.' }
      ]
    ]
  },
  'tableorder': {
    title: ['도입 효과', '운영 변화', '주요 장점'],
    items: [
      [
        { h: '홀 인력 효율', d: '홀 직원의 주문·전달·확인 업무가 사라져 1인이 담당 가능한 테이블 수가 약 40% 증가합니다.' },
        { h: '주문 정확도', d: '고객이 직접 주문하므로 주문 누락·실수 비율이 거의 0에 수렴해 클레임이 현저히 줄어듭니다.' },
        { h: '인건비 절감', d: '홀 직원 채용 인력이 줄어들어 월 100만원 이상의 인건비 절감 효과가 일반적입니다.' }
      ],
      [
        { h: '객단가 상승', d: '추천 메뉴 자동 노출, 사이드 메뉴 유도 등으로 객단가가 평균 10~15% 상승합니다.' },
        { h: '회전율 향상', d: '주문·결제 시간이 단축되어 테이블 회전율이 평균 15~20% 향상됩니다.' },
        { h: '메뉴 갱신 즉시', d: '메뉴·가격·옵션을 즉시 갱신할 수 있어 시즌 메뉴 운영이 매우 자유롭습니다.' }
      ],
      [
        { h: '시각적 메뉴', d: '메뉴 사진·재료·알레르기 정보를 시각적으로 제공해 고객 만족도가 크게 향상됩니다.' },
        { h: '다국어 지원', d: '한·영·중·일 메뉴가 기본 탑재되어 외국인 고객 응대가 자연스럽게 이루어집니다.' },
        { h: '단골 관리', d: '고객별 주문 이력이 자동 기록되어 단골 관리와 재방문 유도에 즉시 활용됩니다.' }
      ]
    ]
  },
  'removal': {
    title: ['서비스 특징', '주요 장점', '책임 범위'],
    items: [
      [
        { h: '단일 업체 책임', d: '주방·내장재·전기·간판·바닥 등 매장 철거 전 영역을 단일 업체에서 처리하여 책임 소재가 명확합니다.' },
        { h: '폐기물 일괄 처리', d: '폐기물 운반·처리 비용이 견적에 모두 포함되어 작업 후 추가 비용이 발생하지 않습니다.' },
        { h: '임대인 분쟁 차단', d: '임대인이 요구하는 원상복구 수준을 정확히 파악하여 인계 시 분쟁 가능성을 사전에 차단합니다.' }
      ],
      [
        { h: '무료 현장 견적', d: '현장 방문 견적이 무료이며, 작업 일정·비용·범위를 사전 확정하여 진행됩니다.' },
        { h: '1년 사후 책임', d: '작업 완료 후 1년간 임대인 분쟁 발생 시 마스터페이가 직접 대응합니다.' },
        { h: '야간 작업', d: '주거지 인근 매장은 소음·먼지 최소화를 위한 야간 작업 옵션도 운영합니다.' }
      ]
    ]
  }
};

// 섹션 3: 추천 업종 + 활용 사례 (각 슬롯 5~6 변형)
const RP_INDUSTRY_POOLS = {
  'card': [
    [
      { biz: '음식점·식당', star: 5, effect: '주문 빈도가 높은 환경에서 빠른 결제 처리로 회전율 향상' },
      { biz: '카페·베이커리', star: 5, effect: '간편결제 비중이 높은 업종에 최적화된 결제 안정성' },
      { biz: '편의점·마트', star: 5, effect: '일 결제 수백 건 환경에서 검증된 통신 안정성' },
      { biz: '미용실·네일샵', star: 4, effect: '예약 결제·후불 결제까지 모두 지원' }
    ],
    [
      { biz: '주점·호프집', star: 5, effect: '심야 영업 환경에서 안정적 결제 처리 보장' },
      { biz: '치킨·피자', star: 5, effect: '배달 결제까지 함께 처리하는 통합 결제 환경' },
      { biz: '학원·교습소', star: 4, effect: '학원비 결제 자동 분할 청구 지원' },
      { biz: '의류·패션', star: 4, effect: '환불·교환 처리가 단순한 결제 흐름' }
    ],
    [
      { biz: '약국·병의원', star: 5, effect: '의료 보험 결제·실손 청구 연동 지원' },
      { biz: '소형 식료품', star: 5, effect: '소액 결제 다수 환경에서 빠른 처리 속도' },
      { biz: '서점·팬시', star: 4, effect: '도서·문구류 결제에 적합한 단순 인터페이스' },
      { biz: '꽃집·반찬', star: 4, effect: '주문·배송·결제 흐름이 단순한 환경에 최적' }
    ]
  ],
  'pos': [
    [
      { biz: '음식점·식당', star: 5, effect: '메뉴 종류 30종 이상 환경에서 운영 효율 극대화' },
      { biz: '카페·디저트', star: 5, effect: '옵션 다양한 메뉴 환경에 최적화된 주문 흐름' },
      { biz: '주점·호프집', star: 5, effect: '테이블별 주문 관리·정산이 단일 화면에서 가능' },
      { biz: '치킨·피자', star: 5, effect: '배달앱 연동으로 이중 입력 작업 제거' }
    ],
    [
      { biz: '편의점·마트', star: 5, effect: '바코드 스캔·재고 자동 차감으로 운영 부담 감소' },
      { biz: '베이커리', star: 5, effect: '시간대별 메뉴 변경·재고 관리 자동화' },
      { biz: '미용실', star: 4, effect: '예약·시술·판매 통합 관리 환경' },
      { biz: '학원', star: 4, effect: '수강료·교재비 통합 결제 관리' }
    ],
    [
      { biz: '분식점', star: 5, effect: '주문 회전 빠른 환경에서 처리 속도 검증' },
      { biz: '족발·보쌈', star: 5, effect: '홀·배달 동시 운영 환경에 최적화' },
      { biz: '횟집·일식', star: 5, effect: '단가 변동 메뉴 운영에 유리한 즉시 갱신' },
      { biz: '한식·정식', star: 4, effect: '코스 메뉴·세트 메뉴 관리 자동화' }
    ]
  ],
  'kiosk': [
    [
      { biz: '분식·패스트푸드', star: 5, effect: '메뉴 표준화 환경에서 무인 운영 효과 극대화' },
      { biz: '카페·디저트', star: 5, effect: '메뉴 사진 기반 주문으로 객단가 상승' },
      { biz: '치킨·피자', star: 5, effect: '포장 주문 환경에서 카운터 부담 해소' },
      { biz: '아이스크림', star: 5, effect: '회전율 높은 환경에서 처리 속도 향상' }
    ],
    [
      { biz: '스터디카페', star: 5, effect: '24시간 무인 운영 환경에 필수 장비' },
      { biz: '코인노래방', star: 5, effect: '셀프 결제·이용 시간 자동 관리' },
      { biz: '셀프빨래방', star: 5, effect: '무인 결제·세탁기 연동 운영' },
      { biz: '무인 매장', star: 5, effect: '무인 운영의 핵심 인프라' }
    ],
    [
      { biz: '음식점', star: 4, effect: '피크타임 카운터 부담 해소 효과' },
      { biz: '편의점·마트', star: 4, effect: '셀프 계산대 운영으로 인력 효율화' },
      { biz: '베이커리', star: 4, effect: '메뉴 시각화로 객단가 상승 효과' },
      { biz: '관광지 매장', star: 5, effect: '다국어 메뉴로 외국인 고객 응대 강화' }
    ]
  ],
  'tableorder': [
    [
      { biz: '주점·호프집', star: 5, effect: '테이블당 주문 빈도 높은 환경에 최적' },
      { biz: '고깃집', star: 5, effect: '추가 주문 빈도 높은 업종에서 효과 즉시 체감' },
      { biz: '일식·이자카야', star: 5, effect: '단가 높은 메뉴 환경에서 객단가 상승 폭 큼' },
      { biz: '중식', star: 4, effect: '코스·세트 메뉴 관리 효율화' }
    ],
    [
      { biz: '한식·정식', star: 4, effect: '메뉴 시각화로 외국인 고객 응대 강화' },
      { biz: '패밀리 레스토랑', star: 5, effect: '대형 매장의 홀 운영 부담 대폭 감소' },
      { biz: '뷔페', star: 4, effect: '추가 주문·음료 주문 효율화' },
      { biz: '브런치 카페', star: 5, effect: '메뉴 사진 기반 주문으로 객단가 상승' }
    ]
  ],
  'removal': [
    [
      { biz: '음식점·카페', star: 5, effect: '주방 후드·바닥 방수 등 종합 철거 필요' },
      { biz: '미용실·네일샵', star: 5, effect: '인테리어 비중 큰 매장의 정밀 철거' },
      { biz: '학원·교습소', star: 4, effect: '강의실 칸막이·전기 배선 종합 처리' },
      { biz: '의류·패션', star: 4, effect: '진열대·간판 철거 중심 작업' }
    ],
    [
      { biz: '편의점·마트', star: 4, effect: '진열 시설·바닥 마감 복구 작업' },
      { biz: '약국·병의원', star: 5, effect: '의료시설 특수 철거 경험 보유' },
      { biz: '주점·호프집', star: 5, effect: '주방·홀 통합 철거가 가능한 인력 보유' },
      { biz: '카페·베이커리', star: 5, effect: '인테리어 정밀 철거 경험 다수' }
    ]
  ]
};

// 섹션 4: 구매 전 확인할 점 (5가지, 슬롯 5~6 변형)
const RP_CAUTIONS_POOLS = {
  'card': [
    [
      [
        { h: 'VAN사 제휴 조건 확인', d: '단말기마다 제휴 가능한 VAN사가 다르며, 카드 수수료율과 정산 주기에 직접 영향을 미칩니다. 계약 전 본인 매장의 결제 환경에 가장 유리한 VAN사를 추천받는 것이 중요합니다.' },
        { h: '약정 기간 확인', d: '일부 단말기는 약정 기간이 3~5년으로 길게 설정되어 있어 중도 해지 시 위약금이 발생할 수 있습니다. 약정 조건과 위약금 산정 기준을 사전에 명확히 확인해야 합니다.' },
        { h: '월 임대료 구조', d: '"무료 설치"라는 표현이 월 임대료까지 포함하는지 확인이 필요합니다. 일부 업체는 설치비만 무료이고 월 임대료가 별도로 청구되는 경우가 있습니다.' },
        { h: '영수증 용지 규격', d: '단말기마다 사용 가능한 영수증 용지 규격이 달라, 일반 76mm 표준 외 비표준 규격을 사용하는 모델은 소모품 구매가 번거로워질 수 있습니다.' },
        { h: '간편결제 지원 범위', d: '삼성페이·애플페이·제로페이 등 간편결제 지원 여부와 추가 비용 발생 가능성을 확인해야 합니다. 매장 결제 트렌드에 맞지 않는 단말은 운영 효율이 떨어집니다.' }
      ],
      [
        { h: '결제 처리 속도', d: '단말기 간 결제 처리 속도 차이가 0.5~1초 이상 발생할 수 있어, 피크타임 회전율에 직접 영향을 미칩니다. 동일 환경에서의 처리 속도 비교가 필수입니다.' },
        { h: '통신 안정성', d: '유선 인터넷 외 LTE·무선 백업 통신 지원 여부를 확인해야 합니다. 인터넷 장애 시 결제 처리가 중단되면 매출 손실이 즉시 발생합니다.' },
        { h: '매출 데이터 백업', d: '결제 데이터가 본사 서버와 실시간 동기화되는지 확인해야 합니다. 단말 고장 시 매출 데이터 복구가 어려운 모델은 운영 리스크가 큽니다.' },
        { h: '환불 처리 범위', d: '환불 처리가 동일 단말에서 자동 처리되는지, 별도 절차가 필요한지 확인해야 합니다. 환불이 잦은 업종에서는 운영 부담에 큰 차이가 생깁니다.' },
        { h: '사후 관리 응답 시간', d: '장애 발생 시 출동 시간과 원격 지원 가능 여부를 사전에 확인해야 합니다. 통상 영업 중 1시간 이내 대응이 가능한 업체를 선택하는 것이 안전합니다.' }
      ],
      [
        { h: '단말 인증 상태', d: '국내 결제 인증을 통과한 정식 단말인지 확인이 필요합니다. 미인증 단말은 결제 거절·승인 지연 같은 운영 리스크가 큽니다.' },
        { h: '카드사 호환성', d: '국내 모든 카드사·간편결제·해외 카드(VISA·MasterCard) 호환 여부를 확인해야 합니다. 외국인 고객이 많은 매장은 특히 중요합니다.' },
        { h: '소프트웨어 업데이트', d: '결제 규격 변경에 따른 소프트웨어 업데이트가 무상으로 제공되는지 확인해야 합니다. 유상 업데이트 모델은 장기 운영 시 비용 부담이 누적됩니다.' },
        { h: '잔여 약정 인수', d: '기존 단말의 잔여 약정이 있는 경우 신규 단말 업체가 인수 지원을 제공하는지 확인이 필요합니다.' },
        { h: '계약서 명확성', d: '계약서에 수수료율·약정 기간·위약금·해지 조건이 명확히 기재되었는지 반드시 확인해야 합니다.' }
      ]
    ]
  ],
  'pos': [
    [
      [
        { h: '소프트웨어 라이선스 구조', d: 'POS 소프트웨어가 매절 구매인지 월 구독인지 사전 확인이 필요합니다. 구독형은 장기 운영 시 비용 부담이 누적될 수 있습니다.' },
        { h: '메뉴 입력 지원 범위', d: '설치 시 매장 메뉴 입력을 업체가 지원하는지, 사장님이 직접 해야 하는지 확인이 필요합니다. 메뉴 30종 이상이면 입력 지원이 매우 중요합니다.' },
        { h: '주변 장비 호환성', d: '기존 카드 단말기·주방 출력기·간판 시스템과의 호환 여부를 사전에 확인해야 합니다. 호환되지 않으면 추가 장비 구매가 필요합니다.' },
        { h: '배달앱 연동 범위', d: '배민·요기요·쿠팡이츠 등 주요 배달앱과의 자동 연동 여부를 확인해야 합니다. 연동되지 않으면 주문 이중 입력이 발생합니다.' },
        { h: '데이터 백업 정책', d: '매출 데이터의 클라우드 백업 주기와 복구 정책을 사전에 확인해야 합니다. 백업이 일 단위 이상이면 운영 안정성이 보장됩니다.' }
      ],
      [
        { h: '직원 권한 관리', d: '직원별로 메뉴 등록·환불·할인 권한을 차등 설정할 수 있는지 확인해야 합니다. 다인 운영 매장에서는 매우 중요한 기능입니다.' },
        { h: '터치스크린 내구성', d: 'POS 터치스크린은 일 사용량이 매우 많아, 5년 이상 안정 운영이 가능한 모델인지 확인해야 합니다.' },
        { h: '매출 분석 기능', d: '시간대·요일·메뉴별 매출 분석 리포트가 자동 생성되는지 확인해야 합니다. 운영 의사결정에 직접 활용되는 기능입니다.' },
        { h: '세무 신고 연동', d: '국세청 홈택스 매출 신고 자동 연동 여부를 확인해야 합니다. 분기·연 단위 세무 정리 부담을 크게 줄여줍니다.' },
        { h: '사후 관리 비용', d: '1년 무상 A/S 이후의 사후 관리 비용 구조를 사전에 확인해야 합니다. 노후 모델은 부품 단종으로 수리 비용이 급증할 수 있습니다.' }
      ]
    ]
  ],
  'kiosk': [
    [
      [
        { h: '매장 동선과 거치 위치', d: '키오스크 거치 위치가 매장 출입구·주문 흐름과 잘 맞아야 합니다. 잘못된 위치는 고객 혼란과 매장 회전율 저하를 유발합니다.' },
        { h: '메뉴 표준화 정도', d: '메뉴 옵션이 지나치게 복잡하면 키오스크 효율이 떨어집니다. 도입 전 메뉴 단순화를 함께 검토하는 것이 좋습니다.' },
        { h: '결제 수단 지원 범위', d: '신용·체크·간편결제·현금까지 모두 지원하는지 확인해야 합니다. 현금 미지원 모델은 일부 고객층 응대가 어렵습니다.' },
        { h: '소프트웨어 업데이트', d: '메뉴 변경·결제 규격 변경에 따른 소프트웨어 업데이트가 무상으로 제공되는지 확인해야 합니다.' },
        { h: '24시간 운영 적합성', d: '24시간 무인 운영을 검토 중이라면 야간 장애 발생 시 원격 지원 가능 여부가 매우 중요합니다.' }
      ],
      [
        { h: '하드웨어 내구성', d: '키오스크는 24시간 가동 환경이 일반적이어서, 5년 이상 무고장 운영이 가능한 검증 모델 선택이 필수입니다.' },
        { h: '주방 출력기 연동', d: '주문이 즉시 주방으로 전송되는지, 누락 발생 시 알림 기능이 있는지 확인해야 합니다.' },
        { h: '다국어 지원', d: '한·영·중·일 메뉴가 기본 탑재되었는지 확인해야 합니다. 관광지·번화가 매장은 필수 기능입니다.' },
        { h: '고객 응대 동선', d: '고객이 키오스크 앞에서 멈춰 서서 메뉴를 보는 평균 시간(1~3분)을 고려한 동선 설계가 필요합니다.' },
        { h: '도입 후 직원 교육', d: '키오스크 도입 직후 1~2주간 직원이 고객 응대를 도와줘야 하는 적응 기간이 있습니다. 이 기간을 고려한 인력 운영 계획이 필요합니다.' }
      ]
    ]
  ],
  'tableorder': [
    [
      [
        { h: '주방 출력기 호환성', d: '기존 주방 출력기와의 자동 연동 여부를 사전에 확인해야 합니다. 호환되지 않으면 추가 장비 구매가 필요합니다.' },
        { h: 'QR 방식 vs 태블릿 방식', d: 'QR 방식은 도입 비용이 낮으나 고객 스마트폰 환경에 의존하고, 태블릿 방식은 비용은 높으나 안정성이 보장됩니다. 매장 환경에 맞는 선택이 필요합니다.' },
        { h: '메뉴 사진 준비', d: '테이블오더 효과는 메뉴 사진 품질에 크게 좌우됩니다. 도입 전 전 메뉴 사진 촬영을 함께 검토해야 합니다.' },
        { h: '와이파이 안정성', d: '매장 전체 테이블에서 안정적 와이파이 연결이 보장되어야 합니다. 통신 장애가 잦으면 도입 효과가 크게 떨어집니다.' },
        { h: '결제 흐름 통합', d: '테이블오더에서 발생한 주문이 포스기·카드 단말기와 자동 정산되는지 확인해야 합니다.' }
      ]
    ]
  ],
  'removal': [
    [
      [
        { h: '임대인 요구 수준 확인', d: '원상복구 범위는 임대 계약서에 명시된 조건 외에도 임대인의 추가 요구가 있을 수 있습니다. 작업 시작 전 임대인과 직접 협의가 필수입니다.' },
        { h: '폐기물 처리 비용 포함 여부', d: '견적에 폐기물 운반·처리 비용이 모두 포함되었는지 확인해야 합니다. 별도 청구되는 경우 작업 후 추가 비용이 크게 발생할 수 있습니다.' },
        { h: '작업 일정 협의', d: '주거 인근 매장은 야간·새벽 작업 제한이 있습니다. 작업 시간대 사전 협의가 필요합니다.' },
        { h: '전기·수도·가스 안전 처리', d: '전기 차단·가스 밸브 잠금·수도 차단 등 안전 조치가 작업 범위에 포함되었는지 확인해야 합니다.' },
        { h: '사후 책임 범위', d: '작업 완료 후 임대인 인계 시 발생하는 추가 요구에 대한 사후 책임 범위를 계약서에 명시해야 합니다.' }
      ]
    ]
  ]
};

// 섹션 5: 도입 효과 단락 (300~400자)
const RP_EFFECT_POOLS = {
  'card': [
    "{productName} 도입 후 매장 운영에서 가장 먼저 체감되는 변화는 결제 처리 속도와 안정성입니다. 노후 단말기 사용 시 자주 발생하던 결제 거절·통신 지연이 사실상 사라지면서, 피크타임 회전율이 평균 5~10% 향상되는 사례가 일관되게 보고됩니다. 또한 VAN사 직제휴 모델로 인한 카드 수수료 절감 효과는 일 매출 100만원 기준 월 3~9만원, 연 환산 시 36~108만원의 실질적 비용 절감으로 이어집니다. 매출 데이터의 실시간 본사 서버 동기화 기능 덕분에 단말 고장이나 분실 시에도 매출 누락 위험이 거의 없으며, 사장님께서 별도로 매출 정산을 챙기지 않아도 자동 마감 처리됩니다.",
    "결제 안정성이 향상되면 가장 직접적으로 변하는 것이 고객 응대 흐름입니다. {productName}으로 교체한 매장에서는 \"결제가 한 번에 안 되는 일이 사라졌다\"는 평가가 가장 자주 나오며, 이는 매장 분위기와 고객 만족도에 직접적인 영향을 미칩니다. VAN사 수수료 절감 효과는 가시적이지 않지만 누적 효과가 큽니다. 일 매출 50만원 매장은 연 18~54만원, 일 매출 200만원 매장은 연 70~210만원의 비용 절감이 일반적입니다. 영수증 인쇄 속도 향상으로 카운터 대기 시간이 줄어들어 매장 회전율 향상도 동반됩니다.",
    "{productName} 도입 효과는 단순 결제 속도 향상에 그치지 않습니다. 결제 거절 빈도가 줄어들면서 매장 운영 스트레스가 크게 감소하며, 사장님이 직접 결제 처리에 개입할 필요가 거의 없어집니다. 직원이 응대 중에도 결제는 직관적으로 처리되어 신규 직원 교육 시간이 단축되며, 영수증 인쇄·매출 마감·세무 신고 자동화로 매장 외 시간 부담도 함께 줄어듭니다. 이러한 변화는 도입 첫 달부터 즉시 체감되며, 장기적으로는 매장 운영 안정성 자체가 한 단계 높아지는 효과로 이어집니다."
  ],
  'pos': [
    "{productName} 도입 후 매장 운영의 변화는 통계적으로 명확합니다. 도입 매장 평균 일 매출은 도입 전 대비 5~12% 상승하며, 이는 주문 처리 속도 향상·주문 누락 감소·재고 관리 효율화의 복합 효과입니다. 또한 매장 운영 시간(매출 마감·재고 정리·세무 신고)이 월 평균 8~15시간 단축되며, 이는 사장님의 운영 부담을 크게 덜어줍니다. 다점포 운영자라면 본사·지점 통합 관리 모드로 매장별 매출을 실시간 비교 분석할 수 있어, 운영 의사결정의 정확도가 크게 향상됩니다.",
    "포스기 도입 효과는 시간이 지날수록 누적적으로 나타납니다. 도입 첫 달은 직원 적응과 메뉴 입력에 다소 시간이 소요되지만, 둘째 달부터는 운영 효율 향상 효과가 본격적으로 체감됩니다. 일 매출 분석·재고 자동 차감·배달앱 연동 같은 기능이 일상 운영에 녹아들면서, 사장님이 매장 외에서도 매출 현황을 실시간으로 파악할 수 있게 됩니다. 이러한 변화는 단순 운영 효율 향상을 넘어, 매장 의사결정의 데이터 기반 전환이라는 근본적 변화를 가져옵니다.",
    "{productName} 도입 매장의 사장님 90% 이상이 \"이제는 포스기 없이 운영하기 어렵다\"고 평가합니다. 그 배경에는 단순 결제 처리 외에도 메뉴 즉시 변경·옵션 관리·직원 권한 관리·세무 자동화 같은 통합 기능이 일상 운영에 깊이 녹아들기 때문입니다. 도입 후 6개월 시점부터는 누적된 매출 데이터를 기반으로 시간대별·요일별·메뉴별 운영 전략을 수립할 수 있어, 매장 성장의 새로운 단계로 진입하는 효과가 발생합니다."
  ],
  'kiosk': [
    "{productName} 도입 효과는 도입 첫 달부터 즉시 체감되며, 시간이 지날수록 누적 효과가 커집니다. 가장 직접적인 변화는 인건비입니다. 카운터 인력 1명을 사실상 대체하면서 월 80~150만원의 인건비 절감 효과가 발생하며, 이는 도입 비용 회수 기간을 6~12개월로 단축시킵니다. 또한 객단가 상승 효과(추천 메뉴 자동 노출, 옵션 추가 유도)로 평균 8~12%의 매출 상승이 보고됩니다. 도입 매장 사장님 다수가 \"피크타임 응대 부담이 사라졌다\"는 점을 가장 큰 변화로 꼽습니다.",
    "키오스크 도입 후 매장 구조 자체가 근본적으로 변화합니다. 카운터에 직원이 상주할 필요가 없어지면서, 동일 인력으로 더 많은 테이블을 담당하거나 영업 시간을 확장하는 운영 구조가 가능해집니다. 24시간 무인 운영, 새벽 영업, 직원 휴게 시간 확보 등 기존에 어려웠던 운영 옵션이 현실화됩니다. 도입 매장의 평균 영업 시간이 도입 전 대비 1~2시간 늘어나는 사례가 일반적입니다.",
    "{productName} 도입 매장에서 가장 자주 나오는 평가는 \"고객 응대 부담이 사라졌다\"입니다. 직원이 카운터에서 해방되면서 매장 청결 관리, 식재료 준비, 고객 응대 품질 향상에 더 집중할 수 있게 됩니다. 또한 객단가 상승, 주문 정확도 향상, 다국어 지원 같은 운영 효과가 동시에 발생하면서, 매장 전체의 운영 품질이 한 단계 높아지는 변화가 도입 후 3~6개월 시점부터 본격 체감됩니다."
  ],
  'tableorder': [
    "{productName} 도입 후 매장 운영의 변화는 즉각적입니다. 홀 직원의 주문·전달·확인 업무가 사라지면서, 1인이 담당 가능한 테이블 수가 약 40% 증가합니다. 이는 곧 매장 인력 구조의 재설계로 이어져, 도입 매장 평균 월 100만원 이상의 인건비 절감이 일반적입니다. 동시에 객단가는 평균 10~15% 상승하며, 이는 추천 메뉴 자동 노출·사이드 메뉴 유도 등 시스템적 효과의 결과입니다.",
    "테이블오더 도입 매장에서 가장 자주 나오는 평가는 \"주문 누락이 사라졌다\"는 점입니다. 고객이 직접 주문하므로 직원 매개 단계가 사라져, 주문 실수·누락·전달 오류가 거의 0에 수렴합니다. 이는 곧 클레임 감소와 매장 분위기 개선으로 이어지며, 단골 고객 만족도와 재방문율 향상의 핵심 요인이 됩니다. 도입 후 3개월 시점부터 매장 회전율과 객단가 양쪽에서 명확한 변화가 데이터로 확인됩니다."
  ],
  'removal': [
    "매장 철거 작업의 핵심은 임대인이 요구하는 원상복구 수준을 정확히 충족하는 것입니다. {productName} 서비스는 무료 현장 견적 단계에서 임대인의 요구 사항을 직접 확인하여, 작업 범위에 누락이나 과잉이 없도록 설계합니다. 작업은 평균 1~5일 내 완료되며, 폐기물 운반·처리까지 단일 견적에 모두 포함되어 작업 후 추가 비용이 발생하지 않습니다. 작업 완료 후 1년간 임대인 분쟁 발생 시 마스터페이가 직접 대응하므로, 사장님은 안전한 마무리를 보장받을 수 있습니다."
  ]
};

// 섹션 6: 설치/도입 프로세스 안내 (200~300자)
const RP_PROCESS_POOLS = [
  "마스터페이의 설치 프로세스는 무료 상담 → 매장 환경 분석 → 업종별 최적 모델 추천 → 설치 일정 확정 → 직접 방문 설치 → 사용법 교육 → 사후 관리 안내 순서로 진행됩니다. 상담부터 설치 완료까지 통상 1~3일이 소요되며, 매장 영업 시간을 침해하지 않도록 일정이 조율됩니다.",
  "도입 절차는 전화 또는 카카오톡 상담으로 시작되며, 매장 환경(업종·규모·동선·기존 장비)을 파악한 후 가장 적합한 모델을 추천드립니다. 견적 확정 후 1~2일 내 전문 기사가 직접 방문하여 설치·세팅·사용법 교육까지 한 번에 완료합니다. 설치 후에도 1년간 무상 A/S와 카카오톡 24시간 지원이 제공됩니다.",
  "설치는 매장 영업에 영향이 없도록 영업 시작 전 또는 종료 후 시간대로 협의됩니다. 전문 기사가 직접 방문하여 장비 설치, 통신 연결, 결제 시스템 세팅, 직원 사용법 교육까지 단계별로 진행하며, 설치 당일 영업에 즉시 투입 가능한 상태로 마무리됩니다.",
  "도입 절차는 간단합니다. 카카오톡 또는 전화로 매장 정보(업종·규모·결제 환경)를 알려주시면, 가장 적합한 모델과 견적을 안내드립니다. 결제 조건과 설치 일정 확정 후 전문 기사가 매장에 직접 방문하여 설치·교육까지 한 번에 완료합니다. 별도 비용이나 추가 청구는 발생하지 않습니다."
];

// 섹션 7: FAQ 풀
const RP_FAQ_POOLS = {
  'card': [
    [
      { q: '설치비가 정말 무료인가요?', a: '네, 카드 단말기 설치비·월 임대료·소프트웨어 라이선스 모두 무료입니다. 카드 결제 발생 시 정상 카드 수수료만 부과되며, 별도 비용은 발생하지 않습니다.' },
      { q: '기존 단말기 약정이 남아있는데 교체 가능한가요?', a: '네, 잔여 약정이 있는 경우에도 무료 견적 후 교체가 가능합니다. 약정 위약금이 부담되는 경우 인수 지원 조건도 함께 협의 가능합니다.' },
      { q: '카드 수수료는 얼마나 차이가 나나요?', a: 'VAN사 직제휴 모델로 시중 평균 대비 약 0.1~0.3%p 낮게 책정됩니다. 일 매출 100만원 매장 기준 월 3~9만원의 수수료 절감 효과가 발생합니다.' },
      { q: 'A/S는 어떻게 받나요?', a: '전화 또는 카카오톡으로 24시간 상담 가능하며, 대부분 원격 지원으로 즉시 해결됩니다. 하드웨어 문제는 영업 중 1시간 이내 현장 출동이 원칙입니다.' },
      { q: '간편결제도 모두 지원되나요?', a: '네, 삼성페이·애플페이·제로페이·카카오페이·네이버페이 등 모든 간편결제수단이 단일 단말로 처리됩니다.' }
    ]
  ],
  'pos': [
    [
      { q: '소프트웨어 라이선스는 어떻게 되나요?', a: 'POS 소프트웨어는 패키지 도입 시 무상 제공되며, 정기 업데이트도 무상 진행됩니다. 별도 월 구독료가 발생하지 않는 구조입니다.' },
      { q: '메뉴 입력은 직접 해야 하나요?', a: '아니요, 설치 시 매장 메뉴를 함께 입력해드립니다. 메뉴 30종 이상이거나 옵션이 복잡한 경우에도 입력 지원이 무상으로 제공됩니다.' },
      { q: '배달앱 연동이 자동으로 되나요?', a: '네, 배민·요기요·쿠팡이츠 등 주요 배달앱과 자동 연동되어, 배달 주문이 포스기에 즉시 표시됩니다. 이중 입력 작업이 사라집니다.' },
      { q: '매출 데이터는 안전한가요?', a: '매출 데이터는 자동으로 클라우드에 백업되며, 단말기 고장 시에도 즉시 복구 가능합니다.' },
      { q: '여러 매장을 운영하는데 통합 관리가 가능한가요?', a: '네, 본사·지점 통합 관리 모드로 여러 매장의 매출을 한 화면에서 비교 분석할 수 있습니다.' }
    ]
  ],
  'kiosk': [
    [
      { q: '도입 비용은 어떻게 되나요?', a: '키오스크 도입 비용은 매장 환경과 모델에 따라 차등 적용되며, 무료 견적을 통해 가장 합리적인 조건을 안내드립니다. 패키지 도입 시 부담 최소화 구조로 설계됩니다.' },
      { q: '인건비 절감 효과는 어느 정도인가요?', a: '카운터 인력 1명을 사실상 대체하므로 월 평균 80~150만원의 인건비 절감 효과가 발생합니다. 도입 비용 회수 기간은 6~12개월입니다.' },
      { q: '50대 이상 고객도 사용 가능한가요?', a: '네, 직관적 UI 설계로 50대 이상 고객도 평균 1분 이내 주문을 완료합니다. 도입 직후 1~2주간 직원이 응대를 도와주는 적응 기간이 권장됩니다.' },
      { q: '메뉴 변경은 자유롭게 할 수 있나요?', a: '네, 메뉴 사진·가격·옵션을 즉시 갱신할 수 있어 시즌 메뉴나 한정 메뉴 운영이 매우 편리합니다.' },
      { q: '24시간 무인 운영이 가능한가요?', a: '네, 24시간 무인 운영이 가능하며, 야간 장애 발생 시 원격 지원으로 즉시 해결됩니다.' }
    ]
  ],
  'tableorder': [
    [
      { q: 'QR 방식과 태블릿 방식 중 어느 것이 좋은가요?', a: 'QR 방식은 도입 비용이 낮고 간편하지만 고객 스마트폰 환경에 의존합니다. 태블릿 방식은 비용이 높지만 안정성이 보장됩니다. 매장 객단가와 운영 환경에 따라 추천드립니다.' },
      { q: '주방 출력기와 자동 연동되나요?', a: '네, 기존 주방 출력기와 자동 연동되어 주문이 즉시 주방으로 전송됩니다. 호환되지 않는 모델은 추가 장비를 무료 제공합니다.' },
      { q: '메뉴 사진은 직접 준비해야 하나요?', a: '메뉴 사진은 매장에서 준비하시는 것이 기본이며, 필요시 사진 촬영 업체 연결도 지원합니다.' },
      { q: '와이파이가 약한 매장에서도 사용 가능한가요?', a: '와이파이 안정성이 도입 효과에 크게 영향을 미치므로, 매장 환경 점검 후 필요시 와이파이 보강을 함께 진행합니다.' }
    ]
  ],
  'removal': [
    [
      { q: '견적은 무료인가요?', a: '네, 현장 방문 견적은 100% 무료이며, 작업 일정·비용·범위를 사전 확정 후 진행됩니다.' },
      { q: '폐기물 처리 비용도 견적에 포함되나요?', a: '네, 폐기물 운반·처리 비용이 모두 단일 견적에 포함되어, 작업 후 추가 비용이 발생하지 않습니다.' },
      { q: '작업 기간은 얼마나 소요되나요?', a: '매장 규모에 따라 1~5일 내 완료됩니다. 야간·주말 작업도 별도 협의 가능합니다.' },
      { q: '임대인과 분쟁이 생기면 어떻게 되나요?', a: '작업 완료 후 1년간 임대인 분쟁 발생 시 마스터페이가 직접 대응합니다. 사장님은 별도로 분쟁에 개입하실 필요가 없습니다.' }
    ]
  ]
};

// ============================================================
// 추가 섹션 풀 (3000자 보강용)
// ============================================================

// 섹션 A: 지역 매장 환경 분석 (350~450자)
const RP_REGION_ANALYSIS_POOLS = [
  "{region}에서 매장을 운영하는 사장님들이 결제·운영 장비를 검토할 때 가장 먼저 고려해야 할 요소는 지역 상권의 특성입니다. {region}은(는) {areaType} 환경을 중심으로 다양한 업종이 분포하며, 매장당 일 결제 빈도와 객단가, 결제 수단 비중이 상이합니다. 이러한 환경에서는 단일 모델을 모든 매장에 일률적으로 적용하기보다, 매장 업종·규모·동선에 맞는 모델 선정이 운영 효율의 핵심이 됩니다. 마스터페이는 {region} 매장 환경에 누적된 설치 데이터를 바탕으로, 매장별 최적 조합을 제안합니다.",
  "{region}은(는) {topBiz1}과 {topBiz2}이(가) 활발하게 운영되는 지역으로, 매장 운영 환경이 다양합니다. 일부 매장은 객단가가 높고 결제 빈도가 낮은 반면, 다른 매장은 객단가가 낮고 결제 빈도가 매우 높습니다. 이러한 환경 차이에 따라 적합한 결제·운영 장비 모델도 달라지며, 마스터페이는 매장 환경 분석 후 가장 효율적인 조합을 제안합니다. 무료 현장 방문을 통해 매장 동선·결제 흐름·기존 장비 호환성까지 종합 검토합니다.",
  "{region}의 매장 환경에서 결제·운영 장비 선택 시 고려해야 할 변수는 단순 가격이 아닙니다. 매장 규모, 일 결제 건수, 객단가, 결제 수단 비중, 직원 수, 운영 시간 등 다양한 요소가 모델 선정에 영향을 미칩니다. {region}은(는) {areaType} 환경의 특성상 시간대별 매출 편차가 크고 외국인 고객 비중도 일정 수준 있어, 결제 안정성과 다국어·다결제수단 지원 여부가 특히 중요합니다.",
  "{region}에서 매장을 운영하시는 사장님께 가장 자주 받는 질문은 \"우리 매장에 어떤 모델이 가장 잘 맞을지\"입니다. 매장마다 환경이 다르기 때문에 정답은 없으나, {region}의 {areaType} 특성을 고려할 때 결제 안정성과 사후 관리 응답 속도가 가장 우선 고려할 요소입니다. 마스터페이는 매장 방문을 통해 직접 환경을 확인하고, 매장에 가장 적합한 모델과 운영 조합을 제안합니다."
];

// 섹션 B: 함께 쓰면 좋은 제품 조합 (250~350자)
const RP_COMBO_POOLS = {
  'card': [
    "{productName}만 단독으로 도입하기보다 포스기와 함께 도입하면 매장 운영 효율이 극대화됩니다. 카드 단말기로 결제만 처리하던 환경에서 포스기까지 도입하면 주문·결제·매출 마감·재고 관리가 단일 화면에서 통합 처리되어, 운영 시간이 평균 30~40% 단축됩니다. 패키지 도입 시 설치비 무료 혜택이 적용되며, 단말 간 자동 연동 세팅까지 함께 진행됩니다.",
    "{productName} 도입 매장에서는 키오스크 또는 테이블오더 도입을 함께 검토하시는 경우가 많습니다. 결제 단말기는 카운터 운영의 기본이지만, 인건비 부담이 큰 매장이라면 키오스크·테이블오더로 카운터 인력 자체를 줄이는 방향이 효과적입니다. 패키지 도입 시 단말 간 자동 연동과 설치비 무료 혜택이 함께 제공됩니다.",
    "카드 단말기와 포스기를 함께 도입하면 결제·매출 데이터가 통합 관리되어 세무 신고와 매출 분석이 자동화됩니다. {region}의 다수 매장에서 이 조합을 표준 운영 환경으로 채택하고 있으며, 마스터페이는 패키지 도입 시 설치비 무료와 통합 사후 관리 혜택을 함께 제공합니다."
  ],
  'pos': [
    "{productName}은(는) 카드 단말기·키오스크·테이블오더와 모두 자동 연동되는 통합 플랫폼입니다. 포스기 도입 후 매장 환경에 따라 키오스크나 테이블오더를 추가 도입하면 운영 효율이 단계적으로 향상됩니다. 패키지 도입 시 설치비 무료 혜택과 단말 간 자동 연동 세팅이 함께 제공되어, 도입 부담이 사실상 없습니다.",
    "포스기 단독 도입도 운영 효율 향상에 충분하지만, 인건비 부담이 큰 매장에서는 테이블오더·키오스크와 함께 도입하는 것을 권장합니다. 직원 응대 부담이 근본적으로 줄어들어, 동일 인력으로 매장 운영 규모를 확장할 수 있습니다. {region} 매장 다수가 이 통합 운영 구조를 채택하고 있습니다."
  ],
  'kiosk': [
    "{productName}을(를) 단독으로 도입해도 효과가 즉각적이지만, 포스기와 함께 도입하면 매장 운영의 통합도가 한 단계 더 높아집니다. 키오스크에서 발생한 주문이 포스기·주방 출력기로 자동 전달되어, 직원이 응대에 개입할 필요가 거의 없는 운영 구조가 완성됩니다. 패키지 도입 시 설치비 무료 혜택이 적용됩니다.",
    "키오스크 도입 후 운영 효율이 안정화되면 테이블오더 추가 도입도 검토할 가치가 있습니다. 카운터 주문은 키오스크가, 테이블 추가 주문은 테이블오더가 처리하는 이중 셀프 오더링 구조가 매장 운영 효율을 극대화합니다. {region}의 외식업 매장 다수가 이 구조를 채택하고 있습니다."
  ],
  'tableorder': [
    "{productName}은(는) 포스기와의 자동 연동이 도입 효과의 핵심입니다. 테이블오더에서 발생한 주문이 포스기·주방 출력기로 즉시 전달되어, 직원이 주문 전달에 개입할 필요가 거의 없습니다. 패키지 도입 시 설치비 무료와 자동 연동 세팅이 함께 제공됩니다."
  ],
  'removal': [
    "{productName} 서비스는 매장 폐업·이전 시점의 일회성 작업이지만, 신규 매장 오픈을 함께 검토하시는 경우 카드 단말기·포스기·키오스크 등 신규 매장 장비 도입까지 일괄 진행 가능합니다. 매장 정리와 새 매장 오픈을 단일 업체에서 진행하면 일정 조율과 비용 절감 측면에서 효율적입니다."
  ]
};

// 인트로 풀 확장 버전 (350~500자)
const RP_INTRO_EXPANDED_POOLS = {
  'card': [
    "{region}은(는) {areaType} 특성이 뚜렷한 지역으로, 카드 결제 비중이 90%를 넘는 업종이 다수 분포해 있습니다. 이러한 환경에서는 결제 단말기의 처리 속도와 통신 안정성이 매장 회전율에 직접적인 영향을 미치며, 결제 거절·승인 지연 같은 사소한 문제도 매출 손실로 이어질 수 있습니다. {productName}은(는) 이 지역의 카드 결제 환경에 가장 적합한 표준 모델로 평가받고 있으며, 결제 거절률을 동급 모델 대비 절반 수준으로 낮춘 검증된 장비입니다. 마스터페이는 {region} 전 지역 직접 방문 설치를 통해 매장별 환경에 최적화된 세팅과 1년 무상 A/S를 함께 제공합니다.",
    "{region}에서 매장을 운영하는 사장님들이 카드 단말기 선택 시 가장 중요하게 보는 요소는 결제 안정성과 VAN사 수수료입니다. {region}의 {areaType} 환경은 시간대별 결제 빈도 편차가 크기 때문에, 어느 시점에서도 결제 처리가 지연되지 않는 단말기가 필수입니다. {productName}은(는) {region} 매장 환경에 적합한 통신·결제 안정성을 갖춘 단말로, 도입 후 결제 관련 클레임이 거의 발생하지 않는 모델입니다. VAN사 직제휴 모델로 카드 수수료가 시중 평균 대비 약 0.1~0.3%p 낮게 책정되어, 일 매출 100만원 매장 기준 월 3~9만원의 실질적 비용 절감 효과도 함께 발생합니다.",
    "{region}은(는) {topBiz1}, {topBiz2} 같은 업종이 활발히 운영되는 지역으로, 매장당 일 결제 건수가 평균 이상인 환경입니다. 이런 환경에서는 단말기의 안정성과 영수증 인쇄 속도가 매장 운영의 효율을 결정합니다. {productName}은(는) 이 두 조건을 모두 충족하는 표준 모델로, {region} 내 다수 매장에 도입되어 운영 안정성이 검증되었습니다. 신용·체크·간편결제(삼성페이·애플페이·제로페이 등) 모든 결제수단을 단일 단말로 처리하며, 외국인 고객의 해외 발급 카드 결제까지 안정적으로 지원합니다. 또한 결제 데이터의 실시간 본사 서버 동기화 기능으로 매출 누락 위험이 거의 없습니다.",
    "{region}의 매장 환경은 {areaType}을(를) 중심으로 다양한 업종이 혼재되어 있어, 카드 결제 단말기 선택에 신중함이 요구됩니다. {productName}은(는) 결제 안정성·VAN사 수수료·사후 관리 등 사장님이 가장 우선시하는 항목에서 균형 있는 성능을 발휘하는 모델입니다. 마스터페이는 {region} 전 지역 직접 방문 설치를 통해 매장별 환경에 최적화된 세팅을 제공하며, 설치 후 1년간 무상 A/S와 카카오톡 24시간 상담을 함께 운영합니다. 노후 단말기 교체나 신규 개업 매장 모두 무료 견적 후 빠른 설치가 가능합니다."
  ],
  'pos': [
    "{region}에서 포스기 도입을 검토하는 사장님이 늘어나는 배경에는 매출 관리 자동화에 대한 요구가 자리합니다. {region}의 {areaType} 환경은 매장당 메뉴 종류와 결제 빈도가 다양해, 카드 단말기만으로는 매출·재고·직원 관리가 분리되어 운영 효율이 떨어지는 경우가 많습니다. {productName}은(는) 이 모든 영역을 단일 화면에서 통합 관리하는 매장 운영 플랫폼으로, 도입 즉시 운영 부담이 체감되는 장비입니다. 도입 매장 평균 일 매출은 도입 전 대비 5~12% 상승하며, 매장 운영 시간(매출 마감·재고 정리·세무 신고)이 월 평균 8~15시간 단축되는 효과가 일반적입니다.",
    "{region}의 외식업·소매업 매장에서 포스기는 더 이상 선택이 아니라 표준 인프라가 되었습니다. 메뉴 변경, 가격 조정, 매출 분석, 직원 관리, 배달앱 연동 등 일상 운영에 필요한 모든 기능이 포스기에 통합되어 있기 때문입니다. {productName}은(는) {region} 매장 환경에서 가장 자주 도입되는 모델로, 빠른 처리 속도와 직관적 UI를 동시에 갖추고 있습니다. 신규 직원도 30분 이내 숙달 가능한 인터페이스 설계와, 5년 이상 안정 운영이 검증된 하드웨어 내구성이 강점입니다.",
    "{region}은(는) {topBiz1}, {topBiz2} 등 메뉴 회전이 빠른 업종이 다수 운영되는 지역으로, 포스기의 주문 처리 속도가 매장 회전율에 직접 영향을 미칩니다. {productName}은(는) 터치스크린 응답 속도와 주방 출력기 연동 안정성에서 우수한 평가를 받고 있으며, {region} 내 도입 매장의 운영 효율을 평균 이상으로 끌어올리는 핵심 장비입니다. 클라우드 기반 매출 관리로 매장 외부에서도 실시간 매출 현황 확인이 가능하며, 다점포 운영자라면 본사·지점 통합 관리 모드까지 함께 활용할 수 있습니다."
  ],
  'kiosk': [
    "{region}에서 키오스크 도입은 더 이상 대형 프랜차이즈만의 선택이 아닙니다. 인건비 상승, 직원 채용 어려움, 피크타임 운영 부담 등 소상공인이 직면한 현실적 문제를 해결하는 가장 직접적인 수단으로 자리 잡았습니다. {region}의 {areaType} 환경은 무인 결제에 대한 고객 수용도가 이미 높아, 키오스크 도입 즉시 매장 운영 구조가 근본적으로 변화하는 경우가 많습니다. {productName}은(는) 이 변화를 안정적으로 지원하는 검증된 모델로, 카운터 인력 1명을 사실상 대체하면서 월 80~150만원의 인건비 절감 효과를 만들어냅니다. 도입 비용 회수 기간은 평균 6~12개월입니다.",
    "{region}의 매장에서 키오스크가 빠르게 확산되는 이유는 명확합니다. 카운터 인력 1명을 기계로 대체하면서도 주문 처리 속도는 오히려 빨라지고, 객단가는 평균 10% 이상 상승하기 때문입니다. {productName}은(는) {region} 환경에서 도입 후 6~12개월 내 투자 회수가 가능한 모델로, 장기적 운영 비용 구조를 근본적으로 개선합니다. 24시간 무인 운영, 새벽 영업, 직원 휴게 시간 확보 등 기존에 어려웠던 운영 옵션이 현실화되어, 매장 운영 자유도가 크게 확장됩니다.",
    "{region}은(는) {topBiz1}, {topBiz2} 등 메뉴가 표준화된 업종이 다수 운영되는 지역으로, 키오스크 도입 효과가 가장 크게 나타나는 환경입니다. 고객이 직접 주문·결제까지 마무리하는 셀프 오더링 구조는 직원 응대 부담을 크게 줄이고, 동시에 주문 누락·결제 오류 같은 운영 리스크를 거의 제거합니다. {productName}은(는) 이러한 운영 변화를 안정적으로 끌어내는 표준 무인 단말입니다. 50대 이상 고객도 평균 1분 이내 주문을 완료하는 직관적 UI와, 24시간 가동 환경에서 5년 이상 무고장 운영이 검증된 하드웨어 내구성이 강점입니다."
  ],
  'tableorder': [
    "{region}에서 테이블오더 도입은 외식업 운영의 기본 인프라가 되어가고 있습니다. {region}의 {areaType} 환경은 객단가가 일정 수준 이상이고 테이블당 주문 빈도가 높은 매장이 다수여서, 테이블오더 도입이 운영 효율과 객단가 양쪽에 즉각적 효과를 가져옵니다. {productName}은(는) 이러한 환경에 적합한 검증된 솔루션으로, 도입 매장 평균 홀 직원 부담이 약 40% 감소하며 객단가는 10~15% 상승하는 효과가 일관되게 보고됩니다. 직원 채용이 어려운 환경에서 인력 구조 자체를 재설계하는 도구로 활용되고 있습니다.",
    "{region}의 외식업 매장에서 직원 채용이 점점 어려워지고 있는 가운데, 테이블오더는 인력 구조를 근본적으로 재설계하는 도구로 활용되고 있습니다. {productName}은(는) {region} 환경에 도입된 다수 매장에서 홀 운영 부담을 평균 40% 이상 줄이는 결과를 만들어냈으며, 동시에 객단가는 10~15% 상승하는 이중 효과가 발생합니다. 메뉴 사진 기반 주문 흐름은 외국인 고객 응대에도 효과적이며, 단골 고객의 주문 이력 자동 누적 기능은 마케팅 의사결정에 직접 활용됩니다."
  ],
  'removal': [
    "{region}에서 매장 폐업·이전을 결정한 사장님이 가장 큰 부담을 느끼는 영역이 원상복구입니다. 임대인의 요구 수준, 폐기물 처리 비용, 작업 기간 등 변수가 많아 직접 알아보기 어려운 영역이기 때문입니다. {productName} 서비스는 {region} 전 지역 매장 철거를 단일 업체에서 책임지며, 견적부터 사후 책임까지 일관된 기준으로 진행됩니다. 무료 현장 방문 견적 단계에서 임대인 요구 수준을 직접 확인하여 분쟁 가능성을 사전에 차단하며, 작업 완료 후 1년간 임대인 분쟁 발생 시 마스터페이가 직접 대응합니다."
  ]
};

// 섹션 C: 운영 체크리스트 + 장기 운영 안정성 (추가 보강용, 300~400자)
const RP_LONGTERM_POOLS = {
  'card': [
    "{productName}은(는) 한 번 설치 후 통상 5~7년간 추가 비용 없이 운영되는 장기 안정 모델입니다. 그 기간 동안 카드 결제 규격이 변경되거나 새로운 간편결제수단이 추가되더라도 소프트웨어 업데이트가 무상으로 제공되어 운영 환경 변화에 자연스럽게 대응할 수 있습니다. 매장 이전 시에도 단말 재설치가 무상으로 진행되며, 별도 약정 변경이나 위약금 발생 없이 새 매장에서 동일하게 운영을 이어갈 수 있습니다. 마스터페이는 도입 시점뿐 아니라 장기 운영 전 과정에 걸친 안정성을 책임집니다.",
    "장기 운영 관점에서 카드 단말기 선택 시 가장 중요한 것은 사후 관리 응답 속도와 소모품 조달 안정성입니다. {productName}은(는) 영수증 용지가 표준 76mm 규격으로 어디서나 구매 가능하며, 장애 발생 시 영업 중 1시간 이내 현장 출동을 원칙으로 합니다. 또한 결제 데이터의 클라우드 백업으로 단말 고장 시에도 매출 손실 위험이 거의 없으며, 매장 이전·확장·재오픈 같은 운영 변화에도 유연하게 대응 가능합니다.",
    "도입 후 안정적 운영을 위해 사장님께서 챙기실 사항은 많지 않습니다. 영수증 용지 잔량 확인, 단말 표면 청결 유지, 통신 상태 정상 작동 확인 정도이며, 그 외 모든 운영 관리는 마스터페이가 책임집니다. 정기 점검 안내, 소프트웨어 업데이트, VAN사 수수료 재검토까지 사장님이 별도로 챙기지 않아도 자동으로 진행됩니다."
  ],
  'pos': [
    "{productName}은(는) 5년 이상 안정 운영이 검증된 모델로, 장기 사용에 따른 처리 속도 저하나 시스템 불안정이 거의 발생하지 않습니다. 그 기간 동안 메뉴 변경, 직원 교체, 매장 이전 같은 운영 변화에도 유연하게 대응 가능하며, 소프트웨어 업데이트는 무상으로 정기 진행됩니다. 매장 운영 데이터(매출·재고·고객 이력)는 자동으로 클라우드에 누적되어, 5년 후 시점에서도 도입 초기부터의 데이터를 모두 활용할 수 있습니다.",
    "포스기 도입 후 운영 안정성은 사후 관리 응답 속도에 크게 좌우됩니다. {productName}은(는) 24시간 카카오톡 상담과 원격 지원이 기본 제공되며, 하드웨어 장애 시 영업 중 1시간 이내 현장 출동을 원칙으로 합니다. 또한 분기별 정기 점검과 소프트웨어 업데이트가 무상으로 진행되어, 사장님이 별도로 시스템 관리에 신경 쓰지 않아도 안정적 운영이 지속됩니다."
  ],
  'kiosk': [
    "{productName}은(는) 24시간 가동 환경에서 5년 이상 무고장 운영이 검증된 하드웨어 내구성을 갖추고 있습니다. 도입 후 안정적 운영을 위해 매월 1회 정도 화면 청결 관리와 영수증 용지 보충만 챙기시면 되며, 그 외 모든 시스템 관리는 마스터페이가 책임집니다. 메뉴 변경·시즌 메뉴 운영·가격 조정 같은 일상 운영 변경은 사장님께서 직접 처리할 수 있도록 직관적 관리자 화면이 제공됩니다.",
    "키오스크 도입 후 운영 안정성을 좌우하는 가장 중요한 요소는 야간·주말 장애 대응입니다. {productName}은(는) 24시간 원격 지원 체계로 야간 장애 발생 시에도 즉시 대응 가능하며, 하드웨어 장애는 영업일 기준 1일 이내 현장 출동을 원칙으로 합니다. 도입 1년 후에도 합리적 비용으로 사후 관리가 지속되어, 장기 운영 부담이 크지 않습니다."
  ],
  'tableorder': [
    "{productName}은(는) 도입 후 매장 운영에 자연스럽게 녹아드는 시스템입니다. 초기 1~2주 적응 기간이 지나면 직원과 고객 모두 익숙해지며, 그 이후로는 별도 관리 부담이 거의 없습니다. 메뉴 변경, 가격 조정, 시즌 운영은 사장님께서 직접 관리자 화면에서 처리 가능하며, 시스템 장애 발생 시 마스터페이가 24시간 원격 지원으로 즉시 대응합니다."
  ],
  'removal': [
    "{productName} 작업 완료 후에도 1년간 임대인 분쟁 발생 시 마스터페이가 직접 대응합니다. 작업 시점에서 임대인이 요구한 원상복구 수준을 충족했더라도, 인계 후 추가 요구가 발생하는 경우가 있습니다. 이때 마스터페이가 직접 임대인과 협의하여 사장님이 분쟁에 개입하실 필요가 없도록 책임집니다."
  ]
};

// 섹션 D: 비용 구조 안내 (300~400자)
const RP_COST_POOLS = {
  'card': [
    "{productName}의 도입 비용 구조는 단순합니다. 설치비·월 임대료·소프트웨어 라이선스 모두 무료이며, 카드 결제 발생 시 정상 카드 수수료만 부과됩니다. {region} 매장 기준 일 매출 100만원 가맹점은 월 평균 카드 수수료가 약 30~50만원 수준이며, 이는 시중 평균 대비 3~9만원 절감된 금액입니다. 별도 약정 위약금이나 중도 해지 비용은 발생하지 않으며, 매장 이전·확장 시 단말 재설치도 무료로 진행됩니다. 영수증 용지 등 소모품은 매장에서 별도 구매하시며, 표준 76mm 규격으로 어디서나 손쉽게 조달 가능합니다.",
    "도입 비용은 사실상 0원에 가깝습니다. {productName}은(는) VAN사 직제휴 모델로 설치비·월 사용료가 발생하지 않으며, 정상 카드 수수료만 부과됩니다. {region} 매장 평균 기준 도입 후 첫 달부터 시중 단말 대비 월 3~9만원의 수수료 절감 효과가 누적되며, 연 환산 시 36~108만원의 실질적 비용 차이가 발생합니다. 매장 이전, 단말 추가, 소프트웨어 업데이트 모두 무상으로 진행됩니다."
  ],
  'pos': [
    "{productName}은(는) 패키지 도입 시 설치비·하드웨어 비용·소프트웨어 라이선스가 모두 무상으로 제공되는 구조입니다. 별도 월 사용료가 발생하지 않으며, 카드 단말기·키오스크·테이블오더와 함께 도입할 경우 통합 설치 혜택이 추가로 적용됩니다. {region} 매장 기준 도입 후 누적 비용 부담은 사실상 카드 수수료만 발생하며, 매출 분석·재고 관리·세무 신고 자동화 같은 통합 기능을 추가 비용 없이 활용할 수 있습니다. 단말 고장 시 1년 무상 A/S, 이후에도 합리적 비용으로 사후 관리가 지속됩니다.",
    "도입 비용 구조가 명확합니다. 설치비·소프트웨어 비용 0원, 카드 수수료 정상 부과, 그 외 추가 청구 없음입니다. {region}의 다수 매장이 이 구조로 운영 중이며, 도입 후 월 발생 비용은 사실상 카드 수수료뿐입니다. 매장 메뉴 변경, 직원 추가, 분점 오픈 같은 운영 변화 시에도 별도 비용이 발생하지 않으며, 정기 소프트웨어 업데이트도 무상 제공됩니다."
  ],
  'kiosk': [
    "{productName}의 도입 비용은 매장 환경과 모델에 따라 차등 적용되며, 무료 견적을 통해 가장 합리적인 조건을 안내드립니다. {region} 매장 기준 도입 후 회수 기간은 평균 6~12개월이며, 이후로는 인건비 절감 효과가 순수익으로 전환되는 구조입니다. 패키지 도입(포스기·테이블오더 등 함께 도입) 시 추가 할인 혜택이 적용되며, 1년 무상 A/S 후에도 사후 관리 비용이 합리적 수준으로 유지됩니다. 별도 월 사용료나 숨은 비용은 발생하지 않습니다.",
    "키오스크 도입 비용은 단순 하드웨어 가격이 아닌 \"운영 비용 절감 효과\"로 평가해야 합니다. {productName} 기준 월 80~150만원의 인건비 절감과 8~12%의 객단가 상승이 동시에 발생하므로, 도입 1년 시점부터는 누적 효과가 도입 비용을 상회합니다. {region} 매장 다수가 이 구조로 운영 효율을 향상시키고 있으며, 패키지 도입 시 비용 부담은 더욱 줄어듭니다."
  ],
  'tableorder': [
    "{productName} 도입 비용은 방식에 따라 다릅니다. QR 방식은 사실상 무료에 가까운 구조로 도입 가능하며, 태블릿 방식은 합리적 임대료로 운영됩니다. {region} 매장 기준 도입 후 1~3개월 내 인건비 절감 효과로 도입 비용이 회수되는 경우가 일반적이며, 객단가 상승 효과까지 함께 발생하므로 실질적 회수 기간은 더 짧습니다. 패키지 도입 시 추가 할인이 적용됩니다."
  ],
  'removal': [
    "{productName} 서비스 비용은 매장 규모, 철거 범위, 폐기물 양에 따라 산정되며, 무료 현장 견적을 통해 정확한 금액이 제시됩니다. {region} 매장 기준 평균 작업 비용은 매장당 200~500만원 수준이며, 폐기물 처리 비용·인건비·자재비가 모두 포함된 단일 견적입니다. 작업 후 추가 청구는 없으며, 1년 사후 책임 보증까지 비용에 포함됩니다."
  ]
};

// 섹션 E: 도입 후 30일 운영 가이드 (300~400자)
const RP_GUIDE_POOLS = {
  'card': [
    "{productName} 설치 직후 1주일은 결제 흐름이 정상 작동하는지 일 결제 마감 시점에 확인해주시면 됩니다. 첫 달은 매출 데이터가 본사 서버와 정상 동기화되는지, 영수증 인쇄가 깨끗하게 출력되는지 점검 포인트입니다. 두 번째 달부터는 별도 확인이 필요 없으며, 시스템이 자동으로 안정 운영됩니다. 사용 중 결제 거절·통신 지연 등 사소한 문제라도 발생하면 카카오톡 또는 전화로 즉시 문의해주시면, 대부분 원격 지원으로 5~10분 내 해결됩니다.",
    "도입 첫 주에는 직원분들이 새 단말 조작에 익숙해지도록 사용법 교육이 함께 진행됩니다. 결제 처리, 환불, 매출 마감 등 기본 동작은 5분 이내 숙달 가능한 직관적 UI 설계여서, 적응 기간이 매우 짧습니다. 첫 달 매출 마감 데이터를 확인하시면서 결제 흐름이 매장 운영에 자연스럽게 녹아들었는지 점검하시면 도입이 마무리됩니다."
  ],
  'pos': [
    "{productName} 도입 첫 주는 메뉴 입력과 직원 사용법 교육이 핵심입니다. 마스터페이가 매장 메뉴 입력을 직접 지원하므로 사장님께서는 메뉴 정확성만 검토해주시면 됩니다. 둘째 주부터는 일 매출 마감과 시간대별 매출 분석이 자동 생성되므로, 데이터를 확인하시면서 매장 운영 패턴을 파악하시면 좋습니다. 도입 1개월 시점부터는 누적된 데이터를 기반으로 메뉴 운영 전략을 수립할 수 있어, 매장 운영의 새로운 단계로 진입하게 됩니다.",
    "포스기 도입 후 첫 30일은 직원과 시스템이 서로 적응하는 기간입니다. 직원분들이 메뉴 변경·환불 처리·매출 마감 같은 일상 운영 동작에 익숙해지면, 매장 운영 효율이 본격적으로 향상됩니다. 첫 달 누적 매출 데이터는 시간대별·요일별·메뉴별 분석으로 자동 정리되어, 두 번째 달 운영 의사결정의 근거로 즉시 활용됩니다."
  ],
  'kiosk': [
    "{productName} 도입 직후 1~2주는 직원분이 키오스크 앞에서 고객 응대를 도와주시는 적응 기간입니다. 50대 이상 고객이 메뉴 탐색에 시간이 걸리시는 경우가 있어, 이 기간 동안은 응대 보조가 권장됩니다. 둘째 주부터는 고객이 직접 주문하는 흐름이 정착되며, 셋째 주부터는 카운터 인력이 사실상 불필요해집니다. 도입 1개월 시점에 객단가 상승 효과와 인건비 절감 효과가 동시에 데이터로 확인되므로, 운영 의사결정에 즉시 활용 가능합니다.",
    "키오스크 도입은 단순 장비 설치가 아니라 매장 운영 구조 변화입니다. 첫 1주는 직원과 고객 모두 새 흐름에 적응하는 시기이며, 직원이 키오스크 앞에서 고객을 안내해주시면 적응 기간이 단축됩니다. 둘째 주부터 무인 운영이 자연스럽게 정착되며, 한 달 시점에는 카운터 인력 1명 분의 효과가 명확히 체감됩니다."
  ],
  'tableorder': [
    "{productName} 도입 후 첫 주는 고객분들이 QR 또는 태블릿 주문에 익숙해지는 기간입니다. 직원이 첫 주문 시 사용법을 짧게 안내해주시면 적응이 매우 빠르게 진행됩니다. 둘째 주부터는 고객이 자연스럽게 직접 주문하시며, 홀 직원 부담이 본격적으로 감소합니다. 한 달 시점에 객단가 상승 효과와 회전율 향상 효과가 데이터로 확인됩니다."
  ],
  'removal': [
    "{productName} 작업 완료 후 임대인 인계까지의 절차도 함께 안내드립니다. 작업 종료 시점에 매장 상태 사진을 촬영하여 임대인과 공유하면, 추후 분쟁 가능성을 사전에 차단할 수 있습니다. 인계 후 1년간 임대인이 추가 요구를 하는 경우 마스터페이가 직접 협의 진행하므로, 사장님은 일상으로 빠르게 복귀하실 수 있습니다."
  ]
};

// ----- 통합 헬퍼 함수: 지역×제품 페이지 본문 데이터 생성 -----
function buildRegionProductData(regionName, productSlug) {
  const product = PRODUCTS[productSlug];
  if (!product) return null;
  const seed = hashString(regionName + productSlug);
  const poolKey = getProductPoolKey(productSlug);
  const ctx = getRegionContext(regionName);
  
  const replace = (s) => josaText(s, {
    region: regionName,
    productName: product.name,
    areaType: ctx.areaType,
    topBiz1: ctx.topBiz[0],
    topBiz2: ctx.topBiz[1]
  });
  
  // 인트로 (확장)
  const introPool = RP_INTRO_EXPANDED_POOLS[poolKey] || RP_INTRO_EXPANDED_POOLS['card'];
  const intro = replace(pick(introPool, seed, 0));
  
  // 지역 환경 분석
  const regionAnalysis = replace(pick(RP_REGION_ANALYSIS_POOLS, seed, 7));
  
  // 5줄 제품 설명
  const productDesc = buildProductDesc(productSlug, regionName);
  
  // 장점/도입 효과 (4개 카드)
  const benefitsCfg = RP_BENEFITS_POOLS[poolKey] || RP_BENEFITS_POOLS['card'];
  const benefitsTitle = pick(benefitsCfg.title, seed, 1);
  const benefits = benefitsCfg.items.map((slot, i) => pick(slot, seed, i));
  
  // 추천 업종 (4개)
  const industryPool = RP_INDUSTRY_POOLS[poolKey] || RP_INDUSTRY_POOLS['card'];
  const industries = pick(industryPool, seed, 2);
  
  // 구매 주의점 (5개)
  const cautionsPool = RP_CAUTIONS_POOLS[poolKey] || RP_CAUTIONS_POOLS['card'];
  const cautions = pick(cautionsPool[0], seed, 3);
  
  // 효과 단락
  const effectPool = RP_EFFECT_POOLS[poolKey] || RP_EFFECT_POOLS['card'];
  const effect = replace(pick(effectPool, seed, 4));
  
  // 함께 쓰면 좋은 제품
  const comboPool = RP_COMBO_POOLS[poolKey] || RP_COMBO_POOLS['card'];
  const combo = replace(pick(comboPool, seed, 8));
  
  // 장기 운영 안정성
  const longtermPool = RP_LONGTERM_POOLS[poolKey] || RP_LONGTERM_POOLS['card'];
  const longterm = replace(pick(longtermPool, seed, 9));
  
  // 비용 구조 안내
  const costPool = RP_COST_POOLS[poolKey] || RP_COST_POOLS['card'];
  const cost = replace(pick(costPool, seed, 10));
  
  // 도입 30일 가이드
  const guidePool = RP_GUIDE_POOLS[poolKey] || RP_GUIDE_POOLS['card'];
  const guide = replace(pick(guidePool, seed, 11));
  
  // 설치 프로세스
  const process = pick(RP_PROCESS_POOLS, seed, 5);
  
  // FAQ
  const faqPool = RP_FAQ_POOLS[poolKey] || RP_FAQ_POOLS['card'];
  const faqs = pick(faqPool, seed, 6);
  
  return { product, intro, regionAnalysis, productDesc, benefitsTitle, benefits, industries, cautions, effect, combo, longterm, cost, guide, process, faqs };
}

// ----- 지역×제품 페이지 본문 HTML 렌더 -----
function renderRegionProductBody(data) {
  if (!data) return '';
  return `
<div class="region-box">
<div class="region-intro-box">
<div class="region-intro-icon">📋</div>
<div class="region-intro-text">
<strong>지역 매장 환경과 제품 안내</strong>
<p>${data.intro}</p>
</div>
</div>
</div>

<div class="region-box">
<h2 class="region-box-title">📍 지역 매장 환경 분석</h2>
<p class="region-section-text">${data.regionAnalysis}</p>
</div>

<div class="region-box">
<h2 class="region-box-title">📦 ${data.product.name} 핵심 5가지</h2>
<ul class="region-product-desc-list">
${data.productDesc.map(line => `<li>${line}</li>`).join('')}
</ul>
</div>

<div class="region-box">
<h2 class="region-box-title">💡 ${data.benefitsTitle}</h2>
<div class="region-features-grid">
${data.benefits.map(b => `<div class="region-feature-card"><h3>${b.h}</h3><p>${b.d}</p></div>`).join('')}
</div>
</div>

<div class="region-box">
<h2 class="region-box-title">🏪 추천 업종 및 활용</h2>
<div class="region-biz-grid">
${data.industries.map(i => `<div class="region-biz-card"><div class="region-biz-info"><div class="region-biz-name">${i.biz}</div><div class="region-biz-effect">${i.effect}</div></div><div class="region-biz-stars">${'★'.repeat(i.star)}${'☆'.repeat(5-i.star)}</div></div>`).join('')}
</div>
</div>

<div class="region-box">
<h2 class="region-box-title">📈 도입 후 운영 변화</h2>
<p class="region-section-text">${data.effect}</p>
</div>

<div class="region-box">
<h2 class="region-box-title">⚠️ 구매 전 반드시 확인할 점</h2>
<div class="region-cautions-list">
${data.cautions.map((c, i) => `<div class="region-caution-item"><div class="caution-num">${i+1}</div><div><h3>${c.h}</h3><p>${c.d}</p></div></div>`).join('')}
</div>
</div>

<div class="region-box">
<h2 class="region-box-title">🔗 함께 도입하면 좋은 제품</h2>
<p class="region-section-text">${data.combo}</p>
</div>

<div class="region-box">
<h2 class="region-box-title">🛡️ 장기 운영 안정성</h2>
<p class="region-section-text">${data.longterm}</p>
</div>

<div class="region-box">
<h2 class="region-box-title">💰 비용 구조 안내</h2>
<p class="region-section-text">${data.cost}</p>
</div>

<div class="region-box">
<h2 class="region-box-title">🗓️ 도입 후 30일 운영 가이드</h2>
<p class="region-section-text">${data.guide}</p>
</div>

<div class="region-box">
<h2 class="region-box-title">🛠️ 설치 진행 절차</h2>
<p class="region-section-text">${data.process}</p>
</div>

<div class="region-box">
<h2 class="region-box-title">❓ 자주 묻는 질문</h2>
<div class="region-faq-list">
${data.faqs.map(f => `<div class="region-faq-item"><strong>Q. ${f.q}</strong><p>${f.a}</p></div>`).join('')}
</div>
</div>
`;
}

// ----- 지역 페이지용 제품 10개 5줄씩 카드 리스트 렌더 -----
function renderRegionProductsDetailList(regionName) {
  return Object.values(PRODUCTS).map(p => {
    const desc = buildProductDesc(p.url, regionName);
    const visual = p.img
      ? `<img src="${p.img}" alt="${p.name}" class="region-product-detail-img" loading="lazy">`
      : `<span class="region-product-emoji">${p.emoji}</span>`;
    return `
<div class="region-product-detail-card">
<div class="region-product-detail-header">
${visual}
<h3>${p.name}</h3>
</div>
<ul>
${desc.map(line => `<li>${line}</li>`).join('')}
</ul>
</div>`;
  }).join('');
}

// ============================================================
// 콘텐츠 풀 끝
// ============================================================


// ============================================================
// 공통 HTML 레이아웃 생성
// ============================================================

function getCommonHead(title, description) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<link rel="icon" type="image/png" href="/brand.png">
<link rel="apple-touch-icon" href="/brand.png">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="naver-site-verification" content="53af8497b3a522a8a85a7b13bae57efd7e27fb5c" />
<title>${title} | 마스터페이</title>
<meta name="description" content="${description}">
<meta property="og:title" content="${title} | 마스터페이">
<meta property="og:description" content="${description}">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&display=swap" rel="stylesheet">
<style>/* ========== 공용 스타일 (모든 페이지에서 사용) ========== */

:root {
    --cream: #f7f4ed;
    --cream-dark: #ede8db;
    --ink: #1a1a1a;
    --ink-soft: #4a4a4a;
    --forest: #2d4a3e;
    --forest-dark: #1f352c;
    --coral: #e8763a;
    --border: #d9d3c4;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 80px; }

body {
    font-family: 'Pretendard Variable', Pretendard, -apple-system, sans-serif;
    background: var(--cream);
    color: var(--ink);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
}

a { text-decoration: none; color: inherit; }
img { max-width: 100%; display: block; }

.container {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 32px;
}

/* ========== 헤더 ========== */
header {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    background: var(--cream);
    z-index: 9999 !important;
    border-bottom: 1px solid var(--border);
}
body {
    padding-top: 72px;
}
@media (max-width: 768px) {
    body { padding-top: 60px; }
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 32px;
    max-width: 1240px;
    margin: 0 auto;
}

.logo {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 8px;
}

.logo-mark {
    width: 28px;
    height: 28px;
    background: var(--forest);
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--cream);
    font-size: 14px;
}
.logo-mark-img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    display: inline-block;
    vertical-align: middle;
}

.nav-menu {
    display: flex;
    gap: 40px;
    list-style: none;
}

.nav-menu a {
    font-size: 15px;
    font-weight: 500;
    color: var(--ink-soft);
    transition: color 0.2s;
}

.nav-menu a:hover { color: var(--ink); }

.nav-cta {
    background: var(--ink);
    color: var(--cream);
    padding: 10px 20px;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 600;
    transition: transform 0.2s;
}

.nav-cta:hover { transform: scale(1.03); }

.mobile-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

/* ========== 제품 페이지 전용 ========== */
.product-hero {
    padding: 60px 0 80px;
    position: relative;
    overflow: hidden;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--ink-soft);
    margin-bottom: 32px;
}

.breadcrumb a {
    color: var(--ink-soft);
    transition: color 0.2s;
}

.breadcrumb a:hover { color: var(--ink); }

.breadcrumb-separator {
    opacity: 0.4;
}

.product-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
}

.product-badge {
    display: inline-block;
    padding: 6px 14px;
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
    color: var(--coral);
    margin-bottom: 20px;
}

.product-title {
    font-size: clamp(36px, 5vw, 60px);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
}

.product-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}

.product-lead {
    font-size: 18px;
    color: var(--ink-soft);
    line-height: 1.6;
    margin-bottom: 32px;
}

.product-specs {
    display: flex;
    gap: 32px;
    padding: 24px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    margin-bottom: 32px;
    flex-wrap: wrap;
}

.spec-item .spec-label {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 13px;
    color: var(--coral);
    margin-bottom: 4px;
}

.spec-item .spec-value {
    font-size: 18px;
    font-weight: 700;
}

.product-cta {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.btn {
    padding: 16px 32px;
    border-radius: 100px;
    font-weight: 600;
    font-size: 15px;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid transparent;
}

.btn-primary {
    background: var(--ink);
    color: var(--cream);
}

.btn-primary:hover {
    background: var(--forest);
}

.btn-ghost {
    background: transparent;
    color: var(--ink);
    border-color: var(--border);
}

.btn-ghost:hover {
    background: var(--cream-dark);
}

/* 제품 이미지 영역 */
.product-visual {
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 32px;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 180px;
    position: relative;
    overflow: hidden;
}

.product-visual img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* ========== 특징 섹션 ========== */
.features {
    padding: 100px 0;
    background: var(--cream-dark);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
}

.section-header {
    display: flex;
    align-items: baseline;
    gap: 24px;
    margin-bottom: 64px;
    flex-wrap: wrap;
}

.section-num {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 28px;
    color: var(--coral);
    font-weight: 400;
}

.section-title {
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    flex: 1;
    min-width: 300px;
}

.section-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 2px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 24px;
    overflow: hidden;
}

.feature-item {
    background: var(--cream);
    padding: 40px 32px;
    transition: background 0.3s;
}

.feature-item:hover {
    background: var(--cream-dark);
}

.feature-icon {
    font-size: 36px;
    margin-bottom: 20px;
    display: inline-block;
}

.feature-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 12px;
    letter-spacing: -0.01em;
}

.feature-desc {
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.6;
}

/* ========== 상세 내용 섹션 ========== */
.detail {
    padding: 100px 0;
}

.detail-content {
    max-width: 800px;
    margin: 0 auto;
    font-size: 17px;
    line-height: 1.8;
    color: var(--ink-soft);
}

.detail-content h3 {
    font-size: 28px;
    font-weight: 800;
    color: var(--ink);
    margin: 48px 0 20px;
    letter-spacing: -0.02em;
}

.detail-content h3:first-child {
    margin-top: 0;
}

.detail-content p {
    margin-bottom: 20px;
}

.detail-content ul {
    list-style: none;
    padding: 0;
    margin-bottom: 20px;
}

.detail-content ul li {
    padding: 10px 0 10px 32px;
    position: relative;
    border-bottom: 1px solid var(--border);
}

.detail-content ul li:last-child {
    border-bottom: none;
}

.detail-content ul li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--coral);
    font-weight: 800;
    font-size: 18px;
}

/* ========== 관련 제품 ========== */
.related {
    padding: 100px 0;
    background: var(--cream-dark);
    border-top: 1px solid var(--border);
}

.related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
}

.related-card {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 28px;
    transition: all 0.3s;
    display: block;
}

.related-card:hover {
    transform: translateY(-4px);
    border-color: var(--ink);
}

.related-icon {
    font-size: 36px;
    margin-bottom: 16px;
}

.related-name {
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 6px;
}

.related-desc {
    font-size: 13px;
    color: var(--ink-soft);
}

/* ========== CTA 섹션 ========== */
.cta {
    background: var(--ink);
    color: var(--cream);
    padding: 120px 0;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.cta::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: var(--forest);
    border-radius: 50%;
    top: -300px;
    right: -200px;
    opacity: 0.4;
    filter: blur(80px);
}

.cta-content {
    position: relative;
    z-index: 1;
}

.cta-label {
    font-family: 'Fraunces', serif;
    font-style: italic;
    color: var(--coral);
    font-size: 18px;
    margin-bottom: 20px;
}

.cta h2 {
    font-size: clamp(32px, 5vw, 56px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-bottom: 40px;
}

.cta h2 .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--coral);
}

.cta-phone {
    display: inline-flex;
    align-items: center;
    gap: 16px;
    font-size: 28px;
    font-weight: 800;
    padding: 20px 40px;
    background: var(--cream);
    color: var(--ink);
    border-radius: 100px;
    transition: transform 0.2s;
    margin-bottom: 16px;
}

.cta-phone:hover {
    transform: scale(1.03);
}

.cta-note {
    opacity: 0.7;
    font-size: 14px;
}

/* ========== 푸터 ========== */
footer {
    background: var(--ink);
    color: var(--cream);
    padding: 60px 0 40px;
    border-top: 1px solid rgba(247, 244, 237, 0.1);
}

.footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
}

.footer-brand .logo {
    color: var(--cream);
    margin-bottom: 16px;
}

.footer-brand p {
    font-size: 14px;
    opacity: 0.7;
    max-width: 300px;
    line-height: 1.6;
}

.footer-col h4 {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 16px;
    color: var(--coral);
}

.footer-col ul { list-style: none; }
.footer-col li { margin-bottom: 10px; }

.footer-col a {
    font-size: 14px;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.footer-col a:hover { opacity: 1; }

.footer-bottom {
    padding-top: 30px;
    border-top: 1px solid rgba(247, 244, 237, 0.1);
    font-size: 13px;
    opacity: 0.6;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
}

/* ========== 모바일 대응 ========== */
@media (max-width: 900px) {
    .product-grid {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .footer-grid {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 640px) {
    .container { padding: 0 20px; }
    .nav { padding: 16px 20px; }
    .nav-menu, .nav-cta { display: none; }
    .mobile-toggle { display: block; }
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--cream);
        padding: 20px;
        gap: 20px;
        border-bottom: 1px solid var(--border);
    }
    .product-hero { padding: 40px 0 60px; }
    .features, .detail, .related { padding: 60px 0; }
    .cta { padding: 80px 0; }
    .footer-grid { grid-template-columns: 1fr; }
    .cta-phone { font-size: 20px; padding: 16px 28px; }
    .product-visual { font-size: 100px; }
}

/* ========== 지역 페이지 썸네일 (배경 이미지 위 텍스트 오버레이) ========== */
.region-thumbnail {
    margin: 0 auto 32px;
    max-width: 980px;
    border-radius: 24px;
    overflow: hidden;
    position: relative;
    aspect-ratio: 16 / 9;
    max-height: 420px;
    background: linear-gradient(135deg, #1a1a1a, #2d4a3e);
    box-shadow: 0 12px 40px rgba(0,0,0,0.18);
}
.region-thumbnail-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: brightness(0.55) saturate(0.85);
}
.region-thumbnail-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.65) 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 56px 48px;
}
.region-thumbnail-badge {
    position: absolute;
    top: 24px;
    right: 24px;
    background: rgba(255,255,255,0.95);
    color: #1a1a1a;
    padding: 8px 16px;
    border-radius: 100px;
    font-size: 13px;
    font-weight: 700;
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    gap: 6px;
    z-index: 2;
}
.region-thumbnail-meta {
    color: rgba(255,255,255,0.85);
    font-size: 13px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 18px;
    letter-spacing: 0.01em;
}
.region-thumbnail-meta span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
}
.region-thumbnail-meta .region-thumbnail-dot {
    opacity: 0.5;
}
.region-thumbnail-title {
    color: #ffffff;
    font-size: clamp(28px, 5.5vw, 48px);
    font-weight: 800;
    margin: 0 0 20px;
    letter-spacing: -0.025em;
    text-shadow: 0 2px 16px rgba(0,0,0,0.4);
    line-height: 1.15;
    max-width: 800px;
}
.region-thumbnail-services {
    color: rgba(255,255,255,0.92);
    font-size: 15px;
    font-weight: 500;
    line-height: 1.6;
    letter-spacing: 0.01em;
    text-shadow: 0 1px 8px rgba(0,0,0,0.3);
    max-width: 640px;
    margin: 0 auto;
}
@media (max-width: 768px) {
    .region-thumbnail { aspect-ratio: 4 / 3; max-height: 320px; max-width: 100%; margin: 0 auto 24px; border-radius: 20px; }
    .region-thumbnail-overlay { padding: 24px 20px; }
    .region-thumbnail-badge { top: 14px; right: 14px; padding: 6px 12px; font-size: 11px; }
    .region-thumbnail-title { font-size: clamp(22px, 6vw, 30px); margin-bottom: 12px; line-height: 1.2; }
    .region-thumbnail-meta { font-size: 11.5px; margin-bottom: 10px; gap: 6px; }
    .region-thumbnail-services { font-size: 12.5px; line-height: 1.5; }
}

/* ========== 지역 페이지 전용 스타일 ========== */
body { background: #ffffff; }
.region-hero {
    padding: 60px 0 40px;
    background: #ffffff;
    text-align: center;
}
.region-hero .breadcrumb {
    justify-content: center;
    margin-bottom: 20px;
    font-size: 13px;
    color: var(--ink-soft);
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
}
.region-hero .breadcrumb a { color: var(--ink-soft); transition: color 0.2s; }
.region-hero .breadcrumb a:hover { color: var(--ink); }
.region-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 12px;
    color: var(--ink-soft);
    margin-bottom: 24px;
    font-weight: 500;
}
.region-hero-title {
    font-size: clamp(30px, 4.5vw, 46px);
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
}
.region-hero-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}
.region-hero-sub {
    font-size: 16px;
    color: var(--ink-soft);
    line-height: 1.7;
    max-width: 700px;
    margin: 0 auto 28px;
}
.region-hero-sub-standalone {
    text-align: center;
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.7;
    max-width: 700px;
    margin: -8px auto 28px;
    letter-spacing: -0.005em;
}
.region-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    max-width: 780px;
    margin: 0 auto 28px;
}
.region-stat {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 22px 16px;
    text-align: center;
    transition: all 0.2s;
}
.region-stat:hover {
    border-color: var(--forest);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04);
}
.region-stat-icon { font-size: 26px; margin-bottom: 6px; line-height: 1; }
.region-stat-label { font-size: 11px; color: var(--ink-soft); margin-bottom: 4px; }
.region-stat-value {
    font-size: 16px;
    font-weight: 800;
    color: var(--forest);
    letter-spacing: -0.01em;
}
.region-cta {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
}
.region-main { padding: 40px 0 80px; background: #ffffff; }
.region-main .container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.region-box {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 32px 28px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}
.keyword-box {
    background: linear-gradient(135deg, #fff8f0, #fef3e2);
    border: 1px dashed var(--coral);
}
.keyword-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 16px;
}
.keyword-tag {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
    transition: all 0.2s;
    cursor: default;
    display: inline-block;
    word-break: keep-all;
}
.keyword-tag:hover {
    background: var(--forest);
    color: var(--cream);
    border-color: var(--forest);
    transform: translateY(-1px);
}
@media (max-width: 768px) {
    .keyword-tags { gap: 6px; }
    .keyword-tag { font-size: 12px; padding: 6px 12px; }
}
.region-box-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 19px;
    font-weight: 800;
    letter-spacing: -0.01em;
    margin: 0 0 16px;
    padding-left: 14px;
    position: relative;
    line-height: 1.3;
}
.region-box-title::before {
    content: '';
    position: absolute;
    left: 0;
    top: 4px;
    bottom: 4px;
    width: 4px;
    background: var(--coral);
    border-radius: 2px;
}
.region-box-title .italic {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--forest);
}
.region-box-subtitle {
    font-size: 14px;
    color: var(--ink-soft);
    line-height: 1.7;
    margin: 0 0 20px;
}
.region-box p {
    font-size: 14px;
    color: var(--ink-soft);
    line-height: 1.8;
    margin: 0 0 12px;
}
.region-box p:last-child { margin-bottom: 0; }
.region-box strong { color: var(--ink); font-weight: 700; }
.region-box h3 {
    font-size: 15px;
    font-weight: 800;
    margin: 20px 0 10px;
    letter-spacing: -0.01em;
    color: var(--ink);
    padding-left: 10px;
    border-left: 3px solid var(--forest);
}
.region-box h3:first-child { margin-top: 0; }
.region-box ul {
    padding-left: 0;
    list-style: none;
    margin: 0 0 16px;
}
.region-box ul li {
    padding: 8px 0 8px 22px;
    position: relative;
    font-size: 13px;
    color: var(--ink-soft);
    line-height: 1.6;
}
.region-box ul li::before {
    content: '✓';
    position: absolute;
    left: 0;
    top: 8px;
    color: var(--forest);
    font-weight: 700;
    font-size: 13px;
}
.region-box ul li strong { color: var(--ink); font-weight: 700; }
.region-intro-box {
    background: #fef8e6;
    border: 1px solid #f5e8b0;
    border-radius: 16px;
    padding: 20px 24px;
    display: flex;
    gap: 16px;
    align-items: flex-start;
}
.region-intro-icon { font-size: 28px; flex-shrink: 0; }
.region-intro-text strong {
    display: block;
    font-size: 15px;
    margin-bottom: 4px;
    color: var(--ink);
    font-weight: 700;
}
.region-intro-text p {
    font-size: 13px;
    color: var(--ink-soft);
    line-height: 1.6;
    margin: 0;
}
.region-features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
}
.region-feature-card {
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 20px 18px;
    transition: all 0.2s;
}
.region-feature-card:hover {
    background: var(--cream);
    border-color: var(--forest);
    transform: translateY(-2px);
}
.region-feature-card .fi-icon { font-size: 26px; margin-bottom: 10px; line-height: 1; }
.region-feature-card h3 {
    font-size: 14px;
    font-weight: 700;
    margin: 0 0 6px;
    letter-spacing: -0.01em;
    color: var(--ink);
    padding-left: 0;
    border-left: none;
}
.region-feature-card p {
    font-size: 12px;
    color: var(--ink-soft);
    line-height: 1.6;
    margin: 0;
}
.region-numbered-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
}
.region-numbered-card {
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 22px 20px;
    position: relative;
}
.region-numbered-card .num-circle {
    width: 30px;
    height: 30px;
    background: var(--ink);
    color: var(--cream);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 13px;
    margin-bottom: 12px;
    font-family: 'Fraunces', serif;
    font-style: italic;
}
.region-numbered-card h3 {
    font-size: 15px;
    font-weight: 700;
    margin: 0 0 8px;
    letter-spacing: -0.01em;
    color: var(--ink);
    padding-left: 0;
    border-left: none;
}
.region-numbered-card p {
    font-size: 12px;
    color: var(--ink-soft);
    line-height: 1.7;
    margin: 0;
}
.region-products-simple {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 10px;
}
/* === 새 콘텐츠 (제품 5줄 / 지역×제품 본문) 스타일 === */
.region-product-desc-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 0;
    padding: 0;
}
.region-product-desc-list li {
    padding-left: 24px;
    position: relative;
    font-size: 14.5px;
    line-height: 1.75;
    color: var(--ink-soft);
}
.region-product-desc-list li::before {
    content: '';
    position: absolute;
    left: 0; top: 10px;
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--forest);
}
.region-section-text {
    font-size: 14.5px;
    color: var(--ink-soft);
    line-height: 1.85;
    margin: 0;
}
.region-cautions-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 4px;
}
.region-caution-item {
    display: flex;
    gap: 14px;
    background: white;
    border-radius: 14px;
    padding: 16px 18px;
    border: 1px solid var(--border);
}
.region-caution-item .caution-num {
    width: 26px; height: 26px;
    background: var(--coral);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 12px;
    flex-shrink: 0;
}
.region-caution-item h3 {
    font-size: 14.5px;
    margin: 2px 0 4px;
    font-weight: 700;
}
.region-caution-item p {
    font-size: 13.5px;
    color: var(--ink-soft);
    line-height: 1.7;
    margin: 0;
}
.region-products-detail-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
}
.region-product-detail-card {
    background: white;
    border-radius: 14px;
    padding: 18px 20px;
    border: 1px solid var(--border);
}
.region-product-detail-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
}
.region-product-emoji { font-size: 22px; }
.region-product-detail-img { width: 36px; height: 36px; object-fit: contain; }
.region-product-detail-card h3 {
    font-size: 16px;
    font-weight: 700;
    margin: 0;
}
.region-product-detail-card ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 0;
    margin: 0;
}
.region-product-detail-card li {
    font-size: 13px;
    line-height: 1.7;
    padding-left: 14px;
    position: relative;
    color: var(--ink-soft);
}
.region-product-detail-card li::before {
    content: '·';
    position: absolute;
    left: 4px;
    font-weight: 800;
    color: var(--forest);
}
.region-intro-box {
    display: flex;
    gap: 18px;
    align-items: flex-start;
}
.region-intro-icon {
    font-size: 28px;
    flex-shrink: 0;
}
.region-intro-text strong {
    display: block;
    font-size: 15px;
    margin-bottom: 6px;
    font-weight: 700;
}
.region-intro-text p {
    font-size: 14px;
    color: var(--ink-soft);
    line-height: 1.8;
    margin: 0;
}
.region-product-simple {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px 12px;
    text-align: center;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: 130px;
}
.region-product-simple:hover {
    transform: translateY(-2px);
    border-color: var(--forest);
    background: #ffffff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}
.region-product-simple .ps-icon,
.region-product-simple .ps-img {
    height: 70px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
.region-product-simple .ps-icon {
    font-size: 36px;
    line-height: 1;
    width: 70px;
}
.region-product-simple .ps-img {
    object-fit: contain;
    transition: transform 0.3s;
    max-height: 70px;
    width: auto;
    max-width: 100%;
}
.region-product-simple:hover .ps-img {
    transform: scale(1.05);
}
.region-product-simple .ps-name {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: -0.01em;
    line-height: 1.3;
    width: 100%;
    margin-top: auto;
}
.region-biz-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 10px;
}
.region-biz-card {
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px 16px;
    display: flex;
    gap: 10px;
    align-items: center;
}
.region-biz-icon {
    font-size: 22px;
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--cream);
    border-radius: 8px;
    border: 1px solid var(--border);
}
.region-biz-info { flex: 1; min-width: 0; }
.region-biz-name {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 2px;
}
.region-biz-effect { font-size: 11px; color: var(--ink-soft); }
.region-biz-stars {
    color: var(--coral);
    font-size: 10px;
    letter-spacing: 1px;
    flex-shrink: 0;
}
.region-faq-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.region-faq-item {
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 16px 20px;
}
.region-faq-item strong {
    display: block;
    font-size: 14px;
    color: var(--ink);
    margin-bottom: 8px;
    font-weight: 700;
}
.region-faq-item p {
    font-size: 13px;
    color: var(--ink-soft);
    line-height: 1.7;
    margin: 0;
}
.region-list-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
}
.region-list-card {
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s;
    gap: 10px;
}
.region-list-card:hover {
    border-color: var(--forest);
    background: var(--cream);
    transform: translateX(3px);
}
.region-list-info { flex: 1; min-width: 0; }
.region-list-name {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 2px;
    display: flex;
    align-items: center;
    gap: 5px;
}
.region-list-desc { font-size: 11px; color: var(--ink-soft); }
.region-list-arrow {
    font-size: 14px;
    color: var(--ink-soft);
    opacity: 0.5;
    transition: all 0.2s;
}
.region-list-card:hover .region-list-arrow { opacity: 1; color: var(--forest); }
.region-chips-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
}
.region-chip {
    display: inline-flex;
    align-items: center;
    padding: 8px 16px;
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 12px;
    font-weight: 600;
    color: var(--ink);
    transition: all 0.15s;
}
.region-chip:hover {
    background: var(--forest);
    border-color: var(--forest);
    color: var(--cream);
}
.region-reviews-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 12px;
}
.region-review {
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 20px 22px;
}
.region-review-stars {
    color: var(--coral);
    font-size: 13px;
    margin-bottom: 10px;
    letter-spacing: 2px;
}
.region-review p {
    font-size: 13px;
    color: var(--ink);
    line-height: 1.7;
    margin: 0 0 12px;
    font-weight: 500;
}
.region-review-author {
    font-size: 11px;
    color: var(--ink-soft);
    padding-top: 10px;
    border-top: 1px solid var(--border);
}
.region-effect-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 10px;
}
.region-effect-item {
    text-align: center;
    padding: 22px 16px;
    background: var(--cream-dark);
    border: 1px solid var(--border);
    border-radius: 12px;
}
.region-effect-num {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 400;
    font-size: clamp(26px, 3.5vw, 34px);
    color: var(--forest);
    line-height: 1;
    margin-bottom: 6px;
}
.region-effect-label { font-size: 11px; color: var(--ink-soft); }
.region-cta-box {
    background: var(--ink);
    color: var(--cream);
    border-radius: 20px;
    padding: 40px 28px;
    text-align: center;
    position: relative;
    overflow: hidden;
}
.region-cta-box::before {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    background: var(--forest);
    border-radius: 50%;
    top: -150px;
    right: -80px;
    opacity: 0.3;
    filter: blur(50px);
}
.region-cta-box h3 {
    font-size: clamp(20px, 2.5vw, 26px);
    font-weight: 800;
    margin: 0 0 10px;
    position: relative;
    z-index: 1;
    padding-left: 0;
    border-left: none;
}
.region-cta-box p {
    font-size: 13px;
    opacity: 0.85;
    margin: 0 0 20px;
    position: relative;
    z-index: 1;
}
.region-cta-buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;
}
.region-cta-box .btn-primary {
    background: var(--cream);
    color: var(--ink);
}
.region-cta-box .btn-primary:hover {
    background: var(--coral);
    color: var(--cream);
}
.region-cta-box .btn-ghost {
    border-color: rgba(247, 244, 237, 0.3);
    color: var(--cream);
}
.region-cta-box .btn-ghost:hover {
    background: rgba(247, 244, 237, 0.1);
}
@media (max-width: 640px) {
    .region-hero { padding: 40px 0 30px; }
    .region-main { padding: 30px 0 60px; }
    .region-box { padding: 24px 20px; }
    .region-cta-box { padding: 32px 20px; }
    .region-stats-grid { grid-template-columns: repeat(2, 1fr); }
    .region-effect-grid { grid-template-columns: repeat(2, 1fr); }
    .region-products-simple { grid-template-columns: repeat(3, 1fr); }
    .region-hero-sub-standalone { font-size: 13.5px; padding: 0 8px; margin: -4px auto 22px; }
}


/* 지역 페이지 이탤릭 통일 - 모두 같은 폰트로 */
.region-hero-title .italic,
.region-box-title .italic,
.region-box h3 .italic,
.region-box h2 .italic,
.region-cta-box h3 .italic {
    font-family: inherit !important;
    font-style: normal !important;
    font-weight: inherit !important;
    color: inherit !important;
}


/* ========== 문의 폼 섹션 ========== */
.contact-section {
    padding: 100px 0;
    background: var(--cream-dark);
}
.contact-section .container {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 60px;
    align-items: start;
    max-width: 1140px;
}
.contact-intro {
    position: sticky;
    top: 100px;
}
.contact-intro .cta-label {
    text-align: left;
    font-size: 13px;
    font-weight: 700;
    color: var(--coral);
    letter-spacing: 3px;
    margin-bottom: 16px;
}
.contact-title {
    font-size: clamp(32px, 4vw, 48px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0 0 16px;
}
.contact-sub {
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.7;
    margin: 0 0 32px;
}
.contact-direct {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.contact-direct-btn {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 22px;
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 14px;
    transition: all 0.2s;
    text-decoration: none;
    color: inherit;
}
.contact-direct-btn:hover {
    border-color: var(--forest);
    transform: translateX(4px);
}
.contact-direct-btn .cd-icon {
    width: 44px;
    height: 44px;
    background: var(--cream-dark);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
}
.cd-label {
    display: block;
    font-size: 12px;
    color: var(--ink-soft);
    margin-bottom: 2px;
}
.cd-value {
    display: block;
    font-size: 16px;
    font-weight: 700;
    color: var(--ink);
}

/* 문의 폼 박스 */
.contact-form-box {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 40px 36px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}
.contact-form-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 22px;
    font-weight: 800;
    margin: 0 0 28px;
    letter-spacing: -0.01em;
}
.cf-bar {
    width: 4px;
    height: 22px;
    background: var(--coral);
    border-radius: 2px;
}
.contact-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.form-group {
    display: flex;
    flex-direction: column;
}
.form-group label {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 8px;
}
.required {
    color: var(--coral);
}
.form-group input,
.form-group select,
.form-group textarea {
    padding: 14px 16px;
    font-size: 14px;
    font-family: inherit;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: #fafafa;
    color: var(--ink);
    transition: all 0.2s;
    width: 100%;
    box-sizing: border-box;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--forest);
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(45, 74, 62, 0.1);
}
.form-group input::placeholder,
.form-group textarea::placeholder {
    color: #b0b0b0;
}
.form-group textarea {
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
}
.form-group select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23666' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    background-size: 10px;
    padding-right: 40px;
}
.form-agree {
    padding: 16px;
    background: #fafafa;
    border-radius: 10px;
    border: 1px solid var(--border);
}
.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
}
.checkbox-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--forest);
    cursor: pointer;
}
.agree-detail {
    font-size: 11px;
    color: var(--ink-soft);
    margin-top: 8px;
    padding-left: 26px;
    line-height: 1.6;
}
.contact-submit {
    background: var(--ink);
    color: #ffffff;
    border: none;
    padding: 18px 28px;
    font-size: 16px;
    font-weight: 700;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    margin-top: 8px;
}
.contact-submit:hover {
    background: var(--forest);
    transform: translateY(-2px);
}
.contact-submit:disabled {
    background: #999;
    cursor: not-allowed;
    transform: none;
}
.form-message {
    padding: 20px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    display: none;
    margin-top: 16px;
}
.form-message.success {
    display: block;
    background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
    color: #1b5e20;
    border: 2px solid #66bb6a;
    box-shadow: 0 4px 16px rgba(76, 175, 80, 0.2);
    animation: messagePop 0.4s ease;
}
.form-message.error {
    display: block;
    background: linear-gradient(135deg, #ffebee, #ffcdd2);
    color: #b71c1c;
    border: 2px solid #ef5350;
    box-shadow: 0 4px 16px rgba(244, 67, 54, 0.2);
    animation: messagePop 0.4s ease;
}
@keyframes messagePop {
    0% { transform: scale(0.9); opacity: 0; }
    60% { transform: scale(1.02); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}

/* 모바일 */
@media (max-width: 900px) {
    .contact-section .container {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .contact-intro {
        position: static;
        text-align: center;
    }
    .contact-intro .cta-label { text-align: center; }
    .contact-direct-btn { flex-direction: row; text-align: left; }
    .contact-form-box { padding: 28px 24px; }
}

/* ========== 플로팅 버튼 ========== */
.floating-buttons {
    position: fixed;
    right: 20px;
    bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 999;
}
.fab-btn {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transition: all 0.2s;
    text-decoration: none;
    position: relative;
}
.fab-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}
.fab-btn.fab-contact {
    background: #4a90e2;
    color: #ffffff;
}
.fab-btn.fab-kakao {
    background: #FEE500;
    color: #000000;
}
.fab-btn.fab-phone {
    background: var(--coral);
    color: #ffffff;
}
.fab-btn::before {
    content: attr(data-tooltip);
    position: absolute;
    right: calc(100% + 12px);
    top: 50%;
    transform: translateY(-50%);
    background: var(--ink);
    color: #ffffff;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
}
.fab-btn:hover::before {
    opacity: 1;
}

/* 모바일에서 플로팅 버튼 */
@media (max-width: 640px) {
    .floating-buttons {
        right: 14px;
        bottom: 14px;
        gap: 8px;
    }
    .fab-btn {
        width: 50px;
        height: 50px;
        font-size: 22px;
    }
    .fab-btn::before { display: none; }
}


/* ============================================================
   📱 모바일 반응형 종합 보강 (일괄 패치)
   ============================================================ */

/* 가로 스크롤 방지 (가장 중요) */
html, body {
    overflow-x: hidden;
    width: 100%;
    -webkit-text-size-adjust: 100%;
}

* { max-width: 100%; }
img, video, iframe { max-width: 100%; height: auto; }
table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }

/* 768px 이하 (태블릿 ↓) */
@media (max-width: 768px) {
    .container { padding: 0 16px !important; }
    
    /* 본문 텍스트 가독성 */
    body { font-size: 15px; line-height: 1.7; }
    h1 { font-size: clamp(22px, 5.5vw, 30px) !important; line-height: 1.25 !important; word-break: keep-all; }
    h2 { font-size: clamp(18px, 4.5vw, 24px) !important; line-height: 1.3 !important; word-break: keep-all; }
    h3 { font-size: clamp(15px, 4vw, 18px) !important; line-height: 1.35 !important; }
    p { word-break: keep-all; line-height: 1.75; }
    
    /* 헤더/네비 */
    .nav { padding: 14px 0 !important; }
    .nav-menu { display: none !important; }
    .mobile-toggle { display: block !important; font-size: 22px; background: none; border: 0; cursor: pointer; padding: 6px 10px; }
    .nav-menu.active { display: flex !important; flex-direction: column; position: absolute; top: 100%; left: 0; right: 0; background: var(--cream); padding: 16px; gap: 14px; border-top: 1px solid var(--border); z-index: 100; }
    .nav-cta { padding: 8px 14px !important; font-size: 13px !important; }
    .logo { font-size: 17px !important; gap: 8px !important; }
    .logo-mark, .logo-mark-img { width: 24px !important; height: 24px !important; font-size: 12px !important; }
    
    /* 그리드들 → 1열 */
    .region-features-grid,
    .region-biz-grid,
    .region-reviews-grid,
    .region-products-grid,
    .footer-grid,
    .features-grid,
    .product-cards-grid,
    .pricing-grid,
    .review-grid,
    .stat-cards { grid-template-columns: 1fr !important; gap: 12px !important; }
    
    /* 시도/시군구 통계 → 2열 (너무 좁아지면 1열) */
    .region-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
    
    /* 지역 리스트(시군구·동) → 2~3열 */
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; font-size: 13px; }
    
    /* 제품 그리드 → 2열 */
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
    
    /* 박스 패딩 축소 */
    .region-box { padding: 20px 18px !important; border-radius: 14px !important; margin-bottom: 14px !important; }
    .region-box-title { font-size: 17px !important; margin-bottom: 12px !important; }
    
    /* 썸네일 (Hero) */
    .region-thumbnail { max-width: 100% !important; max-height: 280px !important; aspect-ratio: 4/3 !important; margin: 0 auto 20px !important; border-radius: 14px !important; }
    .region-thumbnail-overlay { padding: 18px 16px !important; }
    .region-thumbnail-meta { font-size: 11px !important; gap: 6px !important; }
    .region-thumbnail-title { font-size: clamp(20px, 5.5vw, 28px) !important; line-height: 1.2 !important; margin-bottom: 8px !important; }
    .region-thumbnail-services { font-size: 12px !important; line-height: 1.5 !important; }
    .region-hero-sub-standalone { font-size: 14px !important; line-height: 1.7 !important; max-width: 100% !important; padding: 0 4px !important; }
    
    /* 제품 5줄 카드 폰트 축소 */
    .region-product-detail-card { padding: 14px 16px !important; }
    .region-product-detail-card h3 { font-size: 15px !important; }
    .region-product-detail-card li { font-size: 12.5px !important; line-height: 1.65 !important; }
    
    /* FAQ */
    .region-faq-item { padding: 12px 14px !important; }
    .region-faq-item strong { font-size: 13.5px !important; }
    .region-faq-item p { font-size: 12.5px !important; }
    
    /* 주의사항 */
    .region-caution-item { padding: 12px 14px !important; gap: 10px !important; }
    .region-caution-item h3 { font-size: 13.5px !important; }
    .region-caution-item p { font-size: 12.5px !important; }
    
    /* 추천 업종 카드 */
    .region-biz-card { padding: 12px 14px !important; }
    .region-biz-name { font-size: 13.5px !important; }
    .region-biz-effect { font-size: 12px !important; }
    .region-biz-stars { font-size: 11.5px !important; }
    
    /* CTA 박스 */
    .region-cta-box { padding: 24px 18px !important; }
    .region-cta-buttons { flex-direction: column !important; gap: 10px !important; }
    .region-cta-buttons .btn { width: 100% !important; text-align: center; padding: 12px !important; font-size: 14px !important; }
    
    /* 버튼 */
    .btn { font-size: 14px !important; padding: 10px 18px !important; }
    .btn-primary, .btn-ghost { width: auto; }
    
    /* breadcrumb */
    .breadcrumb { font-size: 11.5px !important; flex-wrap: wrap; gap: 4px; }
    
    /* 푸터 */
    footer { padding: 32px 0 24px !important; }
    .footer-grid { gap: 24px !important; }
    .footer-brand .logo { font-size: 18px !important; }
}

/* 480px 이하 (작은 모바일) */
@media (max-width: 480px) {
    .container { padding: 0 14px !important; }
    h1 { font-size: clamp(20px, 6vw, 26px) !important; }
    .region-list-grid { grid-template-columns: repeat(2, 1fr) !important; font-size: 12.5px; }
    .region-products-simple { grid-template-columns: repeat(2, 1fr) !important; gap: 6px !important; }
    .region-thumbnail { max-height: 240px !important; }
    .region-thumbnail-overlay { padding: 14px 12px !important; }
    .region-thumbnail-services { font-size: 11px !important; }
    .region-hero-sub-standalone { font-size: 13px !important; }
}

/* 360px 이하 (소형 모바일) */
@media (max-width: 360px) {
    .container { padding: 0 12px !important; }
    .region-stats-grid { grid-template-columns: 1fr !important; }
    .region-list-grid { grid-template-columns: 1fr !important; }
    .region-thumbnail-title { font-size: 19px !important; }
}


/* ============================================================
   📱 짤림 방지 추가 패치 (이미지·텍스트 모두)
   ============================================================ */

/* === 모든 화면 크기에서 짤림 방지 === */
* {
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
}

/* 모든 이미지가 부모 박스 안에 들어오도록 강제 */
img, picture, video, svg, canvas, iframe, embed, object {
    max-width: 100% !important;
    height: auto !important;
    display: block;
}

/* 모든 텍스트 박스가 부모 안에 들어오도록 */
p, h1, h2, h3, h4, h5, h6, span, div, li, a, strong, em, td, th {
    word-wrap: break-word;
    overflow-wrap: break-word;
    min-width: 0;
}

/* 한글 단어가 중간에 안 끊기도록 */
p, h1, h2, h3, h4, li {
    word-break: keep-all;
}

/* 영어·URL·이메일·전화번호 같은 긴 문자열 강제 줄바꿈 */
.long-text, code, pre, .url, a[href^="mailto"], a[href^="tel"], .breadcrumb {
    word-break: break-all;
    overflow-wrap: anywhere;
}

/* 그리드 자식이 부모를 넘는 것 방지 */
[class*="grid"], [class*="flex"] {
    min-width: 0;
}
[class*="grid"] > *, [class*="flex"] > * {
    min-width: 0;
    max-width: 100%;
}

/* 768px 이하에서 추가 짤림 방지 */
@media (max-width: 768px) {
    /* body 내부에서 가로로 넘는 요소 강제 정리 */
    body, html { max-width: 100vw !important; overflow-x: hidden !important; }
    
    /* 컨테이너·박스가 절대 가로폭 안 넘게 */
    .container, .region-box, .region-cta-box, header, footer, section {
        max-width: 100% !important;
        box-sizing: border-box !important;
    }
    
    /* 썸네일 안 텍스트도 wrap */
    .region-thumbnail-title, .region-thumbnail-services, .region-thumbnail-meta {
        max-width: 100% !important;
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        white-space: normal !important;
    }
    
    /* 통계 카드 숫자 폰트 축소 */
    .region-stats-grid .region-stat-num,
    .region-stats-grid .region-stat-value,
    [class*="stat-num"], [class*="stat-value"] {
        font-size: clamp(18px, 5vw, 24px) !important;
        word-break: break-all !important;
    }
    
    /* 표 가로 스크롤 처리 */
    table {
        display: block !important;
        overflow-x: auto !important;
        white-space: nowrap;
    }
    
    /* 긴 동 이름(예: "한국토지주택공사동") 줄바꿈 */
    .region-list-grid a, .region-products-simple a {
        word-break: keep-all !important;
        overflow-wrap: break-word !important;
        line-height: 1.4 !important;
        padding: 8px 6px !important;
        font-size: 12.5px !important;
        text-align: center;
    }
    
    /* 전화번호·CTA 버튼 텍스트가 안 잘리도록 */
    .btn, .nav-cta, button, a[href^="tel"] {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}


/* === 온라인 문의 폼 (모든 페이지 공통) === */
.contact-section {
    padding: 100px 0;
    background: var(--cream-dark);
}
.contact-section .container {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 60px;
    align-items: start;
    max-width: 1140px;
}
.contact-intro {
    position: sticky;
    top: 100px;
}
.contact-intro .cta-label {
    text-align: left;
    font-size: 13px;
    font-weight: 700;
    color: var(--coral);
    letter-spacing: 3px;
    margin-bottom: 16px;
}
.contact-title {
    font-size: clamp(32px, 4vw, 48px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0 0 16px;
}
.contact-sub {
    font-size: 15px;
    color: var(--ink-soft);
    line-height: 1.7;
    margin: 0 0 32px;
}
.contact-direct {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.contact-direct-btn {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 22px;
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 14px;
    transition: all 0.2s;
    text-decoration: none;
    color: inherit;
}
.contact-direct-btn:hover {
    border-color: var(--forest);
    transform: translateX(4px);
}
.contact-direct-btn .cd-icon {
    width: 44px;
    height: 44px;
    background: var(--cream-dark);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
}
.cd-label {
    display: block;
    font-size: 12px;
    color: var(--ink-soft);
    margin-bottom: 2px;
}
.cd-value {
    display: block;
    font-size: 16px;
    font-weight: 700;
    color: var(--ink);
}

/* 문의 폼 박스 */
.contact-form-box {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 40px 36px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}
.contact-form-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 22px;
    font-weight: 800;
    margin: 0 0 28px;
    letter-spacing: -0.01em;
}
.cf-bar {
    width: 4px;
    height: 22px;
    background: var(--coral);
    border-radius: 2px;
}
.contact-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.form-group {
    display: flex;
    flex-direction: column;
}
.form-group label {
    font-size: 13px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 8px;
}
.required {
    color: var(--coral);
}
.form-group input,
.form-group select,
.form-group textarea {
    padding: 14px 16px;
    font-size: 14px;
    font-family: inherit;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: #fafafa;
    color: var(--ink);
    transition: all 0.2s;
    width: 100%;
    box-sizing: border-box;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--forest);
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(45, 74, 62, 0.1);
}
.form-group input::placeholder,
.form-group textarea::placeholder {
    color: #b0b0b0;
}
.form-group textarea {
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
}
.form-group select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23666' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    background-size: 10px;
    padding-right: 40px;
}
.form-agree {
    padding: 16px;
    background: #fafafa;
    border-radius: 10px;
    border: 1px solid var(--border);
}
.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
}
.checkbox-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--forest);
    cursor: pointer;
}
.agree-detail {
    font-size: 11px;
    color: var(--ink-soft);
    margin-top: 8px;
    padding-left: 26px;
    line-height: 1.6;
}
.contact-submit {
    background: var(--ink);
    color: #ffffff;
    border: none;
    padding: 18px 28px;
    font-size: 16px;
    font-weight: 700;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    margin-top: 8px;
}
.contact-submit:hover {
    background: var(--forest);
    transform: translateY(-2px);
}
.contact-submit:disabled {
    background: #999;
    cursor: not-allowed;
    transform: none;
}
.form-message {
    padding: 20px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    display: none;
    margin-top: 16px;
}
.form-message.success {
    display: block;
    background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
    color: #1b5e20;
    border: 2px solid #66bb6a;
    box-shadow: 0 4px 16px rgba(76, 175, 80, 0.2);
    animation: messagePop 0.4s ease;
}
.form-message.error {
    display: block;
    background: linear-gradient(135deg, #ffebee, #ffcdd2);
    color: #b71c1c;
    border: 2px solid #ef5350;
    box-shadow: 0 4px 16px rgba(244, 67, 54, 0.2);
    animation: messagePop 0.4s ease;
}
@keyframes messagePop {
    0% { transform: scale(0.9); opacity: 0; }
    60% { transform: scale(1.02); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}

/* 모바일 */
@media (max-width: 900px) {
    .contact-section .container {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .contact-intro {
        position: static;
        text-align: center;
    }
    .contact-intro .cta-label { text-align: center; }
    .contact-direct-btn { flex-direction: row; text-align: left; }
    .contact-form-box { padding: 28px 24px; }
}

</style>
</head>`;
}

function getHeader() {
  return `<header>
<nav class="nav">
<a href="/" class="logo"><img src="/brand.png" alt="마스터페이" class="logo-mark-img">마스터페이</a>
<ul class="nav-menu" id="navMenu">
<li><a href="/#find-sec">지역별 설치</a></li>
<li><a href="/#allinone">제품 안내</a></li>
<li><a href="/#process">프로세스</a></li>
<li><a href="/#faq">자주 묻는 질문</a></li>
</ul>
<a href="/#contact" class="nav-cta">문의하기</a>
<button class="mobile-toggle" onclick="toggleMenu()">☰</button>
</nav>
</header>`;
}

function getFooter() {
  return `<footer>
<div class="container">
<div class="footer-grid">
<div class="footer-brand">
<div class="logo"><img src="/brand.png" alt="마스터페이" class="logo-mark-img">마스터페이</div>
<p>매장 운영에 필요한 모든 장비<br>설치부터 A/S까지 한번에.</p>
</div>
<div class="footer-col">
<h4>Contact</h4>
<ul>
<li><a href="tel:010-2337-0458">📞 010-2337-0458</a></li>
<li><a href="https://pf.kakao.com/_fPrxbG/chat" target="_blank">💬 카카오톡 상담</a></li>
</ul>
</div>
</div>
<div class="footer-bottom">
<span>© 2026 마스터페이. All rights reserved.</span>
<span>개인정보처리방침 · 이용약관</span>
</div>
</div>
</footer>
<!-- 플로팅 버튼 -->
<div class="floating-buttons">
<a href="javascript:void(0)" class="fab-btn fab-contact" data-tooltip="온라인 문의" onclick="scrollToContact(event)" aria-label="온라인 문의">💬</a>
<a href="javascript:void(0)" class="fab-btn fab-kakao" data-tooltip="카카오톡 상담" onclick="openKakao(); return false;" aria-label="카카오톡 상담">💛</a>
<a href="tel:010-2337-0458" class="fab-btn fab-phone" data-tooltip="전화 상담 010-2337-0458" aria-label="전화 상담">📞</a>
</div>
<script>
function toggleMenu(){document.getElementById('navMenu').classList.toggle('active');}
function openKakao(){
  var kakaoUrl='https://pf.kakao.com/_fPrxbG/chat';
  var win=window.open(kakaoUrl,'_blank');
  if(!win||win.closed||typeof win.closed==='undefined'){window.location.href=kakaoUrl;}
}
function scrollToContact(event){
  if(event)event.preventDefault();
  var contactSection=document.getElementById('contact');
  if(contactSection){
    var top=contactSection.getBoundingClientRect().top+window.pageYOffset-80;
    window.scrollTo({top:top,behavior:'smooth'});
  }else{window.location.href='/#contact';}
}
async function submitContactForm(event){
  if(event){event.preventDefault();event.stopPropagation();}
  var form=document.getElementById('contactForm');
  var submitBtn=document.getElementById('submitBtn');
  var submitText=document.getElementById('submitText');
  var formMessage=document.getElementById('formMessage');
  if(!form){alert('⚠️ 폼을 찾을 수 없습니다.');return false;}
  var agreeCheckbox=document.getElementById('agree');
  if(!agreeCheckbox||!agreeCheckbox.checked){alert('개인정보 수집 및 이용에 동의해주세요.');return false;}
  var name=document.getElementById('name').value.trim();
  var phone=document.getElementById('phone').value.trim();
  var address=document.getElementById('address').value.trim();
  var product=document.getElementById('product').value;
  if(!name){alert('상호(이름)을 입력해주세요.');document.getElementById('name').focus();return false;}
  if(!phone){alert('연락처를 입력해주세요.');document.getElementById('phone').focus();return false;}
  if(!address){alert('주소를 입력해주세요.');document.getElementById('address').focus();return false;}
  if(!product){alert('문의 제품을 선택해주세요.');document.getElementById('product').focus();return false;}
  if(submitBtn)submitBtn.disabled=true;
  if(submitText)submitText.textContent='전송 중...';
  if(formMessage){formMessage.className='form-message';formMessage.style.display='none';}
  var data={name:name,phone:phone,address:address,addressDetail:document.getElementById('address_detail').value.trim(),product:product,business:document.getElementById('business').value,message:document.getElementById('message').value.trim()};
  var result;
  try{
    var response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    result=await response.json();
    if(result.success){
      if(formMessage){formMessage.className='form-message success';formMessage.style.display='block';formMessage.innerHTML='<div style="text-align:center;padding:24px 20px;"><div style="font-size:48px;margin-bottom:12px;">✅</div><div style="font-size:18px;font-weight:800;color:#2e7d32;margin-bottom:8px;">문의가 성공적으로 접수되었습니다!</div><div style="font-size:14px;color:#555;">24시간 이내에 연락드리겠습니다.<br>급하신 경우 <strong>010-2337-0458</strong>로 연락주세요.</div></div>';}
      form.reset();
      setTimeout(function(){if(formMessage)formMessage.scrollIntoView({behavior:'smooth',block:'center'});},100);
    }else{throw new Error(result.error||'전송에 실패했습니다.');}
  }catch(error){
    var errorMsg=error.message||'전송에 실패했습니다';
    if(formMessage){formMessage.className='form-message error';formMessage.style.display='block';formMessage.innerHTML='<div style="text-align:center;padding:20px;"><div style="font-size:40px;margin-bottom:10px;">❌</div><div style="font-size:16px;font-weight:700;margin-bottom:8px;">전송에 실패했습니다</div><div style="font-size:13px;margin-bottom:12px;color:#555;">'+errorMsg+'</div><div style="font-size:14px;margin-top:12px;"><strong>📞 010-2337-0458</strong><br>또는 카카오톡으로 문의해주세요.</div></div>';formMessage.scrollIntoView({behavior:'smooth',block:'center'});}
  }finally{
    if(submitBtn)submitBtn.disabled=false;
    if(submitText)submitText.textContent='무료 상담 신청하기 →';
  }
  return false;
}
</script>
</body></html>`;
}

function getCTA() {
  return `<section class="contact-section" id="contact">
<div class="container">
<div class="contact-intro">
<div class="cta-label">— Contact Us —</div>
<h2 class="contact-title">무료 상담 신청</h2>
<p class="contact-sub">전화, 카카오톡 또는 아래 폼으로 문의해주세요.<br>담당자가 빠르게 연락드립니다.</p>

<div class="contact-direct">
<a href="tel:010-2337-0458" class="contact-direct-btn">
<span class="cd-icon">📞</span>
<span>
<span class="cd-label">전화 상담</span>
<span class="cd-value">010-2337-0458</span>
</span>
</a>
<a href="javascript:void(0)" onclick="openKakao(); return false;" class="contact-direct-btn">
<span class="cd-icon">💬</span>
<span>
<span class="cd-label">카카오톡</span>
<span class="cd-value">바로 상담</span>
</span>
</a>
</div>
</div>

<div class="contact-form-box">
<h3 class="contact-form-title">
<span class="cf-bar"></span>
<span>📝 온라인 문의</span>
</h3>

<form id="contactForm" class="contact-form" onsubmit="return submitContactForm(event)">
<div class="form-group">
<label for="name">상호(이름) <span class="required">*</span></label>
<input type="text" id="name" name="상호_이름" placeholder="상호 또는 이름을 입력하세요" required>
</div>

<div class="form-group">
<label for="phone">연락처 <span class="required">*</span></label>
<input type="tel" id="phone" name="연락처" placeholder="010-0000-0000" required>
</div>

<div class="form-group">
<label for="address">주소 <span class="required">*</span></label>
<input type="text" id="address" name="주소" placeholder="매장 주소를 입력하세요 (예: 서울 강남구 테헤란로 1)" required>
<input type="text" id="address_detail" name="상세주소" placeholder="상세주소 (건물명, 층, 호수 등)" style="margin-top: 8px;">
</div>

<div class="form-group">
<label for="product">문의 제품 <span class="required">*</span></label>
<select id="product" name="문의_제품" required>
<option value="">선택해주세요</option>
<option value="포스기">포스기(POS)</option>
<option value="2인치 단말기">2인치 단말기</option>
<option value="3인치 단말기">3인치 단말기</option>
<option value="토스 단말기">토스 단말기</option>
<option value="무선 단말기">무선 단말기</option>
<option value="블루투스 단말기">블루투스 단말기</option>
<option value="키오스크">키오스크</option>
<option value="미니 키오스크">미니 키오스크</option>
<option value="테이블 오더">테이블 오더</option>
<option value="매장 철거">매장 철거</option>
<option value="여러 제품 패키지">여러 제품 패키지</option>
<option value="기타/미정">기타/미정</option>
</select>
</div>

<div class="form-group">
<label for="business">업종</label>
<select id="business" name="업종">
<option value="">선택해주세요</option>
<option value="음식점/식당">음식점/식당</option>
<option value="카페/베이커리">카페/베이커리</option>
<option value="편의점/마트">편의점/마트</option>
<option value="미용실/네일샵">미용실/네일샵</option>
<option value="스터디카페">스터디카페</option>
<option value="주점/호프">주점/호프</option>
<option value="무인매장">무인매장</option>
<option value="의류/잡화">의류/잡화</option>
<option value="병원/약국">병원/약국</option>
<option value="기타">기타</option>
</select>
</div>

<div class="form-group">
<label for="message">문의 내용</label>
<textarea id="message" name="문의_내용" rows="5" placeholder="매장 위치, 현재 사용 장비, 궁금한 점 등을 자유롭게 적어주세요."></textarea>
</div>

<div class="form-agree">
<label class="checkbox-label">
<input type="checkbox" id="agree" required>
<span>개인정보 수집 및 이용에 동의합니다 <span class="required">*</span></span>
</label>
<div class="agree-detail">수집항목: 상호·연락처·주소·문의 내용 / 이용목적: 상담 및 견적 안내 / 보유기간: 3년</div>
</div>

<button type="submit" class="contact-submit" id="submitBtn">
<span id="submitText">무료 상담 신청하기 →</span>
</button>

<div id="formMessage" class="form-message"></div>
</form>
</div>
</div>
</section>`;
}





// ============================================================
// 공통 헬퍼
// ============================================================

function getSidoStats(sidoName) {
  const seed = hashString(sidoName);
  return {
    shops: 1000 + (seed % 15000),
    installs: 500 + (seed % 10000),
    satisfaction: 95 + (seed % 5)
  };
}

function buildKeywordBox(regionName, productName) {
  // 지역+제품 키워드 박스 (SEO용 8개 키워드)
  // regionName: "경기도" / "경기 수원시" / "경기 수원시 영통구" 등
  // productName: 선택사항. 있으면 지역+제품 키워드, 없으면 지역+일반 키워드
  
  // 지역명에서 공백 제거 (예: "경기 수원시" → "경기수원시")
  const regionKey = regionName.replace(/\s+/g, '');
  
  let keywords;
  if (productName) {
    // 지역×제품 키워드 8개
    const productKey = productName.replace(/\s+/g, '');
    keywords = [
      regionKey + productKey,
      regionKey + productKey + '설치',
      regionKey + productKey + '렌탈',
      regionKey + productKey + '무료',
      regionKey + productKey + '가격',
      regionKey + productKey + '견적',
      regionKey + productKey + '교체',
      regionKey + productKey + '추천'
    ];
  } else {
    // 지역만 키워드 8개
    keywords = [
      regionKey + '카드단말기',
      regionKey + '포스기',
      regionKey + '키오스크',
      regionKey + '단말기',
      regionKey + '결제장비',
      regionKey + '카드기설치',
      regionKey + '결제단말기',
      regionKey + '매장설비'
    ];
  }
  
  return `<div class="region-box keyword-box">
<h2 class="region-box-title">🔍 관련 검색어</h2>
<p class="region-box-subtitle">자주 검색되는 ${regionName}${productName ? ' ' + productName : ''} 관련 키워드입니다.</p>
<div class="keyword-tags">
${keywords.map(k => `<span class="keyword-tag">#${k}</span>`).join('')}
</div>
</div>`;
}

function buildSidoProductsSimpleGrid(sidoUrl) {
  let html = '';
  for (const key in PRODUCTS) {
    const p = PRODUCTS[key];
    const visual = p.img
      ? `<img src="${p.img}" alt="${p.name}" class="ps-img" loading="lazy">`
      : `<div class="ps-icon">${p.emoji}</div>`;
    html += `<a href="/region/${sidoUrl}/${p.url}" class="region-product-simple">
      ${visual}
      <div class="ps-name">${p.name}</div>
    </a>`;
  }
  return html;
}

function buildGuProductsSimpleGrid(sidoUrl, guName) {
  let html = '';
  for (const key in PRODUCTS) {
    const p = PRODUCTS[key];
    const visual = p.img
      ? `<img src="${p.img}" alt="${p.name}" class="ps-img" loading="lazy">`
      : `<div class="ps-icon">${p.emoji}</div>`;
    html += `<a href="/region/${sidoUrl}/${encodeURIComponent(guName)}/${p.url}" class="region-product-simple">
      ${visual}
      <div class="ps-name">${p.name}</div>
    </a>`;
  }
  return html;
}

// ============================================================
// 시도 페이지 (예: /region/seoul)
// ============================================================


// ============================================================
// 페이지별 썸네일 이미지 URL 매핑 (Unsplash 무료 이미지)
// 사람 X, 돈/배경/매장 관련 이미지
// ============================================================

function getThumbnailUrl(productSlug, regionName) {
  // 제품별 매칭 이미지 (Unsplash)
  const images = {
    // 포스기 - 카운터/계산대 분위기
    'pos': 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1200&h=675&fit=crop&q=80',
    // 카드 단말기 - 신용카드 결제
    'card-2inch': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=675&fit=crop&q=80',
    'card-3inch': 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=1200&h=675&fit=crop&q=80',
    'card-toss': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=675&fit=crop&q=80',
    'card-wireless': 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=1200&h=675&fit=crop&q=80',
    'card-bluetooth': 'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=1200&h=675&fit=crop&q=80',
    // 키오스크 - 무인 주문기
    'kiosk': 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&h=675&fit=crop&q=80',
    'kiosk-mini': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=675&fit=crop&q=80',
    // 테이블오더 - 식당/레스토랑
    'tableorder': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=675&fit=crop&q=80',
    // 매장 철거 - 빈 매장/공사 현장
    'removal': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&h=675&fit=crop&q=80',
  };
  
  if (images[productSlug]) return images[productSlug];
  
  // 지역 페이지 (제품 없음) - 사람 없는 매장/도시/거리 분위기 이미지 풀
  // 지역 이름으로 hashString하여 결정론적으로 선택 → 같은 지역은 항상 같은 이미지
  const regionImages = [
    // 식당·바·인테리어
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=675&fit=crop&q=80',
    // 빈 매장·공사 현장
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&h=675&fit=crop&q=80',
    // 카운터·계산대
    'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1200&h=675&fit=crop&q=80',
    // 카드 결제·POS 시스템
    'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=1200&h=675&fit=crop&q=80',
    // 키오스크·무인 매장
    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&h=675&fit=crop&q=80',
  ];
  
  if (regionName) {
    const idx = hashString(regionName) % regionImages.length;
    return regionImages[idx];
  }
  
  return regionImages[0];
}

// 한국 시간 기준 "YYYY년 M월 D일" 문자열 반환 (요청 시점 기준)
function getKstDateString() {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.getUTCFullYear()}년 ${kst.getUTCMonth() + 1}월 ${kst.getUTCDate()}일`;
}

function getThumbnailEmoji(productSlug) {
  const emojis = {
    'pos': '🖥️',
    'card-2inch': '💳',
    'card-3inch': '🖨️',
    'card-toss': '⚡',
    'card-wireless': '📡',
    'card-bluetooth': '📶',
    'kiosk': '🤖',
    'kiosk-mini': '📱',
    'tableorder': '📋',
    'removal': '🔨',
  };
  return emojis[productSlug] || '🏪';
}

function getThumbnailLabel(productSlug) {
  const labels = {
    'pos': '포스기 설치',
    'card-2inch': '2인치 단말기 설치',
    'card-3inch': '3인치 단말기 설치',
    'card-toss': '토스 단말기 설치',
    'card-wireless': '무선 단말기 설치',
    'card-bluetooth': '블루투스 단말기 설치',
    'kiosk': '키오스크 설치',
    'kiosk-mini': '미니 키오스크 설치',
    'tableorder': '테이블오더 설치',
    'removal': '매장 철거',
  };
  return labels[productSlug] || '매장 설비 설치';
}


function buildSidoPage(sidoUrl) {
  const sido = REGIONS[sidoUrl];
  if (!sido) return null;
  
  const ctx = getRegionContext(sido.name);
  const stats = getSidoStats(sido.name);
  const gus = Object.keys(sido.gus);
  const totalDongs = gus.reduce((sum, gu) => sum + sido.gus[gu].length, 0);
  
  let gusListHtml = '';
  for (const gu of gus) {
    const dongCount = sido.gus[gu].length;
    gusListHtml += `<a href="/region/${sidoUrl}/${encodeURIComponent(gu)}" class="region-list-card">
      <div class="region-list-info">
        <div class="region-list-name">📍 ${gu}</div>
        <div class="region-list-desc">${dongCount}개 동 · 설치 가능</div>
      </div>
      <div class="region-list-arrow">→</div>
    </a>`;
  }
  
  let otherSidosHtml = '';
  for (const otherUrl in REGIONS) {
    if (otherUrl !== sidoUrl) {
      otherSidosHtml += `<a href="/region/${otherUrl}" class="region-chip">${REGIONS[otherUrl].name}</a>`;
    }
  }
  
  return getCommonHead(
    `${sido.name} 카드단말기·포스기·키오스크 설치`,
    `${sido.name} 전 지역 ${gus.length}개 시군구 ${totalDongs.toLocaleString()}개 읍면동 카드단말기, 포스기, 키오스크 설치. 설치비 무료·빠른 설치·A/S 보장.`
  ) + `<body>${getHeader()}

<section class="region-hero">
<div class="container">
<div class="breadcrumb">
<a href="/">홈</a>
<span class="breadcrumb-separator">/</span>
<a href="/#find-sec">지역별 설치</a>
<span class="breadcrumb-separator">/</span>
<span>${sido.name}</span>
</div>
<div class="region-thumbnail">
<img src="${getThumbnailUrl(null, sido.name)}" alt="${sido.name} 매장 설비 설치" class="region-thumbnail-img" loading="lazy">
<div class="region-thumbnail-badge">🏪 매장 설비 설치</div>
<div class="region-thumbnail-overlay">
<div class="region-thumbnail-meta">
<span>${getKstDateString()} 기준</span>
<span class="region-thumbnail-dot">·</span>
<span>${sido.name} ${gus.length}개 시군구</span>
<span class="region-thumbnail-dot">·</span>
<span>${totalDongs.toLocaleString()}개 읍면동</span>
</div>
<h1 class="region-thumbnail-title">${sido.name} 설치 전문</h1>
<div class="region-thumbnail-services">카드단말기 · 포스기 · 키오스크 · 테이블오더 · 철거</div>
</div>
</div>
<div class="region-hero-sub-standalone">카드단말기·포스기·키오스크·테이블오더·철거까지 ${sido.name} 전 지역 무료 설치와 빠른 A/S를 지원합니다.</div>
<div class="region-stats-grid">
<div class="region-stat"><div class="region-stat-icon">🏆</div><div class="region-stat-label">${sido.name} 누적</div><div class="region-stat-value">${stats.shops.toLocaleString()}+</div></div>
<div class="region-stat"><div class="region-stat-icon">⚡</div><div class="region-stat-label">빠른 설치</div><div class="region-stat-value">신속</div></div>
<div class="region-stat"><div class="region-stat-icon">💰</div><div class="region-stat-label">설치비</div><div class="region-stat-value">무료</div></div>
<div class="region-stat"><div class="region-stat-icon">🔧</div><div class="region-stat-label">A/S</div><div class="region-stat-value">빠른 대응</div></div>
</div>
<div class="region-cta-box">
<h3>💳 ${sido.name} 무료 견적 받기</h3>
<p>${sido.name} 전 지역 전문가가 책임집니다.</p>
<div class="region-cta-buttons">
<a href="tel:010-2337-0458" class="btn btn-primary">📞 010-2337-0458</a>
<a href="#contact" class="btn btn-ghost" onclick="scrollToContact(event)">💬 상담 문의</a>
</div>
</div>
</div>
</section>

<section class="region-main">
<div class="container">

<!-- 박스 1: 인트로 -->
<div class="region-box">
<div class="region-intro-box">
<div class="region-intro-icon">📋</div>
<div class="region-intro-text">
<strong>설치 진행 방식</strong>
<p>무료 상담 → 매장 환경 분석 → 업종별 최적 장비 추천 → 설치 완료 방식으로 진행됩니다. 업종·매장 크기·예산에 따라 최적의 장비를 함께 결정해 드립니다.</p>
</div>
</div>
</div>

<!-- 박스 2: 왜 마스터페이인가 -->
<div class="region-box">
<h2 class="region-box-title">🏙️ ${sido.name} 설치, 왜 마스터페이일까요?</h2>
<p class="region-box-subtitle">${sido.name}은(는) ${ctx.areaType} 중심으로 ${ctx.topBiz[0]}, ${ctx.topBiz[1]} 등 다양한 업종이 분포한 지역입니다. 마스터페이는 ${sido.name} ${gus.length}개 시군구의 매장 특성을 분석하여 꼭 맞는 장비를 설치합니다.</p>
<div class="region-features-grid">
<div class="region-feature-card"><div class="fi-icon">🎯</div><h3>업종별 맞춤 설치</h3><p>${sido.name} 매장의 업종·규모·동선을 분석해 꼭 맞는 장비를 추천합니다.</p></div>
<div class="region-feature-card"><div class="fi-icon">🏠</div><h3>직접 방문 설치</h3><p>전문 기사가 직접 방문하여 설치·세팅·테스트까지 완료합니다.</p></div>
<div class="region-feature-card"><div class="fi-icon">📈</div><h3>체계적 사후 관리</h3><p>설치 후에도 수수료 재검토, 장비 업그레이드 등 지속 관리를 제공합니다.</p></div>
<div class="region-feature-card"><div class="fi-icon">⚡</div><h3>빠른 설치·A/S</h3><p>상담 후 빠르면 1~2일 내 설치 가능, 장애 시 당일 출동합니다.</p></div>
</div>
</div>

<!-- 박스 3: 제품 -->
<div class="region-box">
<h2 class="region-box-title">🛒 ${sido.name} 설치 가능한 제품</h2>
<p class="region-box-subtitle">제품을 선택하면 ${sido.name} 맞춤 상세 안내로 이동합니다.</p>
<div class="region-products-simple">${buildSidoProductsSimpleGrid(sidoUrl)}</div>
</div>

<!-- 박스 3-2: 제품별 핵심 5줄 -->
<div class="region-box">
<h2 class="region-box-title">📦 ${sido.name} 제품별 안내</h2>
<p class="region-box-subtitle">10가지 제품마다 핵심을 5줄로 요약했습니다.</p>
<div class="region-products-detail-list">${renderRegionProductsDetailList(sido.name)}</div>
</div>

<!-- 박스 4: 특징 (번호) -->
<div class="region-box">
<h2 class="region-box-title">💡 마스터페이만의 특별함</h2>
<div class="region-numbered-grid">
<div class="region-numbered-card"><div class="num-circle">1</div><h3>현장 환경 분석</h3><p>매장 방문 전 업종, 크기, 동선, 네트워크 상태를 파악하고 꼭 맞는 장비 조합을 설계합니다.</p></div>
<div class="region-numbered-card"><div class="num-circle">2</div><h3>패키지 설치 할인</h3><p>카드단말기·포스기·키오스크·테이블오더를 함께 설치하면 설치비 무료 혜택이 적용됩니다.</p></div>
<div class="region-numbered-card"><div class="num-circle">3</div><h3>카카오톡 24시간 상담</h3><p>영업 중 문제가 생기면 언제든 카카오톡으로 문의 가능하며, 원격 지원으로 즉시 해결합니다.</p></div>
<div class="region-numbered-card"><div class="num-circle">4</div><h3>사후 관리 보고</h3><p>설치 후에도 매출 관리, VAN사 수수료 최적화 등 사장님께 투명하게 공유합니다.</p></div>
</div>
</div>

<!-- 박스 5: 추천 업종 -->
<div class="region-box">
<h2 class="region-box-title">🏪 ${sido.name} 추천 업종</h2>
<div class="region-biz-grid">
<div class="region-biz-card"><div class="region-biz-icon">🍽️</div><div class="region-biz-info"><div class="region-biz-name">음식점·식당</div><div class="region-biz-effect">주문 정확도 향상</div></div><div class="region-biz-stars">★★★★★</div></div>
<div class="region-biz-card"><div class="region-biz-icon">☕</div><div class="region-biz-info"><div class="region-biz-name">카페·베이커리</div><div class="region-biz-effect">메뉴 자동화</div></div><div class="region-biz-stars">★★★★★</div></div>
<div class="region-biz-card"><div class="region-biz-icon">🏪</div><div class="region-biz-info"><div class="region-biz-name">편의점·마트</div><div class="region-biz-effect">재고 연동 관리</div></div><div class="region-biz-stars">★★★★</div></div>
<div class="region-biz-card"><div class="region-biz-icon">💇</div><div class="region-biz-info"><div class="region-biz-name">미용실·네일샵</div><div class="region-biz-effect">예약·결제 통합</div></div><div class="region-biz-stars">★★★★</div></div>
<div class="region-biz-card"><div class="region-biz-icon">📚</div><div class="region-biz-info"><div class="region-biz-name">스터디카페</div><div class="region-biz-effect">24시간 무인 운영</div></div><div class="region-biz-stars">★★★★★</div></div>
<div class="region-biz-card"><div class="region-biz-icon">🍻</div><div class="region-biz-info"><div class="region-biz-name">주점·호프집</div><div class="region-biz-effect">테이블 오더 효과</div></div><div class="region-biz-stars">★★★★★</div></div>
</div>
</div>

<!-- 박스 6: FAQ -->
<div class="region-box">
<h2 class="region-box-title">❓ 자주 묻는 질문</h2>
<div class="region-faq-list">
<div class="region-faq-item"><strong>Q. ${sido.name} 어디든 출장 설치가 가능한가요?</strong><p>네, ${sido.name} ${gus.length}개 시군구, ${totalDongs.toLocaleString()}개 읍면동 전 지역 직접 방문 설치를 제공합니다.</p></div>
<div class="region-faq-item"><strong>Q. 설치비가 정말 무료인가요?</strong><p>네, 마스터페이는 VAN사 제휴를 통해 설치비를 전액 지원합니다. 월 이용료도 무료이며, 카드 수수료만 정상 부과됩니다.</p></div>
<div class="region-faq-item"><strong>Q. 기존 장비 교체도 가능한가요?</strong><p>네, 기존 카드단말기·포스기 교체도 무료 견적 후 빠르게 진행됩니다.</p></div>
<div class="region-faq-item"><strong>Q. 여러 장비를 함께 설치하면 할인되나요?</strong><p>네, 여러 장비를 한번에 설치하면 패키지 혜택이 적용됩니다.</p></div>
<div class="region-faq-item"><strong>Q. A/S는 어떻게 받나요?</strong><p>전화 한 통이면 됩니다. 대부분 원격 지원으로 즉시 해결되며, 하드웨어 문제는 ${sido.name} 전역 현장 출동합니다.</p></div>
</div>
</div>

<!-- 박스 7: 시군구 리스트 -->
<div class="region-box">
<h2 class="region-box-title">🏘️ ${sido.name} ${gus.length}개 시군구</h2>
<p class="region-box-subtitle">시군구를 클릭하면 읍면동별 설치 가이드를 확인할 수 있습니다.</p>
<div class="region-list-grid">${gusListHtml}</div>
</div>

${buildKeywordBox(sido.name)}

</div>
</section>

<!-- 박스 8: 온라인 문의 폼 -->
${getCTA()}

<section class="region-main">
<div class="container">

<!-- 박스 9: 다른 시도 -->
<div class="region-box">
<h2 class="region-box-title">🌏 다른 시·도 설치</h2>
<div class="region-chips-grid">${otherSidosHtml}</div>
</div>

</div>
</section>

${getFooter()}`;
}

// ============================================================
// 시도×제품 페이지 (예: /region/incheon/card-3inch)
// ============================================================

function buildSidoProductPage(sidoUrl, productSlug) {
  const sido = REGIONS[sidoUrl];
  if (!sido) return null;
  const product = PRODUCTS[productSlug];
  if (!product) return null;
  
  const ctx = getRegionContext(sido.name + productSlug);
  const stats = getSidoStats(sido.name);
  const gus = Object.keys(sido.gus);
  const totalDongs = gus.reduce((sum, gu) => sum + sido.gus[gu].length, 0);
  
  let gusListHtml = '';
  for (const gu of gus) {
    const dongCount = sido.gus[gu].length;
    gusListHtml += `<a href="/region/${sidoUrl}/${encodeURIComponent(gu)}/${product.url}" class="region-list-card">
      <div class="region-list-info">
        <div class="region-list-name">📍 ${gu}</div>
        <div class="region-list-desc">${dongCount}개 동 · ${product.name}</div>
      </div>
      <div class="region-list-arrow">→</div>
    </a>`;
  }
  
  return getCommonHead(
    productSlug === 'removal'
      ? `${sido.name} 매장 철거 | 무료 견적·원상복구`
      : `${sido.name} ${product.keyword} 설치 | ${product.name}`,
    productSlug === 'removal'
      ? `${sido.name} 매장 철거·원상복구 전문. ${gus.length}개 시군구 ${totalDongs.toLocaleString()}개 읍면동. 무료 견적·전국 최저가·1년 사후 책임.`
      : `${sido.name} ${product.name} 설치 전문. ${gus.length}개 시군구 ${totalDongs.toLocaleString()}개 읍면동. 설치비 무료·빠른 설치·A/S 보장.`
  ) + `<body>${getHeader()}

<section class="region-hero">
<div class="container">
<div class="breadcrumb">
<a href="/">홈</a>
<span class="breadcrumb-separator">/</span>
<a href="/region/${sidoUrl}">${sido.name}</a>
<span class="breadcrumb-separator">/</span>
<span>${product.name}</span>
</div>
<div class="region-thumbnail">
<img src="${getThumbnailUrl(productSlug, sido.name)}" alt="${sido.name} ${product.name}" class="region-thumbnail-img" loading="lazy">
<div class="region-thumbnail-badge">${getThumbnailEmoji(productSlug)} ${getThumbnailLabel(productSlug)}</div>
<div class="region-thumbnail-overlay">
<div class="region-thumbnail-meta">
<span>${getKstDateString()} 기준</span>
<span class="region-thumbnail-dot">·</span>
<span>${sido.name} 전 지역</span>
<span class="region-thumbnail-dot">·</span>
<span>${productSlug === 'removal' ? '무료 견적' : '무료 설치'}</span>
</div>
<h1 class="region-thumbnail-title">${sido.name} ${product.name}${productSlug === "removal" ? "" : " 설치"}</h1>
<div class="region-thumbnail-services">${product.desc} · 전문가 직접 방문 · 빠른 A/S 보장</div>
</div>
</div>
<div class="region-hero-sub-standalone">${productSlug === 'removal' ? `${sido.name} 전 지역 ${gus.length}개 시군구, ${totalDongs.toLocaleString()}개 읍면동 매장 철거·원상복구 전문. 무료 견적과 1년 사후 책임을 약속합니다.` : `${sido.name} 전 지역 ${gus.length}개 시군구, ${totalDongs.toLocaleString()}개 읍면동 ${product.name} 무료 설치와 빠른 A/S를 지원합니다.`}</div>
<div class="region-stats-grid">
${productSlug === 'removal'
? `<div class="region-stat"><div class="region-stat-icon">🏆</div><div class="region-stat-label">${sido.name} 누적</div><div class="region-stat-value">${stats.shops.toLocaleString()}+</div></div>
<div class="region-stat"><div class="region-stat-icon">📋</div><div class="region-stat-label">방문 견적</div><div class="region-stat-value">무료</div></div>
<div class="region-stat"><div class="region-stat-icon">💰</div><div class="region-stat-label">전국 최저가</div><div class="region-stat-value">보증</div></div>
<div class="region-stat"><div class="region-stat-icon">🛡️</div><div class="region-stat-label">사후 책임</div><div class="region-stat-value">1년</div></div>`
: `<div class="region-stat"><div class="region-stat-icon">🏆</div><div class="region-stat-label">${sido.name} 누적</div><div class="region-stat-value">${stats.shops.toLocaleString()}+</div></div>
<div class="region-stat"><div class="region-stat-icon">⚡</div><div class="region-stat-label">빠른 설치</div><div class="region-stat-value">신속</div></div>
<div class="region-stat"><div class="region-stat-icon">💰</div><div class="region-stat-label">설치비</div><div class="region-stat-value">무료</div></div>
<div class="region-stat"><div class="region-stat-icon">🔧</div><div class="region-stat-label">A/S</div><div class="region-stat-value">빠른 대응</div></div>`}
</div>
<div class="region-cta-box">
<h3>💳 ${sido.name} 무료 견적 받기</h3>
<p>${sido.name} 전 지역 전문가가 책임집니다.</p>
<div class="region-cta-buttons">
<a href="tel:010-2337-0458" class="btn btn-primary">📞 010-2337-0458</a>
<a href="#contact" class="btn btn-ghost" onclick="scrollToContact(event)">💬 상담 문의</a>
</div>
</div>
</div>
</section>

<section class="region-main">
<div class="container">

${renderRegionProductBody(buildRegionProductData(sido.name, productSlug))}

<!-- 박스 7: 시군구 리스트 -->
<div class="region-box">
<h2 class="region-box-title">🏘️ ${sido.name} ${gus.length}개 시군구</h2>
<p class="region-box-subtitle">${productSlug === 'removal' ? `시군구를 클릭하면 해당 지역 매장 철거 상세 안내와 동 목록을 확인할 수 있습니다.` : `시군구를 클릭하면 해당 지역 ${product.name} 상세 안내와 동 목록을 확인할 수 있습니다.`}</p>
<div class="region-list-grid">${gusListHtml}</div>
</div>

${buildKeywordBox(sido.name, product.name)}

</div>
</section>

${getCTA()}

${getFooter()}`;
}

// ============================================================
// 시군구 페이지 (예: /region/seoul/강남구)
// ============================================================

function buildGuPage(sidoUrl, guName) {
  const sido = REGIONS[sidoUrl];
  if (!sido) return null;
  const dongs = sido.gus[guName];
  if (!dongs) return null;
  
  const ctx = getRegionContext(sido.name + guName);
  const seed = hashString(sido.name + guName);
  const shops = 100 + (seed % 1500);
  
  let dongsListHtml = '';
  for (const dong of dongs) {
    dongsListHtml += `<a href="/region/${sidoUrl}/${encodeURIComponent(guName)}/${encodeURIComponent(dong)}" class="region-list-card">
      <div class="region-list-info">
        <div class="region-list-name">🏘️ ${dong}</div>
        <div class="region-list-desc">${guName} · 설치 가능</div>
      </div>
      <div class="region-list-arrow">→</div>
    </a>`;
  }
  
  return getCommonHead(
    `${sido.name} ${guName} 카드단말기·포스기·키오스크 설치`,
    `${sido.name} ${guName} ${dongs.length}개 동 전체 카드단말기, 포스기, 키오스크 설치. 설치비 무료·빠른 설치·A/S 보장.`
  ) + `<body>${getHeader()}

<section class="region-hero">
<div class="container">
<div class="breadcrumb">
<a href="/">홈</a>
<span class="breadcrumb-separator">/</span>
<a href="/region/${sidoUrl}">${sido.name}</a>
<span class="breadcrumb-separator">/</span>
<span>${guName}</span>
</div>
<div class="region-thumbnail">
<img src="${getThumbnailUrl(null, sido.name + ' ' + guName)}" alt="${sido.name} ${guName} 매장 설비 설치" class="region-thumbnail-img" loading="lazy">
<div class="region-thumbnail-badge">🏪 매장 설비 설치</div>
<div class="region-thumbnail-overlay">
<div class="region-thumbnail-meta">
<span>${getKstDateString()} 기준</span>
<span class="region-thumbnail-dot">·</span>
<span>${sido.name} ${guName}</span>
<span class="region-thumbnail-dot">·</span>
<span>${dongs.length}개 동</span>
</div>
<h1 class="region-thumbnail-title">${getShortSidoName(sido.name)} ${guName} 설치 전문</h1>
<div class="region-thumbnail-services">카드단말기 · 포스기 · 키오스크 · 테이블오더 · 철거</div>
</div>
</div>
<div class="region-hero-sub-standalone">${sido.name} ${guName} ${dongs.length}개 동 전 지역 전문 설치. 설치비 무료, 당일 상담, 빠른 A/S를 지원합니다.</div>
<div class="region-stats-grid">
<div class="region-stat"><div class="region-stat-icon">📍</div><div class="region-stat-label">${sido.name} ${guName}</div><div class="region-stat-value">${dongs.length}개 동</div></div>
<div class="region-stat"><div class="region-stat-icon">🏆</div><div class="region-stat-label">실적</div><div class="region-stat-value">${shops.toLocaleString()}+</div></div>
<div class="region-stat"><div class="region-stat-icon">⚡</div><div class="region-stat-label">출동</div><div class="region-stat-value">당일</div></div>
<div class="region-stat"><div class="region-stat-icon">💰</div><div class="region-stat-label">설치비</div><div class="region-stat-value">무료</div></div>
</div>
<div class="region-cta-box">
<h3>💳 ${sido.name} 무료 견적 받기</h3>
<p>${sido.name} 전 지역 전문가가 책임집니다.</p>
<div class="region-cta-buttons">
<a href="tel:010-2337-0458" class="btn btn-primary">📞 010-2337-0458</a>
<a href="#contact" class="btn btn-ghost" onclick="scrollToContact(event)">💬 상담 문의</a>
</div>
</div>
</div>
</section>

<section class="region-main">
<div class="container">

<div class="region-box">
<div class="region-intro-box">
<div class="region-intro-icon">📋</div>
<div class="region-intro-text">
<strong>${sido.name} ${guName} 설치 진행 방식</strong>
<p>무료 상담 → ${sido.name} ${guName} 매장 방문 → 업종별 최적 장비 추천 → 설치·교육 완료 방식으로 진행됩니다. ${ctx.areaType} 특성과 업종에 맞는 장비를 함께 결정해 드립니다.</p>
</div>
</div>
</div>

<div class="region-box">
<h2 class="region-box-title">🏙️ ${sido.name} ${guName} 설치, 왜 마스터페이일까요?</h2>
<p class="region-box-subtitle">${sido.name} ${guName}은(는) ${ctx.areaType} 특성이 강한 지역으로, ${ctx.topBiz[0]}, ${ctx.topBiz[1]} 업종이 특히 활발합니다. ${guName} ${dongs.length}개 동 전역에 ${shops.toLocaleString()}+ 매장이 마스터페이 장비를 이용하고 있습니다.</p>
<div class="region-features-grid">
<div class="region-feature-card"><div class="fi-icon">📍</div><h3>${guName} 전담팀</h3><p>${guName} ${dongs.length}개 동을 전담하는 현지 설치팀이 빠르게 대응합니다.</p></div>
<div class="region-feature-card"><div class="fi-icon">⚡</div><h3>당일 긴급 출동</h3><p>${guName} 내 긴급 A/S 요청 시 평균 2시간 내 도착합니다.</p></div>
<div class="region-feature-card"><div class="fi-icon">🎯</div><h3>업종 맞춤 설치</h3><p>${ctx.topBiz[0]}, ${ctx.topBiz[1]} 특성에 최적화된 장비 추천.</p></div>
<div class="region-feature-card"><div class="fi-icon">🏆</div><h3>${shops.toLocaleString()}+ 실적</h3><p>${guName}에서만 ${shops.toLocaleString()}건 이상 설치 실적 보유.</p></div>
</div>
</div>

<div class="region-box">
<h2 class="region-box-title">🛒 ${guName} 설치 가능 제품</h2>
<p class="region-box-subtitle">제품을 선택하면 ${guName} 동별 상세 설치 정보로 이동합니다.</p>
<div class="region-products-simple">${buildGuProductsSimpleGrid(sidoUrl, guName)}</div>
</div>

<div class="region-box">
<h2 class="region-box-title">📦 ${sido.name} ${guName} 제품별 안내</h2>
<p class="region-box-subtitle">10가지 제품마다 핵심을 5줄로 요약했습니다.</p>
<div class="region-products-detail-list">${renderRegionProductsDetailList(sido.name + ' ' + guName)}</div>
</div>

<div class="region-box">
<h2 class="region-box-title">💬 ${sido.name} ${guName} 실제 후기</h2>
<div class="region-reviews-grid">
<div class="region-review"><div class="region-review-stars">★★★★★</div><p>"${ctx.review.text}"</p><div class="region-review-author">— ${guName} ${ctx.review.biz} ${ctx.review.name}</div></div>
<div class="region-review"><div class="region-review-stars">★★★★★</div><p>"${ctx.review2.text}"</p><div class="region-review-author">— ${guName} ${ctx.review2.biz} ${ctx.review2.name}</div></div>
</div>
</div>

<div class="region-box">
<h2 class="region-box-title">❓ 자주 묻는 질문</h2>
<div class="region-faq-list">
<div class="region-faq-item"><strong>Q. ${guName} 어느 동이든 설치 가능한가요?</strong><p>네, ${guName} 내 ${dongs.length}개 동 모두 직접 방문 설치 가능합니다.</p></div>
<div class="region-faq-item"><strong>Q. ${guName} 설치까지 얼마나 걸리나요?</strong><p>상담 후 ${ctx.installTime}~${ctx.installTime+2}일 이내 설치 완료됩니다.</p></div>
<div class="region-faq-item"><strong>Q. ${guName} 긴급 A/S도 빠른가요?</strong><p>${guName} 전담 A/S 인력이 배치되어 있어 평균 2시간 내 출동 가능합니다.</p></div>
<div class="region-faq-item"><strong>Q. 기존 장비 교체도 가능한가요?</strong><p>네, ${guName} 지역도 기존 장비 교체 무료 서비스를 제공합니다.</p></div>
</div>
</div>

<div class="region-box">
<h2 class="region-box-title">🏘️ ${sido.name} ${guName} ${dongs.length}개 동</h2>
<p class="region-box-subtitle">동을 선택하면 해당 지역 맞춤 설치 가이드로 이동합니다.</p>
<div class="region-list-grid">${dongsListHtml}</div>
</div>

${buildKeywordBox(getShortSidoName(sido.name) + ' ' + guName)}

</div>
</section>

${getCTA()}

${getFooter()}`;
}

// ============================================================
// 시군구×제품 페이지 (예: /region/incheon/중구/card-3inch)
// ============================================================

function buildGuProductPage(sidoUrl, guName, productSlug) {
  const sido = REGIONS[sidoUrl];
  if (!sido) return null;
  const dongs = sido.gus[guName];
  if (!dongs) return null;
  const product = PRODUCTS[productSlug];
  if (!product) return null;
  
  const ctx = getRegionContext(sido.name + guName + productSlug);
  const seed = hashString(sido.name + guName + productSlug);
  const shops = 50 + (seed % 500);
  
  let dongsListHtml = '';
  for (const dong of dongs) {
    dongsListHtml += `<a href="/region/${sidoUrl}/${encodeURIComponent(guName)}/${encodeURIComponent(dong)}/${product.url}" class="region-list-card">
      <div class="region-list-info">
        <div class="region-list-name">🏘️ ${dong}</div>
        <div class="region-list-desc">${productSlug === 'removal' ? '매장 철거 가능' : `${product.name} 설치 가능`}</div>
      </div>
      <div class="region-list-arrow">→</div>
    </a>`;
  }
  
  return getCommonHead(
    productSlug === 'removal'
      ? `${sido.name} ${guName} 매장 철거 | 무료 견적·원상복구`
      : `${sido.name} ${guName} ${product.keyword} 설치 | ${product.name}`,
    productSlug === 'removal'
      ? `${sido.name} ${guName} ${dongs.length}개 동 전체 매장 철거·원상복구 전문. 무료 견적·전국 최저가·1년 사후 책임.`
      : `${sido.name} ${guName} ${dongs.length}개 동 전체 ${product.name} 설치. 설치비 무료·빠른 설치·A/S 보장.`
  ) + `<body>${getHeader()}

<section class="region-hero">
<div class="container">
<div class="breadcrumb">
<a href="/">홈</a>
<span class="breadcrumb-separator">/</span>
<a href="/region/${sidoUrl}">${sido.name}</a>
<span class="breadcrumb-separator">/</span>
<a href="/region/${sidoUrl}/${encodeURIComponent(guName)}">${guName}</a>
<span class="breadcrumb-separator">/</span>
<span>${product.name}</span>
</div>
<div class="region-thumbnail">
<img src="${getThumbnailUrl(productSlug, sido.name + ' ' + guName)}" alt="${sido.name} ${guName} ${product.name}" class="region-thumbnail-img" loading="lazy">
<div class="region-thumbnail-badge">${getThumbnailEmoji(productSlug)} ${getThumbnailLabel(productSlug)}</div>
<div class="region-thumbnail-overlay">
<div class="region-thumbnail-meta">
<span>${getKstDateString()} 기준</span>
<span class="region-thumbnail-dot">·</span>
<span>${sido.name} ${guName}</span>
<span class="region-thumbnail-dot">·</span>
<span>${productSlug === 'removal' ? '무료 견적' : '무료 설치'}</span>
</div>
<h1 class="region-thumbnail-title">${getShortSidoName(sido.name)} ${guName} ${product.name}${productSlug === "removal" ? "" : " 설치"}</h1>
<div class="region-thumbnail-services">${product.desc} · 전문가 직접 방문 · 빠른 A/S 보장</div>
</div>
</div>
<div class="region-hero-sub-standalone">${productSlug === 'removal' ? `${sido.name} ${guName} ${dongs.length}개 동 전 지역 매장 철거·원상복구 전문. 무료 견적, 1년 사후 책임, 지역 전담팀이 책임집니다.` : `${sido.name} ${guName} ${dongs.length}개 동 전 지역 ${product.name} 설치. 설치비 무료, 빠른 A/S, 지역 전담팀이 책임집니다.`}</div>
<div class="region-stats-grid">
${productSlug === 'removal'
? `<div class="region-stat"><div class="region-stat-icon">${product.emoji}</div><div class="region-stat-label">${sido.name} ${guName}</div><div class="region-stat-value">전문</div></div>
<div class="region-stat"><div class="region-stat-icon">🏆</div><div class="region-stat-label">실적</div><div class="region-stat-value">${shops.toLocaleString()}+</div></div>
<div class="region-stat"><div class="region-stat-icon">📋</div><div class="region-stat-label">방문 견적</div><div class="region-stat-value">무료</div></div>
<div class="region-stat"><div class="region-stat-icon">🛡️</div><div class="region-stat-label">사후 책임</div><div class="region-stat-value">1년</div></div>`
: `<div class="region-stat"><div class="region-stat-icon">${product.emoji}</div><div class="region-stat-label">${sido.name} ${guName}</div><div class="region-stat-value">전문</div></div>
<div class="region-stat"><div class="region-stat-icon">🏆</div><div class="region-stat-label">실적</div><div class="region-stat-value">${shops.toLocaleString()}+</div></div>
<div class="region-stat"><div class="region-stat-icon">⚡</div><div class="region-stat-label">설치</div><div class="region-stat-value">${ctx.installTime}~${ctx.installTime+2}일</div></div>
<div class="region-stat"><div class="region-stat-icon">💰</div><div class="region-stat-label">설치비</div><div class="region-stat-value">무료</div></div>`}
</div>
<div class="region-cta-box">
<h3>💳 ${sido.name} 무료 견적 받기</h3>
<p>${sido.name} 전 지역 전문가가 책임집니다.</p>
<div class="region-cta-buttons">
<a href="tel:010-2337-0458" class="btn btn-primary">📞 010-2337-0458</a>
<a href="#contact" class="btn btn-ghost" onclick="scrollToContact(event)">💬 상담 문의</a>
</div>
</div>
</div>
</section>

<section class="region-main">
<div class="container">

${renderRegionProductBody(buildRegionProductData(sido.name + ' ' + guName, productSlug))}

<div class="region-box">
<h2 class="region-box-title">🏘️ ${sido.name} ${guName} ${dongs.length}개 동</h2>
<p class="region-box-subtitle">${productSlug === 'removal' ? `동을 선택하면 해당 지역의 매장 철거 맞춤 상세 정보로 이동합니다.` : `동을 선택하면 해당 지역의 ${product.name} 맞춤 상세 정보로 이동합니다.`}</p>
<div class="region-list-grid">${dongsListHtml}</div>
</div>

${buildKeywordBox(getShortSidoName(sido.name) + ' ' + guName, product.name)}

</div>
</section>

${getCTA()}

${getFooter()}`;
}

// ============================================================
// 동 페이지 (예: /region/seoul/강남구/역삼동)
// ============================================================

function buildDongPage(sidoUrl, guName, dongName) {
  const sido = REGIONS[sidoUrl];
  if (!sido) return null;
  const dongs = sido.gus[guName];
  if (!dongs || !dongs.includes(dongName)) return null;
  
  const ctx = getRegionContext(sido.name + guName + dongName);
  const fullAddr = `${sido.name} ${guName} ${dongName}`;
  const seed = hashString(fullAddr);
  const shops = 30 + (seed % 300);
  
  let productsHtml = '';
  for (const key in PRODUCTS) {
    const p = PRODUCTS[key];
    const visual = p.img
      ? `<img src="${p.img}" alt="${p.name}" class="ps-img" loading="lazy">`
      : `<div class="ps-icon">${p.emoji}</div>`;
    productsHtml += `<a href="/region/${sidoUrl}/${encodeURIComponent(guName)}/${encodeURIComponent(dongName)}/${p.url}" class="region-product-simple">
      ${visual}
      <div class="ps-name">${p.name}</div>
    </a>`;
  }
  
  return getCommonHead(
    `${sido.name} ${guName} ${dongName} 카드단말기·포스기·키오스크 설치`,
    `${fullAddr} 카드단말기, 포스기, 키오스크 설치. 무료 상담, 빠른 설치, A/S 보장.`
  ) + `<body>${getHeader()}

<section class="region-hero">
<div class="container">
<div class="breadcrumb">
<a href="/">홈</a>
<span class="breadcrumb-separator">/</span>
<a href="/region/${sidoUrl}">${sido.name}</a>
<span class="breadcrumb-separator">/</span>
<a href="/region/${sidoUrl}/${encodeURIComponent(guName)}">${guName}</a>
<span class="breadcrumb-separator">/</span>
<span>${dongName}</span>
</div>
<div class="region-thumbnail">
<img src="${getThumbnailUrl(null, fullAddr)}" alt="${fullAddr} 매장 설비 설치" class="region-thumbnail-img" loading="lazy">
<div class="region-thumbnail-badge">🏪 매장 설비 설치</div>
<div class="region-thumbnail-overlay">
<div class="region-thumbnail-meta">
<span>${getKstDateString()} 기준</span>
<span class="region-thumbnail-dot">·</span>
<span>${fullAddr}</span>
<span class="region-thumbnail-dot">·</span>
<span>무료 설치</span>
</div>
<h1 class="region-thumbnail-title">${getShortSidoName(sido.name)} ${guName} ${dongName} 설치 전문</h1>
<div class="region-thumbnail-services">카드단말기 · 포스기 · 키오스크 · 테이블오더 · 철거</div>
</div>
</div>
<div class="region-hero-sub-standalone">${fullAddr} 지역 전문 설치. 설치비 무료, 당일 상담, 빠른 A/S를 지원합니다.</div>
<div class="region-stats-grid">
<div class="region-stat"><div class="region-stat-icon">📍</div><div class="region-stat-label">${guName} ${dongName}</div><div class="region-stat-value">${shops}+건</div></div>
<div class="region-stat"><div class="region-stat-icon">⚡</div><div class="region-stat-label">설치</div><div class="region-stat-value">${ctx.installTime}~${ctx.installTime+2}일</div></div>
<div class="region-stat"><div class="region-stat-icon">💰</div><div class="region-stat-label">설치비</div><div class="region-stat-value">무료</div></div>
<div class="region-stat"><div class="region-stat-icon">🔧</div><div class="region-stat-label">A/S</div><div class="region-stat-value">즉시</div></div>
</div>
<div class="region-cta-box">
<h3>💳 ${sido.name} 무료 견적 받기</h3>
<p>${sido.name} 전 지역 전문가가 책임집니다.</p>
<div class="region-cta-buttons">
<a href="tel:010-2337-0458" class="btn btn-primary">📞 010-2337-0458</a>
<a href="#contact" class="btn btn-ghost" onclick="scrollToContact(event)">💬 상담 문의</a>
</div>
</div>
</div>
</section>

<section class="region-main">
<div class="container">

<div class="region-box">
<div class="region-intro-box">
<div class="region-intro-icon">🏘️</div>
<div class="region-intro-text">
<strong>${sido.name} ${guName} ${dongName} 상권 특성</strong>
<p>${fullAddr}은(는) ${ctx.areaType} 성격이 두드러지는 지역으로, ${ctx.topBiz[0]}와(과) ${ctx.topBiz[1]} 업종이 활발합니다. ${ctx.keyBenefit}이(가) 매장 운영의 핵심 요소로 작용합니다.</p>
</div>
</div>
</div>

<div class="region-box">
<h2 class="region-box-title">⚡ ${sido.name} ${guName} ${dongName} 설치 특징</h2>
<div class="region-features-grid">
<div class="region-feature-card"><div class="fi-icon">📍</div><h3>${dongName} 현지 설치</h3><p>${dongName} 담당 기사가 직접 방문 설치합니다.</p></div>
<div class="region-feature-card"><div class="fi-icon">⚡</div><h3>${ctx.installTime}~${ctx.installTime+2}일 설치</h3><p>상담 후 빠른 일정으로 설치 완료됩니다.</p></div>
<div class="region-feature-card"><div class="fi-icon">💰</div><h3>무료 견적</h3><p>${dongName} 매장 환경 분석 후 무료 견적 제공.</p></div>
<div class="region-feature-card"><div class="fi-icon">🔧</div><h3>긴급 A/S</h3><p>${guName} 전역 긴급 출동 서비스 지원.</p></div>
</div>
</div>

<div class="region-box">
<h2 class="region-box-title">🛒 ${sido.name} ${guName} ${dongName} 설치 가능 제품</h2>
<p class="region-box-subtitle">제품을 선택하면 ${dongName} 맞춤 설치 정보로 이동합니다.</p>
<div class="region-products-simple">${productsHtml}</div>
</div>

<div class="region-box">
<h2 class="region-box-title">📦 ${sido.name} ${guName} ${dongName} 제품별 안내</h2>
<p class="region-box-subtitle">10가지 제품마다 핵심을 5줄로 요약했습니다.</p>
<div class="region-products-detail-list">${renderRegionProductsDetailList(sido.name + ' ' + guName + ' ' + dongName)}</div>
</div>

<div class="region-box">
<h2 class="region-box-title">💬 ${sido.name} ${guName} ${dongName} 사장님 후기</h2>
<div class="region-reviews-grid">
<div class="region-review"><div class="region-review-stars">★★★★★</div><p>"${ctx.review.text}"</p><div class="region-review-author">— ${dongName} ${ctx.review.biz} ${ctx.review.name}</div></div>
<div class="region-review"><div class="region-review-stars">★★★★★</div><p>"${ctx.review2.text}"</p><div class="region-review-author">— ${dongName} ${ctx.review2.biz} ${ctx.review2.name}</div></div>
</div>
</div>

<div class="region-box">
<h2 class="region-box-title">❓ 자주 묻는 질문</h2>
<div class="region-faq-list">
<div class="region-faq-item"><strong>Q. ${dongName}도 설치 가능한가요?</strong><p>네, ${dongName}은(는) ${guName} 설치 권역에 포함되어 있어 빠른 방문이 가능합니다.</p></div>
<div class="region-faq-item"><strong>Q. ${dongName} 설치 비용은 얼마인가요?</strong><p>${dongName} 지역도 설치비 무료 옵션을 제공합니다.</p></div>
<div class="region-faq-item"><strong>Q. ${dongName} 긴급 A/S도 가능한가요?</strong><p>${dongName}을 포함한 ${guName} 전역 당일 긴급 A/S 출동 서비스를 제공합니다.</p></div>
</div>
</div>

${buildKeywordBox(getShortSidoName(sido.name) + ' ' + guName + ' ' + dongName)}

</div>
</section>

${getCTA()}

${getFooter()}`;
}


// ============================================================
// 동×제품 페이지용 제품별 맞춤 상세 콘텐츠 (2000자+)
// ============================================================

function getProductDetailContent(productSlug, sidoName, guName, dongName, ctx) {
  const fullAddr = sidoName + ' ' + guName + ' ' + dongName;
  
  const contents = {
    'pos': `
<div class="region-box">
<h2 class="region-box-title">📊 ${fullAddr} 포스기 상세 가이드</h2>
<h3>${dongName} 매장에 포스기가 꼭 필요한 5가지 이유</h3>
<p>${ctx.areaType} 특성이 강한 ${fullAddr} 일대는 ${ctx.topBiz[0]}와(과) ${ctx.topBiz[1]} 업종의 매장이 밀집해 있어, 빠르고 정확한 매출 관리가 매장 경쟁력의 핵심입니다. 포스기는 단순히 결제하는 도구가 아니라 매장 운영의 두뇌 역할을 하는 통합 시스템입니다. 마스터페이가 ${dongName} 사장님들께 포스기를 권해드리는 이유는 다음과 같습니다.</p>
<p><strong>첫째, 매출 통합 관리.</strong> 포스기 한 대로 카드결제·현금결제·간편결제·테이블별 매출·시간대별 매출까지 모두 자동 집계됩니다. ${dongName} 매장이 ${ctx.topBiz[0]} 업종이라면 매일 마감 정산 시간을 절반 이하로 줄일 수 있습니다.</p>
<p><strong>둘째, 재고 자동 차감.</strong> 메뉴를 등록해두면 판매할 때마다 재고가 자동으로 차감되어, ${dongName} 같이 회전율이 높은 상권에서는 재료 소진 시점을 정확히 파악할 수 있습니다. 식자재·소모품 발주 타이밍을 놓치지 않게 됩니다.</p>
<p><strong>셋째, 직원 관리 통합.</strong> 직원별 로그인 기능으로 누가 언제 어떤 결제를 처리했는지 모두 기록되며, 출퇴근 관리도 함께 가능합니다. ${guName} 같이 인건비 부담이 큰 지역에서는 인력 효율을 극대화할 수 있습니다.</p>
<p><strong>넷째, 부가세·종합소득세 신고 자동화.</strong> 국세청 홈택스와 자동 연동되어, ${dongName} 사장님들이 직접 매출 정리할 필요 없이 신고 자료가 자동 생성됩니다. 세무사 비용도 절감됩니다.</p>
<p><strong>다섯째, 24시간 데이터 백업.</strong> 클라우드 자동 백업으로 ${dongName} 매장의 모든 데이터가 안전하게 보관되며, 갑작스러운 정전·기기 고장에도 매출 정보가 사라지지 않습니다.</p>
<h3>${fullAddr}에 추천하는 포스기 모델</h3>
<p>${ctx.topBiz[0]} 업종은 일반적으로 15.6인치 터치스크린 모델이 적합합니다. 화면이 커서 메뉴 추가가 쉽고, 키친 프린터·번호표 출력기·카드단말기 등 다양한 주변 기기를 동시에 연결할 수 있습니다. ${ctx.topBiz[1]} 업종은 11~13인치 컴팩트 모델로도 충분합니다. 매장 면적이 작은 ${dongName} 일대 매장이라면 카운터 공간을 최대한 효율적으로 사용할 수 있습니다.</p>
<p>마스터페이는 ${fullAddr}에서 다양한 포스기 브랜드(OKPOS, 솔루엠, 빌포스 등)를 직접 비교 견적해드리며, ${ctx.topBiz[0]} 업종에 최적화된 메뉴 템플릿까지 무료로 세팅해 드립니다. 설치 후 1주일 동안 ${dongName} 전담 기사가 직접 매장을 방문하거나 원격 지원으로 사용법을 알려드리고, 6개월 무상 A/S와 1년 동안 정기 점검까지 포함됩니다.</p>
<h3>${dongName} 포스기 도입 절차</h3>
<p>전화 또는 카카오톡으로 상담을 신청하시면 ${dongName} 담당 매니저가 매장에 직접 방문해 매장 환경(인터넷·전기·동선)을 점검하고, 업종에 맞는 모델 2~3종을 비교해드립니다. 결정 후 ${ctx.installTime}~${ctx.installTime+2}일 이내에 설치가 완료되며, 운영 중인 매장이라면 영업 종료 후 야간 설치도 가능합니다. 설치 비용은 무료이며, VAN사 수수료만 정상 부과됩니다.</p>
</div>
`,

    'card-2inch': `
<div class="region-box">
<h2 class="region-box-title">💳 ${fullAddr} 2인치 카드단말기 상세 가이드</h2>
<h3>${dongName} 매장에 2인치 단말기가 적합한 이유</h3>
<p>2인치 카드단말기는 영수증 폭이 좁고 본체 크기가 작아, 카운터 공간이 제한적이거나 사장님이 직접 결제 받는 1인 매장에 가장 적합한 모델입니다. ${ctx.areaType} 성격이 강한 ${fullAddr} 일대는 작은 평수의 매장이 많고, 이런 매장에서는 큰 단말기보다 컴팩트한 2인치 모델이 공간 효율 면에서 우수합니다.</p>
<p><strong>2인치 단말기의 장점</strong></p>
<p><strong>① 작은 사이즈, 큰 효과.</strong> 가로 7cm 정도의 본체 크기로 어디든 둘 수 있고, 가벼워서 이동 결제도 가능합니다. ${dongName} 매장에서 카운터가 좁다면 2인치가 정답입니다.</p>
<p><strong>② 영수증 비용 절감.</strong> 영수증 용지 폭이 좁아 일반 3인치 모델 대비 용지 비용이 약 30% 절감됩니다. ${ctx.topBiz[0]}처럼 결제 횟수가 많은 업종은 연간 수십만 원의 영수증 용지 비용을 아낄 수 있습니다.</p>
<p><strong>③ 빠른 결제 속도.</strong> 신형 2인치 단말기(KIS-2200 등)는 IC카드·MS카드·삼성페이·LG페이·애플페이까지 한 대로 모두 처리하며, 결제 처리 속도가 평균 1.5초 이내입니다.</p>
<p><strong>④ 무선 모델 선택 가능.</strong> Wi-Fi 또는 LTE 모델을 선택하면 매장 어디서든 결제가 가능해, ${dongName} 일대 ${ctx.topBiz[1]} 업종(테이블 결제, 출장 결제)에 특히 유리합니다.</p>
<h3>${fullAddr}에서 자주 받는 질문</h3>
<p><strong>Q. 2인치 단말기로 영수증이 너무 작지 않나요?</strong> A. 일반 결제 정보(가맹점명, 카드사, 금액, 승인번호 등)는 모두 정상적으로 출력되며, 글자 크기도 충분히 읽기 좋습니다. 단, 메뉴 항목이 많은 카페나 식당이라면 3인치 모델이 더 적합할 수 있습니다.</p>
<p><strong>Q. 단말기 비용은 얼마인가요?</strong> A. 마스터페이를 통해 신청하시면 ${guName} 지역도 단말기 무료 옵션이 있으며, 월 사용료도 0원입니다. VAN사 카드 수수료만 일반 요율로 부과됩니다.</p>
<p><strong>Q. 기존 단말기 교체도 가능한가요?</strong> A. 네, ${fullAddr} 매장의 기존 단말기는 마스터페이가 무료 회수·반납 처리를 도와드립니다. 가맹점 명의 변경 절차도 함께 처리됩니다.</p>
<h3>${dongName} 2인치 단말기 설치 절차</h3>
<p>상담 → 매장 방문 또는 전화 견적 → 모델 선정 → 설치(${ctx.installTime}~${ctx.installTime+2}일 이내) → 사용법 교육 → 사후 관리. ${guName} 전담 기사가 ${dongName} 매장을 직접 방문해 설치하며, 카드사 가맹 등록까지 모두 대행합니다. 사장님은 설치 당일 결제 테스트만 함께 해보시면 됩니다.</p>
</div>
`,

    'card-3inch': `
<div class="region-box">
<h2 class="region-box-title">🖨️ ${fullAddr} 3인치 카드단말기 상세 가이드</h2>
<h3>3인치 단말기가 ${dongName} 매장에 주는 가치</h3>
<p>3인치 카드단말기는 표준형 모델로, 영수증 폭이 넓어 결제 정보 외에도 매장 로고·이벤트 안내·QR쿠폰 등을 함께 인쇄할 수 있는 가장 대중적인 모델입니다. ${ctx.areaType} 특성을 가진 ${fullAddr} 일대 ${ctx.topBiz[0]} 업종 매장에서는 표준 3인치 단말기가 가장 안정적인 선택입니다.</p>
<p><strong>3인치 단말기의 강점</strong></p>
<p><strong>① 가독성 우수.</strong> 영수증 폭이 80mm로 넓어 메뉴명·옵션·할인 내역이 모두 한눈에 보입니다. ${ctx.topBiz[0]} 같이 메뉴가 많은 업종에 적합합니다.</p>
<p><strong>② 표준 호환성.</strong> 대부분의 포스기·키오스크와 표준 인터페이스로 연결되어, ${dongName} 매장에서 향후 시스템 업그레이드 시에도 호환성 문제가 없습니다.</p>
<p><strong>③ 다양한 결제 수단 지원.</strong> 신용카드·체크카드·삼성페이·LG페이·애플페이·제로페이·서울페이·각종 모바일 상품권까지 모두 한 대로 처리됩니다.</p>
<p><strong>④ 영수증 디자인 커스터마이징.</strong> 매장 로고, 인사말, 쿠폰 코드, SNS 정보 등을 영수증에 함께 인쇄할 수 있어 ${dongName} 매장 브랜딩에도 도움이 됩니다.</p>
<p><strong>⑤ 안정적인 내구성.</strong> 일평균 500건 이상의 결제도 무리 없이 처리하며, 평균 사용 수명이 5년 이상으로 ${ctx.topBiz[1]} 처럼 결제 횟수가 많은 업종에서도 안심하고 사용 가능합니다.</p>
<h3>${fullAddr}에서 추천하는 3인치 모델</h3>
<p>일반 매장은 KIS-1420 모델이 가장 인기 있으며, 결제 속도가 빠르고 NFC·MS·IC 카드를 모두 지원합니다. 무선 결제가 필요한 매장은 KIS-1420 LTE 모델을, 비용 절감이 중요한 매장은 동급 KS-7700 시리즈도 좋은 선택입니다.</p>
<p>마스터페이는 ${fullAddr} 매장에 ${ctx.topBiz[0]} 업종 기준으로 가장 적합한 모델을 추천드리며, 카드사 수수료를 카드사별로 비교해 가장 유리한 조건으로 가맹 신청을 진행해드립니다. 신용카드 수수료는 매출 규모에 따라 차이가 크기 때문에, 같은 단말기라도 어느 VAN사를 통하느냐에 따라 연간 수백만 원의 차이가 날 수 있습니다.</p>
<h3>${dongName} 3인치 단말기 도입 효과</h3>
<p>${dongName} 일대 매장 사례를 보면, 3인치 단말기 도입 후 결제 대기 시간이 평균 30% 단축되고, 영수증 분실로 인한 환불 분쟁도 크게 줄어듭니다. 또한 매출 데이터가 자동으로 정리되어 부가세 신고 시간도 절약됩니다. 마스터페이가 설치한 ${guName} 지역 매장의 평균 만족도는 ${ctx.satisfaction || 96}% 이상입니다.</p>
</div>
`,

    'card-toss': `
<div class="region-box">
<h2 class="region-box-title">⚡ ${fullAddr} 토스 단말기 상세 가이드</h2>
<h3>${dongName}에서 토스 단말기가 인기인 이유</h3>
<p>토스 단말기는 토스페이먼츠가 자체 개발한 차세대 결제 단말기로, 일반 카드결제뿐만 아니라 토스페이·삼성페이·간편송금까지 한 대로 처리할 수 있는 통합형 결제기입니다. ${ctx.areaType} 성격의 ${fullAddr} 일대는 젊은 고객층이 많아, 간편결제 비중이 높은 업종에서 토스 단말기의 효과가 특히 큽니다.</p>
<p><strong>토스 단말기의 차별점</strong></p>
<p><strong>① 간편결제 통합.</strong> 토스페이·카카오페이·네이버페이·페이코 등 주요 간편결제를 모두 한 대로 처리하며, 결제 화면도 직관적이라 고객이 빠르게 결제할 수 있습니다.</p>
<p><strong>② 가맹점 정산 빠름.</strong> 일반 카드 매출은 영업일 기준 2~3일 후 입금되지만, 토스 결제는 익일 정산이 기본이며 일부는 당일 정산도 가능합니다. ${dongName} 1인 자영업자에게는 자금 회전이 큰 도움이 됩니다.</p>
<p><strong>③ 수수료 투명.</strong> 토스페이먼츠는 카드사별 수수료를 명확히 공개하며, 일반 VAN사 대비 평균 0.1~0.3%p 낮은 경우가 많습니다. ${ctx.topBiz[0]} 처럼 매출 규모가 큰 업종은 연간 수십만 원의 수수료 절감 효과가 있습니다.</p>
<p><strong>④ 매출 알림 즉시.</strong> 결제될 때마다 토스 사장님 앱으로 푸시 알림이 오며, 매출 현황을 실시간으로 확인할 수 있습니다. ${dongName} 처럼 직원이 결제 받는 매장에서는 사장님이 매장 밖에서도 매출을 모니터링할 수 있습니다.</p>
<p><strong>⑤ 단말기 디자인.</strong> 깔끔한 흰색 미니멀 디자인으로 인테리어와 잘 어울리며, ${ctx.topBiz[1]} 같은 디자인 중요 업종에서 호평을 받습니다.</p>
<h3>${fullAddr} 토스 단말기 도입 절차</h3>
<p>토스페이먼츠 가맹 심사 → 단말기 발송 → ${dongName} 현지 설치 → 토스 사장님 앱 설치 → 사용법 교육 순으로 진행됩니다. 마스터페이는 ${fullAddr} 매장의 가맹 신청을 대행하며, 사업자등록증·통장사본·신분증만 준비하시면 나머지는 모두 처리해드립니다. ${guName} 전담 기사가 ${ctx.installTime}~${ctx.installTime+2}일 이내에 설치를 완료합니다.</p>
<h3>${dongName} 매장에 추천하는 토스 단말기 활용법</h3>
<p>토스 단말기를 ${dongName} 매장에 설치하면, 토스 앱 사용자에게 자동 노출되는 장점도 있습니다. 토스 앱의 '내 주변 가맹점' 기능에 ${fullAddr} 매장이 노출되어 자연 유입이 늘어날 수 있습니다. 또한 토스 결제 고객 대상 자체 적립금·쿠폰 발행도 가능해, ${ctx.topBiz[0]} 업종이라면 단골 마케팅 도구로도 활용할 수 있습니다.</p>
</div>
`,

    'card-wireless': `
<div class="region-box">
<h2 class="region-box-title">📡 ${fullAddr} 무선 카드단말기 상세 가이드</h2>
<h3>${dongName} 매장에 무선 단말기가 필요한 경우</h3>
<p>무선 카드단말기는 LTE 또는 Wi-Fi로 인터넷에 연결되어, 매장 내 어디서든 결제가 가능한 휴대형 결제기입니다. ${ctx.areaType} 특성의 ${fullAddr} 일대에서는 ${ctx.topBiz[0]}, ${ctx.topBiz[1]} 처럼 테이블 결제·출장 결제·이동식 매장이 많아 무선 단말기 수요가 높습니다.</p>
<p><strong>무선 단말기 vs 유선 단말기</strong></p>
<p>유선 단말기는 카운터에 고정되어 있어 고객이 카운터까지 와서 결제해야 합니다. 반면 무선 단말기는 사장님이 단말기를 들고 고객에게 가서 결제할 수 있어, 매장 동선이 길거나 테이블이 많은 업종에서 회전율을 크게 높여줍니다.</p>
<p><strong>무선 단말기 활용 사례</strong></p>
<p><strong>① 음식점·식당:</strong> 테이블 결제로 고객 만족도 향상. ${ctx.topBiz[0]} 업종 ${dongName} 매장의 평균 회전율이 15~20% 증가합니다.</p>
<p><strong>② 푸드트럭·이동매장:</strong> 어디서든 즉시 결제 가능. ${guName} 일대 행사·축제에서 매출 누락 없이 결제 처리.</p>
<p><strong>③ 출장 서비스:</strong> 청소·이사·인테리어·정비 업종이 현장에서 바로 결제. ${dongName} 매장이 출장 서비스를 제공한다면 필수 장비.</p>
<p><strong>④ 야외 매장:</strong> 카페 야외 테라스·가든 레스토랑에서 자유롭게 이동하며 결제.</p>
<p><strong>⑤ 줄 서는 매장:</strong> ${ctx.topBiz[1]} 같은 인기 매장에서 대기줄 결제 선처리로 회전율 향상.</p>
<h3>${fullAddr} 무선 단말기 추천 사양</h3>
<p>일반 매장은 LTE 무선 모델 (월 통신비 5,000~9,000원)을 추천드리며, Wi-Fi가 안정적인 매장은 Wi-Fi 모델로도 충분합니다. 배터리는 한 번 충전으로 8~12시간 사용 가능하며, ${dongName} 매장에서 영업 시간 내내 결제가 가능합니다. 영수증 출력은 내장 프린터로 즉시 가능하며, 일부 모델은 무선으로 별도 프린터와 연결됩니다.</p>
<h3>${dongName} 무선 단말기 도입 시 주의사항</h3>
<p>무선 단말기는 통신 환경이 중요합니다. ${fullAddr} 매장의 위치에 따라 LTE 신호가 약할 수 있으므로, 마스터페이는 설치 전 ${dongName} 매장 위치의 통신 환경을 미리 확인합니다. 신호가 약한 지역은 Wi-Fi 모델을 추천하거나, 신호 증폭 옵션을 안내합니다. ${guName} 전담 기사가 직접 매장에 방문해 통신 테스트를 진행하고, 가장 안정적인 옵션을 결정해드립니다.</p>
</div>
`,

    'card-bluetooth': `
<div class="region-box">
<h2 class="region-box-title">📶 ${fullAddr} 블루투스 카드단말기 상세 가이드</h2>
<h3>블루투스 단말기가 ${dongName} 매장에 적합한 이유</h3>
<p>블루투스 카드단말기는 스마트폰 또는 태블릿과 무선으로 연결되어 결제하는 초소형 결제기입니다. 본체 크기가 일반 단말기의 1/4 수준이며 무게도 100g 내외로 가벼워, ${ctx.areaType} 성격의 ${fullAddr} 일대 1인 매장이나 출장형 사장님께 가장 인기가 높습니다.</p>
<p><strong>블루투스 단말기의 차별점</strong></p>
<p><strong>① 초소형 휴대성.</strong> 손바닥 안에 들어오는 크기로, 사장님이 항상 휴대할 수 있습니다. ${dongName} 일대 1인 사업자에게는 가장 편리한 결제 도구입니다.</p>
<p><strong>② 저렴한 단말기 비용.</strong> 일반 단말기 대비 약 절반 수준의 단말기 비용으로, ${guName} 지역 사장님들도 부담 없이 도입 가능합니다.</p>
<p><strong>③ 통신비 절감.</strong> 별도 LTE 통신비가 없으며, 사장님 스마트폰 데이터를 활용해 결제됩니다. 월 5,000~10,000원의 통신비를 절약할 수 있습니다.</p>
<p><strong>④ 다중 단말기 운영.</strong> 한 매장에서 여러 명의 직원이 각자 블루투스 단말기를 들고 결제하면 줄서는 시간을 분산할 수 있습니다. ${ctx.topBiz[0]} 같은 회전율 중요 업종에 효과적입니다.</p>
<p><strong>⑤ 영수증 선택 발급.</strong> 종이 영수증이 필요 없는 고객에게는 모바일 영수증(SMS/카카오톡)을 발송할 수 있어, 영수증 용지 비용도 크게 절감됩니다.</p>
<h3>${fullAddr} 블루투스 단말기 사용 환경</h3>
<p>안드로이드폰·아이폰 모두 호환되며, 전용 앱(MPI 등)을 설치하면 결제 화면이 스마트폰에 표시됩니다. 결제 정보·영수증·매출 통계를 모두 스마트폰에서 확인할 수 있어, ${dongName} 사장님이 매장 밖에서도 실시간으로 매출을 모니터링할 수 있습니다.</p>
<p>블루투스 연결 안정성은 최대 10m이며, ${guName} 일대 일반적인 매장 크기에서는 충분합니다. 다만 콘크리트 벽이나 금속 가구가 많은 환경에서는 연결이 끊길 수 있으므로, ${fullAddr} 매장 환경에 따라 적합 여부를 마스터페이가 사전 확인해드립니다.</p>
<h3>${dongName} 블루투스 단말기 도입 절차</h3>
<p>가맹 신청 → 단말기 발송 → 스마트폰 앱 설치 → 페어링(약 5분) → 첫 결제 테스트 → 운영 시작. ${ctx.installTime}~${ctx.installTime+2}일 이내에 모든 절차가 완료되며, ${guName} 전담 매니저가 첫 사용을 도와드립니다. ${ctx.topBiz[1]} 업종이라면 특히 추천드리는 모델입니다.</p>
</div>
`,

    'kiosk': `
<div class="region-box">
<h2 class="region-box-title">🤖 ${fullAddr} 키오스크 상세 가이드</h2>
<h3>${dongName}에서 키오스크가 매장 운영을 바꾸는 방식</h3>
<p>키오스크는 고객이 직접 메뉴를 주문하고 결제까지 마치는 무인 주문기로, 인건비 절감과 주문 정확도 향상이라는 두 가지 효과를 동시에 가져옵니다. ${ctx.areaType} 특성의 ${fullAddr} 일대 ${ctx.topBiz[0]} 업종은 점심·저녁 피크타임 인력 부담이 크기 때문에, 키오스크 도입 효과가 즉각적으로 나타납니다.</p>
<p><strong>키오스크 도입의 5대 효과</strong></p>
<p><strong>① 인건비 절감.</strong> 주문 받는 인력 1명을 줄일 수 있으며, ${dongName} 일대 시급 기준 월 100~150만 원 이상 절감됩니다. 6개월~1년 안에 키오스크 비용을 회수할 수 있습니다.</p>
<p><strong>② 주문 오류 감소.</strong> 고객이 직접 메뉴를 선택하므로 주문 오류가 거의 발생하지 않습니다. ${ctx.topBiz[1]} 업종에서는 주문 분쟁이 90% 이상 감소합니다.</p>
<p><strong>③ 평균 객단가 상승.</strong> 키오스크의 추천·세트 메뉴 표시 기능으로 추가 메뉴 주문이 늘어나, ${dongName} 매장 평균 객단가가 10~15% 상승하는 사례가 많습니다.</p>
<p><strong>④ 24시간 주문 가능.</strong> 야간 무인 운영도 가능해, ${guName} 일대 24시간 매장(편의점, 무인카페)에서 야간 인력 없이 운영할 수 있습니다.</p>
<p><strong>⑤ 데이터 분석.</strong> 어떤 메뉴가 잘 팔리는지·언제 가장 많이 팔리는지 등 데이터가 자동 누적되어, ${dongName} 매장의 메뉴 개발과 마케팅에 활용할 수 있습니다.</p>
<h3>${fullAddr} 키오스크 추천 사양</h3>
<p>일반 매장은 21.5~32인치 스탠드형 키오스크가 가장 인기입니다. 메뉴 사진을 크게 보여줄 수 있고, 고객 인지도도 높아집니다. 카드결제·삼성페이·간편결제 모두 지원하며, 영수증 프린터·출력기가 내장되어 있습니다. ${ctx.topBiz[0]} 업종은 음성 안내 기능을 추가하면 시각약자 고객도 편리하게 사용할 수 있습니다.</p>
<p>설치 공간이 협소한 ${dongName} 매장은 카운터 거치형(15~17인치) 모델로도 충분합니다. 비용은 절반 이하지만 효과는 동일합니다. 마스터페이는 ${fullAddr} 매장의 평수와 동선을 보고 가장 효율적인 모델을 추천드립니다.</p>
<h3>${dongName} 키오스크 도입 절차 및 효과 측정</h3>
<p>상담 → 매장 실측 → 모델 선정 → 메뉴 입력(약 50~100개) → 설치(${ctx.installTime}~${ctx.installTime+2}일) → 직원 교육 → 운영 시작. 키오스크는 단순 설치가 아니라 매장 메뉴를 사진과 함께 등록하는 작업이 가장 중요한데, 마스터페이는 ${dongName} 매장의 메뉴를 직접 촬영해 등록까지 무료로 처리해드립니다. 도입 후 1개월 내에 매출 변화·인건비 절감 효과를 확인할 수 있습니다.</p>
</div>
`,

    'kiosk-mini': `
<div class="region-box">
<h2 class="region-box-title">📱 ${fullAddr} 미니 키오스크 상세 가이드</h2>
<h3>${dongName} 소형 매장에 미니 키오스크가 적합한 이유</h3>
<p>미니 키오스크는 일반 스탠드형 키오스크의 1/3 크기인 카운터 거치형 모델로, 좁은 매장 공간에 부담 없이 설치할 수 있는 무인 주문 시스템입니다. ${ctx.areaType} 특성의 ${fullAddr} 일대 ${ctx.topBiz[0]}, ${ctx.topBiz[1]} 같이 평수가 작은 매장에서 특히 인기가 높습니다.</p>
<p><strong>미니 키오스크의 강점</strong></p>
<p><strong>① 공간 효율.</strong> 13~17인치 컴팩트 사이즈로 카운터 위에 올려놓을 수 있어, ${dongName} 일대 5평 미만 매장에도 설치 가능합니다. 별도 바닥 공간이 필요 없습니다.</p>
<p><strong>② 저렴한 비용.</strong> 일반 키오스크 대비 단말기 비용이 절반 이하이며, 마스터페이를 통해 신청하면 ${guName} 지역도 추가 할인 혜택이 있습니다. 자영업자에게 부담 없는 가격대입니다.</p>
<p><strong>③ 빠른 설치.</strong> 전기 콘센트와 인터넷만 있으면 ${ctx.installTime}~${ctx.installTime+2}일 이내 설치 완료. 매장 인테리어 변경이 필요 없습니다.</p>
<p><strong>④ 동일한 기능.</strong> 크기는 작아도 메뉴 등록·주문·결제·영수증 발급까지 모든 기능이 동일합니다. ${ctx.topBiz[0]} 업종에서 충분히 활용할 수 있습니다.</p>
<p><strong>⑤ 모바일 디자인.</strong> 깔끔한 디자인으로 인테리어와 잘 어울려, ${dongName} 일대 트렌디한 매장에서 선호됩니다.</p>
<h3>${fullAddr}에서 미니 키오스크가 잘 맞는 매장</h3>
<p>1인 운영 카페, 무인 아이스크림 매장, 작은 분식점, 떡볶이·핫도그·치킨 테이크아웃 매장 등 ${dongName} 일대에서 흔히 볼 수 있는 소형 매장에 적합합니다. 또한 ${ctx.topBiz[1]} 업종 중 카운터 결제가 많은 매장도 미니 키오스크를 도입하면 결제 대기 시간이 크게 줄어듭니다.</p>
<p>미니 키오스크는 셀프 주문뿐 아니라 메뉴 추천·세트 메뉴 안내·이벤트 알림까지 화면에 표시할 수 있어, ${dongName} 매장의 마케팅 도구로도 활용 가능합니다. 단골 고객에게 적립금·쿠폰을 자동 안내하면 재방문율이 높아집니다.</p>
<h3>${dongName} 미니 키오스크 도입 효과</h3>
<p>${guName} 일대 미니 키오스크 도입 매장 사례에서, 평균 주문 시간이 50% 단축되고 객단가는 10~12% 상승했습니다. 또한 직원 1명이 주문 받지 않고 조리·서빙에 집중할 수 있어, 같은 인력으로 더 많은 고객을 응대할 수 있습니다. 마스터페이는 ${fullAddr} 매장에 미니 키오스크를 설치한 후, 메뉴 등록·디자인·운영 가이드까지 모두 무료로 지원합니다.</p>
</div>
`,

    'tableorder': `
<div class="region-box">
<h2 class="region-box-title">📋 ${fullAddr} 테이블오더 상세 가이드</h2>
<h3>${dongName} 식당·주점에 테이블오더가 가져오는 변화</h3>
<p>테이블오더는 각 테이블에 설치된 태블릿 또는 QR코드로 고객이 직접 주문하는 시스템으로, 주문 인력 부담을 없애고 회전율을 극대화하는 차세대 주문 방식입니다. ${ctx.areaType} 특성의 ${fullAddr} 일대 ${ctx.topBiz[0]}, ${ctx.topBiz[1]} 업종에서는 테이블오더 도입이 매장 경쟁력의 척도가 되고 있습니다.</p>
<p><strong>테이블오더 도입의 7가지 혜택</strong></p>
<p><strong>① 주문 인력 절감.</strong> 홀 직원 1~2명을 줄일 수 있으며, ${dongName} 일대 ${ctx.topBiz[0]} 매장 기준 월 200~300만 원 절감됩니다.</p>
<p><strong>② 주문 누락 제로.</strong> 고객이 직접 입력한 주문이 즉시 주방으로 전송되어 주문 오류·누락이 사라집니다. ${guName} 일대 매장의 주문 분쟁이 95% 이상 감소했습니다.</p>
<p><strong>③ 회전율 30% 상승.</strong> 주문·결제 시간이 단축되어 ${dongName} 피크타임 회전율이 평균 30% 증가합니다. ${ctx.topBiz[1]} 업종에서는 매출이 직접적으로 늘어납니다.</p>
<p><strong>④ 메뉴 추천 자동화.</strong> 고객이 메뉴를 선택할 때 사이드 메뉴·세트·주류를 자동 추천하여 객단가가 15~20% 상승합니다.</p>
<p><strong>⑤ 다국어 지원.</strong> 한국어·영어·중국어·일본어 메뉴를 자동 표시해, ${fullAddr} 외국인 관광객·유학생 비중이 높은 매장에 효과적입니다.</p>
<p><strong>⑥ 메뉴 사진 강화.</strong> 모든 메뉴를 고화질 사진과 함께 표시해, 고객이 메뉴를 망설이지 않고 빠르게 선택합니다.</p>
<p><strong>⑦ 데이터 분석.</strong> 시간대별·요일별·테이블별 매출 데이터가 자동 집계되어 매장 운영 전략 수립에 활용됩니다.</p>
<h3>${fullAddr}에서 테이블오더가 잘 맞는 매장</h3>
<p>${ctx.topBiz[0]} (4~10인 테이블이 많은 식당·고깃집·중식·일식), ${ctx.topBiz[1]} (주점·호프집·이자카야), 카페·디저트 전문점, 패밀리 레스토랑 등이 테이블오더 도입 시 가장 큰 효과를 봅니다. ${dongName} 일대 매장 중 객단가가 1만 원 이상이면서 테이블이 5개 이상인 매장은 테이블오더 도입을 강력 추천합니다.</p>
<h3>${dongName} 테이블오더 도입 절차</h3>
<p>마스터페이가 ${fullAddr} 매장을 직접 방문해 테이블 수·메뉴 수·고객층을 분석한 후 적합한 테이블오더 시스템(태블릿형 또는 QR형)을 추천드립니다. 메뉴 사진 촬영·등록·다국어 번역까지 모두 무료로 지원하며, ${ctx.installTime}~${ctx.installTime+2}일 이내 설치가 완료됩니다. 직원 교육은 30분이면 충분하며, ${guName} 전담 매니저가 도입 후 1개월 동안 지속 관리해드립니다.</p>
</div>
`,

    'removal': `
<div class="region-box">
<h2 class="region-box-title">🔨 ${fullAddr} 매장 철거 상세 가이드</h2>
<h3>${dongName} 매장 철거가 필요한 경우</h3>
<p>매장 철거는 임대차 종료 시 원상복구 의무를 이행하기 위해 또는 새로운 매장으로 변경하기 위해 진행되는 작업으로, ${ctx.areaType} 특성의 ${fullAddr} 일대처럼 임대료가 높은 지역에서는 빠른 철거가 곧 비용 절감입니다. 임대차 종료 후 1일이라도 철거가 늦어지면 일할 임대료가 추가 발생합니다.</p>
<p><strong>철거 작업 범위</strong></p>
<p><strong>① 인테리어 철거.</strong> 천장·벽·바닥·조명·주방 시설·간판·유리·집기까지 모두 철거합니다. ${dongName} 매장 평수와 인테리어 종류에 따라 작업량이 달라집니다.</p>
<p><strong>② 폐기물 처리.</strong> 철거 후 발생하는 산업폐기물·일반폐기물을 분리해 합법적으로 처리합니다. ${guName} 지자체 규정에 맞춰 처리되어 추후 과태료 위험이 없습니다.</p>
<p><strong>③ 원상복구.</strong> 임대차 계약서 기준 원상태로 복구합니다. 벽지·바닥재·천장 등 입주 전 상태로 되돌리는 작업이 포함됩니다.</p>
<p><strong>④ 청소 및 인계.</strong> 철거 완료 후 깨끗이 청소하여 임대인에게 인계할 수 있는 상태로 만듭니다.</p>
<h3>${fullAddr} 매장 철거 시 주의사항</h3>
<p>철거 전 반드시 임대차 계약서를 확인하고, 임대인이 요구하는 원상복구 수준을 명확히 협의해야 합니다. ${dongName} 일대 임대인마다 요구 수준이 달라, 마스터페이가 ${guName} 지역 사례를 바탕으로 협상도 함께 도와드립니다. 또한 폐기물 처리는 반드시 면허 보유 업체에 맡겨야 하며, 무자격 업체에 맡기면 사장님이 폐기물 처리 책임을 지게 됩니다.</p>
<p><strong>비용 산정 기준</strong></p>
<p>${fullAddr} 매장 철거 비용은 평당 평균 5~15만 원 수준이며, 인테리어 종류·집기 양·폐기물 양에 따라 달라집니다. 마스터페이는 ${dongName} 매장을 직접 방문해 무료 견적을 제공하며, 일반 시세 대비 10~20% 저렴한 가격으로 진행됩니다.</p>
<h3>${dongName} 매장 철거 절차</h3>
<p>전화 상담 → 현장 방문 견적 → 견적 확정 → 철거 일정 협의 → 철거 작업(반나절~3일) → 폐기물 처리 → 청소 및 인계. ${guName} 일대 매장은 평균 1~2일이면 철거가 완료되며, ${ctx.installTime}일 이내 일정 협의도 가능합니다. ${dongName} 사장님은 철거 당일 마지막 점검만 함께 해주시면 됩니다.</p>
<p>마스터페이의 매장 철거 서비스는 임대인 인계까지 책임지며, 사장님께서 다른 일정을 잡으셔도 문제없이 진행됩니다. ${fullAddr} 일대에서 가장 빠르고 깔끔한 철거를 원하신다면 언제든 상담 문의 주십시오.</p>
</div>
`,
  };
  
  return contents[productSlug] || '';
}


// ============================================================
// 동×제품 페이지 (예: /region/seoul/강남구/역삼동/card-3inch)
// ============================================================

function buildDongProductPage(sidoUrl, guName, dongName, productSlug) {
  const sido = REGIONS[sidoUrl];
  if (!sido) return null;
  const dongs = sido.gus[guName];
  if (!dongs || !dongs.includes(dongName)) return null;
  const product = PRODUCTS[productSlug];
  if (!product) return null;
  
  const ctx = getRegionContext(sido.name + guName + dongName + productSlug);
  const fullAddr = `${sido.name} ${guName} ${dongName}`;
  const seed = hashString(fullAddr + productSlug);
  const shops = 10 + (seed % 200);
  
  let otherProductsHtml = '';
  for (const op in PRODUCTS) {
    if (op === productSlug) continue;
    const p = PRODUCTS[op];
    otherProductsHtml += `<a href="/region/${sidoUrl}/${encodeURIComponent(guName)}/${encodeURIComponent(dongName)}/${p.url}" class="region-product-simple">
      <div class="ps-icon">${p.emoji}</div>
      <div class="ps-name">${p.name}</div>
    </a>`;
  }
  
  return getCommonHead(
    productSlug === 'removal'
      ? `${sido.name} ${guName} ${dongName} 매장 철거 | 무료 견적·원상복구`
      : `${sido.name} ${guName} ${dongName} ${product.keyword} 설치 | ${product.name}`,
    productSlug === 'removal'
      ? `${fullAddr} 매장 철거·원상복구 전문. ${ctx.opening}. 무료 견적·전국 최저가·1년 사후 책임.`
      : `${fullAddr} ${product.name} 설치 전문. ${ctx.opening}. 무료 상담·빠른 설치·A/S 보장.`
  ) + `<body>${getHeader()}

<section class="region-hero">
<div class="container">
<div class="breadcrumb">
<a href="/">홈</a>
<span class="breadcrumb-separator">/</span>
<a href="/region/${sidoUrl}">${sido.name}</a>
<span class="breadcrumb-separator">/</span>
<a href="/region/${sidoUrl}/${encodeURIComponent(guName)}">${guName}</a>
<span class="breadcrumb-separator">/</span>
<a href="/region/${sidoUrl}/${encodeURIComponent(guName)}/${encodeURIComponent(dongName)}">${dongName}</a>
<span class="breadcrumb-separator">/</span>
<span>${product.name}</span>
</div>
<div class="region-thumbnail">
<img src="${getThumbnailUrl(productSlug, fullAddr)}" alt="${fullAddr} ${product.name}" class="region-thumbnail-img" loading="lazy">
<div class="region-thumbnail-badge">${getThumbnailEmoji(productSlug)} ${getThumbnailLabel(productSlug)}</div>
<div class="region-thumbnail-overlay">
<div class="region-thumbnail-meta">
<span>${getKstDateString()} 기준</span>
<span class="region-thumbnail-dot">·</span>
<span>${fullAddr}</span>
<span class="region-thumbnail-dot">·</span>
<span>${productSlug === 'removal' ? '무료 견적' : '무료 설치'}</span>
</div>
<h1 class="region-thumbnail-title">${getShortSidoName(sido.name)} ${guName} ${dongName} ${product.name}${productSlug === "removal" ? "" : " 설치"}</h1>
<div class="region-thumbnail-services">${product.desc} · 전문가 직접 방문 · 빠른 A/S 보장</div>
</div>
</div>
<div class="region-hero-sub-standalone">${productSlug === 'removal' ? `${fullAddr} 매장 철거·원상복구 전문. 무료 방문 견적, 전국 최저가, 1년 사후 책임을 약속합니다.` : `${fullAddr} 지역 ${product.name} 전문 설치. 설치비 무료, 빠른 A/S, 업종 맞춤 설치를 지원합니다.`}</div>
<div class="region-cta-box">
<h3>💳 ${sido.name} 무료 견적 받기</h3>
<p>${sido.name} 전 지역 전문가가 책임집니다.</p>
<div class="region-cta-buttons">
<a href="tel:010-2337-0458" class="btn btn-primary">📞 010-2337-0458</a>
<a href="#contact" class="btn btn-ghost" onclick="scrollToContact(event)">💬 상담 문의</a>
</div>
</div>
</div>
</section>

<section class="region-main">
<div class="container">

${renderRegionProductBody(buildRegionProductData(sido.name + ' ' + guName + ' ' + dongName, productSlug))}

<div class="region-box">
<h2 class="region-box-title">🛒 ${sido.name} ${guName} ${dongName} 다른 제품도 확인하세요</h2>
<div class="region-products-simple">${otherProductsHtml}</div>
</div>

${getProductDetailContent(productSlug, sido.name, guName, dongName, ctx)}

${buildKeywordBox(getShortSidoName(sido.name) + ' ' + guName + ' ' + dongName, product.name)}

</div>
</section>

${getCTA()}

${getFooter()}`;
}


// ============================================================
// API: /api/contact - Resend로 이메일 발송
// ============================================================

async function handleContactAPI(request, env) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'POST only' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
  
  try {
    const body = await request.json();
    const { name, phone, address, addressDetail, product, business, message } = body;
    
    // 기본 검증
    if (!name || !phone || !address || !product) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '필수 항목을 모두 입력해주세요.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    // API Key 확인
    if (!env || !env.RESEND_API_KEY) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'RESEND_API_KEY가 Cloudflare Secret에 설정되지 않았습니다.' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    // 주소 합치기
    const fullAddress = addressDetail ? address + ' ' + addressDetail : address;
    
    // 시간 (한국 시간)
    const now = new Date();
    const kstTime = new Date(now.getTime() + 9 * 60 * 60 * 1000)
      .toISOString().replace('T', ' ').substring(0, 19);
    
    // 이메일 HTML (예쁘게)
    const emailHTML = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8">
<link rel="icon" type="image/png" href="/brand.png">
<link rel="apple-touch-icon" href="/brand.png"></head>
<body style="font-family: 'Malgun Gothic', sans-serif; background: #f5f5f5; padding: 20px; margin: 0;">
<div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
  <div style="background: linear-gradient(135deg, #1a1a1a, #2d4a3e); padding: 32px 28px; color: #ffffff;">
    <div style="font-size: 13px; color: #e8763a; font-weight: 700; letter-spacing: 2px; margin-bottom: 8px;">✦ MASTERPAY</div>
    <h1 style="margin: 0; font-size: 22px; font-weight: 800;">🔔 새로운 문의가 도착했습니다</h1>
    <p style="margin: 8px 0 0; font-size: 13px; opacity: 0.8;">${kstTime} KST</p>
  </div>
  <div style="padding: 32px 28px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 14px 0; color: #888; font-size: 13px; width: 100px; vertical-align: top;">👤 상호/이름</td>
        <td style="padding: 14px 0; color: #1a1a1a; font-size: 15px; font-weight: 700;">${name}</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 14px 0; color: #888; font-size: 13px; vertical-align: top;">📞 연락처</td>
        <td style="padding: 14px 0; color: #1a1a1a; font-size: 15px; font-weight: 700;">
          <a href="tel:${phone}" style="color: #e8763a; text-decoration: none;">${phone}</a>
        </td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 14px 0; color: #888; font-size: 13px; vertical-align: top;">📍 주소</td>
        <td style="padding: 14px 0; color: #1a1a1a; font-size: 14px; line-height: 1.6;">${fullAddress}</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 14px 0; color: #888; font-size: 13px; vertical-align: top;">📦 문의 제품</td>
        <td style="padding: 14px 0;">
          <span style="display: inline-block; padding: 6px 12px; background: #fef3e0; color: #e8763a; border-radius: 100px; font-size: 13px; font-weight: 700;">${product}</span>
        </td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 14px 0; color: #888; font-size: 13px; vertical-align: top;">🏪 업종</td>
        <td style="padding: 14px 0; color: #1a1a1a; font-size: 14px;">${business || '-'}</td>
      </tr>
      <tr>
        <td style="padding: 14px 0; color: #888; font-size: 13px; vertical-align: top;">💬 문의 내용</td>
        <td style="padding: 14px 0; color: #1a1a1a; font-size: 14px; line-height: 1.7;">
          ${message ? message.replace(/\n/g, '<br>') : '<span style="color: #aaa;">(없음)</span>'}
        </td>
      </tr>
    </table>
    <div style="margin-top: 28px; padding: 20px; background: #f7f4ed; border-radius: 12px; border-left: 4px solid #e8763a;">
      <div style="font-weight: 700; color: #1a1a1a; margin-bottom: 8px;">⚡ 빠른 대응 안내</div>
      <div style="font-size: 13px; color: #666; line-height: 1.6;">
        고객의 연락처로 <strong>24시간 이내</strong>에 상담 전화를 드려주세요.
      </div>
    </div>
  </div>
  <div style="background: #f7f4ed; padding: 16px 28px; text-align: center; font-size: 12px; color: #888;">
    mastarpay.com 홈페이지 문의 폼에서 자동 발송되었습니다.
  </div>
</div>
</body>
</html>`;
    
    // Resend API 호출
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + env.RESEND_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Mastarpay <onboarding@resend.dev>',
        to: ['thdmsjinu@gmail.com'],
        subject: '[마스터페이] ' + name + ' · ' + product + ' · ' + phone,
        html: emailHTML,
      }),
    });
    
    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error('Resend API 에러:', resendResponse.status, errorData);
      return new Response(JSON.stringify({ 
        success: false, 
        error: '이메일 발송 실패 (상태: ' + resendResponse.status + '). 전화로 문의해주세요.',
        debug: errorData.substring(0, 300)
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      message: '문의가 접수되었습니다.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
    
  } catch (error) {
    console.error('handleContactAPI error:', error.message);
    return new Response(JSON.stringify({ 
      success: false, 
      error: '서버 오류: ' + error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

// ============================================================
// 라우팅 테이블
// ============================================================

const staticRoutes = {
  '/': PAGE_HOME,
  '/product/pos': PAGE_POS,
  '/product/card-2inch': PAGE_CARD_2INCH,
  '/product/card-3inch': PAGE_CARD_3INCH,
  '/product/card-toss': PAGE_CARD_TOSS,
  '/product/card-wireless': PAGE_CARD_WIRELESS,
  '/product/card-bluetooth': PAGE_CARD_BLUETOOTH,
  '/product/kiosk': PAGE_KIOSK,
  '/product/kiosk-mini': PAGE_KIOSK_MINI,
  '/product/tableorder': PAGE_TABLEORDER,
  '/product/removal': PAGE_REMOVAL,
};

// ============================================================
// Worker 진입점
// ============================================================

export default {
  async fetch(request, env) {
    // API 엔드포인트 먼저 처리
    const _url = new URL(request.url);
    if (_url.pathname === '/api/contact') {
      return handleContactAPI(request, env);
    }
    
    const url = new URL(request.url);
    let pathname = decodeURIComponent(url.pathname);
    
    // 끝의 슬래시 제거 (단, 루트 제외)
    if (pathname !== '/' && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }
    
    // .html 확장자 제거 지원
    if (pathname.endsWith('.html')) {
      pathname = pathname.slice(0, -5);
    }
    
    // 0. brand.png / favicon — GitHub raw에서 가져와 캐시
    if (pathname === '/brand.png' || pathname === '/favicon.png' || pathname === '/favicon.ico') {
      try {
        const res = await fetch(BRAND_PNG_URL, {
          cf: { cacheTtl: 86400, cacheEverything: true }
        });
        if (!res.ok) throw new Error('fetch failed');
        return new Response(res.body, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=86400, immutable',
          },
        });
      } catch (e) {
        return new Response('Brand image not found', { status: 404 });
      }
    }
    
    // 1. 정적 페이지 매칭
    if (staticRoutes[pathname]) {
      return new Response(staticRoutes[pathname], {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=0, must-revalidate',
        },
      });
    }
    
    // 2. 지역 페이지 라우팅 (NEW!)
    const regionMatch = pathname.match(/^\/region\/([^/]+)(?:\/([^/]+))?(?:\/([^/]+))?(?:\/([^/]+))?$/);
    
    if (regionMatch) {
      const [, sidoUrl, p2, p3, p4] = regionMatch;
      let html = null;
      
      if (p4) {
        // /region/seoul/강남구/역삼동/card-3inch
        html = buildDongProductPage(sidoUrl, p2, p3, p4);
      } else if (p3) {
        if (PRODUCTS[p3]) {
          // /region/seoul/강남구/card-3inch (시군구×제품 NEW!)
          html = buildGuProductPage(sidoUrl, p2, p3);
        } else {
          // /region/seoul/강남구/역삼동
          html = buildDongPage(sidoUrl, p2, p3);
        }
      } else if (p2) {
        if (PRODUCTS[p2]) {
          // /region/seoul/card-3inch (시도×제품 NEW!)
          html = buildSidoProductPage(sidoUrl, p2);
        } else {
          // /region/seoul/강남구
          html = buildGuPage(sidoUrl, p2);
        }
      } else if (sidoUrl) {
        // /region/seoul
        html = buildSidoPage(sidoUrl);
      }
      
      if (html) {
        return new Response(html, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=0, must-revalidate',
          },
        });
      }
    }
    
    // 3. sitemap.xml (SEO용)
    if (pathname === '/sitemap.xml') {
      return buildSitemap(url.origin);
    }
    
    // 4. robots.txt
    if (pathname === '/robots.txt') {
      return new Response(`User-agent: *
Allow: /
Sitemap: ${url.origin}/sitemap.xml`, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
    
    // 5. IndexNow 키 파일 (검색엔진이 키 검증할 때 호출)
    const INDEXNOW_KEY = 'f95d74402931badac3c77041bf1d953d';
    if (pathname === `/${INDEXNOW_KEY}.txt`) {
      return new Response(INDEXNOW_KEY, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
    
    // 6. IndexNow 수동 제출 엔드포인트 (관리자가 호출하면 검색엔진에 사이트맵 URL 일괄 전송)
    if (pathname === '/api/indexnow-submit') {
      return await submitToIndexNow(url.origin, INDEXNOW_KEY);
    }
    
    // 7. 404
    return new Response(PAGE_NOT_FOUND, {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  },
};

// ============================================================
// IndexNow 제출 (검색엔진에 페이지 변경 알림)
// ============================================================

async function submitToIndexNow(origin, key) {
  // 주요 페이지 URL 목록 (정적 페이지 + 시도 17개 + 시도×제품 일부)
  const host = origin.replace(/^https?:\/\//, '');
  const urls = [
    `${origin}/`,
    `${origin}/product/pos`,
    `${origin}/product/card-2inch`,
    `${origin}/product/card-3inch`,
    `${origin}/product/card-toss`,
    `${origin}/product/card-wireless`,
    `${origin}/product/card-bluetooth`,
    `${origin}/product/kiosk`,
    `${origin}/product/kiosk-mini`,
    `${origin}/product/tableorder`,
    `${origin}/product/removal`,
  ];
  
  // 시도 17개
  for (const sidoUrl in REGIONS) {
    urls.push(`${origin}/region/${sidoUrl}`);
    // 시도×제품도 일부 포함 (전체는 너무 많음)
    for (const productKey of ['pos', 'card-2inch', 'kiosk']) {
      urls.push(`${origin}/region/${sidoUrl}/${productKey}`);
    }
  }
  
  // IndexNow는 한 번에 최대 10,000개 URL 가능, 주요 페이지만 보내기 (현재 ~70개)
  const payload = {
    host: host,
    key: key,
    keyLocation: `${origin}/${key}.txt`,
    urlList: urls
  };
  
  try {
    // 여러 검색엔진 동시 제출
    const endpoints = [
      'https://api.indexnow.org/indexnow',
      'https://www.bing.com/indexnow',
      'https://yandex.com/indexnow',
      'https://searchadvisor.naver.com/indexnow'
    ];
    
    const results = [];
    for (const endpoint of endpoints) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify(payload)
        });
        results.push({
          endpoint: endpoint,
          status: res.status,
          ok: res.ok
        });
      } catch (e) {
        results.push({
          endpoint: endpoint,
          error: e.message
        });
      }
    }
    
    return new Response(JSON.stringify({
      success: true,
      submitted: urls.length,
      results: results,
      message: `${urls.length}개 URL을 IndexNow에 제출했습니다.`
    }, null, 2), {
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
}

// ============================================================
// 사이트맵 생성 (검색엔진용)
// ============================================================

function buildSitemap(origin) {
  let urls = [
    `${origin}/`,
    `${origin}/product/pos`,
    `${origin}/product/card-2inch`,
    `${origin}/product/card-3inch`,
    `${origin}/product/card-toss`,
    `${origin}/product/card-wireless`,
    `${origin}/product/card-bluetooth`,
    `${origin}/product/kiosk`,
    `${origin}/product/kiosk-mini`,
    `${origin}/product/tableorder`,
    `${origin}/product/removal`,
  ];
  
  // 시도 + 시군구만 사이트맵에 포함 (동 단위는 너무 많음)
  for (const sidoUrl in REGIONS) {
    urls.push(`${origin}/region/${sidoUrl}`);
    for (const gu of Object.keys(REGIONS[sidoUrl].gus)) {
      urls.push(`${origin}/region/${sidoUrl}/${encodeURIComponent(gu)}`);
    }
  }
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `<url><loc>${u}</loc></url>`).join('\n')}
</urlset>`;
  
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
}

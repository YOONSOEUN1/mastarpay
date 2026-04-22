// ============================================================
// 마스터페이 - Cloudflare Workers 통합 파일
// 모든 페이지(메인 + 제품 10개 + 404)를 이 파일 하나로 서빙
// ============================================================

const PAGE_HOME = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>마스터페이 | 카드단말기·포스기·키오스크 전문</title>
    <meta name="description" content="카드단말기, 포스기, 키오스크, 테이블오더, 철거까지. 매장 운영에 필요한 모든 장비를 한 번에 설치합니다.">
    <meta property="og:title" content="마스터페이 | 카드단말기·포스기·키오스크 전문">
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
html { scroll-behavior: smooth; }

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
    position: sticky;
    top: 0;
    background: var(--cream);
    z-index: 100;
    border-bottom: 1px solid var(--border);
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
        
        .visual-card .icon-big {
            font-size: 40px;
            margin-bottom: 16px;
        }
        
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
        
        .scroll-hint {
            margin-top: 80px;
            display: flex;
            align-items: center;
            gap: 16px;
            font-size: 13px;
            color: var(--ink-soft);
            letter-spacing: 0.2em;
            text-transform: uppercase;
        }
        
        .scroll-line {
            width: 60px;
            height: 1px;
            background: var(--ink-soft);
        }
        
        section.main-section {
            padding: 120px 0;
        }
        
        /* 제품 카테고리 그리드 */
        .category-tabs {
            display: flex;
            gap: 8px;
            margin-bottom: 40px;
            flex-wrap: wrap;
        }
        
        .category-tab {
            padding: 10px 20px;
            border-radius: 100px;
            background: var(--cream-dark);
            border: 1px solid var(--border);
            font-size: 14px;
            font-weight: 500;
            color: var(--ink-soft);
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .category-tab.active {
            background: var(--ink);
            color: var(--cream);
            border-color: var(--ink);
        }
        
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
        
        /* 철학 섹션 */
        .philosophy {
            background: var(--cream-dark);
            border-top: 1px solid var(--border);
            border-bottom: 1px solid var(--border);
        }
        
        .philosophy-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 2px;
            background: var(--border);
            border: 1px solid var(--border);
            border-radius: 24px;
            overflow: hidden;
        }
        
        .phil-item {
            background: var(--cream);
            padding: 40px 32px;
            transition: background 0.3s;
        }
        
        .phil-item:hover {
            background: var(--cream-dark);
        }
        
        .phil-icon {
            font-size: 36px;
            margin-bottom: 24px;
            display: inline-block;
        }
        
        .phil-label {
            font-family: 'Fraunces', serif;
            font-style: italic;
            font-size: 14px;
            color: var(--coral);
            margin-bottom: 8px;
        }
        
        .phil-title {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 12px;
            letter-spacing: -0.01em;
        }
        
        .phil-desc {
            font-size: 15px;
            color: var(--ink-soft);
            line-height: 1.6;
        }
        
        /* 프로세스 */
        .process-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 24px;
            position: relative;
        }
        
        .process-step {
            position: relative;
            padding: 32px 0;
        }
        
        .process-number {
            font-family: 'Fraunces', serif;
            font-style: italic;
            font-size: 72px;
            line-height: 1;
            color: var(--forest);
            margin-bottom: 20px;
            display: block;
        }
        
        .process-title {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .process-desc {
            font-size: 14px;
            color: var(--ink-soft);
            line-height: 1.6;
        }
        
        /* 후기 */
        .testimonial-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 24px;
        }
        
        .testimonial {
            padding: 40px 32px;
            border: 1px solid var(--border);
            border-radius: 24px;
            background: var(--cream);
            transition: all 0.3s;
        }
        
        .testimonial:hover {
            background: var(--cream-dark);
            transform: translateY(-2px);
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
        
        .author-name {
            font-weight: 600;
            font-size: 14px;
        }
        
        .author-role {
            font-size: 13px;
            color: var(--ink-soft);
        }
        
        /* FAQ */
        .faq-list {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .faq-item {
            border-bottom: 1px solid var(--border);
            padding: 24px 0;
            cursor: pointer;
        }
        
        .faq-item:first-child {
            border-top: 1px solid var(--border);
        }
        
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
        
        .faq-item.open .faq-toggle {
            transform: rotate(45deg);
        }
        
        .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease, padding 0.3s;
            color: var(--ink-soft);
            font-size: 15px;
            line-height: 1.7;
        }
        
        .faq-item.open .faq-answer {
            max-height: 300px;
            padding-top: 16px;
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
            section.main-section { padding: 80px 0; }
        }
    </style>
</head>
<body>

    <!-- 헤더 -->
    <header>
        <nav class="nav">
            <a href="/" class="logo">
                <span class="logo-mark">✦</span>
                마스터페이
            </a>
            
            <ul class="nav-menu" id="navMenu">
                <li><a href="#philosophy">철학</a></li>
                <li><a href="#products">제품</a></li>
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
                        매장 운영에 필요한<br>
                        <span class="italic">모든 장비</span>를<br>
                        <span class="accent">한 번에</span>.
                    </h1>
                    
                    <p class="hero-sub">
                        카드단말기, 포스기, 키오스크, 테이블오더, 철거까지.
                        매장에 필요한 모든 장비를 한 곳에서 설치부터 A/S까지 책임집니다.
                    </p>
                    
                    <div class="hero-actions">
                        <a href="#contact" class="btn btn-primary">
                            무료 상담 신청 →
                        </a>
                        <a href="#products" class="btn btn-ghost">
                            제품 둘러보기
                        </a>
                    </div>
                    
                    <div class="scroll-hint">
                        <span>SCROLL</span>
                        <span class="scroll-line"></span>
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

    <!-- 01 · 철학 -->
    <section class="main-section philosophy" id="philosophy">
        <div class="container">
            <div class="section-header">
                <span class="section-num">01 / Philosophy</span>
                <h2 class="section-title">
                    우리는 <span class="italic">다르게</span> 생각합니다.
                </h2>
            </div>
            
            <div class="philosophy-grid">
                <div class="phil-item">
                    <div class="phil-icon">🎯</div>
                    <div class="phil-label">Our Principle</div>
                    <h3 class="phil-title">본질에 집중합니다</h3>
                    <p class="phil-desc">화려한 포장보다 고객이 진짜 필요로 하는 것에 집중합니다.</p>
                </div>
                
                <div class="phil-item">
                    <div class="phil-icon">🤝</div>
                    <div class="phil-label">Our Promise</div>
                    <h3 class="phil-title">끝까지 책임집니다</h3>
                    <p class="phil-desc">시작부터 마무리, 그리고 그 이후까지 함께합니다.</p>
                </div>
                
                <div class="phil-item">
                    <div class="phil-icon">💡</div>
                    <div class="phil-label">Our Process</div>
                    <h3 class="phil-title">투명하게 일합니다</h3>
                    <p class="phil-desc">모든 과정을 열어두고 고객과 함께 만들어갑니다.</p>
                </div>
                
                <div class="phil-item">
                    <div class="phil-icon">🌱</div>
                    <div class="phil-label">Our Vision</div>
                    <h3 class="phil-title">꾸준히 성장합니다</h3>
                    <p class="phil-desc">어제보다 나은 오늘, 오늘보다 나은 내일을 만듭니다.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 02 · 제품 (클릭해서 상세 페이지로!) -->
    <section class="main-section" id="products">
        <div class="container">
            <div class="section-header">
                <span class="section-num">02 / Products</span>
                <h2 class="section-title">
                    매장에 필요한 <span class="italic">모든 장비.</span>
                </h2>
            </div>
            
            <div class="products-grid">
                <!-- 포스기 -->
                <a href="/product/pos" class="product-card">
                    <div>
                        <div class="card-icon">🖥️</div>
                        <div class="card-tag">POS System</div>
                        <h3 class="card-title">포스기</h3>
                        <p class="card-desc">주문·결제·매출·재고 통합 관리 시스템</p>
                    </div>
                    <div class="card-arrow">→</div>
                </a>
                
                <!-- 2인치 단말기 -->
                <a href="/product/card-2inch" class="product-card">
                    <div>
                        <div class="card-icon" style="background-image: url(https://raw.githubusercontent.com/YOONSOEUN1/mastarpay/main/images/kis2200_2in.jpg); background-size: cover; background-position: center; width: 100%; height: 180px; margin: -32px -32px 20px -32px; border-radius: 24px 24px 0 0;"></div>
                        <div class="card-tag">Compact</div>
                        <h3 class="card-title">2인치 단말기</h3>
                        <p class="card-desc">공간 절약형 컴팩트 카드 단말기</p>
                    </div>
                    <div class="card-arrow">→</div>
                </a>
                
                <!-- 3인치 단말기 -->
                <a href="/product/card-3inch" class="product-card">
                    <div>
                        <div class="card-icon" style="background-image: url(https://raw.githubusercontent.com/YOONSOEUN1/mastarpay/main/images/kis1420_3in2.jpg); background-size: cover; background-position: center; width: 100%; height: 180px; margin: -32px -32px 20px -32px; border-radius: 24px 24px 0 0;"></div>
                        <div class="card-tag">Standard</div>
                        <h3 class="card-title">3인치 단말기</h3>
                        <p class="card-desc">가장 많이 쓰이는 표준 카드 단말기</p>
                    </div>
                    <div class="card-arrow">→</div>
                </a>
                
                <!-- 토스 단말기 -->
                <a href="/product/card-toss" class="product-card">
                    <div>
                        <div class="card-icon">⚡</div>
                        <div class="card-tag">Toss</div>
                        <h3 class="card-title">토스 단말기</h3>
                        <p class="card-desc">토스페이먼츠 연동 간편결제 특화</p>
                    </div>
                    <div class="card-arrow">→</div>
                </a>
                
                <!-- 무선 단말기 -->
                <a href="/product/card-wireless" class="product-card">
                    <div>
                        <div class="card-icon">📱</div>
                        <div class="card-tag">Wireless</div>
                        <h3 class="card-title">무선 단말기</h3>
                        <p class="card-desc">이동 결제·배달·테이블 어디서든</p>
                    </div>
                    <div class="card-arrow">→</div>
                </a>
                
                <!-- 블루투스 단말기 -->
                <a href="/product/card-bluetooth" class="product-card">
                    <div>
                        <div class="card-icon">🔷</div>
                        <div class="card-tag">Bluetooth</div>
                        <h3 class="card-title">블루투스 단말기</h3>
                        <p class="card-desc">스마트폰 연동 초소형 휴대 결제</p>
                    </div>
                    <div class="card-arrow">→</div>
                </a>
                
                <!-- 키오스크 -->
                <a href="/product/kiosk" class="product-card">
                    <div>
                        <div class="card-icon" style="background-image: url(https://raw.githubusercontent.com/YOONSOEUN1/mastarpay/main/images/Kiosk.png); background-size: cover; background-position: center; width: 100%; height: 180px; margin: -32px -32px 20px -32px; border-radius: 24px 24px 0 0;"></div>
                        <div class="card-tag">Kiosk</div>
                        <h3 class="card-title">키오스크</h3>
                        <p class="card-desc">대형 무인 주문·결제 시스템</p>
                    </div>
                    <div class="card-arrow">→</div>
                </a>
                
                <!-- 미니 키오스크 -->
                <a href="/product/kiosk-mini" class="product-card">
                    <div>
                        <div class="card-icon" style="background-image: url(https://raw.githubusercontent.com/YOONSOEUN1/mastarpay/main/images/Kiosk2.png); background-size: cover; background-position: center; width: 100%; height: 180px; margin: -32px -32px 20px -32px; border-radius: 24px 24px 0 0;"></div>
                        <div class="card-tag">Mini Kiosk</div>
                        <h3 class="card-title">미니 키오스크</h3>
                        <p class="card-desc">소형 매장 전용 공간 절약형</p>
                    </div>
                    <div class="card-arrow">→</div>
                </a>
                
                <!-- 테이블오더 -->
                <a href="/product/tableorder" class="product-card">
                    <div>
                        <div class="card-icon">📋</div>
                        <div class="card-tag">Table Order</div>
                        <h3 class="card-title">테이블 오더</h3>
                        <p class="card-desc">QR·태블릿 주문으로 인건비 절감</p>
                    </div>
                    <div class="card-arrow">→</div>
                </a>
                
                <!-- 철거 -->
                <a href="/product/removal" class="product-card">
                    <div>
                        <div class="card-icon">🔨</div>
                        <div class="card-tag">Removal</div>
                        <h3 class="card-title">매장 철거</h3>
                        <p class="card-desc">철거부터 원상복구까지 원스톱</p>
                    </div>
                    <div class="card-arrow">→</div>
                </a>
            </div>
        </div>
    </section>

    <!-- 03 · 프로세스 -->
    <section class="main-section philosophy" id="process">
        <div class="container">
            <div class="section-header">
                <span class="section-num">03 / Process</span>
                <h2 class="section-title">
                    <span class="italic">어떻게</span> 진행되나요?
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

    <!-- 04 · 고객 후기 -->
    <section class="main-section">
        <div class="container">
            <div class="section-header">
                <span class="section-num">04 / Voices</span>
                <h2 class="section-title">
                    고객의 <span class="italic">목소리</span>를 들어보세요.
                </h2>
            </div>
            
            <div class="testimonial-list">
                <div class="testimonial">
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
            </div>
        </div>
    </section>

    <!-- 05 · FAQ -->
    <section class="main-section philosophy" id="faq">
        <div class="container">
            <div class="section-header">
                <span class="section-num">05 / FAQ</span>
                <h2 class="section-title">
                    자주 묻는 <span class="italic">질문들.</span>
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

    <!-- CTA -->
    <section class="cta" id="contact">
        <div class="container">
            <div class="cta-content">
                <div class="cta-label">— Let's Talk —</div>
                <h2>
                    지금 바로<br>
                    <span class="italic">시작해볼까요?</span>
                </h2>
                
                <a href="tel:010-2337-0458" class="cta-phone">
                    📞 010-2337-0458
                </a>
                
                <div class="cta-note">
                    평일 09:00 – 18:00 · 카카오톡 상담도 가능합니다
                </div>
            </div>
        </div>
    </section>

    <!-- 푸터 -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="logo">
                        <span class="logo-mark">✦</span>
                        마스터페이
                    </div>
                    <p>매장 운영에 필요한 모든 장비<br>설치부터 A/S까지 한번에.</p>
                </div>
                
                <div class="footer-col">
                    <h4>카드단말기</h4>
                    <ul>
                        <li><a href="/product/card-2inch">2인치 단말기</a></li>
                        <li><a href="/product/card-3inch">3인치 단말기</a></li>
                        <li><a href="/product/card-toss">토스 단말기</a></li>
                        <li><a href="/product/card-wireless">무선 단말기</a></li>
                        <li><a href="/product/card-bluetooth">블루투스 단말기</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h4>제품</h4>
                    <ul>
                        <li><a href="/product/pos">포스기</a></li>
                        <li><a href="/product/kiosk">키오스크</a></li>
                        <li><a href="/product/kiosk-mini">미니 키오스크</a></li>
                        <li><a href="/product/tableorder">테이블오더</a></li>
                        <li><a href="/product/removal">철거</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="tel:010-2337-0458">📞 010-2337-0458</a></li>
                        <li><a href="#">💬 카카오톡 상담</a></li>
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
        
        function toggleFaq(item) {
            item.classList.toggle('open');
        }
        
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                document.getElementById('navMenu').classList.remove('active');
            });
        });
    </script>

</body>
</html>
`;

const PAGE_NOT_FOUND = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
html { scroll-behavior: smooth; }

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
    position: sticky;
    top: 0;
    background: var(--cream);
    z-index: 100;
    border-bottom: 1px solid var(--border);
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
    </style>
</head>
<body>
    <header>
        <nav class="nav">
            <a href="/" class="logo">
                <span class="logo-mark">✦</span>
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>포스기 POS 시스템 | 마스터페이</title>
    <meta name="description" content="주문, 결제, 매출 관리까지 한 번에. 매장 운영의 모든 것을 하나의 시스템으로 통합하여 업무 효율을 극대화합니다.">
    <meta property="og:title" content="포스기 POS 시스템 | 마스터페이">
    <meta property="og:description" content="주문, 결제, 매출 관리까지 한 번에. 매장 운영의 모든 것을 하나의 시스템으로 통합하여 업무 효율을 극대화합니다.">
    
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
html { scroll-behavior: smooth; }

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
    position: sticky;
    top: 0;
    background: var(--cream);
    z-index: 100;
    border-bottom: 1px solid var(--border);
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
</style>
</head>
<body>

    <!-- 헤더 -->
    <header>
        <nav class="nav">
            <a href="/" class="logo">
                <span class="logo-mark">✦</span>
                마스터페이
            </a>
            
            <ul class="nav-menu" id="navMenu">
                <li><a href="/#philosophy">철학</a></li>
                <li><a href="/#services">서비스</a></li>
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
            <!-- 브레드크럼 -->
            <div class="breadcrumb">
                <a href="/">홈</a>
                <span class="breadcrumb-separator">/</span>
                <a href="/#services">제품</a>
                <span class="breadcrumb-separator">/</span>
                <span>포스기 POS 시스템</span>
            </div>
            
            <div class="product-grid">
                <div class="product-info">
                    <span class="product-badge">매장 필수</span>
                    <h1 class="product-title">
                        포스기<span class="italic"> POS</span> 시스템
                    </h1>
                    <p class="product-lead">주문, 결제, 매출 관리까지 한 번에. 매장 운영의 모든 것을 하나의 시스템으로 통합하여 업무 효율을 극대화합니다.</p>
                    
                    <div class="product-specs">
                    <div class="spec-item">
                        <div class="spec-label">Type</div>
                        <div class="spec-value">통합 관리 시스템</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Setup</div>
                        <div class="spec-value">맞춤 설치</div>
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
                
                <!-- 제품 이미지 영역 (이모지 또는 이미지) -->
                <div class="product-visual">
                    🖥️
                    <!-- 이미지 사용시: <img src="../images/파일명.jpg" alt="포스기"> -->
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
                    이런 <span class="italic">특징이</span> 있어요.
                </h2>
            </div>
            
            <div class="feature-grid">
                <div class="feature-item">
                    <div class="feature-icon">📊</div>
                    <h3 class="feature-title">통합 매출 관리</h3>
                    <p class="feature-desc">일별·월별 매출을 자동으로 리포트로 받아보실 수 있습니다. 세무 신고도 간편해져요.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🍽️</div>
                    <h3 class="feature-title">메뉴·재고 관리</h3>
                    <p class="feature-desc">메뉴 추가·수정과 재고 관리를 실시간으로. 품절 알림까지 자동으로 받아보세요.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">💳</div>
                    <h3 class="feature-title">다양한 결제 연동</h3>
                    <p class="feature-desc">카드, 현금, 간편결제, 배달앱까지 모든 결제 수단이 하나의 시스템에 통합됩니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🔌</div>
                    <h3 class="feature-title">원격 지원</h3>
                    <p class="feature-desc">장애가 발생하면 원격으로 즉시 해결. 매장 방문 없이도 빠르게 문제를 해결합니다.</p>
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
                    <span class="italic">자세히</span> 알아보기.
                </h2>
            </div>
            
            <div class="detail-content">
                
                <h3>어떤 매장에 적합한가요?</h3>
                <p>포스기는 주문이 빈번하고 매출 관리가 필요한 모든 매장에 적합합니다. 음식점, 카페, 편의점, 베이커리, 분식집 등 업종에 상관없이 사용할 수 있습니다.</p>
                
                <h3>이런 분들께 추천드려요</h3>
                <ul>
                    <li>매출 데이터를 체계적으로 관리하고 싶은 사장님</li>
                    <li>배달앱, 오프라인 결제를 통합 관리하고 싶은 분</li>
                    <li>세무 관리를 간편하게 하고 싶은 자영업자</li>
                    <li>직원 관리와 근태 확인이 필요한 매장</li>
                    <li>메뉴·재고를 실시간으로 파악하고 싶은 사장님</li>
                </ul>
                
                <h3>설치 과정이 궁금하다면</h3>
                <p>전화나 폼으로 상담을 신청하시면, 매장 업종과 규모에 맞는 최적의 포스기를 추천해드립니다. 상담 후 빠른 설치가 가능하며, 직원 교육까지 함께 진행해드려요.</p>
                
                <h3>A/S는 어떻게 받나요?</h3>
                <p>장애 발생 시 전화 한 통이면 됩니다. 대부분의 문제는 원격 지원으로 즉시 해결되며, 하드웨어 문제는 엔지니어가 직접 방문하여 처리해드립니다.</p>
        
            </div>
        </div>
    </section>

    <!-- 관련 제품 -->
    <section class="related">
        <div class="container">
            <div class="section-header">
                <span class="section-num">03 / Related</span>
                <h2 class="section-title">
                    다른 <span class="italic">제품도</span> 둘러보세요.
                </h2>
            </div>
            
            <div class="related-grid">
                <a href="/product/card-3inch" class="related-card">
                    <div class="related-icon">🖨️</div>
                    <div class="related-name">3인치 단말기</div>
                    <div class="related-desc">표준 사이즈 카드 단말기</div>
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
    <section class="cta" id="contact">
        <div class="container">
            <div class="cta-content">
                <div class="cta-label">— Let's Talk —</div>
                <h2>
                    지금 바로<br>
                    <span class="italic">상담 받아보세요.</span>
                </h2>
                
                <a href="tel:010-2337-0458" class="cta-phone">
                    📞 010-2337-0458
                </a>
                
                <div class="cta-note">
                    평일 09:00 – 18:00 · 카카오톡 상담도 가능합니다
                </div>
            </div>
        </div>
    </section>

    <!-- 푸터 -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="logo">
                        <span class="logo-mark">✦</span>
                        마스터페이
                    </div>
                    <p>매장 운영에 필요한 모든 장비<br>설치부터 A/S까지 한번에.</p>
                </div>
                
                <div class="footer-col">
                    <h4>카드단말기</h4>
                    <ul>
                        <li><a href="/product/card-2inch">2인치 단말기</a></li>
                        <li><a href="/product/card-3inch">3인치 단말기</a></li>
                        <li><a href="/product/card-toss">토스 단말기</a></li>
                        <li><a href="/product/card-wireless">무선 단말기</a></li>
                        <li><a href="/product/card-bluetooth">블루투스 단말기</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h4>제품</h4>
                    <ul>
                        <li><a href="/product/pos">포스기</a></li>
                        <li><a href="/product/kiosk">키오스크</a></li>
                        <li><a href="/product/kiosk-mini">미니 키오스크</a></li>
                        <li><a href="/product/tableorder">테이블오더</a></li>
                        <li><a href="/product/removal">철거</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="tel:010-2337-0458">📞 010-2337-0458</a></li>
                        <li><a href="#">💬 카카오톡 상담</a></li>
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
    </script>

</body>
</html>
`;

const PAGE_CARD_2INCH = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>2인치 컴팩트 단말기 | 마스터페이</title>
    <meta name="description" content="작은 크기에 강력한 성능. 좁은 카운터 공간에도 깔끔하게 들어가는 2인치 카드 단말기입니다.">
    <meta property="og:title" content="2인치 컴팩트 단말기 | 마스터페이">
    <meta property="og:description" content="작은 크기에 강력한 성능. 좁은 카운터 공간에도 깔끔하게 들어가는 2인치 카드 단말기입니다.">
    
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
html { scroll-behavior: smooth; }

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
    position: sticky;
    top: 0;
    background: var(--cream);
    z-index: 100;
    border-bottom: 1px solid var(--border);
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
</style>
</head>
<body>

    <!-- 헤더 -->
    <header>
        <nav class="nav">
            <a href="/" class="logo">
                <span class="logo-mark">✦</span>
                마스터페이
            </a>
            
            <ul class="nav-menu" id="navMenu">
                <li><a href="/#philosophy">철학</a></li>
                <li><a href="/#services">서비스</a></li>
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
            <!-- 브레드크럼 -->
            <div class="breadcrumb">
                <a href="/">홈</a>
                <span class="breadcrumb-separator">/</span>
                <a href="/#services">제품</a>
                <span class="breadcrumb-separator">/</span>
                <span>2인치 컴팩트 단말기</span>
            </div>
            
            <div class="product-grid">
                <div class="product-info">
                    <span class="product-badge">카드단말기</span>
                    <h1 class="product-title">
                        2인치 <span class="italic">컴팩트</span> 단말기
                    </h1>
                    <p class="product-lead">작은 크기에 강력한 성능. 좁은 카운터 공간에도 깔끔하게 들어가는 2인치 카드 단말기입니다.</p>
                    
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
                        <div class="spec-value">KIS2200 외</div>
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
                
                <!-- 제품 이미지 영역 (이모지 또는 이미지) -->
                <div class="product-visual">
                    <img src="https://raw.githubusercontent.com/YOONSOEUN1/mastarpay/main/images/kis2200_2in.jpg" alt="2인치 단말기" style="width: 100%; height: 100%; object-fit: cover;">
                    <!-- 이미지 사용시: <img src="../images/파일명.jpg" alt="2인치 "> -->
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
                    이런 <span class="italic">특징이</span> 있어요.
                </h2>
            </div>
            
            <div class="feature-grid">
                <div class="feature-item">
                    <div class="feature-icon">📏</div>
                    <h3 class="feature-title">공간 절약형</h3>
                    <p class="feature-desc">작은 크기로 좁은 카운터에도 깔끔하게 설치됩니다. 공간이 부족한 매장에 딱이에요.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">⚡</div>
                    <h3 class="feature-title">빠른 결제 속도</h3>
                    <p class="feature-desc">고성능 프로세서로 결제 대기 시간을 최소화. 손님을 오래 기다리게 하지 않습니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">💳</div>
                    <h3 class="feature-title">모든 카드 지원</h3>
                    <p class="feature-desc">IC·마그네틱·컨택리스까지 모든 결제 방식을 지원하며, 삼성페이·카카오페이도 OK.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🔋</div>
                    <h3 class="feature-title">안정적인 전력</h3>
                    <p class="feature-desc">유선 타입은 안정적인 전원 공급으로 끊김 없이 사용 가능합니다.</p>
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
                    <span class="italic">자세히</span> 알아보기.
                </h2>
            </div>
            
            <div class="detail-content">
                
                <h3>2인치 단말기의 매력</h3>
                <p>2인치 단말기는 컴팩트한 크기가 가장 큰 장점입니다. 공간이 좁은 편의점, 소규모 카페, 분식집 등에서 인기가 많습니다. 작지만 필요한 기능은 모두 갖추고 있어요.</p>
                
                <h3>이런 매장에 추천해요</h3>
                <ul>
                    <li>카운터 공간이 협소한 편의점·매점</li>
                    <li>깔끔한 디자인을 원하는 카페·베이커리</li>
                    <li>이동 없이 고정된 위치에서만 결제하는 매장</li>
                    <li>고객 대면 결제가 주된 업종</li>
                </ul>
                
                <h3>무선 모델도 있나요?</h3>
                <p>네, 2인치 사이즈에도 무선 모델이 있습니다. 배달이나 테이블 결제가 필요한 경우 무선 모델을 추천드려요. 상담 시 매장 상황을 알려주시면 가장 적합한 모델을 안내해드립니다.</p>
        
            </div>
        </div>
    </section>

    <!-- 관련 제품 -->
    <section class="related">
        <div class="container">
            <div class="section-header">
                <span class="section-num">03 / Related</span>
                <h2 class="section-title">
                    다른 <span class="italic">제품도</span> 둘러보세요.
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
    <section class="cta" id="contact">
        <div class="container">
            <div class="cta-content">
                <div class="cta-label">— Let's Talk —</div>
                <h2>
                    지금 바로<br>
                    <span class="italic">상담 받아보세요.</span>
                </h2>
                
                <a href="tel:010-2337-0458" class="cta-phone">
                    📞 010-2337-0458
                </a>
                
                <div class="cta-note">
                    평일 09:00 – 18:00 · 카카오톡 상담도 가능합니다
                </div>
            </div>
        </div>
    </section>

    <!-- 푸터 -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="logo">
                        <span class="logo-mark">✦</span>
                        마스터페이
                    </div>
                    <p>매장 운영에 필요한 모든 장비<br>설치부터 A/S까지 한번에.</p>
                </div>
                
                <div class="footer-col">
                    <h4>카드단말기</h4>
                    <ul>
                        <li><a href="/product/card-2inch">2인치 단말기</a></li>
                        <li><a href="/product/card-3inch">3인치 단말기</a></li>
                        <li><a href="/product/card-toss">토스 단말기</a></li>
                        <li><a href="/product/card-wireless">무선 단말기</a></li>
                        <li><a href="/product/card-bluetooth">블루투스 단말기</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h4>제품</h4>
                    <ul>
                        <li><a href="/product/pos">포스기</a></li>
                        <li><a href="/product/kiosk">키오스크</a></li>
                        <li><a href="/product/kiosk-mini">미니 키오스크</a></li>
                        <li><a href="/product/tableorder">테이블오더</a></li>
                        <li><a href="/product/removal">철거</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="tel:010-2337-0458">📞 010-2337-0458</a></li>
                        <li><a href="#">💬 카카오톡 상담</a></li>
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
    </script>

</body>
</html>
`;

const PAGE_CARD_3INCH = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3인치 스탠다드 단말기 | 마스터페이</title>
    <meta name="description" content="큰 화면으로 보기 편하고, 영수증도 선명하게. 가장 많이 사용되는 표준 사이즈 카드 단말기입니다.">
    <meta property="og:title" content="3인치 스탠다드 단말기 | 마스터페이">
    <meta property="og:description" content="큰 화면으로 보기 편하고, 영수증도 선명하게. 가장 많이 사용되는 표준 사이즈 카드 단말기입니다.">
    
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
html { scroll-behavior: smooth; }

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
    position: sticky;
    top: 0;
    background: var(--cream);
    z-index: 100;
    border-bottom: 1px solid var(--border);
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
</style>
</head>
<body>

    <!-- 헤더 -->
    <header>
        <nav class="nav">
            <a href="/" class="logo">
                <span class="logo-mark">✦</span>
                마스터페이
            </a>
            
            <ul class="nav-menu" id="navMenu">
                <li><a href="/#philosophy">철학</a></li>
                <li><a href="/#services">서비스</a></li>
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
            <!-- 브레드크럼 -->
            <div class="breadcrumb">
                <a href="/">홈</a>
                <span class="breadcrumb-separator">/</span>
                <a href="/#services">제품</a>
                <span class="breadcrumb-separator">/</span>
                <span>3인치 스탠다드 단말기</span>
            </div>
            
            <div class="product-grid">
                <div class="product-info">
                    <span class="product-badge">카드단말기</span>
                    <h1 class="product-title">
                        3인치 <span class="italic">스탠다드</span> 단말기
                    </h1>
                    <p class="product-lead">큰 화면으로 보기 편하고, 영수증도 선명하게. 가장 많이 사용되는 표준 사이즈 카드 단말기입니다.</p>
                    
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
                
                <!-- 제품 이미지 영역 (이모지 또는 이미지) -->
                <div class="product-visual">
                    <img src="https://raw.githubusercontent.com/YOONSOEUN1/mastarpay/main/images/kis1420_3in2.jpg" alt="3인치 단말기" style="width: 100%; height: 100%; object-fit: cover;">
                    <!-- 이미지 사용시: <img src="../images/파일명.jpg" alt="3인치 "> -->
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
                    이런 <span class="italic">특징이</span> 있어요.
                </h2>
            </div>
            
            <div class="feature-grid">
                <div class="feature-item">
                    <div class="feature-icon">🖨️</div>
                    <h3 class="feature-title">선명한 영수증 출력</h3>
                    <p class="feature-desc">3인치 폭으로 영수증이 넉넉하게 출력되어 가독성이 좋고, 매출 증빙에도 유리합니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">📱</div>
                    <h3 class="feature-title">큰 화면 디스플레이</h3>
                    <p class="feature-desc">큰 화면으로 결제 금액과 내역을 한눈에 확인할 수 있어 실수를 줄여줍니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">💳</div>
                    <h3 class="feature-title">모든 결제 수단 지원</h3>
                    <p class="feature-desc">카드·삼성페이·카카오페이·제로페이까지, 다양한 결제 방식을 한 대로 처리합니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🔧</div>
                    <h3 class="feature-title">안정성과 내구성</h3>
                    <p class="feature-desc">오랜 시간 사용해도 안정적인 성능을 유지하는 검증된 모델들입니다.</p>
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
                    <span class="italic">자세히</span> 알아보기.
                </h2>
            </div>
            
            <div class="detail-content">
                
                <h3>가장 대중적인 카드 단말기</h3>
                <p>3인치 단말기는 가장 널리 사용되는 표준 사이즈입니다. 영수증 가독성과 화면 크기의 균형이 좋아 대부분의 업종에서 선택합니다.</p>
                
                <h3>이런 매장에 추천해요</h3>
                <ul>
                    <li>영수증 발행이 잦은 음식점·카페</li>
                    <li>현금영수증·세금계산서 발행이 필요한 업종</li>
                    <li>큰 화면으로 결제 내역을 확인하고 싶은 매장</li>
                    <li>일반적인 사이즈의 표준 단말기를 원하는 사장님</li>
                </ul>
                
                <h3>대표 모델</h3>
                <p>KIS1420, KIS1421, KPN1901 등 검증된 모델들을 취급합니다. 매장 상황과 예산에 맞는 최적의 모델을 추천해드려요.</p>
        
            </div>
        </div>
    </section>

    <!-- 관련 제품 -->
    <section class="related">
        <div class="container">
            <div class="section-header">
                <span class="section-num">03 / Related</span>
                <h2 class="section-title">
                    다른 <span class="italic">제품도</span> 둘러보세요.
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
    <section class="cta" id="contact">
        <div class="container">
            <div class="cta-content">
                <div class="cta-label">— Let's Talk —</div>
                <h2>
                    지금 바로<br>
                    <span class="italic">상담 받아보세요.</span>
                </h2>
                
                <a href="tel:010-2337-0458" class="cta-phone">
                    📞 010-2337-0458
                </a>
                
                <div class="cta-note">
                    평일 09:00 – 18:00 · 카카오톡 상담도 가능합니다
                </div>
            </div>
        </div>
    </section>

    <!-- 푸터 -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="logo">
                        <span class="logo-mark">✦</span>
                        마스터페이
                    </div>
                    <p>매장 운영에 필요한 모든 장비<br>설치부터 A/S까지 한번에.</p>
                </div>
                
                <div class="footer-col">
                    <h4>카드단말기</h4>
                    <ul>
                        <li><a href="/product/card-2inch">2인치 단말기</a></li>
                        <li><a href="/product/card-3inch">3인치 단말기</a></li>
                        <li><a href="/product/card-toss">토스 단말기</a></li>
                        <li><a href="/product/card-wireless">무선 단말기</a></li>
                        <li><a href="/product/card-bluetooth">블루투스 단말기</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h4>제품</h4>
                    <ul>
                        <li><a href="/product/pos">포스기</a></li>
                        <li><a href="/product/kiosk">키오스크</a></li>
                        <li><a href="/product/kiosk-mini">미니 키오스크</a></li>
                        <li><a href="/product/tableorder">테이블오더</a></li>
                        <li><a href="/product/removal">철거</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="tel:010-2337-0458">📞 010-2337-0458</a></li>
                        <li><a href="#">💬 카카오톡 상담</a></li>
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
    </script>

</body>
</html>
`;

const PAGE_CARD_TOSS = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>토스 Toss 단말기 | 마스터페이</title>
    <meta name="description" content="토스페이먼츠와 완벽하게 연동되는 전용 단말기. 간편결제와 일반 카드결제를 한 번에 처리합니다.">
    <meta property="og:title" content="토스 Toss 단말기 | 마스터페이">
    <meta property="og:description" content="토스페이먼츠와 완벽하게 연동되는 전용 단말기. 간편결제와 일반 카드결제를 한 번에 처리합니다.">
    
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
html { scroll-behavior: smooth; }

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
    position: sticky;
    top: 0;
    background: var(--cream);
    z-index: 100;
    border-bottom: 1px solid var(--border);
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
</style>
</head>
<body>

    <!-- 헤더 -->
    <header>
        <nav class="nav">
            <a href="/" class="logo">
                <span class="logo-mark">✦</span>
                마스터페이
            </a>
            
            <ul class="nav-menu" id="navMenu">
                <li><a href="/#philosophy">철학</a></li>
                <li><a href="/#services">서비스</a></li>
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
            <!-- 브레드크럼 -->
            <div class="breadcrumb">
                <a href="/">홈</a>
                <span class="breadcrumb-separator">/</span>
                <a href="/#services">제품</a>
                <span class="breadcrumb-separator">/</span>
                <span>토스 Toss 단말기</span>
            </div>
            
            <div class="product-grid">
                <div class="product-info">
                    <span class="product-badge">카드단말기</span>
                    <h1 class="product-title">
                        토스<span class="italic"> Toss</span> 단말기
                    </h1>
                    <p class="product-lead">토스페이먼츠와 완벽하게 연동되는 전용 단말기. 간편결제와 일반 카드결제를 한 번에 처리합니다.</p>
                    
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
                
                <!-- 제품 이미지 영역 (이모지 또는 이미지) -->
                <div class="product-visual">
                    ⚡
                    <!-- 이미지 사용시: <img src="../images/파일명.jpg" alt="토스"> -->
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
                    이런 <span class="italic">특징이</span> 있어요.
                </h2>
            </div>
            
            <div class="feature-grid">
                <div class="feature-item">
                    <div class="feature-icon">⚡</div>
                    <h3 class="feature-title">토스페이 즉시 결제</h3>
                    <p class="feature-desc">토스페이 사용 고객은 QR 스캔만으로 결제가 완료됩니다. 정말 빠른 결제 경험을 제공해요.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">💰</div>
                    <h3 class="feature-title">저렴한 수수료</h3>
                    <p class="feature-desc">토스페이먼츠의 경쟁력 있는 수수료로 결제 비용을 절감할 수 있습니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">📊</div>
                    <h3 class="feature-title">통합 정산</h3>
                    <p class="feature-desc">모든 결제 내역이 토스 대시보드에서 실시간으로 확인 가능해 정산이 간편합니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🎨</div>
                    <h3 class="feature-title">세련된 디자인</h3>
                    <p class="feature-desc">모던한 디자인으로 매장 분위기를 해치지 않고 오히려 세련미를 더해줍니다.</p>
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
                    <span class="italic">자세히</span> 알아보기.
                </h2>
            </div>
            
            <div class="detail-content">
                
                <h3>왜 토스 단말기일까요?</h3>
                <p>토스 단말기는 토스페이먼츠 고객에게 최적화된 결제 경험을 제공합니다. 토스페이 사용자가 많은 요즘, 간편결제 이용률이 높은 매장에서 특히 인기가 많습니다.</p>
                
                <h3>이런 매장에 추천해요</h3>
                <ul>
                    <li>젊은 층 고객이 많은 카페·디저트 가게</li>
                    <li>토스페이 사용자가 많은 트렌디한 매장</li>
                    <li>수수료 부담을 줄이고 싶은 소상공인</li>
                    <li>실시간 매출 대시보드를 활용하고 싶은 사장님</li>
                </ul>
                
                <h3>기존 카드결제도 되나요?</h3>
                <p>물론입니다. 토스페이뿐만 아니라 일반 신용카드, 체크카드, 다른 간편결제(삼성페이, 카카오페이 등)도 모두 지원합니다.</p>
        
            </div>
        </div>
    </section>

    <!-- 관련 제품 -->
    <section class="related">
        <div class="container">
            <div class="section-header">
                <span class="section-num">03 / Related</span>
                <h2 class="section-title">
                    다른 <span class="italic">제품도</span> 둘러보세요.
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
    <section class="cta" id="contact">
        <div class="container">
            <div class="cta-content">
                <div class="cta-label">— Let's Talk —</div>
                <h2>
                    지금 바로<br>
                    <span class="italic">상담 받아보세요.</span>
                </h2>
                
                <a href="tel:010-2337-0458" class="cta-phone">
                    📞 010-2337-0458
                </a>
                
                <div class="cta-note">
                    평일 09:00 – 18:00 · 카카오톡 상담도 가능합니다
                </div>
            </div>
        </div>
    </section>

    <!-- 푸터 -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="logo">
                        <span class="logo-mark">✦</span>
                        마스터페이
                    </div>
                    <p>매장 운영에 필요한 모든 장비<br>설치부터 A/S까지 한번에.</p>
                </div>
                
                <div class="footer-col">
                    <h4>카드단말기</h4>
                    <ul>
                        <li><a href="/product/card-2inch">2인치 단말기</a></li>
                        <li><a href="/product/card-3inch">3인치 단말기</a></li>
                        <li><a href="/product/card-toss">토스 단말기</a></li>
                        <li><a href="/product/card-wireless">무선 단말기</a></li>
                        <li><a href="/product/card-bluetooth">블루투스 단말기</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h4>제품</h4>
                    <ul>
                        <li><a href="/product/pos">포스기</a></li>
                        <li><a href="/product/kiosk">키오스크</a></li>
                        <li><a href="/product/kiosk-mini">미니 키오스크</a></li>
                        <li><a href="/product/tableorder">테이블오더</a></li>
                        <li><a href="/product/removal">철거</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="tel:010-2337-0458">📞 010-2337-0458</a></li>
                        <li><a href="#">💬 카카오톡 상담</a></li>
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
    </script>

</body>
</html>
`;

const PAGE_CARD_WIRELESS = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>무선 Wireless 단말기 | 마스터페이</title>
    <meta name="description" content="자리를 옮겨도, 배달을 가도 언제 어디서나 결제 OK. 이동이 자유로운 무선 카드 단말기입니다.">
    <meta property="og:title" content="무선 Wireless 단말기 | 마스터페이">
    <meta property="og:description" content="자리를 옮겨도, 배달을 가도 언제 어디서나 결제 OK. 이동이 자유로운 무선 카드 단말기입니다.">
    
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
html { scroll-behavior: smooth; }

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
    position: sticky;
    top: 0;
    background: var(--cream);
    z-index: 100;
    border-bottom: 1px solid var(--border);
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
</style>
</head>
<body>

    <!-- 헤더 -->
    <header>
        <nav class="nav">
            <a href="/" class="logo">
                <span class="logo-mark">✦</span>
                마스터페이
            </a>
            
            <ul class="nav-menu" id="navMenu">
                <li><a href="/#philosophy">철학</a></li>
                <li><a href="/#services">서비스</a></li>
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
            <!-- 브레드크럼 -->
            <div class="breadcrumb">
                <a href="/">홈</a>
                <span class="breadcrumb-separator">/</span>
                <a href="/#services">제품</a>
                <span class="breadcrumb-separator">/</span>
                <span>무선 Wireless 단말기</span>
            </div>
            
            <div class="product-grid">
                <div class="product-info">
                    <span class="product-badge">카드단말기</span>
                    <h1 class="product-title">
                        무선<span class="italic"> Wireless</span> 단말기
                    </h1>
                    <p class="product-lead">자리를 옮겨도, 배달을 가도 언제 어디서나 결제 OK. 이동이 자유로운 무선 카드 단말기입니다.</p>
                    
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
                
                <!-- 제품 이미지 영역 (이모지 또는 이미지) -->
                <div class="product-visual">
                    📱
                    <!-- 이미지 사용시: <img src="../images/파일명.jpg" alt="무선"> -->
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
                    이런 <span class="italic">특징이</span> 있어요.
                </h2>
            </div>
            
            <div class="feature-grid">
                <div class="feature-item">
                    <div class="feature-icon">🚶</div>
                    <h3 class="feature-title">이동 결제 자유</h3>
                    <p class="feature-desc">테이블이든 배달 현장이든 자유롭게 이동하며 결제할 수 있어 업무 효율이 높아집니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🔋</div>
                    <h3 class="feature-title">긴 배터리 수명</h3>
                    <p class="feature-desc">한 번 충전으로 하루 종일 사용 가능. 충전 걱정 없이 영업에 집중하세요.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">📡</div>
                    <h3 class="feature-title">안정적 무선 연결</h3>
                    <p class="feature-desc">Wi-Fi와 4G를 모두 지원해 네트워크가 불안정한 곳에서도 끊김 없이 결제됩니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🏪</div>
                    <h3 class="feature-title">다목적 활용</h3>
                    <p class="feature-desc">홀 서비스, 배달, 출장 등 어떤 상황에도 대응 가능한 만능 단말기입니다.</p>
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
                    <span class="italic">자세히</span> 알아보기.
                </h2>
            </div>
            
            <div class="detail-content">
                
                <h3>무선 단말기가 필요한 이유</h3>
                <p>고정된 카운터에서만 결제하는 시대는 지나갔습니다. 테이블 결제, 배달 결제, 야외 행사 등 이동하며 결제해야 하는 상황이 많아진 만큼 무선 단말기는 선택이 아닌 필수입니다.</p>
                
                <h3>이런 업종에 추천해요</h3>
                <ul>
                    <li>테이블 결제를 원하는 음식점·주점</li>
                    <li>배달 서비스를 함께 운영하는 매장</li>
                    <li>푸드트럭·야외 이벤트 부스</li>
                    <li>출장 서비스를 제공하는 업종</li>
                    <li>매장이 넓어 여러 결제 포인트가 필요한 곳</li>
                </ul>
                
                <h3>배터리는 얼마나 오래 가나요?</h3>
                <p>모델에 따라 다르지만 대체로 하루 영업 시간 동안 충분히 사용 가능합니다. 보조 배터리나 충전 거치대를 함께 제공해 업무에 차질이 없도록 해드려요.</p>
        
            </div>
        </div>
    </section>

    <!-- 관련 제품 -->
    <section class="related">
        <div class="container">
            <div class="section-header">
                <span class="section-num">03 / Related</span>
                <h2 class="section-title">
                    다른 <span class="italic">제품도</span> 둘러보세요.
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
    <section class="cta" id="contact">
        <div class="container">
            <div class="cta-content">
                <div class="cta-label">— Let's Talk —</div>
                <h2>
                    지금 바로<br>
                    <span class="italic">상담 받아보세요.</span>
                </h2>
                
                <a href="tel:010-2337-0458" class="cta-phone">
                    📞 010-2337-0458
                </a>
                
                <div class="cta-note">
                    평일 09:00 – 18:00 · 카카오톡 상담도 가능합니다
                </div>
            </div>
        </div>
    </section>

    <!-- 푸터 -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="logo">
                        <span class="logo-mark">✦</span>
                        마스터페이
                    </div>
                    <p>매장 운영에 필요한 모든 장비<br>설치부터 A/S까지 한번에.</p>
                </div>
                
                <div class="footer-col">
                    <h4>카드단말기</h4>
                    <ul>
                        <li><a href="/product/card-2inch">2인치 단말기</a></li>
                        <li><a href="/product/card-3inch">3인치 단말기</a></li>
                        <li><a href="/product/card-toss">토스 단말기</a></li>
                        <li><a href="/product/card-wireless">무선 단말기</a></li>
                        <li><a href="/product/card-bluetooth">블루투스 단말기</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h4>제품</h4>
                    <ul>
                        <li><a href="/product/pos">포스기</a></li>
                        <li><a href="/product/kiosk">키오스크</a></li>
                        <li><a href="/product/kiosk-mini">미니 키오스크</a></li>
                        <li><a href="/product/tableorder">테이블오더</a></li>
                        <li><a href="/product/removal">철거</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="tel:010-2337-0458">📞 010-2337-0458</a></li>
                        <li><a href="#">💬 카카오톡 상담</a></li>
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
    </script>

</body>
</html>
`;

const PAGE_CARD_BLUETOOTH = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>블루투스 Bluetooth 단말기 | 마스터페이</title>
    <meta name="description" content="스마트폰과 연동해 어디서든 간편하게. 작고 가벼운 블루투스 카드 단말기로 결제의 자유를 누리세요.">
    <meta property="og:title" content="블루투스 Bluetooth 단말기 | 마스터페이">
    <meta property="og:description" content="스마트폰과 연동해 어디서든 간편하게. 작고 가벼운 블루투스 카드 단말기로 결제의 자유를 누리세요.">
    
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
html { scroll-behavior: smooth; }

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
    position: sticky;
    top: 0;
    background: var(--cream);
    z-index: 100;
    border-bottom: 1px solid var(--border);
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
</style>
</head>
<body>

    <!-- 헤더 -->
    <header>
        <nav class="nav">
            <a href="/" class="logo">
                <span class="logo-mark">✦</span>
                마스터페이
            </a>
            
            <ul class="nav-menu" id="navMenu">
                <li><a href="/#philosophy">철학</a></li>
                <li><a href="/#services">서비스</a></li>
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
            <!-- 브레드크럼 -->
            <div class="breadcrumb">
                <a href="/">홈</a>
                <span class="breadcrumb-separator">/</span>
                <a href="/#services">제품</a>
                <span class="breadcrumb-separator">/</span>
                <span>블루투스 Bluetooth 단말기</span>
            </div>
            
            <div class="product-grid">
                <div class="product-info">
                    <span class="product-badge">카드단말기</span>
                    <h1 class="product-title">
                        블루투스<span class="italic"> Bluetooth</span> 단말기
                    </h1>
                    <p class="product-lead">스마트폰과 연동해 어디서든 간편하게. 작고 가벼운 블루투스 카드 단말기로 결제의 자유를 누리세요.</p>
                    
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
                
                <!-- 제품 이미지 영역 (이모지 또는 이미지) -->
                <div class="product-visual">
                    🔷
                    <!-- 이미지 사용시: <img src="../images/파일명.jpg" alt="블루투스"> -->
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
                    이런 <span class="italic">특징이</span> 있어요.
                </h2>
            </div>
            
            <div class="feature-grid">
                <div class="feature-item">
                    <div class="feature-icon">📲</div>
                    <h3 class="feature-title">스마트폰 연동</h3>
                    <p class="feature-desc">스마트폰 앱과 블루투스로 연결해 어디서든 간편하게 결제할 수 있습니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🎒</div>
                    <h3 class="feature-title">휴대성 최강</h3>
                    <p class="feature-desc">손바닥 크기로 주머니에 쏙. 어디든 가지고 다니며 결제할 수 있어요.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">💸</div>
                    <h3 class="feature-title">저렴한 초기 비용</h3>
                    <p class="feature-desc">다른 단말기 대비 저렴한 가격으로 도입 부담이 적습니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🚀</div>
                    <h3 class="feature-title">간편한 사용법</h3>
                    <p class="feature-desc">복잡한 설정 없이 앱만 설치하면 바로 사용 가능. 누구나 쉽게 시작할 수 있어요.</p>
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
                    <span class="italic">자세히</span> 알아보기.
                </h2>
            </div>
            
            <div class="detail-content">
                
                <h3>블루투스 단말기의 장점</h3>
                <p>블루투스 단말기는 스마트폰·태블릿과 연동해 사용하는 초소형 카드 리더기입니다. 별도의 액정이 없어 가격이 저렴하고, 휴대가 매우 편리합니다.</p>
                
                <h3>이런 분들께 추천해요</h3>
                <ul>
                    <li>프리랜서, 출장 강사 등 이동이 많은 직종</li>
                    <li>푸드트럭, 플리마켓 참가자</li>
                    <li>소규모 매장에서 보조 단말기가 필요한 경우</li>
                    <li>비용 부담 없이 카드결제를 시작하고 싶은 분</li>
                    <li>방문 서비스, 출장 서비스 업종</li>
                </ul>
                
                <h3>영수증은 어떻게 발행하나요?</h3>
                <p>스마트폰 앱을 통해 전자 영수증을 문자나 이메일로 발송할 수 있습니다. 종이 영수증이 필요하다면 별도의 블루투스 프린터와 연결도 가능해요.</p>
        
            </div>
        </div>
    </section>

    <!-- 관련 제품 -->
    <section class="related">
        <div class="container">
            <div class="section-header">
                <span class="section-num">03 / Related</span>
                <h2 class="section-title">
                    다른 <span class="italic">제품도</span> 둘러보세요.
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
    <section class="cta" id="contact">
        <div class="container">
            <div class="cta-content">
                <div class="cta-label">— Let's Talk —</div>
                <h2>
                    지금 바로<br>
                    <span class="italic">상담 받아보세요.</span>
                </h2>
                
                <a href="tel:010-2337-0458" class="cta-phone">
                    📞 010-2337-0458
                </a>
                
                <div class="cta-note">
                    평일 09:00 – 18:00 · 카카오톡 상담도 가능합니다
                </div>
            </div>
        </div>
    </section>

    <!-- 푸터 -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="logo">
                        <span class="logo-mark">✦</span>
                        마스터페이
                    </div>
                    <p>매장 운영에 필요한 모든 장비<br>설치부터 A/S까지 한번에.</p>
                </div>
                
                <div class="footer-col">
                    <h4>카드단말기</h4>
                    <ul>
                        <li><a href="/product/card-2inch">2인치 단말기</a></li>
                        <li><a href="/product/card-3inch">3인치 단말기</a></li>
                        <li><a href="/product/card-toss">토스 단말기</a></li>
                        <li><a href="/product/card-wireless">무선 단말기</a></li>
                        <li><a href="/product/card-bluetooth">블루투스 단말기</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h4>제품</h4>
                    <ul>
                        <li><a href="/product/pos">포스기</a></li>
                        <li><a href="/product/kiosk">키오스크</a></li>
                        <li><a href="/product/kiosk-mini">미니 키오스크</a></li>
                        <li><a href="/product/tableorder">테이블오더</a></li>
                        <li><a href="/product/removal">철거</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="tel:010-2337-0458">📞 010-2337-0458</a></li>
                        <li><a href="#">💬 카카오톡 상담</a></li>
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
    </script>

</body>
</html>
`;

const PAGE_KIOSK = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>키오스크 Kiosk | 마스터페이</title>
    <meta name="description" content="인건비는 줄이고 효율은 높이고. 무인 주문·결제 시스템으로 매장 운영의 새로운 기준을 만들어보세요.">
    <meta property="og:title" content="키오스크 Kiosk | 마스터페이">
    <meta property="og:description" content="인건비는 줄이고 효율은 높이고. 무인 주문·결제 시스템으로 매장 운영의 새로운 기준을 만들어보세요.">
    
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
html { scroll-behavior: smooth; }

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
    position: sticky;
    top: 0;
    background: var(--cream);
    z-index: 100;
    border-bottom: 1px solid var(--border);
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
</style>
</head>
<body>

    <!-- 헤더 -->
    <header>
        <nav class="nav">
            <a href="/" class="logo">
                <span class="logo-mark">✦</span>
                마스터페이
            </a>
            
            <ul class="nav-menu" id="navMenu">
                <li><a href="/#philosophy">철학</a></li>
                <li><a href="/#services">서비스</a></li>
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
            <!-- 브레드크럼 -->
            <div class="breadcrumb">
                <a href="/">홈</a>
                <span class="breadcrumb-separator">/</span>
                <a href="/#services">제품</a>
                <span class="breadcrumb-separator">/</span>
                <span>키오스크 Kiosk</span>
            </div>
            
            <div class="product-grid">
                <div class="product-info">
                    <span class="product-badge">무인 주문</span>
                    <h1 class="product-title">
                        키오스크<span class="italic"> Kiosk</span>
                    </h1>
                    <p class="product-lead">인건비는 줄이고 효율은 높이고. 무인 주문·결제 시스템으로 매장 운영의 새로운 기준을 만들어보세요.</p>
                    
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
                        <div class="spec-label">Saving</div>
                        <div class="spec-value">월 최대 200만원 절감</div>
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
                
                <!-- 제품 이미지 영역 (이모지 또는 이미지) -->
                <div class="product-visual">
                    <img src="https://raw.githubusercontent.com/YOONSOEUN1/mastarpay/main/images/Kiosk.png" alt="키오스크" style="width: 100%; height: 100%; object-fit: cover;">
                    <!-- 이미지 사용시: <img src="../images/파일명.jpg" alt="키오스크"> -->
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
                    이런 <span class="italic">특징이</span> 있어요.
                </h2>
            </div>
            
            <div class="feature-grid">
                <div class="feature-item">
                    <div class="feature-icon">💰</div>
                    <h3 class="feature-title">인건비 대폭 절감</h3>
                    <p class="feature-desc">홀 서빙·카운터 직원을 줄일 수 있어 월 인건비를 크게 절약할 수 있습니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">📊</div>
                    <h3 class="feature-title">객단가 상승</h3>
                    <p class="feature-desc">메뉴 사진과 추천 메뉴 표시로 추가 주문이 자연스럽게 유도돼 객단가가 올라갑니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">⏱️</div>
                    <h3 class="feature-title">대기 시간 단축</h3>
                    <p class="feature-desc">피크 타임에도 여러 고객이 동시에 주문할 수 있어 대기 시간이 현저히 줄어듭니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🎨</div>
                    <h3 class="feature-title">맞춤형 UI 설정</h3>
                    <p class="feature-desc">우리 매장에 맞는 메뉴 배치와 결제 동선을 직접 설계할 수 있습니다.</p>
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
                    <span class="italic">자세히</span> 알아보기.
                </h2>
            </div>
            
            <div class="detail-content">
                
                <h3>왜 키오스크가 필요할까요?</h3>
                <p>최저임금 상승과 인력난으로 많은 자영업자들이 어려움을 겪고 있습니다. 키오스크는 이러한 문제를 해결하는 가장 효과적인 솔루션이에요. 단순 주문 업무를 자동화해 직원은 더 중요한 서비스에 집중할 수 있습니다.</p>
                
                <h3>이런 매장에 추천해요</h3>
                <ul>
                    <li>피크 타임에 주문이 밀리는 음식점·카페</li>
                    <li>인건비 부담이 큰 프랜차이즈·분식점</li>
                    <li>24시간 무인 운영을 고려하는 매장</li>
                    <li>메뉴가 많아 주문 실수가 잦은 업종</li>
                    <li>젊은 고객층이 많은 트렌디한 매장</li>
                </ul>
                
                <h3>설치 비용이 부담되지 않을까요?</h3>
                <p>렌탈 방식으로 초기 비용 없이 도입하실 수 있습니다. 대부분의 매장이 몇 개월 안에 절감된 인건비로 렌탈료를 충당하고도 이익을 봅니다. 정확한 견적은 상담을 통해 안내해드려요.</p>
        
            </div>
        </div>
    </section>

    <!-- 관련 제품 -->
    <section class="related">
        <div class="container">
            <div class="section-header">
                <span class="section-num">03 / Related</span>
                <h2 class="section-title">
                    다른 <span class="italic">제품도</span> 둘러보세요.
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
    <section class="cta" id="contact">
        <div class="container">
            <div class="cta-content">
                <div class="cta-label">— Let's Talk —</div>
                <h2>
                    지금 바로<br>
                    <span class="italic">상담 받아보세요.</span>
                </h2>
                
                <a href="tel:010-2337-0458" class="cta-phone">
                    📞 010-2337-0458
                </a>
                
                <div class="cta-note">
                    평일 09:00 – 18:00 · 카카오톡 상담도 가능합니다
                </div>
            </div>
        </div>
    </section>

    <!-- 푸터 -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="logo">
                        <span class="logo-mark">✦</span>
                        마스터페이
                    </div>
                    <p>매장 운영에 필요한 모든 장비<br>설치부터 A/S까지 한번에.</p>
                </div>
                
                <div class="footer-col">
                    <h4>카드단말기</h4>
                    <ul>
                        <li><a href="/product/card-2inch">2인치 단말기</a></li>
                        <li><a href="/product/card-3inch">3인치 단말기</a></li>
                        <li><a href="/product/card-toss">토스 단말기</a></li>
                        <li><a href="/product/card-wireless">무선 단말기</a></li>
                        <li><a href="/product/card-bluetooth">블루투스 단말기</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h4>제품</h4>
                    <ul>
                        <li><a href="/product/pos">포스기</a></li>
                        <li><a href="/product/kiosk">키오스크</a></li>
                        <li><a href="/product/kiosk-mini">미니 키오스크</a></li>
                        <li><a href="/product/tableorder">테이블오더</a></li>
                        <li><a href="/product/removal">철거</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="tel:010-2337-0458">📞 010-2337-0458</a></li>
                        <li><a href="#">💬 카카오톡 상담</a></li>
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
    </script>

</body>
</html>
`;

const PAGE_KIOSK_MINI = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>미니 Mini 키오스크 | 마스터페이</title>
    <meta name="description" content="작은 매장에도 딱 맞는 컴팩트한 무인 주문 시스템. 공간은 절약하고 효율은 그대로입니다.">
    <meta property="og:title" content="미니 Mini 키오스크 | 마스터페이">
    <meta property="og:description" content="작은 매장에도 딱 맞는 컴팩트한 무인 주문 시스템. 공간은 절약하고 효율은 그대로입니다.">
    
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
html { scroll-behavior: smooth; }

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
    position: sticky;
    top: 0;
    background: var(--cream);
    z-index: 100;
    border-bottom: 1px solid var(--border);
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
</style>
</head>
<body>

    <!-- 헤더 -->
    <header>
        <nav class="nav">
            <a href="/" class="logo">
                <span class="logo-mark">✦</span>
                마스터페이
            </a>
            
            <ul class="nav-menu" id="navMenu">
                <li><a href="/#philosophy">철학</a></li>
                <li><a href="/#services">서비스</a></li>
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
            <!-- 브레드크럼 -->
            <div class="breadcrumb">
                <a href="/">홈</a>
                <span class="breadcrumb-separator">/</span>
                <a href="/#services">제품</a>
                <span class="breadcrumb-separator">/</span>
                <span>미니 Mini 키오스크</span>
            </div>
            
            <div class="product-grid">
                <div class="product-info">
                    <span class="product-badge">무인 주문</span>
                    <h1 class="product-title">
                        미니<span class="italic"> Mini</span> 키오스크
                    </h1>
                    <p class="product-lead">작은 매장에도 딱 맞는 컴팩트한 무인 주문 시스템. 공간은 절약하고 효율은 그대로입니다.</p>
                    
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
                        <div class="spec-value">공간 절약</div>
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
                
                <!-- 제품 이미지 영역 (이모지 또는 이미지) -->
                <div class="product-visual">
                    <img src="https://raw.githubusercontent.com/YOONSOEUN1/mastarpay/main/images/Kiosk2.png" alt="미니 키오스크" style="width: 100%; height: 100%; object-fit: cover;">
                    <!-- 이미지 사용시: <img src="../images/파일명.jpg" alt="미니"> -->
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
                    이런 <span class="italic">특징이</span> 있어요.
                </h2>
            </div>
            
            <div class="feature-grid">
                <div class="feature-item">
                    <div class="feature-icon">📐</div>
                    <h3 class="feature-title">작은 공간에 OK</h3>
                    <p class="feature-desc">대형 키오스크가 부담스러운 좁은 매장에도 부담 없이 설치 가능합니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">💸</div>
                    <h3 class="feature-title">저렴한 비용</h3>
                    <p class="feature-desc">대형 키오스크보다 훨씬 저렴한 가격으로 무인화의 장점을 누릴 수 있어요.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🔌</div>
                    <h3 class="feature-title">간편한 설치</h3>
                    <p class="feature-desc">테이블 위에 올려놓거나 벽에 걸어서 간단히 설치. 큰 공사 없이 바로 사용 가능해요.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">✨</div>
                    <h3 class="feature-title">세련된 디자인</h3>
                    <p class="feature-desc">매장의 분위기를 해치지 않고 오히려 모던한 느낌을 더해줍니다.</p>
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
                    <span class="italic">자세히</span> 알아보기.
                </h2>
            </div>
            
            <div class="detail-content">
                
                <h3>미니 키오스크가 필요한 이유</h3>
                <p>모든 매장이 큰 키오스크를 놓을 공간이 있는 건 아닙니다. 미니 키오스크는 작은 매장, 테이블 위 공간, 벽면을 활용해 무인화의 장점을 누릴 수 있게 해드려요.</p>
                
                <h3>이런 매장에 추천해요</h3>
                <ul>
                    <li>좁은 공간의 소형 카페·디저트 가게</li>
                    <li>셀프 서비스가 가능한 작은 식당</li>
                    <li>무인 매장·스터디카페</li>
                    <li>보조 주문 기기가 필요한 매장</li>
                    <li>저렴한 비용으로 무인화를 시작하고 싶은 곳</li>
                </ul>
                
                <h3>대형 키오스크와 차이점은?</h3>
                <p>기능은 거의 동일합니다. 다만 화면 크기가 작고, 설치 방식이 간단하며, 가격이 더 저렴합니다. 매장 크기와 운영 방식에 따라 어떤 것이 적합한지 상담해드릴게요.</p>
        
            </div>
        </div>
    </section>

    <!-- 관련 제품 -->
    <section class="related">
        <div class="container">
            <div class="section-header">
                <span class="section-num">03 / Related</span>
                <h2 class="section-title">
                    다른 <span class="italic">제품도</span> 둘러보세요.
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
    <section class="cta" id="contact">
        <div class="container">
            <div class="cta-content">
                <div class="cta-label">— Let's Talk —</div>
                <h2>
                    지금 바로<br>
                    <span class="italic">상담 받아보세요.</span>
                </h2>
                
                <a href="tel:010-2337-0458" class="cta-phone">
                    📞 010-2337-0458
                </a>
                
                <div class="cta-note">
                    평일 09:00 – 18:00 · 카카오톡 상담도 가능합니다
                </div>
            </div>
        </div>
    </section>

    <!-- 푸터 -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="logo">
                        <span class="logo-mark">✦</span>
                        마스터페이
                    </div>
                    <p>매장 운영에 필요한 모든 장비<br>설치부터 A/S까지 한번에.</p>
                </div>
                
                <div class="footer-col">
                    <h4>카드단말기</h4>
                    <ul>
                        <li><a href="/product/card-2inch">2인치 단말기</a></li>
                        <li><a href="/product/card-3inch">3인치 단말기</a></li>
                        <li><a href="/product/card-toss">토스 단말기</a></li>
                        <li><a href="/product/card-wireless">무선 단말기</a></li>
                        <li><a href="/product/card-bluetooth">블루투스 단말기</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h4>제품</h4>
                    <ul>
                        <li><a href="/product/pos">포스기</a></li>
                        <li><a href="/product/kiosk">키오스크</a></li>
                        <li><a href="/product/kiosk-mini">미니 키오스크</a></li>
                        <li><a href="/product/tableorder">테이블오더</a></li>
                        <li><a href="/product/removal">철거</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="tel:010-2337-0458">📞 010-2337-0458</a></li>
                        <li><a href="#">💬 카카오톡 상담</a></li>
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
    </script>

</body>
</html>
`;

const PAGE_TABLEORDER = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>테이블 Table 오더 | 마스터페이</title>
    <meta name="description" content="자리에 앉아 QR로 주문부터 결제까지. 홀 직원 인건비는 줄이고, 객단가는 올리는 스마트 주문 시스템입니다.">
    <meta property="og:title" content="테이블 Table 오더 | 마스터페이">
    <meta property="og:description" content="자리에 앉아 QR로 주문부터 결제까지. 홀 직원 인건비는 줄이고, 객단가는 올리는 스마트 주문 시스템입니다.">
    
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
html { scroll-behavior: smooth; }

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
    position: sticky;
    top: 0;
    background: var(--cream);
    z-index: 100;
    border-bottom: 1px solid var(--border);
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
</style>
</head>
<body>

    <!-- 헤더 -->
    <header>
        <nav class="nav">
            <a href="/" class="logo">
                <span class="logo-mark">✦</span>
                마스터페이
            </a>
            
            <ul class="nav-menu" id="navMenu">
                <li><a href="/#philosophy">철학</a></li>
                <li><a href="/#services">서비스</a></li>
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
            <!-- 브레드크럼 -->
            <div class="breadcrumb">
                <a href="/">홈</a>
                <span class="breadcrumb-separator">/</span>
                <a href="/#services">제품</a>
                <span class="breadcrumb-separator">/</span>
                <span>테이블 Table 오더</span>
            </div>
            
            <div class="product-grid">
                <div class="product-info">
                    <span class="product-badge">스마트 주문</span>
                    <h1 class="product-title">
                        테이블<span class="italic"> Table</span> 오더
                    </h1>
                    <p class="product-lead">자리에 앉아 QR로 주문부터 결제까지. 홀 직원 인건비는 줄이고, 객단가는 올리는 스마트 주문 시스템입니다.</p>
                    
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
                
                <!-- 제품 이미지 영역 (이모지 또는 이미지) -->
                <div class="product-visual">
                    📋
                    <!-- 이미지 사용시: <img src="../images/파일명.jpg" alt="테이블"> -->
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
                    이런 <span class="italic">특징이</span> 있어요.
                </h2>
            </div>
            
            <div class="feature-grid">
                <div class="feature-item">
                    <div class="feature-icon">📱</div>
                    <h3 class="feature-title">QR로 간편 주문</h3>
                    <p class="feature-desc">테이블의 QR코드만 스캔하면 스마트폰으로 바로 주문. 앱 설치도 필요 없어요.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">💵</div>
                    <h3 class="feature-title">인건비 절감</h3>
                    <p class="feature-desc">홀 직원 호출 없이 자체 주문이 가능해 홀 서빙 인력을 크게 줄일 수 있습니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">📈</div>
                    <h3 class="feature-title">객단가 상승</h3>
                    <p class="feature-desc">메뉴 사진으로 추가 주문이 자연스럽게 이어져 평균 객단가가 25% 이상 상승합니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🌐</div>
                    <h3 class="feature-title">다국어 지원</h3>
                    <p class="feature-desc">한국어·영어·중국어·일본어 지원으로 외국인 관광객 응대도 문제없습니다.</p>
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
                    <span class="italic">자세히</span> 알아보기.
                </h2>
            </div>
            
            <div class="detail-content">
                
                <h3>테이블 오더가 대세인 이유</h3>
                <p>코로나 이후 비대면 주문이 일상화됐고, 최저임금 상승으로 홀 인건비 부담이 커졌습니다. 테이블 오더는 이 두 가지 문제를 동시에 해결하는 가장 효과적인 솔루션이에요.</p>
                
                <h3>이런 매장에 추천해요</h3>
                <ul>
                    <li>홀 서빙 인건비 부담이 큰 음식점·주점</li>
                    <li>객단가를 높이고 싶은 프랜차이즈</li>
                    <li>외국인 고객이 많은 관광지 매장</li>
                    <li>피크 타임 주문 폭주로 실수가 잦은 매장</li>
                    <li>주문 호출 벨 대신 세련된 시스템을 원하는 곳</li>
                </ul>
                
                <h3>QR 방식과 태블릿 방식 어느 게 좋을까요?</h3>
                <p>QR 방식은 비용이 저렴하고 스마트폰에 익숙한 고객에게 좋습니다. 태블릿 방식은 모든 연령대가 쉽게 사용할 수 있고 더 직관적이에요. 매장 고객층에 따라 추천해드립니다.</p>
        
            </div>
        </div>
    </section>

    <!-- 관련 제품 -->
    <section class="related">
        <div class="container">
            <div class="section-header">
                <span class="section-num">03 / Related</span>
                <h2 class="section-title">
                    다른 <span class="italic">제품도</span> 둘러보세요.
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
    <section class="cta" id="contact">
        <div class="container">
            <div class="cta-content">
                <div class="cta-label">— Let's Talk —</div>
                <h2>
                    지금 바로<br>
                    <span class="italic">상담 받아보세요.</span>
                </h2>
                
                <a href="tel:010-2337-0458" class="cta-phone">
                    📞 010-2337-0458
                </a>
                
                <div class="cta-note">
                    평일 09:00 – 18:00 · 카카오톡 상담도 가능합니다
                </div>
            </div>
        </div>
    </section>

    <!-- 푸터 -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="logo">
                        <span class="logo-mark">✦</span>
                        마스터페이
                    </div>
                    <p>매장 운영에 필요한 모든 장비<br>설치부터 A/S까지 한번에.</p>
                </div>
                
                <div class="footer-col">
                    <h4>카드단말기</h4>
                    <ul>
                        <li><a href="/product/card-2inch">2인치 단말기</a></li>
                        <li><a href="/product/card-3inch">3인치 단말기</a></li>
                        <li><a href="/product/card-toss">토스 단말기</a></li>
                        <li><a href="/product/card-wireless">무선 단말기</a></li>
                        <li><a href="/product/card-bluetooth">블루투스 단말기</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h4>제품</h4>
                    <ul>
                        <li><a href="/product/pos">포스기</a></li>
                        <li><a href="/product/kiosk">키오스크</a></li>
                        <li><a href="/product/kiosk-mini">미니 키오스크</a></li>
                        <li><a href="/product/tableorder">테이블오더</a></li>
                        <li><a href="/product/removal">철거</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="tel:010-2337-0458">📞 010-2337-0458</a></li>
                        <li><a href="#">💬 카카오톡 상담</a></li>
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
    </script>

</body>
</html>
`;

const PAGE_REMOVAL = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>매장 철거 서비스 | 마스터페이</title>
    <meta name="description" content="매장·사무실·가게 철거를 전문 엔지니어팀이 책임집니다. 원상복구부터 폐기물 처리까지 원스톱으로.">
    <meta property="og:title" content="매장 철거 서비스 | 마스터페이">
    <meta property="og:description" content="매장·사무실·가게 철거를 전문 엔지니어팀이 책임집니다. 원상복구부터 폐기물 처리까지 원스톱으로.">
    
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
html { scroll-behavior: smooth; }

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
    position: sticky;
    top: 0;
    background: var(--cream);
    z-index: 100;
    border-bottom: 1px solid var(--border);
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
</style>
</head>
<body>

    <!-- 헤더 -->
    <header>
        <nav class="nav">
            <a href="/" class="logo">
                <span class="logo-mark">✦</span>
                마스터페이
            </a>
            
            <ul class="nav-menu" id="navMenu">
                <li><a href="/#philosophy">철학</a></li>
                <li><a href="/#services">서비스</a></li>
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
            <!-- 브레드크럼 -->
            <div class="breadcrumb">
                <a href="/">홈</a>
                <span class="breadcrumb-separator">/</span>
                <a href="/#services">제품</a>
                <span class="breadcrumb-separator">/</span>
                <span>매장 철거 서비스</span>
            </div>
            
            <div class="product-grid">
                <div class="product-info">
                    <span class="product-badge">건축·철거</span>
                    <h1 class="product-title">
                        매장<span class="italic"> 철거</span> 서비스
                    </h1>
                    <p class="product-lead">매장·사무실·가게 철거를 전문 엔지니어팀이 책임집니다. 원상복구부터 폐기물 처리까지 원스톱으로.</p>
                    
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
                
                <!-- 제품 이미지 영역 (이모지 또는 이미지) -->
                <div class="product-visual">
                    🔨
                    <!-- 이미지 사용시: <img src="../images/파일명.jpg" alt="매장"> -->
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
                    이런 <span class="italic">특징이</span> 있어요.
                </h2>
            </div>
            
            <div class="feature-grid">
                <div class="feature-item">
                    <div class="feature-icon">🏗️</div>
                    <h3 class="feature-title">정밀 현장 분석</h3>
                    <p class="feature-desc">철거 전 현장을 정밀 분석해 구조물·배관·전기 상태를 파악하고 최적의 계획을 수립합니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">✨</div>
                    <h3 class="feature-title">원스톱 원상복구</h3>
                    <p class="feature-desc">바닥·벽면·천장 원상복구까지 한번에 처리해 보증금 반환에 문제없도록 마감합니다.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">♻️</div>
                    <h3 class="feature-title">폐기물 적법 처리</h3>
                    <p class="feature-desc">철거 폐기물을 관련 법규에 맞게 분류·수거·처리합니다. 불법 투기 걱정 없이 안심하세요.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">💬</div>
                    <h3 class="feature-title">실시간 공정 보고</h3>
                    <p class="feature-desc">진행 상황을 사진·영상으로 실시간 보고. 현장에 오지 않아도 상태를 확인할 수 있어요.</p>
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
                    <span class="italic">자세히</span> 알아보기.
                </h2>
            </div>
            
            <div class="detail-content">
                
                <h3>왜 전문 업체에 맡겨야 할까요?</h3>
                <p>철거는 단순히 부수는 작업이 아닙니다. 안전 관리, 폐기물 처리, 원상복구, 보증금 반환 등 고려해야 할 사항이 많아요. 잘못 진행하면 임대인과 분쟁이 생기거나 추가 비용이 발생할 수 있습니다.</p>
                
                <h3>이런 분들께 필요한 서비스</h3>
                <ul>
                    <li>매장을 폐업하고 원상복구가 필요한 사장님</li>
                    <li>인테리어 변경을 위해 기존 시설을 철거해야 하는 경우</li>
                    <li>임대 종료로 보증금 반환을 앞둔 세입자</li>
                    <li>사무실 이전으로 기존 공간을 정리해야 하는 업체</li>
                    <li>노후 시설을 한 번에 정리하고 싶은 건물주</li>
                </ul>
                
                <h3>견적은 어떻게 내나요?</h3>
                <p>현장 실측 후 정확한 견적을 무료로 내드립니다. 정찰제로 운영되어 견적 대비 추가 청구가 없으니 안심하셔도 됩니다. 시공 후 하자 발생 시 무상 보수 보증서도 발급해드려요.</p>
        
            </div>
        </div>
    </section>

    <!-- 관련 제품 -->
    <section class="related">
        <div class="container">
            <div class="section-header">
                <span class="section-num">03 / Related</span>
                <h2 class="section-title">
                    다른 <span class="italic">제품도</span> 둘러보세요.
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

    <!-- CTA -->
    <section class="cta" id="contact">
        <div class="container">
            <div class="cta-content">
                <div class="cta-label">— Let's Talk —</div>
                <h2>
                    지금 바로<br>
                    <span class="italic">상담 받아보세요.</span>
                </h2>
                
                <a href="tel:010-2337-0458" class="cta-phone">
                    📞 010-2337-0458
                </a>
                
                <div class="cta-note">
                    평일 09:00 – 18:00 · 카카오톡 상담도 가능합니다
                </div>
            </div>
        </div>
    </section>

    <!-- 푸터 -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="logo">
                        <span class="logo-mark">✦</span>
                        마스터페이
                    </div>
                    <p>매장 운영에 필요한 모든 장비<br>설치부터 A/S까지 한번에.</p>
                </div>
                
                <div class="footer-col">
                    <h4>카드단말기</h4>
                    <ul>
                        <li><a href="/product/card-2inch">2인치 단말기</a></li>
                        <li><a href="/product/card-3inch">3인치 단말기</a></li>
                        <li><a href="/product/card-toss">토스 단말기</a></li>
                        <li><a href="/product/card-wireless">무선 단말기</a></li>
                        <li><a href="/product/card-bluetooth">블루투스 단말기</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h4>제품</h4>
                    <ul>
                        <li><a href="/product/pos">포스기</a></li>
                        <li><a href="/product/kiosk">키오스크</a></li>
                        <li><a href="/product/kiosk-mini">미니 키오스크</a></li>
                        <li><a href="/product/tableorder">테이블오더</a></li>
                        <li><a href="/product/removal">철거</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="tel:010-2337-0458">📞 010-2337-0458</a></li>
                        <li><a href="#">💬 카카오톡 상담</a></li>
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
    </script>

</body>
</html>
`;


// ============================================================
// 라우팅 테이블
// ============================================================
const routes = {
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
  async fetch(request) {
    const url = new URL(request.url);
    let pathname = url.pathname;
    
    // 끝의 슬래시 제거 (단, 루트 제외)
    if (pathname !== '/' && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }
    
    // .html 확장자 제거 지원 (예: /product/pos.html → /product/pos)
    if (pathname.endsWith('.html')) {
      pathname = pathname.slice(0, -5);
    }
    
    // 라우트 매칭
    const page = routes[pathname];
    
    if (page) {
      return new Response(page, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }
    
    // 404
    return new Response(PAGE_NOT_FOUND, {
      status: 404,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  },
};

// 글 목록 메타데이터(제목/요약/태그 등, 본문 제외) — 목록·검색 페이지가 로드한다.
// 본문은 data/posts/<id>.js 에 개별 저장되어 글 상세 페이지에서만 지연 로드된다.
// 새 글 추가는 add_post.py 가 이 파일들을 자동으로 갱신한다. 직접 편집도 가능.
// title/summary/tags, site.description, category.desc는 {ko, en} 형태의 다국어 객체다.
// site.version은 데이터가 바뀔 때마다 0.00001씩 증가시키는 값이다(앞으로 수만 번
// 갱신해도 v0.00001, v0.00002... 처럼 천천히, 읽기 쉬운 자리수로 늘어나게 하기 위함).
// 여러 PC에서 나눠 작업할 때 화면 하단에 표시되는 이 숫자를 보고 로컬이 GitHub보다
// 뒤처졌는지 바로 확인할 수 있다.
window.BLOG_INDEX = {
  "site": {
    "title": "TechNote",
    "subtitle": "M365 · Power Platform · Development",
    "description": {
      "ko": "Microsoft 365, Power Platform, 그리고 개발에 관한 실전 노트와 정리 글",
      "en": "Practical notes and write-ups on Microsoft 365, Power Platform, and development"
    },
    "author": "설용환",
    "baseUrl": "https://<your-username>.github.io/<repo>",
    "version": 0.00037,
    "lastUpdated": "2026-10-14"
  },
  "categories": [
    {
      "id": "m365",
      "name": "Microsoft 365",
      "color": "#0f6cbd",
      "icon": "📊",
      "desc": {
        "ko": "Teams, SharePoint, Exchange, Purview 등 M365 운영·관리",
        "en": "Operating and managing M365 — Teams, SharePoint, Exchange, Purview, and more"
      }
    },
    {
      "id": "powerplatform",
      "name": "Power Platform",
      "color": "#742774",
      "icon": "⚡",
      "desc": {
        "ko": "Power Apps, Power Automate, Power BI, Copilot Studio",
        "en": "Power Apps, Power Automate, Power BI, Copilot Studio"
      }
    },
    {
      "id": "dev",
      "name": "Development",
      "color": "#107c41",
      "icon": "💻",
      "desc": {
        "ko": "스크립트, API, 자동화, 웹/클라우드 개발",
        "en": "Scripts, APIs, automation, web/cloud development"
      }
    }
  ],
  "posts": [
    {
      "id": "microsoft-purview-감사-로그-검색-가이드-조건-설정-검색-작업-관리-결과-분석-관리-단위-범위",
      "title": {
        "ko": "Microsoft Purview 감사 로그 검색 가이드 — 조건 설정, 검색 작업 관리, 결과 분석, 관리 단위 범위 제어",
        "en": "Microsoft Purview Audit Log Search Guide — Criteria, Search Job Management, Result Analysis, and Administrative Unit Scoping"
      },
      "category": "m365",
      "tags": {
        "ko": [
          "Purview",
          "감사",
          "감사 로그",
          "조사",
          "규정 준수"
        ],
        "en": [
          "Purview",
          "Audit",
          "Audit Log",
          "Investigation",
          "Compliance"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/purview/audit-search"
      },
      "summary": {
        "ko": "감사 로그 검색 켜짐 확인(PowerShell), 라이선스별 보존 기간(180일/1년), 검색 조건 10종, 검색 작업 대시보드와 결과 내보내기 한도, 관리 단위로 접근 범위를 제한하는 방법을 정리합니다.",
        "en": "Covers verifying audit log search is on via PowerShell, retention by license (180 days/1 year), the ten search criteria, the job dashboard and export limits, and restricting access scope with administrative units."
      },
      "thumbnail": "",
      "readingMinutes": 4
    },
    {
      "id": "entra-로그인-로그와-감사-로그-제대로-읽기-4가지-로그인-유형-변경-추적-권한과-보존",
      "title": {
        "ko": "Entra 로그인 로그와 감사 로그 제대로 읽기 — 4가지 로그인 유형, 변경 추적, 권한과 보존",
        "en": "Reading Entra Sign-in and Audit Logs Properly — Four Sign-in Types, Change Tracking, Permissions, and Retention"
      },
      "category": "m365",
      "tags": {
        "ko": [
          "Entra ID",
          "로그인 로그",
          "감사 로그",
          "모니터링",
          "보안 운영"
        ],
        "en": [
          "Entra ID",
          "Sign-in Logs",
          "Audit Logs",
          "Monitoring",
          "Security Operations"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/entra/identity/monitoring-health/concept-sign-ins"
      },
      "summary": {
        "ko": "Entra 활동 로그 4종의 구분, 로그인 로그의 Who/How/What과 4가지 유형, 사용량 및 인사이트, 감사 로그의 질문 범주와 이전·이후 값, Substrate Management 항목 해석, 권한과 장기 보존 팁을 정리합니다.",
        "en": "Distinguishes the four Entra activity logs, the Who/How/What of sign-in logs and their four types, Usage & insights, the audit log's question categories and old/new values, interpreting Substrate Management entries, and tips on permissions and long-term retention."
      },
      "thumbnail": "",
      "readingMinutes": 4
    },
    {
      "id": "teams-앱-권한-정책-설계-허용-차단-전략-사용자-할당-일괄-해제와-운영-제약",
      "title": {
        "ko": "Teams 앱 권한 정책 설계 — 허용·차단 전략, 사용자 할당, 일괄 해제와 운영 제약",
        "en": "Designing Teams App Permission Policies — Allow/Block Strategy, User Assignment, Bulk Unassign, and Operational Constraints"
      },
      "category": "m365",
      "tags": {
        "ko": [
          "Teams",
          "앱 권한 정책",
          "앱 거버넌스",
          "Copilot 에이전트",
          "관리 센터"
        ],
        "en": [
          "Teams",
          "App Permission Policies",
          "App Governance",
          "Copilot Agents",
          "Admin Center"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/microsoftteams/teams-app-permission-policies"
      },
      "summary": {
        "ko": "앱을 허용하는 4개의 관문, 전역·사용자 지정 정책, 게시자 유형별 허용/차단 설계, 그룹 할당 미지원 한계, 앱 중심 관리와의 관계, 사용자 정책 확인·변경·일괄 해제 절차를 정리합니다.",
        "en": "Covers the four gates that allow an app, global vs custom policies, allow/block design by publisher type, the lack of group assignment, the relationship with app centric management, and checking, changing and bulk-unassigning user policies."
      },
      "thumbnail": "",
      "readingMinutes": 3
    },
    {
      "id": "teams-앱-설정-정책으로-앱-고정-설치하기-앱-바-회의-확장-사용자-고정-에이전트-허용",
      "title": {
        "ko": "Teams 앱 설정 정책으로 앱 고정·설치하기 — 앱 바, 회의 확장, 사용자 고정, 에이전트 허용",
        "en": "Pinning and Installing Apps with Teams App Setup Policies — App Bar, Meeting Extensions, User Pinning, and Agent Enablement"
      },
      "category": "m365",
      "tags": {
        "ko": [
          "Teams",
          "앱 설정 정책",
          "앱 고정",
          "Copilot 에이전트",
          "채택률"
        ],
        "en": [
          "Teams",
          "App Setup Policies",
          "App Pinning",
          "Copilot Agents",
          "Adoption"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/microsoftteams/teams-app-setup-policies"
      },
      "summary": {
        "ko": "설정 정책의 설치·고정·업로드 제어 기능, 네 가지 고정 위치, 고정 앱 정책 만들기, 사용자 고정과 관리자 고정의 우선순위, 그룹 할당과 일괄 해제, 에이전트·Copilot 고정과 모바일 최소 2개 같은 한계를 정리합니다.",
        "en": "Covers setup policies' install, pin and upload control, the four pin locations, creating pinned-app policies, admin vs user pin precedence, group assignment and bulk unassign, and limits such as agents, Copilot pinning and the two-app mobile minimum."
      },
      "thumbnail": "",
      "readingMinutes": 4
    },
    {
      "id": "defender-for-office-365-공격-시뮬레이션-교육-실전-피싱-시뮬레이션-만들기부터-결과-관리까",
      "title": {
        "ko": "Defender for Office 365 공격 시뮬레이션 교육 실전 — 피싱 시뮬레이션 만들기부터 결과 관리까지",
        "en": "Attack Simulation Training in Defender for Office 365 in Practice — From Creating a Phishing Simulation to Managing Results"
      },
      "category": "m365",
      "tags": {
        "ko": [
          "Defender for Office 365",
          "공격 시뮬레이션",
          "피싱 교육",
          "보안 인식",
          "Microsoft 365 E5"
        ],
        "en": [
          "Defender for Office 365",
          "Attack Simulation",
          "Phishing Training",
          "Security Awareness",
          "Microsoft 365 E5"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/defender-office-365/attack-simulation-training-simulations"
      },
      "summary": {
        "ko": "시뮬레이션 마법사의 기법·페이로드·대상·교육·알림·일정 설정과, 복사·취소·보고서 제외 같은 상태별 관리, 예상 손상률과 반복 위반자 활용법을 정리합니다.",
        "en": "Covers the simulation wizard's technique, payload, target, training, notification and schedule settings, state-based management such as copy, cancel and exclude from reporting, and using predicted compromise rate and repeat offenders."
      },
      "thumbnail": "",
      "readingMinutes": 5
    },
    {
      "id": "entra-교차-테넌트-액세스-설정-완전-정리-인바운드-아웃바운드-신뢰-설정-상환-순서",
      "title": {
        "ko": "Entra 교차 테넌트 액세스 설정 완전 정리 — 인바운드·아웃바운드, 신뢰 설정, 상환 순서",
        "en": "Entra Cross-Tenant Access Settings Explained — Inbound, Outbound, Trust Settings, and Redemption Order"
      },
      "category": "m365",
      "tags": {
        "ko": [
          "Entra ID",
          "교차 테넌트 액세스",
          "B2B 협업",
          "MFA 신뢰",
          "게스트"
        ],
        "en": [
          "Entra ID",
          "Cross-Tenant Access",
          "B2B Collaboration",
          "MFA Trust",
          "Guests"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/entra/external-id/cross-tenant-access-settings-b2b-collaboration"
      },
      "summary": {
        "ko": "기본 설정과 조직별 설정의 상속, 인바운드·아웃바운드 허용/차단, 앱 허용 목록의 Microsoft 앱 4종, MFA·디바이스 신뢰, 상환 순서와 MSA 차단, 교차 테넌트 동기화 허용을 정리합니다.",
        "en": "Covers default vs organizational settings and inheritance, inbound and outbound allow/block, four Microsoft apps for app allow lists, MFA and device trust, redemption order and MSA blocking, and allowing cross-tenant sync."
      },
      "thumbnail": "",
      "readingMinutes": 5
    },
    {
      "id": "sharepoint-onedrive-외부-공유-설정-설계-조직-수준-사이트-수준-anyone-링크-제한",
      "title": {
        "ko": "SharePoint·OneDrive 외부 공유 설정 설계 — 조직 수준, 사이트 수준, Anyone 링크 제한",
        "en": "Designing SharePoint and OneDrive External Sharing — Organization Level, Site Level, and Anyone-Link Limits"
      },
      "category": "m365",
      "tags": {
        "ko": [
          "SharePoint",
          "OneDrive",
          "외부 공유",
          "게스트",
          "Anyone 링크"
        ],
        "en": [
          "SharePoint",
          "OneDrive",
          "External Sharing",
          "Guests",
          "Anyone Links"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/sharepoint/turn-external-sharing-on-or-off"
      },
      "summary": {
        "ko": "조직·사이트 수준 외부 공유의 우선순위(가장 제한적인 값 적용), 공유 수준 4종, 도메인 제한·게스트 만료·재인증, Anyone 링크 제한, 사이트 유형별 기본값과 예외를 정리합니다.",
        "en": "Explains precedence between organization and site level (most restrictive wins), the four sharing levels, domain limits, guest expiration and reauthentication, Anyone-link limits, and defaults and exceptions by site type."
      },
      "thumbnail": "",
      "readingMinutes": 5
    },
    {
      "id": "agents-toolkit으로-microsoft-365-copilot-선언형-에이전트-만들기-생성-프로비저닝",
      "title": {
        "ko": "Agents Toolkit으로 Microsoft 365 Copilot 선언형 에이전트 만들기 — 생성, 프로비저닝, 테스트",
        "en": "Building a Microsoft 365 Copilot Declarative Agent with Agents Toolkit — Create, Provision, Test"
      },
      "category": "dev",
      "tags": {
        "ko": [
          "Copilot 확장",
          "선언형 에이전트",
          "Agents Toolkit",
          "VS Code",
          "Microsoft 365 Copilot"
        ],
        "en": [
          "Copilot Extensibility",
          "Declarative Agent",
          "Agents Toolkit",
          "VS Code",
          "Microsoft 365 Copilot"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/build-declarative-agents"
      },
      "summary": {
        "ko": "VS Code의 Microsoft 365 Agents Toolkit으로 No Action 선언형 에이전트를 만들고 Provision한 뒤 Copilot에서 테스트하는 과정과, 프로비저닝 실패 점검 및 지침·지식·동작 확장 로드맵을 정리합니다.",
        "en": "Creates a No Action declarative agent in VS Code with Microsoft 365 Agents Toolkit, provisions it and tests it in Copilot, with a provisioning-failure checklist and a roadmap for extending instructions, knowledge and actions."
      },
      "thumbnail": "",
      "readingMinutes": 3
    },
    {
      "id": "graph-explorer-제대로-쓰기-권한-동의-샘플-쿼리-코드-조각-기록-공유까지",
      "title": {
        "ko": "Graph Explorer 제대로 쓰기 — 권한 동의, 샘플 쿼리, 코드 조각, 기록·공유까지",
        "en": "Getting the Most from Graph Explorer — Permission Consent, Sample Queries, Code Snippets, History, and Sharing"
      },
      "category": "dev",
      "tags": {
        "ko": [
          "Microsoft Graph",
          "Graph Explorer",
          "REST API",
          "개발 도구",
          "권한"
        ],
        "en": [
          "Microsoft Graph",
          "Graph Explorer",
          "REST API",
          "Developer Tools",
          "Permissions"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/graph/graph-explorer/graph-explorer-features"
      },
      "summary": {
        "ko": "Graph Explorer의 화면 구성, 최소 권한 동의 방법, 샘플 쿼리·리소스·기록 탭, 쿼리 영역과 코드 조각·Toolkit·Adaptive Cards 활용 및 토큰·공유 링크 주의점을 정리합니다.",
        "en": "Covers Graph Explorer's layout, least-privilege consent, sample queries, resources and history tabs, the query area, and using code snippets, Toolkit and Adaptive Cards, with cautions on tokens and share links."
      },
      "thumbnail": "",
      "readingMinutes": 3
    },
    {
      "id": "entra-액세스-검토-access-reviews-로-그룹-앱-권한-정기-점검하기-범위-검토자-자동-적용-설",
      "title": {
        "ko": "Entra 액세스 검토(Access reviews)로 그룹·앱 권한 정기 점검하기 — 범위, 검토자, 자동 적용 설계",
        "en": "Periodic Group and App Access Checks with Entra Access Reviews — Scope, Reviewers, and Auto-Apply Design"
      },
      "category": "m365",
      "tags": {
        "ko": [
          "Entra ID Governance",
          "액세스 검토",
          "게스트 관리",
          "권한 회수",
          "최소 권한"
        ],
        "en": [
          "Entra ID Governance",
          "Access Reviews",
          "Guest Management",
          "Access Revocation",
          "Least Privilege"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/entra/id-governance/create-access-review"
      },
      "summary": {
        "ko": "그룹과 앱 대상 액세스 검토의 범위·검토자·주기 설정, 무응답 처리와 자동 적용의 위험, 결정 도우미, 다단계 검토, 현재/시리즈 설정 구분까지 운영 관점으로 정리합니다.",
        "en": "An operations-focused look at access reviews for groups and apps: scope, reviewers and recurrence, non-response handling and auto-apply risks, decision helpers, multi-stage reviews, and Current vs Series settings."
      },
      "thumbnail": "",
      "readingMinutes": 4
    },
    {
      "id": "entra-자격-관리-entitlement-management-액세스-패키지-만들기-카탈로그-정책-승인-수명",
      "title": {
        "ko": "Entra 자격 관리(Entitlement management) 액세스 패키지 만들기 — 카탈로그, 정책, 승인, 수명 주기 설계",
        "en": "Creating Entra Entitlement Management Access Packages — Catalogs, Policies, Approvals, and Lifecycle Design"
      },
      "category": "m365",
      "tags": {
        "ko": [
          "Entra ID Governance",
          "자격 관리",
          "액세스 패키지",
          "승인",
          "게스트 관리"
        ],
        "en": [
          "Entra ID Governance",
          "Entitlement Management",
          "Access Package",
          "Approval",
          "Guest Management"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/entra/id-governance/entitlement-management-access-package-create"
      },
      "summary": {
        "ko": "카탈로그와 리소스 역할, 요청 정책(내부·외부·관리자 직접 할당), 1~3단계 승인과 대체 승인자, 만료·연장·액세스 검토를 한 번에 설계하는 액세스 패키지 생성 절차와 PowerShell 예제를 정리합니다.",
        "en": "Walks through creating an access package: catalogs and resource roles, request policies (internal, external, admin-only), one- to three-stage approvals with alternates, expiration, extensions and access reviews, with a PowerShell example."
      },
      "thumbnail": "",
      "readingMinutes": 5
    },
    {
      "id": "microsoft-entra-셀프-서비스-암호-재설정-sspr-도입-가이드-파일럿-그룹부터-검증까지",
      "title": {
        "ko": "Microsoft Entra 셀프 서비스 암호 재설정(SSPR) 도입 가이드 — 파일럿 그룹부터 검증까지",
        "en": "Microsoft Entra Self-Service Password Reset (SSPR) Rollout Guide — From Pilot Group to Validation"
      },
      "category": "m365",
      "tags": {
        "ko": [
          "Entra ID",
          "SSPR",
          "암호 재설정",
          "인증 방법",
          "헬프데스크"
        ],
        "en": [
          "Entra ID",
          "SSPR",
          "Password Reset",
          "Authentication Methods",
          "Help Desk"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/entra/identity/authentication/tutorial-enable-sspr"
      },
      "summary": {
        "ko": "파일럿 그룹으로 SSPR을 켜고 인증 방법·등록·알림을 설정한 뒤 비관리자 계정으로 검증하는 절차와, 레거시 정책 폐지·하이브리드 운영상의 주의점을 정리합니다.",
        "en": "Steps to enable SSPR for a pilot group, configure methods, registration and notifications, and validate with a non-admin account, plus notes on legacy policy retirement and hybrid operation."
      },
      "thumbnail": "",
      "readingMinutes": 2
    },
    {
      "id": "power-bi-행-수준-보안-rls-설계하기-역할-정의부터-동적-rls-검증까지",
      "title": {
        "ko": "Power BI 행 수준 보안(RLS) 설계하기 — 역할 정의부터 동적 RLS, 검증까지",
        "en": "Designing Power BI Row-Level Security (RLS) — From Role Definition to Dynamic RLS and Validation"
      },
      "category": "powerplatform",
      "tags": {
        "ko": [
          "Power BI",
          "행 수준 보안",
          "RLS",
          "DAX",
          "데이터 보안"
        ],
        "en": [
          "Power BI",
          "Row-Level Security",
          "RLS",
          "DAX",
          "Data Security"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/fabric/security/service-admin-row-level-security"
      },
      "summary": {
        "ko": "Power BI에서 사용자별로 보이는 행을 제한하는 RLS의 4단계 워크플로, 정적·동적 DAX 필터 패턴, 서비스에서 멤버 추가와 역할로 테스트하기, B2B 게스트와 임베드 시나리오의 함정을 정리합니다.",
        "en": "Covers the four-step RLS workflow for limiting rows per user in Power BI, static and dynamic DAX filter patterns, adding members and testing as a role in the service, and pitfalls with B2B guests and embedding."
      },
      "thumbnail": "",
      "readingMinutes": 5
    },
    {
      "id": "power-apps-컴포넌트-라이브러리-재사용-가능한-ui를-공유하고-버전-관리하는-방법",
      "title": {
        "ko": "Power Apps 컴포넌트 라이브러리 — 재사용 가능한 UI를 공유하고 버전 관리하는 방법",
        "en": "Power Apps Component Libraries — Sharing and Versioning Reusable UI Components"
      },
      "category": "powerplatform",
      "tags": {
        "ko": [
          "Power Apps",
          "캔버스 앱",
          "컴포넌트 라이브러리",
          "재사용",
          "버전 관리"
        ],
        "en": [
          "Power Apps",
          "Canvas Apps",
          "Component Library",
          "Reuse",
          "Versioning"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/component-library"
      },
      "summary": {
        "ko": "캔버스 앱에서 헤더·메뉴 같은 UI를 여러 앱이 함께 쓰게 하는 컴포넌트 라이브러리의 생성·게시·가져오기·업데이트 흐름과 권한, 제한 사항을 정리합니다.",
        "en": "Covers creating, publishing, importing, and updating component libraries that let many canvas apps share UI such as headers and menus, plus permissions and limitations."
      },
      "thumbnail": "",
      "readingMinutes": 4
    },
    {
      "id": "power-platform-솔루션과-파이프라인으로-alm-시작하기-개발-테스트-운영-배포-자동화",
      "title": {
        "ko": "Power Platform 솔루션과 파이프라인으로 ALM 시작하기 — 개발·테스트·운영 배포 자동화",
        "en": "Getting Started with ALM in Power Platform — Solutions and Pipelines for Dev, Test, and Production Deployment"
      },
      "category": "powerplatform",
      "tags": {
        "ko": [
          "Power Platform",
          "ALM",
          "솔루션",
          "파이프라인",
          "배포"
        ],
        "en": [
          "Power Platform",
          "ALM",
          "Solutions",
          "Pipelines",
          "Deployment"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/power-platform/alm/pipelines"
      },
      "summary": {
        "ko": "Power Platform에서 앱·플로를 환경 간에 안전하게 옮기는 솔루션의 구조와, 관리자가 몇 분 만에 구성하는 파이프라인의 동작 원리·라이선스·운영 FAQ를 정리합니다.",
        "en": "Covers how solutions move apps and flows safely between environments in Power Platform, and how pipelines work, their licensing, and operational FAQs that admins can configure in minutes."
      },
      "thumbnail": "",
      "readingMinutes": 4
    },
    {
      "id": "microsoft-entra-b2b-협업-가이드-외부-파트너를-게스트로-안전하게-초대하고-통제하기",
      "title": {
        "ko": "Microsoft Entra B2B 협업 가이드 — 외부 파트너를 게스트로 안전하게 초대하고 통제하기",
        "en": "Microsoft Entra B2B Collaboration Guide — Inviting and Governing External Partners as Guests Safely"
      },
      "category": "m365",
      "tags": {
        "ko": [
          "Entra External ID",
          "B2B",
          "게스트 사용자",
          "교차 테넌트 액세스",
          "외부 협업"
        ],
        "en": [
          "Entra External ID",
          "B2B",
          "Guest Users",
          "Cross-Tenant Access",
          "External Collaboration"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/entra/external-id/what-is-b2b"
      },
      "summary": {
        "ko": "B2B 협업의 초대·사용 흐름, 교차 테넌트 액세스 설정과 외부 협업 설정의 역할 차이, 셀프 서비스 가입, Conditional Access 적용, SharePoint·OneDrive 연동까지 정리합니다.",
        "en": "Covers the B2B invitation and redemption flow, the difference between cross-tenant access settings and external collaboration settings, self-service sign-up, Conditional Access, and SharePoint and OneDrive integration."
      },
      "thumbnail": "",
      "readingMinutes": 4
    },
    {
      "id": "microsoft-entra-pim-실전-가이드-상시-관리자-권한을-just-in-time으로-바꾸는-방법",
      "title": {
        "ko": "Microsoft Entra PIM 실전 가이드 — 상시 관리자 권한을 Just-in-Time으로 바꾸는 방법",
        "en": "Microsoft Entra PIM in Practice — Replacing Standing Admin Access with Just-in-Time Elevation"
      },
      "category": "m365",
      "tags": {
        "ko": [
          "Entra PIM",
          "Privileged Identity Management",
          "최소 권한",
          "관리자 권한",
          "Zero Trust"
        ],
        "en": [
          "Entra PIM",
          "Privileged Identity Management",
          "Least Privilege",
          "Admin Roles",
          "Zero Trust"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-configure"
      },
      "summary": {
        "ko": "Eligible과 Active 할당의 차이, 활성화·승인·연장 흐름, 알림과 접근 검토까지 PIM의 핵심 개념을 정리하고 상시 관리자 권한을 줄이는 도입 순서를 제안합니다.",
        "en": "Explains eligible versus active assignments, the activate, approve, and extend flow, notifications, and access reviews, and proposes an order for reducing standing admin access."
      },
      "thumbnail": "",
      "readingMinutes": 4
    },
    {
      "id": "microsoft-entra-id-protection-위험-탐지부터-자동-조치까지-아이덴티티-리스크-운영하기",
      "title": {
        "ko": "Microsoft Entra ID Protection — 위험 탐지부터 자동 조치까지 아이덴티티 리스크 운영하기",
        "en": "Microsoft Entra ID Protection — Operating Identity Risk from Detection to Automated Remediation"
      },
      "category": "m365",
      "tags": {
        "ko": [
          "Entra ID Protection",
          "위험 기반 정책",
          "Conditional Access",
          "위험 사용자",
          "ID 보안"
        ],
        "en": [
          "Entra ID Protection",
          "Risk-Based Policy",
          "Conditional Access",
          "Risky Users",
          "Identity Security"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/entra/id-protection/overview-identity-protection"
      },
      "summary": {
        "ko": "ID Protection의 탐지·조사·조치 3단계, 위험 사용자·위험 로그인 보고서 읽는 법, 위험 기반 Conditional Access와 자가 복구, 의심 상황별 조사 요령을 정리합니다.",
        "en": "Covers ID Protection's detect, investigate, and remediate stages, reading risky user and risky sign-in reports, risk-based Conditional Access with self-remediation, and investigation tips by detection type."
      },
      "thumbnail": "",
      "readingMinutes": 4
    },
    {
      "id": "microsoft-purview-insider-risk-management-내부자-위험-정책-경고-케이스-운",
      "title": {
        "ko": "Microsoft Purview Insider Risk Management — 내부자 위험 정책·경고·케이스 운영 흐름",
        "en": "Microsoft Purview Insider Risk Management — Operating Policies, Alerts, and Cases for Internal Risk"
      },
      "category": "m365",
      "tags": {
        "ko": [
          "Insider Risk Management",
          "Microsoft Purview",
          "내부자 위험",
          "정책 템플릿",
          "컴플라이언스"
        ],
        "en": [
          "Insider Risk Management",
          "Microsoft Purview",
          "Insider Risk",
          "Policy Templates",
          "Compliance"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/purview/insider-risk-management"
      },
      "summary": {
        "ko": "내부자 위험 관리의 정책 → 경고 → 분류 → 조사 → 조치 워크플로, 대표 정책 템플릿과 시나리오, 도입 시 알아둘 개인정보 보호 원칙과 연동 기능을 정리합니다.",
        "en": "Covers the Insider Risk Management workflow of policies, alerts, triage, investigation, and action, key policy templates and scenarios, and the privacy principles and integrations to know before adopting."
      },
      "thumbnail": "",
      "readingMinutes": 4
    },
    {
      "id": "intune-앱-보호-정책-mam-이해하기-등록-없이-byod-기기의-회사-데이터-지키기",
      "title": {
        "ko": "Intune 앱 보호 정책(MAM) 이해하기 — 등록 없이 BYOD 기기의 회사 데이터 지키기",
        "en": "Understanding Intune App Protection Policies (MAM) — Securing Company Data on BYOD Devices Without Enrollment"
      },
      "category": "m365",
      "tags": {
        "ko": [
          "Intune",
          "앱 보호 정책",
          "MAM",
          "BYOD",
          "모바일 보안"
        ],
        "en": [
          "Intune",
          "App Protection Policies",
          "MAM",
          "BYOD",
          "Mobile Security"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/intune/app-management/protection/overview"
      },
      "summary": {
        "ko": "앱 보호 정책이 앱 단위로 회사 데이터를 어떻게 보호하는지, MDM 등록 여부에 따른 두 가지 구성, 데이터 이동·접근 요구·조건부 실행 설계 포인트와 도입 순서를 정리합니다.",
        "en": "Explains how app protection policies secure company data at the app level, the two setups with and without MDM enrollment, design points for data movement, access requirements, and conditional launch, and a rollout order."
      },
      "thumbnail": "",
      "readingMinutes": 3
    },
    {
      "id": "conditional-access-정책-설계-가이드-신호-결정-적용으로-보는-zero-trust-접근-통제",
      "title": {
        "ko": "Conditional Access 정책 설계 가이드 — 신호·결정·적용으로 보는 Zero Trust 접근 통제",
        "en": "Conditional Access Policy Design Guide — Zero Trust Access Control Through Signals, Decisions, and Enforcement"
      },
      "category": "m365",
      "tags": {
        "ko": [
          "Conditional Access",
          "Microsoft Entra",
          "Zero Trust",
          "MFA",
          "보안"
        ],
        "en": [
          "Conditional Access",
          "Microsoft Entra",
          "Zero Trust",
          "MFA",
          "Security"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview"
      },
      "summary": {
        "ko": "Conditional Access를 '신호 → 결정 → 적용' 구조로 풀어 설명하고, 처음 도입할 때 꼭 필요한 정책 묶음과 report-only 기반 단계적 롤아웃, 커버리지 점검 방법까지 정리합니다.",
        "en": "Breaks Conditional Access down into signals, decisions, and enforcement, then covers the baseline policy set, a report-only phased rollout, and how to check coverage."
      },
      "thumbnail": "",
      "readingMinutes": 3
    },
    {
      "id": "spf-dkim-dmarc-한-번에-이해하기-microsoft-365-메일-스푸핑-방어-설정-순서",
      "title": {
        "ko": "SPF·DKIM·DMARC 한 번에 이해하기 — Microsoft 365 메일 스푸핑 방어 설정 순서",
        "en": "Understanding SPF, DKIM, and DMARC Together — Setting Up Microsoft 365 Anti-Spoofing in the Right Order"
      },
      "category": "m365",
      "tags": {
        "ko": [
          "SPF",
          "DKIM",
          "DMARC",
          "Exchange Online",
          "이메일 보안"
        ],
        "en": [
          "SPF",
          "DKIM",
          "DMARC",
          "Exchange Online",
          "Email Security"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/defender-office-365/email-authentication-about"
      },
      "summary": {
        "ko": "SPF·DKIM·DMARC가 각각 무엇을 검증하고 왜 함께 써야 하는지, DMARC를 p=none에서 reject까지 안전하게 올리는 순서와 Authentication-Results 헤더로 실패 원인을 진단하는 방법을 정리합니다.",
        "en": "Explains what SPF, DKIM, and DMARC each verify and why they must work together, how to raise DMARC from p=none to reject safely, and how to diagnose failures from the Authentication-Results header."
      },
      "thumbnail": "",
      "readingMinutes": 4
    },
    {
      "id": "defender-for-office-365-plan-1-vs-plan-2-보호-사다리로-이해하는-메일-협업-",
      "title": {
        "ko": "Defender for Office 365 Plan 1 vs Plan 2 — 보호 사다리로 이해하는 메일·협업 보안",
        "en": "Defender for Office 365 Plan 1 vs Plan 2 — Email and Collaboration Security as a Protection Ladder"
      },
      "category": "m365",
      "tags": {
        "ko": [
          "Defender for Office 365",
          "Exchange Online",
          "Safe Links",
          "피싱",
          "보안"
        ],
        "en": [
          "Defender for Office 365",
          "Exchange Online",
          "Safe Links",
          "Phishing",
          "Security"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/defender-office-365/mdo-about"
      },
      "summary": {
        "ko": "기본 내장 보호, Plan 1, Plan 2를 '예방·조사·대응' 세 축의 사다리로 비교하고, 포털에서 두 플랜을 구분하는 방법과 어떤 조직에 어떤 플랜이 맞는지 판단 기준을 정리합니다.",
        "en": "Compares built-in protection, Plan 1, and Plan 2 on prevention, investigation, and response, shows how to tell the plans apart in the portal, and gives criteria for choosing."
      },
      "thumbnail": "",
      "readingMinutes": 3
    },
    {
      "id": "copilot-도입-전-필수-점검-오버셰어링-정리와-가드레일-구성-3단계",
      "title": {
        "ko": "Copilot 도입 전 필수 점검 — 오버셰어링 정리와 가드레일 구성 3단계",
        "en": "Before Rolling Out Copilot — Fixing Oversharing and Building Guardrails in Three Steps"
      },
      "category": "m365",
      "tags": {
        "ko": [
          "Microsoft Copilot",
          "오버셰어링",
          "SharePoint Advanced Management",
          "Purview",
          "DLP"
        ],
        "en": [
          "Microsoft Copilot",
          "Oversharing",
          "SharePoint Advanced Management",
          "Purview",
          "DLP"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/microsoft-365/copilot/configure-secure-governed-data-foundation-microsoft-365-copilot"
      },
      "summary": {
        "ko": "Copilot은 사용자가 이미 접근 권한을 가진 데이터만 근거로 삼습니다. 그래서 도입 전에 오버셰어링 정리 → 가드레일 구성 → 규제 대응 순서로 점검해야 하는 이유와 실무 체크리스트를 정리합니다.",
        "en": "Copilot only grounds on data a user can already access, so oversharing must be cleaned up first. A practical checklist: remediate oversharing, set up guardrails, then meet regulations."
      },
      "thumbnail": "",
      "readingMinutes": 4
    },
    {
      "id": "microsoft-purview-보존-정책-vs-보존-레이블-남길-것은-남기고-지울-것은-지우는-설계",
      "title": {
        "ko": "Microsoft Purview 보존 정책 vs 보존 레이블 — 남길 것은 남기고 지울 것은 지우는 설계",
        "en": "Microsoft Purview Retention Policies vs Retention Labels — Designing What to Keep and What to Delete"
      },
      "category": "m365",
      "tags": {
        "ko": [
          "Microsoft Purview",
          "데이터 보존",
          "Retention",
          "컴플라이언스",
          "Data Lifecycle Management"
        ],
        "en": [
          "Microsoft Purview",
          "Data Retention",
          "Retention",
          "Compliance",
          "Data Lifecycle Management"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/purview/retention"
      },
      "summary": {
        "ko": "보존 정책과 보존 레이블의 적용 범위와 역할 차이, 보존·삭제 동작 세 가지, 여러 설정이 충돌할 때 결과를 가르는 보존 원칙 네 가지를 설계 관점에서 정리합니다.",
        "en": "Covers how retention policies and retention labels differ in scope and role, the three retain/delete behaviors, and the four principles that decide the outcome when settings conflict."
      },
      "thumbnail": "",
      "readingMinutes": 4
    },
    {
      "id": "power-platform-데이터-정책-dlp-설계하기-커넥터-그룹-범위-기본-그룹-전략",
      "title": {
        "ko": "Power Platform 데이터 정책(DLP) 설계하기 — 커넥터 그룹·범위·기본 그룹 전략",
        "en": "Designing Power Platform Data Policies (DLP) — Connector Groups, Scope, and the Default Group Strategy"
      },
      "category": "powerplatform",
      "tags": {
        "ko": [
          "Power Platform",
          "데이터 정책",
          "DLP",
          "커넥터",
          "거버넌스"
        ],
        "en": [
          "Power Platform",
          "Data Policy",
          "DLP",
          "Connectors",
          "Governance"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/power-platform/admin/prevent-data-loss"
      },
      "summary": {
        "ko": "Power Apps·Power Automate에서 데이터가 엉뚱한 곳으로 흘러가지 않게 하는 데이터 정책을 Business·Non-business·Blocked 그룹, 테넌트·환경 범위, 새 커넥터 기본 그룹 관점에서 설계하는 방법을 정리합니다.",
        "en": "How to design Power Platform data policies that keep business data from flowing to the wrong places, using the Business, Non-business, and Blocked groups, tenant versus environment scope, and the default group for new connectors."
      },
      "thumbnail": "",
      "readingMinutes": 4
    },
    {
      "id": "power-automate-오류-처리-설계-run-after-try-catch-스코프-재시도-정책-실전-패턴",
      "title": {
        "ko": "Power Automate 오류 처리 설계 — Run after·Try/Catch 스코프·재시도 정책 실전 패턴",
        "en": "Error Handling in Power Automate — Practical Patterns with Run After, Try/Catch Scopes, and Retry Policies"
      },
      "category": "powerplatform",
      "tags": {
        "ko": [
          "Power Automate",
          "오류 처리",
          "Run after",
          "Scope",
          "재시도 정책"
        ],
        "en": [
          "Power Automate",
          "Error Handling",
          "Run after",
          "Scope",
          "Retry Policy"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/error-handling"
      },
      "summary": {
        "ko": "플로가 실패했을 때 조용히 죽지 않게 만드는 방법 — Run after 설정, Try/Catch 스코프, result() 함수로 오류 추출, 지수 재시도, Terminate, 로깅과 알림까지 실전 패턴으로 정리합니다.",
        "en": "How to keep flows from failing silently: Run after settings, Try/Catch scopes, extracting errors with result(), exponential retries, Terminate, and logging with notifications."
      },
      "thumbnail": "",
      "readingMinutes": 4
    },
    {
      "id": "dataverse-보안-모델-이해하기-보안-역할-비즈니스-단위-팀-열-수준-보안-설계",
      "title": {
        "ko": "Dataverse 보안 모델 이해하기 — 보안 역할·비즈니스 단위·팀·열 수준 보안 설계",
        "en": "Understanding the Dataverse Security Model — Designing Security Roles, Business Units, Teams, and Column-Level Security"
      },
      "category": "powerplatform",
      "tags": {
        "ko": [
          "Dataverse",
          "보안 역할",
          "비즈니스 단위",
          "Power Platform",
          "권한 설계"
        ],
        "en": [
          "Dataverse",
          "Security Roles",
          "Business Units",
          "Power Platform",
          "Permission Design"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/power-platform/admin/wp-security-cds"
      },
      "summary": {
        "ko": "Dataverse의 권한은 보안 역할·비즈니스 단위·팀·레코드 공유·열 수준 보안이 누적되어 결정됩니다. 각 요소의 역할과 함께, Entra 보안 그룹과 연결하는 현실적인 설계 방법을 정리합니다.",
        "en": "Dataverse access is the accumulation of security roles, business units, teams, record sharing, and column-level security. Covers each element's role and a practical design linked to Entra security groups."
      },
      "thumbnail": "",
      "readingMinutes": 5
    },
    {
      "id": "microsoft-graph-인증-완전-정리-위임-권한-vs-애플리케이션-권한-클라이언트-자격-증명-흐름까지",
      "title": {
        "ko": "Microsoft Graph 인증 완전 정리 — 위임 권한 vs 애플리케이션 권한, 클라이언트 자격 증명 흐름까지",
        "en": "Microsoft Graph Authentication Explained — Delegated vs Application Permissions and the Client Credentials Flow"
      },
      "category": "dev",
      "tags": {
        "ko": [
          "Microsoft Graph",
          "OAuth 2.0",
          "Microsoft Entra",
          "MSAL",
          "API 권한"
        ],
        "en": [
          "Microsoft Graph",
          "OAuth 2.0",
          "Microsoft Entra",
          "MSAL",
          "API Permissions"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/graph/auth/auth-concepts"
      },
      "summary": {
        "ko": "Graph를 호출하려면 앱 등록, 권한, 액세스 토큰이 필요합니다. 위임 접근과 앱 전용 접근의 차이, 권한 선택 기준, 클라이언트 자격 증명 흐름 4단계, 실무에서 지켜야 할 보안 원칙을 정리합니다.",
        "en": "Calling Graph requires app registration, permissions, and an access token. Covers delegated versus app-only access, how to choose permissions, the four steps of the client credentials flow, and security practices."
      },
      "thumbnail": "",
      "readingMinutes": 4
    },
    {
      "id": "sharepoint-framework-spfx-개요-웹-파트-하나로-sharepoint-teams-viva-",
      "title": {
        "ko": "SharePoint Framework(SPFx) 개요 — 웹 파트 하나로 SharePoint·Teams·Viva·Copilot까지 확장하기",
        "en": "SharePoint Framework (SPFx) Overview — Extending SharePoint, Teams, Viva, and Copilot with One Web Part"
      },
      "category": "dev",
      "tags": {
        "ko": [
          "SPFx",
          "SharePoint Framework",
          "웹 파트",
          "Viva Connections",
          "Microsoft Teams"
        ],
        "en": [
          "SPFx",
          "SharePoint Framework",
          "Web Parts",
          "Viva Connections",
          "Microsoft Teams"
        ]
      },
      "date": "2026-10-14",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview"
      },
      "summary": {
        "ko": "SPFx의 특징과 지원 범위(SharePoint·Teams·Viva·Copilot), 애드인 모델과의 관계, 개발 도구, 그리고 지원되지 않는 방식(DOM 직접 의존)을 피하는 원칙을 정리합니다.",
        "en": "Covers SPFx's characteristics and reach (SharePoint, Teams, Viva, Copilot), its relation to the add-in model, development tooling, and the rule against depending on the page DOM."
      },
      "thumbnail": "",
      "readingMinutes": 4
    },
    {
      "id": "power-apps-캔버스-앱-vs-모델-기반-앱-뭘-언제-써야-하는지-실무-기준으로-정리",
      "title": {
        "ko": "Power Apps 캔버스 앱 vs 모델 기반 앱 — 뭘 언제 써야 하는지 실무 기준으로 정리",
        "en": "Power Apps Canvas Apps vs. Model-Driven Apps — A Practical Framework for Choosing"
      },
      "category": "powerplatform",
      "tags": {
        "ko": [
          "Power Apps",
          "캔버스 앱",
          "모델 기반 앱",
          "Dataverse",
          "Power Platform"
        ],
        "en": [
          "Power Apps",
          "Canvas Apps",
          "Model-Driven Apps",
          "Dataverse",
          "Power Platform"
        ]
      },
      "date": "2026-09-01",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/model-driven-app-overview"
      },
      "summary": {
        "ko": "화면부터 자유롭게 그리고 싶은지, 데이터 모델부터 설계하고 싶은지에 따라 갈리는 Power Apps의 두 앱 유형을, 데이터 소스 제약·설계 철학·적합한 시나리오까지 실무 기준으로 길게 비교합니다.",
        "en": "A long, practical comparison of Power Apps' two app types — canvas and model-driven — covering data-source constraints, design philosophy, and which real-world scenarios each one actually fits."
      },
      "thumbnail": "",
      "readingMinutes": 4
    },
    {
      "id": "microsoft-intune-기기-규정-준수-정책으로-회사-리소스-접근-통제하기-원리부터-condition",
      "title": {
        "ko": "Microsoft Intune 기기 규정 준수 정책으로 회사 리소스 접근 통제하기 — 원리부터 Conditional Access 연동까지",
        "en": "Enforcing Device Compliance with Microsoft Intune — From Policy Mechanics to Conditional Access Integration"
      },
      "category": "m365",
      "tags": {
        "ko": [
          "Microsoft Intune",
          "기기 규정 준수",
          "Conditional Access",
          "제로 트러스트",
          "엔드포인트 관리"
        ],
        "en": [
          "Microsoft Intune",
          "Device Compliance",
          "Conditional Access",
          "Zero Trust",
          "Endpoint Management"
        ]
      },
      "date": "2026-09-01",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/mem/intune/fundamentals/what-is-intune"
      },
      "summary": {
        "ko": "재택·BYOD 환경에서 \"이 기기를 믿어도 되는가\"라는 질문에 답하는 Intune 기기 규정 준수 정책을, 두 계층 구조·위반 시 조치·플랫폼별 차이부터 Conditional Access와 실제로 맞물리는 지점까지 실무 관점으로 길게 정리합니다.",
        "en": "A deep, practical walkthrough of Microsoft Intune device compliance policies — the two-tier policy structure, actions for noncompliance, platform differences, and exactly how compliance status feeds into Conditional Access to gate access to company resources."
      },
      "thumbnail": "",
      "readingMinutes": 4
    },
    {
      "id": "microsoft-copilot-studio로-나만의-ai-에이전트-만들기-시작부터-게시까지",
      "title": {
        "ko": "Microsoft Copilot Studio로 나만의 AI 에이전트 만들기 — 시작부터 게시까지",
        "en": "Building Custom AI Agents with Microsoft Copilot Studio — From Setup to Publishing"
      },
      "category": "powerplatform",
      "tags": {
        "ko": [
          "Copilot Studio",
          "AI 에이전트",
          "Power Platform",
          "자동화",
          "생성형 AI"
        ],
        "en": [
          "Copilot Studio",
          "AI Agents",
          "Power Platform",
          "Automation",
          "Generative AI"
        ]
      },
      "date": "2026-08-19",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio"
      },
      "summary": {
        "ko": "헬프데스크 질문 응대나 승인 요청 처리 같은 반복 업무를 대신할 AI 에이전트를, Copilot Studio에서 토픽·지식 소스·워크플로로 어떻게 구성하고 어느 채널에 게시하는지 실무 관점으로 정리합니다.",
        "en": "A practical look at building an AI agent in Copilot Studio to handle repetitive work like help-desk questions or approval requests — covering topics, knowledge sources, workflows, harness choices, and where to publish the result."
      },
      "thumbnail": "",
      "readingMinutes": 3
    },
    {
      "id": "microsoft-purview-민감도-레이블로-데이터-분류하고-보호하기",
      "title": {
        "ko": "Microsoft Purview 민감도 레이블로 데이터 분류하고 보호하기",
        "en": "Classifying and Protecting Data with Microsoft Purview Sensitivity Labels"
      },
      "category": "m365",
      "tags": {
        "ko": [
          "Microsoft Purview",
          "민감도 레이블",
          "정보 보호",
          "데이터 거버넌스",
          "컴플라이언스"
        ],
        "en": [
          "Microsoft Purview",
          "Sensitivity Labels",
          "Information Protection",
          "Data Governance",
          "Compliance"
        ]
      },
      "date": "2026-08-19",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/purview/get-started-with-sensitivity-labels"
      },
      "summary": {
        "ko": "문서·메일에 민감도 레이블을 붙여 암호화·워터마크·DLP 조건으로 연결하는 방법을, 레이블 설계부터 자동/필수 레이블링, 앱별 적용 범위, 권한·라이선스까지 실무 관점으로 정리합니다.",
        "en": "A practical rundown of Microsoft Purview sensitivity labels — from naming and protection design through auto-labeling and mandatory labeling, cross-app coverage, and the permissions and licensing needed to run it in production."
      },
      "thumbnail": "",
      "readingMinutes": 4
    },
    {
      "id": "microsoft-entra-id-governance로-입사-이동-퇴사-자동화하기-lifecycle-work",
      "title": {
        "ko": "Microsoft Entra ID Governance로 입사·이동·퇴사 자동화하기 — Lifecycle Workflows 정리",
        "en": "Automating Joiner, Mover, and Leaver Processes with Microsoft Entra ID Governance — A Lifecycle Workflows Overview"
      },
      "category": "m365",
      "tags": {
        "ko": [
          "Microsoft Entra",
          "ID Governance",
          "Lifecycle Workflows",
          "자동화",
          "IAM"
        ],
        "en": [
          "Microsoft Entra",
          "ID Governance",
          "Lifecycle Workflows",
          "Automation",
          "IAM"
        ]
      },
      "date": "2026-08-13",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/entra/id-governance/what-are-lifecycle-workflows"
      },
      "summary": {
        "ko": "HR 이벤트 기반으로 입사·이동·퇴사 시 계정·그룹·라이선스 처리를 자동화하는 Entra ID Governance Lifecycle Workflows의 트리거·실행 모델·템플릿을 정리합니다.",
        "en": "A rundown of Entra ID Governance Lifecycle Workflows — the triggers, execution model, and templates that automate account, group, and license handling for joiner, mover, and leaver events based on HR data."
      },
      "thumbnail": "",
      "readingMinutes": 3
    },
    {
      "id": "vpn-없이-사내-앱에-접근하기-microsoft-entra-private-access-ztna-구조-이해하",
      "title": {
        "ko": "[증적] Microsoft Entra Private Access(ZTNA) 앱 온보딩부터 세션 제어까지 — 실습 가이드",
        "en": "[Verified Lab] Microsoft Entra Private Access (ZTNA): From App Onboarding to Session Control — A Hands-On Guide"
      },
      "category": "m365",
      "tags": {
        "ko": [
          "Microsoft Entra",
          "Global Secure Access",
          "Private Access",
          "ZTNA",
          "제로트러스트",
          "증적"
        ],
        "en": [
          "Microsoft Entra",
          "Global Secure Access",
          "Private Access",
          "ZTNA",
          "Zero Trust",
          "Verified Lab"
        ]
      },
      "date": "2026-08-12",
      "source": {
        "type": "original",
        "url": ""
      },
      "summary": {
        "ko": "앱 온보딩, 조건부 액세스 연계, MFA 강제, 세션 제어, 로그 증적까지 Entra Private Access(ZTNA)를 실제로 구성하고 검증하는 5단계를 실습 캡처 20여 장과 오류 코드·KQL 쿼리 예시로 정리했습니다.",
        "en": "A hands-on, evidence-backed walkthrough of configuring and verifying Entra Private Access (ZTNA) across five stages — app onboarding, Conditional Access integration, MFA enforcement, session control, and log evidence — illustrated with 20+ lab screenshots plus error codes and KQL query examples."
      },
      "thumbnail": "",
      "readingMinutes": 14
    },
    {
      "id": "microsoft-entra-internet-access로-인터넷-트래픽-통제하기-정책-설계부터-로그-가시성",
      "title": {
        "ko": "[증적] Microsoft Entra Internet Access 정책 설계부터 예외처리·운영까지 — 실습 가이드",
        "en": "[Verified Lab] Microsoft Entra Internet Access: From Policy Design to Exception Handling and Operations — A Hands-On Guide"
      },
      "category": "m365",
      "tags": {
        "ko": [
          "Microsoft Entra",
          "Global Secure Access",
          "Entra Internet Access",
          "제로트러스트",
          "SWG",
          "증적"
        ],
        "en": [
          "Microsoft Entra",
          "Global Secure Access",
          "Entra Internet Access",
          "Zero Trust",
          "SWG",
          "Verified Lab"
        ]
      },
      "date": "2026-08-12",
      "source": {
        "type": "original",
        "url": ""
      },
      "summary": {
        "ko": "정책 설계, 전/후 제어포인트 확인, 로그 가시성, 예외처리, 운영 가이드까지 Entra Internet Access를 실제로 구성하고 증적을 남기는 5단계를 실습 캡처 25장과 함께 상세히 정리했습니다.",
        "en": "A detailed, evidence-backed walkthrough of configuring Entra Internet Access across five stages — policy design, before/after control-point checks, log visibility, exception handling, and an operations playbook — illustrated with 25 lab screenshots."
      },
      "thumbnail": "",
      "readingMinutes": 15
    },
    {
      "id": "agent-365-entra-agent-id-완전-정리-ai-에이전트에게도-사원증-이-필요한-이유",
      "title": {
        "ko": "Agent 365 & Entra Agent ID 완전 정리 — AI 에이전트에게도 '사원증'이 필요한 이유",
        "en": "Agent 365 & Entra Agent ID Explained — Why AI Agents Need Employee Badges Too"
      },
      "category": "m365",
      "tags": {
        "ko": [
          "Agent 365",
          "Entra Agent ID",
          "AI 에이전트",
          "Microsoft Entra",
          "제로트러스트"
        ],
        "en": [
          "Agent 365",
          "Entra Agent ID",
          "AI Agents",
          "Microsoft Entra",
          "Zero Trust"
        ]
      },
      "date": "2026-08-11",
      "source": {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=WTcyL68qTo8"
      },
      "summary": {
        "ko": "폭증하는 AI 에이전트를 사람 직원처럼 식별·보호·관리하는 Microsoft Agent 365와 Entra Agent ID의 핵심 구조(블루프린트, 인증 흐름, Entra/Purview/Defender 통합, 레지스트리)를 정리했습니다.",
        "en": "A breakdown of Microsoft Agent 365 and Entra Agent ID — the core architecture (blueprint, authentication flow, Entra/Purview/Defender integration, and the agent registry) built to identify, protect, and govern the exploding population of AI agents the same way we manage human employees."
      },
      "thumbnail": "",
      "readingMinutes": 3
    },
    {
      "id": "welcome-technote",
      "title": {
        "ko": "TechNote 블로그를 시작합니다",
        "en": "Launching the TechNote Blog"
      },
      "category": "dev",
      "tags": {
        "ko": [
          "소개",
          "블로그",
          "GitHub Pages"
        ],
        "en": [
          "Introduction",
          "Blog",
          "GitHub Pages"
        ]
      },
      "date": "2026-07-27",
      "source": {
        "type": "original",
        "url": ""
      },
      "summary": {
        "ko": "M365, Power Platform, 개발 관련 실전 노트를 정리하는 공간입니다. 링크를 받아 자동으로 글이 쌓이도록 설계했습니다.",
        "en": "A space for writing up practical notes on M365, Power Platform, and development — designed so new posts can be generated automatically just by handing over a link."
      },
      "thumbnail": "",
      "readingMinutes": 2
    },
    {
      "id": "power-automate-approval-flow",
      "title": {
        "ko": "Power Automate로 문서 승인 흐름 만들기",
        "en": "Building a Document Approval Flow with Power Automate"
      },
      "category": "powerplatform",
      "tags": {
        "ko": [
          "Power Automate",
          "승인",
          "SharePoint",
          "자동화"
        ],
        "en": [
          "Power Automate",
          "Approvals",
          "SharePoint",
          "Automation"
        ]
      },
      "date": "2026-07-20",
      "source": {
        "type": "original",
        "url": ""
      },
      "summary": {
        "ko": "SharePoint 목록에 항목이 추가되면 관리자에게 승인 요청을 보내고 결과에 따라 상태를 업데이트하는 기본 승인 흐름을 단계별로 정리했습니다.",
        "en": "A step-by-step walkthrough of a basic approval flow: when an item is added to a SharePoint list, it sends an approval request to a manager and updates the status column based on the outcome."
      },
      "thumbnail": "",
      "readingMinutes": 6
    },
    {
      "id": "m365-purview-dlp-basics",
      "title": {
        "ko": "Microsoft Purview DLP 정책 기본 개념 정리",
        "en": "Microsoft Purview DLP Policy Basics"
      },
      "category": "m365",
      "tags": {
        "ko": [
          "Purview",
          "DLP",
          "보안",
          "컴플라이언스"
        ],
        "en": [
          "Purview",
          "DLP",
          "Security",
          "Compliance"
        ]
      },
      "date": "2026-07-12",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/purview/dlp-learn-about-dlp"
      },
      "summary": {
        "ko": "데이터 손실 방지(DLP) 정책의 구성 요소 - 위치, 규칙, 조건, 작업 - 를 한 장으로 정리하고 실무에서 자주 쓰는 설정을 소개합니다.",
        "en": "A one-page summary of the building blocks of a Data Loss Prevention (DLP) policy — locations, rules, conditions, and actions — along with the settings used most often in practice."
      },
      "thumbnail": "",
      "readingMinutes": 5
    },
    {
      "id": "graph-api-powershell-users",
      "title": {
        "ko": "Microsoft Graph PowerShell로 사용자 일괄 관리",
        "en": "Bulk-Managing Users with Microsoft Graph PowerShell"
      },
      "category": "dev",
      "tags": {
        "ko": [
          "Graph API",
          "PowerShell",
          "M365",
          "자동화",
          "스크립트"
        ],
        "en": [
          "Graph API",
          "PowerShell",
          "M365",
          "Automation",
          "Scripting"
        ]
      },
      "date": "2026-07-05",
      "source": {
        "type": "youtube",
        "url": "https://www.youtube.com/results?search_query=microsoft+graph+powershell"
      },
      "summary": {
        "ko": "Microsoft.Graph 모듈로 사용자 조회·생성·라이선스 할당을 자동화하는 실전 스크립트 예제를 정리했습니다.",
        "en": "Practical script examples for automating user lookup, creation, and license assignment using the Microsoft.Graph PowerShell module."
      },
      "thumbnail": "",
      "readingMinutes": 7
    }
  ]
};

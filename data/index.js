// 글 목록 메타데이터(제목/요약/태그 등, 본문 제외) — 목록·검색 페이지가 로드한다.
// 본문은 data/posts/<id>.js 에 개별 저장되어 글 상세 페이지에서만 지연 로드된다.
// 새 글 추가는 add_post.py 가 이 파일들을 자동으로 갱신한다. 직접 편집도 가능.
window.BLOG_INDEX = {
  "site": {
    "title": "TechNote",
    "subtitle": "M365 · Power Platform · Development",
    "description": "Microsoft 365, Power Platform, 그리고 개발에 관한 실전 노트와 정리 글",
    "author": "설용환",
    "baseUrl": "https://<your-username>.github.io/<repo>"
  },
  "categories": [
    {
      "id": "m365",
      "name": "Microsoft 365",
      "color": "#0f6cbd",
      "icon": "📊",
      "desc": "Teams, SharePoint, Exchange, Purview 등 M365 운영·관리"
    },
    {
      "id": "powerplatform",
      "name": "Power Platform",
      "color": "#742774",
      "icon": "⚡",
      "desc": "Power Apps, Power Automate, Power BI, Copilot Studio"
    },
    {
      "id": "dev",
      "name": "Development",
      "color": "#107c41",
      "icon": "💻",
      "desc": "스크립트, API, 자동화, 웹/클라우드 개발"
    }
  ],
  "posts": [
    {
      "id": "microsoft-entra-id-governance로-입사-이동-퇴사-자동화하기-lifecycle-work",
      "title": "Microsoft Entra ID Governance로 입사·이동·퇴사 자동화하기 — Lifecycle Workflows 정리",
      "category": "m365",
      "tags": [
        "Microsoft Entra",
        "ID Governance",
        "Lifecycle Workflows",
        "자동화",
        "IAM"
      ],
      "date": "2026-08-13",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/en-us/entra/id-governance/what-are-lifecycle-workflows"
      },
      "summary": "HR 이벤트 기반으로 입사·이동·퇴사 시 계정·그룹·라이선스 처리를 자동화하는 Entra ID Governance Lifecycle Workflows의 트리거·실행 모델·템플릿을 정리합니다.",
      "thumbnail": "",
      "readingMinutes": 3
    },
    {
      "id": "vpn-없이-사내-앱에-접근하기-microsoft-entra-private-access-ztna-구조-이해하",
      "title": "[증적] Microsoft Entra Private Access(ZTNA) 앱 온보딩부터 세션 제어까지 — 실습 가이드",
      "category": "m365",
      "tags": [
        "Microsoft Entra",
        "Global Secure Access",
        "Private Access",
        "ZTNA",
        "제로트러스트",
        "증적"
      ],
      "date": "2026-08-12",
      "source": {
        "type": "original",
        "url": ""
      },
      "summary": "앱 온보딩, 조건부 액세스 연계, MFA 강제, 세션 제어, 로그 증적까지 Entra Private Access(ZTNA)를 실제로 구성하고 검증하는 5단계를 실습 캡처 20여 장과 오류 코드·KQL 쿼리 예시로 정리했습니다.",
      "thumbnail": "",
      "readingMinutes": 14
    },
    {
      "id": "microsoft-entra-internet-access로-인터넷-트래픽-통제하기-정책-설계부터-로그-가시성",
      "title": "[증적] Microsoft Entra Internet Access 정책 설계부터 예외처리·운영까지 — 실습 가이드",
      "category": "m365",
      "tags": [
        "Microsoft Entra",
        "Global Secure Access",
        "Entra Internet Access",
        "제로트러스트",
        "SWG",
        "증적"
      ],
      "date": "2026-08-12",
      "source": {
        "type": "original",
        "url": ""
      },
      "summary": "정책 설계, 전/후 제어포인트 확인, 로그 가시성, 예외처리, 운영 가이드까지 Entra Internet Access를 실제로 구성하고 증적을 남기는 5단계를 실습 캡처 25장과 함께 상세히 정리했습니다.",
      "thumbnail": "",
      "readingMinutes": 15
    },
    {
      "id": "agent-365-entra-agent-id-완전-정리-ai-에이전트에게도-사원증-이-필요한-이유",
      "title": "Agent 365 & Entra Agent ID 완전 정리 — AI 에이전트에게도 '사원증'이 필요한 이유",
      "category": "m365",
      "tags": [
        "Agent 365",
        "Entra Agent ID",
        "AI 에이전트",
        "Microsoft Entra",
        "제로트러스트"
      ],
      "date": "2026-08-11",
      "source": {
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=WTcyL68qTo8"
      },
      "summary": "폭증하는 AI 에이전트를 사람 직원처럼 식별·보호·관리하는 Microsoft Agent 365와 Entra Agent ID의 핵심 구조(블루프린트, 인증 흐름, Entra/Purview/Defender 통합, 레지스트리)를 정리했습니다.",
      "thumbnail": "",
      "readingMinutes": 3
    },
    {
      "id": "welcome-technote",
      "title": "TechNote 블로그를 시작합니다",
      "category": "dev",
      "tags": [
        "소개",
        "블로그",
        "GitHub Pages"
      ],
      "date": "2026-07-27",
      "source": {
        "type": "original",
        "url": ""
      },
      "summary": "M365, Power Platform, 개발 관련 실전 노트를 정리하는 공간입니다. 링크를 받아 자동으로 글이 쌓이도록 설계했습니다.",
      "thumbnail": "",
      "readingMinutes": 2
    },
    {
      "id": "power-automate-approval-flow",
      "title": "Power Automate로 문서 승인 흐름 만들기",
      "category": "powerplatform",
      "tags": [
        "Power Automate",
        "승인",
        "SharePoint",
        "자동화"
      ],
      "date": "2026-07-20",
      "source": {
        "type": "original",
        "url": ""
      },
      "summary": "SharePoint 목록에 항목이 추가되면 관리자에게 승인 요청을 보내고 결과에 따라 상태를 업데이트하는 기본 승인 흐름을 단계별로 정리했습니다.",
      "thumbnail": "",
      "readingMinutes": 6
    },
    {
      "id": "m365-purview-dlp-basics",
      "title": "Microsoft Purview DLP 정책 기본 개념 정리",
      "category": "m365",
      "tags": [
        "Purview",
        "DLP",
        "보안",
        "컴플라이언스"
      ],
      "date": "2026-07-12",
      "source": {
        "type": "article",
        "url": "https://learn.microsoft.com/purview/dlp-learn-about-dlp"
      },
      "summary": "데이터 손실 방지(DLP) 정책의 구성 요소 - 위치, 규칙, 조건, 작업 - 를 한 장으로 정리하고 실무에서 자주 쓰는 설정을 소개합니다.",
      "thumbnail": "",
      "readingMinutes": 5
    },
    {
      "id": "graph-api-powershell-users",
      "title": "Microsoft Graph PowerShell로 사용자 일괄 관리",
      "category": "dev",
      "tags": [
        "Graph API",
        "PowerShell",
        "M365",
        "자동화",
        "스크립트"
      ],
      "date": "2026-07-05",
      "source": {
        "type": "youtube",
        "url": "https://www.youtube.com/results?search_query=microsoft+graph+powershell"
      },
      "summary": "Microsoft.Graph 모듈로 사용자 조회·생성·라이선스 할당을 자동화하는 실전 스크립트 예제를 정리했습니다.",
      "thumbnail": "",
      "readingMinutes": 7
    }
  ]
};

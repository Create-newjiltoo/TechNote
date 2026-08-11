// 블로그 데이터 (단일 소스). 서버 없이 file:// 로 열어도 동작하도록 JS 변수로 관리.
// 새 글 추가는 add_post.py 가 이 파일을 자동으로 갱신한다. 직접 편집도 가능.
window.BLOG_DATA = {
  "site": {
    "title": "TechNote",
    "subtitle": "M365 · Power Platform · Development",
    "description": "Microsoft 365, Power Platform, 그리고 개발에 관한 실전 노트와 정리 글",
    "author": "설용환",
    "baseUrl": "https://<your-username>.github.io/<repo>"
  },
  "categories": [
    { "id": "m365", "name": "Microsoft 365", "color": "#0f6cbd", "icon": "📊", "desc": "Teams, SharePoint, Exchange, Purview 등 M365 운영·관리" },
    { "id": "powerplatform", "name": "Power Platform", "color": "#742774", "icon": "⚡", "desc": "Power Apps, Power Automate, Power BI, Copilot Studio" },
    { "id": "dev", "name": "Development", "color": "#107c41", "icon": "💻", "desc": "스크립트, API, 자동화, 웹/클라우드 개발" }
  ],
  "posts": [
    {
      "id": "welcome-technote",
      "title": "TechNote 블로그를 시작합니다",
      "category": "dev",
      "tags": ["소개", "블로그", "GitHub Pages"],
      "date": "2026-07-27",
      "source": { "type": "original", "url": "" },
      "summary": "M365, Power Platform, 개발 관련 실전 노트를 정리하는 공간입니다. 링크를 받아 자동으로 글이 쌓이도록 설계했습니다.",
      "thumbnail": "",
      "readingMinutes": 2,
      "content": "<p>안녕하세요. 이 블로그는 <strong>Microsoft 365</strong>, <strong>Power Platform</strong>, 그리고 <strong>개발</strong> 관련 지식을 실전 위주로 정리하는 공간입니다.</p><h2>왜 만들었나</h2><p>흩어져 있는 자료(블로그, 유튜브, 기술 기사, 노션 메모)를 한곳에 모아 검색 가능하게 정리하기 위해서입니다.</p><h2>구조</h2><ul><li>카테고리: M365 / Power Platform / Development</li><li>태그로 세부 주제 분류</li><li>상단 검색으로 제목·요약·태그를 즉시 검색</li></ul><p>앞으로 링크를 받아 자동으로 글이 추가되도록 확장할 예정입니다.</p>"
    },
    {
      "id": "power-automate-approval-flow",
      "title": "Power Automate로 문서 승인 흐름 만들기",
      "category": "powerplatform",
      "tags": ["Power Automate", "승인", "SharePoint", "자동화"],
      "date": "2026-07-20",
      "source": { "type": "original", "url": "" },
      "summary": "SharePoint 목록에 항목이 추가되면 관리자에게 승인 요청을 보내고 결과에 따라 상태를 업데이트하는 기본 승인 흐름을 단계별로 정리했습니다.",
      "thumbnail": "",
      "readingMinutes": 6,
      "content": "<p>Power Automate의 <strong>승인(Approvals)</strong> 커넥터를 사용하면 코드 없이 결재 흐름을 구성할 수 있습니다.</p><h2>1. 트리거</h2><p>「SharePoint - 항목이 만들어질 때」 트리거로 시작합니다.</p><h2>2. 승인 시작</h2><p>「승인 시작 및 대기」 액션에서 <em>유형</em>을 '승인/거부 - 첫 번째 응답'으로 선택합니다.</p><h2>3. 조건 분기</h2><p>결과(Outcome)가 <code>Approve</code>인지에 따라 상태 열을 업데이트합니다.</p><blockquote>팁: 승인자에 여러 명을 넣을 땐 세미콜론으로 구분합니다.</blockquote>"
    },
    {
      "id": "m365-purview-dlp-basics",
      "title": "Microsoft Purview DLP 정책 기본 개념 정리",
      "category": "m365",
      "tags": ["Purview", "DLP", "보안", "컴플라이언스"],
      "date": "2026-07-12",
      "source": { "type": "article", "url": "https://learn.microsoft.com/purview/dlp-learn-about-dlp" },
      "summary": "데이터 손실 방지(DLP) 정책의 구성 요소 - 위치, 규칙, 조건, 작업 - 를 한 장으로 정리하고 실무에서 자주 쓰는 설정을 소개합니다.",
      "thumbnail": "",
      "readingMinutes": 5,
      "content": "<p><strong>DLP(Data Loss Prevention)</strong>는 민감 정보가 조직 밖으로 유출되는 것을 막는 정책입니다.</p><h2>구성 요소</h2><ul><li><strong>위치</strong>: Exchange, SharePoint, OneDrive, Teams, 엔드포인트</li><li><strong>규칙</strong>: 조건 + 작업의 묶음</li><li><strong>조건</strong>: 민감 정보 유형(주민번호, 카드번호 등)</li><li><strong>작업</strong>: 차단, 알림, 재정의 허용</li></ul><p>처음엔 <em>테스트 모드(정책 팁만 표시)</em>로 배포해 오탐을 확인한 뒤 강제 적용하는 것이 안전합니다.</p>"
    },
    {
      "id": "graph-api-powershell-users",
      "title": "Microsoft Graph PowerShell로 사용자 일괄 관리",
      "category": "dev",
      "tags": ["Graph API", "PowerShell", "M365", "자동화", "스크립트"],
      "date": "2026-07-05",
      "source": { "type": "youtube", "url": "https://www.youtube.com/results?search_query=microsoft+graph+powershell" },
      "summary": "Microsoft.Graph 모듈로 사용자 조회·생성·라이선스 할당을 자동화하는 실전 스크립트 예제를 정리했습니다.",
      "thumbnail": "",
      "readingMinutes": 7,
      "content": "<p>Graph PowerShell SDK로 M365 사용자 작업을 자동화할 수 있습니다.</p><h2>연결</h2><pre><code>Connect-MgGraph -Scopes \"User.ReadWrite.All\",\"Organization.Read.All\"</code></pre><h2>사용자 조회</h2><pre><code>Get-MgUser -Filter \"accountEnabled eq true\" -All</code></pre><h2>라이선스 할당</h2><pre><code>Set-MgUserLicense -UserId user@contoso.com -AddLicenses @{SkuId=$sku} -RemoveLicenses @()</code></pre><p>대량 작업 시에는 <code>-All</code> 과 배치 처리를 활용하세요.</p>"
    }
  ]
};

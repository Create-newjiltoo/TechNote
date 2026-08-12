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
      "summary": "앱 온보딩, 조건부 액세스 연계, MFA 강제, 세션 제어, 로그 증적까지 Entra Private Access(ZTNA)를 실제로 구성하고 검증하는 5단계를 오류 코드·KQL 쿼리 예시와 함께 정리했습니다.",
      "thumbnail": "",
      "readingMinutes": 4,
      "content": "<h2>사전 준비 — 커넥터가 살아있어야 시작된다</h2>\n<p>Private Access를 구성하려면 아래 요건이 먼저 갖춰져 있어야 합니다.</p>\n<ul>\n<li><strong>Entra ID 역할</strong> — Global Secure Access Administrator 또는 Global Administrator</li>\n<li><strong>라이선스</strong> — Microsoft Entra ID P1 이상 + Global Secure Access(Entra Suite/E7 포함)</li>\n<li><strong>클라이언트</strong> — Windows 10/11에 Global Secure Access Client 설치, Entra Join 또는 Hybrid Join 상태</li>\n<li><strong>내부망 요건</strong> — Entra Private Network Connector가 설치된 Windows Server가 내부망에 존재</li>\n<li><strong>대상 앱</strong> — HTTP/HTTPS 웹 앱 또는 RDP/SSH 같은 TCP 앱 최소 1개</li>\n</ul>\n<p>실습을 시작하기 전에는 <strong>Global Secure Access &gt; Connect &gt; Connectors</strong>에서 커넥터 상태가 Active이고 마지막 체크인 시간이 최근인지, 커넥터 그룹이 생성돼 있는지부터 확인합니다. 커넥터가 죽어 있으면 이후 모든 단계가 \"앱은 만들었는데 연결이 안 되는\" 상황으로 이어지므로 가장 먼저 점검해야 할 항목입니다.</p>\n\n<h2>STEP 1. Private 앱 온보딩 — IP·포트·프로토콜 세 가지만 정의한다</h2>\n<p>내부 앱을 Private Access에 올리는 절차는 <strong>Global Secure Access &gt; Applications &gt; Enterprise Applications</strong>에서 시작합니다.</p>\n<ol>\n<li>[+ New application]으로 앱을 하나 만들고 이름을 정합니다(예: <code>Internal-WebApp-ZTNA-Lab</code>).</li>\n<li>사전에 만들어 둔 Connector group을 지정합니다.</li>\n<li><strong>Application Segment</strong>를 추가합니다 — 대상 내부 앱의 IP 또는 FQDN(예: <code>192.168.10.100</code> 또는 <code>intranet.corp.local</code>), 포트(예: HTTPS는 443, HTTP는 80), 프로토콜(TCP)을 입력합니다.</li>\n<li>저장 후 생성된 앱의 <strong>Users and groups</strong>에서 테스트 사용자를 할당합니다.</li>\n</ol>\n<img src=\"assets/img/private-access-ztna/01-app-segment.png\" alt=\"Internal-WebApp-ZTNA-Lab 앱의 네트워크 액세스 속성 화면에 Application segment로 IP 10.164.237.47, 포트 80, TCP가 등록된 스크린샷\" loading=\"lazy\">\n<p class=\"img-caption\">Application Segment에 IP·포트·프로토콜을 등록하면 상태가 \"보류 중\"에서 곧 활성으로 바뀐다. 커넥터 그룹은 화면 상단에서 별도로 지정한다. (실습 환경 캡처)</p>\n<img src=\"https://learn.microsoft.com/en-us/entra/global-secure-access/media/how-to-target-resource-private-access-apps/enterprise-apps.png\" alt=\"Enterprise applications 상세 정보 화면 스크린샷\" loading=\"lazy\">\n<p class=\"img-caption\">Private Access로 온보딩된 앱은 다른 Enterprise Application과 동일한 방식으로 관리되고, 조건부 액세스 정책의 대상 리소스로도 지정할 수 있다. (출처: Microsoft Learn)</p>\n<p>Application Segment는 곧 \"이 앱은 정확히 여기까지만 열려 있다\"는 경계선입니다. IP나 서브넷을 넓게 잡을수록 관리는 편해지지만 제로 트러스트의 취지가 옅어지므로, 실무에서는 꼭 필요한 호스트·포트만 남기고 새 시스템이 생길 때마다 세그먼트를 추가하는 쪽이 더 안전한 기본값입니다. HTTP/HTTPS 웹 앱뿐 아니라 RDP·SSH 같은 TCP 기반 프로토콜도 같은 방식으로 세그먼트를 정의해 접근을 제어할 수 있습니다.</p>\n\n<h2>STEP 2. 조건부 액세스 연계 — 허용과 차단을 별도 정책으로 분리한다</h2>\n<p>앱을 온보딩했다고 아무나 들어올 수 있는 것은 아닙니다. 실제 접근 통제는 <strong>Conditional Access &gt; Policies</strong>에서 완성됩니다. 여기서는 허용 정책과 차단 정책을 별도로 만드는 패턴을 씁니다.</p>\n<ul>\n<li><strong>허용 정책</strong>(예: <code>CA-GSA-InternalApp-Allow-MFA</code>) — Users Include에 테스트 사용자 그룹을 지정하고, Target Resources는 \"Global Secure Access &gt; Private Access traffic\"으로 설정한 뒤, Grant에서 Require multifactor authentication을 체크(필요하면 Require compliant device도 추가)합니다.</li>\n<li><strong>차단 정책</strong>(예: <code>CA-GSA-InternalApp-Block-NonCompliant</code>) — Users Include는 전체 사용자, Exclude는 테스트 그룹으로 설정하고, Conditions의 Device platforms에서 비규격 디바이스 조건을 지정한 뒤 Grant를 Block access로 설정합니다.</li>\n</ul>\n<p>두 정책 모두 저장 전에는 Enable policy를 On으로 바꿔야 실제로 동작합니다. 정책을 두 개 이상 겹쳐서 만들다 보면 \"이 사용자에게는 결국 어떤 정책이 우선 적용되는가\"가 헷갈리기 쉬운데, 이때 <strong>What If 도구</strong>로 특정 사용자·리소스 조합을 넣어보면 실제 운영 정책을 건드리기 전에 결과를 미리 시뮬레이션할 수 있습니다.</p>\n<img src=\"assets/img/private-access-ztna/02-ca-allow-policy.png\" alt=\"CA-GSA-InternalApp-Allow-MFA 조건부 액세스 정책의 대상 리소스가 모든 리소스로, 세션이 로그인 빈도-매번으로 설정된 화면\" loading=\"lazy\">\n<p class=\"img-caption\">허용 정책 하나에 대상 리소스·네트워크·세션 설정이 한 화면에 모인다. 오른쪽 패널은 이 정책을 만든 조건부 액세스 정책과 동일한 화면이다. (실습 환경 캡처)</p>\n\n<h2>STEP 3. MFA 강제 — 성공과 실패, 두 흐름을 모두 확인한다</h2>\n<p>MFA 성공 시나리오는 테스트 사용자 계정으로 클라이언트 PC에 로그인한 뒤, 브라우저에서 온보딩된 내부 앱 URL(예: <code>https://intranet.corp.local</code>)에 접속하면 Entra ID 로그인 화면과 MFA 인증 요청 화면이 차례로 뜨고, 승인 후 내부 앱에 정상 접근하는 흐름입니다. 접속 후에는 GSA 클라이언트 트레이에서 연결 상태를 함께 확인합니다.</p>\n<p>실패 시나리오도 반드시 같이 확인해야 합니다. MFA 인증을 거부하면 접근 차단 화면과 오류 메시지가 표시되고, Entra Sign-in 로그에 실패 이벤트가 기록됩니다. 상황별 예상 동작을 정리하면 다음과 같습니다.</p>\n<ul>\n<li><strong>MFA 성공</strong> — 내부 앱 정상 접근, GSA 클라이언트 터널 활성화</li>\n<li><strong>MFA 실패(거부)</strong> — 접근 차단 화면 표시, 오류 코드 <code>AADSTS50076</code></li>\n<li><strong>MFA 미등록 사용자</strong> — MFA 등록 화면으로 리다이렉트</li>\n<li><strong>규격 미준수 디바이스</strong> — Block 정책 적용, 오류 코드 <code>AADSTS53003</code></li>\n</ul>\n<p>오류 코드까지 기억해 두면 헬프데스크 문의가 들어왔을 때 \"MFA 거부인지, 디바이스 규격 문제인지\"를 화면 캡처만 봐도 바로 구분할 수 있습니다.</p>\n<img src=\"assets/img/private-access-ztna/03-mfa-success-access.png\" alt=\"MFA 인증 성공 후 사내 사설망 웹페이지에 접속되어 'GSA ZTNA 검증 완료' 배지가 표시된 화면\" loading=\"lazy\">\n<p class=\"img-caption\">MFA를 통과하면 GSA Private Access 터널과 조건부 액세스 정책으로 보호되는 내부 리소스에 실제로 도달한다. (실습 환경 캡처)</p>\n\n<h2>STEP 4. 세션 제어 — 로그인 한 번이 영원히 유효하지 않도록</h2>\n<p>세션 제어를 적용하기 전에는 먼저 Baseline을 기록해 둡니다. 별도 세션 제어 없이 내부 앱에 접속한 뒤 30분 이상 방치했다가 재접속해서, 재인증 없이 그대로 접근되는지를 확인하는 것이 기준점입니다.</p>\n<p>이후 <code>CA-GSA-InternalApp-Allow-MFA</code> 정책을 편집해 Session 섹션에서 <strong>Sign-in frequency</strong>를 1시간으로, <strong>Persistent browser session</strong>을 \"Never persistent\"로 설정하고 저장합니다. 적용 후에는 같은 사용자로 접속해 1시간 경과 시점에 재접속했을 때 MFA 재인증이 요청되는지 확인합니다. 원한다면 Entra ID Protection에서 사용자 리스크를 상승시키는 시나리오로 리스크 기반 세션 제어까지 함께 검증할 수 있습니다.</p>\n<img src=\"assets/img/private-access-ztna/04-session-control-settings.png\" alt=\"조건부 액세스 정책의 세션 설정 패널에서 로그인 빈도가 1시간 주기적 재인증으로, 영구 브라우저 세션이 영구적이지 않음으로 설정된 화면\" loading=\"lazy\">\n<p class=\"img-caption\">Session 패널 하나에서 로그인 빈도와 브라우저 세션 지속 여부를 동시에 제어한다. 이 값이 바로 '얼마나 자주 다시 믿을 것인가'를 결정한다. (실습 환경 캡처)</p>\n<ul>\n<li><strong>세션 유지 시간</strong> — 적용 전에는 토큰 만료까지(기본 1시간 이상) 유지되지만, 적용 후에는 1시간마다 재인증이 필요합니다.</li>\n<li><strong>브라우저 세션 유지</strong> — 적용 전에는 브라우저를 재시작해도 세션이 유지되지만, 적용 후에는 재시작 시 다시 로그인해야 합니다.</li>\n<li><strong>리스크 기반 제어</strong> — 적용 전에는 미적용 상태이지만, 적용 후에는 리스크가 상승하는 즉시 차단됩니다.</li>\n</ul>\n<p>토큰이 아직 유효하더라도 주기적으로 재인증을 강제하는 이 구조는 토큰 탈취나 세션 하이재킹 시나리오에 대한 실질적인 방어선이 됩니다.</p>\n\n<h2>STEP 5. 로그 증적 — 두 개의 로그를 교차로 본다</h2>\n<p>Private Access 환경에서 접속·차단 이벤트는 두 곳에 나뉘어 기록됩니다.</p>\n<ul>\n<li><strong>Global Secure Access Traffic logs</strong> — <strong>Monitor &gt; Traffic logs</strong>에서 Date range를 실습 시간대로, Traffic type을 Private Access로 맞추고 Action을 Allow/Block으로 각각 필터링합니다. User, Application(온보딩한 내부 앱 이름), Source IP/Destination, Action을 주요 확인 항목으로 봅니다.</li>\n<li><strong>Entra Sign-in logs</strong> — <strong>Users &gt; Sign-in logs</strong>에서 테스트 사용자와 시간대로 필터링한 뒤, 개별 이벤트의 Conditional Access 탭에서 어떤 정책이 적용됐고 결과가 어땠는지 확인합니다. Export 기능으로 CSV/JSON을 내려받아 증적으로 보관할 수 있습니다.</li>\n</ul>\n<img src=\"assets/img/private-access-ztna/05-traffic-logs-connections.png\" alt=\"Traffic logs의 연결 탭에 특정 사용자의 Private Access 연결 이벤트가 원본 IP·대상 IP·대상 포트·토큰 발급 시각과 함께 나열된 화면\" loading=\"lazy\">\n<p class=\"img-caption\">개인 액세스 트래픽만 따로 필터링하면 사용자·원본 IP·대상 IP·포트·토큰 유효 시간까지 연결 단위로 확인된다. (실습 환경 캡처)</p>\n<img src=\"https://learn.microsoft.com/en-us/entra/global-secure-access/media/how-to-view-traffic-logs/traffic-logs-connections-tab.png\" alt=\"Traffic logs 페이지의 Connections 탭 스크린샷\" loading=\"lazy\">\n<p class=\"img-caption\">Traffic Logs의 Connections 탭에서 개별 연결의 흐름을 확인할 수 있다. (출처: Microsoft Learn)</p>\n<img src=\"assets/img/private-access-ztna/06-signin-log-ca-tab.png\" alt=\"Sign-in 로그의 조건부 액세스 탭에 MFA 정책, 허용 정책, 차단 정책 세 개의 결과가 각각 성공/성공/적용되지 않음으로 표시된 화면\" loading=\"lazy\">\n<p class=\"img-caption\">같은 로그인 이벤트에 여러 조건부 액세스 정책이 동시에 평가된 결과가 한 화면에 나열된다. 어떤 정책이 실제로 이 접속을 허용했는지 바로 추적된다. (실습 환경 캡처)</p>\n<p>Sentinel이나 Log Analytics로 로그를 넘기면 특정 앱에 대한 로그인 이벤트만 뽑아보는 쿼리도 바로 활용할 수 있습니다.</p>\n<pre><code>SigninLogs\n| where AppDisplayName contains \"Internal-WebApp-ZTNA-Lab\"\n| project TimeGenerated, UserPrincipalName, ResultType, ResultDescription, ConditionalAccessStatus</code></pre>\n<p>이런 쿼리 하나만 저장해 둬도 \"이 앱에 대한 접근 시도가 최근에 어떤 결과였는지\"를 대시보드 없이 바로 확인할 수 있습니다.</p>\n\n<h2>데모로 보면 더 분명해지는 네 가지 장면</h2>\n<p>실제로 이 구성을 다른 사람에게 보여줄 때는 아래 네 장면이 특히 설득력이 있습니다.</p>\n<ul>\n<li><strong>정상 접근</strong> — GSA 클라이언트가 켜진 PC에서 브라우저로 내부 앱에 접속하면 Entra ID 로그인과 MFA를 거쳐 접근이 허용되고, 곧바로 Traffic Logs에 Allow 이벤트가 찍힙니다.</li>\n<li><strong>비규격 디바이스 차단</strong> — Intune에 등록되지 않은 PC에서 같은 앱에 접근하면 즉시 차단되고, Sign-in 로그에는 \"Failure — Blocked by Conditional Access\"로 남습니다.</li>\n<li><strong>세션 만료 재인증</strong> — Sign-in Frequency 1시간을 적용해 두면, 토큰이 아직 살아있어도 시간이 지나면 재인증 화면이 자동으로 뜹니다.</li>\n<li><strong>차단 이벤트 실시간 확인</strong> — 비규격 디바이스에서 접근을 시도하는 순간 Traffic Logs가 실시간으로 갱신되고, 클릭 한 번으로 사용자·IP·앱·정책·차단 이유까지 바로 확인됩니다.</li>\n</ul>\n<p>이 네 장면을 한 번씩만 재현해 봐도 \"VPN 없이도 앱 단위로 제어되고, 모든 시도가 기록된다\"는 Private Access의 핵심 가치를 실제 화면으로 증명할 수 있습니다.</p>\n\n<h2>정리</h2>\n<p>Private Access 구성은 결국 앱 온보딩(어디로 갈 수 있는가), 조건부 액세스(누가 들어올 수 있는가), 세션 제어(얼마나 오래 신뢰할 것인가), 로그(무슨 일이 있었는가) 이 네 가지를 순서대로 갖추는 작업입니다. 다섯 단계를 하나씩 밟아서 정상 접근·차단·재인증·로그 기록까지 한 번씩 재현해 보면, VPN을 걷어내는 프로젝트가 아니라 사내 리소스 접근 자체를 신원 중심으로 다시 설계하는 프로젝트라는 것이 실제 화면으로 확인됩니다.</p>\n"
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
      "summary": "정책 설계, 전/후 제어포인트 확인, 로그 가시성, 예외처리, 운영 가이드까지 Entra Internet Access를 실제로 구성하고 증적을 남기는 5단계를 예시 정책명과 함께 상세히 정리했습니다.",
      "thumbnail": "",
      "readingMinutes": 5,
      "content": "<h2>사전 준비 — 역할, 라이선스, 클라이언트</h2>\n<p>Entra Internet Access를 실제로 구성해 보기 전에 아래 네 가지가 갖춰져 있어야 합니다.</p>\n<ul>\n<li><strong>Entra ID 역할</strong> — Global Secure Access Administrator 또는 Global Administrator</li>\n<li><strong>라이선스</strong> — Microsoft Entra Internet Access(Entra Suite 또는 E7에 포함)</li>\n<li><strong>클라이언트</strong> — Windows 10/11에 Global Secure Access Client 설치</li>\n<li><strong>테스트 그룹</strong> — 정책이 적용될 일반 사용자 그룹 1개, 예외를 검증할 서비스 계정/예외 그룹 1개</li>\n</ul>\n<p>구성을 시작하기 전에는 반드시 <strong>Entra 관리 센터 &gt; Global Secure Access &gt; Connect &gt; Traffic forwarding</strong>에서 Internet Access profile 토글이 켜져 있는지, 연결된 조건부 액세스 정책이 있는지부터 확인합니다. 클라이언트 트레이 아이콘이 \"연결됨\" 상태인 것도 이 시점에서 같이 체크하는 편이 좋습니다. 이 확인을 건너뛰면 이후 단계에서 정책을 다 만들어놓고도 트래픽이 전혀 검사대를 타지 않는 상황과 마주치게 됩니다.</p>\n\n<h2>STEP 1. 정책 설계 — 차단 두 개, 허용 하나로 시작한다</h2>\n<p>Entra Internet Access의 정책은 크게 <strong>웹 콘텐츠 필터링 정책</strong>과 그것들을 묶는 <strong>Security Profile</strong>, 그리고 프로필을 사용자에게 붙이는 <strong>조건부 액세스 정책</strong>, 이 세 층으로 구성됩니다. 실무에서 자주 쓰는 최소 구성은 다음과 같습니다.</p>\n<h3>1) 웹 콘텐츠 필터링 정책 3개</h3>\n<p><strong>Global Secure Access &gt; Secure &gt; Web content filtering policies</strong>에서 아래 세 개를 만듭니다.</p>\n<ul>\n<li><code>WCF-Block-HighRisk</code> (Block mode) — Rule에서 카테고리를 Gambling, Malware, Phishing, Adult Content로 지정. 도메인을 일일이 등록하지 않고 위험 카테고리 전체를 한 번에 차단하는 용도입니다.</li>\n<li><code>WCF-Block-FQDN-Specific</code> (Block mode) — 특정 도메인(예: <code>badsite-test.example.com</code>)을 FQDN 단위로 직접 차단합니다.</li>\n<li><code>WCF-Allow-Exception</code> (Allow mode) — 예외로 허용할 도메인을 등록하는 정책. 뒤에서 예외 처리의 핵심 축이 됩니다.</li>\n</ul>\n<img src=\"assets/img/entra-internet-access/01-web-content-filtering-policies.png\" alt=\"웹 콘텐츠 필터링 정책 목록에 WCF-Block-HighRisk, WCF-Block-FQDN-Specific, WCF-Allow-Exception 세 정책이 생성된 화면\" loading=\"lazy\">\n<p class=\"img-caption\">실습 환경에 실제로 만든 세 정책. Mode(allow/block)와 생성·수정 시각까지 한 화면에서 확인된다. (실습 환경 캡처)</p>\n<h3>2) Security Profile 2개</h3>\n<p><strong>Global Secure Access &gt; Secure &gt; Security profiles</strong>에서 정책들을 우선순위와 함께 묶습니다.</p>\n<ul>\n<li><code>Profile-AllUsers-Standard</code> — <code>WCF-Block-HighRisk</code>를 우선순위 100, <code>WCF-Block-FQDN-Specific</code>을 우선순위 200으로 연결. 일반 사용자에게 적용할 기본 프로필입니다.</li>\n<li><code>Profile-Exception-ServiceAccount</code> — <code>WCF-Allow-Exception</code>을 우선순위 1(최우선)로 연결. 이 프로필이 붙은 계정은 다른 차단 규칙보다 허용 규칙을 먼저 만나게 됩니다.</li>\n</ul>\n<img src=\"assets/img/entra-internet-access/02-security-profiles.png\" alt=\"Security profiles 목록 화면에 Profile-Exception-ServiceAccount(우선순위 100)와 Profile-AllUsers-Standard(우선순위 200)가 표시된 스크린샷\" loading=\"lazy\">\n<p class=\"img-caption\">두 개의 Security Profile이 실제로 enabled 상태로 등록된 모습. 우선순위 숫자가 낮은 예외 프로필이 먼저 평가된다. (실습 환경 캡처)</p>\n<img src=\"https://learn.microsoft.com/en-us/entra/global-secure-access/media/how-to-configure-web-content-filtering/baseline-profile-security-profiles.png\" alt=\"Security profiles 목록 화면에서 우선순위 65000의 Baseline profile이 표시된 스크린샷\" loading=\"lazy\">\n<p class=\"img-caption\">직접 만든 프로필 외에, 아무 규칙에도 안 걸린 트래픽은 우선순위 65000의 Baseline Profile을 최후에 만난다. (출처: Microsoft Learn)</p>\n<h3>3) 조건부 액세스 정책 2개로 그룹에 연결</h3>\n<p><strong>Protection &gt; Conditional Access &gt; Policies</strong>에서 프로필을 실제 사용자 그룹에 매핑합니다.</p>\n<ul>\n<li><code>CA-EIA-AllUsers-Standard</code> — Users에 일반 사용자 그룹 포함, 서비스 계정 그룹은 제외. Target resources는 \"Global Secure Access &gt; Internet Access traffic\", Session에서 <code>Profile-AllUsers-Standard</code>를 선택.</li>\n<li><code>CA-EIA-ServiceAccount-Exception</code> — Users에 서비스 계정 그룹만 포함. Session에서 <code>Profile-Exception-ServiceAccount</code>를 선택.</li>\n</ul>\n<p>이 구조의 장점은 <strong>같은 사이트라도 접속 주체에 따라 결과가 완전히 달라진다</strong>는 점입니다. 일반 사용자 그룹은 차단 프로필을, 자동화·모니터링용 서비스 계정 그룹은 예외 프로필을 물고 있기 때문에, 정책을 사용자별로 매번 새로 짤 필요 없이 그룹 소속만으로 접근 결과가 갈립니다.</p>\n\n<h2>STEP 2. 제어포인트 확인 — 적용 전/후를 나란히 비교한다</h2>\n<p>정책을 만들었다고 끝이 아니라, 실제로 의도한 대로 동작하는지 <strong>전/후 비교</strong>로 검증하는 단계가 필요합니다.</p>\n<ul>\n<li>카테고리 차단 사이트 접속 — 정책 적용 전에는 정상 로딩, 적용 후에는 GSA 차단 페이지가 표시되어야 합니다.</li>\n<li>FQDN 차단 도메인 접속 — 마찬가지로 적용 전/후가 갈립니다.</li>\n<li>서비스 계정으로 동일 사이트 접속 — 예외 프로필 덕분에 차단 정책과 무관하게 정상 접근이 유지되어야 합니다.</li>\n<li>Traffic Logs — 정책 미구성 상태에서는 이벤트 자체가 없다가, 구성 후에는 Block/Allow 이벤트가 실시간으로 쌓입니다.</li>\n</ul>\n<p>검증 순서는 일반 사용자 계정으로 차단 카테고리 사이트와 차단 FQDN에 각각 접속해 차단 페이지(차단 사유·카테고리명 포함)를 확인하고, <code>microsoft.com</code>처럼 허용된 사이트는 정상 로딩되는지 함께 확인합니다. 이어서 서비스 계정으로 전환해 같은 차단 사이트에 접근하면 예외가 적용되어 정상 접근이 되는지 보고, 마지막으로 Traffic Logs에서 두 계정의 Action(Block vs Allow)을 나란히 비교합니다. 이 네 가지를 한 번에 확인하면 정책 설계 단계에서의 실수(우선순위가 뒤바뀌었거나, 그룹 매핑이 잘못된 경우 등)를 바로 잡아낼 수 있습니다.</p>\n<img src=\"assets/img/entra-internet-access/03-category-block-page.png\" alt=\"카테고리 차단 정책이 적용되어 게임 스토어 사이트 접속이 연결 재설정 오류로 차단된 브라우저 화면\" loading=\"lazy\">\n<p class=\"img-caption\">차단 카테고리에 걸린 사이트는 정상 페이지 대신 연결 오류로 응답한다. HTTPS 트래픽이라 SNI 기준으로 곧바로 연결이 끊기는 형태로 나타난다. (실습 환경 캡처)</p>\n\n<h2>STEP 3. 로그 및 가시성 — 하나의 이벤트에 무엇이 담기는가</h2>\n<p><strong>Global Secure Access &gt; Monitor &gt; Traffic logs</strong>에서 Traffic type을 Internet Access, Action을 Block으로 필터링하면 차단 이벤트 목록이 나옵니다. 이벤트 하나를 클릭하면 아래 필드를 전부 확인할 수 있습니다.</p>\n<ul>\n<li><strong>User</strong> — 이벤트를 발생시킨 사용자 계정</li>\n<li><strong>Destination FQDN</strong> — 접속을 시도한 도메인</li>\n<li><strong>Category</strong> — GSA가 탐지한 웹 카테고리</li>\n<li><strong>Action</strong> — Block 또는 Allow, 그리고 차단 사유</li>\n<li><strong>Policy name</strong> — 실제로 적용된 Security Profile과 웹 콘텐츠 필터링 정책명</li>\n<li><strong>Client IP</strong>, <strong>Timestamp</strong> — 접속 위치와 시각</li>\n</ul>\n<img src=\"assets/img/entra-internet-access/04-traffic-logs-list.png\" alt=\"트래픽 로그 목록에 특정 사용자의 naver.com 접속 이벤트가 허용/차단으로 반복 기록된 화면\" loading=\"lazy\">\n<p class=\"img-caption\">같은 사용자·같은 목적지라도 정책 평가 시점에 따라 허용과 차단이 섞여서 기록된다. 만든 날짜·대상 FQDN·사용자·조치가 한 줄씩 쌓인다. (실습 환경 캡처)</p>\n<img src=\"https://learn.microsoft.com/en-us/entra/global-secure-access/media/how-to-view-traffic-logs/traffic-log-details.png\" alt=\"Traffic log 상세 정보 페이지 스크린샷\" loading=\"lazy\">\n<p class=\"img-caption\">개별 트래픽 이벤트의 상세 필드 화면. 사용자·목적지·카테고리·정책명이 한 화면에 모인다. (출처: Microsoft Learn)</p>\n<p>Action 필터를 Allow로 바꾸면 허용된 트래픽 목록도 동일한 방식으로 확인할 수 있어, 차단된 것뿐 아니라 \"정상적으로 통과한 트래픽\"까지 감사 대상에 포함됩니다. <strong>Dashboard</strong> 메뉴에서는 웹 카테고리별 트래픽 분포 파이 차트, 가장 많이 차단된 사이트 TOP 10, 사용자별 인터넷 트래픽 사용량, 시간대별 트래픽 추이를 한 화면에서 볼 수 있어 개별 이벤트 조회보다 넓은 시야에서 트렌드를 파악하는 데 유용합니다. 이 로그를 Log Analytics나 Sentinel로 넘기면 위협 헌팅과 이상 탐지 규칙에 바로 활용할 수 있습니다.</p>\n\n<h2>STEP 4. 예외처리 — 세 가지 유형으로 나눠서 관리한다</h2>\n<p>운영 현장에서 마주치는 예외 요청은 대체로 세 갈래로 나뉩니다.</p>\n<ul>\n<li><strong>서비스 계정 예외</strong> — IT 자동화·모니터링 도구 실행 계정 대상. 별도 서비스 계정 그룹을 만들어 예외 Security Profile을 붙이는 방식이라, 영향 범위가 해당 계정으로만 한정되고 나머지 사용자에게는 아무 영향이 없습니다.</li>\n<li><strong>특정 업무 앱 트래픽 예외</strong> — ERP·협업 도구처럼 업무상 필수인 SaaS 앱 대상. <code>WCF-Allow-Exception</code> 정책에 해당 앱의 FQDN을 추가하는 방식이며, 이 경우는 전체 사용자에게 적용되어 \"그 도메인만\" 열립니다.</li>\n<li><strong>긴급 임시 예외</strong> — 비즈니스 요청으로 급하게 차단을 풀어야 하는 경우. 마찬가지로 <code>WCF-Allow-Exception</code>에 FQDN을 추가하되, 업무가 끝나면 반드시 제거해야 하는 시한부 예외입니다.</li>\n</ul>\n<p>서비스 계정 예외를 검증할 때는 서비스 계정으로 차단 카테고리 사이트에 접속해 정상 접근을 확인한 뒤, 같은 사이트를 일반 계정으로도 접속해 여전히 차단되는지 대조하고, Traffic Logs에서 두 계정의 이벤트를 나란히 비교하는 순서로 진행합니다. 특정 앱 도메인 예외는 <code>WCF-Allow-Exception</code> Rule에 도메인(예: <code>erp.company.com</code>)을 추가하고 저장한 뒤, 전체 사용자 기준으로 접속 테스트를 해보고 Traffic Logs에서 Allow 이벤트가 찍히는지 확인하면 됩니다. 예외를 몇 개 걸어뒀는지, 각각 영향 범위가 계정 단위인지 전사 단위인지는 별도로 문서화해 두는 편이 나중에 감사·점검 때 훨씬 수월합니다.</p>\n<img src=\"assets/img/entra-internet-access/05-allow-exception-rules.png\" alt=\"WCF-Allow-Exception 정책의 규칙 목록에 *.google.com, *.blizzard.com 두 개의 FQDN 예외 규칙이 등록된 화면\" loading=\"lazy\">\n<p class=\"img-caption\">예외 정책 하나에 FQDN 규칙을 계속 추가하는 방식으로 운영한다. 규칙이 늘어날수록 어떤 요청으로 추가됐는지 별도 문서화가 필요해진다. (실습 환경 캡처)</p>\n\n<h2>STEP 5. 운영 가이드 — 예외 요청부터 회수까지</h2>\n<p>정책이 안정화된 뒤에는 일상적인 예외 요청과 장애 대응을 처리할 표준 프로세스가 필요합니다. 실무에서는 보통 아래 6단계로 운영합니다.</p>\n<ol>\n<li><strong>요청</strong> — 업무 담당자가 IT 헬프데스크에 차단된 사이트·앱의 업무 필요성을 요청(요청 도메인, 사용 목적, 대상 사용자/그룹, 예외 기간 포함)</li>\n<li><strong>검토</strong> — 보안팀이 요청 도메인의 위험도와 업무 정당성을 검토(Cloud app catalog에서 앱 위험도 참고)</li>\n<li><strong>승인</strong> — 보안 관리자가 위험도가 허용 범위면 승인, 고위험이면 대안을 제시. 승인 근거는 ITSM 티켓이나 이메일로 남깁니다.</li>\n<li><strong>적용</strong> — 운영팀이 <code>WCF-Allow-Exception</code>에 FQDN을 추가하거나 조건부 액세스 정책을 수정하고, 적용 시각과 담당자를 기록</li>\n<li><strong>확인</strong> — 요청자가 접속 가능 여부를 확인하고 완료를 통보하며, Traffic Logs에서 Allow 이벤트로 재확인</li>\n<li><strong>회수</strong> — 예외 기간이 끝나면 운영팀이 예외 항목을 제거하고, Traffic Logs에서 다시 Block으로 전환되는지 확인</li>\n</ol>\n<p>정상 업무 사이트가 오탈로 차단되는 사고는 흔한 장애 유형입니다. 이런 경우 Traffic Logs에서 차단 이벤트와 차단 카테고리를 먼저 확인하고, 실제 카테고리 분류 오류인지 아니면 정책 설계 자체가 의도와 다르게 걸린 것인지를 구분합니다. 즉시 조치로는 <code>WCF-Allow-Exception</code>에 해당 FQDN을 임시로 추가하고, 근본 원인이 카테고리 오분류였다면 정책 Rule을 영구적으로 수정하거나 화이트리스트에 등록한 뒤 Audit Logs에 변경 이력을 남깁니다. 업무 전체가 마비될 정도로 심각한 장애라면 Security Profile 자체를 Disabled로 바꾸거나 관련 조건부 액세스 정책을 비활성화해 전체를 임시로 풀 수도 있는데, 이 조치는 파급력이 큰 만큼 최대 1시간 이내로 시간을 제한하고 보안팀 승인을 반드시 거치는 것이 안전합니다.</p>\n<img src=\"assets/img/entra-internet-access/06-security-profile-disabled.png\" alt=\"Profile-AllUsers-Standard 보안 프로필의 상태를 disabled로 변경하는 화면\" loading=\"lazy\">\n<p class=\"img-caption\">긴급 전체 해제는 Security Profile의 상태를 disabled로 바꾸는 것만으로 가능하다. 되돌리는 것도 같은 화면에서 즉시 처리된다. (실습 환경 캡처)</p>\n<p>실무 기준을 정리하면 다음과 같습니다. 예외 요청 처리 SLA는 일반 건이면 영업일 기준 2일 이내, 업무 장애를 동반한 긴급 건이면 2시간 이내가 일반적인 기준선이고, 정책을 저장한 뒤 클라이언트에 실제로 반영되기까지는 대략 5분 정도의 지연을 감안해야 합니다. 임시 예외는 최대 30일을 넘기지 않고 연장이 필요하면 재승인을 받도록 하며, 모든 정책 변경은 Audit Logs에 변경자·시각·변경 내용이 자동으로 남고 Traffic Logs는 기본 30일(Log Analytics 연동 시 최대 2년)까지 보관됩니다.</p>\n\n<h2>정리 — 이 다섯 단계가 증명하는 것</h2>\n<p>정책 설계, 전/후 제어포인트 비교, 로그 가시성, 예외처리, 운영 가이드라는 다섯 축을 순서대로 갖추면 \"Entra Internet Access가 실제로 트래픽을 통제하고 있다\"는 것을 그림 몇 장이 아니라 재현 가능한 절차로 증명할 수 있습니다. 같은 사이트에 대해 계정에 따라 다른 결과가 나오는 것, 차단 전후 동작이 로그로 남는 것, 예외가 요청부터 회수까지 추적되는 것 — 이 세 가지가 갖춰지면 라이선스 기술 검토든 실제 운영 전환이든 다음 단계로 넘어갈 준비가 된 셈입니다.</p>\n"
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
      "readingMinutes": 3,
      "content": "<h2>왜 지금 '에이전트 전용 ID'가 필요한가</h2>\n<p>전 세계 AI 에이전트 수는 2028년 10억 개를 훌쩍 넘어설 것으로 전망되고, Microsoft 한 곳만 해도 매주 약 5,000개의 에이전트가 새로 생성되고 있습니다. 조만간 한 조직 안에서 에이전트 수가 임직원 수를 넘어서는 시점이 온다는 뜻입니다.</p>\n<p>문제는 지금까지 대부분의 에이전트가 사람의 계정을 빌려 쓰거나, 지나치게 단순한 서비스 principal / 앱 등록 방식으로 동작해왔다는 점입니다. 그 결과 조직은 \"어떤 에이전트가 있는지조차 모르는\" 가시성 문제, 사람과 에이전트 간 협업이 어려운 문제, 그리고 무엇보다 \"보이지 않는 것은 보호할 수 없다\"는 보안 문제에 부딪힙니다. 최소 권한으로 동작하는지, 가드레일 안에서 움직이는지, 어떤 데이터에 접근하는지를 추적할 방법이 없는 것이죠.</p>\n\n<h2>사람 직원에게 쓰던 프레임워크를 에이전트로 확장한다</h2>\n<p>해법의 방향은 의외로 단순합니다. 이미 임직원을 위해 잘 갖춰놓은 <strong>Entra(신원·접근 관리) → Purview(데이터 거버넌스) → Defender(위협 방지) → Microsoft 365 생산성 도구</strong>라는 검증된 체계를, 완전히 새로 만드는 대신 AI 에이전트에 맞게 확장하자는 것입니다. 사람 직원이 회사 계정으로 로그인해 역할 기반 접근 제어(RBAC), 조건부 액세스, 감사 로그의 보호를 받듯, 에이전트도 동일한 수준의 통제를 받아야 한다는 논리입니다. 이 확장판이 바로 <strong>Agent 365</strong>이고, 그 출발점이 되는 것이 <strong>Agent ID</strong>입니다.</p>\n\n<h2>Agent ID란 무엇인가</h2>\n<p>기존의 앱 등록(서비스 principal)이나 사람 계정을 그대로 쓰지 않는 이유는 명확합니다. 서비스 principal은 에이전트가 수행할 작업 범위에 비해 권한 모델이 너무 제한적이고, 사람 계정은 MFA·패스키처럼 \"물리적 실체\"를 전제로 한 인증 수단을 에이전트에 적용할 수 없기 때문입니다. 그래서 Microsoft는 에이전트 전용 정체성 유형인 <strong>Agent ID</strong>를 새로 만들었습니다.</p>\n<img src=\"https://learn.microsoft.com/en-us/entra/agent-id/media/agent-identities/agent-identity.png\" alt=\"Microsoft Entra Agent ID 구조를 보여주는 다이어그램\" loading=\"lazy\">\n<p class=\"img-caption\">Agent ID의 구성 요소 — 식별자, 표시 이름, 스폰서, 블루프린트로 구성된다. (출처: Microsoft Learn)</p>\n<p>Agent ID는 Entra 안에서 특수한 형태의 서비스 principal로 동작하며, 다음과 같은 요소로 구성됩니다.</p>\n<ul>\n<li><strong>식별자(Object ID)</strong> — 테넌트 내에서 에이전트를 고유하게 식별</li>\n<li><strong>표시 이름</strong> — Entra 관리 센터, Teams, Outlook 등에 노출되는 사람이 읽기 쉬운 이름</li>\n<li><strong>스폰서(Sponsor)</strong> — 이 에이전트에 대해 책임을 지는 사람 또는 그룹. 보안 사고 시 연락 대상이자, 에이전트가 계속 필요한지 판단하는 주체로 지정되어 \"고아 에이전트(orphaned agent)\" 문제를 막는 핵심 장치입니다.</li>\n<li><strong>블루프린트(Blueprint)</strong> — 이 Agent ID가 어떤 템플릿에서 만들어졌는지를 가리키는 연결고리</li>\n</ul>\n<p>중요한 점은 Agent ID 자체는 <strong>자격 증명(credential)을 갖지 않는다</strong>는 것입니다. 인증은 항상 아래에서 설명할 블루프린트를 통해 이뤄집니다.</p>\n\n<h2>블루프린트: Agent ID를 찍어내는 '틀'</h2>\n<img src=\"https://learn.microsoft.com/en-us/entra/agent-id/media/agent-identities/agent-blueprint.png\" alt=\"Agent Identity와 Agent Identity Blueprint의 관계를 보여주는 다이어그램\" loading=\"lazy\">\n<p class=\"img-caption\">여러 개의 Agent ID가 하나의 블루프린트에서 파생되는 구조. (출처: Microsoft Learn)</p>\n<p>블루프린트는 에이전트 종류별 템플릿입니다. 예를 들어 \"영업 어시스턴트 에이전트\"라는 블루프린트를 하나 만들면, 북미 영업팀용·남미 영업팀용·엔터프라이즈 영업팀용 등 여러 인스턴스가 이 블루프린트에서 각각 Agent ID를 발급받아 생성됩니다. 블루프린트에는 다음이 정의됩니다.</p>\n<ul>\n<li>에이전트가 가질 수 있는 역할과 Microsoft Graph 권한 범위(앱 권한 + 위임 권한)</li>\n<li>인증 방식 — 관리 ID(managed identity)에 준하는 페더레이션 방식을 권장하며, 인증서는 가능하지만 시크릿 방식은 지양</li>\n<li>사용자 read/write.all처럼 에이전트에게 절대 부여해서는 안 되는 고위험 권한에 대한 제약</li>\n</ul>\n<p>조직이 블루프린트 사용에 <strong>동의(consent)</strong>하면 해당 테넌트 안에 \"블루프린트 서비스 principal\"이 생성되고, 이 principal이 실제 Agent ID들을 만들어내는 권한을 갖게 됩니다. 이 구조는 개발자에게 익숙한 \"앱 등록 → 엔터프라이즈 앱(서비스 principal)\" 패턴과 사실상 동일합니다. 인증 흐름도 비슷한 원리로 동작합니다. 에이전트 플랫폼(Foundry, Copilot Studio 등)이 블루프린트로 먼저 인증한 뒤, 이를 특정 Agent ID용 토큰으로 교환(token exchange)해서 실제 리소스에 접근하는 방식입니다.</p>\n<p>Exchange 메일함, Teams, SharePoint처럼 반드시 사람 계정 형태가 필요한 서비스에 에이전트를 연결해야 할 때는, Agent ID의 하위 개체로 <strong>Agent's user account(에이전트 사용자 계정)</strong>를 선택적으로 추가할 수 있습니다. 이렇게 하면 문서에서 에이전트를 멘션하거나 Teams에서 말을 거는 식의 자연스러운 협업이 가능해지는데, 이 영역까지 활용하려면 <strong>Agent 365 라이선스</strong>가 필요합니다.</p>\n\n<h2>Agent 365의 세 기둥: Entra · Purview · Defender</h2>\n<p>Agent ID가 생기고 나면, 사람 직원에게 적용하던 보안 통제를 그대로 에이전트에 적용할 수 있게 됩니다.</p>\n<ul>\n<li><strong>Entra</strong> — RBAC, 권한 관리(Entitlement Management), 조건부 액세스를 에이전트 단위 또는 에이전트 유형 단위로 적용. 사람과 다르게 \"하루 24시간 계속 작동\"하는 패턴은 정상으로 인식하는 등, 위험 신호 판정 기준도 에이전트 특성에 맞게 조정됩니다.</li>\n<li><strong>Purview</strong> — 에이전트의 데이터 접근을 모니터링·통제. 사람이 5분 안에 문서 500개를 열람하면 유출 의심 신호지만, 에이전트가 3분 안에 문서 1,000개를 조회하는 것은 정상적인 RAG(검색 증강 생성) 동작으로 판단하는 식으로, 에이전트 행동 패턴에 맞춰 판단 기준이 달라집니다.</li>\n<li><strong>Defender</strong> — 프롬프트 인젝션, 탈옥(jailbreak) 시도, ASI 스머글링, 악성 IP발 비정상 접근 등 에이전트 특화 위협에 대한 실시간 탐지·차단과 사고 조사(전체 공격 체인, 툴 호출, MCP 상호작용, 멀티 에이전트 통신까지 포함) 기능을 제공합니다.</li>\n</ul>\n<p>여기에 <strong>Work IQ</strong>가 더해지면 에이전트가 조직의 이메일·문서·회의·Teams 대화를 아우르는 업무 맥락과 사람·데이터 간의 관계를 이해하고 능동적으로 일할 수 있게 되며, Power Apps·Power BI 연동까지 포함해 \"생산성\" 축을 완성합니다.</p>\n\n<h2>레지스트리와 컬렉션 — 에이전트도 서로를 찾아야 한다</h2>\n<p>마지막 조각은 <strong>레지스트리(Registry)</strong>입니다. 조직 안의 모든 에이전트가 이 레지스트리에 등록되면, 관리자는 전체 에이전트 현황을 한눈에 파악(인벤토리)할 수 있고, 각 에이전트는 \"에이전트 카드\"라는 일종의 매니페스트를 통해 자신의 역할과 기능을 노출해 다른 에이전트가 자신을 발견(discovery)하고 협업(A2A)할 수 있게 됩니다.</p>\n<p>여기서 중요한 구분은, 레지스트리는 \"누가 누구에게 접근할 수 있는가\"를 통제하는 장치가 아니라 <strong>\"서로를 찾을 수 있게 해주는\" 발견 계층</strong>이라는 점입니다. 접근 통제는 여전히 Entra의 역할·조건부 액세스가 담당합니다. 조직은 필요에 따라 특정 목적의 에이전트를 묶는 <strong>커스텀 컬렉션</strong>을 만들거나, 문제가 있는 에이전트를 격리하는 <strong>격리(Quarantine) 컬렉션</strong>에 넣어 누구에게도 발견되지 않게 할 수도 있습니다. 참고로 Agent ID가 없는 에이전트도 레지스트리에는 등록할 수 있지만, 레지스트리를 조회하고 다른 에이전트를 검색하려면 Agent ID가 필요합니다.</p>\n\n<h2>정리</h2>\n<p>결국 Agent 365가 하는 일은 새로운 체계를 처음부터 만드는 것이 아니라, 조직이 이미 사람 직원에게 적용해온 신원(Entra)·데이터 보호(Purview)·위협 방지(Defender)·생산성(M365/Work IQ) 프레임워크를 AI 에이전트라는 새로운 \"구성원\" 유형에 맞게 확장하는 것으로 요약됩니다. 모든 에이전트는 고유한 Agent ID와 책임자(스폰서)를 갖고, 표준화된 블루프린트를 통해 일관된 보안 정책 아래 생성·인증되며, 레지스트리를 통해 서로를 발견합니다. AI 에이전트 수가 폭발적으로 늘어나는 지금, 이 정체성 기반 거버넌스는 선택이 아니라 전제 조건이 되고 있습니다.</p>\n\n<h2>더 알아보기</h2>\n<ul>\n<li><a href=\"https://learn.microsoft.com/en-us/entra/agent-id/agent-identities\" target=\"_blank\" rel=\"noopener\">Microsoft Learn — Overview of agent identities in Microsoft Entra</a></li>\n<li><a href=\"https://learn.microsoft.com/en-us/entra/agent-id/agent-blueprint\" target=\"_blank\" rel=\"noopener\">Microsoft Learn — Agent identity blueprints in Microsoft Entra Agent ID</a></li>\n<li><a href=\"https://learn.microsoft.com/en-us/microsoft-agent-365/developer/identity\" target=\"_blank\" rel=\"noopener\">Microsoft Learn — Agent 365 Identity</a></li>\n</ul>"
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
      "readingMinutes": 2,
      "content": "<p>안녕하세요. 이 블로그는 <strong>Microsoft 365</strong>, <strong>Power Platform</strong>, 그리고 <strong>개발</strong> 관련 지식을 실전 위주로 정리하는 공간입니다.</p><h2>왜 만들었나</h2><p>흩어져 있는 자료(블로그, 유튜브, 기술 기사, 노션 메모)를 한곳에 모아 검색 가능하게 정리하기 위해서입니다.</p><h2>구조</h2><ul><li>카테고리: M365 / Power Platform / Development</li><li>태그로 세부 주제 분류</li><li>상단 검색으로 제목·요약·태그를 즉시 검색</li></ul><p>앞으로 링크를 받아 자동으로 글이 추가되도록 확장할 예정입니다.</p>"
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
      "readingMinutes": 6,
      "content": "<p>Power Automate의 <strong>승인(Approvals)</strong> 커넥터를 사용하면 코드 없이 결재 흐름을 구성할 수 있습니다.</p><h2>1. 트리거</h2><p>「SharePoint - 항목이 만들어질 때」 트리거로 시작합니다.</p><h2>2. 승인 시작</h2><p>「승인 시작 및 대기」 액션에서 <em>유형</em>을 '승인/거부 - 첫 번째 응답'으로 선택합니다.</p><h2>3. 조건 분기</h2><p>결과(Outcome)가 <code>Approve</code>인지에 따라 상태 열을 업데이트합니다.</p><blockquote>팁: 승인자에 여러 명을 넣을 땐 세미콜론으로 구분합니다.</blockquote>"
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
      "readingMinutes": 5,
      "content": "<p><strong>DLP(Data Loss Prevention)</strong>는 민감 정보가 조직 밖으로 유출되는 것을 막는 정책입니다.</p><h2>구성 요소</h2><ul><li><strong>위치</strong>: Exchange, SharePoint, OneDrive, Teams, 엔드포인트</li><li><strong>규칙</strong>: 조건 + 작업의 묶음</li><li><strong>조건</strong>: 민감 정보 유형(주민번호, 카드번호 등)</li><li><strong>작업</strong>: 차단, 알림, 재정의 허용</li></ul><p>처음엔 <em>테스트 모드(정책 팁만 표시)</em>로 배포해 오탐을 확인한 뒤 강제 적용하는 것이 안전합니다.</p>"
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
      "readingMinutes": 7,
      "content": "<p>Graph PowerShell SDK로 M365 사용자 작업을 자동화할 수 있습니다.</p><h2>연결</h2><pre><code>Connect-MgGraph -Scopes \"User.ReadWrite.All\",\"Organization.Read.All\"</code></pre><h2>사용자 조회</h2><pre><code>Get-MgUser -Filter \"accountEnabled eq true\" -All</code></pre><h2>라이선스 할당</h2><pre><code>Set-MgUserLicense -UserId user@contoso.com -AddLicenses @{SkuId=$sku} -RemoveLicenses @()</code></pre><p>대량 작업 시에는 <code>-All</code> 과 배치 처리를 활용하세요.</p>"
    }
  ]
};

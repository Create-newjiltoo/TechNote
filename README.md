# TechNote — M365 · Power Platform · Development 블로그

GitHub Pages에 바로 올릴 수 있는 정적 기술 블로그입니다. 밝고 정돈된 디자인,
카테고리 트리 + 태그, 상단 실시간 검색, 검색엔진 최적화(SEO)를 갖췄고,
**모든 글을 데이터 파일 하나(`data/posts.js`)로 관리**해 나중에 링크를 받아
자동으로 글을 추가하기 쉽게 설계했습니다.

## 파일 구조

```
blog/
  index.html          # 메인: 글 목록 + 검색 + 카테고리/태그 필터
  post.html           # 개별 글 보기 (post.html?id=글아이디)
  assets/
    style.css         # 밝은 테마 디자인
    app.js            # 목록/검색/글 렌더링 + SEO(JSON-LD)
  data/
    posts.js          # ★ 글 데이터 단일 소스 (여기에 글이 쌓인다)
    posts.json        # 같은 데이터의 JSON 미러(참고용)
  add_post.py         # 링크·내용을 받아 posts.js에 글 추가 (자동 업로드의 핵심)
  README.md
```

## 미리보기 (내 PC에서)

`index.html` 을 그냥 더블클릭해도 열립니다 (데이터를 JS로 넣어 서버 없이 동작).
혹시 브라우저 보안설정으로 안 열리면 폴더에서 아래를 실행하고
`http://localhost:8000` 접속하세요:

```
python -m http.server 8000
```

## GitHub Pages 배포

1. GitHub에 새 저장소 생성 (예: `technote`)
2. 이 `blog/` 폴더의 내용을 저장소 루트에 업로드(또는 `git push`)
3. 저장소 **Settings → Pages → Source** 를 `main` 브랜치 `/ (root)` 로 설정
4. 몇 분 뒤 `https://<사용자명>.github.io/technote/` 에서 공개됩니다
5. `data/posts.js` 의 `baseUrl` 을 이 주소로 바꿔주세요(SEO/공유용)

## 글 추가하는 법

### 방법 1: 스크립트 (자동화에 적합)

```
python add_post.py --title "제목" --category powerplatform \
  --tags "Power Automate,자동화" --source youtube \
  --url "https://youtube.com/..." \
  --summary "한 줄 요약" --content "<p>본문 HTML</p>"
```

- `--category` : `m365` | `powerplatform` | `dev`
- `--source`   : `original`(직접작성) | `blog` | `youtube` | `article` | `notion`
- 실행하면 `data/posts.js` 맨 앞에 글이 추가됩니다. 커밋/푸시하면 사이트에 반영.

### 방법 2: 직접 편집

`data/posts.js` 의 `posts` 배열에 아래 형식으로 항목을 하나 추가하면 됩니다:

```js
{
  "id": "고유-슬러그",
  "title": "제목",
  "category": "m365",
  "tags": ["태그1", "태그2"],
  "date": "2026-07-27",
  "source": { "type": "article", "url": "https://..." },
  "summary": "목록에 보일 한 줄 요약",
  "readingMinutes": 5,
  "content": "<p>본문은 HTML로. h2, ul, code, pre, blockquote 지원</p>"
}
```

## 글쓰기 원칙 (항상 지킬 것)

- 본문(특히 도입부)에 "이 영상을 보고", "~를 참고해", "~님의 글을 정리했습니다" 같은
  취재 과정/출처 언급을 절대 넣지 않는다. 마치 처음부터 필자가 직접 아는 내용을
  설명하는 것처럼, 주제 자체로 바로 시작한다.
- 원문을 번역하거나 문장만 살짝 바꾸는 식으로 쓰지 않는다. 내용을 완전히 이해한 뒤
  스스로 구성·문장을 새로 짜서 쓴다.
- 출처는 숨기지 않는다. 다만 노출 위치는 글 맨 끝(자동으로 붙는 "원문 보기" 링크,
  `source.type`/`source.url`)으로만 제한한다. 본문 중간에 출처를 다시 언급하지 않는다.
- 이미지는 원본 영상/게시물에서 캡처하지 않는다. Microsoft Learn 등 공식 문서나
  다른 공개 자료에서 관련 이미지를 찾아 쓰고, 캡션에 출처를 표기한다.

## 앞으로: 링크 자동 업로드 (설계 메모)

목표: 블로그·유튜브·기사·노션 링크를 주면 자동으로 요약·정리해 글로 올리기.
지금 구조가 그 토대입니다.

1. 링크 수집 → 본문/자막/메타 추출
   - 유튜브: 제목·설명·자막, 기사/블로그: 본문, 노션: 공개 페이지 내용
2. 요약·정리 → `content`(HTML), `summary`, `tags`, `category` 생성
   - 앞서 만든 회의극 파이프라인(또는 간단한 LLM 호출)으로 자동 생성 가능
3. `add_post.py` 의 `add_post(...)` 함수 호출 → `posts.js` 갱신
4. `git commit && git push` → GitHub Pages 자동 반영
   - GitHub Actions로 "새 링크가 담긴 파일이 올라오면 → 요약 → add_post → 커밋"
     워크플로를 붙이면 완전 자동화됩니다.

`source.type` 과 `source.url` 을 저장하므로, 각 글 하단에 "원문 보기" 링크가
자동으로 붙어 출처가 항상 남습니다.

## 검색 / SEO

- **사이트 내 검색**: 상단 검색창이 제목·요약·태그·본문·카테고리를 실시간 필터링
- **카테고리 + 태그**: 상단 카테고리 버튼, 태그 클라우드로 트리 탐색
- **검색엔진 노출**: 각 글에 `<meta description>` 와 구조화 데이터(JSON-LD `BlogPosting`)를
  주입해 구글이 제목·날짜·카테고리·키워드를 이해합니다
- 더 강한 SEO가 필요하면 글마다 정적 HTML을 생성하는 빌드 스텝과 `sitemap.xml` 을
  추가하면 됩니다(원하시면 만들어 드립니다).

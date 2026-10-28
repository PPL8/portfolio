# Pages CMS — Works 관리 안내

## 연결 방법
1. [Pages CMS](https://app.pagescms.org/)에 GitHub 계정으로 로그인합니다.
2. Pages CMS GitHub App이 `PPL8/portfolio` 저장소에 접근할 수 있도록 설치/권한을 확인합니다.
3. 저장소 `PPL8/portfolio`를 선택하고 **main** 브랜치를 선택합니다.
4. GitHub 저장소의 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 설정합니다. 이 설정은 한 번만 필요합니다.
5. CMS에서 **Works** 컬렉션을 열어 기존 작품을 확인합니다.

## 작품 추가·수정·삭제
- Works에서 새 항목을 만들고 고유한 작품 ID(예: `art-13`, `video-07`)를 입력합니다.
- 작품 유형은 Illustration(`art`), Video(`video`), Animation(`animation`) 중 하나를 선택합니다.
- 제목, 카테고리, 제작 시기/연도, 대표 이미지, 작품 설명, 태그, 상세페이지 주소를 입력합니다.
- 공개 여부(`published`)가 켜진 작품만 웹사이트에 노출됩니다.
- 노출 순서(`order`)가 작은 작품이 먼저 정렬됩니다. 현재 각 갤러리의 화면은 기존 코드처럼 배열을 역순으로 보여주므로, 화면에서 보이는 순서가 CMS의 오름차순과 반대가 될 수 있습니다. 기존 표시 순서를 그대로 보존하기 위해 초기 order 값은 기존 배열 순서로 설정되어 있습니다.
- 항목을 삭제하면 해당 JSON 파일이 제거되고 다음 데이터 동기화에서 웹사이트 카드도 제거됩니다.

## 이미지 업로드
- 이미지 필드는 기존 `투명화/` 폴더를 사용합니다.
- CMS에 새 이미지를 올리면 해당 폴더에 저장되고, JSON의 `imagePath` 값이 웹사이트 이미지 경로로 사용됩니다.
- 영상/애니메이션은 `youtubeId`로 YouTube 플레이어를 열고, `imagePath`는 카드 썸네일로 사용합니다. 기본 썸네일은 기존 YouTube 썸네일 URL입니다.

## 상세페이지와 외부 링크
- `detailUrl`: 선택적 대표 상세 링크
- `pixivUrl`: Pixiv 작품 주소
- `xUrl`: X 게시글/프로필 주소
- `youtubeId`: YouTube 영상 ID
- `duration`, `tools`, `comment`: 상세 모달에 표시되는 작업 정보

## 데이터 위치와 연동 구조
- 개별 CMS 작품: `content/works/*.json` (작품별 JSON 파일)
- Pages CMS 설정: `.pages.yml`
- 데이터 검증/통합 스크립트: `scripts/build-works.mjs`
- 웹사이트가 읽는 생성 데이터: `data/works.js`
- 웹페이지와 기존 카드/모달 UI: `index.html`

CMS가 main 브랜치의 작품 JSON을 저장하면 **Build and Deploy Portfolio** 워크플로가 실행됩니다. 워크플로는 모든 JSON을 검사하고 `data/works.js`를 다시 생성한 뒤, `index.html`, `data/`, `투명화/`만 포함한 정적 사이트 아티팩트를 GitHub Pages에 직접 배포합니다. 별도의 생성 커밋을 만들지 않으므로 GitHub Actions 토큰이 만든 커밋 때문에 Pages 배포가 누락되는 문제를 피합니다.

워크플로는 `content/works/**` 변경과 사이트 관련 파일 변경 시 실행됩니다. Pull Request에서는 데이터 검증과 아티팩트 생성까지만 수행하고 실제 배포는 하지 않습니다.

## 참고
- `featured`(메인 노출)는 CMS에서 관리하는 플래그입니다. 현재 사이트에는 별도의 대표 작품 섹션이 없으므로 실제 카드 표시 여부는 `published`가 제어합니다.
- 현재 저장소에 상세페이지 HTML은 별도로 없으며, 기존 외부 링크와 YouTube 모달을 유지합니다.
- CMS 화면에 실제로 로그인하여 컬렉션 목록을 확인하는 검증은 이 저장소 변경만으로 대체할 수 없습니다.

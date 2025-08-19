# System overview

간단한 목적: 이 저장소는 정적 클라이언트 기반 블로그이자 Markdown에서 파생한 지식 그래프를 제공하는 사이트입니다. 백엔드 서비스는 없으며 모든 컨텐츠는 빌드 시점에 정적 파일로 생성됩니다.

## 요약 아키텍처

- `scripts/build-graph.js` — Markdown + YAML front-matter를 파싱하여 `public/graph.json`(nodes, links, topics, archives)을 생성합니다.
- `scripts/build-meta.js` — 버전/커밋 및 기본 site 설정을 `public/meta.json` / `public/site.json`으로 생성합니다.
- UI: `index.html`(홈), `graph.html`(D3 기반 지식 그래프), `viewer.html`(안전한 Markdown 렌더링).
- 자산: `assets/css/styles.css`, `assets/js/footer.js` 등.

> 구현 노트: 현재 `scripts/build-graph.js`는 `archives`를 JavaScript의 `Array.prototype.sort()`로 정렬하여 알파벳(사전) 오름차순으로 출력합니다. 문서와 다른 정렬(예: 내림차순 연대순)을 원하면 스크립트를 변경하거나 출력 후 클라이언트에서 정렬하세요.

## 데이터 계약 (간단)

다음은 `public/graph.json`에서 기대되는 핵심 필드들입니다(간단한 스키마 설명).

- nodes (array of objects)
  - id: string (예: `2025/dev-journal`)
  - label/title: string
  - base: string (파일명 기반)
  - file: string (repo 상대경로)
  - archive: string
  - topics: string[]
  - mtime: number (ms)
  - date?: string
  - author?: string

- links (array of objects)
  - source: string (node id)
  - target: string (node id)
  - (선택) type: 'wiki' | 'mention'

- archives: string[]  — 스크립트 출력은 알파벳(사전) 오름차순입니다.
- topicsByArchive: { [archive]: string[] }
- meta: { version: string, commit: string }
- site: { emailUser: string, emailDomain: string, postsCollection?: string | string[] }

간단한 JSON Schema(예시)

```json
{
  "type": "object",
  "required": ["nodes","edges"],
  "properties": {
    "nodes": { "type": "array" },
    "edges": { "type": "array" }
  }
}
```

(참고: 실제 CI 검증에는 더 상세한 schema를 사용하는 것을 권장합니다; 예: `ajv`로 타입/필수 필드 검사)

## UI 동작 요약

- Graph (`graph.html`)
  - D3 force 기반 시뮬레이션. 호버 시 인접 노드 강조, 클릭 시 선택 및 외곽선 표시.
  - 필터: 아카이브, 토픽, force/size 조절. 많은 노드가 있을 때는 필터로 노드 수를 제한하여 성능을 유지합니다.
  - 검색: 결과 클릭으로 문서 오버레이 열기 및 포커스 이동.

- Viewer (`viewer.html`)
  - Markdown → HTML: Marked를 사용하여 파싱한 뒤 DOMPurify로 정화하고 highlight.js로 코드 하이라이팅.
  - 백링크 목록 표시 및 그래프와 연동 메시지 전송.

## 보안

- 모든 Markdown 출력은 DOMPurify로 정화됩니다(기본 정책). 추가적으로 외부 스크립트/iframe 로드 금지, event handler 제거 등 정책을 적용합니다.
- 푸터에 표시되는 이메일은 `public/site.json`에서 부분 마스킹/토글로 제어할 수 있으니 민감 정보는 설정에서 관리하세요.

검증 포인트

- XSS 방어: Marked + DOMPurify 파이프라인이 적용되어야 하며, CI에서 샘플 XSS 페이로드가 무해화되는지 확인하세요.

## 성능

- graph 데이터는 JSON로 제공되어 클라이언트에서 렌더됩니다. D3 force 시뮬레이션은 노드 수에 민감하므로 대부분의 경우 필터나 샘플링을 통해 표시 노드 수를 제한합니다.
- 권장: 로컬에서 그래프 빌드 시간이 일정 수준(예: 전체 빌드 < 60s)을 유지하는지 모니터링하세요.

## 운영 / CI 권장 검사

- 기본 스모크(권장):
  - `npm ci` (lockfile 일관성 검사)
  - `node scripts/build-graph.js` (exit 0)
  - graph JSON 스키마 검증(간단한 ajv 체크)
  - 링크 체크(누락된 파일 보고)

- 권장 자동화: PR 이벤트에서 lint + build + link-check + schema 검증을 실행하여 머지 전 품질을 확보하세요.

## 변경/구성 노트

- `postsCollection` 기본값은 `"Posts"`입니다(홈 페이지가 이 컬렉션만 표시).
- `scripts/build-graph.js`의 archives 정렬 로직을 변경하려면 해당 파일의 출력 직전 `.sort()` 호출을 조정하세요.

## 간단한 문제 해결 흐름

1. 로컬: `npm run build` → `public/graph.json` 존재 및 파싱 확인
2. 로컬에서 문제가 없으면 GitHub Actions에서 workflow 재실행 또는 빈 커밋으로 재배포
3. 실패 시 Actions 로그(프린트된 스택/오류)를 복사해 PR에 첨부하거나 담당자에게 전달

```

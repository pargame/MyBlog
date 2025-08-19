
## 2025-08-15 — 문서 포맷 수정, 빠른 커밋 트리거, 워크플로 정리

변경 사항:

- pre-commit 성능 개선: `.git/hooks/pre-commit` 훅은 docs 또는 scripts가 스테이징된 경우에만 로컬 빌드를 실행하도록 변경되었습니다. 훅을 건너뛰려면 `SKIP_PRECOMMIT=1` 또는 `--no-verify`를 사용할 수 있습니다. CI에는 영향이 없습니다.
- GitHub Pages: 중복된 워크플로 `.github/workflows/page.yml` 을 제거하고 `pages.yml`만 사용하도록 정리했습니다.
- Markdown 포맷터 추가: `scripts/fix-markdown-bold.js`는 굵은표시 마커가 줄바꿈되어 분리된 불릿을 정리합니다(예: `* **Label:\n** Body` → `* **Label:** Body`).

포맷터 사용 방법:

- 로컬에서 한 번 실행: `npm run fix:md:bold`
- 남아있는 잘못된 불릿이 없는지 확인:
	- 검색 패턴: `:`로 끝나는 불릿 라인 다음 줄이 `**`로 시작하는 경우
	- 예제 grep (docs 폴더 경로에 맞게 조정): `rg -n "^\s*\*\s+\*\*[^\n]*:\s*$\n\*\*\s" docs/Unreal`

노트:

- 이 포맷터는 보수적으로 설계되어 불릿 리스트만 수정합니다. 필요 시 범위를 확장할 수 있습니다.


# 유지보수 정책 (Maintenance Policy)

이 문서는 저장소의 일관성과 자동화된 작업을 위한 운영 규칙을 제공합니다. 아카이브별 frontmatter 규칙, 언어 정책, 링크 규칙, 커밋/빌드 규칙과 실무 체크리스트를 정리합니다.

## 언어 정책 (Language policy)

- 기본 원칙: 문서의 기본 작성 언어는 한국어(한글)입니다. 문서 본문은 한글로 작성하되, 코드·식별자·라이브러리명·API·하드웨어 용어(예: API, DRAM, RAID) 등 기술용어 및 전문용어는 영어로 표기하세요.
- 아카이브별 예외: 일부 기술 중심 아카이브(예: `docs/Unreal/`)는 영어/한글 혼용을 허용합니다. 아카이브 규칙이 별도로 지정된 경우 해당 규칙을 따르세요.

## 변경 또는 PR 전 점검 (Content and files)

PR 또는 큰 변경을 만들기 전에 저장소 루트에서 아래 항목을 확인하세요.

- [ ] Build metadata 및 그래프 생성
	- `npm run build` 를 실행하여 `public/graph.json` 및 `public/meta.json`을 생성하세요.
	- **Unreal 아카이브(`docs/Unreal/`)**: 반드시 빈 YAML frontmatter(`---` 두 줄, 내용 없음)를 사용하세요. `title` 등의 필드를 추가하지 마세요.
	- **기타 아카이브**: `title` 필드가 필요합니다(한글 제목 권장).
	- 빠른 검사 예: `rg "^---\n(?!title:)" -n "docs/Computer Architecture" || true`

- [ ] 링크 및 누락 스텁 확인
	- 상대경로 링크 및 wiki 링크가 실제 파일을 가리키는지 확인하세요. 누락된 파일이 있다면 frontmatter만 포함한 스텁 파일을 만드세요.
	- 빠른 검사 예: `node scripts/build-graph.js && rg "\[.*\]\([^)]*\.md\)" -n | while read -r l; do file=$(echo "$l" | sed -E 's/.*\(([^)]*\.md)\).*/\1/'); [ -f "$file" ] || echo "MISSING: $file"; done`

- [ ] 내용/용어/완성도
	- 아카이브별 언어 규칙을 준수하고 기술용어는 영어로 유지하세요.
	- TODO나 미완성 표시를 제거하세요.

- [ ] 커밋 메시지/최종 푸시
	- 커밋 메시지 형식: `docs(arch): <short description>`
	- 스텁 또는 작은 수정만 있는 경우 PR 설명에 체크리스트 링크를 추가하세요.

위 항목이 실패하면 로컬에서 수정 후 다시 반복하세요.

노트:

- 이 작업 흐름은 의도적으로 최소한의 검사만 수행하도록 설계되었습니다. PR 단계에서 CI가 더 완전한 검증을 수행합니다. 목적은 PR 생성 전에 명백한 실수(링크 누락, 잘못된 frontmatter 등)를 줄이는 것입니다.
- 변경을 예외 처리해야 한다면(예: 한글 아카이브에 영어 파일을 의도적으로 추가하는 경우) PR 설명에 예외 사유와 리뷰어를 명시하세요.

## 변경 이력
- 2025-08-15: pre-commit 훅 동작 조건 개선, 중복 Pages 워크플로 제거, Markdown 포맷터 추가

## 시스템 구성 변경 기록

- 2025-08-19: `scripts/build-graph.js` 수정 및 검증
	- 변경 내용:
		- `_getFrontMatterHeader` 함수를 추가하여 YAML front-matter 헤더 추출을 더 관용적으로 처리하도록 변경했습니다.
		- `DEBUG_GRAPH` 환경변수로 상세 디버그 로그 출력을 제어하도록 변경했습니다.
		- 그래프 엣지 중복을 방지하기 위해 소스/타깃 페어를 키로 하는 Set을 사용하여 중복 엣지를 제거하도록 구현했습니다.
		- 파일 경로 정규화 등 소규모 견고성 개선을 적용했습니다.
	- 의도: front-matter 파싱 신뢰성 향상, 그래프 품질 개선, 디버그 편의성 제공
	- 검증: 로컬에서 `node scripts/build-graph.js` 를 실행하여 `public/graph.json` 이 정상 생성되는 것을 확인했습니다 (exit code 0).
	- 문서화: 이 변경은 handbook의 '시스템 구성 변경 기록'에 기록되었습니다.

## 목적
운영 절차(검토 체크리스트, 아카이브별 규칙, 배포 체크)를 명확히 하여 유지보수 실수를 줄입니다.

## PR / 변경 전 체크리스트
- [ ] `npm run build` 실행 및 `public/graph.json` 확인
- [ ] 아카이브 규칙 준수(예: `docs/Unreal` 빈 frontmatter)
- [ ] 모든 상대/위키 링크가 존재하는지 확인
- [ ] 커밋 메시지에 범위 표기(예: `docs(arch): ...`)

## 아카이브별 규칙 요약
- Unreal (`docs/Unreal/`): 빈 YAML frontmatter (`---` 두 줄, 내용 없음). `title` 등 필드 추가 금지.
- Computer Architecture: `title` 필수(한글 권장). 파일명은 숫자 접두사+슬러그.

## 배포 / 퍼블리싱 주의사항
- `public/` 아티팩트는 기본적으로 커밋하지 않습니다. Pages 워크플로가 빌드하여 배포합니다.
- 사이트 갱신이 필요하면 Actions 재실행 또는 빈 커밋으로 배포를 트리거할 수 있습니다:

```bash
git commit --allow-empty -m "ci: trigger GitHub Pages redeploy" && git push origin main
```

## 문제 해결 요약
1. 로컬: `npm run build` → `public/graph.json` 확인. 누락 시 frontmatter/파일 경로를 검토하세요.
2. 로컬이 올바르면 GitHub Actions 재실행 또는 빈 커밋으로 재배포하세요.
3. 실패 시 Actions 로그를 PR에 첨부하여 검토를 요청하세요.


- (참고) 빈 커밋 예시: `git commit --allow-empty -m "ci: trigger GitHub Pages redeploy" && git push origin main`.
- (권장하지 않음) 워크플로우가 명시적으로 추적하도록 구성되어 있지 않다면 `public/*` 산출물을 커밋하지 마세요.

## GitHub Actions 로그 확인
- 사이트가 갱신되지 않으면 Actions → "Deploy to GitHub Pages" 실행 로그를 확인하세요. `Build`/`Deploy` 단계의 에러와 `page_url` 출력을 확인하세요.
- 일반적인 실패 원인: 의존성 설치 오류, `build-graph`/`build-meta` 실행 중 예외, Pages 권한 문제(리포지토리 설정 확인).

## Graph UI 관련 메모
- 그래프 빌더는 `docs/` 또는 `posts/` 아래의 첫 번째 폴더를 `archive`로 파악합니다. 폴더 이름에 앞뒤 공백이 없고 파일이 `docs/<ArchiveName>/`에 제대로 위치했는지 확인하세요.
- `public/graph.json`에 아카이브가 있어도 graph UI에 보이지 않는다면 `graph.html`의 아카이브 선택 로직을 확인하세요(기본적으로 특정 아카이브를 우선 표시할 수 있음).

## 빠른 문제해결 흐름
1. 로컬: `npm run build` → `public/graph.json`의 nodes/archives 확인. 누락 시 frontmatter/파일 경로/타이틀 규칙 확인.
2. 로컬에서 그래프가 맞으면 Pages 워크플로우를 재실행하거나 빈 커밋으로 재배포하세요.
3. 배포 실패 시 Actions 실패 로그를 복사해 PR에 첨부하거나 유지보수자에게 전달하세요.



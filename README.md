# MyBlog

중요: 이 저장소의 모든 변경은 아래 규칙을 반드시 준수해야 합니다.

## 핵심 규칙 (무조건 준수)

1. `npm run check`를 로컬에서 반드시 실행하여 성공해야 합니다.
   - 실행 명령: `npm run check`
   - 기대 결과: 종료 코드 0, `found 0 vulnerabilities`, 그리고 모든 경고(warnings), deprecated 메시지, eslint 경고/오류가 전혀 없어야 합니다.

2. 임시방편(temporary fixes)은 절대 금지합니다.
   - `package.json`의 `overrides` 사용 금지.
   - lockfile을 통한 취약점 숨기기 금지.
   - 취약점/경고는 upstream 패키지 업그레이드, 직접 코드 수정, upstream PR 제출 또는 포크·패치로 근본 해결해야 합니다.

3. 자동수정은 허용되지만, 자동수정으로 해결되지 않는 경고는 수동으로 근본 수정해야 합니다.
   - ESLint/Prettier 자동수정은 `npm run check`에 포함됩니다. 자동수정 이후에도 경고가 남으면 코드를 수정 후 재실행하세요.

## 자세한 설정 및 흐름
자세한 현재 설정, 스크립트, 빌드/배포 흐름은 `DEVELOPMENT.md`에 정리되어 있습니다. 변경 전 반드시 해당 파일을 확인하세요.

파일: `DEVELOPMENT.md`

## 빠른 명령

```bash
# 개발서버
npm run dev

# 전체 점검(자동수정 포함) + 빌드
npm run check

# 로컬 빌드 (dist 생성)
npm run deploy
```
위 규칙은 프로젝트의 안정성과 장기 유지보수를 위해 반드시 따라야 합니다.

## `npm run check` 동작 (명확한 규약)

`npm run check`는 로컬에서 코드 품질과 보안, 빌드를 모두 검증하는 단일 명령입니다. 모든 PR/커밋 전 반드시 실행하세요.

- 단계별 행동:
   1. eslint 자동수정: `eslint --fix` (코드 스타일/경고 자동수정)
   2. prettier 적용: `prettier --write` (형식 적용)
   3. 보안검사: `npm audit --omit dev --audit-level=moderate` (취약점 보고)
   4. 빌드: Vite 프로덕션 빌드 (생성된 산출물을 통해 런타임 에러 확인)

- 성공 조건: 종료 코드 0 및 모든 ESLint/TypeScript 경고·오류가 없음, `found 0 vulnerabilities` 또는 허용된 업스트림 이슈가 없는 상태.

- 실패 대응: 자동수정으로 해결되지 않는 경고/취약점은 다음 중 하나로 해결해야 합니다: 업스트림 패치(버전 업), 코드 수정, upstream에 PR 제출 또는 패치-포크 방식.

## Lockfile 및 임시 우회 정책

- lockfile(package-lock.json)은 저장소에 커밋합니다. 그러나 lockfile을 이용해 취약점을 "숨기거나" 우회하는 것은 금지됩니다.
- `overrides`나 다른 임시 설정으로 경고를 억제하는 것은 허용되지 않습니다. 모든 보안 문제는 근본적으로 해결해야 합니다.

위 규칙을 위반하면 PR은 자동으로 반려될 수 있습니다. 문서의 정책을 반드시 준수하세요.


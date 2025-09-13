# MyBlog

중요: 이 저장소의 모든 변경은 아래 규칙을 반드시 준수해야 합니다.

## 핵심 규칙 (무조건 준수)

1. `npm run check`를 로컬에서 반드시 실행하여 성공해야 합니다.
   - 실행 명령: `npm run check`
   - 기대 결과: 종료 코드 0, `found 0 vulnerabilities`, 그리고 모든 경고(warnings), deprecated 메시지, eslint 경고/오류가 전혀 없어야 합니다.

2. 임시방편(temporary fixes)은 절대 금지합니다.
   - `package.json`의 `overrides` 사용 금지.
   - lockfile을 통한 취약점 숨기기 금지.

3. 자동수정은 허용되지만, 자동수정으로 해결되지 않는 경고는 린트 완화가 아닌, 수동으로 수정해야 합니다.
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

# 로컬 빌드 (dist 배포)
npm run deploy
```
위 규칙은 프로젝트의 안정성과 장기 유지보수를 위해 반드시 따라야 합니다.

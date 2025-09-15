
# 에러/문제 사례 모음 (해결 기록)

이 문서는 `src/pages/Pynode.tsx`(간이 WebIDE) 개발 과정에서 발견했고 해결한 주요 문제들, 원인 분석, 해결 방법 및 검증 정보를 기록합니다.

작성일: 2025-09-14

---

## 1) 터미널에 출력이 전혀 나타나지 않음
- 증상: Python 코드(예: print())를 실행해도 터미널 영역에 출력이 보이지 않음.
- 근본 원인:
	- 워커(Worker) 생성 직후에 main -> worker로 `init` 메시지를 보냈지만, 워커에 대한 `message` 리스너가 아직 등록되지 않아 워커에서 보내는 초기 메시지(ready 등)를 놓침.
	- Pyodide 버전/환경에 따라 stdout/stderr 후킹 방식이 달라져 직접 스트리밍이 동작하지 않는 경우가 있었음.
- 해결 방법 요약:
	- 워커 인스턴스를 만들자마자(Blob -> Worker) 즉시 리스너를 등록하도록 변경. 리스너가 먼저 붙은 뒤 `postMessage({type:'init'})`를 호출.
	- Pyodide의 표준 출력/에러를 안정적으로 수집하기 위해, 실행 시 Python 쪽에서 `io.StringIO()`로 stdout/stderr를 임시 캡처하고 실행 종료 후 JS로 한 번에 전달하는 방식(StringIO capture + JS forward)을 도입.
- 관련 변경 파일: `src/pages/Pynode.tsx` (워커 초기화 순서, 메시지 핸들러, StringIO 포워딩 추가)
- 검증: 브라우저에서 `print('Hello from Pyodide')` 출력이 터미널에 보이는지 확인.

---

## 2) 워커에서 Uncaught SyntaxError: Invalid or unexpected token (blob:...)
- 증상: 워커 스크립트를 Blob으로 만들고 new Worker(url)을 할 때, 워커에서 SyntaxError가 발생하며 실행이 중단됨.
- 근본 원인:
	- 템플릿 리터럴 내부에 이스케이프 처리되지 않은 문자/문자열이 포함되어 있거나, 빌드 환경에서 문자열이 변형되어 JS 파서가 이해하지 못하는 문자가 들어감.
	- Blob의 문자 인코딩이 환경마다 달라 해석 오류를 유발할 수 있음.
- 해결 방법 요약:
	- `String.raw`를 사용해 워커 스크립트 템플릿을 안전하게 취급.
	- `TextEncoder`로 UTF-8 바이트를 명시적으로 생성한 뒤 Blob을 만들도록 변경(명시적 charset 처리).
	- sourceURL을 넣어 디버깅 시 원본 위치를 확인하기 쉽게 함.
- 관련 변경 파일: `src/pages/Pynode.tsx`(workerScript 정의부, makeWorker())
- 검증: 워커가 SyntaxError 없이 초기화되고 `ready` 메시지를 보냄.(`isReady` 상태가 'ready'로 바뀌는지 확인)

---

## 3) 터미널 출력이 두 번 찍히거나 중복 출력
- 증상: 동일한 출력이 중복으로 터미널에 표시됨.
- 근본 원인:
	- 두 곳에서 동일한 출력을 포워딩했음: (1) Python StringIO -> JS forward, (2) pyodide.setStdout/setStderr의 스트리밍 핸들러가 동시에 활성화되어 결과가 이중 전송됨.
	- 또한, 컴포넌트 재마운트/리스너 중복 등록으로 같은 메시지에 대한 핸들러가 여러 번 호출된 경우가 있었음.
- 해결 방법 요약:
	- 메시지 핸들러를 중앙화하고 워커당 하나의 리스너만 등록되도록 보장.
	- 터미널에 쓰기 전 중복 필터링 로직을 추가(WeakMap 기반 메타데이터로 최근 동일 메시지 필터링).
	- 기본 전략은 StringIO로 캡처 후 한 번에 전달; 필요 시 pyodide.setStdout/setStderr는 per-run 바인딩으로만 사용하거나 예외적으로 비활성화.
- 관련 변경 파일: `src/pages/Pynode.tsx` (메시지 중앙화, dedupe 로직)
- 검증: 동일 입력을 여러 번 출력해도 중복이 나타나지 않음.

---

## 4) interactive input() (stdin) 미지원
- 증상: Python 코드에서 `input()`을 호출하면 응답이 오지 않거나 워커가 블록됨.
- 근본 원인:
	- 워커↔메인 사이에 input 요청/응답 프로토콜이 정의되어 있지 않았음.
	- Pyodide에서 Python의 `input()`을 가로채 JS 쪽으로 전달하는 브릿지가 필요함.
- 해결 방법 요약:
	- 워커에서 `globalThis.getInput` 함수를 통해 JS로 `request-input` 메시지를 보냄. 메인은 UI(인-터미널 입력 박스)를 띄워 사용자의 값을 받아 `input-value` 메시지로 응답.
	- 배치 입력(텍스트영역에서 여러 줄을 미리 넣음)도 우선 사용하도록 구현.
	- 입력 요청 시 포커스 이동 등 UX 개선을 추가.
- 관련 변경 파일: `src/pages/Pynode.tsx` (request-input / input-value 프로토콜 및 UI 연결)
- 검증: 아래 Python 코드가 터미널 입력 상호작용을 통해 정상 동작함.
```py
name = input('name: ')
print('hello', name)
```

---

## 5) 상태가 항상 '초기화중...'으로 멈춤
- 증상: 컴포넌트에선 워커 초기화를 기다리지만 `ready`를 받지 못해 상태가 바뀌지 않음.
- 근본 원인:
	- `ensurePyodide()` 내부에서 pyodide 초기화가 실패하거나 ready 메시지(postMessage({type:'ready'}))가 누락되는 케이스.
	- 워커가 초기화에 실패하더라도 메인에 제대로 에러를 전달하지 못해 무한 대기 상태가 됨.
- 해결 방법 요약:
	- ensurePyodide()에서 pyodide 로드 실패 시 stderr/error로 에러를 postMessage 하도록 보강.
	- pyodide가 정상적으로 준비되면 항상 `postMessage({type:'ready'})`를 호출.
	- 메인 쪽은 initTimeout(예: 12s)을 두고 타임아웃 이후 적절히 재시도하거나 에러 상태를 표시하도록 변경.
	- isReadyRef 같은 레퍼런스로 클로저 문제를 방지.
- 관련 변경 파일: `src/pages/Pynode.tsx`
- 검증: 일정 시간 내에 `ready` 메시지를 받지 못하면 타임아웃 로직이 동작함(콘솔/상태 확인).

---

## 6) 워커 종료/중지 로그('[process ...] exited') — 사용자 요구로 제거됨
- 증상: 프로그램 종료 시 `[process 123456789] exited` 같은 보조 로그가 터미널에 표시되어 원치 않는 추가 텍스트가 보였음.
- 의도: 런 환경 디버깅용으로 추가했던 보조 로그였음(프로세스 ID/런ID 표시).
- 사용자 요청: 터미널에는 오직 프로그램의 표준 출력/표준 에러만 보이길 원함.
- 해결 방법: `exit` 메시지 처리 시 터미널에 보조 로그를 쓰는 부분을 삭제함.
- 관련 변경 파일: `src/pages/Pynode.tsx` (exit 처리부에서 writeToTerminal 호출 제거)
- 검증: 종료 후 터미널에 `[process ...] exited` 메시지가 더 이상 표시되지 않음.

---

## 7) 타입스크립트/ESLint 관련 경고(예: any 사용)
- 증상: `any` 사용으로 ESLint/TSLint 경고가 발생하거나 lint 통과 불가.
- 근본 원인: 초기 메시지 핸들러에서 넓은 union 타입을 `any`로 처리했음.
- 해결 방법:
	- `WorkerMessage`/`WorkerMessageExtended` 등 명확한 유니온 타입을 선언하고, 핸들러에서 안전한 타입 가드와 선택적 필드 접근을 사용하도록 변경.
	- 불필요한 `any`를 제거하고 안전한 타입 변환으로 수정.
- 관련 변경 파일: `src/pages/Pynode.tsx` (타입 선언 및 핸들러 변경)
- 검증: `npm run check` (ESLint + Prettier) 통과.

---

## 검증 / 린트 / 빌드 결과
- 최종적으로 `npm run check`(ESLint 자동수정, Prettier, npm audit, Vite build) 수행 후 모두 통과.
- 주요 사용자 변경/수정 파일: `src/pages/Pynode.tsx` (워커 스크립트 정의, makeWorker(), 메시지 중앙화, StringIO 포워딩, input 프로토콜, 터미널 dedupe 및 exit 로그 제거 등)

---

## 재현 방법(간단)
1. 브라우저에서 Pynode 페이지 접속
2. 에디터에 `print('Hello from Pyodide')` 입력
3. Run 클릭 → 터미널에 Hello from Pyodide 출력(한 번만) 확인
4. `input()`을 사용하는 코드로 실행하면 하단 인-터미널 입력 박스가 등장하고 입력 후 정상 동작 확인

---

## 향후 개선 권장사항
- 워커와의 통신 프로토콜(메시지 schema)을 문서화하여 유지보수성 향상.
- 더 안전한 인터럽트(중단) 처리: Pyodide 실행을 중단시키는 명확한 방법이 제한적이므로 실행 타임아웃 또는 웹워커 재생성 전략을 정식화.
- E2E 스모크 테스트: 자동화 브라우저 테스트(Playwright 등)로 `print`/`input` 흐름을 검증하면 회귀를 방지할 수 있음.

---

문제가 더 있거나 특정 케이스(예: 대용량 출력, 바이너리 데이터 처리, Pyodide 업데이트 관련 호환성)를 문서화/재현해두고 싶으면 알려주세요. 상세한 재현 시나리오나 추가 로그 형식으로 `ERRORCASES.md`를 확장해 드리겠습니다.

## 8) 배포 시 React 내부 심볼(`memo`) 관련 런타임 TypeError (배포 후 콘솔 에러)
- 증상: 배포된 사이트에서 콘솔에 다음과 같은 에러가 발생했습니다:
	- Uncaught TypeError: Cannot read properties of undefined (reading 'memo')
	- 에러 스택이 vendor-*.js 내에서 발생하며, 특정 구형(이전) vendor 청크 파일명을 참조하는 경우가 관찰됨 (예: vendor-D_UkMwUS.js)
- 근본 원인:
	- Vite의 `manualChunks` 커스텀 설정이 React/ReactDOM(및 라우터 등)을 서로 다른 청크로 분리하면서 생긴 문제입니다.
	- 결과적으로 번들간 초기화/의존성 순서가 어긋나거나 동일 모듈이 중복 번들로 생성되어, 한 번들에서 React의 내부 심볼(`memo` 등)을 참조할 때 해당 심볼이 아직 정의되지 않아 `undefined`가 됨.
	- 또한 배포 후 브라우저(또는 CDN)가 여전히 이전 빌드의 `index.html`이나 청크명을 캐시하고 있으면, 오래된 청크를 요청해 불일치가 발생할 수 있습니다.
- 해결 방법 요약:
	- 가장 안정적인 해결책은 `vite.config.ts`의 `manualChunks`를 단순화해 모든 `node_modules`를 하나의 `vendor` 청크로 묶는 것입니다(또는 최소한 `react`/`react-dom`/`react-router-dom`을 같은 청크로 묶음).
	- 빌드 후 `dist/assets`를 확인하여 vendor 청크 구성이 의도대로 되었는지 확인합니다.
	- 배포 후 `index.html`이 올바른(최신) vendor 파일명을 가리키는지 `curl`로 점검합니다. 브라우저에서 오래된 파일명을 계속 요청하면 캐시 무효화(하드 리로드, 시크릿 창) 또는 빈 커밋으로 재배포를 시도합니다.
	- 단기 완화책: `public/assets`에 과거 파일명과 동일한 이름의 작은 shim 파일을 두어(단순히 최신 번들을 import/forward) 과거 URL 요청을 처리할 수 있습니다.
- 검증:
	- 로컬: `npx vite build` 후 `dist/assets`에 `vendor-*.js`가 단일 또는 의도한 분할로 존재하는지 확인.
	- 서버: `curl https://<your-pages>/index.html`로 Pages가 최신 `index.html`을 반환하는지 확인.
	- 브라우저: 캐시를 비운 뒤 페이지를 열어 콘솔 에러가 사라지는지 확인.


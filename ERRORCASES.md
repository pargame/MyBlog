
# 에러 케이스 (재발 위험 높음)

> **최종 업데이트**: 2025-10-02  
> **목적**: 재발 가능성이 높은 핵심 에러 케이스만 기록

이 문서는 재발 위험이 높은 에러 케이스만 간결하게 기록합니다. 각 케이스는 **증상 → 원인 → 해결책** 순서로 구조화되어 있습니다.

---

## 📋 핵심 에러 케이스

## 1. 터미널 출력 미표시 (Pynode)
**증상**: Python `print()` 실행 시 터미널에 출력 없음  
**원인**: Worker 리스너 등록 전 `init` 메시지 전송으로 `ready` 손실  
**해결책**:
- 리스너 우선 등록 → `init` 메시지 전송 순서 보장
- StringIO 기반 버퍼링 + setStdout/setStderr 이중 캡처
- `globalThis.__forward()`로 Python → JS 브릿지

**핵심 코드**:
```typescript
const w = makeWorker();
const cleanup = attachWorkerListeners(w);  // 리스너 먼저
w.postMessage({ type: 'init' });           // 메시지 나중
```

---

## 2. Worker SyntaxError (Pynode)
**증상**: Blob URL Worker 생성 시 SyntaxError  
**원인**: 인코딩 불일치, 템플릿 리터럴 이스케이프 누락  
**해결책**: String.raw + TextEncoder + 명시적 UTF-8

**핵심 코드**:
```typescript
const workerScript = String.raw`/* worker code */`;
const encoder = new TextEncoder();
const blob = new Blob([encoder.encode(workerScript)], 
  { type: 'text/javascript;charset=utf-8' });
const w = new Worker(URL.createObjectURL(blob));
```

---

## 3. 터미널 출력 중복 (Pynode)
**증상**: 동일 텍스트 2회 이상 출력  
**원인**: 이중 캡처 (StringIO + setStdout), 리스너 중복 등록  
**해결책**: WeakMap 기반 중복 제거 (200ms 내 동일 메시지 필터)

**핵심 코드**:
```typescript
const terminalWriteMeta = new WeakMap<Element, {
  lastMessage?: string; lastTime?: number;
}>();
// 200ms 내 동일 메시지 무시
if (meta.lastMessage === normalized && 
    now - meta.lastTime < 200) return;
```

---

## 4. Interactive input() 미지원 (Pynode)
**증상**: Python `input()` 호출 시 무응답  
**원인**: Worker ↔ Main 간 input 프로토콜 부재  
**해결책**: globalThis.getInput 브릿지 + 메시지 프로토콜

**핵심 구조**:
```javascript
// Worker
globalThis.getInput = (prompt) => new Promise(resolve => {
  inputResolvers[id] = resolve;
  self.postMessage({type: 'request-input', inputId: id, prompt});
});

// Main
if (msg.type === 'request-input') {
  // Stdin 우선, 없으면 인터랙티브 입력 필드 표시
}
```

---

## 5. 초기화 무한 대기 (Pynode)
**증상**: '초기화중...' 상태 무한 대기  
**원인**: ensurePyodide() 실패 시 에러 미전송, 타임아웃 부재  
**해결책**: 견고한 에러 전파 + 12초 타임아웃 가드

**핵심 코드**:
```javascript
// Worker
try {
  pyodide = await loadPyodide({...});
  self.postMessage({type: 'ready'});
} catch (err) {
  self.postMessage({type: 'stderr', text: '[worker] error: ' + err});
}

// Main
initTimeoutRef.current = setTimeout(() => {
  if (!isReadyRef.current) { /* 타임아웃 처리 */ }
}, 12000);
```

---



## 6. React 번들링 에러 (배포 시 `memo` 관련 TypeError)
**증상**: 배포 사이트에서 `Cannot read properties of undefined (reading 'memo')` 에러  
**원인**: React/ReactDOM 과도한 분리로 모듈 초기화 순서 문제, 구버전 index.html 캐시  
**해결책**: **React 코어는 반드시 단일 청크 유지** (react + react-dom 함께)

**핵심 전략**:
```typescript
// vite.config.ts
manualChunks(id) {
  if (id.includes('node_modules')) {
    // React 코어는 절대 분리 금지
    if (id.includes('react') || id.includes('react-dom')) {
      return 'vendor.react';
    }
    if (id.includes('react-router')) return 'vendor.router';
    if (id.includes('marked')) return 'vendor.marked';
    if (id.includes('monaco')) return 'vendor.monaco';
    return 'vendor.misc';
  }
}
```

**검증**: `curl https://pargame.github.io/MyBlog/index.html` → 최신 청크명 확인

---

## 검증

```bash
npm run check  # ESLint + Prettier + audit + build
```

**테스트 시나리오** (Pynode):
- `print('test')` → 출력 1회만 표시
- `input('name: ')` → 프롬프트 정상 작동
- 오프라인 시 → 12초 후 타임아웃 메시지

---

## 문제 보고

새 이슈 발견 시:
- **환경**: 브라우저 + 버전
- **재현 단계**: 상세히 기술
- **콘솔/네트워크**: 에러 메시지 첨부

## 8) 배포 시 React 내부 심볼(`memo`) 관련 런타임 TypeError
- 증상: 배포된 사이트에서 콘솔에 다음과 같은 에러가 발생:
	- `Uncaught TypeError: Cannot read properties of undefined (reading 'memo')`
	- 에러 스택이 vendor-*.js 내에서 발생하며, 구형 vendor 청크 파일명 참조
- 근본 원인:
	- Vite의 `manualChunks`가 React/ReactDOM을 과도하게 분리하여 모듈 초기화 순서 문제 발생
	- React 내부 심볼이 정의되기 전에 다른 청크에서 참조하여 `undefined` 에러
	- 브라우저 캐시가 구버전 `index.html`을 유지하여 존재하지 않는 청크 요청
- 최종 해결책 (현재 적용됨):
	- **전략적 청크 분리**: React 생태계를 논리적으로 그룹화
		- `vendor.react`: React + ReactDOM (코어, 함께 유지 필수)
		- `vendor.router`: react-router-dom (별도 변경 주기)
		- `vendor.marked`: marked (마크다운 파서, 독립적)
		- `vendor.monaco`: Monaco Editor (대용량, 특정 페이지만 사용)
		- `vendor.misc`: 기타 의존성
	- **장점**: 
		- React 코어 무결성 유지 (react + react-dom 동일 청크)
		- 캐시 효율성 (각 라이브러리 독립적 업데이트)
		- 병렬 다운로드 최적화
- 검증:
	- 빌드: `npm run check` 후 `dist/assets/vendor.react-*.js` 생성 확인
	- 배포: `curl https://pargame.github.io/MyBlog/index.html` 로 최신 청크명 확인
	- 런타임: 브라우저 콘솔에서 `memo` 에러 없음 확인
- 관련 파일: `vite.config.ts` (manualChunks 최적화)
- 참고: `OPTIMIZATION.md`에 번들 전략 상세 문서화


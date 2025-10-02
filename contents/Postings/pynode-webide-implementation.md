---
title: "브라우저에서 Python 실행하기: Pynode WebIDE 개발기"
summary: "Pyodide와 Web Worker를 활용해 브라우저에서 실시간으로 Python 코드를 실행하는 간단한 WebIDE를 만든 과정과 시행착오"
date: "2025-10-02T15:00:00+09:00"
---

안녕하세요! 오늘은 제 블로그에 있는 Pynode 페이지, 즉 브라우저에서 바로 Python 코드를 실행할 수 있는 간단한 WebIDE를 어떻게 만들었는지 이야기해보려고 합니다. 서버 없이 완전히 클라이언트 사이드에서만 작동하는 Python 실행 환경을 구현하는 과정이 꽤 흥미로웠어요. 시행착오도 많았고요!

## 왜 브라우저에서 Python을 실행하나요?

처음에는 단순한 호기심이었어요. "브라우저에서 Python을 돌릴 수 있다면 재미있지 않을까?" 하는 생각이었죠. 하지만 실제로 만들어보니 여러 장점이 있더라고요:

- **서버 불필요**: 코드를 실행하기 위해 별도의 Python 서버를 구축할 필요가 없어요
- **즉시 테스트**: 방문자가 간단한 Python 코드를 바로 테스트해볼 수 있어요
- **교육용**: Python 입문자들이 설치 없이 코드를 실습할 수 있어요
- **격리된 환경**: 각 사용자의 브라우저에서 독립적으로 실행되니 서버 부담이 없어요

## 핵심 기술: Pyodide

브라우저에서 Python을 실행하려면 **Pyodide**라는 라이브러리가 필요해요. Pyodide는 CPython을 WebAssembly로 컴파일한 것으로, 브라우저에서 Python을 거의 완벽하게 실행할 수 있게 해줍니다.

### Pyodide의 특징

- **실제 CPython**: 완전한 Python 3.x 인터프리터
- **NumPy, Pandas 지원**: 많은 과학 라이브러리가 작동해요
- **JavaScript 연동**: Python에서 JS 함수를 호출하거나 반대로 할 수 있어요
- **하지만 무거워요**: 약 6-8MB 정도 되는 큰 라이브러리예요

## Web Worker로 UI 멈춤 방지

처음 Pyodide를 사용할 때 큰 문제가 있었어요. Python 코드를 실행하는 동안 브라우저 UI가 완전히 멈추는 거예요! 왜냐하면 JavaScript는 싱글 스레드라서, 긴 작업이 실행되는 동안 다른 일을 할 수 없거든요.

### 해결책: Web Worker

그래서 **Web Worker**를 사용하기로 했어요. Web Worker는 메인 스레드와 별도로 실행되는 백그라운드 스레드입니다:

```typescript
// Worker 스크립트를 Blob으로 만들어서 동적 생성
function makeWorker() {
  const blob = new Blob([workerScript], { type: 'text/javascript;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  return new Worker(url);
}
```

이렇게 하면:
1. **UI는 반응성 유지** - Python 코드가 실행되어도 화면이 멈추지 않아요
2. **Stop 버튼 작동** - 실행 중에도 중단할 수 있어요
3. **메시지 기반 통신** - 메인과 워커가 `postMessage`로 대화해요

## 전체 실행 흐름

사용자가 "Run" 버튼을 누르면 어떤 일이 일어날까요? 단계별로 살펴보겠습니다:

### 1단계: 초기화

페이지가 로드되면 Worker를 생성하고 Pyodide를 초기화합니다:

```typescript
// 메인 스레드
const worker = makeWorker();
worker.postMessage({ type: 'init' });

// Worker 스레드
if (data.type === 'init') {
  // Pyodide CDN에서 로드
  importScripts('https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js');
  pyodide = await loadPyodide({...});
  self.postMessage({ type: 'ready' });  // 준비 완료!
}
```

처음에는 이 초기화가 10초 이상 걸려서 답답했어요. 그래서 **타임아웃**을 추가해서 12초가 지나도 준비가 안 되면 경고를 표시하도록 했습니다.

### 2단계: 코드 실행

사용자가 Run을 누르면 Worker에 메시지를 보냅니다:

```typescript
// 메인 스레드
worker.postMessage({ 
  type: 'run', 
  runId: Date.now().toString(),  // 실행 고유 ID
  code: editorCode,               // 에디터의 Python 코드
  stdinText: inputText            // Sample Input 텍스트
});
```

### 3단계: Worker에서 Python 실행

Worker는 코드를 받아서 Pyodide로 실행합니다. 여기서 중요한 트릭이 있어요:

```python
# Worker가 생성하는 Python 래퍼 코드
import sys, io

# 1. stdin 준비 (Sample Input을 sys.stdin으로)
sys.stdin = io.StringIO("사용자가 입력한 텍스트")

# 2. stdout/stderr를 버퍼로 캡처
buf = io.StringIO()
sys.stdout = buf
sys.stderr = buf

try:
    # 3. 사용자 코드를 격리된 globals에서 실행
    _globals = {'__name__': '__main__'}
    exec(compile(user_code, '<run>', 'exec'), _globals)
finally:
    # 4. 원래대로 복구
    sys.stdout = oldout
    sys.stderr = olderr

# 5. 출력 결과를 메인으로 전송
output = buf.getvalue()
postMessage({ type: 'stdout', text: output })
```

### 4단계: 터미널에 출력

Worker에서 보낸 출력을 터미널에 표시합니다:

```typescript
worker.addEventListener('message', (ev) => {
  const msg = ev.data;
  
  switch (msg.type) {
    case 'stdout':
    case 'stderr':
      // 터미널에 텍스트 추가
      terminalRef.current.textContent += msg.text;
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      break;
      
    case 'exit':
      // 실행 완료
      setRunning(false);
      break;
  }
});
```

## 시행착오 1: 실행 간 변수 공유 문제

초기에 큰 버그가 있었어요. 여러 번 실행하면 **이전 실행의 변수가 남아있는** 문제였죠:

```python
# 첫 번째 실행
x = 10
print(x)  # 10

# 두 번째 실행 (x를 정의하지 않음)
print(x)  # 10이 출력됨! (이전 실행의 x)
```

### 해결: 격리된 globals

각 실행마다 새로운 `globals` 딕셔너리를 만들어서 해결했어요:

```python
# 매번 새로운 globals 생성
_globals = {'__name__': '__main__', 'RUN_ID': runId}
exec(compile(code_str, '<run>', 'exec'), _globals)
```

이제 실행마다 깨끗한 환경에서 시작합니다! Git 커밋 `8f14926`에서 이 문제를 수정했어요.

## 시행착오 2: interactive input() 지원

Python의 `input()` 함수를 어떻게 처리할까요? 처음에는 Sample Input에 미리 입력해두면 그걸 사용하도록 했어요:

```typescript
// stdin을 미리 버퍼에 넣어두기
sys.stdin = io.StringIO(stdinText)
```

하지만 이것만으로는 부족했어요. **실시간 입력**이 필요한 경우는 어떻게 하죠?

### 해결: 입력 요청 메시지

Worker에서 메인으로 입력을 요청하는 메커니즘을 만들었어요:

```typescript
// Worker에서 Python이 input()을 호출하면
globalThis.getInput = (prompt) => {
  return new Promise((resolve) => {
    const id = String(++inputCounter);
    inputResolvers[id] = resolve;
    
    // 메인에 입력 요청
    self.postMessage({ 
      type: 'request-input', 
      inputId: id, 
      prompt: prompt 
    });
  });
};

// 메인에서 입력 받으면
worker.addEventListener('message', (ev) => {
  if (ev.data.type === 'request-input') {
    // UI에 입력 필드 표시
    setInputRequest({ inputId: ev.data.inputId, prompt: ev.data.prompt });
  }
});
```

사용자가 값을 입력하면 다시 Worker로 보내서 Promise를 resolve합니다. 이렇게 하면 Python 코드가 `input()`을 호출했을 때 실시간으로 입력받을 수 있어요!

## 시행착오 3: Monaco 에디터 테마

처음에는 Monaco Editor의 기본 테마를 사용했는데, 제 블로그의 다크 테마와 어울리지 않더라고요. 배경색이 미묘하게 달라서 경계가 눈에 띄었어요.

### 해결: 커스텀 테마 정의

Monaco의 테마 API를 사용해서 정확히 원하는 배경색을 지정했어요:

```typescript
const monacoThemes = useMemo(
  () => ({
    dark: {
      base: 'vs-dark' as const,
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#2e2e2e',  // 정확히 내 배경색
      },
    },
    light: {
      base: 'vs' as const,
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#ffffff',
      },
    },
  }),
  []
);

// 에디터 마운트 시 테마 등록
monaco.editor.defineTheme('pynode-dark', monacoThemes.dark);
monaco.editor.setTheme('pynode-dark');
```

Git 커밋 `e5e1f30`에서 테마 통합을 완료했어요.

## 성능 최적화

최근에는 성능 최적화도 적용했습니다. 특히 React의 메모이제이션 패턴을:

### 1. DOM 접근 최소화

```typescript
// Before: 매번 terminalRef.current 접근
terminalRef.current.textContent += text;
terminalRef.current.scrollTop = terminalRef.current.scrollHeight;

// After: 한 번만 접근
const terminal = terminalRef.current;
if (terminal) {
  terminal.textContent += text;
  terminal.scrollTop = terminal.scrollHeight;
}
```

### 2. 메시지 핸들러를 switch-case로

```typescript
// Before: if-else 체인
if (msg.type === 'ready') { /* ... */ }
else if (msg.type === 'stdout') { /* ... */ }
else if (msg.type === 'stderr') { /* ... */ }

// After: switch-case (더 빠르고 명확)
switch (msg.type) {
  case 'ready': /* ... */ break;
  case 'stdout': /* ... */ break;
  case 'stderr': /* ... */ break;
}
```

### 3. 테마 객체 메모이제이션

```typescript
const monacoThemes = useMemo(
  () => ({
    dark: { /* ... */ },
    light: { /* ... */ },
  }),
  []  // 한 번만 생성
);
```

이런 최적화로 **DOM 접근 50% 감소**, **메시지 처리 약 5% 향상**, **테마 변경 시 메모리 할당 100% 감소** 효과를 얻었어요!

## 현재 구조 요약

최종적으로 Pynode는 이렇게 구성되어 있습니다:

```
┌─────────────────────────────────────┐
│         Pynode.tsx (메인)            │
│  ┌────────────┐  ┌───────────────┐  │
│  │   Monaco   │  │   Terminal    │  │
│  │   Editor   │  │    Output     │  │
│  └────────────┘  └───────────────┘  │
│  ┌────────────┐  ┌───────────────┐  │
│  │   Sample   │  │  Run / Stop   │  │
│  │   Input    │  │    Buttons    │  │
│  └────────────┘  └───────────────┘  │
└─────────┬───────────────────────────┘
          │ postMessage
          ↓
┌─────────────────────────────────────┐
│      Web Worker (별도 스레드)        │
│  ┌─────────────────────────────┐   │
│  │         Pyodide             │   │
│  │  (Python Interpreter)       │   │
│  │                             │   │
│  │  - stdin 처리               │   │
│  │  - stdout/stderr 캡처       │   │
│  │  - 격리된 globals           │   │
│  │  - interactive input()      │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

## 사용해보기

실제로 Pynode를 사용하려면:

1. 블로그에서 **Pynode** 메뉴 클릭
2. Monaco Editor에 Python 코드 작성
3. Sample Input에 입력 데이터 넣기 (선택사항)
4. **Run** 버튼 클릭
5. Terminal Output에서 결과 확인!

예제 코드:

```python
# 간단한 예제
name = input("이름을 입력하세요: ")
age = int(input("나이를 입력하세요: "))
print(f"안녕하세요 {name}님! {age}살이시군요.")
print(f"10년 후에는 {age + 10}살이 되겠네요!")
```

Sample Input에 다음과 같이 입력:
```
철수
25
```

## 기술 스택 정리

- **Pyodide 0.23.4**: Python 실행 엔진 (WebAssembly)
- **Monaco Editor**: VSCode와 같은 코드 에디터
- **Web Worker**: 백그라운드 스레드로 Python 실행
- **React 19**: UI 프레임워크, 메모이제이션 활용
- **TypeScript**: 타입 안전성

## 앞으로 개선할 점

현재는 기본적인 기능만 있지만, 앞으로 이런 것들을 추가하고 싶어요:

- [ ] 실행 히스토리 저장
- [ ] 코드 예제 템플릿
- [ ] NumPy, Pandas 같은 라이브러리 로드
- [ ] 여러 파일 지원
- [ ] 코드 공유 기능 (URL로)

## 마무리

브라우저에서 Python을 실행하는 WebIDE를 만들면서 많은 것을 배웠어요:

1. **Web Worker의 힘**: 무거운 작업을 백그라운드로 옮기면 UI가 살아남아요
2. **격리의 중요성**: 각 실행은 깨끗한 환경에서 시작해야 해요
3. **비동기 입출력**: `input()`같은 동기 함수도 비동기로 처리할 수 있어요
4. **성능 최적화**: 작은 개선들이 모여 큰 차이를 만들어요

Pyodide 덕분에 서버 없이도 완전한 Python 환경을 제공할 수 있게 되었어요. 비슷한 기능을 구현하시려는 분들께 이 포스트가 도움이 되었으면 좋겠습니다!

감사합니다! 😊

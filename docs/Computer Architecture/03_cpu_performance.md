---
title: "CPU 성능 설계 기법"
---

# CPU 성능 설계 기법

이 문서는 CPU 성능을 개선하기 위한 주요 접근 방식을 요약합니다.

## 병렬성 활용
- 명령어 레벨 병렬성(ILP): 파이프라이닝, 슈퍼스칼라, 멀티어슈어
- 데이터 병렬성: SIMD, 벡터 명령어
- 스레드/코어 병렬성: 멀티코어 설계, SMT(하드웨어 멀티스레딩)

## 지연 숨김 및 예측
- 분기 예측: 정적/동적 예측기 사용으로 분기 해저드 감소
- 투기 실행: 예측 경로를 미리 실행해 대기 시간 감소

## 메모리 계층 최적화
- 캐시 계층 구조와 친화적 메모리 접근 패턴 설계
- 프리페칭(prefetching)으로 대기 시간 완화

## 전력/면적 트레이드오프
- 고성능은 종종 전력과 칩 면적 증가를 동반
- 성능 제약 하에서 에너지 효율(Performance per Watt) 최적화

## 측정과 벤치마크
- 성능 지표: CPI, IPC, throughput, latency
- 실제 워크로드 기반 벤치마크가 설계 검증에 중요

## 추가: 성능 모델과 최적화 예제

### Amdahl의 법칙
- 일부를 가속할 때 전체 성능 향상은 병목이 되는 부분의 비중에 의해 제한됩니다.

Speedup_total = 1 / ((1 - p) + p / speedup_p)

### 실무 최적화 체크리스트
1. 핫스팟 식별 (프로파일링)
2. 데이터 로컬리티 개선
3. 분기/메모리 병목 제거
4. 벡터화 및 병렬화 적용

### 예제: 루프 블로킹으로 캐시 재사용 개선
```c
// naive matrix multiply
for (int i=0;i<N;i++) for (int j=0;j<N;j++) for (int k=0;k<N;k++)
  C[i][j] += A[i][k] * B[k][j];

// blocking
for (int ii=0; ii<N; ii+=B)
 for (int jj=0; jj<N; jj+=B)
  for (int kk=0; kk<N; kk+=B)
    for (int i=ii; i<min(ii+B,N); ++i)
      for (int j=jj; j<min(jj+B,N); ++j)
        for (int k=kk; k<min(kk+B,N); ++k)
          C[i][j] += A[i][k] * B[k][j];
```

---

### 연습 문제
1) Amdahl 법칙: 전체 시간의 40%를 차지하는 부분을 2배 빠르게 하면 전체 속도 향상은?
2) 프리페칭(prefetching)이 항상 성능을 개선하지 않는 경우는 언제인가?

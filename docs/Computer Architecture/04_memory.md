---
title: '메모리
date: '2025-08-18T13:44:57+09:00'
---


# 메모리

  - SRAM: 빠르고 비휘발성 아님(정적), 캐시에 주로 사용
- 메모리 액세스 패턴(연속성, 스트라이드 등)은 성능에 큰 영향

- 엔디안(Endianness)은 다중 바이트 값이 메모리에 저장되는 바이트 순서를 정의
  - 빅 엔디안: 상위 바이트를 낮은 주소에 저장
  - 리틀 엔디안: 하위 바이트를 낮은 주소에 저장

추가 하위 문서:
- [04_memory_ram.md](04_memory_ram.md)
- [04_memory_cache.md](04_memory_cache.md)
- [04_memory_virtual.md](04_memory_virtual.md)
- 목적: CPU와 메인 메모리 간의 속도 차이를 완화
- 구성 요소: 라인(line), 세트(associativity), 태그, 오프셋
- 매핑 정책: 직접 사상(direct-mapped), 연관 사상(fully/associative), 집합 연관(set-associative)
- 교체 정책: LRU, FIFO, Random 등
- 쓰기 정책: write-through vs write-back
- 캐시 효율 최적화: 지역성(시간적/공간적), 적절한 라인 크기 및 연관성 조정

캐시는 실제 애플리케이션 성능에 가장 큰 영향을 미치는 요소 중 하나입니다.

---

### 추가 읽을거리 (하위 문서)

- [RAM 상세](04_memory_ram.md)
- [엔디안(Endianness) 비교](04_memory_endianness.md)
- [캐시 심화](04_memory_cache.md)

각 문서는 메모리 계층의 특정 영역을 깊게 다루며, 예제와 성능 고려사항을 포함합니다.

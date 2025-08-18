---
title: "컴퓨터 구조 지도 그리기"
---

# 컴퓨터 구조 지도 그리기

이 페이지는 아카이브의 내용을 시각적으로 정리하는 방법을 설명하고, 학습과 문서화를 위해 유용한 다이어그램 유형(architecture sketch, memory-hierarchy map, data/control-flow diagram)을 권장합니다.

섹션
- 지도를 그리는 이유: 학습 및 문서화의 이점
- 권장 다이어그램 유형: architecture sketch, cache/memory hierarchy, I/O map
- 예시: 간단한 ASCII, SVG 권장 방식
- 도구: draw.io, Inkscape, Mermaid, 간단한 ASCII 템플릿

간단한 ASCII 예시:
```
[CPU] -- L1 -- L2 -- DRAM
  |                    |
  +-----> Storage <----+
```

팁: `graph.html`과 `graph.json`을 사용해 문서 간 링크를 자동으로 시각화하고, 생성한 SVG를 문서에 삽입하세요.

관련: 아카이브 전반에 걸친 일관된 지도를 위해 핸드북의 명명 규칙 및 다이어그램 가이드를 참조하세요.

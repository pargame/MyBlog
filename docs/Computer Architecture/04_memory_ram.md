---
title: "Memory ram"
---

# RAM (DRAM vs SRAM)

이 문서는 RAM의 종류와 내부 동작, 성능 특성 및 설계 고려사항을 다룹니다.

## DRAM (Dynamic RAM)
- 구조: 각 비트는 커패시터와 트랜지스터로 구성된 셀에 저장
- 특성: 고밀도, 저비용/비휘발성 아님, 주기적 리프레시 필요
- 액세스 패턴: 페이지(행)와 열 단위로 동작 — row buffer 히트/미스가 성능에 큰 영향
- 성능 고려사항: CAS/ RAS 타이밍, 채널/뱅크 병렬성, 페이지 폴리시

## SRAM (Static RAM)
- 구조: 플립플롭 기반(6-transistor 등)
- 특성: 매우 빠름, 휘발성, 면적·전력 대비 비싸서 캐시용으로 사용
- 용도: L1/L2 캐시 및 레지스터 파일 근처의 고성능 버퍼

## 메모리 서브시스템 설계 포인트
- 채널 수와 뱅크 분산: 동시 병렬 접근을 늘려 대역폭 확보
- 페이지 정책: 오픈 페이지 vs 클로즈드 페이지 정책 선택
- 메모리 인터리빙(interleaving)으로 연속적인 주소의 병렬 액세스 개선

## 디버깅 및 계측
- 메모리 대기 시간(latency)과 대역폭(bandwidth) 측정
- row buffer 히트/미스 비율, 페이지 열기 비용 분석

---

### DRAM 타이밍 (단순화)
```
ACTIVATE (open row)  -- tRCD --> READ/WRITE -- tCL --> DATA
				 \                         /
				  -- tRAS (row active time) --
```

tRCD, tCL, tRAS를 이해하면 row-buffer 히트가 미스보다 훨씬 빠른 이유를 설명할 수 있습니다.


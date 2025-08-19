---
title: '가상 메모리와 MMU
date: '2025-08-18T13:44:57+09:00'
---



# 가상 메모리와 MMU

이 문서는 가상 메모리, 페이지 테이블, TLB, 페이지 폴트와 관련된 동작을 정리합니다.

이 문서는 가상 메모리의 핵심 개념과 구현 요소를 정리합니다. 아래 섹션들은 실제 운영체제/하드웨어 수준에서 자주 다루는 내용입니다.

## 개념: 가상 주소와 물리 주소
- 가상 메모리(Virtual Memory): 각 프로세스에 독립된 주소 공간을 제공해 프로세스 간 메모리 보호와 간편한 메모리 할당을 가능하게 함.
- 물리 메모리(Physical Memory): 실제 DRAM 주소. MMU(Memory Management Unit)가 가상 주소를 물리 주소로 변환.

## 페이지와 페이지 테이블
- 페이지(Page): 메모리 관리의 기본 단위(일반적으로 4KB, 큰 페이지는 2MB/1GB 등).
- 페이지 테이블(Page Table): 가상 페이지 번호(VPN) -> 물리 프레임 번호(PFN) 매핑을 저장. 다단계 페이지테이블(multilevel page table)로 메모리 오버헤드를 줄임.

예: 단순한 32-bit 가상 주소(4KB 페이지)
- 12비트 오프셋, 상위 20비트가 VPN. 페이지테이블 엔트리(PTE)에는 PFN, 접근 권한, present 비트, dirty/ accessed 플래그 등이 포함.

## 주소 변환 예시
1. CPU가 가상 주소 V를 생성
2. MMU가 V의 VPN을 추출하고 TLB(Translation Lookaside Buffer)에서 조회
3. TLB 미스면 메모리의 페이지테이블을 읽어 PTE를 확인
4. PTE가 present이면 PFN을 얻어 물리 주소 = PFN || offset
5. PTE가 not-present이면 페이지 폴트 발생 -> OS가 페이지를 로드 후 PTE 갱신

### 간단한 의사코드: 주소 변환
```c
// pseudo: translate virtual address to physical
phys_addr translate(uint32_t vaddr) {
	vpn = vaddr >> 12;
	off = vaddr & 0xFFF;
	if (TLB.contains(vpn)) return (TLB.lookup(vpn) << 12) | off;
	pte = walk_page_table(vpn); // multi-level walk
	if (!pte.present) raise_page_fault(vaddr);
	TLB.insert(vpn, pte.pfn);
	return (pte.pfn << 12) | off;
}
```

## TLB와 성능
- TLB: 자주 접근되는 VPN->PFN 매핑을 캐시해 페이지테이블 워크를 피함. TLB 히트율이 메모리 접근 지연에 큰 영향을 줌.
- 컨텍스트 스위치 시 프로세스별 주소 공간 때문에 TLB 무효화 비용이 존재(ASID/PCID로 완화).

## 페이지 폴트 처리
- 페이지 폴트 발생 시 OS가 수행하는 기본 단계:
	1) 현재 프로세스의 상태 저장
	2) 페이지테이블 엔트리 확인(권한 오류인지, 단순 미스인지)
	3) 페이지가 디스크(또는 swap)에 있으면 읽어와 프레임 할당
	4) PTE 업데이트, TLB 플러시 또는 갱신
	5) 사용자 프로세스 재시작

## 가상 메모리 보호와 권한
- PTE에 읽기/쓰기/실행 비트로 메모리 접근 통제. NX 비트(Non-eXecutable)는 코드 실행 방지에 사용.

## 실습 예제 아이디어
- 간단한 시뮬레이터로 페이지테이블 다단계 워크와 TLB 동작을 구현해보고, 다양한 페이지 크기와 TLB 구성을 비교해 보세요.

## 참고: 최적화 및 확장
- 큰 페이지(huge pages)는 TLB 압력을 줄여 성능을 개선하지만 메모리 단편화를 늘릴 수 있음.
- 하드웨어 페이지 테이블 워크(예: ARM LPAE, x86 PAE)는 설계에 따라 다름.

---

### 연습 문제
1) 32-bit 주소, 4KB 페이지, 2-level 페이지테이블(각 레벨 10비트 인덱스)에서 가상주소를 분해하는 방법을 설명하세요.
2) TLB 히트율이 95%이고 메모리 접근이 100ns, TLB 접근이 1ns일 때 평균 접근 시간을 계산하세요.


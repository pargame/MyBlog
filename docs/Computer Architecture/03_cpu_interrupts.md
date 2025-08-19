---
title: '인터럽트와 예외 처리 (Interrupts & Exceptions)
date: '2025-08-18T13:44:57+09:00'
---



# 인터럽트와 예외 처리 (Interrupts & Exceptions)

인터럽트는 하드웨어 또는 소프트웨어 이벤트로 인해 현재 실행 중인 흐름을 일시 중단하고 처리 루틴으로 분기하게 하는 메커니즘입니다.

## 분류
- 동기적 예외(Exception): 현재 명령 실행 중 발생(예: 나눗셈 0 예외, 페이지 폴트)
- 비동기적 인터럽트(Interrupt): 외부 장치나 타이머로부터 발생

## 처리 과정
1. 현재 컨텍스트(레지스터, PC 등) 저장
2. 인터럽트 벡터에서 서비스 루틴 주소 확인
3. 서비스 루틴 수행
4. 컨텍스트 복원 후 원래 흐름 복귀

## 설계 고려사항
- 우선순위와 마스킹: 중첩 인터럽트와 우선순위 정책 설계
- 컨텍스트 스위칭 비용 최소화: 빠른 ISR(Interrupt Service Routine) 구현 권장
- 일관성: 멀티코어 시스템에서의 인터럽트 라우팅과 처리 일관성 유지

## 예시
- I/O 완료 인터럽트: DMA가 전송을 완료하면 CPU에 알림을 보냄
- 타이머 인터럽트: 주기적 작업 스케줄링

---

### ISR skeleton (pseudo)
```c
void irq_handler() {
	// 1. mask or prioritize
	disable_interrupts();
	// 2. save volatile registers / PC
	push_registers();
	// 3. handle the event
	if (device_ready()) process_io();
	// 4. restore state
	pop_registers();
	enable_interrupts();
	return_from_interrupt();
}
```

### Context switch diagram (simplified)
```
	[User code] --interrupt--> [Save PC/Regs] --> [ISR executes] --> [Restore PC/Regs] --> [Resume User]
```

## 추가: 인터럽트 설계 고려사항
- 우선순위와 마스킹: 실시간 요구사항이 있는 장치는 높은 우선순위를 부여
- 락과 인터럽트: 인터럽트 중 잠금 동작은 교착 상태를 유발할 수 있으므로 주의

### 연습 문제
1) 폴링과 인터럽트 중 어느 쪽이 저전력 환경에서 유리한가? 이유를 설명하라.

---
title: 'FTimerManager'
date: '2025-08-17T16:17:41+09:00'
---
> **월드 내에서 지연되거나 주기적으로 실행되는 '타이머'를 관리하는 시스템입니다.** "3초 후에 이 함수를 실행해줘" 또는 "0.1초마다 이 함수를 계속 호출해줘"와 같은 시간 기반의 로직을 구현하는 데 사용됩니다.

### **1. 주요 역할 및 책임**
> **새로운 타이머를 설정하고, 설정된 시간이 되면 지정된 함수나 [[Event]]를 호출합니다.**
* **타이머 생성 및 관리 (Timer Creation and Management)**:
	새로운 타이머를 설정하고, 설정된 시간이 되면 지정된 함수나 [[Event]]를 호출합니다.
* **주기적인 실행 (Periodic Execution)**:
	루핑(Looping) 옵션을 통해 함수를 일정한 간격으로 반복해서 호출할 수 있습니다.
* **타이머 제어 (Timer Control)**:
	이미 실행 중인 타이머를 일시정지(`PauseTimer`), 재개(`UnPauseTimer`), 또는 완전히 중지(`ClearTimer`)할 수 있습니다.
* **컨텍스트 기반 생명주기 (Context-Based Lifecycle)**:
	`FTimerManager`는 [[UWorld]]에 종속되어 있으므로, 레벨이 전환되면 해당 월드의 모든 타이머는 자동으로 소멸됩니다.

### **2. 핵심 함수**
> **가장 핵심적인 함수로, 새로운 타이머를 설정합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`SetTimer(FTimerHandle& InOutHandle, ...)`**:
	가장 핵심적인 함수로, 새로운 타이머를 설정합니다. 다양한 오버로드가 존재하며, 주로 다음 인자들을 받습니다.
    *   `InOutHandle`:
	타이머를 제어하기 위한 핸들입니다.
    *   `InRate`:
	타이머가 실행될 간격(초)입니다.
    *   `InbLoop`:
	타이머를 반복할지 여부입니다.
    *   `InFirstDelay`:
	첫 실행 전의 추가적인 지연 시간입니다.
    *   함수 포인터, 델리게이트, 또는 람다:
	시간이 되었을 때 호출될 함수를 지정합니다.
* **`ClearTimer(FTimerHandle& InHandle)`**:
	지정된 핸들에 해당하는 타이머를 제거합니다.
* **`PauseTimer(FTimerHandle& InHandle)`**:
	타이머를 일시정지합니다. 남은 시간은 보존됩니다.
* **`GetTimerRemaining(FTimerHandle& InHandle)`**:
	타이머가 다음 실행까지 남은 시간을 반환합니다.

### **3. 사용 방법**
> **`FTimerManager`는 [[AActor]]나 [[UWorld]] 등에서 `GetWorld()->GetTimerManager()`를 통해 접근할 수 있습니다. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
`FTimerManager`는 [[AActor]]나 [[UWorld]] 등에서 `GetWorld()->GetTimerManager()`를 통해 접근할 수 있습니다.
```cpp
// .h
FTimerHandle MyTimerHandle;

// .cpp
void AMyActor::BeginPlay()
{
    Super::BeginPlay();
    GetWorld()->GetTimerManager().SetTimer(MyTimerHandle, this, &AMyActor::MyFunction, 5.0f, false);
}

void AMyActor::MyFunction()
{
    // 5초 후에 이 코드가 실행됩니다.
}
```
블루프린트에서는 `Set Timer by Event`, `Set Timer by Function Name` 노드를 사용하여 동일한 기능을 구현할 수 있습니다.

### **4. 관련 클래스**
> **각 타이머를 고유하게 식별하고 제어하기 위한 핸들 구조체입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **`FTimerHandle`**:
	각 타이머를 고유하게 식별하고 제어하기 위한 핸들 구조체입니다.
* **[[UWorld]]**:
	`FTimerManager`를 소유하고 접근 경로를 제공합니다.
* **[[FTimerDelegate]]**:
	타이머가 만료되었을 때 호출될 함수를 바인딩하는 데 사용되는 델리게이트입니다.

## 코드 예시
> **// 루프 타이머를 설정하고 액터 종료 시 정리하는 예시 #include "TimerManager.h"**
```cpp
// 루프 타이머를 설정하고 액터 종료 시 정리하는 예시
#include "TimerManager.h"

FTimerHandle LoopHandle;

void AMyActor::BeginPlay()
{
    Super::BeginPlay();
    GetWorld()->GetTimerManager().SetTimer(LoopHandle, this, &AMyActor::TickEverySecond, 1.0f, true, 0.0f);
}

void AMyActor::TickEverySecond()
{
    // 매 초 호출되는 로직
}

void AMyActor::EndPlay(const EEndPlayReason::Type EndPlayReason)
{
    Super::EndPlay(EndPlayReason);
    GetWorld()->GetTimerManager().ClearTimer(LoopHandle);
}
```

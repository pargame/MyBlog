---
title: 'Delegate'
date: '2025-08-17T16:17:41+09:00'
---
> **C++의 함수 포인터(Function Pointer)를 객체 지향적으로, 그리고 더욱 안전하고 유연하게 사용할 수 있도록 언리얼 엔진이 재구성한 '함수 대리자'입니다.** 특정 함수의 주소를 변수처럼 저장하고, 원할 때 그 함수를 대신 호출하는 역할을 합니다. 언리얼 엔진의 강력한 [[Event]] 시스템은 바로 이 `Delegate` 기술을 기반으로 구현됩니다.

### **1. 주요 역할 및 책임**
> **`Delegate`를 사용하는 객체(Invoker)는 어떤 함수가 호출될지 미리 알 필요가 없습니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **느슨한 결합 (Loose Coupling)**:
	`Delegate`를 사용하는 객체(Invoker)는 어떤 함수가 호출될지 미리 알 필요가 없습니다. 그저 특정 `Delegate`를 호출하기만 하면, 해당 `Delegate`에 등록(Bind)된 모든 함수가 실행됩니다. 이를 통해 각 시스템을 독립적으로 개발하고 유지보수할 수 있습니다.
* **동적 함수 호출 (Dynamic Function Calls)**:
	런타임에 호출할 함수를 동적으로 변경하거나 추가/제거할 수 있습니다. 이는 상황에 따라 다른 로직을 실행해야 하는 경우에 매우 유용합니다.
* **다대다 통신 (Many-to-Many Communication)**:
	하나의 `Delegate`에 여러 개의 함수를 연결(멀티캐스트)하여 한 번의 호출로 여러 객체에 동시에 알림을 보낼 수 있습니다.
* **블루프린트 연동 (Blueprint Integration)**:
	C++ 코드에서 선언한 `Delegate`를 블루프린트에 노출시켜, 블루프린트에서 커스텀 로직을 연결하고 실행할 수 있도록 지원합니다.

### **2. 델리게이트의 종류**
> **가장 기본적인 `Delegate`. 실무 팁: 변경 시 성능·안정성·호환성을 먼저 검토하세요.**
* **`DECLARE_DELEGATE`**:
	가장 기본적인 `Delegate`. 단 하나의 함수만 바인딩할 수 있습니다.
* **`DECLARE_MULTICAST_DELEGATE`**:
	여러 개의 함수를 바인딩할 수 있는 멀티캐스트 `Delegate`입니다. C++ 코드 내에서 다수의 리스너에게 동시에 알림을 보낼 때 주로 사용됩니다.
* **`DECLARE_DYNAMIC_DELEGATE`**:
	블루프린트에서 접근하고, 직렬화(저장)가 가능한 동적 `Delegate`입니다. `BlueprintAssignable` [[Event]]는 반드시 이 타입 또는 동적 멀티캐스트 타입이어야 합니다.
* **`DECLARE_DYNAMIC_MULTICAST_DELEGATE`**:
	동적 멀티캐스트 `Delegate`입니다. 블루프린트에 노출되어 여러 개의 블루프린트 노드를 연결할 수 있는 [[Event]]의 대부분이 이 형태로 선언됩니다.

### **3. 사용 흐름**
> **1.**
1.  **선언 (Declaration)**:
	`.h` 헤더 파일에서 매크로를 사용하여 `Delegate` 타입을 선언합니다.
    `DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnHealthChanged);`
2.  **인스턴스 생성 (Instantiation)**:
	클래스 내부에 선언한 `Delegate` 타입의 인스턴스를 `UPROPERTY`와 함께 선언합니다. 블루프린트에 노출하려면 `BlueprintAssignable` 지정자를 추가합니다.
    `UPROPERTY(BlueprintAssignable) FOnHealthChanged OnHealthChanged;`
3.  **바인딩 (Binding)**:
	`Delegate`를 사용할 객체(Listener)에서, 호출될 자신의 함수를 추가(`Add`)하거나 등록(`Bind`)합니다.
    `HealthComponent->OnHealthChanged.AddDynamic(this, &AMyHUD::UpdateHealthBar);`
4.  **실행 (Execution)**:
	`Delegate`를 소유한 객체(Invoker)에서, 특정 조건이 만족되었을 때 `Broadcast()` 또는 `Execute()` 함수를 호출하여 바인딩된 함수들을 실행합니다.
    `OnHealthChanged.Broadcast();`

### **4. 주요 사용 사례**
> **[[UButton]]의 `OnClicked` [[Event]]는 `DECLARE_DYNAMIC_MULTICAST_DELEGATE`로 선언된 `Delegate`이며, 버튼 클릭 시 `Broadcast()`를 호출합니다.**
* **UI 이벤트 처리**:
	[[UButton]]의 `OnClicked` [[Event]]는 `DECLARE_DYNAMIC_MULTICAST_DELEGATE`로 선언된 `Delegate`이며, 버튼 클릭 시 `Broadcast()`를 호출합니다.
* **충돌 이벤트**:
	[[UPrimitiveComponent]]의 `OnComponentBeginOverlap` 역시 동적 멀티캐스트 `Delegate`로, 다른 액터와 겹쳤을 때 연결된 모든 함수를 실행시킵니다.
* **비동기 작업 콜백**:
	파일 로딩이나 HTTP 요청과 같은 비동기 작업이 완료되었을 때, 그 결과를 처리할 함수를 `Delegate`로 전달하여 콜백으로 사용합니다.
* **타이머**:
	[[FTimerManager]]의 `SetTimer` 함수는 지정된 시간이 지난 후 호출될 함수를 `Delegate`([[FTimerDelegate]])로 받습니다.

## 관련 클래스
> **관련 클래스 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* [[Event]]:
	델리게이트로 구현되는 신호/응답 시스템.
* [[UButton]] / [[UInputComponent]]:
	UI/입력 이벤트 발신.
* [[UPrimitiveComponent]] / [[AActor]]:
	충돌 등 게임플레이 이벤트 발신.
* [[FTimerManager]] / [[FTimerDelegate]]:
	시간 기반 콜백 실행.

## 코드 예시
> **// 동적 멀티캐스트 델리게이트 선언/바인딩/브로드캐스트 예시 DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnSomething);**
```cpp
// 동적 멀티캐스트 델리게이트 선언/바인딩/브로드캐스트 예시
DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnSomething);

UCLASS()
class AMyActor : public AActor
{
    GENERATED_BODY()
public:
    UPROPERTY(BlueprintAssignable)
    FOnSomething OnSomething;
};

// 바인딩
MyActor->OnSomething.AddDynamic(this, &AMyObject::HandleSomething);

// 실행
MyActor->OnSomething.Broadcast();
```
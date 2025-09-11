---
title: 'Event'
date: '2025-08-17T16:17:41+09:00'
---
> **특정 사건이 발생했음을 다른 객체에게 알리고, 그 사건에 관심 있는 객체들이 자신만의 반응(함수)을 실행하도록 하는 '신호 및 응답' 시스템입니다.** 이는 언리얼 엔진의 강력한 [[Delegate]] 기능을 기반으로 구현되며, 객체 간의 결합도를 낮추는 핵심적인 설계 패턴입니다.

### **1. 주요 역할 및 책임**
> **`Event`를 발생시키는 객체(Broadcaster)는 누가 `Event`를 받아서 처리하는지(Listener) 전혀 알 필요가 없습니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **결합도 감소 (Decoupling)**:
	`Event`를 발생시키는 객체(Broadcaster)는 누가 `Event`를 받아서 처리하는지(Listener) 전혀 알 필요가 없습니다. 그저 "플레이어가 죽었다!"와 같은 신호를 보내기만 하면, 그 신호에 관심 있도록 등록된 'UI 처리기', '점수 계산기', '사운드 재생기' 등이 각자 알아서 반응합니다. 이를 통해 각 시스템을 독립적으로 개발하고 수정할 수 있습니다.
* **관심사 분리 (Separation of Concerns)**:
	하나의 사건에 대한 다양한 반응 로직을 한 곳에 뭉쳐놓는 것이 아니라, 각자 관련된 객체에 흩어놓을 수 있습니다. 예를 들어, 캐릭터의 사망 로직은 [[ACharacter]]에, 사망 UI 표시는 [[UUserWidget]]에, 사망 사운드 처리는 `SoundManager`에 각각 구현할 수 있습니다.
* **동적 및 확장 가능한 로직**:
	언제든지 새로운 리스너를 `Event`에 추가하거나 제거할 수 있으므로, 게임의 기능을 동적으로 확장하거나 변경하기 용이합니다.

### **2. 이벤트의 구현: [[Delegate]]**
> **[[Delegate]]를 `UPROPERTY`로 선언하여 `Event`의 "신호 발신 지점"을 만듭니다. 실무 팁: 변경 시 성능·안정성·호환성을 먼저 검토하세요.**
* **이벤트 선언**:
	[[Delegate]]를 `UPROPERTY`로 선언하여 `Event`의 "신호 발신 지점"을 만듭니다. (예: `OnHealthChanged`)
* **리스너 등록**:
	`Event`에 반응하고 싶은 객체들이 자신의 함수를 해당 [[Delegate]]에 바인딩(`Bind`) 또는 추가(`Add`)합니다.
* **이벤트 발생**:
	특정 조건이 충족되었을 때, [[Delegate]]의 `Broadcast()` 또는 `Execute()` 함수를 호출하여 등록된 모든 리스너에게 신호를 보냅니다.

자세한 기술적 구현과 델리게이트의 종류(싱글캐스트, 멀티캐스트, 동적 등)에 대한 정보는 [[Delegate]] 문서를 참고하십시오.

### **3. 주요 예시**
> **액터가 다른 액터와 처음 겹치기 시작했을 때 발생하는 `Event`입니다.**
* **[[AActor]]의 `OnActorBeginOverlap`**:
	액터가 다른 액터와 처음 겹치기 시작했을 때 발생하는 `Event`입니다. 여기에 함수를 바인딩하면 충돌 시작 시 원하는 로직(예: 데미지 주기, 문 열기)을 실행할 수 있습니다.
* **[[UInputComponent]]의 `BindAction`**:
	플레이어의 입력(예: '점프' 버튼 누르기)이 발생했을 때, 특정 함수를 호출하도록 연결하는 것 역시 `Event` 기반 시스템입니다.
* **[[UButton]]의 `OnClicked`**:
	UI 버튼이 클릭되었을 때 발생하는 `Event`입니다. 메뉴 상호작용의 핵심적인 부분입니다.

## 관련 클래스
> **관련 클래스 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* [[Delegate]]:
	이벤트를 구현하는 핵심 기술.
* [[AActor]] / [[UPrimitiveComponent]]:
	충돌 등 다양한 이벤트의 발신자.
* [[UInputComponent]] / [[UButton]]:
	입력/UI 이벤트 발신자.

## 코드 예시
> **// 액터의 Overlap 이벤트에 함수 바인딩 및 해제 예시 void AMyActor::BeginPlay() { Super::BeginPlay(); OnActorBeginOverlap.AddDynamic(this, &AMyActor::HandleBeginOverlap); }**
```cpp
// 액터의 Overlap 이벤트에 함수 바인딩 및 해제 예시
void AMyActor::BeginPlay()
{
    Super::BeginPlay();
    OnActorBeginOverlap.AddDynamic(this, &AMyActor::HandleBeginOverlap);
}

void AMyActor::EndPlay(const EEndPlayReason::Type EndPlayReason)
{
    Super::EndPlay(EndPlayReason);
    OnActorBeginOverlap.RemoveDynamic(this, &AMyActor::HandleBeginOverlap);
}

void AMyActor::HandleBeginOverlap(AActor* OverlappedActor, AActor* OtherActor)
{
    // 필요한 로직 수행
}
```

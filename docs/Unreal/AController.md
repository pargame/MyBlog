---
---

> **[[APawn]]의 의지를 결정하는 원격 조종사입니다.** [[APawn]]이라는 '몸'에 '정신'을 불어넣는 역할을 하며, 플레이어의 입력이든 AI의 논리든, 그 의지에 따라 [[APawn]]을 움직이게 합니다. 몸과 정신이 분리되어 있기에, 같은 [[APawn]]이라도 플레이어가 조종할 수도, AI가 조종할 수도 있습니다.

### **1. 주요 역할 및 책임**
> `AController`는 단순히 [[APawn]]을 움직이는 것을 넘어, [[APawn]]의 상태와 플레이어와의 상호작용 전반을 관리합니다.
* **빙의 (Possession):** 특정 [[APawn]]에 대한 제어권을 획득(`Possess`)하거나 내려놓는(`UnPossess`) 핵심 기능을 수행합니다.
* **제어 로직 분리:** [[APawn]]의 시각적/물리적 표현과 제어 로직을 분리하여, 하나의 [[APawn]]을 플레이어와 AI가 번갈아 제어하는 유연한 구조를 가능하게 합니다.
* **상태/시점 관리:** [[APlayerState]]로 점수·닉네임 등 영속 상태를, [[APlayerCameraManager]]로 카메라 시점을 관리합니다. (주로 [[APlayerController]]에 해당)
* **의지 전달:** 플레이어 입력을 행동으로 변환하거나, AI 의사결정(비헤이비어 트리 등)을 실행하여 [[APawn]]을 제어합니다.
	   
### **2. 핵심 함수 및 속성**
> [[APawn]]을 제어하고 상태를 동기화하기 위한 필수 도구들입니다.
* `Possess(APawn* InPawn)`: 지정된 [[APawn]]에 빙의하여 제어권을 획득합니다. 일반적으로 서버 권한(Authority)에서만 호출합니다.
* `UnPossess()`: 현재 제어 중인 [[APawn]]으로부터 빙의를 해제합니다.
* `GetPawn()`: 현재 제어 중인 [[APawn]] 포인터를 반환합니다. 없으면 `nullptr`.
* `GetCharacter()`: 제어 중인 [[APawn]]이 [[ACharacter]]라면 캐스팅된 포인터를 반환합니다.
* `OnPossess(APawn* InPawn)`: `Possess` 직후 호출되는 [[Event]]. 빙의 시점 초기화를 처리합니다.
* `OnUnPossess()`: `UnPossess` 직후 호출되는 [[Event]]. 리소스 정리 등에 사용합니다.
* `PlayerState`: 컨트롤러에 연결된 [[APlayerState]] 참조. 서버에서 복제되어 각 클라이언트가 다른 플레이어의 상태를 볼 수 있습니다.
* `SetControlRotation(const FRotator& NewRotation)`: 컨트롤러의 시점(카메라 방향)을 설정합니다. 이 값은 [[APawn]]의 회전과 독립적일 수 있습니다.

### **3. 주요 서브클래스**
> 목적에 따라 두 가지 축으로 나뉩니다.
* **[[APlayerController]]:** 인간 플레이어를 위한 컨트롤러. 입력 처리, HUD/UI 표시, 시점 제어를 담당합니다.
* **[[AAIController]]:** 인공지능을 위한 컨트롤러. 비헤이비어 트리/EQS 등으로 상황을 판단해 [[APawn]]을 자율 제어합니다.

### **4. 관련 클래스**
* **[[APawn]] / [[ACharacter]]:** 제어 대상 본체(몸). 캐릭터는 폰의 특수화입니다.
* **[[APlayerState]]:** 점수/닉네임 등 영속 상태를 보관·복제합니다.
* **[[APlayerCameraManager]]:** 카메라 시점과 흔들림 등을 관리합니다.
* **[[Event]]:** `OnPossess`, `OnUnPossess` 등 수명 이벤트 훅.

### **5. 코드 예시**
```cpp
// 컨트롤러가 폰을 스폰해 빙의하고, 빙의 시 초기화를 수행하는 예시
#include "GameFramework/Controller.h"
#include "GameFramework/Pawn.h"

class AMyController : public AController
{
	GENERATED_BODY()

public:
	virtual void BeginPlay() override
	{
		Super::BeginPlay();

		if (HasAuthority() && PawnClassToControl)
		{
			FActorSpawnParameters Params;
			Params.Owner = this;
			APawn* NewPawn = GetWorld()->SpawnActor<APawn>(PawnClassToControl, FVector::ZeroVector, FRotator::ZeroRotator, Params);
			if (NewPawn)
			{
				Possess(NewPawn);
			}
		}
	}

	virtual void OnPossess(APawn* InPawn) override
	{
		Super::OnPossess(InPawn);
		// 카메라가 바라볼 기본 방향 설정 (컨트롤 로테이션은 폰 회전과 독립적일 수 있음)
		SetControlRotation(FRotator(0.f, 90.f, 0.f));
	}

	virtual void OnUnPossess() override
	{
		Super::OnUnPossess();
		// 빙의 해제 후 정리 로직
	}

protected:
	UPROPERTY(EditDefaultsOnly, Category="Controller")
	TSubclassOf<APawn> PawnClassToControl;
};
```
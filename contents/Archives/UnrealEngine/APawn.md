---
title: 'APawn'
date: '2025-08-17T16:17:41+09:00'
---
> **월드에 존재하는 '아바타'이자, [[AController]]의 의지를 받아 움직이는 모든 것의 기본형입니다.** 플레이어가 조종하는 자동차부터 AI가 조종하는 비행선까지, 제어 가능한 모든 액터가 바로 폰입니다.

## 주요 역할 및 책임
> **`APawn`은 단순한 [[AActor]]를 넘어, 제어의 주체가 될 수 있는 특별한 존재입니다.**
`APawn`은 단순한 [[AActor]]를 넘어, 제어의 주체가 될 수 있는 특별한 존재입니다. 컨트롤러와 연결되어 월드와 상호작용하는 핵심적인 다리 역할을 합니다.
* **제어의 대상 (Subject of Control)**:
	[[AController]]에 의해 '빙의(`Possess`)'될 수 있는 가장 기본적인 클래스입니다. `APawn`은 자신을 누가 조종하는지 알 수 있으며, 이를 통해 플레이어의 입력이나 AI의 명령을 받아들입니다.
* **입력 처리 (Input Handling)**:
	컨트롤러로부터 입력을 전달받아 실제 행동으로 변환하는 로직을 담습니다. `SetupPlayerInputComponent` 함수를 통해 "점프"나 "발사" 같은 입력에 특정 함수를 바인딩할 수 있습니다.
* **유연한 표현 (Flexible Representation)**:
	[[ACharacter]]와 달리, `APawn`은 특정 형태나 이동 방식에 얽매이지 않습니다. 개발자는 `APawn`을 기반으로 차량, 포탑, 유령 카메라 등 어떤 형태의 제어 가능한 객체든 자유롭게 만들 수 있습니다.

## 핵심 함수 및 속성
> **`APawn`을 제어하고 외부 입력을 받아들이기 위한 기본적인 도구들입니다.**
`APawn`을 제어하고 외부 입력을 받아들이기 위한 기본적인 도구들입니다.
* **`IsPlayerControlled()`**:
	이 `APawn`을 현재 플레이어가 조종하고 있는지 확인합니다.
* **`GetController()`**:
	이 `APawn`을 제어하고 있는 [[AController]]에 대한 포인터를 반환합니다. 아무도 조종하고 있지 않다면 `nullptr`를 반환합니다.
* **`SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)`**:
	플레이어의 입력을 처리할 함수들을 바인딩하는 곳입니다. 플레이어가 조종하는 `APawn`에서 가장 중요한 초기화 함수 중 하나입니다.
* **`AddControllerYawInput(float Val)` / `AddControllerPitchInput(float Val)`**:
	`APawn` 자체가 아닌, `APawn`을 제어하는 컨트롤러의 회전(시점)을 조작합니다. FPS 게임의 카메라 움직임을 구현할 때 핵심적으로 사용됩니다.
* **`AddMovementInput(FVector WorldDirection, float ScaleValue)`**:
	특정 방향으로 움직이고 싶다는 '의도'를 [[UMovementComponent]]에 전달합니다. 실제 이동은 무브먼트 컴포넌트가 처리하므로, `APawn`은 그저 "어느 방향으로 가고 싶다"고 알리기만 하면 됩니다.
* **`SpawnDefaultController()`**:
	`APawn`이 월드에 스폰될 때, 아무런 컨트롤러에 의해 빙의되지 않은 상태라면 이 함수를 통해 기본 컨트롤러를 스스로 생성하고 빙의를 시도합니다.

## 관련 클래스
> **관련 클래스 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[AController]] / [[APlayerController]] / [[AAIController]]**:
	* **[[ACharacter]]**
* **[[UMovementComponent]] / [[UCharacterMovementComponent]]**:
	## 코드 예시
> **// 간단한 Pawn: 입력을 받아 회전/이동 의도를 전달하는 예시 #include "GameFramework/Pawn.h"**
```cpp
// 간단한 Pawn: 입력을 받아 회전/이동 의도를 전달하는 예시
#include "GameFramework/Pawn.h"

class AMyPawn : public APawn
{
    GENERATED_BODY()

public:
    virtual void SetupPlayerInputComponent(UInputComponent* PlayerInputComponent) override
    {
        check(PlayerInputComponent);
        PlayerInputComponent->BindAxis("Turn", this, &APawn::AddControllerYawInput);
        PlayerInputComponent->BindAxis("LookUp", this, &APawn::AddControllerPitchInput);
        PlayerInputComponent->BindAxis("MoveForward", this, &AMyPawn::MoveForward);
        PlayerInputComponent->BindAxis("MoveRight", this, &AMyPawn::MoveRight);
    }

private:
    void MoveForward(float Value)
    {
        if (Controller && Value != 0.f)
        {
            AddMovementInput(GetActorForwardVector(), Value);
        }
    }

    void MoveRight(float Value)
    {
        if (Controller && Value != 0.f)
        {
            AddMovementInput(GetActorRightVector(), Value);
        }
    }
};
```

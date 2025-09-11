---
title: 'ACharacter'
date: '2025-08-17T16:17:41+09:00'
---
> **월드를 두 발로 누비는 '배우'입니다.** 걷고, 뛰고, 점프하는 등 인간형 `ACharacter`에 필요한 모든 기본 움직임을 내장하고 있어, 복잡한 이동 로직을 직접 구현할 필요 없이 바로 생명력을 불어넣을 수 있습니다.

## 주요 역할 및 책임
> **단순한 [[APawn]]을 넘어, 정교한 이동 능력을 갖춘 특화된 존재입니다.**
단순한 [[APawn]]을 넘어, 정교한 이동 능력을 갖춘 특화된 존재입니다. 지면을 걷고, 장애물을 뛰어넘으며, 네트워크 환경에서도 부드럽게 움직이는 모든 기반을 제공합니다.
* **인간형 이동 (Humanoid Movement)**:
	[[UCharacterMovementComponent]]를 통해 걷기, 달리기, 점프, 수영, 비행 등 복잡한 이동 기능을 기본으로 제공합니다.
* **네트워크 최적화 (Network Optimization)**:
	클라이언트 측 예측(Client-Side Prediction)과 서버 측 보정을 통해 네트워크 지연 속에서도 부드러운 이동을 구현합니다.
* **캡슐 기반 충돌 (Capsule-Based Collision)**:
	[[UCapsuleComponent]]를 사용하여 수직으로 서 있는 `ACharacter`의 충돌을 효율적으로 처리합니다.
* **애니메이션 연동 (Animation Integration)**:
	[[USkeletalMeshComponent]]를 통해 [[UAnimBlueprint]]와 쉽게 연동하여, 이동 상태에 맞는 애니메이션(예: 걷기, 점프)을 재생할 수 있습니다.

## 핵심 속성·함수
> **`ACharacter`의 움직임을 직접 제어하고 상태를 확인하는 데 사용되는 필수적인 명령들입니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
`ACharacter`의 움직임을 직접 제어하고 상태를 확인하는 데 사용되는 필수적인 명령들입니다.
* **`Jump()`**:
	`ACharacter`의 점프를 시작합니다. 내부적으로 `CanJump()`를 확인합니다.
* **`StopJumping()`**:
	점프를 멈춥니다. 점프 키에서 손을 뗄 때 호출됩니다.
* **`Crouch()` / `UnCrouch()`**:
	`ACharacter`를 숙이거나 원래 자세로 돌아오게 합니다.
* **`LaunchCharacter(FVector LaunchVelocity, ...)`**:
	`ACharacter`에게 특정 방향으로 물리적인 힘을 가해 날려 보냅니다. (예: 폭발, 넉백)
* **`OnMovementModeChanged(EMovementMode PrevMovementMode, ...)`**:
	이동 모드(걷기, 수영, 비행 등)가 변경될 때 호출되는 [[Event]]입니다.
* **`IsMovingOnGround()`**:
	`ACharacter`가 현재 지면에 붙어 있는지 확인합니다.
* **`GetBaseAimRotation()`**:
	[[APlayerController]]의 회전(Aim)을 기반으로, 폰의 회전 오프셋을 포함한 최종 조준 방향을 반환합니다. FPS 게임에서 중요하게 사용됩니다.

## 핵심 구성요소
> **`ACharacter`는 세 가지 핵심 컴포넌트가 유기적으로 결합된 집합체입니다.**
`ACharacter`는 세 가지 핵심 컴포넌트가 유기적으로 결합된 집합체입니다. 이들이 각자의 역할을 수행하며 `ACharacter`의 존재를 완성합니다.
* **[[UCapsuleComponent]] (루트 컴포넌트)**:
	`ACharacter`의 충돌 경계를 정의합니다. 캡슐 모양은 수직으로 서 있는 인간형 `ACharacter`의 충돌 및 이동 계산에 매우 효율적입니다.
* **[[USkeletalMeshComponent]]**:
	`ACharacter`의 시각적 외형과 애니메이션을 담당합니다. 뼈대([[USkeleton]])를 가지고 있어 복잡한 움직임을 표현할 수 있습니다.
* **[[UCharacterMovementComponent]]**:
	`ACharacter`의 '다리'와도 같습니다. 중력의 영향을 받고, 지면을 따라 걷거나, 경사면을 오르고, 점프하는 등 모든 이동 로직을 처리하는 가장 복잡하고 중요한 컴포넌트입니다.

## 관련 클래스
> **`ACharacter`의 상위 개념인 조종 가능한 액터로, `ACharacter`는 특화된 [[APawn]]입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[APawn]]**:
	`ACharacter`의 상위 개념인 조종 가능한 액터로, `ACharacter`는 특화된 [[APawn]]입니다.
* **[[AController]] / [[APlayerController]]**:
	`ACharacter`를 소유(Possess)하여 입력을 전달하고 상태를 제어합니다.
* **[[UCharacterMovementComponent]]**:
	보행/수영/비행 등 대부분의 이동 로직을 담당하는 핵심 컴포넌트입니다.
* **[[UCapsuleComponent]]**:
	`ACharacter`의 충돌 경계를 정의하는 기본 루트 콜라이더입니다.
* **[[USkeletalMeshComponent]]**:
	외형과 애니메이션을 담당하며 [[UAnimBlueprint]]와 연동됩니다.
* **[[UInputComponent]]**:
	키보드/패드 입력을 바인딩해 이동·점프 등을 처리합니다.

## 코드 예시
> **// 기본 캐릭터: 이동/점프/웅크리기 입력을 처리하는 예시 #include "GameFramework/Character.h"**
```cpp
// 기본 캐릭터: 이동/점프/웅크리기 입력을 처리하는 예시
#include "GameFramework/Character.h"

class AMyCharacter : public ACharacter
{
    GENERATED_BODY()

public:
    virtual void SetupPlayerInputComponent(UInputComponent* PlayerInputComponent) override
    {
        check(PlayerInputComponent);
        PlayerInputComponent->BindAxis("MoveForward", this, &AMyCharacter::MoveForward);
        PlayerInputComponent->BindAxis("MoveRight", this, &AMyCharacter::MoveRight);
        PlayerInputComponent->BindAction("Jump", IE_Pressed, this, &ACharacter::Jump);
        PlayerInputComponent->BindAction("Jump", IE_Released, this, &ACharacter::StopJumping);
        PlayerInputComponent->BindAction("Crouch", IE_Pressed, this, &ACharacter::Crouch);
        PlayerInputComponent->BindAction("Crouch", IE_Released, this, &ACharacter::UnCrouch);
    }

private:
    void MoveForward(float Value)
    {
        if (Value != 0.f)
        {
            AddMovementInput(GetActorForwardVector(), Value);
        }
    }

    void MoveRight(float Value)
    {
        if (Value != 0.f)
        {
            AddMovementInput(GetActorRightVector(), Value);
        }
    }
};
```


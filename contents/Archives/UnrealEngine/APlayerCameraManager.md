---
title: 'APlayerCameraManager'
date: '2025-08-17T16:17:41+09:00'
---
> **플레이어의 '눈'이 되어 월드를 바라보는 시점을 결정하고, 그 시점에 다채로운 효과를 더하는 '전문 카메라 감독'입니다.** [[APlayerController]]에 의해 소유되며, 최종적으로 화면에 렌더링될 카메라의 위치, 회전, 시야각(FOV) 및 각종 포스트 프로세스 효과를 총괄하여 관리하는 특수한 [[AActor]]입니다.

## 주요 역할 및 책임
> **`APlayerCameraManager`는 단순한 카메라 위치 제어를 넘어, 플레이어의 시각적 경험을 풍부하게 만드는 모든 연출을 담당합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
`APlayerCameraManager`는 단순한 카메라 위치 제어를 넘어, 플레이어의 시각적 경험을 풍부하게 만드는 모든 연출을 담당합니다.
* **최종 뷰 타겟 결정 (Determining the Final View Target)**:
	[[APlayerController]]가 제어하는 [[APawn]]을 따라가는 3인칭 카메라, [[APawn]]의 눈 위치에 고정된 1인칭 카메라, 또는 특정 [[AActor]]를 비추는 시네마틱 카메라 등, 현재 어떤 시점을 기준으로 화면을 렌더링할지 결정합니다. `SetViewTarget` 함수를 통해 이 대상을 동적으로 변경할 수 있습니다.
* **카메라 효과 관리 (Managing Camera Effects)**:
	화면 흔들림([[UCameraShake]]), 페이드 인/아웃, 렌즈 효과 등 플레이어의 시점에 적용되는 모든 시각적 효과를 관리하고 재생합니다.
* **포스트 프로세스 제어 (Controlling Post Processing)**:
	카메라 매니저 자체에 포스트 프로세스 설정을 적용하여, 월드의 기본 설정과 관계없이 특정 플레이어에게만 다른 시각적 스타일(예: 흑백 화면, 특정 색감)을 보여줄 수 있습니다.
* **카메라 전환의 부드러운 보간 (Smooth Blending of Camera Transitions)**:
	`SetViewTarget` 함수에 `BlendTime`을 지정하면, 이전 뷰 타겟에서 새로운 뷰 타겟으로 카메라가 부드럽게 이동하도록 자동으로 보간(Interpolation) 처리를 해줍니다.

## 핵심 함수 및 속성
> **플레이어의 시점을 제어하고 연출하는 데 사용되는 핵심적인 함수들입니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
플레이어의 시점을 제어하고 연출하는 데 사용되는 핵심적인 함수들입니다.
* **`SetViewTarget(AActor* NewViewTarget, FViewTargetTransitionParams TransitionParams)`**:
	카메라의 시점을 새로운 [[AActor]]로 변경합니다. `TransitionParams`를 통해 전환 시간, 함수, 강도 등을 설정할 수 있습니다.
* **`StartCameraFade(float FromAlpha, float ToAlpha, float Duration, FLinearColor Color, ...)`**:
	지정된 시간 동안 화면을 특정 색상으로 어둡게 만들거나(페이드 아웃), 다시 밝게(페이드 인) 만듭니다.
* **`PlayCameraShake(TSubclassOf<UCameraShakeBase> ShakeClass, ...)`**:
	지정된 [[UCameraShake]] 애셋을 재생하여 화면을 흔듭니다. (예: 폭발, 피격)
* **`GetCameraLocation()` / `GetCameraRotation()`**:
	현재 프레임에서 최종적으로 계산된 카메라의 월드 위치와 회전 값을 반환합니다.

## [[APlayerController]]와의 관계
> **`APlayerCameraManager`는 [[APlayerController]]와 떼려야 뗄 수 없는 관계입니다.**
`APlayerCameraManager`는 [[APlayerController]]와 떼려야 뗄 수 없는 관계입니다.
* **소유 관계**:
	모든 [[APlayerController]]는 자신만의 `APlayerCameraManager` 인스턴스를 자동으로 생성하고 소유합니다. [[APlayerController]]의 `PlayerCameraManager` 변수를 통해 언제든지 접근할 수 있습니다.
* **역할 분담**:
	[[APlayerController]]가 플레이어의 '의지'와 '입력'을 담당한다면, `APlayerCameraManager`는 그 결과를 플레이어가 어떻게 '볼 것인가'를 담당합니다. 이러한 역할 분담 덕분에 복잡한 카메라 로직을 [[APlayerController]]로부터 분리하여 깔끔하게 관리할 수 있습니다.

## 관련 클래스
> **카메라 매니저를 소유하는 컨트롤러. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[APlayerController]]**:
	카메라 매니저를 소유하는 컨트롤러.
* **[[APawn]] / [[AActor]]**:
	뷰 타겟 대상들.
* **[[UCameraShake]]**:
	카메라 흔들림 베이스.

## 코드 예시
> **// 특정 액터로 카메라 전환 + 블렌딩, 그리고 페이드/카메라 쉐이크 적용 APlayerController* PC = /* ...**
```cpp
// 특정 액터로 카메라 전환 + 블렌딩, 그리고 페이드/카메라 쉐이크 적용
APlayerController* PC = /* ... */;
if (PC)
{
    FViewTargetTransitionParams Params;
    Params.BlendTime = 1.0f;
    PC->SetViewTarget(CinematicActor, Params);

    if (PC->PlayerCameraManager)
    {
        PC->PlayerCameraManager->StartCameraFade(1.f, 0.f, 0.5f, FLinearColor::Black);
        if (ShakeClass)
        {
            PC->PlayerCameraManager->PlayCameraShake(ShakeClass, 0.8f);
        }
    }
}
```

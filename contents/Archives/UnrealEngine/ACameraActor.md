---
title: 'ACameraActor'
date: '2025-08-17T16:17:41+09:00'
---
> 월드에 배치할 수 있는 가장 단순한 형태의 카메라 액터입니다. 시점을 배치·전환하거나 시네마틱을 연결할 때 기본 단위로 사용합니다.

## 주요 역할 및 책임
> **월드의 특정 위치·회전을 카메라 시점으로 제공합니다.**
* **시점 제공 (Viewpoint Provision)**:
	월드의 특정 위치·회전을 카메라 시점으로 제공합니다.
* **카메라 설정 컨테이너 (Camera Settings Container)**:
	FOV·Aspect·PostProcess 등 카메라 파라미터를 한 곳에서 관리합니다.
* **시네마틱 기본 요소 (Cinematic Element)**:
	시퀀서에서 컷 전환과 키프레임 애니메이션에 활용됩니다.

## 핵심 구성요소
> **실제 카메라 파이프라인을 담당합니다.**
* **[[UCameraComponent]]**:
	실제 카메라 파이프라인을 담당합니다. `ACameraActor` 생성 시 루트에 자동 부착됩니다.

## 코드 예시
> **#include "Kismet/GameplayStatics.h" #include "Camera/CameraActor.h" #include "GameFramework/PlayerController.h"**
```cpp
#include "Kismet/GameplayStatics.h"
#include "Camera/CameraActor.h"
#include "GameFramework/PlayerController.h"

void AMyPlayerController::SetFixedCameraView()
{
    TArray<AActor*> Found;
    UGameplayStatics::GetAllActorsOfClass(GetWorld(), ACameraActor::StaticClass(), Found);
    if (Found.Num() > 0)
    {
        SetViewTargetWithBlend(Found[0], 0.5f);
    }
}
```
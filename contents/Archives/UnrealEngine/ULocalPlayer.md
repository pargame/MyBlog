---
title: 'ULocalPlayer'
date: '2025-08-17T16:17:41+09:00'
---
> **이 컴퓨터 앞에 앉아 실제로 게임을 플레이하고 있는 '나 자신'을 나타내는 객체입니다.** 멀티플레이어 게임에 여러 플레이어가 접속해 있더라도, `ULocalPlayer`는 오직 이 기기에서 게임을 조작하는 로컬 플레이어만을 지칭합니다. 화면 분할(Split-screen) 환경이 아니라면, 게임에는 단 하나의 `ULocalPlayer`만 존재합니다.

### **1. 주요 역할 및 책임**
> **[[UGameInstance]] 내에서 로컬 플레이어 한 명을 고유하게 식별합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **플레이어의 유일한 대리인 (Player's Unique Representative)**:
	[[UGameInstance]] 내에서 로컬 플레이어 한 명을 고유하게 식별합니다. 이 객체를 통해 [[APlayerController]], 뷰포트, 개인 설정 등에 접근할 수 있습니다.
* **뷰포트 생성 및 관리 (Viewport Creation and Management)**:
	자신이 세상을 바라볼 '창문'인 [[UGameViewportClient]]를 생성하고 관리할 책임을 가집니다.
* **플레이어 컨트롤러 소유 (Ownership of Player Controller)**:
	자신을 대변하는 [[APlayerController]]를 소유하고 관리합니다. `ULocalPlayer`가 생성될 때, 이 플레이어를 위한 [[APlayerController]]도 함께 생성됩니다.
* **개인 설정 저장 (Storage for Player-Specific Settings)**:
	온라인 서브시스템 ID, 닉네임, 접근성 설정(예: 색맹 모드) 등 플레이어 개개인에게 종속되는 데이터를 관리합니다.

### **2. 핵심 함수 및 속성**
> **이 로컬 플레이어가 소유한 [[APlayerController]]에 대한 포인터를 반환합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* `GetPlayerController()`:
	이 로컬 플레이어가 소유한 [[APlayerController]]에 대한 포인터를 반환합니다.
* `GetViewportClient()`:
	이 로컬 플레이어가 사용하고 있는 [[UGameViewportClient]]에 대한 포인터를 반환합니다.
* `GetPreferredUniqueNetId()`:
	이 플레이어의 고유한 네트워크 ID(예: 스팀 ID, 에픽 계정 ID)를 반환합니다. 멀티플레이어 세션에서 플레이어를 식별하는 데 사용됩니다.
* `GetNickname()`:
	이 플레이어의 닉네임을 반환합니다.
* `SpawnPlayActor(const FString& URL, FString& OutError, UWorld* InWorld)`:
	지정된 월드에 이 플레이어를 위한 액터(주로 [[APlayerController]])를 스폰하는 프로세스를 시작합니다.

### **3. 로컬 플레이어와 게임 인스턴스**
> **게임이 실행되는 동안 단 하나만 존재하는 최상위 객체입니다. 실무 팁: 변경 시 성능·안정성·호환성을 먼저 검토하세요.**
* **[[UGameInstance]]**:
	게임이 실행되는 동안 단 하나만 존재하는 최상위 객체입니다. [[UGameInstance]]는 현재 게임에 참여하고 있는 모든 `ULocalPlayer`의 목록을 관리하며, 플레이어가 게임에 참여(`AddLocalPlayer`)하거나 떠날 때(`RemoveLocalPlayer`) 이를 처리합니다.

## 관련 클래스
> **관련 클래스 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* [[UGameInstance]]
* [[APlayerController]]
* [[UGameViewportClient]]

## 코드 예시
> **// 로컬 플레이어의 컨트롤러/뷰포트 접근 void UseLocalPlayer(ULocalPlayer* LP) { if (!LP) return; if (APlayerController* PC = LP->GetPlayerController(GetWorld())) { // 플레이어 컨트롤러 사용 } if (UGameViewportClient* Viewport = LP->GetViewportClient()) { // 해상도 질의 등 FVector2D Size; Viewport->GetViewportSize(Size); } }**
```cpp
// 로컬 플레이어의 컨트롤러/뷰포트 접근
void UseLocalPlayer(ULocalPlayer* LP)
{
    if (!LP) return;
    if (APlayerController* PC = LP->GetPlayerController(GetWorld()))
    {
        // 플레이어 컨트롤러 사용
    }
    if (UGameViewportClient* Viewport = LP->GetViewportClient())
    {
        // 해상도 질의 등
        FVector2D Size;
        Viewport->GetViewportSize(Size);
    }
}
```

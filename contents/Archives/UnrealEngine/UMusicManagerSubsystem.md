---
title: 'UMusicManagerSubsystem'
date: '2025-08-17T16:17:41+09:00'
---
> **레벨이 전환되어도 끊기지 않고 배경 음악(BGM)을 계속 재생하고, 게임의 상황에 따라 음악을 동적으로 변경하는 '음악 감독' 서브시스템입니다.** [[UGameInstanceSubsystem]]으로 구현하여, 게임 세션 전체에 걸쳐 음악의 연속성과 상태를 관리하는 역할을 합니다.

### **1. 주요 역할 및 책임**
> **[[UGameInstanceSubsystem]]으로 만들어졌기 때문에, 메인 메뉴에서 게임 레벨로 이동하거나 다른 레벨로 전환될 때 파괴되지 않고 살아남습니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **음악의 연속성 보장 (Ensuring Music Continuity)**:
	[[UGameInstanceSubsystem]]으로 만들어졌기 때문에, 메인 메뉴에서 게임 레벨로 이동하거나 다른 레벨로 전환될 때 파괴되지 않고 살아남습니다. 이를 통해 배경 음악이 끊기지 않고 계속 재생될 수 있습니다.
* **상황에 맞는 동적 음악 변경 (Dynamic Music Change Based on Context)**:
	`ChangeMusic(UMusicDataAsset* NewMusic)`와 같은 함수를 외부에 노출하여, 게임의 상황(예: 평화로운 상태, 전투 상태, 보스전)에 따라 배경 음악을 부드럽게 전환(Cross-fade)하는 기능을 제공합니다.
* **중앙 집중식 제어 (Centralized Control)**:
	음악 볼륨, 재생/정지 등 모든 음악 관련 제어를 이 서브시스템을 통해 처리하도록 하여, 코드의 중복을 막고 유지보수를 용이하게 합니다.
* **데이터 기반 관리 (Data-Driven Management)**:
	실제 [[USoundBase]] 애셋을 직접 참조하는 대신, 볼륨, 페이드 시간 등의 메타데이터를 포함하는 `UMusicDataAsset`과 같은 [[Data Asset]]을 사용하여 음악을 관리함으로써 유연성을 높입니다.

### **2. 구현 아이디어**
> **두 개의 [[UAudioComponent]]를 가집니다. 실무 팁: 변경 시 성능·안정성·호환성을 먼저 검토하세요.**
* **`Audio Components`**:
	두 개의 [[UAudioComponent]]를 가집니다. 하나는 현재 재생 중인 음악을, 다른 하나는 다음에 재생될 음악을 페이드 인(Fade-in) 시키기 위해 사용됩니다. 이를 통해 두 음악 사이를 부드럽게 교차시킬 수 있습니다.
* **`CurrentMusicData` (`UMusicDataAsset*`)**:
	현재 재생 중인 음악의 정보를 담고 있는 데이터 애셋에 대한 참조입니다.
* **`ChangeMusic(UMusicDataAsset* NewMusicData, float FadeDuration)`:
	새로운 음악으로 전환하는 메인 함수입니다. 현재 재생 중인 오디오 컴포넌트는 페이드 아웃 시키고, 다른 오디오 컴포넌트로 새로운 음악을 페이드 인 시킵니다.
* **`SetVolume(float Volume)`**:
	전체 배경 음악의 볼륨을 조절하는 함수입니다.

### **3. 사용 방법**
> **1. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
1.  [[UGameInstanceSubsystem]]을 상속받는 `UMusicManagerSubsystem` C++ 클래스를 생성합니다.
2.  내부에 [[UAudioComponent]]와 필요한 함수들을 구현합니다.
3.  게임 내 어디서든 `GetGameInstance()->GetSubsystem<UMusicManagerSubsystem>()`을 통해 서브시스템에 접근합니다.
4.  예를 들어, 보스전 트리거 볼륨에 플레이어가 들어가면, `MusicManagerSubsystem->ChangeMusic(BossMusicData)`를 호출하여 배경 음악을 보스전 음악으로 변경합니다.
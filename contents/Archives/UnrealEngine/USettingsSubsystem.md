---
title: 'USettingsSubsystem'
date: '2025-08-17T16:17:41+09:00'
---
> **게임의 각종 설정(그래픽, 오디오, 게임플레이 등)을 관리하고, 이를 디스크에 저장하여 영구적으로 유지하는 '설정 관리자'입니다.** [[UGameInstanceSubsystem]]으로 구현하여, 게임 세션 전체에 걸쳐 사용자의 설정 값을 유지하고, 게임 내 어디서든 이 설정에 접근하고 수정할 수 있는 중앙 창구 역할을 합니다.

### **1. 주요 역할 및 책임**
> **그래픽 품질, 해상도, 전체 화면 모드, 마스터 볼륨, 음악 볼륨, 마우스 감도 등 모든 설정 값을 하나의 클래스에서 관리하여 일관성을 유지하고 접근을 용이하게 합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **설정 값의 중앙 관리 (Centralized Management of Settings)**:
	그래픽 품질, 해상도, 전체 화면 모드, 마스터 볼륨, 음악 볼륨, 마우스 감도 등 모든 설정 값을 하나의 클래스에서 관리하여 일관성을 유지하고 접근을 용이하게 합니다.
* **데이터 영속성 (Data Persistence)**:
	현재 설정 값들을 [[USaveGame]] 객체를 사용하여 디스크(예: `MyGame/Saved/SaveGames/Settings.sav`)에 저장하고, 게임이 시작될 때 이를 다시 불러와 적용합니다.
* **즉시 적용 및 반영 (Instant Apply and Reflection)**:
	설정 메뉴 UI에서 사용자가 값을 변경하면, 이 서브시스템의 함수를 호출하여 즉시 해당 설정을 게임에 적용합니다. (예: `SetMasterVolume()` 함수는 즉시 오디오 엔진의 볼륨을 조절)
* **[[Delegate]]를 통한 변경 알림 (Change Notification via Delegates)**:
	특정 설정 값이 변경되었을 때 `OnGraphicsSettingsChanged`, `OnAudioSettingsChanged`와 같은 [[Delegate]]를 `Broadcast`하여, 다른 시스템이나 UI가 변경된 값을 즉시 반영할 수 있도록 합니다.

### **2. 구현 아이디어**
> **서브시스템이 초기화될 때, `LoadSettings()` 함수를 호출하여 디스크로부터 설정 값을 불러옵니다. 실무 팁: 변경 시 성능·안정성·호환성을 먼저 검토하세요.**
* **`SettingsData` (`UGameSettingsSave*`)**:
	모든 설정 변수들을 멤버로 가지고 있는 [[USaveGame]] 클래스의 인스턴스에 대한 포인터입니다.
* **`Initialize()`**:
	서브시스템이 초기화될 때, `LoadSettings()` 함수를 호출하여 디스크로부터 설정 값을 불러옵니다. 만약 저장 파일이 없다면, 기본값으로 초기화합니다.
* **`ApplySettings()`**:
	현재 `SettingsData`에 저장된 값들을 실제 게임 엔진의 각 시스템에 적용합니다. (예: `GEngine->GetGameUserSettings()`를 통해 해상도 설정, 오디오 믹서에 볼륨 설정 등)
* **`SaveSettings()`**:
	현재 `SettingsData`의 내용을 디스크에 저장합니다.
* **`GetMasterVolume()` / `SetMasterVolume(float Volume)`**:
	설정 값을 가져오고 변경하는 Getter/Setter 함수들입니다. Setter 함수 내부에서는 값을 변경한 후, `ApplySettings()`를 호출하고, 관련 [[Delegate]]를 `Broadcast`하는 로직이 포함됩니다.

### **3. 사용 방법**
> **1. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
1.  모든 설정 변수를 담을 [[USaveGame]] C++ 클래스(예:
	[[UMyGameSettingsSave]])를 생성합니다.
2.  [[UGameInstanceSubsystem]]을 상속받는 `USettingsSubsystem` C++ 클래스를 생성합니다.
3.  `Initialize`에서 `UMyGameSettingsSave` 객체를 로드하거나 새로 생성하고, `ApplySettings`를 호출하여 초기 설정을 적용합니다.
4.  설정 UI 위젯에서는 이 서브시스템의 인스턴스를 가져와서, 현재 설정 값을 표시하고, 사용자가 슬라이더나 버튼을 조작하면 서브시스템의 Setter 함수(예:
	`SetMasterVolume`)를 호출합니다.
5.  사용자가 '적용' 또는 '저장' 버튼을 누르면, 서브시스템의 `SaveSettings()` 함수를 호출하여 변경 사항을 디스크에 기록합니다.
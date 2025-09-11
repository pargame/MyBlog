---
title: 'UAudioComponent'
date: '2025-08-17T16:17:41+09:00'
---
> **월드의 특정 위치에서 '소리'를 재생하는 스피커 역할을 하는 컴포넌트입니다.** [[AActor]]에 부착하여 총소리, 발소리, 배경 음악 등 모든 종류의 사운드를 발생시킬 수 있습니다.

### **1. 주요 역할 및 책임**
> **지정된 사운드 에셋([[USoundBase]])을 재생, 정지, 일시정지하는 기능을 담당합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **사운드 재생 (Sound Playback)**:
	지정된 사운드 에셋([[USoundBase]])을 재생, 정지, 일시정지하는 기능을 담당합니다.
* **3D 공간 음향 (3D Spatialization)**:
	소리가 발생하는 위치에 따라 좌우 스피커의 볼륨과 피치를 조절하여 입체적인 공간감을 만듭니다. 리스너(보통 카메라)와의 거리에 따라 소리가 감쇠하는 효과(Attenuation)도 포함됩니다.
* **사운드 커스터마이징 (Sound Customization)**:
	볼륨, 피치, 시작 시간 등 사운드 재생에 관련된 다양한 파라미터를 실시간으로 조절할 수 있습니다.

### **2. 핵심 함수 및 속성**
> **설정된 사운드를 재생합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`SetSound(USoundBase* NewSound)`**:
	이 컴포넌트가 재생할 사운드 에셋을 설정합니다.
* **`Play(float StartTime = 0.0f)`**:
	설정된 사운드를 재생합니다.
* **`Stop()`**:
	현재 재생 중인 사운드를 즉시 정지합니다.
* **`FadeIn(float FadeInDuration, float FadeVolumeLevel = 1.0f, float StartTime = 0.0f)`**:
	지정된 시간 동안 소리가 부드럽게 커지면서 재생됩니다.
* **`FadeOut(float FadeOutDuration, float FadeVolumeLevel)`**:
	지정된 시간 동안 소리가 부드럽게 작아지며 멈춥니다.
* **`bAutoActivate`**:
	`true`로 설정하면, 컴포넌트가 활성화될 때(주로 게임 시작 시) 자동으로 `Play()`가 호출됩니다.

### **3. 관련 클래스**
> **`UAudioComponent`가 재생할 수 있는 모든 사운드 에셋의 부모 클래스입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[USoundBase]]**:
	`UAudioComponent`가 재생할 수 있는 모든 사운드 에셋의 부모 클래스입니다. 여기에는 단일 오디오 클립인 `USoundWave`와, 여러 사운드를 조합하고 편집하는 `USoundCue`가 포함됩니다.
* **`USoundAttenuation`**:
	소리가 거리에 따라 어떻게 감쇠할지(작아질지)에 대한 규칙을 정의하는 데이터 에셋입니다. 3D 공간감을 만드는 데 핵심적인 역할을 합니다.
* **[[UGameplayStatics]]**:
	`PlaySoundAtLocation`, `SpawnSound2D` 등 월드의 특정 위치나 화면 전체에 일회성 사운드를 간편하게 재생할 수 있는 함수들을 제공합니다. 내부적으로는 임시 `UAudioComponent`를 생성하여 사용하는 방식입니다.
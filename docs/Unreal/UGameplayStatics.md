---
---
> **언리얼 엔진의 거의 모든 곳에서 필요한 기능들을 모아놓은 '만능 공구함'입니다.** 게임플레이와 관련된 수많은 전역 유틸리티 함수를 제공하는 정적(static) 클래스로, 인스턴스를 만들 필요 없이 어떤 클래스에서든 즉시 호출하여 사용할 수 있습니다.

### **1. 주요 역할 및 책임**
> `UGameplayStatics`는 자주 사용되지만 특정 액터나 컴포넌트에 속하기는 애매한 기능들을 한 곳에 모아, 개발자가 편리하고 일관된 방식으로 공통 작업들을 수행할 수 있도록 돕습니다.

### **2. 주요 기능 카테고리**
> `UGameplayStatics`가 제공하는 기능은 매우 방대하며, 주요 카테고리는 다음과 같습니다.
* **액터 생성 및 관리 (Actor Spawning & Management):**
    * `SpawnActor` / `SpawnActorDeferred`: 월드에 새로운 [[AActor]]를 생성합니다.
    * `GetAllActorsOfClass`: 특정 클래스에 해당하는 모든 액터를 월드에서 찾아 배열로 반환합니다.
    * `GetActorOfClass`: 특정 클래스에 해당하는 액터 하나를 찾습니다.
* **데미지 처리 (Damage System):**
    * `ApplyDamage`: 특정 액터에게 일반적인 데미지를 가합니다.
    * `ApplyPointDamage` / `ApplyRadialDamage`: 특정 지점이나 반경 내에 데미지를 가하며, 물리적 효과를 동반할 수 있습니다.
* **저장 및 불러오기 (Save & Load System):**
    * `CreateSaveGameObject`: [[USaveGame]] 객체를 생성합니다.
    * `SaveGameToSlot`: [[USaveGame]] 객체를 파일로 저장합니다.
    * `LoadGameFromSlot`: 파일에서 [[USaveGame]] 객체를 불러옵니다.
* **사운드 재생 (Sound System):**
    * `PlaySoundAtLocation`: 월드의 특정 위치에서 3D 사운드를 재생합니다.
    * `PlaySound2D`: 위치에 상관없이 모든 플레이어에게 동일하게 들리는 2D 사운드를 재생합니다.
    * `SpawnSoundAttached`: 특정 컴포넌트에 붙어서 함께 움직이는 사운드를 생성합니다.
* **플레이어 및 컨트롤러 접근 (Player & Controller Access):**
    * `GetPlayerController`: 지정된 인덱스의 [[APlayerController]]를 가져옵니다.
    * `GetPlayerPawn`: 지정된 인덱스의 플레이어 [[APawn]]을 가져옵니다.
    * `GetPlayerCameraManager`: 플레이어의 카메라 관리자를 가져옵니다.
* **월드 및 레벨 관리 (World & Level Management):**
    * `OpenLevel`: 다른 레벨(맵)을 엽니다.
    * `GetWorldDeltaSeconds`: 마지막 프레임 이후 경과된 시간을 초 단위로 가져옵니다.
    * `SetGlobalTimeDilation`: 게임 전체의 시간 흐름 속도를 조절합니다. (슬로 모션 효과)

### **3. 사용 방법**
`UGameplayStatics`의 모든 함수는 정적(static)이므로, 클래스 인스턴스를 만들 필요 없이 헤더 파일만 포함하면 어디서든 `UGameplayStatics::FunctionName()` 형태로 직접 호출할 수 있습니다.
---
---

> **[[USaveGame]]을 상속하여 게임의 설정을 저장하기 위해 특별히 만들어진 클래스입니다.** 주로 그래픽, 오디오, 컨트롤 키 등 플레이어의 개인적인 환경 설정을 디스크에 저장하고 불러오는 데 사용됩니다.

### **1. 주요 역할 및 책임**
* **설정 데이터 영속화 (Settings Data Persistence):**
    플레이어가 게임을 종료했다가 다시 켜도 설정이 유지되도록, 관련 데이터(예: 볼륨 크기, 그래픽 품질, 마우스 감도 등)를 파일로 저장하는 역할을 합니다.
* **설정 데이터 구조화 (Settings Data Structuring):**
    저장하고 싶은 모든 설정 값들을 변수로 선언하여, 어떤 데이터가 저장되는지 명확하게 구조화합니다.

### **2. 핵심 구현**
* **변수 선언:**
    저장할 모든 데이터를 변수로 선언합니다. 예를 들어 `float MasterVolume`, `int32 GraphicsQuality`, `bool bInvertYAxis` 등이 될 수 있습니다.
* **저장 및 로드 로직:**
    [[UGameplayStatics]]의 `SaveGameToSlot` 함수를 사용해 이 클래스의 인스턴스를 파일에 저장하고, `LoadGameFromSlot` 함수를 사용해 파일로부터 인스턴스를 불러옵니다.

### **3. 사용 예시**
* **게임 설정 메뉴:**
    플레이어가 설정 UI에서 값을 변경하면, `UMyGameSettingsSave` 객체의 변수 값을 업데이트하고 `SaveGameToSlot`을 호출하여 즉시 저장합니다. 게임이 시작될 때는 `LoadGameFromSlot`을 호출하여 저장된 설정 값을 불러와 게임에 적용합니다.

### **4. 관련 클래스**
* **[[USaveGame]]:**
    `UMyGameSettingsSave`의 부모 클래스로, 게임 상태를 저장하는 모든 클래스의 기반입니다.
* **[[UGameplayStatics]]:**
    세이브 파일을 실제로 디스크에 쓰고 읽는 `SaveGameToSlot`, `LoadGameFromSlot`, `DoesSaveGameExist`와 같은 함수들을 제공합니다.

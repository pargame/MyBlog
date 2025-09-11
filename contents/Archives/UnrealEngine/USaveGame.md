---
title: 'USaveGame'
date: '2025-08-17T16:17:41+09:00'
---
> **게임의 진행 상황, 플레이어 데이터, 설정 등 저장해야 할 모든 정보를 담는 '데이터 컨테이너'입니다.** 이 객체에 저장된 데이터는 파일로 직렬화되어 디스크에 기록됩니다.

### **1. 주요 역할 및 책임**
> **저장하고 싶은 변수들(예: 플레이어 위치, 체력, 점수, 인벤토리)을 `UPROPERTY()`로 선언하여 담아두는 역할을 합니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **데이터 저장소 (Data Storage)**:
	저장하고 싶은 변수들(예: 플레이어 위치, 체력, 점수, 인벤토리)을 `UPROPERTY()`로 선언하여 담아두는 역할을 합니다.
* **직렬화 (Serialization)**:
	`USaveGame` 객체에 담긴 데이터는 언리얼 엔진의 저장 시스템에 의해 바이너리 파일로 변환되어 디스크에 저장됩니다.
* **버전 관리 (Versioning)**:
	게임이 업데이트되어 저장 데이터의 구조가 바뀌더라도, 이전 버전의 저장 파일을 안전하게 불러올 수 있도록 버전 관리 기능을 지원합니다.

### **2. 핵심 함수 및 속성 ([[UGameplayStatics]] 사용)**
> **지정된 슬롯에서 `USaveGame` 객체를 메모리로 불러옵니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`SaveGameToSlot(USaveGame* SaveGameObject, const FString& SlotName, const int32 UserIndex)`**:
	`USaveGame` 객체를 지정된 슬롯 이름으로 디스크에 저장합니다.
* **`LoadGameFromSlot(const FString& SlotName, const int32 UserIndex)`**:
	지정된 슬롯에서 `USaveGame` 객체를 메모리로 불러옵니다. 불러온 후에는 원하는 클래스로 형 변환하여 사용해야 합니다.
* **`DoesSaveGameExist(const FString& SlotName, const int32 UserIndex)`**:
	해당 슬롯에 저장 파일이 존재하는지 확인합니다.
* **`DeleteGameInSlot(const FString& SlotName, const int32 UserIndex)`**:
	해당 슬롯의 저장 파일을 삭제합니다.

### **3. 관련 클래스**
> **게임플레이와 관련된 다양한 전역 함수들을 제공하는 유틸리티 클래스이며, 저장/불러오기 기능을 포함합니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[UGameplayStatics]]**:
	게임플레이와 관련된 다양한 전역 함수들을 제공하는 유틸리티 클래스이며, 저장/불러오기 기능을 포함합니다.
* **[[USaveGameSubsystem]]**:
	[[UGameplayStatics]]를 이용한 방식보다 더 현대적이고 유연한 저장/불러오기 관리를 제공하는 서브시스템입니다. 비동기 처리와 [[Delegate]] 콜백을 지원하여 편의성을 높였습니다.
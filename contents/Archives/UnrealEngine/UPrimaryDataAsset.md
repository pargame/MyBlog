---
title: 'UPrimaryDataAsset'
date: '2025-08-17T16:17:41+09:00'
---
> **[[UDataAsset]]에 '고유한 신분증'을 부여하여, 애셋 관리 시스템이 이를 식별하고 검색할 수 있도록 만든 강력한 데이터 애셋입니다.** 일반 [[UDataAsset]]이 익명의 데이터 덩어리라면, `UPrimaryDataAsset`은 이름과 주소가 명확한, 체계적으로 관리되는 데이터입니다.

### **1. 주요 역할 및 책임**
> **각 `UPrimaryDataAsset`은 `Primary Asset ID`라는 고유한 ID를 가집니다. 실무 팁: 구현 시 성능과 안정성에 유의하세요.**
* **고유 식별자 제공 (Providing a Unique Identifier)**:
	각 `UPrimaryDataAsset`은 `Primary Asset ID`라는 고유한 ID를 가집니다. 이 ID는 애셋의 타입(예: `Weapon`, `CharacterSkin`)과 애셋의 이름으로 구성되어, 전역적으로 애셋을 정확하게 식별할 수 있게 해줍니다.
* **동적 애셋 로딩 (Dynamic Asset Loading)**:
	`Asset Manager`를 통해, 애셋을 직접 참조하지 않고도 `Primary Asset ID`만으로 `UPrimaryDataAsset`을 비동기적으로 로드할 수 있습니다. 이는 게임 시작 시 모든 애셋을 로드하는 것이 아니라, 필요한 시점에 필요한 애셋만 로드하여 메모리 사용량과 로딩 시간을 최적화하는 데 필수적입니다.
* **애셋 검색 및 관리 (Asset Discovery and Management)**:
	`Asset Manager`는 프로젝트 내의 모든 `UPrimaryDataAsset`을 스캔하고 목록을 관리할 수 있습니다. 이를 통해 "모든 무기 아이템 목록을 가져와 상점에 표시하라" 또는 "모든 캐릭터 스킨 목록을 가져와 커스터마이징 UI에 채워라"와 같은 강력한 기능을 쉽게 구현할 수 있습니다.

### **2. 핵심 함수**
> **이 애셋의 고유 ID를 반환하도록 오버라이드하는 가상 함수입니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* `GetPrimaryAssetId() const override`:
	이 애셋의 고유 ID를 반환하도록 오버라이드하는 가상 함수입니다. 개발자는 이 함수를 재정의하여 자신의 프로젝트 규칙에 맞는 `Primary Asset ID`를 생성해야 합니다. 일반적으로 애셋의 타입과 애셋의 이름을 조합하여 만듭니다.

### **3. 사용 방법**
> **1. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
1. **C++ 클래스 생성**:
	`UPrimaryDataAsset`을 상속받는 새로운 C++ 클래스를 만듭니다.
2. **`GetPrimaryAssetId` 재정의**:
	생성된 C++ 클래스에서 `GetPrimaryAssetId` 함수를 오버라이드하여, 애셋 타입과 이름을 기반으로 고유 ID를 반환하는 로직을 작성합니다.
3. **블루프린트 애셋 생성**:
	에디터에서, 방금 만든 C++ 클래스를 부모로 하는 블루프린트 클래스를 생성합니다.
4. **데이터 채우기**:
	생성된 블루프린트 애셋을 열어 필요한 데이터들을 채웁니다.
5. **애셋 매니저 설정**:
	프로젝트 설정에서 `Asset Manager`가 스캔할 디렉터리와 `Primary Asset Type`을 등록합니다.
6. **런타임에 사용**:
	`UAssetManager::Get()`을 통해 애셋 매니저에 접근하여, `Primary Asset ID`를 이용해 애셋을 로드하거나 쿼리합니다.

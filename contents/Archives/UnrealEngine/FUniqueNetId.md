---
title: 'FUniqueNetId'
date: '2025-08-17T16:17:41+09:00'
---
> **[[Online Subsystem]]을 사용하는 온라인 환경에서 각 플레이어를 '고유하게 식별'하기 위한 ID를 나타내는 구조체입니다.** 플랫폼마다 다른 플레이어 ID 형식(예: Steam의 64비트 ID, PSN의 유저 이름)을 일관된 방식으로 다룰 수 있도록 추상화한 래퍼(Wrapper)입니다.

### **1. 주요 역할 및 책임**
> **온라인 세션, 친구 목록, 리더보드, 도전과제 등 모든 온라인 기능에서 특정 플레이어를 정확히 지칭하는 데 사용됩니다.**
* **플레이어 고유 식별 (Unique Player Identification)**:
	온라인 세션, 친구 목록, 리더보드, 도전과제 등 모든 온라인 기능에서 특정 플레이어를 정확히 지칭하는 데 사용됩니다.
* **플랫폼 독립성 (Platform Independence)**:
	개발자는 `FUniqueNetId`를 사용하여 코드를 작성하면, [[Online Subsystem]]이 내부적으로 현재 플랫폼에 맞는 실제 ID 형식으로 변환하여 처리해줍니다. 이를 통해 플랫폼별로 코드를 분기하지 않아도 됩니다.
* **데이터 안정성 (Data Integrity)**:
	내부적으로는 원시 ID 데이터를 포인터로 관리하여, 복사 시 오버헤드가 적고 효율적으로 ID를 전달할 수 있습니다.

### **2. 사용 방법**
> **개발자가 `FUniqueNetId`를 직접 생성하는 경우는 드뭅니다.**
개발자가 `FUniqueNetId`를 직접 생성하는 경우는 드뭅니다. 보통은 [[Online Subsystem]]의 다른 인터페이스 함수를 통해 이 ID를 얻게 됩니다.

* **로그인 시**:
	`IOnlineIdentity::OnLoginComplete` 델리게이트는 로그인한 플레이어의 `FUniqueNetId`를 반환합니다.
* **세션에서**:
	세션에 참가한 플레이어 목록을 조회하면 각 플레이어의 `FUniqueNetId`를 얻을 수 있습니다.
* **친구 목록**:
	친구 목록을 조회하면 각 친구의 `FUniqueNetId`를 얻을 수 있습니다.

`FUniqueNetId`는 포인터 기반으로 작동하므로, 유효성을 항상 확인해야 합니다.
```cpp
// PlayerState에서 UniqueId를 가져오는 예시
TSharedPtr<const FUniqueNetId> UniqueId = PlayerState->GetUniqueId().GetUniqueNetId();
if (UniqueId.IsValid())
{
    // 유효한 ID일 경우에만 처리
    FString IdString = UniqueId->ToString();
}
```

### **3. 핵심 함수**
> **이 `FUniqueNetId`가 유효한 플레이어 ID를 담고 있는지 확인합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`IsValid()`**:
	이 `FUniqueNetId`가 유효한 플레이어 ID를 담고 있는지 확인합니다.
* **`ToString()`**:
	ID를 문자열로 변환하여 디버깅이나 로깅에 사용할 수 있도록 합니다.
* **`operator==`**:
	두 `FUniqueNetId`가 동일한 플레이어를 가리키는지 비교합니다.

### **4. 관련 클래스 및 구조체**
> **`FUniqueNetId`를 생성하고 관리하는 주체입니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[Online Subsystem]]**:
	`FUniqueNetId`를 생성하고 관리하는 주체입니다.
* **`IOnlineIdentity`**:
	플레이어의 로그인 및 신원 확인을 처리하며, `FUniqueNetId`를 제공합니다.
* **[[APlayerState]]**:
	네트워크 게임에서 각 플레이어의 상태를 나타내는 액터로, 해당 플레이어의 `FUniqueNetId`를 가지고 있습니다.

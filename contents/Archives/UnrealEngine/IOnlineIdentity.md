---
title: 'IOnlineIdentity'
date: '2025-08-17T16:17:41+09:00'
---
> **[[Online Subsystem]] 내에서 플레이어의 로그인 상태를 확인하고, 고유 ID 등의 계정 정보를 관리하기 위한 C++ 인터페이스입니다.** 이 인터페이스를 통해 플랫폼에 독립적인 방식으로 플레이어의 신원을 확인하고, 계정 정보를 가져올 수 있습니다.

### **1. 주요 역할 및 책임**
> **Steam, Xbox Live, PlayStation Network 등 각기 다른 플랫폼의 로그인 및 계정 관리 API를 공통된 함수 호출로 사용할 수 있게 해줍니다.**
* **플랫폼 추상화 (Platform Abstraction)**:
	Steam, Xbox Live, PlayStation Network 등 각기 다른 플랫폼의 로그인 및 계정 관리 API를 공통된 함수 호출로 사용할 수 있게 해줍니다.
* **계정 정보 관리 (Account Information Management)**:
	플레이어의 고유 ID, 닉네임, 이메일 주소 등의 계정 정보를 플랫폼으로부터 가져오는 기능을 제공합니다.
* **로그인 상태 관리 (Login State Management)**:
	플레이어의 로그인 상태를 확인하고, 로그인/로그아웃 작업을 수행할 수 있습니다.

### **2. 핵심 함수**
> **지정된 사용자 번호(LocalUserNum)로 로그인합니다. 실무 팁: 기본값과 런타임 영향부터 확인하세요.**
* **`Login(int32 LocalUserNum, const FOnlineAccountCredentials& AccountCredentials, ...)`**:
	지정된 사용자 번호(LocalUserNum)로 로그인합니다. `AccountCredentials`에는 플랫폼별로 필요한 사용자 이름, 비밀번호, 인증 토큰 등이 포함됩니다.
* **`Logout(int32 LocalUserNum)`**:
	지정된 사용자 번호(LocalUserNum)로 로그아웃합니다.
* **`GetUniquePlayerId(int32 LocalUserNum)`**:
	지정된 사용자 번호(LocalUserNum)에 해당하는 플레이어의 고유 ID([[FUniqueNetId]])를 반환합니다.
* **`GetPlayerNickname(int32 LocalUserNum)`**:
	지정된 사용자 번호(LocalUserNum)에 해당하는 플레이어의 닉네임을 반환합니다.

### **3. 사용 방법**
> **// Online Subsystem 인스턴스를 가져옵니다. 실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.**
```cpp
// Online Subsystem 인스턴스를 가져옵니다.
IOnlineSubsystem* Subsystem = IOnlineSubsystem::Get();
if (Subsystem)
{
    // Identity 인터페이스를 가져옵니다.
    IOnlineIdentityPtr Identity = Subsystem->GetIdentityInterface();
    if (Identity.IsValid())
    {
        // 로그인 시도
        FOnlineAccountCredentials Credentials(TEXT("Type"), TEXT("Username"), TEXT("Password"));
        Identity->Login(0, Credentials);
    }
}
```
이 인터페이스의 함수들은 대부분 비동기적으로 작동하므로, 결과를 처리하기 위해 델리게이트를 바인딩해야 합니다.

### **4. 관련 클래스 및 구조체**
> **이 인터페이스를 포함한 모든 온라인 기능에 대한 접근점을 제공합니다. 실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.**
* **[[Online Subsystem]]**:
	이 인터페이스를 포함한 모든 온라인 기능에 대한 접근점을 제공합니다.
* **[[FUniqueNetId]]**:
	온라인상의 플레이어를 고유하게 식별하는 ID입니다.
* **`FOnlineAccountCredentials`**:
	로그인에 필요한 사용자 이름, 비밀번호, 인증 토큰 등을 담는 구조체입니다.

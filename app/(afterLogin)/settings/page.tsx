"use client"

import { useState } from 'react';
import { Card } from '@/app/_components/settings/Card';

import { Input } from '@/app/_components/settings/Input';
import { Button } from '@/app/_components/settings/Button';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Tabs } from '@/app/_components/settings/Tabs';
export default function SettingsPage() {
  const { activeTab } = useSettingsStore();
  
  // 나머지 상태들
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userRole, setUserRole] = useState('일반 사용자');

  // 핸들러 함수들
  const handleNicknameChange = () => {
    if (!nickname) return alert('닉네임을 입력해주세요');
    // API 호출
    console.log('닉네임 변경:', nickname);
  };

  const handleEmailVerification = () => {
    if (!email) return alert('이메일을 입력해주세요');
    // API 호출
    console.log('이메일 인증:', email);
  };

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return alert('모든 비밀번호 필드를 입력해주세요');
    }
    if (newPassword !== confirmPassword) {
      return alert('새 비밀번호가 일치하지 않습니다');
    }
    // API 호출
    console.log('비밀번호 변경');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-900 min-h-screen text-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-100">계정 설정</h1>
      
      <Tabs>
        <Tabs.List>
          <Tabs.Tab value="profile">프로필 설정</Tabs.Tab>
          <Tabs.Tab value="security">보안</Tabs.Tab>
          <Tabs.Tab value="permissions">권한 설정</Tabs.Tab>
        </Tabs.List>

        <div className="mt-6">
          {activeTab === 'profile' && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">프로필 설정</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 mb-2 block">닉네임</label>
                  <Input 
                    placeholder="새로운 닉네임을 입력하세요" 
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                </div>
                <Button onClick={handleNicknameChange}>닉네임 변경</Button>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">보안 설정</h2>
              <div className="space-y-6">
                <div>
                  <label className="text-gray-300 mb-2 block">이메일</label>
                  <Input 
                    type="email" 
                    placeholder="이메일 주소" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button 
                    className="mt-3"
                    onClick={handleEmailVerification}
                  >
                    이메일 인증
                  </Button>
                </div>
                <div className="space-y-3">
                  <label className="text-gray-300 mb-2 block">비밀번호 변경</label>
                  <Input 
                    type="password" 
                    placeholder="현재 비밀번호" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <Input 
                    type="password" 
                    placeholder="새 비밀번호" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Input 
                    type="password" 
                    placeholder="새 비밀번호 확인" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Button 
                    className="mt-3"
                    onClick={handlePasswordChange}
                  >
                    비밀번호 변경
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'permissions' && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">권한 설정</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-700 rounded-lg">
                  <p className="text-gray-300">현재 사용자 권한: {userRole}</p>
                  <p className="text-gray-400 text-sm mt-2">
                    권한 변경이 필요한 경우 관리자에게 문의하세요.
                  </p>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">권한 설명</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• 일반 사용자: 기본적인 서비스 이용</li>
                    <li>• 프리미엄 사용자: 추가 기능 사용 가능</li>
                    <li>• 관리자: 시스템 관리 권한</li>
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </div>
      </Tabs>
    </div>
  );
} 
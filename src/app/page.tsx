'use client';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from 'next/navigation'

export default function Home() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('이름을 입력해주세요!');
      return;
    }

    const trimmedName = name.trim();
    if (trimmedName === '박종민') {
      localStorage.setItem('isSpecialUser', 'true');
      localStorage.setItem('currentUser', trimmedName);
      // 약간의 지연 후 페이지 이동
      setTimeout(() => {
        router.push('/fortune');
      }, 100);
    } else {
      localStorage.removeItem('isSpecialUser');
      localStorage.setItem('currentUser', trimmedName);
      router.push('/fortune');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(to bottom, #1a1a2e, #16213e)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0 1rem'
      }}>
        <div style={{
          width: '100%',
          textAlign: 'center',
          marginBottom: '-0.25rem'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            letterSpacing: '0.05em',
            display: 'inline-block',
            lineHeight: '1.2'
          }}>
            Fortune Teller
          </h1>
        </div>
        <p style={{
          fontSize: '1.5rem',
          color: '#cbd5e1',
          textAlign: 'center',
          width: '100%',
          lineHeight: '1.2',
          marginBottom: '0.5rem'
        }}>
          오늘의 운세
        </p>
        <Input
          type="text"
          placeholder="이름을 입력해주세요"
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '0.5rem',
            color: 'white',
            textAlign: 'center',
            fontSize: '1rem',
            marginBottom: '0.5rem'
          }}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
        />
        <Button
          onClick={handleSubmit}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            padding: '0.75rem 2rem',
            fontSize: '1.25rem',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            width: 'auto',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
          }}
        >
          운세 보기
        </Button>
      </div>
    </div>
  );
}
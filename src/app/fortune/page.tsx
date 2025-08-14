'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// 운세 데이터를 직접 컴포넌트에 포함
const LUCKY_COLORS = [
  {
    name: "빨간색",
    message: "열정과 에너지가 넘치는 날입니다",
    color: "#FF4D4D",
    textColor: "white"
  },
  {
    name: "파란색",
    message: "평화롭고 안정적인 하루가 될 것입니다",
    color: "#4D79FF",
    textColor: "white"
  },
  {
    name: "노란색",
    message: "긍정적인 기운이 가득한 날입니다",
    color: "#FFD700",
    textColor: "black"
  },
  {
    name: "초록색",
    message: "새로운 시작과 성장의 기회가 있습니다",
    color: "#4CAF50",
    textColor: "white"
  },
  {
    name: "보라색",
    message: "창의력이 돋보이는 날입니다",
    color: "#9C27B0",
    textColor: "white"
  },
  {
    name: "주황색",
    message: "사교성이 좋아지는 날입니다",
    color: "#FF9800",
    textColor: "black"
  },
  {
    name: "분홍색",
    message: "사랑과 행복이 가득한 날입니다",
    color: "#FF69B4",
    textColor: "white"
  },
  {
    name: "흰색",
    message: "순수한 마음으로 시작하는 날입니다",
    color: "#FFFFFF",
    textColor: "black"
  }
];

const WARNING_ITEMS = [
  "날카로운 물건 - 오늘은 조심해서 다루세요",
  "유리잔 - 깨지기 쉬운 물건을 조심하세요",
  "계단 - 오르내릴 때 특히 주의하세요",
  "뜨거운 음료 - 화상을 조심하세요",
  "자동차 - 이동 시 안전에 유의하세요",
  "전자기기 - 고장이나 오작동을 조심하세요",
  "우산 - 날씨 변화에 대비하세요",
  "신발 - 발을 헛디딜 수 있으니 조심하세요"
];

const FORTUNES = {
  special: [
    "대머리가 반짝반짝 빛나는 날입니다",
    "오늘은 햇빛이 강하니 두피 선크림을 바르세요",
    "탈모 예방 샴푸가 특가인 날입니다",
    "대머리의 매력이 빛을 발하는 날입니다",
    "오늘은 모자를 쓰지 않아도 좋습니다",
    "오늘은 강한 자외선으로 두피가 탈 수 있습니다",
    "가발이 날아갈 수 있으니 조심하세요",
    "머리카락이 더 빠질 수 있는 날입니다",
    "탈모 샴푸값이 오를 수 있습니다",
    "두피 마사지를 미루는 것이 좋습니다"
  ],
  normal: {
    positive: [
      "당신의 긍정적인 에너지가 주변 사람들에게 좋은 영향을 미칠 것입니다",
      "오늘 만난 인연이 특별한 의미로 발전할 수 있습니다",
      "계획했던 일이 순조롭게 진행될 것입니다",
      "새로운 기회가 당신을 기다리고 있습니다",
      "당신의 노력이 곧 결실을 맺을 것입니다"
    ],
    negative: [
      "오늘은 중요한 결정을 미루는 것이 좋습니다",
      "예상치 못한 지출이 발생할 수 있습니다",
      "계획했던 일이 지연될 수 있습니다",
      "주변 사람들과의 의견 충돌에 주의하세요",
      "건강 관리에 특별한 주의가 필요합니다"
    ],
    golden: "행운의 여신이 당신과 함께합니다. 모든 일이 뜻대로 이루어질 것입니다!",
    bloody: "불길한 기운이 감돌고 있습니다. 오늘은 모든 일을 조심스럽게 하세요..."
  },
  specialGolden: "오늘은 머리카락이 자라날지도 모르겠습니다!!! 댑악!!",
  specialBloody: "결국 마지막 한가닥이 빠질 날이 오고야 말았습니다."
};

type FortuneType = 'positive' | 'negative';
type SpecialType = 'golden' | 'bloody';

interface Fortune {
  text: string;
  type: FortuneType;
  isSpecial?: SpecialType;
}

type TabType = 'card' | 'number' | 'color' | 'warning';

interface LuckyColor {
  name: string;
  message: string;
  color: string;
  textColor: string;
}

export default function FortunePage() {
  const router = useRouter();
  const [selectedFortunes, setSelectedFortunes] = useState<Fortune[]>([]);
  const [remainingPicks, setRemainingPicks] = useState(3);
  const [isSpecialUser, setIsSpecialUser] = useState(false);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [availableFortunes, setAvailableFortunes] = useState<Fortune[]>([]);
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('card');
  const [luckyNumber, setLuckyNumber] = useState<number | null>(null);
  const [luckyColor, setLuckyColor] = useState<LuckyColor | null>(null);
  const [warningItem, setWarningItem] = useState<string | null>(null);

  const shuffleArray = useCallback(<T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  useEffect(() => {
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        router.push('/');
        return;
      }

      const special = currentUser === '박종민';
      console.log('User check:', { currentUser, special }); // 디버깅용

      setUserName(currentUser);
      setIsSpecialUser(special);
      setRemainingPicks(special ? 10 : 3);

      // 운세 생성
      if (special) {
        const shuffledFortunes = shuffleArray(FORTUNES.special);
        const mappedFortunes: Fortune[] = shuffledFortunes.map((text, index) => ({
          text,
          type: index < FORTUNES.special.length / 2 ? 'positive' as FortuneType : 'negative' as FortuneType
        }));

        // 특별 사용자의 황금/피묻은 카드 중 하나만 랜덤하게 추가
        const specialCard = Math.random() < 0.5 ? {
          text: FORTUNES.specialGolden,
          type: 'positive' as FortuneType,
          isSpecial: 'golden' as const
        } : {
          text: FORTUNES.specialBloody,
          type: 'negative' as FortuneType,
          isSpecial: 'bloody' as const
        };
        
        mappedFortunes.push(specialCard);
        setAvailableFortunes(shuffleArray(mappedFortunes));
      } else {
        // 일반 사용자 운세 생성
        const positiveCount = Math.floor(Math.random() * 2) + 2; // 2-3개의 긍정적 운세
        const negativeCount = 3 - positiveCount; // 나머지는 부정적 운세

        const shuffledPositive = shuffleArray([...FORTUNES.normal.positive]);
        const shuffledNegative = shuffleArray([...FORTUNES.normal.negative]);

        const mappedFortunes: Fortune[] = [
          ...shuffledPositive.slice(0, positiveCount).map(text => ({
            text,
            type: 'positive' as FortuneType
          })),
          ...shuffledNegative.slice(0, negativeCount).map(text => ({
            text,
            type: 'negative' as FortuneType
          }))
        ];

        // 황금 카드와 피묻은 카드 중 하나만 랜덤하게 추가
        const specialCard = Math.random() < 0.5 ? {
          text: FORTUNES.normal.golden,
          type: 'positive' as FortuneType,
          isSpecial: 'golden' as const
        } : {
          text: FORTUNES.normal.bloody,
          type: 'negative' as FortuneType,
          isSpecial: 'bloody' as const
        };
        
        mappedFortunes.push(specialCard);
        setAvailableFortunes(shuffleArray(mappedFortunes));
      }
    } catch (error) {
      console.error('Error in useEffect:', error);
    }
  }, [router, shuffleArray]);

  const handleCardClick = (index: number) => {
    if (selectedCards.includes(index) || remainingPicks === 0) return;

    const randomIndex = Math.floor(Math.random() * availableFortunes.length);
    const selectedFortune = availableFortunes[randomIndex];

    const newAvailableFortunes = [...availableFortunes];
    newAvailableFortunes.splice(randomIndex, 1);

    setAvailableFortunes(newAvailableFortunes);
    setSelectedFortunes(prev => [...prev, selectedFortune]);
    setSelectedCards(prev => [...prev, index]);
    setRemainingPicks(prev => prev - 1);
  };

  const generateLuckyNumber = useCallback(() => {
    const baseNumber = Math.floor(Math.random() * 100) + 1;
    setLuckyNumber(baseNumber);
  }, []);

  const generateLuckyColor = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * LUCKY_COLORS.length);
    setLuckyColor(LUCKY_COLORS[randomIndex]);
  }, []);

  const generateWarningItem = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * WARNING_ITEMS.length);
    setWarningItem(WARNING_ITEMS[randomIndex]);
  }, []);

  useEffect(() => {
    if (activeTab === 'number' && luckyNumber === null) {
      generateLuckyNumber();
    } else if (activeTab === 'color' && luckyColor === null) {
      generateLuckyColor();
    } else if (activeTab === 'warning' && warningItem === null) {
      generateWarningItem();
    }
  }, [activeTab, luckyNumber, luckyColor, warningItem, generateLuckyNumber, generateLuckyColor, generateWarningItem]);

  const getCardStyle = (index: number) => {
    if (!selectedCards.includes(index)) {
      return {
        border: '2px solid rgba(0, 0, 0, 0.6)',
        background: 'rgba(0, 0, 0, 0.4)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
      };
    }

    const fortune = selectedFortunes[selectedCards.indexOf(index)];
    
    if (fortune.isSpecial === 'golden') {
      return {
        border: '2px solid rgba(255, 215, 0, 0.8)',
        background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(255, 223, 0, 0.4))',
        boxShadow: '0 0 20px rgba(255, 215, 0, 0.5), inset 0 0 10px rgba(255, 215, 0, 0.3)',
        animation: 'golden-pulse 2s infinite'
      };
    } else if (fortune.isSpecial === 'bloody') {
      return {
        border: '2px solid rgba(139, 0, 0, 0.8)',
        background: 'linear-gradient(45deg, rgba(139, 0, 0, 0.3), rgba(80, 0, 0, 0.5))',
        boxShadow: '0 0 20px rgba(139, 0, 0, 0.5), inset 0 0 10px rgba(139, 0, 0, 0.3)',
        animation: 'bloody-pulse 2s infinite'
      };
    }

    return {
      border: `2px solid ${fortune.type === 'positive' ? 'rgba(74, 222, 128, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
      background: 'rgba(0, 0, 0, 0.7)',
      boxShadow: 'none'
    };
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #1a1a2e, #16213e)',
      padding: '3rem 1rem'
    }}>
      <style>
        {`
          @keyframes golden-pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          @keyframes bloody-pulse {
            0% { transform: scale(1); filter: brightness(1); }
            50% { transform: scale(1.05); filter: brightness(0.8); }
            100% { transform: scale(1); filter: brightness(1); }
          }
        `}
      </style>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
        color: 'white'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          marginBottom: '1rem'
        }}>
          {userName}님의 운세
        </h2>
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '2rem',
          padding: '0.5rem',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '0.5rem',
          justifyContent: 'center',
          maxWidth: '600px',
          margin: '0 auto 2rem'
        }}>
          {(['card', 'number', 'color', 'warning'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                backgroundColor: activeTab === tab ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '1rem'
              }}
            >
              {tab === 'card' && '카드운세'}
              {tab === 'number' && '행운의 숫자'}
              {tab === 'color' && '행운의 색상'}
              {tab === 'warning' && '주의사항'}
            </button>
          ))}
        </div>
        {activeTab === 'card' && (
          <h3 style={{
            fontSize: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            남은 선택 {remainingPicks}회
          </h3>
        )}
        {activeTab === 'card' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            padding: '1rem'
          }}>
            {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(index)}
              style={{
                aspectRatio: '3/4',
                borderRadius: '0.75rem',
                cursor: selectedCards.includes(index) ? 'default' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                textAlign: 'center',
                ...getCardStyle(index)
              }}
              onMouseOver={(e) => {
                if (!selectedCards.includes(index)) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.4)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseOut={(e) => {
                if (!selectedCards.includes(index)) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.6)';
                }
              }}
            >
              {selectedCards.includes(index) ? (
                <p style={{ 
                  color: 'white', 
                  fontSize: selectedFortunes[selectedCards.indexOf(index)].isSpecial ? '1.2rem' : '1rem',
                  lineHeight: '1.5',
                  fontWeight: selectedFortunes[selectedCards.indexOf(index)].isSpecial ? 'bold' : 'normal',
                  textShadow: selectedFortunes[selectedCards.indexOf(index)].isSpecial === 'golden' 
                    ? '0 0 10px rgba(255, 215, 0, 0.5)'
                    : selectedFortunes[selectedCards.indexOf(index)].isSpecial === 'bloody'
                    ? '0 0 10px rgba(139, 0, 0, 0.5)'
                    : 'none'
                }}>
                  {selectedFortunes[selectedCards.indexOf(index)].text}
                </p>
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(45deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3))',
                  borderRadius: '0.5rem'
                }}></div>
              )}
            </div>
          ))}
          </div>
        )}
        {activeTab === 'number' && (
          <div style={{
            padding: '2rem',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '1rem',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>오늘의 행운의 숫자</h3>
            <p style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold',
              color: 'rgba(255, 215, 0, 0.8)',
              textShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
            }}>{luckyNumber}</p>
            <button
              onClick={generateLuckyNumber}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '0.5rem',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              다시 뽑기
            </button>
          </div>
        )}
        {activeTab === 'color' && (
          <div style={{
            padding: '2rem',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '1rem',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>오늘의 행운의 색상</h3>
            {luckyColor && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '150px',
                  height: '150px',
                  backgroundColor: luckyColor.color,
                  borderRadius: '50%',
                  border: '4px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 0 20px ' + luckyColor.color + '80',
                  marginBottom: '1rem'
                }} />
                <h4 style={{
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  color: luckyColor.color,
                  textShadow: '0 0 10px ' + luckyColor.color + '80'
                }}>
                  {luckyColor.name}
                </h4>
                <p style={{ 
                  fontSize: '1.2rem',
                  marginBottom: '1rem',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}>
                  {luckyColor.message}
                </p>
                <button
                  onClick={generateLuckyColor}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid ' + luckyColor.color,
                    borderRadius: '0.5rem',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = luckyColor.color + '40';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  다시 뽑기
                </button>
              </div>
            )}
          </div>
        )}
        {activeTab === 'warning' && (
          <div style={{
            padding: '2rem',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '1rem',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>오늘의 주의사항</h3>
            <p style={{ 
              fontSize: '1.5rem',
              marginBottom: '1rem',
              color: 'rgba(255, 99, 71, 0.9)',
              textShadow: '0 0 10px rgba(255, 99, 71, 0.3)'
            }}>{warningItem}</p>
            <button
              onClick={generateWarningItem}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '0.5rem',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              다시 뽑기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
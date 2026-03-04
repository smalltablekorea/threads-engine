// pages/index.js
import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';

// ═══════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════
const THREADS_APP_ID = process.env.NEXT_PUBLIC_THREADS_APP_ID || '2357613188074092';
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI || 'https://threads-engine-app.vercel.app/api/auth';
const SCOPES = 'threads_basic,threads_content_publish,threads_read_replies,threads_manage_replies';
const OAUTH_URL = `https://threads.net/oauth/authorize?client_id=${THREADS_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${SCOPES}&response_type=code`;
const CTA_LINK = 'https://naver.me/FIfliP1l';

// ═══════════════════════════════════════════════════
// 후킹 콘텐츠 데이터 (16개 카테고리)
// ═══════════════════════════════════════════════════
const POSTS_DB = [
  {
    cat:"비용 폭로",
    hook:"30평 인테리어 3천만원이면 싸다고요?\n업체들이 절대 안 알려주는 견적의 비밀",
    body:"솔직히 말할게요.\n\n인테리어 업체 10곳에 견적 넣으면\n같은 평수인데 2천~5천까지 차이 납니다.\n\n왜 이렇게 차이가 날까요?\n\n답은 '빠진 항목'에 있습니다.\n싸 보이는 견적일수록 나중에 추가금이 폭발해요.\n\n제가 현장에서 본 추가금 폭탄 TOP 3:\n→ 철거비 별도\n→ 전기 배선 변경 미포함\n→ 욕실 방수 추가\n\n이거 모르고 계약하면 최소 500만원은 더 나갑니다.\n\n#인테리어견적 #인테리어비용 #아파트리모델링",
    comments: [
      `🏠 인테리어 견적, 제대로 비교하고 싶다면?\n스몰테이블에서 무료 견적 상담 받아보세요.\n항목 하나하나 투명하게 설명해드립니다.\n\n👉 공사 신청: ${CTA_LINK}`,
      "💡 견적서에서 꼭 확인할 3가지:\n1. 철거비가 포함인지 별도인지\n2. 전기/설비 변경 범위가 명시됐는지\n3. 마감재 브랜드와 등급이 적혀있는지\n\n이 3개만 체크해도 바가지 90% 방지됩니다.",
      "⚠️ '패키지 인테리어'라는 말에 속지 마세요.\n대부분 최저가 자재 기준이고,\n조금만 바꿔도 추가금이 발생합니다.\n\n패키지 = 기본값이라는 걸 기억하세요.",
      "📊 평수별 인테리어 현실 가격대 (2026 기준):\n20평대: 2,500~4,000만원\n30평대: 3,500~6,000만원\n40평대: 5,000~8,000만원\n\n이 범위를 크게 벗어나면 의심해보세요.",
    ],
  },
  {
    cat:"욕실 시공",
    hook:"욕실 방수 잘못하면 아랫집에 누수됩니다.\n시공업체가 숨기는 진짜 방수 공정",
    body:"욕실 리모델링에서 가장 중요한 게 뭘까요?\n\n타일? 세면대? 아닙니다.\n\n'방수'입니다.\n\n방수를 대충 하면 6개월 뒤 아랫집 천장에 물이 새요.\n수리비 + 보상비 = 최소 300만원.\n\n제대로 된 방수:\n1단계: 기존 방수 완전 제거\n2단계: 액체 방수 2회 도포 (24시간 간격)\n3단계: 시트 방수 추가 (벽면 30cm 이상)\n4단계: 48시간 담수 테스트\n\n이 중 하나라도 빠지면 그 업체는 거르세요.\n\n#욕실리모델링 #욕실방수 #인테리어시공",
    comments: [
      `🔧 욕실 시공, 확실하게 하고 싶다면?\n스몰테이블은 방수 공정만 3단계로 진행합니다.\n담수 테스트 사진까지 공유해드려요.\n\n👉 무료 상담 신청: ${CTA_LINK}`,
      "💡 방수 업체 고를 때 꼭 물어볼 질문:\n\"방수를 몇 회 도포하시나요?\"\n\"담수 테스트는 몇 시간 하시나요?\"\n\"방수 하자 보증기간은요?\"\n\n3개 중 하나라도 명확하게 못 답하면 패스하세요.",
      "🚿 건식 욕실 vs 습식 욕실 선택 팁:\n가족 중 어르신 → 습식 (건식은 미끄러움)\n1~2인 가구 → 건식 (관리 편함)\n아이 있는 집 → 반건식 추천\n\n무조건 건식이 좋은 게 아닙니다.",
      "📏 욕실 타일 선택 조언:\n바닥: 무광 + 논슬립 필수 (300x300 추천)\n벽면: 유광도 OK, 크기 자유\n포인트: 1면만. 4면 다 다르면 어지러워요.\n\n타일 가격은 장당이 아니라 m² 단가로 비교하세요.",
    ],
  },
  {
    cat:"주방 혁신",
    hook:"주방 상판 하나 잘못 고르면\n10년 동안 매일 후회합니다",
    body:"엔지니어드스톤, 세라믹, 천연 대리석, 스테인리스.\n주방 상판 종류가 너무 많죠?\n\n근데 대부분 '예쁜 것'만 보고 골라요.\n문제는 6개월 후부터 시작됩니다.\n\n✗ 천연 대리석: 예쁘지만 산성 음식에 부식\n✗ 하이막스: 저렴하지만 열에 약함\n✗ 세라믹: 내구성 최고지만 가격이...\n✓ 엔지니어드스톤: 가성비 + 내구성 균형\n\n솔직히 일반 가정에서는 엔지니어드스톤이 가장 현실적입니다.\n근데 여기서도 등급 차이가 큽니다.\n\n#주방인테리어 #주방상판 #인테리어자재",
    comments: [
      `🍳 주방 상판 고민 중이시라면?\n스몰테이블에서 자재 샘플 직접 비교해보세요.\n실물을 봐야 정확한 판단이 됩니다.\n\n👉 상담 신청: ${CTA_LINK}`,
      "💰 상판 소재별 현실 가격 (2026 기준, m²당):\n하이막스: 15~25만원\n엔지니어드스톤: 25~45만원\n세라믹: 40~80만원\n천연 대리석: 50~100만원+\n\n상판 면적 보통 2~3m²이니 곱해보세요.",
      "🔥 상판 관리 꿀팁:\n뜨거운 냄비 직접 올리지 마세요 (받침 필수)\n칼질은 반드시 도마 위에서\n레몬즙/식초 묻으면 즉시 닦기\n\n이것만 지켜도 상판 수명 2배 늘어납니다.",
      "⚠️ 상판 시공 시 주의할 점:\n싱크볼 연결부 실리콘 처리가 핵심입니다.\n여기서 물이 새면 하부장 전체가 썩어요.\n\n시공 후 반드시 물 흘려서 누수 테스트하세요.",
    ],
  },
  {
    cat:"거실 변신",
    hook:"거실이 좁아 보이는 건\n평수 문제가 아니라 '이것' 때문입니다",
    body:"25평 거실인데 넓어 보이는 집 있고\n35평인데 답답한 집 있잖아요.\n\n차이는 단 3가지:\n\n1. 바닥재 컬러 → 밝은 톤 = 넓어 보임\n2. 가구 다리 → 다리 있는 가구 = 바닥 보여서 넓어 보임\n3. 커튼 위치 → 천장~바닥 = 층고 높아 보임\n\n이 3개만 바꿔도 체감 면적이 달라집니다.\n\n#거실인테리어 #공간활용 #좁은거실",
    comments: [
      `✨ 우리 집 거실, 어떻게 바꿔야 할지 모르겠다면?\n스몰테이블이 3D 시뮬레이션으로 보여드립니다.\n시공 전에 완성 모습을 미리 확인하세요.\n\n👉 무료 상담: ${CTA_LINK}`,
      "🎨 거실 벽 컬러 선택 공식:\n남향 = 쿨톤 (블루그레이, 민트)\n북향 = 웜톤 (아이보리, 베이지)\n\n자연광 방향에 따라 같은 색도 완전 다르게 보입니다.",
      "💡 간접조명 배치 꿀팁:\nTV 뒤 + 소파 위 커브조명 조합이 가장 효과적.\n색온도는 3000K 통일하세요.\n\n조명만 바꿔도 셀프 인테리어 효과 80%입니다.",
      "🛋️ 소파 사이즈 선택 현실:\n25평 이하: 2.5인용 (2000mm 이하)\n30평대: 3인용 (2200~2600mm)\n35평+: L형 가능\n\n거실 폭에서 소파 빼고 최소 800mm 남아야 동선 확보.",
    ],
  },
  {
    cat:"시공 순서",
    hook:"인테리어 시공 순서 잘못 잡으면\n완성된 벽 뜯어내야 합니다 (실화)",
    body:"타일 먼저 했는데 배관 위치가 안 맞아서\n방금 붙인 타일 다시 뜯는 경우.\n\n올바른 시공 순서:\n철거 → 설비(배관/전기) → 방수 → 목공\n→ 타일 → 도배/페인트 → 바닥 → 가구 → 조명\n\n이 순서를 어기면 100% 재시공 발생합니다.\n\n'설비'를 타일 뒤에 하겠다는 업체는 즉시 재고하세요.\n\n#인테리어시공 #시공순서 #리모델링순서",
    comments: [
      `📋 시공 순서부터 일정 관리까지\n스몰테이블이 체계적으로 관리해드립니다.\n매일 현장 사진 + 진행 보고까지.\n\n👉 공사 신청: ${CTA_LINK}`,
      "⏱️ 평수별 현실적인 시공 기간:\n20평대: 3~4주\n30평대: 4~5주\n40평대: 5~7주\n\n\"2주 만에 해드릴게요\" → 대충 한다는 뜻입니다.",
      "🔨 철거 시 반드시 확인할 것:\n1. 내력벽 여부 (구조도면 확인)\n2. 석면 포함 자재 여부\n3. 배관 위치 사전 확인\n\n내력벽 철거하면 건물 전체 안전 문제입니다.",
      "📱 시공 중 소통 팁:\n매일 오후 5시 현장 사진 받기 요청하세요.\n카톡보다 노션이나 밴드가 기록 관리에 좋아요.\n\n문제 생겼을 때 증거가 됩니다.",
    ],
  },
  {
    cat:"도배 진실",
    hook:"도배 한 번에 100만원?\n업체가 말 안 해주는 도배의 진실",
    body:"도배지 종류에 따라 결과가 천지차이:\n\n합지: 저렴(롤당 5천원~) but 오래 못 감\n실크: 내구성 좋음(롤당 1.5만원~) 물 닦기 가능\n광폭: 이음새 없음(롤당 3만원~) 고급스러움\n\n30평 기준 도배 비용:\n합지: 60~80만원\n실크: 100~150만원\n광폭: 150~250만원\n\n합지는 2~3년이면 눌러앉고 때가 탑니다.\n최소 실크 이상 추천합니다.\n\n#도배 #도배지 #인테리어자재",
    comments: [
      `🎨 도배지 실물 보고 결정하고 싶다면?\n스몰테이블 방문 시 100가지 이상 샘플 비교 가능.\n공간별 최적 도배지 추천해드립니다.\n\n👉 상담 신청: ${CTA_LINK}`,
      "💡 도배 시공 전 꼭 알아야 할 것:\n순서: 목공 → 페인트 → 도배\n페인트 먼저 하고 도배하면 접착력 떨어집니다.\n\n겨울 시공 시 실내 온도 15도 이상 유지해야 풀이 잘 붙어요.",
      "⚠️ 곰팡이 벽에 그냥 도배하면 안 됩니다.\n3개월 후 다시 올라옵니다.\n반드시 곰팡이 제거 → 방곰팡이 처리 → 도배 순서.",
      "🏷️ 도배지 고를 때 팁:\n아이 방: 항균 기능성 도배지\n거실: 실크 or 광폭\n안방: 포인트 벽 한 면만 패턴\n\n전체 패턴은 어지러워요. 포인트 한 면이 정답.",
    ],
  },
  {
    cat:"수납 혁명",
    hook:"수납 부족?\n가구를 더 사는 게 아니라 '이렇게' 해야 합니다",
    body:"가구를 '놓는' 게 아니라 벽에 '심는' 개념으로 바꾸세요.\n\n1. 현관: 슬라이딩 신발장 (깊이 300mm면 충분)\n2. 거실: TV장 대신 벽걸이 + 하부 수납\n3. 주방: 상부장 천장까지 올리기\n4. 침실: 붙박이장 > 독립 장농 (공간 30% 절약)\n\n같은 면적에서 수납량 2배 차이 납니다.\n\n#수납인테리어 #수납아이디어 #정리정돈",
    comments: [
      `📦 우리 집에 맞는 수납 설계가 궁금하다면?\n스몰테이블이 평면도 기반으로 최적 수납 제안해드립니다.\n1cm 단위로 맞춤 설계합니다.\n\n👉 무료 상담: ${CTA_LINK}`,
      "💡 붙박이장 vs 시스템장:\n붙박이장: 공간 효율 최고, 이사 시 못 가져감\n시스템장: 이사 가능, 자투리 공간 발생\n\n자가 → 붙박이장 추천 / 전세 → 시스템장이 현실적.",
      "🚪 현관 수납 극대화:\n신발장 하부 20cm 띄워서 실내화 공간\n상부에 계절 신발\n벽면 후크로 열쇠/우산\n\n현관이 깔끔하면 집 전체가 달라 보입니다.",
      "📐 드레스룸 최소 규격:\n폭 1.6m+ → 양쪽 수납 가능\n폭 1.2m → 한쪽만 (행거+선반)\n\n작은 방 하나를 전환하면 침실 수납 스트레스 해결.",
    ],
  },
  {
    cat:"조명 마법",
    hook:"조명 하나 바꿨을 뿐인데\n집 전체가 호텔처럼 변했습니다",
    body:"인테리어에서 가장 가성비 좋은 변화?\n단연 '조명'.\n\n호텔 느낌의 비밀:\n→ 메인 조명 없애고\n→ 간접조명 + 포인트 조명으로 교체\n\n• 거실: 레일조명 + TV 뒤 간접등\n• 주방: 싱크대 위 펜던트 + 하부장 아래 LED바\n• 침실: 헤드보드 간접등 + 무드등\n\n비용? 20만원이면 거실 조명 완전 교체 가능.\n\n#조명인테리어 #간접조명 #셀프인테리어",
    comments: [
      `💡 조명 설계부터 시공까지 한 번에?\n스몰테이블은 조명 배치도를 3D로 미리 보여드립니다.\n시공 후 '이게 아닌데...' 가 없어요.\n\n👉 상담 신청: ${CTA_LINK}`,
      "🔆 색온도 가이드:\n2700K: 따뜻한 노란빛 (침실, 거실)\n3000K: 내추럴 웜 (가장 범용적)\n4000K: 밝은 백색 (주방, 서재)\n\n한 집에 색온도 통일이 핵심입니다.",
      "💰 셀프 조명 교체 예산:\n거실 레일조명: 8~15만원\nTV 뒤 LED 스트립: 1~3만원\n주방 펜던트: 5~10만원\n\n배선 변경 없이 교체 가능한 것들입니다.",
      "⚠️ 매입등 설치 주의:\n간격: 최소 900mm\n개수: 거실 기준 6~8개면 충분\n\n\"많을수록 좋다\"는 잘못된 상식. 적절한 간격이 고급스러움의 핵심.",
    ],
  },
  {
    cat:"바닥재 비교",
    hook:"마루 vs 타일 vs 장판\n10년 뒤 후회 안 하는 선택법",
    body:"바닥재, 한 번 시공하면 최소 10년.\n\n🔹 강화마루: 가성비 최고, 물에 약함\n🔹 강마루: 내구성+디자인 균형\n🔹 타일: 물/열에 강함, 차가움\n🔹 장판: 가장 저렴, 고급감 부족\n\n결론: 강마루가 가장 무난한 선택.\n\n#바닥재 #마루시공 #인테리어자재",
    comments: [
      `🏠 바닥재 실물 비교하고 싶다면?\n스몰테이블에서 자재 샘플 50종 이상 비교 가능.\n\n👉 무료 견적 상담: ${CTA_LINK}`,
      "💰 바닥재 가격 (m²당):\n강화마루: 3~5만원\n강마루: 6~12만원\n원목마루: 15~30만원\n포세린 타일: 5~15만원\n\n30평 바닥 면적 약 65m²로 계산하세요.",
      "🐾 반려동물 가정이라면:\n원목마루 절대 비추 (스크래치)\n강마루 or 타일이 현실적.\n미끄럼 방지 코팅 여부 꼭 확인하세요.",
      "🌡️ 바닥 난방 궁합:\n온돌에 최적: 강마루 > 강화마루 > 타일\n원목마루는 뒤틀림 위험\n\n난방 효율까지 생각하면 강마루가 최적.",
    ],
  },
  {
    cat:"업체 선정",
    hook:"인테리어 업체 고르기 전에\n이 질문 5개만 하세요. 사기 99% 방지됩니다",
    body:"❶ \"포트폴리오 현장 방문 가능한가요?\"\n❷ \"견적서에 자재 브랜드/등급 명시되나요?\"\n❸ \"추가금 발생 조건이 뭔가요?\"\n❹ \"하자 보수 기간과 범위는?\"\n❺ \"현재 진행 중인 현장이 몇 개인가요?\"\n\n이 5개 질문이 여러분의 돈을 지켜줍니다.\n\n#인테리어업체 #인테리어사기 #업체선정",
    comments: [
      `✅ 스몰테이블은 이 5가지에 모두 자신 있게 답합니다.\n투명한 견적, 현장 방문 환영, 서면 하자보증.\n\n👉 공사 상담: ${CTA_LINK}`,
      "📝 계약서 필수 항목:\n1. 총 금액 (부가세 포함 여부)\n2. 공사 기간 및 지체 패널티\n3. 자재 목록 (브랜드/등급/수량)\n4. 추가 비용 발생 조건\n5. 하자 보수 기간 (최소 1년)",
      "🚩 이런 업체는 즉시 거르세요:\n\"계약금 50% 이상 먼저 달라\"\n\"견적서는 시공 시작할 때 드릴게요\"\n\"다른 데보다 300만원 싸요\"",
      "💬 리뷰 보는 법:\n블로그 체험단 → 신뢰도 낮음\n네이버 카페 실사용 후기 → 참고할만함\n지인 추천 → 가장 신뢰도 높음\n\n전부 5점이면 오히려 의심하세요.",
    ],
  },
  {
    cat:"창호 교체",
    hook:"겨울에 외풍 심하다구요?\n보일러가 아니라 '창문'이 문제입니다",
    body:"집 전체 열손실의 40%가 창문을 통해 빠져나가요.\n\n10년 이상 된 창호라면\n교체만으로 난방비 30% 절감 가능합니다.\n\n1. 유리: 삼중 로이유리\n2. 프레임: PVC < 알루미늄 < 하이브리드\n3. 기밀성: 1등급 필수\n\n겨울 전에 바꾸세요.\n\n#창호교체 #단열 #에너지절약",
    comments: [
      `🪟 창호 교체 상담이 필요하다면?\n스몰테이블이 현장 실측 후 최적의 창호를 추천합니다.\n\n👉 무료 상담: ${CTA_LINK}`,
      "💰 창호 교체 가격:\n거실 대창 (삼중 로이): 80~150만원\n방 창문: 40~80만원\n30평 전체: 300~500만원\n\n난방비 절감하면 5년이면 회수.",
      "🌡️ 단열 등급 해석:\n열관류율 1.0 이하 → 우수\n1.5 이하 → 보통\n2.0 이상 → 교체 시급",
      "⚠️ 시공 후 우레탄 폼 충전이 핵심.\n프레임과 벽 사이 빈틈으로 바람 들어와요.\n\n향 연기 테스트로 기밀성 확인하세요.",
    ],
  },
  {
    cat:"트렌드",
    hook:"2026 인테리어 트렌드가 바뀌었습니다.\n더 이상 '이것'은 하지 마세요",
    body:"이제 안 하는 게 좋은 것들:\n✗ 온통 화이트 인테리어\n✗ 과한 간접조명\n✗ 인조대리석 느낌 바닥\n\n2026 트렌드:\n✓ 웜톤 내추럴 (베이지+우드)\n✓ 곡선형 디자인 (아치 도어, 라운드 가구)\n✓ 자연 소재 (원목, 석재, 린넨)\n✓ 포인트 컬러 벽 한 면\n✓ 숨은 수납\n\n핵심은 '자연스러움'과 '따뜻함'.\n\n#인테리어트렌드 #2026트렌드 #홈스타일링",
    comments: [
      `🏡 2026 트렌드 인테리어가 궁금하다면?\n스몰테이블이 트렌드 + 실용성을 동시에 잡아드립니다.\n\n👉 상담 신청: ${CTA_LINK}`,
      "🎨 추천 컬러 조합:\n① 크림화이트 + 월넛 + 카키\n② 라이트그레이 + 오크 + 테라코타\n③ 아이보리 + 라탄 + 올리브그린",
      "💡 트렌드 vs 클래식 균형:\n바닥재, 상판 = 클래식하게 (10년 사용)\n조명, 소품, 패브릭 = 트렌디하게 (쉽게 교체)\n\n기본 골격은 무난하게, 포인트만 트렌드로.",
      "🏠 인스타 감성의 현실:\n수납 없는 미니멀 → 3개월 후 어질러짐\n동선 무시한 배치 → 매일 불편\n\n예쁨 50% + 실용성 50%가 정답.",
    ],
  },
  {
    cat:"전기 배선",
    hook:"콘센트 위치 하나 잘못 잡으면\n10년간 멀티탭 지옥에 삽니다",
    body:"필수 콘센트 위치:\n\n🛋️ 거실: 소파 양쪽, TV 뒤 4구+, 로봇청소기 위치\n🍳 주방: 싱크대 위 2군데, 냉장고 전용\n🛏️ 침실: 침대 양 옆, 화장대, 드레스룸\n\n전기 배선은 시공 초반에 결정되고\n나중에 바꾸려면 벽을 뜯어야 해요.\n\n지금 메모해두세요.\n\n#전기배선 #콘센트위치 #인테리어설계",
    comments: [
      `⚡ 전기 배선 설계, 처음부터 제대로?\n스몰테이블은 생활 동선 기반 콘센트 배치도를 제공합니다.\n\n👉 무료 상담: ${CTA_LINK}`,
      "💡 USB 콘센트 추천 위치:\n침대 옆 (충전)\n서재 책상 뒤\n주방 카운터 위\n\nUSB-C 내장 콘센트가 요즘 나와요.",
      "⚠️ 에어컨, 전기오븐, 건조기는 전용 회로 필수.\n한 회로에 몰리면 차단기 내려갑니다.\n\n인덕션 사용 시 전기 용량 증설 필요할 수 있어요.",
      "🔌 스위치 높이 기준:\n일반: 바닥에서 1200mm\n콘센트: 300mm\n주방: 상판에서 200mm 위\n침대 옆: 600mm",
    ],
  },
  {
    cat:"페인트 시공",
    hook:"페인트 vs 도배, 뭐가 나을까?\n현실적인 비교를 해드립니다",
    body:"페인트 장점: 색상 무한, 부분 보수 가능, 모던한 느낌\n페인트 단점: 벽 상태 완벽해야 함, 시공비 비쌈, 오염 관리 어려움\n\n결론:\n벽 상태 좋고 + 모던 원하면 → 페인트\n벽 상태 별로 + 관리 편한 걸 원하면 → 실크 도배\n\n무조건 페인트가 고급인 건 아닙니다.\n\n#페인트시공 #벽마감 #인테리어비교",
    comments: [
      `🎨 우리 집 벽에 뭐가 맞을지?\n스몰테이블이 벽 상태 진단 후 최적 마감을 추천합니다.\n\n👉 상담 신청: ${CTA_LINK}`,
      "💰 페인트 시공 가격 (30평):\n셀프: 재료비 20~30만원\n전문 시공: 80~150만원\n\n셀프는 벤자민무어, 던에드워드 추천.",
      "🖌️ 셀프 시공 팁:\n1. 마스킹 테이프에 시간 40% 투자\n2. 롤러 9인치 이상\n3. 최소 2회 도포\n4. 환기 3일 이상",
      "🏠 인기 컬러 (2026):\n① 스위스 커피 (따뜻한 아이보리)\n② 그레이지\n③ 세이지 그린 (포인트)\n④ 더스티 핑크 (아이 방)",
    ],
  },
  {
    cat:"아이 방",
    hook:"아이 방 인테리어, 지금 예쁘게 하면\n3년 뒤에 다시 해야 합니다",
    body:"가장 큰 함정: 캐릭터로 도배하기\n3년 후 다 뜯어야 합니다.\n\n원칙:\n1. 기본은 무난하게 (밝은 단색)\n2. 캐릭터는 교체 가능한 것으로 (포스터, 침구)\n3. 성장에 맞는 가구 (높이 조절 책상)\n4. 수납 > 디자인\n\n10년을 내다보고 설계하세요.\n\n#아이방인테리어 #키즈룸 #아이방꾸미기",
    comments: [
      `👶 아이 방 설계, 성장을 고려해서?\n스몰테이블은 아이 연령별 맞춤 설계를 제안합니다.\n\n👉 상담 신청: ${CTA_LINK}`,
      "🎨 아이 방 추천 컬러:\n0~3세: 파스텔 톤\n4~7세: 밝은 중간톤\n8세+: 아이와 함께 선택\n\n천장은 무조건 밝은 화이트.",
      "📚 학습 공간:\n책상은 창가 (자연광)\n조명 4000K (집중력)\n의자는 발이 바닥에 닿는 높이\n\n책상 앞 벽은 단색으로.",
      "🧸 장난감 수납:\n대형 바구니 3개 (분류)\n벽걸이 그물망 (봉제인형)\n투명 서랍장 (뭐가 있는지 보임)\n\n\"정리해!\" 대신 \"빨간 바구니에 넣어줘\"",
    ],
  },
  {
    cat:"발코니 확장",
    hook:"발코니 확장, 불법 아닌데\n모르면 벌금 냅니다. 정확한 기준",
    body:"결론: 대부분 합법. 단, 조건 있음.\n\n✅ 가능: 관리사무소 허가 + 구조 변경 없음\n❌ 불가: 대피공간 발코니, 구조벽 철거\n\n확장 시 단열 필수. 안 하면 겨울에 결로 + 곰팡이 100%.\n\n\"그냥 확장만 하면 되지\" → 큰 실수.\n\n#발코니확장 #베란다확장 #아파트인테리어",
    comments: [
      `🏠 발코니 확장, 제대로 하고 싶다면?\n스몰테이블은 단열+방수+구조 모두 잡아드립니다.\n\n👉 공사 신청: ${CTA_LINK}`,
      "💰 발코니 확장 비용:\n거실: 150~300만원\n방: 100~200만원\n전체: 400~700만원\n\n단열재 종류에 따라 차이. XPS 50mm+ 추천.",
      "🌡️ 결로 방지 필수 공정:\n1. 단열재 50mm+\n2. 방습필름\n3. 삼중 창호\n4. 벽/천장/바닥 모두 단열\n\n벽만 하고 천장 안 하면 천장에서 결로.",
      "⚠️ 대피공간 발코니 주의:\n확장 시 과태료 + 원상복구 명령.\n관리사무소에서 도면 확인 가능.\n반드시 시공 전에 확인하세요.",
    ],
  },
];

// Time slots
const ALL_TIMES = [];
for (let h = 6; h <= 23; h++) {
  ALL_TIMES.push(`${String(h).padStart(2,"0")}:00`);
  ALL_TIMES.push(`${String(h).padStart(2,"0")}:30`);
}

function getDailyPosts(date, count = 16) {
  const day = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  const posts = [];
  const startMin = 7 * 60, endMin = 22 * 60 + 30;
  const interval = Math.floor((endMin - startMin) / Math.max(count - 1, 1));

  for (let i = 0; i < count; i++) {
    const idx = (day * 3 + i) % POSTS_DB.length;
    const tpl = POSTS_DB[idx];
    const mins = startMin + interval * i;
    const time = `${String(Math.floor(mins/60)).padStart(2,"0")}:${String(mins%60).padStart(2,"0")}`;

    posts.push({
      id: `${date.toISOString().slice(0,10)}-${i}`,
      category: tpl.cat,
      content: `${tpl.hook}\n\n${tpl.body}`,
      hookLine: tpl.hook,
      comments: [...tpl.comments],
      scheduledTime: time,
      status: "scheduled",
      engagement: { views: Math.floor(Math.random()*8000)+500, likes: Math.floor(Math.random()*500)+20, replies: Math.floor(Math.random()*80)+5, reposts: Math.floor(Math.random()*40)+2 },
    });
  }
  return posts;
}

// ═══════════════════════════════════════════════════
// SVG ICONS (inline)
// ═══════════════════════════════════════════════════
const Ico = {
  Threads: (p={}) => <svg viewBox="0 0 24 24" fill="currentColor" style={{width:20,height:20,...(p.style||{})}}><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.028-3.58.88-6.433 2.523-8.478C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.592 12c.024 3.088.715 5.5 2.053 7.164 1.43 1.783 3.63 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.29 3.276-.958 1.193-2.356 1.853-4.073 1.922h-.01c-1.72.07-3.229-.36-4.25-1.2-.856-.71-1.396-1.7-1.492-2.89h-.002c-.059-.69.04-1.496.476-2.333.68-1.311 1.928-2.153 3.628-2.448a14.544 14.544 0 0 1 2.995-.135c-.09-.473-.257-.866-.497-1.176-.37-.476-.94-.737-1.7-.78h-.036c-.87.016-1.783.31-2.51.706l-.907-1.753c.97-.53 2.258-.89 3.51-.918h.074c1.28.048 2.3.487 3.036 1.306.577.64.96 1.47 1.15 2.488.462.076.91.173 1.34.294l.003.001c1.3.365 2.38.96 3.207 1.78.987.978 1.6 2.236 1.767 3.631.186 1.55-.134 3.243-1.058 4.724C20.28 22.088 17.636 23.97 12.186 24zm-1.638-7.87c.9-.03 1.63-.335 2.16-.92.41-.449.695-1.063.876-1.84a10.527 10.527 0 0 0-2.174-.093c-1.162.166-1.882.653-2.21 1.284-.18.346-.223.684-.19.988.065.622.47 1.16 1.538 1.58z"/></svg>,
  Gear: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:17,height:17}}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  Out: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:17,height:17}}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Share: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:15,height:15}}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  Left: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:17,height:17}}><polyline points="15,18 9,12 15,6"/></svg>,
  Right: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:17,height:17}}><polyline points="9,6 15,12 9,18"/></svg>,
  Spark: () => <svg viewBox="0 0 24 24" fill="currentColor" style={{width:16,height:16}}><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:15,height:15}}><polyline points="20,6 9,17 4,12"/></svg>,
  Edit: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:14,height:14}}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:13,height:13}}><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  Eye: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:13,height:13}}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Heart: () => <svg viewBox="0 0 24 24" fill="currentColor" style={{width:13,height:13}}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  Reply: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:13,height:13}}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  Repost: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:13,height:13}}><polyline points="17,1 21,5 17,9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7,23 3,19 7,15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>,
  Chat: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:13,height:13}}><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>,
  Down: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:12,height:12}}><polyline points="6,9 12,15 18,9"/></svg>,
  Up: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:12,height:12}}><polyline points="6,15 12,9 18,15"/></svg>,
  Link: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:12,height:12}}><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  Copy: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:14,height:14}}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  Send: () => <svg viewBox="0 0 24 24" fill="currentColor" style={{width:14,height:14}}><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>,
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:14,height:14}}><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
};

// ═══════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return ()=>clearTimeout(t); }, []);
  return <div className={`toast toast-${type}`}>{msg}</div>;
}

function PostCard({ post, onEdit, onDelete, onTimeChange, onPublish, publishing }) {
  const [exp, setExp] = useState(false);
  const [showC, setShowC] = useState(false);
  const st = { scheduled:{bg:"var(--gold2)",c:"var(--gold)",l:"예약"}, posted:{bg:"var(--grn2)",c:"var(--grn)",l:"발행완료"}, failed:{bg:"var(--red2)",c:"var(--red)",l:"실패"} }[post.status];
  const dotCls = post.status==="scheduled"?"dot-gold":post.status==="posted"?"dot-grn":"dot-red";

  return (
    <div className="card" style={{padding:0,overflow:"hidden"}}>
      <div style={{padding:"11px 15px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid var(--bdr)",flexWrap:"wrap",gap:6}}>
        <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
          <span className="tag" style={{background:st.bg,color:st.c}}><span className={`dot ${dotCls}`} style={{marginRight:5}}/>{st.l}</span>
          <span className="tag" style={{background:"var(--blu2)",color:"var(--blu)"}}>{post.category}</span>
          <span style={{fontSize:11,color:"var(--t3)",display:"flex",alignItems:"center",gap:3}}><Ico.Clock/>{post.scheduledTime}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          {post.status==="scheduled" && (
            <button className="btn btn-gold" style={{padding:"5px 10px",fontSize:12}} onClick={()=>onPublish(post)} disabled={publishing}>
              {publishing ? "발행 중..." : <><Ico.Send/> 발행</>}
            </button>
          )}
          <select className="inp" value={post.scheduledTime} onChange={e=>onTimeChange(post.id,e.target.value)} style={{width:85,padding:"4px 24px 4px 8px",fontSize:11}}>
            {ALL_TIMES.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
          <button className="btn btn-ghost" style={{padding:"4px 6px"}} onClick={()=>onEdit(post)}><Ico.Edit/></button>
          <button className="btn btn-red" style={{padding:"4px 6px"}} onClick={()=>onDelete(post.id)}><Ico.Trash/></button>
        </div>
      </div>

      <div style={{padding:"13px 15px 0"}}><p style={{fontSize:14,fontWeight:600,lineHeight:1.7,color:"var(--gold)",whiteSpace:"pre-wrap"}}>{post.hookLine}</p></div>

      <div style={{padding:"6px 15px 12px",cursor:"pointer"}} onClick={()=>setExp(!exp)}>
        <div style={{position:"relative",maxHeight:exp?"none":72,overflow:"hidden"}}>
          <p style={{fontSize:12.5,lineHeight:1.8,color:"var(--t2)",whiteSpace:"pre-wrap"}}>{post.content.split("\n\n").slice(1).join("\n\n")}</p>
          {!exp && <div style={{position:"absolute",bottom:0,left:0,right:0,height:40,background:"linear-gradient(transparent, var(--bg3))"}}/>}
        </div>
        <span style={{fontSize:10,color:"var(--gold)",display:"inline-flex",alignItems:"center",gap:3,marginTop:3}}>{exp?<><Ico.Up/>접기</>:<><Ico.Down/>더 보기</>}</span>
      </div>

      <div style={{padding:"0 15px 10px"}}>
        <button onClick={()=>setShowC(!showC)} style={{background:"var(--bg2)",border:"1px solid var(--bdr)",borderRadius:"var(--rs)",padding:"7px 12px",color:showC?"var(--gold)":"var(--t3)",fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",gap:5,width:"100%",justifyContent:"center",fontFamily:"inherit",transition:"all .2s"}}>
          <Ico.Chat/> 자동 댓글 {post.comments.length}개 {showC?"접기":"보기"}
          <span className="tag" style={{background:"var(--gold2)",color:"var(--gold)",marginLeft:4,fontSize:9}}>CTA 포함</span>
        </button>
      </div>

      {showC && (
        <div style={{borderTop:"1px solid var(--bdr)",padding:"10px 15px"}} className="anim-in">
          {post.comments.map((c,i)=>(
            <div key={i} style={{padding:"9px 12px",marginBottom:8,background:i===0?"rgba(232,197,71,.06)":"var(--bg2)",border:`1px solid ${i===0?"rgba(232,197,71,.15)":"var(--bdr)"}`,borderRadius:"var(--rs)",position:"relative"}}>
              {i===0 && <span style={{position:"absolute",top:7,right:8,fontSize:8,fontWeight:600,color:"var(--gold)",background:"var(--gold2)",padding:"1px 5px",borderRadius:3}}>공사신청 CTA</span>}
              <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:5}}>
                <div style={{width:18,height:18,borderRadius:"50%",background:i===0?"var(--gold)":"var(--bg5)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,color:i===0?"#000":"var(--t3)"}}>{i+1}</div>
                <span style={{fontSize:10,color:"var(--t3)"}}>자동 댓글 #{i+1}</span>
              </div>
              <p style={{fontSize:11.5,lineHeight:1.7,color:"var(--t2)",whiteSpace:"pre-wrap"}}>{c}</p>
              {c.includes("naver.me") && <a href={CTA_LINK} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:3,marginTop:4,fontSize:10,color:"var(--gold)",textDecoration:"none"}}><Ico.Link/> 공사 신청 폼</a>}
            </div>
          ))}
        </div>
      )}

      {post.status==="posted" && (
        <div style={{padding:"8px 15px",borderTop:"1px solid var(--bdr)",display:"flex",gap:16}}>
          {[{i:<Ico.Eye/>,v:post.engagement.views},{i:<Ico.Heart/>,v:post.engagement.likes},{i:<Ico.Reply/>,v:post.engagement.replies},{i:<Ico.Repost/>,v:post.engagement.reposts}].map((s,idx)=>
            <div key={idx} style={{display:"flex",alignItems:"center",gap:3,fontSize:10,color:"var(--t3)"}}>{s.i}<span style={{color:"var(--t2)"}}>{s.v.toLocaleString()}</span></div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════
export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [posts, setPosts] = useState([]);
  const [editPost, setEditPost] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState(null);
  const [publishing, setPublishing] = useState(null);
  const [tab, setTab] = useState("all");
  const [settings, setSettings] = useState({ postsPerDay:16, startTime:"07:00", endTime:"22:30" });
  const [copied, setCopied] = useState(false);

  // Check auth on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth') === 'success') {
      window.history.replaceState({}, '', '/');
    }
    if (params.get('error')) {
      setToast({ msg: `로그인 오류: ${params.get('detail') || params.get('error')}`, type:'error' });
      window.history.replaceState({}, '', '/');
    }

    fetch('/api/me').then(r => r.ok ? r.json() : null).then(data => {
      if (data && !data.error) setUser(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => { setPosts(getDailyPosts(date, settings.postsPerDay)); }, [date, settings.postsPerDay]);

  const nav = d => { const n=new Date(date); n.setDate(n.getDate()+d); setDate(n); };
  const fmtDate = d => d.toLocaleDateString("ko-KR",{year:"numeric",month:"long",day:"numeric",weekday:"short"});

  // Real publish to Threads API
  const handlePublish = async (post) => {
    setPublishing(post.id);
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: post.content, comments: post.comments }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(p => p.map(x => x.id===post.id ? {...x, status:"posted"} : x));
        const commentOk = data.comments?.filter(c=>c.success).length || 0;
        setToast({ msg: `발행 완료! 댓글 ${commentOk}/4개 작성됨`, type:'success' });
      } else {
        setToast({ msg: `발행 실패: ${data.error}`, type:'error' });
      }
    } catch (err) {
      setToast({ msg: `네트워크 오류: ${err.message}`, type:'error' });
    }
    setPublishing(null);
  };

  // Batch publish
  const handlePublishAll = async () => {
    const scheduled = posts.filter(p => p.status==="scheduled");
    if (scheduled.length === 0) return;

    setToast({ msg: `${scheduled.length}개 포스트 발행을 시작합니다...`, type:'info' });

    try {
      const res = await fetch('/api/publish-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts: scheduled.map(p => ({ content:p.content, comments:p.comments, scheduledTime:p.scheduledTime })) }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(p => p.map(x => x.status==="scheduled" ? {...x, status:"posted"} : x));
        setToast({ msg: `${data.published}/${data.total}개 발행 완료!`, type:'success' });
      } else {
        setToast({ msg: `일괄 발행 실패: ${data.error}`, type:'error' });
      }
    } catch (err) {
      setToast({ msg: `네트워크 오류`, type:'error' });
    }
  };

  const regen = () => { setPosts(getDailyPosts(new Date(date.getTime()+Math.random()*86400000), settings.postsPerDay)); setToast({msg:"콘텐츠가 새로 생성되었습니다",type:"info"}); };
  const share = () => { navigator.clipboard?.writeText(window.location.href); setCopied(true); setTimeout(()=>setCopied(false),2000); };

  const filtered = tab==="all" ? posts : posts.filter(p=>p.status===tab);
  const sched = posts.filter(p=>p.status==="scheduled").length;
  const posted = posts.filter(p=>p.status==="posted").length;

  if (loading) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:24,height:24,border:"2px solid var(--bdr2)",borderTopColor:"var(--gold)",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>
    </div>
  );

  // ── LOGIN SCREEN ──
  if (!user) return (
    <>
      <Head><title>Threads Engine — 인테리어 콘텐츠 자동화</title></Head>
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 60% 40% at 50% -10%, rgba(232,197,71,.06), transparent)"}}/>
        <div className="anim-up" style={{textAlign:"center",position:"relative",zIndex:1,maxWidth:420,width:"100%"}}>
          <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:72,height:72,borderRadius:20,background:"linear-gradient(135deg,var(--gold),#c9a020)",marginBottom:26,boxShadow:"0 8px 48px rgba(232,197,71,.2)"}}><Ico.Threads style={{width:34,height:34,color:"#000"}}/></div>
          <h1 style={{fontFamily:"'Outfit'",fontSize:36,fontWeight:800,letterSpacing:"-.04em",marginBottom:6}}>Threads Engine</h1>
          <p style={{color:"var(--t2)",fontSize:13.5,lineHeight:1.7,marginBottom:32}}>AI 인테리어 콘텐츠 자동 생성 · 예약 발행 · 댓글 자동화</p>

          <a href={OAUTH_URL} style={{display:"flex",width:"100%",padding:"14px 24px",background:"#fff",color:"#000",borderRadius:"var(--r)",fontSize:15,fontWeight:600,textDecoration:"none",alignItems:"center",justifyContent:"center",gap:10,boxShadow:"0 4px 24px rgba(255,255,255,.08)",transition:"all .2s"}}>
            <Ico.Threads style={{width:20,height:20}}/> Threads 계정으로 로그인
          </a>

          <p style={{marginTop:10,fontSize:11,color:"var(--t3)"}}>OAuth 2.0 · 비밀번호 저장 없음 · 누구나 로그인 가능</p>

          <div style={{marginTop:28,padding:"12px 14px",background:"var(--bg2)",borderRadius:"var(--rs)",border:"1px solid var(--bdr)"}}>
            <p style={{fontSize:10,color:"var(--t3)",marginBottom:6}}>이 링크를 친구에게 공유하세요</p>
            <div style={{display:"flex",gap:6}}>
              <input readOnly value={typeof window!=="undefined"?window.location.href:""} style={{flex:1,padding:"6px 8px",background:"var(--bg)",border:"1px solid var(--bdr)",borderRadius:"var(--rx)",color:"var(--t3)",fontSize:11,outline:"none",fontFamily:"monospace"}}/>
              <button className="btn btn-ghost" style={{padding:"6px 8px"}} onClick={share}>{copied?<Ico.Check/>:<Ico.Copy/>}</button>
            </div>
          </div>
        </div>
      </div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    </>
  );

  // ── DASHBOARD ──
  return (
    <>
      <Head><title>Threads Engine — @{user.username}</title></Head>

      <header className="glass" style={{position:"sticky",top:0,zIndex:100,borderBottom:"1px solid var(--bdr)",padding:"0 16px"}}>
        <div style={{maxWidth:1060,margin:"0 auto",height:52,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",width:30,height:30,borderRadius:8,background:"var(--gold)",color:"#000"}}><Ico.Threads style={{width:16,height:16}}/></div>
            <span style={{fontFamily:"'Outfit'",fontSize:16,fontWeight:700}} className="hide-m">Threads Engine</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:5}}>
            <button className="btn btn-ghost" style={{padding:"5px 9px"}} onClick={share}><Ico.Share/><span className="hide-m">{copied?"복사됨!":"공유"}</span></button>
            <button className="btn btn-ghost" style={{padding:"5px 9px"}} onClick={()=>setShowSettings(true)}><Ico.Gear/></button>
            <div style={{display:"flex",alignItems:"center",gap:6,padding:"4px 8px",borderRadius:"var(--rs)",background:"var(--bg2)"}}>
              {user.profilePic ? <img src={user.profilePic} style={{width:24,height:24,borderRadius:"50%"}} alt=""/> : <div style={{width:24,height:24,borderRadius:"50%",background:"linear-gradient(135deg,var(--gold),var(--blu))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#000"}}>{user.displayName?.[0]||"U"}</div>}
              <span className="hide-m" style={{fontSize:11,color:"var(--t2)"}}>@{user.username}</span>
            </div>
            <a href="/api/logout" className="btn btn-ghost" style={{padding:"5px 7px",textDecoration:"none"}}><Ico.Out/></a>
          </div>
        </div>
      </header>

      <main style={{maxWidth:1060,margin:"0 auto",padding:"18px 16px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:5}}>
            <button className="btn btn-ghost" style={{padding:6}} onClick={()=>nav(-1)}><Ico.Left/></button>
            <h2 style={{fontSize:15,fontWeight:600,minWidth:170,textAlign:"center"}}>{fmtDate(date)}</h2>
            <button className="btn btn-ghost" style={{padding:6}} onClick={()=>nav(1)}><Ico.Right/></button>
            <button className="btn btn-ghost" style={{padding:"5px 10px",fontSize:11}} onClick={()=>setDate(new Date())}>오늘</button>
          </div>
          <div style={{display:"flex",gap:5}}>
            <button className="btn btn-ghost" onClick={regen}><Ico.Spark/> AI 재생성</button>
            <button className="btn btn-gold" onClick={handlePublishAll}><Ico.Send/> 전체 발행</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:8,marginBottom:16}}>
          {[{l:"예약",v:`${sched}개`,c:"var(--gold)"},{l:"발행",v:`${posted}개`,c:"var(--grn)"},{l:"총 포스트",v:`${posts.length}개`,c:"var(--blu)"},{l:"댓글 포함",v:`${posts.length*4}개`,c:"var(--prp)"}].map((s,i)=>
            <div key={i} className="card" style={{padding:"12px 14px"}}><p style={{fontSize:10,color:"var(--t3)",marginBottom:3}}>{s.l}</p><p style={{fontFamily:"'Outfit'",fontSize:20,fontWeight:700,color:s.c}}>{s.v}</p></div>
          )}
        </div>

        <div style={{padding:"10px 14px",background:"var(--gold2)",border:"1px solid rgba(232,197,71,.12)",borderRadius:"var(--rs)",marginBottom:14,display:"flex",alignItems:"center",gap:8,fontSize:11,color:"var(--gold)"}}>
          <Ico.Link/> 모든 첫 번째 댓글에 스몰테이블 공사신청폼 자동 삽입
          <a href={CTA_LINK} target="_blank" rel="noopener noreferrer" style={{marginLeft:"auto",color:"var(--gold)",textDecoration:"underline",fontSize:10}}>링크 확인</a>
        </div>

        <div style={{display:"flex",gap:3,marginBottom:14,padding:3,background:"var(--bg2)",borderRadius:"var(--rs)",width:"fit-content"}}>
          {[{k:"all",l:`전체 (${posts.length})`},{k:"scheduled",l:`예약 (${sched})`},{k:"posted",l:`발행 (${posted})`}].map(t=>
            <button key={t.k} onClick={()=>setTab(t.k)} style={{padding:"6px 14px",borderRadius:"var(--rx)",border:"none",background:tab===t.k?"var(--bg4)":"transparent",color:tab===t.k?"var(--t1)":"var(--t3)",fontSize:11,fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>{t.l}</button>
          )}
        </div>

        <div className="stagger" style={{display:"flex",flexDirection:"column",gap:8}}>
          {filtered.sort((a,b)=>a.scheduledTime.localeCompare(b.scheduledTime)).map(p=>
            <PostCard key={p.id} post={p} publishing={publishing===p.id} onPublish={handlePublish} onEdit={setEditPost} onDelete={id=>setPosts(ps=>ps.filter(x=>x.id!==id))} onTimeChange={(id,t)=>setPosts(ps=>ps.map(x=>x.id===id?{...x,scheduledTime:t}:x))}/>
          )}
          {filtered.length===0 && <div style={{textAlign:"center",padding:40,color:"var(--t3)",fontSize:13}}>포스트가 없습니다</div>}
        </div>
      </main>

      {/* Edit Modal */}
      {editPost && (
        <div className="overlay" onClick={()=>setEditPost(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div style={{padding:"16px 20px",borderBottom:"1px solid var(--bdr)",display:"flex",justifyContent:"space-between"}}><h3 style={{fontSize:14,fontWeight:600}}>콘텐츠 수정</h3><button onClick={()=>setEditPost(null)} style={{background:"none",border:"none",color:"var(--t3)",cursor:"pointer"}}>✕</button></div>
            <div style={{padding:20}}>
              <label style={{fontSize:11,color:"var(--t3)",marginBottom:5,display:"block"}}>발행 시간</label>
              <select className="inp" value={editPost.scheduledTime} onChange={e=>setEditPost({...editPost,scheduledTime:e.target.value})} style={{marginBottom:14}}>
                {ALL_TIMES.map(t=><option key={t}>{t}</option>)}
              </select>
              <label style={{fontSize:11,color:"var(--t3)",marginBottom:5,display:"block"}}>본문</label>
              <textarea className="txa" value={editPost.content} onChange={e=>setEditPost({...editPost,content:e.target.value})} style={{minHeight:150,marginBottom:14}}/>
              <label style={{fontSize:11,color:"var(--t3)",marginBottom:5,display:"block"}}>자동 댓글 4개</label>
              {editPost.comments.map((c,i)=>
                <div key={i} style={{marginBottom:8}}>
                  <span style={{fontSize:10,color:i===0?"var(--gold)":"var(--t3)"}}>{i===0?"댓글 #1 (CTA)":`댓글 #${i+1}`}</span>
                  <textarea className="txa" value={c} onChange={e=>{const cs=[...editPost.comments];cs[i]=e.target.value;setEditPost({...editPost,comments:cs})}} style={{minHeight:70,fontSize:11,marginTop:3}}/>
                </div>
              )}
            </div>
            <div style={{padding:"12px 20px",borderTop:"1px solid var(--bdr)",display:"flex",justifyContent:"flex-end",gap:6}}>
              <button className="btn btn-ghost" onClick={()=>setEditPost(null)}>취소</button>
              <button className="btn btn-gold" onClick={()=>{setPosts(ps=>ps.map(x=>x.id===editPost.id?editPost:x));setEditPost(null);setToast({msg:"수정 완료",type:"success"})}}><Ico.Check/> 저장</button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="overlay" onClick={()=>setShowSettings(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div style={{padding:"16px 20px",borderBottom:"1px solid var(--bdr)",display:"flex",justifyContent:"space-between"}}><h3 style={{fontSize:14,fontWeight:600}}>발행 설정</h3><button onClick={()=>setShowSettings(false)} style={{background:"none",border:"none",color:"var(--t3)",cursor:"pointer"}}>✕</button></div>
            <div style={{padding:20,display:"flex",flexDirection:"column",gap:18}}>
              <div>
                <label style={{fontSize:11,color:"var(--t3)"}}>하루 발행 횟수</label>
                <div style={{display:"flex",alignItems:"center",gap:10,marginTop:6}}>
                  <input type="range" min="4" max="24" value={settings.postsPerDay} onChange={e=>setSettings({...settings,postsPerDay:+e.target.value})} style={{flex:1,accentColor:"var(--gold)"}}/>
                  <span style={{fontFamily:"'Outfit'",fontSize:20,fontWeight:700,color:"var(--gold)",minWidth:28}}>{settings.postsPerDay}</span>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div><label style={{fontSize:11,color:"var(--t3)"}}>시작 시간</label><select className="inp" value={settings.startTime} onChange={e=>setSettings({...settings,startTime:e.target.value})} style={{marginTop:4}}>{ALL_TIMES.map(t=><option key={t}>{t}</option>)}</select></div>
                <div><label style={{fontSize:11,color:"var(--t3)"}}>종료 시간</label><select className="inp" value={settings.endTime} onChange={e=>setSettings({...settings,endTime:e.target.value})} style={{marginTop:4}}>{ALL_TIMES.map(t=><option key={t}>{t}</option>)}</select></div>
              </div>
            </div>
            <div style={{padding:"12px 20px",borderTop:"1px solid var(--bdr)",display:"flex",justifyContent:"flex-end"}}><button className="btn btn-gold" onClick={()=>setShowSettings(false)}><Ico.Check/> 저장</button></div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    </>
  );
}

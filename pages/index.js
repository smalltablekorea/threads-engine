// pages/index.js
import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';

// ═══════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════
const CTA_LINK = 'https://naver.me/FIfliP1l';
const STORED_TOKEN_KEY = '__te_token';
const STORED_USER_KEY = '__te_user';

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

// ─── Time & Post Generation ───
function getDailyPosts(date, count = 16) {
  const day = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  const posts = [];
  const s = 7*60, e = 22*60+30;
  const gap = Math.floor((e - s) / Math.max(count - 1, 1));
  for (let i = 0; i < count; i++) {
    const idx = (day * 3 + i) % POSTS_DB.length;
    const tpl = POSTS_DB[idx];
    const mins = s + gap * i;
    const time = `${String(Math.floor(mins/60)).padStart(2,"0")}:${String(mins%60).padStart(2,"0")}`;
    posts.push({
      id: `${date.toISOString().slice(0,10)}-${i}`,
      category: tpl.cat, content: `${tpl.hook}\n\n${tpl.body}`, hookLine: tpl.hook,
      comments: [...tpl.comments], scheduledTime: time, status: "scheduled",
    });
  }
  return posts;
}

function fmtDate(d) {
  const days = ['일','월','화','수','목','금','토'];
  return `${d.getMonth()+1}월 ${d.getDate()}일 ${days[d.getDay()]}요일`;
}

// ─── Toast ───
function Toast({ msg, type, onClose }) {
  useEffect(()=>{ const t = setTimeout(onClose, 3200); return ()=>clearTimeout(t); },[]);
  return <div className={`toast ${type==='ok'?'toast-ok':'toast-err'}`}>{msg}</div>;
}

// ─── PostCard ───
function PostCard({ post, onEdit, onPublish, onTimeChange, publishing }) {
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  return (
    <div className={`pc ${post.status==='posted'?'pc-done':post.status==='failed'?'pc-fail':''}`}>
      <div className="pc-row">
        <div className="pc-left">
          <span className={`pc-dot ${post.status}`}/>
          <span className="pc-cat">{post.category}</span>
          <input type="time" className="pc-time" value={post.scheduledTime} step="60"
            onChange={e=>onTimeChange(post.id,e.target.value)} disabled={post.status==='posted'}/>
        </div>
        <div className="pc-right">
          {post.status==='scheduled' && (
            <>
              <button className="b-sm" onClick={()=>onEdit(post)} disabled={publishing}>수정</button>
              <button className="b-sm b-accent" onClick={()=>onPublish(post)} disabled={publishing}>
                {publishing?'발행 중...':'발행'}
              </button>
            </>
          )}
          {post.status==='posted' && <span className="pc-posted">발행 완료</span>}
          {post.status==='failed' && <button className="b-sm b-accent" onClick={()=>onPublish(post)} disabled={publishing}>재시도</button>}
        </div>
      </div>
      <div className="pc-hook">{post.hookLine}</div>
      <div className={`pc-body ${expanded?'':'pc-clamp'}`}>{post.content.split('\n\n').slice(1).join('\n\n')}</div>
      {!expanded && <button className="pc-more" onClick={()=>setExpanded(true)}>더 보기</button>}
      <div className="pc-foot">
        <button className="pc-cmnt-btn" onClick={()=>setShowComments(!showComments)}>
          댓글 {post.comments.length}개 {showComments?'접기':'보기'}
        </button>
        {post.comments[0]?.includes(CTA_LINK) && <span className="pc-cta">CTA</span>}
      </div>
      {showComments && (
        <div className="pc-comments">
          {post.comments.map((c,i) => (
            <div key={i} className="pc-comment">
              <span className="pc-ci">{i+1}</span>
              <div className="pc-ct">{c}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN ───
export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenInput, setTokenInput] = useState('');
  const [tokenLoading, setTokenLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [posts, setPosts] = useState([]);
  const [editPost, setEditPost] = useState(null);
  const [toast, setToast] = useState(null);
  const [publishing, setPublishing] = useState(null);
  const [tab, setTab] = useState('scheduled');
  const [accessToken, setAccessToken] = useState('');
  const [autoMode, setAutoMode] = useState(false);

  // Load saved session
  useEffect(() => {
    try {
      const t = sessionStorage.getItem(STORED_TOKEN_KEY);
      const u = sessionStorage.getItem(STORED_USER_KEY);
      if (t && u) { setAccessToken(t); setUser(JSON.parse(u)); }
    } catch {}
    setLoading(false);
  }, []);

  // Generate posts for date
  useEffect(() => { setPosts(getDailyPosts(date)); }, [date]);

  // ─── Auto scheduler: check every minute ───
  useEffect(() => {
    if (!autoMode || !accessToken) return;
    const check = () => {
      const now = new Date();
      const ct = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
      setPosts(prev => {
        const target = prev.find(p => p.status === 'scheduled' && p.scheduledTime === ct);
        if (target) doPublish(target);
        return prev;
      });
    };
    check(); // run immediately
    const iv = setInterval(check, 60000);
    return () => clearInterval(iv);
  }, [autoMode, accessToken]);

  // Token login
  const handleTokenLogin = async (token) => {
    if (!token || token.trim().length < 10) { setToast({msg:'유효한 토큰을 입력해주세요',t:'err'}); return; }
    setTokenLoading(true);
    try {
      const res = await fetch(`https://graph.threads.net/v1.0/me?fields=id,username,name,threads_profile_picture_url&access_token=${token.trim()}`);
      const p = await res.json();
      if (p.error) { setToast({msg:'토큰 오류: '+p.error.message,t:'err'}); setTokenLoading(false); return; }
      const ud = { userId:p.id, username:p.username||'user', displayName:p.name||p.username||'User', profilePic:p.threads_profile_picture_url||null };
      setUser(ud); setAccessToken(token.trim());
      try { sessionStorage.setItem(STORED_TOKEN_KEY,token.trim()); sessionStorage.setItem(STORED_USER_KEY,JSON.stringify(ud)); } catch{}
      setToast({msg:'@'+ud.username+' 연결 완료',t:'ok'});
    } catch(err) { setToast({msg:'연결 오류: '+err.message,t:'err'}); }
    setTokenLoading(false);
  };

  // Single publish
  const doPublish = async (post) => {
    if (!accessToken) return;
    setPublishing(post.id);
    try {
      const res = await fetch('/api/publish', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({accessToken,content:post.content,comments:post.comments}) });
      const data = await res.json();
      if (data.success) {
        setPosts(p => p.map(x => x.id===post.id ? {...x,status:'posted'} : x));
        setToast({msg:'발행 완료 (댓글 '+(data.comments?.filter(c=>c.success).length||0)+'/4)',t:'ok'});
      } else {
        setPosts(p => p.map(x => x.id===post.id ? {...x,status:'failed'} : x));
        setToast({msg:'발행 실패: '+data.error,t:'err'});
      }
    } catch(err) { setToast({msg:'오류: '+err.message,t:'err'}); }
    setPublishing(null);
  };

  // Batch publish
  const handlePublishAll = async () => {
    const s = posts.filter(p=>p.status==='scheduled');
    if (!s.length) return;
    setToast({msg:s.length+'개 일괄 발행 시작',t:'ok'});
    try {
      const res = await fetch('/api/publish-batch', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({accessToken,posts:s.map(p=>({content:p.content,comments:p.comments,scheduledTime:p.scheduledTime}))}) });
      const data = await res.json();
      if (data.success) {
        setPosts(p => { const u=[...p]; data.results.forEach((r,i)=>{ const idx=u.findIndex(x=>x.id===s[i]?.id); if(idx>=0) u[idx]={...u[idx],status:r.success?'posted':'failed'}; }); return u; });
        setToast({msg:data.published+'/'+data.total+'개 발행 완료',t:'ok'});
      } else { setToast({msg:'실패: '+data.error,t:'err'}); }
    } catch(err) { setToast({msg:'오류: '+err.message,t:'err'}); }
  };

  // Logout
  const logout = () => { setUser(null); setAccessToken(''); try{sessionStorage.removeItem(STORED_TOKEN_KEY);sessionStorage.removeItem(STORED_USER_KEY)}catch{} };

  if (loading) return (
    <><Head><title>Threads Engine</title></Head>
    <style jsx global>{`body{margin:0;background:#09090b;font-family:system-ui,sans-serif}@keyframes sp{to{transform:rotate(360deg)}}`}</style>
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#09090b'}}>
      <div style={{width:20,height:20,border:'2px solid #27272a',borderTopColor:'#71717a',borderRadius:'50%',animation:'sp .6s linear infinite'}}/>
    </div></>
  );

  // ── LOGIN ──
  if (!user) return (
    <><Head><title>Threads Engine</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/></Head>
    <style jsx global>{STYLES}</style>
    <div className="lg-wrap">
      <div className="lg-inner">
        <div className="lg-mark">T</div>
        <h1 className="lg-h">Threads Engine</h1>
        <p className="lg-sub">콘텐츠 자동화 시스템</p>
        <div className="lg-box">
          <label className="lg-label">Access Token</label>
          <p className="lg-hint">Meta Developer 대시보드에서 발급받은 토큰</p>
          <input type="password" className="lg-inp" placeholder="토큰을 붙여넣으세요" value={tokenInput} onChange={e=>setTokenInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleTokenLogin(tokenInput)}/>
          <button className="lg-btn" onClick={()=>handleTokenLogin(tokenInput)} disabled={tokenLoading}>{tokenLoading?'확인 중...':'연결하기'}</button>
        </div>
      </div>
      {toast && <Toast msg={toast.msg} type={toast.t} onClose={()=>setToast(null)}/>}
    </div></>
  );

  // ── DASHBOARD ──
  const scheduled = posts.filter(p=>p.status==='scheduled');
  const posted = posts.filter(p=>p.status==='posted');
  const failed = posts.filter(p=>p.status==='failed');
  const filtered = tab==='scheduled'?scheduled:tab==='posted'?posted:tab==='failed'?failed:posts;

  return (
    <><Head><title>Threads Engine</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/></Head>
    <style jsx global>{STYLES}</style>
    <div className="shell">
      {/* Header */}
      <header className="hd">
        <div className="hd-l"><span className="hd-mark">T</span><span className="hd-name">Threads Engine</span></div>
        <div className="hd-r">
          <span className="hd-user">@{user.username}</span>
          <button className="b-ghost" onClick={logout}>로그아웃</button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="tb">
        <div className="tb-date">
          <button className="b-icon" onClick={()=>setDate(d=>new Date(d.getTime()-86400000))}>&lsaquo;</button>
          <span className="tb-d">{fmtDate(date)}</span>
          <button className="b-icon" onClick={()=>setDate(d=>new Date(d.getTime()+86400000))}>&rsaquo;</button>
        </div>
        <div className="tb-actions">
          <div className="tgl" onClick={()=>setAutoMode(!autoMode)}>
            <div className={`tgl-track${autoMode?' on':''}`}><div className="tgl-thumb"/></div>
            <span className="tgl-label">{autoMode?'자동 발행':'수동'}</span>
          </div>
          <button className="b-primary" onClick={handlePublishAll} disabled={!scheduled.length}>전체 발행 ({scheduled.length})</button>
        </div>
      </div>

      {/* Tabs */}
      <nav className="nav">
        {[['scheduled','대기',scheduled],['posted','완료',posted],['failed','실패',failed],['all','전체',posts]].map(([k,l,arr])=>(
          <button key={k} className={`nav-item${tab===k?' on':''}`} onClick={()=>setTab(k)}>{l}<span className="nav-n">{arr.length}</span></button>
        ))}
      </nav>

      {/* List */}
      <div className="list">
        {filtered.length===0 && <div className="empty-msg">{tab==='posted'?'발행 완료된 글이 없습니다':tab==='failed'?'실패한 글이 없습니다':'대기 중인 글이 없습니다'}</div>}
        {filtered.sort((a,b)=>a.scheduledTime.localeCompare(b.scheduledTime)).map(p=>(
          <PostCard key={p.id} post={p} publishing={publishing===p.id}
            onPublish={doPublish} onEdit={p=>setEditPost({...p})}
            onTimeChange={(id,t)=>setPosts(ps=>ps.map(x=>x.id===id?{...x,scheduledTime:t}:x))}/>
        ))}
      </div>
    </div>

    {/* Edit Modal */}
    {editPost && (
      <div className="mo-bg" onClick={()=>setEditPost(null)}>
        <div className="mo" onClick={e=>e.stopPropagation()}>
          <div className="mo-top"><h3 className="mo-title">포스트 수정</h3><button className="b-ghost" onClick={()=>setEditPost(null)}>닫기</button></div>
          <input type="time" className="mo-time" value={editPost.scheduledTime} step="60" onChange={e=>setEditPost({...editPost,scheduledTime:e.target.value})}/>
          <textarea className="mo-ta" value={editPost.content} rows={8} onChange={e=>setEditPost({...editPost,content:e.target.value,hookLine:e.target.value.split('\n')[0]})}/>
          <p className="mo-cl">댓글 ({editPost.comments.length}개)</p>
          {editPost.comments.map((c,i)=>(<textarea key={i} className="mo-ct" value={c} rows={3} onChange={e=>{const nc=[...editPost.comments];nc[i]=e.target.value;setEditPost({...editPost,comments:nc})}}/>))}
          <div className="mo-foot">
            <button className="b-ghost" onClick={()=>setEditPost(null)}>취소</button>
            <button className="b-primary" onClick={()=>{setPosts(ps=>ps.map(x=>x.id===editPost.id?{...editPost}:x));setEditPost(null);setToast({msg:'수정 완료',t:'ok'})}}>저장</button>
          </div>
        </div>
      </div>
    )}

    {toast && <Toast msg={toast.msg} type={toast.t} onClose={()=>setToast(null)}/>}
    </>
  );
}

// ─── STYLES ───
const STYLES = `
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Noto Sans KR',system-ui,-apple-system,sans-serif;background:#09090b;color:#e4e4e7;-webkit-font-smoothing:antialiased}

/* Login */
.lg-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#09090b;padding:24px}
.lg-inner{width:100%;max-width:360px}
.lg-mark{width:44px;height:44px;background:#e4e4e7;color:#09090b;border-radius:11px;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:20px;margin-bottom:32px}
.lg-h{font-size:26px;font-weight:700;letter-spacing:-0.04em;margin-bottom:4px}
.lg-sub{font-size:13px;color:#52525b;margin-bottom:40px;font-weight:300}
.lg-box{background:#18181b;border:1px solid #27272a;border-radius:12px;padding:24px}
.lg-label{font-size:11px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:4px}
.lg-hint{font-size:11px;color:#3f3f46;margin-bottom:16px;line-height:1.5}
.lg-inp{width:100%;padding:11px 14px;background:#09090b;border:1px solid #27272a;border-radius:8px;color:#e4e4e7;font-size:13px;font-family:'JetBrains Mono',monospace;outline:none;transition:border .15s}
.lg-inp:focus{border-color:#52525b}
.lg-btn{width:100%;margin-top:14px;padding:11px;background:#e4e4e7;color:#09090b;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;transition:opacity .15s;font-family:inherit}
.lg-btn:hover{opacity:.88}
.lg-btn:disabled{opacity:.4;cursor:default}

/* Shell */
.shell{max-width:680px;margin:0 auto;padding:0 20px 64px}

/* Header */
.hd{display:flex;justify-content:space-between;align-items:center;padding:16px 0;border-bottom:1px solid #18181b}
.hd-l{display:flex;align-items:center;gap:10px}
.hd-mark{width:28px;height:28px;background:#e4e4e7;color:#09090b;border-radius:7px;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:13px}
.hd-name{font-size:14px;font-weight:600;letter-spacing:-0.02em}
.hd-r{display:flex;align-items:center;gap:12px}
.hd-user{font-size:11px;color:#52525b;font-family:'JetBrains Mono',monospace}

/* Toolbar */
.tb{display:flex;justify-content:space-between;align-items:center;padding:18px 0 14px;flex-wrap:wrap;gap:12px}
.tb-date{display:flex;align-items:center;gap:6px}
.tb-d{font-size:14px;font-weight:500;min-width:130px;text-align:center}
.tb-actions{display:flex;align-items:center;gap:14px;flex-wrap:wrap}

/* Toggle */
.tgl{display:flex;align-items:center;gap:8px;cursor:pointer;user-select:none}
.tgl-track{width:34px;height:18px;background:#27272a;border-radius:9px;position:relative;transition:background .2s}
.tgl-track.on{background:#059669}
.tgl-thumb{width:14px;height:14px;background:#52525b;border-radius:50%;position:absolute;top:2px;left:2px;transition:all .2s}
.tgl-track.on .tgl-thumb{left:18px;background:#fff}
.tgl-label{font-size:11px;color:#71717a;font-weight:500}

/* Nav */
.nav{display:flex;gap:1px;border-bottom:1px solid #18181b;margin-bottom:14px}
.nav-item{padding:10px 14px;font-size:12px;color:#52525b;background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;font-family:inherit;font-weight:400;display:flex;align-items:center;gap:6px;transition:color .15s}
.nav-item.on{color:#e4e4e7;border-bottom-color:#e4e4e7;font-weight:500}
.nav-item:hover{color:#a1a1aa}
.nav-n{font-size:10px;background:#18181b;padding:1px 6px;border-radius:8px;font-family:'JetBrains Mono',monospace}
.nav-item.on .nav-n{background:#27272a}

/* Post Cards */
.list{display:flex;flex-direction:column;gap:6px}
.pc{background:#18181b;border:1px solid #27272a;border-radius:10px;padding:16px 18px;transition:border-color .15s}
.pc:hover{border-color:#3f3f46}
.pc-done{opacity:.55}
.pc-fail{border-color:#7f1d1d}
.pc-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px}
.pc-left{display:flex;align-items:center;gap:8px}
.pc-right{display:flex;gap:5px}
.pc-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0}
.pc-dot.scheduled{background:#ca8a04}
.pc-dot.posted{background:#059669}
.pc-dot.failed{background:#dc2626}
.pc-cat{font-size:10px;color:#71717a;background:#09090b;padding:3px 8px;border-radius:4px;font-weight:500;letter-spacing:.02em}
.pc-time{background:#09090b;border:1px solid #27272a;border-radius:5px;padding:3px 6px;color:#71717a;font-size:10px;font-family:'JetBrains Mono',monospace;outline:none}
.pc-time:disabled{opacity:.4}
.pc-hook{font-size:14px;font-weight:600;line-height:1.55;margin-bottom:6px;letter-spacing:-0.01em;white-space:pre-line}
.pc-body{font-size:12px;color:#71717a;line-height:1.65}
.pc-clamp{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.pc-more{background:none;border:none;color:#52525b;font-size:11px;cursor:pointer;padding:4px 0;font-family:inherit;transition:color .15s}
.pc-more:hover{color:#a1a1aa}
.pc-foot{display:flex;gap:10px;align-items:center;margin-top:10px;padding-top:10px;border-top:1px solid #1c1c1f}
.pc-cmnt-btn{background:none;border:none;color:#52525b;font-size:10px;cursor:pointer;font-family:inherit;padding:0;transition:color .15s}
.pc-cmnt-btn:hover{color:#a1a1aa}
.pc-cta{font-size:9px;color:#ca8a04;background:#1c1a00;padding:2px 6px;border-radius:3px;font-weight:600;letter-spacing:.03em}
.pc-comments{margin-top:12px;display:flex;flex-direction:column;gap:8px}
.pc-comment{display:flex;gap:10px;padding:10px 12px;background:#0f0f12;border:1px solid #1c1c1f;border-radius:8px}
.pc-ci{font-size:10px;color:#3f3f46;font-family:'JetBrains Mono',monospace;font-weight:600;flex-shrink:0;width:16px;height:16px;display:flex;align-items:center;justify-content:center;background:#18181b;border-radius:4px;margin-top:1px}
.pc-ct{font-size:11px;color:#a1a1aa;line-height:1.65;white-space:pre-line}
.pc-posted{font-size:11px;color:#059669;font-weight:500}
.empty-msg{text-align:center;padding:48px 0;color:#3f3f46;font-size:13px}

/* Buttons */
.b-ghost{background:none;border:1px solid #27272a;color:#71717a;padding:5px 12px;border-radius:6px;font-size:11px;cursor:pointer;font-family:inherit;transition:all .12s}
.b-ghost:hover{border-color:#3f3f46;color:#a1a1aa}
.b-icon{background:none;border:none;color:#52525b;font-size:20px;cursor:pointer;padding:2px 8px;transition:color .12s;line-height:1}
.b-icon:hover{color:#e4e4e7}
.b-sm{background:none;border:1px solid #27272a;color:#71717a;padding:4px 10px;border-radius:5px;font-size:10px;cursor:pointer;font-family:inherit;transition:all .12s}
.b-sm:hover{border-color:#3f3f46;color:#a1a1aa}
.b-sm.b-accent,.b-sm.b-accent{background:#e4e4e7;color:#09090b;border-color:#e4e4e7;font-weight:600}
.b-sm.b-accent:hover{opacity:.88}
.b-sm:disabled{opacity:.35;cursor:default}
.b-primary{background:#e4e4e7;color:#09090b;border:none;padding:7px 16px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;transition:opacity .12s}
.b-primary:hover{opacity:.88}
.b-primary:disabled{opacity:.3;cursor:default}

/* Modal */
.mo-bg{position:fixed;inset:0;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;z-index:100;padding:20px;backdrop-filter:blur(6px)}
.mo{background:#18181b;border:1px solid #27272a;border-radius:14px;padding:24px;width:100%;max-width:520px;max-height:82vh;overflow-y:auto}
.mo-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
.mo-title{font-size:15px;font-weight:600}
.mo-time{width:100%;padding:10px 12px;background:#09090b;border:1px solid #27272a;border-radius:8px;color:#e4e4e7;font-size:13px;font-family:'JetBrains Mono',monospace;outline:none;margin-bottom:10px}
.mo-ta{width:100%;padding:14px;background:#09090b;border:1px solid #27272a;border-radius:8px;color:#e4e4e7;font-size:13px;line-height:1.65;resize:vertical;outline:none;font-family:inherit}
.mo-ta:focus{border-color:#3f3f46}
.mo-cl{font-size:11px;color:#52525b;margin:16px 0 8px;font-weight:500}
.mo-ct{width:100%;padding:10px;background:#09090b;border:1px solid #1c1c1f;border-radius:7px;color:#71717a;font-size:11px;line-height:1.5;resize:vertical;outline:none;margin-bottom:5px;font-family:inherit}
.mo-ct:focus{border-color:#3f3f46;color:#e4e4e7}
.mo-foot{display:flex;justify-content:flex-end;gap:8px;margin-top:18px}

/* Toast */
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);padding:10px 20px;border-radius:8px;font-size:12px;z-index:200;animation:tu .25s;font-weight:500;max-width:90vw}
.toast-ok{background:#052e16;color:#4ade80;border:1px solid #14532d}
.toast-err{background:#2a0000;color:#f87171;border:1px solid #450a0a}
@keyframes tu{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}

/* Responsive */
@media(max-width:640px){
  .shell{padding:0 14px 40px}
  .tb{flex-direction:column;align-items:stretch}
  .tb-actions{justify-content:space-between}
  .pc-row{flex-direction:column;align-items:flex-start}
  .pc-right{align-self:flex-end}
}
`;

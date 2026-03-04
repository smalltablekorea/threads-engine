// pages/index.js
import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';

const CTA_LINK = 'https://naver.me/FIfliP1l';
const STORED_TOKEN_KEY = '__te_token';
const STORED_USER_KEY = '__te_user';

const POSTS_DB = [
  {
    cat:"견적",
    hook:"30평 인테리어 3천이면 싼 건지\n업체마다 천만원씩 차이 나는 이유",
    body:"업체 10곳에 견적 넣어보면 같은 평수인데 2천에서 5천까지 차이 납니다.\n\n싸 보이는 견적일수록 빠진 항목이 많아요. 철거비 별도, 전기 배선 변경 미포함, 욕실 방수 추가. 이런 게 나중에 전부 추가금으로 돌아옵니다.\n\n현장에서 자주 보는 추가금 유형이 세 가지 있는데, 모르고 계약하면 500만원은 더 나가요.\n\n견적서 받으면 총액만 보지 말고 항목 하나하나 뜯어보세요.\n\n#인테리어견적 #인테리어비용 #아파트리모델링",
    comments: [
      "견적을 제대로 비교하고 싶으시면 스몰테이블에서 무료 견적 상담 받아보세요. 항목별로 설명드립니다.\n\n공사 신청: " + CTA_LINK,
      "견적서에서 반드시 볼 세 가지가 있어요.\n\n철거비가 포함인지 별도인지, 전기나 설비 변경 범위가 적혀있는지, 마감재 브랜드랑 등급이 명시돼있는지.\n\n이것만 체크해도 바가지 대부분 피합니다.",
      "패키지 인테리어라는 말에 안심하지 마세요. 대부분 최저가 자재 기준이고 뭐 하나만 바꿔도 추가금 붙습니다. 패키지는 기본값이에요.",
      "평수별 현실 가격대 알려드리면, 20평대 2500에서 4000, 30평대 3500에서 6000, 40평대 5000에서 8000 정도예요.\n\n이 범위 크게 벗어나면 한번 의심해보세요.",
    ],
  },
  {
    cat:"욕실",
    hook:"욕실 방수를 대충 하면 어떻게 되는지\n아랫집 누수 수리비만 300 넘깁니다",
    body:"욕실 리모델링에서 가장 중요한 게 뭘까요. 타일도 세면대도 아니에요. 방수입니다.\n\n대충 하면 6개월 뒤에 아랫집에서 연락 와요. 수리비에 보상비 합치면 300은 기본.\n\n제대로 된 방수는 이렇습니다. 기존 방수 완전 제거, 액체 방수 24시간 간격으로 두 번, 시트 방수 벽면 30센치 이상, 48시간 담수 테스트.\n\n이 중에 하나라도 안 한다고 하면 다른 데 알아보세요.\n\n#욕실리모델링 #욕실방수 #인테리어시공",
    comments: [
      "욕실 시공 확실하게 하고 싶으시면 스몰테이블에서 상담받아보세요. 방수만 3단계로 하고 담수 테스트 사진까지 공유합니다.\n\n무료 상담: " + CTA_LINK,
      "방수 업체 고를 때 세 가지 물어보세요. 방수 몇 회 도포하는지, 담수 테스트 몇 시간 하는지, 하자 보증기간 어떻게 되는지.\n\n대답 못하면 넘기세요.",
      "건식 욕실이 무조건 좋은 건 아닙니다. 어르신 계시면 습식이 안전하고, 1인 가구는 건식 관리가 편하고, 아이 있으면 반건식이 현실적이에요.",
      "욕실 타일 고를 때 바닥은 무광에 논슬립 필수고 벽면은 유광도 괜찮습니다. 포인트는 한 면만. 네 면 다 다르면 어지러워요.\n\n가격은 제곱미터 단가로 비교하세요.",
    ],
  },
  {
    cat:"주방",
    hook:"주방 상판 잘못 고르면 매일 후회합니다\n소재별 현실적인 비교",
    body:"엔지니어드스톤, 세라믹, 천연 대리석, 스테인리스. 종류가 많은데 대부분 예쁜 것만 보고 골라요.\n\n천연 대리석은 산성 음식에 부식되고, 하이막스는 열에 약하고, 세라믹은 가격이 부담이에요.\n\n일반 가정에서는 엔지니어드스톤이 제일 현실적입니다. 가성비랑 내구성 사이에서 균형이 좋아요. 다만 등급 차이가 크니까 꼼꼼히 비교하세요.\n\n#주방인테리어 #주방상판 #인테리어자재",
    comments: [
      "주방 상판 고민 중이시면 스몰테이블에서 자재 샘플 직접 비교해보세요. 실물 보고 결정하는 게 맞습니다.\n\n상담 신청: " + CTA_LINK,
      "소재별 현실 가격입니다. 제곱미터당 하이막스 15에서 25, 엔지니어드스톤 25에서 45, 세라믹 40에서 80, 천연 대리석 50에서 100 이상.\n\n상판 면적이 보통 2에서 3제곱미터니까 곱하면 됩니다.",
      "뜨거운 냄비는 반드시 받침 위에, 칼질은 도마에서만, 레몬즙이나 식초 묻으면 바로 닦으세요. 이것만 해도 수명이 확 늘어납니다.",
      "상판 시공 때 가장 중요한 건 싱크볼 연결부 실리콘 처리예요. 여기서 물 새면 하부장 전체가 썩습니다.",
    ],
  },
  {
    cat:"거실",
    hook:"거실이 좁아 보이는 건 평수 때문이 아니에요\n세 가지만 바꾸면 됩니다",
    body:"25평인데 넓어 보이는 집 있고 35평인데 답답한 집 있잖아요.\n\n차이는 세 가지입니다. 바닥재 컬러가 밝으면 넓어 보이고, 가구에 다리가 있으면 바닥이 보여서 시원하고, 커튼을 천장에서 바닥까지 내리면 층고가 높아 보여요.\n\n이 세 개만 신경 써도 체감 면적이 달라집니다.\n\n#거실인테리어 #공간활용 #좁은거실",
    comments: [
      "거실을 어떻게 바꿔야 할지 모르겠으면 스몰테이블에서 3D로 완성 모습 미리 보여드립니다.\n\n무료 상담: " + CTA_LINK,
      "거실 벽 컬러 고르는 원칙이 있어요. 남향이면 블루그레이나 민트 같은 쿨톤, 북향이면 아이보리나 베이지 같은 웜톤.\n\n자연광 방향에 따라 같은 색도 다르게 보입니다.",
      "TV 뒤에 LED 스트립 하나 넣고 소파 위에 커브조명 달아보세요. 색온도 3000K로 맞추면 됩니다. 이것만 해도 분위기 확 바뀝니다.",
      "소파 크기 참고하세요. 25평 이하는 2인반, 30평대는 3인용, 35평 이상부터 L형이 들어갑니다. 거실 폭에서 소파 빼고 80센치는 남아야 사람이 지나다녀요.",
    ],
  },
  {
    cat:"시공 순서",
    hook:"시공 순서 잘못 잡으면\n완성된 벽을 뜯게 됩니다",
    body:"타일 먼저 깔았는데 배관 위치가 안 맞아서 방금 붙인 거 뜯는 경우, 실제로 봤어요.\n\n올바른 순서는 철거, 설비, 방수, 목공, 타일, 도배나 페인트, 바닥, 가구, 조명입니다.\n\n이 순서 어기면 재시공 나와요. 설비를 타일 뒤에 하겠다는 곳은 다시 생각해보세요.\n\n#인테리어시공 #시공순서 #리모델링순서",
    comments: [
      "시공 순서부터 일정까지 스몰테이블이 관리해드립니다. 매일 현장 사진에 진행 보고까지.\n\n공사 신청: " + CTA_LINK,
      "평수별 시공 기간입니다. 20평대 3에서 4주, 30평대 4에서 5주, 40평대 5에서 7주.\n\n2주 만에 해준다는 건 대충 하겠다는 뜻이에요.",
      "철거할 때 꼭 확인하세요. 내력벽인지, 석면 자재인지, 배관 위치가 어딘지.\n\n내력벽 철거하면 건물 전체 안전 문제입니다.",
      "시공 중에 매일 오후에 현장 사진 받으세요. 카톡보다 밴드나 노션이 기록 관리에 좋아요. 나중에 문제 생기면 증거가 됩니다.",
    ],
  },
  {
    cat:"도배",
    hook:"도배가 100만원이 넘는다고요?\n종류별로 뭐가 다른지 정리해봤습니다",
    body:"도배지에 따라 결과가 완전히 다릅니다.\n\n합지는 싸지만 오래 못 가고, 실크는 내구성 좋고 물 닦기 되고, 광폭은 이음새 없어서 깔끔해요.\n\n30평 기준 합지 60에서 80, 실크 100에서 150, 광폭 150에서 250 정도.\n\n합지는 2년 3년이면 누렇게 되고 때 탑니다. 최소 실크 이상 가세요.\n\n#도배 #도배지 #인테리어자재",
    comments: [
      "도배지 실물로 보고 결정하고 싶으시면 스몰테이블 방문 시 100종 이상 비교 가능합니다.\n\n상담 신청: " + CTA_LINK,
      "시공 순서가 목공, 페인트, 도배인데 페인트 먼저 하고 도배하면 접착력이 떨어져요.\n\n겨울 시공이면 실내 온도 15도 이상 유지해야 풀이 잘 붙습니다.",
      "곰팡이 있는 벽에 그냥 도배하면 안 됩니다. 3개월 후에 다시 올라와요. 곰팡이 제거하고 방곰팡이 처리한 다음에 해야 합니다.",
      "공간별로 다르게 가는 게 좋아요. 아이 방은 항균 기능성, 거실은 실크나 광폭, 안방은 한 면만 패턴 포인트.\n\n전체 패턴은 어지러워요.",
    ],
  },
  {
    cat:"수납",
    hook:"수납 부족하면 가구 사지 마세요\n구조를 바꿔야 합니다",
    body:"가구를 놓는 게 아니라 벽에 심는 개념으로 바꿔보세요.\n\n현관은 슬라이딩 신발장 깊이 30센치면 충분하고, 거실은 TV장 대신 벽걸이에 하부 수납, 주방은 상부장 천장까지, 침실은 붙박이장이 공간 30퍼센트 절약합니다.\n\n같은 면적에서 수납량 두 배 차이 나요.\n\n#수납인테리어 #수납아이디어 #정리정돈",
    comments: [
      "우리 집에 맞는 수납 구조가 궁금하시면 스몰테이블에서 평면도 기반으로 제안해드립니다.\n\n무료 상담: " + CTA_LINK,
      "붙박이장은 공간 효율 최고인데 이사할 때 못 가져가요. 시스템장은 이사 되는 대신 자투리 공간 생기고요.\n\n자가면 붙박이, 전세면 시스템장이 현실적입니다.",
      "현관 수납 극대화하는 법이에요. 신발장 하부 20센치 띄워서 실내화 공간, 상부에 계절 신발, 벽면 후크로 열쇠랑 우산.\n\n현관 깔끔하면 집 전체 느낌이 달라져요.",
      "드레스룸 전환하려면 최소 폭 1.6미터는 돼야 양쪽 수납이 됩니다. 1.2미터면 한쪽만 가능해요.",
    ],
  },
  {
    cat:"조명",
    hook:"조명 하나 바꿨을 뿐인데\n집이 완전히 달라졌습니다",
    body:"인테리어에서 가장 가성비 좋은 건 조명이에요.\n\n천장 메인 조명 없애고 간접조명이랑 포인트 조명으로 바꾸면 됩니다. 거실은 레일조명에 TV 뒤 간접등, 주방은 싱크대 위 펜던트에 하부장 아래 LED바, 침실은 헤드보드 간접등.\n\n20만원이면 거실 조명 전체 바꿀 수 있어요.\n\n#조명인테리어 #간접조명 #셀프인테리어",
    comments: [
      "조명 설계부터 시공까지 한 번에 하고 싶으시면 스몰테이블에서 3D 배치도 보여드립니다.\n\n상담 신청: " + CTA_LINK,
      "색온도가 중요합니다. 2700K는 따뜻한 노란빛으로 침실이나 거실, 3000K가 가장 범용적, 4000K는 밝은 백색으로 주방이나 서재.\n\n집 전체 통일하는 게 핵심이에요.",
      "셀프 교체 예산입니다. 거실 레일조명 8에서 15만원, TV 뒤 LED 스트립 1에서 3만원, 주방 펜던트 5에서 10만원. 배선 변경 없이 가능한 것들이에요.",
      "매입등 간격은 최소 90센치로 잡으세요. 거실 기준 6개에서 8개면 충분합니다. 많을수록 좋다는 건 오해예요.",
    ],
  },
  {
    cat:"바닥재",
    hook:"마루, 타일, 장판 중에\n10년 뒤에도 괜찮을 선택",
    body:"바닥재는 한 번 깔면 최소 10년 가야 하잖아요.\n\n강화마루는 가성비 좋지만 물에 약하고, 강마루는 내구성이랑 디자인 균형이 좋고, 타일은 물이나 열에 강한 대신 차갑고, 장판은 싸지만 고급감은 부족해요.\n\n결론적으로 강마루가 무난합니다.\n\n#바닥재 #마루시공 #인테리어자재",
    comments: [
      "바닥재 실물 비교해보고 싶으시면 스몰테이블에서 50종 이상 샘플 볼 수 있어요.\n\n무료 견적: " + CTA_LINK,
      "제곱미터당 가격입니다. 강화마루 3에서 5만원, 강마루 6에서 12만원, 원목마루 15에서 30만원, 포세린 타일 5에서 15만원.\n\n30평 바닥이 약 65제곱미터니까 곱해보세요.",
      "반려동물 키우시면 원목마루는 피하세요. 스크래치 심해요. 강마루나 타일이 현실적이고 미끄럼 방지 코팅 여부 꼭 확인하세요.",
      "바닥 난방 궁합도 따져야 해요. 온돌에 가장 잘 맞는 건 강마루고 원목은 뒤틀림 위험이 있습니다.",
    ],
  },
  {
    cat:"업체 선정",
    hook:"인테리어 업체 고르기 전에\n이 다섯 가지만 물어보세요",
    body:"포트폴리오 현장 방문이 가능한지, 견적서에 자재 브랜드와 등급이 적혀있는지, 추가금 발생 조건이 뭔지, 하자 보수 기간과 범위가 어떻게 되는지, 현재 진행 중인 현장이 몇 개인지.\n\n이 다섯 개에 명확하게 답하는 곳을 고르세요.\n\n#인테리어업체 #업체선정 #인테리어사기",
    comments: [
      "스몰테이블은 이 다섯 가지에 다 자신 있게 답합니다. 투명한 견적에 현장 방문 환영이에요.\n\n공사 상담: " + CTA_LINK,
      "계약서에 꼭 들어가야 하는 것들이에요. 총액에 부가세 포함 여부, 공사 기간이랑 지체 패널티, 자재 목록에 브랜드와 수량, 추가 비용 조건, 하자 보수 최소 1년.",
      "이런 곳은 거르세요. 계약금 50퍼센트 이상 먼저 달라는 곳, 견적서를 시공 시작할 때 주겠다는 곳, 다른 데보다 300만원 싸다는 곳.",
      "리뷰 볼 때 팁 하나. 블로그 체험단은 신뢰도 낮고 네이버 카페 후기는 참고할 만하고 지인 추천이 가장 믿을만해요. 전부 5점이면 오히려 의심하세요.",
    ],
  },
  {
    cat:"창호",
    hook:"겨울에 외풍 심하면\n보일러 말고 창문을 의심해보세요",
    body:"집 전체 열손실의 40퍼센트가 창문으로 빠져나갑니다.\n\n10년 넘은 창호면 교체만으로 난방비 30퍼센트 줄일 수 있어요. 유리는 삼중 로이유리, 프레임은 하이브리드가 좋고 기밀성 1등급은 필수.\n\n겨울 전에 바꾸세요.\n\n#창호교체 #단열 #에너지절약",
    comments: [
      "창호 교체 상담 필요하시면 스몰테이블에서 현장 실측 후 추천해드려요.\n\n무료 상담: " + CTA_LINK,
      "교체 비용입니다. 거실 대창 80에서 150, 방 창문 40에서 80, 30평 전체 300에서 500 정도. 난방비 절감하면 5년이면 회수돼요.",
      "열관류율 1.0 이하면 우수, 1.5 이하는 보통, 2.0 이상이면 교체 시급합니다.",
      "시공 후에 프레임이랑 벽 사이를 우레탄 폼으로 꼼꼼히 채우는 게 핵심이에요. 이 틈으로 바람 들어옵니다.",
    ],
  },
  {
    cat:"트렌드",
    hook:"올해 인테리어 트렌드가 바뀌었어요\n이제 안 하는 것들 정리",
    body:"온통 화이트만 가는 인테리어, 과한 간접조명, 인조대리석 느낌 바닥. 이제 안 하는 추세예요.\n\n올해는 웜톤 내추럴, 곡선형 디자인, 자연 소재, 포인트 컬러 벽 한 면, 숨은 수납 방향입니다.\n\n핵심은 자연스러움이랑 따뜻함이에요.\n\n#인테리어트렌드 #2026트렌드 #홈스타일링",
    comments: [
      "올해 트렌드 맞춰서 하고 싶으시면 스몰테이블에서 상담받아보세요.\n\n상담 신청: " + CTA_LINK,
      "추천 컬러 조합 세 가지. 크림화이트에 월넛에 카키, 라이트그레이에 오크에 테라코타, 아이보리에 라탄에 올리브그린.",
      "바닥재나 상판처럼 오래 쓰는 건 클래식하게, 조명이나 소품처럼 쉽게 바꿀 수 있는 건 트렌디하게 가세요.",
      "수납 없는 미니멀은 3개월이면 어질러지고 동선 무시한 배치는 매일 불편합니다. 예쁨 반 실용성 반이 정답이에요.",
    ],
  },
  {
    cat:"전기 배선",
    hook:"콘센트 위치 하나 잘못 잡으면\n멀티탭 지옥에서 못 빠져나옵니다",
    body:"전기 배선은 시공 초반에 결정되고 나중에 바꾸려면 벽 뜯어야 해요.\n\n거실은 소파 양쪽이랑 TV 뒤 4구 이상, 로봇청소기 자리. 주방은 싱크대 위 두 군데랑 냉장고 전용. 침실은 침대 양옆이랑 화장대.\n\n지금 메모해두세요.\n\n#전기배선 #콘센트위치 #인테리어설계",
    comments: [
      "전기 배선을 처음부터 제대로 하고 싶으시면 스몰테이블에서 동선 기반 배치도 드려요.\n\n무료 상담: " + CTA_LINK,
      "USB 콘센트 넣으면 좋은 위치가 있어요. 침대 옆, 서재 책상 뒤, 주방 카운터 위. 요즘 USB-C 내장형도 나옵니다.",
      "에어컨이랑 전기오븐, 건조기는 전용 회로 필수예요. 한 회로에 몰리면 차단기 내려갑니다. 인덕션 쓸 거면 전기 용량 증설 필요할 수도 있어요.",
      "높이 기준 알려드리면 일반 스위치 바닥에서 1200밀리, 콘센트 300밀리, 주방은 상판에서 200밀리 위, 침대 옆은 600밀리.",
    ],
  },
  {
    cat:"페인트",
    hook:"페인트가 도배보다 무조건 나은 건 아닙니다\n현실적으로 비교해봤어요",
    body:"페인트 장점은 색상 자유, 부분 보수 가능, 모던한 느낌. 단점은 벽 상태가 좋아야 하고 시공비 비싸고 오염 관리 어려워요.\n\n벽 상태 좋고 모던한 걸 원하면 페인트, 관리 편한 걸 원하면 실크 도배.\n\n#페인트시공 #벽마감 #인테리어비교",
    comments: [
      "우리 집 벽에 뭐가 맞는지 궁금하시면 스몰테이블에서 벽 상태 보고 추천해드려요.\n\n상담 신청: " + CTA_LINK,
      "30평 기준 셀프 20에서 30만원, 전문 시공 80에서 150만원입니다. 셀프로 하신다면 벤자민무어나 던에드워드 추천해요.",
      "셀프 시공 할 때 마스킹 테이프 작업에 시간 충분히 쓰세요. 롤러 9인치 이상, 두 번 도포, 환기 3일 이상.",
      "올해 인기 컬러는 스위스 커피라는 따뜻한 아이보리, 그레이지, 포인트용 세이지 그린, 아이 방에 더스티 핑크.",
    ],
  },
  {
    cat:"아이 방",
    hook:"아이 방 예쁘게만 하면\n3년 뒤에 또 해야 합니다",
    body:"캐릭터로 도배하는 게 가장 큰 실수예요. 3년 지나면 다 뜯어야 합니다.\n\n기본은 밝은 단색으로, 캐릭터는 포스터나 침구처럼 바꿀 수 있는 걸로, 가구는 높이 조절 되는 걸로. 디자인보다 수납이 먼저예요.\n\n10년 내다보고 설계하세요.\n\n#아이방인테리어 #키즈룸 #아이방꾸미기",
    comments: [
      "아이 방을 성장 고려해서 설계하고 싶으시면 스몰테이블에서 연령별 맞춤 제안 드려요.\n\n상담 신청: " + CTA_LINK,
      "컬러 기준입니다. 3세까지 파스텔, 7세까지 밝은 중간톤, 8세부터는 아이랑 같이 고르세요. 천장은 밝은 화이트.",
      "학습 공간은 책상을 창가에 놓고 조명 4000K로 맞추고 의자는 발이 바닥에 닿는 높이로. 책상 앞 벽은 단색이 좋습니다.",
      "장난감은 큰 바구니 세 개로 분류하고 투명 서랍장으로 뭐가 들었는지 보이게 하세요. 정리해라 대신 빨간 바구니에 넣어줘가 훨씬 잘 먹혀요.",
    ],
  },
  {
    cat:"발코니",
    hook:"발코니 확장은 대부분 합법입니다\n다만 조건을 모르면 벌금 나와요",
    body:"관리사무소 허가 받고 구조 변경 없으면 됩니다. 대피공간 발코니랑 구조벽 철거는 안 돼요.\n\n확장할 때 단열 꼭 하세요. 안 하면 겨울에 결로 생기고 곰팡이 핍니다. 그냥 확장만 하면 된다는 생각은 위험해요.\n\n#발코니확장 #베란다확장 #아파트인테리어",
    comments: [
      "발코니 확장 제대로 하고 싶으시면 스몰테이블에서 단열이랑 방수랑 구조 다 잡아드려요.\n\n공사 신청: " + CTA_LINK,
      "비용입니다. 거실 쪽 150에서 300, 방 쪽 100에서 200, 전체 400에서 700 정도. 단열재에 따라 차이 나는데 XPS 50밀리 이상 추천해요.",
      "결로 방지 필수 사항이에요. 단열재 50밀리 이상, 방습필름, 삼중 창호, 벽이랑 천장이랑 바닥 모두 단열.\n\n벽만 하고 천장 안 하면 거기서 결로 생깁니다.",
      "대피공간 발코니 확장하면 과태료에 원상복구 명령 나옵니다. 관리사무소에서 도면 확인 가능하니까 시공 전에 꼭 체크하세요.",
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

// pages/index.js
import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';

const CTA_LINK = 'https://naver.me/FIfliP1l';
const STORED_TOKEN_KEY = '__te_token';
const STORED_USER_KEY = '__te_user';

// ─── 콘텐츠 생성 시스템: 30 카테고리 x 15 토픽 = 450 고유 조합 ───

const CATS = [
  {id:"견적",name:"견적"},
  {id:"욕실",name:"욕실"},
  {id:"주방",name:"주방"},
  {id:"거실",name:"거실"},
  {id:"시공순서",name:"시공 순서"},
  {id:"도배",name:"도배"},
  {id:"수납",name:"수납"},
  {id:"조명",name:"조명"},
  {id:"바닥재",name:"바닥재"},
  {id:"업체선정",name:"업체 선정"},
  {id:"창호",name:"창호"},
  {id:"트렌드",name:"트렌드"},
  {id:"전기",name:"전기 배선"},
  {id:"페인트",name:"페인트"},
  {id:"아이방",name:"아이 방"},
  {id:"발코니",name:"발코니"},
  {id:"현관",name:"현관"},
  {id:"드레스룸",name:"드레스룸"},
  {id:"곰팡이",name:"곰팡이/결로"},
  {id:"셀프",name:"셀프 인테리어"},
  {id:"구조변경",name:"구조 변경"},
  {id:"소음",name:"소음 차단"},
  {id:"노후",name:"노후 주택"},
  {id:"사기방지",name:"사기 방지"},
  {id:"자재",name:"자재 선택"},
  {id:"컬러",name:"컬러/색채"},
  {id:"가구",name:"가구 배치"},
  {id:"홈스타일링",name:"홈스타일링"},
  {id:"에너지",name:"에너지 절약"},
  {id:"화장실",name:"화장실 리폼"},
];

// 카테고리별 훅 라인 (3개씩 = 90개)
const HOOKS = {
  "견적": [
    "30평 인테리어 3천이면 싼 건지\n업체마다 천만원씩 차이 나는 이유",
    "견적서 항목 하나하나 뜯어봤더니\n500만원이 숨어있었습니다",
    "똑같은 평수에 왜 2천만원 차이가 나는지\n현장에서 직접 비교해봤어요",
  ],
  "욕실": [
    "욕실 방수를 대충 하면 어떻게 되는지\n아랫집 누수 수리비만 300 넘깁니다",
    "욕실 리모델링 할 때 타일보다\n먼저 신경 써야 할 게 있어요",
    "욕실 크기가 작아도\n넓어 보이게 만드는 방법이 있습니다",
  ],
  "주방": [
    "주방 상판 잘못 고르면 매일 후회합니다\n소재별 현실적인 비교",
    "주방 동선이 불편한 집의 공통점\n이 세 가지를 안 지켜서 그래요",
    "싱크대 교체만으로 주방이 달라지는 이유\n생각보다 비용도 적게 들어요",
  ],
  "거실": [
    "거실이 좁아 보이는 건 평수 때문이 아니에요\n세 가지만 바꾸면 됩니다",
    "거실 가구 배치 하나 바꿨을 뿐인데\n동선이 완전히 달라졌어요",
    "TV 벽 꾸미기에 돈 쓰기 전에\n이것부터 확인하세요",
  ],
  "시공순서": [
    "시공 순서 잘못 잡으면\n완성된 벽을 뜯게 됩니다",
    "인테리어 공사 첫날부터 마지막날까지\n순서대로 정리했습니다",
    "업체가 시공 순서를 바꾸자고 하면\n그건 주의 신호예요",
  ],
  "도배": [
    "도배가 100만원이 넘는다고요?\n종류별로 뭐가 다른지 정리해봤습니다",
    "도배를 새로 했는데 3개월 만에 들뜨는 이유\n시공 과정에서 문제가 생긴 거예요",
    "도배지 고를 때 가장 중요한 건\n색상이 아니라 소재입니다",
  ],
  "수납": [
    "수납 부족하면 가구 사지 마세요\n구조를 바꿔야 합니다",
    "정리를 아무리 해도 어지러운 집은\n수납 구조 자체가 잘못된 거예요",
    "같은 평수인데 수납이 두 배 되는 집\n비결은 이거였습니다",
  ],
  "조명": [
    "조명 하나 바꿨을 뿐인데\n집이 완전히 달라졌습니다",
    "조명 색온도를 잘못 고르면\n아무리 꾸며도 싸 보여요",
    "20만원으로 거실 분위기 바꾸는 법\n조명 교체가 답이에요",
  ],
  "바닥재": [
    "마루, 타일, 장판 중에\n10년 뒤에도 괜찮을 선택",
    "바닥재 시공 후 1년 뒤에\n후회하는 사람들의 공통점",
    "강마루가 강화마루보다 비싼 이유\n차이를 제대로 알려드릴게요",
  ],
  "업체선정": [
    "인테리어 업체 고르기 전에\n이 다섯 가지만 물어보세요",
    "좋은 인테리어 업체의 공통점\n현장에서 직접 확인한 기준이에요",
    "가장 싼 업체를 골랐더니\n결국 가장 비싸게 끝났습니다",
  ],
  "창호": [
    "겨울에 외풍 심하면\n보일러 말고 창문을 의심해보세요",
    "창호 교체 한 번으로\n난방비 30퍼센트 줄었습니다",
    "이중창이면 다 같은 줄 알았는데\n등급 차이가 이렇게 크더라고요",
  ],
  "트렌드": [
    "올해 인테리어 트렌드가 바뀌었어요\n이제 안 하는 것들 정리",
    "인스타에서 본 인테리어 따라했다가\n3개월 만에 후회한 이유",
    "유행 따라가면 2년 뒤에 촌스러워요\n오래가는 디자인의 기준",
  ],
  "전기": [
    "콘센트 위치 하나 잘못 잡으면\n멀티탭 지옥에서 못 빠져나옵니다",
    "전기 배선은 시공 초반에 결정돼요\n나중에 바꾸려면 벽 뜯어야 합니다",
    "스위치 높이를 잘못 잡으면\n매일 불편한 집이 됩니다",
  ],
  "페인트": [
    "페인트가 도배보다 무조건 나은 건 아닙니다\n현실적으로 비교해봤어요",
    "셀프 페인트 할 때 대부분이 놓치는 게\n마스킹 테이프 작업이에요",
    "페인트 색상 고를 때 매장에서 보는 것과\n집에서 보는 게 다른 이유",
  ],
  "아이방": [
    "아이 방 예쁘게만 하면\n3년 뒤에 또 해야 합니다",
    "아이가 자라도 안 바꿔도 되는\n방 꾸미기의 원칙",
    "아이 방 가구 고를 때\n높이 조절 되는 걸로 사야 하는 이유",
  ],
  "발코니": [
    "발코니 확장은 대부분 합법입니다\n다만 조건을 모르면 벌금 나와요",
    "발코니 확장했는데 겨울에 결로 생기면\n단열을 안 해서 그런 거예요",
    "발코니를 확장할지 말지\n판단하는 기준을 알려드릴게요",
  ],
  "현관": [
    "현관 인테리어를 바꾸면\n집 전체 인상이 달라집니다",
    "좁은 현관이 넓어 보이는 집의 비결\n세 가지만 기억하세요",
    "현관 수납이 부족한 집의 공통점\n신발장 구조를 바꿔야 해요",
  ],
  "드레스룸": [
    "작은 방 하나를 드레스룸으로 바꾸면\n침실 수납 고민이 해결됩니다",
    "드레스룸 만들 때 최소 폭이 있어요\n이거 모르면 돈만 날립니다",
    "옷이 많은 게 문제가 아니라\n수납 구조가 잘못된 거예요",
  ],
  "곰팡이": [
    "곰팡이가 계속 올라오는 집\n도배를 아무리 새로 해도 소용없어요",
    "결로가 생기는 진짜 이유\n환기 문제가 아닐 수도 있어요",
    "곰팡이 제거제 뿌려도 또 나오는 이유\n근본 원인을 못 잡아서 그래요",
  ],
  "셀프": [
    "셀프 인테리어로 해도 되는 것과\n절대 하면 안 되는 것의 기준",
    "셀프로 했다가 결국 업체 부른 사례\n이런 건 처음부터 맡기세요",
    "셀프 인테리어 예산 50만원으로\n가장 효과 큰 변화 세 가지",
  ],
  "구조변경": [
    "벽 하나 뚫으면 넓어질 줄 알았는데\n구조 확인 안 하면 큰일 납니다",
    "아파트에서 벽을 뺄 수 있는지 없는지\n확인하는 방법 알려드릴게요",
    "구조 변경 없이도 공간이 넓어지는\n현실적인 방법들이에요",
  ],
  "소음": [
    "층간 소음 때문에 고민이시면\n바닥재 선택부터 다시 보세요",
    "방음이 잘 되는 집과 안 되는 집\n차이는 벽 속에 있어요",
    "아이 있는 집 층간 소음 줄이는 법\n매트 깔기 말고 근본적인 해결",
  ],
  "노후": [
    "20년 넘은 아파트 리모델링\n어디부터 손대야 할지 알려드립니다",
    "노후 주택 인테리어 할 때\n겉만 바꾸면 안 되는 이유",
    "오래된 집일수록 배관부터 확인하세요\n눈에 안 보이는 곳이 더 중요해요",
  ],
  "사기방지": [
    "인테리어 사기 유형 다섯 가지\n미리 알면 피할 수 있어요",
    "계약금 받고 연락 안 되는 업체\n이런 징후가 먼저 나타납니다",
    "후기 조작하는 업체 구별하는 법\n이 패턴만 알면 됩니다",
  ],
  "자재": [
    "비싼 자재가 무조건 좋은 건 아니에요\n가성비 좋은 등급이 따로 있습니다",
    "자재 직접 사면 싸다는 말의 진실\n모르면 오히려 손해 봐요",
    "수입 자재 vs 국산 자재\n현실적으로 뭐가 나은지 비교",
  ],
  "컬러": [
    "벽 컬러 하나 바꿨을 뿐인데\n집 분위기가 완전히 달라졌어요",
    "인테리어 컬러 고를 때\n조명 색온도까지 같이 봐야 합니다",
    "화이트 인테리어가 지겨우면\n포인트 한 면만 바꿔보세요",
  ],
  "가구": [
    "가구 배치만 바꿔도\n동선이 완전히 달라집니다",
    "가구 살 때 사이즈 재는 방법\n대부분이 이걸 빠뜨려요",
    "가구가 멀쩡한데 집이 좁아 보이면\n배치가 잘못된 거예요",
  ],
  "홈스타일링": [
    "가구 안 바꾸고 소품만으로\n분위기 바꾸는 현실적인 방법",
    "쿠션이랑 러그만 바꿨는데\n거실이 완전히 달라졌어요",
    "홈스타일링 할 때 가장 효과 큰 건\n패브릭이에요",
  ],
  "에너지": [
    "난방비 줄이려면 보일러 조절 말고\n이것부터 바꾸세요",
    "여름 냉방비가 많이 나오는 집\n창문이랑 단열을 확인해보세요",
    "에너지 효율 높이는 인테리어\n비용 대비 효과가 제일 큰 것들",
  ],
  "화장실": [
    "화장실 리폼 비용 제대로 알려드립니다\n평균이 얼마인지 아세요",
    "화장실이 좁아도\n넓어 보이게 만드는 방법이 있어요",
    "변기 교체만 해도 화장실 느낌이 달라지는데\n종류별 차이 알려드릴게요",
  ],
};

// 본문 템플릿 (카테고리별 3개씩)
const BODIES = {
  "견적": [
    "업체 10곳에 견적 넣어보면 같은 평수인데 2천에서 5천까지 차이 납니다.\n\n싸 보이는 견적일수록 빠진 항목이 많아요. 철거비 별도, 전기 배선 변경 미포함, 욕실 방수 추가. 이런 게 나중에 전부 추가금으로 돌아옵니다.\n\n현장에서 자주 보는 추가금 유형이 있는데, 모르고 계약하면 500만원은 더 나가요.\n\n견적서 받으면 총액만 보지 말고 항목을 뜯어보세요.\n\n#인테리어견적 #인테리어비용 #아파트리모델링",
    "견적서를 비교할 때 총액만 보면 안 됩니다.\n\n항목별로 뭐가 빠져있는지 확인해야 해요. 어떤 업체는 철거비를 포함시키고 어떤 업체는 별도로 빼거든요. 같은 3천만원이라도 내용이 완전히 달라요.\n\n특히 설비 변경, 방수, 전기 배선 항목을 주의 깊게 보세요. 여기서 추가금이 가장 많이 나옵니다.\n\n#인테리어비용 #견적비교 #아파트인테리어",
    "견적이 싸다고 좋은 게 아니에요.\n\n제가 같은 조건으로 여러 업체에 견적 넣어본 적 있는데, 가장 싼 곳은 항목이 반밖에 안 들어가 있었어요. 나머지는 다 추가금이었습니다.\n\n비교할 때는 총액이 아니라 항목 수를 먼저 세보세요. 항목이 자세한 곳이 오히려 정직한 업체입니다.\n\n#견적서보는법 #인테리어팁 #인테리어비교",
  ],
  "욕실": [
    "욕실 리모델링에서 가장 중요한 건 방수예요.\n\n대충 하면 6개월 뒤에 아랫집에서 연락 옵니다. 수리비에 보상비 합치면 300은 기본.\n\n제대로 된 방수는 기존 것 완전 제거, 액체 방수 24시간 간격 두 번, 시트 방수 벽면 30센치 이상, 48시간 담수 테스트.\n\n이 중 하나라도 안 한다면 다른 데 알아보세요.\n\n#욕실리모델링 #욕실방수 #인테리어시공",
    "욕실이 좁아서 답답한 분들 많으실 텐데, 타일 색상이랑 배치만 바꿔도 체감이 달라집니다.\n\n밝은 톤 타일에 큰 사이즈로 가면 줄눈이 적어서 넓어 보여요. 거울을 크게 다는 것도 효과 있고요.\n\n조명도 중요한데, 매입등 하나 추가하면 전체 밝기가 올라가서 공간감이 생깁니다.\n\n#욕실인테리어 #작은욕실 #욕실타일",
    "욕실 리모델링 순서를 알려드리면, 기존 철거부터 하고 배관 확인하고 방수하고 타일 시공하고 위생기기 설치 순서입니다.\n\n여기서 배관 확인을 빼먹는 곳이 있어요. 오래된 배관 그대로 두면 나중에 누수 나서 다시 뜯어야 합니다.\n\n20년 넘은 아파트라면 배관 교체 비용도 같이 잡으세요.\n\n#욕실공사 #욕실순서 #배관교체",
  ],
  "주방": [
    "엔지니어드스톤, 세라믹, 천연 대리석, 스테인리스. 종류가 많은데 대부분 예쁜 것만 보고 골라요.\n\n천연 대리석은 산성 음식에 부식되고, 하이막스는 열에 약하고, 세라믹은 가격이 부담.\n\n일반 가정에서는 엔지니어드스톤이 제일 현실적입니다. 등급 차이가 크니까 꼼꼼히 비교하세요.\n\n#주방인테리어 #주방상판 #인테리어자재",
    "주방 동선이 불편하면 요리할 때마다 스트레스예요.\n\n냉장고에서 꺼내고 씻고 썰고 조리하는 순서가 한 방향으로 흘러야 합니다. 이게 안 되면 왔다 갔다 하게 돼요.\n\n싱크대, 조리대, 가스레인지 위치를 정할 때 이 동선을 먼저 그려보세요.\n\n#주방동선 #주방설계 #인테리어팁",
    "싱크대 교체만으로도 주방 분위기가 확 바뀝니다.\n\n상판이랑 하부장을 같이 바꾸면 200에서 400만원 정도 드는데, 전체 주방 리모델링의 절반 비용으로 효과는 80퍼센트를 얻을 수 있어요.\n\n상부장은 도장만 새로 해도 충분한 경우가 많습니다.\n\n#싱크대교체 #주방비용 #부분인테리어",
  ],
  "거실": [
    "25평인데 넓어 보이는 집 있고 35평인데 답답한 집 있잖아요.\n\n차이는 세 가지입니다. 바닥재 컬러가 밝으면 넓어 보이고, 가구에 다리가 있으면 바닥이 보여서 시원하고, 커튼을 천장에서 바닥까지 내리면 층고가 높아 보여요.\n\n이 세 개만 신경 써도 체감 면적이 달라집니다.\n\n#거실인테리어 #공간활용 #좁은거실",
    "거실 가구 배치를 바꿔봤는데 동선이 완전히 달라졌어요.\n\n소파를 벽에서 30센치만 떼도 뒤쪽 공간이 생기면서 넓어 보이고, TV 위치를 창문 반대편으로 옮기니까 빛 반사도 줄었습니다.\n\n가구를 새로 사기 전에 배치부터 바꿔보세요. 공짜로 분위기 바꿀 수 있어요.\n\n#거실배치 #가구배치 #인테리어팁",
    "TV 벽에 대리석 붙이고 선반 달고 하는 분들 많은데, 그전에 확인할 게 있어요.\n\n벽에 하중을 얼마나 줄 수 있는지, 콘센트 위치가 맞는지, TV 크기에 맞는 거리가 나오는지.\n\n이거 안 따져보고 시공하면 나중에 불편해서 결국 돈 들여서 바꾸게 됩니다.\n\n#TV벽 #거실시공 #인테리어설계",
  ],
  "시공순서": [
    "타일 먼저 깔았는데 배관 위치가 안 맞아서 방금 붙인 거 뜯는 경우가 실제로 있어요.\n\n올바른 순서는 철거, 설비, 방수, 목공, 타일, 도배나 페인트, 바닥, 가구, 조명입니다.\n\n이 순서 어기면 재시공 나와요.\n\n#인테리어시공 #시공순서 #리모델링순서",
    "인테리어 공사 첫날은 철거부터 시작합니다. 그다음 배관이랑 전기 같은 설비, 방수, 목공 순서로 가요.\n\n여기까지가 뼈대 작업이고, 그다음이 타일이랑 도배 같은 마감입니다. 바닥재 깔고 가구 넣고 조명 달면 끝.\n\n이 순서를 지키는 업체가 기본이 되어있는 곳이에요.\n\n#공사순서 #인테리어일정 #시공관리",
    "업체가 시공 순서를 바꾸자고 할 때가 있어요. 일정 때문에 타일을 먼저 하고 설비를 나중에 하겠다는 식으로요.\n\n이건 주의 신호입니다. 순서를 바꾸면 십중팔구 문제가 생겨요. 공기 단축 핑계로 순서를 건너뛰는 건 현장을 잘 모르는 거예요.\n\n#시공관리 #인테리어업체 #공사일정",
  ],
  "도배": [
    "도배지에 따라 결과가 완전히 다릅니다.\n\n합지는 싸지만 오래 못 가고, 실크는 내구성 좋고 물 닦기 되고, 광폭은 이음새 없어서 깔끔해요.\n\n30평 기준 합지 60에서 80, 실크 100에서 150, 광폭 150에서 250 정도.\n\n최소 실크 이상 가세요.\n\n#도배 #도배지 #인테리어자재",
    "새로 도배했는데 3개월 만에 들뜨는 경우가 있어요.\n\n원인이 여러 가지인데, 풀을 너무 묽게 탄 경우, 벽면 처리를 안 한 경우, 시공 중에 환기를 잘못한 경우입니다.\n\n도배는 기술자 실력 차이가 크거든요. 싼 가격에 현혹되면 결국 다시 해야 합니다.\n\n#도배시공 #도배하자 #인테리어팁",
    "도배지 색상 고를 때 매장에서 보는 것과 집에서 보는 게 달라요.\n\n매장은 조명이 밝아서 색이 연하게 보이거든요. 샘플을 꼭 집에 가져와서 자연광, 형광등, 간접조명 아래에서 다 확인해보세요.\n\n그래야 시공 후에 이게 아닌데 하는 상황을 피할 수 있어요.\n\n#도배지선택 #도배컬러 #인테리어컬러",
  ],
  "수납": [
    "가구를 놓는 게 아니라 벽에 심는 개념으로 바꿔보세요.\n\n현관은 슬라이딩 신발장 30센치면 충분, 거실은 TV장 대신 벽걸이에 하부 수납, 주방은 상부장 천장까지, 침실은 붙박이장.\n\n같은 면적에서 수납량 두 배 차이 나요.\n\n#수납인테리어 #수납아이디어 #정리정돈",
    "정리를 아무리 해도 지저분한 집이 있어요. 이건 정리 능력 문제가 아니라 수납 구조가 잘못된 거예요.\n\n물건 수에 비해 수납 공간이 부족하면 아무리 정리해도 다시 어질러집니다.\n\n정리하기 전에 수납 공간부터 늘리세요.\n\n#수납부족 #정리정돈 #공간활용",
    "같은 평수인데 수납이 두 배 되는 집의 비결은 숨은 공간 활용이에요.\n\n침대 아래, 소파 아래, 계단 밑, 벽면 틈새. 이런 데드 스페이스를 활용하면 가구 안 사도 수납이 늘어납니다.\n\n맞춤 가구가 비쌀 것 같지만 의외로 조립 가구보다 공간 효율이 좋아서 결과적으로 이득이에요.\n\n#수납공간 #숨은수납 #맞춤가구",
  ],
  "조명": [
    "인테리어에서 가장 가성비 좋은 건 조명이에요.\n\n천장 메인 조명 없애고 간접조명이랑 포인트 조명으로 바꾸면 됩니다. 거실은 레일조명에 TV 뒤 간접등, 주방은 펜던트에 하부장 아래 LED바, 침실은 헤드보드 간접등.\n\n20만원이면 거실 조명 전체 바꿀 수 있어요.\n\n#조명인테리어 #간접조명 #셀프인테리어",
    "조명 색온도를 섞어 쓰면 집 전체가 산만해 보여요.\n\n거실은 3000K, 침실은 2700K, 주방은 4000K 이렇게 방마다 하나로 통일하세요.\n\n한 공간에 두 가지 색온도가 섞이면 아무리 비싼 조명을 달아도 어색합니다.\n\n#색온도 #조명선택 #인테리어조명",
    "거실 분위기를 바꾸는 데 20만원이면 충분해요.\n\n메인 등 대신 레일조명 달고 TV 뒤에 LED 스트립 붙이면 끝입니다. 배선 변경 없이 할 수 있는 것들이에요.\n\n간접조명 하나로 셀프 인테리어 효과의 대부분을 얻을 수 있습니다.\n\n#셀프조명 #조명교체 #거실분위기",
  ],
  "바닥재": [
    "바닥재는 한 번 깔면 최소 10년 가야 하잖아요.\n\n강화마루는 가성비 좋지만 물에 약하고, 강마루는 내구성이랑 디자인 균형이 좋고, 타일은 물이나 열에 강한 대신 차갑고, 장판은 싸지만 고급감 부족.\n\n결론적으로 강마루가 무난합니다.\n\n#바닥재 #마루시공 #인테리어자재",
    "바닥재 시공하고 1년 뒤에 후회하는 사람들 보면 공통점이 있어요.\n\n견본만 보고 골랐다는 거예요. 작은 견본과 바닥 전체에 깔렸을 때 느낌이 완전 다릅니다.\n\n가능하면 넓은 면적으로 시공된 현장을 직접 보고 결정하세요.\n\n#바닥재선택 #마루시공 #인테리어팁",
    "강마루가 강화마루보다 비싼 데는 이유가 있어요.\n\n강마루는 표면에 천연 무늬목이 들어가서 질감이 자연스럽고, 방수 성능도 강화마루보다 낫습니다. 바닥 난방에도 강마루가 더 잘 맞아요.\n\n가격 차이가 제곱미터당 3만원 정도인데, 10년 쓸 거 생각하면 강마루가 가성비 좋습니다.\n\n#강마루 #강화마루 #바닥재비교",
  ],
  "업체선정": [
    "포트폴리오 현장 방문이 가능한지, 견적서에 자재 브랜드와 등급이 적혀있는지, 추가금 발생 조건이 뭔지, 하자 보수 기간이 어떻게 되는지, 진행 중인 현장이 몇 개인지.\n\n이 다섯 개에 명확하게 답하는 곳을 고르세요.\n\n#인테리어업체 #업체선정 #인테리어사기",
    "좋은 인테리어 업체들의 공통점이 있어요.\n\n첫째, 견적서가 상세합니다. 자재 브랜드랑 수량이 다 적혀있어요. 둘째, 현장을 보여주는 걸 꺼리지 않아요. 셋째, 추가금 조건을 먼저 말해줍니다.\n\n이 세 가지를 기본으로 갖춘 곳이면 일단 안심해도 돼요.\n\n#좋은업체 #인테리어업체 #시공업체",
    "제일 싼 업체를 골랐다가 결국 제일 비싸게 끝나는 경우를 자주 봐요.\n\n싼 견적에는 이유가 있어요. 항목을 빼놓거나 자재 등급을 최하로 잡거나. 시공 시작하면 추가금이 계속 나오고 결국 처음에 중간 가격 낸 업체보다 더 들어갑니다.\n\n#인테리어비용 #싼인테리어 #추가금",
  ],
  "창호": [
    "집 전체 열손실의 40퍼센트가 창문으로 빠져나갑니다.\n\n10년 넘은 창호면 교체만으로 난방비 30퍼센트 줄일 수 있어요. 유리는 삼중 로이유리, 프레임은 하이브리드, 기밀성 1등급 필수.\n\n겨울 전에 바꾸세요.\n\n#창호교체 #단열 #에너지절약",
    "창호 교체 한 번으로 난방비가 30퍼센트 줄었다는 분들 많아요.\n\n특히 삼중 로이유리로 바꾸면 효과가 확실합니다. 30평 전체 교체 비용이 300에서 500 정도인데, 난방비 절감하면 5년이면 회수돼요.\n\n겨울 외풍이 심하면 창호부터 보세요.\n\n#난방비절약 #창호교체 #삼중유리",
    "이중창이면 다 같은 줄 알았는데 등급 차이가 크더라고요.\n\n열관류율이라는 수치가 있어요. 1.0 이하면 우수, 1.5면 보통, 2.0 넘으면 교체 시급합니다. 같은 이중창이라도 유리 코팅이랑 프레임에 따라 이 수치가 2배까지 차이 나요.\n\n#단열등급 #창호성능 #열관류율",
  ],
  "트렌드": [
    "올해부터 안 하는 게 좋은 것들이 있어요. 온통 화이트, 과한 간접조명, 인조대리석 느낌 바닥.\n\n대신 웜톤 내추럴, 곡선형 디자인, 자연 소재, 포인트 컬러 벽 한 면, 숨은 수납.\n\n핵심은 자연스러움이랑 따뜻함이에요.\n\n#인테리어트렌드 #2026트렌드 #홈스타일링",
    "인스타에서 본 인테리어 따라했다가 3개월 만에 후회하는 경우가 많아요.\n\n수납 없는 미니멀은 금방 어질러지고, 동선 무시한 배치는 매일 불편합니다. 사진으로 보는 것과 실제로 사는 건 달라요.\n\n예쁨 반 실용성 반으로 가세요.\n\n#인스타인테리어 #인테리어현실 #실용인테리어",
    "유행 따라가면 2년 뒤에 촌스러워져요.\n\n바닥재나 상판처럼 오래 쓰는 건 클래식하게, 조명이나 소품처럼 쉽게 바꿀 수 있는 건 트렌디하게 가세요.\n\n기본 골격은 무난하게 잡아야 오래갑니다.\n\n#인테리어기본 #클래식인테리어 #오래가는디자인",
  ],
  "전기": [
    "전기 배선은 시공 초반에 결정되고 나중에 바꾸려면 벽 뜯어야 해요.\n\n거실은 소파 양쪽이랑 TV 뒤 4구 이상, 주방은 싱크대 위 두 군데랑 냉장고 전용, 침실은 침대 양옆이랑 화장대.\n\n지금 메모해두세요.\n\n#전기배선 #콘센트위치 #인테리어설계",
    "배선 설계를 할 때 가전제품 목록부터 적어보세요.\n\n에어컨, 건조기, 전기오븐 같은 고전력 제품은 전용 회로가 필수예요. 한 회로에 몰리면 차단기 내려갑니다.\n\n인덕션 쓸 거면 전기 용량 증설도 미리 확인하세요.\n\n#전기설계 #회로분리 #전기용량",
    "스위치 높이를 잘못 잡으면 매일 불편해요.\n\n일반 스위치는 바닥에서 1200밀리, 콘센트는 300밀리, 주방은 상판에서 200밀리 위, 침대 옆은 600밀리가 기준이에요.\n\n특히 침대 옆 콘센트는 매트리스 높이에 맞춰야 합니다.\n\n#스위치높이 #콘센트설계 #생활편의",
  ],
  "페인트": [
    "페인트 장점은 색상 자유, 부분 보수, 모던한 느낌. 단점은 벽 상태가 좋아야 하고 시공비 비싸고 오염 관리 어려워요.\n\n벽 상태 좋고 모던한 걸 원하면 페인트, 관리 편한 걸 원하면 실크 도배.\n\n무조건 페인트가 고급인 건 아닙니다.\n\n#페인트시공 #벽마감 #인테리어비교",
    "셀프 페인트 할 때 대부분이 놓치는 게 마스킹 테이프 작업이에요.\n\n페인트칠 자체보다 테이핑에 시간을 두 배는 써야 합니다. 라인이 깔끔해야 결과물이 살아요.\n\n롤러도 9인치 이상 쓰고 최소 두 번은 도포하세요. 환기는 3일 이상.\n\n#셀프페인트 #페인트팁 #DIY인테리어",
    "페인트 색상 고를 때 매장에서 보는 거랑 집에서 보는 게 달라요.\n\n매장 조명이 밝아서 색이 연하게 느껴지거든요. 샘플 칩을 집에 가져와서 아침 자연광, 저녁 조명 아래에서 둘 다 확인하세요.\n\n가능하면 작은 면적에 시험 도포해보는 게 확실합니다.\n\n#페인트컬러 #색상선택 #인테리어컬러",
  ],
  "아이방": [
    "캐릭터로 도배하는 게 가장 큰 실수예요. 3년 지나면 다 뜯어야 합니다.\n\n기본은 밝은 단색으로, 캐릭터는 포스터나 침구처럼 바꿀 수 있는 걸로, 가구는 높이 조절 되는 걸로.\n\n10년 내다보고 설계하세요.\n\n#아이방인테리어 #키즈룸 #아이방꾸미기",
    "아이가 자라도 방을 안 바꿔도 되는 원칙이 있어요.\n\n벽은 중성 컬러, 가구는 성장형, 수납은 넉넉하게. 이 세 가지만 지키면 초등학생 때까지 큰 공사 없이 갈 수 있어요.\n\n변하는 건 소품으로 해결하세요.\n\n#성장형인테리어 #아이방원칙 #장기설계",
    "아이 방 가구 고를 때 높이 조절이 안 되는 책상 사면 2년마다 바꿔야 해요.\n\n성장기에는 키가 빠르게 크니까 책상이랑 의자 모두 높이 조절 되는 걸로 사세요.\n\n가격이 조금 비싸도 오래 쓰면 결국 이득입니다.\n\n#아이방가구 #높이조절책상 #성장형가구",
  ],
  "발코니": [
    "관리사무소 허가 받고 구조 변경 없으면 됩니다. 대피공간이랑 구조벽 철거는 안 돼요.\n\n확장할 때 단열 꼭 하세요. 안 하면 겨울에 결로 생기고 곰팡이 핍니다.\n\n#발코니확장 #베란다확장 #아파트인테리어",
    "발코니 확장하고 겨울에 결로 생기면 단열 시공을 안 한 거예요.\n\n발코니는 원래 외부 공간이라서 확장하면 단열이 필수입니다. 벽, 천장, 바닥 전부 다 해야 해요. 벽만 하고 천장 안 하면 거기서 물방울 맺힙니다.\n\n#발코니단열 #결로방지 #확장주의",
    "발코니를 확장할지 말지 고민되시면 이렇게 판단하세요.\n\n거실이 좁은데 발코니가 넓다면 확장 효과가 커요. 반대로 발코니를 빨래 건조나 수납으로 잘 쓰고 있다면 굳이 확장 안 해도 됩니다.\n\n확장하면 그 기능을 다른 곳에서 대체해야 하니까요.\n\n#발코니활용 #확장판단 #공간계획",
  ],
  "현관": [
    "현관 인테리어만 바꿔도 집에 들어올 때 느낌이 달라져요.\n\n바닥 타일 교체, 신발장 정리, 간접조명 하나. 이 세 가지면 충분합니다.\n\n비용도 100만원 이내로 가능해요.\n\n#현관인테리어 #현관꾸미기 #첫인상",
    "좁은 현관이 넓어 보이는 집은 세 가지가 다릅니다.\n\n밝은 색 바닥 타일, 거울 활용, 그리고 신발이 보이지 않는 수납.\n\n현관에 신발이 나와있으면 아무리 넓어도 좁아 보여요.\n\n#좁은현관 #현관수납 #공간활용",
    "현관 신발장이 부족한 집은 구조를 바꿔야 해요.\n\n기존 신발장 대신 천장까지 올라가는 슬라이딩 장으로 바꾸면 수납량이 두 배 넘게 늘어납니다. 깊이 30센치면 충분하고 하부는 20센치 띄워서 실내화 공간으로 쓰세요.\n\n#신발장 #현관정리 #수납설계",
  ],
  "드레스룸": [
    "작은 방 하나를 드레스룸으로 바꾸면 침실 수납 고민이 해결돼요.\n\n최소 폭 1.6미터면 양쪽 수납 가능하고, 1.2미터면 한쪽만 됩니다.\n\n독립 장농 여러 개 사는 것보다 공간 효율이 훨씬 좋아요.\n\n#드레스룸 #수납공간 #옷정리",
    "드레스룸 만들 때 폭을 안 재고 시작하면 돈만 날려요.\n\n행거를 양쪽에 달려면 통로 포함 최소 1.6미터, 한쪽만이면 1.2미터 필요합니다.\n\n폭이 부족한데 억지로 양쪽 수납하면 옷 꺼낼 때마다 스트레스예요.\n\n#드레스룸설계 #수납치수 #옷장정리",
    "옷이 많은 게 문제가 아니라 수납 구조가 잘못된 거예요.\n\n긴 옷, 짧은 옷, 접어서 넣는 옷. 종류별로 공간을 나눠야 합니다. 행거 높이를 두 단으로 나누면 같은 공간에 두 배를 넣을 수 있어요.\n\n#옷수납 #효율수납 #드레스룸활용",
  ],
  "곰팡이": [
    "곰팡이가 올라오는 벽에 도배를 새로 해봤자 3개월이면 다시 나와요.\n\n원인을 먼저 잡아야 합니다. 단열 부족인지, 환기 문제인지, 누수인지. 원인에 따라 해결 방법이 완전히 달라요.\n\n곰팡이 제거제는 임시방편일 뿐이에요.\n\n#곰팡이제거 #결로 #벽곰팡이",
    "결로가 생기는 게 꼭 환기 문제만은 아니에요.\n\n벽 단열이 부족하면 실내외 온도 차이 때문에 벽 표면에 물방울이 맺힙니다. 이 경우에는 환기를 아무리 해도 해결이 안 돼요.\n\n단열 보강을 해야 근본적으로 해결됩니다.\n\n#결로원인 #단열부족 #벽단열",
    "곰팡이 제거제 뿌려도 또 나오는 건 근본 원인을 못 잡아서예요.\n\n곰팡이는 수분이 있으면 계속 자라거든요. 누수가 원인이면 배관을 고쳐야 하고, 결로가 원인이면 단열을 보강해야 합니다.\n\n눈에 보이는 곰팡이만 지우면 안 돼요.\n\n#곰팡이원인 #근본해결 #배관누수",
  ],
  "셀프": [
    "셀프로 해도 되는 건 조명 교체, 도배 위 페인트칠, 소품 교체 정도예요.\n\n방수, 전기 배선, 타일 시공, 설비 교체는 전문가에게 맡기세요. 잘못하면 더 큰 돈이 나갑니다.\n\n할 수 있는 것과 맡겨야 할 것의 기준을 아는 게 중요해요.\n\n#셀프인테리어 #DIY #인테리어구분",
    "셀프로 하다가 결국 업체 부르는 경우가 꽤 있어요.\n\n타일 시공을 직접 했는데 수평이 안 맞거나, 방수를 직접 했는데 누수가 나거나. 이런 건 처음부터 맡기는 게 싸게 먹혀요.\n\n셀프의 범위를 알아야 합니다.\n\n#셀프실패 #인테리어업체 #시공전문",
    "50만원으로 가장 효과 큰 셀프 변화 세 가지가 있어요.\n\n첫째 조명 교체, 둘째 패브릭 교체, 셋째 벽면 포인트 페인트.\n\n이 세 가지만 해도 집 분위기가 확 바뀝니다. 가구 안 바꿔도 돼요.\n\n#저예산인테리어 #셀프꾸미기 #분위기전환",
  ],
  "구조변경": [
    "벽 하나 뚫으면 넓어질 줄 알았는데 그게 내력벽이면 큰일 납니다.\n\n아파트에서 벽 철거 가능 여부는 구조도면으로 확인할 수 있어요. 관리사무소에 요청하면 됩니다.\n\n내력벽을 건드리면 건물 전체 안전 문제예요.\n\n#구조변경 #내력벽 #아파트리모델링",
    "아파트에서 어떤 벽을 뺄 수 있는지 확인하는 방법 알려드릴게요.\n\n구조도면에서 굵은 선으로 표시된 게 내력벽이고, 얇은 선이 비내력벽입니다. 비내력벽만 철거 가능해요.\n\n확실하지 않으면 구조기술사 검토를 받으세요.\n\n#벽철거 #구조도면 #아파트구조",
    "구조 변경 없이도 공간을 넓게 쓸 수 있어요.\n\n문짝을 슬라이딩으로 바꾸거나, 가구 높이를 낮추거나, 벽 색을 밝게 바꾸는 것만으로도 체감이 달라집니다.\n\n벽 뚫는 건 비용도 크고 위험 부담이 있으니 다른 방법부터 시도해보세요.\n\n#공간넓히기 #구조변경없이 #인테리어팁",
  ],
  "소음": [
    "층간 소음이 심하면 바닥재부터 확인해보세요.\n\n바닥재 밑에 차음재가 제대로 깔려있는지가 중요해요. 두께 기준이 있는데, 최소 1.5밀리 이상 EVA 재질을 쓰는 게 좋습니다.\n\n바닥재 교체할 때 같이 하면 비용 추가가 크지 않아요.\n\n#층간소음 #차음재 #바닥재시공",
    "방음이 잘 되는 집과 안 되는 집 차이는 벽 속에 있어요.\n\n석고보드 사이에 흡음재가 들어가 있는지, 이중 석고보드인지에 따라 방음 성능이 크게 달라집니다.\n\n인테리어 할 때 벽 작업이 있으면 흡음재 추가를 같이 하세요.\n\n#방음 #흡음재 #벽방음",
    "아이 있는 집에서 층간 소음 줄이려면 매트 까는 것만으로는 한계가 있어요.\n\n바닥 차음재 시공이 근본적인 해결이고, 아이가 주로 뛰는 공간에는 두꺼운 놀이 매트를 추가로 깔아주세요.\n\n슬리퍼 신는 습관도 의외로 효과가 있습니다.\n\n#아이소음 #층간소음해결 #바닥차음",
  ],
  "노후": [
    "20년 넘은 아파트 리모델링은 보이는 것만 바꾸면 안 돼요.\n\n배관, 전기 배선, 방수. 이 세 가지를 먼저 확인해야 합니다. 겉만 예쁘게 해놓으면 1년 뒤에 속에서 문제가 터져요.\n\n순서는 보이지 않는 곳부터입니다.\n\n#노후아파트 #리모델링 #배관교체",
    "노후 주택 인테리어에서 겉만 바꾸면 안 되는 이유가 있어요.\n\n오래된 배관은 녹이 슬어있고, 전기 용량은 현재 가전 사용량을 못 감당하는 경우가 많아요.\n\n예산의 30퍼센트는 보이지 않는 곳에 써야 합니다.\n\n#노후주택 #인테리어예산 #기반시설",
    "오래된 집일수록 배관부터 봐야 해요.\n\n20년 이상 된 배관은 내부에 녹이랑 이물질이 쌓여있어서 수압도 떨어지고 수질도 안 좋아집니다.\n\n인테리어 하면서 배관 교체를 같이 하면 별도로 할 때보다 비용이 절반 정도로 줄어요.\n\n#배관교체 #수도배관 #노후설비",
  ],
  "사기방지": [
    "인테리어 사기 유형이 몇 가지 있어요.\n\n계약금 받고 잠수, 시공 중 자재 바꿔치기, 견적에 없던 추가금 폭탄, 하자인데 모르쇠, 공사 중단 후 잔금 요구.\n\n공통점은 계약서가 허술하다는 거예요. 계약서를 꼼꼼하게 쓰는 게 최선의 예방입니다.\n\n#인테리어사기 #사기예방 #계약서",
    "계약금 받고 연락 안 되는 업체의 징후가 미리 보여요.\n\n계약을 서두르고, 계약금 비율이 높고, 견적서가 대충이고, 사업자등록증을 안 보여주려 합니다.\n\n계약 전에 사업자등록 확인이랑 시공 현장 방문은 기본이에요.\n\n#업체확인 #사기징후 #안전계약",
    "후기 조작하는 업체를 구별하는 법 알려드릴게요.\n\n같은 문체로 된 후기가 많거나, 올린 시기가 몰려있거나, 사진이 너무 전문적이면 의심해보세요.\n\n실제 후기는 사진 화질도 들쭉날쭉하고 내용도 구체적이에요.\n\n#후기조작 #가짜후기 #업체구별",
  ],
  "자재": [
    "비싼 자재가 무조건 좋은 건 아니에요.\n\n같은 종류 안에서도 등급이 있는데, 최상급과 중상급의 차이를 일반인이 구별하기 어려운 경우가 많아요.\n\n실제 사용 환경에 맞는 등급을 고르는 게 현명한 소비입니다.\n\n#자재선택 #인테리어자재 #가성비",
    "자재를 직접 사면 싸다는 말이 항상 맞는 건 아니에요.\n\n업체는 도매가로 사거든요. 개인이 소매로 사면 오히려 비싼 경우도 있고, 시공 중에 부족하면 추가 구매 배송비도 나와요.\n\n자재 직접 구매는 잘 알 때만 하세요.\n\n#자재구매 #직접구매 #시공비",
    "수입 자재랑 국산 자재 뭐가 나은지는 용도에 따라 달라요.\n\n타일은 국산도 품질 좋은 게 많고, 상판은 수입이 선택지가 넓어요. 무조건 수입이 좋다는 건 편견입니다.\n\nA/S 생각하면 국산이 유리한 경우도 많아요.\n\n#수입자재 #국산자재 #자재비교",
  ],
  "컬러": [
    "벽 컬러 하나 바꿨을 뿐인데 집 분위기가 완전히 달라졌어요.\n\n포인트 벽 한 면만 색을 바꿔도 공간에 깊이감이 생기거든요.\n\n전체를 바꾸려면 부담스러우니까 한 면만 시도해보세요.\n\n#벽컬러 #포인트벽 #인테리어컬러",
    "인테리어 컬러 고를 때 조명까지 같이 봐야 해요.\n\n같은 베이지인데 2700K 조명 아래에서는 따뜻하게 보이고 4000K 아래에서는 칙칙하게 보여요.\n\n컬러랑 조명 색온도를 같이 결정해야 원하는 분위기가 나옵니다.\n\n#컬러선택 #조명컬러 #인테리어분위기",
    "화이트 인테리어가 지겹다면 벽 한 면만 바꿔보세요.\n\n세이지 그린이나 더스티 핑크 같은 톤 다운된 색이 포인트로 좋아요.\n\n나머지 세 면은 그대로 두고 한 면만 바꿔도 분위기가 확 달라집니다.\n\n#포인트컬러 #화이트탈출 #벽면인테리어",
  ],
  "가구": [
    "가구 배치만 바꿔도 동선이 달라져요.\n\n소파 위치를 바꾸고 테이블 방향을 틀어보세요. 같은 가구인데 공간이 넓어 보이는 마법이 생깁니다.\n\n가구 새로 사기 전에 배치부터 바꿔보세요.\n\n#가구배치 #동선설계 #공간활용",
    "가구 살 때 사이즈를 잘못 재는 경우가 많아요.\n\n방 크기만 재고 가구를 사면 안 돼요. 문 열리는 방향, 콘센트 위치, 동선 폭까지 다 고려해야 합니다.\n\n가구 들어왔는데 문이 안 열린다는 이야기, 실제로 자주 있어요.\n\n#가구사이즈 #가구구매 #인테리어실수",
    "가구는 멀쩡한데 집이 좁아 보이면 배치가 문제예요.\n\n벽에 가구를 다 붙이면 오히려 좁아 보여요. 가구 사이에 여백을 주고, 높이가 낮은 가구 위주로 배치하면 공간감이 살아납니다.\n\n#가구정리 #공간감 #인테리어배치",
  ],
  "홈스타일링": [
    "가구 안 바꾸고 소품만 바꿔도 분위기 전환이 돼요.\n\n쿠션 커버, 러그, 화병, 향초. 이런 소품들을 계절마다 바꿔주면 같은 집인데 느낌이 달라집니다.\n\n비용도 10만원이면 충분해요.\n\n#홈스타일링 #소품인테리어 #분위기전환",
    "쿠션이랑 러그만 바꿨는데 거실이 달라졌다는 분들 많아요.\n\n색감을 통일하는 게 포인트입니다. 쿠션, 러그, 커튼 세 가지를 같은 톤으로 맞추면 통일감이 생겨요.\n\n다 다른 색으로 하면 산만해 보입니다.\n\n#쿠션스타일링 #러그교체 #컬러통일",
    "홈스타일링에서 가장 효과 큰 건 패브릭이에요.\n\n커튼, 쿠션, 침구, 러그. 이 네 가지가 공간 분위기의 절반을 차지합니다.\n\n가구는 그대로 두고 패브릭만 바꿔도 계절감이 달라져요.\n\n#패브릭인테리어 #커튼교체 #침구스타일링",
  ],
  "에너지": [
    "난방비 줄이려면 보일러 온도 조절보다 단열이 먼저예요.\n\n창호 교체, 현관문 단열, 발코니 단열 이 세 가지가 에너지 절약 효과가 가장 커요.\n\n한 번 투자하면 매년 절감되니까 가성비가 좋습니다.\n\n#난방비절약 #단열 #에너지효율",
    "여름 냉방비가 많이 나오면 창문이랑 단열을 확인하세요.\n\n서향 창에 차열 필름 하나 붙이면 실내 온도가 2도 이상 내려가요.\n\n커튼도 암막으로 바꾸면 냉방 효율이 올라갑니다.\n\n#냉방비 #차열필름 #여름인테리어",
    "에너지 효율 높이는 인테리어 중에 비용 대비 효과 큰 것들이에요.\n\n창호 교체가 1등이고, LED 조명 전환이 2등, 현관문 단열이 3등입니다.\n\n이 세 가지만 해도 연간 에너지 비용이 20에서 30퍼센트 줄어들어요.\n\n#에너지절약 #효율인테리어 #비용절감",
  ],
  "화장실": [
    "화장실 리폼 비용이 평균 얼마인지 아세요.\n\n1개 기준으로 타일 교체 포함 200에서 400만원 정도입니다. 배관 교체까지 하면 100만원 정도 추가돼요.\n\n범위를 정하고 견적 받으세요.\n\n#화장실리폼 #화장실비용 #욕실교체",
    "화장실이 좁아도 넓어 보이게 만드는 방법이 있어요.\n\n밝은 톤 타일에 큰 사이즈, 거울 넓게, 수납을 벽에 매입하면 바닥이 보여서 넓어 보입니다.\n\n어두운 색 타일에 작은 사이즈는 좁아 보이는 조합이에요.\n\n#작은화장실 #화장실인테리어 #공간활용",
    "변기만 바꿔도 화장실 느낌이 달라져요.\n\n일반 양변기에서 벽걸이형으로 바꾸면 바닥 청소가 쉬워지고 공간도 넓어 보입니다.\n\n비데 일체형으로 가면 깔끔하고, 가격은 설치비 포함 50에서 150만원 정도.\n\n#변기교체 #벽걸이변기 #화장실업그레이드",
  ],
};

// 댓글 템플릿 (카테고리별 CTA 1개 + 정보 댓글 6개 = 7개, 4개씩 조합)
const COMMENTS = {};
for (const catId of CATS.map(c=>c.id)) {
  const cta = [
    "궁금한 점 있으시면 스몰테이블에서 무료 상담 받아보세요. 자세하게 설명드립니다.\n\n상담 신청: " + CTA_LINK,
    "스몰테이블에서 직접 확인해보세요. 현장 방문이랑 견적 상담 다 가능합니다.\n\n문의: " + CTA_LINK,
    "더 자세한 내용이 필요하시면 스몰테이블에서 상담받아보세요.\n\n무료 상담: " + CTA_LINK,
  ];
  COMMENTS[catId] = cta;
}

// 정보성 댓글 풀 (범용, 어떤 카테고리에나 섞어 쓸 수 있는 것들)
const INFO_COMMENTS = [
  "시공 전에 여러 업체 견적을 비교해보시는 게 좋아요. 같은 항목인데 가격 차이가 꽤 나거든요.",
  "자재 샘플은 꼭 집에 가져와서 자연광 아래에서 확인하세요. 매장이랑 다르게 보이는 경우가 많아요.",
  "시공 기간 중에 매일 현장 사진 받으세요. 나중에 문제 생기면 증거가 됩니다.",
  "계약서에 하자 보수 기간이 명시돼있는지 꼭 확인하세요. 최소 1년은 보장받아야 해요.",
  "주변에 최근 인테리어 한 분 있으면 업체 추천 받아보세요. 실제 경험담이 가장 도움이 돼요.",
  "온라인 후기만 보지 말고 현장을 직접 가보시는 게 좋습니다. 사진이랑 실물은 다를 수 있어요.",
  "예산은 여유분 10퍼센트 정도 잡아두세요. 시공 중에 예상 못한 비용이 나올 수 있거든요.",
  "인테리어 순서가 중요해요. 순서 틀리면 재시공 비용이 나올 수 있습니다.",
  "셀프로 할 수 있는 부분과 전문가에게 맡겨야 할 부분을 구분하면 비용을 줄일 수 있어요.",
  "시공 전에 이웃에게 미리 알려두면 민원 문제를 줄일 수 있습니다.",
  "겨울 시공은 난방 유지가 중요하고, 여름은 환기에 신경 써야 해요. 계절 영향이 생각보다 커요.",
  "마감재 선택은 내구성을 기준으로 하세요. 예쁜 것보다 오래가는 게 결국 이득이에요.",
  "비용이 부담되면 부분 인테리어도 방법이에요. 전체 다 하지 않아도 효과 큰 부분만 바꿀 수 있어요.",
  "가구 들어오기 전에 콘센트 위치 한번 더 확인하세요. 가구에 가려지면 못 써요.",
  "완공 후 입주 전에 환기를 충분히 하세요. 최소 일주일은 창문 열어두는 게 좋습니다.",
  "도면이 있으면 가져가세요. 업체 상담할 때 훨씬 정확한 견적을 받을 수 있어요.",
  "조명은 마지막에 고르는 경우가 많은데 초반에 같이 결정해야 배선이 맞아요.",
  "인테리어 관련 커뮤니티 후기를 참고하되, 본인 집 조건이 다를 수 있다는 걸 감안하세요.",
];

// ─── 해시 기반 고유 콘텐츠 생성 (날짜마다 절대 중복 없음) ───
function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// 순열 기반: 전체 조합을 미리 만들고 날짜순으로 배분
function getAllCombinations() {
  const combos = [];
  for (let c = 0; c < CATS.length; c++) {
    for (let h = 0; h < 3; h++) {
      for (let b = 0; b < 3; b++) {
        combos.push({ catIdx: c, hookIdx: h, bodyIdx: b });
      }
    }
  }
  return combos; // 30 x 3 x 3 = 270개
}

// 시드 기반 셔플 (같은 시드면 같은 순서)
function seededShuffle(arr, seed) {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getDailyPosts(date, count = 16) {
  const dateStr = date.toISOString().slice(0, 10);
  const dayNum = Math.floor((date - new Date(2024, 0, 1)) / 86400000);

  // 전체 270개 조합을 연도 기반 시드로 셔플
  const yearSeed = hashCode(String(date.getFullYear()));
  const allCombos = seededShuffle(getAllCombinations(), yearSeed);

  // dayNum * 16으로 오프셋 → 매일 다른 16개 선택
  const startIdx = (dayNum * count) % allCombos.length;

  const posts = [];
  const s = 7 * 60, e = 22 * 60 + 30;
  const gap = Math.floor((e - s) / Math.max(count - 1, 1));

  for (let i = 0; i < count; i++) {
    const combo = allCombos[(startIdx + i) % allCombos.length];
    const cat = CATS[combo.catIdx];
    const hooks = HOOKS[cat.id] || HOOKS["견적"];
    const bodies = BODIES[cat.id] || BODIES["견적"];

    const seed = hashCode(dateStr + '-' + i);

    // CTA 댓글 1개
    const ctaList = COMMENTS[cat.id] || COMMENTS["견적"];
    const cta = ctaList[(seed + i) % ctaList.length];

    // 정보 댓글 3개 (중복 없이)
    const infoPool = [...INFO_COMMENTS];
    const infoComments = [];
    for (let j = 0; j < 3; j++) {
      const pickIdx = (seed + dayNum * 3 + i * 5 + j * 7) % infoPool.length;
      infoComments.push(infoPool.splice(pickIdx, 1)[0]);
    }

    const mins = s + gap * i;
    const time = `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;

    posts.push({
      id: `${dateStr}-${i}`,
      category: cat.name,
      content: `${hooks[combo.hookIdx]}\n\n${bodies[combo.bodyIdx]}`,
      hookLine: hooks[combo.hookIdx],
      comments: [cta, ...infoComments],
      scheduledTime: time,
      status: "scheduled",
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

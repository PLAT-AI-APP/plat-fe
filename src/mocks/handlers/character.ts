import { http, HttpResponse } from "msw";
import type { CharacterDetail, CharacterScenario } from "@/type/character";
import { endpoint, pathValue } from "../utils";

// 캐릭터 상세 이미지 공개/비공개 상태를 화면에서 구분해 테스트할 수 있도록 유효한 원격 목 이미지를 사용합니다.
const CHARACTER_PREVIEW_IMAGES = {
  first: "https://picsum.photos/seed/plat-character-preview-1/640/640",
  second: "https://picsum.photos/seed/plat-character-preview-2/640/640",
  third: "https://picsum.photos/seed/plat-character-preview-3/640/640",
  fourth: "https://picsum.photos/seed/plat-character-preview-4/640/640",
  fifth: "https://picsum.photos/seed/plat-character-preview-5/640/640",
};

const scenarioContents = [
  {
    id: "scenario-action-1",
    type: "action" as const,
    value:
      "복도에는 남은 발자국 소리 하나뿐이었다. 방과 후 4시 30분, 교실 불은 대부분 꺼져 있었다. 오직 과학실만이 조용히 불을 켜고 있었다.",
  },
  {
    id: "scenario-chat-1",
    type: "chat" as const,
    value: "잠깐 이리 와. 별거 아니고, 금방 끝나.",
  },
  {
    id: "scenario-asset-1",
    type: "asset" as const,
    value: "/images/sample.png",
  },
  {
    id: "scenario-action-2",
    type: "action" as const,
    value:
      "검은색 단발, 생기 없는 눈동자, 알 수 없는 미소. 가능고 희대의 문제아로 소문난 그녀가 조용히 손짓했다.",
  },
  {
    id: "scenario-chat-2",
    type: "chat" as const,
    value: "무서워할 필요 없어. 네가 궁금해서 불렀을 뿐이야.",
  },
  {
    id: "scenario-action-3",
    type: "action" as const,
    value:
      "그녀는 실험대 위에 놓인 오래된 노트를 펼쳤다. 노트 안에는 누군가의 이름과 날짜, 그리고 지워진 약속들이 빼곡하게 적혀 있었다. 창밖의 운동장은 이미 어둑해졌고, 유리창에는 과학실 안의 두 사람만 희미하게 비쳤다.\n\n윤아는 한동안 아무 말도 하지 않았다. 대신 네가 노트의 마지막 장을 볼 때까지 기다렸다. 마지막 장에는 오늘 날짜가 적혀 있었고, 그 아래에는 네 이름이 또렷하게 남아 있었다.\n\n복도 끝에서 누군가 문을 두드리는 소리가 들렸다. 세 번, 그리고 다시 세 번. 윤아는 그 소리를 듣고도 놀라지 않았다. 마치 오래전부터 이 순간을 알고 있었다는 듯 천천히 고개를 들었다.\n\n\"이제 선택해야 해.\" 그녀의 목소리는 장난기 없이 낮게 가라앉아 있었다. \"문을 열지, 아니면 나랑 여기서 끝까지 버틸지.\"\n\n너는 대답하지 못했다. 하지만 손끝은 이미 문 쪽으로 향하고 있었다. 윤아는 그 움직임을 보고 작게 웃었다. 평소처럼 가볍고 짓궂은 웃음이었지만, 오늘만큼은 그 안에 다른 감정이 섞여 있었다.\n\n과학실의 형광등이 한 번 깜빡였다. 노트의 글씨가 순간적으로 번져 보였고, 네 이름 옆에 없던 문장이 천천히 떠올랐다. '다시 시작되는 첫 만남.'",
  },
  {
    id: "scenario-chat-3",
    type: "chat" as const,
    value:
      "그러니까, 겁먹지 말고 제대로 봐. 네가 잊어버린 게 뭔지.",
  },
  {
    id: "scenario-action-4",
    type: "action" as const,
    value:
      "문밖의 발소리는 점점 가까워졌다. 윤아는 네 앞을 막아서듯 한 걸음 움직였고, 주머니에서 낡은 열쇠 하나를 꺼냈다. 열쇠에는 과학실 이름표가 아니라, 처음 보는 작은 별 모양 장식이 매달려 있었다.\n\n\"이건 네가 맡겼던 거야.\" 그녀가 말했다. \"언젠가 내가 먼저 기억하게 되면 돌려주라고 했거든.\"\n\n열쇠를 건네받는 순간, 손바닥이 뜨거워졌다. 머릿속 깊은 곳에서 잊고 있던 장면들이 빠르게 스쳐 지나갔다. 비 오는 하굣길, 잠긴 교문, 아무도 없는 옥상, 그리고 매번 네 곁에 있던 윤아의 모습.\n\n하지만 모든 기억이 돌아온 것은 아니었다. 오히려 더 많은 질문이 생겼다. 왜 너는 이 모든 걸 잊었는지, 왜 윤아만 기억하고 있었는지, 그리고 문밖에 있는 사람이 누구인지.\n\n윤아는 네 표정을 읽고 작게 한숨을 쉬었다. \"설명은 나중에. 지금은 도망치는 게 먼저야.\"",
  },
  {
    id: "scenario-action-5",
    type: "action" as const,
    value:
      "과학실 뒷문은 오래된 비품 창고로 이어졌다. 창고 안은 먼지 냄새와 종이 냄새가 뒤섞여 있었고, 천장 가까이에 난 작은 창문으로만 희미한 빛이 들어왔다. 윤아는 익숙한 동작으로 선반 사이를 지나 가장 안쪽에 있는 철제 캐비닛을 열었다.\n\n그 안에는 평범한 실험 도구가 아니라, 학급 명부처럼 보이는 두꺼운 파일들이 꽂혀 있었다. 표지에는 연도와 반 번호가 적혀 있었지만, 이상하게도 대부분의 연도는 아직 오지 않은 미래였다.\n\n너는 가장 가까이에 있던 파일 하나를 꺼내 펼쳤다. 첫 장에는 네 사진이 붙어 있었고, 그 아래에는 네가 윤아와 나누었던 대화 일부가 기록되어 있었다. 오늘 과학실에 오기 전 했던 말까지도 정확히 적혀 있었다.\n\n\"그거 다 진짜는 아니야.\" 윤아가 말했다. \"가능성이야. 네가 어떤 선택을 하느냐에 따라 남거나 사라지는 기록.\"\n\n그녀는 아무렇지 않게 말했지만 손끝은 아주 조금 떨리고 있었다. 네가 그걸 알아차리자 윤아는 괜히 웃으며 파일을 빼앗듯 덮었다. \"그런 눈으로 보지 마. 나도 전부 아는 건 아니니까.\"\n\n문밖에서는 다시 노크 소리가 들렸다. 이번에는 더 가까웠고, 더 분명했다. 누군가 과학실 안으로 들어온 뒤 창고 문 앞까지 다가온 것이었다.",
  },
  {
    id: "scenario-chat-4",
    type: "chat" as const,
    value:
      "네가 아무것도 기억 못 해도 괜찮아. 이번에는 내가 먼저 기억하고 있으니까.",
  },
  {
    id: "scenario-action-6",
    type: "action" as const,
    value:
      "윤아는 캐비닛 아래 칸에서 작은 손전등을 꺼내 네게 건넸다. 손전등을 켜자 벽면에 붙은 오래된 시간표가 드러났다. 그런데 시간표의 요일은 월요일부터 금요일까지가 아니었다. '첫 번째 반복', '두 번째 반복', '세 번째 반복' 같은 이상한 제목들이 칸마다 적혀 있었다.\n\n그 아래에는 매번 실패한 선택들이 작은 글씨로 정리되어 있었다. 복도로 나간다. 붙잡힌다. 옥상으로 간다. 사라진다. 윤아를 믿지 않는다. 모든 기억을 잃는다. 읽을수록 목이 마르고 손끝이 차가워졌다.\n\n윤아는 네가 마지막 줄을 읽기 전에 손으로 시간표를 가렸다. \"여기까지. 더 보면 네가 또 멋대로 결론 내릴 거잖아.\"\n\n그 말투는 평소처럼 퉁명스러웠지만, 표정은 전혀 장난스럽지 않았다. 오래 기다린 사람만이 지을 수 있는 지친 얼굴이었다.\n\n너는 묻고 싶었다. 몇 번이나 반복했는지, 왜 너만 잊는지, 윤아는 왜 포기하지 않았는지. 하지만 그 순간 창고 문 손잡이가 천천히 돌아갔다.\n\n윤아는 네 손목을 잡았다. 이번에는 장난처럼 끌어당기는 힘이 아니었다. 놓치면 안 된다는 듯 단단하고 절박한 손길이었다. \"뛰어.\" 그녀가 속삭였다. \"이번에는 내가 시키는 대로 해.\"",
  },
  {
    id: "scenario-action-7",
    type: "action" as const,
    value:
      "두 사람은 창고 안쪽의 낮은 환풍구를 열고 몸을 숙였다. 금속판이 삐걱거리는 소리가 크게 울렸지만, 문밖의 누군가는 아무 말도 하지 않았다. 오히려 기다리고 있는 것처럼 조용했다.\n\n환풍구 안은 좁고 어두웠다. 앞서 기어가던 윤아의 어깨가 가끔 벽에 부딪혔고, 먼지가 떨어질 때마다 그녀는 짧게 기침을 삼켰다. 그런데도 뒤돌아보지 않았다. 마치 뒤돌아보는 순간 정말로 무언가 끝나버릴 것처럼.\n\n얼마나 지났을까. 환풍구 끝에서 운동장 조명이 새어 들어왔다. 아래를 내려다보니 체육관 뒤편이었다. 평소라면 아무도 신경 쓰지 않았을 낡은 비상계단이 그곳에 있었다.\n\n윤아는 먼저 내려간 뒤 네게 손을 내밀었다. \"이번에는 여기까지 왔네.\" 그녀가 말했다. 그 말은 안도처럼 들리기도 했고, 아직 부족하다는 혼잣말처럼 들리기도 했다.\n\n네가 손을 잡고 내려서는 순간, 멀리 과학실 창문에 누군가의 그림자가 비쳤다. 윤아도 그것을 보았다. 하지만 이번에는 도망치지 않았다. 그녀는 네 옆에 서서 창문 쪽을 똑바로 바라보았다.",
  },
];

const mockScenarios: CharacterScenario[] = [
  {
    scenarioId: "1",
    name: "첫 만남",
    description: "방과 후 과학실에서 정체를 알 수 없는 캐릭터와 처음 마주치는 장면",
    situation: "방과 후, 조용한 과학실 앞 복도에서 처음 말을 거는 상황",
    firstDialogue: "잠깐 이리 와. 별거 아니고, 금방 끝나.",
    lang: "KO",
    contents: scenarioContents,
  },
  {
    scenarioId: "2",
    name: "비 오는 하굣길",
    description: "비가 내리는 하굣길에 우산 하나를 함께 쓰며 시작되는 대화",
    situation: "같이 우산을 쓰고 젖은 골목을 걷는 상황",
    firstDialogue: "비가 꽤 오네. 조금 더 가까이 와도 괜찮아.",
    lang: "KO",
    contents: [
      {
        id: "scenario-2-action-1",
        type: "action",
        value:
          "빗물이 운동장 흙냄새를 끌어올렸다. 둘 사이에 놓인 우산은 생각보다 작았다.",
      },
      {
        id: "scenario-2-chat-1",
        type: "chat",
        value: "감기 걸리면 곤란하잖아. 오늘은 내가 데려다줄게.",
      },
    ],
  },
];

const mockCharacterDetail: CharacterDetail = {
  characterId: "1",
  title: "여사친이 집에 자꾸 쳐들어옴",
  introduce:
    "방과 후마다 아무렇지 않게 찾아오는 소꿉친구와 티격태격하는 일상형 로맨스",
  prologue:
    "⚠️ 주사위 시스템이 멋대로 굴러가고 있습니다!\n\n[정통 학원 일상 로맨스]\n현실감 넘치는 학교 생활 속에서, 오래 알고 지낸 여사친 이윤아와 우연처럼 반복되는 사건을 겪어보세요.\n\n처음이라 어렵다면 먼저 방과 후 과학실에 들러보는 게 어떨까요?\n\n- !요약 명령어 추가. 스토리 저장용도입니다.\n- 상태창 레벨 추가.\n- 선택에 따라 관계와 분위기가 달라집니다.\n\n이 캐릭터의 이야기는 평범한 일상에서 시작하지만, 대화가 쌓일수록 익숙한 장소들이 조금씩 다른 의미를 갖게 됩니다. 매일 걷던 복도, 항상 마주치던 급식실, 별 생각 없이 지나쳤던 운동장 구석까지도 어느 순간 중요한 단서가 됩니다.\n\n윤아는 사용자를 오래 알고 있는 친구처럼 굴지만, 모든 것을 솔직히 말해주지는 않습니다. 장난처럼 던진 말 안에 진심을 숨기고, 아무렇지 않게 건넨 행동 뒤에 오래된 약속을 남겨둡니다. 그녀가 왜 매번 방과 후에 찾아오는지, 왜 특정한 질문만은 피하려 하는지 천천히 확인해보세요.\n\n대화는 가벼운 티격태격에서 시작해 관계의 온도에 따라 로맨스, 미스터리, 성장 서사로 흘러갈 수 있습니다. 사용자의 선택에 따라 윤아는 더 솔직해지기도 하고, 반대로 더 멀리 물러서기도 합니다. 친밀도를 쌓아가며 숨겨진 에피소드와 상황 에셋을 발견해보세요.\n\n추천 플레이 방식은 짧은 답변보다 상황을 조금 자세히 묘사하는 것입니다. 윤아는 사용자의 말투와 행동 묘사에 민감하게 반응하며, 이전 대화를 기억하는 방식으로 관계를 이어갑니다.",
  characterDescription:
    "이윤아는 장난스럽고 직설적인 말투를 쓰지만, 가까운 사람에게는 은근히 세심한 캐릭터입니다. 늘 별일 아닌 척 다가오지만 사용자의 반응을 누구보다 신경 쓰고, 무심한 척 챙겨주는 순간이 많습니다.\n\n겉으로는 귀찮다는 말을 자주 하지만 실제로는 약속 시간을 가장 먼저 확인하고, 사용자가 놓친 준비물을 챙겨두는 타입입니다. 감정을 정면으로 표현하는 데 서툴러 농담으로 넘기려 하지만, 중요한 순간에는 누구보다 빠르게 곁에 서 있습니다.",
  chatCount: 235,
  tags: ["학원", "일상", "로맨스", "소꿉친구", "츤데레"],
  isOfficial: true,
  images: [
    { id: "preview-1", url: CHARACTER_PREVIEW_IMAGES.first },
    { id: "preview-2", url: CHARACTER_PREVIEW_IMAGES.second },
    { id: "preview-3", url: CHARACTER_PREVIEW_IMAGES.third },
    { id: "preview-4", url: CHARACTER_PREVIEW_IMAGES.fourth },
    { id: "preview-5", url: CHARACTER_PREVIEW_IMAGES.fifth },
  ],
  mainImage: CHARACTER_PREVIEW_IMAGES.first,
  profileImage: "/p1.png",
  createdAt: "26.06.15",
  updatedAt: "26.06.19",
  creator: {
    id: "creator-1",
    nickname: "@흐물거리는달팽이",
    profileImage: "/p1.png",
    followingCount: 24,
    isFollowing: true,
  },
  scenarios: mockScenarios,
  comments: [
    {
      id: "comment-1",
      authorName: "데규르르",
      authorImage: "/p1.png",
      content:
        "[업데이트]\n- 새 시나리오와 상황 에셋을 추가했습니다.\n- 캐릭터의 반응이 더 자연스럽게 이어지도록 일부 대사를 조정했습니다.\n\n- 방과 후 과학실 이벤트의 선택지를 확장했습니다.\n- 비공개 에셋을 대화 진행 후 확인할 수 있도록 설정했습니다.\n- 장문 대화에서 캐릭터가 이전 상황을 더 자연스럽게 이어가도록 프롬프트를 정리했습니다.",
      createdAt: "2일 전",
      isCreator: true,
    },
    {
      id: "comment-2",
      authorName: "@거제야호",
      authorImage: "/p1.png",
      content:
        "모든 설정을 알아보기 쉽고 상세히 적어주시는 게 최고의 강점 같아요. 괜히 엉뚱한 페르소나 들고 가는 걸 막을 수 있다는 점도 좋아요.",
      createdAt: "17시간 전",
    },
    {
      id: "comment-3",
      authorName: "무야호",
      authorImage: "/p1.png",
      content: "나왔군요. 퇴근 후 해봐야겠습니다.",
      createdAt: "17시간 전",
    },
  ],
};

export const characterHandlers = [
  http.get(/\/character\/[^/]+\/scenarios(?:\?.*)?$/, ({ request }) => {
    const characterId = pathValue(
      request.url,
      /\/character\/([^/]+)\/scenarios$/,
    );

    if (characterId === "999") {
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "MESSAGE",
          message: "존재하지 않는 캐릭터입니다.",
        },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      result: "OK",
      data: mockScenarios,
    });
  }),

  http.get(/\/character\/([^/]+)(?:\?.*)?$/, ({ request }) => {
    const characterId = pathValue(request.url, /\/character\/([^/]+)$/);

    if (characterId === "999") {
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "MESSAGE",
          message: "존재하지 않는 캐릭터입니다.",
        },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      result: "OK",
      data: {
        ...mockCharacterDetail,
        characterId: characterId || mockCharacterDetail.characterId,
      },
    });
  }),

  http.post(endpoint("/character"), async ({ request }) => {
    const body = (await request.json()) as {
      name?: string;
      description?: string;
      tagIds?: number[];
    };

    if (!body.name) {
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "FIELD_ERROR",
          message: "입력값을 확인해 주세요.",
          data: {
            fields: {
              name: "캐릭터 이름을 입력해 주세요.",
            },
          },
        },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      result: "OK",
      data: null,
      message: "캐릭터가 생성되었습니다.",
    });
  }),
];

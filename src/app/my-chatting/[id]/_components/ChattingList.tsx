import ChattingItem from "./ChattingItem";

const PERSONA_LIST_MOCK = [
  {
    id: "1",
    title: "진짜 롤메가 여자 'TS'가 됐다",
    description:
      "병원 특유의 소독약 냄새와 낯선 기계음이 섞여 연우의 신경을 곤두세게 했다. 신이 손을 잡아 이끌었지...",
    creator: "페르소나이름",
    thumbnail: "/images/sample.png",
    updatedAt: "2026-04-25T15:30:00Z", // 약 9시간 전 (현재 시간 기준 가정)
  },
  {
    id: "2",
    title: "사이버펑크 해커 리온",
    description:
      "네온 사인이 깜빡이는 뒷골목. 당신은 리온의 아지트를 찾아왔다. 그는 여러 모니터 앞에 앉아 무언가를...",
    creator: "페르소나이름",
    thumbnail: "/images/sample.png",
    updatedAt: "2026-04-24T10:00:00Z", // 2일 전
  },
  {
    id: "3",
    title: "판타지 엘프 마법사",
    description:
      "고대 숲의 깊은 곳. 은빛 머리카락의 엘프가 당신을 발견하고 경계의 눈빛을 보낸다... 그녀의 손에 들린 활...",
    creator: "페르소나이름",
    thumbnail: "/images/sample.png",
    updatedAt: "2026-04-19T09:00:00Z", // 1주 전
  },
  {
    id: "4",
    title: "미스터리 탐정 설록",
    description:
      '"흥미로운 사건이군. 함께 진실을 찾아볼까?" 설록이 돋보기를 꺼내며 미소 지었다. 그의 눈은 날카롭게...',
    creator: "페르소나이름",
    thumbnail: "/images/sample.png",
    updatedAt: "2026-04-12T14:00:00Z", // 2주 전
  },
];

const ChattingList = () => {
  return (
    <section>
      <ul className="flex flex-col gap-2">
        {PERSONA_LIST_MOCK.map(
          ({ creator, description, id, thumbnail, title, updatedAt }) => (
            <ChattingItem
              key={id}
              creator={creator}
              description={description}
              id={id}
              thumbnail={thumbnail}
              title={title}
              updatedAt={updatedAt}
            />
          ),
        )}
      </ul>
    </section>
  );
};

export default ChattingList;

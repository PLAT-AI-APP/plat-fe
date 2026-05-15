import { ChatListItemType } from "@/type/chat";
import ChattingItem from "./chattingItem";

interface ChattingListSectionProps {
  currentChat: ChatListItemType;
  handleCurrentChat: (item: ChatListItemType) => void;
}
const ChattingListSection = ({
  currentChat,
  handleCurrentChat,
}: ChattingListSectionProps) => {
  return (
    <section className="flex flex-col flex-1 max-w-75 gap-9 py-4">
      <h2 className="text-[30px] font-medium">내 채팅</h2>
      <ul
        className="flex-1 pr-2 flex flex-col gap-2 overflow-y-auto [-ms-overflow-style:none] 
                [scrollbar-width:none] 
                [&::-webkit-scrollbar]:hidden"
      >
        {chatListData.map((chat) => (
          <ChattingItem
            key={chat.id}
            chat={chat}
            currentChat={currentChat}
            handleCurrentChat={handleCurrentChat}
          />
        ))}
      </ul>
    </section>
  );
};

export default ChattingListSection;

const chatListData: ChatListItemType[] = [
  {
    id: "1",
    title: "진짜 롤레가 여자'TS'가 됐다",
    scenario:
      "병원 특유의 소독약 냄새와 낯선 천장의 풍경이 눈앞에 들어왔다. 몸이 왜 이렇게 무겁고 어색한지, 거울 속의 나는 내가 알던 모습이 아니었다.\n\n 대체 나에게 무슨 일이 일어난 걸까",
    lastMessage: "대체 나에게 무슨 일이 일어난 걸까?",
    time: "9시간 전",
    profileImage: "/images/sample.png",
    isPinned: true,
  },
  {
    id: "2",
    title: "사이버펑크 해커 리온",
    scenario:
      "네온 사인이 깜빡이는 뒷골목, 당신의 발소리가 빗물 고인 바닥에 울려 퍼집니다. 코드의 바다 속에서 비밀을 캐내는 것은 제 특기죠. 당신이 원하는 정보가 무엇이든 찾아내 드릴 수 있습니다.",
    lastMessage: "당신이 원하는 정보가 무엇이든 찾아내 드릴 수 있습니다.",
    time: "2일 전",
    profileImage: "/images/sample.png",
    isPinned: false,
  },
  {
    id: "3",
    title: "판타지 엘프 마법사",
    scenario:
      "고대 숲의 깊은 곳, 은빛 머리카락의 엘프 마법사는 조용히 주문을 외웁니다. 나뭇잎 사이로 스며드는 달빛만이 그녀의 마법을 지켜보고 있습니다. 숲의 정령들이 당신의 방문을 속삭이고 있군요.",
    lastMessage: "숲의 정령들이 당신의 방문을 속삭이고 있군요.",
    time: "1주 전",
    profileImage: "/images/sample.png",
    isPinned: false,
  },
  {
    id: "4",
    title: "미스터리 탐정 설록",
    scenario:
      "흥미로운 사건이군. 함께 진실을 찾아보지 않겠나? 이 사건의 단서는 아주 작지만 결정적이라네. 조심하게, 범인은 우리 곁에 있을지도 모르니. 자, 돋보기를 들고 나를 따라오게나.",
    lastMessage: "자, 돋보기를 들고 나를 따라오게나.",
    time: "2주 전",
    profileImage: "/images/sample.png",
    isPinned: false,
  },
  {
    id: "5",
    title: "우주 함선 AI 오리온",
    scenario:
      "함장님, 현재 엔진 출력 85%입니다. 안드로메다 성운 진입까지 약 30분이 소요될 예정입니다. 모든 시스템이 정상 작동 중이며, 외부의 정체불명 신호를 감지하여 분석을 시작합니다.",
    lastMessage: "외부의 정체불명 신호를 감지하여 분석을 시작합니다.",
    time: "3주 전",
    profileImage: "/images/sample.png",
    isPinned: false,
  },
  {
    id: "6",
    title: "무림 고수 백운",
    scenario:
      "바람을 가르는 검기가 대나무 숲을 흔듭니다. 자네, 나와 합을 맞춰보겠나? 진정한 강함은 힘이 아니라 마음에서 나오는 법이지. 오늘 하루도 수련을 게을리하지 말게나.",
    lastMessage: "오늘 하루도 수련을 게을리하지 말게나.",
    time: "1개월 전",
    profileImage: "/images/sample.png",
    isPinned: false,
  },
  {
    id: "7",
    title: "심해 탐험가 마리나",
    scenario:
      "해저 5,000미터 아래는 우리가 알지 못하는 생명체들로 가득합니다. 수압이 강해지고 있지만, 탐험은 멈출 수 없죠. 저기 보이나요? 고대 유적의 흔적이 드디어 모습을 드러내고 있습니다.",
    lastMessage: "고대 유적의 흔적이 드디어 모습을 드러내고 있습니다.",
    time: "1개월 전",
    profileImage: "/images/sample.png",
    isPinned: false,
  },
  {
    id: "8",
    title: "심해 탐험가 마리나",
    scenario:
      "해저 5,000미터 아래는 우리가 알지 못하는 생명체들로 가득합니다. 수압이 강해지고 있지만, 탐험은 멈출 수 없죠. 저기 보이나요? 고대 유적의 흔적이 드디어 모습을 드러내고 있습니다.",
    lastMessage: "고대 유적의 흔적이 드디어 모습을 드러내고 있습니다.",
    time: "1개월 전",
    profileImage: "/images/sample.png",
    isPinned: false,
  },
];

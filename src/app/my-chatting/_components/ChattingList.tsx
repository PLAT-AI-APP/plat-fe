import { Fragment } from "react";
import type { MyChattingSortOption } from "@/components/popover/MyChattingSortPopover";
import ChattingItem from "./ChattingItem";

const CHATTING_LIST_MOCK = [
  {
    id: "1",
    title: "미스터리 탐정 셜록",
    description:
      '"흥미로운 사건이군. 함께 진실을 찾아볼까?" 셜록이 돋보기를 꺼내며 미소 지었다. 그의 눈은 날카롭게 빛나고, 주변의 모든 것을 분석하려는 듯 쉴 새 없이 움직였다.',
    chatCount: 235,
    creator: "페르소나이름",
    isPinned: true,
    thumbnail: "/images/sample.png",
    updatedAt: "2026-04-25T15:30:00Z",
  },
  {
    id: "2",
    title: "미스터리 탐정 셜록",
    description:
      '"흥미로운 사건이군. 함께 진실을 찾아볼까?" 셜록이 돋보기를 꺼내며 미소 지었다. 그의 눈은 날카롭게 빛나고, 주변의 모든 것을 분석하려는 듯 쉴 새 없이 움직였다.',
    chatCount: 418,
    creator: "페르소나이름",
    thumbnail: "/images/sample.png",
    updatedAt: "2026-04-24T10:00:00Z",
  },
  {
    id: "3",
    title: "미스터리 탐정 셜록",
    description:
      '"흥미로운 사건이군. 함께 진실을 찾아볼까?" 셜록이 돋보기를 꺼내며 미소 지었다. 그의 눈은 날카롭게 빛나고, 주변의 모든 것을 분석하려는 듯 쉴 새 없이 움직였다.',
    chatCount: 91,
    creator: "페르소나이름",
    thumbnail: "/images/sample.png",
    updatedAt: "2026-04-19T09:00:00Z",
  },
  {
    id: "4",
    title: "미스터리 탐정 셜록",
    description:
      '"흥미로운 사건이군. 함께 진실을 찾아볼까?" 셜록이 돋보기를 꺼내며 미소 지었다. 그의 눈은 날카롭게 빛나고, 주변의 모든 것을 분석하려는 듯 쉴 새 없이 움직였다.',
    chatCount: 302,
    creator: "페르소나이름",
    thumbnail: "/images/sample.png",
    updatedAt: "2026-04-12T14:00:00Z",
  },
  {
    id: "5",
    title: "미스터리 탐정 셜록",
    description:
      '"흥미로운 사건이군. 함께 진실을 찾아볼까?" 셜록이 돋보기를 꺼내며 미소 지었다. 그의 눈은 날카롭게 빛나고, 주변의 모든 것을 분석하려는 듯 쉴 새 없이 움직였다.',
    chatCount: 235,
    creator: "페르소나이름",
    thumbnail: "/images/sample.png",
    updatedAt: "2026-04-12T14:00:00Z",
  },
];

interface ChattingListProps {
  searchQuery: string;
  sortOption: MyChattingSortOption;
}

const ChattingList = ({ searchQuery, sortOption }: ChattingListProps) => {
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredChattingList = CHATTING_LIST_MOCK.filter((chat) => {
    if (!normalizedSearchQuery) return true;

    return [chat.title, chat.description, chat.creator].some((value) =>
      value.toLowerCase().includes(normalizedSearchQuery),
    );
  });

  const sortedChattingList = [...filteredChattingList].sort((prev, next) => {
    if (sortOption === "chatCount") {
      return next.chatCount - prev.chatCount;
    }

    const prevTime = new Date(prev.updatedAt).getTime();
    const nextTime = new Date(next.updatedAt).getTime();

    return sortOption === "oldest" ? prevTime - nextTime : nextTime - prevTime;
  });

  return (
    <section>
      <ul className="flex flex-col gap-2">
        {sortedChattingList.map(
          (
            {
              chatCount,
              creator,
              description,
              id,
              isPinned,
              thumbnail,
              title,
              updatedAt,
            },
            index,
          ) => (
            <Fragment key={id}>
              <ChattingItem
                chatCount={chatCount}
                creator={creator}
                description={description}
                id={id}
                isPinned={isPinned}
                thumbnail={thumbnail}
                title={title}
                updatedAt={updatedAt}
              />

              {index < sortedChattingList.length - 1 && (
                <li className="mx-10 h-px bg-main" aria-hidden="true" />
              )}
            </Fragment>
          ),
        )}
      </ul>
    </section>
  );
};

export default ChattingList;

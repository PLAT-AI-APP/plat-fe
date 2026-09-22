import Link from "next/link";
import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/state";

interface CreatedEmptyStateProps {
  isOwnProfile: boolean;
}

/**
 * 프로필 캐릭터 탭이 비었을 때.
 *
 * 이 목록은 본인 프로필이어도 공개 작품만 보여 준다(비공개는 스튜디오에서만 보인다). 그래서
 * "만든 게 없다" 가 아니라 "공개한 게 없다" 로 말해야 비공개 작품만 있는 사람에게도 틀리지 않는다.
 * 본인에게는 만들러 갈 길을 함께 보여 주고, 남의 프로필에서는 사실만 알린다.
 */
const CreatedEmptyState = ({ isOwnProfile }: CreatedEmptyStateProps) => {
  const t = useTranslations("profile.createdEmpty");

  return (
    <EmptyState mood="peek" message={t("title")}>
      {isOwnProfile && (
        <>
          <p className="body-5 break-keep text-font-disabled">
            {t("mineDescription")}
          </p>
          <Link
            href="/character-creat"
            className="mt-3 flex w-full max-w-[308px] items-center justify-center rounded-2xl bg-card-hover p-4 transition-colors hover:bg-card-selected"
          >
            <span className="title-3 text-font-1">{t("create")}</span>
          </Link>
        </>
      )}
    </EmptyState>
  );
};

export default CreatedEmptyState;

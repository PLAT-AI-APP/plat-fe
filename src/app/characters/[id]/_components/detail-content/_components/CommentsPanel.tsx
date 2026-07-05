import Image from "next/image";
import { useTranslations } from "next-intl";
import { CharacterDetail } from "@/type/character";
import CommentExpandableBody from "./CommentExpandableBody";
import CommentInputBox from "./CommentInputBox";
import CommentMenuButton from "./CommentMenuButton";

interface CommentsPanelProps {
  character: CharacterDetail;
}

const CommentsPanel = ({ character }: CommentsPanelProps) => {
  const t = useTranslations("characterDetail");

  return (
    <section className="flex flex-col gap-6">
      <h2 className="body-2 text-font-1">
        {t("commentsCount", { count: character.comments.length })}
      </h2>

      <CommentInputBox />

      <ul className="flex flex-col gap-5">
        {character.comments.map((comment) => (
          <li key={comment.id} className="flex gap-2">
            <Image
              src={comment.authorImage}
              alt={t("profileAlt", { name: comment.authorName })}
              width={36}
              height={36}
              className="size-9 rounded-full object-cover"
            />
            <article className="flex min-w-0 flex-1 flex-col gap-3">
              <header className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={
                      comment.isCreator
                        ? "body-4 rounded bg-font-1 px-1.5 py-0.5 text-bg-dark"
                        : "title-5 text-font-1"
                    }
                  >
                    {comment.authorName}
                  </span>
                  <span className="body-6 text-font-2">{comment.createdAt}</span>
                </div>
                <CommentMenuButton isMine />
              </header>
              <CommentExpandableBody content={comment.content} />
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CommentsPanel;

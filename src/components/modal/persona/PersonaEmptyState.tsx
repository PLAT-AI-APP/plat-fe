import { useTranslations } from "next-intl";
import EmptyMascot from "@/components/state/EmptyMascot";

const PersonaEmptyState = () => {
  const t = useTranslations("modalUi.personaList");

  return (
    <div className="flex min-h-38 flex-col items-center justify-center gap-2 rounded-2xl bg-card px-4 pt-4 pb-6 text-center">
      <EmptyMascot
        mood="wave"
        className="w-32 [mask-image:linear-gradient(to_bottom,#000_72%,transparent)]"
      />
      <p className="title-4 text-font-1">{t("emptyTitle")}</p>
      <p className="body-5 text-font-2">{t("emptyDescription")}</p>
    </div>
  );
};

export default PersonaEmptyState;

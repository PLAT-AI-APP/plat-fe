import { useTranslations } from "next-intl";

const PersonaEmptyState = () => {
  const t = useTranslations("modalUi.personaList");

  return (
    <div className="flex min-h-38 flex-col items-center justify-center gap-2 rounded-2xl bg-card px-4 py-8 text-center">
      <p className="title-4 text-font-1">{t("emptyTitle")}</p>
      <p className="body-4 text-font-2">{t("emptyDescription")}</p>
    </div>
  );
};

export default PersonaEmptyState;

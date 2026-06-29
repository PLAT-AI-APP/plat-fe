import { useTranslations } from "next-intl";

const PREVIEW_APPLIED_ELEMENT_KEYS = [
  ["title", "titleSource"],
  ["bottomContent", "bottomContentSource"],
  ["profileImage", "profileImageSource"],
  ["chatBubble", "chatBubbleSource"],
] as const;

const PreviewAppliedElements = () => {
  const t = useTranslations("characterCreate.cardPreview");

  return (
    <footer className="flex w-full flex-col gap-3 rounded-xl bg-card px-3 py-3">
      <p className="caption-2 text-font-2">{t("appliedElements")}</p>
      <dl className="grid grid-cols-4 gap-4">
        {PREVIEW_APPLIED_ELEMENT_KEYS.map(([labelKey, valueKey]) => (
          <div key={labelKey} className="flex min-w-0 flex-col gap-1">
            <dt className="body-3 truncate text-font-1">{t(labelKey)}</dt>
            <dd className="body-4 truncate text-font-2">{t(valueKey)}</dd>
          </div>
        ))}
      </dl>
    </footer>
  );
};

export default PreviewAppliedElements;

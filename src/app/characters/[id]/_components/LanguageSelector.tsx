import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  languages: string[];
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
}

const LanguageSelector = ({
  languages,
  currentLanguage,
  onLanguageChange,
}: LanguageSelectorProps) => {
  return (
    <ul className="flex gap-2 flex-wrap">
      {languages.map((lang) => (
        <li
          key={lang}
          onClick={() => onLanguageChange(lang)}
          className={cn(
            "flex items-center cursor-pointer h-6 px-2 py-0.5 border rounded-lg text-sm",
            currentLanguage === lang
              ? "border-font-1 text-font-1"
              : "border-border-main text-font-2 hover:bg-btn-hover",
          )}
        >
          {lang}
        </li>
      ))}
    </ul>
  );
};

export default LanguageSelector;

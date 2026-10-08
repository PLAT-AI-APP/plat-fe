import AdultBadge from "@/components/adult/AdultBadge";
import Logo from "@/icons/Logo";
import New from "@/icons/New";

interface TitleStatusIconProps {
  isOfficial: boolean;
  isNew: boolean;
  /** 성인 세계관이면 공식·신작 표시와 함께 19 배지를 단다. */
  adult?: boolean;
}

const StatusIcon = ({ isOfficial, isNew }: TitleStatusIconProps) => {
  if (isOfficial) return <Logo className="size-[18px] shrink-0" />;
  if (isNew) return <New className="size-[18px] shrink-0 text-font-0" />;
  return null;
};

const TitleStatusIcon = ({ isOfficial, isNew, adult = false }: TitleStatusIconProps) => (
  <>
    {adult && <AdultBadge />}
    <StatusIcon isOfficial={isOfficial} isNew={isNew} />
  </>
);

export default TitleStatusIcon;

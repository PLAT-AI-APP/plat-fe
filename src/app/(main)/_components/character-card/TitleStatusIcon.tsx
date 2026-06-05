import Logo from "@/icons/Logo";
import New from "@/icons/New";

interface TitleStatusIconProps {
  isOfficial: boolean;
  isNew: boolean;
}

const TitleStatusIcon = ({ isOfficial, isNew }: TitleStatusIconProps) => {
  if (isOfficial) return <Logo className="size-[18px] shrink-0" />;
  if (isNew) return <New className="size-[18px] shrink-0 text-font-0" />;
  return null;
};

export default TitleStatusIcon;

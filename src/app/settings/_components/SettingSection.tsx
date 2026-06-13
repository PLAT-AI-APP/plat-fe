interface SettingSectionProps {
  children: React.ReactNode;
  title: string;
}

const SettingSection = ({ children, title }: SettingSectionProps) => {
  return (
    <section className="flex w-full flex-col gap-3">
      <h2 className="title-5 w-full text-font-disabled">{title}</h2>
      <div className="flex w-full flex-col">{children}</div>
    </section>
  );
};

export default SettingSection;

import type { Metadata } from "next";
import SettingsContents from "./_components/SettingsContents";

export const metadata: Metadata = {
  title: "설정",
};

const SettingsPage = () => {
  return <SettingsContents />;
};

export default SettingsPage;

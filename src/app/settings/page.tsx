import type { Metadata } from "next";
import SettingsContents from "./_components/SettingsContents";

export const metadata: Metadata = {
  title: "Settings",
};

const SettingsPage = () => {
  return <SettingsContents />;
};

export default SettingsPage;

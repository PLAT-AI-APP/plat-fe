import { ScenarioContentItem } from "@/type/character";

export interface CreatePreviewListProps {
  contents: ScenarioContentItem[];
  characterName: string;
  profileImage: string;
  isEditable?: boolean;
  onUpdate?: (id: string, newValue: string) => void;
  onDelete?: (id: string) => void;
  onReorder?: (newContents: ScenarioContentItem[]) => void;
}

export interface PreviewEditLabels {
  editContent: string;
  deleteContent: string;
  cancelEdit: string;
  confirmEdit: string;
}

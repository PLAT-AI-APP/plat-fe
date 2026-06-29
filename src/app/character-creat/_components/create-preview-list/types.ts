import { ScenarioContentItem } from "@/type/character";

export interface CreatePreviewListProps {
  contents: ScenarioContentItem[];
  characterName: string;
  profileImage: string;
  isEditable?: boolean;
  onUpdate?: (id: string, newValue: string) => void;
  onDelete?: (id: string) => void;
}

export interface PreviewEditLabels {
  editContent: string;
  deleteContent: string;
  cancelEdit: string;
  confirmEdit: string;
}

export interface PersonaType {
  id: string;
  name: string;
  description: string;
  isDefault: boolean; // '기본' 태그 여부
  isSelected: boolean; // 체크 표시(선택됨) 여부
}

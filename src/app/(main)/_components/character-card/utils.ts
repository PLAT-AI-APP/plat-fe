export const normalizeImages = (images: string[] | string) =>
  Array.isArray(images) ? images : [images];

export const normalizeSelectedTags = (selectedTags?: string | string[]) => {
  if (!selectedTags) return [];
  return Array.isArray(selectedTags) ? selectedTags : [selectedTags];
};

export const orderTagsBySelection = (
  tagList: string[] = [],
  selectedTagSet: Set<string>,
) => {
  // 원본 tagList는 그대로 두고, 카드 안에서 보이는 순서만 선택 태그 우선으로 재배치합니다.
  const selected = tagList.filter((tag) => selectedTagSet.has(tag));
  const unselected = tagList.filter((tag) => !selectedTagSet.has(tag));

  return [...selected, ...unselected];
};

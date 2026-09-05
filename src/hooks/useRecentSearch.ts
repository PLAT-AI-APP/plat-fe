import { useState } from "react";

const STORAGE_KEY = "recent_searches";
const MAX_COUNT = 10; // 최대 저장 개수

export const useRecentSearch = () => {
  const [keywords, setKeywords] = useState<string[]>(() => {
    // 컴포넌트 생성 시점에 로컬스토리지에서 바로 읽어옴
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  /** 키워드 저장 함수 **/
  const addKeyword = (text: string) => {
    if (!text.trim()) return;

    const newList = [
      text,
      ...keywords.filter((k) => k !== text), // 중복 제거 및 최신화를 위해 기존 동일어 삭제
    ].slice(0, MAX_COUNT); // 최대 개수 제한

    setKeywords(newList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  };

  /** 개별 삭제 함수 **/
  const removeKeyword = (text: string) => {
    const newList = keywords.filter((k) => k !== text);
    setKeywords(newList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  };

  /** 전체 삭제 함수 **/
  const clearAll = () => {
    setKeywords([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { keywords, addKeyword, removeKeyword, clearAll };
};

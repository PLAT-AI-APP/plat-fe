import SkeletonCharacterDetail from "@/components/skeleton/SkeletonCharacterDetail";

// 본문도 데이터를 받는 동안 같은 스켈레톤을 그린다. 여기서 마스코트를 보이면 마스코트 → 스켈레톤 →
// 본문으로 화면이 두 번 바뀌었다.
const Loading = () => <SkeletonCharacterDetail />;

export default Loading;

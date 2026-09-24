import RouteLoading from "@/components/state/RouteLoading";

// 동적 라우트라 이 파일이 없으면 링크를 누른 뒤 서버 응답이 올 때까지 이전 화면이 그대로 멈춰 있었다.
const Loading = () => <RouteLoading />;

export default Loading;

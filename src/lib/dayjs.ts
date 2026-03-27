import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

// 설정 로드
dayjs.extend(relativeTime);
dayjs.locale("ko");

export default dayjs;

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/en";
import "dayjs/locale/ja";
import "dayjs/locale/ko";
import "dayjs/locale/th";
import "dayjs/locale/vi";
import "dayjs/locale/zh-cn";

dayjs.extend(relativeTime);
dayjs.locale("ko");

export default dayjs;

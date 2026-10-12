"use client";

import { m } from "framer-motion";
import StatusError from "@/icons/StatusError";
import StatusWarning from "@/icons/StatusWarning";
import DrawCheck from "./DrawCheck";

/*
 * 토스트 아이콘. 토스트가 뜰 때마다 새로 그려져 한 번씩 움직인다.
 * 성공은 원과 체크가 그려지며 톡, 오류는 좌우로 흔들림, 주의는 까딱.
 * 앱의 모든 토스트(문의·신고 접수, 복사, 임시저장 등)가 이걸 함께 쓴다.
 */

export const ToastSuccessIcon = () => (
  <m.span
    className="inline-flex text-success"
    initial={{ scale: 0.6 }}
    animate={{ scale: [0.6, 1.12, 1] }}
    transition={{ delay: 0.1, duration: 0.5 }}
  >
    <DrawCheck size={28} delay={0.1} />
  </m.span>
);

export const ToastErrorIcon = () => (
  <m.span
    className="inline-flex text-danger"
    animate={{ x: [0, -5, 5, -4, 3, 0] }}
    transition={{ delay: 0.25, duration: 0.5 }}
  >
    <StatusError size={28} />
  </m.span>
);

export const ToastWarningIcon = () => (
  <m.span
    className="inline-flex text-warning"
    style={{ originY: 1 }}
    animate={{ rotate: [0, -12, 10, -6, 0] }}
    transition={{ delay: 0.25, duration: 0.5 }}
  >
    <StatusWarning size={28} />
  </m.span>
);

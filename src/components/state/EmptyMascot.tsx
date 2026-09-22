import { cn } from "@/lib/utils";

/**
 * 빈 화면에 얹는 반원 캐릭터.
 *
 * 카드 바닥에서 몸을 반쯤 내민 모습이 기본이고, 상황에 따라 표정과 소품만
 * 바꾼다. 움직임은 styles/mascot.css 에 있다(서버 컴포넌트로 둘 수 있게
 * JS 애니메이션을 쓰지 않는다).
 *
 * peek    빼꼼 — 목록이 비었을 때의 기본
 * search  두리번 — 검색 결과가 없을 때
 * sleep   쿨쿨 — 공지·알림처럼 "조용한" 곳이 비었을 때
 * chat    말풍선 — 대화가 없을 때
 * ghost   점선 — 에셋·페이지를 찾을 수 없을 때
 * dizzy   어질어질 — 불러오지 못했을 때(오류)
 * wave    인사 — 로그인·환영
 * lost    갸웃 — 잘못된 접근·길을 잃었을 때
 * hop     통통 — 불러오는 중
 */
export type MascotMood =
  | "peek"
  | "search"
  | "sleep"
  | "chat"
  | "ghost"
  | "dizzy"
  | "wave"
  | "lost"
  | "hop";

/* 좌표계: viewBox 340×170, 몸통은 (170, 235) 중심 반지름 170 원의 윗부분 */
const BODY = { cx: 170, cy: 235, r: 170 };
const HALO_R = 188;
const EYE_L = { cx: 148, cy: 112 };
const EYE_R = { cx: 196, cy: 98 };
const MOUTH = "M158 126 L186 119 Q188 137 173 139 Q160 140 158 126 Z";

const OpenEyes = ({ blink = true }: { blink?: boolean }) => (
  <>
    <circle
      {...EYE_L}
      r="7.5"
      className={cn(blink && "mascot-blink")}
      fill="var(--mascot-face)"
    />
    <circle
      {...EYE_R}
      r="7.5"
      className={cn(blink && "mascot-blink")}
      fill="var(--mascot-face)"
    />
  </>
);

const Mouth = () => <path d={MOUTH} fill="var(--mascot-face)" />;

const Face = ({ mood }: { mood: MascotMood }) => {
  switch (mood) {
    case "sleep":
      return (
        <g
          stroke="var(--mascot-face)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        >
          <path d="M140 113 q8 7 16 0" />
          <path d="M188 99 q8 7 16 0" />
          <ellipse
            cx="173"
            cy="131"
            rx="4.5"
            ry="5.5"
            fill="var(--mascot-face)"
            stroke="none"
          />
        </g>
      );
    case "chat":
      // 말풍선을 올려다본다 — 눈과 입이 위쪽 오른편으로
      return (
        <g transform="translate(6 -8)">
          <OpenEyes />
          <Mouth />
        </g>
      );
    case "dizzy":
      return (
        <g
          stroke="var(--mascot-face)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        >
          <path d="M142 106 l12 12 M154 106 l-12 12" />
          <path d="M190 92 l12 12 M202 92 l-12 12" />
          <path d="M158 134 q4 -5 8 0 t8 0 t8 0" />
        </g>
      );
    case "wave":
      // 눈웃음 + 크게 벌린 입
      return (
        <g>
          <g
            stroke="var(--mascot-face)"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          >
            <path d="M140 115 q8 -9 16 0" />
            <path d="M188 101 q8 -9 16 0" />
          </g>
          <path
            d="M156 124 L190 116 Q193 142 174 144 Q158 146 156 124 Z"
            fill="var(--mascot-face)"
          />
        </g>
      );
    case "lost":
      // 위쪽 물음표를 올려다본다
      return (
        <g transform="translate(-6 -7)">
          <OpenEyes />
          <ellipse cx="172" cy="133" rx="5" ry="6" fill="var(--mascot-face)" />
        </g>
      );
    case "search":
      return (
        <g className="mascot-look">
          <OpenEyes />
          <Mouth />
        </g>
      );
    case "ghost":
      return (
        <g
          fill="var(--mascot-halo)"
          stroke="var(--mascot-line)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        >
          <circle {...EYE_L} r="9" />
          <circle {...EYE_R} r="9" />
          <path d={MOUTH} />
        </g>
      );
    default:
      return (
        <>
          <OpenEyes />
          <Mouth />
        </>
      );
  }
};

const Props = ({ mood }: { mood: MascotMood }) => {
  if (mood === "dizzy") {
    return (
      <g>
        {/* 머리 위를 도는 별 셋 */}
        <g className="mascot-orbit" fill="var(--mascot-line)">
          {[
            [136, 60],
            [208, 60],
            [172, 44],
          ].map(([x, y]) => (
            <path
              key={`${x}-${y}`}
              d={`M${x} ${y - 7} q1.6 5.4 7 7 q-5.4 1.6 -7 7 q-1.6 -5.4 -7 -7 q5.4 -1.6 7 -7 Z`}
            />
          ))}
        </g>
        {/* 식은땀 */}
        <path
          className="mascot-drip"
          d="M232 84 q7 9 0 13 q-7 -4 0 -13 Z"
          fill="var(--mascot-line)"
        />
      </g>
    );
  }
  if (mood === "lost") {
    return (
      <g
        fill="var(--mascot-line)"
        fontWeight="800"
        fontFamily="inherit"
        aria-hidden
      >
        <text x="104" y="58" fontSize="26" className="mascot-q">
          ?
        </text>
        <text x="226" y="42" fontSize="34" className="mascot-q">
          ?
        </text>
      </g>
    );
  }
  if (mood === "sleep") {
    return (
      <g
        fill="var(--mascot-line)"
        fontWeight="700"
        fontFamily="inherit"
        aria-hidden
      >
        <text x="222" y="62" fontSize="13" className="mascot-z">
          z
        </text>
        <text x="238" y="46" fontSize="16" className="mascot-z">
          z
        </text>
        <text x="257" y="28" fontSize="20" className="mascot-z">
          Z
        </text>
      </g>
    );
  }
  if (mood === "chat") {
    return (
      <g className="mascot-bubble">
        <path
          d="M222 22 h48 a17 17 0 0 1 0 34 h-38 l-12 10 l2 -11 a17 17 0 0 1 0 -33 Z"
          fill="var(--mascot-body)"
        />
        <g fill="var(--mascot-line)">
          <circle cx="235" cy="39" r="3.5" className="mascot-dot" />
          <circle cx="248" cy="39" r="3.5" className="mascot-dot" />
          <circle cx="261" cy="39" r="3.5" className="mascot-dot" />
        </g>
      </g>
    );
  }
  if (mood === "search") {
    return (
      <g className="mascot-scan">
        <circle
          cx="262"
          cy="58"
          r="17"
          fill="var(--mascot-halo)"
          stroke="var(--mascot-line)"
          strokeWidth="4"
        />
        <path
          d="M250 71 l-14 14"
          stroke="var(--mascot-line)"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </g>
    );
  }
  return null;
};

interface EmptyMascotProps {
  mood?: MascotMood;
  className?: string;
}

const EmptyMascot = ({ mood = "peek", className }: EmptyMascotProps) => {
  const ghost = mood === "ghost";

  return (
    <svg
      viewBox="0 0 340 170"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden
      className={cn("block w-full", className)}
    >
      <g className={ghost ? "mascot-float" : "mascot-rise"}>
        {/* 몸 뒤의 옅은 후광 */}
        <circle
          cx={BODY.cx}
          cy={BODY.cy}
          r={HALO_R}
          fill={ghost ? "none" : "var(--mascot-halo)"}
          stroke={ghost ? "var(--mascot-line)" : undefined}
          strokeWidth={ghost ? 1.2 : undefined}
          strokeDasharray={ghost ? "5 5" : undefined}
          opacity={ghost ? 0.6 : 1}
          className={cn(ghost && "mascot-march")}
        />

        <g
          className={cn(
            mood === "sleep" && "mascot-breathe",
            (mood === "peek" || mood === "chat" || mood === "wave") &&
              "mascot-sway",
            mood === "dizzy" && "mascot-wobble",
            mood === "lost" && "mascot-tilt",
            mood === "hop" && "mascot-hop",
          )}
        >
          {/* 인사할 때만 몸 오른쪽에서 팔이 올라와 흔든다 */}
          {mood === "wave" && (
            // CSS 애니메이션이 transform 속성을 덮어쓰므로 흔드는 쪽은 바깥 g 에 둔다.
            <g className="mascot-wave">
              <ellipse
                cx="292"
                cy="104"
                rx="13"
                ry="24"
                transform="rotate(28 292 104)"
                fill="var(--mascot-body)"
              />
            </g>
          )}
          <circle
            {...BODY}
            fill={ghost ? "var(--mascot-halo)" : "var(--mascot-body)"}
            stroke={ghost ? "var(--mascot-line)" : undefined}
            strokeWidth={ghost ? 1.5 : undefined}
            strokeDasharray={ghost ? "5 5" : undefined}
            className={cn(ghost && "mascot-march")}
          />
          <Face mood={mood} />
        </g>
      </g>

      <Props mood={mood} />
    </svg>
  );
};

export default EmptyMascot;

"use client"

import { useState, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { Trophy } from "lucide-react"
import type { TodoItemData } from "./todo-item"

interface BattleDashboardProps {
  boyTodos: TodoItemData[]
  girlTodos: TodoItemData[]
}

const CARD_EMOJIS = ["👨", "👩", "🔥", "🐭"] as const
const CARD_LABELS = ["남자친구 점수", "여자친구 점수", "총 완료", "게으른 쥐"] as const

/** Stats 섹션 애니메이션 variants - Winner/Individual progress와 동일하게 delay 후 등장 */
const statsContainerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.225,
      type: "spring",
      stiffness: 300,
      damping: 25,
      staggerChildren: 0.04,
      delayChildren: 0,
    },
  },
}

const statsRowVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0,
    },
  },
}

const statsItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 30 },
  },
}

/**
 * 각 StatCard 비디오 재생 크기 - 카드별 개별 조정 가능.
 * poster(이미지)와 재생 상태 모두 동일한 크기를 사용하므로 레이아웃 시프트 없음.
 */
const VIDEO_SIZES = {
  boy: "h-[25px] w-[50px] min-h-[25px]",
  girl: "h-[31px] w-[62px] min-h-[31px]",
  fire: "h-[25px] w-[50px] min-h-[25px]",
  mouse: "h-[25px] w-[50px] min-h-[25px]",
} as const

function StatCard({
  emoji,
  imageSrc,
  videoSrc,
  videoClassName,
  label,
  value,
  delay,
  layout = "emojiFirst",
  faceDirection,
  nested,
  noAnimation,
}: {
  emoji: string
  imageSrc?: string
  videoSrc?: string
  videoClassName?: string
  label: string
  value: string
  delay: number
  layout?: "emojiFirst" | "contentFirst"
  faceDirection?: "left" | "right"
  nested?: boolean
  /** true면 variants로 부모가 애니메이션 처리 (Stats 그리드용) */
  noAnimation?: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [imgError, setImgError] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const hasVideo = !!videoSrc
  const showImage = imageSrc && !imgError

  const flipEmoji = faceDirection === "right" ? "scale-x-[-1]" : ""

  const play = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    v.play().catch(() => {})
    setIsPlaying(true)
  }, [])

  const stop = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    v.pause()
    v.currentTime = 0
    setIsPlaying(false)
  }, [])

  const toggle = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) play()
    else stop()
  }, [play, stop])

  const textAlign =
    layout === "contentFirst"
      ? "text-left"
      : faceDirection === "left"
        ? "text-right"
        : ""

  const articleClass = `group relative flex items-center gap-4 rounded-2xl border border-border/50 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-200 hover:border-border hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] ${nested ? "bg-muted/30" : "bg-card"} ${layout === "contentFirst" ? "flex-row-reverse" : ""}`

  const content = (
    <>
      <span
        className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted/60 text-[28px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-200 group-hover:scale-[1.05] group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] ${hasVideo && isPlaying ? "overflow-visible" : "overflow-hidden"}`}
        style={!showImage && !hasVideo ? { fontFamily: "Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif" } : undefined}
      >
        {hasVideo ? (
          <video
            ref={videoRef}
            src={videoSrc}
            poster={showImage ? imageSrc : undefined}
            loop
            muted
            playsInline
            preload="auto"
            className={`${videoClassName ?? "h-8 w-8"} object-contain object-center`}
          />
        ) : showImage ? (
          <img
            src={imageSrc}
            alt={label}
            className={`h-8 w-8 object-contain ${flipEmoji}`}
            width={32}
            height={32}
            onError={() => setImgError(true)}
          />
        ) : (
          emoji
        )}
      </span>
      <div className={`min-w-0 flex-1 ${textAlign}`}>
        <p className="truncate text-[11px] font-medium text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 truncate text-base font-semibold tracking-tight text-foreground">
          {value}
        </p>
      </div>
    </>
  )

  if (noAnimation) {
    return (
      <article
        className={articleClass}
        onMouseEnter={hasVideo ? play : undefined}
        onMouseLeave={hasVideo ? stop : undefined}
        onClick={hasVideo ? toggle : undefined}
      >
        {content}
      </article>
    )
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 400, damping: 30 }}
      className={articleClass}
      onMouseEnter={hasVideo ? play : undefined}
      onMouseLeave={hasVideo ? stop : undefined}
      onClick={hasVideo ? toggle : undefined}
    >
      {content}
    </motion.article>
  )
}

export function BattleDashboard({ boyTodos, girlTodos }: BattleDashboardProps) {
  const boyCompleted = boyTodos.filter((t) => t.completed).length
  const girlCompleted = girlTodos.filter((t) => t.completed).length
  const boyTotal = boyTodos.length
  const girlTotal = girlTodos.length
  const boyPending = boyTotal - boyCompleted
  const girlPending = girlTotal - girlCompleted

  const boyScore = boyTotal > 0 ? Math.round((boyCompleted / boyTotal) * 100) : 0
  const girlScore = girlTotal > 0 ? Math.round((girlCompleted / girlTotal) * 100) : 0

  const totalCompleted = boyCompleted + girlCompleted
  const boyRatio = totalCompleted > 0 ? boyCompleted / totalCompleted : 0.5
  const girlRatio = totalCompleted > 0 ? girlCompleted / totalCompleted : 0.5

  const winner =
    boyScore > girlScore
      ? "남자친구"
      : girlScore > boyScore
        ? "여자친구"
        : "무승부"

  const lazyMouse = boyPending > girlPending ? "남자친구" : girlPending > boyPending ? "여자친구" : "둘 다 착해요"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      className="flex flex-col gap-5 pb-28"
    >
      {/* Title */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-foreground">{"오늘의 배틀"}</h2>
        <p className="text-sm text-muted-foreground">{"누가 더 열심히 했을까?"}</p>
      </div>

      {/* VS Battle Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05, type: "spring", stiffness: 300, damping: 25 }}
        className="rounded-3xl bg-card p-6 shadow-sm"
      >
        {/* Names and scores */}
        <div className="mb-4 flex items-end justify-between">
          <div className="flex flex-col items-start">
            <span className="text-xs font-medium text-muted-foreground">{"남자친구"}</span>
            <span className="text-2xl font-bold text-boy">{boyScore}</span>
          </div>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 400, damping: 15 }}
            className="text-2xl font-black text-muted-foreground/30"
          >
            VS
          </motion.span>
          <div className="flex flex-col items-end">
            <span className="text-xs font-medium text-muted-foreground">{"여자친구"}</span>
            <span className="text-2xl font-bold text-girl">{girlScore}</span>
          </div>
        </div>

        {/* Battle bar */}
        <div className="flex h-8 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="flex items-center justify-center rounded-l-full bg-boy text-xs font-bold text-primary-foreground"
            initial={{ width: "50%" }}
            animate={{ width: `${boyRatio * 100}%` }}
            transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 25 }}
          >
            {boyCompleted > 0 && boyCompleted}
          </motion.div>
          <motion.div
            className="flex items-center justify-center rounded-r-full bg-girl text-xs font-bold text-primary-foreground"
            initial={{ width: "50%" }}
            animate={{ width: `${girlRatio * 100}%` }}
            transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 25 }}
          >
            {girlCompleted > 0 && girlCompleted}
          </motion.div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex justify-between text-xs text-muted-foreground">
          <span>{`${boyCompleted}/${boyTotal} 완료`}</span>
          <span>{`${girlCompleted}/${girlTotal} 완료`}</span>
        </div>
      </motion.div>

      {/* Winner banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
        className="flex items-center justify-center gap-3 rounded-3xl bg-secondary p-4"
      >
        <Trophy className="h-6 w-6 text-primary" />
        <div className="text-center">
          <p className="text-xs font-medium text-muted-foreground">{"오늘의 승자"}</p>
          <p className="text-lg font-bold text-secondary-foreground">{winner}</p>
        </div>
      </motion.div>

      {/* Stats grid - 카드로 묶고, 내부 카드는 muted 배경으로 구분 */}
      <motion.div
        variants={statsContainerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-3 rounded-3xl bg-card p-4 shadow-sm"
      >
        <motion.div variants={statsRowVariants} className="grid grid-cols-2 gap-3">
          <motion.div variants={statsItemVariants}>
            <StatCard
              nested
              noAnimation
              emoji={CARD_EMOJIS[0]}
              imageSrc="/assets/emojis/boy-emoji.png"
              videoSrc="/assets/videos/emoji-heart.webm"
              videoClassName={VIDEO_SIZES.boy}
              label={CARD_LABELS[0]}
              value={`${boyScore}점`}
              delay={0}
              layout="contentFirst"
            />
          </motion.div>
          <motion.div variants={statsItemVariants}>
            <StatCard
              noAnimation
              emoji={CARD_EMOJIS[1]}
              imageSrc="/assets/emojis/girl-emoji.png"
              videoSrc="/assets/videos/girl-emoji-heart.mp4"
              videoClassName={VIDEO_SIZES.girl}
              label={CARD_LABELS[1]}
              value={`${girlScore}점`}
              delay={0}
              faceDirection="left"
              nested
            />
          </motion.div>
        </motion.div>
        <motion.div
          variants={statsItemVariants}
          role="separator"
          aria-hidden="true"
          className="h-px shrink-0 bg-border/60"
        />
        <motion.div variants={statsRowVariants} className="grid grid-cols-2 gap-3">
          <motion.div variants={statsItemVariants}>
            <StatCard
              nested
              noAnimation
              emoji={CARD_EMOJIS[2]}
              imageSrc="/assets/emojis/fire-emoji.png"
              videoSrc="/assets/videos/dart-throw.mp4"
              videoClassName={VIDEO_SIZES.fire}
              label={CARD_LABELS[2]}
              value={`${totalCompleted}개`}
              delay={0}
            />
          </motion.div>
          <motion.div variants={statsItemVariants}>
            <StatCard
              nested
              noAnimation
              emoji={CARD_EMOJIS[3]}
              imageSrc="/assets/emojis/lazy-mouse-emoji.png"
              videoSrc="/assets/videos/lazy-mouse.mp4"
              videoClassName={VIDEO_SIZES.mouse}
              label={CARD_LABELS[3]}
              value={lazyMouse}
              delay={0}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Individual progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, type: "spring", stiffness: 300, damping: 25 }}
        className="flex flex-col gap-3 rounded-3xl bg-card p-5 shadow-sm"
      >
        <h3 className="text-sm font-semibold text-foreground">{"진행 상황"}</h3>

        {/* Boy progress */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-boy">{"남자친구"}</span>
            <span className="text-muted-foreground">{`${boyScore}%`}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-boy-bg">
            <motion.div
              className="h-full rounded-full bg-boy"
              initial={{ width: 0 }}
              animate={{ width: `${boyScore}%` }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 25 }}
            />
          </div>
        </div>

        {/* Girl progress */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-girl">{"여자친구"}</span>
            <span className="text-muted-foreground">{`${girlScore}%`}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-girl-bg">
            <motion.div
              className="h-full rounded-full bg-girl"
              initial={{ width: 0 }}
              animate={{ width: `${girlScore}%` }}
              transition={{ delay: 0.425, type: "spring", stiffness: 200, damping: 25 }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

"use client"

import React from "react"

import { motion } from "framer-motion"
import { Flame, Trophy, Clock, Zap } from "lucide-react"
import type { TodoItemData } from "./todo-item"

interface BattleDashboardProps {
  boyTodos: TodoItemData[]
  girlTodos: TodoItemData[]
}

function StatCard({
  icon,
  label,
  value,
  delay,
}: {
  icon: React.ReactNode
  label: string
  value: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 25 }}
      className="flex flex-col items-center gap-2 rounded-3xl bg-card p-4 shadow-sm"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary">
        {icon}
      </div>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="text-lg font-bold text-foreground">{value}</span>
    </motion.div>
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

  const lazyBird = boyPending > girlPending ? "남자친구" : girlPending > boyPending ? "여자친구" : "둘 다 착해요"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
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
        transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
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
            transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 15 }}
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
            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 25 }}
          >
            {boyCompleted > 0 && boyCompleted}
          </motion.div>
          <motion.div
            className="flex items-center justify-center rounded-r-full bg-girl text-xs font-bold text-primary-foreground"
            initial={{ width: "50%" }}
            animate={{ width: `${girlRatio * 100}%` }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 25 }}
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
        transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 25 }}
        className="flex items-center justify-center gap-3 rounded-3xl bg-secondary p-4"
      >
        <Trophy className="h-6 w-6 text-primary" />
        <div className="text-center">
          <p className="text-xs font-medium text-muted-foreground">{"오늘의 승자"}</p>
          <p className="text-lg font-bold text-secondary-foreground">{winner}</p>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<Zap className="h-5 w-5 text-primary" />}
          label="남자친구 점수"
          value={`${boyScore}점`}
          delay={0.5}
        />
        <StatCard
          icon={<Zap className="h-5 w-5 text-primary" />}
          label="여자친구 점수"
          value={`${girlScore}점`}
          delay={0.55}
        />
        <StatCard
          icon={<Flame className="h-5 w-5 text-primary" />}
          label="총 완료"
          value={`${totalCompleted}개`}
          delay={0.6}
        />
        <StatCard
          icon={<Clock className="h-5 w-5 text-primary" />}
          label="게으른 새"
          value={lazyBird}
          delay={0.65}
        />
      </div>

      {/* Individual progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, type: "spring", stiffness: 300, damping: 25 }}
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
              transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 25 }}
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
              transition={{ delay: 0.85, type: "spring", stiffness: 200, damping: 25 }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

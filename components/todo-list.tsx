"use client"

import React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
import { TodoItem, type TodoItemData } from "./todo-item"

interface TodoListProps {
  title: string
  subtitle: string
  items: TodoItemData[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onAdd: (text: string) => void
  accentColor: "boy" | "girl"
}

export function TodoList({
  title,
  subtitle,
  items,
  onToggle,
  onDelete,
  onAdd,
  accentColor,
}: TodoListProps) {
  const [newTodo, setNewTodo] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodo.trim()) {
      onAdd(newTodo.trim())
      setNewTodo("")
    }
  }

  const completedCount = items.filter((i) => i.completed).length
  const totalCount = items.length

  const badgeBg = accentColor === "boy" ? "bg-boy-bg text-boy" : "bg-girl-bg text-girl"
  const inputRing = accentColor === "boy" ? "focus:ring-boy" : "focus:ring-girl"
  const buttonBg = accentColor === "boy" ? "bg-boy" : "bg-girl"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-4 pb-28"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeBg}`}>
          {completedCount}/{totalCount}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          className={`h-full rounded-full ${buttonBg}`}
          initial={{ width: 0 }}
          animate={{
            width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : "0%",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>

      {/* Todo items */}
      <div className="flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <TodoItem
              key={item.id}
              item={item}
              onToggle={onToggle}
              onDelete={onDelete}
              accentColor={accentColor}
            />
          ))}
        </AnimatePresence>

        {items.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-2 rounded-2xl bg-card py-12 text-center"
          >
            <span className="text-3xl">{"\\(^o^)/"}</span>
            <p className="text-sm text-muted-foreground">{"할 일이 없어요! 추가해 보세요"}</p>
          </motion.div>
        )}
      </div>

      {/* Add todo input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="할 일 추가하기..."
          className={`flex-1 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${inputRing}`}
        />
        <motion.button
          type="submit"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${buttonBg} text-primary-foreground shadow-md`}
          aria-label="할 일 추가"
        >
          <Plus className="h-5 w-5" />
        </motion.button>
      </form>
    </motion.div>
  )
}

"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Check, Trash2 } from "lucide-react"

export interface TodoItemData {
  id: string
  text: string
  completed: boolean
}

interface TodoItemProps {
  item: TodoItemData
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  accentColor: "boy" | "girl"
}

export function TodoItem({ item, onToggle, onDelete, accentColor }: TodoItemProps) {
  const checkboxBg = accentColor === "boy"
    ? "bg-boy"
    : "bg-girl"

  const checkboxBorder = accentColor === "boy"
    ? "border-boy"
    : "border-girl"

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -100, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-sm"
    >
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={() => onToggle(item.id)}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          item.completed
            ? `${checkboxBg} border-transparent`
            : `${checkboxBorder} bg-transparent`
        }`}
        aria-label={item.completed ? "완료 취소" : "완료하기"}
      >
        <AnimatePresence>
          {item.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 600, damping: 20 }}
            >
              <Check className="h-3.5 w-3.5 text-primary-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <motion.span
        animate={{
          opacity: item.completed ? 0.4 : 1,
        }}
        className={`flex-1 text-sm font-medium text-card-foreground ${
          item.completed ? "line-through" : ""
        }`}
      >
        {item.text}
      </motion.span>

      <motion.button
        whileTap={{ scale: 0.8 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => onDelete(item.id)}
        className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        aria-label="삭제"
      >
        <Trash2 className="h-4 w-4" />
      </motion.button>
    </motion.div>
  )
}

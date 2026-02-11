"use client"

import { useState, useCallback, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { BirdIcon } from "@/components/bird-icon"
import { TodoList } from "@/components/todo-list"
import { BattleDashboard } from "@/components/battle-dashboard"
import { TabBar, type TabId } from "@/components/tab-bar"
import type { TodoItemData } from "@/components/todo-item"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard")
  const [boyTodos, setBoyTodos] = useState<TodoItemData[]>([])
  const [girlTodos, setGirlTodos] = useState<TodoItemData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE}/todos`)
      .then((res) => res.json())
      .then((data) => {
        setBoyTodos(data.boyTodos)
        setGirlTodos(data.girlTodos)
      })
      .catch((err) => console.error("Failed to load todos:", err))
      .finally(() => setLoading(false))
  }, [])

  const toggleTodo = useCallback(
    (list: "boy" | "girl", id: string) => {
      const setter = list === "boy" ? setBoyTodos : setGirlTodos
      setter((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, completed: !item.completed } : item
        )
      )
      fetch(`${API_BASE}/todos/${list}/${id}`, { method: "PATCH" }).catch(
        (err) => console.error("Failed to toggle todo:", err)
      )
    },
    []
  )

  const deleteTodo = useCallback(
    (list: "boy" | "girl", id: string) => {
      const setter = list === "boy" ? setBoyTodos : setGirlTodos
      setter((prev) => prev.filter((item) => item.id !== id))
      fetch(`${API_BASE}/todos/${list}/${id}`, { method: "DELETE" }).catch(
        (err) => console.error("Failed to delete todo:", err)
      )
    },
    []
  )

  const addTodo = useCallback(
    (list: "boy" | "girl", text: string) => {
      const tempId = `${list[0]}${Date.now()}`
      const setter = list === "boy" ? setBoyTodos : setGirlTodos
      setter((prev) => [...prev, { id: tempId, text, completed: false }])
      fetch(`${API_BASE}/todos/${list}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
        .then((res) => res.json())
        .then((created) => {
          setter((prev) =>
            prev.map((item) => (item.id === tempId ? created : item))
          )
        })
        .catch((err) => console.error("Failed to add todo:", err))
    },
    []
  )

  const today = new Date()
  const dateStr = `${today.getMonth() + 1}월 ${today.getDate()}일`

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-background">
      <div className="w-full max-w-md px-5 py-6">
        {/* Header */}
        <header className="mb-6 flex items-center gap-3">
          <BirdIcon size={44} />
          <div>
            <h1 className="text-lg font-bold text-foreground">LoveTodo</h1>
            <p className="text-xs text-muted-foreground">{dateStr}</p>
          </div>
        </header>

        {/* Content */}
        <main>
          <AnimatePresence mode="wait">
            {activeTab === "boy" && (
              <TodoList
                key="boy"
                title="남자친구의 하루"
                subtitle="오늘도 화이팅!"
                items={boyTodos}
                onToggle={(id) => toggleTodo("boy", id)}
                onDelete={(id) => deleteTodo("boy", id)}
                onAdd={(text) => addTodo("boy", text)}
                accentColor="boy"
              />
            )}
            {activeTab === "girl" && (
              <TodoList
                key="girl"
                title="여자친구의 하루"
                subtitle="오늘도 화이팅!"
                items={girlTodos}
                onToggle={(id) => toggleTodo("girl", id)}
                onDelete={(id) => deleteTodo("girl", id)}
                onAdd={(text) => addTodo("girl", text)}
                accentColor="girl"
              />
            )}
            {activeTab === "dashboard" && (
              <BattleDashboard
                key="dashboard"
                boyTodos={boyTodos}
                girlTodos={girlTodos}
              />
            )}
          </AnimatePresence>
        </main>

        {/* Tab Bar */}
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  )
}

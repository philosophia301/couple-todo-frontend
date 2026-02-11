"use client"

import React from "react"

import { motion } from "framer-motion"
import { User, BarChart3 } from "lucide-react"

export type TabId = "boy" | "girl" | "dashboard"

interface TabBarProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  {
    id: "boy",
    label: "남자",
    icon: <User className="h-5 w-5" />,
  },
  {
    id: "dashboard",
    label: "배틀",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    id: "girl",
    label: "여자",
    icon: <User className="h-5 w-5" />,
  },
]

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center pb-6 pointer-events-none">
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="pointer-events-auto flex items-center gap-1 rounded-full bg-card p-1.5 shadow-lg shadow-foreground/5 border border-border"
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab.id)}
              className="relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 transition-colors ${
                  isActive ? "text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {tab.icon}
              </span>
              <span
                className={`relative z-10 transition-colors ${
                  isActive ? "text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </motion.nav>
    </div>
  )
}

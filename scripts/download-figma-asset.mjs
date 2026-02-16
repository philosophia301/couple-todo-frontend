#!/usr/bin/env node
/**
 * Figma 에셋 다운로드 스크립트
 * .env의 FIGMA_ACCESS_TOKEN 또는 환경변수 사용
 *
 * Figma 토큰 발급: Figma → Settings → Account → Personal access tokens
 */
import "dotenv/config"

const FIGMA_FILE_KEY = "U95hg4ORVTA2u9vZ5lQGfP"
const ASSETS = [
  { nodeId: "27:39", output: "public/assets/emojis/boy-emoji.png" },
  { nodeId: "21:10", output: "public/assets/emojis/girl-emoji.png" },
  { nodeId: "443:82", output: "public/assets/emojis/fire-emoji.png" },
  { nodeId: "174:148", output: "public/assets/emojis/lazy-mouse-emoji.png" },
]

const token = process.env.FIGMA_ACCESS_TOKEN
if (!token) {
  console.error("❌ FIGMA_ACCESS_TOKEN 환경변수가 필요합니다.")
  console.error("   Figma → Settings → Account → Personal access tokens 에서 발급")
  process.exit(1)
}

const ids = ASSETS.map((a) => a.nodeId).join(",")
const url = `https://api.figma.com/v1/images/${FIGMA_FILE_KEY}?ids=${encodeURIComponent(ids)}&format=png&scale=2`

const fs = await import("fs")
const path = await import("path")

try {
  const res = await fetch(url, {
    headers: { "X-Figma-Token": token },
  })
  const data = await res.json()

  if (data.err) {
    throw new Error(data.err)
  }

  for (const { nodeId, output } of ASSETS) {
    const imageUrl = data.images?.[nodeId]
    if (!imageUrl) {
      console.error(`❌ 이미지 URL 없음: ${nodeId}`)
      continue
    }

    const imgRes = await fetch(imageUrl)
    if (!imgRes.ok) {
      console.error(`❌ 다운로드 실패 (${nodeId}): ${imgRes.status}`)
      continue
    }

    const buffer = Buffer.from(await imgRes.arrayBuffer())
    const dir = path.dirname(output)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(output, buffer)
    console.log(`✅ ${output}`)
  }
} catch (e) {
  console.error("❌ 오류:", e.message)
  process.exit(1)
}

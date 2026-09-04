import { Tag } from "@/components/ui/tag"
import { RevealText } from "@/components/ui/reveal-text"

// Eyebrow + heading + optional intro, in the exact proportions the rest of the
// site already uses. Extracted so every industries section shares one rhythm
// instead of each repeating (and drifting from) the same block of markup.
export function SectionHeader({
  eyebrow,
  title,
  intro,
  align = "left",
}: {
  eyebrow: string
  title: string
  intro?: string
  align?: "left" | "center"
}) {
  const centered = align === "center"
  return (
    <div className={`mb-14 max-w-2xl ${centered ? "mx-auto text-center" : ""}`}>
      <Tag>{eyebrow}</Tag>
      <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
        {title}
      </RevealText>
      {intro ? (
        <p className="mt-6 text-base text-muted-foreground leading-relaxed">{intro}</p>
      ) : null}
    </div>
  )
}

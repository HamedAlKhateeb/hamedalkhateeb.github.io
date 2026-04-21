import { ComponentChildren } from "preact"
import { htmlToJsx } from "../../util/jsx"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { resolveRelative } from "../../util/path"
import { visit } from "unist-util-visit"
import { Root } from "hast"

const Content: QuartzComponent = ({ fileData, tree, allFiles }: QuartzComponentProps) => {
  let processedTree = tree as Root
  const isPoetry = fileData.slug !== undefined && fileData.slug.startsWith("poetry/") && !fileData.slug.endsWith("index")

  if (isPoetry) {
    processedTree = JSON.parse(JSON.stringify(tree))
    visit(processedTree, "element", (node: any) => {
      if (node.tagName === "p") {
        const hasPipe = node.children?.some((c: any) => c.type === "text" && c.value.includes("|"))
        if (hasPipe) {
          const textContent = node.children.map((c: any) => (c.type === "text" ? c.value : "")).join("")
          const lines = textContent.split("\n")
          const divChildren = lines
            .map((line: string) => {
              line = line.trim()
              if (!line) return { type: "text", value: "" }
              if (line.includes("|")) {
                const parts = line.split("|")
                return {
                  type: "element",
                  tagName: "div",
                  properties: { className: ["poem-line"] },
                  children: [
                    {
                      type: "element",
                      tagName: "span",
                      properties: { className: ["first"] },
                      children: [{ type: "text", value: parts[0].trim() }],
                    },
                    {
                      type: "element",
                      tagName: "span",
                      properties: { className: ["second"] },
                      children: [{ type: "text", value: parts[1].trim() }],
                    },
                  ],
                }
              }
              // Not a pipe line, preserve as is
              return {
                type: "element",
                tagName: "div",
                properties: { className: ["poem-text"] },
                children: [{ type: "text", value: line }]
              }
            })
            .filter((c: any) => c.type !== "text" || c.value !== "")
          
          node.tagName = "div"
          node.properties = { className: ["poem-container"] }
          node.children = divChildren
        }
      }
    })
  }

  const content = htmlToJsx(fileData.filePath!, processedTree) as ComponentChildren
  const classes: string[] = fileData.frontmatter?.cssclasses ?? []
  const classString = ["popover-hint", ...classes].join(" ")

  let poetryNav = null
  if (isPoetry) {
    // Sort uniquely by slug to ensure stable navigation
    const uniquePoems = Array.from(
      new Map(
        allFiles.filter(f => f.slug?.startsWith("poetry/") && !f.slug.endsWith("index")).map(item => [item.slug, item])
      ).values()
    )
    uniquePoems.sort((a, b) => (a.slug! > b.slug! ? 1 : -1))

    const currentIndex = uniquePoems.findIndex((f) => f.slug === fileData.slug)
    const prevPoem = currentIndex > 0 ? uniquePoems[currentIndex - 1] : null
    const nextPoem = currentIndex < uniquePoems.length - 1 ? uniquePoems[currentIndex + 1] : null
    
    poetryNav = (
      <div class="poetry-navigation">
        {prevPoem ? (
          <a href={resolveRelative(fileData.slug!, prevPoem.slug!)} class="nav-prev">« القصيدة السابقة</a>
        ) : <span class="nav-empty"></span>}
        
        <a href={resolveRelative(fileData.slug!, "poetry/index" as any)} class="nav-toc">فهرس القصائد</a>
        
        {nextPoem ? (
          <a href={resolveRelative(fileData.slug!, nextPoem.slug!)} class="nav-next">القصيدة التالية »</a>
        ) : <span class="nav-empty"></span>}
      </div>
    )
  }

  return (
    <article class={classString}>
      {content}
      {poetryNav}
    </article>
  )
}

export default (() => Content) satisfies QuartzComponentConstructor

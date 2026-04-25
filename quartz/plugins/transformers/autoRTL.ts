import { QuartzTransformerPlugin } from "../types"
import { VFile } from "vfile"

const RTL_FOLDERS = ["math", "رياضيات"]

export const AutoRTL: QuartzTransformerPlugin = () => ({
  name: "AutoRTL",
  htmlPlugins: () => [],
  externalResources: () => ({}),
  markdownPlugins() {
    return [
      () => (_tree: any, file: VFile) => {
        const path = (file.data.filePath ?? "").toLowerCase()
        const inRTLFolder = RTL_FOLDERS.some(f => path.includes(`/${f}/`) || path.startsWith(`${f}/`))
        
        if (inRTLFolder) {
          file.data.frontmatter = file.data.frontmatter ?? {}
          const fm = file.data.frontmatter as Record<string, any>
          fm.cssclasses = [...(fm.cssclasses ?? []), "rtl-math"]
        }
      }
    ]
  },
})

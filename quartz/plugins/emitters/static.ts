import { FilePath, QUARTZ, joinSegments } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import fs from "fs"
import { glob } from "../../util/glob"
import { dirname } from "path"
import sharp from "sharp"

export const Static: QuartzEmitterPlugin = () => ({
  name: "Static",
  async *emit({ argv, cfg }) {
    const staticPath = joinSegments(QUARTZ, "static")
    const fps = await glob("**", staticPath, cfg.configuration.ignorePatterns)
    const outputStaticPath = joinSegments(argv.output, "static")
    await fs.promises.mkdir(outputStaticPath, { recursive: true })
    
    for (const fp of fps) {
      const src = joinSegments(staticPath, fp) as FilePath
      
      // Determine if it's a root-level file like robots.txt, _headers, or a google verification html
      const isRootFile = 
        fp === "_headers" || 
        fp === "robots.txt" || 
        (fp.startsWith("google") && fp.endsWith(".html"))
        
      const dest = isRootFile
        ? (joinSegments(argv.output, fp) as FilePath)
        : (joinSegments(outputStaticPath, fp) as FilePath)
        
      await fs.promises.mkdir(dirname(dest), { recursive: true })

      // Safeguard for WhatsApp and social previews: Ensure thumbnails never exceed 290 KB
      let optimized = false
      if (
        (fp.includes("thumbnails") || fp.includes("uploads")) &&
        /\.(jpe?g|png)$/i.test(fp)
      ) {
        try {
          const stat = await fs.promises.stat(src)
          if (stat.size > 290 * 1024) {
            const buf = await fs.promises.readFile(src)
            let outBuf: Buffer
            if (/\.jpe?g$/i.test(fp)) {
              outBuf = await sharp(buf)
                .resize(1200, 630, { fit: "cover" })
                .jpeg({ quality: 85, progressive: true })
                .toBuffer()
            } else {
              outBuf = await sharp(buf)
                .resize(1200, 630, { fit: "cover" })
                .png({ quality: 75, palette: true, compressionLevel: 9 })
                .toBuffer()
            }
            await fs.promises.writeFile(dest, outBuf)
            optimized = true
          }
        } catch {
          // Fall back to direct copy
        }
      }

      if (!optimized) {
        await fs.promises.copyFile(src, dest)
      }
      yield dest
    }
  },
  async *partialEmit() {},
})

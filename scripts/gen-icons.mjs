/**
 * Generates pwa-192x192.png and pwa-512x512.png using only Node.js built-ins.
 * Each icon: dark background (#14141F) with an electric-green (#00E676) filled circle.
 */
import { deflateSync } from 'zlib'
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')
mkdirSync(publicDir, { recursive: true })

function generatePNG(size) {
  const BG = [0x14, 0x14, 0x1f]    // #14141F
  const FG = [0x00, 0xe6, 0x76]    // #00E676
  const radius = Math.floor(size * 0.38)
  const cx = size / 2
  const cy = size / 2

  // Build raw pixel data (RGBA)
  const raw = []
  for (let y = 0; y < size; y++) {
    raw.push(0) // filter byte per row
    for (let x = 0; x < size; x++) {
      const dx = x - cx
      const dy = y - cy
      const inCircle = dx * dx + dy * dy <= radius * radius
      raw.push(inCircle ? FG[0] : BG[0])
      raw.push(inCircle ? FG[1] : BG[1])
      raw.push(inCircle ? FG[2] : BG[2])
      raw.push(255)
    }
  }

  const compressed = deflateSync(Buffer.from(raw))

  function crc32(buf) {
    let crc = 0xffffffff
    for (const b of buf) {
      crc ^= b
      for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
    }
    return (crc ^ 0xffffffff) >>> 0
  }

  function chunk(type, data) {
    const typeBytes = Buffer.from(type, 'ascii')
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length)
    const crcBuf = Buffer.concat([typeBytes, data])
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(crc32(crcBuf))
    return Buffer.concat([len, typeBytes, data, crc])
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(size, 0)
  ihdrData.writeUInt32BE(size, 4)
  ihdrData[8] = 8   // bit depth
  ihdrData[9] = 2   // color type: RGB... wait we have RGBA, use 6
  ihdrData[9] = 6   // RGBA
  ihdrData[10] = 0  // compression
  ihdrData[11] = 0  // filter
  ihdrData[12] = 0  // interlace

  const idatData = compressed
  const iend = chunk('IEND', Buffer.alloc(0))

  return Buffer.concat([sig, chunk('IHDR', ihdrData), chunk('IDAT', idatData), iend])
}

for (const size of [192, 512]) {
  const buf = generatePNG(size)
  const outPath = join(publicDir, `pwa-${size}x${size}.png`)
  writeFileSync(outPath, buf)
  console.log(`Generated ${outPath} (${buf.length} bytes)`)
}

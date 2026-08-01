
import { Buffer } from "node:buffer"
import { writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const input = fileURLToPath(
  new URL("../../public/favicon.svg", import.meta.url)
)
const faviconOutput = fileURLToPath(
  new URL("../../public/favicon.ico", import.meta.url)
)
const touchIconOutput = fileURLToPath(
  new URL("../../public/apple-touch-icon.png", import.meta.url)
)

const createIco = (png) => {
  const directory = Buffer.alloc(22)
  directory.writeUInt16LE(0, 0)
  directory.writeUInt16LE(1, 2)
  directory.writeUInt16LE(1, 4)
  directory.writeUInt8(32, 6)
  directory.writeUInt8(32, 7)
  directory.writeUInt8(0, 8)
  directory.writeUInt8(0, 9)
  directory.writeUInt16LE(1, 10)
  directory.writeUInt16LE(32, 12)
  directory.writeUInt32LE(png.length, 14)
  directory.writeUInt32LE(directory.length, 18)
  return Buffer.concat([directory, png])
}

const faviconPng = await sharp(input).resize(32, 32).png().toBuffer()

await Promise.all([
  writeFile(faviconOutput, createIco(faviconPng)),
  sharp(input).resize(180, 180).png().toFile(touchIconOutput),
])

console.log("Generated favicon and Apple touch icon.")

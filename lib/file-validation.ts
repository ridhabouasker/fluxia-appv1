const SIGNATURES: Array<{ ext: string[]; bytes: number[]; offset?: number }> = [
  { ext: ['.pdf'],                   bytes: [0x25, 0x50, 0x44, 0x46] },             // %PDF
  { ext: ['.jpg', '.jpeg'],          bytes: [0xFF, 0xD8, 0xFF] },                   // JPEG
  { ext: ['.png'],                   bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] }, // PNG
  { ext: ['.docx', '.xlsx'],         bytes: [0x50, 0x4B, 0x03, 0x04] },             // ZIP (Office Open XML)
  { ext: ['.xls'],                   bytes: [0xD0, 0xCF, 0x11, 0xE0] },             // OLE2
  { ext: ['.tiff', '.tif'],          bytes: [0x49, 0x49, 0x2A, 0x00] },             // TIFF LE
  { ext: ['.tiff', '.tif'],          bytes: [0x4D, 0x4D, 0x00, 0x2A] },             // TIFF BE
  { ext: ['.webp'],                  bytes: [0x52, 0x49, 0x46, 0x46] },             // RIFF (WEBP)
  { ext: ['.heic', '.heif'],         bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 }, // ftyp box
]

export async function validateMagicBytes(file: File): Promise<boolean> {
  const ext = '.' + file.name.split('.').pop()!.toLowerCase()
  const sig = SIGNATURES.find(s => s.ext.includes(ext))

  // CSV has no magic bytes — allow by extension only
  if (!sig) return true

  const offset = sig.offset ?? 0
  const slice = await file.slice(offset, offset + sig.bytes.length).arrayBuffer()
  const view = new Uint8Array(slice)

  return sig.bytes.every((b, i) => view[i] === b)
}

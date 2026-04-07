import { useCallback, useEffect, useRef, useState } from 'react'
import { removeBackground } from '@imgly/background-removal'
import {
  PoseLandmarker,
  HandLandmarker,
  FilesetResolver,
  type NormalizedLandmark,
} from '@mediapipe/tasks-vision'

export interface ARTryOnProps {
  productImage: string
  productType: 'chain' | 'bracelet'
  onClose: () => void
}

// MediaPipe landmark indices
const POSE = { LEFT_SHOULDER: 11, RIGHT_SHOULDER: 12, LEFT_EAR: 7, RIGHT_EAR: 8 }
const HAND = { WRIST: 0, MIDDLE_FINGER_MCP: 9, INDEX_MCP: 5, PINKY_MCP: 17 }

type AppState =
  | { step: 'upload' }
  | { step: 'preparing-jewellery' }
  | { step: 'detecting' }
  | { step: 'result'; dataUrl: string }
  | { step: 'error'; message: string }

const IS_DEV = import.meta.env.DEV
const MAX_FILE_BYTES = 10 * 1024 * 1024

// ── Per-product bg-removal cache (persists for the lifetime of the page) ────────
const bgCache = new Map<string, HTMLImageElement>()

export default function ARTryOn({ productImage, productType, onClose }: ARTryOnProps) {
  const [state, setState] = useState<AppState>({ step: 'upload' })
  const [dragOver, setDragOver] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [userPhotoPreview, setUserPhotoPreview] = useState<string | null>(null)

  const fileInputRef   = useRef<HTMLInputElement>(null)
  const userPhotoRef   = useRef<HTMLImageElement | null>(null)
  const jewelleryRef   = useRef<HTMLImageElement | null>(null)
  const blobUrlRef     = useRef<string | null>(null)
  const chainOCRef     = useRef<HTMLCanvasElement | null>(null)
  const braceletOCRef  = useRef<HTMLCanvasElement | null>(null)

  // Revoke blob URL on unmount
  useEffect(() => () => {
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
  }, [])

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(id)
  }, [toast])

  // ── File validation & ingestion ────────────────────────────────────────────────
  const ingestFile = useCallback(async (file: File) => {
    if (!file.type.match(/image\/(jpeg|png|webp)/)) {
      setState({ step: 'error', message: 'Please upload a JPG, PNG, or WebP image.' })
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      setState({ step: 'error', message: 'Photo is too large — please use an image under 10 MB.' })
      return
    }

    // Preview immediately
    const previewUrl = URL.createObjectURL(file)
    setUserPhotoPreview(previewUrl)

    // Load user image
    const userImg = new Image()
    userImg.src = previewUrl
    await new Promise<void>((resolve, reject) => {
      userImg.onload  = () => resolve()
      userImg.onerror = reject
    })
    userPhotoRef.current = userImg

    await runPipeline()
  }, [productImage, productType]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Main pipeline ──────────────────────────────────────────────────────────────
  async function runPipeline() {
    // Step 1: bg-removal on jewellery (cached)
    setState({ step: 'preparing-jewellery' })

    let jewelleryImg = bgCache.get(productImage) ?? null

    if (!jewelleryImg) {
      try {
        const blob = await removeBackground(productImage, {
          model: 'isnet_fp16',
          output: { format: 'image/png' },
        })
        const url = URL.createObjectURL(blob)
        if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = url

        jewelleryImg = new Image()
        jewelleryImg.src = url
        await new Promise<void>((resolve, reject) => {
          jewelleryImg!.onload  = () => resolve()
          jewelleryImg!.onerror = reject
        })
        bgCache.set(productImage, jewelleryImg)
      } catch {
        // Fallback: original image
        jewelleryImg = new Image()
        jewelleryImg.crossOrigin = 'anonymous'
        jewelleryImg.src = productImage
        await new Promise<void>(resolve => {
          jewelleryImg!.onload  = () => resolve()
          jewelleryImg!.onerror = () => resolve()
        })
      }
    }
    jewelleryRef.current = jewelleryImg

    // Step 2: MediaPipe on still image
    setState({ step: 'detecting' })

    const userImg = userPhotoRef.current
    if (!userImg) {
      setState({ step: 'error', message: 'Failed to load your photo — please try again.' })
      return
    }

    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      )

      const offscreen = document.createElement('canvas')
      offscreen.width  = userImg.naturalWidth
      offscreen.height = userImg.naturalHeight
      const ctx = offscreen.getContext('2d')!
      ctx.drawImage(userImg, 0, 0)

      if (productType === 'chain') {
        const poseLM = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
            delegate: 'GPU',
          },
          runningMode: 'IMAGE',
          numPoses: 1,
        })
        const result = poseLM.detect(offscreen)
        poseLM.close()

        const lms = result.landmarks?.[0]
        if (!lms?.length) {
          setState({ step: 'error', message: 'No neck detected — try a photo showing your shoulders clearly.' })
          return
        }
        const dataUrl = renderChain(offscreen, ctx, lms)
        setState({ step: 'result', dataUrl })
      } else {
        const handLM = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'IMAGE',
          numHands: 2,
        })
        const result = handLM.detect(offscreen)
        handLM.close()

        const lms = result.landmarks?.[0]
        if (!lms?.length) {
          setState({ step: 'error', message: 'No wrist detected — try a photo showing your hand and wrist clearly.' })
          return
        }
        const dataUrl = renderBracelet(offscreen, ctx, lms)
        setState({ step: 'result', dataUrl })
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setState({ step: 'error', message: `Detection failed: ${msg}` })
    }
  }

  // ── Chain / necklace composite ─────────────────────────────────────────────────
  function renderChain(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    lms: NormalizedLandmark[]
  ): string {
    const img = jewelleryRef.current!
    const cw = canvas.width
    const ch = canvas.height

    const lShoulder = lms[POSE.LEFT_SHOULDER]
    const rShoulder = lms[POSE.RIGHT_SHOULDER]

    const lsx = lShoulder.x * cw,  lsy = lShoulder.y * ch
    const rsx = rShoulder.x * cw,  rsy = rShoulder.y * ch

    const shoulderSpan  = Math.hypot(rsx - lsx, rsy - lsy)
    const shoulderTilt  = Math.atan2(rsy - lsy, rsx - lsx)
    const neckBaseX     = (lsx + rsx) / 2
    const neckBaseY     = (lsy + rsy) / 2

    const chainWidth    = shoulderSpan * 0.90
    const chainHeight   = chainWidth * (img.naturalHeight / img.naturalWidth)
    const chainCentreX  = neckBaseX
    const chainCentreY  = neckBaseY - shoulderSpan * 0.08
    const arcDepth      = shoulderSpan * 0.22

    if (!chainOCRef.current) chainOCRef.current = document.createElement('canvas')
    const oc  = chainOCRef.current
    const ocW = Math.max(1, Math.ceil(chainWidth))
    const ocH = Math.max(1, Math.ceil(chainHeight + arcDepth + 4))
    oc.width  = ocW
    oc.height = ocH

    const octx = oc.getContext('2d')!
    octx.clearRect(0, 0, ocW, ocH)

    const SLICES    = 11
    const sliceW    = chainWidth / SLICES
    const srcW      = img.naturalWidth
    const srcH      = img.naturalHeight
    const coshBound = Math.cosh(2.5)

    for (let i = 0; i < SLICES; i++) {
      const t       = (i + 0.5) / SLICES
      const yOffset = arcDepth * (Math.cosh((2 * t - 1) * 2.5) - coshBound) / (1 - coshBound)

      const edgeFrac = 0.15
      let opacity = 1.0
      if (t < edgeFrac)         opacity = 0.4 + (t / edgeFrac) * 0.6
      else if (t > 1 - edgeFrac) opacity = 0.4 + ((1 - t) / edgeFrac) * 0.6

      octx.globalAlpha = opacity
      octx.drawImage(
        img,
        (i / SLICES) * srcW, 0,      srcW / SLICES, srcH,
        i * sliceW,          yOffset, sliceW + 0.5,  chainHeight
      )
    }
    octx.globalAlpha = 1

    const cosA = Math.cos(shoulderTilt)
    const sinA = Math.sin(shoulderTilt)
    ctx.save()
    ctx.setTransform(cosA, sinA, -sinA, cosA, chainCentreX, chainCentreY)
    ctx.shadowColor   = 'rgba(0,0,0,0.35)'
    ctx.shadowBlur    = 8
    ctx.shadowOffsetY = 3
    ctx.drawImage(oc, -ocW / 2, -chainHeight / 2)
    ctx.shadowColor   = 'transparent'
    ctx.shadowBlur    = 0
    ctx.shadowOffsetY = 0
    ctx.restore()

    if (IS_DEV) {
      ctx.save()
      ;[POSE.LEFT_SHOULDER, POSE.RIGHT_SHOULDER, POSE.LEFT_EAR, POSE.RIGHT_EAR].forEach(idx => {
        const lm = lms[idx]
        if (!lm) return
        ctx.beginPath()
        ctx.arc(lm.x * cw, lm.y * ch, 4, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0,255,100,0.85)'
        ctx.fill()
      })
      ctx.restore()
    }

    return canvas.toDataURL('image/jpeg', 0.92)
  }

  // ── Bracelet composite ─────────────────────────────────────────────────────────
  function renderBracelet(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    lms: NormalizedLandmark[]
  ): string {
    const img = jewelleryRef.current!
    const cw = canvas.width
    const ch = canvas.height

    const wrist    = lms[HAND.WRIST]
    const mcp9     = lms[HAND.MIDDLE_FINGER_MCP]
    const indexMcp = lms[HAND.INDEX_MCP]
    const pinkyMcp = lms[HAND.PINKY_MCP]

    const wx = wrist.x    * cw,  wy = wrist.y    * ch
    const mx = mcp9.x     * cw,  my = mcp9.y     * ch
    const ix = indexMcp.x * cw,  iy = indexMcp.y * ch
    const px = pinkyMcp.x * cw,  py = pinkyMcp.y * ch

    const wristWidth    = Math.hypot(px - ix, py - iy) * 1.4
    const wristAngle    = Math.atan2(my - wy, mx - wx)
    const braceletWidth = wristWidth * 1.1
    let braceletHeight  = braceletWidth * (img.naturalHeight / img.naturalWidth)
    braceletHeight = Math.max(18, Math.min(braceletHeight, wristWidth * 0.55))

    if (!braceletOCRef.current) braceletOCRef.current = document.createElement('canvas')
    const oc  = braceletOCRef.current
    const ocW = Math.max(1, Math.ceil(braceletWidth))
    const ocH = Math.max(1, Math.ceil(braceletHeight))
    oc.width  = ocW
    oc.height = ocH

    const octx = oc.getContext('2d')!
    octx.clearRect(0, 0, ocW, ocH)

    const SLICES = 9
    const srcW   = img.naturalWidth
    const srcH   = img.naturalHeight

    const scales     = Array.from({ length: SLICES }, (_, i) =>
      Math.cos(((i + 0.5) / SLICES - 0.5) * Math.PI * 0.85)
    )
    const totalScale = scales.reduce((a, b) => a + b, 0)
    const sliceWidths = scales.map(s => (s / totalScale) * braceletWidth)

    let curX = 0
    for (let i = 0; i < SLICES; i++) {
      const t          = (i + 0.5) / SLICES
      const sw         = sliceWidths[i]
      const dist       = Math.abs(t - 0.5) * 2
      const brightness = 1.15 - dist * (1.15 - 0.82)

      octx.save()
      octx.filter = `brightness(${brightness.toFixed(3)})`
      octx.drawImage(img, (i / SLICES) * srcW, 0, srcW / SLICES, srcH, curX, 0, sw + 0.5, ocH)
      octx.filter = 'none'
      octx.restore()
      curX += sw
    }

    const topWidth   = braceletWidth * 0.88
    const SCAN_LINES = 24

    const cosA = Math.cos(wristAngle)
    const sinA = Math.sin(wristAngle)
    ctx.save()
    ctx.setTransform(cosA, sinA, -sinA, cosA, wx, wy)
    ctx.shadowColor   = 'rgba(0,0,0,0.35)'
    ctx.shadowBlur    = 8
    ctx.shadowOffsetY = 3

    for (let row = 0; row < SCAN_LINES; row++) {
      const t      = row / SCAN_LINES
      const rowW   = topWidth + t * (braceletWidth - topWidth)
      const rowX   = -rowW / 2
      const rowY   = -braceletHeight / 2 + t * braceletHeight
      const rowH   = braceletHeight / SCAN_LINES + 0.5
      const srcY   = row * (ocH / SCAN_LINES)
      ctx.drawImage(oc, 0, srcY, ocW, ocH / SCAN_LINES, rowX, rowY, rowW, rowH)
    }

    ctx.shadowColor   = 'transparent'
    ctx.shadowBlur    = 0
    ctx.shadowOffsetY = 0
    ctx.restore()

    if (IS_DEV) {
      ctx.save()
      ;[HAND.WRIST, HAND.MIDDLE_FINGER_MCP, HAND.INDEX_MCP, HAND.PINKY_MCP].forEach(idx => {
        const lm = lms[idx]
        if (!lm) return
        ctx.beginPath()
        ctx.arc(lm.x * cw, lm.y * ch, 4, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0,200,255,0.85)'
        ctx.fill()
      })
      ctx.restore()
    }

    return canvas.toDataURL('image/jpeg', 0.92)
  }

  // ── Download helper ────────────────────────────────────────────────────────────
  function downloadResult(dataUrl: string) {
    const a = document.createElement('a')
    a.href     = dataUrl
    a.download = 'sparkle-style-studio-tryon.jpg'
    a.click()
  }

  // ── Drag-and-drop handlers ─────────────────────────────────────────────────────
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const onDragLeave = useCallback(() => setDragOver(false), [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) ingestFile(file)
  }, [ingestFile])

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) ingestFile(file)
    e.target.value = ''
  }, [ingestFile])

  const resetToUpload = useCallback(() => {
    setUserPhotoPreview(null)
    userPhotoRef.current = null
    chainOCRef.current = null
    braceletOCRef.current = null
    setState({ step: 'upload' })
  }, [])

  // ── Render ─────────────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: '#0a0a0a' }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20 flex items-center justify-center transition-colors"
        aria-label="Close try-on"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* ── Upload step ─────────────────────────────────────────────────────────── */}
      {state.step === 'upload' && (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
          <h2 className="text-yellow-400 text-xl font-semibold tracking-wide">Try On</h2>
          <p className="text-white/60 text-sm text-center">Upload a photo of yourself to see how it looks</p>

          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={[
              'w-full max-w-sm aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors select-none',
              dragOver
                ? 'border-yellow-400 bg-yellow-400/10'
                : 'border-yellow-600/40 bg-white/5 hover:border-yellow-500/60 hover:bg-white/8',
            ].join(' ')}
          >
            <svg viewBox="0 0 24 24" className="w-12 h-12 text-yellow-500/70" fill="none" stroke="currentColor" strokeWidth={1.4}>
              <path d="M12 16V4m0 0L8.5 7.5M12 4l3.5 3.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="2" y="14" width="20" height="7" rx="2" />
              <circle cx="12" cy="10" r="3.5" />
              <path d="M3 9a9 9 0 0 1 9-9" strokeOpacity=".3"/>
            </svg>
            <div className="text-center">
              <p className="text-white/80 text-sm font-medium">Upload a photo of yourself</p>
              <p className="text-white/40 text-xs mt-1">JPG, PNG or WebP · max 10 MB</p>
            </div>
            <span className="px-4 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 text-sm">
              Browse or drag & drop
            </span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={onFileChange}
          />
        </div>
      )}

      {/* ── Loading steps ────────────────────────────────────────────────────────── */}
      {(state.step === 'preparing-jewellery' || state.step === 'detecting') && (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
          {/* User photo preview */}
          {userPhotoPreview && (
            <div className="w-48 h-48 rounded-2xl overflow-hidden border border-yellow-500/30">
              <img src={userPhotoPreview} alt="Your photo" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Stepper */}
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <LoadingStep
              label="Removing background from jewellery…"
              done={state.step === 'detecting'}
              active={state.step === 'preparing-jewellery'}
            />
            <LoadingStep
              label="Detecting body position…"
              done={false}
              active={state.step === 'detecting'}
            />
          </div>
        </div>
      )}

      {/* ── Result ───────────────────────────────────────────────────────────────── */}
      {state.step === 'result' && (
        <div className="flex flex-1 flex-col items-center justify-between gap-4 px-4 py-8 overflow-auto">
          <h2 className="text-yellow-400 text-lg font-semibold tracking-wide">Your Look</h2>

          <div className="flex-1 flex items-center justify-center w-full">
            <img
              src={state.dataUrl}
              alt="Try-on result"
              className="max-w-full max-h-[calc(100vh-260px)] rounded-2xl border border-yellow-500/20 object-contain shadow-2xl"
            />
          </div>

          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={() => downloadResult(state.dataUrl)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M12 4v12m0 0l-4-4m4 4l4-4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 18h16" strokeLinecap="round"/>
              </svg>
              Download Photo
            </button>

            <button
              onClick={() => {
                downloadResult(state.dataUrl)
                setToast('Save and share on Instagram!')
              }}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
              Share to Instagram
            </button>

            <button
              onClick={resetToUpload}
              className="w-full py-3 rounded-xl border border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10 transition-colors text-sm font-medium"
            >
              Try Another Photo
            </button>
          </div>
        </div>
      )}

      {/* ── Error ────────────────────────────────────────────────────────────────── */}
      {state.step === 'error' && (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
          <svg viewBox="0 0 24 24" className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4m0 4h.01" strokeLinecap="round"/>
          </svg>
          <p className="text-red-300 text-sm leading-relaxed">{state.message}</p>
          <button
            onClick={resetToUpload}
            className="px-6 py-2.5 rounded-xl bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30 transition-colors text-sm font-medium"
          >
            Try Another Photo
          </button>
        </div>
      )}

      {/* ── Toast ────────────────────────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium shadow-xl pointer-events-none">
          {toast}
        </div>
      )}
    </div>
  )
}

// ── Small helper component ─────────────────────────────────────────────────────
function LoadingStep({ label, active, done }: { label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
        {done ? (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : active ? (
          <div className="w-5 h-5 rounded-full border-2 border-yellow-500/30 border-t-yellow-400 animate-spin" />
        ) : (
          <div className="w-4 h-4 rounded-full border border-white/20" />
        )}
      </div>
      <span className={`text-sm ${active ? 'text-white' : done ? 'text-white/50 line-through' : 'text-white/30'}`}>
        {label}
      </span>
    </div>
  )
}

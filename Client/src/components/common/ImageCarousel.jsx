import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { Bike } from 'lucide-react'

const MAX_RETRIES = 2

export default function ImageCarousel({ images = [], alt = 'Motor', className = '', dark = false }) {
  const [current, setCurrent] = useState(0)
  const [status, setStatus] = useState({})
  const [retryCount, setRetryCount] = useState({})
  const timerRef = useRef(null)
  const retryTimers = useRef({})
  const imgElRefs = useRef({})

  const stopTimer = () => clearInterval(timerRef.current)

  const startTimer = (len) => {
    if (len <= 1) return
    timerRef.current = setInterval(() => {
      setCurrent(i => (i + 1) % len)
    }, 3500)
  }

  useEffect(() => {
    setCurrent(0)
    setStatus({})
    setRetryCount({})
    imgElRefs.current = {}
    Object.values(retryTimers.current).forEach(clearTimeout)
    retryTimers.current = {}
    stopTimer()
    startTimer(images.length)
    return () => {
      stopTimer()
      Object.values(retryTimers.current).forEach(clearTimeout)
    }
  }, [images.length, images[0]?.id ?? images[0]?.imageUrl])

  // Gambar yang sudah di memory cache load secara synchronous — onLoad tidak terpanggil.
  // useLayoutEffect dijalankan setelah DOM update, sebelum browser paint,
  // sehingga kita bisa deteksi img.complete dan langsung set status tanpa flash.
  useLayoutEffect(() => {
    const updates = {}
    images.forEach((_, i) => {
      const el = imgElRefs.current[i]
      if (el?.complete && el.naturalWidth > 0) updates[i] = 'loaded'
    })
    if (Object.keys(updates).length > 0) {
      setStatus(prev => ({ ...prev, ...updates }))
    }
  }, [images.length, images[0]?.id ?? images[0]?.imageUrl])

  const handleError = (i) => {
    const count = retryCount[i] ?? 0
    if (count < MAX_RETRIES) {
      retryTimers.current[i] = setTimeout(() => {
        setRetryCount(prev => ({ ...prev, [i]: count + 1 }))
        setStatus(prev => { const s = { ...prev }; delete s[i]; return s })
      }, 1500 * (count + 1))
    } else {
      setStatus(prev => ({ ...prev, [i]: 'error' }))
    }
  }

  const emptyBg  = dark ? 'bg-transparent'  : 'bg-off-white'
  const iconColor = dark ? 'text-white/15'   : 'text-gray-300'
  const textColor = dark ? 'text-white/15'   : 'text-gray-300'
  const pulseBg  = dark ? 'bg-white/5'       : 'bg-gray-100'

  if (images.length === 0) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center ${emptyBg} ${className}`}>
        <Bike size={22} className={iconColor} strokeWidth={1.5} />
        <p className={`text-xs mt-2 ${textColor}`}>Foto segera hadir</p>
      </div>
    )
  }

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${dark ? 'bg-transparent' : 'bg-gray-50'} ${className}`}
      onMouseEnter={stopTimer}
      onMouseLeave={() => startTimer(images.length)}
    >
      {images.map((img, i) => (
        <div
          key={img.id ?? i}
          className={`absolute inset-0 transition-opacity duration-500 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          {status[i] === 'error' ? (
            <div className={`w-full h-full flex items-center justify-center ${emptyBg}`}>
              <Bike size={22} className={iconColor} strokeWidth={1.5} />
            </div>
          ) : (
            <>
              {status[i] !== 'loaded' && (
                <div className={`absolute inset-0 ${pulseBg} animate-pulse`} />
              )}
              <img
                key={`${img.id ?? i}-${retryCount[i] ?? 0}`}
                ref={(el) => { if (el) imgElRefs.current[i] = el }}
                src={img.imageUrl}
                alt={`${alt} ${i + 1}`}
                onLoad={() => setStatus(prev => ({ ...prev, [i]: 'loaded' }))}
                onError={() => handleError(i)}
                className={`w-full h-full object-cover transition-opacity duration-300 ${status[i] === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
              />
            </>
          )}
        </div>
      ))}

      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-white scale-125' : 'bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

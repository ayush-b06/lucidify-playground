"use client"

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const EXCLUDED = ['/dashboard', '/login', '/signup']

const CustomCursor = () => {
    const pathname = usePathname()
    const wrapperRef = useRef<HTMLDivElement>(null)
    const ringRef = useRef<HTMLDivElement>(null)
    const isActive = !EXCLUDED.some(p => pathname.startsWith(p))

    useEffect(() => {
        if (!isActive) return

        // Inject global style: kill all cursors + neutralise inherited transition on our wrapper
        const style = document.createElement('style')
        style.id = 'lucidify-cursor-style'
        style.textContent = `* { cursor: none !important; } #lucidify-cursor { transition: none !important; }`
        document.head.appendChild(style)

        const onMove = (e: MouseEvent) => {
            const el = wrapperRef.current
            if (!el) return
            // Direct DOM write, no React state, no CSS transition on position
            el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
            el.style.opacity = '1'
        }

        const onOver = (e: MouseEvent) => {
            const t = e.target as HTMLElement
            if (t.closest('a, button, [role="button"], input, textarea, select, label')) {
                if (ringRef.current) ringRef.current.style.transform = 'scale(1.7)'
            }
        }

        const onOut = (e: MouseEvent) => {
            const t = e.target as HTMLElement
            if (t.closest('a, button, [role="button"], input, textarea, select, label')) {
                if (ringRef.current) ringRef.current.style.transform = 'scale(1)'
            }
        }

        const onLeave = () => {
            if (wrapperRef.current) wrapperRef.current.style.opacity = '0'
        }

        window.addEventListener('mousemove', onMove, { passive: true })
        window.addEventListener('mouseover', onOver, { passive: true })
        window.addEventListener('mouseout', onOut, { passive: true })
        document.documentElement.addEventListener('mouseleave', onLeave)

        return () => {
            document.getElementById('lucidify-cursor-style')?.remove()
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseover', onOver)
            window.removeEventListener('mouseout', onOut)
            document.documentElement.removeEventListener('mouseleave', onLeave)
        }
    }, [isActive])

    if (!isActive) return null

    return (
        <div
            id="lucidify-cursor"
            ref={wrapperRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                zIndex: 99999,
                opacity: 0,
                // Explicitly kill any inherited transition so position updates are instant
                transition: 'none',
                willChange: 'transform',
            }}
        >
            {/* Dot */}
            <div
                style={{
                    position: 'absolute',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'white',
                    top: '-3px',
                    left: '-3px',
                    mixBlendMode: 'difference',
                }}
            />

            {/* Ring — outer div centers it, inner div handles scale transition only */}
            <div style={{ position: 'absolute', top: '-18px', left: '-18px' }}>
                <div
                    ref={ringRef}
                    style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: '1.5px solid white',
                        mixBlendMode: 'difference',
                        transition: 'transform 0.15s ease',
                    }}
                />
            </div>
        </div>
    )
}

export default CustomCursor

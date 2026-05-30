import { useInView } from '@/hooks/useInView'

const VARIANTS = {
  up:    { hidden: 'opacity-0 translate-y-5', visible: 'opacity-100 translate-y-0' },
  left:  { hidden: 'opacity-0 -translate-x-5', visible: 'opacity-100 translate-x-0' },
  right: { hidden: 'opacity-0 translate-x-5', visible: 'opacity-100 translate-x-0' },
  in:    { hidden: 'opacity-0', visible: 'opacity-100' },
}

export default function Animate({
  children,
  type = 'up',
  delay = 0,
  duration = 600,
  className = '',
  as: Tag = 'div',
}) {
  const [ref, inView] = useInView()
  const { hidden, visible } = VARIANTS[type] ?? VARIANTS.up

  return (
    <Tag
      ref={ref}
      className={`${className} ${inView ? visible : hidden}`}
      style={{
        transition: `opacity ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  )
}

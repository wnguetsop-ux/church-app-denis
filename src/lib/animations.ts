// ── Entry animations ──────────────────────────────────────────
export const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
}

export const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } }
}

export const cardItem = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
}

export const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } }
}

// ── Hover / Interaction animations ────────────────────────────
export const cardHover = {
  rest:  { scale: 1 },
  hover: { scale: 1.03, transition: { duration: 0.3, ease: 'easeOut' } }
}

export const imageZoomHover = {
  rest:  { scale: 1 },
  hover: { scale: 1.08, transition: { duration: 0.4, ease: 'easeOut' } }
}

export const buttonTap = {
  whileTap: { scale: 0.97 }
}

// ── Hero slider animations ────────────────────────────────────
export const heroSlideIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 1, ease: 'easeInOut' } },
  exit:    { opacity: 0, transition: { duration: 1, ease: 'easeInOut' } }
}

'use client'
import { motion } from 'framer-motion'

interface Props { children: React.ReactNode; className?: string; delay?: number; id?: string }

export default function AnimatedSection({ children, className, delay = 0, id }: Props) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut', delay } }
      }}
      id={id}
      className={className}>
      {children}
    </motion.div>
  )
}

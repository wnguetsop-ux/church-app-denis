'use client'

import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, UserCheck } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { events } from '@/data/events-data'

export default function EvenementsPage() {
  const t = useTranslations()
  const locale = useLocale() as 'fr' | 'en'

  const now = new Date()
  const upcoming = events
    .filter(e => new Date(e.startAt) >= now)
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
  const past = events
    .filter(e => new Date(e.startAt) < now)
    .sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime())

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-CA', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    }).format(new Date(iso))

  const formatTime = (iso: string) =>
    new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-CA', {
      hour: '2-digit', minute: '2-digit',
    }).format(new Date(iso))

  const EventCard = ({ event, index, isPast }: { event: typeof events[0]; index: number; isPast?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`bg-white rounded-2xl overflow-hidden shadow-sm group hover:shadow-lg transition-all duration-300 border border-transparent hover:border-cifm-blue-100 ${isPast ? 'opacity-70' : ''}`}
    >
      {/* Color strip top */}
      <div className={`h-1.5 ${isPast ? 'bg-gray-200' : 'bg-gradient-to-r from-cifm-blue-600 to-cifm-blue-400'}`} />

      <div className="p-5 space-y-3">
        {/* Date badge */}
        <div className="flex items-start gap-3">
          <div className={`shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.15)] ${
            isPast ? 'bg-gray-100 text-gray-500' : 'bg-cifm-blue-600 text-white'
          }`}>
            <span className="text-lg font-bold leading-none">
              {new Date(event.startAt).getDate()}
            </span>
            <span className="text-[9px] uppercase font-medium">
              {new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-CA', { month: 'short' }).format(new Date(event.startAt))}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-lora font-semibold text-gray-900 group-hover:text-cifm-blue-700 transition-colors">
              {event.title[locale]}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <Clock size={12} />
                {formatTime(event.startAt)}
                {event.endAt && ` - ${formatTime(event.endAt)}`}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <MapPin size={12} />
                {event.location[locale]}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed">{event.description[locale]}</p>

        {/* Registration badge */}
        {event.registrationRequired && !isPast && (
          <div className="flex items-center gap-2 bg-cifm-blue-50 text-cifm-blue-700 text-xs font-medium px-3 py-2 rounded-lg">
            <UserCheck size={14} />
            {locale === 'fr' ? 'Inscription requise' : 'Registration required'}
          </div>
        )}
      </div>
    </motion.div>
  )

  return (
    <div>
      <PageHeader
        title={t('events.title')}
        subtitle={locale === 'fr' ? 'Prochains rassemblements et activit\u00E9s de la CIFM4' : 'Upcoming gatherings and activities of CIFM4'}
        backgroundImage="/images/headers/hero-church-event.png"
      />

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Upcoming events */}
        {upcoming.length > 0 && (
          <AnimatedSection>
            <h2 className="font-lora text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-cifm-blue-600" />
              {locale === 'fr' ? '\u00C0 venir' : 'Upcoming'}
            </h2>
            <div className="space-y-4">
              {upcoming.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          </AnimatedSection>
        )}

        {/* Past events */}
        {past.length > 0 && (
          <AnimatedSection delay={0.15}>
            <h2 className="font-lora text-lg font-semibold text-gray-400 mb-4">
              {locale === 'fr' ? '\u00C9v\u00E9nements pass\u00E9s' : 'Past events'}
            </h2>
            <div className="space-y-3">
              {past.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} isPast />
              ))}
            </div>
          </AnimatedSection>
        )}

        {events.length === 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <Calendar size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">{t('common.no_content')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

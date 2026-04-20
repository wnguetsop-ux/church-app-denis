import { BookOpen, HandHeart, HeartHandshake, Radio, UsersRound } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import AnimatedSection from '@/components/shared/AnimatedSection'
import type { Locale } from '@/types'

interface Props {
  params: Promise<{ locale: string }>
}

const content = {
  fr: {
    title: 'Qui sommes-nous ?',
    subtitle: 'Communauté Internationale des Fils de Malachie 4',
    intro:
      'Communauté Internationale des Fils de Malachie 4 (C. I. F. M. 4) est une organisation Chrétienne a but non lucratif, avec comme objectifs:',
    objectives: [
      'Promouvoir la parole de Dieu (Sainte Bible), de façon direct mais surtout par les moyens de diffusion en ligne (Internet);',
      'Promouvoir le message de Malachie 4:5-6: "Voici, je vous enverrai Elie, le prophète, Avant que le jour de l’Éternel arrive, Ce jour grand et redoutable. Il ramènera le cœur des pères à leurs enfants, Et le cœur des enfants à leurs pères, De peur que je ne vienne frapper le pays d interdit.";',
      'Promouvoir le style de vie communautaire des chrétiens de Actes 2;',
      'Apporter une aide à des laissés pour compte, sans distinction aucune et de leur proposer des actions de réinsertion;',
      'Accueillir la personne en difficulté par une aide sur le plan matériel, moral et spirituel;',
      'Mettre à disposition le message biblique (Bible et diverses publications chrétiennes);',
    ],
  },
  en: {
    title: 'Who are we?',
    subtitle: 'The International Community of the Sons of Malachi 4',
    intro:
      'The International Community of the Sons of Malachi 4 (ICFM 4) is a non-profit Christian organization with the following objectives:',
    objectives: [
      'To promote the Word of God (the Holy Bible), directly but especially through online means (the Internet);',
      'To promote the message of Malachi 4:5-6: “Behold, I will send you Elijah the prophet before the coming of the great and dreadful day of the Lord. He will turn the hearts of the fathers to their children, and the hearts of the children to their fathers, lest I come and strike the land with a curse.”;',
      'To promote the community lifestyle of the Christians described in Acts 2;',
      'To provide assistance to marginalized people, without discrimination, and to offer them reintegration programs;',
      'To welcome those in difficulty by providing material, moral, and spiritual support;',
      'To make available the biblical message (Bible and various Christian publications);',
    ],
  },
}

const icons = [BookOpen, Radio, UsersRound, HeartHandshake, HandHeart, BookOpen]

export default async function AboutPage({ params }: Props) {
  const { locale: rawLocale } = await params
  const locale = (rawLocale === 'en' ? 'en' : 'fr') as Locale
  const copy = content[locale]

  return (
    <div>
      <PageHeader
        title={copy.title}
        subtitle={copy.subtitle}
        backgroundImage="/images/headers/hero-community-joy.png"
      />

      <AnimatedSection className="mx-auto max-w-3xl px-4 py-8">
        <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="bg-gradient-to-br from-cifm-blue-700 to-cifm-blue-900 p-6 text-white">
            <p className="font-lora text-2xl font-semibold">{copy.title}</p>
            <p className="mt-3 text-sm leading-relaxed text-blue-50">{copy.intro}</p>
          </div>

          <div className="space-y-3 p-5">
            {copy.objectives.map((objective, index) => {
              const Icon = icons[index] ?? BookOpen
              return (
                <div key={objective} className="flex gap-3 rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cifm-blue-50 text-cifm-blue-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm leading-relaxed text-gray-700">{objective}</p>
                </div>
              )
            })}
          </div>
        </section>
      </AnimatedSection>
    </div>
  )
}

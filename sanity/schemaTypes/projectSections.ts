import {defineArrayMember, defineType} from 'sanity'

export const projectSections = defineType({
  name: 'projectSections',
  title: 'Project page sections',
  type: 'array',
  of: [
    defineArrayMember({type: 'heroSection'}),
    defineArrayMember({type: 'narrativeSection'}),
    defineArrayMember({type: 'contributionGridSection'}),
    defineArrayMember({type: 'mediaShowcaseSection'}),
    defineArrayMember({type: 'processSection'}),
    defineArrayMember({type: 'codeShowcaseSection'}),
    defineArrayMember({type: 'interactiveSandboxSection'}),
    defineArrayMember({type: 'outcomesSection'}),
  ],

  validation: (rule) =>
    rule
      .required()
      .min(1)
      .custom((sections) => {
        if (!Array.isArray(sections)) {
          return true
        }

        const sectionItems = sections as Array<{
          _type?: string
        }>

        const heroSections = sectionItems.filter((section) => section._type === 'heroSection')

        const sandboxSections = sectionItems.filter(
          (section) => section._type === 'interactiveSandboxSection',
        )

        if (heroSections.length === 0) {
          return 'Add one hero section.'
        }

        if (heroSections.length > 1) {
          return 'A project can only have one hero section.'
        }

        if (sectionItems[0]?._type !== 'heroSection') {
          return 'The hero section must be the first section.'
        }

        if (sandboxSections.length > 1) {
          return 'A project can only have one interactive sandbox.'
        }

        return true
      }),
})

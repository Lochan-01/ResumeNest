import { Request, Response } from 'express'

// Mock AI suggestions - in production, connect to OpenAI API
const suggestionTemplates: { [key: string]: string[] } = {
  summary: [
    'Highly motivated professional with X years of experience in industry',
    'Results-driven individual with proven track record in delivering projects',
    'Detail-oriented expert with strong leadership and communication skills',
    'Innovative problem-solver committed to driving business growth and success',
  ],
  experience: [
    'Led cross-functional teams to deliver successful projects on time and under budget',
    'Improved operational efficiency by implementing new processes and technologies',
    'Collaborated with stakeholders to identify and achieve business objectives',
    'Managed budgets totaling $X and oversaw team of Y people',
  ],
  education: [
    'Completed advanced certifications in relevant field',
    'Graduated with honors, maintaining GPA above 3.5',
    'Participated in relevant projects and internships',
    'Active in professional organizations and student groups',
  ],
  skills: [
    'Project Management',
    'Team Leadership',
    'Strategic Planning',
    'Data Analysis',
    'Problem Solving',
    'Communication',
    'Decision Making',
    'Budget Management',
  ],
}

// Impact-first bullet rewriting templates
const bulletRewriterTemplates = {
  weak: [
    // Weak patterns
    { weak: /^(helped|assisted|worked on|was involved in)/i, strong: 'action-verb' },
    { weak: /^(i|we)\s+(did|made|created)/i, strong: 'impact-metrics' },
    { weak: /^(responsible for|in charge of)/i, strong: 'led-owned' },
  ],
  actionVerbs: [
    'Engineered', 'Architected', 'Orchestrated', 'Spearheaded', 'Accelerated',
    'Optimized', 'Transformed', 'Revolutionized', 'Pioneered', 'Elevated',
    'Enhanced', 'Streamlined', 'Automated', 'Deployed', 'Scaled',
    'Leveraged', 'Maximized', 'Amplified', 'Catalyzed', 'Executed',
  ],
}

export const getSuggestions = async (req: Request, res: Response) => {
  try {
    const { section, content } = req.body

    if (!section) {
      return res.status(400).json({ error: 'Section is required' })
    }

    const suggestions = suggestionTemplates[section] || []

    res.json({
      success: true,
      suggestions: suggestions.slice(0, 3),
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

// Helper function to rewrite weak bullets into strong impact-first statements
const rewriteWeakBullet = (bullet: string): string => {
  if (!bullet || bullet.trim().length === 0) return ''

  let rewritten = bullet.trim()

  // Replace weak openers with action verbs
  const weakPatterns = [
    { pattern: /^(helped|assisted|supported|worked on|was involved in|contributed to)\s+/i, replacement: 'Engineered ' },
    { pattern: /^(i\s+)?(did|made|created|built|developed)\s+/i, replacement: 'Engineered ' },
    { pattern: /^(responsible for|in charge of|managed|handled)\s+/i, replacement: 'Orchestrated ' },
    { pattern: /^(improved|enhanced|optimized|made better)\s+/i, replacement: 'Accelerated ' },
    { pattern: /^(designed|implemented|launched)\s+/i, replacement: 'Architected ' },
  ]

  for (const { pattern, replacement } of weakPatterns) {
    if (pattern.test(rewritten)) {
      rewritten = rewritten.replace(pattern, replacement)
      break
    }
  }

  // Add quantifiable impact if missing
  if (!/(\d+%|\d+\$|[\d.,]+\s*(times?|users?|clients?|items?|projects?|processes?|hours?|days?))/i.test(rewritten)) {
    // If there's a context, add impact language
    if (/efficiency|performance|speed|time|cost|revenue|growth|users|clients/.test(rewritten.toLowerCase())) {
      if (!/(increased|improved|boosted|reduced|saved|generated)/.test(rewritten)) {
        rewritten = rewritten.replace(/\.$/, '') + ' by X% and improved Y metric.'
      }
    }
  }

  // Capitalize properly
  rewritten = rewritten.charAt(0).toUpperCase() + rewritten.slice(1)

  // Ensure it ends with a period
  if (!rewritten.endsWith('.')) {
    rewritten += '.'
  }

  return rewritten
}

// Main rewriter endpoint
export const rewriteBullet = async (req: Request, res: Response) => {
  try {
    const { bullet, bulletType } = req.body

    if (!bullet || bullet.trim().length === 0) {
      return res.status(400).json({ error: 'Bullet point is required' })
    }

    const rewritten = rewriteWeakBullet(bullet)

    // Generate 2 alternative versions
    const alternatives = generateAlternatives(bullet, bulletType)

    res.json({
      success: true,
      original: bullet,
      rewritten: rewritten,
      alternatives: alternatives,
      tips: generateRewriteTips(bullet),
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

// Generate alternative stronger versions
const generateAlternatives = (bullet: string, bulletType?: string): string[] => {
  const alternatives: string[] = []
  
  // Alternative 1: Different action verb approach
  const actionVerbs = bulletRewriterTemplates.actionVerbs
  const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)]
  
  let alt1 = bullet.toLowerCase()
    .replace(/^(helped|assisted|worked on|did|made|created|responsible for|managed|improved)/i, randomVerb)
  alt1 = alt1.charAt(0).toUpperCase() + alt1.slice(1)
  if (!alt1.endsWith('.')) alt1 += '.'
  alternatives.push(alt1)

  // Alternative 2: Metrics-focused
  let alt2 = rewriteWeakBullet(bullet)
  if (!alt2.includes('%') && !alt2.includes('$')) {
    alt2 = alt2.replace(/\.$/, ' resulting in measurable business impact.')
  }
  alternatives.push(alt2)

  return alternatives.filter(a => a !== bullet)
}

// Generate helpful tips for improvement
const generateRewriteTips = (bullet: string): string[] => {
  const tips: string[] = []

  if (/^(helped|assisted|worked on)/.test(bullet)) {
    tips.push('💡 Replace weak verbs (helped, assisted, worked) with strong action verbs (engineered, architected, spearheaded)')
  }

  if (!/(\d+%|\d+|\$|times?|users?|clients?)/.test(bullet)) {
    tips.push('📊 Add quantifiable metrics or numbers to show impact (X%, Y users, $Z saved)')
  }

  if (/^i\s+|^we\s+/.test(bullet)) {
    tips.push('🎯 Remove "I/We" pronouns - resumes should start with strong action verbs')
  }

  if (bullet.length > 150) {
    tips.push('✂️ Consider shortening this bullet - aim for 1-2 lines maximum')
  }

  if (!/(led|managed|owned|spearheaded|orchestrated)/.test(bullet.toLowerCase())) {
    tips.push('👥 Consider showing leadership impact if applicable to this accomplishment')
  }

  return tips.slice(0, 3)
}

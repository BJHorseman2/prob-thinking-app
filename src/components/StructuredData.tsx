'use client'

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Probabl",
    "description": "Master behavioral economics through gamified challenges. Learn from Kahneman, Thaler, and Annie Duke through poker, trading, and decision-making games.",
    "url": "https://probabl.xyz",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "Probabl"
    },
    "keywords": "behavioral economics, cognitive biases, decision making, poker psychology, trading psychology, Daniel Kahneman, Richard Thaler, gamification",
    "educationalLevel": "intermediate",
    "educationalCredentialAwarded": "Digital Badges",
    "teaches": [
      "Behavioral Economics",
      "Cognitive Bias Recognition", 
      "Decision Making Under Uncertainty",
      "Poker Psychology",
      "Trading Psychology",
      "Probability Assessment",
      "Risk Management"
    ],
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "student"
    },
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/PlayAction",
      "userInteractionCount": "1000+"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
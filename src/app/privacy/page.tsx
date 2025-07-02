import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Probabl',
  description: 'How Probabl collects, uses, and protects your personal information.',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          <div className="text-gray-300 space-y-6">
            <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-purple-300">Account Information</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Email address (for account creation and authentication)</li>
                  <li>Username (optional, for leaderboards and social features)</li>
                  <li>Profile preferences and settings</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-purple-300">Usage Data</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Challenge completion data and scores</li>
                  <li>Badge achievements and progress</li>
                  <li>Learning analytics to improve the educational experience</li>
                  <li>Device information and browser type</li>
                  <li>IP address and general location (for analytics)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Educational Experience:</strong> Track your progress, provide personalized recommendations, and improve the learning platform</li>
                <li><strong>Leaderboards:</strong> Display scores and achievements (with your permission)</li>
                <li><strong>Analytics:</strong> Understand usage patterns to improve the app</li>
                <li><strong>Communication:</strong> Send important updates about your account or the service</li>
                <li><strong>Security:</strong> Prevent fraud and maintain account security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing</h2>
              <p className="mb-4">We do not sell, trade, or rent your personal information to third parties. We may share data in these limited circumstances:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Service Providers:</strong> Trusted partners who help operate our platform (Supabase for database, Vercel for hosting)</li>
                <li><strong>Analytics:</strong> Aggregated, anonymized data for analytics purposes</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Leaderboards:</strong> Your username and scores (only if you opt in to public leaderboards)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Data Storage and Security</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Data is stored securely using industry-standard encryption</li>
                <li>We use Supabase (PostgreSQL) with row-level security</li>
                <li>Local browser storage for temporary data and preferences</li>
                <li>Regular security audits and updates</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct your information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Portability:</strong> Export your learning progress data</li>
                <li><strong>Opt-out:</strong> Unsubscribe from communications</li>
              </ul>
              <p className="mt-4">To exercise these rights, contact us at privacy@probabl.xyz</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Cookies and Tracking</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Essential Cookies:</strong> Required for login and basic functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use the app (Google Analytics, Mixpanel)</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
              <p className="mt-4">You can manage cookie preferences in your browser settings.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Children\'s Privacy</h2>
              <p>Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. International Users</h2>
              <p>If you are accessing our service from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States where our servers are located.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>Email: privacy@probabl.xyz</li>
                <li>Website: https://probabl.xyz</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
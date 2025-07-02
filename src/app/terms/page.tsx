import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - Probabl',
  description: 'Terms and conditions for using the Probabl behavioral economics platform.',
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
          <div className="text-gray-300 space-y-6">
            <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p>By accessing and using Probabl ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, you should not use the Service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
              <p>Probabl is an educational platform focused on behavioral economics, decision-making, and cognitive bias recognition through gamified challenges. The Service includes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li>Interactive behavioral economics challenges</li>
                <li>Educational content about cognitive biases</li>
                <li>Progress tracking and achievement badges</li>
                <li>Leaderboards and social features</li>
                <li>Digital collectibles and NFT-like badges (simulation only)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You must provide accurate, current, and complete information during registration</li>
                <li>You are responsible for safeguarding your password and account access</li>
                <li>You agree to notify us immediately of any unauthorized use of your account</li>
                <li>One account per person; multiple accounts are not permitted</li>
                <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Acceptable Use</h2>
              <p className="mb-4">You agree NOT to use the Service to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violate any local, state, national, or international law</li>
                <li>Transmit any harmful, threatening, abusive, or offensive content</li>
                <li>Attempt to gain unauthorized access to the Service or other users\' accounts</li>
                <li>Reverse engineer, decompile, or attempt to extract source code</li>
                <li>Use automated scripts, bots, or other tools to manipulate the Service</li>
                <li>Impersonate another person or entity</li>
                <li>Spam, harass, or abuse other users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Educational Content</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Educational Purpose:</strong> All content is for educational purposes only and should not be considered financial, investment, or professional advice</li>
                <li><strong>Accuracy:</strong> While we strive for accuracy, we make no warranties about the completeness or accuracy of educational content</li>
                <li><strong>Personal Responsibility:</strong> Users are responsible for their own decision-making and should not rely solely on our platform for important decisions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Virtual Items and Badges</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>No Monetary Value:</strong> Badges, points, and other virtual items have no real-world monetary value</li>
                <li><strong>Simulation Only:</strong> "NFT minting" is simulation only and does not create actual blockchain tokens</li>
                <li><strong>No Guarantee:</strong> We do not guarantee the availability, accuracy, or permanence of virtual items</li>
                <li><strong>No Trading:</strong> Virtual items cannot be traded, sold, or transferred to other users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Intellectual Property</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>The Service and its original content are owned by Probabl and are protected by copyright and other intellectual property laws</li>
                <li>You may not copy, modify, distribute, or create derivative works without explicit permission</li>
                <li>User-generated content (like challenge responses) remains your property but you grant us a license to use it for Service improvement</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Privacy and Data</h2>
              <p>Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Disclaimers</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>As-Is Service:</strong> The Service is provided "as is" without warranties of any kind</li>
                <li><strong>No Professional Advice:</strong> Content is for educational purposes only and is not professional financial, investment, or psychological advice</li>
                <li><strong>Third-Party Content:</strong> We are not responsible for third-party websites or services linked from our platform</li>
                <li><strong>Availability:</strong> We do not guarantee uninterrupted access to the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Limitation of Liability</h2>
              <p>To the maximum extent permitted by law, Probabl shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, or use, arising out of your use of the Service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Termination</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Either party may terminate the agreement at any time</li>
                <li>We may suspend or terminate your account for violations of these terms</li>
                <li>Upon termination, your right to use the Service ceases immediately</li>
                <li>Data retention and deletion will follow our Privacy Policy</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. Changes to Terms</h2>
              <p>We reserve the right to modify these terms at any time. We will notify users of significant changes via email or prominent notice on the Service. Continued use after changes constitutes acceptance of the new terms.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">13. Governing Law</h2>
              <p>These terms shall be interpreted and governed in accordance with the laws of the United States and the state of [Your State], without regard to conflict of law principles.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">14. Contact Information</h2>
              <p>For questions about these Terms of Service, please contact us:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>Email: legal@probabl.xyz</li>
                <li>Website: https://probabl.xyz</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
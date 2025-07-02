// Analytics and event tracking for Probabl.xyz

interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  userId?: string
}

class Analytics {
  private isProduction = process.env.NODE_ENV === 'production'
  private gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  private mixpanelToken = process.env.NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN

  // Initialize analytics services
  init() {
    if (this.isProduction) {
      this.initGoogleAnalytics()
      this.initMixpanel()
    }
  }

  // Track page views
  pageView(url: string) {
    if (this.isProduction && typeof window !== 'undefined') {
      // Google Analytics
      if (window.gtag && this.gaId) {
        window.gtag('config', this.gaId, {
          page_location: url,
        })
      }
      
      // Mixpanel
      if (window.mixpanel && this.mixpanelToken) {
        window.mixpanel.track('Page View', { url })
      }
    }

    // Development logging
    if (!this.isProduction) {
      console.log('📊 Page View:', url)
    }
  }

  // Track custom events
  track(event: string, properties: Record<string, any> = {}, userId?: string) {
    const eventData: AnalyticsEvent = { event, properties, userId }
    
    if (this.isProduction && typeof window !== 'undefined') {
      // Google Analytics
      if (window.gtag) {
        window.gtag('event', event, {
          event_category: properties.category || 'engagement',
          event_label: properties.label,
          value: properties.value,
          user_id: userId,
          ...properties
        })
      }
      
      // Mixpanel
      if (window.mixpanel) {
        if (userId) window.mixpanel.identify(userId)
        window.mixpanel.track(event, properties)
      }
    }

    // Development logging
    if (!this.isProduction) {
      console.log('📊 Event:', eventData)
    }
  }

  // Track user identification
  identify(userId: string, traits: Record<string, any> = {}) {
    if (this.isProduction && typeof window !== 'undefined') {
      // Google Analytics
      if (window.gtag) {
        window.gtag('config', this.gaId, {
          user_id: userId,
          custom_map: traits
        })
      }
      
      // Mixpanel
      if (window.mixpanel) {
        window.mixpanel.identify(userId)
        window.mixpanel.people.set(traits)
      }
    }

    // Development logging
    if (!this.isProduction) {
      console.log('📊 Identify:', { userId, traits })
    }
  }

  private initGoogleAnalytics() {
    if (!this.gaId || typeof window === 'undefined') return

    // Load GA script
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`
    script.async = true
    document.head.appendChild(script)

    // Initialize gtag
    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      window.dataLayer.push(arguments)
    }
    gtag('js', new Date())
    gtag('config', this.gaId, {
      page_location: window.location.href,
      page_title: document.title,
    })

    // Make gtag globally available
    window.gtag = gtag
  }

  private initMixpanel() {
    if (!this.mixpanelToken || typeof window === 'undefined') return

    // Load Mixpanel script
    ;(function(f: any, b: any) {
      if (!b.__SV) {
        var e, g, i, h
        window.mixpanel = b
        b._i = []
        b.init = function(e: any, f: any, c: any) {
          function g(a: any, d: any) {
            var b = d.split('.')
            2 == b.length && ((a = a[b[0]]), (d = b[1]))
            a[d] = function() {
              a.push([d].concat(Array.prototype.slice.call(arguments, 0)))
            }
          }
          var a = b
          'undefined' !== typeof c ? (a = b[c] = []) : (c = 'mixpanel')
          a.people = a.people || []
          a.toString = function(a: any) {
            var d = 'mixpanel'
            'mixpanel' !== c && (d += '.' + c)
            a || (d += ' (stub)')
            return d
          }
          a.people.toString = function() {
            return a.toString(1) + '.people (stub)'
          }
          i = 'disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove'.split(' ')
          for (h = 0; h < i.length; h++) g(a, i[h])
          var j = 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js'
          e = f.createElement('script')
          e.type = 'text/javascript'
          e.async = !0
          e.src = j
          g = f.getElementsByTagName('script')[0]
          g.parentNode?.insertBefore(e, g)
        }
      }
    })(document, window.mixpanel || [])

    // Initialize Mixpanel
    window.mixpanel.init(this.mixpanelToken, {
      debug: !this.isProduction,
      track_pageview: true,
      persistence: 'localStorage',
    })
  }
}

// Predefined event tracking functions for common actions
export const analytics = new Analytics()

// App-specific event tracking
export const trackChallengeCompleted = (challengeId: string, correct: boolean, points: number, userId?: string) => {
  analytics.track('Challenge Completed', {
    category: 'engagement',
    challenge_id: challengeId,
    correct,
    points,
    timestamp: new Date().toISOString(),
  }, userId)
}

export const trackBadgeEarned = (badgeId: string, badgeName: string, rarity: string, userId?: string) => {
  analytics.track('Badge Earned', {
    category: 'achievement',
    badge_id: badgeId,
    badge_name: badgeName,
    rarity,
    timestamp: new Date().toISOString(),
  }, userId)
}

export const trackUserRegistration = (userId: string, method: string) => {
  analytics.track('User Registered', {
    category: 'conversion',
    method,
    timestamp: new Date().toISOString(),
  }, userId)
}

export const trackLeaderboardView = (userId?: string) => {
  analytics.track('Leaderboard Viewed', {
    category: 'engagement',
    timestamp: new Date().toISOString(),
  }, userId)
}

export const trackChallengePathStarted = (pathId: string, pathName: string, userId?: string) => {
  analytics.track('Challenge Path Started', {
    category: 'engagement',
    path_id: pathId,
    path_name: pathName,
    timestamp: new Date().toISOString(),
  }, userId)
}

export const trackSocialShare = (platform: string, content: string, userId?: string) => {
  analytics.track('Social Share', {
    category: 'social',
    platform,
    content,
    timestamp: new Date().toISOString(),
  }, userId)
}

// Type declarations for global analytics objects
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
    mixpanel: any
  }
}

export default analytics
// This is a placeholder file to prevent the app from crashing.
// The real Supabase client is not configured.

export const isSupabaseConfigured = false;

export const supabase = {
  from: () => ({
    select: () => ({
      order: () => ({
        limit: () => ({
          data: [],
          error: { message: 'Supabase not configured' }
        })
      })
    }),
    on: () => ({
      subscribe: () => ({
        unsubscribe: () => {}
      })
    })
  })
}; 
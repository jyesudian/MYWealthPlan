import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This is required to refresh the session and fetch user info
  let user = null
  try {
    const {
      data: { user: sessionUser },
    } = await supabase.auth.getUser()
    user = sessionUser
  } catch (error) {
    console.error('Error in middleware auth check:', error)
  }

  // Route guarding
  const url = request.nextUrl.clone()
  const isLoginPage = url.pathname === '/login'
  const isAuthCallback = url.pathname === '/auth/callback'

  // Define protection rules
  // Allow public assets, internal Next.js paths, and the login page
  const isStaticAsset = url.pathname.includes('.') || url.pathname.startsWith('/_next')
  
  if (!user && !isLoginPage && !isAuthCallback && !isStaticAsset) {
    // Redirect to login page if unauthorized
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isLoginPage) {
    // Redirect to homepage if user is already logged in
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

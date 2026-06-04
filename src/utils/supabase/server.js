import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const createMockClient = () => {
  const makeSafeMock = (path = []) => {
    const target = () => {};
    
    target.then = (resolve) => {
      if (path.includes('auth') && path.includes('getUser')) {
        resolve({ data: { user: null }, error: new Error("Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing.") });
      } else {
        resolve({ data: null, error: new Error("Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing.") });
      }
    };

    return new Proxy(target, {
      get(t, prop) {
        if (prop === 'then') {
          return t.then;
        }
        return makeSafeMock([...path, prop]);
      },
      apply(t, thisArg, argumentsList) {
        return makeSafeMock(path);
      }
    });
  };

  return makeSafeMock();
}

export async function createClient() {
  const cookieStore = await cookies()

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return createMockClient()
  }

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

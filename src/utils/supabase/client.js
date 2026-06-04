import { createBrowserClient } from '@supabase/ssr'

const createMockClient = () => {
  const makeSafeMock = (path = []) => {
    const target = () => {};
    
    target.then = (resolve) => {
      if (path.includes('auth') && path.includes('getUser')) {
        resolve({ data: { user: null }, error: new Error("Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing. Please configure them in your Vercel/environment settings.") });
      } else {
        resolve({ data: null, error: new Error("Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing. Please configure them in your Vercel/environment settings.") });
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

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return createMockClient()
  }

  return createBrowserClient(url, key)
}

import { supabase } from '../../lib/supabaseClient'
export default async function Page() {
  const { data, error } = await supabase.from('test').select('*')

  return (
    <div>
      <h1>Supabase Test</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {error && <p>{error.message}</p>}
    </div>
  )
}
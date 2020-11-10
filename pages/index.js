import { useRouter } from 'next/router'
import { Grid, Heading, Button } from 'grommet'
import Layout from '../components/layout'

export default function Home() {
  const router = useRouter()
  return (
    <Layout>
      <Heading>第99回武蔵記念祭</Heading>
      <Grid
        rows={['medium', 'meduim']}
        columns={['auto', 'auto']}
        gap="small" 
      >
        <Button primary label="新規登録" onClick={() => router.push('/signup')} />
        <Button         label="ログイン" onClick={() => router.push('/login')}  />
      </Grid>
    </Layout>
  )
}

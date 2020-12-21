import { useRouter } from 'next/router'
import { Grid, Heading, Button } from 'grommet'
import Spinner from '../components/loadingSpinner'
import Layout from '../components/layout'
import EventList from '../components/eventList'
import LogoutButton from '../components/logoutButton'

export default function Home({ token }) {
  const router = useRouter()

  return (
    <Layout>
      <Heading>第99回武蔵記念祭</Heading>
      {
        token ? (
          token.isLoading ? (
            <Spinner />
          ) : (
            <>
              <LogoutButton />
              <EventList token={token} />
            </>
          )
        ) : (
          <Grid
            rows={['medium', 'meduim']}
            columns={['auto', 'auto']}
            gap="small"
          >
            <Button primary label="新規登録" onClick={() => router.push('/signup')} />
            <Button label="ログイン" onClick={() => router.push('/login')}  />
          </Grid>
        )
      }
    </Layout>
  )
}

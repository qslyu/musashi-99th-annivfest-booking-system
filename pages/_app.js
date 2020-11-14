import { Grommet, grommet as grommetTheme } from 'grommet'

export default function MyApp({ Component, pageProps }) {
  return (
    <Grommet theme={grommetTheme}>
      <Component {...pageProps} />
    </Grommet>
  )
}

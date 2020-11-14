import { Grommet, grommet as grommetTheme } from 'grommet'
import firebase from 'firebase/app'
import 'firebase/auth'
import initFirebase from '../utils/firebase/init'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    initFirebase()

    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        const pathname = router.pathname

        if(pathname == '/signup' || pathname == '/login') router.push('/')
        if(!user.emailVerified) router.push('/emailsent')
      }
    })
  })

  return (
    <Grommet theme={grommetTheme}>
      <Component {...pageProps} />
    </Grommet>
  )
}

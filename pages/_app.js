import { Grommet, grommet as grommetTheme } from 'grommet'
import firebase from 'firebase/app'
import 'firebase/auth'
import initFirebase from '../utils/firebase/init'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [token, setToken] = useState({ isLoading: true })

  useEffect(() => {
    initFirebase()

    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        const pathname = router.pathname

        firebase.auth().currentUser.getIdToken(true)
          .then(idToken => {
            setToken(idToken)
          })

        if(pathname == '/signup' || pathname == '/login') router.push('/')
        if(!user.emailVerified) router.push('/emailsent')
      } else {
        setToken()
      }
    })
  }, [])

  return (
    <Grommet theme={grommetTheme}>
      <Component {...pageProps} token={token} />
    </Grommet>
  )
}

import firebase from 'firebase/app'
import 'firebase/auth'
import { Anchor } from 'grommet'
import { useRouter } from 'next/router'

export default function LogoutButton() {
  const router = useRouter()

  return (
    <Anchor
      label="ログアウト"
      onClick={() => {
        firebase.auth().signOut()
          .then(() => {
            router.push('/')
          })
          .catch((err) => {
            console.log(err)
          })
      }}
    />
  )
}
import firebase from 'firebase/app'
import 'firebase/auth'
import { Text, Anchor, Box } from 'grommet'
import { useRouter } from 'next/router'
import { toDateString } from '../utils/convertDatetime'

export default function LogoutButton() {
  const router = useRouter()
  const user = firebase.auth().currentUser

  return (
    <>
      <Box
        direction="row"
      >
        <Text margin="xsmall">参加日 : {toDateString(user.displayName)}</Text>
        <Anchor
          label="ログアウト"
          margin="xsmall"
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
      </Box>
    </>
  )
}
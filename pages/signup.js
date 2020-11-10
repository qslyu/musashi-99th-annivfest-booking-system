import { useRouter } from 'next/router'
import firebase from 'firebase/app'
import 'firebase/auth'
import InitFirebase from '../utils/firebase/init'
import { Heading, Box, Button, Form, FormField, TextInput } from 'grommet'
import Layout from '../components/layout'

export default function SignUp() {
  const router = useRouter()

  function signUp(val) {
    InitFirebase()
    
    const displayname = val.displayname
    const email = val.email
    const password = val.password
  
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        firebase.auth().currentUser.updateProfile({displayName: displayname})
          .then(() => firebase.auth().currentUser.sendEmailVerification())
          .catch(err => console.log(err))
      })
      .then(() => router.push('/emailsent'))
      .catch(err => console.log(err))
  }

  return (
    <Layout>
      <Heading>新規登録</Heading>
      <Form
        onSubmit={({ value }) => {signUp(value)}}
      >
        <FormField
          name="displayname"
          label="名前"
        >
          <TextInput name="displayname" />
        </FormField>
        <FormField
          name="email"
          label="メールアドレス"
        >
          <TextInput name="email" />
        </FormField>
        <FormField
          name="password"
          label="パスワード"
        >
          <TextInput type="password" name="password" />
        </FormField>
        <Box direction="column" top="large">
          <Button type="submit" primary label="登録" />
        </Box>
      </Form> 
    </Layout>
  )
}

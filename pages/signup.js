import { useState } from 'react'
import { useRouter } from 'next/router'
import firebase from 'firebase/app'
import 'firebase/auth'
import { Heading, Box, Form, FormField, TextInput, Text } from 'grommet'
import ButtonLoader from '../components/buttonLoader'
import Layout from '../components/layout'
import { usernameRules, emailRules, passwordRules } from '../utils/grommet/rules'

export default function SignUp() {
  const router = useRouter()

  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState()

  function signUp(val) {
    setLoading(true)
    setError()
    
    const displayname = val.displayname
    const email = val.email
    const password = val.password
  
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => firebase.auth().currentUser.updateProfile({displayName: displayname}))
      .then(() => firebase.auth().currentUser.sendEmailVerification())
      .then(() => router.push('/emailsent'))
      .catch(err => {
        setLoading(false)
        setError(err.message)
      })
  }

  return (
    <Layout>
      <Heading>新規登録</Heading>
      <Form
        onSubmit={({ value }) => {signUp(value)}}
        validate="submit"
      >
        <FormField
          name="displayname"
          label="名前"
          validate={usernameRules}
        >
          <TextInput name="displayname" />
        </FormField>
        <FormField
          name="email"
          label="メールアドレス"
          validate={emailRules}
        >
          <TextInput name="email" />
        </FormField>
        <FormField
          name="password"
          label="パスワード"
          validate={passwordRules}
        >
          <TextInput type="password" name="password" />
        </FormField>
        <Box direction="column" top="large">
          <ButtonLoader label="登録" labelLoad="送信中" isLoading={isLoading} />
        </Box>
      </Form>
      <Box pad="medium">
        <Text color="status-error">
          {error}
        </Text>
      </Box>
    </Layout>
  )
}

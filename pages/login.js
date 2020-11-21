import { useState } from 'react'
import { useRouter } from 'next/router'
import firebase from 'firebase/app'
import 'firebase/auth'
import { Heading, Box, Form, FormField, TextInput, Text } from 'grommet'
import ButtonLoader from '../components/buttonLoader'
import Layout from '../components/layout'
import { emailRules, passwordRules } from '../utils/grommet/rules'

export default function Login() {
  const router = useRouter()

  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState()

  function Login(val) {
    setLoading(true)
    setError()
    
    const email = val.email
    const password = val.password
  
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => router.push('/'))
      .catch(err => {
        setLoading(false)
        setError(err.message)
      })
  }

  return (
    <Layout>
      <Heading>ログイン</Heading>
      <Form
        onSubmit={({ value }) => {Login(value)}}
        validate="submit"
      >
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
          <ButtonLoader label="ログイン" labelLoad="送信中" isLoading={isLoading} />
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

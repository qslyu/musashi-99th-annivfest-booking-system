import { Heading, Paragraph } from 'grommet'
import { useEffect } from 'react'
import Layout from '../components/layout'
import firebase from 'firebase/app'
import 'firebase/auth'
import { useRouter } from 'next/router'
import initFirebase from '../utils/firebase/init'

export default function emailSent() {
  const router = useRouter()

  useEffect(() => {
    initFirebase()
    firebase.auth().onAuthStateChanged(user => {
      if(user.emailVerified) router.push('/')
    })
  }, [])

  return(
    <Layout>
      <Heading>確認メールを送信しました</Heading>
      <Paragraph>メール内のリンクにアクセスしてアカウントを有効化してください。</Paragraph>
    </Layout>
  )
}
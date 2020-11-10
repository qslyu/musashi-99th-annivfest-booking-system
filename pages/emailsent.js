import { Heading, Paragraph } from 'grommet'
import Layout from '../components/layout'

export default function emailSent() {
  return(
    <Layout>
      <Heading>確認メールを送信しました</Heading>
      <Paragraph>メール内のリンクにアクセスしてアカウントを有効化してください。</Paragraph>
    </Layout>
  )
}
import { Main } from 'grommet'

export default function Layout({ children }) {
  return (
    <>
      <Main pad="medium" align="center">{ children }</Main>
    </>
  )
}
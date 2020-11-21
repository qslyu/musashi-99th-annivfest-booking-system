import { Box } from 'grommet'

export default function Layout({ children }) {
  return (
    <>
      <Box align="center" margin="large">{ children }</Box>
    </>
  )
}
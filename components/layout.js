import { Box } from 'grommet'
import { useEffect } from 'react'
export default function Layout({ children }) {
  return (
    <>
      <Box align="center" margin="large">{ children }</Box>
    </>
  )
}
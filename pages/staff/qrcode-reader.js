import dynamic from 'next/dynamic'
import { useState } from 'react'
import fetcher from '../../utils/swr/fetcher'
import { Heading, Layer, Text, Button, Box } from 'grommet'
import toJapanese from '../../utils/convertDatetime'

const BarcodeReader = dynamic(() => import('react-qr-reader'), {
  ssr: false,
})

export default function QRcodeReader() {
  const [code, setCode] = useState()
  const [showEventInfo, setShowEventInfo] = useState()
  const [showError, setShowError] = useState()

  return (
    <>
      <BarcodeReader
        style={{ width: '50%' }}
        delay={300}
        onScan={async result => {
          const resultStr = `${result}`
          if(result && (resultStr != code)) {
            setCode(resultStr)
            const data = await fetcher(`/api/staff/booking-info?id=${result}`)
            if(!data.error) {
              setShowEventInfo(data)
            } else {
              setShowError(data)
            }
          }
        }}
      />

      <Text>{code}</Text>

      {showError && (
        <>
          <Heading>エラー</Heading>
          <Text>{showError.error}</Text>
        </>
      )}

      {showEventInfo && (
        <>
          <Heading>{showEventInfo.event}</Heading>
          <Text>{toJapanese(showEventInfo.datetime)}</Text>
        </>
      )}
    </>
  )
}
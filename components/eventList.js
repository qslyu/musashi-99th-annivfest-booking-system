import { Button, Layer, Box, Heading, Text, Grid } from 'grommet'
import Spinner from './loadingSpinner'
import { useState } from 'react'
import useSWR, { mutate } from 'swr'
import fetcher from '../utils/swr/fetcher'
import toJapanese from '../utils/convertDatetime'
import QRCode from 'qrcode.react'

export default function TimeList({ token }) {
  const [showModal, setShowModal] = useState()
  const [showCancelModal, setShowCancelModal] = useState()
  const [showQRModal, setShowQRModal] = useState()
  
  const { data } = useSWR(`/api/events?token=${token}`, fetcher)
  if(data) {
    return (
      <>
        <Box>
          {data.map(eventInfo => {
            return (
              <Box 
                key={eventInfo.id}
                margin={{vertical: 'medium'}}
              >
                <Heading>{eventInfo.name}</Heading>

                {eventInfo['times'].map(time => {
                  const isReserved = time.booking_id

                  return (
                    <Box
                      key={time.id}
                      margin={{vertical: 'small'}}
                      pad={{vertical: 'medium', horizontal: 'medium'}}
                      direction="row"
                      background={isReserved ? 'status-disabled' : 'light-3'}
                      round="medium"
                    >
                      <Grid
                        rows={['xxsmall', 'xxsmall']}
                        columns={['small', 'xsmall']}
                        gap="small"
                        areas={[
                          { name: 'info', start: [0, 0], end: [0, 1] },
                          { name: 'button', start: [1, 0], end: [1, 1] }
                        ]}
                      >
                        <Box gridArea="info" justify="center">
                          {isReserved && <Text>予約済み</Text>}
                          <Heading level="2" margin={{vertical: 'xsmall'}}>{toJapanese(time.datetime)}</Heading>
                        </Box>
                        <Box gridArea="button" justify="center">
                          {isReserved ? (
                            <>
                              <Button
                                primary
                                label='入場'
                                margin={{vertical: 'xxsmall'}}
                                onClick={() => setShowQRModal({'event': eventInfo.name, 'time': time})}
                              />                            
                              <Button
                                label='Cancel'
                                margin={{vertical: 'xxsmall'}}
                                onClick={() => setShowCancelModal({'event': eventInfo.name, 'time': time})}
                              />
                            </>
                          ) : (
                            <Button
                              primary
                              label='予約'
                              margin={{vertical: 'xxsmall'}}
                              onClick={() => setShowModal({'event': eventInfo.name, 'time': time})}
                            />
                          )}
                        </Box>
                      </Grid>
                    </Box>
                  )
                })}
              </Box>
            )
          })}
        </Box>
        
        {showModal && (
          <Layer>
            <Box align="center" margin="large">
              <Heading>{showModal.event}</Heading>
              <Heading level='3' margin='none'>{toJapanese(showModal.time.datetime)}</Heading>
              <Box margin='large'>
                <Text>予約しますか？</Text>
              </Box>
              <Grid
                rows={['medium', 'meduim']}
                columns={['auto', 'auto']}
                gap="small"
              >
                <Button 
                  primary 
                  label="はい"
                  margin={{vertical: 'medium'}} 
                  onClick={async () => {
                    const data = await fetcher(`/api/booking/new?token=${token}&time_id=${showModal.time.id}`)
                    if(data.success) {
                      mutate(`/api/events?token=${token}`, fetcher(`/api/events?token=${token}`))
                      setShowModal(false)
                    }
                  }}
                />
                <Button
                  label="いいえ"
                  margin={{vertical: 'medium'}}
                  onClick={() => {setShowModal(false)}}
                />
              </Grid>
            </Box>
          </Layer>
        )}

        {showCancelModal && (
          <Layer>
            <Box align="center" margin="large">
              <Heading>{showCancelModal.event}</Heading>
              <Heading level='3' margin='none'>{toJapanese(showCancelModal.time.datetime)}</Heading>
              <Box margin='large'>
                <Text>キャンセルしますか？</Text>
              </Box>
              <Grid
                rows={['medium', 'meduim']}
                columns={['auto', 'auto']}
                gap="small"
              >
                <Button 
                  primary 
                  label="はい"
                  margin={{vertical: 'medium'}} 
                  onClick={async () => {
                    const data = await fetcher(`/api/booking/cancel?token=${token}&time_id=${showCancelModal.time.id}`)
                    if(data.success) {
                      mutate(`/api/events?token=${token}`, fetcher(`/api/events?token=${token}`))
                      setShowCancelModal(false)
                    }
                  }}
                />
                <Button
                  label="いいえ"
                  margin={{vertical: 'medium'}}
                  onClick={() => {setShowCancelModal(false)}}
                />
              </Grid>
            </Box>
          </Layer>
        )}

        {showQRModal && (
          <Layer>
            <Box align="center" margin="large">
              <Heading>{showQRModal.event}</Heading>
              <Heading level='3' margin='none'>{toJapanese(showQRModal.time.datetime)}</Heading>
              <Text margin='medium'>この画面をスタッフに見せてください</Text>
              <Box margin='large'>
                <QRCode value={showQRModal.time.booking_id} />
              </Box>
              <Button 
                label="閉じる" 
                margin={{vertical: 'medium'}} 
                onClick={() => setShowQRModal(false)} 
              />
            </Box>
          </Layer>
        )}

      </>
    )
  } else {
    return (
      <Spinner />
    )
  }
}
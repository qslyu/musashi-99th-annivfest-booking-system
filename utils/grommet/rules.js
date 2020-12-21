export const numberRule = [
  {
    regexp: /\d{6}/,
    message: '予約番号が無効です',
    status: 'error'
  }
]

export const passwordRule = [
  {
    regexp: new RegExp('\\S{6,}'),
    message: '6文字以上必要です',
    status: 'error'
  }
]
export const passwordRule = [
  {
    regexp: new RegExp('\\S{6,}'),
    message: '6文字以上必要です',
    status: 'error'
  }
]
export const usernameRules = [
  {
    regexp: new RegExp('.{1,}'),
    message: '入力してください',
    status: 'error'
  }
]

export const emailRules = [
  {
    regexp: new RegExp('[^\\s]+@[^\\s]+'),
    message: 'メールアドレスが無効です',
    status: 'error'
  }
]

export const passwordRules = [
  {
    regexp: new RegExp('.{6,}'),
    message: '6文字以上必要です',
    status: 'error'
  }
]
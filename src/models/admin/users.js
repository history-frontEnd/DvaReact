// @flow

export default {
  namespace: 'users',
  state: 0,
  reducers: {
    add  (count :number): number { return count + 1 },
    minus (count :number): number { return count - 1 }
  }
}

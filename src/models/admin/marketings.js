// @flow

export default {
  namespace: 'marketings',
  state: 0,
  reducers: {
    add  (count :number): number { return count + 1 },
    minus (count :number): number { return count - 1 }
  }
}

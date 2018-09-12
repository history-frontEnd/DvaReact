import React, { Component, Fragment } from 'react'
import SearchForm from './searchForm'
import InfoTable from './table'

export default class Container extends Component {
  render () {
    return (
      <Fragment>
        <SearchForm/>
        <InfoTable/>
      </Fragment>
    )
  }
}

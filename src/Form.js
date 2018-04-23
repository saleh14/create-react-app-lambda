import React, { Component } from 'react'

export default class Form extends Component {
  state = {
    user_fullName: '',
    nationalID: ''
  }
  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
    setTimeout(_ => this.props.getFields(this.state))
  }
  render () {
    return (
      <form>
        <label for='user_fullName'>
          الاسم الكامل:
        </label>
        <input
          type='text'
          name='user_fullName'
          onChange={e => this.change(e)}
        />
      </form>
    )
  }
}

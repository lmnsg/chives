import Eth, { BN } from 'ethjs'
import { sign } from 'ethjs-signer'
import Head from 'next/head'
import React from 'react'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      from: '',
      to: '',
      key: '',
      eth: '',
      gas: '',
      gasPrice: '',
      balance: ''
    }
  }

  componentDidMount() {
    const eth = this.eth = new Eth(new Eth.HttpProvider('https://api.myetherapi.com/rop'))
    const from = window.localStorage.from || ''
    this.setState({
      from
    })
    this.getBalance(from)
    eth.gasPrice().then((bn) => {
      this.setState({ gasPrice: bn })
    })
  }

  getBalance(from) {
    const { eth } = this
    this.setState({
      from: window.localStorage.from = from,
    })

    if (!Eth.isAddress(from)) return

    eth.getBalance(from)
      .then((bn) => {
        this.setState({
          balance: bn
        })
      })
  }

  transfer() {
    let { state: { from, to, eth, gas, gasPrice, key } } = this
    if (!key) {
      this.setState({ key: key = window.prompt('your key?') })
    }
    this.eth.getTransactionCount(from)
      .then((nonce) => this.eth.sendRawTransaction(sign({
        to,
        value: Eth.toWei(eth, 'ether'),
        gas: new BN(gas),
        gasPrice: gasPrice.mul(new BN(3)),
        data: '0x',
        nonce
      }, key)))
      .then((res) => alert(res))
      .catch(() => this.setState({ key: '' }))
  }

  model(field, e) {
    this.setState({ [field]: e.target.value })
  }

  render() {
    const { gasPrice, balance, from } = this.state

    return <div className="container">
      <Head>
        <title>转账</title>
      </Head>
      <h4>转账</h4>
      <form>
        <fieldset>
          <label>我: {(Eth.fromWei(balance, 'ether') - 0).toFixed(2)}eth</label>
          <input value={from} onChange={(e) => this.getBalance(e.target.value)} type="text"/>
          <label htmlFor="">to</label>
          <input onChange={(e) => this.model('to', e)} type="text"/>
          <div className={'clearfix'}>
            <div className={'float-left'}>
              <label htmlFor="">eth</label>
              <input onChange={(e) => this.model('eth', e)} type="text"/>
            </div>
            <div className="float-left" style={{ marginLeft: 20 }}>
              <label htmlFor="">gas: {Eth.fromWei(gasPrice, 'gwei')}gw</label>
              <input onChange={(e) => this.model('gas', e)} type="text"/>
            </div>
          </div>
          <button type="button" onClick={() => this.transfer()}>转账</button>
        </fieldset>
      </form>
    </div>
  }
}
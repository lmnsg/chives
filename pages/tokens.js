import Eth from 'ethjs'
import Contract from 'ethjs-contract'
import { sign } from 'ethjs-signer'
import Head from 'next/head'
import React from 'react'

const abi = [{
  'constant': true,
  'inputs': [],
  'name': 'name',
  'outputs': [{ 'name': '', 'type': 'string' }],
  'payable': false,
  'type': 'function'
}, {
  'constant': false,
  'inputs': [{ 'name': '_spender', 'type': 'address' }, { 'name': '_value', 'type': 'uint256' }],
  'name': 'approve',
  'outputs': [{ 'name': 'success', 'type': 'bool' }],
  'payable': false,
  'type': 'function'
}, {
  'constant': true,
  'inputs': [],
  'name': 'totalSupply',
  'outputs': [{ 'name': '', 'type': 'uint256' }],
  'payable': false,
  'type': 'function'
}, {
  'constant': false,
  'inputs': [{ 'name': '_from', 'type': 'address' }, { 'name': '_to', 'type': 'address' }, {
    'name': '_value',
    'type': 'uint256'
  }],
  'name': 'transferFrom',
  'outputs': [{ 'name': 'success', 'type': 'bool' }],
  'payable': false,
  'type': 'function'
}, {
  'constant': true,
  'inputs': [],
  'name': 'decimals',
  'outputs': [{ 'name': '', 'type': 'uint8' }],
  'payable': false,
  'type': 'function'
}, {
  'constant': true,
  'inputs': [],
  'name': 'version',
  'outputs': [{ 'name': '', 'type': 'string' }],
  'payable': false,
  'type': 'function'
}, {
  'constant': true,
  'inputs': [{ 'name': '_owner', 'type': 'address' }],
  'name': 'balanceOf',
  'outputs': [{ 'name': 'balance', 'type': 'uint256' }],
  'payable': false,
  'type': 'function'
}, {
  'constant': true,
  'inputs': [],
  'name': 'symbol',
  'outputs': [{ 'name': '', 'type': 'string' }],
  'payable': false,
  'type': 'function'
}, {
  'constant': false,
  'inputs': [{ 'name': '_to', 'type': 'address' }, { 'name': '_value', 'type': 'uint256' }],
  'name': 'transfer',
  'outputs': [{ 'name': 'success', 'type': 'bool' }],
  'payable': false,
  'type': 'function'
}, {
  'constant': false,
  'inputs': [{ 'name': '_spender', 'type': 'address' }, { 'name': '_value', 'type': 'uint256' }, {
    'name': '_extraData',
    'type': 'bytes'
  }],
  'name': 'approveAndCall',
  'outputs': [{ 'name': 'success', 'type': 'bool' }],
  'payable': false,
  'type': 'function'
}, {
  'constant': true,
  'inputs': [{ 'name': '_owner', 'type': 'address' }, { 'name': '_spender', 'type': 'address' }],
  'name': 'allowance',
  'outputs': [{ 'name': 'remaining', 'type': 'uint256' }],
  'payable': false,
  'type': 'function'
}, {
  'inputs': [{ 'name': '_initialAmount', 'type': 'uint256' }, {
    'name': '_tokenName',
    'type': 'string'
  }, { 'name': '_decimalUnits', 'type': 'uint8' }, { 'name': '_tokenSymbol', 'type': 'string' }],
  'payable': false,
  'type': 'constructor'
}, { 'payable': false, 'type': 'fallback' }, {
  'anonymous': false,
  'inputs': [{ 'indexed': true, 'name': '_from', 'type': 'address' }, {
    'indexed': true,
    'name': '_to',
    'type': 'address'
  }, { 'indexed': false, 'name': '_value', 'type': 'uint256' }],
  'name': 'Transfer',
  'type': 'event'
}, {
  'anonymous': false,
  'inputs': [{ 'indexed': true, 'name': '_owner', 'type': 'address' }, {
    'indexed': true,
    'name': '_spender',
    'type': 'address'
  }, { 'indexed': false, 'name': '_value', 'type': 'uint256' }],
  'name': 'Approval',
  'type': 'event'
}]
const address = '0xc873426a43C82bFdb1C8784b133a9A4C8CC66350'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      address,
      from: '0x639b2B421bb6E7df3637BA5834B88a6bCe016F3A',
      balance: '',
      to: '',
      num: 0
    }
  }

  componentWillMount() {
    const eth = this.eth = new Eth(new Eth.HttpProvider('https://ropsten.infura.io/mew'))

    eth.sendTransaction = function (data, cb) {
      const key = window.prompt('your key?')
      this.getTransactionCount(data.from).then((nonce) => {
        Object.assign(data, {
          nonce,
          gas: '100000',
          gasPrice: '25000000000'
        })
      })
        .then(() => this.sendRawTransaction(sign(data, key), cb))
        .catch(cb)
    }
    const contract = new Contract(eth)
    this.token = contract(abi).at(address)
    this.getTokens(this.state.from)
  }

  getTokens(address) {
    this.token.balanceOf(address).then(({ balance }) => {
      this.setState({
        balance
      })
    })
  }

  model(key, e) {
    const value = e.target.value
    this.setState({
      [key]: value
    })
    if (key === 'from' && Eth.isAddress(value)) this.getTokens(value)
  }

  transfer() {
    const { from, to, num } = this.state
    this.token.transfer(to, num * Math.pow(10, 18), {
      from
    })
      .then(alert)
      .catch(alert)
  }

  render() {
    const { balance, from } = this.state
    return (<div className="container">
      <Head>
        <title>Token</title>
      </Head>
      <div className="tokens">
        <h3>合约地址</h3>
        <p>{ address }</p>
      </div>
      <form>
        <label htmlFor="">from: { balance.toString() }</label>
        <input value={from} onChange={(e) => this.model('from', e)} type="text"/>
        <div  className="clearfix">
          <div className="float-left" style={{ width: '50%', marginRight: 20 }}>
            <label>to:</label>
            <input onChange={(e) => this.model('to', e)} type="text"/>
          </div>
          <div className="float-left">
            <label>个数</label>
            <input onChange={(e) => this.model('num', e)} type="text"/>
          </div>
        </div>
        <button type="button" onClick={() => this.transfer()}>转币</button>
      </form>
    </div>)
  }
}
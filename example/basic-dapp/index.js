// import js-conflux-sdk
// more info about js-conflux-sdk
// https://github.com/Conflux-Chain/js-conflux-sdk#readme
import { Conflux, Drip } from './js-conflux-sdk.js'

const cusdtAddress = 'cfxtest:acepe88unk7fvs18436178up33hb4zkuf62a9dk1gv'
const dappAddress = 'cfxtest:aca8paka2w86tpgmmh7ufdv005u2cheb76578khwd2'
const onlineAddress = 'cfx:acgtf56ceymsvw2r0nsffveafatu5v6jz6me8m4m85'

const confluxFaucetAddress =
  'cfxtest:acejjfa80vj06j2jgtz9pngkv423fhkuxj786kjr61'
const exampleContract = new Conflux().Contract({
  abi: [
    {
      inputs: [
        {
          internalType: 'string',
          name: '_name',
          type: 'string',
        },
        {
          internalType: 'uint8',
          name: '_decimals',
          type: 'uint8',
        },
        {
          internalType: 'string',
          name: '_symbol',
          type: 'string',
        },
        {
          internalType: 'uint256',
          name: '_totalSupply',
          type: 'uint256',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: '_owner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: '_spender',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: '_value',
          type: 'uint256',
        },
      ],
      name: 'Approval',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: '_from',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: '_to',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: '_value',
          type: 'uint256',
        },
      ],
      name: 'Transfer',
      type: 'event',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_owner',
          type: 'address',
        },
        {
          internalType: 'address',
          name: '_spender',
          type: 'address',
        },
      ],
      name: 'allowance',
      outputs: [
        {
          internalType: 'uint256',
          name: 'remaining',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      name: 'allowed',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_spender',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: '_value',
          type: 'uint256',
        },
      ],
      name: 'approve',
      outputs: [
        {
          internalType: 'bool',
          name: 'success',
          type: 'bool',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_owner',
          type: 'address',
        },
      ],
      name: 'balanceOf',
      outputs: [
        {
          internalType: 'uint256',
          name: 'balance',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      name: 'balances',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'decimals',
      outputs: [
        {
          internalType: 'uint8',
          name: '',
          type: 'uint8',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'name',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'symbol',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'totalSupply',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_to',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: '_value',
          type: 'uint256',
        },
      ],
      name: 'transfer',
      outputs: [
        {
          internalType: 'bool',
          name: 'success',
          type: 'bool',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_from',
          type: 'address',
        },
        {
          internalType: 'address',
          name: '_to',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: '_value',
          type: 'uint256',
        },
      ],
      name: 'transferFrom',
      outputs: [
        {
          internalType: 'bool',
          name: 'success',
          type: 'bool',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
  bytecode:
    '0x60806040523480156200001157600080fd5b50604051620010ca380380620010ca833981810160405260808110156200003757600080fd5b81019080805160405193929190846401000000008211156200005857600080fd5b838201915060208201858111156200006f57600080fd5b82518660018202830111640100000000821117156200008d57600080fd5b8083526020830192505050908051906020019080838360005b83811015620000c3578082015181840152602081019050620000a6565b50505050905090810190601f168015620000f15780820380516001836020036101000a031916815260200191505b5060405260200180519060200190929190805160405193929190846401000000008211156200011f57600080fd5b838201915060208201858111156200013657600080fd5b82518660018202830111640100000000821117156200015457600080fd5b8083526020830192505050908051906020019080838360005b838110156200018a5780820151818401526020810190506200016d565b50505050905090810190601f168015620001b85780820380516001836020036101000a031916815260200191505b50604052602001805190602001909291905050508360009080519060200190620001e49291906200026e565b5082600160006101000a81548160ff021916908360ff1602179055508160029080519060200190620002189291906200026e565b508060038190555080600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505050506200031d565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10620002b157805160ff1916838001178555620002e2565b82800160010185558215620002e2579182015b82811115620002e1578251825591602001919060010190620002c4565b5b509050620002f19190620002f5565b5090565b6200031a91905b8082111562000316576000816000905550600101620002fc565b5090565b90565b610d9d806200032d6000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c8063313ce56711610071578063313ce567146102935780635c658165146102b757806370a082311461032f57806395d89b4114610387578063a9059cbb1461040a578063dd62ed3e14610470576100a9565b806306fdde03146100ae578063095ea7b31461013157806318160ddd1461019757806323b872dd146101b557806327e235e31461023b575b600080fd5b6100b66104e8565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156100f65780820151818401526020810190506100db565b50505050905090810190601f1680156101235780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61017d6004803603604081101561014757600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610586565b604051808215151515815260200191505060405180910390f35b61019f610678565b6040518082815260200191505060405180910390f35b610221600480360360608110156101cb57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061067e565b604051808215151515815260200191505060405180910390f35b61027d6004803603602081101561025157600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506109e9565b6040518082815260200191505060405180910390f35b61029b610a01565b604051808260ff1660ff16815260200191505060405180910390f35b610319600480360360408110156102cd57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610a14565b6040518082815260200191505060405180910390f35b6103716004803603602081101561034557600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610a39565b6040518082815260200191505060405180910390f35b61038f610a82565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156103cf5780820151818401526020810190506103b4565b50505050905090810190601f1680156103fc5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6104566004803603604081101561042057600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610b20565b604051808215151515815260200191505060405180910390f35b6104d26004803603604081101561048657600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610ce0565b6040518082815260200191505060405180910390f35b60008054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561057e5780601f106105535761010080835404028352916020019161057e565b820191906000526020600020905b81548152906001019060200180831161056157829003601f168201915b505050505081565b600081600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a36001905092915050565b60035481565b600080600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905082600460008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410156107b5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260138152602001807f62616c616e636573206e6f7420656e6f7567680000000000000000000000000081525060200191505060405180910390fd5b8281101561082b576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260148152602001807f616c6c6f77616e6365206e6f7420656e6f75676800000000000000000000000081525060200191505060405180910390fd5b82600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254019250508190555082600460008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8110156109785782600560008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055505b8373ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef856040518082815260200191505060405180910390a360019150509392505050565b60046020528060005260406000206000915090505481565b600160009054906101000a900460ff1681565b6005602052816000526040600020602052806000526040600020600091509150505481565b6000600460008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b60028054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610b185780601f10610aed57610100808354040283529160200191610b18565b820191906000526020600020905b815481529060010190602001808311610afb57829003601f168201915b505050505081565b600081600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015610bd7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260138152602001807f62616c616e636573206e6f7420656e6f7567680000000000000000000000000081525060200191505060405180910390fd5b81600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a36001905092915050565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490509291505056fea2646970667358221220ba3544f95832f9a6f264be220893ae1c951498e955e1908563105ee727d890c064736f6c634300060a0033',
})
const confluxFaucetContract = new Conflux().Contract({
  abi: [
    { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'newManager',
          type: 'address',
        },
      ],
      name: 'changeManager',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'claimCfx',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'claimCfxRegardingSenderBalance',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'tokenContractAddress',
          type: 'address',
        },
      ],
      name: 'claimToken',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'tokenContractAddress',
          type: 'address',
        },
      ],
      name: 'claimTokenRegardingSenderBalance',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'defaultAmount',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'defaultInterval',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'tokenContractAddress',
          type: 'address',
        },
      ],
      name: 'getClaimAmount',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'tokenContractAddress',
          type: 'address',
        },
      ],
      name: 'getClaimInterval',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address[]',
          name: 'tokenList',
          type: 'address[]',
        },
      ],
      name: 'retrieveToken',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'tokenContractAddress',
          type: 'address',
        },
        { internalType: 'uint256', name: 'interval', type: 'uint256' },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'setClaimSetting',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'setDefaultAmount',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'intervalSeconds',
          type: 'uint256',
        },
      ],
      name: 'setDefaultIntervalSeconds',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    { stateMutability: 'payable', type: 'receive' },
  ],
  address: confluxFaucetAddress,
})

const abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_gateway',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'gatewayData',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: 'gatewaySig',
        type: 'bytes',
      },
    ],
    name: 'test',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'testNoGuard',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

const msgParams = {
  types: {
    CIP23Domain: [
      {
        name: 'name',
        type: 'string',
      },
      {
        name: 'version',
        type: 'string',
      },
      {
        name: 'chainId',
        type: 'uint256',
      },
      {
        name: 'verifyingContract',
        type: 'address',
      },
    ],
    Person: [
      {
        name: 'name',
        type: 'string',
      },
      {
        name: 'wallet',
        type: 'address',
      },
    ],
    Mail: [
      {
        name: 'from',
        type: 'Person',
      },
      {
        name: 'to',
        type: 'Person',
      },
      {
        name: 'contents',
        type: 'string',
      },
    ],
  },
  primaryType: 'Mail',
  domain: {
    name: 'Ether Mail',
    version: '1',
    chainId: 1,
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  },
  message: {
    from: {
      name: 'Cow',
      wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
    },
    to: {
      name: 'Bob',
      wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
    },
    contents: 'Hello, Bob!',
  },
}

// 初始化钱包
const provider = new window.AnyWeb.Provider({
  appId: '693b6401-135a-4dc3-846b-1c05ad2572f6',
})
console.log('开始监听是否准备好')
provider.on('ready', async () => {
  await walletInitialized()
  window.addEventListener('load', async () => {
    if (!isAnyWebInstall()) {
      return
    }
    getElement('installed').innerHTML = 'installed'
    if (window.localStorage.getItem('__FLUENT_USE_MODERN_PROVIDER_API__')) {
      getElement('installed-section').style.display = 'block'
    }
    if (isAnyWebInstall()) {
      console.log('DApp 已经检查到OK了')
      provider.request({ method: 'anyweb_version' }).then((version) => {
        getElement('version').innerHTML = version
      })
    } else {
      alert('找不到AnyWeb SDK, 请检查是否正确配置')
    }
  })
})

function getElement(id) {
  return document.getElementById(id)
}

function isAnyWebInstall() {
  return window.AnyWeb !== undefined
}

let address = []
let networkId = -1
let chainId = -1
let url = ''

// dappContract
let dappContract = new Conflux().Contract({
  abi: abi,
  address: networkId === 1029 ? onlineAddress : dappAddress,
})

function setState(data) {
  address = data.address
  networkId = data.networkId
  chainId = data.chainId
  url = data.url
  dappContract = new Conflux().Contract({
    abi: abi,
    address: networkId === 1029 ? onlineAddress : dappAddress,
  })
}

function reset() {
  address = []
  networkId = -1
  chainId = -1
  url = ''
  dappContract = new Conflux().Contract({
    abi: abi,
    address: networkId === 1029 ? onlineAddress : dappAddress,
  })
}

async function walletInitialized() {
  // connect
  const connectButton = getElement('connect')
  const DeauthorizeButton = getElement('Deauthorize')
  const logoutButton = getElement('Logout')
  const approveButton = getElement('approve')
  const transferFromButton = getElement('transfer_from')
  const getCFXButton = getElement('get-cfx')
  const gatewayTestButton = getElement('gateway_test')
  const importAddressButton = getElement('import_address_button')
  const nativeReceiverAddressInput = getElement('native-receiver')
  const countInput = getElement('native-count')
  const approveAccountInput = getElement('approve-account')
  const transferFromAccountInput = getElement('from-account')
  const transferToAccountInput = getElement('to-account')
  const importAddressInput = getElement('import_address_input')
  const importAddressNameInput = getElement('import_address_name_input')
  const identifyButton = getElement('identify_button')
  const checkLoginButton = getElement('checklogin_button')
  const signButton = getElement('sign_button')

  const deployContract = getElement('deploy_contract')

  function authed(address, oauthCode = undefined) {
    if (!address || address === '') {
      return unAuthed()
    }
    getElement('address').innerHTML = address
    if (oauthCode) {
      getElement('oauth_code').innerHTML = oauthCode
    }
    console.log('authed address: ', address)
    approveButton.disabled = false
    transferFromButton.disabled = false
    deployContract.disabled = false
    getCFXButton.disabled = false
    gatewayTestButton.disabled = false
    connectButton.disabled = true
    DeauthorizeButton.disabled = false
    logoutButton.disabled = false
    importAddressButton.disabled = false
    identifyButton.disabled = false
    signButton.disabled = false
  }

  function unAuthed() {
    getElement('address').innerHTML = 'N/A'
    getElement('oauth_code').innerHTML = 'N/A'
    console.log('unauthed')
    approveButton.disabled = true
    transferFromButton.disabled = true
    getCFXButton.disabled = true
    gatewayTestButton.disabled = true
    deployContract.disabled = true
    connectButton.disabled = false
    DeauthorizeButton.disabled = true
    logoutButton.disabled = true
    importAddressButton.disabled = true
    identifyButton.disabled = true
    signButton.disabled = true
  }

  try {
    provider.request({ method: 'anyweb_version' }).then((version) => {
      getElement('version').innerHTML = version
    })

    const data = await provider.request({
      method: 'cfx_accounts',
      params: [
        {
          availableNetwork: [1, 1029],
          scopes: ['baseInfo', 'identity'],
        },
      ],
    })
    const { chainId, networkId, address: alreadyAuthedAddresses, code } = data
    console.log(
      'DApp 获取到的授权结果',
      chainId,
      networkId,
      alreadyAuthedAddresses,
      code
    )
    setState(data)
    getElement('initialized').innerHTML = 'initialized'
    getElement('chainId').innerHTML = chainId
    getElement('networkId').innerHTML = networkId

    if (
      !alreadyAuthedAddresses ||
      !alreadyAuthedAddresses.length ||
      alreadyAuthedAddresses.length === 0
    ) {
      unAuthed()
    } else {
      authed(alreadyAuthedAddresses[0], code)
    }
  } catch (e) {
    unAuthed()
    console.error('try 到错误了', e)
  }

  provider.on('accountsChanged', (accounts) => {
    console.log('accountsChanged, accounts = ', accounts)
    if (!accounts || !accounts.length || accounts.length === 0) {
      return unAuthed()
    }
    authed(accounts[0])
  })

  provider.on('chainChanged', (chainId) => {
    console.log('chainChanged called', chainId)
    getElement('chainId').innerHTML = chainId
  })

  connectButton.onclick = async () => {
    const data = await provider.request({
      method: 'cfx_accounts',
      params: [
        {
          availableNetwork: [1, 1029],
          scopes: ['baseInfo', 'identity'],
        },
      ],
    })
    const { chainId, networkId, address: alreadyAuthedAddresses, code } = data
    console.log(
      'DApp 获取到的授权结果',
      chainId,
      networkId,
      alreadyAuthedAddresses,
      code
    )
    setState(data)
    getElement('initialized').innerHTML = 'initialized'
    getElement('chainId').innerHTML = chainId
    getElement('networkId').innerHTML = networkId

    if (
      !alreadyAuthedAddresses ||
      !alreadyAuthedAddresses.length ||
      alreadyAuthedAddresses.length === 0
    ) {
      unAuthed()
    } else {
      authed(alreadyAuthedAddresses[0], code)
    }
  }

  DeauthorizeButton.onclick = () => {
    provider
      .request({
        method: 'exit_accounts',
      })
      .then(unAuthed)
      .catch(console.error)
  }
  logoutButton.onclick = () => {
    provider
      .request({
        method: 'anyweb_logout',
      })
      .then(unAuthed)
      .catch(console.error)
  }

  getCFXButton.onclick = async () => {
    try {
      const connectedAddress = address[0]
      const tx = {
        from: connectedAddress,
        to: confluxFaucetAddress,
        data: confluxFaucetContract.claimCfx().data,
      }
      console.log('getCFX tx', tx)
      provider
        .request({ method: 'cfx_sendTransaction', params: [tx] })
        .then((result) => {
          getElement('get_cfx_result').innerHTML = result
          console.log('result', result)
        })
        .catch((e) => {
          console.error('获取CFX失败', e)
        })
    } catch (err) {
      console.log('err', err)
    }
  }
  gatewayTestButton.onclick = async () => {
    try {
      const connectedAddress = address[0]
      console.log('connectedAddress', connectedAddress)
      const payload = {
        from: connectedAddress,
        to: networkId === 1029 ? onlineAddress : dappAddress,
        data: dappContract.test('0x', '0x').data,
        abi: abi.filter(
          (item) => item.type === 'function' && item.name === 'test'
        )[0],
      }

      const gatewayPayload = {
        data: '123',
        data1: '456',
      }

      provider
        .request({
          method: 'cfx_sendTransaction',
          params: [payload, gatewayPayload],
        })
        .then((result) => {
          getElement('gateway_test_result').innerHTML = result
          console.log('result', result)
        })
        .catch((e) => {
          getElement('gateway_test_result').innerHTML = `
            Code: ${e.code},\n
            Message: ${e.message},\n
            Data: ${e.data}\n 
          `
          console.error('合约调用失败', { message: e.message, data: e.data })
        })
    } catch (err) {
      console.log('err', err)
    }
  }

  signButton.onclick = async () => {
    try {
      const from = address[0]
      console.log('connectedAddress', from)
      provider
        .request({
          method: 'cfx_signTypedData',
          params: [from, JSON.stringify(msgParams)],
        })
        .then((result) => {
          getElement('sign_result').innerHTML = JSON.stringify(result)
          console.log('result', result)
        })
        .catch((e) => {
          getElement('gateway_test_result').innerHTML = `
            Code: ${e.code},\n
            Message: ${e.message},\n
            Data: ${e.data}\n 
          `
          console.error('签名失败', { message: e.message, data: e.data })
        })
    } catch (err) {
      console.log('err', err)
    }
  }

  // approve spender
  approveButton.onclick = async () => {
    try {
      const connectedAddress = address[0]
      const tx = {
        from: connectedAddress,
        to: cusdtAddress,
        data: exampleContract.approve(
          approveAccountInput.value,
          100000000000000000000
        ).data,
        gasPrice: 2,
      }
      provider
        .request({ method: 'cfx_sendTransaction', params: [tx] })
        .then((result) => {
          getElement('approve_result').innerHTML = result
          console.log('result', result)
        })
    } catch (err) {
      console.log('err', err)
    }
  }
  // transfer from
  transferFromButton.onclick = async () => {
    try {
      const connectedAddress = address[0]
      const tx = {
        from: connectedAddress,
        to: cusdtAddress,
        data: exampleContract.transferFrom(
          transferFromAccountInput.value,
          transferToAccountInput.value,
          10000000000000000000
        ).data,
      }
      provider
        .request({ method: 'cfx_sendTransaction', params: [tx] })
        .then((result) => {
          console.log('result', result)
        })
    } catch (err) {
      console.log('err', err)
    }
  }

  deployContract.onclick = async () => {
    try {
      const connectedAddress = address[0]

      const tx = {
        from: connectedAddress,
        data: exampleContract.constructor('Example', 18, 'EP', 10000).data,
      }
      provider
        .request({ method: 'cfx_sendTransaction', params: [tx] })
        .then((result) => {
          getElement('deploy_contract_result').innerHTML = result
          console.log('result', result)
        })
    } catch (err) {
      console.log('err', err)
    }
  }

  importAddressButton.onclick = async () => {
    if (importAddressInput.value.replace(/\s+/g, '') === '') {
      getElement('import_address_result').innerHTML = 'valid Params'
      return
    }
    const addressLength = importAddressInput.value.split(',').length
    const addressName = importAddressNameInput.value
      .split(',')
      .filter((name) => name !== '')
    const addressNamesLength = addressName.length
    console.log('addressNamesLength', addressNamesLength)
    if (addressNamesLength > 0 && addressNamesLength !== addressLength) {
      getElement('import_address_result').innerHTML =
        'address length not equal to address name length'
      return
    }
    try {
      const tx = {
        address: importAddressInput.value.replace(/\s+/g, '').split(','),
        addressName: addressName,
      }
      provider
        .request({ method: 'anyweb_importAccount', params: [tx] })
        .then((result) => {
          getElement('import_address_result').innerHTML = result
          console.log('result', result)
        })
    } catch (err) {
      console.log('err', err)
    }
  }

  identifyButton.onclick = async () => {
    try {
      provider
        .request({ method: 'anyweb_identify', params: [] })
        .then((result) => {
          getElement('identify_result').innerHTML = result
          console.log('result', result)
        })
    } catch (err) {
      console.log('err', err)
    }
  }

  checkLoginButton.onclick = async () => {
    try {
      provider
        .request({ method: 'anyweb_loginstate', params: [] })
        .then((result) => {
          getElement('checklogin_result').innerHTML = result
          console.log('result', result)
        })
    } catch (err) {
      console.log('err', err)
    }
  }
}

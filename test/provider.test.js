const { Provider } = require('../src/provider')

test(
  'Provider',
  async () => {
    const provider = new Provider({
      logger: console,
    })
    expect(provider.constructor.name).toEqual('Provider')

    expect(
      await provider.request({
        method: 'cfx_getBalance',
      })
    ).toEqual('0x3e8ef795d71dfd3ca')

    await expect(provider.request({})).rejects.toThrow('Method is required')

    await expect(provider.request(1)).rejects.toThrow(
      'Invalid request arguments'
    )
  },
  60 * 1000
)

module.exports = [
  {
    name: 'process empty request body',
    data: null,
    error: 'Empty http command'
  },
  {
    name: 'process some action',
    data: {
      caller_number: '89226223456',
      uuid: '3f54d09a-a8a8-4821-be7d-e9efadd8b80f'
    },
    result: 'httpCommandName: someAction'
  }
]

module.exports = [
  {
    name: 'process empty request',
    data: null,
    error: 'Empty addon action'
  },
  {
    name: 'process empty request body',
    data: {},
    error: 'Addon action name not specified'
  },
  {
    name: 'process test action',
    data: { action: 'test' },
    result: { status: 1 }
  },
  {
    name: 'process unknown action',
    data: {
      action: 'foo',
      data: { bar: 'baz' }
    },
    error: 'Unknown addon action "foo"'
  },
  {
    name: 'process "contact_info" action',
    data: {
      action: 'contact_info',
      data: { caller_number: '8922 0225577' }
    },
    result: {
      status: '1',
      comment: 'Запрос успешно выполнен',
      data: { crmResult: true }
    }
  }
]

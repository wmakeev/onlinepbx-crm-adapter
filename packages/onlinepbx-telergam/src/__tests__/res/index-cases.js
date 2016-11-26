module.exports = [
  {
    name: 'case #1',
    actionPayload: {
      phone: '79226090705',
      caller: {
        contact: {
          id: '123',
          name: 'Виталий',
          url: 'https://somecrm.ru/123',
          email: 'w.makeev@gmail.com'
        },
        company: {
          id: '456',
          title: 'Макеев Виталий Вячеславович (ФЛ) [4]',
          url: 'https://somecrm.ru/456',
          email: 'vensi@vensi.me'
        }
      }
    },
    sendMessagePayload: {
      'chat_id': -56789,
      'text':
        '<b>Макеев Виталий Вячеславович (ФЛ) [4]</b>\n' +
        '+7 (922) 609-07-05\n' +
        'w.makeev@gmail.com',
      'parse_mode': 'HTML',
      'reply_markup': {
        'inline_keyboard': [
          [
            {
              'text': 'Карточка клиента',
              'url': 'https://somecrm.ru/123'
            }
          ]
        ]
      }
    }
  },
  {
    name: 'case #2',
    actionPayload: {
      phone: '79226090705',
      caller: {
        contact: {
          id: '123',
          name: 'Алексей',
          url: 'https://somecrm.ru/123'
        },
        company: {
          id: '456',
          title: 'ООО "Ромашка" [44]',
          url: 'https://somecrm.ru/456',
          email: 'vensi@vensi.me'
        }
      }
    },
    sendMessagePayload: {
      'chat_id': -56789,
      'text':
        '<b>ООО "Ромашка" [44]</b>\n' +
        'Алексей\n' +
        '+7 (922) 609-07-05\n' +
        'vensi@vensi.me',
      'parse_mode': 'HTML',
      'reply_markup': {
        'inline_keyboard': [
          [
            {
              'text': 'Карточка клиента',
              'url': 'https://somecrm.ru/123'
            }
          ]
        ]
      }
    }
  },
  {
    name: 'case #3',
    actionPayload: {
      phone: '79226090705',
      caller: {
        contact: {
          id: '123',
          name: 'Виталий',
          url: 'https://somecrm.ru/123',
          email: 'w.makeev@gmail.com'
        }
      }
    },
    sendMessagePayload: {
      'chat_id': -56789,
      'text':
        '<b>Виталий</b>\n' +
        '+7 (922) 609-07-05\n' +
        'w.makeev@gmail.com',
      'parse_mode': 'HTML',
      'reply_markup': {
        'inline_keyboard': [
          [
            {
              'text': 'Карточка клиента',
              'url': 'https://somecrm.ru/123'
            }
          ]
        ]
      }
    }
  },
  {
    name: 'case #4',
    actionPayload: {
      phone: '79226090705',
      caller: null
    },
    sendMessagePayload: {
      'chat_id': -56789,
      'text':
        '<b>Не определен</b>\n' +
        '+7 (922) 609-07-05',
      'parse_mode': 'HTML'
    }
  }
]

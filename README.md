onlinepbx-crm-adapter
=====================

Сервис позволяющий интегрировать [расширение](https://chrome.google.com/webstore/detail/onlinepbx/dmkgnplakajhockogacednagkhjebdjn) Google Chrome для онлайн АТС [OnlinePBX](http://www.onlinepbx.ru/) с сервисом [МойСклад](http://www.moysklad.ru/)

## Установка

Установить сервис
```bash
npm install onlinepbx-crm-adapter
```

Установить модуль адаптера для МойСклад
```bash
npm install onlinepbx-moysklad
```

## Запуск

Необходимо установить переменные окружения

```txt
CRM_ADAPTER=onlinepbx-moysklad
MOYSKLAD_LOGIN={Логин МойСклад}
MOYSKLAD_PASSWORD={Пароль МойСклад}
```

Локальный запуск сервиса

```bash
node src/server.js
```

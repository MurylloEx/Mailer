<h1 align="center">@muryllo/mailer</h1>
<p align="center">This is a simple and pragmatic library for sending emails on systems built on Node.js using JavaScript or Typescript.</p>

<p align="center">
  <img src="https://badgen.net/badge/license/MIT/green"/>
  <img src="https://badgen.net/badge/service/SMTP2GO/blue?icon=label">
  <img src="https://badgen.net/badge/author/Muryllo/yellow?icon=label"/>
</p>

You will only need an api key provided by SMTP2GO to use the library.

## Instalation

Run the following command in your project:

```
# if you are using npm
npm i @muryllo/mailer
```

```
# if you are using yarn
yarn add @muryllo/mailer
```

Use this code snippet to send your emails, change it as you like and see fit.

```typescript
const mail: Mailer = Mailer.create()
  .key('<your-api-key>')
  .subject('Teste de Email!')
  .from('Teste', 'test@muryllo.com.br')
  .to('Muryllo Pimenta', 'muryllo.pimenta@upe.br')
  .htmlBody('<h1>Welcome dear ${{ username }}</h1>')
  .set('username', 'Muryllo');

const result: MailerResponse = await mail.send();

console.log(result.success());
```

## Metadata

Muryllo Pimenta de Oliveira – muryllo.pimenta@upe.br

Released under the MIT license. See ``LICENSE`` for more information.

## Contributing

1. Fork it (<https://github.com/MurylloEx/Mailer/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request


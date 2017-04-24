'use strict'

/**
 * adonis-asterisk-ami
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
*/

const fold = require('adonis-fold')
const Ace = require('adonis-ace')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../../.env') })
const Env = process.env

const Config = {
  get (key) {
    return this[key]
  },

  get ami () {
    return {
      host: Env.AMI_HOST,
      port: Env.AMI_PORT,
      username: Env.AMI_USERNAME,
      secret: Env.AMI_SECRET,
      dongle: {
        sms: {
          device: Env.AMI_DEVICE
        }
      }
    }
  }
}

module.exports = () => {
  fold.Ioc.bind('Adonis/Src/Helpers', function () {
    return {}
  })
  fold.Ioc.bind('Adonis/Src/Config', function () {
    return Config
  })
  fold.Registrar
    .register([
      'adonis-ace/providers/CommandProvider',
      'adonis-framework/providers/EventProvider',
      path.join(__dirname, '../../providers/AsteriskAmiProvider')
    ])
    .then(() => {
      Ace.register([
        'Adonis/Commands/Ami:Listen',
        'Adonis/Commands/Ami:Action',
        'Adonis/Commands/Ami:Dongle:Sms',
        'Adonis/Commands/Ami:Dongle:Ussd'
      ])
      Ace.invoke(require(path.join(__dirname, '../../package.json')))
    })
    .catch((error) => console.error(error.stack))
}

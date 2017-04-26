'use strict'

/**
 * adonis-asterisk-ami
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const ServiceProvider = require('adonis-fold').ServiceProvider
const AmiClient = require('asterisk-ami-client')
const _ = require('lodash')

class AsteriskAmiProvider extends ServiceProvider {
  * register () {
    this.app.singleton('Adonis/AsteriskAmi/Client', function (app) {
      const Config = app.use('Adonis/Src/Config')
      const config = _.pick(Config.get('ami'), [
        'reconnect',
        'maxAttemptsCount',
        'attemptsDelay',
        'keepAlive',
        'keepAliveDelay',
        'emitEventsByTypes',
        'eventTypeToLowerCase',
        'emitResponsesById',
        'addTime',
        'eventFilter'
      ])
      return new AmiClient(config)
    })
    this.app.bind('Adonis/Commands/Ami:Action', (app) => {
      const Config = app.use('Adonis/Src/Config')
      const config = _.pick(Config.get('ami'), [
        'host',
        'port',
        'username',
        'secret'
      ])
      const AmiAction = require('../src/Commands/AmiAction')
      return new AmiAction(config, app.use('Adonis/AsteriskAmi/Client'))
    })
    this.app.bind('Adonis/Commands/Ami:Listen', (app) => {
      const Config = app.use('Adonis/Src/Config')
      const config = _.pick(Config.get('ami'), [
        'host',
        'port',
        'username',
        'secret'
      ])
      const AmiListen = require('../src/Commands/AmiListen')
      return new AmiListen(config, app.use('Adonis/AsteriskAmi/Client'), app.use('Adonis/Src/Event'))
    })
    this.app.bind('Adonis/Commands/Ami:Dongle:Sms', (app) => {
      const Config = app.use('Adonis/Src/Config')
      const config = _.pick(Config.get('ami'), [
        'host',
        'port',
        'username',
        'secret',
        'dongle'
      ])
      const AmiDongleSms = require('../src/Commands/AmiDongleSms')
      return new AmiDongleSms(config, app.use('Adonis/AsteriskAmi/Client'))
    })
    this.app.bind('Adonis/Commands/Ami:Dongle:Ussd', (app) => {
      const Config = app.use('Adonis/Src/Config')
      const config = _.pick(Config.get('ami'), [
        'host',
        'port',
        'username',
        'secret'
      ])
      const AmiDongleUssd = require('../src/Commands/AmiDongleUssd')
      return new AmiDongleUssd(config, app.use('Adonis/AsteriskAmi/Client'))
    })
  }
}

module.exports = AsteriskAmiProvider

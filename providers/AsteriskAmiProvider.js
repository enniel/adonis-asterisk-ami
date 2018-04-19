'use strict'

/**
 * adonis-asterisk-ami
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const { ServiceProvider } = require('@adonisjs/fold')
const AmiClient = require('asterisk-ami-client')
const _ = require('lodash')

class AsteriskAmiProvider extends ServiceProvider {
  register () {
    this.app.bind('Adonis/AsteriskAmi/Client', function (app) {
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
  }
}

module.exports = AsteriskAmiProvider

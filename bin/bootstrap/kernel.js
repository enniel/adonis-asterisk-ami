'use strict'

/**
 * adonis-asterisk-ami
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
*/

const { ioc, registrar, resolver } = require('@adonisjs/fold')
const Ace = require('@adonisjs/ace')
const path = require('path')
const _ = require('lodash')
require('dotenv').config({ path: path.join(__dirname, '../../.env') })

const Config = {
  get (key) {
    return _.get(this, key)
  },

  get ami () {
    return {
      host: process.env.AMI_HOST,
      port: process.env.AMI_PORT,
      username: process.env.AMI_USERNAME,
      secret: process.env.AMI_SECRET,
      dongle: {
        sms: {
          device: process.env.AMI_DEVICE
        }
      }
    }
  },

  merge (key, defaultValues, customizer) {
    const value = this.get(key, {})
    return _.mergeWith(defaultValues, value, customizer)
  }
}

module.exports = async () => {
  try {
    resolver
      .appNamespace('App')
    registrar
      .providers([
        '@adonisjs/framework/providers/AppProvider',
        path.join(__dirname, '../../providers/AsteriskAmiProvider')
      ])
      .register()

    await registrar.boot()
    ioc.bind('Adonis/Src/Config', function () {
      return Config
    })
    Ace.addCommand('Adonis/Commands/Ami:Action')
    Ace.addCommand('Adonis/Commands/Ami:Listen')
    Ace.addCommand('Adonis/Commands/Ami:Dongle:Sms')
    Ace.addCommand('Adonis/Commands/Ami:Dongle:Ussd')
    Ace.wireUpWithCommander()
    Ace.invoke()
  } catch (e) {
    console.error(e)
  }
}

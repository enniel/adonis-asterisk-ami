'use strict'

/**
 * adonis-asterisk-ami
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const ace = require('@adonisjs/ace')
const { ServiceProvider } = require('@adonisjs/fold')

class CommandsProvider extends ServiceProvider {
  register () {
    this.app.bind('Adonis/Commands/Ami:Action', () => require('../src/Commands/AmiAction'))
    this.app.bind('Adonis/Commands/Ami:Listen', () => require('../src/Commands/AmiListen'))
    this.app.bind('Adonis/Commands/Ami:Dongle:Sms', () => require('../src/Commands/AmiDongleSms'))
    this.app.bind('Adonis/Commands/Ami:Dongle:Ussd', () => require('../src/Commands/AmiDongleUssd'))
  }

  boot () {
    ace.addCommand('Adonis/Commands/Ami:Action')
    ace.addCommand('Adonis/Commands/Ami:Listen')
    ace.addCommand('Adonis/Commands/Ami:Dongle:Sms')
    ace.addCommand('Adonis/Commands/Ami:Dongle:Ussd')
  }
}

module.exports = CommandsProvider

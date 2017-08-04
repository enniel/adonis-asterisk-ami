'use strict'

/**
 * adonis-asterisk-ami
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const { Command } = require('@adonisjs/ace')

class Base extends Command {
  static get inject () {
    return [
      'Adonis/Src/Config',
      'Adonis/AsteriskAmi/Client',
      'Adonis/Src/Event'
    ]
  }

  constructor (Config, Client, Emitter) {
    super()
    this.Config = Config
    this.Client = Client
    this.Emitter = Emitter
  }

  async handle (args, { host, port, username, secret }) {
    const config = this.Config.get('ami')
    try {
      host = host || config.host
      port = port || config.port
      await this.Client
        .connect(username || config.username, secret || config.secret, {
          host, port
        })
      this.success(`AMI client is connected to server ${host}:${port}.`)

      this.Emitter.fire('ami.connected', this.Client)
    } catch (e) {
      throw e
    }
  }
}

module.exports = Base

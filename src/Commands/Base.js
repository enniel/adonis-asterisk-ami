'use strict'

/**
 * adonis-asterisk-ami
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const Ioc = require('adonis-fold').Ioc
const Command = Ioc.use('Adonis/Src/Command')

class Base extends Command {
  constructor (config, client, emitter) {
    super()
    this.config = config
    this.client = client
    this.emitter = emitter
  }

  * handle (args, { host, port, username, secret }) {
    const config = this.config
    try {
      host = host || config.host
      port = port || config.port
      yield this.client
        .connect(username || config.username, secret || config.secret, {
          host, port
        })
      this.success(`AMI client is connected to server ${host}:${port}.`)

      this.emitter.fire('ami.connected', this.client)
    } catch (e) {
      throw e
    }
  }
}

module.exports = Base

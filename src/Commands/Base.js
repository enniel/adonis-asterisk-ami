'use strict'

/**
 * adonis-asterisk-ami
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const Ioc = require('adonis-fold').Ioc
const Command = Ioc.use('Adonis/Src/Command')

class Base extends Command {
  constructor (config, client) {
    super()
    this.config = config
    this.client = client
  }

  * handle (args, { host, port, username, secret }) {
    const config = this.config
    yield this.client
      .connect(username || config.username, secret || config.secret, {
        port: port || config.port,
        host: host || config.host
      })

    this.success(`AMI client is connected to server.`)
  }
}

module.exports = Base

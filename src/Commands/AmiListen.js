'use strict'

/**
 * adonis-asterisk-ami
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const Base = require('./Base')

class AmiListen extends Base {
  static get commandName () {
    return 'ami:listen'
  }

  /**
   * signature defines the requirements and name
   * of command.
   *
   * @return {String}
   */
  static get signature () {
    return `ami:listen {--debug?} {--host?} {--port?} {--username?} {--secret?}`
  }

  /**
   * description is the little helpful information displayed
   * on the console.
   *
   * @return {String}
   */
  static get description () {
    return 'Listen Asterisk AMI events.'
  }

  /**
   * handle method is invoked automatically by ace, once your
   * command has been executed.
   *
   * @param  {Object} args    [description]
   * @param  {Object} options [description]
   */
  async handle (args, options) {
    await super.handle(args, options)

    this.Client
      .on('disconnect', () => {
        this.error(`AMI client is disconnected.`)
      })
      .on('reconnection', () => {
        this.info(`Reconnection AMI client.`)
      })
      .on('internalError', e => {
        this.error(e)
      })

    this.Client
      .on('event', event => {
        if (options.debug) {
          this.table(['key', 'value'], event)
        }
        this.Emitter.fire('ami.events.*', event)
        this.Emitter.fire(`ami.events.${event.Event}`, event)
      })
  }
}

module.exports = AmiListen

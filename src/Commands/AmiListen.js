'use strict'

/**
 * adonis-asterisk-ami
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const Base = require('./Base')

class AmiListen extends Base {
  /**
   * signature defines the requirements and name
   * of command.
   *
   * @return {String}
   */
  get signature () {
    return `ami:listen {--debug?} {--host?} {--port?} {--username?} {--secret?}`
  }

  /**
   * description is the little helpful information displayed
   * on the console.
   *
   * @return {String}
   */
  get description () {
    return 'Listen Asterisk AMI events.'
  }

  /**
   * handle method is invoked automatically by ace, once your
   * command has been executed.
   *
   * @param  {Object} args    [description]
   * @param  {Object} options [description]
   */
  * handle (args, options) {
    yield super.handle(args, options)

    this.client
      .on('disconnect', () => {
        this.error(`AMI client is disconnected.`)
      })
      .on('reconnection', () => {
        this.info(`Reconnection AMI client.`)
      })
      .on('internalError', e => {
        this.error(e)
      })

    this.client
      .on('event', event => {
        if (options.debug) {
          this.table(['key', 'value'], event)
        }
        this.emitter.fire(`ami.events.${event.Event}`, event)
      })
  }
}

module.exports = AmiListen

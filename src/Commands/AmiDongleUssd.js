'use strict'

/**
 * adonis-asterisk-ami
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const Base = require('./Base')

class AmiDongleUssd extends Base {
  static get commandName () {
    return 'ami:dongle:ussd'
  }

  /**
   * signature defines the requirements and name
   * of command.
   *
   * @return {String}
   */
  static get signature () {
    return `ami:dongle:ussd {ussd} {device?} {--id=@value} {--host?} {--port?} {--username?} {--secret?}`
  }

  /**
   * description is the little helpful information displayed
   * on the console.
   *
   * @return {String}
   */
  static get description () {
    return 'Send USSD command using chan dongle.'
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

    let {
      ussd, device
    } = args

    const {
      id
    } = options

    const props = {
      Action: 'DongleSendUSSD',
      Device: device,
      USSD: ussd
    }
    if (id) {
      props.ActionID = id
    }
    const response = await this.Client.action(props, true)
    this.Emitter.fire('ami.dongle.ussd.sended', response)
    this.table(['key', 'value'], response)

    this.Client.disconnect()
  }
}

module.exports = AmiDongleUssd

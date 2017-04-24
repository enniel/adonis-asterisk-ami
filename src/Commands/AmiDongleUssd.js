'use strict'

/**
 * adonis-asterisk-ami
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const Base = require('./Base')

class AmiDongleUssd extends Base {

  /**
   * signature defines the requirements and name
   * of command.
   *
   * @return {String}
   */
  get signature () {
    return `ami:dongle:ussd {ussd} {device?} {--id=@value} {--host?} {--port?} {--username?} {--secret?}`
  }

  /**
   * description is the little helpful information displayed
   * on the console.
   *
   * @return {String}
   */
  get description () {
    return 'Send USSD command using chan dongle.'
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
    const response = yield this.client.action(props, true)
    this.table(['key', 'value'], response)

    this.client.disconnect()
  }
}

module.exports = AmiDongleUssd

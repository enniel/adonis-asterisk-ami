'use strict'

/**
 * adonis-asterisk-ami
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const _ = require('lodash')
const Base = require('./Base')
const pdu = require('node-pdu')

class AmiDongleSms extends Base {
  static get commandName () {
    return 'ami:dongle:sms'
  }

  /**
   * signature defines the requirements and name
   * of command.
   *
   * @return {String}
   */
  static get signature () {
    return `ami:dongle:sms {number} {message} {device?} {--id=@value} {--pdu?} {--debug?} {--host?} {--port?} {--username?} {--secret?}`
  }

  /**
   * description is the little helpful information displayed
   * on the console.
   *
   * @return {String}
   */
  static get description () {
    return 'Send SMS messages using chan dongle.'
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
      number, message, device
    } = args

    const {
      pdu, id, debug
    } = options

    device = device || this.Config.get('ami.dongle.sms.device')

    if (pdu) {
      const responses = await this.pdu(number, message, device, id)
      if (debug) {
        _.each(responses, (response) => {
          this.table(['key', 'value'], response)
        })
      }
      this.Client.disconnect()
      return responses
    }

    const props = {
      Action: 'DongleSendSms',
      Device: device,
      Number: number,
      Message: message
    }
    if (id) {
      props.ActionID = id
    }
    const response = await this.Client.action(props, true)
    this.Emitter.fire('ami.dongle.sms.sended', response)
    if (debug) {
      this.table(['key', 'value'], response)
    }
    this.Client.disconnect()
    return response
  }

  async pdu (number, message, device, id) {
    const submit = pdu.Submit()
    submit.setAddress(number)
    submit.setData(message)
    const parts = submit.getParts()
    const responses = []
    for (let key in parts) {
      const part = parts[key]
      const props = {
        Action: 'DongleSendPdu',
        Device: device,
        Pdu: part
      }
      if (id) {
        props.ActionID = id
      }
      const response = await this.Client.action(props, true)
      this.Emitter.fire(`ami.dongle.sms.sended`, response)
      responses.push(response)
    }
    return responses
  }
}

module.exports = AmiDongleSms

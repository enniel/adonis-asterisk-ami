'use strict'

/**
 * adonis-asterisk-ami
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const _ = require('lodash')
const Base = require('./Base')
const pdu = require('node-pdu')
const each = require('co-eachseries')

class AmiDongleSms extends Base {

  /**
   * signature defines the requirements and name
   * of command.
   *
   * @return {String}
   */
  get signature () {
    return `ami:dongle:sms {number} {message} {device?} {--id=@value} {--pdu?} {--host?} {--port?} {--username?} {--secret?}`
  }

  /**
   * description is the little helpful information displayed
   * on the console.
   *
   * @return {String}
   */
  get description () {
    return 'Send SMS messages using chan dongle.'
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
      number, message, device
    } = args

    const {
      pdu, id
    } = options

    device = device || _.get(this.config, 'dongle.sms.device')

    if (pdu) {
      const responses = yield this.pdu(number, message, device, id)
      _.each(responses, (response) => {
        this.table(['key', 'value'], response)
      })
    } else {
      const props = {
        Action: 'DongleSendSms',
        Device: device,
        Number: number,
        Message: message
      }
      if (id) {
        props.ActionID = id
      }
      const response = yield this.client.action(props, true)
      this.table(['key', 'value'], response)
    }

    this.client.disconnect()
  }

  * pdu (number, message, device, id) {
    const submit = pdu.Submit()
    submit.setAddress(number)
    submit.setData(message)
    const parts = submit.getParts()
    const responses = []
    const _this = this
    yield each(parts, function * (part) {
      const props = {
        Action: 'DongleSendPdu',
        Device: device,
        Pdu: part
      }
      if (id) {
        props.ActionID = id
      }
      const response = yield _this.client.action(props, true)
      responses.push(response)
    })
    return responses
  }
}

module.exports = AmiDongleSms

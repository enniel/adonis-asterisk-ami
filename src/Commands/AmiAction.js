'use strict'

/**
 * adonis-asterisk-ami
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const _ = require('lodash')
const Base = require('./Base')

class AmiAction extends Base {

  /**
   * signature defines the requirements and name
   * of command.
   *
   * @return {String}
   */
  get signature () {
    return `ami:action {action} {--props=@value} {--id=@value} {--host?} {--port?} {--username?} {--secret?}`
  }

  /**
   * description is the little helpful information displayed
   * on the console.
   *
   * @return {String}
   */
  get description () {
    return 'Handle Asterisk AMI actions.'
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
      props, id
    } = options

    if (props) {
      props = _.split(props, ',')
      props = _.reduce(props, (result, value) => {
        const [ k, v ] = _.split(value, ':', 2)
        result[k] = v
        return result
      }, {})
    }
    props = props || {}
    props.Action = args.action
    if (id) {
      props.ActionID = id
    }

    const response = yield this.client.action(props, true)

    this.table(['key', 'value'], response)

    this.client.disconnect()
  }
}

module.exports = AmiAction

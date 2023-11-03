export function checkDecimal(rule, value, callback) {
  if (value) {
    value += ''
    var negative = rule.isNegative ? rule.isNegative : false
    var maxValue = rule.maxValue ? rule.maxValue : 10000000
    var minValue = 0
    var decimal = rule.decimal ? rule.decimal : 7
    if (rule.decimal === 0) {
      decimal = 0
    }
    var re = null
    if (negative) {
      minValue = '-' + maxValue
      // eslint-disable-next-line no-eval
      re = eval('/^(\\-)?(0|[1-9][0-9]*)(\\.\\d{0,' + decimal + '})?$/')
    } else {
      // eslint-disable-next-line no-eval
      re = eval('/^(([1-9]{1}\\d*)|(0{1}))(\\.\\d{0,' + decimal + '})?$/')
    }
    if (isNaN(value)) {
      callback(new Error('请输入数字'))
    } else {
      if (value.match(re)) {
        var num = parseFloat(value)
        if (negative) {
          if (num > minValue && num < maxValue) {
            callback()
          } else { callback(new Error('超出有效输入范围')) }
        } else {
          if (num >= minValue && num < maxValue) {
            callback()
          } else { callback(new Error('超出有效输入范围')) }
        }
      } else {
        callback(new Error('输入有误'))
      }
    }
  } else { callback() }
}

/**
 * 验证经度输入范围在-180-180之间，且小数可7位
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 *
 * 经度longitude
 */
export function checkLon(rule, value, callback) {
  if (value) {
    value += ''
    if (value.match(/^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,7})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/)) {
      callback()
    } else {
      callback(new Error('经度为-180~180,小数限7位!'))
    }
  } else {
    callback()
  }
}
/**
 * 验证纬度输入范围在-180-180之间，且小数可7位
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 *
 * 纬度latitude
 */
export function checkLat(rule, value, callback) {
  if (value) {
    value += ''
    if (value.match(/^(\-|\+)?([0-8]?\d{1}\.\d{0,8}|90\.0{0,6}|[0-8]?\d{1}|90)$/)) {
      callback()
    } else {
      callback(new Error('纬度为-90~90,小数限7位'))
    }
  } else {
    callback()
  }
}


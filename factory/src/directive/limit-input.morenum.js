// limit-input-number.js

/**
 * <!--默认允许0到2位小数-->
 * <el-input
 *  data-dotrange="{0,2}"
 *  v-model.trim="num"
 *  v-limit-input-number="num"
 * />
 */

// 设置组件中的指定属性的值
const setValue = function(exp, value, context) {
  value = isNaN(value) ? '' : value
  console.log(exp)
  new Function('context', 'value', `context.${exp} = value`)(context, value)
}

// 自定义指令
export default {
  bind(el, { expression }, { context }) {
    const inputEl = Array.from(el.children).filter((child) => {
      return child.localName === 'input'
    })[0]

    // 初始化lastValue
    inputEl.lastValue = inputEl.value

    const hasDot = !!inputEl.dataset.dotrange
    const dotRange = inputEl.dataset.dotrange || `{0,2}` // 默认小数点位数
    const pattern = `^[0-9]+${hasDot ? `(\\.[0-9]${dotRange})?` : ''}$`
    const curExpression = inputEl.dataset.expression || expression

    if (!curExpression) {
      throw new TypeError('请绑定expression')
    }

    inputEl.handleInputEvent = function(e) {
      setTimeout(() => {
        // 如果不匹配重置为上次的值
        if (e.target.value !== '' && !new RegExp(pattern).test(e.target.value)) {
          setValue(curExpression, parseFloat(e.target.lastValue), context)
          e.target.value = e.target.lastValue
        }

        e.target.lastValue = e.target.value
      }, 0)
    }
    inputEl.addEventListener('input', inputEl.handleInputEvent, false)
  },
  unbind(el) {
    const inputEl = Array.from(el.children).filter((child) => {
      return child.localName === 'input'
    })[0]

    inputEl && inputEl.removeEventListener('input', inputEl.handleInputEvent, false)
  }
}

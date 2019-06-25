// tirm.js

/**
 * <!--去掉输入中的所有空格 ->
 * <el-input
 *  v-model.trim="num"
 *  v-trim="num"
 * />
 */

// 设置组件中的指定属性的值
const setValue = function(exp, value, context) {
  new Function('context', 'value', `context.${exp} = value`)(context, value)
}

// 自定义指令
export default {
  bind(el, { expression }, { context }) {
    let inputEl = Array.from(el.children).filter(child => {
      return child.localName === 'input'
    })[0]

    const textareaEl = Array.from(el.children).filter(child => {
      return child.localName === 'textarea'
    })[0]

    inputEl = inputEl || textareaEl
    if (!expression) {
      throw new TypeError('请绑定expression')
    }

    inputEl.handleInputEvent = function(e) {
      setTimeout(() => {
        const newValue = e.target.value.replace(/\s/g, '')
        setValue(expression, newValue, context)
      }, 0)
    }
    inputEl.addEventListener('input', inputEl.handleInputEvent, false)
  },
  unbind(el) {
    const inputEl = Array.from(el.children).filter(child => {
      return child.localName === 'input'
    })[0]

    inputEl && inputEl.removeEventListener('input', inputEl.handleInputEvent, false)
  }
}


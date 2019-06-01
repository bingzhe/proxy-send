/**
 * 页面加载的时候，该元素获得焦点
 */
export default {
  inserted: function(el) {
    const inputEl = Array.from(el.children).filter(child => {
      return child.localName === 'input'
    })[0]

    inputEl.focus()
  }
}

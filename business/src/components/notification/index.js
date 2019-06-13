import Vue from 'vue'
import Main from './main.vue'

const NotificationConstructor = Vue.extend(Main)

let instance

const Notification = function(options) {
  if (Vue.prototype.$isServer) return
  options = options || {}

  instance = new NotificationConstructor({
    data: options
  })

  instance.vm = instance.$mount()
  document.body.appendChild(instance.vm.$el)
  instance.vm.visible = true

  return instance.vm
}

export default Notification


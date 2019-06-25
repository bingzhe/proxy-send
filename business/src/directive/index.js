import Vue from 'vue'
import limitInputNumber from './limit-input-number'
import focus from './focus'
import trim from './trim'

Vue.directive('limit-input-number', limitInputNumber)
Vue.directive('focus', focus)
Vue.directive('trim', trim)


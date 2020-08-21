import Vue from 'vue'
import limitInputNumber from './limit-input-number'
import limitInputMorenum from './limit-input.morenum'
import focus from './focus'

Vue.directive('limit-input-number', limitInputNumber)
Vue.directive('limit-input-morenum', limitInputMorenum)
Vue.directive('focus', focus)

import Vue from 'vue'
import Router from 'vue-router'
import DatapackageCreator from '@/components/DatapackageCreator'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'DatapackageCreator',
      component: DatapackageCreator
    }
  ]
})

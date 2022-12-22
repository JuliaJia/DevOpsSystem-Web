import Vue from 'vue'
import { Form, FormItem, Input, Button, RadioButton, Message } from 'element-ui'

Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)
Vue.use(Button)
Vue.use(RadioButton)
Vue.use(Message)

Vue.prototype.$message = Message

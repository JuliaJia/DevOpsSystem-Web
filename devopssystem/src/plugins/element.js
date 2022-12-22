import Vue from 'vue'
import { Form, FormItem, Input, Button, RadioButton, Message, Container, Header, Aside, Footer, Main, Menu, MenuItem, Submenu } from 'element-ui'

Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)
Vue.use(Button)
Vue.use(RadioButton)
Vue.component(Message.name, Message)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Footer)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)

Vue.prototype.$message = Message

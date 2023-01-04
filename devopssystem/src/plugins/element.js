import Vue from 'vue'
import {
  Form, FormItem, Input, Button,
  RadioButton, Message, Container,
  Header, Aside, Footer, Main, Menu, MenuItem, Submenu,
  Breadcrumb, BreadcrumbItem, Card, Row, Col, Table,
  TableColumn, Dialog, Pagination, Switch, MessageBox, Tooltip,
  DropdownMenu, DropdownItem, Dropdown, Tree
} from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'

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
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Switch)
Vue.component(MessageBox.name, MessageBox)
Vue.use(Tooltip)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Dropdown)
Vue.use(Tree)

Vue.prototype.$message = Message
Vue.prototype.$msgbox = MessageBox

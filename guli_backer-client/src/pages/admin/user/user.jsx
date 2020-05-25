import React,{Component} from 'react'
import UserForm from './user-form'
import {Card, Modal, message, Button, Table} from "antd";
import LinkButton from '../../../components/LinkButton/LinkButton'
import {reqUserAddOrUpdate, reqUserDel, reqUsers} from "../../../api";
import {formatDate} from '../../../utils/dateUtils'
import {PAGE_SIZE} from '../../../config/constants/constants'

export default class User extends Component{

  state = {
    isShow:false,
    users:[],
    roles:[]
  }

  initColumn = () => {
    this.column = [
      {
        title:'用户名',
        dataIndex:'username'
      },
      {
        title:'邮箱',
        dataIndex:'email'
      },
      {
        title:'电话',
        dataIndex:'phone'
      },
      {
        title:'注册时间',
        dataIndex:'create_time',
        render:formatDate
      },
      /*{
        title:'所属角色',
        // dataIndex:'role_id',
        render:role_id => this.roleNames[role_id]
      },*/
      {
        title:'操作',
        render:user => (
          <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            &nbsp;&nbsp;
            <LinkButton onClick={() => this.clickeDelete(user)}>删除</LinkButton>
          </span>
        )
      },
    ]
  }
  initRoleNames = (roles) => {
    this.roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    },{})
  }
  getUsers = async () => {
    const result = await reqUsers()
    if(result.status === 0){
      const {users,roles} = result.data
      this.initRoleNames(roles)
      this.setState({users,roles})
    }
  }
  showUpdate = (user) => {
    this.user = user
    this.setState({isShow:true})
  }
  showAddUser = () => {
    this.user = null
    this.setState({isShow:true})
  }
  clickeDelete = (user) => {
    Modal.confirm({
      content:'really del user ?',
      onOk: async () => {
        const result = await reqUserDel(user._id)
        if(result.status === 0){
          this.getUsers()
        }
      }
    })
  }
  addOrUpdate = async () => {
    const user = this.form.getFieldsValue()
    this.form.resetFields()
    if (this.user){
      user._id = this.user._id
    }
    this.setState({isShow:false})
    const result = await reqUserAddOrUpdate(user)
    if(result.status === 0){
      this.getUsers()
    }
  }
  componentWillMount() {
    this.initColumn()
  }

  componentDidMount() {
    this.getUsers()
  }


  render() {
    const {isShow, users, roles} = this.state
    const title = <Button type='primary' onClick={this.showAddUser}>创建用户</Button>
    const {column} = this
    const user = this.user || {}
    console.log(users)
    return (
      <Card title={title}>
        <Table
          columns={column}
          rowKey='_id'
          dataSource={users}
          bordered
          pagination={{defaultPageSize:PAGE_SIZE,showQuickJumper:true}}
        ></Table>
        <Modal
          title={user._id?'修改用户':'添加用户'}
          visible={isShow}
          onCancel={() => this.setState({isShow:false})}
          onOk={this.addOrUpdate}
        >
          <UserForm setForm={form => this.form = form} user={user} roles={roles}></UserForm>
        </Modal>
      </Card>
    )
  }
}

import React,{Component} from 'react'
import {Card, Table, Button, Modal, message} from "antd";
import {reqRoleAdd, reqRoles, reqRoleUpdate} from "../../../api";
import AddForm from './add-form'
import AuthForm2 from './auth-form'
import memoryUtils from '../../../utils/memoryUtils'
import {formatDate} from '../../../utils/dateUtils'
import {PAGE_SIZE} from '../../../config/constants/constants'

export default class Role extends Component{

  state = {
    role:{},
    roles:[],
    showAdd:false,
    showAuth:false
  }

  constructor (props) {
    super(props)

    this.auth = React.createRef()
  }

  initColumn = () => {
    this.column = [
      {
        title:"角色名称",
        dataIndex:'name'
      },
      {
        title:"创建时间",
        dataIndex:'create_time',
        render:create_time => formatDate(create_time)
      },
      {
        title:"授权时间",
        dataIndex:'auth_time',
        render:formatDate
      },
      {
        title:"授权人",
        dataIndex:'auth_name'
      },
    ]
  }
  getRoles = async () => {
    const result = await reqRoles()
    if (result.status === 0){
      this.setState({
        roles:result.data
      })
    }
  }
  onRow = (role) => {
    return {
      onClick: event => {
        this.setState({role})
      }
    }
  }
  addRole = () => {
    this.form.validateFields(async (error, values) => {
      if(!error){
        this.setState({showAdd:false})
        const {roleName} = values
        this.form.resetFields()

        const result = await reqRoleAdd(roleName)
        if (result.status === 0){
          message.success('role add success')

          // this.getRoles()
          const role = result.data
          this.setState({
            roles:[...this.state.roles,role]
          })
        }else{
          message.error('role add failed')
        }
      }
    })
  }

  updateRole = async () => {
    this.setState({showAuth:false})
    const role = this.state.role
    console.log(this.auth.current)
    const menus =  this.auth.current.getMenus()
    role.menus = menus
    role.auth_time = formatDate(Date.now())
    role.auth_name = memoryUtils.user.username
    const result = await reqRoleUpdate(role)
    if(result.status === 0){
      message.success('update role success')
      this.setState({
        roles:[...this.state.roles]
      })
    }
  }
  componentWillMount() {
    this.initColumn()
  }
  componentDidMount() {
    this.getRoles()
  }

  render() {
    const {role, roles, showAdd, showAuth} = this.state
    const title = (
      <span>
        <Button type='primary' onClick={() => this.setState({showAdd:true})}>创建角色</Button>&nbsp;&nbsp;&nbsp;
        <Button type='primary' disabled={!role._id}
                onClick={() => this.setState({showAuth:true})}
        >设置角色权限</Button>
      </span>
    )
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          columns={this.column}
          pagination={{defaultPageSize:PAGE_SIZE}}
          rowSelection={{type:'radio', selectedRowKeys:[role._id]}}
          onRow={this.onRow}
          dataSource={roles}
        ></Table>
        <Modal
          title='添加角色'
          onOk={this.addRole}
          onCancel={() => {
            this.setState({showAdd:false})
            this.form.resetFields()
          }}
          visible={showAdd}
        >
          <AddForm setForm={form => this.form = form}></AddForm>
        </Modal>
        <Modal
          title=" 设置角色权限"
          visible={showAuth}
          onOk={this.updateRole}
          onCancel={() => {
            this.setState({showAuth: false})
          }}
        >
          <AuthForm2 ref={this.auth} role={role}></AuthForm2>
        </Modal>
      </Card>
    )
  }
}

import React,{Component} from 'react'
import PropTypes from "prop-types";
import {Form, Input, Select} from "antd";

const Item = Form.Item
const Option = Select.Option

class UserForm extends Component{

  static propTypes = {
    setForm: PropTypes.func.isRequired,
    user:PropTypes.object,
    roles:PropTypes.array
  }

  componentDidMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const {user, roles} = this.props
    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol:{span:4},
      wrapperCol:{span:16}
    }

    return (
      <Form {...formItemLayout}>
        <Item label='用户名：'>
          {
            getFieldDecorator('username', {
              initialValue:user.username
            })(
              <Input placeholder='input username' type='text'/>
            )
          }
        </Item>
        {
          !user._id?
            (
              <Item label='密码：'>
                {
                  getFieldDecorator('password', {
                    initialValue:''
                  })(
                    <Input placeholder='input password' type='password'/>
                  )
                }
              </Item>
            ):null
        }
        <Item label=" 手机号：">
          {
            getFieldDecorator('phone', {
              initialValue: user.phone
            })(
              <Input type="phone" placeholder=" input tel"/>
            )
          }
        </Item>
        <Item label=" 邮箱：">
          {
            getFieldDecorator('email', {
              initialValue: user.email
            })(
              <Input type="email" placeholder=" input email"/>
            )
          }
        </Item>
        <Item label=" 角色：">
          {
            getFieldDecorator('role', {
              initialValue: user.role_id
            })(
              <Select>
                {
                  roles.map(role => (
                    <Option key={role._id} value={role._id}>{role.name}</Option>
                  ))
                }
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(UserForm)

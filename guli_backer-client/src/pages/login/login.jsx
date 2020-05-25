import React,{Component} from 'react'
import Logo from '../../assets/images/logo.png'
import {Form, Input, Button, Icon, message } from 'antd';
import {Redirect} from 'react-router-dom'
import {reqLogin} from "../../api";
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import './login.less'

class Login extends Component{

  state = {
    username:'',
    password:''
  }

  login = (e) => {
    e.preventDefault()

    this.props.form.validateFields(async (err,vals) => {
      if(!err){
        const {username,password} = vals
        const result = await reqLogin(username,password)
        if(result.status === 0){
          message.success('login success',2)
          memoryUtils.user = result.data
          storageUtils.saveUser(result.data)
          this.props.history.replace('/')
        }else{
          message.error(result.msg)
        }
        console.log('login 。。。',result)
      }else{
        console.log(err)
      }
    })
  }

  validator = (rule, val, callBack) => {

    const length = val && val.length
    const pwdReg =  /^[a-zA-Z0-9_]+$/
    if(!val){
      callBack('pwd si neccessary')
    }else if(length < 4){
      callBack('length of pwd >= 4')
    }else if(length > 12){
      callBack('length of pwd <= 12')
    }else if(!pwdReg.test(val)){
      callBack('pwd have to be consist of a-zA-Z0-9 or _')
    }else{
      callBack()
    }
  }

  render() {

    if(storageUtils.getUser() && storageUtils.getUser()._id){
      return <Redirect to='/'></Redirect>
    }

    const {getFieldDecorator} = this.props.form

    return (
      <div className="login">
        <h1 className="login-header">
          <img src={Logo} alt="logo" className="login-logo"/>
          <span className="login-text">React项目: 后台管理系统</span>
        </h1>
        <div className="login-main">
          <h2 className="login-main-header">用户登录</h2>
          <Form name="normal_login" className="login-form" onSubmit={this.login}>
            <Form.Item>
              {
                getFieldDecorator('username',{
                  rules:[
                    {isRequired:true,whiteSpace:true,message:'username is neccessary'},
                    {min:4,message:'length > 4'},
                    {max:12,message:'length < 12'},
                    {pattern:/^[a-zA-Z0-9_]+$/,message:'consisted of a-zA-Z0-9_'}
                  ],
                  initialValue:'admin'
                })(
                  <Input
                    prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}} />}
                    placeholder="用户名" />
                )
              }
            </Form.Item>
            <Form.Item>
              {
                getFieldDecorator('password',{
                  rules:[
                    {validator : this.validator}
                  ]
                })(
                  <Input
                    type="password"
                    placeholder="密码"
                    prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}} />}
                  />
                )
              }
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button login-main-button">
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}
export default Form.create()(Login)

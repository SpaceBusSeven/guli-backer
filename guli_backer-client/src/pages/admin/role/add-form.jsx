import React,{Component} from 'react'
import {Form, Input} from "antd";
import PropTypes from 'prop-types'

class AddForm extends Component{

  static propTypes = {
    setForm: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const {getFieldDecorator} = this.props.form

    return (
      <Form>
        <Form.Item label='角色名称：' labelCol={{span:5}} wrapperCol={{span:16}}>
          {
            getFieldDecorator('roleName', {
              initialValue:''
            })(
              <Input placeholder='input role name'/>
            )
          }
        </Form.Item>

      </Form>
    )
  }
}

export default Form.create()(AddForm)

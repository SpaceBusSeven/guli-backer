import React,{Component} from 'react'
import {Form, Input} from 'antd'
import PropTypes from 'prop-types'

const  Item = Form.Item

class UpdateForm extends Component{

  static propTypes = {
    categoryName:PropTypes.string,
    setForm: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const {categoryName} = this.props

    return (
      <Form>
        <Item>
          {
            getFieldDecorator('categoryName', {
              initialValue: categoryName
            })(
              <Input placeholder='input new name'/>
            )
          }
        </Item>
      </Form>
    )
  }
}
export default Form.create()(UpdateForm)

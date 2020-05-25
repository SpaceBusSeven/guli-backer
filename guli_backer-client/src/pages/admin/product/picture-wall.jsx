import React,{Component} from 'react'
import { Upload, message, Icon, Modal } from 'antd';
import PropTypes from 'prop-types'
import {BASE_IMG_PATH} from "../../../config/constants/constants";
import {reqDelImg} from "../../../api";

export default class PictureWall extends Component {
  static propTypes = {
    imgs:PropTypes.array
  }

  constructor(props){
    super(props)
    let fileList = []
    const imgs = this.props.imgs
    if (imgs && imgs.length > 0){
      fileList = imgs.map((img, index) => ({
        uid: -index,
        name: img,
        status: 'done',
        url: BASE_IMG_PATH + img
      }))
    }
    this.state = {
      previewVisible:false,
      previewImage:'',
      fileList
    }
  }

  getImgs = () => this.state.fileList.map(file => file.name)
  handleCancel = () => this.setState({previewVisible:false})
  handlePreview = (file) => {
    this.setState({
      previewVisible:true,
      previewImage:file.url || file.thumbUrl,
    })
  }

  handleChange = async ({file, fileList}) => {

    if (file.status === 'done'){
      const result = file.response
      if(result.status === 0){
        message.success('upload pic success')
        const {url, name} = result.data
        file = fileList[fileList.length - 1]
        file.name = name
        file.url = url
      }else {
        message.error('upload pic failed')
      }
    }else if(file.status === 'remove'){
      const result = await reqDelImg(file.name)
      if(result.status === 0){
        message.success('del pic success')
      }else {
        message.error('del failed')
      }
    }

    this.setState({fileList})
  };

  render() {
    const {previewVisible, previewImage, fileList} = this.state
    const uploadButton = (
      <div>
        <Icon type='plus'></Icon>
        <div>上传图片</div>
      </div>
    )
    return (
      <div>
        <Upload
          action="/manage/img/upload"
          accept="image/*" //只匹配文件里面的图片
          name="image"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img src={previewImage} alt="example" style={{width: '100%'}}/>
        </Modal>
      </div>
    );
  }
}

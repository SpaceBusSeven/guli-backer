import ajax from './ajax'
import jsonp from 'jsonp'

export const reqLogin = (username,password) => ajax('/login',{username,password}, 'POST')

export const reqCategorys = (parentId) => ajax('/manage/category/list',{parentId})
export const reqAddCategory = (parentId, categoryName) =>
  ajax('/manage/category/add', {parentId, categoryName}, 'POST')
export const reqUpdateCategory = (categoryId, categoryName) =>
  ajax('/manage/category/update', {categoryId, categoryName}, 'POST')

export const reqCategoryInfo = (categoryId) => ajax('/manage/category/info',{categoryId})
export const reqProductList = (pageNum, pageSize) => ajax('/manage/product/list', {pageNum, pageSize})
export const reqSearchProduct = ({pageNum, pageSize, searchType, searchName}) =>
  ajax('/manage/product/search', {pageNum, pageSize, [searchType]:searchName})
export const reqProductAddOrUpdate = (product) =>
  ajax('/manage/product/'+(product._id?'update':'add'),product,'POST')
export const reqUpdateProductStatus = (productId, status) =>
  ajax('/manage/product/updateStatus', {productId, status}, 'POST')
export const reqDelImg = (name) => ajax('/manage/img/delete',{name}, 'POST')

export const reqRoleAdd = (roleName) => ajax('/manage/role/add',{roleName},'POST')
export const reqRoles = () => ajax('/manage/role/list')
export const reqRoleUpdate = (role) => ajax('/manage/role/update',role,'POST')

export const reqUserAddOrUpdate = (user) => ajax('/manage/user/'+(user._id?'update':'add'), user,'POST')
export const reqUsers = () => ajax('/manage/user/list')
export const reqUserDel = (userId) => ajax('/manage/user/delete',{userId},'POST')

export const reqWeather = (city) => {
  const url =
    `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`

  return new Promise((resolve, reject) => {
    jsonp(url, {}, (err, response) => {
      if(!err && response.status == 'success'){
        const {dayPictureUrl, weather} = response.results[0].weather_data[0]
        resolve({dayPictureUrl, weather})
      } else {
        alert('获取天气信息失败')
      }
    })
  })
}

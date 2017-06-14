
let format = (value) => {
  return value >= 10 ? value : '0' + value
}

/**
 * 时间格式化
 */
export let dateFilter = (time, type) => {
  let date = new Date(time * 1000)
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let second = date.getSeconds()
  let result
  switch (type) {
    case 0: // 01-05
      result = `${format(month)}-${format(day)}`
      break
    case 1: // 11:12
      result = `${format(hours)}-${format(minutes)}`
      break
    case 2: // 2015-01-05
      result = `${year}-${format(month)}-${format(day)}`
      break
    case 3: // 2015-01-05 11:12
      result = `${year}-${format(month)}-${format(day)}  ${format(hours)}:${format(minutes)}`
      break
    case 4:// 2015-01-05 11:12:06
      result = `${year}-${format(month)}-${format(day)}  ${format(hours)}:${format(minutes)}:${format(second)}`
      break
  }
  return result
}

/**
 * 订单状态转换
 */
export let orderStatusFilter = (val) => {
  let name = ''
  switch (val) {
    case 0:
      name = '待付款'
      break
    case 1:
      name = '待发货'
      break
    case 2:
      name = '待收货'
      break
    case 3:
      name = '已完成'
      break
    case 4:
      name = '已取消'
      break
  }
  return name
}

/**
 * 字符串str按照s进行分割,返回一个数组
 */
export let splitFilter = (str, s) => {
  return str != null ? str.split(s) : ''
}

/**
 * 获取数组中的某个元素
 */
export let getArray = (arr, i) => {
  return arr[i]
}

var now = new Date()
var day = now.getDay()
function format (time) {
  const date = new Date(time)
  /* 在日期格式中，月份是从0开始的，因此要加0
         * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
         * */
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  month = month > 9 ? date.getDate() : '0' + month
  const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
  const hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
  const minute = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
  const second = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()
  // 拼接

  return year + '-' + month + '-' + day

}
var nowdate = format(now)
var dateTime = new Date(nowdate).getTime() + 4*60*60*1000
console.log(format(dateTime))
//计算周四时间戳
if(day == 0){
  dateTime = dateTime - 3*24*60*60*1000
}else if(day == 6){
  dateTime = dateTime - 2*24*60*60*1000
}else if(day == 5){
  dateTime = dateTime - 1*24*60*60*1000
}else if(day == 4){
  dateTime = dateTime
}else if(day == 3){
  dateTime = dateTime + 1*24*60*60*1000
}else if(day == 2){
  dateTime = dateTime + 2*24*60*60*1000
}else if(day == 1){
  dateTime = dateTime + 3*24*60*60*1000
}
var oldDateTime = dateTime - 8*24*60*60*1000
console.log(format(oldDateTime))

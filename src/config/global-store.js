// userid
export const getUserid = () => {
  return window.Store.GetGlobalData('USERID')
}
export const setUserid = (v) => {
  return window.Store.SetGlobalData('USERID', v)
}
export const delUserid = () => {
  return window.Store.DeleteGlobalData('USERID')
}

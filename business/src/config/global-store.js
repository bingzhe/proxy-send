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

// employee_id
export const getEmployeeId = () => {
  return window.Store.GetGlobalData('F_EMPLOYEEID')
}
export const setEmployeeId = (v) => {
  return window.Store.SetGlobalData('F_EMPLOYEEID', v)
}
export const delEmployeeId = () => {
  return window.Store.DeleteGlobalData('F_EMPLOYEEID')
}

// business_id
export const getBusinessId = () => {
  return window.Store.GetGlobalData('B_BUSINESSID')
}
export const setBusinessId = (v) => {
  return window.Store.SetGlobalData('B_BUSINESSID', v)
}
export const delBusinessId = () => {
  return window.Store.DeleteGlobalData('B_BUSINESSID')
}

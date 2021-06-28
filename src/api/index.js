import api from "./getAxiosInstance"

export const register = ({ first_name = "", last_name = "", email = "", password = "" }) => {
  return api.post('/accounts/register', {
    first_name,
    last_name,
    email, password
  })
}

export const login = ({ email = "", password = "" }) => {
  return api.post('/accounts/login', {
    email, password,
  })
}

export const getAllUsers = () => {
  return api.get('/users')
}

export const createChild = ({ first_name, last_name, email, password }) => {
  return api.post('/users/child', {
    first_name,
    last_name,
    email, password
  })
}

export const patchChild = ({ id, first_name = "", last_name = "", email = "", }) => {
  return api.patch('/users/child', {
    first_name,
    last_name,
    email, id
  })
}

export const deleteChild = (id) => {
  return api.delete(`/users/child/${id}`)
}

export const getOwnData = () => {
  return api.get(`users/own_data`)
}

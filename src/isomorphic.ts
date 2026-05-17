import { createIsomorphicFn } from '@tanstack/react-start'
import { clientGet, clientRemove, clientSet } from './client'
import { serverGet, serverRemove, serverSet } from './server'

export const getCookie = createIsomorphicFn()
  .server(serverGet)
  .client(clientGet)

export const setCookie = createIsomorphicFn()
  .server(serverSet)
  .client(clientSet)

export const removeCookie = createIsomorphicFn()
  .server(serverRemove)
  .client(clientRemove)

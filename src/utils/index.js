import { Auth } from 'aws-amplify'
import Store from '../components/Store'

import { setEvents, setEventsRegistered } from '../actions/PageActions'
import { setUser } from '../actions/UserActions'

// TODO: Configure travis to build a staging version
// export const AWS_CONFIG = process.env.REACT_APP_STAGE === 'production'
//     ? aws_config
//     : aws_exports

const apiUrl = process.env.REACT_APP_STAGE === 'production'
  ? process.env.REACT_APP_PROD_API
  : process.env.REACT_APP_STAGING_API

export const API_URL = apiUrl

let clientUrl = 'http://localhost:3000/'
if (process.env.REACT_APP_STAGE === 'production') clientUrl = 'https://app.ubcbiztech.com/'
else if (process.env.REACT_APP_STAGE === 'stage') clientUrl = 'https://bt-web-staging.web.app/'

export const CLIENT_URL = clientUrl

export const AWS_CONFIG = {
  Auth: {
    aws_project_region: 'us-west-2',
    aws_cognito_identity_pool_id: 'us-west-2:0bfef155-88d4-40cb-9805-de9d366d6650',
    aws_cognito_region: 'us-west-2',
    aws_user_pools_id: 'us-west-2_w0R176hhp',
    aws_user_pools_web_client_id: '5tc2jshu03i3bmtl1clsov96dt',
    oauth: {
      domain: 'auth.ubcbiztech.com',
      scope: [
        'phone',
        'email',
        'openid',
        'profile',
        'aws.cognito.signin.user.admin'
      ],
      redirectSignIn: CLIENT_URL + 'login-redirect/',
      redirectSignOut: CLIENT_URL,
      responseType: 'code'
    },
    federationTarget: 'COGNITO_USER_POOLS',
    identityPoolId: 'us-west-2:0bfef155-88d4-40cb-9805-de9d366d6650',
    region: 'us-west-2',
    userPoolId: 'us-west-2_w0R176hhp',
    userPoolWebClientId: '5tc2jshu03i3bmtl1clsov96dt'
  },
  Storage: {
    bucket: process.env.REACT_APP_BUCKET_NAME,
    region: 'us-west-2',
    identityPoolId: 'us-west-2:0bfef155-88d4-40cb-9805-de9d366d6650'
  }
}

export async function fetchBackend (endpoint, method, data, authenticatedCall = true) {
  let headers = {}
  if (method === 'POST') {
    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }
  if (authenticatedCall) {
    headers.Authorization = `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
  }
  const body = JSON.stringify(data)
  let status
  return fetch(API_URL + endpoint, { method, headers, body })
    .then(response => {
      status = response.status
      return response.json()
    })
    .then(response => {
      // Actually throw an error (so catch block will run) when the response is an error
      if (status < 200 || status >= 300) {
        // eslint-disable-next-line
        return Promise.reject({
          status: status,
          message: response
        })
      }
      return Promise.resolve(response)
    })
}

export function log (message) {
  if (process.env.REACT_APP_STAGE !== 'production') {
    console.log(message)
  }
}

// Refresh the redux store
export async function updateEvents () {
  try {
    const response = await fetchBackend('/events', 'GET', undefined, false)
    Store.dispatch(setEvents({
      events: response
    }))
  } catch (err) {
    log(err)
  }
}

// Refresh the redux store
export async function updateUser (id) {
  try {
    const response = await fetchBackend(`/users/${id}`, 'GET')
    Store.dispatch(setUser(response))
  } catch (err) {
    log(err)
  }
}

// Refresh the redux store
export async function updateRegisteredEvents (userId) {
  try {
    const response = await fetchBackend(`/registrations?id=${userId}`, 'GET')

    let data = []

    // TODO: Better API response? Shouldn't return 404 if empty
    if (response.status !== 404) {
      data = response.data
    }

    Store.dispatch(setEventsRegistered({
      eventsRegistered: Object.values(data)
    }))
  } catch (err) {
    log(err)
  }
}

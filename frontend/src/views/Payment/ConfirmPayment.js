import React, { useEffect, useState } from 'react'
import isEmpty from 'lodash.isempty'

// 3rd party
import axios from 'axios'

// Material Ui Graphics
import {
  Grid
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'

// Utils
import config from "utils/config"

const ConfirmPayment = ({match}) => {
  // Const
  const { token } = match.params
  const isAuthenticated = localStorage.getItem('token') || null

  // States
  const [ message, setMessage ] = useState()
  const [ error, setError ] = useState()

  // Effects
  useEffect( () => {
    confirmPayment(token)
  },[token])

  // Functions
  const confirmPayment = token => {
    setError("")
    setMessage("")
    axios.post(`${config.API_HOST}/transaction/${token}/confirm/`, {}, { headers: { 'Authorization': `Token ${isAuthenticated}` } })
      .then(response => {
        setMessage(response.data.message)
      })
      .catch(function (error) {
        if(error.response.data.non_field_errors){
          setError(error.response.data.non_field_errors[0])
        } else {
          setError(error.response.statusText)
        }
      })
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={12}>
        <h3 style={{textAlign: "center"}}>Confirm Payment</h3>
      </Grid>
      <Grid item xs={12} sm={12}>
        {
          !isEmpty(message) && (
            <Alert severity="info">{message}</Alert>
          )
        }
        {
          !isEmpty(error) && (
            <Alert severity="error">{error}</Alert>
          )
        }
      </Grid>
    </Grid>
  )
}

export default ConfirmPayment
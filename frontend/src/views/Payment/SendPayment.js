import React, { useState, useEffect } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import isEmpty from 'lodash.isempty'

// Material Ui Graphics
import {
  Button, TextField, Grid
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'

// 3rd party
import axios from 'axios'

// Utils
import config from "utils/config"

// Yup schema
const PaymentSchema = Yup.object().shape({
  amount: Yup.number().required().min(1),
});

const SendPayment = () => {
  // Const
  const defaultObject = { amount: '' }
  const isAuthenticated = localStorage.getItem('token') || null

  // States
  const [ message, setMessage ] = useState()
  const [ payment, setPayment ] = useState({})
  const [ error, setError ] = useState()

  // Effects
  useEffect(() => {
    setPayment(defaultObject)
  }, [])

  // Function
  const send = (data) => {
    setError("")
    setMessage("")
    axios.post(`${config.API_HOST}/transaction/`, data, { headers: { 'Authorization': `Token ${isAuthenticated}` } })
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
    <div>
      {
        !isEmpty(payment) && (
          <Formik
            initialValues={payment}
            validationSchema={PaymentSchema}
            onSubmit={values => {
              send({
                amount: values.amount
              })
            }}
            render={({ values, errors, handleChange, handleBlur, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12}>
                    <h3 style={{textAlign: "center"}}>Send Payment</h3>
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
                  <Grid item xs={12} sm={6}>
                    <TextField
                      error={errors.amount ? true : false}
                      variant="outlined"
                      fullWidth
                      label="Amount"
                      name="amount"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.amount}
                      helperText={errors.amount ? errors.amount : ''}
                    />
                  </Grid>
                </Grid>
                <Button variant="contained" color="primary" type="submit" style={{ marginTop: "10px" }}>
                  Send
                </Button>
              </form>
            )}
          />
        )
      }
    </div >
  )
}

export default SendPayment
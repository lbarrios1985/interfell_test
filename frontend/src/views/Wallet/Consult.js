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
const BalanceSchema = Yup.object().shape({
  document: Yup.string().required(),
  phone: Yup.string().required()
});

const Consult = () => {
  // Const
  const defaultObject = { document: '', phone: '' }
  const isAuthenticated = localStorage.getItem('token') || null

  // States
  const [ balance, setBalance ] = useState({})
  const [ message, setMessage ] = useState()
  const [ error, setError ] = useState()

  // Effects
  useEffect(() => {
    setBalance(defaultObject)
  }, [])

  // Function
  const getBalance = (data) => {
    setError("")
    setMessage("")
    axios.post(`${config.API_HOST}/wallet/get_balance/`, data, { headers: { 'Authorization': `Token ${isAuthenticated}` } })
      .then(response => {
        setMessage(response.data.data.toString())
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
        !isEmpty(balance) && (
          <Formik
            initialValues={balance}
            validationSchema={BalanceSchema}
            onSubmit={values => {
              getBalance({
                document: values.document,
                phone: values.phone
              })
            }}
            render={({ values, errors, handleChange, handleBlur, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12}>
                    <h3 style={{textAlign: "center"}}>See Balance</h3>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    {
                      !isEmpty(message) && (
                        <Alert severity="info">Balance: {message}</Alert>
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
                      error={errors.document ? true : false}
                      variant="outlined"
                      fullWidth
                      label="Document Number"
                      name="document"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.document}
                      helperText={errors.document ? errors.document : ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      error={errors.phone ? true : false}
                      variant="outlined"
                      fullWidth
                      label="Phone"
                      name="phone"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phone}
                      helperText={errors.phone ? errors.phone : ''}
                    />
                  </Grid>
                </Grid>
                <Button variant="contained" color="primary" type="submit" style={{ marginTop: "10px" }}>
                  Consult
                </Button>
              </form>
            )}
          />
        )
      }
    </div >
  )
}

export default Consult
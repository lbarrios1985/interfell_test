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
const RechargeSchema = Yup.object().shape({
  document: Yup.string().required(),
  phone: Yup.string().required(),
  amount: Yup.number().required().min(1),
});

const Recharge = () => {
  // Const
  const defaultObject = { document: '', phone: '', amount: '' }
  const isAuthenticated = localStorage.getItem('token') || null
  
  // States
  const [ recharge, setRecharge ] = useState({})
  const [ message, setMessage ] = useState()
  const [ error, setError ] = useState()

  // Effects
  useEffect(() => {
    setRecharge(defaultObject)
  }, [])

  // Function
  const rechargeFunds = (data) => {
    setError("")
    setMessage("")
    axios.post(`${config.API_HOST}/wallet/charge_wallet/`, data, { headers: { 'Authorization': `Token ${isAuthenticated}` } })
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
        !isEmpty(recharge) && (
          <Formik
            initialValues={recharge}
            validationSchema={RechargeSchema}
            onSubmit={values => {
              rechargeFunds({
                document: values.document,
                phone: values.phone,
                amount: values.amount
              })
            }}
            render={({ values, errors, handleChange, handleBlur, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12}>
                    <h3 style={{textAlign: "center"}}>Recharge Wallet</h3>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    {
                      !isEmpty(message) && (
                        <Alert severity="success">{message}</Alert>
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
                  Recharge
                </Button>
              </form>
            )}
          />
        )
      }
    </div >
  )
}

export default Recharge
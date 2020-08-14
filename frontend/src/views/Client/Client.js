import React, { useState, useEffect } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import isEmpty from 'lodash.isempty'

// Material Ui Graphics
import {
  Button, TextField, Grid,
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'

// 3rd party
import axios from 'axios'

// Utils
import config from "utils/config"

// Yup schema
const ClientSchema = Yup.object().shape({
  first_name: Yup.string().required(),
  last_name: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
  document: Yup.string().min(5).max(20).required(),
  phone: Yup.string().min(7).max(20).required(),
})

const ClientUpdateSchema = Yup.object().shape({
  first_name: Yup.string().required(),
  last_name: Yup.string().required(),
  email: Yup.string().email().required(),
  document: Yup.string().min(5).max(20).required(),
  phone: Yup.string().min(7).max(20).required(),
})

const Client = ({ history, match }) => {
  // const
  const { id } = match.params
  const isAuthenticated = localStorage.getItem('token') || null

  // States
  const [client, setClient] = useState({})
  const [ error, setError ] = useState()

  // Effects
  useEffect(() => {
    if (!isAuthenticated) {
      history.push("/admin/login")
    }
    if (id) {
      axios.get(`${config.API_HOST}/clients/${id}`,{ headers: { 'Authorization': `Token ${isAuthenticated}` } }
      ).then(result => {
        setClient({
          first_name : result.data.user.first_name,
          last_name : result.data.user.last_name,
          email : result.data.user.email,
          password : '',
          document : result.data.document,
          phone : result.data.phone
        })
      })
    } else {
      setClient({
        first_name : '',
        last_name : '',
        email : '',
        password : '',
        document : '',
        phone : '',
      })
    }
  }, [])

  // Function
  const createClient = (data) => {
    const client = {
      phone: data.phone,
      document: data.document,
      user: {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        password: data.password,
      }
    }
    axios.post(`${config.API_HOST}/clients/`, client, { headers: { 'Authorization': `Token ${isAuthenticated}` } })
      .then(result => {
        history.push("/admin/clients")
      })
      .catch(function (error) {
        if(error.response.data.non_field_errors){
          setError(error.response.data.non_field_errors[0])
        } else {
          setError(error.response.statusText)
        }
      })
  }

  const updateClient = (data) => {
    const client = {
      phone: data.phone,
      document: data.document,
      user: {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        password:"UPDATE"
      }
    }
    axios.put(`${config.API_HOST}/clients/${id}/`, client, { headers: { 'Authorization': `Token ${isAuthenticated}` } }).then(result => {
      history.push("/admin/clients")
    }).catch(function (error) {
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
        !isEmpty(client) && (
          <Formik
            initialValues={client}
            validationSchema={ id ? ClientUpdateSchema:ClientSchema}
            onSubmit={values => {
              if (id) {
                updateClient(values)
              } else {
                createClient(values)
              }
            }}
            render={({ values, errors, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12}>
                  {
                    !isEmpty(error) && (
                      <Alert severity="error">{error}</Alert>
                    )
                  }
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      error={errors.first_name ? true : false}
                      variant="outlined"
                      fullWidth
                      label="First Name"
                      name="first_name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.first_name}
                      helperText={errors.first_name ? errors.first_name : ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      error={errors.last_name ? true : false}
                      variant="outlined"
                      fullWidth
                      label="Last Name"
                      name="last_name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.last_name}
                      helperText={errors.last_name ? errors.last_name : ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      error={errors.email ? true : false}
                      variant="outlined"
                      fullWidth
                      label="Email"
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      helperText={errors.email ? errors.email : ''}
                    />
                  </Grid>
                  {
                    !id && (
                      <Grid item xs={12} sm={6}>
                        <TextField
                          error={errors.password ? true : false}
                          variant="outlined"
                          fullWidth
                          label="Password"
                          name="password"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.password}
                          type="password"
                          helperText={errors.password ? errors.password : ''}
                        />
                      </Grid>
                    )
                  }
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      error={errors.document ? true : false}
                      variant="outlined"
                      fullWidth
                      label="Document"
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
                  Submit
                </Button>
              </form>
            )}
          />
        )
      }
    </div >
  )
}

export default Client

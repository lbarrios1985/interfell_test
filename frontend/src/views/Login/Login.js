import React, { useState, useEffect } from "react"
import { Formik } from 'formik'
import * as Yup from 'yup'
import isEmpty from 'lodash.isempty'

// Material Ui Graphics
import { Grid, Box, TextField, Button } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'

// 3rd party
import axios from 'axios'

// Utils
import config from "utils/config"

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

const isAuthenticated = localStorage.getItem('token') || null


const SignUpSchema = Yup.object().shape({
  username: Yup.string().required('Username Required'),
  password: Yup.string().required('Password Required')
});


const Login = () => {
  const [token, setToken] = useState(false)
  const [error, setError] = useState(false)

  // Effects
  useEffect(() => {
    if (isAuthenticated !== null) {
      setToken(true)
    }
  }, [isAuthenticated])

  // Functions
  const loginPost = (values) => {
    axios({
      method: 'post',
      url: `${config.API_HOST}/api-token-auth/`,
      data: {... values},
    })
    .then(function (response) {
      localStorage.setItem('token', response.data.token)
      window.location.replace("/admin")
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
      {token && (
        <h3>You are authenticated</h3>
      )}
      <Box
        display="flex"
        alignItems="center"
        flexDirection="column"
        p={1}
        m={1}
      >
        <Grid container>
          <Formik
            initialValues={{
              username: '',
              password: '',
            }}
            validationSchema={SignUpSchema}
            onSubmit={values => {
              loginPost(values)
            }}
            render={({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12}>
                  {
                    !isEmpty(error) && (
                      <Alert severity="error">{error}</Alert>
                    )
                  }
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      error={errors.username ? true : false}
                      variant="outlined"
                      fullWidth
                      label="Username"
                      name="username"
                      onChange={e => {
                        values.username = e.target.value
                        handleChange(e)
                      }}
                      onBlur={handleBlur}
                      value={values.username}
                      helperText={errors.username ? errors.username : ''}
                    />
                  </Grid>
                  <Grid container spacing={1} />
                  <Grid item xs={12} sm={12}>
                    <TextField
                      error={errors.password ? true : false}
                      variant="outlined"
                      fullWidth
                      label="Password"
                      type="password"
                      name="password"
                      onChange={e => {
                        values.password = e.target.value
                        handleChange(e)
                      }}
                      onBlur={handleBlur}
                      value={values.password}
                      helperText={errors.password ? errors.password : ''}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={1} />
                <Button variant="contained" color="primary" type="submit">
                  Submit
              </Button>
              </form>
            )}
          />
        </Grid>
      </Box>
    </div >
  )
}

export default Login
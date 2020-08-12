import React, { useState, useEffect } from "react"
import { Formik } from 'formik';
import * as Yup from 'yup';
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

const isAuthenticated = localStorage.getItem('token') || null

const API_HOST = 'http://localhost:8000';

const SignUpSchema = Yup.object().shape({
  username: Yup.string().required('Username Required'),
  password: Yup.string().required('Password Required')
});

async function loginPost(values) {

  var bodyFormData = new FormData();
  bodyFormData.set('username', values.username);
  bodyFormData.set('password', values.password);
  axios({
    method: 'post',
    url: `${API_HOST}/api-token-auth/`,
    data: bodyFormData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
    .then(function (response) {
      //handle success
      console.log(response.data.token);
      localStorage.setItem('token', response.data.token);
    })
    .catch(function (response) {
      //handle error
      console.log(response);
    });
}

const Login = () => {
  const [token, setToken] = useState(false)


  useEffect(() => {
    if (isAuthenticated !== null) {
      setToken(true)
    }
  }, [isAuthenticated])

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
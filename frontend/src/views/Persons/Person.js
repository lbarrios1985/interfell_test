import React, { useState, useEffect } from 'react'
import { Formik, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import isEmpty from 'lodash.isempty'

// Material Ui Graphics
import {
  Button, TextField, Grid,
  InputLabel, FormControl, Select,
  MenuItem, Chip, Input, Checkbox,
  ListItemText
} from '@material-ui/core'

// 3rd party
import axios from 'axios'

// Utils
import config from "utils/config"



const PersonSchema = Yup.object().shape({
  first_name: Yup.string().required(),
  last_name: Yup.string().required(),
  alias: Yup.string().required(),
  movies_as_actor: Yup.array().of(Yup.number()),
  movies_as_director: Yup.array().of(Yup.number()),
  movies_as_producer: Yup.array().of(Yup.number())
});

const Person = ({ history, match }) => {
  // const
  const { id } = match.params
  // States
  const [movies, setMovies] = useState([])
  const [person, setPerson] = useState({})
  const [actor, setActor] = useState([])
  const [director, setDirector] = useState([])
  const [producer, setProducer] = useState([])
  const isAuthenticated = localStorage.getItem('token') || null

  // Effects
  useEffect(() => {
    if (!isAuthenticated) {
      history.push("/admin/person")
    }
    if (id) {
      axios.get(`${config.API_HOST}/person/${id}`).then(result => {
        setPerson(result.data)
      })
    } else {
      setPerson({
        first_name: '',
        last_name: '',
        alias: '',
        movies_as_actor: [],
        movies_as_director: [],
        movies_as_producer: [],
      })
    }
    getMovies()
  }, [])

  useEffect(() => {
    if (id && !isEmpty(person) && !isEmpty(movies)) {
      // Set actors
      let actors = []
      person.movies_as_actor.forEach(ma => {
        movies.forEach(p => {
          if (p.pk == ma) {
            actors.push(p)
          }
        })
      })
      setActor(actors)
      // Set directors
      let directors = []
      person.movies_as_director.forEach(ma => {
        movies.forEach(p => {
          if (p.pk == ma) {
            directors.push(p)
          }
        })
      })
      setDirector(directors)
      // Set producers
      let producers = []
      person.movies_as_producer.forEach(ma => {
        movies.forEach(p => {
          if (p.pk == ma) {
            producers.push(p)
          }
        })
      })
      setProducer(producers)
    }
  }, [person, movies])

  // Function
  const getMovies = () => {
    axios.get(`${config.API_HOST}/movie/`).then(result => {
      setMovies(result.data)
    })
  }

  const createPerson = (data) => {
    axios.post(`${config.API_HOST}/person/`, data, { headers: { 'Authorization': `Token ${isAuthenticated}` } })
      .then(result => {
        console.log(result)
        history.push("/admin/persons")
      })
      .catch(function (response) {
        //handle error
        console.log(response);
      })
  }

  const updatePerson = (data) => {
    axios.put(`${config.API_HOST}/person/${id}/`, data, { headers: { 'Authorization': `Token ${isAuthenticated}` } }).then(result => {
      history.push("/admin/persons")
    })
  }

  return (
    <div>
      {
        !isEmpty(person) && (
          <Formik
            initialValues={person}
            validationSchema={PersonSchema}
            onSubmit={values => {
              if (id) {
                updatePerson(values)
              } else {
                createPerson(values)
              }
            }}
            render={({ values, errors, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={1}>
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
                      error={errors.alias ? true : false}
                      variant="outlined"
                      fullWidth
                      label="Alias"
                      name="alias"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.alias}
                      helperText={errors.alias ? errors.alias : ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="content-actors-label">Movies as Actor</InputLabel>
                      <Select
                        id="content-actors"
                        name="movies_as_actor"
                        labelId="content-actors-label"
                        value={actor}
                        placeholder="Movies as actor"
                        multiple
                        onChange={event => {
                          let preSelected = []
                          event.target.value.filter(data => {
                            let count = 0
                            event.target.value.forEach((value) => {
                              if (value.pk == data.pk) {
                                count++
                              }
                            })
                            if (count == 1) {
                              preSelected.push(data)
                            }
                          })
                          setActor(preSelected)
                          setFieldValue('movies_as_actor', preSelected.map(p => p.pk))
                        }}
                        input={<Input id="select-multiple-actors" />}
                        renderValue={(selected) => (
                          <div>
                            {selected.map((value) => (
                              <Chip key={value.pk} label={`${value.title}`} />
                            ))}
                          </div>
                        )}
                      >
                        <MenuItem value="">Select...</MenuItem>
                        {
                          movies.map(item => (
                            <MenuItem key={item.pk} value={item}>
                              <Checkbox checked={actor.filter(a => a.pk == item.pk).length != 0} />
                              <ListItemText primary={`${item.title}`} />
                            </MenuItem>
                          ))
                        }
                      </Select>
                      <ErrorMessage name="movies_as_actor" component="div" />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="content-directors-label">Movies as Director</InputLabel>
                      <Select
                        id="content-directors"
                        name="movies_as_director"
                        labelId="content-directors-label"
                        value={director}
                        placeholder="Directors"
                        multiple
                        onChange={event => {
                          let preSelected = []
                          event.target.value.filter(data => {
                            let count = 0
                            event.target.value.forEach((value) => {
                              if (value.pk == data.pk) {
                                count++
                              }
                            })
                            if (count == 1) {
                              preSelected.push(data)
                            }
                          })
                          setDirector(preSelected)
                          setFieldValue('movies_as_director', preSelected.map(p => p.pk))
                        }}
                        input={<Input id="select-multiple-directors" />}
                        renderValue={(selected) => (
                          <div>
                            {selected.map((value) => (
                              <Chip key={value.pk} label={`${value.title}`} />
                            ))}
                          </div>
                        )}
                      >
                        <MenuItem value="">Select...</MenuItem>
                        {
                          movies.map(item => (
                            <MenuItem key={item.pk} value={item}>
                              <Checkbox checked={director.filter(a => a.pk == item.pk).length != 0} />
                              <ListItemText primary={`${item.title}`} />
                            </MenuItem>
                          ))
                        }
                      </Select>
                      <ErrorMessage name="movies_as_director" component="div" />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="content-producers-label">Movies as Producer</InputLabel>
                      <Select
                        id="content-producers"
                        name="movies_as_director"
                        labelId="content-producers-label"
                        value={producer}
                        placeholder="Producers"
                        multiple
                        onChange={event => {
                          let preSelected = []
                          event.target.value.filter(data => {
                            let count = 0
                            event.target.value.forEach((value) => {
                              if (value.pk == data.pk) {
                                count++
                              }
                            })
                            if (count == 1) {
                              preSelected.push(data)
                            }
                          })
                          setProducer(preSelected)
                          setFieldValue('movies_as_director', preSelected.map(p => p.pk))
                        }}
                        input={<Input id="select-multiple-producers" />}
                        renderValue={(selected) => (
                          <div>
                            {selected.map((value) => (
                              <Chip key={value.pk} label={`${value.title}`} />
                            ))}
                          </div>
                        )}
                      >
                        <MenuItem value="">Select...</MenuItem>
                        {
                          movies.map(item => (
                            <MenuItem key={item.pk} value={item}>
                              <Checkbox checked={producer.filter(a => a.pk == item.pk).length != 0} />
                              <ListItemText primary={`${item.title}`} />
                            </MenuItem>
                          ))
                        }
                      </Select>
                      <ErrorMessage name="movies_as_director" component="div" />
                    </FormControl>
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

export default Person

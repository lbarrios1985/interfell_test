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



const MovieSchema = Yup.object().shape({
  title: Yup.string().required(),
  release_year: Yup.string().required()
    .matches(/^[0-9]*$/, 'Only Numbers')
    .min(4).max(4),
  actors: Yup.array().of(Yup.number()).required(),
  directors: Yup.array().of(Yup.number()).required(),
  producers: Yup.array().of(Yup.number()).required(),
});

const Movie = ({ history, match }) => {
  // const
  const { id } = match.params
  // States
  const [movie, setMovie] = useState({})
  const [persons, setPersons] = useState([])
  const [actor, setActor] = useState([])
  const [director, setDirector] = useState([])
  const [producer, setProducer] = useState([])
  const isAuthenticated = localStorage.getItem('token') || null

  // Effects
  useEffect(() => {
    if (!isAuthenticated) {
      history.push("/admin/movie")
    }
    if (id) {
      axios.get(`${config.API_HOST}/movie/${id}`).then(result => {
        setMovie(result.data)
      })
    } else {
      setMovie({
        title: '',
        year: '',
        actors: [],
        directors: [],
        producers: [],
      })
    }
    getPersons()
  }, [])

  useEffect(() => {
    if (id && !isEmpty(movie) && !isEmpty(persons)) {
      // Set actors
      let actors = []
      movie.actors.forEach(ma => {
        persons.forEach(p => {
          if (p.id === ma) {
            actors.push(p)
          }
        })
      })
      setActor(actors)
      // Set directors
      let directors = []
      movie.directors.forEach(ma => {
        persons.forEach(p => {
          if (p.id === ma) {
            directors.push(p)
          }
        })
      })
      setDirector(directors)
      // Set producers
      let producers = []
      movie.producers.forEach(ma => {
        persons.forEach(p => {
          if (p.id === ma) {
            producers.push(p)
          }
        })
      })
      setProducer(producers)
    }
  }, [persons, movie])

  // Function
  const getPersons = () => {
    axios.get(`${config.API_HOST}/person/`).then(result => {
      setPersons(result.data)
    })
  }

  const createMovie = (data) => {
    axios.post(`${config.API_HOST}/movie/`, data, { headers: { 'Authorization': `Token ${isAuthenticated}` } })
      .then(result => {
        console.log(result);
        history.push("/admin/movie")
      })
      .catch(function (response) {
        //handle error
        console.log(response);
      })
  }

  const updateMovie = (data) => {
    axios.put(`${config.API_HOST}/movie/${id}/`, data, { headers: { 'Authorization': `Token ${isAuthenticated}` } }).then(result => {
      history.push("/admin/movie")
    })
  }

  return (
    <div>
      {
        !isEmpty(movie) && (
          <Formik
            initialValues={movie}
            validationSchema={MovieSchema}
            onSubmit={values => {
              if (id) {
                updateMovie(values)
              } else {
                createMovie(values)
              }
            }}
            render={({ values, errors, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      error={errors.title ? true : false}
                      variant="outlined"
                      fullWidth
                      label="Title"
                      name="title"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.title}
                      helperText={errors.title ? errors.title : ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      error={errors.release_year ? true : false}
                      variant="outlined"
                      fullWidth
                      label="Release Year"
                      type="release_year"
                      name="release_year"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.release_year}
                      helperText={errors.release_year ? errors.release_year : ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="content-actors-label">Actors</InputLabel>
                      <Select
                        id="content-actors"
                        name="actors"
                        labelId="content-actors-label"
                        value={actor}
                        placeholder="Actors"
                        multiple
                        onChange={event => {
                          let preSelected = []
                          event.target.value.filter(data => {
                            let count = 0
                            event.target.value.forEach((value) => {
                              if (value.id === data.id) {
                                count++
                              }
                            })
                            if (count === 1) {
                              preSelected.push(data)
                            }
                          })
                          setActor(preSelected)
                          setFieldValue('actors', preSelected.map(p => p.id))
                        }}
                        input={<Input id="select-multiple-actors" />}
                        renderValue={(selected) => (
                          <div>
                            {selected.map((value) => (
                              <Chip key={value.id} label={`${value.first_name} ${value.last_name}`} />
                            ))}
                          </div>
                        )}
                      >
                        <MenuItem value="">Select...</MenuItem>
                        {
                          persons.map(item => (
                            <MenuItem key={item.id} value={item}>
                              <Checkbox checked={actor.filter(a => a.id === item.id).length !== 0} />
                              <ListItemText primary={`${item.first_name} ${item.last_name}`} />
                            </MenuItem>
                          ))
                        }
                      </Select>
                      <ErrorMessage name="actors" component="div" />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="content-directors-label">Directors</InputLabel>
                      <Select
                        id="content-directors"
                        name="directors"
                        labelId="content-directors-label"
                        value={director}
                        placeholder="Directors"
                        multiple
                        onChange={event => {
                          let preSelected = []
                          event.target.value.filter(data => {
                            let count = 0
                            event.target.value.forEach((value) => {
                              if (value.id === data.id) {
                                count++
                              }
                            })
                            if (count === 1) {
                              preSelected.push(data)
                            }
                          })
                          setDirector(preSelected)
                          setFieldValue('directors', preSelected.map(p => p.id))
                        }}
                        input={<Input id="select-multiple-directors" />}
                        renderValue={(selected) => (
                          <div>
                            {selected.map((value) => (
                              <Chip key={value.id} label={`${value.first_name} ${value.last_name}`} />
                            ))}
                          </div>
                        )}
                      >
                        <MenuItem value="">Select...</MenuItem>
                        {
                          persons.map(item => (
                            <MenuItem key={item.id} value={item}>
                              <Checkbox checked={director.filter(a => a.id === item.id).length !== 0} />
                              <ListItemText primary={`${item.first_name} ${item.last_name}`} />
                            </MenuItem>
                          ))
                        }
                      </Select>
                      <ErrorMessage name="directors" component="div" />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="content-producers-label">Producers</InputLabel>
                      <Select
                        id="content-producers"
                        name="producers"
                        labelId="content-producers-label"
                        value={producer}
                        placeholder="Producers"
                        multiple
                        onChange={event => {
                          let preSelected = []
                          event.target.value.filter(data => {
                            let count = 0
                            event.target.value.forEach((value) => {
                              if (value.id === data.id) {
                                count++
                              }
                            })
                            if (count === 1) {
                              preSelected.push(data)
                            }
                          })
                          setProducer(preSelected)
                          setFieldValue('producers', preSelected.map(p => p.id))
                        }}
                        input={<Input id="select-multiple-producers" />}
                        renderValue={(selected) => (
                          <div>
                            {selected.map((value) => (
                              <Chip key={value.id} label={`${value.first_name} ${value.last_name}`} />
                            ))}
                          </div>
                        )}
                      >
                        <MenuItem value="">Select...</MenuItem>
                        {
                          persons.map(item => (
                            <MenuItem key={item.id} value={item}>
                              <Checkbox checked={producer.filter(a => a.id === item.id).length !== 0} />
                              <ListItemText primary={`${item.first_name} ${item.last_name}`} />
                            </MenuItem>
                          ))
                        }
                      </Select>
                      <ErrorMessage name="producers" component="div" />
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

export default Movie
import React, { useState, useEffect } from 'react'

// Material Ui Graphics
import {
  Card, CardContent, CardHeader,
  List, ListItem, ListItemText
} from '@material-ui/core'

// 3rd party
import axios from 'axios'

// Utils
import config from "utils/config"

const MovieDetail = ({ match }) => {
  // Const
  const { id } = match.params

  // States
  const [movie, setMovie] = useState({})

  // Functions
  const getMovie = () => {
    axios.get(`${config.API_HOST}/movie/${id}`).then(result => {
      setMovie(result.data)
    })
  }

  // Effects
  useEffect(() => {
    getMovie()
  }, [])


  return (
    <Card>
      <CardHeader title={movie.title} />
      <CardContent>
        <List>
          <ListItem button>
            <ListItemText primary="Release Year" secondary={movie.roman_release_year} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Actors" />
          </ListItem>
          <ListItem button>
            {movie.actors && movie.actors.map(actor => (
              <a href={`/person/${actor}`} >Actor {actor}</a>
            ))}
          </ListItem>
          <ListItem>
            <ListItemText primary="Directors" />
          </ListItem>
          <ListItem button>
            {movie.directors && movie.directors.map(director => (
              <a href={`/person/${director}`} >Director {director}</a>
            ))}
          </ListItem>
          <ListItem>
            <ListItemText primary="Producers" />
          </ListItem>
          <ListItem button>
            {movie.producers && movie.producers.map(producer => (
              <a href={`/person/${producer}`} >Producer {producer}</a>
            ))}
          </ListItem>
        </List>
      </CardContent>
    </Card>
  )
}

export default MovieDetail
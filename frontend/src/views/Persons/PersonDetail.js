import React, { useState, useEffect } from 'react'

// Material Ui Graphics
import {
  Card, CardContent, List, ListItem, ListItemText
} from '@material-ui/core'

// 3rd party
import axios from 'axios'

// Utils
import config from "utils/config"

const PersonDetail = ({match}) => {
  // Const
  const { id } = match.params

  // States
  const [ person, setPerson ] = useState({})

  // Effects
  useEffect(()=>{
    getPerson()
  },[])

  // Functions
  const getPerson = () => {
    axios.get(`${config.API_HOST}/person/${id}`).then(result => {
      setPerson(result.data)
    })
  }

  return (
    <Card>
      <CardContent>
        <List>
          <ListItem button>
            <ListItemText primary="First Name" secondary={person.first_name} />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Last Name" secondary={person.last_name} />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Alias" secondary={person.alias} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Movies as Actor" />
          </ListItem>
          <ListItem button>
            { person.movies_as_actor && person.movies_as_actor.map(movie => (
              <a href={`/admin/movie/${movie}`} >Movie {movie}</a>
            ))}
          </ListItem>

          <ListItem>
            <ListItemText primary="Movies as Director" />
          </ListItem>
          <ListItem button>
            { person.movies_as_director && person.movies_as_director.map(movie => (
              <a href={`/admin/movie/${movie}`} >Movie {movie}</a>
            ))}
          </ListItem>

          <ListItem>
            <ListItemText primary="Movies as Producer" />
          </ListItem>
          <ListItem button>
            { person.movies_as_producer && person.movies_as_producer.map(movie => (
              <a href={`/admin/movie/${movie}`} >Movie {movie}</a>
            ))}
          </ListItem>
        </List>
      </CardContent>
    </Card>
  )
}

export default PersonDetail
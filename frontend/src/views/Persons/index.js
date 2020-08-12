import React, { useState, useEffect } from "react"
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles"
import Button from '@material-ui/core/Button'
import { Add } from '@material-ui/icons'
// core components
import GridItem from "components/Grid/GridItem.js"
import GridContainer from "components/Grid/GridContainer.js"
import Table from "components/Table/Table.js"
import Card from "components/Card/Card.js"
import CardHeader from "components/Card/CardHeader.js"
import CardBody from "components/Card/CardBody.js"

// 3rd party
import axios from 'axios'

// Utils
import config from "utils/config"


const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
}

const useStyles = makeStyles(styles)

export default function Persons({ history }) {
  // Const
  const table_head = ["ID", "First name", "Last name", "Alias", "Movies as Actor", "Movies as Director", "Movies as Producer", "Options"]
  const isAuthenticated = localStorage.getItem('token') || null
  // States
  const [persons, setPersons] = useState([])

  // Effects
  useEffect(() => {
    getPersons()
  }, [])

  // Functions
  const getPersons = () => {
    axios.get(`${config.API_HOST}/person/`).then(result => {
      setPersons(result.data.map(person => {
        return [
          person.id,
          person.first_name,
          person.last_name,
          person.alias,
          person.movies_as_actor.map(a => {
            return [
              <a href={`/admin/movie/${a}`}>Movie {a}</a>
            ]
          }),
          person.movies_as_director.map(a => {
            return [
              <a href={`/admin/movie/${a}`}>Movie {a}</a>
            ]
          }),
          person.movies_as_producer.map(a => {
            return [
              <a href={`/admin/movie/${a}`}>Movie {a}</a>
            ]
          }),
          [
            <>
              <Button variant="contained" color="primary" type="submit" key={`view_${person.id}`} onClick={() => history.push(`/admin/person/${person.id}`)}>
                View
              </Button>
              {
                isAuthenticated && (
                  <Button variant="contained" color="primary" type="submit" key={`edit_${person.id}`} onClick={() => history.push(`/admin/person/edit/${person.id}`)}>
                    Edit
                  </Button>
                )
              }
            </>
          ]
        ]
      }))
    })
  }

  const classes = useStyles()
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card plain>
          <CardHeader plain color="primary">
            <h4 className={classes.cardTitleWhite}>
              Persons
            </h4>
          </CardHeader>
          <GridItem>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "10px" }}
              onClick={() => history.push("/admin/create-person")}
            >
              <Add /> Create
            </Button>
          </GridItem>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={table_head}
              tableData={persons}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  )
}
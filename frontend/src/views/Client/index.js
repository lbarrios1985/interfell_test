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

export default function Client({ history }) {
  // Const
  const table_head = ["ID", "First name", "Last name", "Email", "Document", "Phone", "Options"]
  const isAuthenticated = localStorage.getItem('token') || null
  // States
  const [clients, setClients] = useState([])

  // Effects
  useEffect(() => {
    getClients()
  }, [])

  // Functions
  const getClients = () => {
    axios.get(`${config.API_HOST}/clients/`, 
    { headers: { 'Authorization': `Token ${isAuthenticated}` } }
    ).then(result => {
      setClients(result.data.map(client => {
        return [
          client.id,
          client.user.first_name,
          client.user.last_name,
          client.user.email,
          client.document,
          client.phone,
          [
            <>
              <Button variant="contained" color="primary" type="submit" key={`edit_${client.id}`} onClick={() => history.push(`/admin/client/edit/${client.id}`)}>
                Edit
              </Button>
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
              Clients
            </h4>
          </CardHeader>
          <GridItem>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "10px" }}
              onClick={() => history.push("/admin/client/create")}
            >
              <Add /> Create
            </Button>
          </GridItem>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={table_head}
              tableData={clients}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  )
}
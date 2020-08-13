import React, { useEffect } from "react"
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles"
// core components
import GridItem from "components/Grid/GridItem.js"
import GridContainer from "components/Grid/GridContainer.js"
import Card from "components/Card/Card.js"
import CardHeader from "components/Card/CardHeader.js"
import CardBody from "components/Card/CardBody.js"
// Other components
import Recharge from "./Rechage"
import Consult from "./Consult"

const styles = {
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

export default function Wallet({history}) {

  // Const
  const isAuthenticated = localStorage.getItem('token') || null
  const classes = useStyles()

  // Effects
  useEffect( () => {
    if (!isAuthenticated) {
      history.push("/admin/login")
    }
  }, [])

  return (
    <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card plain>
            <CardHeader plain color="primary">
              <h4 className={classes.cardTitleWhite}>
                My Wallet
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={6} md={6}>
                  <Recharge />
                </GridItem>
                <GridItem xs={12} sm={6} md={6}>
                  <Consult />
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    )
}

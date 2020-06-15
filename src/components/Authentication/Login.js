import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";

import CssBaseline from "@material-ui/core/CssBaseline";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
//import CardMedia from '@material-ui/core/CardMedia';
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles } from "@material-ui/core/styles";
import { Divider } from "@material-ui/core";
import Container from "@material-ui/core/Container";

import { Auth } from "aws-amplify";
import { setUser } from "../../actions/UserActions";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";

const styles = {
  left: {
    float: "left"
  },
  socialIcon: {
    marginTop: "5px",
    marginRight: "8px",
    width: "19px"
  },
  facebookIconBtn: {
    marginTop: "10px",
    backgroundColor: "#303960",
    paddingLeft: "10px",
    paddingRight: "10px",
    color: '#ffffff'
  },

  googleIconBtn: {
    backgroundColor: "#fafafa",
  }
};

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(10),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
    // backgroundImage: `url(${BackgroundImage})`
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#3fb5a3"
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  root: {
    borderRadius: 12,
    minWidth: 256,
    textAlign: "center"
  },
  header: {
    textAlign: "center",
    spacing: 10
  },
  list: {
    padding: "20px"
  },
  button: {
    margin: theme.spacing(1)
  },
  action: {
    display: "flex",
    justifyContent: "space-around"
  }
}));

function Login(props) {
  const classes = useStyles();
  return (
    <Container component="main" maxWidth="xs">
      <Helmet>
        <title>UBC BizTech - Log In or Sign Up</title>
      </Helmet>
      <CssBaseline />
      <div className={classes.paper}>
        <Card className={classes.root} width="400px">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
          </div>
          <CardHeader title="Sign in" className={classes.header} />
          <Divider variant="middle" />
          <CardContent>
            <Button
              style={styles.googleIconBtn}
              onClick={() => Auth.federatedSignIn({ provider: "Google" })}
              variant="contained"
            >
              <div style={styles.left}>
                <img
                  style={styles.socialIcon}
                  alt="Google"
                  src="./google.png"
                />
              </div>
              Sign In with Google
            </Button>
            <Button style={styles.facebookIconBtn}
              onClick={() => Auth.federatedSignIn({ provider: "Facebook" })}
              variant="contained"
            >
              <div style={styles.left}>
                <img
                  style={styles.socialIcon}
                  alt="Facebook"
                  src="./facebook.png"
                />
              </div>
              Sign In with Facebook
            </Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

const mapStateToProps = state => {
  return {
    user: state.userState.user,
  };
};

export default connect(
  mapStateToProps,
  { setUser }
)(Login);

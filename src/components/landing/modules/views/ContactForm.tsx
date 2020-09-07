// Customize this 'myform.js' script and add it to your JS bundle.
// Then import it with 'import MyForm from "./myform.js"'.
// Finally, add a <MyForm/> element whereever you wish to display the form.

import React from "react";
import {
  TextField,
  Button,
  FormGroup,
  Card,
  CardContent,
  CardActionArea,
  Link,
  Typography,
} from "@material-ui/core";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";

export default class ContactForm extends React.Component<
  object,
  { status: string }
> {
  classes: any;

  constructor(props: object) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
    this.state = {
      status: "",
    };
  }

  render() {
    const { status } = this.state;
    return (
      <Card>
        <CardActionArea>
          <Link
            component={Button}
            href="https://www.facebook.com/TruFan-510781282786488/"
            rel="noopener"
            target="_blank"
            size="large"
            // className={classes.footerButton}
            startIcon={<FacebookIcon fontSize="large" htmlColor="#3b5998" />}
          />
          <Link
            component={Button}
            href="https://twitter.com/truFan19"
            rel="noopener"
            target="_blank"
            size="large"
            // className={classes.footerButton}
            startIcon={
              <TwitterIcon fontSize="large" htmlColor="rgb(29, 161, 242)" />
            }
          />
        </CardActionArea>
        <CardContent>
          <form
            onSubmit={this.submitForm}
            action="https://formspree.io/xgengklq"
            method="POST"
          >
            <Typography>Send us a message!</Typography>
            {/* <!-- add your custom form HTML here --> */}
            <FormGroup style={{ padding: 10 }}>
              <TextField
                type="email"
                name="email"
                aria-label="email"
                placeholder="Your email address."
              />
            </FormGroup>
            <FormGroup style={{ padding: 10 }}>
              <TextField
                type="text"
                name="message"
                aria-label="message"
                placeholder="Type your message here."
                rows={4}
                multiline
              />
            </FormGroup>
            <FormGroup style={{ padding: 10 }}>
              {status === "SUCCESS" ? (
                <p>Thanks!</p>
              ) : (
                <Button variant="contained" color="primary">
                  Send
                </Button>
              )}
              {status === "ERROR" && <p>Ooops! There was an error.</p>}
            </FormGroup>
          </form>
        </CardContent>
      </Card>
    );
  }

  submitForm(ev: any) {
    ev.preventDefault();
    const form = ev.target;
    const data = new FormData(form);
    const xhr = new XMLHttpRequest();
    xhr.open(form.method, form.action);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== XMLHttpRequest.DONE) return;
      if (xhr.status === 200) {
        form.reset();
        this.setState({ status: "SUCCESS" });
      } else {
        this.setState({ status: "ERROR" });
      }
    };
    xhr.send(data);
  }
}

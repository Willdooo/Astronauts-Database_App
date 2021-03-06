import React, { useState } from "react";
//react router
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
//react redux
import { useDispatch } from "react-redux";
import { addAstronaut } from "../database/databaseSlice";
//react hook form
import { useForm, Controller } from "react-hook-form";
//form helpers
import moment from "moment";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
//Material-UI import
import { Button, Typography, Input } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
//
//
//CSS
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles(() => ({
  creatorWrapper: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    textAlign: "center",
    paddingTop: "3rem",
    "@media (max-width:960px)": {
      flexDirection: "column",
    },
  },
  formWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignSelf: "baseline",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  formItem: {
    width: "50%",
    margin: "1rem",
  },
  resultWrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  resultPaper: {
    width: "80%",
    alignSelf: "center",
    textAlign: "initial",
    padding: "1rem",
    "@media (max-width:960px)": {
      marginTop: "2rem",
    },
  },
  credentials: {
    padding: "1.5rem",
  },
  submitButton: {
    backgroundColor: "#36ff36",
    color: "#cc0a2c",
    margin: "0.5rem 1rem 1rem 1rem",
    padding: "0.5rem",
  },
}));

const Creator = () => {
  //Will send to redux store
  const [data, setData] = useState(null);

  //helpers
  const classes = useStyles(); //css
  const dispatch = useDispatch(); //redux toolkit
  const history = useHistory(); //for submit button Link (- with normal Link it wouldn't push to store)
  const { handleSubmit, reset, control, watch } = useForm(); //form
  //implement wach - very useful!!
  const watchAllFields = watch(); // when pass nothing as argument, you are watching everything
  console.log("watchAllFields", watchAllFields);

  //function for dispatch
  const helperFunction = (data) => {
    setData(data);
    console.log(data);
    if (data.firstName && data.lastName && data.superPower && data.birth) {
      dispatch(
        addAstronaut(
          data.firstName,
          data.lastName,
          createReadableBirth(),
          data.superPower,
          data.text
        )
      );
    }
    reset(); //reset form
    history.push("/"); //This is awesome!
    //helper function - formating date
    function createReadableBirth() {
      return moment(data.birth).format("DD/MM/YYYY");
    }
  };

  return (
    <div className={classes.creatorWrapper}>
      <div className={classes.formWrapper}>
        <Paper style={{ width: "80%" }}>
          <Typography variant="h3" gutterBottom style={{ paddingTop: "1rem" }}>
            Create your astronaut!
          </Typography>
          <form
            className={classes.form}
            onSubmit={handleSubmit((data) => helperFunction(data))}
          >
            <Controller
              name="firstName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  className={classes.formItem}
                  {...field}
                  type="text"
                  placeholder="First name"
                  required
                />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <Input
                  className={classes.formItem}
                  {...field}
                  type="text"
                  placeholder="Last name"
                  required
                />
              )}
            />

            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Controller
                name="birth"
                control={control}
                render={({ field: { ref, ...rest } }) => (
                  <KeyboardDatePicker
                    className={classes.formItem}
                    id="date-picker-dialog"
                    label="Date of birth"
                    format="dd/MM/yyyy"
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                    {...rest}
                    required
                  />
                )}
                rules={{ required: true }}
              />
            </MuiPickersUtilsProvider>

            <Controller
              name="superPower"
              control={control}
              render={({ field }) => (
                <Input
                  className={classes.formItem}
                  {...field}
                  type="text"
                  placeholder="Superpower"
                  required
                />
              )}
            />
            <div style={{ display: "flex", margin: "1rem" }}>
              <Typography variant="body2">Optional - </Typography>
              <Controller
                name="showOptional"
                control={control}
                render={({ field }) => (
                  <Input
                    style={{ marginLeft: "0.5rem" }}
                    {...field}
                    type="checkbox"
                  />
                )}
              />
            </div>
            <Controller
              name="text"
              control={control}
              render={({ field }) => (
                <>
                  {watchAllFields.showOptional ? (
                    <>
                      <textarea
                        className={classes.formItem}
                        placeholder="Few sentences about this person..."
                        {...field}
                      />
                    </>
                  ) : (
                    ""
                  )}
                </>
              )}
            />
            <Button
              type="submit"
              className={classes.submitButton}
              variant="contained"
            >
              Submit
            </Button>
          </form>
        </Paper>
      </div>
      {/* result div */}
      <div className={classes.resultWrapper}>
        {watchAllFields.firstName ||
        watchAllFields.lastName ||
        watchAllFields.birth ||
        watchAllFields.text ||
        watchAllFields.superPower ? (
          <Paper elevation={3} className={classes.resultPaper}>
            <div style={{ textAlign: "center" }}>
              {watchAllFields.firstName || watchAllFields.lastName ? (
                <>
                  <Typography className={classes.credentials} variant="h3">
                    {watchAllFields.firstName} {watchAllFields.lastName}
                    <Divider />
                  </Typography>
                </>
              ) : (
                ""
              )}
            </div>

            {watchAllFields.birth ? (
              <>
                <Typography variant="h4">
                  Date of birth:{" "}
                  {moment(watchAllFields.birth).format("DD/MM/YYYY")}
                </Typography>
              </>
            ) : (
              ""
            )}
            {watchAllFields.superPower ? (
              <>
                <Typography variant="h4">
                  Superpower: {watchAllFields.superPower}
                </Typography>
              </>
            ) : (
              ""
            )}
            {watchAllFields.text ? (
              <>
                <Divider />
                <Typography variant="h5">Who am I?</Typography>
                <Typography variant="body1">{watchAllFields.text}</Typography>
              </>
            ) : (
              ""
            )}
          </Paper>
        ) : (
          ""
        )}
        <Link to="/">
          <Button
            size="Large"
            variant="contained"
            color="primary"
            style={{ marginTop: "2rem" }}
          >
            Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Creator;

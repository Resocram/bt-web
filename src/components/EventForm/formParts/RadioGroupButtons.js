import React, { useState, component } from "react"
import { Button, TextField } from "@material-ui/core";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';


export default function RadioGroupButtons(props) {
  
  const [otherButtDisabled, setOtherButtDisabled] = useState(true)

  const radioGroupLabelFontSize = '17px'

  const {
      values: { name, email, password, confirmPassword, id, firstname, lastname, other_option },
      errors,
      touched,
      handleSubmit,
      handleChange,
      isValid,
      setFieldValue,
      setFieldTouched, 
      groupName, optionsArray, otherOptionRequired
  } = props;

  const change = (name, e) => {
      e.persist();
      handleChange(e);
      setFieldTouched(name, true, false);
  };

  return (
    <React.Fragment>
      <FormLabel style={{fontSize: radioGroupLabelFontSize}}>{groupName}</FormLabel>  
      <RadioGroup onChange={(e) => {handleRadioChange(e, groupName)}}>
          {createButtons(optionsArray)}
          {createOtherOption(otherOptionRequired)}
      </RadioGroup>
    </React.Fragment>
  )


  function createButtons(optionsArr) {
    
    return optionsArr.map((option) => 
        <FormControlLabel value={option} control={<Radio/>} label={option} />
      );
    }

  function createOtherOption(addOtherOption){
      var option = "Other:"
      if (addOtherOption) {
          return (
              <React.Fragment>
                  <FormControlLabel value={option} control={<Radio/>} label={option} /> 
                  <TextField
                      // required
                      id="other_option"
                      name="other_option"
                      label=""
                      onChange={change.bind(null, "other_option")}                    
                      helperText={touched.other_option ? errors.other_option : ""}
                      error={touched.other_option && Boolean(errors.other_option)}
                      value={other_option}
                      disabled={otherButtDisabled}


                  />
              </React.Fragment>
          )
      };
  }

  function handleRadioChange(e, group) {
    e.preventDefault()
    let valueName = group;
    let value = e.target.value;

    setFieldValue(valueName, value);
    
    const buttonSelected = e.target.value;
    if (buttonSelected === "Other:"){
        setOtherButtDisabled(false)
        console.log("BUTTON IS NOW ENABLED.")
    }
    else {
        setOtherButtDisabled(true)
        console.log("BUTTON IS NOW DISABLED.")
    }
    console.log(otherButtDisabled)
  }


}
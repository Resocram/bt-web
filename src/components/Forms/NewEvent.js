import React from 'react'
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDateTimePicker
} from '@material-ui/pickers';
import ThemeProvider from '../ThemeProvider'
import InfoIcon from '@material-ui/icons/Info'
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
const slugify = require('slugify')

export default function NewEventForm(props) {
    const {
        values: { slug, startDate, endDate, elocation, longitude, latitude }, // the only values we need to store as props are the ones that are programmatically modified
        errors,
        touched,
        handleSubmit,
        handleChange,
        setFieldValue,
        setFieldTouched,
        submitCount
    } = props;

    const change = (name, e) => {
        e.persist();
        handleChange(e);
        setFieldTouched(name, true, false);
    };

    const handleEventNameChange = (name, e) => {
        e.persist();
        const newSlug = slugify(e.target.value, { lower: true });
        setFieldValue('slug', newSlug)
        handleChange(e);
        setFieldTouched(name, true, false);
    }

    const handleStartDateChange = (date) => {
        setFieldValue("startDate", date)
    }

    const handleEndDateChange = (date) => {
        setFieldValue("endDate", date)
    }

    const textFieldError = (id) => {
        return (errors[id] && submitCount > 0) || (touched[id] ? errors[id] : "")
    }

    const handleInfoClick = () => {
        alert(`Longitude and latitude are used for routing purposes for the mobile app. These values can be found on Google Maps by right clicking any location and pressing "What's here?"
        If you get an error, try adding any character to the field and then deleting it.`)
    }

    const handleLocation = (e) => {
        const value = e.target.value
        let location, longitude, latitude;
        switch (value) {
            case 'Nest':
                location = 'UBC AMS Nest'
                longitude = '-123.249818'
                latitude = '49.266503'
                break;
            case 'Hennings':
                location = 'Hennings'
                longitude = '-123.252198'
                latitude = '49.266487'
                break;
            case 'Sauder':
                location = 'UBC Sauder School of Business'
                longitude = '-123.253800'
                latitude = '49.264861'
                break;
            case 'Birmingham':
                location = 'Birmingham, Henry Angus'
                longitude = '-123.253929'
                latitude = '49.265112'
                break;
            case 'Orchard':
                location = 'Orchard Commons'
                longitude = '-123.251181'
                latitude = '49.260396'
                break;
            default:
                ;
        }
        e.persist()
        handleChange(e)
        setFieldValue('elocation', location)
        setFieldValue('longitude', longitude)
        setFieldValue('latitude', latitude)
    }

    return (
        <ThemeProvider>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            id="ename"
                            label="Event Name"
                            fullWidth
                            helperText={textFieldError("ename")}
                            error={!!textFieldError("ename")}
                            onChange={handleEventNameChange.bind(null, "ename")}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="slug"
                            label="Slug"
                            fullWidth
                            helperText={textFieldError("slug")}
                            error={!!textFieldError("slug")}
                            onChange={change.bind(null, "slug")}
                            value={slug}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="description"
                            label="Description"
                            multiline
                            fullWidth
                            helperText={textFieldError("description")}
                            error={!!textFieldError("description")}
                            onChange={change.bind(null, "description")}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="capacity"
                            label="Capacity"
                            type="number"
                            min="0"
                            helperText={textFieldError("capacity")}
                            error={!!textFieldError("capacity")}
                            onChange={change.bind(null, "capacity")}
                        />
                    </Grid>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid item xs={12} sm={6}>
                            <KeyboardDateTimePicker
                                margin="normal"
                                label="Start Date"
                                minDate={new Date()}
                                value={startDate}
                                onChange={handleStartDateChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <KeyboardDateTimePicker
                                margin="normal"
                                label="End Date"
                                minDate={startDate}
                                value={endDate}
                                onChange={handleEndDateChange}
                            />
                        </Grid>
                    </MuiPickersUtilsProvider>
                    <Grid item xs={12}>
                        <Typography>Some common event locations (optional):</Typography>
                        <Select fullWidth onClick={handleLocation.bind(null)}>
                            <MenuItem value={'Nest'}>Nest</MenuItem>
                            <MenuItem value={'Hennings'}>Hennings</MenuItem>
                            <MenuItem value={'Sauder'}>Sauder</MenuItem>
                            <MenuItem value={'Birmingham'}>Birmingham, HA</MenuItem>
                            <MenuItem value={'Orchard'}>Orchard</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            id="elocation"
                            label="Location"
                            fullWidth
                            helperText={textFieldError("location")}
                            error={!!textFieldError("location")}
                            value={elocation}
                            onChange={change.bind(null, "location")}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            id="longitude"
                            label="Longitude"
                            fullWidth
                            helperText={textFieldError("longitude")}
                            error={!!textFieldError("longitude")}
                            value={longitude}
                            onChange={change.bind(null, "longitude")} />
                    </Grid>
                    <Grid item xs={12} sm={4} style={{ display: 'flex' }}>
                        <TextField
                            id="latitude"
                            label="Latitude"
                            fullWidth
                            helperText={textFieldError("latitude")}
                            error={!!textFieldError("latitude")}
                            value={latitude}
                            onChange={change.bind(null, "latitude")} />
                        <InfoIcon onClick={handleInfoClick} style={{ cursor: 'pointer' }} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="facebookUrl"
                            label="Facebook Event Page"
                            fullWidth
                            helperText={textFieldError("facebookUrl")}
                            error={!!textFieldError("facebookUrl")}
                            onChange={change.bind(null, "facebookUrl")}
                        />
                    </Grid>
                    <Grid >
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="imageUrl"
                            label="Image URL"
                            fullWidth
                            helperText={textFieldError("imageUrl")}
                            error={!!textFieldError("imageUrl")}
                            onChange={change.bind(null, "imageUrl")}
                        />
                    </Grid>
                </Grid>
                <br />
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                >
                    Submit
                </Button>
            </form>
        </ThemeProvider>
    )
}

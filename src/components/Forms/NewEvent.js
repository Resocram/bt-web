import React from 'react'
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography"
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDateTimePicker
} from '@material-ui/pickers';
import ThemeProvider from '../ThemeProvider'
const slugify = require('slugify')

export default function NewEventForm(props) {
    const {
        values: { ename, slug, description, capacity, elocation, imageUrl, facebookUrl, startDate, endDate },
        errors,
        touched,
        handleSubmit,
        handleChange,
        setFieldValue,
        setFieldTouched
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

    return (
        <ThemeProvider>
            <Typography variant="h1">Create a New Event</Typography>
            <form onSubmit={handleSubmit}>
                <Paper>
                    <TextField
                        id="ename"
                        label="Event Name"
                        fullWidth
                        helperText={touched.ename ? errors.ename : ""}
                        error={touched.ename && Boolean(errors.ename)}
                        value={ename}
                        onChange={handleEventNameChange.bind(null, "ename")}
                    />
                    <TextField
                        id="slug"
                        label="Slug"
                        fullWidth
                        helperText={touched.slug ? errors.slug : ""}
                        error={touched.slug && Boolean(errors.slug)}
                        value={slug}
                        onChange={change.bind(null, "slug")}
                    />
                    <TextField
                        id="description"
                        label="Description"
                        multiline
                        fullWidth
                        helperText={touched.description ? errors.description : ""}
                        error={touched.description && Boolean(errors.description)}
                        value={description}
                        onChange={change.bind(null, "description")}
                    />
                    <TextField
                        id="capacity"
                        label="Capacity"
                        type="number"
                        min="0"
                        helperText={touched.capacity ? errors.capacity : ""}
                        error={touched.capacity && Boolean(errors.capacity)}
                        value={capacity}
                        onChange={change.bind(null, "capacity")}
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDateTimePicker
                            margin="normal"
                            label="Start Date"
                            minDate={new Date()}
                            value={startDate}
                            onChange={handleStartDateChange}
                        />
                        <KeyboardDateTimePicker
                            margin="normal"
                            label="End Date"
                            minDate={startDate}
                            value={endDate}
                            onChange={handleEndDateChange}
                        />
                    </MuiPickersUtilsProvider>
                    <TextField
                        id="elocation"
                        label="Location"
                        fullWidth
                        helperText={touched.elocation ? errors.elocation : ""}
                        error={touched.elocation && Boolean(errors.elocation)}
                        value={elocation}
                        onChange={change.bind(null, "location")}
                    />
                    <TextField
                        id="facebookUrl"
                        label="Facebook Event Page"
                        fullWidth
                        helperText={touched.facebookUrl ? errors.facebookUrl : ""}
                        error={touched.facebookUrl && Boolean(errors.facebookUrl)}
                        value={facebookUrl}
                        onChange={change.bind(null, "facebookUrl")}
                    />
                    <TextField
                        id="imageUrl"
                        label="Image URL"
                        fullWidth
                        helperText={touched.imageUrl ? errors.imageUrl : ""}
                        error={touched.imageUrl && Boolean(errors.imageUrl)}
                        value={imageUrl}
                        onChange={change.bind(null, "imageUrl")}
                    />
                </Paper>
                <Button type="submit">
                    Submit
                </Button>
            </form>
        </ThemeProvider>
    )
}

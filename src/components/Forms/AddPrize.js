import React from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const slugify = require('slugify')

export default function AddPrizeForm (props) {
  const {
    values: { id, slug, name, price, imageHash, links },
    errors,
    touched,
    handleSubmit,
    handleChange,
    setFieldValue,
    setFieldTouched,
    dirty,
    isSubmitting,
    submitCount
  } = props

  const textFieldError = (id) => {
    return (errors[id] && submitCount > 0) || (touched[id] ? errors[id] : '')
  }

  const change = (name, e) => {
    e.persist()
    handleChange(e)
    setFieldTouched(name, true, false)
  }

  const changeID = (name, e) => {
    e.persist()
    const newSlug = slugify(e.target.value, { lower: true })
    handleChange(e)
    setFieldValue('slug', newSlug)
    setFieldTouched(name, true, false)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={9}>
            <TextField
              id='id'
              label='Prize ID'
              fullWidth
              helperText={textFieldError('id')}
              error={!!textFieldError('id')}
              onChange={changeID.bind(null, 'id')}
              value={id}
            />
          </Grid>
          <Grid item xs={9}>
            <Typography>Slug (generated id): {slug}</Typography>
            <Typography></Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField
              id='name'
              label='Prize Name (displayed to users)'
              fullWidth
              helperText={textFieldError('name')}
              error={!!textFieldError('name')}
              onChange={change.bind(null, 'name')}
              value={name}
            />
          </Grid>
          <Grid item xs={9}>
            <TextField
              id='price'
              label='Price'
              fullWidth
              helperText={textFieldError('price')}
              error={!!textFieldError('price')}
              onChange={change.bind(null, 'price')}
              value={price}
            />
          </Grid>
        </Grid>
        <br />
        <Button
          variant='contained'
          color='primary'
          type='submit'
          disabled={!dirty || isSubmitting}
        >
                    Submit
        </Button>
      </form>
    </div>
  )
}

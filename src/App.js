import React, { useState, useEffect } from 'react';
import { makeStyles, Grid, Button, TextField, FormControlLabel, Switch } from '@material-ui/core';

import params from './params.json'

const useStyles = makeStyles(theme => ({
  form: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '22%',
    },
  },
}))

function Form(props) {
  const { onChange } = props;
  const classes = useStyles()

  const [state, setState] = useState(
    Object.fromEntries(params.map(p => [p.key, p.default]))
  )

  useEffect(() => { onChange(state) }, [onChange, state])

  const handleInput = (type, key, event) => {
    const value = (type === "number") ? Number(event.target.value) : Boolean(event.target.checked)
    setState(prev => ({ ...prev, [key]: value }))
  }

  return (
    <form className={classes.form} noValidate autoComplete="off">
      <div>
        {params.filter(p => p.type === "boolean").map(param => (
          <FormControlLabel
            key={param.key}
            control={<Switch
              checked={state[param.key]}
              onChange={e => handleInput("boolean", param.key, e)}
            />}
            label={param.name}
          />
        ))}
      </div>
      <div>
        {params.filter(p => p.type === "number").map(param => (
          <TextField
            key={param.key}
            label={param.name}
            value={state[param.key]}
            type="number"
            variant="outlined"
            onChange={e => handleInput("number", param.key, e)}
          />
        ))}
      </div>
    </form>
  )
}

function App() {
  const classes = useStyles()

  const handleForm = e => console.log(e)

  return (
    <Grid container justify="center" alignItems="baseline" spacing={2}>
      <Grid item xs={6}>
        <Form onChange={handleForm.bind(this)} />
      </Grid>
      <Grid item xs={3}>
        <Button variant="contained" color="primary">
          Hello World
        </Button>
      </Grid>
    </Grid>
  )
}

export default App;

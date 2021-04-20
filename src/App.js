import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  Select,
  TextField,
  Switch
} from '@material-ui/core';

import KNN from 'ml-knn'
import params from './params.json'
import examples from './examples.json'
import modelJSON from './model.json'

const model = KNN.load(modelJSON)

const useStyles = makeStyles(theme => ({
  form: {
    '& .MuiFormControl-root': {
      margin: theme.spacing(1),
      width: '22%',
    },
  },
  exampleSelect: {
    marginTop: theme.spacing(2),
  },
  exampleButton: {
    marginTop: "8px",
    height: "56px"
  }
}))

function Form(props) {
  const { onChange } = props;
  const classes = useStyles()

  const [state, setState] = useState(
    Object.fromEntries(params.map(p => [p.key, p.default]))
  )
  const [preset, setPreset] = useState(examples[0].id);

  useEffect(() => { onChange(state) }, [onChange, state])

  const handleInput = (type, key, event) => {
    const value = Number((type === "number") ? event.target.value : event.target.checked)
    setState(prev => ({ ...prev, [key]: value }))
  }
  const loadPreset = () => setState(examples.find(e => e.id === preset).features)

  return (
    <form className={classes.form} noValidate autoComplete="off">
      <div>
        {params.filter(p => p.type === "boolean").map(param => (
          <FormControlLabel
            key={param.key}
            control={<Switch
              checked={Boolean(state[param.key])}
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
      <div className={classes.exampleSelect}>
        <FormControl variant="outlined">
          <InputLabel>Hazır Cihazlar</InputLabel>
          <Select
            native
            value={preset}
            onChange={e => setPreset(Number(e.target.value))}
            label="Hazır Cihazlar"
          >
            {examples.map(e => (
              <option key={e.id} value={e.id}>Cihaz {e.id}</option>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          className={classes.exampleButton}
          onClick={loadPreset}
        >
          Yükle
        </Button>
      </div>
    </form>
  )
}

function Result(props) {
  const { features } = props;

  if (features) {
    let values = params.map(p => features[p.key])
    let predict = model.predict([values])[0]

    return (
      <div>
        <h2>Fiyat Sınıfı: {predict}</h2>
        {Object.keys(features).map(key => (
          <p key={key}>{key}: {features[key]}</p>
        ))}
      </div>
    )
  } else {
    return null
  }
}

function App() {
  const classes = useStyles()

  const [features, setFeatures] = useState(null)
  const handleForm = features => setFeatures(features)

  return (
    <Grid container justify="center" alignItems="baseline" spacing={2}>
      <Grid item xs={6}>
        <Form onChange={handleForm.bind(this)} />
      </Grid>
      <Grid item xs={3}>
        <Result features={features} />
      </Grid>
    </Grid>
  )
}

export default App;

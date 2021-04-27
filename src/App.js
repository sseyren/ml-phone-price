import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  Select,
  Switch,
  TextField,
  Typography,
} from '@material-ui/core';

import KNN from 'ml-knn'
import params from './params.json'
import examples from './examples.json'
import modelJSON from './model.json'

const model = KNN.load(modelJSON)

const useStyles = makeStyles(theme => ({
  main: {
    marginTop: theme.spacing(2),
  },
  cardHeader: {
    marginBottom: 12,
  },
  form: {
    '& .MuiFormControl-root': {
      margin: theme.spacing(1),
      width: '22%',
    },
  },
  exampleSelect: {
    marginTop: theme.spacing(4),
  },
  exampleButton: {
    marginTop: "8px",
    height: "56px"
  },
  paramList: {
    listStyle: "none",
    margin: 0,
    padding: 0
  }
}))

function Form(props) {
  const { onChange } = props;
  const classes = useStyles()

  const [state, setState] = useState(examples[0].features)
  const [preset, setPreset] = useState(examples[0].id)

  useEffect(() => { onChange(state) }, [onChange, state])

  const handleInput = (type, key, event) => {
    const target = event.target
    const value = Number((type === "number") ? target.value : target.checked)
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
  const classes = useStyles()

  if (features) {
    let values = params.map(p => features[p.key])
    let predict = model.predict([values])[0]

    return (
      <div>
        <Card className={classes.cardHeader}>
          <CardContent>
            <Typography
              className={classes.cardHeader}
              variant="h4"
              component="h4"
            >
              Fiyat Sınıfı: {predict}
            </Typography>
            <Typography variant="body" component="p" color="textSecondary">
              Bu web sayfası tarayıcınızda bir makine öğrenmesi modeli
              çalıştırmaktadır. Bu projeyle akıllı telefonların özelliklerinden
              fiyat kategorisi tahmin edilmektedir.
            </Typography>
            <Typography variant="body" component="p" color="textSecondary">
              Model, akıllı telefonun 20 niteliğine göre 4 farklı kategorik
              sonuç üretmektedir. Bunlar; 0 (düşük fiyat), 1 (ortalama fiyat),
              2 (yüksek fiyat) ve 3 (çok yüksek fiyat) şeklindedir.
            </Typography>
            <Typography variant="body2" component="p" color="textSecondary">
              <a href="https://github.com/thesseyren/ml-phone-price">GitHub</a>
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="caption" color="textSecondary">
              <ul className={classes.paramList}>
                {Object.keys(features).map(key => (
                  <li key={key}>{key}: {features[key]}</li>
                ))}
              </ul>
            </Typography>
          </CardContent>
        </Card>
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
    <Grid
      container
      className={classes.main}
      justify="center"
      alignItems="baseline"
      spacing={2}
    >
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

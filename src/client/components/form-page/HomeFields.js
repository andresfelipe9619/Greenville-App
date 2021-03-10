import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { CustomSelect, CustomTextField, CustomInput } from './inputs';

export default function HomeFields({
  inputProps,
  dependencies,
  showId = false,
}) {
  let selectedZone = null;
  const inputZone = inputProps.values.zone;
  if (inputZone) {
    selectedZone = dependencies.zones.find(z => z.name === inputZone);
  }
  return (
    <>
      <Grid
        item
        md={12}
        container
        justify="space-between"
        style={{ backgroundColor: (selectedZone || {}).color }}
      >
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" color="primary">
            Address
          </Typography>
          <CustomInput
            name="address"
            label="Address"
            disabled={showId}
            {...inputProps}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <CustomSelect
            name="zone"
            label="Zone"
            disabled={showId}
            {...inputProps}
            style={{ marginTop: 25 }}
            options={dependencies.zones}
          />
        </Grid>
        {showId && (
          <Grid item xs={6} sm={3}>
            <CustomTextField
              disabled
              name="idHr"
              label="ID HR"
              type="number"
              {...inputProps}
              style={{ margin: '25px 0px 0px 16px' }}
            />
          </Grid>
        )}
      </Grid>
      <Grid item xs={12} sm={4}>
        <CustomTextField name="lastName" label="Last Name" {...inputProps} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <CustomSelect
          name="model"
          label="Model"
          {...inputProps}
          options={dependencies.models}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <CustomSelect
          name="builder"
          label="Builder"
          {...inputProps}
          options={dependencies.builders}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <CustomTextField
          type="number"
          name="drywallFootage"
          label="Drywall Footage"
          {...inputProps}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <CustomTextField
          type="number"
          name="footHouse"
          label="Foot House"
          {...inputProps}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <CustomTextField
          type="number"
          name="footGarage"
          label="Foot Garage"
          {...inputProps}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <CustomTextField
          type="number"
          name="footExterior"
          label="Foot Exterior"
          {...inputProps}
        />
      </Grid>
    </>
  );
}

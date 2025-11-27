import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Typography,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import {
  IncidentType,
  SeverityLevel,
  ReportStatus,
} from "../../business/models/Enums";
import { Incident } from "../../business/models/Incident";
import { Location } from "../../business/models/Location";
import MapServiceAPI from "../../data/adapters/MapServiceAPI";

const ReportDialog = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    type: IncidentType.ACCIDENT,
    severity: SeverityLevel.MEDIUM,
    description: "",
    postalCode: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Geocode Postal Code
    let lat = 0;
    let lng = 0;

    try {
      const query = `${formData.address}, ${formData.postalCode}`;
      const results = await MapServiceAPI.geocode(query);
      if (results && results.length > 0) {
        lat = results[0].latitude;
        lng = results[0].longitude;
      }
    } catch (error) {
      console.error("Geocoding failed", error);
    }

    const location = new Location(lat, lng, formData.address);

    const newIncident = new Incident(
      uuidv4(),
      formData.type,
      formData.severity,
      location,
      formData.description,
      "current-user-id", // Mock user ID
      new Date().toISOString(),
      ReportStatus.ACTIVE,
      null
    );

    onSubmit(newIncident);

    // Reset form
    setFormData({
      type: IncidentType.ACCIDENT,
      severity: SeverityLevel.MEDIUM,
      description: "",
      postalCode: "",
      address: "",
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Report New Incident</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                label="Type"
                onChange={handleChange}
              >
                {Object.values(IncidentType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Severity</InputLabel>
              <Select
                name="severity"
                value={formData.severity}
                label="Severity"
                onChange={handleChange}
              >
                {Object.values(SeverityLevel).map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="description"
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange}
              helperText="Must be at least 10 characters"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Location Details
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="postalCode"
              label="Postal Code"
              value={formData.postalCode}
              onChange={handleChange}
              helperText="e.g. M5G 1Z8"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="address"
              label="Address / Landmark"
              value={formData.address}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportDialog;

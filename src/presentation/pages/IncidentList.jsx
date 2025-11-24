import React from "react";
import { Box, Typography, Container } from "@mui/material";
import IncidentCard from "../components/IncidentCard";

const IncidentList = ({ incidents }) => {
  if (!incidents || incidents.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No incidents found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      {incidents.map((incident) => (
        <IncidentCard key={incident.id} incident={incident} />
      ))}
    </Box>
  );
};

export default IncidentList;

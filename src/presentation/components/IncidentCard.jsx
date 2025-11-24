import React from "react";
import { Card, CardContent, Typography, Chip, Box, Stack } from "@mui/material";
import {
  LocationOn,
  AccessTime,
  Warning,
  Construction,
  Block,
  Info,
} from "@mui/icons-material";
import { IncidentType, SeverityLevel } from "../../business/models/Enums";

const getTypeIcon = (type) => {
  switch (type) {
    case IncidentType.ACCIDENT:
      return <Warning color="error" />;
    case IncidentType.CONSTRUCTION:
      return <Construction color="warning" />;
    case IncidentType.CLOSURE:
      return <Block color="error" />;
    case IncidentType.HAZARD:
      return <Info color="warning" />;
    default:
      return <Info />;
  }
};

const getSeverityColor = (severity) => {
  switch (severity) {
    case SeverityLevel.HIGH:
      return "error";
    case SeverityLevel.MEDIUM:
      return "warning";
    case SeverityLevel.LOW:
      return "success";
    default:
      return "default";
  }
};

const IncidentCard = ({ incident }) => {
  const { type, severity, description, location, timestamp } = incident;

  // Format date
  const dateStr = new Date(timestamp).toLocaleString();

  return (
    <Card
      sx={{
        mb: 2,
        borderLeft: 6,
        borderColor: `${getSeverityColor(severity)}.main`,
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {getTypeIcon(type)}
            <Typography variant="h6" component="div">
              {type}
            </Typography>
          </Box>
          <Chip
            label={severity}
            color={getSeverityColor(severity)}
            size="small"
            variant="outlined"
          />
        </Stack>

        <Typography variant="body1" sx={{ mt: 1.5, mb: 1.5 }}>
          {description}
        </Typography>

        <Stack spacing={1}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "text.secondary",
            }}
          >
            <LocationOn fontSize="small" />
            <Typography variant="body2">
              {location?.address ||
                `${location?.latitude}, ${location?.longitude}`}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "text.secondary",
            }}
          >
            <AccessTime fontSize="small" />
            <Typography variant="body2">{dateStr}</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default IncidentCard;

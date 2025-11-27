import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Stack,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  LocationOn,
  AccessTime,
  Warning,
  Construction,
  Block,
  Info,
  DeleteOutline,
  MoreTime,
} from "@mui/icons-material";
import {
  IncidentType,
  SeverityLevel,
  ReportStatus,
} from "../../business/models/Enums";

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

const statusColors = {
  [ReportStatus.RESOLVED]: "success",
  [ReportStatus.EXPIRED]: "default",
};

const IncidentCard = ({
  incident,
  canManage = false,
  onDeleteRequest,
  onExtendRequest,
}) => {
  const { type, severity, description, location, timestamp, status, expiresAt } =
    incident;

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
          {status && status !== ReportStatus.ACTIVE && (
            <Chip
              label={status}
              color={statusColors[status] || "default"}
              size="small"
            />
          )}
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
          {expiresAt && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "text.secondary",
              }}
            >
              <MoreTime fontSize="small" />
              <Typography variant="body2">
                Clears by {new Date(expiresAt).toLocaleString()}
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
      {canManage && (
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Tooltip title="Extend visibility by 6/12/24h">
            <span>
              <IconButton
                size="small"
                onClick={() => onExtendRequest && onExtendRequest(incident)}
              >
                <MoreTime fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Clear incident">
            <span>
              <IconButton
                size="small"
                color="error"
                onClick={() => onDeleteRequest && onDeleteRequest(incident)}
              >
                <DeleteOutline fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </CardActions>
      )}
    </Card>
  );
};

export default IncidentCard;

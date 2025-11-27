import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Fab,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Map as MapIcon,
  List as ListIcon,
  Refresh as RefreshIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { services } from "./business/ServiceFactory";
import IncidentRepository from "./data/repositories/IncidentRepository";
import { seedData } from "./data/mockData";
import IncidentList from "./presentation/pages/IncidentList";
import MapContainer from "./presentation/components/MapContainer";
import ReportDialog from "./presentation/components/ReportDialog";
import { ReportStatus } from "./business/models/Enums";
import { useAuth } from "./presentation/context/AuthContext.jsx";

const EXTEND_OPTIONS = [6, 12, 24];

function App() {
  // State Management
  const [incidents, setIncidents] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // 'list' | 'map'
  const [loading, setLoading] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [includeResolved, setIncludeResolved] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState("");
  const [incidentToDelete, setIncidentToDelete] = useState(null);
  const [incidentToExtend, setIncidentToExtend] = useState(null);
  const [extendHours, setExtendHours] = useState(6);

  // Services
  const {
    incidentService,
    refreshScheduler,
    notificationService,
    incidentLifecycleService,
  } = services;
  const { isManager, login, logout } = useAuth();

  // Core Methods (Controller Logic)

  const displayError = useCallback((message) => {
    setNotification({ open: true, message, severity: "error" });
  }, []);

  const showNotification = useCallback((message, severity = "info") => {
    setNotification({ open: true, message, severity });
  }, []);

  const refreshIncidents = useCallback(async () => {
    try {
      await incidentLifecycleService.expireStaleIncidents();
      const data = await incidentService.getAll();
      setIncidents([...data]); // Create new reference to trigger update
    } catch (error) {
      console.error(error);
      displayError("Failed to refresh incidents");
    }
  }, [incidentService, incidentLifecycleService, displayError]);

  // Initial Data Load & Setup
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        // Seed data if empty (for development)
        const existing = await incidentService.getAll();
        if (existing.length === 0) {
          seedData(IncidentRepository);
        }
        await refreshIncidents();
      } catch (error) {
        displayError("Failed to initialize app: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    init();

    // Setup Notification Handler
    notificationService.setNotificationHandler((message, type) => {
      const severity = type ? type.toLowerCase() : "info";
      showNotification(message, severity);
    });

    // Setup Auto-Refresh
    refreshScheduler.start(async () => {
      console.log("Auto-refreshing incidents...");
      await refreshIncidents();
    });

    return () => {
      refreshScheduler.stop();
      notificationService.setNotificationHandler(null);
    };
  }, [
    incidentService,
    refreshScheduler,
    notificationService,
    refreshIncidents,
    showNotification,
    displayError,
  ]);

  const filteredIncidents = useMemo(() => {
    if (includeResolved) {
      return incidents;
    }
    return incidents.filter((incident) => {
      const status = incident.status || ReportStatus.ACTIVE;
      return status === ReportStatus.ACTIVE;
    });
  }, [incidents, includeResolved]);

  const displayIncidents = () => {
    if (loading) return <CircularProgress sx={{ mt: 4 }} />;

    return viewMode === "map" ? (
      <MapContainer incidents={filteredIncidents} />
    ) : (
      <IncidentList
        incidents={filteredIncidents}
        onDeleteRequest={handleDeleteRequest}
        onExtendRequest={handleExtendRequest}
        canManage={isManager}
      />
    );
  };

  const showMap = () => setViewMode("map");
  const showList = () => setViewMode("list");

  const showReportForm = () => setShowReportDialog(true);
  const hideReportForm = () => setShowReportDialog(false);

  const handleReportSubmit = async (incident) => {
    try {
      console.log("Reporting incident:", incident);
      await incidentService.create(incident);
      showNotification("Incident reported successfully", "success");
      hideReportForm();
      refreshIncidents();
    } catch (error) {
      displayError(error.message);
    }
  };

  const handleDeleteRequest = (incident) => {
    setIncidentToDelete(incident);
  };

  const handleDeleteConfirm = async () => {
    if (!incidentToDelete) return;
    try {
      await incidentLifecycleService.markResolved(incidentToDelete.id);
      showNotification("Incident removed from public feed", "success");
      setIncidentToDelete(null);
      refreshIncidents();
    } catch (error) {
      displayError(error.message || "Failed to remove incident");
    }
  };

  const handleDeleteCancel = () => setIncidentToDelete(null);

  const handleExtendRequest = (incident) => {
    setIncidentToExtend(incident);
    setExtendHours(6);
  };

  const handleExtendConfirm = async () => {
    if (!incidentToExtend) return;
    try {
      await incidentLifecycleService.extendIncident(
        incidentToExtend.id,
        extendHours
      );
      showNotification(
        `Incident visibility extended by ${extendHours} hours`,
        "info"
      );
      setIncidentToExtend(null);
      refreshIncidents();
    } catch (error) {
      displayError(error.message || "Failed to extend incident");
    }
  };

  const handleExtendCancel = () => setIncidentToExtend(null);

  const openLoginDialog = () => {
    setPasscode("");
    setLoginError("");
    setLoginDialogOpen(true);
  };

  const closeLoginDialog = () => {
    setLoginDialogOpen(false);
    setPasscode("");
    setLoginError("");
  };

  const handleManagerLogin = () => {
    const result = login(passcode);
    if (!result.success) {
      setLoginError(result.error);
      return;
    }
    closeLoginDialog();
    showNotification("Manager session activated", "success");
  };

  const handleManagerLogout = () => {
    logout();
    showNotification("Manager session ended", "info");
  };

  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Layout: Navbar */}
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Traffic News
          </Typography>
          <IconButton color="inherit" onClick={refreshIncidents}>
            <RefreshIcon />
          </IconButton>
          <Button
            color="inherit"
            onClick={viewMode === "list" ? showMap : showList}
          >
            {viewMode === "list" ? <MapIcon /> : <ListIcon />}
          </Button>
        </Toolbar>
      </AppBar>

      {/* Layout: Sidebar (Drawer) */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem button onClick={showList}>
              <ListItemText primary="Incidents List" />
            </ListItem>
            <ListItem button onClick={showMap}>
              <ListItemText primary="Map View" />
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemText primary="Saved Routes" />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary={`Role: ${isManager ? "Manager" : "Viewer"}`}
                secondary={
                  isManager
                    ? "You can clear or extend incidents"
                    : "Login required for moderation"
                }
              />
            </ListItem>
            <ListItem button onClick={isManager ? handleManagerLogout : openLoginDialog}>
              <ListItemText
                primary={isManager ? "Logout Manager" : "Manager Login"}
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Container maxWidth="md" sx={{ mt: 2, mb: 10 }}>
        {/* Search and Filter Placeholders */}
        <Box sx={{ mb: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
          <Typography variant="body2" color="textSecondary">
            Search Bar & Filter Controls will go here
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={includeResolved}
                onChange={(event) => setIncludeResolved(event.target.checked)}
              />
            }
            label="Show cleared incidents"
            sx={{ mt: 1 }}
          />
        </Box>

        {displayIncidents()}
      </Container>

      {/* Floating Action Button for Reporting */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={showReportForm}
      >
        <AddIcon />
      </Fab>

      {/* Dialogs & Overlays */}
      <ReportDialog
        open={showReportDialog}
        onClose={hideReportForm}
        onSubmit={handleReportSubmit}
      />

      {/* Manager Login */}
      <Dialog open={loginDialogOpen} onClose={closeLoginDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Manager Login</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Passcode"
            type="password"
            fullWidth
            value={passcode}
            onChange={(event) => setPasscode(event.target.value)}
            error={Boolean(loginError)}
            helperText={loginError || "Enter the shared manager passcode"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeLoginDialog}>Cancel</Button>
          <Button onClick={handleManagerLogin} variant="contained">
            Login
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={Boolean(incidentToDelete)}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Clear Incident</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove
            {" "}
            <strong>{incidentToDelete?.type}</strong>
            {" "}
            at {incidentToDelete?.location?.address || "this location"}?
            This will hide it from all public users.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirm}>
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* Extend Dialog */}
      <Dialog
        open={Boolean(incidentToExtend)}
        onClose={handleExtendCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Extend Incident Visibility</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography>
            Choose how long to keep
            {" "}
            <strong>{incidentToExtend?.type}</strong>
            {" "}
            visible before it expires.
          </Typography>
          <TextField
            select
            label="Extend by"
            value={extendHours}
            onChange={(event) => setExtendHours(Number(event.target.value))}
          >
            {EXTEND_OPTIONS.map((hours) => (
              <MenuItem key={hours} value={hours}>
                {hours} hours
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleExtendCancel}>Cancel</Button>
          <Button variant="contained" onClick={handleExtendConfirm}>
            Extend
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback: Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;

import React, { useState, useEffect, useCallback } from "react";
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

// Placeholder components for future implementation
const MapContainer = ({ incidents }) => (
  <Box
    sx={{
      mt: 2,
      height: "400px",
      bgcolor: "#e0e0e0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Typography variant="h6">Map View ({incidents.length} pins)</Typography>
    {/* Map implementation will go here */}
  </Box>
);

const ReportForm = ({ open, onClose, onSubmit }) => {
  if (!open) return null;
  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "white",
        p: 4,
        boxShadow: 24,
        zIndex: 1300,
      }}
    >
      <Typography variant="h6">Report Incident</Typography>
      <Button onClick={onClose}>Cancel</Button>
      <Button
        onClick={() =>
          onSubmit({ type: "ACCIDENT", description: "Test Incident" })
        }
      >
        Submit
      </Button>
    </Box>
  );
};

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

  // Services
  const { incidentService, refreshScheduler } = services;

  // Core Methods (Controller Logic)

  const refreshIncidents = useCallback(async () => {
    try {
      const data = await incidentService.getAll();
      setIncidents([...data]); // Create new reference to trigger update
    } catch (error) {
      console.error(error);
      displayError("Failed to refresh incidents");
    }
  }, [incidentService]);

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

    // Setup Auto-Refresh
    refreshScheduler.start(async () => {
      console.log("Auto-refreshing incidents...");
      await refreshIncidents();
    });

    return () => refreshScheduler.stop();
  }, [incidentService, refreshScheduler, refreshIncidents]);

  const displayIncidents = () => {
    if (loading) return <CircularProgress sx={{ mt: 4 }} />;

    return viewMode === "map" ? (
      <MapContainer incidents={incidents} />
    ) : (
      <IncidentList incidents={incidents} />
    );
  };

  const showMap = () => setViewMode("map");
  const showList = () => setViewMode("list");

  const showReportForm = () => setShowReportDialog(true);
  const hideReportForm = () => setShowReportDialog(false);

  const handleReportSubmit = async (incidentData) => {
    try {
      console.log("Reporting incident:", incidentData);
      // In a real scenario, we'd construct a full Incident object here
      // For now, we just mock the submission
      // await incidentService.create(incidentData);
      showNotification("Incident reported successfully (Mock)", "success");
      hideReportForm();
      refreshIncidents();
    } catch (error) {
      displayError(error.message);
    }
  };

  const displayError = (message) => {
    setNotification({ open: true, message, severity: "error" });
  };

  const showNotification = (message, severity = "info") => {
    setNotification({ open: true, message, severity });
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
      <ReportForm
        open={showReportDialog}
        onClose={hideReportForm}
        onSubmit={handleReportSubmit}
      />

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

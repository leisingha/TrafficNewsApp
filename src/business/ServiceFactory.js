import IncidentRepository from "../data/repositories/IncidentRepository";
import LocalStorageAdapter from "../data/adapters/LocalStorageAdapter";
import MapServiceAPI from "../data/adapters/MapServiceAPI";

import { IncidentService } from "./services/IncidentService";
import { ValidationService } from "./services/ValidationService";
import { NotificationService } from "./services/NotificationService";
import { FilterService } from "./services/FilterService";
import { SearchService } from "./services/SearchService";
import { MapViewManager } from "./services/MapViewManager";
import { RefreshScheduler } from "./services/RefreshScheduler";
import { RateLimiterService } from "./services/RateLimiterService";
import { SavedRoutesService } from "./services/SavedRoutesService";
import { OfflineSubmissionQueue } from "./services/OfflineSubmissionQueue";
import { IncidentLifecycleService } from "./services/IncidentLifecycleService";

// Instantiate Services
const validationService = new ValidationService();
const notificationService = new NotificationService();
const filterService = new FilterService();
const searchService = new SearchService();
const refreshScheduler = new RefreshScheduler();
const rateLimiterService = new RateLimiterService();

// Services with dependencies
const incidentService = new IncidentService(
  IncidentRepository,
  validationService
);
const mapViewManager = new MapViewManager(MapServiceAPI);
const savedRoutesService = new SavedRoutesService(
  LocalStorageAdapter,
  notificationService
);
const offlineSubmissionQueue = new OfflineSubmissionQueue(incidentService);
const incidentLifecycleService = new IncidentLifecycleService(
  IncidentRepository,
  notificationService
);

export const services = {
  incidentService,
  validationService,
  notificationService,
  filterService,
  searchService,
  mapViewManager,
  refreshScheduler,
  rateLimiterService,
  savedRoutesService,
  offlineSubmissionQueue,
  mapServiceAPI: MapServiceAPI,
  incidentLifecycleService,
};

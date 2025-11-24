/**
 * Mock Data for Traffic News App
 * Used to seed the application with initial data.
 */

export const MOCK_INCIDENTS = [
  {
    id: "1",
    type: "ACCIDENT",
    severity: "HIGH",
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      address: "New York, NY",
    },
    description: "Multi-car collision on 5th Ave",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    status: "APPROVED",
    reporterId: "user1",
  },
  {
    id: "2",
    type: "CONSTRUCTION",
    severity: "MEDIUM",
    location: {
      latitude: 40.73061,
      longitude: -73.935242,
      address: "Long Island City, NY",
    },
    description: "Road work on Queens Blvd",
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    status: "APPROVED",
    reporterId: "user2",
  },
  {
    id: "3",
    type: "TRAFFIC_JAM",
    severity: "LOW",
    location: {
      latitude: 40.6782,
      longitude: -73.9442,
      address: "Brooklyn, NY",
    },
    description: "Heavy traffic due to event",
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
    status: "PENDING",
    reporterId: "user3",
  },
  {
    id: "4",
    type: "HAZARD",
    severity: "HIGH",
    location: {
      latitude: 40.7589,
      longitude: -73.9851,
      address: "Times Square, NY",
    },
    description: "Debris on road",
    timestamp: new Date(Date.now() - 900000).toISOString(), // 15 mins ago
    status: "APPROVED",
    reporterId: "user4",
  },
  {
    id: "5",
    type: "ACCIDENT",
    severity: "LOW",
    location: {
      latitude: 40.7829,
      longitude: -73.9654,
      address: "Central Park, NY",
    },
    description: "Minor fender bender",
    timestamp: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    status: "APPROVED",
    reporterId: "user1",
  },
];

/**
 * Seeds the repository with mock data
 * @param {Object} repository - The IncidentRepository instance
 */
export const seedData = (repository) => {
  console.log("Seeding data...");
  MOCK_INCIDENTS.forEach((incident) => {
    repository.persist(incident);
  });
  console.log("Data seeded successfully.");
};

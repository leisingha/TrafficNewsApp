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
      latitude: 43.6532,
      longitude: -79.3832,
      address: "Yonge & Dundas, Toronto",
    },
    description: "Multi-car collision at intersection",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    status: "APPROVED",
    reporterId: "user1",
  },
  {
    id: "2",
    type: "CONSTRUCTION",
    severity: "MEDIUM",
    location: {
      latitude: 43.6426,
      longitude: -79.3871,
      address: "Gardiner Expressway, Toronto",
    },
    description: "Road work on Gardiner Westbound",
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    status: "APPROVED",
    reporterId: "user2",
  },
  {
    id: "3",
    type: "TRAFFIC_JAM",
    severity: "LOW",
    location: {
      latitude: 43.6677,
      longitude: -79.3948,
      address: "Bloor St W, Toronto",
    },
    description: "Heavy traffic near UofT",
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
    status: "PENDING",
    reporterId: "user3",
  },
  {
    id: "4",
    type: "HAZARD",
    severity: "HIGH",
    location: {
      latitude: 43.6481,
      longitude: -79.3756,
      address: "Yonge & Front, Toronto",
    },
    description: "Debris on road near Union Station",
    timestamp: new Date(Date.now() - 900000).toISOString(), // 15 mins ago
    status: "APPROVED",
    reporterId: "user4",
  },
  {
    id: "5",
    type: "ACCIDENT",
    severity: "LOW",
    location: {
      latitude: 43.65107,
      longitude: -79.347015,
      address: "Don Valley Parkway, Toronto",
    },
    description: "Minor fender bender on DVP",
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

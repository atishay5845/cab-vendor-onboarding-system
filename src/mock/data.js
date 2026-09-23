/**
 * Rich mock dataset for multi-tenant fleet management demo.
 */

const names = [
  "Teja Neeradi",
  "Alekhay Test",
  "Dhulabhai Bamanbhai",
  "Lalita Malita",
  "Arjun Mehta",
  "Kavya Iyer",
  "Rohan Deshmukh",
  "Meera Nair",
  "Ishaan Kapoor",
  "Ananya Rao",
  "Vikram Singh",
  "Pooja Shah",
  "Aditya Joshi",
  "Sneha Reddy",
  "Nikhil Verma",
  "Ritika Das",
  "Manoj Patil",
  "Diya Menon",
  "Kabir Khan",
  "Neha Kulkarni",
  "Sanjay Gupta",
  "Aarti Mishra",
  "Rahul Jain",
  "Priya Pillai",
  "Dev Malhotra",
  "Tara Bose",
  "Yash Pawar",
  "Maya Sethi",
  "Kiran Bhat",
  "Ravi Parmar",
  "Asha Thakur",
  "Aman Soni",
  "Naina Roy",
  "Varun Shetty",
  "Leena George",
  "Gaurav Saxena",
  "Sana Mirza",
  "Harish Yadav",
  "Ira Chawla",
  "Om Prakash",
  "Jaya Rao",
  "Ajay Bansal",
  "Reena Dutta",
  "Sameer Kaur",
  "Vidya Nair",
  "Mohan Das",
  "Nisha Jain",
  "Tarun Gill",
  "Sara Khan",
  "Vijay Arora",
];

const cities = [
  "Bengaluru",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Mumbai",
  "Jaipur",
  "Chennai",
  "Kochi",
];

const avatar = (name) =>
  `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=e0e7ff,d1fae5,fef3c7`;

const vendorSeed = [
  ["v1", null, "Teja Neeradi", "Super Vendor"],
  ["v2", "v1", "Alekhay Test", "Regional Vendor"],
  ["v3", "v1", "Dhulabhai Bamanbhai", "Regional Vendor"],
  ["v4", "v2", "Lalita Malita", "City Vendor"],
  ["v5", "v2", "Arjun Mehta", "City Vendor"],
  ["v6", "v3", "Kavya Iyer", "City Vendor"],
  ["v7", "v3", "Rohan Deshmukh", "City Vendor"],
  ...Array.from({ length: 8 }, (_, i) => [
    `v${i + 8}`,
    `v${4 + Math.floor(i / 2)}`,
    names[i + 7] || "Vendor",
    "Local Vendor",
  ]),
  ...Array.from({ length: 15 }, (_, i) => [
    `v${i + 16}`,
    `v${8 + (i % 8)}`,
    names[i + 15] || "Admin",
    "Admin",
  ]),
  ...Array.from({ length: 20 }, (_, i) => [
    `v${i + 31}`,
    `v${8 + (i % 8)}`,
    names[i + 30] || "Associate",
    "Deployment Associate",
  ]),
];

export const vendors = vendorSeed.map(([id, parentId, name, role], i) => ({
  id,
  parentId,
  name,
  role,
  email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@fleetops.in`,
  phone: `+91 9${String(100000000 + i * 7919).slice(-9)}`,
  city: cities[i % cities.length] || "Pune",
  state: ["Karnataka", "Telangana", "Maharashtra", "Gujarat"][i % 4] || "Maharashtra",
  status: i % 13 === 0 && i > 0 ? "inactive" : "active",
  avatar: avatar(name),
  subVendors: vendorSeed.filter((v) => v[1] === id).length,
  drivers: (i * 7) % 19 + 3,
  vehicles: (i * 5) % 16 + 2,
}));

const models = [
  "Maruti Dzire",
  "Toyota Innova Crysta",
  "Tata Nexon EV",
  "Hyundai Aura",
  "Mahindra Marazzo",
  "Maruti Ertiga",
];

export const vehicles = Array.from({ length: 30 }, (_, i) => {
  const docs = i % 9 === 0 ? "Expired" : i % 7 === 0 ? "Pending" : "Verified";
  const stateCode = ["KA", "TS", "MH", "GJ"][i % 4];
  const rtoCode = String(10 + (i % 30)).padStart(2, "0");
  const series = String.fromCharCode(65 + (i % 20)) + "B";
  const num = String(1200 + i * 137).slice(-4);
  const regNo = `${stateCode} ${rtoCode} ${series} ${num}`;

  return {
    id: `veh-${i + 1}`,
    regNo,
    model: models[i % models.length],
    type: i % 6 === 1 ? "SUV" : i % 6 === 4 ? "Tempo Traveller" : i % 3 === 0 ? "Hatchback" : "Sedan",
    seating: i % 6 === 4 ? 12 : i % 6 === 1 ? 7 : 5,
    fuel: i % 5 === 0 ? "Electric" : i % 4 === 0 ? "CNG" : i % 3 === 0 ? "Petrol" : "Diesel",
    assignedDriver: i < 24 ? names[i + 4] || null : null,
    docsStatus: docs,
    status: docs === "Expired" ? "Compliance Issue" : i % 11 === 0 ? "Inactive" : "Active",
    vendorId: `v${8 + (i % 8)}`,
  };
});

export const drivers = Array.from({ length: 40 }, (_, i) => {
  const expired = i % 8 === 0;
  const pending = i % 7 === 0;
  const docStatus = expired ? "Expired" : pending ? "Pending" : "Verified";
  const name = names[i + 3] || `Driver ${i + 1}`;

  return {
    id: `drv-${i + 1}`,
    name,
    phone: `+91 98${String(10000000 + i * 3571).slice(-8)}`,
    email: `driver${i + 1}@fleetops.in`,
    licenseNo: `MH14 20${12 + (i % 13)}${String(1000000 + i * 433).slice(-7)}`,
    experience: 1 + (i % 18),
    avatar: avatar(name),
    assignedVehicle: i < 24 ? vehicles[i]?.regNo || null : null,
    docStatus,
    available: i % 3 !== 0 && !expired,
    vendorId: `v${8 + (i % 8)}`,
    documents: [
      {
        type: "Driving Licence",
        expiry: expired ? "2026-06-10" : `202${7 + (i % 3)}-12-31`,
        status: expired ? "Expired" : "Verified",
      },
      {
        type: "Police Verification",
        expiry: "2027-09-30",
        status: pending ? "Pending" : "Verified",
      },
    ],
  };
});

const docNames = [
  "Driving Licence",
  "Vehicle Registration Certificate (RC)",
  "Insurance Certificate",
  "Pollution Under Control (PUC)",
  "Commercial Permit",
];

export const documents = Array.from({ length: 50 }, (_, i) => ({
  id: `doc-${i + 1}`,
  name: docNames[i % 5],
  entityType: i % 2 === 0 ? "Driver" : "Vehicle",
  entityName: i % 2 === 0 ? drivers[i % 40]?.name || "Driver" : vehicles[i % 30]?.regNo || "Vehicle",
  uploader: names[(i + 9) % names.length],
  vendorId: `v${8 + (i % 8)}`,
  submittedAt: `2026-09-${String(1 + (i % 22)).padStart(2, "0")}`,
  expiry: i % 10 === 0 ? "2026-08-10" : "2027-12-31",
  status: i < 18 ? "Pending" : i < 38 ? "Verified" : i < 45 ? "Rejected" : "Expired",
  rejectionReason: i >= 38 && i < 45 ? "Document image blur / incomplete details" : null,
}));

export const delegations = Array.from({ length: 8 }, (_, i) => ({
  id: `del-${i + 1}`,
  vendorId: `v${8 + i}`,
  permissions: {
    fleet: i % 2 === 0,
    drivers: true,
    payments: i % 3 === 0,
    compliance: i % 2 !== 0,
  },
  active: i < 5,
  expiry: `2026-${String(10 + (i % 3)).padStart(2, "0")}-28`,
}));

export const auditLog = Array.from({ length: 12 }, (_, i) => ({
  id: `audit-${i + 1}`,
  at: `2026-09-${String(22 - i).padStart(2, "0")} ${String(10 + (i % 8)).padStart(2, "0")}:20`,
  actor: i % 3 === 0 ? "Teja Neeradi (Super Vendor)" : "System Admin",
  action: i % 4 === 0 ? "Delegation revoked" : i % 3 === 0 ? "Permission updated" : "Delegation granted",
  detail: `Authority policy updated for ${vendors[7 + (i % 8)]?.name || "Sub-vendor"}`,
}));

export const activities = Array.from({ length: 20 }, (_, i) => ({
  id: `act-${i + 1}`,
  at: `${i + 1}h ago`,
  type: i % 4 === 0 ? "driver" : i % 4 === 1 ? "vehicle" : i % 4 === 2 ? "document" : "vendor",
  title: i % 4 === 0 ? "New driver onboarded" : i % 4 === 1 ? "Vehicle status active" : i % 4 === 2 ? "Document verified" : "Sub-vendor created",
  detail: `${names[(i + 4) % names.length]} · Operational update`,
}));

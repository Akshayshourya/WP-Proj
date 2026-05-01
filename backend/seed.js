const mongoose = require('mongoose');
const Company = require('./models/Company');

const createDefaultRounds = () => [
  { roundName: 'Coding', status: 'Pending', marks: 0 },
  { roundName: 'Technical', status: 'Pending', marks: 0 },
  { roundName: 'HR', status: 'Pending', marks: 0 }
];

const companiesData = [
  {
    name: "TechNova Solutions",
    minCGPA: 7.5,
    allowedBranches: ["CSE", "CCE", "ECE"],
    applicants: [
      { name: "Alice Smith", roll: "CS001", cgpa: 8.2, branch: "CSE", interests: "Web Dev", rounds: createDefaultRounds() },
      { name: "Bob Jones", roll: "EC012", cgpa: 7.1, branch: "ECE", interests: "IoT", rounds: createDefaultRounds() },
      { name: "Charlie Brown", roll: "ME045", cgpa: 8.5, branch: "MECH", interests: "Robotics", rounds: createDefaultRounds() },
      { name: "Diana Prince", roll: "CC023", cgpa: 7.8, branch: "CCE", interests: "AI", rounds: createDefaultRounds() }
    ]
  },
  {
    name: "BuildCore Inc",
    minCGPA: 6.0,
    allowedBranches: ["MECH", "CIVIL"],
    applicants: [
      { name: "Evan Wright", roll: "ME010", cgpa: 6.5, branch: "MECH", interests: "Design", rounds: createDefaultRounds() },
      { name: "Fiona Gallagher", roll: "CS055", cgpa: 9.0, branch: "CSE", interests: "Backend", rounds: createDefaultRounds() },
      { name: "George Miller", roll: "CV011", cgpa: 5.8, branch: "CIVIL", interests: "Structural", rounds: createDefaultRounds() }
    ]
  },
  {
    name: "Innovate AI",
    minCGPA: 8.0,
    allowedBranches: ["CSE", "CCE"],
    applicants: [
      { name: "Hannah Lee", roll: "CC099", cgpa: 8.8, branch: "CCE", interests: "Machine Learning", rounds: createDefaultRounds() },
      { name: "Ian Somerhalder", roll: "CS102", cgpa: 7.9, branch: "CSE", interests: "Data Science", rounds: createDefaultRounds() },
      { name: "Jack Black", roll: "ME111", cgpa: 8.1, branch: "MECH", interests: "Mechatronics", rounds: createDefaultRounds() }
    ]
  }
];

mongoose.connect('mongodb://127.0.0.1:27017/placement-cell')
  .then(async () => {
    console.log('Connected to MongoDB for seeding');
    
    // Clear existing data
    await Company.deleteMany({});
    console.log('Cleared existing companies');

    // Insert seed data
    await Company.insertMany(companiesData);
    console.log('Database seeded successfully');

    mongoose.connection.close();
  }).catch((error) => {
    console.error('Seed error:', error);
  });

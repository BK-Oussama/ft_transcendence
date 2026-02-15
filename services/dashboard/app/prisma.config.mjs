import 'dotenv/config'; // Add this line at the top

export default {
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
import { PrismaClient } from "@prisma/client";

let prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query"
    },
    "info",
    "warn",
    "error"
  ]
});

// prisma.$on('query', (e) => {
//   console.log('Query: ' + e.query)
//   console.log('Params: ' + e.params)
//   console.log('Duration: ' + e.duration + 'ms')
// })

export default prisma;
